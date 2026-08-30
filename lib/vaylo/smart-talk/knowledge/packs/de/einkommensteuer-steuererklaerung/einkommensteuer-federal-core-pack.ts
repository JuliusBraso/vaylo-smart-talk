/**
 * KNOWLEDGE-EXPANSION — German federal Einkommensteuer / Steuererklärung
 * process-complete basic lifecycle core.
 * Official-source G3 CuratedDomainPack for domain
 * einkommensteuer_steuererklaerung (new taxonomy identifier).
 * Canonical language is German only. Not a runtime route.
 *
 * This pack is the annual income-tax return lifecycle. It does not replace
 * steuer_id_and_basic_finanzamt_letters (IdNr, Steuernummer, Bescheid basics).
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

export const EST_DOMAIN = "einkommensteuer_steuererklaerung" as const;
export const EST_PACK_ID = EST_DOMAIN;
export const EST_CANONICAL_LANGUAGE = "de" as const;

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

export type EstUnitCategory =
  | "orientation"
  | "tax_liability"
  | "filing_obligation"
  | "progression"
  | "income_category"
  | "deadline"
  | "late_filing"
  | "preparation"
  | "deduction"
  | "elster"
  | "evidence"
  | "spouse"
  | "bescheid"
  | "refund_payment"
  | "advance"
  | "einspruch"
  | "competence"
  | "cross_border"
  | "boundary";

export type EstContextKey =
  | "EVENT_DATE"
  | "PROCESS_VARIANT"
  | "BUNDESLAND"
  | "RESIDENCE_STATE"
  | "WORK_STATE"
  | "COUNTRY";
export type EstHandlingMode =
  | "STORE_CANONICALLY"
  | "CACHE_AND_REVALIDATE"
  | "FETCH_LIVE"
  | "DO_NOT_ANSWER_WITHOUT_CONTEXT";
export type EstFreshnessClass = "LEGAL_CHANGE_MONITORED" | "MONTHLY" | "EVENT_DRIVEN";
export type EstStaleBehavior = "DO_NOT_USE_STALE" | "REVALIDATE_BEFORE_USE";
export type EstInformationClass =
  | "LEGAL_BASELINE"
  | "PROCESS_IDENTITY"
  | "AUTHORITY_COMPETENCE"
  | "ELIGIBILITY"
  | "DEADLINE"
  | "REQUIRED_EVIDENCE"
  | "FORM_URL"
  | "ONLINE_SERVICE_URL";
export type EstProcessRole =
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
export type EstScenarioCoverage =
  | "COVERED"
  | "EXPLICITLY_OUT_OF_SCOPE"
  | "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE";

export const EST_G3_PROCESS_STEP_LIMITATION =
  "G3 CuratedDomainPack and knowledge_ingest_curated_domain_pack persist processes and process_claim_links with process_step_id null; knowledge_process_steps are not ingestible without a later factory extension.";

export type EstTemporalClass = "current_2026";

export type EstFutureChangeWatchItem = Readonly<{
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
  publisherKey: "bmj" | "elster" | "lfst_by" | "bzst";
  authorityKey: "bmf" | "elster" | "lfst_by" | "bzst";
  url: string;
  officialDomain: string;
  title: string;
  sourceClass: "FEDERAL_LAW" | "FEDERAL_ADMINISTRATIVE_GUIDANCE" | "FEDERAL_SERVICE_PORTAL" | "LAND_SERVICE_PORTAL";
  sourceType: "federal_statute" | "federal_guidance" | "authority_portal";
  retrievalMethod: "HTML_DOCUMENT";
  informationClass: EstInformationClass;
  handlingMode: EstHandlingMode;
  freshnessClass: EstFreshnessClass;
  staleBehavior: EstStaleBehavior;
  requiredContextKeys: readonly EstContextKey[];
  passages: readonly Readonly<{ key: string; locator: string; text: string }>[];
}>;

type UnitSpec = Readonly<{
  key: string;
  category: EstUnitCategory;
  temporal: EstTemporalClass;
  type: "duty" | "deadline" | "definition" | "procedure" | "exception";
  text: string;
  sourceKey: string;
  passageKey: string;
  riskLevel: "low" | "medium" | "high";
  requiresEffectiveDate?: true;
  requiresAuthorityResolution?: true;
  requiredContextKeys?: readonly EstContextKey[];
}>;

type EstProcessSpec = Readonly<{
  key: string;
  title: string;
  trigger: string;
  safeFirstStep: string;
  riskLevel: "low" | "medium" | "high";
}>;

type EstFormSpec = Readonly<{
  key: string;
  name: string;
  identifier: string;
  purpose: string;
  submissionChannels: readonly string[];
  sourceKey: string;
  passageKey: string;
}>;

type EstBindingSpec = Readonly<{
  processKey: string;
  role: EstProcessRole;
  sequenceContext: string;
  claimKeys: readonly string[];
  required?: boolean;
  qualificationRequired?: boolean;
}>;

type EstProcessScenario = Readonly<{
  id: string;
  label: string;
  coverage: EstScenarioCoverage;
  requiredClaimKeys: readonly string[];
  requiredProcessKeys: readonly string[];
  requiredFormIdentifiers?: readonly string[];
  note?: string;
}>;

export const EST_FUTURE_WATCH_SOURCE = Object.freeze({
  url: "https://www.gesetze-im-internet.de/estg/__32a.html",
  officialDomain: "www.gesetze-im-internet.de",
  title: "EStG § 32a Einkommensteuertarif",
});

export const EST_FUTURE_CHANGE_WATCH_ITEMS: readonly EstFutureChangeWatchItem[] = Object.freeze([
  {
    id: "est-future-watch-grundfreibetrag-2027",
    key: "grundfreibetrag-2027-amount",
    officialSourceUrl: EST_FUTURE_WATCH_SOURCE.url,
    officialDomain: EST_FUTURE_WATCH_SOURCE.officialDomain,
    officialSourceTitle: EST_FUTURE_WATCH_SOURCE.title,
    targetYear: 2027,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "Ein künftiger Grundfreibetrag nach § 32a EStG für 2027 ist keine aktuelle kanonische Wahrheit und darf nicht als zeitloser Eurobetrag ingestiert werden.",
  },
  {
    id: "est-future-watch-arbeitnehmer-pauschbetrag",
    key: "arbeitnehmer-pauschbetrag-future",
    officialSourceUrl: "https://www.gesetze-im-internet.de/estg/__9a.html",
    officialDomain: "www.gesetze-im-internet.de",
    officialSourceTitle: "EStG § 9a Pauschbeträge für Werbungskosten",
    targetYear: 2027,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "Ein künftiger anderer Arbeitnehmer-Pauschbetrag nach § 9a EStG ist keine aktuelle kanonische Wahrheit und darf nicht als zeitloser Eurobetrag ingestiert werden.",
  },
  {
    id: "est-future-watch-entfernungspauschale",
    key: "entfernungspauschale-future",
    officialSourceUrl: "https://www.gesetze-im-internet.de/estg/__9.html",
    officialDomain: "www.gesetze-im-internet.de",
    officialSourceTitle: "EStG § 9 Werbungskosten",
    targetYear: 2027,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "Künftige Kilometer- oder Homeoffice-Tagespauschalen nach § 9 EStG sind keine aktuelle kanonische Wahrheit und dürfen nicht als zeitlose Beträge ingestiert werden.",
  },
  {
    id: "est-future-watch-vz-2026-deadline",
    key: "vz-2026-filing-deadline-future",
    officialSourceUrl: "https://www.gesetze-im-internet.de/ao_1977/__149.html",
    officialDomain: "www.gesetze-im-internet.de",
    officialSourceTitle: "AO § 149 Abgabe der Steuererklärungen",
    targetYear: 2027,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "Die konkrete Pflichtabgabefrist für den Veranlagungszeitraum 2026 ist eine künftige jahresbezogene Tatsache und darf nicht als zeitloses Datum ingestiert werden.",
  },
]);

export const EST_OFFICIAL_SOURCES: readonly OfficialSourceSpec[] = Object.freeze([
  {
    key: "estg-1",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/estg/__1.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "EStG § 1 Steuerpflicht",
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
        key: "estg-1-1-4",
        locator: "EStG § 1 Abs. 1, 3 und 4",
        text: "Natürliche Personen mit Wohnsitz oder gewöhnlichem Aufenthalt im Inland sind unbeschränkt einkommensteuerpflichtig. Auf Antrag können Personen ohne inländischen Wohnsitz oder gewöhnlichen Aufenthalt als unbeschränkt steuerpflichtig behandelt werden, soweit sie inländische Einkünfte im Sinne des § 49 haben und die gesetzlichen 90-Prozent- oder Grundfreibetragsgrenzen erfüllt sowie durch ausländische Bescheinigung nachgewiesen sind. Personen ohne inländischen Wohnsitz oder gewöhnlichen Aufenthalt sind vorbehaltlich der Absätze 2 und 3 beschränkt einkommensteuerpflichtig, wenn sie inländische Einkünfte im Sinne des § 49 haben.",
      },
    ],
  },
  {
    key: "estg-2",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/estg/__2.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "EStG § 2 Umfang der Besteuerung",
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
        key: "estg-2-all",
        locator: "EStG § 2 Abs. 1, 2 und 7",
        text: "Der Einkommensteuer unterliegen die sieben Einkunftsarten: Land- und Forstwirtschaft, Gewerbebetrieb, selbständige Arbeit, nichtselbständige Arbeit, Kapitalvermögen, Vermietung und Verpachtung sowie sonstige Einkünfte im Sinne des § 22. Bei den ersten drei Arten ist der Gewinn, bei den übrigen der Überschuss der Einnahmen über die Werbungskosten maßgebend. Die Einkommensteuer ist eine Jahressteuer; die Grundlagen werden für ein Kalenderjahr ermittelt.",
      },
    ],
  },
  {
    key: "estg-9",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/estg/__9.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "EStG § 9 Werbungskosten",
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
        key: "estg-9-1",
        locator: "EStG § 9 Abs. 1 Satz 1",
        text: "Werbungskosten sind Aufwendungen zur Erwerbung, Sicherung und Erhaltung der Einnahmen. Ob ein Aufwand beruflich veranlasst ist, richtet sich nach dem gesetzlichen Veranlassungszusammenhang und nicht danach, dass Geld ausgegeben wurde.",
      },
    ],
  },
  {
    key: "estg-9a",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/estg/__9a.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "EStG § 9a Pauschbeträge für Werbungskosten",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: ["EVENT_DATE"],
    passages: [
      {
        key: "estg-9a-all",
        locator: "EStG § 9a",
        text: "Für Werbungskosten werden bei den einzelnen Einkunftsarten Pauschbeträge angesetzt, wenn nicht höhere Werbungskosten nachgewiesen werden. Die Eurobeträge sind jahresbezogen und nicht als zeitlose Werte zu verwenden.",
      },
    ],
  },
  {
    key: "estg-10",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/estg/__10.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "EStG § 10 Sonderausgaben",
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
        key: "estg-10-1",
        locator: "EStG § 10 Abs. 1",
        text: "Sonderausgaben sind die gesetzlich bezeichneten Aufwendungen, wenn sie weder Betriebsausgaben noch Werbungskosten sind. Dazu gehören unter anderem bestimmte Vorsorgeaufwendungen, Kirchensteuer, Spenden und Kinderbetreuungskosten nach den jeweiligen Tatbestandsvoraussetzungen.",
      },
    ],
  },
  {
    key: "estg-25",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/estg/__25.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "EStG § 25 Veranlagungszeitraum, Steuererklärungspflicht",
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
        key: "estg-25-all",
        locator: "EStG § 25 Abs. 1, 3 und 4",
        text: "Die Einkommensteuer wird nach Ablauf des Kalenderjahres nach dem in diesem Veranlagungszeitraum bezogenen Einkommen veranlagt, soweit nicht nach § 43 Absatz 5 und § 46 eine Veranlagung unterbleibt. Die steuerpflichtige Person hat für den Veranlagungszeitraum eine eigenhändig unterschriebene Einkommensteuererklärung abzugeben. Die Erklärung ist nach amtlich vorgeschriebenem Datensatz durch Datenfernübertragung zu übermitteln, wenn Einkünfte nach § 2 Absatz 1 Satz 1 Nummer 1 bis 3 erzielt werden und es sich nicht um einen der Veranlagungsfälle gemäß § 46 Absatz 2 Nummer 2 bis 8 handelt. Auf Antrag kann die Finanzbehörde zur Vermeidung unbilliger Härten auf eine Übermittlung durch Datenfernübertragung verzichten.",
      },
    ],
  },
  {
    key: "estg-26",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/estg/__26.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "EStG § 26 Veranlagung von Ehegatten",
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
        key: "estg-26-all",
        locator: "EStG § 26",
        text: "Ehegatten können zwischen Einzelveranlagung und Zusammenveranlagung wählen, wenn beide unbeschränkt einkommensteuerpflichtig sind, sie nicht dauernd getrennt leben und diese Voraussetzungen zu Beginn oder im Laufe des Veranlagungszeitraums vorgelegen haben. Die Wahl wird durch Angabe in der Steuererklärung getroffen. Wird von dem Wahlrecht nicht oder nicht wirksam Gebrauch gemacht, ist eine Zusammenveranlagung durchzuführen. Die Regelungen gelten auch für Lebenspartner.",
      },
    ],
  },
  {
    key: "estg-26b",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/estg/__26b.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "EStG § 26b Zusammenveranlagung von Ehegatten",
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
        key: "estg-26b-all",
        locator: "EStG § 26b",
        text: "Bei der Zusammenveranlagung werden die Einkünfte, die die Ehegatten erzielt haben, zusammengerechnet, den Ehegatten gemeinsam zugerechnet und die Ehegatten sodann gemeinsam als Steuerpflichtige behandelt.",
      },
    ],
  },
  {
    key: "estg-32a",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/estg/__32a.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "EStG § 32a Einkommensteuertarif",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: ["EVENT_DATE"],
    passages: [
      {
        key: "estg-32a-structure",
        locator: "EStG § 32a Abs. 1",
        text: "Die tarifliche Einkommensteuer bemisst sich nach dem zu versteuernden Einkommen. Der Grundfreibetrag ist Teil der gesetzlichen Tarifformel und ändert sich gesetzlich; ein einzelner Eurobetrag ist kein zeitloser Rechtssatz.",
      },
    ],
  },
  {
    key: "estg-32b",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/estg/__32b.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "EStG § 32b Progressionsvorbehalt",
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
        key: "estg-32b-1",
        locator: "EStG § 32b Abs. 1",
        text: "Bestimmte steuerfreie Lohnersatzleistungen wie Arbeitslosengeld, Kurzarbeitergeld, Krankengeld und Elterngeld sowie bestimmte steuerfreie ausländische Einkünfte können den besonderen Steuersatz nach dem Progressionsvorbehalt auslösen. Die Leistung selbst wird dadurch nicht zur gewöhnlich steuerpflichtigen Einnahme; sie kann den anzuwendenden Steuersatz erhöhen.",
      },
    ],
  },
  {
    key: "estg-35a",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/estg/__35a.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "EStG § 35a Steuerermäßigung bei Aufwendungen für haushaltsnahe Beschäftigungen",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: ["EVENT_DATE"],
    passages: [
      {
        key: "estg-35a-all",
        locator: "EStG § 35a",
        text: "Für haushaltsnahe Beschäftigungsverhältnisse, Dienstleistungen und Handwerkerleistungen im Haushalt kann unter den gesetzlichen Voraussetzungen eine Steuerermäßigung beantragt werden. Die Höchstbeträge sind jahresbezogen und nicht zeitlos.",
      },
    ],
  },
  {
    key: "estg-36",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/estg/__36.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "EStG § 36 Entstehung und Tilgung der Einkommensteuer",
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
        key: "estg-36-all",
        locator: "EStG § 36 Abs. 1, 2 und 4",
        text: "Die Einkommensteuer entsteht mit Ablauf des Veranlagungszeitraums. Angerechnet werden insbesondere entrichtete Vorauszahlungen und die durch Steuerabzug erhobene Einkommensteuer. Ergibt die Abrechnung einen Überschuss zuungunsten der steuerpflichtigen Person, ist der Betrag, soweit er fällig gewordenen, aber nicht entrichteten Vorauszahlungen entspricht, sofort, im Übrigen innerhalb eines Monats nach Bekanntgabe des Steuerbescheids zu entrichten. Ein Überschuss zugunsten der steuerpflichtigen Person wird nach Bekanntgabe ausgezahlt.",
      },
    ],
  },
  {
    key: "estg-37",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/estg/__37.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "EStG § 37 Einkommensteuer-Vorauszahlung",
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
        key: "estg-37-all",
        locator: "EStG § 37 Abs. 1 und 3",
        text: "Vorauszahlungen auf die Einkommensteuer sind am 10. März, 10. Juni, 10. September und 10. Dezember zu entrichten. Das Finanzamt setzt sie durch Vorauszahlungsbescheid fest; sie bemessen sich grundsätzlich nach der Einkommensteuer der letzten Veranlagung nach Anrechnung der Steuerabzugsbeträge und können an die voraussichtliche Steuer angepasst werden.",
      },
    ],
  },
  {
    key: "estg-46",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/estg/__46.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "EStG § 46 Veranlagung bei Bezug von Einkünften aus nichtselbständiger Arbeit",
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
        key: "estg-46-2",
        locator: "EStG § 46 Abs. 2",
        text: "Besteht das Einkommen ganz oder teilweise aus Einkünften aus nichtselbständiger Arbeit mit Steuerabzug, wird eine Veranlagung nur in den gesetzlich bezeichneten Fällen durchgeführt, insbesondere bei zusätzlichen einkommensteuerpflichtigen Einkünften oder Progressionsleistungen über 410 Euro, bei nebeneinander bezogenem Arbeitslohn von mehreren Arbeitgebern, bei bestimmten Steuerklassen- oder Faktorfällen, bei bestimmten Lohnsteuer-Freibeträgen, bei Auflösung und Wiederheirat im selben Jahr und wenn die Veranlagung beantragt wird. Der Antrag nach Nummer 8 ist durch Abgabe einer Einkommensteuererklärung zu stellen. Kommt eine Veranlagung nicht in Betracht, gilt die auf den Arbeitslohn entfallende Einkommensteuer durch den Lohnsteuerabzug als abgegolten.",
      },
    ],
  },
  {
    key: "estg-49",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/estg/__49.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "EStG § 49 Beschränkt steuerpflichtige Einkünfte",
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
        key: "estg-49-1",
        locator: "EStG § 49 Abs. 1",
        text: "Inländische Einkünfte im Sinne der beschränkten Steuerpflicht sind nur die gesetzlich bezeichneten inländischen Einkunftstatbestände, nicht jedes Entgelt mit Deutschlandbezug.",
      },
    ],
  },
  {
    key: "estdv-56",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/estdv_1955/__56.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "EStDV § 56 Steuererklärungspflicht",
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
        key: "estdv-56-all",
        locator: "EStDV § 56",
        text: "Unbeschränkt Steuerpflichtige haben eine jährliche Einkommensteuererklärung abzugeben, wenn die in § 56 EStDV bezeichneten Einkommens- und Veranlagungsfälle vorliegen, insbesondere wenn der Gesamtbetrag der Einkünfte den Grundfreibetrag übersteigt und kein Lohnsteuerabzug enthalten ist oder wenn eine Veranlagung nach § 46 Absatz 2 Nummer 1 bis 7 in Betracht kommt. Eine Erklärung ist außerdem abzugeben, wenn zum Schluss des vorangegangenen Veranlagungszeitraums ein verbleibender Verlustabzug oder ein nachversteuerungspflichtiger Betrag festgestellt worden ist.",
      },
    ],
  },
  {
    key: "ao-8",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/ao_1977/__8.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 8 Wohnsitz",
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
        key: "ao-8-all",
        locator: "AO § 8",
        text: "Einen Wohnsitz hat jemand dort, wo er eine Wohnung unter Umständen innehat, die darauf schließen lassen, dass er die Wohnung beibehalten und benutzen wird.",
      },
    ],
  },
  {
    key: "ao-9",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/ao_1977/__9.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 9 Gewöhnlicher Aufenthalt",
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
        key: "ao-9-all",
        locator: "AO § 9",
        text: "Den gewöhnlichen Aufenthalt hat jemand dort, wo er sich unter Umständen aufhält, die erkennen lassen, dass er an diesem Ort oder in diesem Gebiet nicht nur vorübergehend verweilt. Als gewöhnlicher Aufenthalt gilt regelmäßig ein zeitlich zusammenhängender Aufenthalt von mehr als sechs Monaten; kurzfristige Unterbrechungen bleiben unberücksichtigt. Das gilt nicht für Aufenthalte ausschließlich zu Besuchs-, Erholungs-, Kur- oder ähnlichen privaten Zwecken von nicht mehr als einem Jahr.",
      },
    ],
  },
  {
    key: "ao-19",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/ao_1977/__19.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 19 Steuern vom Einkommen natürlicher Personen",
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
        key: "ao-19-1",
        locator: "AO § 19 Abs. 1 und 3",
        text: "Für die Besteuerung natürlicher Personen nach dem Einkommen ist das Finanzamt örtlich zuständig, in dessen Bezirk der Steuerpflichtige seinen Wohnsitz oder in Ermangelung eines Wohnsitzes seinen gewöhnlichen Aufenthalt hat. Bei Land- und Forstwirtschaft, Gewerbebetrieb oder freiberuflicher Tätigkeit innerhalb derselben Wohnsitzgemeinde kann abweichend ein anderes Finanzamt zuständig sein.",
      },
    ],
  },
  {
    key: "ao-90",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/ao_1977/__90.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 90 Mitwirkungspflicht der Beteiligten",
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
        key: "ao-90-1",
        locator: "AO § 90 Abs. 1",
        text: "Die Beteiligten sind zur Mitwirkung bei der Ermittlung des Sachverhalts verpflichtet. Sie kommen der Mitwirkungspflicht insbesondere dadurch nach, dass sie die für die Besteuerung erheblichen Tatsachen vollständig und wahrheitsgemäß offenlegen und die bekannten Beweismittel angeben.",
      },
    ],
  },
  {
    key: "ao-109",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/ao_1977/__109.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 109 Verlängerung von Fristen",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "DEADLINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ao-109-all",
        locator: "AO § 109",
        text: "Fristen zur Einreichung von Steuererklärungen können verlängert werden; bereits abgelaufene Fristen können rückwirkend verlängert werden, insbesondere wenn es unbillig wäre, die durch den Fristablauf eingetretenen Rechtsfolgen bestehen zu lassen. In Beraterfällen des § 149 Absatz 3 gilt nach dem letzten Februartag des zweiten Folgejahres eine Verlängerung nur, wenn der Steuerpflichtige ohne Verschulden verhindert ist oder war.",
      },
    ],
  },
  {
    key: "ao-122",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/ao_1977/__122.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 122 Bekanntgabe des Verwaltungsakts",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "DEADLINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ao-122-2",
        locator: "AO § 122 Abs. 2 und 2a",
        text: "Ein schriftlicher Verwaltungsakt, der durch die Post im Inland übermittelt wird, gilt am vierten Tage nach der Aufgabe zur Post als bekannt gegeben, außer wenn er nicht oder zu einem späteren Zeitpunkt zugegangen ist. Ein elektronisch übermittelter Verwaltungsakt gilt am vierten Tage nach der Absendung als bekannt gegeben, außer wenn er nicht oder später zugegangen ist.",
      },
    ],
  },
  {
    key: "ao-149",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/ao_1977/__149.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 149 Abgabe der Steuererklärungen",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "DEADLINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ao-149-all",
        locator: "AO § 149 Abs. 1 bis 4",
        text: "Die Steuergesetze bestimmen, wer zur Abgabe einer Steuererklärung verpflichtet ist. Zur Abgabe ist auch verpflichtet, wer hierzu von der Finanzbehörde aufgefordert wird. Die Verpflichtung bleibt auch dann bestehen, wenn die Finanzbehörde die Besteuerungsgrundlagen nach § 162 geschätzt hat. Soweit nichts anderes bestimmt ist, sind kalenderjahrbezogene Erklärungen spätestens sieben Monate nach Ablauf des Kalenderjahres abzugeben. Sind Personen im Sinne der §§ 3 und 4 StBerG mit der Erstellung bestimmter Pflicht-Einkommensteuererklärungen beauftragt, endet die Frist vorbehaltlich einer Vorabanforderung am letzten Tag des Monats Februar des zweiten Folgejahres.",
      },
    ],
  },
  {
    key: "ao-150",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/ao_1977/__150.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 150 Form und Inhalt der Steuererklärungen",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "FORM_URL",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ao-150-1",
        locator: "AO § 150 Abs. 1",
        text: "Eine Steuererklärung ist nach amtlich vorgeschriebenem Vordruck abzugeben, wenn der zuständige Minister dies bestimmt, und sonst, soweit sie nicht nach amtlich vorgeschriebenem Datensatz durch Datenfernübertragung zu übermitteln ist, schriftlich oder nach Maßgabe des Gesetzes elektronisch abzugeben.",
      },
    ],
  },
  {
    key: "ao-152",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/ao_1977/__152.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 152 Verspätungszuschlag",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "DEADLINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ao-152-all",
        locator: "AO § 152 Abs. 1, 2, 5 und 10",
        text: "Gegen denjenigen, der einer Verpflichtung zur Abgabe einer Steuererklärung nicht oder nicht fristgemäß nachkommt, kann ein Verspätungszuschlag festgesetzt werden; von der Festsetzung ist abzusehen, wenn die Verspätung entschuldbar ist. In den gesetzlich bezeichneten Jahreserklärungsfällen ist ein Verspätungszuschlag festzusetzen, soweit keine Ausnahme greift. Der Zuschlag darf höchstens 25 000 Euro betragen und ist kein Säumniszuschlag.",
      },
    ],
  },
  {
    key: "ao-162",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/ao_1977/__162.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 162 Schätzung von Besteuerungsgrundlagen",
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
        key: "ao-162-1",
        locator: "AO § 162 Abs. 1 und 2",
        text: "Soweit die Finanzbehörde die Besteuerungsgrundlagen nicht ermitteln oder berechnen kann, hat sie sie zu schätzen. Zu schätzen ist insbesondere, wenn der Steuerpflichtige keine ausreichenden Aufklärungen gibt, Auskunft verweigert oder Mitwirkungspflichten verletzt.",
      },
    ],
  },
  {
    key: "ao-169",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/ao_1977/__169.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 169 Festsetzungsfrist",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "DEADLINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ao-169-2",
        locator: "AO § 169 Abs. 2",
        text: "Die Festsetzungsfrist beträgt für die Einkommensteuer regelmäßig vier Jahre. Nach Ablauf der Festsetzungsfrist ist eine Steuerfestsetzung sowie ihre Aufhebung oder Änderung nicht mehr zulässig.",
      },
    ],
  },
  {
    key: "ao-170",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/ao_1977/__170.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 170 Beginn der Festsetzungsfrist",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "DEADLINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ao-170-1",
        locator: "AO § 170 Abs. 1",
        text: "Die Festsetzungsfrist beginnt mit Ablauf des Kalenderjahrs, in dem die Steuer entstanden ist. Die Einkommensteuer entsteht nach § 36 Absatz 1 EStG mit Ablauf des Veranlagungszeitraums.",
      },
    ],
  },
  {
    key: "ao-240",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/ao_1977/__240.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 240 Säumniszuschläge",
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
        key: "ao-240-1",
        locator: "AO § 240 Abs. 1",
        text: "Wird eine Steuer nicht bis zum Ablauf des Fälligkeitstages entrichtet, so ist für jeden angefangenen Monat der Säumnis ein Säumniszuschlag zu entrichten. Der Säumniszuschlag knüpft an die nicht rechtzeitige Zahlung, nicht an die verspätete Abgabe der Steuererklärung an.",
      },
    ],
  },
  {
    key: "ao-328",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/ao_1977/__328.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 328 Zwangsmittel",
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
        key: "ao-328-1",
        locator: "AO § 328 Abs. 1",
        text: "Die Finanzbehörde kann Handlungen, Duldungen oder Unterlassungen mit Zwangsmitteln erzwingen, insbesondere mit Zwangsgeld. Zwangsgeld ist ein Mittel zur Erzwingung einer Pflicht und nicht derselbe Zuschlag wie der Verspätungszuschlag nach § 152.",
      },
    ],
  },
  {
    key: "ao-347",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/ao_1977/__347.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 347 Statthaftigkeit des Einspruchs",
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
        key: "ao-347-1",
        locator: "AO § 347 Abs. 1",
        text: "Gegen Verwaltungsakte in Abgabenangelegenheiten ist als Rechtsbehelf der Einspruch statthaft.",
      },
    ],
  },
  {
    key: "ao-355",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/ao_1977/__355.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 355 Einspruchsfrist",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "DEADLINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ao-355-1",
        locator: "AO § 355 Abs. 1",
        text: "Der Einspruch ist innerhalb eines Monats nach Bekanntgabe des Verwaltungsakts einzulegen.",
      },
    ],
  },
  {
    key: "ao-357",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/ao_1977/__357.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 357 Einlegung des Einspruchs",
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
        key: "ao-357-all",
        locator: "AO § 357",
        text: "Der Einspruch ist schriftlich oder elektronisch einzureichen oder zur Niederschrift zu erklären. Es soll angegeben werden, welcher Verwaltungsakt angefochten wird, und der Einspruch soll begründet werden.",
      },
    ],
  },
  {
    key: "ao-361",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/ao_1977/__361.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "AO § 361 Aussetzung der Vollziehung",
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
        key: "ao-361-1-2",
        locator: "AO § 361 Abs. 1 und 2",
        text: "Durch Einlegung des Einspruchs wird die Vollziehung des angefochtenen Verwaltungsakts nicht gehemmt, insbesondere die Erhebung einer Abgabe nicht aufgehalten. Die Finanzbehörde kann die Vollziehung aussetzen; auf Antrag soll sie aussetzen, wenn ernstliche Zweifel an der Rechtmäßigkeit bestehen oder die Vollziehung eine unbillige Härte wäre.",
      },
    ],
  },
  {
    key: "egao-36",
    publisherKey: "bmj",
    authorityKey: "bmf",
    url: "https://www.gesetze-im-internet.de/aoeg_1977/art_97__36.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "EGAO Art. 97 § 36 Corona-Sonderregelungen",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "DEADLINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "egao-36-2020-2024",
        locator: "EGAO Art. 97 § 36 Abs. 3",
        text: "Die coronabedingten Sonderfristen der §§ 109, 149, 152 und 233a AO gelten nach Art. 97 § 36 EGAO für die Besteuerungszeiträume 2020 bis 2024. Der Veranlagungszeitraum 2025 fällt nicht unter diese Sonderregelung und richtet sich wieder nach dem regelmäßigen § 149 AO.",
      },
    ],
  },
  {
    key: "lfst-by-fristen-2025",
    publisherKey: "lfst_by",
    authorityKey: "lfst_by",
    url: "https://www.lfst.bayern.de/aktuelles/termine-und-fristen",
    officialDomain: "www.lfst.bayern.de",
    title: "Bayerisches Landesamt für Steuern: Termine und Fristen",
    sourceClass: "LAND_SERVICE_PORTAL",
    sourceType: "federal_guidance",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "DEADLINE",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "MONTHLY",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: ["EVENT_DATE"],
    passages: [
      {
        key: "lfst-2025-pflicht-antrag",
        locator: "Öffentliche Aufforderung Kalenderjahr 2025",
        text: "Für das Kalenderjahr 2025 sind die bezeichneten Steuererklärungen bis zum 31. Juli 2026 abzugeben. Für Arbeitnehmer, die einen Antrag auf Einkommensteuerveranlagung stellen, endet die Antrags- und Erklärungsfrist am 31. Dezember 2029. Für beratene Steuerpflichtige nennt die amtliche Tabelle zum Besteuerungszeitraum 2025 den 1. März 2027. Diese Daten sind jahresbezogen und nicht zeitlos.",
      },
    ],
  },
  {
    key: "elster-privatpersonen",
    publisherKey: "elster",
    authorityKey: "elster",
    url: "https://www.elster.de/elsterweb/infoseite/privatpersonen",
    officialDomain: "www.elster.de",
    title: "Mein ELSTER für Privatpersonen",
    sourceClass: "FEDERAL_SERVICE_PORTAL",
    sourceType: "authority_portal",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "ONLINE_SERVICE_URL",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "MONTHLY",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: [],
    passages: [
      {
        key: "elster-portal-all",
        locator: "ELSTER Privatpersonen",
        text: "Über Mein ELSTER können natürliche Personen die Einkommensteuererklärung elektronisch erstellen und authentifiziert übermitteln. Bildschirmtexte und Menübezeichnungen der Oberfläche sind betrieblich und ändern sich; sie sind kein Steuergesetz.",
      },
    ],
  },
  {
    key: "elster-forms",
    publisherKey: "elster",
    authorityKey: "elster",
    url: "https://www.elster.de/eportal/formulare-leistungen/alleformulare",
    officialDomain: "www.elster.de",
    title: "ELSTER Formulare und Leistungen",
    sourceClass: "FEDERAL_SERVICE_PORTAL",
    sourceType: "authority_portal",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "FORM_URL",
    handlingMode: "FETCH_LIVE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: [],
    passages: [
      {
        key: "elster-forms-all",
        locator: "ELSTER alle Formulare",
        text: "Mein ELSTER stellt die amtlichen Formulare der Finanzverwaltung bereit, darunter die Einkommensteuererklärung, die Belegnachreichung und den Einspruch. Welche Maske aktuell angezeigt wird, ist live zu prüfen.",
      },
    ],
  },
  {
    key: "elster-belege",
    publisherKey: "elster",
    authorityKey: "elster",
    url: "https://www.elster.de/eportal/helpGlobal?themaGlobal=help_est_ufa_10_2025",
    officialDomain: "www.elster.de",
    title: "ELSTER Belegvorhaltepflicht zur Einkommensteuererklärung",
    sourceClass: "FEDERAL_ADMINISTRATIVE_GUIDANCE",
    sourceType: "federal_guidance",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "REQUIRED_EVIDENCE",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "MONTHLY",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: [],
    passages: [
      {
        key: "elster-belege-vorhalt",
        locator: "ELSTER Belegvorhaltepflicht",
        text: "Grundsätzlich brauchen zur Einkommensteuererklärung keine Belege eingereicht zu werden; es genügt, sie für eventuelle Rückfragen aufzubewahren. Belege sind einzureichen, wenn die Formulare oder Ausfüllhilfen ausdrücklich darauf hinweisen oder das Finanzamt dazu auffordert. Angefordert sollen sie digital über das Formular Belegnachreichung in Mein ELSTER eingereicht werden.",
      },
    ],
  },
  {
    key: "bzst-finanzamt",
    publisherKey: "bzst",
    authorityKey: "bzst",
    url: "https://www.bzst.de/DE/Service/Behoerdenwegweiser/Finanzamtsuche/finanzamtsuche_node.html",
    officialDomain: "www.bzst.de",
    title: "BZSt Finanzamtsuche",
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
        key: "bzst-fa-search",
        locator: "BZSt Behördenwegweiser Finanzamtsuche",
        text: "Das örtlich zuständige Finanzamt ist über die amtliche Finanzamtsuche zu ermitteln. Sprache, Staatsangehörigkeit oder userLocale ersetzen diese Suche nicht.",
      },
    ],
  },
]);

export const EST_UNITS: readonly UnitSpec[] = Object.freeze([
  { key: "est-is-jahressteuer", category: "orientation", temporal: "current_2026", type: "definition", text: "Die Einkommensteuer ist eine Jahressteuer. Die Besteuerungsgrundlagen werden für ein Kalenderjahr als Veranlagungszeitraum ermittelt.", sourceKey: "estg-2", passageKey: "estg-2-all", riskLevel: "low" },
  { key: "current-year-not-final", category: "orientation", temporal: "current_2026", type: "exception", text: "Das laufende Kalenderjahr ist vor seinem Ablauf grundsätzlich noch kein abgeschlossener Veranlagungszeitraum. Eine endgültige Jahresfestsetzung für das laufende Jahr ist daher regelmäßig nicht möglich.", sourceKey: "estg-25", passageKey: "estg-25-all", riskLevel: "medium" },
  { key: "steuererklaerung-not-bescheid", category: "orientation", temporal: "current_2026", type: "exception", text: "Die Einkommensteuererklärung ist die Erklärung der steuerpflichtigen Person. Der Einkommensteuerbescheid ist der Verwaltungsakt des Finanzamts über die Festsetzung. Beides ist nicht dasselbe Dokument.", sourceKey: "estg-25", passageKey: "estg-25-all", riskLevel: "medium" },
  { key: "lohnsteuer-not-einkommensteuer", category: "orientation", temporal: "current_2026", type: "exception", text: "Die Lohnsteuer ist ein Steuerabzug vom Arbeitslohn und eine Vorauserhebung. Sie ist nicht die endgültige festgesetzte Einkommensteuer des Jahres.", sourceKey: "estg-36", passageKey: "estg-36-all", riskLevel: "high" },
  { key: "steuerklasse-not-final-tax", category: "orientation", temporal: "current_2026", type: "exception", text: "Die Steuerklasse steuert den Lohnsteuerabzug während des Jahres. Sie ist nicht der endgültige Einkommensteuertarif und nicht das Jahresergebnis der Veranlagung.", sourceKey: "estg-46", passageKey: "estg-46-2", riskLevel: "high" },
  { key: "steuerklasse-iii-not-lower-final", category: "orientation", temporal: "current_2026", type: "exception", text: "Steuerklasse III bedeutet nicht automatisch eine niedrigere endgültige Jahreseinkommensteuer. Die Jahressteuer folgt dem zu versteuernden Einkommen und dem Tarif, nicht der Lohnsteuerklasse allein.", sourceKey: "estg-32a", passageKey: "estg-32a-structure", riskLevel: "high" },
  { key: "steuerklasse-v-not-punishment", category: "orientation", temporal: "current_2026", type: "exception", text: "Steuerklasse V ist kein Straftarif und keine gesonderte Jahreseinkommensteuer. Sie ist ein Abzugsmerkmal für den Lohnsteuerabzug.", sourceKey: "estg-46", passageKey: "estg-46-2", riskLevel: "high" },
  { key: "elster-not-tax-law", category: "elster", temporal: "current_2026", type: "exception", text: "Mein ELSTER ist das amtliche elektronische Verfahren der Finanzverwaltung. Bildschirmtexte, Menüs und Rechenhinweise in ELSTER sind nicht das Einkommensteuergesetz.", sourceKey: "elster-privatpersonen", passageKey: "elster-portal-all", riskLevel: "medium" },
  { key: "umsatz-not-gewinn", category: "income_category", temporal: "current_2026", type: "exception", text: "Der Umsatz ist nicht der Gewinn. Bei Land- und Forstwirtschaft, Gewerbebetrieb und selbständiger Arbeit ist der Gewinn die maßgebliche Einkunftsgröße.", sourceKey: "estg-2", passageKey: "estg-2-all", riskLevel: "high" },
  { key: "gewinn-not-automatically-zvE", category: "income_category", temporal: "current_2026", type: "exception", text: "Der Gewinn einer Einkunftsart ist nicht automatisch das zu versteuernde Einkommen und nicht automatisch der festzusetzende Einkommensteuerbetrag.", sourceKey: "estg-2", passageKey: "estg-2-all", riskLevel: "high" },
  { key: "est-not-ust", category: "boundary", temporal: "current_2026", type: "exception", text: "Die Einkommensteuer ist nicht die Umsatzsteuer. Dieses Paket berechnet und erklärt keine Umsatzsteuer.", sourceKey: "estg-2", passageKey: "estg-2-all", riskLevel: "medium" },
  { key: "est-not-gewst", category: "boundary", temporal: "current_2026", type: "exception", text: "Die Einkommensteuer ist nicht die Gewerbesteuer. Ein Gewerbebetrieb kann beide Abgaben auslösen; sie sind getrennte Verfahren.", sourceKey: "estg-2", passageKey: "estg-2-all", riskLevel: "medium" },
  { key: "anmeldung-not-tax-residence", category: "boundary", temporal: "current_2026", type: "exception", text: "Die melderechtliche Anmeldung nach dem Bundesmeldegesetz ist nicht die steuerliche Wohnsitzfeststellung nach § 8 AO und nicht die unbeschränkte Steuerpflicht nach § 1 EStG.", sourceKey: "ao-8", passageKey: "ao-8-all", riskLevel: "high" },
  { key: "anmeldung-not-steuererklaerung", category: "boundary", temporal: "current_2026", type: "exception", text: "Die Anmeldung bei der Meldebehörde ist nicht die Einkommensteuererklärung. Meldebehörde und Finanzamt sind verschiedene Behörden.", sourceKey: "estg-25", passageKey: "estg-25-all", riskLevel: "medium" },
  { key: "steuer-id-pack-is-separate", category: "boundary", temporal: "current_2026", type: "exception", text: "Identifikationsnummer, Steuernummer und grundlegende Finanzamtschreiben gehören zum gesonderten Paket steuer_id_and_basic_finanzamt_letters. Dieses Paket ergänzt den jährlichen Erklärungslebenszyklus und verdoppelt jene Grundlagen nicht.", sourceKey: "ao-149", passageKey: "ao-149-all", riskLevel: "low" },
  { key: "alg-pack-is-separate", category: "boundary", temporal: "current_2026", type: "exception", text: "Arbeitslosengeld-Anspruch, Sperrzeit und Agenturzuständigkeit gehören zum gesonderten Arbeitslosengeldpaket. Hier ist Arbeitslosengeld nur als mögliche Progressionsleistung und Steuerdatum relevant.", sourceKey: "estg-32b", passageKey: "estg-32b-1", riskLevel: "medium" },
  { key: "health-pack-is-separate", category: "boundary", temporal: "current_2026", type: "exception", text: "Krankenversicherungsschutz und Krankengeldanspruch gehören zum gesonderten Krankenversicherungspaket. Hier ist Krankengeld nur als mögliche Progressionsleistung relevant.", sourceKey: "estg-32b", passageKey: "estg-32b-1", riskLevel: "medium" },
  { key: "kindergeld-pack-is-separate", category: "boundary", temporal: "current_2026", type: "exception", text: "Kindergeldanspruch und Familienkasse gehören zum gesonderten Kindergeldpaket. Elterngeld kann hier nur als Progressionsgrenze erscheinen.", sourceKey: "estg-32b", passageKey: "estg-32b-1", riskLevel: "medium" },
  { key: "unlimited-if-wohnsitz-or-aufenthalt", category: "tax_liability", temporal: "current_2026", type: "definition", text: "Natürliche Personen mit Wohnsitz oder gewöhnlichem Aufenthalt im Inland sind unbeschränkt einkommensteuerpflichtig.", sourceKey: "estg-1", passageKey: "estg-1-1-4", riskLevel: "medium" },
  { key: "wohnsitz-definition", category: "tax_liability", temporal: "current_2026", type: "definition", text: "Einen steuerlichen Wohnsitz hat, wer eine Wohnung unter Umständen innehat, die auf Beibehalten und Benutzen schließen lassen. Eine gemeldete Anschrift allein ersetzt diese Prüfung nicht.", sourceKey: "ao-8", passageKey: "ao-8-all", riskLevel: "high" },
  { key: "gewoehnlicher-aufenthalt-definition", category: "tax_liability", temporal: "current_2026", type: "definition", text: "Den gewöhnlichen Aufenthalt hat, wer sich nicht nur vorübergehend an einem Ort aufhält. Regelmäßig gilt ein zusammenhängender Aufenthalt von mehr als sechs Monaten; reine Besuch- oder Kuraufenthalte bis zu einem Jahr fallen nicht darunter.", sourceKey: "ao-9", passageKey: "ao-9-all", riskLevel: "high" },
  { key: "limited-if-domestic-income", category: "tax_liability", temporal: "current_2026", type: "definition", text: "Wer im Inland weder Wohnsitz noch gewöhnlichen Aufenthalt hat, ist beschränkt einkommensteuerpflichtig, wenn inländische Einkünfte im Sinne des § 49 EStG vorliegen.", sourceKey: "estg-1", passageKey: "estg-1-1-4", riskLevel: "high" },
  { key: "section-1-3-request-boundary", category: "tax_liability", temporal: "current_2026", type: "procedure", text: "Eine Behandlung als unbeschränkt steuerpflichtig nach § 1 Absatz 3 EStG setzt einen Antrag, inländische Einkünfte, die 90-Prozent- oder Grundfreibetragsgrenze und eine Bescheinigung der ausländischen Steuerbehörde voraus. Ohne diese Tatsachen ist der Antragsweg nicht feststellbar.", sourceKey: "estg-1", passageKey: "estg-1-1-4", riskLevel: "high", requiredContextKeys: ["RESIDENCE_STATE", "COUNTRY", "PROCESS_VARIANT"] },
  { key: "german-address-not-complete-residence", category: "tax_liability", temporal: "current_2026", type: "exception", text: "Eine deutsche Anschrift ist nicht die vollständige Antwort auf die internationale Steueransässigkeit. Wohnsitz, gewöhnlicher Aufenthalt und Abkommensansässigkeit können auseinanderfallen.", sourceKey: "ao-8", passageKey: "ao-8-all", riskLevel: "high", requiredContextKeys: ["RESIDENCE_STATE", "COUNTRY"] },
  { key: "living-abroad-not-automatic-no-est", category: "tax_liability", temporal: "current_2026", type: "exception", text: "Ein Leben im Ausland bedeutet nicht automatisch, dass keine deutsche Einkommensteuer entsteht. Beschränkte Steuerpflicht kann bei inländischen Einkünften fortbestehen.", sourceKey: "estg-1", passageKey: "estg-1-1-4", riskLevel: "high" },
  { key: "working-germany-not-automatic-unlimited", category: "tax_liability", temporal: "current_2026", type: "exception", text: "Arbeit in Deutschland begründet nicht automatisch unbeschränkte Einkommensteuerpflicht. Maßgeblich sind Wohnsitz, gewöhnlicher Aufenthalt oder ein Antrag nach § 1 Absatz 3.", sourceKey: "estg-1", passageKey: "estg-1-1-4", riskLevel: "high" },
  { key: "nationality-not-tax-residence", category: "tax_liability", temporal: "current_2026", type: "exception", text: "Die deutsche Staatsangehörigkeit ist nicht die steuerliche Ansässigkeit. userLocale bestimmt ebenso wenig die Steuerpflicht.", sourceKey: "estg-1", passageKey: "estg-1-1-4", riskLevel: "high" },
  { key: "userlocale-not-jurisdiction", category: "competence", temporal: "current_2026", type: "exception", text: "userLocale, Sprache der Anwendung oder Dokumentsprache bestimmen weder die Steuerpflicht noch das zuständige Finanzamt.", sourceKey: "ao-19", passageKey: "ao-19-1", riskLevel: "high" },
  { key: "dual-residence-fail-closed", category: "cross_border", temporal: "current_2026", type: "exception", text: "Eine doppelte Ansässigkeit oder die abkommensrechtliche Wohnsitzzuordnung darf ohne Wohnstaaten, Aufenthaltstage, Mittelpunkt der Lebensinteressen und das einschlägige Abkommen nicht entschieden werden.", sourceKey: "estg-1", passageKey: "estg-1-1-4", riskLevel: "high", requiredContextKeys: ["RESIDENCE_STATE", "COUNTRY", "PROCESS_VARIANT"] },
  { key: "foreign-income-not-automatically-tax-free", category: "cross_border", temporal: "current_2026", type: "exception", text: "Ausländische Einkünfte sind in Deutschland nicht automatisch steuerfrei. Sie können der unbeschränkten Steuerpflicht unterliegen oder den Progressionsvorbehalt auslösen.", sourceKey: "estg-32b", passageKey: "estg-32b-1", riskLevel: "high" },
  { key: "foreign-tax-paid-not-nothing-to-declare", category: "cross_border", temporal: "current_2026", type: "exception", text: "Im Ausland gezahlte Steuer bedeutet nicht, dass in Deutschland nichts zu erklären ist. Anrechnung, Freistellung oder Progression richten sich nach Gesetz und Abkommen.", sourceKey: "estg-32b", passageKey: "estg-32b-1", riskLevel: "high" },
  { key: "german-employer-not-exclusive-right", category: "cross_border", temporal: "current_2026", type: "exception", text: "Ein deutscher Arbeitgeber gibt Deutschland nicht automatisch das ausschließliche Besteuerungsrecht. Arbeitsort, Ansässigkeit und Abkommen können teilen oder zuordnen.", sourceKey: "estg-49", passageKey: "estg-49-1", riskLevel: "high" },
  { key: "eu-citizen-not-special-universal-tax", category: "cross_border", temporal: "current_2026", type: "exception", text: "Die Unionsbürgerschaft begründet keine besondere universelle Einkommensteuerbehandlung und ersetzt nicht Wohnsitz, Einkunftsart und Abkommen.", sourceKey: "estg-1", passageKey: "estg-1-1-4", riskLevel: "medium" },
  { key: "treaty-result-fail-closed", category: "cross_border", temporal: "current_2026", type: "exception", text: "Ein einzelnes Abkommensergebnis zur Aufteilung des Besteuerungsrechts darf ohne Staaten, Ansässigkeit, Arbeitsort, Einkunftsart und maßgebliche Zeiträume nicht festgestellt werden.", sourceKey: "estg-49", passageKey: "estg-49-1", riskLevel: "high", requiredContextKeys: ["COUNTRY", "RESIDENCE_STATE", "WORK_STATE", "EVENT_DATE"] },
  { key: "estdv-56-filing-duty", category: "filing_obligation", temporal: "current_2026", type: "duty", text: "Unbeschränkt Steuerpflichtige müssen eine jährliche Einkommensteuererklärung abgeben, wenn § 56 EStDV das vorsieht, insbesondere bei Überschreiten des Grundfreibetrags ohne Lohnsteuerabzug oder bei einer Veranlagung nach § 46 Absatz 2 Nummer 1 bis 7.", sourceKey: "estdv-56", passageKey: "estdv-56-all", riskLevel: "high" },
  { key: "aufforderung-creates-duty", category: "filing_obligation", temporal: "current_2026", type: "duty", text: "Zur Abgabe einer Steuererklärung ist auch verpflichtet, wer hierzu von der Finanzbehörde aufgefordert wird. Die Aufforderung kann durch öffentliche Bekanntmachung erfolgen.", sourceKey: "ao-149", passageKey: "ao-149-all", riskLevel: "high" },
  { key: "aufforderung-not-optional", category: "filing_obligation", temporal: "current_2026", type: "exception", text: "Eine Aufforderung des Finanzamts zur Abgabe der Steuererklärung ist nicht optional. Sie begründet die Erklärungspflicht auch dann, wenn die Person sonst keine Pflichtveranlagung angenommen hat.", sourceKey: "ao-149", passageKey: "ao-149-all", riskLevel: "high" },
  { key: "schaetzung-does-not-end-duty", category: "late_filing", temporal: "current_2026", type: "duty", text: "Die Verpflichtung zur Abgabe der Steuererklärung bleibt auch dann bestehen, wenn die Finanzbehörde die Besteuerungsgrundlagen nach § 162 geschätzt hat.", sourceKey: "ao-149", passageKey: "ao-149-all", riskLevel: "high" },
  { key: "employee-not-automatically-required", category: "filing_obligation", temporal: "current_2026", type: "exception", text: "Arbeitnehmerstatus bedeutet nicht automatisch eine Pflicht zur Einkommensteuererklärung. Bei Lohnsteuerabzug findet eine Veranlagung nur in den Fällen des § 46 Absatz 2 oder nach Aufforderung statt.", sourceKey: "estg-46", passageKey: "estg-46-2", riskLevel: "high" },
  { key: "employee-not-automatically-exempt", category: "filing_obligation", temporal: "current_2026", type: "exception", text: "Arbeitnehmerstatus bedeutet nicht automatisch Freiheit von der Erklärungspflicht. Zusatzeinkünfte, Progression, mehrere Arbeitgeber nebeneinander, bestimmte Steuerklassenfälle oder eine Aufforderung können die Pflicht auslösen.", sourceKey: "estg-46", passageKey: "estg-46-2", riskLevel: "high" },
  { key: "refund-expected-not-voluntary-proof", category: "filing_obligation", temporal: "current_2026", type: "exception", text: "Eine erwartete Erstattung beweist nicht, dass die Erklärung freiwillig ist. Pflicht und Antragsweg richten sich nach Gesetz, nicht nach der erwarteten Nachzahlung oder Erstattung.", sourceKey: "estg-46", passageKey: "estg-46-2", riskLevel: "high" },
  { key: "payment-expected-not-mandatory-proof", category: "filing_obligation", temporal: "current_2026", type: "exception", text: "Eine erwartete Nachzahlung beweist nicht allein die Pflichtveranlagung. Die Pflicht zur Einkommensteuererklärung folgt aus § 56 EStDV, § 46 EStG oder einer Aufforderung.", sourceKey: "estdv-56", passageKey: "estdv-56-all", riskLevel: "high" },
  { key: "section-46-untaxed-or-progression-410", category: "filing_obligation", temporal: "current_2026", type: "duty", text: "Eine Arbeitnehmerveranlagung findet statt, wenn die positive Summe der nicht dem Lohnsteuerabzug unterworfenen einkommensteuerpflichtigen Einkünfte oder die positive Summe der dem Progressionsvorbehalt unterliegenden Einkünfte und Leistungen jeweils mehr als 410 Euro beträgt.", sourceKey: "estg-46", passageKey: "estg-46-2", riskLevel: "high" },
  { key: "section-46-multiple-employers-simultaneous", category: "filing_obligation", temporal: "current_2026", type: "duty", text: "Eine Arbeitnehmerveranlagung findet statt, wenn nebeneinander von mehreren Arbeitgebern Arbeitslohn bezogen wurde, soweit der Arbeitslohn nicht für den Lohnsteuerabzug zusammengerechnet worden ist.", sourceKey: "estg-46", passageKey: "estg-46-2", riskLevel: "high" },
  { key: "changing-employer-not-automatically-pflicht", category: "filing_obligation", temporal: "current_2026", type: "exception", text: "Ein Arbeitgeberwechsel im Laufe des Jahres ist nicht automatisch dieselbe Lage wie der gleichzeitige Bezug von Arbeitslohn mehrerer Arbeitgeber. Nur der gesetzliche Nebeneinander-Tatbestand des § 46 Absatz 2 Nummer 2 löst diese Pflicht aus.", sourceKey: "estg-46", passageKey: "estg-46-2", riskLevel: "high" },
  { key: "two-employers-not-always-simultaneous", category: "filing_obligation", temporal: "current_2026", type: "exception", text: "Zwei Arbeitgeber in einem Kalenderjahr sind nicht immer ein gleichzeitiger Mehrfachbezug. Maßgeblich ist, ob Arbeitslohn nebeneinander bezogen wurde.", sourceKey: "estg-46", passageKey: "estg-46-2", riskLevel: "high" },
  { key: "section-46-steuerklasse-v-vi-or-factor", category: "filing_obligation", temporal: "current_2026", type: "duty", text: "Ehegatten, die zusammen zur Einkommensteuer zu veranlagen sind und beide Arbeitslohn bezogen haben, werden veranlagt, wenn einer nach Steuerklasse V oder VI besteuert oder bei Steuerklasse IV der Faktor eingetragen war.", sourceKey: "estg-46", passageKey: "estg-46-2", riskLevel: "high" },
  { key: "steuerklasse-iii-v-not-always-enough", category: "filing_obligation", temporal: "current_2026", type: "exception", text: "Steuerklasse III oder V allein genügt nicht ohne die übrigen gesetzlichen Tatsachen des § 46 Absatz 2 Nummer 3a, insbesondere Zusammenveranlagung und beidseitigen Arbeitslohn.", sourceKey: "estg-46", passageKey: "estg-46-2", riskLevel: "high" },
  { key: "steuerklasse-iv-not-automatically-exempt", category: "filing_obligation", temporal: "current_2026", type: "exception", text: "Steuerklasse IV bedeutet nicht automatisch, dass keine Erklärungspflicht besteht. Ein eingetragener Faktor oder andere Tatbestände des § 46 können die Veranlagung auslösen.", sourceKey: "estg-46", passageKey: "estg-46-2", riskLevel: "high" },
  { key: "section-46-freibetrag-threshold", category: "filing_obligation", temporal: "current_2026", type: "duty", text: "Ein ermittelter Freibetrag im Sinne des § 39a Absatz 1 Satz 1 Nummer 1 bis 3, 5 oder 6 löst eine Veranlagung aus, wenn der Arbeitslohn die Summe aus Grundfreibetrag, Arbeitnehmer-Pauschbetrag und Sonderausgaben-Pauschbetrag übersteigt. Die Eurogrenzen sind jahresbezogen zu prüfen.", sourceKey: "estg-46", passageKey: "estg-46-2", riskLevel: "high", requiredContextKeys: ["EVENT_DATE"] },
  { key: "benefit-not-automatic-unless-threshold", category: "filing_obligation", temporal: "current_2026", type: "exception", text: "Der Bezug einer Lohnersatzleistung begründet nicht automatisch die Erklärungspflicht. Maßgeblich ist, ob die positive Summe der Progressionsleistungen die gesetzliche 410-Euro-Schwelle des § 46 Absatz 2 Nummer 1 überschreitet.", sourceKey: "estg-46", passageKey: "estg-46-2", riskLevel: "high" },
  { key: "section-46-8-antrag-via-declaration", category: "filing_obligation", temporal: "current_2026", type: "procedure", text: "Wird keine Pflichtveranlagung durchgeführt, kann die Veranlagung beantragt werden, insbesondere zur Anrechnung von Lohnsteuer. Der Antrag wird durch Abgabe einer Einkommensteuererklärung gestellt.", sourceKey: "estg-46", passageKey: "estg-46-2", riskLevel: "medium" },
  { key: "antragsveranlagung-not-guaranteed-refund", category: "filing_obligation", temporal: "current_2026", type: "exception", text: "Die Antragsveranlagung garantiert keine Erstattung. Sie kann auch zu einer Nachzahlung führen.", sourceKey: "estg-46", passageKey: "estg-46-2", riskLevel: "high" },
  { key: "insufficient-facts-no-obligation-decision", category: "filing_obligation", temporal: "current_2026", type: "exception", text: "Ob eine Pflicht- oder Antragsveranlagung vorliegt, darf ohne Steuerjahr, Einkunftsarten, Familienstand, Steuerabzug, Progressionsleistungen und eine etwaige Finanzamtsaufforderung nicht entschieden werden.", sourceKey: "estg-46", passageKey: "estg-46-2", riskLevel: "high", requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "progression-replacement-income", category: "progression", temporal: "current_2026", type: "definition", text: "Arbeitslosengeld, Kurzarbeitergeld, Krankengeld und Elterngeld gehören zu den gesetzlich bezeichneten Leistungen, die dem Progressionsvorbehalt unterliegen können.", sourceKey: "estg-32b", passageKey: "estg-32b-1", riskLevel: "medium" },
  { key: "tax-free-not-irrelevant-to-rate", category: "progression", temporal: "current_2026", type: "exception", text: "Eine steuerfreie Zahlung ist nicht notwendig einkommensteuerlich bedeutungslos. Sie kann den besonderen Steuersatz nach dem Progressionsvorbehalt erhöhen.", sourceKey: "estg-32b", passageKey: "estg-32b-1", riskLevel: "high" },
  { key: "progression-not-ordinary-taxable", category: "progression", temporal: "current_2026", type: "exception", text: "Der Progressionsvorbehalt macht die Lohnersatzleistung nicht zur gewöhnlich steuerpflichtigen Einnahme. Er ändert den anzuwendenden Steuersatz.", sourceKey: "estg-32b", passageKey: "estg-32b-1", riskLevel: "high" },
  { key: "seven-categories-routing", category: "income_category", temporal: "current_2026", type: "definition", text: "Zur Orientierung sind die sieben Einkunftsarten zu unterscheiden: Land- und Forstwirtschaft, Gewerbebetrieb, selbständige Arbeit, nichtselbständige Arbeit, Kapitalvermögen, Vermietung und Verpachtung sowie sonstige Einkünfte.", sourceKey: "estg-2", passageKey: "estg-2-all", riskLevel: "low" },
  { key: "profit-vs-surplus", category: "income_category", temporal: "current_2026", type: "definition", text: "Bei Land- und Forstwirtschaft, Gewerbebetrieb und selbständiger Arbeit ist der Gewinn maßgebend, bei den übrigen Einkunftsarten der Überschuss der Einnahmen über die Werbungskosten.", sourceKey: "estg-2", passageKey: "estg-2-all", riskLevel: "medium" },
  { key: "classification-needs-context", category: "income_category", temporal: "current_2026", type: "exception", text: "Die Zuordnung zu einer Einkunftsart kann ohne konkrete Tätigkeit, Vertrag und Vermögenszuordnung nicht sicher entschieden werden.", sourceKey: "estg-2", passageKey: "estg-2-all", riskLevel: "high", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "bank-transfer-not-taxable-income", category: "income_category", temporal: "current_2026", type: "exception", text: "Ein Kontoeingang ist nicht automatisch steuerpflichtige Einnahme. Maßgeblich ist die gesetzliche Einkunftsart, nicht die Überweisung als solche.", sourceKey: "estg-2", passageKey: "estg-2-all", riskLevel: "high" },
  { key: "reimbursement-not-automatically-taxable", category: "income_category", temporal: "current_2026", type: "exception", text: "Eine Erstattung oder ein Kostenersatz ist nicht automatisch steuerpflichtige Einnahme der Einkommensteuer.", sourceKey: "estg-2", passageKey: "estg-2-all", riskLevel: "medium" },
  { key: "private-sale-not-always-taxable", category: "income_category", temporal: "current_2026", type: "exception", text: "Ein privater Verkauf ist nicht immer steuerpflichtig. Die Prüfung sonstiger Einkünfte oder eines privaten Veräußerungsgeschäfts gehört nicht in eine pauschale Zuordnung dieses Grundpakets.", sourceKey: "estg-2", passageKey: "estg-2-all", riskLevel: "high" },
  { key: "rental-payment-not-profit-amount", category: "income_category", temporal: "current_2026", type: "exception", text: "Eine Mietzahlung ist nicht automatisch der steuerliche Überschuss aus Vermietung und Verpachtung. Werbungskosten und Absetzungen sind gesondert zu ermitteln.", sourceKey: "estg-2", passageKey: "estg-2-all", riskLevel: "high" },
  { key: "self-employed-triggers-electronic", category: "elster", temporal: "current_2026", type: "duty", text: "Werden Einkünfte aus Land- und Forstwirtschaft, Gewerbebetrieb oder selbständiger Arbeit erzielt und liegt keiner der Veranlagungsfälle des § 46 Absatz 2 Nummer 2 bis 8 vor, ist die Einkommensteuererklärung elektronisch zu übermitteln.", sourceKey: "estg-25", passageKey: "estg-25-all", riskLevel: "high" },
  { key: "not-every-self-employed-from-turnover", category: "income_category", temporal: "current_2026", type: "exception", text: "Selbständigen darf nicht gesagt werden, die Einkommensteuer werde unmittelbar aus dem Umsatz berechnet. Maßgeblich ist der Gewinn.", sourceKey: "estg-2", passageKey: "estg-2-all", riskLevel: "high" },
  { key: "euer-boundary-route", category: "boundary", temporal: "current_2026", type: "procedure", text: "Gewinnermittlung, Einnahmenüberschussrechnung und Buchführung sind in diesem Grundpaket nur als Grenze zu erkennen und weiterzuleiten, nicht als vollständiges Rechnungswesen.", sourceKey: "estg-2", passageKey: "estg-2-all", riskLevel: "medium" },
  { key: "ao-149-2-seven-months", category: "deadline", temporal: "current_2026", type: "deadline", text: "Soweit die Steuergesetze nichts anderes bestimmen, sind kalenderjahrbezogene Steuererklärungen spätestens sieben Monate nach Ablauf des Kalenderjahres abzugeben.", sourceKey: "ao-149", passageKey: "ao-149-all", riskLevel: "medium" },
  { key: "ao-149-3-advised-february", category: "deadline", temporal: "current_2026", type: "deadline", text: "Sind Personen im Sinne der §§ 3 und 4 StBerG mit der Erstellung einer Pflicht-Einkommensteuererklärung beauftragt, endet die Frist vorbehaltlich einer Vorabanforderung am letzten Tag des Februars des zweiten Folgejahres.", sourceKey: "ao-149", passageKey: "ao-149-all", riskLevel: "medium" },
  { key: "deadline-not-timeless-31-july", category: "deadline", temporal: "current_2026", type: "exception", text: "Der 31. Juli ist keine zeitlose universelle Abgabefrist. Die Frist hängt vom Steuerjahr, von Pflicht oder Antrag, von einer steuerlichen Beratung, von einer Vorabanforderung und von einer etwaigen Verlängerung ab.", sourceKey: "ao-149", passageKey: "ao-149-all", riskLevel: "high" },
  { key: "egao-corona-only-2020-2024", category: "deadline", temporal: "current_2026", type: "definition", text: "Die coronabedingten Sonderfristen des Art. 97 § 36 EGAO gelten für die Besteuerungszeiträume 2020 bis 2024. Für 2025 gilt wieder der regelmäßige § 149 AO.", sourceKey: "egao-36", passageKey: "egao-36-2020-2024", riskLevel: "medium" },
  { key: "vz-2025-unadvised-31-july-2026", category: "deadline", temporal: "current_2026", type: "deadline", text: "Für den Veranlagungszeitraum 2025 endet die Pflichtabgabefrist nicht beratener Steuerpflichtiger nach der öffentlichen Aufforderung der Finanzämter am 31. Juli 2026. Dieses Datum ist jahresbezogen und nicht zeitlos.", sourceKey: "lfst-by-fristen-2025", passageKey: "lfst-2025-pflicht-antrag", riskLevel: "medium", requiresEffectiveDate: true, requiredContextKeys: ["EVENT_DATE"] },
  { key: "vz-2025-advised-1-mar-2027", category: "deadline", temporal: "current_2026", type: "deadline", text: "Für beratene Pflichtfälle des Veranlagungszeitraums 2025 nennt die amtliche Fristentabelle der Landesfinanzverwaltung den 1. März 2027. Eine Vorabanforderung kann die Frist verkürzen.", sourceKey: "lfst-by-fristen-2025", passageKey: "lfst-2025-pflicht-antrag", riskLevel: "medium", requiresEffectiveDate: true, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "individual-deadline-needs-facts", category: "deadline", temporal: "current_2026", type: "exception", text: "Eine individuelle Abgabefrist darf ohne Steuerjahr, Pflicht oder Antrag, Beratungsstatus, Vorabanforderung und individuelle Verlängerung nicht genannt werden.", sourceKey: "ao-149", passageKey: "ao-149-all", riskLevel: "high", requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "antragsveranlagung-four-year-framework", category: "deadline", temporal: "current_2026", type: "deadline", text: "Wird die Veranlagung nur auf Antrag durchgeführt, muss der Antrag durch Abgabe der Erklärung innerhalb der Festsetzungsfrist gestellt werden. Die regelmäßige Festsetzungsfrist der Einkommensteuer beträgt vier Jahre und beginnt mit Ablauf des Entstehungsjahres.", sourceKey: "ao-169", passageKey: "ao-169-2", riskLevel: "medium" },
  { key: "vz-2025-voluntary-31-dec-2029", category: "deadline", temporal: "current_2026", type: "deadline", text: "Für Arbeitnehmer, die für 2025 einen Antrag auf Einkommensteuerveranlagung stellen, endet die Antrags- und Erklärungsfrist nach der öffentlichen Aufforderung am 31. Dezember 2029. Das Datum ist jahresbezogen.", sourceKey: "lfst-by-fristen-2025", passageKey: "lfst-2025-pflicht-antrag", riskLevel: "medium", requiresEffectiveDate: true, requiredContextKeys: ["EVENT_DATE"] },
  { key: "missed-voluntary-no-assessment", category: "deadline", temporal: "current_2026", type: "exception", text: "Nach Ablauf der Festsetzungsfrist ist eine Steuerfestsetzung grundsätzlich nicht mehr zulässig. Eine verspätete freiwillige Erklärung kann dann nicht mehr zur Antragsveranlagung führen.", sourceKey: "ao-169", passageKey: "ao-169-2", riskLevel: "high" },
  { key: "extension-109-possible", category: "deadline", temporal: "current_2026", type: "procedure", text: "Fristen zur Einreichung von Steuererklärungen können nach § 109 AO verlängert werden. Bereits abgelaufene Fristen können rückwirkend verlängert werden.", sourceKey: "ao-109", passageKey: "ao-109-all", riskLevel: "medium" },
  { key: "extension-not-automatic", category: "deadline", temporal: "current_2026", type: "exception", text: "Der Antrag auf Fristverlängerung bewilligt die Verlängerung nicht automatisch. Die Finanzbehörde entscheidet.", sourceKey: "ao-109", passageKey: "ao-109-all", riskLevel: "high" },
  { key: "advised-109-2-limits", category: "deadline", temporal: "current_2026", type: "exception", text: "In Beraterfällen des § 149 Absatz 3 ist eine Verlängerung nach dem letzten Februartag des zweiten Folgejahres nur möglich, wenn der Steuerpflichtige ohne Verschulden verhindert ist oder war.", sourceKey: "ao-109", passageKey: "ao-109-all", riskLevel: "high" },
  { key: "still-file-when-late", category: "late_filing", temporal: "current_2026", type: "procedure", text: "Ist die Abgabefrist versäumt, bleibt die Erklärungspflicht bestehen. Die Erklärung ist nachzuholen und nicht aufzuschieben, bis das Finanzamt von sich aus tätig wird.", sourceKey: "ao-149", passageKey: "ao-149-all", riskLevel: "high" },
  { key: "verspaetungszuschlag-can-be-set", category: "late_filing", temporal: "current_2026", type: "duty", text: "Wer eine geschuldete Steuererklärung nicht oder nicht fristgemäß abgibt, dem kann ein Verspätungszuschlag festgesetzt werden; in bestimmten Jahreserklärungsfällen ist er festzusetzen, soweit keine Ausnahme greift.", sourceKey: "ao-152", passageKey: "ao-152-all", riskLevel: "medium" },
  { key: "verspaetungszuschlag-not-always-max", category: "late_filing", temporal: "current_2026", type: "exception", text: "Eine verspätete Erklärung löst nicht automatisch den Höchstbetrag von 25 000 Euro aus. Höhe und Festsetzung richten sich nach § 152 AO und den Tatsachen des Falls.", sourceKey: "ao-152", passageKey: "ao-152-all", riskLevel: "high" },
  { key: "one-day-late-not-same", category: "late_filing", temporal: "current_2026", type: "exception", text: "Ein Tag Verspätung hat nicht in jedem Fall dieselbe Rechtsfolge. Entschuldbarkeit, Ausnahmen und die gesetzliche Bemessung können das Ergebnis ändern.", sourceKey: "ao-152", passageKey: "ao-152-all", riskLevel: "high" },
  { key: "verspaetungszuschlag-not-saeumnis", category: "late_filing", temporal: "current_2026", type: "exception", text: "Der Verspätungszuschlag wegen nicht rechtzeitiger Abgabe ist nicht der Säumniszuschlag wegen nicht rechtzeitiger Zahlung.", sourceKey: "ao-240", passageKey: "ao-240-1", riskLevel: "high" },
  { key: "zwangsgeld-not-verspaetung", category: "late_filing", temporal: "current_2026", type: "exception", text: "Zwangsgeld ist ein Zwangsmittel zur Erzwingung einer Pflicht und nicht derselbe Zuschlag wie der Verspätungszuschlag.", sourceKey: "ao-328", passageKey: "ao-328-1", riskLevel: "medium" },
  { key: "schaetzung-when-cannot-determine", category: "late_filing", temporal: "current_2026", type: "procedure", text: "Kann das Finanzamt die Besteuerungsgrundlagen nicht ermitteln, hat es sie zu schätzen, insbesondere bei fehlender Mitwirkung oder nicht abgegebener Erklärung.", sourceKey: "ao-162", passageKey: "ao-162-1", riskLevel: "high" },
  { key: "schaetzung-not-correct-final", category: "late_filing", temporal: "current_2026", type: "exception", text: "Ein Schätzungsbescheid beweist nicht, dass die geschätzten Zahlen die zutreffende Steuer sind.", sourceKey: "ao-162", passageKey: "ao-162-1", riskLevel: "high" },
  { key: "schaetzung-not-criminal", category: "late_filing", temporal: "current_2026", type: "exception", text: "Eine Schätzung ist nicht automatisch ein Vorwurf einer Steuerstraftat. Dieses Paket führt kein Steuerstrafverfahren.", sourceKey: "ao-162", passageKey: "ao-162-1", riskLevel: "medium" },
  { key: "late-not-wait-for-fa", category: "late_filing", temporal: "current_2026", type: "exception", text: "Verspätung bedeutet nicht, dass die Person auf das Finanzamt warten soll, bevor sie die Erklärung nachholt.", sourceKey: "ao-149", passageKey: "ao-149-all", riskLevel: "high" },
  { key: "collect-person-data", category: "preparation", temporal: "current_2026", type: "procedure", text: "Vor der Erklärung sind die Identifikationsnummer, eine vorhandene Steuernummer, Anschrift, Familienstand und eine Bankverbindung für eine mögliche Erstattung zusammenzustellen.", sourceKey: "ao-150", passageKey: "ao-150-1", riskLevel: "low" },
  { key: "collect-income-categories", category: "preparation", temporal: "current_2026", type: "procedure", text: "Vor der Erklärung sind die tatsächlich bezogenen Einkunftsarten, Lohnsteuerdaten, Vorauszahlungen, Ersatzleistungen und ausländische Einkünfte zu erfassen, soweit sie den Fall betreffen.", sourceKey: "estg-2", passageKey: "estg-2-all", riskLevel: "medium" },
  { key: "not-everything-spent-deductible", category: "deduction", temporal: "current_2026", type: "exception", text: "Nicht jeder ausgegebene Betrag ist steuerlich abziehbar. Werbungskosten, Sonderausgaben und außergewöhnliche Belastungen haben jeweils eigene gesetzliche Voraussetzungen.", sourceKey: "estg-9", passageKey: "estg-9-1", riskLevel: "high" },
  { key: "werbungskosten-need-nexus", category: "deduction", temporal: "current_2026", type: "duty", text: "Werbungskosten setzen Aufwendungen zur Erwerbung, Sicherung und Erhaltung der Einnahmen voraus. Ohne beruflichen Veranlassungszusammenhang besteht kein Abzug bei der Einkommensteuer.", sourceKey: "estg-9", passageKey: "estg-9-1", riskLevel: "high" },
  { key: "pauschbetraege-not-timeless", category: "deduction", temporal: "current_2026", type: "exception", text: "Arbeitnehmer-Pauschbetrag, Entfernungspauschale und vergleichbare Jahreswerte dürfen nicht als zeitlose Beträge gespeichert oder genannt werden. Sie sind für das betroffene Steuerjahr zu prüfen.", sourceKey: "estg-9a", passageKey: "estg-9a-all", riskLevel: "high", requiredContextKeys: ["EVENT_DATE"] },
  { key: "sonderausgaben-orientation", category: "deduction", temporal: "current_2026", type: "procedure", text: "Sonderausgaben können Vorsorgeaufwendungen, Kirchensteuer, Spenden und Kinderbetreuungskosten umfassen, jeweils nur nach den gesetzlichen Tatbeständen.", sourceKey: "estg-10", passageKey: "estg-10-1", riskLevel: "medium" },
  { key: "section-35a-orientation", category: "deduction", temporal: "current_2026", type: "procedure", text: "Haushaltsnahe Dienstleistungen und Handwerkerleistungen können unter den Voraussetzungen des § 35a EStG zu einer Steuerermäßigung führen. Die Höchstbeträge sind jahresbezogen.", sourceKey: "estg-35a", passageKey: "estg-35a-all", riskLevel: "medium", requiredContextKeys: ["EVENT_DATE"] },
  { key: "individual-deduction-fail-closed", category: "deduction", temporal: "current_2026", type: "exception", text: "Ein individueller Abzugsbetrag darf ohne Belege, Veranlassung, Steuerjahr und gesetzliche Höchstgrenzen nicht berechnet werden.", sourceKey: "estg-9", passageKey: "estg-9-1", riskLevel: "high", requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "individual-tax-fail-closed", category: "bescheid", temporal: "current_2026", type: "exception", text: "Ein individueller Einkommensteuerbetrag darf ohne vollständige Einkünfte, Abzüge, Tarifjahr und Festsetzung nicht berechnet oder als Ergebnis genannt werden.", sourceKey: "estg-32a", passageKey: "estg-32a-structure", riskLevel: "high", requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "individual-refund-fail-closed", category: "refund_payment", temporal: "current_2026", type: "exception", text: "Eine individuelle Erstattung darf ohne Steuerbescheid oder vollständige Veranlagungstatsachen nicht als Betrag zugesagt werden.", sourceKey: "estg-36", passageKey: "estg-36-all", riskLevel: "high", requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "section-25-4-electronic", category: "elster", temporal: "current_2026", type: "duty", text: "Die elektronische Übermittlung ist gesetzlich vorgeschrieben, wenn Einkünfte der Nummern 1 bis 3 des § 2 Absatz 1 Satz 1 erzielt werden und kein Fall des § 46 Absatz 2 Nummer 2 bis 8 vorliegt.", sourceKey: "estg-25", passageKey: "estg-25-all", riskLevel: "high" },
  { key: "hardship-exemption-possible", category: "elster", temporal: "current_2026", type: "procedure", text: "Auf Antrag kann die Finanzbehörde zur Vermeidung unbilliger Härten auf die elektronische Übermittlung verzichten. Der Antrag bewilligt die Papierabgabe nicht automatisch.", sourceKey: "estg-25", passageKey: "estg-25-all", riskLevel: "medium" },
  { key: "employee-not-always-must-elster", category: "elster", temporal: "current_2026", type: "exception", text: "Arbeitnehmerstatus bedeutet nicht, dass die elektronische Übermittlung in jedem Fall gesetzlich vorgeschrieben ist.", sourceKey: "estg-25", passageKey: "estg-25-all", riskLevel: "medium" },
  { key: "elster-exists-not-everyone-must", category: "elster", temporal: "current_2026", type: "exception", text: "Die Existenz von Mein ELSTER macht nicht jede natürliche Person gesetzlich zur elektronischen Abgabe verpflichtet.", sourceKey: "estg-25", passageKey: "estg-25-all", riskLevel: "medium" },
  { key: "no-computer-not-automatic-exemption", category: "elster", temporal: "current_2026", type: "exception", text: "Fehlender eigener Computer begründet nicht automatisch eine dauerhafte Härtebefreiung von der elektronischen Übermittlung.", sourceKey: "estg-25", passageKey: "estg-25-all", riskLevel: "high" },
  { key: "self-employed-not-paper-optional", category: "elster", temporal: "current_2026", type: "exception", text: "Selbständige dürfen die Papierabgabe nicht als frei wählbare Alternative behandeln, wenn § 25 Absatz 4 die Datenfernübertragung vorschreibt und keine Härtebefreiung vorliegt.", sourceKey: "estg-25", passageKey: "estg-25-all", riskLevel: "high" },
  { key: "elster-submit-route", category: "elster", temporal: "current_2026", type: "procedure", text: "Der verfahrensmäßige Weg ist: Zugang zu Mein ELSTER schaffen, das richtige Jahr und Formular wählen, Daten prüfen und authentifiziert übermitteln. Die Übermittlungsbestätigung ist aufzubewahren.", sourceKey: "elster-privatpersonen", passageKey: "elster-portal-all", riskLevel: "medium" },
  { key: "processing-time-no-promise", category: "elster", temporal: "current_2026", type: "exception", text: "Eine Bearbeitungsdauer der Finanzämter darf nicht zugesagt werden. Sie ist live und fallabhängig.", sourceKey: "elster-forms", passageKey: "elster-forms-all", riskLevel: "medium" },
  { key: "belegvorhalte-not-send-all", category: "evidence", temporal: "current_2026", type: "procedure", text: "Zur Einkommensteuererklärung brauchen grundsätzlich keine Belege mitgesandt zu werden. Sie sind aufzubewahren und auf Hinweis im Formular oder auf Anforderung des Finanzamts einzureichen.", sourceKey: "elster-belege", passageKey: "elster-belege-vorhalt", riskLevel: "medium" },
  { key: "meine-belege-not-automatic-submit", category: "evidence", temporal: "current_2026", type: "exception", text: "Das Ablegen von Dateien außerhalb des Formulars Belegnachreichung ist nicht dieselbe Übermittlung an das Finanzamt wie die Belegnachreichung. Angefordert sollen Belege über dieses Formular übermittelt werden.", sourceKey: "elster-belege", passageKey: "elster-belege-vorhalt", riskLevel: "high" },
  { key: "no-receipt-not-automatically-unsupported", category: "evidence", temporal: "current_2026", type: "exception", text: "Dass zunächst kein Beleg mit der Erklärung übermittelt wurde, macht einen Aufwand nicht automatisch unbelegt. Die Vorhaltepflicht bleibt; das Finanzamt kann später anfordern.", sourceKey: "elster-belege", passageKey: "elster-belege-vorhalt", riskLevel: "medium" },
  { key: "edata-not-always-correct", category: "evidence", temporal: "current_2026", type: "exception", text: "Elektronisch vorliegende eDaten sind nicht automatisch vollständig, richtig und unabänderlich. Abweichungen zur eigenen Unterlage sind aufzuklären.", sourceKey: "ao-90", passageKey: "ao-90-1", riskLevel: "high" },
  { key: "retain-evidence", category: "evidence", temporal: "current_2026", type: "duty", text: "Belege und sonstige Beweismittel zu erklärten Tatsachen sind aufzubewahren, damit sie auf Anforderung vorgelegt werden können.", sourceKey: "ao-90", passageKey: "ao-90-1", riskLevel: "medium" },
  { key: "nachforderung-not-audit", category: "evidence", temporal: "current_2026", type: "exception", text: "Eine Nachforderung von Belegen ist nicht automatisch eine Außenprüfung.", sourceKey: "ao-90", passageKey: "ao-90-1", riskLevel: "medium" },
  { key: "nachforderung-not-fraud", category: "evidence", temporal: "current_2026", type: "exception", text: "Eine Beleganforderung des Finanzamts ist kein Vorwurf einer Steuerhinterziehung.", sourceKey: "ao-90", passageKey: "ao-90-1", riskLevel: "medium" },
  { key: "missing-receipt-not-criminal", category: "evidence", temporal: "current_2026", type: "exception", text: "Ein fehlender Beleg ist nicht automatisch eine Strafsache. Fehlende Nachweise können jedoch den Abzug gefährden.", sourceKey: "ao-90", passageKey: "ao-90-1", riskLevel: "high" },
  { key: "do-not-fabricate", category: "evidence", temporal: "current_2026", type: "duty", text: "Beweismittel dürfen nicht erfunden werden. Mitwirkung verlangt vollständige und wahrheitsgemäße Offenlegung der erheblichen Tatsachen.", sourceKey: "ao-90", passageKey: "ao-90-1", riskLevel: "high" },
  { key: "marriage-not-automatic-joint", category: "spouse", temporal: "current_2026", type: "exception", text: "Die Ehe oder Lebenspartnerschaft führt nicht automatisch immer zur Zusammenveranlagung. Es müssen die Voraussetzungen des § 26 Absatz 1 vorliegen, und es kann Einzelveranlagung gewählt werden.", sourceKey: "estg-26", passageKey: "estg-26-all", riskLevel: "high" },
  { key: "same-address-not-enough", category: "spouse", temporal: "current_2026", type: "exception", text: "Dieselbe Anschrift genügt nicht für jede steuerliche Ehegattenfolge. Dauerndes Getrenntleben und unbeschränkte Steuerpflicht sind gesondert zu prüfen.", sourceKey: "estg-26", passageKey: "estg-26-all", riskLevel: "high" },
  { key: "joint-not-always-better", category: "spouse", temporal: "current_2026", type: "exception", text: "Die Zusammenveranlagung ist nicht automatisch finanziell günstiger. Ohne Einkünfte beider Personen darf keine Wahl empfohlen werden.", sourceKey: "estg-26b", passageKey: "estg-26b-all", riskLevel: "high" },
  { key: "do-not-recommend-filing-choice", category: "spouse", temporal: "current_2026", type: "exception", text: "Die Wahl zwischen Einzel- und Zusammenveranlagung darf ohne Einkünfte, Familienstand und Getrenntleben nicht empfohlen werden.", sourceKey: "estg-26", passageKey: "estg-26-all", riskLevel: "high", requiredContextKeys: ["PROCESS_VARIANT", "EVENT_DATE"] },
  { key: "inspect-bescheid-structure", category: "bescheid", temporal: "current_2026", type: "procedure", text: "Am Einkommensteuerbescheid sind Steuerjahr, festgesetzte Einkommensteuer, angerechnete Lohnsteuer und Vorauszahlungen, Erstattung oder Abschlusszahlung sowie die Rechtsbehelfsbelehrung zu lesen.", sourceKey: "estg-36", passageKey: "estg-36-all", riskLevel: "medium" },
  { key: "deviation-not-automatically-error", category: "bescheid", temporal: "current_2026", type: "exception", text: "Eine Abweichung zwischen Erklärung und Bescheid ist nicht automatisch ein Fehler des Finanzamts. Sie kann auf abweichender rechtlicher Würdigung oder anderen Daten beruhen.", sourceKey: "estg-36", passageKey: "estg-36-all", riskLevel: "high" },
  { key: "refund-after-bekanntgabe", category: "refund_payment", temporal: "current_2026", type: "procedure", text: "Ergibt die Abrechnung einen Überschuss zugunsten der steuerpflichtigen Person, wird er nach Bekanntgabe des Steuerbescheids ausgezahlt.", sourceKey: "estg-36", passageKey: "estg-36-all", riskLevel: "medium" },
  { key: "submitted-not-guaranteed-refund", category: "refund_payment", temporal: "current_2026", type: "exception", text: "Die Abgabe der Steuererklärung garantiert keine Erstattung.", sourceKey: "estg-36", passageKey: "estg-36-all", riskLevel: "high" },
  { key: "elster-calc-not-binding", category: "bescheid", temporal: "current_2026", type: "exception", text: "Eine in ELSTER angezeigte Berechnung ist nicht der bindende Steuerbescheid des Finanzamts.", sourceKey: "elster-privatpersonen", passageKey: "elster-portal-all", riskLevel: "high" },
  { key: "abschlusszahlung-one-month", category: "refund_payment", temporal: "current_2026", type: "deadline", text: "Ein Abrechnungssaldo zuungunsten der steuerpflichtigen Person ist, soweit er nicht bereits fälligen Vorauszahlungen entspricht, innerhalb eines Monats nach Bekanntgabe des Steuerbescheids zu entrichten.", sourceKey: "estg-36", passageKey: "estg-36-all", riskLevel: "high" },
  { key: "bescheiddatum-not-payment-deadline", category: "refund_payment", temporal: "current_2026", type: "exception", text: "Das auf dem Bescheid gedruckte Datum ist nicht automatisch der Zahlungstermin. Die Abschlusszahlung knüpft an die Bekanntgabe.", sourceKey: "estg-36", passageKey: "estg-36-all", riskLevel: "high" },
  { key: "withheld-tax-not-final", category: "refund_payment", temporal: "current_2026", type: "exception", text: "Einbehaltene Lohnsteuer ist nicht die endgültige Steuerschuld. Sie wird auf die festgesetzte Einkommensteuer angerechnet.", sourceKey: "estg-36", passageKey: "estg-36-all", riskLevel: "high" },
  { key: "large-withholding-not-guaranteed-refund", category: "refund_payment", temporal: "current_2026", type: "exception", text: "Hohe monatliche Lohnsteuer bedeutet keine garantierte Jahreserstattung der Einkommensteuer.", sourceKey: "estg-36", passageKey: "estg-36-all", riskLevel: "high" },
  { key: "refund-not-free-money", category: "refund_payment", temporal: "current_2026", type: "exception", text: "Eine Erstattung ist kein Geschenk des Finanzamts, sondern der nach Abrechnung verbleibende Überschuss zugunsten der steuerpflichtigen Person.", sourceKey: "estg-36", passageKey: "estg-36-all", riskLevel: "medium" },
  { key: "vorauszahlung-quarterly-dates", category: "advance", temporal: "current_2026", type: "deadline", text: "Gesetzliche Vorauszahlungstermine der Einkommensteuer sind der 10. März, 10. Juni, 10. September und 10. Dezember. Maßgeblich bleibt der konkrete Vorauszahlungsbescheid.", sourceKey: "estg-37", passageKey: "estg-37-all", riskLevel: "medium" },
  { key: "vorauszahlung-credited", category: "advance", temporal: "current_2026", type: "definition", text: "Entrichtete Einkommensteuer-Vorauszahlungen werden auf die Jahressteuer angerechnet. Sie sind keine zusätzliche dauerhafte Doppelbesteuerung neben der festgesetzten Jahressteuer.", sourceKey: "estg-36", passageKey: "estg-36-all", riskLevel: "medium" },
  { key: "one-nachzahlung-not-same-future", category: "advance", temporal: "current_2026", type: "exception", text: "Eine Abschlusszahlung eines Jahres bedeutet nicht automatisch dieselbe künftige Jahressteuer und nicht unveränderliche Vorauszahlungen.", sourceKey: "estg-37", passageKey: "estg-37-all", riskLevel: "medium" },
  { key: "adjust-vorauszahlung", category: "advance", temporal: "current_2026", type: "procedure", text: "Das Finanzamt kann Vorauszahlungen an die voraussichtliche Steuer anpassen. Bei wesentlich geänderten Verhältnissen kann eine Anpassung beantragt werden; die Bewilligung ist nicht automatisch.", sourceKey: "estg-37", passageKey: "estg-37-all", riskLevel: "medium" },
  { key: "wrong-bank-needs-action", category: "refund_payment", temporal: "current_2026", type: "procedure", text: "Eine falsche oder geänderte Bankverbindung kann eine gesonderte Mitteilung an das Finanzamt erfordern. Die Erklärung allein heilt das nicht immer.", sourceKey: "ao-90", passageKey: "ao-90-1", riskLevel: "medium" },
  { key: "nachzahlung-not-punishment", category: "refund_payment", temporal: "current_2026", type: "exception", text: "Eine Abschlusszahlung ist keine Strafe. Sie gleicht den Unterschied zwischen festgesetzter Steuer und bereits angerechneten Beträgen aus.", sourceKey: "estg-36", passageKey: "estg-36-all", riskLevel: "medium" },
  { key: "filed-once-not-forever", category: "orientation", temporal: "current_2026", type: "exception", text: "Wer einmal eine Erklärung abgegeben hat, muss nicht automatisch für jedes Folgejahr eine Erklärung abgeben. Die Pflicht ist jahresbezogen neu zu prüfen.", sourceKey: "estdv-56", passageKey: "estdv-56-all", riskLevel: "medium" },
  { key: "refund-once-not-same-next-year", category: "orientation", temporal: "current_2026", type: "exception", text: "Eine Einkommensteuererstattung in einem Jahr bedeutet nicht dasselbe Ergebnis im Folgejahr.", sourceKey: "estg-36", passageKey: "estg-36-all", riskLevel: "low" },
  { key: "document-date-not-bekanntgabe", category: "einspruch", temporal: "current_2026", type: "exception", text: "Das auf dem Bescheid gedruckte Datum ist nicht automatisch der Tag der Bekanntgabe und nicht automatisch der Beginn der Einspruchsfrist.", sourceKey: "ao-122", passageKey: "ao-122-2", riskLevel: "high" },
  { key: "postal-fourth-day", category: "einspruch", temporal: "current_2026", type: "definition", text: "Ein schriftlicher Verwaltungsakt gilt bei inländischer Postübermittlung am vierten Tag nach der Aufgabe zur Post als bekannt gegeben, außer wenn er nicht oder später zugegangen ist.", sourceKey: "ao-122", passageKey: "ao-122-2", riskLevel: "medium" },
  { key: "electronic-fourth-day", category: "einspruch", temporal: "current_2026", type: "definition", text: "Ein elektronisch übermittelter Verwaltungsakt gilt am vierten Tag nach der Absendung als bekannt gegeben, außer wenn er nicht oder später zugegangen ist.", sourceKey: "ao-122", passageKey: "ao-122-2", riskLevel: "medium" },
  { key: "non-receipt-exception", category: "einspruch", temporal: "current_2026", type: "exception", text: "Ist der Bescheid nicht oder später zugegangen, gilt die gesetzliche Zugangsvermutung nicht ohne weiteres. Im Zweifel hat die Behörde Zugang und Zeitpunkt nachzuweisen.", sourceKey: "ao-122", passageKey: "ao-122-2", riskLevel: "high" },
  { key: "individual-einspruch-deadline-needs-facts", category: "einspruch", temporal: "current_2026", type: "exception", text: "Eine individuelle Einspruchsfrist darf ohne Bekanntgabewege, Aufgabe- oder Absendedatum und etwaigen späteren Zugang nicht berechnet werden.", sourceKey: "ao-355", passageKey: "ao-355-1", riskLevel: "high", requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "einspruch-one-month", category: "einspruch", temporal: "current_2026", type: "deadline", text: "Der Einspruch ist innerhalb eines Monats nach Bekanntgabe des Verwaltungsakts schriftlich, elektronisch oder zur Niederschrift einzulegen.", sourceKey: "ao-355", passageKey: "ao-355-1", riskLevel: "high" },
  { key: "disagreement-not-auto-recommend", category: "einspruch", temporal: "current_2026", type: "exception", text: "Uneinigkeit mit dem Bescheid ist keine automatische Empfehlung, Einspruch einzulegen. Zuerst sind Bescheid, Begründung und Rechtsbehelfsbelehrung zu lesen.", sourceKey: "ao-347", passageKey: "ao-347-1", riskLevel: "high" },
  { key: "einspruch-not-automatic-suspend", category: "einspruch", temporal: "current_2026", type: "exception", text: "Die Einlegung des Einspruchs hemmt die Vollziehung nicht und hält die Steuererhebung nicht automatisch auf.", sourceKey: "ao-361", passageKey: "ao-361-1-2", riskLevel: "high" },
  { key: "adv-is-separate", category: "einspruch", temporal: "current_2026", type: "procedure", text: "Eine Aussetzung der Vollziehung ist ein gesonderter Antrag mit eigenen Voraussetzungen, insbesondere ernstlichen Zweifeln an der Rechtmäßigkeit oder unbilliger Härte.", sourceKey: "ao-361", passageKey: "ao-361-1-2", riskLevel: "high" },
  { key: "do-not-auto-recommend-adv", category: "einspruch", temporal: "current_2026", type: "exception", text: "Ein Einspruch führt nicht automatisch zur Empfehlung, Aussetzung der Vollziehung zu beantragen.", sourceKey: "ao-361", passageKey: "ao-361-1-2", riskLevel: "high" },
  { key: "correction-not-always-new-return", category: "bescheid", temporal: "current_2026", type: "exception", text: "Nicht jede Korrektur nach Abgabe wird durch eine vollständig neue Steuererklärung bewirkt. Änderungsbescheid, Berichtigung und die Änderungsvorschriften der AO sind zu unterscheiden und nötigenfalls weiterzuleiten.", sourceKey: "estg-25", passageKey: "estg-25-all", riskLevel: "high" },
  { key: "wohnsitzfinanzamt", category: "competence", temporal: "current_2026", type: "definition", text: "Für die Einkommensteuer natürlicher Personen ist grundsätzlich das Wohnsitzfinanzamt zuständig, sonst das Finanzamt des gewöhnlichen Aufenthalts.", sourceKey: "ao-19", passageKey: "ao-19-1", riskLevel: "medium" },
  { key: "locale-not-finanzamt", category: "competence", temporal: "current_2026", type: "exception", text: "userLocale bestimmt nicht das zuständige Finanzamt.", sourceKey: "ao-19", passageKey: "ao-19-1", riskLevel: "high" },
  { key: "nationality-not-finanzamt", category: "competence", temporal: "current_2026", type: "exception", text: "Staatsangehörigkeit bestimmt nicht das zuständige Finanzamt.", sourceKey: "ao-19", passageKey: "ao-19-1", riskLevel: "high" },
  { key: "employer-alone-not-finanzamt", category: "competence", temporal: "current_2026", type: "exception", text: "Der Arbeitgeberort allein bestimmt nicht das Wohnsitzfinanzamt der natürlichen Person.", sourceKey: "ao-19", passageKey: "ao-19-1", riskLevel: "high" },
  { key: "land-alone-not-finanzamt", category: "competence", temporal: "current_2026", type: "exception", text: "Ein Bundesland allein genügt nicht, um ein bestimmtes Finanzamt zu benennen.", sourceKey: "ao-19", passageKey: "ao-19-1", riskLevel: "high" },
  { key: "live-lookup-finanzamt", category: "competence", temporal: "current_2026", type: "procedure", text: "Das örtlich zuständige Finanzamt ist über die amtliche Finanzamtsuche live zu ermitteln.", sourceKey: "bzst-finanzamt", passageKey: "bzst-fa-search", riskLevel: "medium" },
]);

export const EST_PROCESSES: readonly EstProcessSpec[] = Object.freeze([
  { key: "est-einordnen", title: "Einkommensteuer einordnen 2026", trigger: "Gefragt ist, was Einkommensteuer oder eine Steuererklärung ist", safeFirstStep: "Jahressteuer, Veranlagungszeitraum und den Unterschied von Erklärung und Bescheid erklären; Lohnsteuer und Steuerklasse nicht als Jahresergebnis behandeln.", riskLevel: "medium" },
  { key: "steuerpflicht-gate", title: "Steuerpflicht und Ansässigkeit prüfen 2026", trigger: "Wohnsitz, Ausland, beschränkte Steuerpflicht oder Anmeldung werden mit Steuerpflicht vermengt", safeFirstStep: "Wohnsitz und gewöhnlichen Aufenthalt nach AO prüfen; Anmeldung, Staatsangehörigkeit und userLocale nicht als Steueransässigkeit behandeln.", riskLevel: "high" },
  { key: "pflicht-oder-antrag", title: "Pflicht- oder Antragsveranlagung bestimmen 2026", trigger: "Gefragt ist, ob eine Steuererklärung abgegeben werden muss", safeFirstStep: "§ 56 EStDV, § 46 EStG und eine etwaige Finanzamtsaufforderung prüfen; ohne ausreichende Tatsachen fail-closed bleiben.", riskLevel: "high" },
  { key: "steuerjahr-frist", title: "Steuerjahr und Abgabefrist bestimmen 2026", trigger: "Eine Abgabefrist, das Steuerjahr oder eine Fristverlängerung ist gefragt", safeFirstStep: "Steuerjahr, Pflicht oder Antrag, Beratungsstatus und Vorabanforderung feststellen; den 31. Juli nicht als zeitlose Frist nennen.", riskLevel: "high" },
  { key: "erklaerung-vorbereiten", title: "Steuererklärung vorbereiten 2026", trigger: "Unterlagen oder Daten für die Erklärung sollen gesammelt werden", safeFirstStep: "Person, Einkünfte, Abzugsbereiche und Steuerdaten erfassen; nicht jeden Aufwand als abziehbar behandeln.", riskLevel: "medium" },
  { key: "einkunftsarten", title: "Einkunftsarten einordnen 2026", trigger: "Art der Einkünfte, Selbständigkeit, Miete oder ein Kontoeingang ist unklar", safeFirstStep: "Die sieben Einkunftsarten zur Orientierung nutzen; Umsatz nicht mit Gewinn und Überweisung nicht mit Einnahme gleichsetzen.", riskLevel: "high" },
  { key: "abzugsbereiche", title: "Abzugsfähige Bereiche einordnen 2026", trigger: "Werbungskosten, Sonderausgaben oder Haushaltsleistungen sind angesprochen", safeFirstStep: "Veranlassungszusammenhang und gesetzliche Kategorie erklären; keinen individuellen Abzugsbetrag erfinden.", riskLevel: "high" },
  { key: "elster-uebermittlung", title: "ELSTER und Übermittlung 2026", trigger: "Die Erklärung soll übermittelt werden oder ein ELSTER-Konto fehlt", safeFirstStep: "Elektronische Pflicht nach § 25 Absatz 4 prüfen, Mein ELSTER als Verfahren erklären und Oberfläche nicht als Gesetz behandeln.", riskLevel: "high" },
  { key: "belege-edaten", title: "Belege und eDaten behandeln 2026", trigger: "Belege, Meine Belege oder elektronische Lohnsteuerdaten sind angesprochen", safeFirstStep: "Belegvorhaltepflicht erklären; Upload in eine Ablage nicht als Übermittlung und eDaten nicht als unumstößlich behandeln.", riskLevel: "high" },
  { key: "unterlagen-nachreichen", title: "Fehlende Unterlagen nachreichen 2026", trigger: "Das Finanzamt fordert Belege oder Angaben nach", safeFirstStep: "Die gesetzte Frist und die angeforderten Unterlagen identifizieren; Nachforderung nicht als Steuerfahndung behandeln.", riskLevel: "high" },
  { key: "verspaetete-erklaerung", title: "Verspätete Erklärung behandeln 2026", trigger: "Die Abgabefrist ist versäumt oder ein Verspätungszuschlag droht", safeFirstStep: "Die Erklärung nachholen, Verlängerung und Zuschlag trennen und keinen individuellen Verspätungszuschlag erfinden.", riskLevel: "high" },
  { key: "schaetzung-behandeln", title: "Schätzung behandeln 2026", trigger: "Ein Schätzungsbescheid oder fehlende Abgabe ist angesprochen", safeFirstStep: "Schätzung als Hilfsfestsetzung erklären; sie beendet die Erklärungspflicht nicht und beweist nicht die richtige Steuer.", riskLevel: "high" },
  { key: "bescheid-pruefen", title: "Steuerbescheid prüfen 2026", trigger: "Ein Einkommensteuerbescheid ist eingegangen", safeFirstStep: "Steuerjahr, Festsetzung, Anrechnungen, Saldo und Rechtsbehelfsbelehrung lesen; Abweichung nicht automatisch als Fehler behandeln.", riskLevel: "high" },
  { key: "erstattung-behandeln", title: "Erstattung behandeln 2026", trigger: "Eine Steuererstattung wird erwartet oder bleibt aus", safeFirstStep: "Erstattung nur nach Bekanntgabe eines Überschusses erklären; Abgabe oder ELSTER-Rechnung nicht als Garantie behandeln.", riskLevel: "medium" },
  { key: "nachzahlung-behandeln", title: "Nachzahlung behandeln 2026", trigger: "Eine Abschlusszahlung oder Nachzahlung ist festgesetzt", safeFirstStep: "Die Einmonatsfrist nach Bekanntgabe erklären; Bescheiddatum nicht als Fälligkeit und Nachzahlung nicht als Strafe behandeln.", riskLevel: "high" },
  { key: "vorauszahlungen", title: "Vorauszahlungen behandeln 2026", trigger: "Ein Vorauszahlungsbescheid oder Quartalstermine sind angesprochen", safeFirstStep: "Gesetzliche Quartalstermine und Anrechnung erklären; eine Nachzahlung nicht als unveränderliche Zukunftsteuer behandeln.", riskLevel: "medium" },
  { key: "einspruch-einordnen", title: "Einspruch einordnen 2026", trigger: "Uneinigkeit mit dem Einkommensteuerbescheid ist angesprochen", safeFirstStep: "Bekanntgabe und Monatsfrist prüfen; Dokumentdatum nicht als Fristbeginn und Uneinigkeit nicht als automatische Empfehlung behandeln.", riskLevel: "high" },
  { key: "adv-einordnen", title: "Aussetzung der Vollziehung einordnen 2026", trigger: "Einspruch ist eingelegt und Zahlung bleibt offen", safeFirstStep: "Einspruch und Aussetzung trennen; Zahlung nicht als automatisch gehemmt darstellen und AdV nicht automatisch empfehlen.", riskLevel: "high" },
  { key: "aenderung-korrektur", title: "Änderung oder Korrektur behandeln 2026", trigger: "Ein Fehler nach Abgabe oder ein Änderungsbescheid ist angesprochen", safeFirstStep: "Nicht jede Korrektur als neue Vollständigerklärung behandeln; Änderungsbescheid und AO-Änderungswege unterscheiden.", riskLevel: "high" },
  { key: "ausland-gate", title: "Auslandseinkünfte und Grenzfälle 2026", trigger: "Ausländische Einkünfte, Wohnsitz im Ausland oder ein Abkommen sind angesprochen", safeFirstStep: "Steuerpflichtstatus und Erklärungspflicht klären; Abkommensergebnis ohne Staaten, Ansässigkeit und Einkunftsart nicht entscheiden.", riskLevel: "high" },
  { key: "finanzamt-bestimmen", title: "Zuständiges Finanzamt bestimmen 2026", trigger: "Das zuständige Finanzamt oder eine lokale Stelle soll benannt werden", safeFirstStep: "Wohnsitzfinanzamt erklären und die amtliche Suche nutzen; Sprache, Staatsangehörigkeit oder Arbeitgeberort allein nicht als Zuständigkeit behandeln.", riskLevel: "high" },
  { key: "folgejahr-pflichten", title: "Folgejahr und weitere Pflichten 2026", trigger: "Gefragt ist, ob nächstes Jahr wieder erklärt werden muss oder Vorauszahlungen bleiben", safeFirstStep: "Jahresbezogene Neuprüfung erklären; eine einmalige Abgabe oder Erstattung nicht als Dauerzustand behandeln.", riskLevel: "medium" },
]);

export const EST_FORMS: readonly EstFormSpec[] = Object.freeze([
  { key: "est-erklaerung", name: "Einkommensteuererklärung", identifier: "ESt-Erklaerung", purpose: "Abgabe der jährlichen Einkommensteuererklärung oder Antrag auf Veranlagung", submissionChannels: ["online", "written"], sourceKey: "estg-25", passageKey: "estg-25-all" },
  { key: "elster-uebermittlung", name: "Authentifizierte ELSTER-Übermittlung", identifier: "ELSTER-Uebermittlung", purpose: "Elektronische Übermittlung der Einkommensteuererklärung über Mein ELSTER", submissionChannels: ["online"], sourceKey: "elster-privatpersonen", passageKey: "elster-portal-all" },
  { key: "belegnachreichung", name: "Belegnachreichung", identifier: "ELSTER-Belegnachreichung", purpose: "Digitale Nachreichung angeforderter Belege an das Finanzamt", submissionChannels: ["online"], sourceKey: "elster-belege", passageKey: "elster-belege-vorhalt" },
  { key: "fristverlaengerung", name: "Antrag auf Fristverlängerung", identifier: "AO-Fristverlaengerung", purpose: "Antrag auf Verlängerung der Erklärungsfrist nach § 109 AO", submissionChannels: ["online", "written"], sourceKey: "ao-109", passageKey: "ao-109-all" },
  { key: "einspruch", name: "Einspruch gegen einen Steuerbescheid", identifier: "AO-Einspruch", purpose: "Einlegung des Einspruchs gegen den Einkommensteuerbescheid", submissionChannels: ["online", "written", "niederschrift"], sourceKey: "ao-357", passageKey: "ao-357-all" },
  { key: "adv", name: "Antrag auf Aussetzung der Vollziehung", identifier: "AO-AdV", purpose: "Gesonderter Antrag auf Aussetzung der Vollziehung", submissionChannels: ["online", "written"], sourceKey: "ao-361", passageKey: "ao-361-1-2" },
  { key: "vz-anpassung", name: "Antrag auf Anpassung der Vorauszahlungen", identifier: "ESt-Vorauszahlungsanpassung", purpose: "Antrag auf Herabsetzung oder Anpassung festgesetzter Vorauszahlungen", submissionChannels: ["online", "written"], sourceKey: "estg-37", passageKey: "estg-37-all" },
]);

export const EST_PROCESS_BINDINGS: readonly EstBindingSpec[] = Object.freeze([
  { processKey: "est-einordnen", role: "orientation_basis", sequenceContext: "what", claimKeys: ["est-is-jahressteuer", "current-year-not-final", "steuererklaerung-not-bescheid"] },
  { processKey: "est-einordnen", role: "negative_control", sequenceContext: "not", claimKeys: ["lohnsteuer-not-einkommensteuer", "steuerklasse-not-final-tax", "steuerklasse-iii-not-lower-final", "steuerklasse-v-not-punishment", "elster-not-tax-law"] },
  { processKey: "steuerpflicht-gate", role: "orientation_basis", sequenceContext: "status", claimKeys: ["unlimited-if-wohnsitz-or-aufenthalt", "wohnsitz-definition", "gewoehnlicher-aufenthalt-definition", "limited-if-domestic-income", "section-1-3-request-boundary"] },
  { processKey: "steuerpflicht-gate", role: "negative_control", sequenceContext: "status_not", qualificationRequired: true, claimKeys: ["anmeldung-not-tax-residence", "german-address-not-complete-residence", "living-abroad-not-automatic-no-est", "working-germany-not-automatic-unlimited", "nationality-not-tax-residence", "userlocale-not-jurisdiction", "dual-residence-fail-closed"] },
  { processKey: "pflicht-oder-antrag", role: "orientation_basis", sequenceContext: "pflicht", claimKeys: ["estdv-56-filing-duty", "aufforderung-creates-duty", "section-46-untaxed-or-progression-410", "section-46-multiple-employers-simultaneous", "section-46-steuerklasse-v-vi-or-factor", "section-46-freibetrag-threshold", "section-46-8-antrag-via-declaration"] },
  { processKey: "pflicht-oder-antrag", role: "negative_control", sequenceContext: "pflicht_not", qualificationRequired: true, claimKeys: ["employee-not-automatically-required", "employee-not-automatically-exempt", "aufforderung-not-optional", "refund-expected-not-voluntary-proof", "payment-expected-not-mandatory-proof", "changing-employer-not-automatically-pflicht", "two-employers-not-always-simultaneous", "steuerklasse-iii-v-not-always-enough", "steuerklasse-iv-not-automatically-exempt", "benefit-not-automatic-unless-threshold", "antragsveranlagung-not-guaranteed-refund", "insufficient-facts-no-obligation-decision", "marriage-not-automatic-joint", "same-address-not-enough", "joint-not-always-better", "do-not-recommend-filing-choice"] },
  { processKey: "steuerjahr-frist", role: "deadline_gate", sequenceContext: "frist", qualificationRequired: true, claimKeys: ["ao-149-2-seven-months", "ao-149-3-advised-february", "egao-corona-only-2020-2024", "vz-2025-unadvised-31-july-2026", "vz-2025-advised-1-mar-2027", "vz-2025-voluntary-31-dec-2029", "antragsveranlagung-four-year-framework", "extension-109-possible"] },
  { processKey: "steuerjahr-frist", role: "negative_control", sequenceContext: "frist_not", qualificationRequired: true, claimKeys: ["deadline-not-timeless-31-july", "individual-deadline-needs-facts", "extension-not-automatic", "advised-109-2-limits", "missed-voluntary-no-assessment"] },
  { processKey: "erklaerung-vorbereiten", role: "required_information", sequenceContext: "docs", claimKeys: ["collect-person-data", "collect-income-categories"] },
  { processKey: "erklaerung-vorbereiten", role: "negative_control", sequenceContext: "docs_not", claimKeys: ["not-everything-spent-deductible", "steuer-id-pack-is-separate"] },
  { processKey: "einkunftsarten", role: "orientation_basis", sequenceContext: "arten", claimKeys: ["seven-categories-routing", "profit-vs-surplus", "self-employed-triggers-electronic"] },
  { processKey: "einkunftsarten", role: "negative_control", sequenceContext: "arten_not", claimKeys: ["umsatz-not-gewinn", "gewinn-not-automatically-zvE", "est-not-ust", "est-not-gewst", "bank-transfer-not-taxable-income", "reimbursement-not-automatically-taxable", "private-sale-not-always-taxable", "rental-payment-not-profit-amount", "not-every-self-employed-from-turnover", "classification-needs-context", "euer-boundary-route"] },
  { processKey: "abzugsbereiche", role: "orientation_basis", sequenceContext: "abzug", claimKeys: ["werbungskosten-need-nexus", "sonderausgaben-orientation", "section-35a-orientation"] },
  { processKey: "abzugsbereiche", role: "negative_control", sequenceContext: "abzug_not", qualificationRequired: true, claimKeys: ["not-everything-spent-deductible", "pauschbetraege-not-timeless", "individual-deduction-fail-closed", "individual-tax-fail-closed"] },
  { processKey: "elster-uebermittlung", role: "application_route", sequenceContext: "elster", claimKeys: ["elster-submit-route", "section-25-4-electronic", "hardship-exemption-possible", "self-employed-triggers-electronic"] },
  { processKey: "elster-uebermittlung", role: "negative_control", sequenceContext: "elster_not", claimKeys: ["elster-not-tax-law", "employee-not-always-must-elster", "elster-exists-not-everyone-must", "no-computer-not-automatic-exemption", "self-employed-not-paper-optional", "processing-time-no-promise"] },
  { processKey: "belege-edaten", role: "evidence_requirement", sequenceContext: "belege", claimKeys: ["belegvorhalte-not-send-all", "retain-evidence"] },
  { processKey: "belege-edaten", role: "negative_control", sequenceContext: "belege_not", claimKeys: ["meine-belege-not-automatic-submit", "no-receipt-not-automatically-unsupported", "edata-not-always-correct"] },
  { processKey: "unterlagen-nachreichen", role: "evidence_requirement", sequenceContext: "nach", claimKeys: ["retain-evidence", "do-not-fabricate"] },
  { processKey: "unterlagen-nachreichen", role: "negative_control", sequenceContext: "nach_not", claimKeys: ["nachforderung-not-audit", "nachforderung-not-fraud", "missing-receipt-not-criminal"] },
  { processKey: "verspaetete-erklaerung", role: "application_route", sequenceContext: "spaet", claimKeys: ["still-file-when-late", "extension-109-possible", "verspaetungszuschlag-can-be-set"] },
  { processKey: "verspaetete-erklaerung", role: "negative_control", sequenceContext: "spaet_not", claimKeys: ["late-not-wait-for-fa", "verspaetungszuschlag-not-always-max", "one-day-late-not-same", "verspaetungszuschlag-not-saeumnis", "zwangsgeld-not-verspaetung"] },
  { processKey: "schaetzung-behandeln", role: "orientation_basis", sequenceContext: "schatz", claimKeys: ["schaetzung-when-cannot-determine", "schaetzung-does-not-end-duty"] },
  { processKey: "schaetzung-behandeln", role: "negative_control", sequenceContext: "schatz_not", claimKeys: ["schaetzung-not-correct-final", "schaetzung-not-criminal"] },
  { processKey: "bescheid-pruefen", role: "decision", sequenceContext: "bescheid", claimKeys: ["inspect-bescheid-structure", "steuererklaerung-not-bescheid"] },
  { processKey: "bescheid-pruefen", role: "negative_control", sequenceContext: "bescheid_not", claimKeys: ["deviation-not-automatically-error", "elster-calc-not-binding"] },
  { processKey: "erstattung-behandeln", role: "payment", sequenceContext: "erstattung", claimKeys: ["refund-after-bekanntgabe"] },
  { processKey: "erstattung-behandeln", role: "negative_control", sequenceContext: "erstattung_not", claimKeys: ["submitted-not-guaranteed-refund", "elster-calc-not-binding", "individual-refund-fail-closed", "refund-not-free-money", "large-withholding-not-guaranteed-refund", "wrong-bank-needs-action"] },
  { processKey: "nachzahlung-behandeln", role: "payment", sequenceContext: "zahlung", claimKeys: ["abschlusszahlung-one-month", "withheld-tax-not-final"] },
  { processKey: "nachzahlung-behandeln", role: "negative_control", sequenceContext: "zahlung_not", claimKeys: ["bescheiddatum-not-payment-deadline", "nachzahlung-not-punishment", "einspruch-not-automatic-suspend"] },
  { processKey: "vorauszahlungen", role: "payment", sequenceContext: "vz", claimKeys: ["vorauszahlung-quarterly-dates", "vorauszahlung-credited", "adjust-vorauszahlung"] },
  { processKey: "vorauszahlungen", role: "negative_control", sequenceContext: "vz_not", claimKeys: ["one-nachzahlung-not-same-future"] },
  { processKey: "einspruch-einordnen", role: "legal_remedy_gate", sequenceContext: "einspruch", qualificationRequired: true, claimKeys: ["einspruch-one-month", "disagreement-not-auto-recommend"] },
  { processKey: "einspruch-einordnen", role: "deadline_gate", sequenceContext: "bekanntgabe", qualificationRequired: true, claimKeys: ["document-date-not-bekanntgabe", "postal-fourth-day", "electronic-fourth-day", "non-receipt-exception", "individual-einspruch-deadline-needs-facts"] },
  { processKey: "adv-einordnen", role: "legal_remedy_gate", sequenceContext: "adv", qualificationRequired: true, claimKeys: ["adv-is-separate", "einspruch-not-automatic-suspend", "do-not-auto-recommend-adv"] },
  { processKey: "aenderung-korrektur", role: "orientation_basis", sequenceContext: "aend", claimKeys: ["correction-not-always-new-return"] },
  { processKey: "ausland-gate", role: "orientation_basis", sequenceContext: "ausland", claimKeys: ["limited-if-domestic-income", "progression-replacement-income", "tax-free-not-irrelevant-to-rate", "progression-not-ordinary-taxable"] },
  { processKey: "ausland-gate", role: "context_gate", sequenceContext: "ausland_not", qualificationRequired: true, claimKeys: ["foreign-income-not-automatically-tax-free", "foreign-tax-paid-not-nothing-to-declare", "german-employer-not-exclusive-right", "eu-citizen-not-special-universal-tax", "treaty-result-fail-closed", "dual-residence-fail-closed", "alg-pack-is-separate", "health-pack-is-separate", "kindergeld-pack-is-separate"] },
  { processKey: "finanzamt-bestimmen", role: "orientation_basis", sequenceContext: "fa", claimKeys: ["wohnsitzfinanzamt", "live-lookup-finanzamt"] },
  { processKey: "finanzamt-bestimmen", role: "negative_control", sequenceContext: "fa_not", qualificationRequired: true, claimKeys: ["userlocale-not-jurisdiction", "locale-not-finanzamt", "nationality-not-finanzamt", "employer-alone-not-finanzamt", "land-alone-not-finanzamt", "anmeldung-not-steuererklaerung"] },
  { processKey: "folgejahr-pflichten", role: "next_state", sequenceContext: "folge", claimKeys: ["filed-once-not-forever", "adjust-vorauszahlung"] },
  { processKey: "folgejahr-pflichten", role: "negative_control", sequenceContext: "folge_not", claimKeys: ["refund-once-not-same-next-year", "one-nachzahlung-not-same-future"] },
]);

export const EST_PROCESS_SCENARIOS: readonly EstProcessScenario[] = Object.freeze([
  { id: "ordinary-employee-no-trigger", label: "Arbeitnehmer ohne offensichtlichen Pflichtanlass", coverage: "COVERED", requiredClaimKeys: ["employee-not-automatically-required", "employee-not-automatically-exempt"], requiredProcessKeys: ["pflicht-oder-antrag"] },
  { id: "employee-voluntary-refund", label: "Arbeitnehmer will freiwillig Erstattung", coverage: "COVERED", requiredClaimKeys: ["section-46-8-antrag-via-declaration", "antragsveranlagung-not-guaranteed-refund"], requiredProcessKeys: ["pflicht-oder-antrag"], requiredFormIdentifiers: ["ESt-Erklaerung"] },
  { id: "simultaneous-employers", label: "Gleichzeitige mehrere Arbeitgeber", coverage: "COVERED", requiredClaimKeys: ["section-46-multiple-employers-simultaneous", "two-employers-not-always-simultaneous"], requiredProcessKeys: ["pflicht-oder-antrag"] },
  { id: "progression-replacement", label: "Lohnersatz und Progressionsvorbehalt", coverage: "COVERED", requiredClaimKeys: ["progression-replacement-income", "tax-free-not-irrelevant-to-rate", "progression-not-ordinary-taxable", "benefit-not-automatic-unless-threshold"], requiredProcessKeys: ["pflicht-oder-antrag", "ausland-gate"] },
  { id: "finanzamt-filing-request", label: "Finanzamt fordert Erklärung", coverage: "COVERED", requiredClaimKeys: ["aufforderung-creates-duty", "aufforderung-not-optional"], requiredProcessKeys: ["pflicht-oder-antrag"] },
  { id: "married-couple", label: "Verheiratetes Paar", coverage: "COVERED", requiredClaimKeys: ["marriage-not-automatic-joint", "same-address-not-enough"], requiredProcessKeys: ["pflicht-oder-antrag"] },
  { id: "joint-vs-individual-unsure", label: "Unsicherheit Zusammen- oder Einzelveranlagung", coverage: "COVERED", requiredClaimKeys: ["joint-not-always-better", "do-not-recommend-filing-choice"], requiredProcessKeys: ["pflicht-oder-antrag"] },
  { id: "self-employed", label: "Selbständige Person", coverage: "COVERED", requiredClaimKeys: ["self-employed-triggers-electronic", "umsatz-not-gewinn", "not-every-self-employed-from-turnover"], requiredProcessKeys: ["einkunftsarten", "elster-uebermittlung"] },
  { id: "mixed-employment-self-employed", label: "Mischung aus Arbeit und Selbständigkeit", coverage: "COVERED", requiredClaimKeys: ["seven-categories-routing", "profit-vs-surplus", "euer-boundary-route"], requiredProcessKeys: ["einkunftsarten"] },
  { id: "rental-income", label: "Mieteinkünfte", coverage: "COVERED", requiredClaimKeys: ["rental-payment-not-profit-amount", "seven-categories-routing"], requiredProcessKeys: ["einkunftsarten"] },
  { id: "foreign-income", label: "Ausländische Einkünfte", coverage: "COVERED", requiredClaimKeys: ["foreign-income-not-automatically-tax-free", "foreign-tax-paid-not-nothing-to-declare"], requiredProcessKeys: ["ausland-gate"] },
  { id: "foreign-residence-german-income", label: "Auslandswohnsitz und Inlandseinkünfte", coverage: "COVERED", requiredClaimKeys: ["limited-if-domestic-income", "living-abroad-not-automatic-no-est"], requiredProcessKeys: ["steuerpflicht-gate", "ausland-gate"] },
  { id: "cross-border-worker", label: "Grenzgängerin oder Grenzgänger", coverage: "COVERED", requiredClaimKeys: ["german-employer-not-exclusive-right", "treaty-result-fail-closed"], requiredProcessKeys: ["ausland-gate"] },
  { id: "vz-2025-mandatory-late", label: "Pflichtklärung 2025 verspätet", coverage: "COVERED", requiredClaimKeys: ["vz-2025-unadvised-31-july-2026", "still-file-when-late", "verspaetungszuschlag-can-be-set"], requiredProcessKeys: ["steuerjahr-frist", "verspaetete-erklaerung"] },
  { id: "voluntary-2025", label: "Freiwillige Erklärung 2025", coverage: "COVERED", requiredClaimKeys: ["vz-2025-voluntary-31-dec-2029", "antragsveranlagung-not-guaranteed-refund"], requiredProcessKeys: ["steuerjahr-frist", "pflicht-oder-antrag"] },
  { id: "deadline-unclear", label: "Frist unklar", coverage: "COVERED", requiredClaimKeys: ["individual-deadline-needs-facts", "deadline-not-timeless-31-july"], requiredProcessKeys: ["steuerjahr-frist"] },
  { id: "extension-request", label: "Antrag auf Fristverlängerung", coverage: "COVERED", requiredClaimKeys: ["extension-109-possible", "extension-not-automatic"], requiredProcessKeys: ["steuerjahr-frist"], requiredFormIdentifiers: ["AO-Fristverlaengerung"] },
  { id: "no-elster-account", label: "Kein ELSTER-Konto", coverage: "COVERED", requiredClaimKeys: ["elster-submit-route", "elster-exists-not-everyone-must"], requiredProcessKeys: ["elster-uebermittlung"], requiredFormIdentifiers: ["ELSTER-Uebermittlung"] },
  { id: "electronic-filing-required", label: "Elektronische Abgabe vorgeschrieben", coverage: "COVERED", requiredClaimKeys: ["section-25-4-electronic", "self-employed-not-paper-optional"], requiredProcessKeys: ["elster-uebermittlung"] },
  { id: "hardship-paper", label: "Härteantrag auf Papierabgabe", coverage: "COVERED", requiredClaimKeys: ["hardship-exemption-possible", "no-computer-not-automatic-exemption"], requiredProcessKeys: ["elster-uebermittlung"] },
  { id: "missing-receipt", label: "Beleg fehlt", coverage: "COVERED", requiredClaimKeys: ["no-receipt-not-automatically-unsupported", "retain-evidence", "do-not-fabricate"], requiredProcessKeys: ["belege-edaten"] },
  { id: "fa-requests-evidence", label: "Finanzamt fordert Belege", coverage: "COVERED", requiredClaimKeys: ["nachforderung-not-audit", "nachforderung-not-fraud"], requiredProcessKeys: ["unterlagen-nachreichen"], requiredFormIdentifiers: ["ELSTER-Belegnachreichung"] },
  { id: "edata-differs", label: "eDaten weichen von Unterlagen ab", coverage: "COVERED", requiredClaimKeys: ["edata-not-always-correct"], requiredProcessKeys: ["belege-edaten"] },
  { id: "no-return-schaetzung", label: "Keine Abgabe und Schätzung", coverage: "COVERED", requiredClaimKeys: ["schaetzung-when-cannot-determine", "schaetzung-does-not-end-duty", "schaetzung-not-correct-final"], requiredProcessKeys: ["schaetzung-behandeln"] },
  { id: "bescheid-refund", label: "Bescheid mit Erstattung", coverage: "COVERED", requiredClaimKeys: ["inspect-bescheid-structure", "refund-after-bekanntgabe", "submitted-not-guaranteed-refund"], requiredProcessKeys: ["bescheid-pruefen", "erstattung-behandeln"] },
  { id: "bescheid-payment", label: "Bescheid mit Abschlusszahlung", coverage: "COVERED", requiredClaimKeys: ["inspect-bescheid-structure", "abschlusszahlung-one-month", "nachzahlung-not-punishment"], requiredProcessKeys: ["bescheid-pruefen", "nachzahlung-behandeln"] },
  { id: "vorauszahlungsbescheid", label: "Vorauszahlungsbescheid", coverage: "COVERED", requiredClaimKeys: ["vorauszahlung-quarterly-dates", "vorauszahlung-credited"], requiredProcessKeys: ["vorauszahlungen"], requiredFormIdentifiers: ["ESt-Vorauszahlungsanpassung"] },
  { id: "disagrees-with-bescheid", label: "Uneinigkeit mit dem Bescheid", coverage: "COVERED", requiredClaimKeys: ["disagreement-not-auto-recommend", "deviation-not-automatically-error"], requiredProcessKeys: ["bescheid-pruefen", "einspruch-einordnen"] },
  { id: "einspruch-deadline-unclear", label: "Einspruchsfrist unklar", coverage: "COVERED", requiredClaimKeys: ["document-date-not-bekanntgabe", "individual-einspruch-deadline-needs-facts"], requiredProcessKeys: ["einspruch-einordnen"] },
  { id: "einspruch-but-payment-due", label: "Einspruch eingelegt, Zahlung offen", coverage: "COVERED", requiredClaimKeys: ["einspruch-not-automatic-suspend", "adv-is-separate", "do-not-auto-recommend-adv"], requiredProcessKeys: ["adv-einordnen"], requiredFormIdentifiers: ["AO-AdV"] },
  { id: "changed-bescheid", label: "Änderungsbescheid", coverage: "COVERED", requiredClaimKeys: ["correction-not-always-new-return"], requiredProcessKeys: ["aenderung-korrektur"] },
  { id: "wrong-bank", label: "Falsche Bankverbindung", coverage: "COVERED", requiredClaimKeys: ["wrong-bank-needs-action"], requiredProcessKeys: ["erstattung-behandeln"] },
  { id: "tax-class-confused", label: "Steuerklasse mit Jahressteuer verwechselt", coverage: "COVERED", requiredClaimKeys: ["steuerklasse-not-final-tax", "lohnsteuer-not-einkommensteuer"], requiredProcessKeys: ["est-einordnen"] },
  { id: "exact-refund-without-facts", label: "Genaue Erstattung ohne Tatsachen", coverage: "COVERED", requiredClaimKeys: ["individual-refund-fail-closed"], requiredProcessKeys: ["erstattung-behandeln"] },
  { id: "exact-tax-without-facts", label: "Genaue Steuer ohne Tatsachen", coverage: "COVERED", requiredClaimKeys: ["individual-tax-fail-closed"], requiredProcessKeys: ["abzugsbereiche"] },
  { id: "foreign-tax-eliminates-german", label: "Auslandssteuer soll deutsche Erklärung ersetzen", coverage: "COVERED", requiredClaimKeys: ["foreign-tax-paid-not-nothing-to-declare"], requiredProcessKeys: ["ausland-gate"] },
  { id: "finanzamt-unknown", label: "Zuständiges Finanzamt unbekannt", coverage: "COVERED", requiredClaimKeys: ["wohnsitzfinanzamt", "live-lookup-finanzamt", "userlocale-not-jurisdiction"], requiredProcessKeys: ["finanzamt-bestimmen"] },
  { id: "changing-employer-mid-year", label: "Arbeitgeberwechsel im Jahr", coverage: "COVERED", requiredClaimKeys: ["changing-employer-not-automatically-pflicht"], requiredProcessKeys: ["pflicht-oder-antrag"] },
  { id: "meine-belege-upload", label: "Upload in Meine Belege", coverage: "COVERED", requiredClaimKeys: ["meine-belege-not-automatic-submit", "belegvorhalte-not-send-all"], requiredProcessKeys: ["belege-edaten"] },
  { id: "current-year-final", label: "Laufendes Jahr soll schon veranlagt werden", coverage: "COVERED", requiredClaimKeys: ["current-year-not-final", "est-is-jahressteuer"], requiredProcessKeys: ["est-einordnen"] },
  { id: "anmeldung-as-tax-residence", label: "Anmeldung als Steuerwohnsitz", coverage: "COVERED", requiredClaimKeys: ["anmeldung-not-tax-residence", "anmeldung-not-steuererklaerung"], requiredProcessKeys: ["steuerpflicht-gate"] },
  { id: "elster-vs-bescheid", label: "ELSTER-Rechnung als Bescheid", coverage: "COVERED", requiredClaimKeys: ["elster-calc-not-binding", "steuererklaerung-not-bescheid"], requiredProcessKeys: ["bescheid-pruefen"] },
  { id: "umsatz-as-tax", label: "Umsatz als Einkommensteuer", coverage: "COVERED", requiredClaimKeys: ["umsatz-not-gewinn", "est-not-ust"], requiredProcessKeys: ["einkunftsarten"] },
  { id: "verspaetung-vs-saeumnis", label: "Verspätungs- und Säumniszuschlag", coverage: "COVERED", requiredClaimKeys: ["verspaetungszuschlag-not-saeumnis", "zwangsgeld-not-verspaetung"], requiredProcessKeys: ["verspaetete-erklaerung"] },
  { id: "bekanntgabe-postal-electronic", label: "Bekanntgabe Post und elektronisch", coverage: "COVERED", requiredClaimKeys: ["postal-fourth-day", "electronic-fourth-day", "non-receipt-exception"], requiredProcessKeys: ["einspruch-einordnen"], requiredFormIdentifiers: ["AO-Einspruch"] },
  { id: "downstream-alg-health-kindergeld", label: "Schnittstellen zu bestehenden Paketen", coverage: "COVERED", requiredClaimKeys: ["alg-pack-is-separate", "health-pack-is-separate", "kindergeld-pack-is-separate", "steuer-id-pack-is-separate"], requiredProcessKeys: ["ausland-gate"] },
  { id: "folgejahr", label: "Folgejahr und weitere Pflichten", coverage: "COVERED", requiredClaimKeys: ["filed-once-not-forever", "refund-once-not-same-next-year"], requiredProcessKeys: ["folgejahr-pflichten"] },
  { id: "full-tax-calculator", label: "Vollständiger Steuertarifrechner", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Kein fallbezogener Tarifrechner." },
  { id: "full-euer", label: "Vollständige EÜR oder Buchführung", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Gewinnabgrenzung, kein Rechnungswesen." },
  { id: "umsatzsteuer-pack", label: "Umsatzsteuerpaket", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Umsatzsteuer ist ein anderes Verfahren." },
  { id: "gewerbesteuer-pack", label: "Gewerbesteuerpaket", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Gewerbesteuer ist ein anderes Verfahren." },
  { id: "koerperschaftsteuer", label: "Körperschaftsteuer", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur natürliche Personen." },
  { id: "full-capital-gains", label: "Vollständige Kapitalertragsteuer", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Routing der Einkunftsart." },
  { id: "crypto-tax", label: "Kryptobesteuerung", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Keine Krypto-Merits." },
  { id: "inheritance-gift", label: "Erbschaft- und Schenkungsteuer", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Andere Steuerart." },
  { id: "full-dba-engine", label: "Vollständige Abkommensmaschine", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Fail-closed-Grenze." },
  { id: "tax-crime-defense", label: "Steuerstrafverteidigung", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Kein Strafverfahren." },
  { id: "aussenpruefung-litigation", label: "Außenprüfung und Finanzgericht", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Einspruchsortientierung." },
  { id: "partnership-feststellung", label: "Gesonderte Feststellung", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Keine Feststellungsarchitektur." },
]);

const CONTEXT_GATE_POLICIES = Object.freeze([
  { sourceKey: "ao-355", informationClass: "PROCESS_IDENTITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "ao-149", informationClass: "ELIGIBILITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "estg-46", informationClass: "DEADLINE" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "estg-32a", informationClass: "PROCESS_IDENTITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["EVENT_DATE"] as const, riskClass: "HIGH" },
  { sourceKey: "estg-1", informationClass: "AUTHORITY_COMPETENCE" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["RESIDENCE_STATE", "COUNTRY"] as const, riskClass: "HIGH" },
  { sourceKey: "estg-36", informationClass: "DEADLINE" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "ao-19", informationClass: "PROCESS_IDENTITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["BUNDESLAND"] as const, riskClass: "HIGH" },
]);

export function evaluateEstProcessCompleteness(
  pack: CuratedDomainPack,
  units: readonly UnitSpec[] = EST_UNITS,
) {
  const claimByKey = new Map(pack.claims.map((claim) => [String(claim.key), claim]));
  const processByKey = new Map(pack.processes.map((process) => [String(process.key), process]));
  const formIds = new Set(pack.forms.map((form) => String(form.identifier)));
  const rows = EST_PROCESS_SCENARIOS.map((scenario) => {
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

export function buildEstFederalCorePack(): CuratedDomainPack {
  const item = factory(EST_PACK_ID);
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
    elster: item("publishers", "elster-finanzverwaltung", {
      name: "ELSTER / Finanzverwaltung",
      type: "federal_service_portal",
      territorialScopeId: scope.id,
      trustDomainId: trustDomain.id,
    }),
    lfst_by: item("publishers", "lfst-bayern", {
      name: "Bayerisches Landesamt für Steuern",
      type: "land_finance_authority",
      territorialScopeId: scope.id,
      trustDomainId: trustDomain.id,
    }),
    bzst: item("publishers", "bundeszentralamt-steuern", {
      name: "Bundeszentralamt für Steuern",
      type: "federal_tax_authority",
      territorialScopeId: scope.id,
      trustDomainId: trustDomain.id,
    }),
  };
  const authorities = {
    bmf: item("authorities", "bundesministerium-finanzen", {
      publisherId: publishers.bmj.id,
      name: "Bundesministerium der Finanzen",
      type: "federal_ministry",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://www.gesetze-im-internet.de/estg/",
    }),
    elster: item("authorities", "elster-finanzverwaltung", {
      publisherId: publishers.elster.id,
      name: "ELSTER Finanzverwaltung",
      type: "federal_service_portal",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://www.elster.de/elsterweb/infoseite/privatpersonen",
    }),
    lfst_by: item("authorities", "lfst-bayern", {
      publisherId: publishers.lfst_by.id,
      name: "Bayerisches Landesamt für Steuern",
      type: "land_finance_authority",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://www.lfst.bayern.de/aktuelles/termine-und-fristen",
    }),
    bzst: item("authorities", "bundeszentralamt-steuern", {
      publisherId: publishers.bzst.id,
      name: "Bundeszentralamt für Steuern",
      type: "federal_tax_authority",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://www.bzst.de/DE/Service/Behoerdenwegweiser/Finanzamtsuche/finanzamtsuche_node.html",
    }),
  };

  const sources = EST_OFFICIAL_SOURCES.map((spec) => {
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
      authorityLevel: spec.officialDomain === "www.lfst.bayern.de" ? "LAND" : "FEDERAL",
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

  const claims = EST_UNITS.map((unit) => {
    const source = sourceByKey.get(unit.sourceKey);
    const passage = passageByKey.get(unit.passageKey);
    if (!source || !passage) throw new Error(`EST_UNIT_SOURCE_MISSING:${unit.key}`);
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
    if (!source) throw new Error(`EST_CONTEXT_POLICY_SOURCE_MISSING:${spec.sourceKey}`);
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

  const processes = EST_PROCESSES.map((spec) => item("processes", spec.key, {
    processGroupId: EST_DOMAIN,
    title: spec.title,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
    riskLevel: spec.riskLevel,
    trigger: spec.trigger,
    safeFirstStep: spec.safeFirstStep,
    regionalVariationExpected: spec.key === "finanzamt-bestimmen" || spec.key === "ausland-gate",
  }));
  const processByKey = new Map(processes.map((process) => [String(process.key), process]));
  const claimByKey = new Map(claims.map(({ claim }) => [String(claim.key), claim]));
  const processClaimLinks = EST_PROCESS_BINDINGS.flatMap((binding) => {
    const process = processByKey.get(binding.processKey);
    if (!process) throw new Error(`EST_PROCESS_MISSING:${binding.processKey}`);
    return binding.claimKeys.map((claimKey) => {
      const claim = claimByKey.get(claimKey);
      if (!claim) throw new Error(`EST_PROCESS_CLAIM_MISSING:${binding.processKey}:${claimKey}`);
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

  const inspectBescheidRule = item("actorRules", "inspect-est-bescheid-before-einspruch", {
    actorState: "inspect_est_bescheid_before_einspruch",
    userMustAct: true,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const competenceRule = item("actorRules", "competent-finanzamt-undetermined", {
    actorState: "competent_finanzamt_undetermined_without_locality",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const deadlineRule = item("actorRules", "individualized-deadline-undetermined", {
    actorState: "individualized_filing_deadline_undetermined_without_tax_year_facts",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const obligationRule = item("actorRules", "filing-obligation-undetermined", {
    actorState: "individual_filing_obligation_undetermined",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const taxAmountRule = item("actorRules", "individual-tax-undetermined", {
    actorState: "individual_income_tax_amount_undetermined",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const residenceRule = item("actorRules", "international-residence-undetermined", {
    actorState: "international_tax_residence_undetermined",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const treatyRule = item("actorRules", "treaty-result-undetermined", {
    actorState: "individual_treaty_result_undetermined",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });

  const forms = EST_FORMS.map((spec) => {
    const source = sourceByKey.get(spec.sourceKey);
    const passage = passageByKey.get(spec.passageKey);
    if (!source || !passage) throw new Error(`EST_FORM_SOURCE_MISSING:${spec.key}`);
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
    packId: EST_PACK_ID,
    domain: EST_DOMAIN,
    canonicalLanguage: EST_CANONICAL_LANGUAGE,
    trustDomain,
    jurisdictions: [jurisdiction],
    territorialScopes: [scope],
    publishers: [publishers.bmj, publishers.elster, publishers.lfst_by, publishers.bzst],
    authorities: [authorities.bmf, authorities.elster, authorities.lfst_by, authorities.bzst],
    sources: sources.map(({ source }) => source),
    sourceVersions: sources.map(({ version }) => version),
    passages: sources.flatMap(({ passages }) => passages),
    claims: claims.map(({ claim }) => claim),
    evidenceLinks: claims.map(({ evidence }) => evidence),
    citations: claims.map(({ citation }) => citation),
    actorRules: [
      inspectBescheidRule, competenceRule, deadlineRule, obligationRule,
      taxAmountRule, residenceRule, treatyRule,
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

export function estPackSummary(pack: CuratedDomainPack = buildEstFederalCorePack()) {
  const categories = Object.fromEntries(
    EST_UNITS.reduce((counts, unit) => {
      counts.set(unit.category, (counts.get(unit.category) ?? 0) + 1);
      return counts;
    }, new Map<EstUnitCategory, number>()),
  );
  const completeness = evaluateEstProcessCompleteness(pack);
  return Object.freeze({
    domain: pack.domain,
    packId: pack.packId,
    canonicalLanguage: pack.canonicalLanguage,
    claimCount: pack.claims.length,
    sourceCount: pack.sources.length,
    processCount: pack.processes.length,
    processClaimLinkCount: pack.processClaimLinks.length,
    formCount: pack.forms.length,
    current2026Count: EST_UNITS.length,
    futureWatchCount: EST_FUTURE_CHANGE_WATCH_ITEMS.length,
    g3ProcessStepLimitation: EST_G3_PROCESS_STEP_LIMITATION,
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
