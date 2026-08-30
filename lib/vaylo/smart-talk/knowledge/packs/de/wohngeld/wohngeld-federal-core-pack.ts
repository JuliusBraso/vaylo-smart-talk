/**
 * KNOWLEDGE-EXPANSION — German federal Wohngeld process-complete core.
 * Official-source G3 CuratedDomainPack for domain wohngeld (new taxonomy).
 * Canonical language is German only. Not a runtime route.
 *
 * This pack is the WoGG lifecycle. It does not replace housing_orientation
 * and does not duplicate Grundsicherungsgeld, Arbeitslosengeld, Aufenthalt,
 * Anmeldung or Einkommensteuer.
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

export const WOG_DOMAIN = "wohngeld" as const;
export const WOG_PACK_ID = WOG_DOMAIN;
export const WOG_CANONICAL_LANGUAGE = "de" as const;

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

export type WogUnitCategory =
  | "orientation"
  | "eligibility"
  | "zuschussart"
  | "household"
  | "exclusion"
  | "status"
  | "rent"
  | "burden"
  | "income"
  | "calculation"
  | "application"
  | "evidence"
  | "processing"
  | "preliminary"
  | "bescheid"
  | "payment"
  | "change"
  | "move"
  | "continuation"
  | "recovery"
  | "sanction"
  | "legal_remedy"
  | "competence"
  | "cross_border"
  | "boundary";

export type WogContextKey =
  | "EVENT_DATE"
  | "PROCESS_VARIANT"
  | "BUNDESLAND"
  | "MUNICIPALITY"
  | "RESIDENCE_STATE"
  | "COUNTRY"
  | "MAIN_OR_SECONDARY_RESIDENCE";
export type WogHandlingMode =
  | "STORE_CANONICALLY"
  | "CACHE_AND_REVALIDATE"
  | "FETCH_LIVE"
  | "DO_NOT_ANSWER_WITHOUT_CONTEXT";
export type WogFreshnessClass = "LEGAL_CHANGE_MONITORED" | "MONTHLY" | "EVENT_DRIVEN";
export type WogStaleBehavior = "DO_NOT_USE_STALE" | "REVALIDATE_BEFORE_USE";
export type WogInformationClass =
  | "LEGAL_BASELINE"
  | "PROCESS_IDENTITY"
  | "AUTHORITY_COMPETENCE"
  | "ELIGIBILITY"
  | "DEADLINE"
  | "REQUIRED_EVIDENCE"
  | "FORM_URL"
  | "ONLINE_SERVICE_URL"
  | "SANCTION";
export type WogProcessRole =
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
export type WogScenarioCoverage =
  | "COVERED"
  | "EXPLICITLY_OUT_OF_SCOPE"
  | "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE";

export const WOG_G3_PROCESS_STEP_LIMITATION =
  "G3 CuratedDomainPack and knowledge_ingest_curated_domain_pack persist processes and process_claim_links with process_step_id null; knowledge_process_steps are not ingestible without a later factory extension.";

export type WogTemporalClass = "current_2026";

export type WogFutureChangeWatchItem = Readonly<{
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
  publisherKey: "bmj" | "bmwsb" | "bundesportal";
  authorityKey: "bmwsb" | "bmj" | "bundesportal";
  url: string;
  officialDomain: string;
  title: string;
  sourceClass: "FEDERAL_LAW" | "FEDERAL_REGULATION" | "FEDERAL_ADMINISTRATIVE_GUIDANCE" | "FEDERAL_SERVICE_PORTAL";
  sourceType: "federal_statute" | "federal_guidance" | "authority_portal";
  retrievalMethod: "HTML_DOCUMENT";
  informationClass: WogInformationClass;
  handlingMode: WogHandlingMode;
  freshnessClass: WogFreshnessClass;
  staleBehavior: WogStaleBehavior;
  requiredContextKeys: readonly WogContextKey[];
  passages: readonly Readonly<{ key: string; locator: string; text: string }>[];
}>;

type UnitSpec = Readonly<{
  key: string;
  category: WogUnitCategory;
  temporal: WogTemporalClass;
  type: "duty" | "deadline" | "definition" | "procedure" | "exception";
  text: string;
  sourceKey: string;
  passageKey: string;
  riskLevel: "low" | "medium" | "high";
  requiresEffectiveDate?: true;
  requiresAuthorityResolution?: true;
  requiredContextKeys?: readonly WogContextKey[];
}>;

type WogProcessSpec = Readonly<{
  key: string;
  title: string;
  trigger: string;
  safeFirstStep: string;
  riskLevel: "low" | "medium" | "high";
}>;

type WogFormSpec = Readonly<{
  key: string;
  name: string;
  identifier: string;
  purpose: string;
  submissionChannels: readonly string[];
  sourceKey: string;
  passageKey: string;
}>;

type WogBindingSpec = Readonly<{
  processKey: string;
  role: WogProcessRole;
  sequenceContext: string;
  claimKeys: readonly string[];
  required?: boolean;
  qualificationRequired?: boolean;
}>;

type WogProcessScenario = Readonly<{
  id: string;
  label: string;
  coverage: WogScenarioCoverage;
  requiredClaimKeys: readonly string[];
  requiredProcessKeys: readonly string[];
  requiredFormIdentifiers?: readonly string[];
  note?: string;
}>;

export const WOG_FUTURE_WATCH_SOURCE = Object.freeze({
  url: "https://www.bmwsb.bund.de/DE/wohnen/wohngeld/wohngeldrechner/wohngeldrechner-2025_artikel.html",
  officialDomain: "www.bmwsb.bund.de",
  title: "BMWSB Wohngeld-Plus-Rechner ab 1. Januar 2025",
});

export const WOG_FUTURE_CHANGE_WATCH_ITEMS: readonly WogFutureChangeWatchItem[] = Object.freeze([
  {
    id: "wog-future-watch-2027-reform",
    key: "future-2027-wohngeld-reform",
    officialSourceUrl: WOG_FUTURE_WATCH_SOURCE.url,
    officialDomain: WOG_FUTURE_WATCH_SOURCE.officialDomain,
    officialSourceTitle: WOG_FUTURE_WATCH_SOURCE.title,
    targetYear: 2027,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "Geplante Neuregelung des Wohngeldanspruchs zum 1. Januar 2027; parlamentarische Änderung zurzeit nicht als geltendes Recht ingestierbar.",
  },
  {
    id: "wog-future-watch-fortschreibung",
    key: "future-fortschreibung-anlagen",
    officialSourceUrl: "https://www.gesetze-im-internet.de/wogg/__43.html",
    officialDomain: "www.gesetze-im-internet.de",
    officialSourceTitle: "WoGG § 43 Fortschreibung des Wohngeldes",
    targetYear: 2027,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "Künftige Fortschreibung von Höchstbeträgen, Mietenstufen und Formelwerten nach § 43 WoGG ist nicht als heutige Wahrheit ingestierbar.",
  },
  {
    id: "wog-future-watch-hoechstbetraege",
    key: "future-hoechstbetraege-anlage1",
    officialSourceUrl: "https://www.gesetze-im-internet.de/wogg/__12.html",
    officialDomain: "www.gesetze-im-internet.de",
    officialSourceTitle: "WoGG § 12 Höchstbeträge Heizkosten Klimakomponente",
    targetYear: 2027,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "Künftige Eurotabellen der Höchstbeträge, Heizkostenentlastung und Klimakomponente dürfen nicht als zeitlose aktuelle Werte gespeichert werden.",
  },
  {
    id: "wog-future-watch-mietenstufen",
    key: "future-mietenstufen-wogv",
    officialSourceUrl: "https://www.gesetze-im-internet.de/wogv/__1.html",
    officialDomain: "www.gesetze-im-internet.de",
    officialSourceTitle: "WoGV § 1 Anwendungsbereich",
    targetYear: 2027,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "Künftige Mietenstufenzuordnung der Gemeinden in der WoGV-Anlage ist nicht als heutige bundesweite Ortswahrheit ingestierbar.",
  },
]);

export const WOG_OFFICIAL_SOURCES: readonly OfficialSourceSpec[] = Object.freeze([
  { key: "wogg-1", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogg/__1.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGG § 1 Zweck des Wohngeldes", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "wogg-1-all", locator: "§ 1", text: "Das Wohngeld dient der wirtschaftlichen Sicherung angemessenen und familiengerechten Wohnens. Es wird als Zuschuss zur Miete (Mietzuschuss) oder zur Belastung (Lastenzuschuss) für den selbst genutzten Wohnraum geleistet." }] },
  { key: "wogg-2", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogg/__2.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGG § 2 Wohnraum", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "wogg-2-all", locator: "§ 2", text: "Wohnraum sind Räume, die vom Verfügungsberechtigten zum Wohnen bestimmt und hierfür nach ihrer baulichen Anlage und Ausstattung tatsächlich geeignet sind." }] },
  { key: "wogg-3", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogg/__3.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGG § 3 Wohngeldberechtigung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "ELIGIBILITY", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "wogg-3-all", locator: "§ 3", text: "Wohngeldberechtigt für den Mietzuschuss ist, wer Wohnraum gemietet hat und selbst nutzt, einschließlich mietähnlicher Nutzung, Wohnen im eigenen Haus mit mehr als zwei Wohnungen und Heimaufnahme. Für den Lastenzuschuss ist wohngeldberechtigt, wer Eigentum an selbst genutztem Wohnraum hat oder erbbauberechtigt, dauerwohnberechtigt, wohnungsberechtigt, nießbrauchsberechtigt oder übertragungsberechtigt ist. Mehrere berechtigte Haushaltsmitglieder bestimmen eine wohngeldberechtigte Person. Ausländische Personen sind nur bei tatsächlichem Aufenthalt und einer der gesetzlich genannten Aufenthaltslagen wohngeldberechtigt; bestimmte Such- und Praktikumstitel sind in der Regel ausgeschlossen." }] },
  { key: "wogg-4", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogg/__4.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGG § 4 Berechnungsgrößen", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "wogg-4-all", locator: "§ 4", text: "Das Wohngeld richtet sich nach der Anzahl der zu berücksichtigenden Haushaltsmitglieder, der zu berücksichtigenden Miete oder Belastung und dem Gesamteinkommen und ist nach § 19 zu berechnen." }] },
  { key: "wogg-5", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogg/__5.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGG § 5 Haushaltsmitglieder", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "ELIGIBILITY", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "wogg-5-all", locator: "§ 5", text: "Haushaltsmitglied ist die wohngeldberechtigte Person, wenn der Wohnraum Mittelpunkt ihrer Lebensbeziehungen ist, sowie Ehegatten, Lebenspartner, Verantwortungsgemeinschaften, bestimmte Verwandte, Pflegekinder und Pflegeeltern, die denselben Wohnraum gemeinsam bewohnen und dort ihren Mittelpunkt haben. Getrennt lebende Eltern können ein Kind bei beiden Elternteilen als Haushaltsmitglied haben, wenn die Betreuung annähernd gleich oder mindestens ein Drittel zu zwei Dritteln geteilt ist." }] },
  { key: "wogg-6", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogg/__6.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGG § 6 Zu berücksichtigende Haushaltsmitglieder", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "ELIGIBILITY", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "wogg-6-all", locator: "§ 6", text: "Bei der Berechnung sind vorbehaltlich der Ausschlüsse sämtliche Haushaltsmitglieder zu berücksichtigen. Stirbt ein zu berücksichtigendes Haushaltsmitglied, bleibt die bisherige Anzahl zwölf Monate nach dem Sterbemonat maßgebend, sofern die Wohnung nicht aufgegeben wird und kein Unterkunftskostenanteil in einer Ausschlussleistung berücksichtigt wird." }] },
  { key: "wogg-7", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogg/__7.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGG § 7 Ausschluss vom Wohngeld", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "ELIGIBILITY", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "wogg-7-all", locator: "§ 7", text: "Vom Wohngeld ausgeschlossen sind Empfängerinnen und Empfänger von Grundsicherungsgeld, bestimmten SGB-II-Ausbildungszuschüssen, Verletztengeld in Grundsicherungshöhe, Grundsicherung im Alter, Hilfe zum Lebensunterhalt, bestimmten SGB-XIV-Leistungen, Asylbewerberleistungen oder ausschließlich SGB-VIII-Leistungen, wenn bei deren Berechnung Kosten der Unterkunft berücksichtigt worden sind. Der Ausschluss gilt nicht bei ausschließlich darlehensweiser Leistung oder wenn Wohngeld Hilfebedürftigkeit vermeiden oder beseitigen kann und die Transferleistung noch nicht erbracht oder nachrangig erbracht wird." }] },
  { key: "wogg-8", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogg/__8.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGG § 8 Dauer des Ausschlusses", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "ELIGIBILITY", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "wogg-8-all", locator: "§ 8", text: "Der Ausschluss besteht für die Dauer des Verwaltungsverfahrens über die Transferleistung und nach Bewilligung für den bewilligten Zeitraum. Er gilt als nicht erfolgt, wenn der Transferantrag zurückgenommen, die Leistung abgelehnt, versagt, entzogen oder nur als Darlehen gewährt wird oder der Anspruch nachträglich entfällt. Ein Verzicht auf die Transferleistung, um Wohngeld zu beantragen, lässt den Ausschluss ab Wirkung des Verzichts als nicht erfolgt gelten." }] },
  { key: "wogg-9", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogg/__9.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGG § 9 Miete", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "wogg-9-all", locator: "§ 9", text: "Miete ist das vereinbarte Entgelt für die Gebrauchsüberlassung einschließlich Umlagen, Zuschlägen und Vergütungen. Außer Betracht bleiben Heizkosten, Warmwasser, Haushaltsenergie, Garage oder Stellplatz sowie Leistungen über die Wohnraumüberlassung hinaus. Fehlen die Beträge in den Unterlagen, sind Pauschbeträge abzusetzen." }] },
  { key: "wogg-10", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogg/__10.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGG § 10 Belastung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "wogg-10-all", locator: "§ 10", text: "Belastung sind die Kosten für den Kapitaldienst und die Bewirtschaftung von Wohnraum. Die Wohngeldbehörde ermittelt sie in einer Wohngeld-Lastenberechnung. Von einer vollständigen Lastenberechnung kann abgesehen werden, wenn Zinsen und Tilgung bereits Höchstbetrag plus Klimakomponente erreichen oder übersteigen." }] },
  { key: "wogg-11", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogg/__11.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGG § 11 Zu berücksichtigende Miete und Belastung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "wogg-11-all", locator: "§ 11", text: "Die zu berücksichtigende Miete oder Belastung ist die nach §§ 9 oder 10 ermittelte Größe, begrenzt auf Höchstbetrag plus Klimakomponente, zuzüglich des Gesamtbetrags zur Entlastung bei den Heizkosten. Gewerbliche Nutzung, Überlassung an Nicht-Haushaltsmitglieder und öffentliche Wohnkostenentlastung bleiben anteilig außer Betracht. Bei ausgeschlossenen Haushaltsmitgliedern zählt nur der Anteil der zu berücksichtigenden Mitglieder." }] },
  { key: "wogg-12", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogg/__12.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGG § 12 Höchstbeträge Heizkosten Klimakomponente", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "CACHE_AND_REVALIDATE", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "REVALIDATE_BEFORE_USE", requiredContextKeys: ["MUNICIPALITY", "EVENT_DATE"], passages: [{ key: "wogg-12-all", locator: "§ 12", text: "Monatliche Höchstbeträge richten sich nach der Zahl der zu berücksichtigenden Haushaltsmitglieder und der Mietenstufe der Gemeinde und ergeben sich aus Anlage 1. Mietenstufen I bis VII folgen dem festgestellten Mietenniveau. Der Gesamtbetrag zur Entlastung bei den Heizkosten und die Klimakomponente sind gesetzliche Zuschläge nach Haushaltsmitgliederzahl; ihre Eurobeträge sind tabellarisch und zeitgebunden." }] },
  { key: "wogg-13", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogg/__13.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGG § 13 Gesamteinkommen", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "wogg-13-all", locator: "§ 13", text: "Das Gesamteinkommen ist die Summe der Jahreseinkommen der zu berücksichtigenden Haushaltsmitglieder abzüglich der Freibeträge und der Abzugsbeträge für Unterhaltsleistungen. Das monatliche Gesamteinkommen ist ein Zwölftel davon." }] },
  { key: "wogg-14", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogg/__14.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGG § 14 Jahreseinkommen", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "wogg-14-all", locator: "§ 14", text: "Das Jahreseinkommen ist die Summe der positiven Einkünfte im Sinne des Einkommensteuergesetzes zuzüglich bestimmter weiterer Einnahmen abzüglich der Abzugsbeträge für Steuern und Sozialversicherungsbeiträge. Ein Ausgleich mit negativen Einkünften ist unzulässig." }] },
  { key: "wogg-15", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogg/__15.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGG § 15 Ermittlung des Jahreseinkommens", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "wogg-15-all", locator: "§ 15", text: "Zugrunde liegt das im Bewilligungszeitraum zu erwartende Einkommen. Verhältnisse vor der Antragstellung können als Nachweis herangezogen werden. Einmaliges Einkommen wird dem bestimmten Zeitraum oder sonst zu einem Zwölftel in den zwölf Monaten nach Zufluss zugerechnet, wenn es innerhalb eines Jahres vor Antragstellung zugeflossen ist." }] },
  { key: "wogg-16", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogg/__16.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGG § 16 Abzugsbeträge", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "wogg-16-all", locator: "§ 16", text: "Vom Jahreseinkommen sind jeweils zehn Prozent abzuziehen, wenn im Bewilligungszeitraum Einkommensteuer, Pflichtbeiträge zur gesetzlichen Kranken- und Pflegeversicherung oder zur gesetzlichen Rentenversicherung zu erwarten sind. Entsprechendes gilt für laufende vergleichbare öffentliche oder private Vorsorgebeiträge, nicht aber bei im Wesentlichen beitragsfreier Sicherung durch Dritte." }] },
  { key: "wogg-17", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogg/__17.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGG § 17 Freibeträge", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "CACHE_AND_REVALIDATE", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "REVALIDATE_BEFORE_USE", requiredContextKeys: ["EVENT_DATE"], passages: [{ key: "wogg-17-all", locator: "§ 17", text: "Bei der Ermittlung des Gesamteinkommens sind gesetzliche jährliche Freibeträge abzuziehen, insbesondere für schwere Behinderung, NS-Verfolgte, Alleinerziehende mit Kindergeldkind und Erwerbseinkommen bestimmter Kinder. Die aktuellen Eurobeträge sind gesetzlich tabellarisch und zeitgebunden." }] },
  { key: "wogg-19", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogg/__19.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGG § 19 Höhe des Wohngeldes", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "wogg-19-all", locator: "§ 19", text: "Das ungerundete monatliche Wohngeld folgt der gesetzlichen Formel aus zu berücksichtigender Miete oder Belastung M, monatlichem Gesamteinkommen Y und den nach Haushaltsmitgliederzahl unterschiedenen Werten a, b und c der Anlage 2. Rechenschritte folgen Anlage 3. Ein individueller Betrag darf ohne vollständige aktuelle Tatsachen und verifizierte Parameter nicht genannt werden." }] },
  { key: "wogg-20", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogg/__20.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGG § 20 Gesetzeskonkurrenz", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "ELIGIBILITY", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "wogg-20-all", locator: "§ 20", text: "Kein Wohngeldanspruch besteht, wenn allen Haushaltsmitgliedern BAföG, bestimmte Berufsausbildungsbeihilfen nach dem SGB III oder die genannte Mobilitätsförderung dem Grunde nach zustehen oder zustünden. Das gilt auch, wenn dem Grunde nach Förderungsberechtigte der Höhe nach keinen Anspruch haben. Ausgenommen sind ausschließlich darlehensweise Leistungen. Beginnt die Ausbildung in einem bereits bewilligten Zeitraum, wird Wohngeld bis zum Ablauf weitergeleistet." }] },
  { key: "wogg-21", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogg/__21.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGG § 21 Sonstige Gründe", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "ELIGIBILITY", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "wogg-21-all", locator: "§ 21", text: "Ein Wohngeldanspruch besteht nicht, wenn das Wohngeld die gesetzliche monatliche Mindestgrenze nicht erreichen würde, wenn alle Haushaltsmitglieder ausgeschlossen sind oder soweit die Inanspruchnahme missbräuchlich wäre, insbesondere wegen erheblichen Vermögens." }] },
  { key: "wogg-22", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogg/__22.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGG § 22 Wohngeldantrag", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "PROCESS_IDENTITY", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "wogg-22-all", locator: "§ 22", text: "Wohngeld wird nur auf Antrag der wohngeldberechtigten Person geleistet. Bei mehreren Berechtigten gilt die antragstellende Person als bestimmt. Wird ein Antrag für die Zeit nach dem laufenden Bewilligungszeitraum früher als zwei Monate vor Ablauf gestellt, gilt der Erste des zweiten Monats vor Ablauf als Antragstellungszeitpunkt." }] },
  { key: "wogg-23", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogg/__23.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGG § 23 Auskunftspflicht", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "REQUIRED_EVIDENCE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "wogg-23-all", locator: "§ 23", text: "Haushaltsmitglieder, Mitbewohnende und auf Verlangen Arbeitgeber sowie Mietempfängerinnen und Mietempfänger müssen der Wohngeldbehörde die für das Wohngeld erheblichen Verhältnisse mitteilen. Die wohngeldberechtigte Person hat im Antrag alle erheblichen Tatsachen anzugeben. Die Mitwirkung nach SGB I gilt entsprechend." }] },
  { key: "wogg-24", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogg/__24.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGG § 24 Wohngeldbehörde und Entscheidung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "AUTHORITY_COMPETENCE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "wogg-24-all", locator: "§ 24", text: "Zuständig sind die nach Landesrecht bestimmten Stellen als Wohngeldbehörde. Die Entscheidung ergeht schriftlich auf der Grundlage der im Zeitpunkt der Antragstellung für den Bewilligungszeitraum zu erwartenden Verhältnisse. Der Bewilligungsbescheid muss bestimmte Beträge und Hinweise zu Mitteilungspflichten und Weiterleistung enthalten." }] },
  { key: "wogg-25", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogg/__25.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGG § 25 Bewilligungszeitraum", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "DEADLINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "wogg-25-all", locator: "§ 25", text: "Das Wohngeld soll für zwölf Monate bewilligt werden. Der Zeitraum kann verkürzt, geteilt oder bei voraussichtlich gleichbleibenden Verhältnissen auf bis zu 24 Monate verlängert werden. Er beginnt am Ersten des Antragsmonats, wenn die Voraussetzungen dann vorliegen, sonst am Ersten des späteren Monats. Nach Ablehnung einer Ausschlussleistung gelten besondere Frist- und Beginnvorschriften." }] },
  { key: "wogg-26", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogg/__26.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGG § 26 Zahlung des Wohngeldes", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "wogg-26-all", locator: "§ 26", text: "Wohngeld ist an die wohngeldberechtigte Person zu zahlen, kann aber mit Einwilligung oder wenn geboten an ein anderes Haushaltsmitglied, an die Mietempfängerin oder den Mietempfänger oder an einen Leistungsträger gezahlt werden. Es ist monatlich im Voraus auf ein Konto eines Haushaltsmitgliedes zu zahlen." }] },
  { key: "wogg-26a", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogg/__26a.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGG § 26a Vorläufige Zahlung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "PROCESS_IDENTITY", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "wogg-26a-all", locator: "§ 26a", text: "Eine vorläufige Zahlung kann erfolgen, wenn die Feststellung voraussichtlich längere Zeit erfordert und ein Anspruch hinreichend wahrscheinlich ist. Sie steht unter dem Vorbehalt der endgültigen Entscheidung und möglicher Rückforderung. Vorläufig gezahltes Wohngeld wird auf das endgültige angerechnet." }] },
  { key: "wogg-27", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogg/__27.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGG § 27 Änderung des Wohngeldes", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "wogg-27-all", locator: "§ 27", text: "Auf Antrag ist neu zu bewilligen, wenn sich die Zahl der zu berücksichtigenden Haushaltsmitglieder erhöht, die zu berücksichtigende Miete oder Belastung abzüglich Heizkostenentlastung um mehr als 10 Prozent erhöht oder das Gesamteinkommen um mehr als 10 Prozent verringert und sich das Wohngeld dadurch erhöht. Von Amts wegen ist neu zu entscheiden, wenn sich die Mitgliederzahl auf mindestens ein Mitglied verringert, die relevante Miete oder Belastung um mehr als 15 Prozent verringert oder das Gesamteinkommen um mehr als 15 Prozent erhöht und das Wohngeld wegfällt oder sinkt. Unverzüglich mitzuteilen sind nicht nur vorübergehende Verringerung der Mitgliederzahl oder Erhöhung Ausgeschlossener, Miet- oder Belastungssenkung um mehr als 15 Prozent und Einkommenssteigerung um mehr als 15 Prozent." }] },
  { key: "wogg-28", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogg/__28.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGG § 28 Unwirksamkeit und Wegfall", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "wogg-28-all", locator: "§ 28", text: "Der Bewilligungsbescheid wird unwirksam, sobald kein zu berücksichtigendes Haushaltsmitglied den Wohnraum mehr nutzt, vom Ersten des Monats oder sonst vom Ersten des nächsten Monats. Die Nutzungsaufgabe ist unverzüglich mitzuteilen. Der Bescheid wird auch unwirksam, sobald ein zu berücksichtigendes Mitglied nach §§ 7 und 8 ausgeschlossen ist. Ein begonnenes Transferverfahren oder der Empfang einer Ausschlussleistung ist unverzüglich mitzuteilen." }] },
  { key: "wogg-29", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogg/__29.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGG § 29 Haftung und Zahlungseinstellung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "wogg-29-all", locator: "§ 29", text: "Bei Erstattung nach SGB X haften neben der wohngeldberechtigten Person die volljährigen berücksichtigten Haushaltsmitglieder als Gesamtschuldner. Die Behörde kann die Zahlung vorläufig ganz oder teilweise ohne Bescheid einstellen, wenn Tatsachen die Rechtswidrigkeit oder eine Änderung nach § 27 Absatz 2 oder § 28 rechtfertigen. Soweit die Kenntnis nicht auf Angaben der berechtigten Person beruht, sind Einstellung und Gründe unverzüglich mitzuteilen und Gelegenheit zur Äußerung zu geben." }] },
  { key: "wogg-30a", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogg/__30a.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGG § 30a Bagatellgrenze", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "CACHE_AND_REVALIDATE", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "REVALIDATE_BEFORE_USE", requiredContextKeys: ["EVENT_DATE"], passages: [{ key: "wogg-30a-all", locator: "§ 30a", text: "§ 30a WoGG regelte eine Erprobung, nach Aufhebung oder Unwirksamkeit bis zu einer bestimmten Höhe von der Erstattung abzusehen. Die Erprobung dauerte bis zum 31. Dezember 2024. Eine zeitlose aktuelle Kleinbetragsregel darf daraus nicht abgeleitet werden." }] },
  { key: "wogg-33", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogg/__33.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGG § 33 Datenabgleich", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "wogg-33-all", locator: "§ 33", text: "Die Wohngeldbehörde führt gesetzlich geregelte Datenabgleiche durch, um unrichtige Inanspruchnahme aufzudecken. Ein Datenabgleich ist ein Verwaltungsvorgang und nicht automatisch ein Strafverfahren." }] },
  { key: "wogg-37", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogg/__37.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGG § 37 Bußgeld", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "SANCTION", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "wogg-37-all", locator: "§ 37", text: "Ordnungswidrig handelt, wer vorsätzlich oder leichtfertig Auskünfte nicht, nicht richtig, nicht vollständig oder nicht rechtzeitig gibt oder erhebliche Änderungen nicht, nicht richtig, nicht vollständig oder nicht rechtzeitig mitteilt. Die Ordnungswidrigkeit kann mit einer Geldbuße bis zu zweitausend Euro geahndet werden." }] },
  { key: "wogg-43", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogg/__43.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGG § 43 Fortschreibung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "CACHE_AND_REVALIDATE", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "REVALIDATE_BEFORE_USE", requiredContextKeys: ["EVENT_DATE"], passages: [{ key: "wogg-43-all", locator: "§ 43", text: "Berechnungsgrößen des Wohngeldes können gesetzlich fortgeschrieben und Anlagen ersetzt werden. Aktuelle Höchstbeträge, Mietenstufen und Formelwerte sind daher zeitgebunden zu prüfen und nicht als zeitlose Beträge zu behandeln." }] },
  { key: "wogv-1", publisherKey: "bmj", authorityKey: "bmwsb", url: "https://www.gesetze-im-internet.de/wogv/__1.html", officialDomain: "www.gesetze-im-internet.de", title: "WoGV § 1 Anwendungsbereich", sourceClass: "FEDERAL_REGULATION", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "CACHE_AND_REVALIDATE", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "REVALIDATE_BEFORE_USE", requiredContextKeys: ["MUNICIPALITY"], passages: [{ key: "wogv-1-all", locator: "§ 1", text: "Miete und Mietwert werden nach Teil 2 der Wohngeldverordnung ermittelt. Die Belastung wird nach Teil 3 berechnet, soweit nicht von einer vollständigen Lastenberechnung abgesehen werden kann. Die Mietenstufen der Gemeinden ergeben sich aus der Anlage zur Verordnung." }] },
  { key: "bmwsb-plus", publisherKey: "bmwsb", authorityKey: "bmwsb", url: "https://www.bmwsb.bund.de/DE/wohnen/wohngeld/wohngeld-plus/wohngeld-plus_artikel.html", officialDomain: "www.bmwsb.bund.de", title: "BMWSB Wohngeld-Plus", sourceClass: "FEDERAL_ADMINISTRATIVE_GUIDANCE", sourceType: "federal_guidance", retrievalMethod: "HTML_DOCUMENT", informationClass: "PROCESS_IDENTITY", handlingMode: "CACHE_AND_REVALIDATE", freshnessClass: "MONTHLY", staleBehavior: "REVALIDATE_BEFORE_USE", requiredContextKeys: [], passages: [{ key: "bmwsb-plus-all", locator: "Wohngeld-Plus", text: "Wohngeld ist ein Zuschuss zur Miete für Mietende oder zur Belastung für selbstnutzende Eigentümerinnen und Eigentümer. Es wird nur auf Antrag bei der örtlich zuständigen Wohngeldbehörde der Gemeinde-, Stadt-, Amts- oder Kreisverwaltung geleistet. Viele Länder bieten Onlineanträge an. Die zuständige Stelle ist unter verwaltung.bund.de zu suchen. Der amtliche Rechner dient nur der Orientierung." }] },
  { key: "bmwsb-faq", publisherKey: "bmwsb", authorityKey: "bmwsb", url: "https://www.bmwsb.bund.de/SharedDocs/faqs/DE/wohnen/wohngeld/wohngeld-faq-liste.html", officialDomain: "www.bmwsb.bund.de", title: "BMWSB Fragen und Antworten zum Wohngeld-Plus", sourceClass: "FEDERAL_ADMINISTRATIVE_GUIDANCE", sourceType: "federal_guidance", retrievalMethod: "HTML_DOCUMENT", informationClass: "REQUIRED_EVIDENCE", handlingMode: "CACHE_AND_REVALIDATE", freshnessClass: "MONTHLY", staleBehavior: "REVALIDATE_BEFORE_USE", requiredContextKeys: [], passages: [{ key: "bmwsb-faq-all", locator: "FAQ", text: "Antragsformulare erhält man bei der örtlichen Wohngeldbehörde; sie stehen zudem online zur Verfügung. Typische Unterlagen sind Wohnkostennachweis und Einkommensnachweis. Eine rechtsverbindliche Auskunft gibt nur die zuständige Behörde. Bei langer Bearbeitung kann ein Antrag auf vorläufige Zahlung nach § 26a WoGG gestellt werden. Besteht Anspruch, wird Wohngeld regelmäßig ab dem Antragsmonat gezahlt." }] },
  { key: "bundesportal", publisherKey: "bundesportal", authorityKey: "bundesportal", url: "https://verwaltung.bund.de/portal/", officialDomain: "verwaltung.bund.de", title: "Bundesportal Verwaltungssuche", sourceClass: "FEDERAL_SERVICE_PORTAL", sourceType: "authority_portal", retrievalMethod: "HTML_DOCUMENT", informationClass: "AUTHORITY_COMPETENCE", handlingMode: "FETCH_LIVE", freshnessClass: "EVENT_DRIVEN", staleBehavior: "REVALIDATE_BEFORE_USE", requiredContextKeys: ["MUNICIPALITY"], passages: [{ key: "bundesportal-all", locator: "Portal", text: "Die örtlich zuständige Wohngeldbehörde und verfügbare Onlinewege sind über das Bundesportal anhand des Wohnorts zu ermitteln. Sprache, Staatsangehörigkeit oder allein das Land ersetzen die lokale Zuständigkeitssuche nicht." }] },
]);

export const WOG_UNITS: readonly UnitSpec[] = Object.freeze([
  { key: "wohngeld-purpose", category: "orientation", temporal: "current_2026", type: "definition", text: "Wohngeld dient der wirtschaftlichen Sicherung angemessenen und familiengerechten Wohnens. Es ist ein Zuschuss und keine vollständige Übernahme jeder Wohnkostenrechnung.", sourceKey: "wogg-1", passageKey: "wogg-1-all", riskLevel: "low" },
  { key: "mietzuschuss-vs-lastenzuschuss", category: "zuschussart", temporal: "current_2026", type: "definition", text: "Wohngeld wird als Mietzuschuss zur Miete oder als Lastenzuschuss zur Belastung für selbst genutzten Wohnraum geleistet.", sourceKey: "wogg-1", passageKey: "wogg-1-all", riskLevel: "medium" },
  { key: "self-used-wohnraum", category: "eligibility", temporal: "current_2026", type: "definition", text: "Maßgeblich ist selbst genutzter Wohnraum. Eine bloße Eigentumsposition ohne Selbstnutzung begründet keinen Lastenzuschuss.", sourceKey: "wogg-1", passageKey: "wogg-1-all", riskLevel: "high" },
  { key: "wohnraum-definition", category: "orientation", temporal: "current_2026", type: "definition", text: "Wohnraum sind Räume, die zum Wohnen bestimmt und baulich sowie ausstattungsmäßig tatsächlich geeignet sind.", sourceKey: "wogg-2", passageKey: "wogg-2-all", riskLevel: "low" },
  { key: "wohngeld-not-only-tenants", category: "zuschussart", temporal: "current_2026", type: "exception", text: "Wohngeld ist nicht nur für Mietende. Selbstnutzende Eigentümerinnen und Eigentümer können Lastenzuschuss erhalten.", sourceKey: "wogg-1", passageKey: "wogg-1-all", riskLevel: "high" },
  { key: "tenant-not-automatic-eligible", category: "eligibility", temporal: "current_2026", type: "exception", text: "Mietstatus allein bedeutet nicht automatisch Wohngeldberechtigung. Haushalt, Einkommen, relevante Miete und Ausschlüsse müssen geprüft werden.", sourceKey: "wogg-4", passageKey: "wogg-4-all", riskLevel: "high" },
  { key: "owner-not-automatic-excluded", category: "zuschussart", temporal: "current_2026", type: "exception", text: "Eigentum schließt Wohngeld nicht automatisch aus. Für selbst genutzten Wohnraum kommt Lastenzuschuss in Betracht.", sourceKey: "wogg-3", passageKey: "wogg-3-all", riskLevel: "high" },
  { key: "owner-not-automatic-lastenzuschuss", category: "zuschussart", temporal: "current_2026", type: "exception", text: "Eigentum bedeutet nicht automatisch Lastenzuschuss. Erforderlich sind Selbstnutzung und eine wohngeldrechtlich relevante Belastung.", sourceKey: "wogg-3", passageKey: "wogg-3-all", riskLevel: "high" },
  { key: "tenant-not-lastenzuschuss", category: "zuschussart", temporal: "current_2026", type: "exception", text: "Wer Wohnraum gemietet hat und selbst nutzt, ist für den Mietzuschuss, nicht automatisch für den Lastenzuschuss, wohngeldberechtigt.", sourceKey: "wogg-3", passageKey: "wogg-3-all", riskLevel: "high" },
  { key: "investment-property-not-lastenzuschuss", category: "zuschussart", temporal: "current_2026", type: "exception", text: "Eine vermietete oder nur als Kapitalanlage gehaltene Immobilie ist nicht automatisch lastenzuschussfähiger selbst genutzter Wohnraum.", sourceKey: "wogg-3", passageKey: "wogg-3-all", riskLevel: "high" },
  { key: "low-income-not-automatic", category: "eligibility", temporal: "current_2026", type: "exception", text: "Niedriges Einkommen bedeutet nicht automatisch Wohngeldberechtigung. Maßgeblich sind alle Berechnungsgrößen und Ausschlüsse.", sourceKey: "wogg-4", passageKey: "wogg-4-all", riskLevel: "high" },
  { key: "high-rent-not-automatic", category: "eligibility", temporal: "current_2026", type: "exception", text: "Hohe Miete bedeutet nicht automatisch Wohngeld. Die zu berücksichtigende Miete ist begrenzt und vom Einkommen sowie Haushalt abhängig.", sourceKey: "wogg-11", passageKey: "wogg-11-all", riskLevel: "high" },
  { key: "working-not-excluded", category: "eligibility", temporal: "current_2026", type: "exception", text: "Erwerbstätigkeit schließt Wohngeld nicht aus. Arbeitseinkommen fließt in das wohngeldrechtliche Gesamteinkommen ein.", sourceKey: "wogg-13", passageKey: "wogg-13-all", riskLevel: "high" },
  { key: "unemployed-not-automatic", category: "eligibility", temporal: "current_2026", type: "exception", text: "Arbeitslosigkeit bedeutet nicht automatisch Wohngeld. Ausschlüsse, Einkommen und Wohnkosten müssen gesondert geprüft werden.", sourceKey: "wogg-7", passageKey: "wogg-7-all", riskLevel: "high" },
  { key: "application-required", category: "application", temporal: "current_2026", type: "duty", text: "Wohngeld wird nur auf Antrag der wohngeldberechtigten Person geleistet. Bestehende Voraussetzungen allein lösen keine Zahlung aus.", sourceKey: "wogg-22", passageKey: "wogg-22-all", riskLevel: "high" },
  { key: "calculator-not-bescheid", category: "calculation", temporal: "current_2026", type: "exception", text: "Der amtliche Wohngeldrechner und andere Schätzungen sind nur Orientierung. Sie sind nicht der bindende Wohngeldbescheid.", sourceKey: "bmwsb-plus", passageKey: "bmwsb-plus-all", riskLevel: "high" },
  { key: "housing-orientation-pack-separate", category: "boundary", temporal: "current_2026", type: "exception", text: "Allgemeine Wohnungs- und Anmeldungsthemen gehören nicht in dieses Wohngeldpaket. housing_orientation bleibt ein gesondertes Domain.", sourceKey: "wogg-1", passageKey: "wogg-1-all", riskLevel: "low" },
  { key: "jobcenter-pack-separate", category: "boundary", temporal: "current_2026", type: "exception", text: "Grundsicherungsgeld, Bedarfsgemeinschaft und Jobcenterverfahren gehören zum gesonderten Grundsicherungsgeldpaket. Hier zählt nur die Ausschlussschnittstelle.", sourceKey: "wogg-7", passageKey: "wogg-7-all", riskLevel: "medium" },
  { key: "alg-pack-separate", category: "boundary", temporal: "current_2026", type: "exception", text: "Arbeitslosengeldanspruch und Agenturzuständigkeit gehören zum gesonderten Arbeitslosengeldpaket. Arbeitslosengeld ist hier nur Einkommens- oder Schnittstellenlage.", sourceKey: "wogg-14", passageKey: "wogg-14-all", riskLevel: "medium" },
  { key: "est-pack-separate", category: "boundary", temporal: "current_2026", type: "exception", text: "Einkommensteuererklärung und Finanzamt gehören zum gesonderten Einkommensteuerpaket. Hier zählt Einkommensteuer nur als Abzugs- und Nachweisgrenze.", sourceKey: "wogg-16", passageKey: "wogg-16-all", riskLevel: "medium" },
  { key: "anmeld-pack-separate", category: "boundary", temporal: "current_2026", type: "exception", text: "Melderechtliche Anmeldung, Ummeldung und Abmeldung gehören zum gesonderten Anmeldungspaket. Die Anschrift allein ersetzt die Wohngeldprüfung nicht.", sourceKey: "wogg-5", passageKey: "wogg-5-all", riskLevel: "medium" },
  { key: "aufenthalt-pack-separate", category: "boundary", temporal: "current_2026", type: "exception", text: "Aufenthaltstitel, Duldung und Freizügigkeit gehören zum gesonderten Aufenthaltspaket. Hier wird nur die Wohngeld-Statusgrenze nach § 3 Absatz 5 geprüft.", sourceKey: "wogg-3", passageKey: "wogg-3-all", riskLevel: "medium" },
  { key: "kindergeld-pack-separate", category: "boundary", temporal: "current_2026", type: "exception", text: "Kindergeldanspruch und Familienkasse gehören zum gesonderten Kindergeldpaket. Kindergeld ist hier nur Haushalts- oder Einkommensschnittstelle.", sourceKey: "wogg-17", passageKey: "wogg-17-all", riskLevel: "medium" },
  { key: "health-pack-separate", category: "boundary", temporal: "current_2026", type: "exception", text: "Krankenversicherungsschutz wird in diesem Wohngeldpaket nicht verdoppelt. Beiträge können nur als gesetzlicher Abzugstatbestand erscheinen.", sourceKey: "wogg-16", passageKey: "wogg-16-all", riskLevel: "low" },
  { key: "mietzuschuss-who", category: "zuschussart", temporal: "current_2026", type: "definition", text: "Für den Mietzuschuss ist wohngeldberechtigt, wer Wohnraum gemietet hat und selbst nutzt, sowie bestimmte mietähnlich Nutzungsberechtigte, Bewohnende im eigenen Haus mit mehr als zwei Wohnungen und nicht nur vorübergehend Aufgenommene in einem Heim.", sourceKey: "wogg-3", passageKey: "wogg-3-all", riskLevel: "medium" },
  { key: "lastenzuschuss-who", category: "zuschussart", temporal: "current_2026", type: "definition", text: "Für den Lastenzuschuss ist wohngeldberechtigt, wer Eigentum an selbst genutztem Wohnraum hat oder erbbauberechtigt, dauerwohnberechtigt, wohnungsberechtigt, nießbrauchsberechtigt oder übertragungsberechtigt ist.", sourceKey: "wogg-3", passageKey: "wogg-3-all", riskLevel: "medium" },
  { key: "multiple-berechtigte-one", category: "eligibility", temporal: "current_2026", type: "procedure", text: "Erfüllen mehrere Haushaltsmitglieder die Voraussetzungen für denselben Wohnraum, ist nur eine Person wohngeldberechtigt. Diese Personen bestimmen die antragstellende Person.", sourceKey: "wogg-3", passageKey: "wogg-3-all", riskLevel: "medium" },
  { key: "excluded-can-apply-for-others", category: "exclusion", temporal: "current_2026", type: "exception", text: "Wer selbst nach §§ 7 und 8 ausgeschlossen ist, kann gleichwohl wohngeldberechtigt sein, wenn mindestens ein zu berücksichtigendes Haushaltsmitglied denselben Wohnraum bewohnt.", sourceKey: "wogg-3", passageKey: "wogg-3-all", riskLevel: "high" },
  { key: "zuschussart-needs-facts", category: "zuschussart", temporal: "current_2026", type: "exception", text: "Ob Mietzuschuss oder Lastenzuschuss einschlägig ist, darf ohne Nutzungsart, Rechtsposition am Wohnraum und Selbstnutzung nicht entschieden werden.", sourceKey: "wogg-3", passageKey: "wogg-3-all", riskLevel: "high", requiredContextKeys: ["PROCESS_VARIANT", "MAIN_OR_SECONDARY_RESIDENCE"] },
  { key: "foreign-actual-stay-plus-category", category: "status", temporal: "current_2026", type: "definition", text: "Ausländische Personen sind nur wohngeldberechtigt, wenn sie sich im Bundesgebiet tatsächlich aufhalten und eine der in § 3 Absatz 5 genannten Aufenthaltslagen vorliegt.", sourceKey: "wogg-3", passageKey: "wogg-3-all", riskLevel: "high" },
  { key: "freizueg-eu-category", category: "status", temporal: "current_2026", type: "definition", text: "Ein Aufenthaltsrecht nach dem Freizügigkeitsgesetz/EU ist eine der gesetzlich genannten Lagen für die Wohngeldberechtigung ausländischer Personen.", sourceKey: "wogg-3", passageKey: "wogg-3-all", riskLevel: "medium" },
  { key: "titel-or-duldung", category: "status", temporal: "current_2026", type: "definition", text: "Ein Aufenthaltstitel oder eine Duldung nach dem Aufenthaltsgesetz kann die Statusvoraussetzung erfüllen. Duldung ist nicht schon deshalb ausgeschlossen, weil sie kein Aufenthaltstitel ist.", sourceKey: "wogg-3", passageKey: "wogg-3-all", riskLevel: "high" },
  { key: "gestattung-category", category: "status", temporal: "current_2026", type: "definition", text: "Eine Aufenthaltsgestattung nach dem Asylgesetz ist eine der gesetzlich genannten Lagen. Sie ersetzt nicht die Prüfung von Ausschlussleistungen nach dem Asylbewerberleistungsgesetz.", sourceKey: "wogg-3", passageKey: "wogg-3-all", riskLevel: "high" },
  { key: "treaty-residence", category: "status", temporal: "current_2026", type: "definition", text: "Ein Aufenthaltsrecht nach einem völkerrechtlichen Abkommen oder die Rechtsstellung heimatloser Ausländerinnen und Ausländer kann die Statusvoraussetzung erfüllen.", sourceKey: "wogg-3", passageKey: "wogg-3-all", riskLevel: "medium" },
  { key: "title-exempt-verordnung", category: "status", temporal: "current_2026", type: "definition", text: "Wer durch Rechtsverordnung vom Erfordernis eines Aufenthaltstitels befreit ist, kann die Statusvoraussetzung erfüllen.", sourceKey: "wogg-3", passageKey: "wogg-3-all", riskLevel: "medium" },
  { key: "duldung-not-automatic-exclusion", category: "status", temporal: "current_2026", type: "exception", text: "Eine Duldung ist nicht automatisch Wohngeldausschluss nur weil sie kein Aufenthaltstitel ist. § 3 Absatz 5 nennt Titel oder Duldung ausdrücklich.", sourceKey: "wogg-3", passageKey: "wogg-3-all", riskLevel: "high" },
  { key: "foreign-nationality-not-exclusion", category: "status", temporal: "current_2026", type: "exception", text: "Ausländische Staatsangehörigkeit schließt Wohngeld nicht automatisch aus. Maßgeblich sind tatsächlicher Aufenthalt und die gesetzliche Aufenthaltslage.", sourceKey: "wogg-3", passageKey: "wogg-3-all", riskLevel: "high" },
  { key: "eu-citizen-not-automatic-approval", category: "status", temporal: "current_2026", type: "exception", text: "Unionsbürgerschaft bedeutet nicht automatisch bewilligtes Wohngeld. Freizügigkeit, Haushalt, Einkommen und Ausschlüsse bleiben zu prüfen.", sourceKey: "wogg-3", passageKey: "wogg-3-all", riskLevel: "high" },
  { key: "aufenthaltstitel-not-automatic", category: "status", temporal: "current_2026", type: "exception", text: "Ein Aufenthaltstitel bedeutet nicht automatisch Wohngeldberechtigung. Manche Such- und Praktikumstitel sind in der Regel ausgeschlossen, und die übrigen Tatbestände bleiben offen.", sourceKey: "wogg-3", passageKey: "wogg-3-all", riskLevel: "high" },
  { key: "search-titles-generally-excluded", category: "status", temporal: "current_2026", type: "definition", text: "In der Regel nicht wohngeldberechtigt sind ausländische Personen mit Titel zur Ausbildungs- oder Arbeitsplatzsuche, Chancenkarte, studienbezogenem Praktikum oder europäischem Freiwilligendienst.", sourceKey: "wogg-3", passageKey: "wogg-3-all", riskLevel: "high" },
  { key: "social-security-treaty-exclusion", category: "status", temporal: "current_2026", type: "definition", text: "Nicht wohngeldberechtigt sind ausländische Personen, die durch völkerrechtliche Vereinbarung von deutschen Vorschriften der sozialen Sicherheit befreit sind.", sourceKey: "wogg-3", passageKey: "wogg-3-all", riskLevel: "high" },
  { key: "anmeld-not-wohngeld-status", category: "status", temporal: "current_2026", type: "exception", text: "Die melderechtliche Anmeldung ist nicht die vollständige Wohngeld-Statusfeststellung nach § 3 Absatz 5.", sourceKey: "wogg-3", passageKey: "wogg-3-all", riskLevel: "high" },
  { key: "exact-status-required", category: "status", temporal: "current_2026", type: "exception", text: "Ohne genaue Aufenthaltslage, tatsächlichen Aufenthalt und etwaige Ausschlussleistung darf die ausländische Wohngeldberechtigung nicht entschieden werden.", sourceKey: "wogg-3", passageKey: "wogg-3-all", riskLevel: "high", requiredContextKeys: ["RESIDENCE_STATE", "PROCESS_VARIANT", "COUNTRY"] },
  { key: "hm-berechtigte-mittelpunkt", category: "household", temporal: "current_2026", type: "definition", text: "Haushaltsmitglied ist die wohngeldberechtigte Person, wenn der Wohnraum für das Wohngeld Mittelpunkt ihrer Lebensbeziehungen ist.", sourceKey: "wogg-5", passageKey: "wogg-5-all", riskLevel: "medium" },
  { key: "spouse-partner-not-separated", category: "household", temporal: "current_2026", type: "definition", text: "Ehegatten und Lebenspartnerinnen oder Lebenspartner sind Wohngeld-Haushaltsmitglieder, wenn sie nicht dauernd getrennt leben und denselben Wohnraum gemeinsam bewohnen.", sourceKey: "wogg-5", passageKey: "wogg-5-all", riskLevel: "medium" },
  { key: "responsibility-partnership", category: "household", temporal: "current_2026", type: "definition", text: "Wer so zusammenlebt, dass ein wechselseitiger Wille anzunehmen ist, Verantwortung füreinander zu tragen, kann Haushaltsmitglied sein. Die Vermutung knüpft an die Merkmale des § 7 Absatz 3a SGB II.", sourceKey: "wogg-5", passageKey: "wogg-5-all", riskLevel: "high" },
  { key: "relatives-shared", category: "household", temporal: "current_2026", type: "definition", text: "Verwandte in gerader Linie oder im zweiten oder dritten Grad der Seitenlinie sowie Verschwägerte können Haushaltsmitglieder sein, wenn sie denselben Wohnraum mit Mittelpunkt der Lebensbeziehungen teilen.", sourceKey: "wogg-5", passageKey: "wogg-5-all", riskLevel: "medium" },
  { key: "pflege-members", category: "household", temporal: "current_2026", type: "definition", text: "Pflegekinder ohne Altersgrenze und Pflegeeltern können Haushaltsmitglieder sein, wenn sie denselben Wohnraum als Mittelpunkt teilen.", sourceKey: "wogg-5", passageKey: "wogg-5-all", riskLevel: "medium" },
  { key: "same-address-not-automatically-household", category: "household", temporal: "current_2026", type: "exception", text: "Dieselbe Anschrift bedeutet nicht automatisch denselben Wohngeldhaushalt. Maßgeblich sind gesetzliche Beziehung und Mittelpunkt der Lebensbeziehungen.", sourceKey: "wogg-5", passageKey: "wogg-5-all", riskLevel: "high" },
  { key: "roommate-not-automatically-hm", category: "household", temporal: "current_2026", type: "exception", text: "Eine Mitbewohnerin oder ein Mitbewohner ist nicht automatisch Haushaltsmitglied. Ohne gesetzliches Verhältnis und gemeinsamen Lebensmittelpunkt zählt die Person nicht mit.", sourceKey: "wogg-5", passageKey: "wogg-5-all", riskLevel: "high" },
  { key: "wg-not-automatically-one", category: "household", temporal: "current_2026", type: "exception", text: "Eine Wohngemeinschaft ist nicht automatisch ein Wohngeldhaushalt. Jede Person ist nach Beziehung, Nutzung und Mittelpunkt gesondert einzuordnen.", sourceKey: "wogg-5", passageKey: "wogg-5-all", riskLevel: "high" },
  { key: "married-not-enough-alone", category: "household", temporal: "current_2026", type: "exception", text: "Ehe allein genügt nicht für jedes Haushaltsergebnis. Dauerndes Getrenntleben und der tatsächliche Lebensmittelpunkt können trennen.", sourceKey: "wogg-5", passageKey: "wogg-5-all", riskLevel: "high" },
  { key: "shared-child-both-parents", category: "household", temporal: "current_2026", type: "definition", text: "Betreuen nicht nur vorübergehend getrennt lebende Eltern ein Kind zu annähernd gleichen Teilen oder mindestens einem Drittel zu zwei Dritteln, ist das Kind bei beiden Eltern Haushaltsmitglied.", sourceKey: "wogg-5", passageKey: "wogg-5-all", riskLevel: "high" },
  { key: "mixed-excluded-share-miete", category: "household", temporal: "current_2026", type: "procedure", text: "Ist mindestens ein Haushaltsmitglied ausgeschlossen, zählt nur der Anteil der zu berücksichtigenden Mitglieder an Miete oder Belastung sowie an Höchstbetrag, Heizkostenentlastung und Klimakomponente.", sourceKey: "wogg-11", passageKey: "wogg-11-all", riskLevel: "high" },
  { key: "death-12-months", category: "household", temporal: "current_2026", type: "definition", text: "Nach dem Tod eines zu berücksichtigenden Haushaltsmitglieds bleibt die bisherige Anzahl zwölf Monate nach dem Sterbemonat maßgebend, sofern die Wohnung nicht aufgegeben wird.", sourceKey: "wogg-6", passageKey: "wogg-6-all", riskLevel: "medium" },
  { key: "household-needs-facts", category: "household", temporal: "current_2026", type: "exception", text: "Die individuelle Wohngeld-Haushaltszuordnung darf ohne Wohnraum, Beziehungen, Lebensmittelpunkt und Ausschlusslagen nicht entschieden werden.", sourceKey: "wogg-5", passageKey: "wogg-5-all", riskLevel: "high", requiredContextKeys: ["PROCESS_VARIANT", "MAIN_OR_SECONDARY_RESIDENCE"] },
  { key: "gsg-excluded-if-kdu", category: "exclusion", temporal: "current_2026", type: "definition", text: "Empfängerinnen und Empfänger von Grundsicherungsgeld sind vom Wohngeld ausgeschlossen, wenn bei dessen Berechnung Kosten der Unterkunft berücksichtigt worden sind.", sourceKey: "wogg-7", passageKey: "wogg-7-all", riskLevel: "high" },
  { key: "gsg-not-always-combinable", category: "exclusion", temporal: "current_2026", type: "exception", text: "Grundsicherungsgeld ist nicht die gewöhnliche unbeschränkte Kombination mit Wohngeld. Der gesetzliche Ausschluss greift, wenn Unterkunftskosten in der Transferleistung stecken.", sourceKey: "wogg-7", passageKey: "wogg-7-all", riskLevel: "high" },
  { key: "gsg-pending-not-same-as-final", category: "exclusion", temporal: "current_2026", type: "exception", text: "Ein laufendes Verfahren über Grundsicherungsgeld ist nicht in jedem Verfahrensstand dasselbe wie der endgültige Wohngeldausschluss. Ablehnung, Rücknahme, Darlehen oder Vermeidung von Hilfebedürftigkeit können den Ausschluss als nicht erfolgt gelten lassen.", sourceKey: "wogg-8", passageKey: "wogg-8-all", riskLevel: "high" },
  { key: "loan-only-not-excluded", category: "exclusion", temporal: "current_2026", type: "exception", text: "Werden die genannten Transferleistungen ausschließlich als Darlehen gewährt, besteht der Wohngeldausschluss nicht.", sourceKey: "wogg-7", passageKey: "wogg-7-all", riskLevel: "medium" },
  { key: "vermeidung-hilfebeduerftigkeit-exception", category: "exclusion", temporal: "current_2026", type: "exception", text: "Der Ausschluss besteht nicht, wenn Wohngeld Hilfebedürftigkeit vermeiden oder beseitigen kann und die Transferleistung noch nicht erbracht oder nachrangig erbracht wird.", sourceKey: "wogg-7", passageKey: "wogg-7-all", riskLevel: "high" },
  { key: "alg-not-automatic-exclusion", category: "exclusion", temporal: "current_2026", type: "exception", text: "Arbeitslosengeld ist nicht automatisch Wohngeldausschluss. § 7 nennt Grundsicherungsgeld und bestimmte andere Transferleistungen, nicht das Versicherungsarbeitslosengeld.", sourceKey: "wogg-7", passageKey: "wogg-7-all", riskLevel: "high" },
  { key: "kindergeld-not-automatic-exclusion", category: "exclusion", temporal: "current_2026", type: "exception", text: "Kindergeld ist nicht automatisch Wohngeldausschluss. Es kann Haushalts- oder Freibetragsbezug haben, ersetzt aber nicht die Ausschlussprüfung.", sourceKey: "wogg-7", passageKey: "wogg-7-all", riskLevel: "high" },
  { key: "any-benefit-not-exclusion", category: "exclusion", temporal: "current_2026", type: "exception", text: "Irgendeine staatliche Leistung bedeutet nicht automatisch kein Wohngeld. Maßgeblich ist der gesetzliche Katalog der Ausschlussleistungen mit Unterkunftskosten.", sourceKey: "wogg-7", passageKey: "wogg-7-all", riskLevel: "high" },
  { key: "asylblg-interface", category: "exclusion", temporal: "current_2026", type: "definition", text: "Leistungen nach dem Asylbewerberleistungsgesetz können ausschließen, wenn Unterkunftskosten berücksichtigt wurden. Das ist eine Schnittstelle, kein vollständiges Asylverfahren.", sourceKey: "wogg-7", passageKey: "wogg-7-all", riskLevel: "high" },
  { key: "sgb12-interface", category: "exclusion", temporal: "current_2026", type: "definition", text: "Grundsicherung im Alter und Hilfe zum Lebensunterhalt können ausschließen, wenn Unterkunftskosten berücksichtigt wurden. Das SGB-XII-Verfahren wird hier nicht berechnet.", sourceKey: "wogg-7", passageKey: "wogg-7-all", riskLevel: "high" },
  { key: "bafoeg-dem-grunde-nach", category: "exclusion", temporal: "current_2026", type: "definition", text: "Kein Wohngeldanspruch besteht, wenn allen Haushaltsmitgliedern BAföG oder bestimmte BAB-Leistungen dem Grunde nach zustehen oder zustünden, auch wenn der Förderbetrag wegen Einkommen null ist.", sourceKey: "wogg-20", passageKey: "wogg-20-all", riskLevel: "high" },
  { key: "bafoeg-zero-not-eligible", category: "exclusion", temporal: "current_2026", type: "exception", text: "Ein BAföG-Betrag von null Euro bedeutet nicht automatisch Wohngeldberechtigung, wenn dem Grunde nach Förderungsberechtigung besteht.", sourceKey: "wogg-20", passageKey: "wogg-20-all", riskLevel: "high" },
  { key: "student-not-automatic-excluded", category: "exclusion", temporal: "current_2026", type: "exception", text: "Studierendenstatus schließt Wohngeld nicht automatisch aus. Maßgeblich ist, ob allen Haushaltsmitgliedern eine Ausbildungsförderung dem Grunde nach zusteht.", sourceKey: "wogg-20", passageKey: "wogg-20-all", riskLevel: "high" },
  { key: "student-not-automatic-eligible", category: "exclusion", temporal: "current_2026", type: "exception", text: "Studierendenstatus bedeutet nicht automatisch Wohngeld. Haushaltsstruktur und dem-Grunde-nach-Förderung müssen geprüft werden.", sourceKey: "wogg-20", passageKey: "wogg-20-all", riskLevel: "high" },
  { key: "bafoeg-rejected-not-enough", category: "exclusion", temporal: "current_2026", type: "exception", text: "Eine BAföG-Ablehnung allein genügt nicht. Es kommt auf den Ablehnungsgrund an, insbesondere ob dem Grunde nach Förderung besteht oder fehlt.", sourceKey: "wogg-20", passageKey: "wogg-20-all", riskLevel: "high" },
  { key: "household-with-student-not-whole-excluded", category: "exclusion", temporal: "current_2026", type: "exception", text: "Ein Haushalt mit einer studierenden Person ist nicht notwendig insgesamt ausgeschlossen. § 20 greift, wenn allen Haushaltsmitgliedern die Ausbildungsförderung dem Grunde nach zusteht.", sourceKey: "wogg-20", passageKey: "wogg-20-all", riskLevel: "high" },
  { key: "loan-bafoeg-exception", category: "exclusion", temporal: "current_2026", type: "exception", text: "Werden die Ausbildungsförderleistungen ausschließlich als Darlehen gewährt, gilt der Ausschluss nach § 20 nicht.", sourceKey: "wogg-20", passageKey: "wogg-20-all", riskLevel: "medium" },
  { key: "training-start-during-bewilligung", category: "exclusion", temporal: "current_2026", type: "procedure", text: "Beginnt die Ausbildung in einem bereits bewilligten Wohngeldzeitraum, wird das Wohngeld bis zum Ablauf in gleicher Höhe weitergeleistet, vorbehaltlich §§ 27 und 28.", sourceKey: "wogg-20", passageKey: "wogg-20-all", riskLevel: "medium" },
  { key: "min-result-boundary", category: "calculation", temporal: "current_2026", type: "definition", text: "Ein Wohngeldanspruch besteht nicht, wenn das Wohngeld die gesetzliche monatliche Mindestgrenze nach § 21 Nummer 1 nicht erreichen würde. Das ist keine allgemeine Mindesteinkommensschwelle.", sourceKey: "wogg-21", passageKey: "wogg-21-all", riskLevel: "medium" },
  { key: "all-excluded-no-claim", category: "exclusion", temporal: "current_2026", type: "definition", text: "Sind alle Haushaltsmitglieder nach §§ 7 und 8 ausgeschlossen, besteht kein Wohngeldanspruch.", sourceKey: "wogg-21", passageKey: "wogg-21-all", riskLevel: "high" },
  { key: "significant-assets-abuse", category: "exclusion", temporal: "current_2026", type: "definition", text: "Ein Anspruch besteht nicht, soweit die Inanspruchnahme missbräuchlich wäre, insbesondere wegen erheblichen Vermögens. Eine universelle Vermögensgrenze darf nicht erfunden werden.", sourceKey: "wogg-21", passageKey: "wogg-21-all", riskLevel: "high" },
  { key: "savings-not-automatic-exclusion", category: "exclusion", temporal: "current_2026", type: "exception", text: "Ersparnisse bedeuten nicht automatisch Wohngeldausschluss. Erhebliches Vermögen ist ein Missbrauchstatbestand und einzelfallbezogen.", sourceKey: "wogg-21", passageKey: "wogg-21-all", riskLevel: "high" },
  { key: "car-not-automatic-exclusion", category: "exclusion", temporal: "current_2026", type: "exception", text: "Ein Kraftfahrzeug bedeutet nicht automatisch Ausschluss wegen erheblichen Vermögens.", sourceKey: "wogg-21", passageKey: "wogg-21-all", riskLevel: "high" },
  { key: "assets-threshold-not-invented", category: "exclusion", temporal: "current_2026", type: "exception", text: "Eine erinnerte oder geschätzte Vermögensgrenze darf nicht als geltendes Wohngeldrecht ausgegeben werden. Aktuelle Maßstäbe sind zu revalidieren.", sourceKey: "wogg-21", passageKey: "wogg-21-all", riskLevel: "high", requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "low-income-not-automatic-rejection", category: "eligibility", temporal: "current_2026", type: "exception", text: "Niedriges Einkommen ist nicht automatisch Ablehnung und nicht automatisch ein bestimmter Wohngeldbetrag. Es gibt keine versteckte bundesweite Mindesteinkommensgrenze.", sourceKey: "wogg-21", passageKey: "wogg-21-all", riskLevel: "high" },
  { key: "livelihood-explanation-may-be-needed", category: "evidence", temporal: "current_2026", type: "procedure", text: "Kann der Lebensunterhalt aus den erklärten Einkünften nicht plausibel erscheinen, kann die Behörde Aufklärung verlangen. Das ersetzt keine erfundene Mindesteinkommensschwelle.", sourceKey: "wogg-23", passageKey: "wogg-23-all", riskLevel: "high" },
  { key: "miete-is-agreed-entgelt", category: "rent", temporal: "current_2026", type: "definition", text: "Miete im Sinne des Wohngeldgesetzes ist das vereinbarte Entgelt für die Gebrauchsüberlassung einschließlich Umlagen, Zuschlägen und Vergütungen.", sourceKey: "wogg-9", passageKey: "wogg-9-all", riskLevel: "medium" },
  { key: "heating-hotwater-excluded-from-miete", category: "rent", temporal: "current_2026", type: "definition", text: "Heizkosten und Kosten der Warmwassererwärmung bleiben bei der Ermittlung der Miete außer Betracht.", sourceKey: "wogg-9", passageKey: "wogg-9-all", riskLevel: "high" },
  { key: "household-energy-excluded", category: "rent", temporal: "current_2026", type: "definition", text: "Kosten der Haushaltsenergie bleiben, soweit sie nicht schon Heiz- oder Warmwasserkosten sind, bei der Miete außer Betracht.", sourceKey: "wogg-9", passageKey: "wogg-9-all", riskLevel: "medium" },
  { key: "garage-excluded", category: "rent", temporal: "current_2026", type: "definition", text: "Vergütungen für Garage oder Stellplatz bleiben bei der wohngeldrechtlichen Miete außer Betracht.", sourceKey: "wogg-9", passageKey: "wogg-9-all", riskLevel: "medium" },
  { key: "extra-services-excluded", category: "rent", temporal: "current_2026", type: "definition", text: "Vergütungen für Leistungen über die Wohnraumüberlassung hinaus, etwa Betreuung oder Notruf, bleiben außer Betracht.", sourceKey: "wogg-9", passageKey: "wogg-9-all", riskLevel: "medium" },
  { key: "warmmiete-not-automatically-m", category: "rent", temporal: "current_2026", type: "exception", text: "Die Warmmiete ist nicht automatisch die wohngeldrechtlich zu berücksichtigende Miete. Heiz- und Energieteile sind gesondert zu behandeln.", sourceKey: "wogg-9", passageKey: "wogg-9-all", riskLevel: "high" },
  { key: "kaltmiete-not-automatically-m", category: "rent", temporal: "current_2026", type: "exception", text: "Die Kaltmiete ist nicht automatisch der genaue wohngeldrelevante Betrag. Umlagen können gehören, andere Bestandteile nicht.", sourceKey: "wogg-9", passageKey: "wogg-9-all", riskLevel: "high" },
  { key: "contract-amount-not-automatically-relevant", category: "rent", temporal: "current_2026", type: "exception", text: "Der im Mietvertrag genannte Gesamtbetrag ist nicht automatisch die volle zu berücksichtigende Miete. Zusammensetzung und Höchstbetrag sind zu prüfen.", sourceKey: "wogg-11", passageKey: "wogg-11-all", riskLevel: "high" },
  { key: "relevant-m-capped", category: "rent", temporal: "current_2026", type: "definition", text: "Die zu berücksichtigende Miete oder Belastung ist auf Höchstbetrag plus Klimakomponente begrenzt und um den gesetzlichen Gesamtbetrag zur Entlastung bei den Heizkosten ergänzt.", sourceKey: "wogg-11", passageKey: "wogg-11-all", riskLevel: "high" },
  { key: "heating-bill-not-heizkostenkomponente", category: "rent", temporal: "current_2026", type: "exception", text: "Die tatsächliche Heizkostenabrechnung wird nicht eins zu eins in die Wohngeldberechnung übernommen. Die Heizkostenentlastung ist ein gesetzlicher Tabellenbetrag.", sourceKey: "wogg-12", passageKey: "wogg-12-all", riskLevel: "high" },
  { key: "heizkosten-is-statutory-table", category: "calculation", temporal: "current_2026", type: "definition", text: "Der Gesamtbetrag zur Entlastung bei den Heizkosten im Wohngeld ist ein gesetzlicher Zuschlag nach Haushaltsmitgliederzahl und nicht die Erstattung der eigenen Heizung.", sourceKey: "wogg-12", passageKey: "wogg-12-all", riskLevel: "high" },
  { key: "klima-is-statutory-table", category: "calculation", temporal: "current_2026", type: "definition", text: "Die Klimakomponente ist ein gesetzlicher Zuschlag zu den Höchstbeträgen nach Haushaltsmitgliederzahl und nicht die tatsächliche energetische Rechnung.", sourceKey: "wogg-12", passageKey: "wogg-12-all", riskLevel: "high" },
  { key: "current-euro-not-timeless", category: "calculation", temporal: "current_2026", type: "exception", text: "Aktuelle Eurobeträge von Höchstbeträgen, Heizkostenentlastung und Klimakomponente sind nicht als zeitlose Werte zu speichern. Sie sind aus der geltenden Fassung zu revalidieren.", sourceKey: "wogg-12", passageKey: "wogg-12-all", riskLevel: "high", requiresEffectiveDate: true, requiredContextKeys: ["EVENT_DATE"] },
  { key: "belastung-kapital-bewirtschaftung", category: "burden", temporal: "current_2026", type: "definition", text: "Belastung sind Kosten für Kapitaldienst und Bewirtschaftung des selbst genutzten Wohnraums in vereinbarter oder festgesetzter Höhe.", sourceKey: "wogg-10", passageKey: "wogg-10-all", riskLevel: "medium" },
  { key: "lastenberechnung-by-authority", category: "burden", temporal: "current_2026", type: "procedure", text: "Die Wohngeldbehörde ermittelt die Belastung in einer Wohngeld-Lastenberechnung nach der Wohngeldverordnung.", sourceKey: "wogg-10", passageKey: "wogg-10-all", riskLevel: "medium" },
  { key: "mortgage-not-automatically-belastung", category: "burden", temporal: "current_2026", type: "exception", text: "Die monatliche Kreditrate ist nicht automatisch die wohngeldrelevante Belastung in derselben Höhe. Kapitaldienst und Bewirtschaftung werden gesetzlich ermittelt und begrenzt.", sourceKey: "wogg-10", passageKey: "wogg-10-all", riskLevel: "high" },
  { key: "mietenstufe-i-vii-structure", category: "calculation", temporal: "current_2026", type: "definition", text: "Mietenstufen I bis VII folgen dem festgestellten Mietenniveau der Gemeinde. Sie steuern die Höchstbeträge, nicht die tatsächliche Vertragsmiete.", sourceKey: "wogg-12", passageKey: "wogg-12-all", riskLevel: "medium" },
  { key: "municipality-required", category: "calculation", temporal: "current_2026", type: "procedure", text: "Die Mietenstufe für Wohngeld setzt die genaue Gemeinde oder den zusammengefassten Kreis voraus. Ohne Ort darf keine Stufe angenommen werden.", sourceKey: "wogv-1", passageKey: "wogv-1-all", riskLevel: "high", requiredContextKeys: ["MUNICIPALITY"] },
  { key: "not-from-land", category: "calculation", temporal: "current_2026", type: "exception", text: "Das Land allein bestimmt nicht die Mietenstufe. Gemeinden desselben Landes können verschiedene Stufen haben.", sourceKey: "wogg-12", passageKey: "wogg-12-all", riskLevel: "high" },
  { key: "not-from-plz", category: "calculation", temporal: "current_2026", type: "exception", text: "Eine Postleitzahl oder eine nahe Stadt darf nicht als Wohngeld-Mietenstufe geraten werden.", sourceKey: "wogv-1", passageKey: "wogv-1-all", riskLevel: "high" },
  { key: "not-from-locale", category: "calculation", temporal: "current_2026", type: "exception", text: "userLocale oder die Sprache der Anwendung bestimmen weder Mietenstufe noch zuständige Wohngeldbehörde.", sourceKey: "wogg-24", passageKey: "wogg-24-all", riskLevel: "high" },
  { key: "not-from-rent-amount", category: "calculation", temporal: "current_2026", type: "exception", text: "Die Höhe der Vertragsmiete bestimmt nicht die Mietenstufe. Die Stufe folgt dem amtlichen Mietenniveau der Gemeinde.", sourceKey: "wogg-12", passageKey: "wogg-12-all", riskLevel: "high" },
  { key: "lookup-cache-revalidate", category: "calculation", temporal: "current_2026", type: "procedure", text: "Die aktuelle Mietenstufe einer Gemeinde für Wohngeld ist aus der geltenden WoGV-Anlage zu ermitteln und zu revalidieren, nicht als bundesweite Ortswahrheit zu speichern.", sourceKey: "wogv-1", passageKey: "wogv-1-all", riskLevel: "high", requiredContextKeys: ["MUNICIPALITY", "EVENT_DATE"] },
  { key: "gesamteinkommen-definition", category: "income", temporal: "current_2026", type: "definition", text: "Das Gesamteinkommen ist die Summe der Jahreseinkommen der zu berücksichtigenden Haushaltsmitglieder abzüglich Freibeträgen und Unterhaltsabzügen.", sourceKey: "wogg-13", passageKey: "wogg-13-all", riskLevel: "medium" },
  { key: "jahres-expected-in-bewilligung", category: "income", temporal: "current_2026", type: "definition", text: "Für Wohngeld liegt das im Bewilligungszeitraum zu erwartende Einkommen zugrunde, nicht automatisch der letzte monatliche Nettolohn.", sourceKey: "wogg-15", passageKey: "wogg-15-all", riskLevel: "high" },
  { key: "prior-as-evidence", category: "income", temporal: "current_2026", type: "procedure", text: "Verhältnisse vor der Antragstellung können als Nachweis für das erwartete Einkommen herangezogen werden.", sourceKey: "wogg-15", passageKey: "wogg-15-all", riskLevel: "medium" },
  { key: "one-off-not-always-ignored", category: "income", temporal: "current_2026", type: "exception", text: "Eine Einmalzahlung wird im Wohngeld nicht immer ignoriert. Sie wird dem bestimmten Zeitraum oder sonst anteilig zugerechnet, wenn sie innerhalb eines Jahres vor Antragstellung zugeflossen ist.", sourceKey: "wogg-15", passageKey: "wogg-15-all", riskLevel: "high" },
  { key: "net-not-gesamteinkommen", category: "income", temporal: "current_2026", type: "exception", text: "Das Nettogehalt ist nicht das wohngeldrechtliche Gesamteinkommen. Maßgeblich sind positive Einkünfte, weitere Einnahmen und gesetzliche Abzüge.", sourceKey: "wogg-14", passageKey: "wogg-14-all", riskLevel: "high" },
  { key: "gross-not-wohngeld-amount", category: "income", temporal: "current_2026", type: "exception", text: "Das Bruttogehalt ist nicht der Wohngeldbetrag. Es ist nur eine mögliche Ausgangsgröße für das Jahreseinkommen.", sourceKey: "wogg-14", passageKey: "wogg-14-all", riskLevel: "high" },
  { key: "taxable-not-identical", category: "income", temporal: "current_2026", type: "exception", text: "Das steuerpflichtige Einkommen der Einkommensteuer ist nicht identisch mit dem Gesamteinkommen nach dem Wohngeldgesetz.", sourceKey: "wogg-14", passageKey: "wogg-14-all", riskLevel: "high" },
  { key: "monthly-salary-not-jahres", category: "income", temporal: "current_2026", type: "exception", text: "Der aktuelle Monatslohn ist nicht automatisch das Wohngeld-Jahreseinkommen. Erwartungszeitraum, Einmalzahlungen und Abzüge sind zu berücksichtigen.", sourceKey: "wogg-15", passageKey: "wogg-15-all", riskLevel: "high" },
  { key: "foreign-income-not-ignored", category: "cross_border", temporal: "current_2026", type: "exception", text: "Ausländische Einkünfte, Renten oder Unterhalt sind nicht automatisch unbeachtlich. Sie können ins Jahreseinkommen fallen.", sourceKey: "wogg-14", passageKey: "wogg-14-all", riskLevel: "high" },
  { key: "deductions-10pct-structure", category: "income", temporal: "current_2026", type: "definition", text: "Für erwartete Einkommensteuer sowie bestimmte Kranken-, Pflege- und Rentenbeiträge sind jeweils zehn Prozent abzuziehen. Das ist kein Netto-Ersatz.", sourceKey: "wogg-16", passageKey: "wogg-16-all", riskLevel: "medium" },
  { key: "freibetrag-structure", category: "income", temporal: "current_2026", type: "definition", text: "Gesetzliche Freibeträge, etwa für schwere Behinderung, Alleinerziehende oder Erwerb bestimmter Kinder, mindern das Gesamteinkommen. Ihre aktuellen Eurobeträge sind zeitgebunden.", sourceKey: "wogg-17", passageKey: "wogg-17-all", riskLevel: "medium", requiresEffectiveDate: true, requiredContextKeys: ["EVENT_DATE"] },
  { key: "household-member-income", category: "income", temporal: "current_2026", type: "definition", text: "Einkommen aller zu berücksichtigenden Haushaltsmitglieder zählt. Das Einkommen nur der antragstellenden Person genügt nicht.", sourceKey: "wogg-13", passageKey: "wogg-13-all", riskLevel: "high" },
  { key: "individual-amount-fail-closed", category: "calculation", temporal: "current_2026", type: "exception", text: "Ein individueller Wohngeldbetrag darf ohne Zahl der zu berücksichtigenden Mitglieder, Ausschlüsse, relevantes Einkommen, relevante Miete oder Belastung, Gemeinde und Mietenstufe sowie aktuelle gesetzliche Parameter nicht genannt werden.", sourceKey: "wogg-19", passageKey: "wogg-19-all", riskLevel: "high", requiredContextKeys: ["MUNICIPALITY", "EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "formula-structure-not-individual", category: "calculation", temporal: "current_2026", type: "definition", text: "Die gesetzliche Formel nach § 19 darf als Struktur erklärt werden. Sie ersetzt nicht die fallbezogene Berechnung der Wohngeldbehörde.", sourceKey: "wogg-19", passageKey: "wogg-19-all", riskLevel: "medium" },
  { key: "only-on-application", category: "application", temporal: "current_2026", type: "duty", text: "Ohne Antrag wird Wohngeld nicht geleistet. Die antragstellende Person gilt bei mehreren Berechtigten als bestimmt.", sourceKey: "wogg-22", passageKey: "wogg-22-all", riskLevel: "high" },
  { key: "identify-type", category: "application", temporal: "current_2026", type: "procedure", text: "Vor der Antragstellung ist zu klären, ob Mietzuschuss oder Lastenzuschuss einschlägig ist und welche Person wohngeldberechtigt ist.", sourceKey: "bmwsb-plus", passageKey: "bmwsb-plus-all", riskLevel: "medium" },
  { key: "collect-min-info", category: "application", temporal: "current_2026", type: "procedure", text: "Typische bundesrechtliche Informationsfelder sind Identität, Haushalt, Wohnkosten oder Belastung und Einkommen. Eine einzelne Gemeinde-Checkliste darf nicht verallgemeinert werden.", sourceKey: "bmwsb-faq", passageKey: "bmwsb-faq-all", riskLevel: "medium" },
  { key: "form-not-always-formfrei", category: "application", temporal: "current_2026", type: "exception", text: "Das Wohngeldgesetz schreibt den Antrag vor, nicht bundesweit ein bestimmtes Formular. Ob ein formloser Antrag die Frist wahrt, darf ohne das Verfahren der zuständigen Behörde nicht als immer ausreichend behauptet werden.", sourceKey: "wogg-22", passageKey: "wogg-22-all", riskLevel: "high" },
  { key: "missing-docs-later", category: "application", temporal: "current_2026", type: "procedure", text: "Fehlende Unterlagen können nachgefordert und nachgereicht werden. Ein unvollständiger Antrag ist nicht in jedem Fall die endgültige Ablehnung.", sourceKey: "wogg-23", passageKey: "wogg-23-all", riskLevel: "medium" },
  { key: "mid-month-starts-first", category: "application", temporal: "current_2026", type: "deadline", text: "Der Bewilligungszeitraum beginnt am Ersten des Antragsmonats, wenn die Voraussetzungen dann vorliegen. Ein Antrag in der Monatsmitte führt nicht nur ab dem Kalendertag.", sourceKey: "wogg-25", passageKey: "wogg-25-all", riskLevel: "high" },
  { key: "move-in-not-automatic-start", category: "application", temporal: "current_2026", type: "exception", text: "Der Einzug in eine Wohnung löst Wohngeld nicht automatisch aus. Es bedarf eines Antrags und bestehender Voraussetzungen.", sourceKey: "wogg-22", passageKey: "wogg-22-all", riskLevel: "high" },
  { key: "eligibility-not-paid-without-application", category: "application", temporal: "current_2026", type: "exception", text: "Auch bei bestehender Anspruchslage wird Wohngeld ohne Antrag nicht gezahlt.", sourceKey: "wogg-22", passageKey: "wogg-22-all", riskLevel: "high" },
  { key: "late-next-month-not-retro-previous", category: "application", temporal: "current_2026", type: "exception", text: "Ein verspäteter Antrag im Folgemonat führt nicht automatisch zur rückwirkenden Zahlung für den Vormonat.", sourceKey: "wogg-25", passageKey: "wogg-25-all", riskLevel: "high" },
  { key: "section-25-transfer-timing", category: "application", temporal: "current_2026", type: "deadline", text: "Nach Ablehnung einer Ausschlussleistung kann der Bewilligungszeitraum am Ersten des Ablehnungsmonats beginnen, wenn der Wohngeldantrag vor Ablauf des folgenden Kalendermonats gestellt wird.", sourceKey: "wogg-25", passageKey: "wogg-25-all", riskLevel: "high" },
  { key: "processing-no-promise", category: "processing", temporal: "current_2026", type: "exception", text: "Eine Bearbeitungsdauer darf nicht versprochen werden. Sie ist bei der zuständigen Behörde aktuell zu erfragen.", sourceKey: "bmwsb-faq", passageKey: "bmwsb-faq-all", riskLevel: "high" },
  { key: "written-bescheid-required", category: "bescheid", temporal: "current_2026", type: "procedure", text: "Die Wohngeldbehörde entscheidet schriftlich. Auf einen Antrag muss ein schriftlicher Bescheid ergehen.", sourceKey: "wogg-24", passageKey: "wogg-24-all", riskLevel: "medium" },
  { key: "auskunftspflicht", category: "evidence", temporal: "current_2026", type: "duty", text: "Haushaltsmitglieder und auf Verlangen weitere Personen müssen die für das Wohngeld erheblichen Verhältnisse vollständig und wahrheitsgemäß angeben.", sourceKey: "wogg-23", passageKey: "wogg-23-all", riskLevel: "high" },
  { key: "evidence-request-not-fraud", category: "evidence", temporal: "current_2026", type: "exception", text: "Eine Unterlagenanforderung der Wohngeldbehörde ist nicht automatisch Betrugsverdacht. Sie ist gesetzliche Mitwirkung.", sourceKey: "wogg-23", passageKey: "wogg-23-all", riskLevel: "high" },
  { key: "missing-one-doc-not-always-rejection", category: "evidence", temporal: "current_2026", type: "exception", text: "Ein fehlendes Dokument ist nicht in jedem Fall die endgültige Ablehnung. Die Behörde kann nachfordern und Unmöglichkeitsgründe entgegennehmen.", sourceKey: "wogg-23", passageKey: "wogg-23-all", riskLevel: "high" },
  { key: "data-matching-not-criminal", category: "evidence", temporal: "current_2026", type: "exception", text: "Ein Datenabgleich nach § 33 WoGG ist nicht automatisch ein Strafverfahren oder eine kriminelle Ermittlung zum Wohngeld.", sourceKey: "wogg-33", passageKey: "wogg-33-all", riskLevel: "high" },
  { key: "do-not-fabricate", category: "evidence", temporal: "current_2026", type: "duty", text: "Nachweise dürfen nicht erfunden werden. Unvollständige oder unrichtige Angaben können den Anspruch und eine Ordnungswidrigkeit berühren.", sourceKey: "wogg-23", passageKey: "wogg-23-all", riskLevel: "high" },
  { key: "preliminary-conditions", category: "preliminary", temporal: "current_2026", type: "procedure", text: "Vorläufige Zahlung kann erfolgen, wenn die Feststellung voraussichtlich längere Zeit erfordert und ein Anspruch hinreichend wahrscheinlich ist.", sourceKey: "wogg-26a", passageKey: "wogg-26a-all", riskLevel: "medium" },
  { key: "long-processing-not-automatic-preliminary", category: "preliminary", temporal: "current_2026", type: "exception", text: "Lange Bearbeitung bedeutet nicht automatisch ein Recht auf vorläufige Zahlung. Beide gesetzlichen Voraussetzungen müssen vorliegen.", sourceKey: "wogg-26a", passageKey: "wogg-26a-all", riskLevel: "high" },
  { key: "preliminary-not-final", category: "preliminary", temporal: "current_2026", type: "exception", text: "Die vorläufige Zahlung ist nicht die endgültige Wohngeldfeststellung und steht unter Rückforderungsvorbehalt.", sourceKey: "wogg-26a", passageKey: "wogg-26a-all", riskLevel: "high" },
  { key: "preliminary-amount-not-guaranteed", category: "preliminary", temporal: "current_2026", type: "exception", text: "Der vorläufige Betrag ist nicht der garantierte endgültige Betrag. Später kann angepasst oder zurückgefordert werden.", sourceKey: "wogg-26a", passageKey: "wogg-26a-all", riskLevel: "high" },
  { key: "ordinary-12-months", category: "payment", temporal: "current_2026", type: "definition", text: "Das Wohngeld soll für zwölf Monate bewilligt werden. Der Zeitraum kann kürzer, geteilt oder bei voraussichtlich gleichbleibenden Verhältnissen auf bis zu 24 Monate verlängert werden.", sourceKey: "wogg-25", passageKey: "wogg-25-all", riskLevel: "medium" },
  { key: "not-permanent", category: "payment", temporal: "current_2026", type: "exception", text: "Wohngeld ist keine dauerhafte Bewilligung. Nach Ablauf ist ein Weiterleistungsantrag erforderlich.", sourceKey: "wogg-25", passageKey: "wogg-25-all", riskLevel: "high" },
  { key: "twelve-not-universal", category: "payment", temporal: "current_2026", type: "exception", text: "Zwölf Monate sind nicht die zwingend universelle Dauer. Kürzung, Teilung oder Verlängerung bis 24 Monate sind gesetzlich möglich.", sourceKey: "wogg-25", passageKey: "wogg-25-all", riskLevel: "medium" },
  { key: "twentyfour-not-automatic", category: "payment", temporal: "current_2026", type: "exception", text: "24 Monate sind nicht automatisch für alle vorgesehen. Voraussetzung sind voraussichtlich gleichbleibende Verhältnisse.", sourceKey: "wogg-25", passageKey: "wogg-25-all", riskLevel: "medium" },
  { key: "monthly-in-advance", category: "payment", temporal: "current_2026", type: "definition", text: "Wohngeld ist monatlich im Voraus auf ein Konto eines Haushaltsmitgliedes zu zahlen. Ein genauer Überweisungstag darf ohne lokale aktuelle Angabe nicht versprochen werden.", sourceKey: "wogg-26", passageKey: "wogg-26-all", riskLevel: "medium" },
  { key: "payment-to-other-possible", category: "payment", temporal: "current_2026", type: "procedure", text: "Mit Einwilligung oder wenn im Einzelfall geboten kann an ein anderes Haushaltsmitglied, an die Mietempfängerin oder den Mietempfänger oder an einen Leistungsträger gezahlt werden.", sourceKey: "wogg-26", passageKey: "wogg-26-all", riskLevel: "medium" },
  { key: "increase-household-on-application", category: "change", temporal: "current_2026", type: "procedure", text: "Erhöht sich die Zahl der zu berücksichtigenden Haushaltsmitglieder und steigt dadurch das Wohngeld, ist auf Antrag neu zu bewilligen.", sourceKey: "wogg-27", passageKey: "wogg-27-all", riskLevel: "high" },
  { key: "increase-rent-over-10", category: "change", temporal: "current_2026", type: "procedure", text: "Erhöht sich die zu berücksichtigende Miete oder Belastung abzüglich Heizkostenentlastung um mehr als 10 Prozent und steigt dadurch das Wohngeld, ist auf Antrag neu zu bewilligen.", sourceKey: "wogg-27", passageKey: "wogg-27-all", riskLevel: "high" },
  { key: "decrease-income-over-10", category: "change", temporal: "current_2026", type: "procedure", text: "Verringert sich das Gesamteinkommen um mehr als 10 Prozent und steigt dadurch das Wohngeld, ist auf Antrag neu zu bewilligen.", sourceKey: "wogg-27", passageKey: "wogg-27-all", riskLevel: "high" },
  { key: "ten-not-fifteen", category: "change", temporal: "current_2026", type: "exception", text: "Die 10-Prozent-Schwellen für leistungssteigernde Anträge sind nicht dieselben Regeln wie die 15-Prozent-Schwellen der Mitteilungspflicht und Amtsänderung.", sourceKey: "wogg-27", passageKey: "wogg-27-all", riskLevel: "high" },
  { key: "report-household-decrease", category: "change", temporal: "current_2026", type: "duty", text: "Nicht nur vorübergehende Verringerung der zu berücksichtigenden Haushaltsmitglieder oder Erhöhung Ausgeschlossener ist unverzüglich mitzuteilen.", sourceKey: "wogg-27", passageKey: "wogg-27-all", riskLevel: "high" },
  { key: "report-rent-minus-15", category: "change", temporal: "current_2026", type: "duty", text: "Verringert sich die monatliche Miete oder Belastung um mehr als 15 Prozent gegenüber dem Bescheid, ist das unverzüglich mitzuteilen.", sourceKey: "wogg-27", passageKey: "wogg-27-all", riskLevel: "high" },
  { key: "report-income-plus-15", category: "change", temporal: "current_2026", type: "duty", text: "Erhöht sich die Summe der monatlichen positiven Einkünfte und Einnahmen aller zu berücksichtigenden Mitglieder um mehr als 15 Prozent gegenüber dem Bescheid, ist das unverzüglich mitzuteilen.", sourceKey: "wogg-27", passageKey: "wogg-27-all", riskLevel: "high" },
  { key: "income-plus-10-not-same", category: "change", temporal: "current_2026", type: "exception", text: "Eine Einkommenssteigerung um mehr als 10 Prozent ist im Wohngeld nicht automatisch dieselbe Meldepflicht wie eine Steigerung um mehr als 15 Prozent.", sourceKey: "wogg-27", passageKey: "wogg-27-all", riskLevel: "high" },
  { key: "rent-plus-10-not-same-as-minus-15", category: "change", temporal: "current_2026", type: "exception", text: "Eine Mieterhöhung um mehr als 10 Prozent ist nicht dieselbe Rechtsfolge wie eine Mietminderung um mehr als 15 Prozent.", sourceKey: "wogg-27", passageKey: "wogg-27-all", riskLevel: "high" },
  { key: "member-joins-not-same-as-leaves", category: "change", temporal: "current_2026", type: "exception", text: "Ein hinzukommendes Haushaltsmitglied ist nicht dieselbe Folge wie ein wegfallendes Mitglied. Zugang kann einen Erhöhungsantrag auslösen, Wegfall eine Mitteilungspflicht.", sourceKey: "wogg-27", passageKey: "wogg-27-all", riskLevel: "high" },
  { key: "unused-dwelling-ineffective", category: "move", temporal: "current_2026", type: "definition", text: "Nutzt kein zu berücksichtigendes Haushaltsmitglied den bewilligten Wohnraum mehr, wird der Bescheid vom Ersten des Monats oder sonst vom Ersten des nächsten Monats unwirksam.", sourceKey: "wogg-28", passageKey: "wogg-28-all", riskLevel: "high" },
  { key: "report-move", category: "move", temporal: "current_2026", type: "duty", text: "Die Nutzungsaufgabe des Wohnraums ist der Wohngeldbehörde unverzüglich mitzuteilen.", sourceKey: "wogg-28", passageKey: "wogg-28-all", riskLevel: "high" },
  { key: "old-not-transfer", category: "move", temporal: "current_2026", type: "exception", text: "Der alte Wohngeldbescheid wandert nicht automatisch in die neue Wohnung. Für den neuen Wohnraum ist ein neues Verfahren erforderlich.", sourceKey: "wogg-28", passageKey: "wogg-28-all", riskLevel: "high" },
  { key: "anmeld-not-auto-resolve-move", category: "move", temporal: "current_2026", type: "exception", text: "Die Ummeldung bei der Meldebehörde löst das neue Wohngeldverfahren nicht automatisch.", sourceKey: "wogg-28", passageKey: "wogg-28-all", riskLevel: "high" },
  { key: "transfer-benefit-starts-may-affect", category: "move", temporal: "current_2026", type: "definition", text: "Wird ein zu berücksichtigendes Haushaltsmitglied nach §§ 7 und 8 ausgeschlossen, wird der bestehende Bewilligungsbescheid unwirksam.", sourceKey: "wogg-28", passageKey: "wogg-28-all", riskLevel: "high" },
  { key: "notify-procedure-opened", category: "change", temporal: "current_2026", type: "duty", text: "Ein begonnenes Verfahren über eine Ausschlussleistung oder deren Empfang ist unverzüglich mitzuteilen, auch bevor das Endergebnis feststeht.", sourceKey: "wogg-28", passageKey: "wogg-28-all", riskLevel: "high" },
  { key: "gsg-application-not-same-as-receipt", category: "exclusion", temporal: "current_2026", type: "exception", text: "Ein Antrag auf Grundsicherungsgeld ist nicht automatisch dasselbe wie der endgültige Empfang. Gleichwohl kann bereits die Verfahrenseinleitung Mitteilungspflichten auslösen.", sourceKey: "wogg-28", passageKey: "wogg-28-all", riskLevel: "high" },
  { key: "not-automatic-continue", category: "continuation", temporal: "current_2026", type: "exception", text: "Bestehendes Wohngeld läuft nicht automatisch unbegrenzt weiter. Für die Zeit nach dem Bewilligungszeitraum ist ein Weiterleistungsantrag nötig.", sourceKey: "wogg-22", passageKey: "wogg-22-all", riskLevel: "high" },
  { key: "early-two-months-timing", category: "continuation", temporal: "current_2026", type: "deadline", text: "Wird der Weiterleistungsantrag früher als zwei Monate vor Ablauf gestellt, gilt der Erste des zweiten Monats vor Ablauf als Antragstellungszeitpunkt.", sourceKey: "wogg-22", passageKey: "wogg-22-all", riskLevel: "high" },
  { key: "updated-facts-for-continuation", category: "continuation", temporal: "current_2026", type: "procedure", text: "Für die Weiterleistung sind aktuelle Haushalts-, Einkommens- und Wohnkostentatsachen vorzulegen. Der alte Bescheid ersetzt die neue Prüfung nicht.", sourceKey: "wogg-24", passageKey: "wogg-24-all", riskLevel: "medium" },
  { key: "recovery-needs-bescheid", category: "recovery", temporal: "current_2026", type: "procedure", text: "Eine Rückforderung setzt eine gesetzliche Grundlage und regelmäßig eine Entscheidung über Aufhebung, Unwirksamkeit oder Erstattung voraus. Nicht jede Zahlungsaufforderung ist ohne Prüfung richtig.", sourceKey: "wogg-29", passageKey: "wogg-29-all", riskLevel: "high" },
  { key: "overpayment-not-fraud", category: "recovery", temporal: "current_2026", type: "exception", text: "Eine Überzahlung ist nicht automatisch Betrug. Sie kann auf geänderten Tatsachen, fehlerhafter Ausgangslage oder späterer Kenntnis beruhen.", sourceKey: "wogg-29", passageKey: "wogg-29-all", riskLevel: "high" },
  { key: "mismatch-not-misconduct", category: "recovery", temporal: "current_2026", type: "exception", text: "Ein Datenunterschied ist nicht automatisch vorsätzliches Fehlverhalten.", sourceKey: "wogg-33", passageKey: "wogg-33-all", riskLevel: "high" },
  { key: "household-liability", category: "recovery", temporal: "current_2026", type: "definition", text: "Bei Erstattung haften neben der wohngeldberechtigten Person die volljährigen berücksichtigten Haushaltsmitglieder als Gesamtschuldner.", sourceKey: "wogg-29", passageKey: "wogg-29-all", riskLevel: "high" },
  { key: "bagatelle-expired-not-current", category: "recovery", temporal: "current_2026", type: "exception", text: "Die Erprobung einer Kleinbetragsgrenze nach § 30a WoGG dauerte bis zum 31. Dezember 2024. Eine zeitlose aktuelle 50-Euro-Regel für Wohngeld darf daraus nicht abgeleitet werden.", sourceKey: "wogg-30a", passageKey: "wogg-30a-all", riskLevel: "high", requiresEffectiveDate: true, requiredContextKeys: ["EVENT_DATE"] },
  { key: "payment-stop-not-final", category: "recovery", temporal: "current_2026", type: "exception", text: "Die vorläufige Zahlungseinstellung ist nicht die endgültige Aufhebung oder Ablehnung des Anspruchs.", sourceKey: "wogg-29", passageKey: "wogg-29-all", riskLevel: "high" },
  { key: "no-payment-not-bescheid-ended", category: "recovery", temporal: "current_2026", type: "exception", text: "Ausbleibende Wohngeldzahlung bedeutet nicht automatisch, dass der Bescheid beendet ist. Einstellung und Unwirksamkeit sind zu unterscheiden.", sourceKey: "wogg-29", passageKey: "wogg-29-all", riskLevel: "high" },
  { key: "anhoerung-when-not-from-user", category: "recovery", temporal: "current_2026", type: "procedure", text: "Beruht die Kenntnis nicht auf Angaben der berechtigten Person, sind Einstellung und Gründe unverzüglich mitzuteilen und Gelegenheit zur Äußerung zu geben.", sourceKey: "wogg-29", passageKey: "wogg-29-all", riskLevel: "medium" },
  { key: "owi-framework", category: "sanction", temporal: "current_2026", type: "definition", text: "Vorsätzlich oder leichtfertig unrichtige, unvollständige oder verspätete Auskünfte oder Änderungsmitteilungen können eine Ordnungswidrigkeit sein.", sourceKey: "wogg-37", passageKey: "wogg-37-all", riskLevel: "high" },
  { key: "up-to-2000-not-automatic", category: "sanction", temporal: "current_2026", type: "exception", text: "Die gesetzliche Höchstgrenze von zweitausend Euro ist nicht automatisch die verhängte Geldbuße.", sourceKey: "wogg-37", passageKey: "wogg-37-all", riskLevel: "high" },
  { key: "late-not-criminal-fraud", category: "sanction", temporal: "current_2026", type: "exception", text: "Eine verspätete Mitteilung ist nicht automatisch strafbarer Betrug. § 37 betrifft die wohngeldrechtliche Ordnungswidrigkeit.", sourceKey: "wogg-37", passageKey: "wogg-37-all", riskLevel: "high" },
  { key: "mistake-not-deception", category: "sanction", temporal: "current_2026", type: "exception", text: "Ein Irrtum ist nicht automatisch vorsätzliche Täuschung. Vorsatz oder Leichtfertigkeit sind Tatbestandsmerkmale.", sourceKey: "wogg-37", passageKey: "wogg-37-all", riskLevel: "high" },
  { key: "individual-sanction-fail-closed", category: "sanction", temporal: "current_2026", type: "exception", text: "Ein individuelles Bußgeld oder ein Strafergebnis darf ohne konkreten Bescheid, Tatsachen und Verfahren nicht genannt werden.", sourceKey: "wogg-37", passageKey: "wogg-37-all", riskLevel: "high", requiredContextKeys: ["PROCESS_VARIANT", "EVENT_DATE"] },
  { key: "letter-not-always-bewilligung", category: "bescheid", temporal: "current_2026", type: "exception", text: "Ein Wohngeldschreiben ist nicht immer ein Bewilligungsbescheid. Es kann Ablehnung, Änderung, Vorläufigkeit, Rückforderung oder eine Mitwirkungsaufforderung sein.", sourceKey: "wogg-24", passageKey: "wogg-24-all", riskLevel: "high" },
  { key: "evidence-request-not-rejection", category: "bescheid", temporal: "current_2026", type: "exception", text: "Eine Unterlagenanforderung der Wohngeldbehörde ist nicht die Ablehnung. Sie ist ein Verfahrensschritt vor der Entscheidung.", sourceKey: "wogg-23", passageKey: "wogg-23-all", riskLevel: "medium" },
  { key: "different-amount-not-error", category: "bescheid", temporal: "current_2026", type: "exception", text: "Ein anderer berechneter Betrag als erwartet ist nicht automatisch ein Behördenfehler. Relevante Miete, Höchstbetrag und Einkommen können abweichen.", sourceKey: "wogg-19", passageKey: "wogg-19-all", riskLevel: "high" },
  { key: "inspect-bescheid-structure", category: "bescheid", temporal: "current_2026", type: "procedure", text: "Im Bescheid sind Zeitraum, berücksichtigte Haushaltsmitglieder, relevantes Einkommen, relevante Miete oder Belastung, Mietenstufe, Betrag, Gründe und Rechtsbehelfsbelehrung zu lesen.", sourceKey: "wogg-24", passageKey: "wogg-24-all", riskLevel: "medium" },
  { key: "land-specific-remedy", category: "legal_remedy", temporal: "current_2026", type: "procedure", text: "Der Rechtsbehelf folgt der Rechtsbehelfsbelehrung und dem Landesverfahrensrecht. Wohngeld wird von Landes- und Kommunalbehörden ausgeführt.", sourceKey: "wogg-24", passageKey: "wogg-24-all", riskLevel: "high" },
  { key: "read-belehrung", category: "legal_remedy", temporal: "current_2026", type: "duty", text: "Ob Widerspruch oder unmittelbarer Klageweg gilt, ergibt sich aus der konkreten Rechtsbehelfsbelehrung und dem zuständigen Land.", sourceKey: "wogg-24", passageKey: "wogg-24-all", riskLevel: "high" },
  { key: "document-date-not-deadline", category: "legal_remedy", temporal: "current_2026", type: "exception", text: "Das Datum auf dem Schreiben ist nicht automatisch der Beginn der Rechtsbehelfsfrist. Maßgeblich ist die Bekanntgabe und die Belehrung.", sourceKey: "wogg-24", passageKey: "wogg-24-all", riskLevel: "high" },
  { key: "disagreement-not-auto-appeal", category: "legal_remedy", temporal: "current_2026", type: "exception", text: "Uneinigkeit mit dem Wohngeldbetrag ist nicht automatisch die Empfehlung, Rechtsbehelf einzulegen.", sourceKey: "wogg-24", passageKey: "wogg-24-all", riskLevel: "high" },
  { key: "not-automatically-sozialgericht", category: "legal_remedy", temporal: "current_2026", type: "exception", text: "Wohngeld führt nicht automatisch zur Sozialgerichtsbarkeit. Der Rechtsweg richtet sich nach der Belehrung und dem zuständigen Verfahren.", sourceKey: "wogg-24", passageKey: "wogg-24-all", riskLevel: "high" },
  { key: "individual-remedy-fail-closed", category: "legal_remedy", temporal: "current_2026", type: "exception", text: "Eine individuelle Rechtsbehelfsfrist oder der genaue Weg im Wohngeld darf ohne Bescheidart, Bekanntgabe und Rechtsbehelfsbelehrung nicht genannt werden.", sourceKey: "wogg-24", passageKey: "wogg-24-all", riskLevel: "high", requiredContextKeys: ["BUNDESLAND", "EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "land-designates-authority", category: "competence", temporal: "current_2026", type: "definition", text: "Zuständig sind die nach Landesrecht bestimmten Stellen als Wohngeldbehörde. Das Bundesrecht definiert Wohngeld, nicht die örtliche Behörde.", sourceKey: "wogg-24", passageKey: "wogg-24-all", riskLevel: "medium" },
  { key: "dwelling-locality", category: "competence", temporal: "current_2026", type: "procedure", text: "Die zuständige Wohngeldbehörde richtet sich nach dem Ort des Wohnraums oder der selbst genutzten Immobilie.", sourceKey: "bmwsb-plus", passageKey: "bmwsb-plus-all", riskLevel: "high", requiredContextKeys: ["MUNICIPALITY"] },
  { key: "locale-not-authority", category: "competence", temporal: "current_2026", type: "exception", text: "userLocale, Sprache oder Staatsangehörigkeit bestimmen nicht die Wohngeldbehörde.", sourceKey: "wogg-24", passageKey: "wogg-24-all", riskLevel: "high" },
  { key: "land-alone-not-enough", category: "competence", temporal: "current_2026", type: "exception", text: "Das Land allein ersetzt nicht die örtliche Wohngeldbehörde, wenn die Landesausführung kommunal feiner gegliedert ist.", sourceKey: "wogg-24", passageKey: "wogg-24-all", riskLevel: "high" },
  { key: "employer-not-authority", category: "competence", temporal: "current_2026", type: "exception", text: "Der Arbeitsort des Arbeitgebers bestimmt nicht die Wohngeldbehörde.", sourceKey: "wogg-24", passageKey: "wogg-24-all", riskLevel: "medium" },
  { key: "live-lookup-authority", category: "competence", temporal: "current_2026", type: "procedure", text: "Aktuelle Anschrift, Onlineweg und Formulare der zuständigen Wohngeldbehörde sind live über das Bundesportal und die örtliche Verwaltung zu ermitteln.", sourceKey: "bundesportal", passageKey: "bundesportal-all", riskLevel: "high", requiredContextKeys: ["MUNICIPALITY"] },
  { key: "userlocale-not-jurisdiction", category: "competence", temporal: "current_2026", type: "exception", text: "userLocale bestimmt weder Wohngeldrecht noch Mietenstufe noch die zuständige Wohngeldbehörde.", sourceKey: "wogg-24", passageKey: "wogg-24-all", riskLevel: "high" },
  { key: "member-abroad-needs-facts", category: "cross_border", temporal: "current_2026", type: "exception", text: "Ein Haushaltsmitglied im Ausland, ein Zweitwohnsitz oder grenzüberschreitende Arbeit darf ohne Aufenthalt, Mittelpunkt und Einkommenslage nicht pauschal entschieden werden.", sourceKey: "wogg-5", passageKey: "wogg-5-all", riskLevel: "high", requiredContextKeys: ["COUNTRY", "RESIDENCE_STATE", "PROCESS_VARIANT"] },
  { key: "german-anmeld-not-complete", category: "cross_border", temporal: "current_2026", type: "exception", text: "Eine deutsche Anmeldung beweist nicht vollständig Wohngeldberechtigung, Statuslage und Haushaltszugehörigkeit.", sourceKey: "wogg-3", passageKey: "wogg-3-all", riskLevel: "high" },
  { key: "application-not-approval", category: "application", temporal: "current_2026", type: "exception", text: "Der Antrag ist nicht automatisch die Bewilligung. Die Behörde prüft Voraussetzungen und berechnet nach § 19.", sourceKey: "wogg-22", passageKey: "wogg-22-all", riskLevel: "medium" },
  { key: "federal-vs-local-checklist", category: "application", temporal: "current_2026", type: "exception", text: "Bundesrecht bestimmt, welche Tatsachen für Wohngeld erheblich sind. Eine kommunale Checkliste darf nicht als bundesweite Pflichtliste verallgemeinert werden.", sourceKey: "bmwsb-faq", passageKey: "bmwsb-faq-all", riskLevel: "medium" },
]);

export const WOG_PROCESSES: readonly WogProcessSpec[] = Object.freeze([
  { key: "wohngeld-einordnen", title: "Wohngeld einordnen 2026", trigger: "Gefragt ist, was Wohngeld ist oder ob es nur für Mietende gilt", safeFirstStep: "Zweck, Mietzuschuss und Lastenzuschuss erklären; Niedrigeinkommen, Arbeitslosigkeit oder hohe Miete nicht als Automatismus behandeln.", riskLevel: "medium" },
  { key: "zuschussart-bestimmen", title: "Mietzuschuss oder Lastenzuschuss bestimmen 2026", trigger: "Unklar ist, ob Miete oder Eigentumsbelastung maßgeblich ist", safeFirstStep: "Selbstnutzung und Rechtsposition am Wohnraum klären; Eigentum nicht automatisch ausschließen und nicht automatisch Lastenzuschuss annehmen.", riskLevel: "high" },
  { key: "haushaltsmitglieder-bestimmen", title: "Haushaltsmitglieder bestimmen 2026", trigger: "Haushalt, WG, Ehe oder getrenntes Kind sind unklar", safeFirstStep: "Gesetzliche Beziehung und Mittelpunkt der Lebensbeziehungen prüfen; dieselbe Anschrift nicht automatisch als einen Wohngeldhaushalt behandeln.", riskLevel: "high" },
  { key: "ausschluesse-andere-leistungen", title: "Ausschlüsse und andere Leistungen prüfen 2026", trigger: "Eine andere Sozialleistung, Kindergeld oder Arbeitslosengeld wird mit Wohngeld vermengt", safeFirstStep: "Nur den gesetzlichen Ausschlusskatalog prüfen; irgendeine Leistung nicht als Ausschluss behandeln.", riskLevel: "high" },
  { key: "aufenthalt-status-gate", title: "Aufenthalts- und Ausländerstatus prüfen 2026", trigger: "Staatsangehörigkeit, Titel, Duldung oder Freizügigkeit ist angesprochen", safeFirstStep: "Tatsächlichen Aufenthalt und die Lage nach § 3 Absatz 5 klären; ins Aufenthaltspaket weiterleiten und nicht das Einwanderungsrecht verdoppeln.", riskLevel: "high" },
  { key: "miete-einordnen", title: "Miete einordnen 2026", trigger: "Warmmiete, Kaltmiete oder Heizkosten sollen gerechnet werden", safeFirstStep: "Vereinbartes Entgelt und gesetzlich ausgenommene Bestandteile trennen; Warmmiete nicht als wohngeldrelevante Miete behandeln.", riskLevel: "high" },
  { key: "belastung-einordnen", title: "Belastung einordnen 2026", trigger: "Eigentum, Kreditrate oder Lastenzuschuss ist angesprochen", safeFirstStep: "Selbstnutzung und Lastenberechnung erklären; die Kreditrate nicht als identische Belastung behandeln.", riskLevel: "high" },
  { key: "einkommen-einordnen", title: "Einkommen einordnen 2026", trigger: "Gehalt, Steuerbescheid oder ausländische Einkünfte sollen das Wohngeldeinkommen ersetzen", safeFirstStep: "Erwartetes Jahreseinkommen, Abzüge und Freibeträge erklären; Netto, Brutto und Steuerfestsetzung nicht gleichsetzen.", riskLevel: "high" },
  { key: "mietenstufe-parameter", title: "Mietenstufe und Berechnungsparameter bestimmen 2026", trigger: "Mietenstufe, Höchstbetrag oder ein genauer Wohngeldbetrag ist gefragt", safeFirstStep: "Die genaue Gemeinde verlangen; Stufe nicht aus Land, Postleitzahl oder userLocale raten und keinen individuellen Betrag ohne vollständige Tatsachen nennen.", riskLevel: "high" },
  { key: "antrag-vorbereiten", title: "Wohngeldantrag vorbereiten 2026", trigger: "Unterlagen für den Erstantrag sollen gesammelt werden", safeFirstStep: "Identität, Haushalt, Wohnkosten oder Belastung und Einkommen erfassen; eine kommunale Checkliste nicht bundesweit verallgemeinern.", riskLevel: "medium" },
  { key: "antrag-stellen", title: "Wohngeldantrag stellen 2026", trigger: "Der Antrag soll gestellt oder der Beginn des Anspruchs geklärt werden", safeFirstStep: "Die zuständige Wohngeldbehörde bestimmen, den Antrag nachweisen und den Ersten des Antragsmonats erklären.", riskLevel: "high" },
  { key: "unterlagen-nachreichen", title: "Unterlagen nachreichen 2026", trigger: "Die Behörde fordert Nachweise nach", safeFirstStep: "Die gesetzte Frist und die angeforderten Unterlagen identifizieren; Nachforderung nicht als Betrugsverdacht behandeln.", riskLevel: "high" },
  { key: "vorlaeufige-zahlung", title: "Vorläufige Zahlung klären 2026", trigger: "Lange Bearbeitung oder vorläufige Zahlung ist angesprochen", safeFirstStep: "Beide Voraussetzungen des § 26a prüfen; lange Dauer nicht als automatisches Recht und Vorläufigkeit nicht als endgültige Festsetzung behandeln.", riskLevel: "high" },
  { key: "bescheid-verstehen", title: "Wohngeldbescheid verstehen 2026", trigger: "Ein Wohngeldschreiben ist eingegangen", safeFirstStep: "Bescheidart, Zeitraum, Haushalt, Einkommen, Miete oder Belastung, Mietenstufe und Belehrung lesen; Abweichung nicht automatisch als Fehler behandeln.", riskLevel: "high" },
  { key: "zahlung-bewilligungszeitraum", title: "Zahlung und Bewilligungszeitraum 2026", trigger: "Auszahlung, Dauer oder Konto ist gefragt", safeFirstStep: "Monatliche Vorauszahlung und die Soll-Dauer von zwölf Monaten erklären; 24 Monate und dauerhafte Bewilligung nicht als Automatismus behandeln.", riskLevel: "medium" },
  { key: "leistungssteigernde-aenderung", title: "Leistungssteigernde Änderung beantragen 2026", trigger: "Haushalt wächst, Miete steigt oder Einkommen sinkt", safeFirstStep: "Die 10-Prozent-Antragsschwellen von den 15-Prozent-Meldepflichten trennen und einen Antrag nach § 27 Absatz 1 prüfen.", riskLevel: "high" },
  { key: "meldepflichtige-aenderung", title: "Meldepflichtige Änderung melden 2026", trigger: "Haushalt schrumpft, Miete sinkt oder Einkommen steigt", safeFirstStep: "Die 15-Prozent-Mitteilungspflichten erklären; 10 Prozent nicht mit 15 Prozent gleichsetzen.", riskLevel: "high" },
  { key: "umzug-wohnung-aufgegeben", title: "Umzug oder Wohnung aufgegeben 2026", trigger: "Umzug, Ummeldung oder Aufgabe der Wohnung ist angesprochen", safeFirstStep: "Unwirksamkeit des alten Bescheids erklären; Anmeldung nicht als automatische Übertragung behandeln.", riskLevel: "high" },
  { key: "weiterleistung", title: "Weiterleistung beantragen 2026", trigger: "Der Bewilligungszeitraum endet oder ein Folgeantrag ist gefragt", safeFirstStep: "Weiterleistungsantrag und die Zwei-Monats-Zeitfiktion erklären; bestehende Bewilligung nicht als Dauerzustand behandeln.", riskLevel: "high" },
  { key: "ueberzahlung-rueckforderung", title: "Überzahlung und Rückforderung 2026", trigger: "Rückforderung, Zahlungseinstellung oder Datenabgleich ist angesprochen", safeFirstStep: "Rechtsgrundlage und Bescheidart verlangen; Überzahlung nicht als Betrug und Einstellung nicht als endgültige Aufhebung behandeln.", riskLevel: "high" },
  { key: "rechtsbehelf-einordnen", title: "Rechtsbehelf sicher einordnen 2026", trigger: "Uneinigkeit mit einem Wohngeldbescheid oder eine Frist ist angesprochen", safeFirstStep: "Bescheid und Rechtsbehelfsbelehrung lesen; Dokumentdatum nicht als Frist und Sozialgericht nicht automatisch annehmen.", riskLevel: "high" },
  { key: "wohngeldbehoerde-bestimmen", title: "Zuständige Wohngeldbehörde bestimmen 2026", trigger: "Die örtliche Stelle, ein Onlineweg oder Formulare sind gefragt", safeFirstStep: "Wohnort live im Bundesportal suchen; Sprache, Staatsangehörigkeit oder allein das Land nicht als Zuständigkeit behandeln.", riskLevel: "high" },
  { key: "bafoeg-bab-boundary", title: "BAföG- und BAB-Grenze 2026", trigger: "Studium, BAföG oder Berufsausbildungsbeihilfe ist angesprochen", safeFirstStep: "Dem-Grunde-nach-Förderung und Haushaltsstruktur prüfen; Studierendenstatus oder einen Betrag von null nicht als Automatismus behandeln.", riskLevel: "high" },
  { key: "grundsicherungsgeld-boundary", title: "Grundsicherungsgeld-Grenze 2026", trigger: "Jobcenter, Grundsicherungsgeld oder ein laufendes Transferverfahren ist angesprochen", safeFirstStep: "Ausschluss bei berücksichtigten Unterkunftskosten erklären und ins Grundsicherungsgeldpaket weiterleiten; Antrag nicht mit Empfang gleichsetzen.", riskLevel: "high" },
]);

export const WOG_FORMS: readonly WogFormSpec[] = Object.freeze([
  { key: "antrag-mietzuschuss", name: "Wohngeldantrag Mietzuschuss", identifier: "WoGG-Antrag-Mietzuschuss", purpose: "Erstantrag auf Mietzuschuss bei der zuständigen Wohngeldbehörde", submissionChannels: ["online", "written"], sourceKey: "bmwsb-plus", passageKey: "bmwsb-plus-all" },
  { key: "antrag-lastenzuschuss", name: "Wohngeldantrag Lastenzuschuss", identifier: "WoGG-Antrag-Lastenzuschuss", purpose: "Erstantrag auf Lastenzuschuss für selbst genutzten Wohnraum", submissionChannels: ["online", "written"], sourceKey: "bmwsb-plus", passageKey: "bmwsb-plus-all" },
  { key: "weiterleistung-antrag", name: "Weiterleistungsantrag", identifier: "WoGG-Weiterleistungsantrag", purpose: "Antrag für die Zeit nach Ablauf des laufenden Bewilligungszeitraums", submissionChannels: ["online", "written"], sourceKey: "wogg-22", passageKey: "wogg-22-all" },
  { key: "aenderung-antrag", name: "Antrag auf Neubewilligung bei Erhöhung", identifier: "WoGG-Aenderung-Antrag", purpose: "Antrag nach § 27 Absatz 1 bei leistungssteigernder Änderung", submissionChannels: ["online", "written"], sourceKey: "wogg-27", passageKey: "wogg-27-all" },
  { key: "vorlaeufig-antrag", name: "Antrag auf vorläufige Zahlung", identifier: "WoGG-Vorlaeufige-Zahlung", purpose: "Antrag auf vorläufige Zahlung nach § 26a", submissionChannels: ["online", "written"], sourceKey: "wogg-26a", passageKey: "wogg-26a-all" },
  { key: "nachreichung", name: "Nachreichung angeforderter Unterlagen", identifier: "WoGG-Nachreichung", purpose: "Nachreichung von Nachweisen auf Anforderung der Wohngeldbehörde", submissionChannels: ["online", "written"], sourceKey: "wogg-23", passageKey: "wogg-23-all" },
  { key: "aenderung-mitteilung", name: "Mitteilung einer Änderung", identifier: "WoGG-Mitteilung-Aenderung", purpose: "Unverzügliche Mitteilung meldepflichtiger Änderungen oder Nutzungsaufgabe", submissionChannels: ["online", "written"], sourceKey: "wogg-27", passageKey: "wogg-27-all" },
]);

export const WOG_PROCESS_BINDINGS: readonly WogBindingSpec[] = Object.freeze([
  { processKey: "wohngeld-einordnen", role: "orientation_basis", sequenceContext: "what", claimKeys: ["wohngeld-purpose", "mietzuschuss-vs-lastenzuschuss", "self-used-wohnraum", "wohnraum-definition"] },
  { processKey: "wohngeld-einordnen", role: "negative_control", sequenceContext: "not", claimKeys: ["wohngeld-not-only-tenants", "tenant-not-automatic-eligible", "low-income-not-automatic", "high-rent-not-automatic", "working-not-excluded", "unemployed-not-automatic", "calculator-not-bescheid"] },
  { processKey: "zuschussart-bestimmen", role: "orientation_basis", sequenceContext: "art", claimKeys: ["mietzuschuss-who", "lastenzuschuss-who", "multiple-berechtigte-one"] },
  { processKey: "zuschussart-bestimmen", role: "negative_control", sequenceContext: "art_not", qualificationRequired: true, claimKeys: ["owner-not-automatic-excluded", "owner-not-automatic-lastenzuschuss", "tenant-not-lastenzuschuss", "investment-property-not-lastenzuschuss", "zuschussart-needs-facts"] },
  { processKey: "haushaltsmitglieder-bestimmen", role: "orientation_basis", sequenceContext: "haushalt", claimKeys: ["hm-berechtigte-mittelpunkt", "spouse-partner-not-separated", "responsibility-partnership", "relatives-shared", "pflege-members", "shared-child-both-parents", "death-12-months", "mixed-excluded-share-miete"] },
  { processKey: "haushaltsmitglieder-bestimmen", role: "negative_control", sequenceContext: "haushalt_not", qualificationRequired: true, claimKeys: ["same-address-not-automatically-household", "roommate-not-automatically-hm", "wg-not-automatically-one", "married-not-enough-alone", "household-needs-facts"] },
  { processKey: "ausschluesse-andere-leistungen", role: "orientation_basis", sequenceContext: "ausschluss", claimKeys: ["gsg-excluded-if-kdu", "loan-only-not-excluded", "vermeidung-hilfebeduerftigkeit-exception", "asylblg-interface", "sgb12-interface", "all-excluded-no-claim"] },
  { processKey: "ausschluesse-andere-leistungen", role: "negative_control", sequenceContext: "ausschluss_not", qualificationRequired: true, claimKeys: ["gsg-not-always-combinable", "gsg-pending-not-same-as-final", "alg-not-automatic-exclusion", "kindergeld-not-automatic-exclusion", "any-benefit-not-exclusion", "savings-not-automatic-exclusion", "car-not-automatic-exclusion", "assets-threshold-not-invented", "significant-assets-abuse"] },
  { processKey: "aufenthalt-status-gate", role: "orientation_basis", sequenceContext: "status", claimKeys: ["foreign-actual-stay-plus-category", "freizueg-eu-category", "titel-or-duldung", "gestattung-category", "treaty-residence", "title-exempt-verordnung", "search-titles-generally-excluded", "social-security-treaty-exclusion"] },
  { processKey: "aufenthalt-status-gate", role: "negative_control", sequenceContext: "status_not", qualificationRequired: true, claimKeys: ["duldung-not-automatic-exclusion", "foreign-nationality-not-exclusion", "eu-citizen-not-automatic-approval", "aufenthaltstitel-not-automatic", "anmeld-not-wohngeld-status", "exact-status-required", "aufenthalt-pack-separate"] },
  { processKey: "miete-einordnen", role: "orientation_basis", sequenceContext: "miete", claimKeys: ["miete-is-agreed-entgelt", "heating-hotwater-excluded-from-miete", "household-energy-excluded", "garage-excluded", "extra-services-excluded", "relevant-m-capped"] },
  { processKey: "miete-einordnen", role: "negative_control", sequenceContext: "miete_not", claimKeys: ["warmmiete-not-automatically-m", "kaltmiete-not-automatically-m", "contract-amount-not-automatically-relevant", "heating-bill-not-heizkostenkomponente"] },
  { processKey: "belastung-einordnen", role: "orientation_basis", sequenceContext: "last", claimKeys: ["lastenzuschuss-who", "belastung-kapital-bewirtschaftung", "lastenberechnung-by-authority"] },
  { processKey: "belastung-einordnen", role: "negative_control", sequenceContext: "last_not", claimKeys: ["mortgage-not-automatically-belastung", "owner-not-automatic-lastenzuschuss", "investment-property-not-lastenzuschuss"] },
  { processKey: "einkommen-einordnen", role: "orientation_basis", sequenceContext: "eink", claimKeys: ["gesamteinkommen-definition", "jahres-expected-in-bewilligung", "prior-as-evidence", "deductions-10pct-structure", "freibetrag-structure", "household-member-income"] },
  { processKey: "einkommen-einordnen", role: "negative_control", sequenceContext: "eink_not", qualificationRequired: true, claimKeys: ["net-not-gesamteinkommen", "gross-not-wohngeld-amount", "taxable-not-identical", "monthly-salary-not-jahres", "one-off-not-always-ignored", "foreign-income-not-ignored", "est-pack-separate", "low-income-not-automatic-rejection", "livelihood-explanation-may-be-needed"] },
  { processKey: "mietenstufe-parameter", role: "orientation_basis", sequenceContext: "stufe", claimKeys: ["mietenstufe-i-vii-structure", "municipality-required", "lookup-cache-revalidate", "heizkosten-is-statutory-table", "klima-is-statutory-table", "formula-structure-not-individual"] },
  { processKey: "mietenstufe-parameter", role: "context_gate", sequenceContext: "stufe_not", qualificationRequired: true, claimKeys: ["not-from-land", "not-from-plz", "not-from-locale", "not-from-rent-amount", "current-euro-not-timeless", "individual-amount-fail-closed", "calculator-not-bescheid"] },
  { processKey: "antrag-vorbereiten", role: "required_information", sequenceContext: "docs", claimKeys: ["collect-min-info", "identify-type", "federal-vs-local-checklist"] },
  { processKey: "antrag-vorbereiten", role: "negative_control", sequenceContext: "docs_not", claimKeys: ["form-not-always-formfrei", "do-not-fabricate"] },
  { processKey: "antrag-stellen", role: "application_route", sequenceContext: "antrag", claimKeys: ["application-required", "only-on-application", "mid-month-starts-first", "section-25-transfer-timing", "missing-docs-later"] },
  { processKey: "antrag-stellen", role: "negative_control", sequenceContext: "antrag_not", claimKeys: ["application-not-approval", "move-in-not-automatic-start", "eligibility-not-paid-without-application", "late-next-month-not-retro-previous", "processing-no-promise"] },
  { processKey: "unterlagen-nachreichen", role: "evidence_requirement", sequenceContext: "nach", claimKeys: ["auskunftspflicht", "missing-docs-later", "do-not-fabricate"] },
  { processKey: "unterlagen-nachreichen", role: "negative_control", sequenceContext: "nach_not", claimKeys: ["evidence-request-not-fraud", "missing-one-doc-not-always-rejection", "data-matching-not-criminal", "evidence-request-not-rejection"] },
  { processKey: "vorlaeufige-zahlung", role: "application_route", sequenceContext: "vorl", claimKeys: ["preliminary-conditions"] },
  { processKey: "vorlaeufige-zahlung", role: "negative_control", sequenceContext: "vorl_not", claimKeys: ["long-processing-not-automatic-preliminary", "preliminary-not-final", "preliminary-amount-not-guaranteed"] },
  { processKey: "bescheid-verstehen", role: "decision", sequenceContext: "bescheid", claimKeys: ["written-bescheid-required", "inspect-bescheid-structure"] },
  { processKey: "bescheid-verstehen", role: "negative_control", sequenceContext: "bescheid_not", claimKeys: ["letter-not-always-bewilligung", "evidence-request-not-rejection", "different-amount-not-error", "calculator-not-bescheid"] },
  { processKey: "zahlung-bewilligungszeitraum", role: "payment", sequenceContext: "zahlung", claimKeys: ["ordinary-12-months", "monthly-in-advance", "payment-to-other-possible"] },
  { processKey: "zahlung-bewilligungszeitraum", role: "negative_control", sequenceContext: "zahlung_not", claimKeys: ["not-permanent", "twelve-not-universal", "twentyfour-not-automatic"] },
  { processKey: "leistungssteigernde-aenderung", role: "application_route", sequenceContext: "plus10", claimKeys: ["increase-household-on-application", "increase-rent-over-10", "decrease-income-over-10"] },
  { processKey: "leistungssteigernde-aenderung", role: "negative_control", sequenceContext: "plus10_not", claimKeys: ["ten-not-fifteen", "rent-plus-10-not-same-as-minus-15", "member-joins-not-same-as-leaves"] },
  { processKey: "meldepflichtige-aenderung", role: "deadline_gate", sequenceContext: "plus15", claimKeys: ["report-household-decrease", "report-rent-minus-15", "report-income-plus-15"] },
  { processKey: "meldepflichtige-aenderung", role: "negative_control", sequenceContext: "plus15_not", claimKeys: ["ten-not-fifteen", "income-plus-10-not-same", "rent-plus-10-not-same-as-minus-15", "member-joins-not-same-as-leaves"] },
  { processKey: "umzug-wohnung-aufgegeben", role: "next_state", sequenceContext: "umzug", claimKeys: ["unused-dwelling-ineffective", "report-move"] },
  { processKey: "umzug-wohnung-aufgegeben", role: "negative_control", sequenceContext: "umzug_not", claimKeys: ["old-not-transfer", "anmeld-not-auto-resolve-move", "anmeld-pack-separate"] },
  { processKey: "weiterleistung", role: "application_route", sequenceContext: "weiter", claimKeys: ["early-two-months-timing", "updated-facts-for-continuation"] },
  { processKey: "weiterleistung", role: "negative_control", sequenceContext: "weiter_not", claimKeys: ["not-automatic-continue", "not-permanent"] },
  { processKey: "ueberzahlung-rueckforderung", role: "decision", sequenceContext: "rueck", claimKeys: ["recovery-needs-bescheid", "household-liability", "anhoerung-when-not-from-user", "bagatelle-expired-not-current"] },
  { processKey: "ueberzahlung-rueckforderung", role: "negative_control", sequenceContext: "rueck_not", claimKeys: ["overpayment-not-fraud", "mismatch-not-misconduct", "payment-stop-not-final", "no-payment-not-bescheid-ended", "data-matching-not-criminal", "owi-framework", "up-to-2000-not-automatic", "late-not-criminal-fraud", "mistake-not-deception", "individual-sanction-fail-closed"] },
  { processKey: "rechtsbehelf-einordnen", role: "legal_remedy_gate", sequenceContext: "rb", qualificationRequired: true, claimKeys: ["land-specific-remedy", "read-belehrung"] },
  { processKey: "rechtsbehelf-einordnen", role: "deadline_gate", sequenceContext: "rb_frist", qualificationRequired: true, claimKeys: ["document-date-not-deadline", "disagreement-not-auto-appeal", "not-automatically-sozialgericht", "individual-remedy-fail-closed"] },
  { processKey: "wohngeldbehoerde-bestimmen", role: "identification", sequenceContext: "behoerde", claimKeys: ["land-designates-authority", "dwelling-locality", "live-lookup-authority"] },
  { processKey: "wohngeldbehoerde-bestimmen", role: "negative_control", sequenceContext: "behoerde_not", qualificationRequired: true, claimKeys: ["locale-not-authority", "land-alone-not-enough", "employer-not-authority", "userlocale-not-jurisdiction", "not-from-locale"] },
  { processKey: "bafoeg-bab-boundary", role: "orientation_basis", sequenceContext: "bafoeg", claimKeys: ["bafoeg-dem-grunde-nach", "loan-bafoeg-exception", "training-start-during-bewilligung"] },
  { processKey: "bafoeg-bab-boundary", role: "negative_control", sequenceContext: "bafoeg_not", claimKeys: ["bafoeg-zero-not-eligible", "student-not-automatic-excluded", "student-not-automatic-eligible", "bafoeg-rejected-not-enough", "household-with-student-not-whole-excluded"] },
  { processKey: "grundsicherungsgeld-boundary", role: "orientation_basis", sequenceContext: "gsg", claimKeys: ["gsg-excluded-if-kdu", "excluded-can-apply-for-others", "notify-procedure-opened", "transfer-benefit-starts-may-affect"] },
  { processKey: "grundsicherungsgeld-boundary", role: "negative_control", sequenceContext: "gsg_not", claimKeys: ["gsg-not-always-combinable", "gsg-pending-not-same-as-final", "gsg-application-not-same-as-receipt", "jobcenter-pack-separate"] },
]);

export const WOG_PROCESS_SCENARIOS: readonly WogProcessScenario[] = Object.freeze([
  { id: "normal-tenant-low-income", label: "Mietender Haushalt mit niedrigem Einkommen", coverage: "COVERED", requiredClaimKeys: ["mietzuschuss-who", "low-income-not-automatic", "tenant-not-automatic-eligible"], requiredProcessKeys: ["wohngeld-einordnen", "zuschussart-bestimmen"] },
  { id: "owner-occupier", label: "Selbstnutzende Eigentümerin oder Eigentümer", coverage: "COVERED", requiredClaimKeys: ["lastenzuschuss-who", "owner-not-automatic-excluded", "owner-not-automatic-lastenzuschuss"], requiredProcessKeys: ["zuschussart-bestimmen", "belastung-einordnen"], requiredFormIdentifiers: ["WoGG-Antrag-Lastenzuschuss"] },
  { id: "high-rent", label: "Hohe Miete", coverage: "COVERED", requiredClaimKeys: ["high-rent-not-automatic", "relevant-m-capped"], requiredProcessKeys: ["miete-einordnen"] },
  { id: "uncertain-household", label: "Unklare Haushaltsstruktur", coverage: "COVERED", requiredClaimKeys: ["household-needs-facts", "same-address-not-automatically-household"], requiredProcessKeys: ["haushaltsmitglieder-bestimmen"] },
  { id: "wg-roommate", label: "WG-Mitbewohnende", coverage: "COVERED", requiredClaimKeys: ["roommate-not-automatically-hm", "wg-not-automatically-one"], requiredProcessKeys: ["haushaltsmitglieder-bestimmen"] },
  { id: "married-couple", label: "Ehepaar", coverage: "COVERED", requiredClaimKeys: ["spouse-partner-not-separated", "married-not-enough-alone"], requiredProcessKeys: ["haushaltsmitglieder-bestimmen"] },
  { id: "separated-parents-shared-child", label: "Getrennte Eltern mit gemeinsamem Kind", coverage: "COVERED", requiredClaimKeys: ["shared-child-both-parents"], requiredProcessKeys: ["haushaltsmitglieder-bestimmen"] },
  { id: "foreign-national", label: "Ausländische Staatsangehörigkeit", coverage: "COVERED", requiredClaimKeys: ["foreign-nationality-not-exclusion", "exact-status-required"], requiredProcessKeys: ["aufenthalt-status-gate"] },
  { id: "eu-citizen", label: "Unionsbürgerin oder Unionsbürger", coverage: "COVERED", requiredClaimKeys: ["freizueg-eu-category", "eu-citizen-not-automatic-approval"], requiredProcessKeys: ["aufenthalt-status-gate"] },
  { id: "duldung-status", label: "Duldung oder Gestattung", coverage: "COVERED", requiredClaimKeys: ["duldung-not-automatic-exclusion", "titel-or-duldung", "gestattung-category"], requiredProcessKeys: ["aufenthalt-status-gate"] },
  { id: "gsg-recipient", label: "Grundsicherungsgeldbeziehende Person", coverage: "COVERED", requiredClaimKeys: ["gsg-excluded-if-kdu", "gsg-not-always-combinable"], requiredProcessKeys: ["grundsicherungsgeld-boundary"] },
  { id: "alg-recipient", label: "Arbeitslosengeldbeziehende Person", coverage: "COVERED", requiredClaimKeys: ["alg-not-automatic-exclusion", "unemployed-not-automatic"], requiredProcessKeys: ["ausschluesse-andere-leistungen"] },
  { id: "kindergeld-household", label: "Haushalt mit Kindergeld", coverage: "COVERED", requiredClaimKeys: ["kindergeld-not-automatic-exclusion", "kindergeld-pack-separate"], requiredProcessKeys: ["ausschluesse-andere-leistungen"] },
  { id: "bafoeg-student", label: "Studierende Person mit BAföG", coverage: "COVERED", requiredClaimKeys: ["bafoeg-dem-grunde-nach", "student-not-automatic-excluded"], requiredProcessKeys: ["bafoeg-bab-boundary"] },
  { id: "bafoeg-zero-parental", label: "BAföG wegen Elterneinkommen null", coverage: "COVERED", requiredClaimKeys: ["bafoeg-zero-not-eligible", "bafoeg-rejected-not-enough"], requiredProcessKeys: ["bafoeg-bab-boundary"] },
  { id: "mixed-excluded-household", label: "Gemischt ausgeschlossener Haushalt", coverage: "COVERED", requiredClaimKeys: ["mixed-excluded-share-miete", "excluded-can-apply-for-others"], requiredProcessKeys: ["haushaltsmitglieder-bestimmen", "grundsicherungsgeld-boundary"] },
  { id: "income-unclear", label: "Einkommen unklar", coverage: "COVERED", requiredClaimKeys: ["jahres-expected-in-bewilligung", "net-not-gesamteinkommen"], requiredProcessKeys: ["einkommen-einordnen"] },
  { id: "foreign-income", label: "Ausländische Einkünfte", coverage: "COVERED", requiredClaimKeys: ["foreign-income-not-ignored", "member-abroad-needs-facts"], requiredProcessKeys: ["einkommen-einordnen"] },
  { id: "rent-components-unclear", label: "Mietbestandteile unklar", coverage: "COVERED", requiredClaimKeys: ["warmmiete-not-automatically-m", "contract-amount-not-automatically-relevant"], requiredProcessKeys: ["miete-einordnen"] },
  { id: "heating-confused", label: "Heizkosten mit relevanter Miete verwechselt", coverage: "COVERED", requiredClaimKeys: ["heating-bill-not-heizkostenkomponente", "heizkosten-is-statutory-table"], requiredProcessKeys: ["miete-einordnen", "mietenstufe-parameter"] },
  { id: "municipality-unknown", label: "Gemeinde oder Mietenstufe unbekannt", coverage: "COVERED", requiredClaimKeys: ["municipality-required", "not-from-land", "lookup-cache-revalidate"], requiredProcessKeys: ["mietenstufe-parameter"] },
  { id: "first-application", label: "Erstantrag", coverage: "COVERED", requiredClaimKeys: ["application-required", "mid-month-starts-first"], requiredProcessKeys: ["antrag-stellen"], requiredFormIdentifiers: ["WoGG-Antrag-Mietzuschuss"] },
  { id: "incomplete-application", label: "Unvollständiger Antrag", coverage: "COVERED", requiredClaimKeys: ["missing-docs-later", "missing-one-doc-not-always-rejection"], requiredProcessKeys: ["antrag-stellen", "unterlagen-nachreichen"] },
  { id: "evidence-request", label: "Nachforderung von Unterlagen", coverage: "COVERED", requiredClaimKeys: ["evidence-request-not-fraud", "do-not-fabricate"], requiredProcessKeys: ["unterlagen-nachreichen"], requiredFormIdentifiers: ["WoGG-Nachreichung"] },
  { id: "long-processing", label: "Lange Bearbeitung", coverage: "COVERED", requiredClaimKeys: ["processing-no-promise", "long-processing-not-automatic-preliminary"], requiredProcessKeys: ["antrag-stellen", "vorlaeufige-zahlung"] },
  { id: "preliminary-payment", label: "Vorläufige Zahlung", coverage: "COVERED", requiredClaimKeys: ["preliminary-conditions", "preliminary-not-final"], requiredProcessKeys: ["vorlaeufige-zahlung"], requiredFormIdentifiers: ["WoGG-Vorlaeufige-Zahlung"] },
  { id: "approval", label: "Bewilligung", coverage: "COVERED", requiredClaimKeys: ["inspect-bescheid-structure", "ordinary-12-months"], requiredProcessKeys: ["bescheid-verstehen", "zahlung-bewilligungszeitraum"] },
  { id: "rejection", label: "Ablehnung", coverage: "COVERED", requiredClaimKeys: ["letter-not-always-bewilligung", "application-not-approval"], requiredProcessKeys: ["bescheid-verstehen"] },
  { id: "amount-differs", label: "Betrag weicht von der Erwartung ab", coverage: "COVERED", requiredClaimKeys: ["different-amount-not-error", "calculator-not-bescheid"], requiredProcessKeys: ["bescheid-verstehen"] },
  { id: "income-decreases-over-10", label: "Einkommen sinkt um mehr als 10 Prozent", coverage: "COVERED", requiredClaimKeys: ["decrease-income-over-10", "ten-not-fifteen"], requiredProcessKeys: ["leistungssteigernde-aenderung"], requiredFormIdentifiers: ["WoGG-Aenderung-Antrag"] },
  { id: "income-increases-over-15", label: "Einkommen steigt um mehr als 15 Prozent", coverage: "COVERED", requiredClaimKeys: ["report-income-plus-15", "income-plus-10-not-same"], requiredProcessKeys: ["meldepflichtige-aenderung"], requiredFormIdentifiers: ["WoGG-Mitteilung-Aenderung"] },
  { id: "rent-increases-over-10", label: "Miete steigt um mehr als 10 Prozent", coverage: "COVERED", requiredClaimKeys: ["increase-rent-over-10", "rent-plus-10-not-same-as-minus-15"], requiredProcessKeys: ["leistungssteigernde-aenderung"] },
  { id: "rent-decreases-over-15", label: "Miete sinkt um mehr als 15 Prozent", coverage: "COVERED", requiredClaimKeys: ["report-rent-minus-15", "ten-not-fifteen"], requiredProcessKeys: ["meldepflichtige-aenderung"] },
  { id: "household-member-joins", label: "Haushaltsmitglied kommt hinzu", coverage: "COVERED", requiredClaimKeys: ["increase-household-on-application", "member-joins-not-same-as-leaves"], requiredProcessKeys: ["leistungssteigernde-aenderung"] },
  { id: "household-member-leaves", label: "Haushaltsmitglied scheidet aus", coverage: "COVERED", requiredClaimKeys: ["report-household-decrease", "member-joins-not-same-as-leaves"], requiredProcessKeys: ["meldepflichtige-aenderung"] },
  { id: "transfer-benefit-begins", label: "Ausschlussleistung beginnt", coverage: "COVERED", requiredClaimKeys: ["transfer-benefit-starts-may-affect", "notify-procedure-opened", "gsg-application-not-same-as-receipt"], requiredProcessKeys: ["grundsicherungsgeld-boundary"] },
  { id: "move-new-apartment", label: "Umzug in eine neue Wohnung", coverage: "COVERED", requiredClaimKeys: ["old-not-transfer", "unused-dwelling-ineffective", "anmeld-not-auto-resolve-move"], requiredProcessKeys: ["umzug-wohnung-aufgegeben"] },
  { id: "continuation-application", label: "Weiterleistungsantrag", coverage: "COVERED", requiredClaimKeys: ["not-automatic-continue", "early-two-months-timing"], requiredProcessKeys: ["weiterleistung"], requiredFormIdentifiers: ["WoGG-Weiterleistungsantrag"] },
  { id: "overpayment", label: "Überzahlung", coverage: "COVERED", requiredClaimKeys: ["overpayment-not-fraud", "recovery-needs-bescheid"], requiredProcessKeys: ["ueberzahlung-rueckforderung"] },
  { id: "payment-stopped", label: "Zahlung eingestellt", coverage: "COVERED", requiredClaimKeys: ["payment-stop-not-final", "no-payment-not-bescheid-ended"], requiredProcessKeys: ["ueberzahlung-rueckforderung"] },
  { id: "recovery-demand", label: "Rückforderungsbescheid", coverage: "COVERED", requiredClaimKeys: ["recovery-needs-bescheid", "household-liability"], requiredProcessKeys: ["ueberzahlung-rueckforderung"] },
  { id: "legal-remedy-unclear", label: "Rechtsbehelfsweg unklar", coverage: "COVERED", requiredClaimKeys: ["individual-remedy-fail-closed", "document-date-not-deadline", "not-automatically-sozialgericht"], requiredProcessKeys: ["rechtsbehelf-einordnen"] },
  { id: "authority-unknown", label: "Zuständige Behörde unbekannt", coverage: "COVERED", requiredClaimKeys: ["live-lookup-authority", "locale-not-authority", "userlocale-not-jurisdiction"], requiredProcessKeys: ["wohngeldbehoerde-bestimmen"] },
  { id: "exact-amount-without-facts", label: "Genaues Wohngeld ohne vollständige Tatsachen", coverage: "COVERED", requiredClaimKeys: ["individual-amount-fail-closed", "calculator-not-bescheid"], requiredProcessKeys: ["mietenstufe-parameter"] },
  { id: "significant-assets", label: "Ersparnisse oder Vermögen", coverage: "COVERED", requiredClaimKeys: ["savings-not-automatic-exclusion", "assets-threshold-not-invented"], requiredProcessKeys: ["ausschluesse-andere-leistungen"] },
  { id: "low-income-plausibility", label: "Sehr niedriges Einkommen und Plausibilität", coverage: "COVERED", requiredClaimKeys: ["low-income-not-automatic-rejection", "livelihood-explanation-may-be-needed"], requiredProcessKeys: ["einkommen-einordnen"] },
  { id: "owi-late-report", label: "Verspätete Änderungsmitteilung", coverage: "COVERED", requiredClaimKeys: ["up-to-2000-not-automatic", "late-not-criminal-fraud"], requiredProcessKeys: ["ueberzahlung-rueckforderung"] },
  { id: "search-title-status", label: "Titel zur Arbeits- oder Ausbildungsplatzsuche", coverage: "COVERED", requiredClaimKeys: ["search-titles-generally-excluded", "aufenthaltstitel-not-automatic"], requiredProcessKeys: ["aufenthalt-status-gate"] },
  { id: "full-calculator", label: "Vollständiger individueller Wohngeldrechner", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Formelstruktur, keine fallbezogene Berechnung." },
  { id: "full-sgb2", label: "Vollständige SGB-II-Berechnung", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Ausschlussschnittstelle." },
  { id: "full-sgb12", label: "Vollständige SGB-XII-Berechnung", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Ausschlussschnittstelle." },
  { id: "full-bafoeg-engine", label: "Vollständige BAföG-Maschine", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur dem-Grunde-nach-Grenze." },
  { id: "full-bab-engine", label: "Vollständige BAB-Maschine", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur dem-Grunde-nach-Grenze." },
  { id: "full-immigration", label: "Vollständiges Aufenthaltsrecht", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur § 3 Absatz 5-Grenze." },
  { id: "full-income-tax", label: "Vollständige Einkommensteuerberechnung", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Einkommensschnittstelle." },
  { id: "full-child-support", label: "Vollständiges Unterhaltsrecht", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Abzugsgrenze." },
  { id: "full-mortgage-analysis", label: "Vollständige Immobilienfinanzierung", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Keine Kreditanalyse." },
  { id: "fraud-defense", label: "Strafverteidigung", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Ordnungswidrigkeitenorientierung." },
  { id: "admin-court-litigation", label: "Vollständiger Verwaltungsprozess", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur fail-closed Rechtsbehelf." },
  { id: "all-local-portals", label: "Alle kommunalen Onlinesysteme", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Live-Suche der zuständigen Stelle." },
]);

const CONTEXT_GATE_POLICIES = Object.freeze([
  { sourceKey: "wogg-19", informationClass: "ELIGIBILITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["MUNICIPALITY", "EVENT_DATE", "PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "wogg-3", informationClass: "PROCESS_IDENTITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["RESIDENCE_STATE", "PROCESS_VARIANT", "COUNTRY"] as const, riskClass: "HIGH" },
  { sourceKey: "wogg-24", informationClass: "DEADLINE" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["BUNDESLAND", "EVENT_DATE", "PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "wogg-12", informationClass: "ELIGIBILITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["MUNICIPALITY", "EVENT_DATE"] as const, riskClass: "HIGH" },
  { sourceKey: "wogg-5", informationClass: "PROCESS_IDENTITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["PROCESS_VARIANT", "MAIN_OR_SECONDARY_RESIDENCE"] as const, riskClass: "HIGH" },
  { sourceKey: "wogg-37", informationClass: "DEADLINE" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["PROCESS_VARIANT", "EVENT_DATE"] as const, riskClass: "HIGH" },
  { sourceKey: "bundesportal", informationClass: "ONLINE_SERVICE_URL" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["MUNICIPALITY"] as const, riskClass: "HIGH" },
]);

export function evaluateWogProcessCompleteness(
  pack: CuratedDomainPack,
  units: readonly UnitSpec[] = WOG_UNITS,
) {
  const claimByKey = new Map(pack.claims.map((claim) => [String(claim.key), claim]));
  const processByKey = new Map(pack.processes.map((process) => [String(process.key), process]));
  const formIds = new Set(pack.forms.map((form) => String(form.identifier)));
  const rows = WOG_PROCESS_SCENARIOS.map((scenario) => {
    if (scenario.coverage === "EXPLICITLY_OUT_OF_SCOPE") {
      return Object.freeze({
        ...scenario,
        derived: "EXPLICITLY_OUT_OF_SCOPE" as const,
        satisfied: scenario.requiredClaimKeys.length === 0 && scenario.requiredProcessKeys.length === 0,
      });
    }
    if (scenario.coverage === "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE") {
      return Object.freeze({
        ...scenario,
        derived: "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE" as const,
        satisfied: false,
      });
    }
    const claimsPresent = scenario.requiredClaimKeys.every((key) =>
      claimByKey.has(key) && units.some((unit) => unit.key === key));
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
  const outOfScopeScenarioCount = rows.filter((row) => row.derived === "EXPLICITLY_OUT_OF_SCOPE").length;
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

export function buildWogFederalCorePack(): CuratedDomainPack {
  const item = factory(WOG_PACK_ID);
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
    bmwsb: item("publishers", "bmwsb", {
      name: "Bundesministerium für Wohnen, Stadtentwicklung und Bauwesen",
      type: "federal_ministry",
      territorialScopeId: scope.id,
      trustDomainId: trustDomain.id,
    }),
    bundesportal: item("publishers", "bundesportal", {
      name: "Bundesportal Verwaltung",
      type: "federal_service_portal",
      territorialScopeId: scope.id,
      trustDomainId: trustDomain.id,
    }),
  };
  const authorities = {
    bmwsb: item("authorities", "bundesministerium-wohnen", {
      publisherId: publishers.bmwsb.id,
      name: "Bundesministerium für Wohnen, Stadtentwicklung und Bauwesen",
      type: "federal_ministry",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://www.bmwsb.bund.de/DE/wohnen/wohngeld/wohngeld-plus/wohngeld-plus_artikel.html",
    }),
    bmj: item("authorities", "bundesministerium-justiz", {
      publisherId: publishers.bmj.id,
      name: "Bundesministerium der Justiz / Bundesamt für Justiz",
      type: "federal_publication",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://www.gesetze-im-internet.de/wogg/",
    }),
    bundesportal: item("authorities", "bundesportal-verwaltung", {
      publisherId: publishers.bundesportal.id,
      name: "Bundesportal",
      type: "federal_service_portal",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://verwaltung.bund.de/portal/",
    }),
  };

  const sources = WOG_OFFICIAL_SOURCES.map((spec) => {
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
      authorityLevel: "FEDERAL",
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
    const policy = item("handlingPolicies", `${spec.key}:${spec.informationClass}`, {
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

  const claims = WOG_UNITS.map((unit) => {
    const source = sourceByKey.get(unit.sourceKey);
    const passage = passageByKey.get(unit.passageKey);
    if (!source || !passage) throw new Error(`WOG_UNIT_SOURCE_MISSING:${unit.key}`);
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
    if (!source) throw new Error(`WOG_CONTEXT_POLICY_SOURCE_MISSING:${spec.sourceKey}`);
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

  const processes = WOG_PROCESSES.map((spec) => item("processes", spec.key, {
    processGroupId: WOG_DOMAIN,
    title: spec.title,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
    riskLevel: spec.riskLevel,
    trigger: spec.trigger,
    safeFirstStep: spec.safeFirstStep,
    regionalVariationExpected:
      spec.key === "wohngeldbehoerde-bestimmen"
      || spec.key === "rechtsbehelf-einordnen"
      || spec.key === "mietenstufe-parameter"
      || spec.key === "antrag-stellen",
  }));
  const processByKey = new Map(processes.map((process) => [String(process.key), process]));
  const claimByKey = new Map(claims.map(({ claim }) => [String(claim.key), claim]));
  const processClaimLinks = WOG_PROCESS_BINDINGS.flatMap((binding) => {
    const process = processByKey.get(binding.processKey);
    if (!process) throw new Error(`WOG_PROCESS_MISSING:${binding.processKey}`);
    return binding.claimKeys.map((claimKey) => {
      const claim = claimByKey.get(claimKey);
      if (!claim) throw new Error(`WOG_PROCESS_CLAIM_MISSING:${binding.processKey}:${claimKey}`);
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

  const inspectBescheidRule = item("actorRules", "inspect-wog-bescheid-before-remedy", {
    actorState: "inspect_wohngeld_bescheid_before_remedy",
    userMustAct: true,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const competenceRule = item("actorRules", "competent-wohngeldbehoerde-undetermined", {
    actorState: "competent_wohngeldbehoerde_undetermined_without_locality",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const amountRule = item("actorRules", "individual-wohngeld-undetermined", {
    actorState: "individual_wohngeld_amount_undetermined",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const householdRule = item("actorRules", "household-classification-undetermined", {
    actorState: "individual_household_classification_undetermined",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const statusRule = item("actorRules", "foreign-status-undetermined", {
    actorState: "foreign_wohngeld_status_undetermined",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const remedyRule = item("actorRules", "individual-remedy-undetermined", {
    actorState: "individual_legal_remedy_undetermined",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });

  const forms = WOG_FORMS.map((spec) => {
    const source = sourceByKey.get(spec.sourceKey);
    const passage = passageByKey.get(spec.passageKey);
    if (!source || !passage) throw new Error(`WOG_FORM_SOURCE_MISSING:${spec.key}`);
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
    packId: WOG_PACK_ID,
    domain: WOG_DOMAIN,
    canonicalLanguage: WOG_CANONICAL_LANGUAGE,
    trustDomain,
    jurisdictions: [jurisdiction],
    territorialScopes: [scope],
    publishers: [publishers.bmj, publishers.bmwsb, publishers.bundesportal],
    authorities: [authorities.bmwsb, authorities.bmj, authorities.bundesportal],
    sources: sources.map(({ source }) => source),
    sourceVersions: sources.map(({ version }) => version),
    passages: sources.flatMap(({ passages }) => passages),
    claims: claims.map(({ claim }) => claim),
    evidenceLinks: claims.map(({ evidence }) => evidence),
    citations: claims.map(({ citation }) => citation),
    actorRules: [
      inspectBescheidRule, competenceRule, amountRule, householdRule, statusRule, remedyRule,
    ],
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

export function wogPackSummary(pack: CuratedDomainPack = buildWogFederalCorePack()) {
  const categories = Object.fromEntries(
    WOG_UNITS.reduce((counts, unit) => {
      counts.set(unit.category, (counts.get(unit.category) ?? 0) + 1);
      return counts;
    }, new Map<WogUnitCategory, number>()),
  );
  const completeness = evaluateWogProcessCompleteness(pack);
  return Object.freeze({
    domain: pack.domain,
    packId: pack.packId,
    canonicalLanguage: pack.canonicalLanguage,
    claimCount: pack.claims.length,
    sourceCount: pack.sources.length,
    processCount: pack.processes.length,
    processClaimLinkCount: pack.processClaimLinks.length,
    formCount: pack.forms.length,
    current2026Count: WOG_UNITS.length,
    futureWatchCount: WOG_FUTURE_CHANGE_WATCH_ITEMS.length,
    g3ProcessStepLimitation: WOG_G3_PROCESS_STEP_LIMITATION,
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

