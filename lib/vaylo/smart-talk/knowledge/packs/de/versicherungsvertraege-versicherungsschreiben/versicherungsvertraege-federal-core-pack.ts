/**
 * KNOWLEDGE-EXPANSION — German private insurance contract and
 * correspondence process-complete core.
 * Official-source G3 CuratedDomainPack for domain
 * versicherungsvertraege_versicherungsschreiben (new taxonomy).
 * Canonical language is German only. Not a runtime route.
 *
 * This pack is the VVG document-lifecycle core. It does not replace
 * health_insurance_orientation (GKV / SGB V) and does not implement
 * product-specific merits engines.
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

export const VVG_DOMAIN = "versicherungsvertraege_versicherungsschreiben" as const;
export const VVG_PACK_ID = VVG_DOMAIN;
export const VVG_CANONICAL_LANGUAGE = "de" as const;

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

export type VvgUnitCategory =
  | "legal_system"
  | "role"
  | "document"
  | "contract"
  | "widerruf"
  | "disclosure"
  | "risk_change"
  | "obliegenheit"
  | "premium"
  | "termination"
  | "claim"
  | "coverage"
  | "decision"
  | "complaint"
  | "limitation"
  | "intermediary"
  | "authenticity"
  | "boundary";

export type VvgContextKey =
  | "EVENT_DATE"
  | "PROCESS_VARIANT"
  | "COUNTRY"
  | "RESIDENCE_STATE";
export type VvgHandlingMode =
  | "STORE_CANONICALLY"
  | "CACHE_AND_REVALIDATE"
  | "FETCH_LIVE"
  | "DO_NOT_ANSWER_WITHOUT_CONTEXT";
export type VvgFreshnessClass = "LEGAL_CHANGE_MONITORED" | "MONTHLY" | "EVENT_DRIVEN";
export type VvgStaleBehavior = "DO_NOT_USE_STALE" | "REVALIDATE_BEFORE_USE";
export type VvgInformationClass =
  | "LEGAL_BASELINE"
  | "PROCESS_IDENTITY"
  | "AUTHORITY_COMPETENCE"
  | "ELIGIBILITY"
  | "DEADLINE"
  | "REQUIRED_EVIDENCE"
  | "FORM_URL"
  | "ONLINE_SERVICE_URL"
  | "SANCTION";
export type VvgProcessRole =
  | "orientation_basis"
  | "required_information"
  | "identification"
  | "application_route"
  | "form_semantics"
  | "evidence_requirement"
  | "next_state"
  | "deadline_gate"
  | "decision"
  | "legal_remedy_gate"
  | "context_gate"
  | "negative_control";
export type VvgScenarioCoverage =
  | "COVERED"
  | "EXPLICITLY_OUT_OF_SCOPE"
  | "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE";

export const VVG_G3_PROCESS_STEP_LIMITATION =
  "G3 CuratedDomainPack and knowledge_ingest_curated_domain_pack persist processes and process_claim_links with process_step_id null; knowledge_process_steps are not ingestible without a later factory extension.";

export type VvgTemporalClass = "current_2026";

export type VvgFutureChangeWatchItem = Readonly<{
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
  publisherKey: "bmj" | "bafin" | "vom" | "pkvomb";
  authorityKey: "bmj" | "bafin" | "vom" | "pkvomb";
  url: string;
  officialDomain: string;
  title: string;
  sourceClass: "FEDERAL_LAW" | "FEDERAL_REGULATION" | "FEDERAL_ADMINISTRATIVE_GUIDANCE" | "FEDERAL_SERVICE_PORTAL";
  sourceType: "federal_statute" | "federal_guidance" | "authority_portal";
  retrievalMethod: "HTML_DOCUMENT";
  informationClass: VvgInformationClass;
  handlingMode: VvgHandlingMode;
  freshnessClass: VvgFreshnessClass;
  staleBehavior: VvgStaleBehavior;
  requiredContextKeys: readonly VvgContextKey[];
  passages: readonly Readonly<{ key: string; locator: string; text: string }>[];
}>;

type UnitSpec = Readonly<{
  key: string;
  category: VvgUnitCategory;
  temporal: VvgTemporalClass;
  type: "duty" | "deadline" | "definition" | "procedure" | "exception";
  text: string;
  sourceKey: string;
  passageKey: string;
  riskLevel: "low" | "medium" | "high";
  requiresEffectiveDate?: true;
  requiresAuthorityResolution?: true;
  requiredContextKeys?: readonly VvgContextKey[];
}>;

type VvgProcessSpec = Readonly<{
  key: string;
  title: string;
  trigger: string;
  safeFirstStep: string;
  riskLevel: "low" | "medium" | "high";
}>;

type VvgFormSpec = Readonly<{
  key: string;
  name: string;
  identifier: string;
  purpose: string;
  submissionChannels: readonly string[];
  sourceKey: string;
  passageKey: string;
}>;

type VvgBindingSpec = Readonly<{
  processKey: string;
  role: VvgProcessRole;
  sequenceContext: string;
  claimKeys: readonly string[];
  required?: boolean;
  qualificationRequired?: boolean;
}>;

type VvgProcessScenario = Readonly<{
  id: string;
  label: string;
  coverage: VvgScenarioCoverage;
  requiredClaimKeys: readonly string[];
  requiredProcessKeys: readonly string[];
  requiredFormIdentifiers?: readonly string[];
  note?: string;
}>;

export const VVG_FUTURE_WATCH_SOURCE = Object.freeze({
  url: "https://www.gesetze-im-internet.de/vvg-infov/BJNR300400007.html",
  officialDomain: "www.gesetze-im-internet.de",
  title: "VVG-InfoV konsolidierter Verordnungstext",
});

export const VVG_FUTURE_CHANGE_WATCH_ITEMS: readonly VvgFutureChangeWatchItem[] = Object.freeze([
  {
    id: "vvg-future-watch-infov-2027",
    key: "future-vvginfov-altersvorsorge-2027",
    officialSourceUrl: VVG_FUTURE_WATCH_SOURCE.url,
    officialDomain: VVG_FUTURE_WATCH_SOURCE.officialDomain,
    officialSourceTitle: VVG_FUTURE_WATCH_SOURCE.title,
    targetYear: 2027,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "Artikel 13 des Altersvorsorgereformgesetzes vom 26. Mai 2026 ändert die VVG-InfoV mit Wirkung zum 1. Januar 2027 und ist nicht als heutige kanonische Informationspflicht ingestierbar.",
  },
  {
    id: "vvg-future-watch-vom-limits",
    key: "future-ombudsmann-value-limits",
    officialSourceUrl: "https://www.versicherungsombudsmann.de/das-schlichtungsverfahren/verfahrensordnungen/vomvo/",
    officialDomain: "www.versicherungsombudsmann.de",
    officialSourceTitle: "Verfahrensordnung Versicherungsombudsmann",
    targetYear: 2027,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "Streitwert- und Bindungsgrenzen des Versicherungsombudsmanns können sich ändern und sind nicht als zeitlose Beträge ingestierbar.",
  },
  {
    id: "vvg-future-watch-bafin-routes",
    key: "future-bafin-complaint-routes",
    officialSourceUrl: "https://www.bafin.de/DE/verbraucherinnen-verbraucher/hilfe-kontakt/beschwerden-streitschlichtung/bei-bafin-beschweren/bei-bafin-beschweren_node.html",
    officialDomain: "www.bafin.de",
    officialSourceTitle: "Bei der BaFin beschweren",
    targetYear: 2027,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "BaFin-Beschwerdewege und Kontaktangaben können sich ändern und sind nicht als dauerhafte Einzelzuständigkeit ingestierbar.",
  },
  {
    id: "vvg-future-watch-vvg-amendments",
    key: "future-vvg-amendments",
    officialSourceUrl: "https://www.gesetze-im-internet.de/vvg_2008/",
    officialDomain: "www.gesetze-im-internet.de",
    officialSourceTitle: "Versicherungsvertragsgesetz Inhaltsübersicht",
    targetYear: 2027,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "Künftige VVG-Änderungen sind nicht als heutiger Vertragsinhalt ingestierbar.",
  },
]);

export const VVG_OFFICIAL_SOURCES: readonly OfficialSourceSpec[] = Object.freeze([
  { key: "vvg-1", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/vvg_2008/__1.html", officialDomain: "www.gesetze-im-internet.de", title: "VVG § 1 Vertragstypische Pflichten", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "vvg-1-all", locator: "§ 1", text: "Der Versicherer verpflichtet sich, ein bestimmtes Risiko des Versicherungsnehmers oder eines Dritten durch eine Leistung abzusichern, die er bei Eintritt des vereinbarten Versicherungsfalles zu erbringen hat. Der Versicherungsnehmer ist verpflichtet, die vereinbarte Prämie zu leisten." }] },
  { key: "vvg-3", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/vvg_2008/__3.html", officialDomain: "www.gesetze-im-internet.de", title: "VVG § 3 Versicherungsschein", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "vvg-3-all", locator: "§ 3", text: "Der Versicherer hat dem Versicherungsnehmer einen Versicherungsschein in Textform, auf dessen Verlangen als Urkunde, zu übermitteln. Der Versicherungsnehmer kann Abschriften seiner vertragsbezogenen Erklärungen verlangen." }] },
  { key: "vvg-5", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/vvg_2008/__5.html", officialDomain: "www.gesetze-im-internet.de", title: "VVG § 5 Abweichender Versicherungsschein", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "vvg-5-all", locator: "§ 5", text: "Weicht der Versicherungsschein vom Antrag oder den Vereinbarungen ab, gilt die Abweichung als genehmigt, wenn der Versicherer auffällig auf jede Abweichung und die Monatsfrist zum Textformwiderspruch nach Zugang hingewiesen hat und der Versicherungsnehmer nicht innerhalb eines Monats nach Zugang widerspricht. Fehlt der Hinweis, gilt der Vertrag mit dem Antragsinhalt." }] },
  { key: "vvg-6", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/vvg_2008/__6.html", officialDomain: "www.gesetze-im-internet.de", title: "VVG § 6 Beratung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "vvg-6-all", locator: "§ 6", text: "Vor Vertragsschluss hat der Versicherer den Versicherungsnehmer bei Anlass nach Wünschen und Bedürfnissen zu befragen, zu beraten und den Rat zu dokumentieren. Die Pflicht gilt nicht, wenn ein Versicherungsmakler vermittelt oder ein Großrisiko vorliegt. Ein schlechter Verlauf beweist nicht automatisch eine Pflichtverletzung." }] },
  { key: "vvg-7", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/vvg_2008/__7.html", officialDomain: "www.gesetze-im-internet.de", title: "VVG § 7 Information", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "vvg-7-all", locator: "§ 7", text: "Der Versicherer hat dem Versicherungsnehmer rechtzeitig vor dessen Vertragserklärung die Vertragsbestimmungen einschließlich der Allgemeinen Versicherungsbedingungen und die nach der VVG-InfoV bestimmten Informationen in Textform mitzuteilen. Eine Marketingseite ersetzt diese Mitteilung nicht." }] },
  { key: "vvg-8", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/vvg_2008/__8.html", officialDomain: "www.gesetze-im-internet.de", title: "VVG § 8 Widerruf", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "vvg-8-all", locator: "§ 8", text: "Der Versicherungsnehmer kann seine Vertragserklärung innerhalb von 14 Tagen in Textform ohne Begründung widerrufen; zur Fristwahrung genügt die rechtzeitige Absendung. Die Frist beginnt mit Vertragsschluss, aber nicht bevor Versicherungsschein, Vertragsbestimmungen einschließlich AVB, VVG-InfoV-Informationen und Widerrufsbelehrung in Textform zugegangen sind. Für Online-Fernabsatz gilt § 356a BGB. Ausnahmen und ein spätestes Erlöschen nach zwölf Monaten und 14 Tagen sind gesetzlich geregelt, nicht jedoch ohne Belehrung." }] },
  { key: "vvg-9", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/vvg_2008/__9.html", officialDomain: "www.gesetze-im-internet.de", title: "VVG § 9 Rechtsfolgen des Widerrufs", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "vvg-9-all", locator: "§ 9", text: "Nach wirksamem Widerruf sind empfangene Leistungen unverzüglich, spätestens innerhalb von 30 Tagen zurückzugewähren. Beginnt der Versicherungsschutz vor Fristende, gelten besondere Prämienrückgewährregeln, abhängig von Hinweis, Fernabsatzzustimmung und in Anspruch genommenen Leistungen." }] },
  { key: "vvg-11", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/vvg_2008/__11.html", officialDomain: "www.gesetze-im-internet.de", title: "VVG § 11 Verlängerung Kündigung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "vvg-11-all", locator: "§ 11", text: "Eine vereinbarte automatische Verlängerung ist unwirksam, soweit sie sich jeweils auf mehr als ein Jahr erstreckt. Unbestimmte Verträge können nur zum Schluss der laufenden Versicherungsperiode gekündigt werden. Die Kündigungsfrist muss gleich und zwischen einem und drei Monaten liegen. Verträge über mehr als drei Jahre kann der Versicherungsnehmer zum Schluss des dritten oder jedes folgenden Jahres mit dreimonatiger Frist kündigen. Sonderregeln einzelner Versicherungszweige bleiben unberührt." }] },
  { key: "vvg-13", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/vvg_2008/__13.html", officialDomain: "www.gesetze-im-internet.de", title: "VVG § 13 Anschrift und Name", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "vvg-13-all", locator: "§ 13", text: "Hat der Versicherungsnehmer eine Anschriften- oder Namensänderung nicht mitgeteilt, genügt für eine Willenserklärung die Absendung eines eingeschriebenen Briefes an die letzte bekannte Anschrift. Die Erklärung gilt drei Tage nach Absendung als zugegangen. Ein unzustellbarer Brief ist deshalb nicht automatisch unwirksam." }] },
  { key: "vvg-14", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/vvg_2008/__14.html", officialDomain: "www.gesetze-im-internet.de", title: "VVG § 14 Fälligkeit", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "vvg-14-all", locator: "§ 14", text: "Geldleistungen des Versicherers sind fällig mit Beendigung der zur Feststellung des Versicherungsfalles und des Leistungsumfangs notwendigen Erhebungen. Sind diese nicht binnen eines Monats seit Anzeige beendet, kann der Versicherungsnehmer Abschlagszahlungen in Höhe des voraussichtlich mindestens zu zahlenden Betrags verlangen. Die Frist ist gehemmt, solange Erhebungen infolge Verschuldens des Versicherungsnehmers nicht beendet werden können." }] },
  { key: "vvg-15", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/vvg_2008/__15.html", officialDomain: "www.gesetze-im-internet.de", title: "VVG § 15 Hemmung der Verjährung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "vvg-15-all", locator: "§ 15", text: "Ist ein Anspruch aus dem Versicherungsvertrag beim Versicherer angemeldet, ist die Verjährung bis zu dem Zeitpunkt gehemmt, zu dem die Entscheidung des Versicherers dem Anspruchsteller in Textform zugeht." }] },
  { key: "vvg-19", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/vvg_2008/__19.html", officialDomain: "www.gesetze-im-internet.de", title: "VVG § 19 Anzeigepflicht", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "vvg-19-all", locator: "§ 19", text: "Der Versicherungsnehmer hat ihm bekannte Gefahrumstände anzuzeigen, die für den Entschluss des Versicherers erheblich sind und nach denen der Versicherer in Textform gefragt hat. Rechte des Versicherers setzen eine gesonderte Textformbelehrung voraus und unterscheiden nach Vorsatz, grober Fahrlässigkeit und einfacher Fahrlässigkeit; sie entfallen bei Kenntnis des Versicherers." }] },
  { key: "vvg-23", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/vvg_2008/__23.html", officialDomain: "www.gesetze-im-internet.de", title: "VVG § 23 Gefahrerhöhung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "vvg-23-all", locator: "§ 23", text: "Nach der Vertragserklärung darf der Versicherungsnehmer ohne Einwilligung des Versicherers keine Gefahrerhöhung vornehmen oder gestatten. Erkennt er eine vorgenommene oder unabhängig vom Willen eingetretene Gefahrerhöhung, hat er sie unverzüglich anzuzeigen. Nicht jede Lebensänderung ist eine Gefahrerhöhung." }] },
  { key: "vvg-24", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/vvg_2008/__24.html", officialDomain: "www.gesetze-im-internet.de", title: "VVG § 24 Kündigung wegen Gefahrerhöhung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "vvg-24-all", locator: "§ 24", text: "Bei Verletzung des Verbots der Gefahrerhöhung kann der Versicherer ohne Frist kündigen, außer bei weder vorsätzlicher noch grob fahrlässiger Verletzung; bei einfacher Fahrlässigkeit mit Monatsfrist. In den Anzeigefällen gilt eine Monatsfrist. Das Recht erlischt einen Monat nach Kenntnis oder bei Wiederherstellung des früheren Zustands." }] },
  { key: "vvg-25", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/vvg_2008/__25.html", officialDomain: "www.gesetze-im-internet.de", title: "VVG § 25 Prämie bei Gefahrerhöhung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "vvg-25-all", locator: "§ 25", text: "Anstelle der Kündigung kann der Versicherer ab der Gefahrerhöhung eine höhere Prämie verlangen oder die höhere Gefahr ausschließen. Steigt die Prämie um mehr als 10 Prozent oder wird die höhere Gefahr ausgeschlossen, kann der Versicherungsnehmer innerhalb eines Monats nach Zugang fristlos kündigen. Das ist nicht automatisch eine Anpassung nach § 40." }] },
  { key: "vvg-26", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/vvg_2008/__26.html", officialDomain: "www.gesetze-im-internet.de", title: "VVG § 26 Leistungsfreiheit Gefahrerhöhung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "vvg-26-all", locator: "§ 26", text: "Nach vorsätzlicher verbotener Gefahrerhöhung kann der Versicherer leistungsfrei sein; bei grober Fahrlässigkeit anteilig kürzen. Fehlende Kausalität oder abgelaufene ungenutzte Kündigungsfrist können die Leistungspflicht erhalten. Gefahrerhöhung bedeutet nicht automatisch totalen Deckungsverlust." }] },
  { key: "vvg-28", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/vvg_2008/__28.html", officialDomain: "www.gesetze-im-internet.de", title: "VVG § 28 Obliegenheit", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "vvg-28-all", locator: "§ 28", text: "Bei vorsätzlicher Verletzung einer vertraglichen Obliegenheit kann der Versicherer leistungsfrei sein; bei grober Fahrlässigkeit anteilig nach Verschuldensschwere kürzen. Fehlt die Kausalität, bleibt er zur Leistung verpflichtet, außer bei Arglist. Nach Eintritt des Versicherungsfalles setzt Leistungsfreiheit bei Auskunftsobliegenheiten einen gesonderten Textformhinweis voraus. Eine Obliegenheitsverletzung ist nicht automatisch Totalablehnung." }] },
  { key: "vvg-30", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/vvg_2008/__30.html", officialDomain: "www.gesetze-im-internet.de", title: "VVG § 30 Anzeige des Versicherungsfalles", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "vvg-30-all", locator: "§ 30", text: "Der Versicherungsnehmer hat den Eintritt des Versicherungsfalles nach Kenntnis unverzüglich anzuzeigen. Auf eine vereinbarte Leistungsfreiheit wegen Verletzung kann sich der Versicherer nicht berufen, wenn er auf andere Weise rechtzeitig Kenntnis erlangt hat. Verspätete Anzeige bedeutet nicht automatisch Nullzahlung." }] },
  { key: "vvg-31", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/vvg_2008/__31.html", officialDomain: "www.gesetze-im-internet.de", title: "VVG § 31 Auskunftspflicht", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "REQUIRED_EVIDENCE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "vvg-31-all", locator: "§ 31", text: "Der Versicherer kann nach dem Versicherungsfall jede Auskunft verlangen, die zur Feststellung des Versicherungsfalles oder des Leistungsumfangs erforderlich ist, und Belege, deren Beschaffung billigerweise zuzumuten ist. Nicht jedes persönliche Dokument ist automatisch geschuldet. Eine Unterlagenanforderung ist keine Betrugsvorwurf." }] },
  { key: "vvg-37", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/vvg_2008/__37.html", officialDomain: "www.gesetze-im-internet.de", title: "VVG § 37 Erstprämie", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "vvg-37-all", locator: "§ 37", text: "Wird die einmalige oder erste Prämie nicht rechtzeitig gezahlt, kann der Versicherer zurücktreten, es sei denn, der Versicherungsnehmer hat die Nichtzahlung nicht zu vertreten. Tritt der Versicherungsfall vorher ein, ist der Versicherer nicht zur Leistung verpflichtet, außer fehlendem Vertretenmüssen und nur nach gesondertem Textform- oder auffälligem Schein-Hinweis." }] },
  { key: "vvg-38", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/vvg_2008/__38.html", officialDomain: "www.gesetze-im-internet.de", title: "VVG § 38 Folgeprämie", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "vvg-38-all", locator: "§ 38", text: "Bei Folgeprämienverzug kann der Versicherer in Textform eine Zahlungsfrist von mindestens zwei Wochen setzen, die rückständige Prämie, Zinsen und Kosten einzeln beziffert und die Rechtsfolgen angibt. Nach Fristablauf kann Leistungsfreiheit und fristlose Kündigung eintreten; spätere Zahlung innerhalb eines Monats kann die Kündigung unwirksam machen, lässt aber Absatz 2 unberührt. Eine gewöhnliche Mahnung ist nicht automatisch diese qualifizierte Bestimmung." }] },
  { key: "vvg-40", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/vvg_2008/__40.html", officialDomain: "www.gesetze-im-internet.de", title: "VVG § 40 Kündigung bei Prämienerhöhung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "vvg-40-all", locator: "§ 40", text: "Erhöht der Versicherer aufgrund einer Anpassungsklausel die Prämie ohne entsprechende Leistungserweiterung oder vermindert er den Schutz ohne entsprechende Prämiensenkung, kann der Versicherungsnehmer innerhalb eines Monats nach Zugang mit sofortiger Wirkung, frühestens zum Wirksamwerden, kündigen. Die Mitteilung muss spätestens einen Monat vorher zugehen. Sonderregeln etwa der privaten Krankenversicherung bleiben unberührt." }] },
  { key: "vvg-59", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/vvg_2008/__59.html", officialDomain: "www.gesetze-im-internet.de", title: "VVG § 59 Versicherungsvermittler", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "vvg-59-all", locator: "§ 59", text: "Versicherungsvermittler sind Versicherungsvertreter und Versicherungsmakler. Der Vertreter ist vom Versicherer betraut. Der Makler handelt für den Auftraggeber, ohne vom Versicherer betraut zu sein. Der Versicherungsberater berät unabhängig ohne wirtschaftlichen Vorteil vom Versicherer. Ein Makler ist nicht der Versicherer." }] },
  { key: "vvg-92", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/vvg_2008/__92.html", officialDomain: "www.gesetze-im-internet.de", title: "VVG § 92 Kündigung nach Versicherungsfall", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "vvg-92-all", locator: "§ 92", text: "Nach Eintritt des Versicherungsfalles kann jede Vertragspartei das Versicherungsverhältnis kündigen. Die Vorschrift steht im Sachversicherungsteil und gilt nicht als allgemeines Sonderkündigungsrecht jeder Versicherungssparte. Ein Schadenfall begründet nicht universell sofortige Kündigung." }] },
  { key: "vvg-152", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/vvg_2008/__152.html", officialDomain: "www.gesetze-im-internet.de", title: "VVG § 152 Widerruf Lebensversicherung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "vvg-152-all", locator: "§ 152", text: "Bei der Lebensversicherung beträgt die Widerrufsfrist abweichend von § 8 Absatz 1 Satz 1 dreißig Tage. Das Recht erlischt spätestens 24 Monate und 30 Tage nach Vertragsschluss. Die Lebensversicherung folgt nicht der allgemeinen 14-Tage-Regel." }] },
  { key: "vvg-192", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/vvg_2008/__192.html", officialDomain: "www.gesetze-im-internet.de", title: "VVG § 192 Private Krankenversicherung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "vvg-192-all", locator: "§ 192", text: "Bei der Krankheitskostenversicherung erstattet der private Versicherer im vereinbarten Umfang medizinisch notwendige Heilbehandlung und weitere vereinbarte Leistungen. Es gelten besondere VVG-Regeln der privaten Krankenversicherung, nicht das Sozialrecht der gesetzlichen Krankenkasse. Ein vollständiges Tarif- und Leistungsengine ist hier nicht enthalten." }] },
  { key: "vvginfov-1", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/vvg-infov/__1.html", officialDomain: "www.gesetze-im-internet.de", title: "VVG-InfoV § 1 Informationspflichten", sourceClass: "FEDERAL_REGULATION", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "CACHE_AND_REVALIDATE", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "REVALIDATE_BEFORE_USE", requiredContextKeys: ["EVENT_DATE"], passages: [{ key: "vvginfov-1-all", locator: "§ 1", text: "Der Versicherer hat vor Vertragserklärung unter anderem Identität, Anschrift, AVB einschließlich Tarifbestimmungen, wesentliche Leistungsmerkmale, Preis, Zahlungsweise, Widerruf, Laufzeit, Beendigung, anwendbares Recht, außergerichtliche Streitbeilegung und Aufsichtsbeschwerde mitzuteilen. Die AVB sind Vertragsbestimmungen und kein Gesetz." }] },
  { key: "vvginfov-4", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/vvg-infov/__4.html", officialDomain: "www.gesetze-im-internet.de", title: "VVG-InfoV § 4 Produktinformationsblatt", sourceClass: "FEDERAL_REGULATION", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "CACHE_AND_REVALIDATE", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "REVALIDATE_BEFORE_USE", requiredContextKeys: ["EVENT_DATE"], passages: [{ key: "vvginfov-4-all", locator: "§ 4", text: "Ist der Versicherungsnehmer Verbraucher, hat der Versicherer ein Informationsblatt zu Versicherungsprodukten zur Verfügung zu stellen. Das Blatt ist ein standardisiertes Informationsdokument und nicht der gesamte Vertrag." }] },
  { key: "sgb5-4", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/sgb_5/__4.html", officialDomain: "www.gesetze-im-internet.de", title: "SGB V § 4 Krankenkassen", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "sgb5-4-all", locator: "§ 4", text: "Die Krankenkassen sind rechtsfähige Körperschaften des öffentlichen Rechts mit Selbstverwaltung. Die gesetzliche Krankenversicherung folgt dem Fünften Buch Sozialgesetzbuch und nicht dem privaten Versicherungsvertragsgesetz. Ein Krankenkassenbescheid kann den sozialrechtlichen Widerspruch eröffnen." }] },
  { key: "bgb-195", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/bgb/__195.html", officialDomain: "www.gesetze-im-internet.de", title: "BGB § 195 Regelmäßige Verjährung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "DEADLINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "bgb-195-all", locator: "§ 195", text: "Die regelmäßige Verjährungsfrist beträgt drei Jahre. Für Versicherungsvertragsansprüche kann zusätzlich die Hemmung nach § 15 VVG gelten. Ein individueller Verjährungstag darf ohne Anspruchsentstehung, Kenntnis und Anmeldedaten nicht berechnet werden." }] },
  { key: "bgb-199", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/bgb/__199.html", officialDomain: "www.gesetze-im-internet.de", title: "BGB § 199 Verjährungsbeginn", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "DEADLINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "bgb-199-all", locator: "§ 199", text: "Die regelmäßige Verjährung beginnt, soweit nichts anderes bestimmt ist, mit dem Schluss des Jahres, in dem der Anspruch entstanden ist und der Gläubiger die Umstände und die Person des Schuldners kennt oder ohne grobe Fahrlässigkeit kennen müsste." }] },
  { key: "pflvg-1", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/pflvg/__1.html", officialDomain: "www.gesetze-im-internet.de", title: "PflVG § 1 Kfz-Haftpflicht", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "pflvg-1-all", locator: "§ 1", text: "Der Halter eines im Inland stationierten Kraftfahrzeugs hat eine Haftpflichtversicherung zur Deckung von Personen-, Sach- und Vermögensschäden durch den Gebrauch des Fahrzeugs abzuschließen. Kfz-Haftpflicht ist Pflichtversicherung und nicht identisch mit Kasko." }] },
  { key: "vsbg-1", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/vsbg/__1.html", officialDomain: "www.gesetze-im-internet.de", title: "VSBG § 1 Anwendungsbereich", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "vsbg-1-all", locator: "§ 1", text: "Das Verbraucherstreitbeilegungsgesetz gilt für die außergerichtliche Beilegung von Verbraucherstreitigkeiten durch anerkannte oder gesetzlich eingerichtete Verbraucherschlichtungsstellen. Interne Unternehmensbeschwerdestellen eines einzelnen Versicherers fallen nicht darunter." }] },
  { key: "bafin-complaint", publisherKey: "bafin", authorityKey: "bafin", url: "https://www.bafin.de/DE/verbraucherinnen-verbraucher/hilfe-kontakt/beschwerden-streitschlichtung/bei-bafin-beschweren/bei-bafin-beschweren_node.html", officialDomain: "www.bafin.de", title: "BaFin Verbraucherbeschwerde", sourceClass: "FEDERAL_ADMINISTRATIVE_GUIDANCE", sourceType: "federal_guidance", retrievalMethod: "HTML_DOCUMENT", informationClass: "AUTHORITY_COMPETENCE", handlingMode: "FETCH_LIVE", freshnessClass: "EVENT_DRIVEN", staleBehavior: "REVALIDATE_BEFORE_USE", requiredContextKeys: ["PROCESS_VARIANT"], passages: [{ key: "bafin-complaint-all", locator: "Beschwerde", text: "Die BaFin ist für den kollektiven Verbraucherschutz zuständig und kann im Einzelfall nicht zu individuellem Recht verhelfen. Nur Gerichte können Unternehmen zur Zahlung zwingen. Zuerst soll schriftlich das Unternehmen um Stellungnahme gebeten werden. Die BaFin prüft nur beaufsichtigte Unternehmen, nicht die gesetzliche Kranken-, Unfall- oder Rentenversicherung; regionale Versicherer können der Landesaufsicht unterliegen. Während der BaFin-Beschwerde laufen Fristen weiter. Ob ein Unternehmen beaufsichtigt wird, ergibt die Unternehmensdatenbank." }] },
  { key: "vom-procedure", publisherKey: "vom", authorityKey: "vom", url: "https://www.versicherungsombudsmann.de/das-schlichtungsverfahren/", officialDomain: "www.versicherungsombudsmann.de", title: "Versicherungsombudsmann Schlichtungsverfahren", sourceClass: "FEDERAL_SERVICE_PORTAL", sourceType: "authority_portal", retrievalMethod: "HTML_DOCUMENT", informationClass: "PROCESS_IDENTITY", handlingMode: "CACHE_AND_REVALIDATE", freshnessClass: "MONTHLY", staleBehavior: "REVALIDATE_BEFORE_USE", requiredContextKeys: [], passages: [{ key: "vom-procedure-all", locator: "Verfahren", text: "Die Ombudsfrau ist für Verbraucheransprüche aus Versicherungsverträgen gegen Mitgliedsunternehmen zuständig, regelmäßig bis 100.000 Euro Beschwerdewert. Bis 10.000 Euro kann sie den Versicherer bindend verpflichten, darüber Empfehlungen aussprechen. Verbraucher bleiben gerichtlich frei. Das Verfahren ist für Verbraucher kostenlos außer eigenen Auslagen. Während des Versicherer-Verfahrens verjähren Ansprüche nicht. Private Kranken- und Pflegeversicherung gehört zum PKV-Ombudsmann; gesetzliche Versicherungen gehören nicht hierher. Der Versicherer muss Mitglied sein." }] },
  { key: "vom-members", publisherKey: "vom", authorityKey: "vom", url: "https://www.versicherungsombudsmann.de/der-verein/mitglieder/", officialDomain: "www.versicherungsombudsmann.de", title: "Versicherungsombudsmann Mitglieder", sourceClass: "FEDERAL_SERVICE_PORTAL", sourceType: "authority_portal", retrievalMethod: "HTML_DOCUMENT", informationClass: "ONLINE_SERVICE_URL", handlingMode: "FETCH_LIVE", freshnessClass: "EVENT_DRIVEN", staleBehavior: "REVALIDATE_BEFORE_USE", requiredContextKeys: ["PROCESS_VARIANT"], passages: [{ key: "vom-members-all", locator: "Mitglieder", text: "Die Ombudsfrau kann ein Anliegen nur prüfen, wenn der Versicherer Mitglied des Versicherungsombudsmann e. V. ist. Die aktuelle Mitgliederliste ist live zu prüfen. Nicht jeder Versicherer ist automatisch Mitglied." }] },
  { key: "pkv-ombudsmann", publisherKey: "pkvomb", authorityKey: "pkvomb", url: "https://www.pkv-ombudsmann.de/schlichtungsverfahren/statut/", officialDomain: "www.pkv-ombudsmann.de", title: "Ombudsmann Private Kranken- und Pflegeversicherung", sourceClass: "FEDERAL_SERVICE_PORTAL", sourceType: "authority_portal", retrievalMethod: "HTML_DOCUMENT", informationClass: "PROCESS_IDENTITY", handlingMode: "FETCH_LIVE", freshnessClass: "EVENT_DRIVEN", staleBehavior: "REVALIDATE_BEFORE_USE", requiredContextKeys: ["PROCESS_VARIANT"], passages: [{ key: "pkv-ombudsmann-all", locator: "Statut", text: "Für Streitigkeiten der privaten Kranken- und Pflegeversicherung ist der Ombudsmann Private Kranken- und Pflegeversicherung zuständig, nicht das gewöhnliche Versicherer-Verfahren des allgemeinen Versicherungsombudsmanns. Gesetzliche Krankenkassenstreitigkeiten gehören nicht dorthin. Teilnahme und Zulässigkeit sind aktuell zu prüfen." }] },
]);

export const VVG_UNITS: readonly UnitSpec[] = Object.freeze([
  { key: "versicherung-not-one-legal-system", category: "legal_system", temporal: "current_2026", type: "exception", text: "Das Wort Versicherung bezeichnet nicht ein einziges Rechtssystem. Gesetzliche Krankenversicherung, private Krankenversicherung, sonstige private Versicherungsverträge und gesetzliche Sozialversicherung folgen unterschiedlichen Pfaden.", sourceKey: "vvg-1", passageKey: "vvg-1-all", riskLevel: "high", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "gkv-is-social-law-not-vvg", category: "legal_system", temporal: "current_2026", type: "definition", text: "Die gesetzliche Krankenversicherung ist Sozialrecht nach dem Fünften Buch Sozialgesetzbuch bei einer Krankenkasse als Körperschaft des öffentlichen Rechts und kein privater Versicherungsvertrag nach dem VVG.", sourceKey: "sgb5-4", passageKey: "sgb5-4-all", riskLevel: "high" },
  { key: "pkv-is-private-contract", category: "legal_system", temporal: "current_2026", type: "definition", text: "Die private Krankenversicherung und die private Pflegeversicherung sind private Versicherungsverträge mit besonderen VVG-Regeln und nicht die gesetzliche Krankenkasse.", sourceKey: "vvg-192", passageKey: "vvg-192-all", riskLevel: "high" },
  { key: "other-private-is-vvg", category: "legal_system", temporal: "current_2026", type: "definition", text: "Sonstige private Versicherungsverträge richten sich nach dem Versicherungsvertragsgesetz, den vertraglichen AVB und dem konkreten Versicherungsschein.", sourceKey: "vvg-1", passageKey: "vvg-1-all", riskLevel: "medium" },
  { key: "social-insurance-not-vvg", category: "legal_system", temporal: "current_2026", type: "exception", text: "Gesetzliche Rentenversicherung, gesetzliche Unfallversicherung und andere Sozialversicherung sind kein privater VVG-Vertrag und gehören nicht in diesen privaten Vertragskern.", sourceKey: "sgb5-4", passageKey: "sgb5-4-all", riskLevel: "high" },
  { key: "krankenkasse-not-automatically-private", category: "legal_system", temporal: "current_2026", type: "exception", text: "Eine Krankenkasse ist nicht automatisch ein privater Versicherer. Körperschaften der gesetzlichen Krankenversicherung folgen Sozialrecht.", sourceKey: "sgb5-4", passageKey: "sgb5-4-all", riskLevel: "high" },
  { key: "pkv-not-gesetzliche-kasse", category: "legal_system", temporal: "current_2026", type: "exception", text: "Eine private Krankenversicherung ist nicht die gesetzliche Krankenkasse und eröffnet nicht denselben sozialrechtlichen Bescheidweg.", sourceKey: "vvg-192", passageKey: "vvg-192-all", riskLevel: "high" },
  { key: "private-letter-not-bescheid", category: "legal_system", temporal: "current_2026", type: "exception", text: "Ein Schreiben eines privaten Versicherers ist nicht automatisch ein Verwaltungsakt oder sozialrechtlicher Bescheid.", sourceKey: "vvg-1", passageKey: "vvg-1-all", riskLevel: "high" },
  { key: "versicherung-not-automatically-vvg", category: "legal_system", temporal: "current_2026", type: "exception", text: "Das bloße Wort Versicherung bedeutet nicht automatisch, dass das Versicherungsvertragsgesetz den gesamten Vorgang steuert.", sourceKey: "vvg-1", passageKey: "vvg-1-all", riskLevel: "high", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "private-denial-not-widerspruch", category: "legal_system", temporal: "current_2026", type: "exception", text: "Die Ablehnung eines privaten Versicherers eröffnet nicht das sozialrechtliche Widerspruchsverfahren gegen einen Verwaltungsakt.", sourceKey: "vvg-1", passageKey: "vvg-1-all", riskLevel: "high" },
  { key: "gkv-bescheid-not-private-dispute", category: "legal_system", temporal: "current_2026", type: "exception", text: "Ein Bescheid der gesetzlichen Krankenkasse ist kein privater Vertragsstreit und gehört in den bestehenden gesetzlichen Krankenversicherungskern.", sourceKey: "sgb5-4", passageKey: "sgb5-4-all", riskLevel: "high" },
  { key: "unclear-legal-system-fail-closed", category: "legal_system", temporal: "current_2026", type: "exception", text: "Ist unklar, ob gesetzliche Krankenkasse, private Krankenversicherung, sonstige private Versicherung oder Sozialversicherung vorliegt, darf ohne weiteren Kontext nicht abschließend geantwortet werden.", sourceKey: "vvg-1", passageKey: "vvg-1-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "route-gkv-to-health-pack", category: "legal_system", temporal: "current_2026", type: "procedure", text: "Ein erkennbares Krankenkassenschreiben ist in den gesetzlichen Krankenversicherungskern zu leiten, einschließlich möglichem Bescheid und Widerspruch.", sourceKey: "sgb5-4", passageKey: "sgb5-4-all", riskLevel: "high" },
  { key: "userlocale-not-jurisdiction", category: "legal_system", temporal: "current_2026", type: "exception", text: "Die userLocale oder die Gesprächssprache bestimmt nicht das anwendbare Versicherungsrecht und nicht den zuständigen Streitweg.", sourceKey: "vvg-1", passageKey: "vvg-1-all", riskLevel: "high", requiredContextKeys: ["COUNTRY"] },
  { key: "versicherer-role", category: "role", temporal: "current_2026", type: "definition", text: "Versicherer ist die Vertragspartei, die das vereinbarte Risiko gegen Prämie absichert.", sourceKey: "vvg-1", passageKey: "vvg-1-all", riskLevel: "low" },
  { key: "versicherungsnehmer-role", category: "role", temporal: "current_2026", type: "definition", text: "Versicherungsnehmer ist die Vertragspartei, die die Prämie schuldet und den Versicherungsvertrag schließt.", sourceKey: "vvg-1", passageKey: "vvg-1-all", riskLevel: "low" },
  { key: "versicherte-person-role", category: "role", temporal: "current_2026", type: "definition", text: "Versicherte Person kann ein Dritter sein, dessen Risiko abgesichert ist. Sie ist nicht automatisch der Versicherungsnehmer.", sourceKey: "vvg-1", passageKey: "vvg-1-all", riskLevel: "high" },
  { key: "bezugsberechtigter-role", category: "role", temporal: "current_2026", type: "definition", text: "Ein Bezugsberechtigter kann Leistungsempfänger sein, ohne Versicherungsnehmer zu sein.", sourceKey: "vvg-1", passageKey: "vvg-1-all", riskLevel: "high" },
  { key: "geschaedigter-dritter", category: "role", temporal: "current_2026", type: "definition", text: "Ein Geschädigter oder sonstiger Dritter ist nicht automatisch Versicherungsnehmer und hat andere Rechte als die Vertragspartei.", sourceKey: "vvg-1", passageKey: "vvg-1-all", riskLevel: "high" },
  { key: "vermittler-role", category: "role", temporal: "current_2026", type: "definition", text: "Versicherungsvermittler sind Versicherungsvertreter und Versicherungsmakler.", sourceKey: "vvg-59", passageKey: "vvg-59-all", riskLevel: "medium" },
  { key: "makler-role", category: "role", temporal: "current_2026", type: "definition", text: "Ein Versicherungsmakler vermittelt für den Auftraggeber, ohne vom Versicherer betraut zu sein.", sourceKey: "vvg-59", passageKey: "vvg-59-all", riskLevel: "medium" },
  { key: "vertreter-role", category: "role", temporal: "current_2026", type: "definition", text: "Ein Versicherungsvertreter ist vom Versicherer oder einem Vertreter damit betraut, Verträge zu vermitteln oder abzuschließen.", sourceKey: "vvg-59", passageKey: "vvg-59-all", riskLevel: "medium" },
  { key: "berater-role", category: "role", temporal: "current_2026", type: "definition", text: "Ein Versicherungsberater berät unabhängig und ohne wirtschaftlichen Vorteil vom Versicherer.", sourceKey: "vvg-59", passageKey: "vvg-59-all", riskLevel: "medium" },
  { key: "vn-not-always-insured", category: "role", temporal: "current_2026", type: "exception", text: "Der Versicherungsnehmer ist nicht immer die versicherte Person.", sourceKey: "vvg-1", passageKey: "vvg-1-all", riskLevel: "high" },
  { key: "insured-not-always-vn", category: "role", temporal: "current_2026", type: "exception", text: "Die versicherte Person ist nicht immer der Versicherungsnehmer.", sourceKey: "vvg-1", passageKey: "vvg-1-all", riskLevel: "high" },
  { key: "beneficiary-not-vn", category: "role", temporal: "current_2026", type: "exception", text: "Ein Bezugsberechtigter ist nicht automatisch der Versicherungsnehmer.", sourceKey: "vvg-1", passageKey: "vvg-1-all", riskLevel: "high" },
  { key: "broker-not-insurer", category: "role", temporal: "current_2026", type: "exception", text: "Ein Versicherungsmakler ist nicht der Versicherer.", sourceKey: "vvg-59", passageKey: "vvg-59-all", riskLevel: "high" },
  { key: "third-party-not-vn", category: "role", temporal: "current_2026", type: "exception", text: "Ein geschädigter Dritter ist nicht der Versicherungsnehmer.", sourceKey: "vvg-1", passageKey: "vvg-1-all", riskLevel: "high" },
  { key: "antrag-is-application", category: "document", temporal: "current_2026", type: "definition", text: "Der Versicherungsantrag ist die Vertragserklärung des Versicherungsnehmers und noch nicht der Versicherungsschein.", sourceKey: "vvg-5", passageKey: "vvg-5-all", riskLevel: "medium" },
  { key: "schein-is-policy", category: "document", temporal: "current_2026", type: "definition", text: "Der Versicherungsschein ist die vom Versicherer in Textform zu übermittelnde Vertragsurkunde.", sourceKey: "vvg-3", passageKey: "vvg-3-all", riskLevel: "low" },
  { key: "nachtrag-is-endorsement", category: "document", temporal: "current_2026", type: "definition", text: "Ein Nachtrag kann den Vertrag ändern und ist Fallbeweis, nicht allgemeines Gesetzesrecht.", sourceKey: "vvg-3", passageKey: "vvg-3-all", riskLevel: "medium" },
  { key: "pib-not-entire-contract", category: "document", temporal: "current_2026", type: "exception", text: "Das Produktinformationsblatt ist nicht der gesamte Versicherungsvertrag.", sourceKey: "vvginfov-4", passageKey: "vvginfov-4-all", riskLevel: "high" },
  { key: "mahnung-not-automatically-termination", category: "document", temporal: "current_2026", type: "exception", text: "Eine Mahnung ist nicht automatisch eine Kündigung und nicht automatisch die qualifizierte Folgeprämienbestimmung.", sourceKey: "vvg-38", passageKey: "vvg-38-all", riskLevel: "high" },
  { key: "letter-not-automatically-decision", category: "document", temporal: "current_2026", type: "exception", text: "Ein Versicherungsschreiben ist nicht automatisch eine abschließende Leistungsentscheidung.", sourceKey: "vvg-14", passageKey: "vvg-14-all", riskLevel: "high" },
  { key: "ablehnung-not-bescheid", category: "document", temporal: "current_2026", type: "exception", text: "Ein mit Ablehnung überschriebenes Schreiben eines privaten Versicherers ist kein Verwaltungsbescheid.", sourceKey: "vvg-1", passageKey: "vvg-1-all", riskLevel: "high" },
  { key: "payment-not-automatically-final", category: "document", temporal: "current_2026", type: "exception", text: "Eine Zahlung ist nicht automatisch die endgültige Abrechnung des gesamten Anspruchs.", sourceKey: "vvg-14", passageKey: "vvg-14-all", riskLevel: "high" },
  { key: "vorbehalt-not-final", category: "document", temporal: "current_2026", type: "exception", text: "Eine Vorbehaltsmitteilung ist nicht die endgültige Deckungszusage.", sourceKey: "vvg-14", passageKey: "vvg-14-all", riskLevel: "medium" },
  { key: "vergleich-not-admission", category: "document", temporal: "current_2026", type: "exception", text: "Ein Vergleichs- oder Abfindungsangebot des Versicherers ist kein Anerkenntnis der vollen geltend gemachten Forderung.", sourceKey: "vvg-14", passageKey: "vvg-14-all", riskLevel: "high" },
  { key: "avb-not-statute", category: "contract", temporal: "current_2026", type: "exception", text: "Allgemeine Versicherungsbedingungen sind Vertragsbestimmungen und kein Gesetz.", sourceKey: "vvginfov-1", passageKey: "vvginfov-1-all", riskLevel: "high" },
  { key: "marketing-not-contract", category: "contract", temporal: "current_2026", type: "exception", text: "Eine Marketingseite ist nicht die gesetzlich geschuldete vorvertragliche Information und nicht der Vertrag.", sourceKey: "vvg-7", passageKey: "vvg-7-all", riskLevel: "high" },
  { key: "oral-not-automatically-policy", category: "contract", temporal: "current_2026", type: "exception", text: "Eine mündliche Verkaufsaussage ist nicht automatisch der Inhalt des Versicherungsscheins.", sourceKey: "vvg-3", passageKey: "vvg-3-all", riskLevel: "high" },
  { key: "schein-not-always-complete", category: "contract", temporal: "current_2026", type: "exception", text: "Der Versicherungsschein allein ist nicht immer die vollständige Vertragsdokumentation; AVB und Nachträge können fehlen.", sourceKey: "vvg-7", passageKey: "vvg-7-all", riskLevel: "high" },
  { key: "info-before-contract", category: "contract", temporal: "current_2026", type: "duty", text: "Vor der Vertragserklärung sind Vertragsbestimmungen einschließlich AVB und die VVG-InfoV-Informationen in Textform mitzuteilen.", sourceKey: "vvg-7", passageKey: "vvg-7-all", riskLevel: "medium" },
  { key: "three-layers-separate", category: "contract", temporal: "current_2026", type: "procedure", text: "Kanonisches Gesetz, vertragliche AVB oder Nachträge und konkrete Schreiben- oder Schadensfacts bleiben getrennte Beweisschichten und ersetzen einander nicht stillschweigend.", sourceKey: "vvg-7", passageKey: "vvg-7-all", riskLevel: "high" },
  { key: "avb-case-evidence-not-universal", category: "contract", temporal: "current_2026", type: "exception", text: "Versicherungsschein, Nachtrag, AVB, Tarifbedingungen und Produktinformationsblatt des einzelnen Vertrags sind Fallbeweis und nicht allgemeines deutsches Gesetzesrecht.", sourceKey: "vvg-3", passageKey: "vvg-3-all", riskLevel: "high" },
  { key: "abweichung-one-month-if-notice", category: "contract", temporal: "current_2026", type: "deadline", text: "Weicht der Versicherungsschein ab und sind die gesetzlichen auffälligen Hinweise erfüllt, kann der Versicherungsnehmer innerhalb eines Monats nach Zugang in Textform widersprechen.", sourceKey: "vvg-5", passageKey: "vvg-5-all", riskLevel: "high", requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "abweichung-not-automatic-acceptance", category: "contract", temporal: "current_2026", type: "exception", text: "Eine Abweichung des Versicherungsscheins gilt nicht automatisch sofort als angenommen.", sourceKey: "vvg-5", passageKey: "vvg-5-all", riskLevel: "high" },
  { key: "abweichung-needs-conspicuous-notice", category: "contract", temporal: "current_2026", type: "exception", text: "Die Monatsregel gilt nicht unabhängig vom gesetzlich erforderlichen auffälligen Hinweis auf jede Abweichung.", sourceKey: "vvg-5", passageKey: "vvg-5-all", riskLevel: "high" },
  { key: "abweichung-without-notice-application", category: "contract", temporal: "current_2026", type: "definition", text: "Erfüllt der Versicherer die Hinweispflichten nicht, gilt der Vertrag mit dem Inhalt des Antrags.", sourceKey: "vvg-5", passageKey: "vvg-5-all", riskLevel: "high" },
  { key: "abweichung-needs-facts", category: "contract", temporal: "current_2026", type: "exception", text: "Ohne Antrag, Versicherungsschein und Hinweisdokument darf eine individuelle Abweichungsfolge nicht entschieden werden.", sourceKey: "vvg-5", passageKey: "vvg-5-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT", "EVENT_DATE"] },
  { key: "general-14-day-widerruf", category: "widerruf", temporal: "current_2026", type: "deadline", text: "Im allgemeinen VVG kann der Versicherungsnehmer innerhalb von 14 Tagen in Textform widerrufen.", sourceKey: "vvg-8", passageKey: "vvg-8-all", riskLevel: "medium" },
  { key: "life-30-day-widerruf", category: "widerruf", temporal: "current_2026", type: "deadline", text: "Bei der Lebensversicherung beträgt die Widerrufsfrist 30 Tage.", sourceKey: "vvg-152", passageKey: "vvg-152-all", riskLevel: "high" },
  { key: "life-not-14-default", category: "widerruf", temporal: "current_2026", type: "exception", text: "Die Lebensversicherung folgt nicht der allgemeinen 14-Tage-Widerrufsfrist.", sourceKey: "vvg-152", passageKey: "vvg-152-all", riskLevel: "high" },
  { key: "insurance-not-always-14-widerruf", category: "widerruf", temporal: "current_2026", type: "exception", text: "Nicht jeder Versicherungsvertrag hat in jeder Sparte eine 14-tägige Widerrufsfrist.", sourceKey: "vvg-8", passageKey: "vvg-8-all", riskLevel: "high" },
  { key: "contract-date-not-automatically-start", category: "widerruf", temporal: "current_2026", type: "exception", text: "Das Vertragsdatum ist nicht automatisch der Beginn der Widerrufsfrist, wenn erforderliche Unterlagen oder die Belehrung noch nicht zugegangen sind.", sourceKey: "vvg-8", passageKey: "vvg-8-all", riskLevel: "high" },
  { key: "policy-received-not-enough", category: "widerruf", temporal: "current_2026", type: "exception", text: "Der Empfang des Versicherungsscheins allein setzt die Widerrufsfrist nicht, wenn erforderliche Informationen oder die Widerrufsbelehrung fehlen.", sourceKey: "vvg-8", passageKey: "vvg-8-all", riskLevel: "high" },
  { key: "individual-widerruf-fail-closed", category: "widerruf", temporal: "current_2026", type: "exception", text: "Eine individuelle Widerrufsfrist darf ohne Zugang von Schein, AVB, Informationen, Belehrung und Empfangsdaten nicht berechnet werden.", sourceKey: "vvg-8", passageKey: "vvg-8-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "section-19-text-question", category: "disclosure", temporal: "current_2026", type: "duty", text: "Anzuzeigen sind bekannte erhebliche Gefahrumstände, nach denen der Versicherer in Textform gefragt hat.", sourceKey: "vvg-19", passageKey: "vvg-19-all", riskLevel: "high" },
  { key: "forgotten-not-automatic-rescission", category: "disclosure", temporal: "current_2026", type: "exception", text: "Ein vergessener Umstand führt nicht automatisch zur Vertragsaufhebung.", sourceKey: "vvg-19", passageKey: "vvg-19-all", riskLevel: "high" },
  { key: "unasked-not-automatically-breach", category: "disclosure", temporal: "current_2026", type: "exception", text: "Ein Umstand, nach dem nicht in Textform gefragt wurde, ist nicht automatisch eine Verletzung der Anzeigepflicht.", sourceKey: "vvg-19", passageKey: "vvg-19-all", riskLevel: "high" },
  { key: "incorrect-not-automatic-total-loss", category: "disclosure", temporal: "current_2026", type: "exception", text: "Eine unrichtige Antwort bedeutet nicht automatisch den totalen Verlust des Versicherungsschutzes.", sourceKey: "vvg-19", passageKey: "vvg-19-all", riskLevel: "high" },
  { key: "allegation-not-proven-intent", category: "disclosure", temporal: "current_2026", type: "exception", text: "Die Behauptung des Versicherers ist nicht der Nachweis vorsätzlicher Täuschung.", sourceKey: "vvg-19", passageKey: "vvg-19-all", riskLevel: "high" },
  { key: "do-not-decide-intent-19", category: "disclosure", temporal: "current_2026", type: "exception", text: "Vorsatz oder grobe Fahrlässigkeit der Anzeigepflicht dürfen ohne Beweistatsachen nicht festgestellt werden.", sourceKey: "vvg-19", passageKey: "vvg-19-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "any-life-change-not-gefahr", category: "risk_change", temporal: "current_2026", type: "exception", text: "Nicht jede Lebensänderung ist eine Gefahrerhöhung.", sourceKey: "vvg-23", passageKey: "vvg-23-all", riskLevel: "high" },
  { key: "gefahr-not-automatic-loss", category: "risk_change", temporal: "current_2026", type: "exception", text: "Eine Gefahrerhöhung bedeutet nicht automatisch den totalen Verlust des Versicherungsschutzes.", sourceKey: "vvg-26", passageKey: "vvg-26-all", riskLevel: "high" },
  { key: "gefahr-premium-not-automatically-40", category: "risk_change", temporal: "current_2026", type: "exception", text: "Eine Prämienerhöhung nach Gefahränderung ist nicht notwendig eine Anpassung nach § 40 VVG.", sourceKey: "vvg-25", passageKey: "vvg-25-all", riskLevel: "high" },
  { key: "obliegenheit-not-automatic-denial", category: "obliegenheit", temporal: "current_2026", type: "exception", text: "Eine Obliegenheitsverletzung ist nicht automatisch eine Totalablehnung.", sourceKey: "vvg-28", passageKey: "vvg-28-all", riskLevel: "high" },
  { key: "gross-neg-not-automatic-zero", category: "obliegenheit", temporal: "current_2026", type: "exception", text: "Grobe Fahrlässigkeit führt nicht automatisch zur Nullzahlung, sondern kann eine anteilige Kürzung eröffnen.", sourceKey: "vvg-28", passageKey: "vvg-28-all", riskLevel: "high" },
  { key: "causality-can-preserve-cover", category: "obliegenheit", temporal: "current_2026", type: "exception", text: "Fehlt die Kausalität der Obliegenheitsverletzung, bleibt der Versicherer zur Leistung verpflichtet, außer bei Arglist.", sourceKey: "vvg-28", passageKey: "vvg-28-all", riskLevel: "high" },
  { key: "post-loss-warning-required", category: "obliegenheit", temporal: "current_2026", type: "duty", text: "Nach dem Versicherungsfall setzt Leistungsfreiheit bei Auskunfts- oder Aufklärungsobliegenheiten einen gesonderten Hinweis in Textform voraus.", sourceKey: "vvg-28", passageKey: "vvg-28-all", riskLevel: "high" },
  { key: "insurer-says-obliegenheit-not-established", category: "obliegenheit", temporal: "current_2026", type: "exception", text: "Wenn der Versicherer Obliegenheitsverletzung sagt, ist die Rechtsfolge nicht bereits gesetzlich festgestellt.", sourceKey: "vvg-28", passageKey: "vvg-28-all", riskLevel: "high" },
  { key: "late-info-not-automatic-total", category: "obliegenheit", temporal: "current_2026", type: "exception", text: "Eine verspätete Auskunft bedeutet nicht automatisch den totalen Verlust des Versicherungsschutzes.", sourceKey: "vvg-28", passageKey: "vvg-28-all", riskLevel: "high" },
  { key: "do-not-decide-intent-28", category: "obliegenheit", temporal: "current_2026", type: "exception", text: "Vorsatz oder grobe Fahrlässigkeit einer Obliegenheit dürfen ohne Beweistatsachen nicht entschieden werden.", sourceKey: "vvg-28", passageKey: "vvg-28-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "first-not-follow-up-premium", category: "premium", temporal: "current_2026", type: "definition", text: "Erstprämie nach § 37 VVG und Folgeprämie nach § 38 VVG sind verschiedene Mechanismen.", sourceKey: "vvg-37", passageKey: "vvg-37-all", riskLevel: "high" },
  { key: "unpaid-not-same-result", category: "premium", temporal: "current_2026", type: "exception", text: "Unbezahlte Prämie führt nicht in jedem Fall zum selben Rechtsergebnis.", sourceKey: "vvg-38", passageKey: "vvg-38-all", riskLevel: "high" },
  { key: "late-not-automatic-end", category: "premium", temporal: "current_2026", type: "exception", text: "Verspätete Zahlung beendet den Vertrag nicht automatisch sofort.", sourceKey: "vvg-38", passageKey: "vvg-38-all", riskLevel: "high" },
  { key: "ordinary-mahnung-not-38", category: "premium", temporal: "current_2026", type: "exception", text: "Eine gewöhnliche Mahnung ist nicht automatisch die wirksame qualifizierte Bestimmung nach § 38 VVG.", sourceKey: "vvg-38", passageKey: "vvg-38-all", riskLevel: "high" },
  { key: "section-37-warning-required", category: "premium", temporal: "current_2026", type: "duty", text: "Leistungsfreiheit wegen unbezahlter Erstprämie setzt den gesetzlichen Hinweis in Textform oder im Versicherungsschein voraus.", sourceKey: "vvg-37", passageKey: "vvg-37-all", riskLevel: "high" },
  { key: "section-37-fault-boundary", category: "premium", temporal: "current_2026", type: "exception", text: "Unbezahlte Erstprämie macht den Versicherer nicht unabhängig von Hinweis und Vertretenmüssen leistungsfrei.", sourceKey: "vvg-37", passageKey: "vvg-37-all", riskLevel: "high" },
  { key: "section-38-two-weeks", category: "premium", temporal: "current_2026", type: "deadline", text: "Die qualifizierte Folgeprämienbestimmung muss in Textform eine Zahlungsfrist von mindestens zwei Wochen setzen und Rückstände, Zinsen, Kosten und Rechtsfolgen angeben.", sourceKey: "vvg-38", passageKey: "vvg-38-all", riskLevel: "high" },
  { key: "fourteen-days-not-from-document-date", category: "premium", temporal: "current_2026", type: "exception", text: "Vierzehn Tage laufen nicht automatisch ab dem auf der Mahnung gedruckten Datum.", sourceKey: "vvg-38", passageKey: "vvg-38-all", riskLevel: "high" },
  { key: "later-payment-not-retro-cover", category: "premium", temporal: "current_2026", type: "exception", text: "Spätere Zahlung stellt nicht automatisch rückwirkenden Schutz für einen bereits eingetretenen Versicherungsfall wieder her.", sourceKey: "vvg-38", passageKey: "vvg-38-all", riskLevel: "high" },
  { key: "section-40-one-month-receipt", category: "premium", temporal: "current_2026", type: "deadline", text: "Nach § 40 VVG kann bei Anpassungsklausel ohne entsprechende Leistungsänderung innerhalb eines Monats nach Zugang gekündigt werden.", sourceKey: "vvg-40", passageKey: "vvg-40-all", riskLevel: "high", requiredContextKeys: ["EVENT_DATE"] },
  { key: "section-40-not-universal-pkv", category: "premium", temporal: "current_2026", type: "exception", text: "§ 40 VVG ist nicht die universelle Kündigungsregel jeder Prämienerhöhung; die private Krankenversicherung hat Sonderregeln.", sourceKey: "vvg-40", passageKey: "vvg-40-all", riskLevel: "high" },
  { key: "increase-not-automatically-invalid", category: "premium", temporal: "current_2026", type: "exception", text: "Eine Prämienerhöhung ist nicht automatisch unwirksam.", sourceKey: "vvg-40", passageKey: "vvg-40-all", riskLevel: "high" },
  { key: "increase-not-only-ordinary-cancel", category: "premium", temporal: "current_2026", type: "exception", text: "Eine Prämienerhöhung eröffnet nicht nur den gewöhnlichen Kündigungsweg.", sourceKey: "vvg-40", passageKey: "vvg-40-all", riskLevel: "medium" },
  { key: "ordinary-section-11", category: "termination", temporal: "current_2026", type: "definition", text: "Die allgemeinen Kündigungs- und Verlängerungsregeln des § 11 VVG gelten nicht unverändert in jeder Sparte.", sourceKey: "vvg-11", passageKey: "vvg-11-all", riskLevel: "high" },
  { key: "renewal-not-unlimited-multi", category: "termination", temporal: "current_2026", type: "exception", text: "Automatische Verlängerung ist unwirksam, soweit sie sich jeweils auf mehr als ein Jahr erstreckt.", sourceKey: "vvg-11", passageKey: "vvg-11-all", riskLevel: "medium" },
  { key: "sent-not-necessarily-received", category: "termination", temporal: "current_2026", type: "exception", text: "Eine abgesandte Kündigung ist nicht notwendig zugegangen und wirksam.", sourceKey: "vvg-11", passageKey: "vvg-11-all", riskLevel: "high" },
  { key: "individual-cancel-fail-closed", category: "termination", temporal: "current_2026", type: "exception", text: "Eine individuelle Kündigungsfrist darf ohne Vertragslauf, Zugang und Sparte nicht berechnet werden.", sourceKey: "vvg-11", passageKey: "vvg-11-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "no-universal-post-claim", category: "termination", temporal: "current_2026", type: "exception", text: "Ein Versicherungsfall begründet kein universelles Sonderkündigungsrecht jeder Versicherungssparte.", sourceKey: "vvg-92", passageKey: "vvg-92-all", riskLevel: "high" },
  { key: "section-92-is-sach", category: "termination", temporal: "current_2026", type: "definition", text: "§ 92 VVG steht im Sachversicherungsteil und darf nicht auf jede Versicherung verallgemeinert werden.", sourceKey: "vvg-92", passageKey: "vvg-92-all", riskLevel: "high" },
  { key: "notify-without-undue-delay", category: "claim", temporal: "current_2026", type: "duty", text: "Der Versicherungsfall ist nach Kenntnis unverzüglich dem Versicherer anzuzeigen.", sourceKey: "vvg-30", passageKey: "vvg-30-all", riskLevel: "medium" },
  { key: "late-claim-not-automatic-zero", category: "claim", temporal: "current_2026", type: "exception", text: "Verspätete Schadenanzeige bedeutet nicht automatisch Nullzahlung.", sourceKey: "vvg-30", passageKey: "vvg-30-all", riskLevel: "high" },
  { key: "insurer-already-knew-matters", category: "claim", temporal: "current_2026", type: "exception", text: "Hat der Versicherer den Versicherungsfall auf andere Weise rechtzeitig erfahren, kann er sich auf vereinbarte Leistungsfreiheit wegen Anzeigeverletzung nicht berufen.", sourceKey: "vvg-30", passageKey: "vvg-30-all", riskLevel: "high" },
  { key: "section-31-necessary-info", category: "claim", temporal: "current_2026", type: "duty", text: "Der Versicherer kann erforderliche Auskünfte und zumutbare Belege zur Feststellung von Versicherungsfall und Leistungsumfang verlangen.", sourceKey: "vvg-31", passageKey: "vvg-31-all", riskLevel: "medium" },
  { key: "not-every-personal-document", category: "claim", temporal: "current_2026", type: "exception", text: "Eine Unterlagenanforderung berechtigt nicht automatisch zu jedem denkbaren persönlichen Dokument.", sourceKey: "vvg-31", passageKey: "vvg-31-all", riskLevel: "high" },
  { key: "missing-one-not-automatic-denial", category: "claim", temporal: "current_2026", type: "exception", text: "Ein fehlendes einzelnes Dokument ist nicht automatisch die Ablehnung.", sourceKey: "vvg-31", passageKey: "vvg-31-all", riskLevel: "high" },
  { key: "request-not-fraud-accusation", category: "claim", temporal: "current_2026", type: "exception", text: "Eine Auskunfts- oder Beleganforderung des Versicherers ist kein Betrugsvorwurf.", sourceKey: "vvg-31", passageKey: "vvg-31-all", riskLevel: "high" },
  { key: "section-14-due-when-complete", category: "claim", temporal: "current_2026", type: "definition", text: "Die Geldleistung wird fällig, wenn die notwendigen Erhebungen zu Versicherungsfall und Leistungsumfang beendet sind.", sourceKey: "vvg-14", passageKey: "vvg-14-all", riskLevel: "medium" },
  { key: "one-month-not-full-payout", category: "claim", temporal: "current_2026", type: "exception", text: "Ein Monat seit Schadenanzeige bedeutet nicht automatisch die volle Endzahlung.", sourceKey: "vvg-14", passageKey: "vvg-14-all", riskLevel: "high" },
  { key: "advance-probable-minimum", category: "claim", temporal: "current_2026", type: "procedure", text: "Sind notwendige Erhebungen nicht binnen eines Monats beendet, kann unter gesetzlichen Voraussetzungen eine Abschlagszahlung in Höhe des voraussichtlich mindestens geschuldeten Betrags verlangt werden.", sourceKey: "vvg-14", passageKey: "vvg-14-all", riskLevel: "medium" },
  { key: "advance-not-final", category: "claim", temporal: "current_2026", type: "exception", text: "Eine Abschlagszahlung ist nicht die endgültige Abrechnung.", sourceKey: "vvg-14", passageKey: "vvg-14-all", riskLevel: "high" },
  { key: "partial-not-final-closure", category: "claim", temporal: "current_2026", type: "exception", text: "Eine Teilzahlung schließt den Vorgang nicht automatisch endgültig.", sourceKey: "vvg-14", passageKey: "vvg-14-all", riskLevel: "high" },
  { key: "bgb-195-three-years", category: "limitation", temporal: "current_2026", type: "deadline", text: "Die regelmäßige Verjährungsfrist beträgt drei Jahre.", sourceKey: "bgb-195", passageKey: "bgb-195-all", riskLevel: "medium" },
  { key: "section-15-suspension", category: "limitation", temporal: "current_2026", type: "definition", text: "Nach Anmeldung des Versicherungsanspruchs ist die Verjährung gehemmt, bis die Entscheidung des Versicherers dem Anspruchsteller in Textform zugeht.", sourceKey: "vvg-15", passageKey: "vvg-15-all", riskLevel: "high" },
  { key: "rejection-not-immediately-barred", category: "limitation", temporal: "current_2026", type: "exception", text: "Die Ablehnung des Versicherers macht den Anspruch nicht sofort verjährt.", sourceKey: "vvg-15", passageKey: "vvg-15-all", riskLevel: "high" },
  { key: "complaint-not-every-deadline-stopped", category: "limitation", temporal: "current_2026", type: "exception", text: "Eine Beschwerde hemmt nicht automatisch jede gesetzliche oder vertragliche Frist.", sourceKey: "bafin-complaint", passageKey: "bafin-complaint-all", riskLevel: "high" },
  { key: "individual-limitation-fail-closed", category: "limitation", temporal: "current_2026", type: "exception", text: "Ein individueller Verjährungstag darf ohne Anspruchsart, Entstehung, Kenntnis, Anmeldung und Entscheidungszugang nicht berechnet werden.", sourceKey: "bgb-199", passageKey: "bgb-199-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "requires-policy-avb-facts", category: "coverage", temporal: "current_2026", type: "procedure", text: "Einzelne Deckung verlangt Versicherungsschein, versicherte Risiken, AVB, Ausschlüsse, Nachträge und die konkreten Schadensfacts.", sourceKey: "vvg-7", passageKey: "vvg-7-all", riskLevel: "high", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "product-name-not-coverage", category: "coverage", temporal: "current_2026", type: "exception", text: "Der Produktname beweist nicht die Deckung des konkreten Ereignisses.", sourceKey: "vvg-1", passageKey: "vvg-1-all", riskLevel: "high" },
  { key: "premium-paid-not-every-event", category: "coverage", temporal: "current_2026", type: "exception", text: "Gezahlte Prämie bedeutet nicht, dass jedes Ereignis versichert ist.", sourceKey: "vvg-1", passageKey: "vvg-1-all", riskLevel: "high" },
  { key: "haftpflicht-not-all-liability", category: "coverage", temporal: "current_2026", type: "exception", text: "Haftpflichtversicherung deckt nicht automatisch jede Haftung.", sourceKey: "vvg-1", passageKey: "vvg-1-all", riskLevel: "high" },
  { key: "rechtsschutz-not-every-dispute", category: "coverage", temporal: "current_2026", type: "exception", text: "Rechtsschutzversicherung deckt nicht jeden Rechtsstreit.", sourceKey: "vvg-1", passageKey: "vvg-1-all", riskLevel: "high" },
  { key: "vollkasko-not-every-vehicle", category: "coverage", temporal: "current_2026", type: "exception", text: "Vollkasko deckt nicht automatisch jeden Fahrzeugschaden.", sourceKey: "pflvg-1", passageKey: "pflvg-1-all", riskLevel: "high" },
  { key: "unfall-not-every-injury", category: "coverage", temporal: "current_2026", type: "exception", text: "Unfallversicherung deckt nicht jede Verletzung.", sourceKey: "vvg-1", passageKey: "vvg-1-all", riskLevel: "high" },
  { key: "individual-coverage-fail-closed", category: "coverage", temporal: "current_2026", type: "exception", text: "Ohne ausreichende Vertragsunterlagen und Schadensfacts darf nicht gesagt werden, dass das Ereignis bestimmt gedeckt ist.", sourceKey: "vvg-7", passageKey: "vvg-7-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "exclusion-exists-not-automatically-applies", category: "coverage", temporal: "current_2026", type: "exception", text: "Ein in den AVB gefundener Ausschluss gilt nicht automatisch für diesen Versicherungsfall.", sourceKey: "vvg-7", passageKey: "vvg-7-all", riskLevel: "high" },
  { key: "insurer-cites-not-automatically-correct", category: "coverage", temporal: "current_2026", type: "exception", text: "Wenn der Versicherer eine AVB-Klausel oder ein Gesetz zitiert, ist seine Auslegung nicht automatisch richtig.", sourceKey: "vvg-7", passageKey: "vvg-7-all", riskLevel: "high" },
  { key: "deductible-is-contract-fact", category: "coverage", temporal: "current_2026", type: "definition", text: "Selbstbeteiligung, Versicherungssumme und Sublimits sind Vertragsfacts und keine allgemeinen Euro-Sätze.", sourceKey: "vvg-3", passageKey: "vvg-3-all", riskLevel: "high" },
  { key: "no-universal-deductible-amount", category: "coverage", temporal: "current_2026", type: "exception", text: "Es gibt keinen zeitlosen allgemeinen Selbstbehalt etwa der Rechtsschutzversicherung.", sourceKey: "vvg-3", passageKey: "vvg-3-all", riskLevel: "high" },
  { key: "reduction-needs-reason", category: "decision", temporal: "current_2026", type: "procedure", text: "Eine Leistungskürzung darf nicht ohne die vom Versicherer genannte Begründung und den Vertrag rechtlich zugeordnet werden.", sourceKey: "vvg-28", passageKey: "vvg-28-all", riskLevel: "high", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "denial-not-automatically-correct", category: "decision", temporal: "current_2026", type: "exception", text: "Eine Leistungsablehnung ist nicht automatisch richtig.", sourceKey: "vvg-14", passageKey: "vvg-14-all", riskLevel: "high" },
  { key: "denial-not-automatically-wrong", category: "decision", temporal: "current_2026", type: "exception", text: "Eine Leistungsablehnung ist nicht automatisch falsch.", sourceKey: "vvg-14", passageKey: "vvg-14-all", riskLevel: "high" },
  { key: "do-not-predict-must-pay", category: "decision", temporal: "current_2026", type: "exception", text: "Ohne Vertrag, AVB und Beweistatsachen darf nicht gesagt werden, dass der Versicherer bestimmt zahlen muss.", sourceKey: "vvg-14", passageKey: "vvg-14-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "internal-written-complaint", category: "complaint", temporal: "current_2026", type: "procedure", text: "Die BaFin empfiehlt, sich zuerst schriftlich an das Unternehmen zu wenden und eine schriftliche Stellungnahme zu verlangen.", sourceKey: "bafin-complaint", passageKey: "bafin-complaint-all", riskLevel: "medium" },
  { key: "internal-not-lawsuit", category: "complaint", temporal: "current_2026", type: "exception", text: "Die interne Beschwerde ist keine Klage.", sourceKey: "bafin-complaint", passageKey: "bafin-complaint-all", riskLevel: "medium" },
  { key: "vom-members-only", category: "complaint", temporal: "current_2026", type: "definition", text: "Der allgemeine Versicherungsombudsmann ist für Verbraucheransprüche gegen teilnehmende Mitgliedsversicherer zuständig.", sourceKey: "vom-procedure", passageKey: "vom-procedure-all", riskLevel: "high" },
  { key: "vom-value-limits", category: "complaint", temporal: "current_2026", type: "definition", text: "Aktuell liegt der Beschwerdewert regelmäßig bei bis zu 100.000 Euro; bis 10.000 Euro kann die Entscheidung den Versicherer binden, darüber eine Empfehlung ergehen. Diese Werte sind zu revalidieren.", sourceKey: "vom-procedure", passageKey: "vom-procedure-all", riskLevel: "medium", requiresEffectiveDate: true },
  { key: "vom-court-access", category: "complaint", temporal: "current_2026", type: "exception", text: "Verbraucher müssen sich an die Ombudsentscheidung nicht halten und behalten den Gerichtsweg.", sourceKey: "vom-procedure", passageKey: "vom-procedure-all", riskLevel: "medium" },
  { key: "any-insurer-not-member", category: "complaint", temporal: "current_2026", type: "exception", text: "Nicht jeder Versicherer ist automatisch Mitglied des Versicherungsombudsmanns.", sourceKey: "vom-members", passageKey: "vom-members-all", riskLevel: "high" },
  { key: "ombudsmann-not-court", category: "complaint", temporal: "current_2026", type: "exception", text: "Der Ombudsmann ist kein Gericht.", sourceKey: "vom-procedure", passageKey: "vom-procedure-all", riskLevel: "medium" },
  { key: "recommendation-not-judgment", category: "complaint", temporal: "current_2026", type: "exception", text: "Eine Ombudsempfehlung ist kein bindendes Urteil.", sourceKey: "vom-procedure", passageKey: "vom-procedure-all", riskLevel: "medium" },
  { key: "pkv-excluded-from-general", category: "complaint", temporal: "current_2026", type: "exception", text: "Private Kranken- und Pflegeversicherung gehört nicht ins gewöhnliche Versicherer-Verfahren des allgemeinen Versicherungsombudsmanns.", sourceKey: "vom-procedure", passageKey: "vom-procedure-all", riskLevel: "high" },
  { key: "pkv-ombudsmann-route", category: "complaint", temporal: "current_2026", type: "procedure", text: "Private Kranken- und Pflegevertragsstreitigkeiten sind zum Ombudsmann Private Kranken- und Pflegeversicherung zu leiten, soweit dieser zuständig ist.", sourceKey: "pkv-ombudsmann", passageKey: "pkv-ombudsmann-all", riskLevel: "high" },
  { key: "gkv-not-pkv-ombudsmann", category: "complaint", temporal: "current_2026", type: "exception", text: "Gesetzliche Krankenkassenstreitigkeiten gehören nicht zum PKV-Ombudsmann.", sourceKey: "pkv-ombudsmann", passageKey: "pkv-ombudsmann-all", riskLevel: "high" },
  { key: "pkv-ombudsmann-not-widerspruch", category: "complaint", temporal: "current_2026", type: "exception", text: "Der PKV-Ombudsmann ist nicht die Widerspruchsstelle der gesetzlichen Krankenkasse.", sourceKey: "pkv-ombudsmann", passageKey: "pkv-ombudsmann-all", riskLevel: "high" },
  { key: "vsbg-framework", category: "complaint", temporal: "current_2026", type: "definition", text: "Anerkannte Verbraucherschlichtung folgt dem Verbraucherstreitbeilegungsgesetz; die interne Beschwerdestelle eines einzelnen Versicherers ist das nicht.", sourceKey: "vsbg-1", passageKey: "vsbg-1-all", riskLevel: "medium" },
  { key: "bafin-collective", category: "complaint", temporal: "current_2026", type: "definition", text: "Die BaFin schützt kollektiv Verbraucherinnen und Verbraucher und entscheidet nicht den einzelnen Zivilanspruch.", sourceKey: "bafin-complaint", passageKey: "bafin-complaint-all", riskLevel: "high" },
  { key: "bafin-not-individual-judgment", category: "complaint", temporal: "current_2026", type: "exception", text: "Eine BaFin-Beschwerde ist kein individuelles Leistungsurteil und zwingt den Versicherer nicht zur Zahlung wie ein Gericht.", sourceKey: "bafin-complaint", passageKey: "bafin-complaint-all", riskLevel: "high" },
  { key: "bafin-not-gkv-supervisor", category: "complaint", temporal: "current_2026", type: "exception", text: "Die BaFin ist nicht für gesetzliche Kranken-, Unfall- oder Rentenversicherung zuständig.", sourceKey: "bafin-complaint", passageKey: "bafin-complaint-all", riskLevel: "high" },
  { key: "bafin-land-possible", category: "complaint", temporal: "current_2026", type: "exception", text: "Manche nur regional tätigen Versicherer unterliegen der Landesaufsicht, nicht der BaFin.", sourceKey: "bafin-complaint", passageKey: "bafin-complaint-all", riskLevel: "medium" },
  { key: "bafin-not-ombudsmann", category: "complaint", temporal: "current_2026", type: "exception", text: "Eine BaFin-Beschwerde ist kein Ombudsmannverfahren.", sourceKey: "bafin-complaint", passageKey: "bafin-complaint-all", riskLevel: "medium" },
  { key: "bafin-deadlines-continue", category: "complaint", temporal: "current_2026", type: "exception", text: "Während einer BaFin-Beschwerde laufen gesetzliche und vertragliche Fristen weiter.", sourceKey: "bafin-complaint", passageKey: "bafin-complaint-all", riskLevel: "high" },
  { key: "civil-law-boundary", category: "complaint", temporal: "current_2026", type: "definition", text: "Private Versicherungsvertragsstreitigkeiten gehören grundsätzlich in zivilrechtliche Wege, nicht ins Sozialverwaltungsrecht.", sourceKey: "vvg-1", passageKey: "vvg-1-all", riskLevel: "high" },
  { key: "no-litigation-strategy", category: "complaint", temporal: "current_2026", type: "exception", text: "Ein individuelles Prozess- oder Klageergebnis darf ohne Vertrag und Beweise nicht vorhergesagt und Klage nicht automatisch empfohlen werden.", sourceKey: "bafin-complaint", passageKey: "bafin-complaint-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "high-risk-legal-advice", category: "complaint", temporal: "current_2026", type: "procedure", text: "Bei hohen Beträgen, Körperschäden, existenzieller PKV, nahender Verjährung, Arglistvorwurf oder bereits laufendem Verfahren ist qualifizierte Rechtsberatung der sichere nächste Schritt.", sourceKey: "bafin-complaint", passageKey: "bafin-complaint-all", riskLevel: "high" },
  { key: "bad-outcome-not-bad-advice", category: "intermediary", temporal: "current_2026", type: "exception", text: "Ein schlechter Verlauf beweist nicht automatisch schlechte Beratung.", sourceKey: "vvg-6", passageKey: "vvg-6-all", riskLevel: "high" },
  { key: "denial-not-automatically-intermediary", category: "intermediary", temporal: "current_2026", type: "exception", text: "Eine Leistungsablehnung des Versicherers begründet nicht automatisch Vermittlerhaftung.", sourceKey: "vvg-59", passageKey: "vvg-59-all", riskLevel: "high" },
  { key: "complex-advisor-oos", category: "intermediary", temporal: "current_2026", type: "exception", text: "Komplexe Beraterhaftung in der Sache liegt außerhalb dieses Kerns; nur sichere Einordnung und Routing sind zulässig.", sourceKey: "vvg-6", passageKey: "vvg-6-all", riskLevel: "high" },
  { key: "pkv-special-192", category: "boundary", temporal: "current_2026", type: "definition", text: "Für private Krankenversicherung gelten besondere VVG-Vorschriften ab § 192 und dürfen allgemeine Regeln nicht verdrängen.", sourceKey: "vvg-192", passageKey: "vvg-192-all", riskLevel: "high" },
  { key: "pkv-orientation-only", category: "boundary", temporal: "current_2026", type: "exception", text: "Dieses Pack enthält kein vollständiges privates Krankenversicherungs-Leistungsengine.", sourceKey: "vvg-192", passageKey: "vvg-192-all", riskLevel: "high" },
  { key: "kfz-haftpflicht-not-kasko", category: "boundary", temporal: "current_2026", type: "exception", text: "Kfz-Haftpflicht ist nicht Kasko.", sourceKey: "pflvg-1", passageKey: "pflvg-1-all", riskLevel: "high" },
  { key: "own-vehicle-not-haftpflicht", category: "boundary", temporal: "current_2026", type: "exception", text: "Schaden am eigenen Fahrzeug ist nicht der gewöhnliche eigene Sachschaden der Kfz-Haftpflicht.", sourceKey: "pflvg-1", passageKey: "pflvg-1-all", riskLevel: "high" },
  { key: "logo-not-authenticity", category: "authenticity", temporal: "current_2026", type: "exception", text: "Ein korrekt wirkendes Logo beweist nicht die Echtheit eines Versichererschreibens.", sourceKey: "bafin-complaint", passageKey: "bafin-complaint-all", riskLevel: "high" },
  { key: "sender-name-not-verified", category: "authenticity", temporal: "current_2026", type: "exception", text: "Der angezeigte Absendername ist nicht der verifizierte Versicherer.", sourceKey: "bafin-complaint", passageKey: "bafin-complaint-all", riskLevel: "high" },
  { key: "link-not-safe", category: "authenticity", temporal: "current_2026", type: "exception", text: "Ein Link in E-Mails, die wie vom Versicherer wirken, ist nicht automatisch sicher.", sourceKey: "bafin-complaint", passageKey: "bafin-complaint-all", riskLevel: "high" },
  { key: "payment-change-independent-contact", category: "authenticity", temporal: "current_2026", type: "procedure", text: "Bei geänderter Zahlungsempfängerangabe oder dringender neuer Kontoverbindung ist unabhängig geprüfter offizieller Versichererkontakt zu nutzen, etwa über die BaFin-Unternehmensdatenbank.", sourceKey: "bafin-complaint", passageKey: "bafin-complaint-all", riskLevel: "high" },
  { key: "no-generic-14-days", category: "limitation", temporal: "current_2026", type: "exception", text: "Es gibt keine generelle Versicherungsfrist von 14 Tagen für jedes Versicherungsrecht.", sourceKey: "vvg-8", passageKey: "vvg-8-all", riskLevel: "high" },
  { key: "document-date-not-deadline-start", category: "limitation", temporal: "current_2026", type: "exception", text: "Das auf dem Schreiben gedruckte Datum ist nicht automatisch der Fristbeginn.", sourceKey: "vvg-8", passageKey: "vvg-8-all", riskLevel: "high" },
  { key: "document-date-not-receipt", category: "limitation", temporal: "current_2026", type: "exception", text: "Das Dokumentdatum ist nicht der Zugangs- oder Empfangstag.", sourceKey: "vvg-13", passageKey: "vvg-13-all", riskLevel: "high" },
  { key: "do-not-fabricate-receipt", category: "limitation", temporal: "current_2026", type: "exception", text: "Ein Empfangs- oder Zugangsdatum eines Versicherungsschreibens darf nicht erfunden werden.", sourceKey: "vvg-13", passageKey: "vvg-13-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["EVENT_DATE"] },
  { key: "section-13-address", category: "limitation", temporal: "current_2026", type: "definition", text: "Ohne mitgeteilte neue Anschrift kann ein Einschreiben an die letzte bekannte Anschrift drei Tage nach Absendung als zugegangen gelten.", sourceKey: "vvg-13", passageKey: "vvg-13-all", riskLevel: "high" },
  { key: "undelivered-not-automatically-ineffective", category: "limitation", temporal: "current_2026", type: "exception", text: "Ein unzustellbarer Brief ist nicht automatisch unwirksam, ohne die gesetzlichen Anschriftenregeln zu prüfen.", sourceKey: "vvg-13", passageKey: "vvg-13-all", riskLevel: "high" },
  { key: "classify-insurance-type-not-merits", category: "boundary", temporal: "current_2026", type: "procedure", text: "Private Haftpflicht, Kfz-Haftpflicht, Kasko, Hausrat, Wohngebäude, Rechtsschutz, Unfall, Leben, Berufsunfähigkeit, PKV, private Pflege, Zusatz, Reise und Tierversicherungen sind einzuordnen, ohne ein vollständiges Sachengine zu starten.", sourceKey: "vvg-1", passageKey: "vvg-1-all", riskLevel: "medium", requiredContextKeys: ["PROCESS_VARIANT"] },
]);

export const VVG_PROCESSES: readonly VvgProcessSpec[] = Object.freeze([
  { key: "schreiben-einordnen", title: "Versicherungsschreiben einordnen 2026", trigger: "Ein Schreiben, das wie Versicherung wirkt, liegt vor", safeFirstStep: "Dokumenttyp, Absender und Rechtsrahmen trennen; nicht jedes Schreiben als Entscheidung oder Bescheid behandeln.", riskLevel: "high" },
  { key: "rechtsrahmen-bestimmen", title: "Rechtsrahmen GKV PKV private Versicherung bestimmen 2026", trigger: "Unklar ist, ob gesetzliche Krankenkasse, PKV, sonstige private Versicherung oder Sozialversicherung gilt", safeFirstStep: "Ohne gesicherten Rechtsrahmen nicht abschließend antworten und GKV in den gesetzlichen Kern leiten.", riskLevel: "high" },
  { key: "versicherungsart-bestimmen", title: "Versicherungsart bestimmen 2026", trigger: "Die Produktart eines privaten Vertrags soll eingeordnet werden", safeFirstStep: "Nur klassifizieren und bei Bedarf in Speziallogik routen, ohne ein vollständiges Leistungsengine zu starten.", riskLevel: "medium" },
  { key: "beteiligtenrolle-bestimmen", title: "Beteiligtenrolle bestimmen 2026", trigger: "Unklar ist, wer Versicherungsnehmer, versicherte Person, Bezugsberechtigter, Dritter oder Vermittler ist", safeFirstStep: "Die Rolle aus Vertrag und Schreiben prüfen; Versicherungsnehmer nicht mit versicherter Person gleichsetzen.", riskLevel: "high" },
  { key: "vertrag-schein-einordnen", title: "Vertrag und Versicherungsschein einordnen 2026", trigger: "Ein neuer Versicherungsschein, Nachtrag oder vorvertragliche Unterlagen liegen vor", safeFirstStep: "Schein, AVB, PIB und Marketing trennen; den Schein nicht als vollständigen Vertrag behandeln.", riskLevel: "medium" },
  { key: "abweichenden-schein-pruefen", title: "Abweichenden Versicherungsschein prüfen 2026", trigger: "Der Versicherungsschein weicht vom Antrag oder der Vereinbarung ab", safeFirstStep: "Antrag, Schein und auffälligen Hinweis prüfen; Abweichung nicht automatisch als angenommen behandeln.", riskLevel: "high" },
  { key: "widerruf-einordnen", title: "Widerruf einordnen 2026", trigger: "Der Vertrag soll widerrufen werden oder die Widerrufsfrist ist unklar", safeFirstStep: "Allgemeine 14 Tage und Lebensversicherung 30 Tage trennen; ohne Zugangsdaten keine individuelle Frist berechnen.", riskLevel: "high" },
  { key: "anzeigepflicht-einordnen", title: "Vorvertragliche Anzeigepflicht einordnen 2026", trigger: "Der Versicherer rügt fehlende oder unrichtige Angaben", safeFirstStep: "Nur textförmig erfragte bekannte Gefahrumstände prüfen; Vorsatz nicht ohne Beweis feststellen.", riskLevel: "high" },
  { key: "gefahrenerhoehung-einordnen", title: "Gefahrerhöhung einordnen 2026", trigger: "Der Versicherer behauptet eine Gefahrerhöhung oder das Leben hat sich geändert", safeFirstStep: "Nicht jede Änderung als Gefahrerhöhung behandeln und nicht automatisch Deckungsverlust annehmen.", riskLevel: "high" },
  { key: "praemie-faelligkeit-einordnen", title: "Prämie und Fälligkeit einordnen 2026", trigger: "Eine Beitragsrechnung oder Zahlungsaufforderung liegt vor", safeFirstStep: "Erstprämie und Folgeprämie trennen; Mahnung nicht mit qualifizierter §-38-Bestimmung verwechseln.", riskLevel: "high" },
  { key: "erstpraemienverzug-behandeln", title: "Erstprämienverzug behandeln 2026", trigger: "Die erste oder einmalige Prämie ist unbezahlt", safeFirstStep: "Hinweis, Vertretenmüssen und Leistungsfreiheit getrennt prüfen.", riskLevel: "high" },
  { key: "folgepraemien-mahnung-behandeln", title: "Folgeprämien-Mahnung behandeln 2026", trigger: "Eine Mahnung oder Zahlungsfrist zur Folgeprämie liegt vor", safeFirstStep: "Textform, Zweiwochemindestfrist, Bezifferung und Rechtsfolgen prüfen; gewöhnliche Mahnung nicht als § 38 behandeln.", riskLevel: "high" },
  { key: "beitrags-leistungs-aenderung", title: "Beitrags- oder Leistungsänderung behandeln 2026", trigger: "Die Prämie steigt oder der Schutz wird gekürzt", safeFirstStep: "§ 40 und Spartensonderregeln trennen; Erhöhung nicht automatisch für unwirksam erklären.", riskLevel: "high" },
  { key: "kuendigung-einordnen", title: "Kündigung einordnen 2026", trigger: "Der Vertrag soll gekündigt werden oder der Versicherer kündigt", safeFirstStep: "Ordentliche und besondere Kündigung trennen; keinen universellen Nachschaden-Kündigungssatz verwenden.", riskLevel: "high" },
  { key: "schaden-melden", title: "Schaden oder Versicherungsfall melden 2026", trigger: "Ein möglicher Versicherungsfall ist eingetreten", safeFirstStep: "Produkt und Vertrag bestimmen, unverzüglich anzeigen, Beweise sichern und Verspätung nicht als automatische Nullzahlung behandeln.", riskLevel: "medium" },
  { key: "unterlagen-nachreichen", title: "Unterlagen oder Auskunft nachreichen 2026", trigger: "Der Versicherer verlangt Auskunft oder Belege", safeFirstStep: "Genaues Verlangen, Erforderlichkeit und Zumutbarkeit prüfen; fehlendes Einzelstück nicht als automatische Ablehnung behandeln.", riskLevel: "medium" },
  { key: "deckung-pruefen", title: "Deckung und Vertragsunterlagen prüfen 2026", trigger: "Gefragt wird, ob ein Ereignis versichert ist", safeFirstStep: "Ohne Schein, AVB und Schadensfacts nicht abschließend decken; Produktname nicht als Beweis verwenden.", riskLevel: "high" },
  { key: "obliegenheitsvorwurf-einordnen", title: "Obliegenheitsvorwurf einordnen 2026", trigger: "Der Versicherer beruft sich auf Obliegenheitsverletzung oder grobe Fahrlässigkeit", safeFirstStep: "Vorsatz, grobe Fahrlässigkeit, Kausalität und Textformhinweis trennen; Totalablehnung nicht automatisch annehmen.", riskLevel: "high" },
  { key: "leistungspruefung-abschlag", title: "Leistungsprüfung und Abschlagszahlung einordnen 2026", trigger: "Die Prüfung dauert länger als einen Monat oder eine Abschlagszahlung wird verlangt", safeFirstStep: "Einen Monat nicht als volle Endzahlung behandeln; Abschlag vom Endbetrag trennen.", riskLevel: "medium" },
  { key: "leistungsabrechnung-verstehen", title: "Leistungsabrechnung verstehen 2026", trigger: "Eine Zusage, Teilzahlung oder Abrechnung liegt vor", safeFirstStep: "Vorbehalt, Teilzahlung und Endabrechnung trennen; Zahlung nicht als umfassendes Anerkenntnis lesen.", riskLevel: "medium" },
  { key: "leistungskuerzung-verstehen", title: "Leistungskürzung verstehen 2026", trigger: "Der Versicherer kürzt die Leistung", safeFirstStep: "Die genannte Begründung und den Vertrag verlangen; die Rechtsgrundlage nicht erraten.", riskLevel: "high" },
  { key: "leistungsablehnung-behandeln", title: "Leistungsablehnung behandeln 2026", trigger: "Der private Versicherer lehnt ganz oder teilweise ab", safeFirstStep: "Nicht als Bescheid oder Widerspruchsfall behandeln; intern beschweren, dann passenden Ombudsmann oder Zivilweg prüfen.", riskLevel: "high" },
  { key: "rueckforderung-regress", title: "Rückforderung oder Regress einordnen 2026", trigger: "Der Versicherer fordert Geld zurück oder kündigt Regress an", safeFirstStep: "Anspruchsgrund, Vertrag und Beweise trennen; keine individuelle Zahlungspflicht ohne Tatsachen feststellen.", riskLevel: "high" },
  { key: "interne-beschwerde", title: "Interne Beschwerde beim Versicherer 2026", trigger: "Der Nutzer will sich beim Versicherer beschweren", safeFirstStep: "Schriftlich Vertrag und Streitpunkt darlegen und Stellungnahme verlangen; Beschwerde nicht mit Klage oder Fristenhemmung verwechseln.", riskLevel: "medium" },
  { key: "versicherungsombudsmann-route", title: "Versicherungsombudsmann route 2026", trigger: "Außergerichtliche Streitbeilegung gegen einen privaten Versicherer wird erwogen", safeFirstStep: "Mitgliedschaft live prüfen; PKV ausnehmen; Bindung und Empfehlung nicht mit Urteil verwechseln.", riskLevel: "high" },
  { key: "pkv-ombudsmann-route", title: "PKV-Ombudsmann route 2026", trigger: "Ein privater Kranken- oder Pflegevertrag ist streitig", safeFirstStep: "Zum PKV-Ombudsmann leiten und weder allgemeinen Ombudsmann noch GKV-Widerspruch verwenden.", riskLevel: "high" },
  { key: "bafin-beschwerde-boundary", title: "BaFin-Beschwerdegrenze 2026", trigger: "Eine Aufsichtsbeschwerde wird erwogen", safeFirstStep: "Kollektiven Verbraucherschutz erklären; keine individuelle Zahlungsanordnung und keine Fristhemmung annehmen.", riskLevel: "high" },
  { key: "vermittler-beratung-einordnen", title: "Vermittler- oder Beratungsproblem einordnen 2026", trigger: "Schlechte Beratung, Makler oder Vertreter wird vorgeworfen", safeFirstStep: "Makler, Vertreter und Versicherer trennen; komplexe Haftung nur routen.", riskLevel: "high" },
  { key: "verjaehrung-fristen-einordnen", title: "Verjährung und Fristen sicher einordnen 2026", trigger: "Eine Versicherungsfrist oder Verjährung soll bestimmt werden", safeFirstStep: "Fristursprung benennen; Dokumentdatum nicht als Zugang verwenden; individuelle Fristen ohne Tatsachen nicht berechnen.", riskLevel: "high" },
  { key: "authentizitaet-phishing-pruefen", title: "Authentizität und Phishing prüfen 2026", trigger: "Ein versichererähnliches Schreiben verlangt Zahlung, Kontodaten oder Zugangsdaten", safeFirstStep: "Logo und Absendername nicht als Echtheit behandeln; geänderte Konten unabhängig über geprüften Kontakt klären.", riskLevel: "high" },
]);

export const VVG_FORMS: readonly VvgFormSpec[] = Object.freeze([
  { key: "schein-anforderung", name: "Versicherungsschein oder Abschrift anfordern", identifier: "VVG-Versicherungsschein-Anforderung", purpose: "Fehlenden Versicherungsschein oder Abschriften vertragsbezogener Erklärungen anfordern", submissionChannels: ["text_form_to_insurer"], sourceKey: "vvg-3", passageKey: "vvg-3-all" },
  { key: "schadenanzeige", name: "Anzeige des Versicherungsfalles", identifier: "VVG-Schadenanzeige", purpose: "Unverzügliche Anzeige des Versicherungsfalles beim Versicherer", submissionChannels: ["text_form_to_insurer"], sourceKey: "vvg-30", passageKey: "vvg-30-all" },
  { key: "interne-beschwerde-form", name: "Schriftliche Beschwerde beim Versicherer", identifier: "VVG-Interne-Beschwerde", purpose: "Schriftliche Stellungnahme des Versicherers zu Vertrag oder Leistung verlangen", submissionChannels: ["written_to_insurer"], sourceKey: "bafin-complaint", passageKey: "bafin-complaint-all" },
  { key: "vom-antrag", name: "Schlichtungsantrag Versicherungsombudsmann", identifier: "VOM-Schlichtungsantrag", purpose: "Verbraucherschlichtung gegen ein Mitgliedsunternehmen", submissionChannels: ["online_or_post"], sourceKey: "vom-procedure", passageKey: "vom-procedure-all" },
  { key: "pkv-antrag", name: "Antrag Ombudsmann Private Kranken- und Pflegeversicherung", identifier: "PKV-Ombudsmann-Antrag", purpose: "Schlichtung privater Kranken- oder Pflegevertragsstreitigkeiten", submissionChannels: ["online_or_post_or_fax"], sourceKey: "pkv-ombudsmann", passageKey: "pkv-ombudsmann-all" },
  { key: "bafin-form", name: "BaFin-Verbraucherbeschwerde", identifier: "BAFIN-Verbraucherbeschwerde", purpose: "Aufsichtliche Verbraucherhinweise zu beaufsichtigten Unternehmen", submissionChannels: ["online_form"], sourceKey: "bafin-complaint", passageKey: "bafin-complaint-all" },
]);

export const VVG_PROCESS_BINDINGS: readonly VvgBindingSpec[] = Object.freeze([
  { processKey: "schreiben-einordnen", role: "orientation_basis", sequenceContext: "classify-letter", claimKeys: ["letter-not-automatically-decision", "private-letter-not-bescheid", "ablehnung-not-bescheid", "mahnung-not-automatically-termination"] },
  { processKey: "rechtsrahmen-bestimmen", role: "identification", sequenceContext: "legal-system-gate", claimKeys: ["versicherung-not-one-legal-system", "gkv-is-social-law-not-vvg", "pkv-is-private-contract", "other-private-is-vvg", "unclear-legal-system-fail-closed", "route-gkv-to-health-pack", "krankenkasse-not-automatically-private", "pkv-not-gesetzliche-kasse"] },
  { processKey: "versicherungsart-bestimmen", role: "identification", sequenceContext: "product-class", claimKeys: ["classify-insurance-type-not-merits", "kfz-haftpflicht-not-kasko", "rechtsschutz-not-every-dispute"] },
  { processKey: "beteiligtenrolle-bestimmen", role: "identification", sequenceContext: "roles", claimKeys: ["versicherungsnehmer-role", "versicherte-person-role", "vn-not-always-insured", "broker-not-insurer", "third-party-not-vn"] },
  { processKey: "vertrag-schein-einordnen", role: "orientation_basis", sequenceContext: "contract-docs", claimKeys: ["schein-is-policy", "avb-not-statute", "pib-not-entire-contract", "marketing-not-contract", "three-layers-separate"] },
  { processKey: "abweichenden-schein-pruefen", role: "deadline_gate", sequenceContext: "section-5", claimKeys: ["abweichung-one-month-if-notice", "abweichung-not-automatic-acceptance", "abweichung-needs-conspicuous-notice", "abweichung-needs-facts"] },
  { processKey: "widerruf-einordnen", role: "deadline_gate", sequenceContext: "widerruf", claimKeys: ["general-14-day-widerruf", "life-30-day-widerruf", "life-not-14-default", "individual-widerruf-fail-closed"] },
  { processKey: "anzeigepflicht-einordnen", role: "negative_control", sequenceContext: "section-19", claimKeys: ["section-19-text-question", "forgotten-not-automatic-rescission", "unasked-not-automatically-breach", "do-not-decide-intent-19"] },
  { processKey: "gefahrenerhoehung-einordnen", role: "negative_control", sequenceContext: "risk-increase", claimKeys: ["any-life-change-not-gefahr", "gefahr-not-automatic-loss", "gefahr-premium-not-automatically-40"] },
  { processKey: "praemie-faelligkeit-einordnen", role: "identification", sequenceContext: "premium-class", claimKeys: ["first-not-follow-up-premium", "unpaid-not-same-result", "ordinary-mahnung-not-38"] },
  { processKey: "erstpraemienverzug-behandeln", role: "decision", sequenceContext: "section-37", claimKeys: ["section-37-warning-required", "section-37-fault-boundary", "first-not-follow-up-premium"] },
  { processKey: "folgepraemien-mahnung-behandeln", role: "deadline_gate", sequenceContext: "section-38", claimKeys: ["section-38-two-weeks", "ordinary-mahnung-not-38", "later-payment-not-retro-cover", "fourteen-days-not-from-document-date"] },
  { processKey: "beitrags-leistungs-aenderung", role: "deadline_gate", sequenceContext: "section-40", claimKeys: ["section-40-one-month-receipt", "section-40-not-universal-pkv", "increase-not-automatically-invalid"] },
  { processKey: "kuendigung-einordnen", role: "deadline_gate", sequenceContext: "termination", claimKeys: ["ordinary-section-11", "no-universal-post-claim", "section-92-is-sach", "individual-cancel-fail-closed"] },
  { processKey: "schaden-melden", role: "next_state", sequenceContext: "claim-notice", claimKeys: ["notify-without-undue-delay", "late-claim-not-automatic-zero", "insurer-already-knew-matters"] },
  { processKey: "unterlagen-nachreichen", role: "evidence_requirement", sequenceContext: "section-31", claimKeys: ["section-31-necessary-info", "not-every-personal-document", "missing-one-not-automatic-denial", "request-not-fraud-accusation"] },
  { processKey: "deckung-pruefen", role: "context_gate", sequenceContext: "coverage", claimKeys: ["requires-policy-avb-facts", "product-name-not-coverage", "premium-paid-not-every-event", "individual-coverage-fail-closed", "exclusion-exists-not-automatically-applies", "insurer-cites-not-automatically-correct"] },
  { processKey: "obliegenheitsvorwurf-einordnen", role: "negative_control", sequenceContext: "section-28", claimKeys: ["obliegenheit-not-automatic-denial", "gross-neg-not-automatic-zero", "causality-can-preserve-cover", "do-not-decide-intent-28"] },
  { processKey: "leistungspruefung-abschlag", role: "decision", sequenceContext: "section-14", claimKeys: ["section-14-due-when-complete", "one-month-not-full-payout", "advance-probable-minimum", "advance-not-final"] },
  { processKey: "leistungsabrechnung-verstehen", role: "decision", sequenceContext: "settlement", claimKeys: ["payment-not-automatically-final", "partial-not-final-closure", "vergleich-not-admission"] },
  { processKey: "leistungskuerzung-verstehen", role: "required_information", sequenceContext: "reduction", claimKeys: ["reduction-needs-reason", "insurer-cites-not-automatically-correct", "deductible-is-contract-fact"] },
  { processKey: "leistungsablehnung-behandeln", role: "legal_remedy_gate", sequenceContext: "denial", claimKeys: ["private-denial-not-widerspruch", "ablehnung-not-bescheid", "denial-not-automatically-correct", "denial-not-automatically-wrong"] },
  { processKey: "rueckforderung-regress", role: "context_gate", sequenceContext: "recovery", claimKeys: ["do-not-predict-must-pay", "three-layers-separate", "civil-law-boundary"] },
  { processKey: "interne-beschwerde", role: "application_route", sequenceContext: "internal-complaint", claimKeys: ["internal-written-complaint", "internal-not-lawsuit", "complaint-not-every-deadline-stopped"] },
  { processKey: "versicherungsombudsmann-route", role: "legal_remedy_gate", sequenceContext: "vom", claimKeys: ["vom-members-only", "any-insurer-not-member", "vom-value-limits", "ombudsmann-not-court", "pkv-excluded-from-general"] },
  { processKey: "pkv-ombudsmann-route", role: "legal_remedy_gate", sequenceContext: "pkv-ombud", claimKeys: ["pkv-ombudsmann-route", "gkv-not-pkv-ombudsmann", "pkv-ombudsmann-not-widerspruch", "pkv-excluded-from-general"] },
  { processKey: "bafin-beschwerde-boundary", role: "legal_remedy_gate", sequenceContext: "bafin", claimKeys: ["bafin-collective", "bafin-not-individual-judgment", "bafin-not-gkv-supervisor", "bafin-deadlines-continue", "no-litigation-strategy", "civil-law-boundary"] },
  { processKey: "vermittler-beratung-einordnen", role: "negative_control", sequenceContext: "intermediary", claimKeys: ["broker-not-insurer", "bad-outcome-not-bad-advice", "denial-not-automatically-intermediary", "complex-advisor-oos"] },
  { processKey: "verjaehrung-fristen-einordnen", role: "deadline_gate", sequenceContext: "limitation", claimKeys: ["section-15-suspension", "document-date-not-deadline-start", "document-date-not-receipt", "individual-limitation-fail-closed"] },
  { processKey: "authentizitaet-phishing-pruefen", role: "negative_control", sequenceContext: "phishing", claimKeys: ["logo-not-authenticity", "sender-name-not-verified", "link-not-safe", "payment-change-independent-contact"] },
]);

export const VVG_PROCESS_SCENARIOS: readonly VvgProcessScenario[] = Object.freeze([
  { id: "unclear-insurance-letter", label: "Unklares Versicherungsschreiben", coverage: "COVERED", requiredClaimKeys: ["versicherung-not-one-legal-system", "unclear-legal-system-fail-closed"], requiredProcessKeys: ["rechtsrahmen-bestimmen"] },
  { id: "statutory-kasse-letter", label: "Gesetzliches Krankenkassenschreiben", coverage: "COVERED", requiredClaimKeys: ["gkv-is-social-law-not-vvg", "route-gkv-to-health-pack"], requiredProcessKeys: ["rechtsrahmen-bestimmen"] },
  { id: "pkv-letter", label: "PKV-Schreiben", coverage: "COVERED", requiredClaimKeys: ["pkv-is-private-contract", "pkv-ombudsmann-route"], requiredProcessKeys: ["pkv-ombudsmann-route"] },
  { id: "haftpflicht-letter", label: "Haftpflichtschreiben", coverage: "COVERED", requiredClaimKeys: ["haftpflicht-not-all-liability", "classify-insurance-type-not-merits"], requiredProcessKeys: ["versicherungsart-bestimmen"] },
  { id: "kfz-letter", label: "Kfz-Versicherungsschreiben", coverage: "COVERED", requiredClaimKeys: ["kfz-haftpflicht-not-kasko", "own-vehicle-not-haftpflicht"], requiredProcessKeys: ["versicherungsart-bestimmen"] },
  { id: "hausrat-letter", label: "Hausratschreiben", coverage: "COVERED", requiredClaimKeys: ["classify-insurance-type-not-merits", "requires-policy-avb-facts"], requiredProcessKeys: ["versicherungsart-bestimmen"] },
  { id: "rechtsschutz-letter", label: "Rechtsschutzschreiben", coverage: "COVERED", requiredClaimKeys: ["rechtsschutz-not-every-dispute", "classify-insurance-type-not-merits"], requiredProcessKeys: ["versicherungsart-bestimmen"] },
  { id: "life-letter", label: "Lebensversicherungsschreiben", coverage: "COVERED", requiredClaimKeys: ["life-30-day-widerruf", "life-not-14-default"], requiredProcessKeys: ["widerruf-einordnen"] },
  { id: "bu-letter", label: "BU-Schreiben", coverage: "COVERED", requiredClaimKeys: ["classify-insurance-type-not-merits", "individual-coverage-fail-closed"], requiredProcessKeys: ["versicherungsart-bestimmen"] },
  { id: "policy-just-received", label: "Versicherungsschein gerade erhalten", coverage: "COVERED", requiredClaimKeys: ["schein-is-policy", "schein-not-always-complete"], requiredProcessKeys: ["vertrag-schein-einordnen"], requiredFormIdentifiers: ["VVG-Versicherungsschein-Anforderung"] },
  { id: "policy-differs", label: "Schein weicht vom Antrag ab", coverage: "COVERED", requiredClaimKeys: ["abweichung-not-automatic-acceptance", "abweichung-needs-facts"], requiredProcessKeys: ["abweichenden-schein-pruefen"] },
  { id: "user-wants-withdraw", label: "Nutzer will widerrufen", coverage: "COVERED", requiredClaimKeys: ["general-14-day-widerruf", "individual-widerruf-fail-closed"], requiredProcessKeys: ["widerruf-einordnen"] },
  { id: "life-withdraw", label: "Widerruf Lebensversicherung", coverage: "COVERED", requiredClaimKeys: ["life-30-day-widerruf", "life-not-14-default"], requiredProcessKeys: ["widerruf-einordnen"] },
  { id: "missing-disclosure", label: "Versicherer rügt Anzeigepflicht", coverage: "COVERED", requiredClaimKeys: ["section-19-text-question", "forgotten-not-automatic-rescission"], requiredProcessKeys: ["anzeigepflicht-einordnen"] },
  { id: "risk-increase-alleged", label: "Versicherer rügt Gefahrerhöhung", coverage: "COVERED", requiredClaimKeys: ["any-life-change-not-gefahr", "gefahr-not-automatic-loss"], requiredProcessKeys: ["gefahrenerhoehung-einordnen"] },
  { id: "first-premium-unpaid", label: "Erstprämie unbezahlt", coverage: "COVERED", requiredClaimKeys: ["first-not-follow-up-premium", "section-37-fault-boundary"], requiredProcessKeys: ["erstpraemienverzug-behandeln"] },
  { id: "follow-up-unpaid", label: "Folgeprämie unbezahlt", coverage: "COVERED", requiredClaimKeys: ["section-38-two-weeks", "ordinary-mahnung-not-38"], requiredProcessKeys: ["folgepraemien-mahnung-behandeln"] },
  { id: "ordinary-reminder", label: "Gewöhnliche Zahlungserinnerung", coverage: "COVERED", requiredClaimKeys: ["ordinary-mahnung-not-38", "mahnung-not-automatically-termination"], requiredProcessKeys: ["praemie-faelligkeit-einordnen"] },
  { id: "qualified-38", label: "Qualifizierte §-38-Mahnung", coverage: "COVERED", requiredClaimKeys: ["section-38-two-weeks", "later-payment-not-retro-cover"], requiredProcessKeys: ["folgepraemien-mahnung-behandeln"] },
  { id: "premium-increased", label: "Prämie erhöht", coverage: "COVERED", requiredClaimKeys: ["section-40-one-month-receipt", "increase-not-automatically-invalid"], requiredProcessKeys: ["beitrags-leistungs-aenderung"] },
  { id: "benefits-reduced", label: "Versicherungsschutz gekürzt", coverage: "COVERED", requiredClaimKeys: ["section-40-one-month-receipt", "section-40-not-universal-pkv"], requiredProcessKeys: ["beitrags-leistungs-aenderung"] },
  { id: "ordinary-cancel", label: "Ordentliche Kündigung", coverage: "COVERED", requiredClaimKeys: ["ordinary-section-11", "individual-cancel-fail-closed"], requiredProcessKeys: ["kuendigung-einordnen"] },
  { id: "insurer-cancels", label: "Versicherer kündigt", coverage: "COVERED", requiredClaimKeys: ["ordinary-section-11", "sent-not-necessarily-received"], requiredProcessKeys: ["kuendigung-einordnen"] },
  { id: "claim-occurred", label: "Versicherungsfall eingetreten", coverage: "COVERED", requiredClaimKeys: ["notify-without-undue-delay", "requires-policy-avb-facts"], requiredProcessKeys: ["schaden-melden"], requiredFormIdentifiers: ["VVG-Schadenanzeige"] },
  { id: "claim-late", label: "Schaden verspätet gemeldet", coverage: "COVERED", requiredClaimKeys: ["late-claim-not-automatic-zero", "insurer-already-knew-matters"], requiredProcessKeys: ["schaden-melden"] },
  { id: "insurer-asks-docs", label: "Versicherer verlangt Unterlagen", coverage: "COVERED", requiredClaimKeys: ["section-31-necessary-info", "request-not-fraud-accusation"], requiredProcessKeys: ["unterlagen-nachreichen"] },
  { id: "user-lacks-document", label: "Verlangtes Dokument fehlt", coverage: "COVERED", requiredClaimKeys: ["missing-one-not-automatic-denial", "not-every-personal-document"], requiredProcessKeys: ["unterlagen-nachreichen"] },
  { id: "investigation-over-month", label: "Prüfung länger als ein Monat", coverage: "COVERED", requiredClaimKeys: ["one-month-not-full-payout", "advance-probable-minimum"], requiredProcessKeys: ["leistungspruefung-abschlag"] },
  { id: "user-wants-advance", label: "Nutzer will Abschlagszahlung", coverage: "COVERED", requiredClaimKeys: ["advance-probable-minimum", "advance-not-final"], requiredProcessKeys: ["leistungspruefung-abschlag"] },
  { id: "partial-payment", label: "Teilzahlung", coverage: "COVERED", requiredClaimKeys: ["partial-not-final-closure", "payment-not-automatically-final"], requiredProcessKeys: ["leistungsabrechnung-verstehen"] },
  { id: "claim-accepted", label: "Anspruch vollständig anerkannt", coverage: "COVERED", requiredClaimKeys: ["letter-not-automatically-decision", "payment-not-automatically-final"], requiredProcessKeys: ["leistungsabrechnung-verstehen"] },
  { id: "claim-reduced", label: "Anspruch gekürzt", coverage: "COVERED", requiredClaimKeys: ["reduction-needs-reason", "insurer-cites-not-automatically-correct"], requiredProcessKeys: ["leistungskuerzung-verstehen"] },
  { id: "claim-rejected", label: "Anspruch abgelehnt", coverage: "COVERED", requiredClaimKeys: ["private-denial-not-widerspruch", "denial-not-automatically-correct"], requiredProcessKeys: ["leistungsablehnung-behandeln"] },
  { id: "exclusion-cited", label: "Versicherer zitiert Ausschluss", coverage: "COVERED", requiredClaimKeys: ["exclusion-exists-not-automatically-applies", "insurer-cites-not-automatically-correct"], requiredProcessKeys: ["deckung-pruefen"] },
  { id: "obliegenheit-cited", label: "Obliegenheitsverletzung behauptet", coverage: "COVERED", requiredClaimKeys: ["obliegenheit-not-automatic-denial", "insurer-says-obliegenheit-not-established"], requiredProcessKeys: ["obliegenheitsvorwurf-einordnen"] },
  { id: "gross-neg-alleged", label: "Grobe Fahrlässigkeit behauptet", coverage: "COVERED", requiredClaimKeys: ["gross-neg-not-automatic-zero", "do-not-decide-intent-28"], requiredProcessKeys: ["obliegenheitsvorwurf-einordnen"] },
  { id: "amount-disputed", label: "Nutzer bestreitet Betrag", coverage: "COVERED", requiredClaimKeys: ["do-not-predict-must-pay", "deductible-is-contract-fact"], requiredProcessKeys: ["leistungskuerzung-verstehen"] },
  { id: "repayment-requested", label: "Versicherer fordert Rückzahlung", coverage: "COVERED", requiredClaimKeys: ["do-not-predict-must-pay", "civil-law-boundary"], requiredProcessKeys: ["rueckforderung-regress"] },
  { id: "regress-announced", label: "Regress angekündigt", coverage: "COVERED", requiredClaimKeys: ["three-layers-separate", "civil-law-boundary"], requiredProcessKeys: ["rueckforderung-regress"] },
  { id: "user-wants-complaint", label: "Nutzer will sich beschweren", coverage: "COVERED", requiredClaimKeys: ["internal-written-complaint", "internal-not-lawsuit"], requiredProcessKeys: ["interne-beschwerde"], requiredFormIdentifiers: ["VVG-Interne-Beschwerde"] },
  { id: "general-ombudsman", label: "Allgemeiner Versicherungsombudsmann", coverage: "COVERED", requiredClaimKeys: ["vom-members-only", "vom-court-access"], requiredProcessKeys: ["versicherungsombudsmann-route"], requiredFormIdentifiers: ["VOM-Schlichtungsantrag"] },
  { id: "insurer-not-member", label: "Versicherer nicht Ombudsmitglied", coverage: "COVERED", requiredClaimKeys: ["any-insurer-not-member", "civil-law-boundary"], requiredProcessKeys: ["versicherungsombudsmann-route"] },
  { id: "pkv-ombudsman", label: "PKV-Ombudsmann", coverage: "COVERED", requiredClaimKeys: ["pkv-ombudsmann-route", "pkv-excluded-from-general"], requiredProcessKeys: ["pkv-ombudsmann-route"], requiredFormIdentifiers: ["PKV-Ombudsmann-Antrag"] },
  { id: "wrong-widerspruch", label: "Nutzer will Widerspruch gegen privaten Versicherer", coverage: "COVERED", requiredClaimKeys: ["private-denial-not-widerspruch", "civil-law-boundary"], requiredProcessKeys: ["leistungsablehnung-behandeln"] },
  { id: "bafin-complaint", label: "BaFin-Beschwerde", coverage: "COVERED", requiredClaimKeys: ["bafin-not-individual-judgment", "bafin-deadlines-continue"], requiredProcessKeys: ["bafin-beschwerde-boundary"], requiredFormIdentifiers: ["BAFIN-Verbraucherbeschwerde"] },
  { id: "approaching-limitation", label: "Verjährung naht", coverage: "COVERED", requiredClaimKeys: ["section-15-suspension", "individual-limitation-fail-closed"], requiredProcessKeys: ["verjaehrung-fristen-einordnen"] },
  { id: "broker-bad-advice", label: "Makler soll schlecht beraten haben", coverage: "COVERED", requiredClaimKeys: ["broker-not-insurer", "complex-advisor-oos"], requiredProcessKeys: ["vermittler-beratung-einordnen"] },
  { id: "suspicious-email", label: "Verdächtige Versicherer-E-Mail", coverage: "COVERED", requiredClaimKeys: ["logo-not-authenticity", "sender-name-not-verified"], requiredProcessKeys: ["authentizitaet-phishing-pruefen"] },
  { id: "changed-payment-account", label: "Geändertes Zahlungskonto in E-Mail", coverage: "COVERED", requiredClaimKeys: ["payment-change-independent-contact", "link-not-safe"], requiredProcessKeys: ["authentizitaet-phishing-pruefen"] },
  { id: "exact-deadline-unclear", label: "Genaue Frist unklar", coverage: "COVERED", requiredClaimKeys: ["document-date-not-deadline-start", "individual-limitation-fail-closed"], requiredProcessKeys: ["verjaehrung-fristen-einordnen"] },
  { id: "avb-missing", label: "AVB fehlen", coverage: "COVERED", requiredClaimKeys: ["avb-not-statute", "individual-coverage-fail-closed"], requiredProcessKeys: ["deckung-pruefen"] },
  { id: "covered-without-policy", label: "Nutzer fragt Deckung ohne Police", coverage: "COVERED", requiredClaimKeys: ["requires-policy-avb-facts", "individual-coverage-fail-closed"], requiredProcessKeys: ["deckung-pruefen"] },
  { id: "must-insurer-pay", label: "Nutzer fragt, ob Versicherer bestimmt zahlen muss", coverage: "COVERED", requiredClaimKeys: ["do-not-predict-must-pay", "denial-not-automatically-wrong"], requiredProcessKeys: ["leistungsablehnung-behandeln"] },
  { id: "exact-litigation-outcome", label: "Nutzer fragt genaues Prozessende", coverage: "COVERED", requiredClaimKeys: ["no-litigation-strategy", "civil-law-boundary"], requiredProcessKeys: ["bafin-beschwerde-boundary"] },
  { id: "gkv-vs-pkv-gate", label: "GKV gegen PKV", coverage: "COVERED", requiredClaimKeys: ["krankenkasse-not-automatically-private", "pkv-not-gesetzliche-kasse"], requiredProcessKeys: ["rechtsrahmen-bestimmen"] },
  { id: "roles-policyholder-insured", label: "Versicherungsnehmer nicht versicherte Person", coverage: "COVERED", requiredClaimKeys: ["vn-not-always-insured", "insured-not-always-vn"], requiredProcessKeys: ["beteiligtenrolle-bestimmen"] },
  { id: "complete-kfz-engine", label: "Vollständiges Kfz-Versicherungsengine", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Abgrenzung Haftpflicht und Kasko." },
  { id: "complete-hausrat-engine", label: "Vollständiges Hausrat-Deckungsengine", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Klassifikation und Routing." },
  { id: "complete-building-engine", label: "Vollständiges Wohngebäudeengine", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Klassifikation." },
  { id: "complete-liability-damages", label: "Vollständiges Haftpflichtersatzengine", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Keine Schadenshöhenberechnung." },
  { id: "complete-rechtsschutz-arb", label: "Vollständiges Rechtsschutz-ARB-Engine", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Deckung ist vertragsspezifisch." },
  { id: "complete-pkv-tariff", label: "Vollständiges PKV-Tarif- und Medizinengine", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Orientierung und Ombudsroute." },
  { id: "complete-life-surrender", label: "Vollständiges Lebensversicherungs-Rückkaufengine", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur 30-Tage-Widerruf und Routing." },
  { id: "complete-bu-merits", label: "Vollständiges BU-Leistungsengine", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Klassifikation." },
  { id: "complete-accident-disability", label: "Vollständige Unfallinvaliditätsberechnung", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Klassifikation." },
  { id: "actuarial-premium", label: "Aktuarielle Prämienberechnung", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Keine Prämienkalkulation." },
  { id: "investment-suitability", label: "Anlageprodukt-Eignungsengine", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Keine Geeignetheitsprüfung." },
  { id: "insurance-tax", label: "Versicherungsteuerliche Behandlung", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Keine Steuerwürdigung." },
  { id: "business-grossrisiko", label: "Industrieversicherung oder Großrisiko", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Verbraucherkern." },
  { id: "professional-litigation", label: "Professionelle Prozessführung", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Keine Klage- oder Verteidigungsstrategie." },
  { id: "fraud-criminal-defense", label: "Betrugs- oder Strafverteidigungsstrategie", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Authentizitätsorientierung." },
]);

const CONTEXT_GATE_POLICIES = Object.freeze([
  { sourceKey: "vvg-8", informationClass: "DEADLINE" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "vvg-5", informationClass: "DEADLINE" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "vvg-11", informationClass: "DEADLINE" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "vvg-15", informationClass: "DEADLINE" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "vvg-192", informationClass: "ELIGIBILITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "vom-members", informationClass: "AUTHORITY_COMPETENCE" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "bafin-complaint", informationClass: "SANCTION" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["PROCESS_VARIANT"] as const, riskClass: "HIGH" },
]);

export function evaluateVvgProcessCompleteness(
  pack: CuratedDomainPack,
  units: readonly UnitSpec[] = VVG_UNITS,
) {
  const claimByKey = new Map(pack.claims.map((claim) => [String(claim.key), claim]));
  const processByKey = new Map(pack.processes.map((process) => [String(process.key), process]));
  const formIds = new Set(pack.forms.map((form) => String(form.identifier)));
  const rows = VVG_PROCESS_SCENARIOS.map((scenario) => {
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

export function buildVvgFederalCorePack(): CuratedDomainPack {
  const item = factory(VVG_PACK_ID);
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
    bafin: item("publishers", "bafin", {
      name: "Bundesanstalt für Finanzdienstleistungsaufsicht",
      type: "federal_supervisor",
      territorialScopeId: scope.id,
      trustDomainId: trustDomain.id,
    }),
    vom: item("publishers", "versicherungsombudsmann", {
      name: "Versicherungsombudsmann e. V.",
      type: "recognized_adr_body",
      territorialScopeId: scope.id,
      trustDomainId: trustDomain.id,
    }),
    pkvomb: item("publishers", "pkv-ombudsmann", {
      name: "Ombudsmann Private Kranken- und Pflegeversicherung",
      type: "recognized_adr_body",
      territorialScopeId: scope.id,
      trustDomainId: trustDomain.id,
    }),
  };
  const authorities = {
    bmj: item("authorities", "bundesministerium-justiz", {
      publisherId: publishers.bmj.id,
      name: "Bundesministerium der Justiz / Bundesamt für Justiz",
      type: "federal_publication",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://www.gesetze-im-internet.de/vvg_2008/",
    }),
    bafin: item("authorities", "bundesanstalt-finanzdienstleistungsaufsicht", {
      publisherId: publishers.bafin.id,
      name: "Bundesanstalt für Finanzdienstleistungsaufsicht",
      type: "federal_supervisor",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://www.bafin.de/DE/verbraucherinnen-verbraucher/hilfe-kontakt/beschwerden-streitschlichtung/bei-bafin-beschweren/bei-bafin-beschweren_node.html",
    }),
    vom: item("authorities", "versicherungsombudsmann-ev", {
      publisherId: publishers.vom.id,
      name: "Versicherungsombudsmann e. V.",
      type: "recognized_adr_body",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://www.versicherungsombudsmann.de/das-schlichtungsverfahren/",
    }),
    pkvomb: item("authorities", "pkv-ombudsmann-stelle", {
      publisherId: publishers.pkvomb.id,
      name: "Ombudsmann Private Kranken- und Pflegeversicherung",
      type: "recognized_adr_body",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://www.pkv-ombudsmann.de/schlichtungsverfahren/statut/",
    }),
  };

  const sources = VVG_OFFICIAL_SOURCES.map((spec) => {
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

  const claims = VVG_UNITS.map((unit) => {
    const source = sourceByKey.get(unit.sourceKey);
    const passage = passageByKey.get(unit.passageKey);
    if (!source || !passage) throw new Error(`VVG_UNIT_SOURCE_MISSING:${unit.key}`);
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
    if (!source) throw new Error(`VVG_CONTEXT_POLICY_SOURCE_MISSING:${spec.sourceKey}`);
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

  const processes = VVG_PROCESSES.map((spec) => item("processes", spec.key, {
    processGroupId: VVG_DOMAIN,
    title: spec.title,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
    riskLevel: spec.riskLevel,
    trigger: spec.trigger,
    safeFirstStep: spec.safeFirstStep,
    regionalVariationExpected:
      spec.key === "bafin-beschwerde-boundary"
      || spec.key === "rechtsrahmen-bestimmen",
  }));
  const processByKey = new Map(processes.map((process) => [String(process.key), process]));
  const claimByKey = new Map(claims.map(({ claim }) => [String(claim.key), claim]));
  const processClaimLinks = VVG_PROCESS_BINDINGS.flatMap((binding) => {
    const process = processByKey.get(binding.processKey);
    if (!process) throw new Error(`VVG_PROCESS_MISSING:${binding.processKey}`);
    return binding.claimKeys.map((claimKey) => {
      const claim = claimByKey.get(claimKey);
      if (!claim) throw new Error(`VVG_PROCESS_CLAIM_MISSING:${binding.processKey}:${claimKey}`);
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

  const inspectLetterRule = item("actorRules", "inspect-letter-before-route", {
    actorState: "inspect_insurance_letter_before_route",
    userMustAct: true,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const legalSystemRule = item("actorRules", "legal-system-undetermined", {
    actorState: "insurance_legal_system_undetermined",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const coverageRule = item("actorRules", "individual-coverage-undetermined", {
    actorState: "individual_insurance_coverage_undetermined",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const deadlineRule = item("actorRules", "individual-deadline-undetermined", {
    actorState: "individual_insurance_deadline_undetermined",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const authenticityRule = item("actorRules", "authenticity-unverified", {
    actorState: "insurer_sender_authenticity_unverified",
    userMustAct: true,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const membershipRule = item("actorRules", "ombudsmann-membership-undetermined", {
    actorState: "ombudsmann_membership_undetermined",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });

  const forms = VVG_FORMS.map((spec) => {
    const source = sourceByKey.get(spec.sourceKey);
    const passage = passageByKey.get(spec.passageKey);
    if (!source || !passage) throw new Error(`VVG_FORM_SOURCE_MISSING:${spec.key}`);
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
    packId: VVG_PACK_ID,
    domain: VVG_DOMAIN,
    canonicalLanguage: VVG_CANONICAL_LANGUAGE,
    trustDomain,
    jurisdictions: [jurisdiction],
    territorialScopes: [scope],
    publishers: [publishers.bmj, publishers.bafin, publishers.vom, publishers.pkvomb],
    authorities: [authorities.bmj, authorities.bafin, authorities.vom, authorities.pkvomb],
    sources: sources.map(({ source }) => source),
    sourceVersions: sources.map(({ version }) => version),
    passages: sources.flatMap(({ passages }) => passages),
    claims: claims.map(({ claim }) => claim),
    evidenceLinks: claims.map(({ evidence }) => evidence),
    citations: claims.map(({ citation }) => citation),
    actorRules: [
      inspectLetterRule, legalSystemRule, coverageRule, deadlineRule, authenticityRule, membershipRule,
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

export function vvgPackSummary(pack: CuratedDomainPack = buildVvgFederalCorePack()) {
  const categories = Object.fromEntries(
    VVG_UNITS.reduce((counts, unit) => {
      counts.set(unit.category, (counts.get(unit.category) ?? 0) + 1);
      return counts;
    }, new Map<VvgUnitCategory, number>()),
  );
  const completeness = evaluateVvgProcessCompleteness(pack);
  return Object.freeze({
    domain: pack.domain,
    packId: pack.packId,
    canonicalLanguage: pack.canonicalLanguage,
    claimCount: pack.claims.length,
    sourceCount: pack.sources.length,
    processCount: pack.processes.length,
    processClaimLinkCount: pack.processClaimLinks.length,
    formCount: pack.forms.length,
    current2026Count: VVG_UNITS.length,
    futureWatchCount: VVG_FUTURE_CHANGE_WATCH_ITEMS.length,
    g3ProcessStepLimitation: VVG_G3_PROCESS_STEP_LIMITATION,
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
