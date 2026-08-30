/**
 * Anmeldung process-complete federal overlay.
 * Reuses the existing 41 canonical unit IDs from pack.ts as claim keys.
 * Adds only gap claims, named processes, processClaimLinks and scenarios.
 * Not a runtime route. Does not replace the historical 037 production pack.
 *
 * G3 limitation: knowledge_process_steps are not ingestible via CuratedDomainPack.
 */
import { createHash } from "node:crypto";

import {
  KNOWLEDGE_FACTORY_SCHEMA_VERSION,
  stableKnowledgeFactoryId,
  type CuratedDomainPack,
} from "../../../source-registry/knowledge-factory-contracts";
import {
  BMG_PASSAGES,
  CANONICAL_UNITS,
  CURRENT_PRODUCTION_ANMELDUNG_CANONICAL_UNIT_IDS,
  FIRST_PACK_CANONICAL_UNIT_IDS,
  PACK_ID,
  V2A_ADDED_CANONICAL_UNIT_IDS,
  type CanonicalUnit,
} from "./pack";

export const ANMELDUNG_DOMAIN = PACK_ID;
export const ANMELDUNG_PACK_ID = ANMELDUNG_DOMAIN;
export const ANMELDUNG_CANONICAL_LANGUAGE = "de" as const;
export const ANMELDUNG_BASELINE_CLAIM_IDS = CURRENT_PRODUCTION_ANMELDUNG_CANONICAL_UNIT_IDS;
export const ANMELDUNG_FIRST_PACK_CLAIM_IDS = FIRST_PACK_CANONICAL_UNIT_IDS;
export const ANMELDUNG_V2A_CLAIM_IDS = V2A_ADDED_CANONICAL_UNIT_IDS;

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

export const ANMELDUNG_G3_PROCESS_STEP_LIMITATION =
  "G3 CuratedDomainPack and knowledge_ingest_curated_domain_pack persist processes and process_claim_links with process_step_id null; knowledge_process_steps are not ingestible without a later factory extension.";

export type AnmeldungContextKey = "EVENT_DATE" | "RESIDENCE_STATE" | "COUNTRY" | "BUNDESLAND" | "PROCESS_VARIANT";
export type AnmeldungHandlingMode =
  | "STORE_CANONICALLY"
  | "CACHE_AND_REVALIDATE"
  | "FETCH_LIVE"
  | "DO_NOT_ANSWER_WITHOUT_CONTEXT";
export type AnmeldungInformationClass =
  | "LEGAL_BASELINE"
  | "PROCESS_IDENTITY"
  | "AUTHORITY_COMPETENCE"
  | "DEADLINE"
  | "REQUIRED_EVIDENCE";
export type AnmeldungProcessRole =
  | "orientation_basis"
  | "application_route"
  | "evidence_requirement"
  | "deadline_gate"
  | "next_state"
  | "context_gate"
  | "negative_control";
export type AnmeldungScenarioCoverage =
  | "COVERED"
  | "OUT_OF_SCOPE"
  | "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE";

export type AnmeldungProcessScenario = Readonly<{
  id: string;
  label: string;
  coverage: AnmeldungScenarioCoverage;
  requiredClaimKeys: readonly string[];
  requiredProcessKeys: readonly string[];
  requiredFormIdentifiers?: readonly string[];
  note?: string;
}>;

const PASSAGE_SOURCE: Readonly<Record<string, string>> = Object.freeze({
  "bmg-17-1": "bmg-17",
  "bmg-17-2": "bmg-17",
  "bmg-17-3": "bmg-17",
  "bmg-17-3-newborn": "bmg-17",
  "bmg-17-3-carer": "bmg-17",
  "bmg-18-1": "bmg-18",
  "bmg-18-3": "bmg-18",
  "bmg-19-1": "bmg-19",
  "bmg-19-2": "bmg-19",
  "bmg-19-3": "bmg-19",
  "bmg-19-4": "bmg-19",
  "bmg-19-6": "bmg-19",
  "bmg-20": "bmg-20",
  "bmg-21-1-3": "bmg-21",
  "bmg-21-4": "bmg-21",
  "bmg-22": "bmg-22",
  "bmg-23-1": "bmg-23",
  "bmg-23-2": "bmg-23",
  "bmg-23-4": "bmg-23",
  "bmg-23-6": "bmg-23",
  "bmg-23a-1-2": "bmg-23a",
  "bmg-23a-3": "bmg-23a",
  "bmg-24-1": "bmg-24",
  "bmg-24-2": "bmg-24",
  "bmg-25": "bmg-25",
  "bmg-26": "bmg-26",
  "bmg-27-2": "bmg-27",
  "bmg-54": "bmg-54",
  "bmg-54-1": "bmg-54",
});

function existingPassage(id: string) {
  const passage = BMG_PASSAGES.find((item) => item.id === id);
  if (!passage) throw new Error(`ANMELDUNG_PASSAGE_MISSING:${id}`);
  return { key: passage.id, locator: passage.locator, text: passage.text };
}

type OfficialSourceSpec = Readonly<{
  key: string;
  publisherKey: "bmj" | "bund";
  authorityKey: "bmi" | "bmj";
  url: string;
  officialDomain: string;
  title: string;
  sourceClass: "FEDERAL_LAW" | "FEDERAL_SERVICE_PORTAL";
  sourceType: "federal_statute" | "authority_portal";
  retrievalMethod: "HTML_DOCUMENT";
  informationClass: AnmeldungInformationClass;
  handlingMode: AnmeldungHandlingMode;
  freshnessClass: "LEGAL_CHANGE_MONITORED" | "MONTHLY" | "EVENT_DRIVEN";
  staleBehavior: "DO_NOT_USE_STALE" | "REVALIDATE_BEFORE_USE";
  requiredContextKeys: readonly AnmeldungContextKey[];
  passages: readonly Readonly<{ key: string; locator: string; text: string }>[];
}>;

type UnitSpec = Readonly<{
  key: string;
  category: string;
  temporal: "current_2026";
  type: CanonicalUnit["claimType"];
  text: string;
  sourceKey: string;
  passageKey: string;
  riskLevel: "low" | "medium" | "high";
  requiresAuthorityResolution?: true;
  requiredContextKeys?: readonly AnmeldungContextKey[];
}>;

export const ANMELDUNG_FUTURE_WATCH_SOURCE = Object.freeze({
  url: "https://verwaltung.bund.de/leistungsverzeichnis/de/leistung/99115005104001",
  officialDomain: "verwaltung.bund.de",
  title: "Bundesportal Anmeldung einer Wohnung",
});

export const ANMELDUNG_FUTURE_CHANGE_WATCH_ITEMS = Object.freeze([
  {
    id: "anmeldung-future-watch-local-online-2027",
    key: "local-online-anmeldung-catalog-2027",
    officialSourceUrl: ANMELDUNG_FUTURE_WATCH_SOURCE.url,
    officialDomain: ANMELDUNG_FUTURE_WATCH_SOURCE.officialDomain,
    officialSourceTitle: ANMELDUNG_FUTURE_WATCH_SOURCE.title,
    targetYear: 2027 as const,
    status: "future_change_watch_not_ingestible" as const,
    currentGuidance: false as const,
    description: "Künftige lokale Online-Anmeldungskataloge sind keine aktuelle bundesrechtliche Wahrheit und dürfen nicht als zeitloses Bundesrecht ingestiert werden.",
  },
]);

export const ANMELDUNG_OFFICIAL_SOURCES: readonly OfficialSourceSpec[] = Object.freeze([
  {
    key: "bmg-1", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/bmg/__1.html",
    officialDomain: "www.gesetze-im-internet.de", title: "BMG § 1 Meldebehörden",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "AUTHORITY_COMPETENCE", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [{ key: "bmg-1-all", locator: "BMG § 1", text: "Meldebehörden sind die durch Landesrecht dazu bestimmten Behörden. Die zuständige Meldebehörde richtet sich nach der tatsächlichen Wohnung und dem Landesorganisationsrecht, nicht nach Sprache, userLocale oder Staatsangehörigkeit." }],
  },
  {
    key: "bmg-6", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/bmg/__6.html",
    officialDomain: "www.gesetze-im-internet.de", title: "BMG § 6 Richtigkeit des Melderegisters",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [{ key: "bmg-6-all", locator: "BMG § 6 Abs. 1", text: "Ist das Melderegister unrichtig oder unvollständig, hat es die Meldebehörde zu berichtigen oder zu vervollständigen. Über die Fortschreibung sind öffentliche Stellen zu unterrichten, denen die unrichtigen Daten im Rahmen regelmäßiger Datenübermittlungen übermittelt worden sind. Das ist nicht dasselbe wie die automatische Erledigung aller privaten oder sonstigen Behördenangelegenheiten." }],
  },
  {
    key: "bmg-12", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/bmg/__12.html",
    officialDomain: "www.gesetze-im-internet.de", title: "BMG § 12 Recht auf Berichtigung",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [{ key: "bmg-12-all", locator: "BMG § 12", text: "Die betroffene Person kann die Berichtigung oder Vervollständigung ihrer Meldedaten bei der Meldebehörde nach Artikel 16 der Verordnung (EU) 2016/679 beantragen. Eine neue Anmeldung ist nicht der gesetzliche Weg für jede Registerberichtigung." }],
  },
  {
    key: "bmg-17", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/bmg/__17.html",
    officialDomain: "www.gesetze-im-internet.de", title: "BMG § 17 Anmeldung und Abmeldung",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      existingPassage("bmg-17-1"), existingPassage("bmg-17-2"), existingPassage("bmg-17-3"),
      existingPassage("bmg-17-3-newborn"), existingPassage("bmg-17-3-carer"),
    ],
  },
  {
    key: "bmg-18", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/bmg/__18.html",
    officialDomain: "www.gesetze-im-internet.de", title: "BMG § 18 Meldebescheinigung",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [existingPassage("bmg-18-1"), existingPassage("bmg-18-3")],
  },
  {
    key: "bmg-19", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/bmg/__19.html",
    officialDomain: "www.gesetze-im-internet.de", title: "BMG § 19 Mitwirkung des Wohnungsgebers",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "REQUIRED_EVIDENCE", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      existingPassage("bmg-19-1"), existingPassage("bmg-19-2"), existingPassage("bmg-19-3"),
      existingPassage("bmg-19-4"), existingPassage("bmg-19-6"),
    ],
  },
  {
    key: "bmg-20", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/bmg/__20.html",
    officialDomain: "www.gesetze-im-internet.de", title: "BMG § 20 Begriff der Wohnung",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [existingPassage("bmg-20")],
  },
  {
    key: "bmg-21", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/bmg/__21.html",
    officialDomain: "www.gesetze-im-internet.de", title: "BMG § 21 Mehrere Wohnungen",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [existingPassage("bmg-21-1-3"), existingPassage("bmg-21-4")],
  },
  {
    key: "bmg-22", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/bmg/__22.html",
    officialDomain: "www.gesetze-im-internet.de", title: "BMG § 22 Bestimmung der Hauptwohnung",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [existingPassage("bmg-22")],
  },
  {
    key: "bmg-23", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/bmg/__23.html",
    officialDomain: "www.gesetze-im-internet.de", title: "BMG § 23 Meldepflicht",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      existingPassage("bmg-23-1"), existingPassage("bmg-23-2"),
      existingPassage("bmg-23-4"), existingPassage("bmg-23-6"),
    ],
  },
  {
    key: "bmg-23a", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/bmg/__23a.html",
    officialDomain: "www.gesetze-im-internet.de", title: "BMG § 23a Elektronische Anmeldung",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [existingPassage("bmg-23a-1-2"), existingPassage("bmg-23a-3")],
  },
  {
    key: "bmg-24", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/bmg/__24.html",
    officialDomain: "www.gesetze-im-internet.de", title: "BMG § 24 Meldebestätigung",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [existingPassage("bmg-24-1"), existingPassage("bmg-24-2")],
  },
  {
    key: "bmg-25", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/bmg/__25.html",
    officialDomain: "www.gesetze-im-internet.de", title: "BMG § 25 Auskunfts- und Mitwirkungspflichten",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [existingPassage("bmg-25")],
  },
  {
    key: "bmg-26", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/bmg/__26.html",
    officialDomain: "www.gesetze-im-internet.de", title: "BMG § 26 Befreiung von der Meldepflicht",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [existingPassage("bmg-26")],
  },
  {
    key: "bmg-27", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/bmg/__27.html",
    officialDomain: "www.gesetze-im-internet.de", title: "BMG § 27 Ausnahmen von der Meldepflicht",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      existingPassage("bmg-27-2"),
      { key: "bmg-27-3", locator: "BMG § 27 Abs. 3", text: "Die Ausnahme nach Absatz 2 gilt nicht für Spätaussiedler und deren Familienangehörige bei Verteilung sowie für Asylbewerber oder sonstige Ausländer, die vorübergehend eine Aufnahmeeinrichtung oder eine sonstige zugewiesene Unterkunft beziehen." },
    ],
  },
  {
    key: "bmg-29", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/bmg/__29.html",
    officialDomain: "www.gesetze-im-internet.de", title: "BMG § 29 Beherbergungsstätten",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [{ key: "bmg-29-all", locator: "BMG § 29 Abs. 1", text: "Wer in einer Beherbergungsstätte für länger als sechs Monate aufgenommen wird, unterliegt der Meldepflicht nach § 17 oder § 28. Wer nicht für eine Wohnung im Inland gemeldet ist, hat sich innerhalb von zwei Wochen anzumelden, sobald der Aufenthalt drei Monate überschreitet. Eine kurzfristige Hotelübernachtung ist nicht automatisch eine Anmeldung nach § 17." }],
  },
  {
    key: "bmg-54", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/bmg/__54.html",
    officialDomain: "www.gesetze-im-internet.de", title: "BMG § 54 Ordnungswidrigkeiten",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "DEADLINE", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [existingPassage("bmg-54"), existingPassage("bmg-54-1")],
  },
  {
    key: "bund-anmeldung", publisherKey: "bund", authorityKey: "bmi",
    url: "https://verwaltung.bund.de/leistungsverzeichnis/de/leistung/99115005104001",
    officialDomain: "verwaltung.bund.de", title: "Bundesportal: Anmeldung der Wohnung",
    sourceClass: "FEDERAL_SERVICE_PORTAL", sourceType: "authority_portal", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY", handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "MONTHLY", staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: [],
    passages: [{ key: "bund-anmeldung-all", locator: "Bundesportal Anmeldung", text: "Das Bundesportal beschreibt die Anmeldung einer Wohnung als Leistung der örtlichen Meldebehörde. Ob ein Termin, ein Online-Dienst oder ein bestimmtes Bürgeramt angeboten wird, ist örtlich und live zu prüfen und keine bundesweit einheitliche Verfahrenskonstante." }],
  },
  {
    key: "bund-local-live", publisherKey: "bund", authorityKey: "bmi",
    url: "https://verwaltung.bund.de/leistungsverzeichnis/de",
    officialDomain: "verwaltung.bund.de", title: "Bundesportal: örtliche Leistungsausführung",
    sourceClass: "FEDERAL_SERVICE_PORTAL", sourceType: "authority_portal", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "AUTHORITY_COMPETENCE", handlingMode: "FETCH_LIVE",
    freshnessClass: "EVENT_DRIVEN", staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: ["BUNDESLAND"],
    passages: [{ key: "bund-local-live-all", locator: "Bundesportal örtliche Ausführung", text: "Öffnungszeiten, Terminlage und die aktuelle örtliche Online-Verfügbarkeit der Anmeldung sind live bei der zuständigen Meldebehörde zu prüfen." }],
  },
]);

function baselineUnit(unit: CanonicalUnit): UnitSpec {
  const sourceKey = PASSAGE_SOURCE[unit.passageId];
  if (!sourceKey) throw new Error(`ANMELDUNG_BASELINE_SOURCE_MISSING:${unit.id}`);
  return {
    key: unit.id,
    category: "baseline",
    temporal: "current_2026",
    type: unit.claimType,
    text: unit.text,
    sourceKey,
    passageKey: unit.passageId,
    riskLevel: unit.handlingMode === "DO_NOT_ANSWER_WITHOUT_CONTEXT" ? "high" : "medium",
    requiresAuthorityResolution: unit.handlingMode === "DO_NOT_ANSWER_WITHOUT_CONTEXT" ? true : undefined,
    requiredContextKeys: unit.requiredContext as readonly AnmeldungContextKey[] | undefined,
  };
}

const GAP_UNITS: readonly UnitSpec[] = Object.freeze([
  { key: "melderegister-orientation", category: "orientation", temporal: "current_2026", type: "definition", text: "Das Melderegister ist das von der Meldebehörde geführte Register der Einwohnerdaten. Die Anmeldung aktualisiert dieses Register, ersetzt aber nicht jedes andere Behördenverfahren.", sourceKey: "bmg-6", passageKey: "bmg-6-all", riskLevel: "medium" },
  { key: "einzug-not-contract-date", category: "orientation", temporal: "current_2026", type: "exception", text: "Das Vertragsdatum eines Mietvertrags ist nicht automatisch das Einzugsdatum im Sinne des § 17 BMG.", sourceKey: "bmg-17", passageKey: "bmg-17-1", riskLevel: "high" },
  { key: "rental-not-already-bezogen", category: "orientation", temporal: "current_2026", type: "exception", text: "Ein abgeschlossener Mietvertrag bedeutet nicht automatisch, dass die Wohnung im Sinne des Bundesmeldegesetzes bereits bezogen ist.", sourceKey: "bmg-17", passageKey: "bmg-17-1", riskLevel: "high" },
  { key: "federal-vs-local", category: "orientation", temporal: "current_2026", type: "definition", text: "Das Bundesmeldegesetz bestimmt die Meldepflicht. Die örtliche Ausführung, Termine und Online-Wege bestimmt die durch Landesrecht festgelegte Meldebehörde.", sourceKey: "bmg-1", passageKey: "bmg-1-all", riskLevel: "high" },
  { key: "ummeldung-local-label", category: "orientation", temporal: "current_2026", type: "exception", text: "Ummeldung ist eine örtliche oder umgangssprachliche Bezeichnung für die Anmeldung der neuen Wohnung. Sie ist kein eigenes Bundesmeldegesetz neben Anmeldung und Abmeldung.", sourceKey: "bmg-17", passageKey: "bmg-17-1", riskLevel: "high" },
  { key: "mietvertrag-not-wgb", category: "wohnungsgeber", temporal: "current_2026", type: "exception", text: "Der Mietvertrag ist nicht die Wohnungsgeberbestätigung. Für die Anmeldung ist die gesetzliche Bestätigung des Wohnungsgebers oder das Zuordnungsmerkmal erforderlich.", sourceKey: "bmg-19", passageKey: "bmg-19-3", riskLevel: "high" },
  { key: "wohnungsgeber-not-always-owner", category: "wohnungsgeber", temporal: "current_2026", type: "exception", text: "Wohnungsgeber ist nicht notwendig dieselbe Person wie die Eigentümerin oder der Eigentümer. Mitwirken und bestätigen kann auch eine beauftragte Person.", sourceKey: "bmg-19", passageKey: "bmg-19-1", riskLevel: "high" },
  { key: "do-not-falsify-wgb", category: "wohnungsgeber", temporal: "current_2026", type: "duty", text: "Fehlt die Wohnungsgeberbestätigung, darf sie nicht erfunden oder gefälscht werden. Die Verweigerung oder Verspätung ist der Meldebehörde unverzüglich mitzuteilen.", sourceKey: "bmg-19", passageKey: "bmg-19-2", riskLevel: "high" },
  { key: "address-access-not-enough", category: "wohnungsgeber", temporal: "current_2026", type: "exception", text: "Der Zugang zu einer Anschrift begründet keine Anmeldung ohne tatsächlichen oder beabsichtigten Bezug der Wohnung.", sourceKey: "bmg-19", passageKey: "bmg-19-6", riskLevel: "high" },
  { key: "competence-by-dwelling", category: "competence", temporal: "current_2026", type: "definition", text: "Zuständig ist die durch Landesrecht bestimmte Meldebehörde der tatsächlich bezogenen Wohnung, nicht eine beliebige Meldebehörde.", sourceKey: "bmg-1", passageKey: "bmg-1-all", riskLevel: "high" },
  { key: "userlocale-not-jurisdiction", category: "competence", temporal: "current_2026", type: "exception", text: "userLocale, die Sprache der Oberfläche oder die Dokumentsprache bestimmen weder die Meldepflicht noch die zuständige Meldebehörde.", sourceKey: "bmg-1", passageKey: "bmg-1-all", riskLevel: "high" },
  { key: "language-not-jurisdiction", category: "competence", temporal: "current_2026", type: "exception", text: "Die deutsche Sprache eines Schreibens bestimmt nicht die zuständige Meldebehörde.", sourceKey: "bmg-1", passageKey: "bmg-1-all", riskLevel: "high" },
  { key: "land-alone-not-enough", category: "competence", temporal: "current_2026", type: "exception", text: "Das Bundesland allein bestimmt nicht eine bestimmte Meldebehörde. Erforderlich ist die tatsächliche Wohnung in einem örtlichen Zuständigkeitsbereich.", sourceKey: "bmg-1", passageKey: "bmg-1-all", riskLevel: "high" },
  { key: "no-locality-no-authority", category: "competence", temporal: "current_2026", type: "exception", text: "Ohne die tatsächliche neue Wohnung oder den Ort des Bezugs darf keine bestimmte Meldebehörde benannt werden.", sourceKey: "bmg-1", passageKey: "bmg-1-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["BUNDESLAND"] },
  { key: "berlin-not-bremen-not-hamburg", category: "competence", temporal: "current_2026", type: "exception", text: "Berlin, Bremen und Hamburg sind verschiedene Meldebehördensysteme. Eine Stadtstaaten-Meldebehörde ist nicht für die anderen Stadtstaaten zuständig.", sourceKey: "bmg-1", passageKey: "bmg-1-all", riskLevel: "high" },
  { key: "bremen-not-bremerhaven", category: "competence", temporal: "current_2026", type: "exception", text: "Bremerhaven ist nicht die Stadtgemeinde Bremen. Die Meldebehörde Bremens ist nicht automatisch für Bremerhaven zuständig.", sourceKey: "bmg-1", passageKey: "bmg-1-all", riskLevel: "high" },
  { key: "appointment-not-federal", category: "local_process", temporal: "current_2026", type: "exception", text: "Ein örtlicher Terminzwang ist keine bundesgesetzliche Voraussetzung der Anmeldung nach § 17 BMG.", sourceKey: "bund-anmeldung", passageKey: "bund-anmeldung-all", riskLevel: "medium" },
  { key: "electronic-not-every-municipality", category: "local_process", temporal: "current_2026", type: "exception", text: "Dass das Bundesmeldegesetz eine elektronische Anmeldung vorsieht, bedeutet nicht, dass jede Meldebehörde denselben Online-Weg aktuell anbietet.", sourceKey: "bund-anmeldung", passageKey: "bund-anmeldung-all", riskLevel: "high" },
  { key: "opening-hours-are-live", category: "local_process", temporal: "current_2026", type: "procedure", text: "Öffnungszeiten und die aktuelle örtliche Online-Verfügbarkeit der Anmeldung sind live zu prüfen.", sourceKey: "bund-local-live", passageKey: "bund-local-live-all", riskLevel: "medium" },
  { key: "nationality-not-exemption", category: "foreign", temporal: "current_2026", type: "exception", text: "Eine ausländische Staatsangehörigkeit befreit nicht automatisch von der Anmeldepflicht nach § 17 BMG.", sourceKey: "bmg-17", passageKey: "bmg-17-1", riskLevel: "high" },
  { key: "german-nationality-not-different-deadline", category: "foreign", temporal: "current_2026", type: "exception", text: "Die deutsche Staatsangehörigkeit ändert nicht die Zwei-Wochen-Frist der Anmeldung nach dem Bezug einer Wohnung.", sourceKey: "bmg-17", passageKey: "bmg-17-1", riskLevel: "high" },
  { key: "eu-not-immigration-from-anmeldung", category: "foreign", temporal: "current_2026", type: "exception", text: "Aus der Anmeldung folgt kein Freizügigkeits- oder Aufenthaltsstatus. Unionsbürgerschaft ist keine ausländerrechtliche Entscheidung der Meldebehörde.", sourceKey: "bmg-17", passageKey: "bmg-17-1", riskLevel: "high" },
  { key: "anmeldung-not-aufenthaltstitel", category: "foreign", temporal: "current_2026", type: "exception", text: "Die Anmeldung ist nicht der Aufenthaltstitel und ersetzt keine ausländerrechtliche Erlaubnis.", sourceKey: "bmg-17", passageKey: "bmg-17-1", riskLevel: "high" },
  { key: "anmeldung-not-work-permit", category: "foreign", temporal: "current_2026", type: "exception", text: "Die Anmeldung ist keine Arbeitserlaubnis.", sourceKey: "bmg-17", passageKey: "bmg-17-1", riskLevel: "high" },
  { key: "immigration-fail-closed", category: "foreign", temporal: "current_2026", type: "exception", text: "Fragen zu Visum, Aufenthaltstitel, Asyl oder Arbeitserlaubnis dürfen aus der Anmeldung allein nicht entschieden werden.", sourceKey: "bmg-17", passageKey: "bmg-17-1", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["COUNTRY", "PROCESS_VARIANT"] },
  { key: "register-updated", category: "aftermath", temporal: "current_2026", type: "procedure", text: "Nach erfolgreicher Anmeldung führt die Meldebehörde das Melderegister fort und erteilt die amtliche Meldebestätigung.", sourceKey: "bmg-6", passageKey: "bmg-6-all", riskLevel: "medium" },
  { key: "not-all-institutions", category: "aftermath", temporal: "current_2026", type: "exception", text: "Die Fortschreibung des Melderegisters erledigt nicht automatisch jede Adressänderung bei Bank, Arbeitgeber, Krankenkasse oder sonstigen Stellen.", sourceKey: "bmg-6", passageKey: "bmg-6-all", riskLevel: "high" },
  { key: "anmeldung-not-tax-residence", category: "aftermath", temporal: "current_2026", type: "exception", text: "Die Anmeldung bestimmt nicht automatisch die steuerliche Ansässigkeit und ersetzt nicht das Steuer-Identifikationsnummer-Verfahren.", sourceKey: "bmg-17", passageKey: "bmg-17-1", riskLevel: "high" },
  { key: "anmeldung-not-health-insurance", category: "aftermath", temporal: "current_2026", type: "exception", text: "Die Anmeldung begründet nicht automatisch die Mitgliedschaft in der gesetzlichen Krankenversicherung.", sourceKey: "bmg-17", passageKey: "bmg-17-1", riskLevel: "high" },
  { key: "anmeldung-not-social-benefit", category: "aftermath", temporal: "current_2026", type: "exception", text: "Die Anmeldung begründet nicht automatisch einen Sozialleistungsanspruch.", sourceKey: "bmg-17", passageKey: "bmg-17-1", riskLevel: "high" },
  { key: "anmeldung-not-jobcenter", category: "aftermath", temporal: "current_2026", type: "exception", text: "Die Anmeldung bestimmt nicht automatisch die Zuständigkeit des Jobcenters und ist nicht das Grundsicherungsgeldverfahren.", sourceKey: "bmg-17", passageKey: "bmg-17-1", riskLevel: "high" },
  { key: "anmeldung-not-agentur", category: "aftermath", temporal: "current_2026", type: "exception", text: "Die Anmeldung bestimmt nicht automatisch die Zuständigkeit der Agentur für Arbeit und ist nicht das Arbeitslosengeldverfahren.", sourceKey: "bmg-17", passageKey: "bmg-17-1", riskLevel: "high" },
  { key: "anmeldung-not-kindergeld", category: "aftermath", temporal: "current_2026", type: "exception", text: "Die Anmeldung ist nicht der Kindergeldantrag und ersetzt nicht das Verfahren der Familienkasse.", sourceKey: "bmg-17", passageKey: "bmg-17-1", riskLevel: "high" },
  { key: "success-not-always-meldebescheinigung", category: "aftermath", temporal: "current_2026", type: "exception", text: "Nach erfolgreicher Anmeldung erhalten Betroffene die Meldebestätigung. Nicht jede spätere Stelle verlangt deshalb eine gesondert beantragte Meldebescheinigung.", sourceKey: "bmg-18", passageKey: "bmg-18-1", riskLevel: "high" },
  { key: "meldebestaetigung-not-bescheinigung", category: "aftermath", temporal: "current_2026", type: "exception", text: "Die amtliche Meldebestätigung nach § 24 BMG ist nicht dieselbe Urkunde wie die auf Antrag erteilte Meldebescheinigung nach § 18 BMG.", sourceKey: "bmg-24", passageKey: "bmg-24-2", riskLevel: "high" },
  { key: "late-still-register", category: "problems", temporal: "current_2026", type: "duty", text: "Eine verspätete Anmeldung beendet die Meldepflicht nicht. Wer die Frist versäumt hat, muss die Anmeldung gleichwohl nachholen.", sourceKey: "bmg-17", passageKey: "bmg-17-1", riskLevel: "high" },
  { key: "specific-fine-fail-closed", category: "problems", temporal: "current_2026", type: "exception", text: "Ein individueller Bußgeldbetrag für eine verspätete Anmeldung darf ohne den konkreten Bescheid der zuständigen Behörde nicht bestimmt werden.", sourceKey: "bmg-54", passageKey: "bmg-54", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "correction-via-authority", category: "correction", temporal: "current_2026", type: "procedure", text: "Unrichtige oder unvollständige Meldedaten sind bei der Meldebehörde berichtigen oder vervollständigen zu lassen.", sourceKey: "bmg-6", passageKey: "bmg-6-all", riskLevel: "high" },
  { key: "correction-not-new-anmeldung", category: "correction", temporal: "current_2026", type: "exception", text: "Ein Fehler in bereits gespeicherten Meldedaten ist nicht automatisch durch eine neue Anmeldung zu beheben. Der gesetzliche Weg ist die Berichtigung durch die Meldebehörde.", sourceKey: "bmg-12", passageKey: "bmg-12-all", riskLevel: "high" },
  { key: "short-stay-not-never", category: "exceptions", temporal: "current_2026", type: "exception", text: "Ein kurzer Aufenthalt bedeutet nicht in jedem Fall, dass keine Anmeldung erforderlich ist. Es kommt auf Inlandsmeldung, Auslandswohnsitz und gesetzliche Ausnahmen an.", sourceKey: "bmg-27", passageKey: "bmg-27-2", riskLevel: "high" },
  { key: "assigned-accommodation-no-27-2", category: "exceptions", temporal: "current_2026", type: "exception", text: "Die Sechs-Monats-Ausnahme gilt nicht für zugewiesene Aufnahmeeinrichtungen von Asylbewerbern oder sonstigen Ausländern und nicht für verteilte Spätaussiedler.", sourceKey: "bmg-27", passageKey: "bmg-27-3", riskLevel: "high" },
  { key: "hotel-not-ordinary-17", category: "exceptions", temporal: "current_2026", type: "exception", text: "Eine kurzfristige Beherbergung in einer Beherbergungsstätte ist nicht automatisch eine Anmeldung nach § 17 BMG. Es gelten die besonderen Regeln des § 29 BMG.", sourceKey: "bmg-29", passageKey: "bmg-29-all", riskLevel: "high" },
  { key: "hauptwohnung-not-preference", category: "homes", temporal: "current_2026", type: "exception", text: "Die Hauptwohnung ist nicht die beliebig bevorzugte Anschrift. Maßgebend ist die vorwiegend benutzte Wohnung und in Zweifelsfällen der gesetzliche Schwerpunkt der Lebensbeziehungen.", sourceKey: "bmg-21", passageKey: "bmg-21-1-3", riskLevel: "high" },
  { key: "nebenwohnung-not-irrelevant", category: "homes", temporal: "current_2026", type: "exception", text: "Eine Nebenwohnung ist nicht automatisch melderechtlich unbeachtlich. Weitere Wohnungen sind bei An- oder Abmeldung mitzuteilen.", sourceKey: "bmg-21", passageKey: "bmg-21-4", riskLevel: "high" },
  { key: "family-not-infer-custody", category: "family", temporal: "current_2026", type: "exception", text: "Aus gleichen Zuzugsdaten darf keine Sorgerechts- oder Vertretungsentscheidung abgeleitet werden. Ohne Falltatsachen bleibt die Familienanmeldung auf den gemeinsamen Meldeschein beschränkt.", sourceKey: "bmg-23", passageKey: "bmg-23-4", riskLevel: "high" },
  { key: "no-ordinary-dwelling-fail-closed", category: "exceptions", temporal: "current_2026", type: "exception", text: "Ohne feststellbare Wohnung im Sinne des § 20 BMG darf die gewöhnliche Anmeldepflicht nach § 17 nicht vereinfacht angewendet werden.", sourceKey: "bmg-20", passageKey: "bmg-20", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["RESIDENCE_STATE"] },
]);

export const ANMELDUNG_UNITS: readonly UnitSpec[] = Object.freeze([
  ...CANONICAL_UNITS.map(baselineUnit),
  ...GAP_UNITS,
]);

export const ANMELDUNG_ADDED_CLAIM_IDS = Object.freeze(GAP_UNITS.map((unit) => unit.key));

export const ANMELDUNG_PROCESSES = Object.freeze([
  { key: "anmeldung-einordnen", title: "Anmeldung einordnen 2026", trigger: "Gefragt ist, was Anmeldung ist oder ob sie gilt", safeFirstStep: "Bezug, Zwei-Wochen-Frist und den Unterschied zu Abmeldung sowie zu örtlicher Ummeldung erklären.", riskLevel: "high" as const },
  { key: "innerhalb-deutschlands-umziehen", title: "Umzug innerhalb Deutschlands 2026", trigger: "Ein Umzug von einer deutschen Wohnung in eine andere steht an", safeFirstStep: "Die Anmeldung bei der neuen Meldebehörde vorbereiten und keine unnötige Abmeldung der alten Inlandwohnung verlangen.", riskLevel: "high" as const },
  { key: "aus-dem-ausland-zuziehen", title: "Zuzug aus dem Ausland 2026", trigger: "Eine Person kommt aus dem Ausland und bezieht eine Wohnung", safeFirstStep: "Die Anmeldepflicht nach tatsächlichem Einzug erklären und sie nicht von der Staatsangehörigkeit abhängig machen.", riskLevel: "high" as const },
  { key: "anmeldung-vorbereiten", title: "Anmeldung vorbereiten 2026", trigger: "Unterlagen oder der Meldeschein für die Anmeldung sind gefragt", safeFirstStep: "Identitätsnachweis, Wohnungsgeberbestätigung oder Zuordnungsmerkmal und Meldeschein als Bundesanforderungen nennen; örtliche Extra-Dokumente nicht verallgemeinern.", riskLevel: "high" as const },
  { key: "wohnungsgeberbestaetigung", title: "Wohnungsgeberbestätigung beschaffen 2026", trigger: "Die Wohnungsgeberbestätigung fehlt, kommt zu spät oder wird verweigert", safeFirstStep: "Mietvertrag und Bestätigung trennen; bei Verweigerung die Meldebehörde unverzüglich unterrichten und nichts erfinden.", riskLevel: "high" as const },
  { key: "anmeldung-vor-ort", title: "Anmeldung bei der Meldebehörde 2026", trigger: "Die Anmeldung soll persönlich erledigt werden", safeFirstStep: "Die zuständige Meldebehörde der neuen Wohnung nutzen und örtliche Termine nicht als Bundesrecht darstellen.", riskLevel: "medium" as const },
  { key: "elektronische-anmeldung", title: "Elektronische Anmeldung 2026", trigger: "Eine Online-Anmeldung ist angesprochen", safeFirstStep: "Das bundesrechtliche Verfahren erklären und die örtliche Verfügbarkeit live offenhalten.", riskLevel: "high" as const },
  { key: "haupt-nebenwohnung", title: "Haupt- und Nebenwohnung 2026", trigger: "Mehrere Wohnungen oder die Hauptwohnung sind angesprochen", safeFirstStep: "Vorwiegende Nutzung und gesetzliche Zweifelsregeln erklären; keine Wunschanschrift festlegen.", riskLevel: "high" as const },
  { key: "kinder-familie", title: "Anmeldung von Kindern und Familie 2026", trigger: "Kinder unter 16, Neugeborene oder gemeinsame Familiendaten sind angesprochen", safeFirstStep: "Die gesetzliche Anmeldezuständigkeit und den gemeinsamen Meldeschein erklären; Sorgerecht nicht erfinden.", riskLevel: "high" as const },
  { key: "verspaetete-anmeldung", title: "Verspätete Anmeldung 2026", trigger: "Die Zwei-Wochen-Frist ist schon verstrichen", safeFirstStep: "Die Anmeldung nachholen; weder Untätigkeit noch einen konkreten Bußgeldbetrag ableiten.", riskLevel: "high" as const },
  { key: "meldebestaetigung-vs-bescheinigung", title: "Meldebestätigung und Meldebescheinigung 2026", trigger: "Eine Meldebestätigung oder Meldebescheinigung wird verlangt", safeFirstStep: "§ 24 und § 18 unterscheiden und nicht jede Stelle auf eine neue Meldebescheinigung verweisen.", riskLevel: "medium" as const },
  { key: "meldedaten-korrigieren", title: "Fehlerhafte Meldedaten berichtigen 2026", trigger: "Gespeicherte oder bestätigte Meldedaten sind falsch", safeFirstStep: "Die Berichtigung bei der Meldebehörde verlangen und nicht jede Korrektur als neue Anmeldung behandeln.", riskLevel: "high" as const },
  { key: "wegzug-ausland", title: "Wegzug ins Ausland und Abmeldung 2026", trigger: "Die Person verlässt die deutsche Wohnung ohne neue Inlandwohnung", safeFirstStep: "Die Abmeldung innerhalb von zwei Wochen, frühestens eine Woche vorher, schriftlich oder elektronisch erklären.", riskLevel: "high" as const },
  { key: "zustaendige-meldebehoerde", title: "Zuständige Meldebehörde klären 2026", trigger: "Die örtliche Meldebehörde, Berlin, Bremen, Hamburg oder Bremerhaven ist gefragt", safeFirstStep: "Die tatsächliche Wohnung feststellen; Sprache, Land allein oder eine andere Stadt nicht als Zuständigkeit behandeln.", riskLevel: "high" as const },
  { key: "sonder-ausnahmefall", title: "Sonder- und Ausnahmefall erkennen 2026", trigger: "Kurzaufenthalt, Hotel, zugewiesene Unterkunft oder unklare Wohnung ist angesprochen", safeFirstStep: "§ 27 und § 29 von der gewöhnlichen §-17-Pflicht trennen und ohne Wohnungstatsachen fail-closed bleiben.", riskLevel: "high" as const },
]);

export const ANMELDUNG_FORMS = Object.freeze([
  { key: "meldeschein", name: "Meldeschein", identifier: "BMG-Meldeschein", purpose: "Gesetzlicher Meldeschein oder elektronische Datenbestätigung für die Anmeldung", submissionChannels: ["in_person", "online"], sourceKey: "bmg-23", passageKey: "bmg-23-1" },
  { key: "wohnungsgeberbestaetigung", name: "Wohnungsgeberbestätigung", identifier: "BMG-Wohnungsgeberbestaetigung", purpose: "Bestätigung des Wohnungsgebers über den tatsächlichen Einzug", submissionChannels: ["written", "online"], sourceKey: "bmg-19", passageKey: "bmg-19-3" },
  { key: "meldebescheinigung", name: "Meldebescheinigung", identifier: "BMG-Meldebescheinigung", purpose: "Auf Antrag erteilte Meldebescheinigung über gespeicherte Meldeangaben", submissionChannels: ["written", "online"], sourceKey: "bmg-18", passageKey: "bmg-18-1" },
]);

type BindingSpec = Readonly<{
  processKey: string;
  role: AnmeldungProcessRole;
  sequenceContext: string;
  claimKeys: readonly string[];
  qualificationRequired?: boolean;
}>;

export const ANMELDUNG_PROCESS_BINDINGS: readonly BindingSpec[] = Object.freeze([
  { processKey: "anmeldung-einordnen", role: "orientation_basis", sequenceContext: "what", claimKeys: ["anmeldung-duty", "definition-wohnung", "melderegister-orientation", "federal-vs-local"] },
  { processKey: "anmeldung-einordnen", role: "deadline_gate", sequenceContext: "when", claimKeys: ["anmeldung-deadline-two-weeks"] },
  { processKey: "anmeldung-einordnen", role: "negative_control", sequenceContext: "not", claimKeys: ["einzug-not-contract-date", "rental-not-already-bezogen", "ummeldung-local-label"] },
  { processKey: "innerhalb-deutschlands-umziehen", role: "application_route", sequenceContext: "how", claimKeys: ["domestic-move-new-registration", "prefilled-meldeschein-at-new-authority"] },
  { processKey: "innerhalb-deutschlands-umziehen", role: "negative_control", sequenceContext: "not", claimKeys: ["domestic-move-new-registration"] },
  { processKey: "aus-dem-ausland-zuziehen", role: "orientation_basis", sequenceContext: "what", claimKeys: ["anmeldung-duty", "identity-and-confirmation", "foreign-resident-three-month-threshold"] },
  { processKey: "aus-dem-ausland-zuziehen", role: "negative_control", sequenceContext: "not", claimKeys: ["nationality-not-exemption", "german-nationality-not-different-deadline", "anmeldung-not-aufenthaltstitel"] },
  { processKey: "anmeldung-vorbereiten", role: "evidence_requirement", sequenceContext: "docs", claimKeys: ["identity-and-confirmation", "electronic-or-meldeschein-model", "landlord-confirmation-contents"] },
  { processKey: "anmeldung-vorbereiten", role: "negative_control", sequenceContext: "docs_not", claimKeys: ["mietvertrag-not-wgb"] },
  { processKey: "wohnungsgeberbestaetigung", role: "evidence_requirement", sequenceContext: "wgb", claimKeys: ["landlord-participation", "landlord-confirmation", "landlord-confirmation-missing-notice", "electronic-landlord-reference"] },
  { processKey: "wohnungsgeberbestaetigung", role: "negative_control", sequenceContext: "wgb_not", claimKeys: ["mietvertrag-not-wgb", "wohnungsgeber-not-always-owner", "do-not-falsify-wgb", "address-access-not-enough"] },
  { processKey: "anmeldung-vor-ort", role: "application_route", sequenceContext: "how", claimKeys: ["identity-and-confirmation", "competence-by-dwelling"] },
  { processKey: "anmeldung-vor-ort", role: "negative_control", sequenceContext: "not", claimKeys: ["appointment-not-federal"] },
  { processKey: "elektronische-anmeldung", role: "application_route", sequenceContext: "online", claimKeys: ["electronic-anmeldung-federal-procedure", "electronic-anmeldung-code-may-replace-confirmation"] },
  { processKey: "elektronische-anmeldung", role: "negative_control", sequenceContext: "online_not", claimKeys: ["electronic-not-every-municipality", "opening-hours-are-live"] },
  { processKey: "haupt-nebenwohnung", role: "orientation_basis", sequenceContext: "homes", claimKeys: ["multiple-residences-main-home", "multiple-residences-secondary-home", "multiple-residences-notification", "main-home-change-notification", "main-home-special-case-context"] },
  { processKey: "haupt-nebenwohnung", role: "negative_control", sequenceContext: "homes_not", qualificationRequired: true, claimKeys: ["hauptwohnung-not-preference", "nebenwohnung-not-irrelevant"] },
  { processKey: "kinder-familie", role: "orientation_basis", sequenceContext: "family", claimKeys: ["under-16-registration-responsibility", "newborn-registration-if-other-dwelling", "family-common-meldeschein"] },
  { processKey: "kinder-familie", role: "negative_control", sequenceContext: "family_not", claimKeys: ["family-not-infer-custody"] },
  { processKey: "verspaetete-anmeldung", role: "deadline_gate", sequenceContext: "late", claimKeys: ["late-anmeldung-offence", "ordinary-registration-fine-framework", "late-still-register"] },
  { processKey: "verspaetete-anmeldung", role: "negative_control", sequenceContext: "late_not", qualificationRequired: true, claimKeys: ["specific-fine-fail-closed"] },
  { processKey: "meldebestaetigung-vs-bescheinigung", role: "next_state", sequenceContext: "after", claimKeys: ["official-meldebestätigung", "meldebescheinigung-on-request", "register-updated"] },
  { processKey: "meldebestaetigung-vs-bescheinigung", role: "negative_control", sequenceContext: "after_not", claimKeys: ["meldebestaetigung-not-bescheinigung", "success-not-always-meldebescheinigung"] },
  { processKey: "meldedaten-korrigieren", role: "application_route", sequenceContext: "fix", claimKeys: ["correction-via-authority", "cooperation-duties-on-authority-request"] },
  { processKey: "meldedaten-korrigieren", role: "negative_control", sequenceContext: "fix_not", claimKeys: ["correction-not-new-anmeldung"] },
  { processKey: "wegzug-ausland", role: "application_route", sequenceContext: "abroad", claimKeys: ["abmeldung-duty-no-new-domestic-home", "abmeldung-deadline-two-weeks", "abmeldung-earliest-one-week", "abmeldung-abroad-written-or-electronic"] },
  { processKey: "zustaendige-meldebehoerde", role: "orientation_basis", sequenceContext: "where", claimKeys: ["competence-by-dwelling", "federal-vs-local"] },
  { processKey: "zustaendige-meldebehoerde", role: "negative_control", sequenceContext: "where_not", qualificationRequired: true, claimKeys: ["userlocale-not-jurisdiction", "language-not-jurisdiction", "land-alone-not-enough", "no-locality-no-authority", "berlin-not-bremen-not-hamburg", "bremen-not-bremerhaven"] },
  { processKey: "sonder-ausnahmefall", role: "orientation_basis", sequenceContext: "exception", claimKeys: ["temporary-stay-exception", "temporary-stay-six-month-threshold", "foreign-resident-three-month-threshold"] },
  { processKey: "sonder-ausnahmefall", role: "negative_control", sequenceContext: "exception_not", qualificationRequired: true, claimKeys: ["short-stay-not-never", "assigned-accommodation-no-27-2", "hotel-not-ordinary-17", "no-ordinary-dwelling-fail-closed"] },
  { processKey: "anmeldung-einordnen", role: "next_state", sequenceContext: "downstream", claimKeys: ["not-all-institutions", "anmeldung-not-tax-residence", "anmeldung-not-health-insurance", "anmeldung-not-social-benefit", "anmeldung-not-jobcenter", "anmeldung-not-agentur", "anmeldung-not-kindergeld"] },
  { processKey: "aus-dem-ausland-zuziehen", role: "context_gate", sequenceContext: "status", qualificationRequired: true, claimKeys: ["immigration-fail-closed", "eu-not-immigration-from-anmeldung", "anmeldung-not-work-permit"] },
]);

export const ANMELDUNG_PROCESS_SCENARIOS: readonly AnmeldungProcessScenario[] = Object.freeze([
  { id: "first-german-wohnung", label: "Erste Wohnung in Deutschland", coverage: "COVERED" as const, requiredClaimKeys: ["anmeldung-duty", "anmeldung-deadline-two-weeks"], requiredProcessKeys: ["anmeldung-einordnen"] },
  { id: "domestic-move", label: "Umzug innerhalb Deutschlands", coverage: "COVERED" as const, requiredClaimKeys: ["domestic-move-new-registration"], requiredProcessKeys: ["innerhalb-deutschlands-umziehen"] },
  { id: "arrival-from-abroad", label: "Zuzug aus dem Ausland", coverage: "COVERED" as const, requiredClaimKeys: ["anmeldung-duty", "nationality-not-exemption"], requiredProcessKeys: ["aus-dem-ausland-zuziehen"] },
  { id: "temporary-second-home", label: "Bereits Gemeldete weitere Wohnung vorübergehend", coverage: "COVERED" as const, requiredClaimKeys: ["temporary-stay-exception", "short-stay-not-never"], requiredProcessKeys: ["sonder-ausnahmefall"] },
  { id: "foreign-resident-temporary", label: "Auslandswohnsitz vorübergehender Aufenthalt", coverage: "COVERED" as const, requiredClaimKeys: ["foreign-resident-three-month-threshold", "short-stay-not-never"], requiredProcessKeys: ["sonder-ausnahmefall"] },
  { id: "hauptwohnung", label: "Hauptwohnung", coverage: "COVERED" as const, requiredClaimKeys: ["multiple-residences-main-home", "hauptwohnung-not-preference"], requiredProcessKeys: ["haupt-nebenwohnung"] },
  { id: "nebenwohnung", label: "Nebenwohnung", coverage: "COVERED" as const, requiredClaimKeys: ["multiple-residences-secondary-home", "nebenwohnung-not-irrelevant"], requiredProcessKeys: ["haupt-nebenwohnung"] },
  { id: "family-registration", label: "Familienanmeldung", coverage: "COVERED" as const, requiredClaimKeys: ["family-common-meldeschein", "family-not-infer-custody"], requiredProcessKeys: ["kinder-familie"] },
  { id: "child-under-16", label: "Kind unter 16 Jahren", coverage: "COVERED" as const, requiredClaimKeys: ["under-16-registration-responsibility"], requiredProcessKeys: ["kinder-familie"] },
  { id: "newborn", label: "Neugeborenes", coverage: "COVERED" as const, requiredClaimKeys: ["newborn-registration-if-other-dwelling"], requiredProcessKeys: ["kinder-familie"] },
  { id: "missing-wgb", label: "Fehlende Wohnungsgeberbestätigung", coverage: "COVERED" as const, requiredClaimKeys: ["landlord-confirmation-missing-notice", "do-not-falsify-wgb"], requiredProcessKeys: ["wohnungsgeberbestaetigung"], requiredFormIdentifiers: ["BMG-Wohnungsgeberbestaetigung"] },
  { id: "wgb-refusal", label: "Verweigerte Wohnungsgeberbestätigung", coverage: "COVERED" as const, requiredClaimKeys: ["landlord-confirmation-missing-notice", "do-not-falsify-wgb"], requiredProcessKeys: ["wohnungsgeberbestaetigung"] },
  { id: "online-available", label: "Elektronische Anmeldung bundesrechtlich möglich", coverage: "COVERED" as const, requiredClaimKeys: ["electronic-anmeldung-federal-procedure"], requiredProcessKeys: ["elektronische-anmeldung"] },
  { id: "online-not-local", label: "Örtlich kein gleicher Online-Weg", coverage: "COVERED" as const, requiredClaimKeys: ["electronic-not-every-municipality"], requiredProcessKeys: ["elektronische-anmeldung"] },
  { id: "late-anmeldung", label: "Verspätete Anmeldung", coverage: "COVERED" as const, requiredClaimKeys: ["late-still-register", "ordinary-registration-fine-framework"], requiredProcessKeys: ["verspaetete-anmeldung"] },
  { id: "wrong-data", label: "Falsche Meldedaten", coverage: "COVERED" as const, requiredClaimKeys: ["correction-via-authority", "correction-not-new-anmeldung"], requiredProcessKeys: ["meldedaten-korrigieren"] },
  { id: "move-abroad", label: "Wegzug ins Ausland", coverage: "COVERED" as const, requiredClaimKeys: ["abmeldung-duty-no-new-domestic-home", "abmeldung-abroad-written-or-electronic"], requiredProcessKeys: ["wegzug-ausland"] },
  { id: "short-term-accommodation", label: "Kurzfristige Beherbergung", coverage: "COVERED" as const, requiredClaimKeys: ["hotel-not-ordinary-17"], requiredProcessKeys: ["sonder-ausnahmefall"] },
  { id: "residence-unclear", label: "Wohnung unklar", coverage: "COVERED" as const, requiredClaimKeys: ["no-ordinary-dwelling-fail-closed", "definition-wohnung"], requiredProcessKeys: ["sonder-ausnahmefall"] },
  { id: "immigration-status", label: "Ausländerrechtliche Statusfrage", coverage: "COVERED" as const, requiredClaimKeys: ["anmeldung-not-aufenthaltstitel", "immigration-fail-closed"], requiredProcessKeys: ["aus-dem-ausland-zuziehen"] },
  { id: "authority-unresolved", label: "Meldebehörde unbestimmt", coverage: "COVERED" as const, requiredClaimKeys: ["no-locality-no-authority", "userlocale-not-jurisdiction"], requiredProcessKeys: ["zustaendige-meldebehoerde"] },
  { id: "berlin", label: "Berlin", coverage: "COVERED" as const, requiredClaimKeys: ["berlin-not-bremen-not-hamburg", "competence-by-dwelling"], requiredProcessKeys: ["zustaendige-meldebehoerde"] },
  { id: "bremen-stadt", label: "Stadtgemeinde Bremen", coverage: "COVERED" as const, requiredClaimKeys: ["bremen-not-bremerhaven", "competence-by-dwelling"], requiredProcessKeys: ["zustaendige-meldebehoerde"] },
  { id: "bremerhaven-rejection", label: "Bremerhaven nicht Bremen", coverage: "COVERED" as const, requiredClaimKeys: ["bremen-not-bremerhaven"], requiredProcessKeys: ["zustaendige-meldebehoerde"] },
  { id: "hamburg", label: "Hamburg", coverage: "COVERED" as const, requiredClaimKeys: ["berlin-not-bremen-not-hamburg"], requiredProcessKeys: ["zustaendige-meldebehoerde"] },
  { id: "fictitious-address", label: "Scheinanschrift", coverage: "COVERED" as const, requiredClaimKeys: ["fictitious-address-prohibition", "address-access-not-enough"], requiredProcessKeys: ["wohnungsgeberbestaetigung"] },
  { id: "meldebestätigung-request", label: "Meldebestätigung", coverage: "COVERED" as const, requiredClaimKeys: ["official-meldebestätigung", "meldebestaetigung-not-bescheinigung"], requiredProcessKeys: ["meldebestaetigung-vs-bescheinigung"] },
  { id: "meldebescheinigung-request", label: "Meldebescheinigung", coverage: "COVERED" as const, requiredClaimKeys: ["meldebescheinigung-on-request", "success-not-always-meldebescheinigung"], requiredProcessKeys: ["meldebestaetigung-vs-bescheinigung"], requiredFormIdentifiers: ["BMG-Meldebescheinigung"] },
  { id: "documents-federal", label: "Bundesrechtlich erforderliche Unterlagen", coverage: "COVERED" as const, requiredClaimKeys: ["identity-and-confirmation", "mietvertrag-not-wgb"], requiredProcessKeys: ["anmeldung-vorbereiten"], requiredFormIdentifiers: ["BMG-Meldeschein"] },
  { id: "in-person", label: "Persönliche Anmeldung", coverage: "COVERED" as const, requiredClaimKeys: ["identity-and-confirmation", "appointment-not-federal"], requiredProcessKeys: ["anmeldung-vor-ort"] },
  { id: "einzug-vs-contract", label: "Einzug ist nicht Vertragsdatum", coverage: "COVERED" as const, requiredClaimKeys: ["einzug-not-contract-date", "rental-not-already-bezogen"], requiredProcessKeys: ["anmeldung-einordnen"] },
  { id: "downstream-boundaries", label: "Nachgelagerte Domänengrenzen", coverage: "COVERED" as const, requiredClaimKeys: ["anmeldung-not-tax-residence", "anmeldung-not-health-insurance", "anmeldung-not-jobcenter"], requiredProcessKeys: ["anmeldung-einordnen"] },
  { id: "full-beherbergungsrecht", label: "Vollständiges Beherbergungsstättenrecht", coverage: "OUT_OF_SCOPE" as const, requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur die Grenze zu § 17; kein vollständiges §-29-Verfahren." },
  { id: "full-asylum-reception", label: "Vollständige Aufnahmeeinrichtungsanmeldung", coverage: "OUT_OF_SCOPE" as const, requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur die Ausnahmegrenze des § 27 Absatz 3." },
  { id: "full-custody", label: "Vollständige Sorgerechtsprüfung", coverage: "OUT_OF_SCOPE" as const, requiredClaimKeys: [], requiredProcessKeys: [], note: "Keine Sorgerechtsentscheidung aus der Anmeldung." },
  { id: "hardcoded-hours", label: "Festgeschriebene Öffnungszeiten", coverage: "OUT_OF_SCOPE" as const, requiredClaimKeys: [], requiredProcessKeys: [], note: "Öffnungszeiten sind live und örtlich." },
  { id: "individual-fine", label: "Individueller Bußgeldbetrag", coverage: "OUT_OF_SCOPE" as const, requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur der gesetzliche Rahmen; kein Einzelfallbetrag." },
  { id: "full-steuer-id", label: "Vollständiges Steuer-ID-Verfahren", coverage: "OUT_OF_SCOPE" as const, requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Domänengrenze." },
  { id: "full-downstream-benefits", label: "Vollständige Sozial- und Versicherungsdomänen", coverage: "OUT_OF_SCOPE" as const, requiredClaimKeys: [], requiredProcessKeys: [], note: "Krankenkasse, Jobcenter, Agentur und Kindergeld bleiben eigene Pakete." },
]);

const CONTEXT_GATE_POLICIES = Object.freeze([
  { sourceKey: "bmg-1", informationClass: "PROCESS_IDENTITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["BUNDESLAND"] as const, riskClass: "HIGH" },
  { sourceKey: "bmg-17", informationClass: "PROCESS_IDENTITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["COUNTRY", "PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "bmg-21", informationClass: "ELIGIBILITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["RESIDENCE_STATE"] as const, riskClass: "HIGH" },
  { sourceKey: "bmg-27", informationClass: "DEADLINE" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["EVENT_DATE", "RESIDENCE_STATE"] as const, riskClass: "HIGH" },
  { sourceKey: "bmg-54", informationClass: "REQUIRED_EVIDENCE" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "bmg-20", informationClass: "PROCESS_IDENTITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["RESIDENCE_STATE"] as const, riskClass: "HIGH" },
]);

export function evaluateAnmeldungProcessCompleteness(
  pack: CuratedDomainPack,
  units: readonly UnitSpec[] = ANMELDUNG_UNITS,
) {
  const claimByKey = new Map(pack.claims.map((claim) => [String(claim.key), claim]));
  const processByKey = new Map(pack.processes.map((process) => [String(process.key), process]));
  const formIds = new Set(pack.forms.map((form) => String(form.identifier)));
  const rows = ANMELDUNG_PROCESS_SCENARIOS.map((scenario) => {
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

export function buildAnmeldungFederalCorePack(): CuratedDomainPack {
  const item = factory(ANMELDUNG_PACK_ID);
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
    bund: item("publishers", "bundesportal", {
      name: "Bundesportal",
      type: "federal_service_portal",
      territorialScopeId: scope.id,
      trustDomainId: trustDomain.id,
    }),
  };
  const authorities = {
    bmi: item("authorities", "bundesministerium-inneres", {
      publisherId: publishers.bmj.id,
      name: "Bundesministerium des Innern",
      type: "federal_ministry",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://www.gesetze-im-internet.de/bmg/BJNR108410013.html",
    }),
    bmj: item("authorities", "bundesamt-fuer-justiz", {
      publisherId: publishers.bmj.id,
      name: "Bundesamt für Justiz",
      type: "federal_publication",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://www.gesetze-im-internet.de/bmg/BJNR108410013.html",
    }),
  };

  const sources = ANMELDUNG_OFFICIAL_SOURCES.map((spec) => {
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
      supportsClaimTypes: ["definition", "duty", "procedure", "deadline", "exception", "sanction"],
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

  const claims = ANMELDUNG_UNITS.map((unit) => {
    const source = sourceByKey.get(unit.sourceKey);
    const passage = passageByKey.get(unit.passageKey);
    if (!source || !passage) throw new Error(`ANMELDUNG_UNIT_SOURCE_MISSING:${unit.key}`);
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
    if (!source) throw new Error(`ANMELDUNG_CONTEXT_POLICY_SOURCE_MISSING:${spec.sourceKey}`);
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

  const processes = ANMELDUNG_PROCESSES.map((spec) => item("processes", spec.key, {
    processGroupId: ANMELDUNG_DOMAIN,
    title: spec.title,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
    riskLevel: spec.riskLevel,
    trigger: spec.trigger,
    safeFirstStep: spec.safeFirstStep,
    regionalVariationExpected: spec.key === "zustaendige-meldebehoerde"
      || spec.key === "elektronische-anmeldung"
      || spec.key === "anmeldung-vor-ort",
  }));
  const processByKey = new Map(processes.map((process) => [String(process.key), process]));
  const claimByKey = new Map(claims.map(({ claim }) => [String(claim.key), claim]));
  const processClaimLinks = ANMELDUNG_PROCESS_BINDINGS.flatMap((binding) => {
    const process = processByKey.get(binding.processKey);
    if (!process) throw new Error(`ANMELDUNG_PROCESS_MISSING:${binding.processKey}`);
    return binding.claimKeys.map((claimKey) => {
      const claim = claimByKey.get(claimKey);
      if (!claim) throw new Error(`ANMELDUNG_PROCESS_CLAIM_MISSING:${binding.processKey}:${claimKey}`);
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

  const inspectRule = item("actorRules", "inspect-anmeldung-facts", {
    actorState: "inspect_anmeldung_facts_before_local_authority",
    userMustAct: true,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const competenceRule = item("actorRules", "competent-meldebehoerde-undetermined", {
    actorState: "competent_meldebehoerde_undetermined_without_locality",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const immigrationRule = item("actorRules", "immigration-status-undetermined", {
    actorState: "immigration_status_undetermined_from_anmeldung_alone",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const fineRule = item("actorRules", "individual-fine-undetermined", {
    actorState: "individual_anmeldung_fine_undetermined",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const homeRule = item("actorRules", "hauptwohnung-undetermined", {
    actorState: "hauptwohnung_undetermined_without_residence_facts",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });

  const forms = ANMELDUNG_FORMS.map((spec) => {
    const source = sourceByKey.get(spec.sourceKey);
    const passage = passageByKey.get(spec.passageKey);
    if (!source || !passage) throw new Error(`ANMELDUNG_FORM_SOURCE_MISSING:${spec.key}`);
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
    packId: ANMELDUNG_PACK_ID,
    domain: ANMELDUNG_DOMAIN,
    canonicalLanguage: ANMELDUNG_CANONICAL_LANGUAGE,
    trustDomain,
    jurisdictions: [jurisdiction],
    territorialScopes: [scope],
    publishers: [publishers.bmj, publishers.bund],
    authorities: [authorities.bmi, authorities.bmj],
    sources: sources.map(({ source }) => source),
    sourceVersions: sources.map(({ version }) => version),
    passages: sources.flatMap(({ passages }) => passages),
    claims: claims.map(({ claim }) => claim),
    evidenceLinks: claims.map(({ evidence }) => evidence),
    citations: claims.map(({ citation }) => citation),
    actorRules: [inspectRule, competenceRule, immigrationRule, fineRule, homeRule],
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

export function anmeldungPackSummary(pack: CuratedDomainPack = buildAnmeldungFederalCorePack()) {
  const completeness = evaluateAnmeldungProcessCompleteness(pack);
  return Object.freeze({
    domain: pack.domain,
    packId: pack.packId,
    canonicalLanguage: pack.canonicalLanguage,
    claimCount: pack.claims.length,
    baselineClaimCount: ANMELDUNG_BASELINE_CLAIM_IDS.length,
    addedClaimCount: ANMELDUNG_ADDED_CLAIM_IDS.length,
    sourceCount: pack.sources.length,
    processCount: pack.processes.length,
    processClaimLinkCount: pack.processClaimLinks.length,
    formCount: pack.forms.length,
    current2026Count: ANMELDUNG_UNITS.length,
    futureWatchCount: ANMELDUNG_FUTURE_CHANGE_WATCH_ITEMS.length,
    g3ProcessStepLimitation: ANMELDUNG_G3_PROCESS_STEP_LIMITATION,
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