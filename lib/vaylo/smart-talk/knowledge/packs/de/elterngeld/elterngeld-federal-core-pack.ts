/**
 * KNOWLEDGE-EXPANSION — German federal Elterngeld process-complete core.
 * Official-source G3 CuratedDomainPack for domain elterngeld.
 * Canonical language is German only. Not a runtime route.
 *
 * This pack is the BEEG Elterngeld lifecycle. It does not replace
 * familienkasse_kindergeld, health_insurance_orientation, arbeitslosengeld,
 * jobcenter_buergergeld, einkommensteuer_steuererklaerung or
 * auslaenderbehoerde_limited_orientation and does not implement a
 * personalized calculator or Elternzeit employment-law engine.
 */
import { createHash } from "node:crypto";

import {
  KNOWLEDGE_FACTORY_SCHEMA_VERSION,
  stableKnowledgeFactoryId,
  type CuratedDomainPack,
} from "../../../source-registry/knowledge-factory-contracts";

export const ELG_DOMAIN = "elterngeld" as const;
export const ELG_PACK_ID = ELG_DOMAIN;
export const ELG_CANONICAL_LANGUAGE = "de" as const;

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

export type ElgUnitCategory =
  | "legal_system"
  | "eligibility"
  | "status"
  | "threshold"
  | "variant"
  | "amount"
  | "bemessung"
  | "lebensmonat"
  | "duration"
  | "special"
  | "maternity"
  | "benefits"
  | "application"
  | "provisional"
  | "decision"
  | "remedy"
  | "jurisdiction"
  | "cross_border"
  | "tax"
  | "boundary";

export type ElgContextKey = "EVENT_DATE" | "PROCESS_VARIANT" | "COUNTRY" | "RESIDENCE_STATE" | "WORK_STATE";
export type ElgHandlingMode =
  | "STORE_CANONICALLY"
  | "CACHE_AND_REVALIDATE"
  | "FETCH_LIVE"
  | "MANUAL_REVIEW_REQUIRED"
  | "DO_NOT_ANSWER_WITHOUT_CONTEXT";
export type ElgFreshnessClass = "LEGAL_CHANGE_MONITORED" | "MONTHLY" | "EVENT_DRIVEN";
export type ElgStaleBehavior = "DO_NOT_USE_STALE" | "REVALIDATE_BEFORE_USE";
export type ElgInformationClass =
  | "LEGAL_BASELINE"
  | "PROCESS_IDENTITY"
  | "AUTHORITY_COMPETENCE"
  | "ELIGIBILITY"
  | "DEADLINE"
  | "REQUIRED_EVIDENCE"
  | "FORM_URL"
  | "ONLINE_SERVICE_URL"
  | "SANCTION";
export type ElgProcessRole =
  | "orientation_basis"
  | "required_information"
  | "identification"
  | "application_route"
  | "evidence_requirement"
  | "next_state"
  | "deadline_gate"
  | "decision"
  | "legal_remedy_gate"
  | "context_gate"
  | "negative_control";
export type ElgScenarioCoverage =
  | "COVERED"
  | "EXPLICITLY_OUT_OF_SCOPE"
  | "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE";

export const ELG_G3_PROCESS_STEP_LIMITATION =
  "G3 CuratedDomainPack and knowledge_ingest_curated_domain_pack persist processes and process_claim_links with process_step_id null; knowledge_process_steps are not ingestible without a later factory extension.";

export type ElgTemporalClass = "current_2026";

export type ElgFutureChangeWatchItem = Readonly<{
  id: string;
  key: string;
  officialSourceUrl: string;
  officialDomain: string;
  officialSourceTitle: string;
  targetYear: 2026 | 2027 | 2028;
  status: "future_change_watch_not_ingestible";
  currentGuidance: false;
  description: string;
}>;

type OfficialSourceSpec = Readonly<{
  key: string;
  publisherKey: "bmj" | "bmfsfj";
  authorityKey: "bmj" | "bmfsfj";
  url: string;
  officialDomain: string;
  title: string;
  sourceClass: "FEDERAL_LAW" | "FEDERAL_REGULATION" | "FEDERAL_ADMINISTRATIVE_GUIDANCE" | "EU_LAW" | "FEDERAL_SERVICE_PORTAL";
  sourceType: "federal_statute" | "federal_guidance" | "authority_portal";
  retrievalMethod: "HTML_DOCUMENT";
  informationClass: ElgInformationClass;
  handlingMode: ElgHandlingMode;
  freshnessClass: ElgFreshnessClass;
  staleBehavior: ElgStaleBehavior;
  requiredContextKeys: readonly ElgContextKey[];
  passages: readonly Readonly<{ key: string; locator: string; text: string }>[];
}>;

type UnitSpec = Readonly<{
  key: string;
  category: ElgUnitCategory;
  temporal: ElgTemporalClass;
  type: "duty" | "deadline" | "definition" | "procedure" | "exception";
  text: string;
  sourceKey: string;
  passageKey: string;
  riskLevel: "low" | "medium" | "high";
  requiresEffectiveDate?: true;
  requiresAuthorityResolution?: true;
  requiredContextKeys?: readonly ElgContextKey[];
}>;

type ElgProcessSpec = Readonly<{
  key: string;
  title: string;
  trigger: string;
  safeFirstStep: string;
  riskLevel: "low" | "medium" | "high";
}>;

type ElgFormSpec = Readonly<{
  key: string;
  name: string;
  identifier: string;
  purpose: string;
  submissionChannels: readonly string[];
  sourceKey: string;
  passageKey: string;
}>;

type ElgBindingSpec = Readonly<{
  processKey: string;
  role: ElgProcessRole;
  sequenceContext: string;
  claimKeys: readonly string[];
}>;

type ElgProcessScenario = Readonly<{
  id: string;
  label: string;
  coverage: ElgScenarioCoverage;
  requiredClaimKeys: readonly string[];
  requiredProcessKeys: readonly string[];
  requiredFormIdentifiers?: readonly string[];
  note?: string;
}>;

export const ELG_FUTURE_WATCH_SOURCE = Object.freeze({
  url: "https://www.gesetze-im-internet.de/beeg/__28.html",
  officialDomain: "www.gesetze-im-internet.de",
  title: "BEEG § 28 Übergangsvorschrift",
});

export const ELG_FUTURE_CHANGE_WATCH_ITEMS: readonly ElgFutureChangeWatchItem[] = Object.freeze([
  {
    id: "elg-legacy-200k-threshold",
    key: "legacy-200k-threshold-pre-2025-04-01",
    officialSourceUrl: ELG_FUTURE_WATCH_SOURCE.url,
    officialDomain: ELG_FUTURE_WATCH_SOURCE.officialDomain,
    officialSourceTitle: ELG_FUTURE_WATCH_SOURCE.title,
    targetYear: 2026,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "LEGACY: Die 200.000-Euro-Grenze des § 1 Absatz 8 BEEG gilt nur für Geburten oder Adoptionsaufnahmen vom 1. April 2024 bis vor dem 1. April 2025 und ist nicht heutige Schwelle für Geburten 2026.",
  },
  {
    id: "elg-legacy-older-income-caps",
    key: "legacy-300k-250k-thresholds",
    officialSourceUrl: ELG_FUTURE_WATCH_SOURCE.url,
    officialDomain: ELG_FUTURE_WATCH_SOURCE.officialDomain,
    officialSourceTitle: ELG_FUTURE_WATCH_SOURCE.title,
    targetYear: 2026,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "LEGACY: Frühere Schwellen von 300.000 oder 250.000 Euro sind nicht heutiges Recht für neue Geburten.",
  },
  {
    id: "elg-future-watch-beeg-amendments",
    key: "future-beeg-amendments",
    officialSourceUrl: "https://www.gesetze-im-internet.de/beeg/__1.html",
    officialDomain: "www.gesetze-im-internet.de",
    officialSourceTitle: "BEEG § 1 Berechtigte",
    targetYear: 2027,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "Nur vorgeschlagene oder noch nicht geltende BEEG-Änderungen sind nicht heutiges Elterngeldrecht.",
  },
  {
    id: "elg-future-watch-digital-procedure",
    key: "future-digital-elterngeld-procedure",
    officialSourceUrl: "https://www.familienportal.de/familienportal/familienleistungen/elterngeld",
    officialDomain: "www.familienportal.de",
    officialSourceTitle: "Familienportal Elterngeld",
    targetYear: 2027,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "Künftige landeseinheitliche Digitalverfahren ersetzen nicht die geltende schriftliche Antragspflicht nach § 7 BEEG.",
  },
]);

export const ELG_OFFICIAL_SOURCES: readonly OfficialSourceSpec[] = Object.freeze([
  { key: "beeg-1", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/beeg/__1.html", officialDomain: "www.gesetze-im-internet.de", title: "BEEG § 1 Berechtigte", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "ELIGIBILITY", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: ["PROCESS_VARIANT"], passages: [{ key: "beeg-1-all", locator: "§ 1", text: "Anspruch hat, wer Wohnsitz oder gewöhnlichen Aufenthalt in Deutschland hat, mit dem Kind in einem Haushalt lebt, es selbst betreut und erzieht und keine volle Erwerbstätigkeit ausübt. Nicht voll erwerbstätig ist, wer im Durchschnitt des Lebensmonats höchstens 32 Wochenstunden arbeitet. Bei Mehrlingen besteht nur ein Anspruch. Ein nicht freizügigkeitsberechtigter Ausländer ist nur nach den genau bezeichneten Titeln und Bedingungen des Absatzes 7 berechtigt. Der Anspruch entfällt bei zu versteuerndem Einkommen über 175000 Euro im letzten abgeschlossenen Veranlagungszeitraum vor der Geburt; bei einer weiteren berechtigten Person gilt die Summe." }] },
  { key: "beeg-2", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/beeg/__2.html", officialDomain: "www.gesetze-im-internet.de", title: "BEEG § 2 Höhe", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "beeg-2-all", locator: "§ 2", text: "Elterngeld beträgt 67 Prozent des Einkommens aus Erwerbstätigkeit vor der Geburt, höchstens 1800 Euro monatlich ohne Erwerbseinkommen nach der Geburt, mindestens 300 Euro. Unter 1000 Euro steigt der Satz bis 100 Prozent, über 1200 Euro sinkt er bis 65 Prozent. Bei Einkommen nach der Geburt gilt der Unterschiedsbetrag; vor der Geburt sind höchstens 2770 Euro anzusetzen. Das maßgebliche Einkommen folgt den §§ 2c bis 2f, nicht dem Gehaltszettel-Netto." }] },
  { key: "beeg-2a", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/beeg/__2a.html", officialDomain: "www.gesetze-im-internet.de", title: "BEEG § 2a Geschwisterbonus Mehrlingszuschlag", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "beeg-2a-all", locator: "§ 2a", text: "Der Geschwisterbonus beträgt 10 Prozent, mindestens 75 Euro, wenn zwei Kinder unter drei Jahren oder drei oder mehr Kinder unter sechs Jahren im Haushalt leben. Bei Behinderung gilt die Altersgrenze 14 Jahre. Bei Mehrlingen erhöht sich das Elterngeld um 300 Euro für das zweite und jedes weitere Kind; das schafft keinen zweiten Vollanspruch." }] },
  { key: "beeg-2b", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/beeg/__2b.html", officialDomain: "www.gesetze-im-internet.de", title: "BEEG § 2b Bemessungszeitraum", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: ["EVENT_DATE"], passages: [{ key: "beeg-2b-all", locator: "§ 2b", text: "Für nichtselbständige Arbeit sind grundsätzlich die zwölf Kalendermonate vor dem Geburtsmonat maßgeblich. Bestimmte Monate mit Elterngeld für ein älteres Kind, Mutterschutz, schwangerschaftsbedingter Krankheit oder Wehr- oder Zivildienst bleiben unberücksichtigt, sofern kein Antrag auf Einbeziehung gestellt wird. Selbständige Gewinneinkünfte richten sich nach dem letzten abgeschlossenen steuerlichen Veranlagungszeitraum. Mischeinkünfte können den gesamten Zeitraum in das selbständige Regime verschieben; unter durchschnittlich 35 Euro monatlich kann auf Antrag das Arbeitnehmerregime gelten." }] },
  { key: "beeg-2c", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/beeg/__2c.html", officialDomain: "www.gesetze-im-internet.de", title: "BEEG § 2c Nichtselbständige Arbeit", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "beeg-2c-all", locator: "§ 2c", text: "Einkommen aus nichtselbständiger Erwerbstätigkeit wird nach gesetzlich standardisierten steuerlichen und sozialversicherungsrechtlichen Abzügen ermittelt. Das so bestimmte Elterngeld-Netto ist nicht notwendig der auf der Gehaltsabrechnung ausgewiesene Nettobetrag." }] },
  { key: "beeg-2d", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/beeg/__2d.html", officialDomain: "www.gesetze-im-internet.de", title: "BEEG § 2d Selbständige Erwerbstätigkeit", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "beeg-2d-all", locator: "§ 2d", text: "Maßgeblich sind die positiven Gewinneinkünfte nach Steuerbescheid, vermindert um die gesetzlichen Abzüge. Umsatz oder Betriebseinnahmen sind nicht der Gewinn. Fehlt ein Bescheid, ist eine Gewinnermittlung erforderlich." }] },
  { key: "beeg-3", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/beeg/__3.html", officialDomain: "www.gesetze-im-internet.de", title: "BEEG § 3 Anrechnung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "beeg-3-all", locator: "§ 3", text: "Mutterschaftsgeld, Arbeitgeberzuschuss, vergleichbare beamtenrechtliche Leistungen und bestimmte Ersatzleistungen werden auf das Elterngeld angerechnet, bei Teilmonaten anteilig. Bis 300 Euro bleibt Elterngeld von bestimmter Anrechnung frei, nicht gegenüber Mutterschaftsleistungen. Vergleichbare Auslandsleistungen können den Anspruch ruhend stellen, solange kein Antrag gestellt ist." }] },
  { key: "beeg-4", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/beeg/__4.html", officialDomain: "www.gesetze-im-internet.de", title: "BEEG § 4 Bezugsdauer", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: ["EVENT_DATE"], passages: [{ key: "beeg-4-all", locator: "§ 4", text: "Elterngeld wird für Lebensmonate des Kindes gezahlt. Gemeinsam stehen zwölf Basis-Monatsbeträge zu, bei Einkommensminderung in zwei Lebensmonaten zwei Partnermonate. Ein Elternteil bezieht höchstens zwölf Basis-Monate zuzüglich Partnerschaftsbonus und mindestens zwei Lebensmonate. Basiselterngeld endet regelmäßig mit dem 14. Lebensmonat. Gleichzeitiger Basisbezug beider Eltern ist nur in einem der ersten zwölf Lebensmonate möglich, mit gesetzlichen Ausnahmen. Elterngeld Plus kann bis zum 32. Lebensmonat reichen, wenn es ab dem 15. Lebensmonat lückenlos von wenigstens einem Elternteil bezogen wird. Frühgeburten verlängern den Basisanspruch gestuft um bis zu vier Monate." }] },
  { key: "beeg-4a", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/beeg/__4a.html", officialDomain: "www.gesetze-im-internet.de", title: "BEEG § 4a Basis und Plus", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "beeg-4a-all", locator: "§ 4a", text: "Ein Basis-Monat kann in zwei Elterngeld-Plus-Monate umgewandelt werden. Elterngeld Plus beträgt höchstens die Hälfte des Basiselterngeldes, das ohne Einnahmen nach der Geburt zustünde. Mindestbetrag, Geschwisterbonus-Mindestbetrag, Mehrlingszuschlag und bestimmte Freibeträge halbieren sich." }] },
  { key: "beeg-4b", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/beeg/__4b.html", officialDomain: "www.gesetze-im-internet.de", title: "BEEG § 4b Partnerschaftsbonus", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "beeg-4b-all", locator: "§ 4b", text: "Der Partnerschaftsbonus setzt 24 bis 32 Wochenstunden im Durchschnitt des Lebensmonats bei beiden Eltern voraus. Jeder Elternteil kann zwei bis vier zusätzliche Elterngeld-Plus-Monate gleichzeitig und in aufeinander folgenden Lebensmonaten beziehen. Partnermonate sind nicht der Partnerschaftsbonus." }] },
  { key: "beeg-4c", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/beeg/__4c.html", officialDomain: "www.gesetze-im-internet.de", title: "BEEG § 4c Alleiniger Bezug", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "ELIGIBILITY", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: ["PROCESS_VARIANT"], passages: [{ key: "beeg-4c-all", locator: "§ 4c", text: "Ein Elternteil kann Partnermonate allein beziehen, wenn Entlastungsbetrag für Alleinerziehende vorliegt und der andere Elternteil nicht mit ihm oder dem Kind wohnt, oder bei Kindeswohlgefährdung oder Unmöglichkeit der Betreuung. Unverheiratetsein allein erfüllt diese Voraussetzungen nicht." }] },
  { key: "beeg-7", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/beeg/__7.html", officialDomain: "www.gesetze-im-internet.de", title: "BEEG § 7 Antragstellung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "DEADLINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: ["EVENT_DATE"], passages: [{ key: "beeg-7-all", locator: "§ 7", text: "Elterngeld ist schriftlich zu beantragen. Rückwirkung besteht nur für die letzten drei Lebensmonate vor Beginn des Lebensmonats des Antragseingangs. Änderungen sind bis zum Ende des Bezugszeitraums möglich, rückwirkend nur für die letzten drei Lebensmonate; bereits ausgezahlte Monate sind außer bei Härte oder nachträglicher Umwandlung von Plus in Basis nicht frei änderbar. Eine gewöhnliche E-Mail ist nicht allgemein ausreichend." }] },
  { key: "beeg-8", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/beeg/__8.html", officialDomain: "www.gesetze-im-internet.de", title: "BEEG § 8 Auskunft und Vorläufigkeit", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "PROCESS_IDENTITY", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "beeg-8-all", locator: "§ 8", text: "Wurde voraussichtliches Erwerbseinkommen angegeben, ist das tatsächliche Einkommen nachzuweisen. Zahlung kann unter Widerrufsvorbehalt stehen, wenn kein Einkommen erwartet wurde oder der Steuerbescheid zur Einkommensgrenze fehlt. Die Höhe kann vorläufig festgesetzt werden, wenn Angaben fehlen oder Einkommen nach der Geburt erwartet wird. Eine Zahlung ist nicht notwendig der endgültige Betrag." }] },
  { key: "beeg-9", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/beeg/__9.html", officialDomain: "www.gesetze-im-internet.de", title: "BEEG § 9 Arbeitgeberauskunft", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "REQUIRED_EVIDENCE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "beeg-9-all", locator: "§ 9", text: "Der Arbeitgeber hat auf Verlangen Entgelt, Abzugsmerkmale und Arbeitszeit zu bescheinigen. Die Behörde kann mit Einwilligung das elektronische Entgeltbescheinigungsverfahren nutzen. Der Arbeitgeber entscheidet nicht über das Elterngeld." }] },
  { key: "beeg-10", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/beeg/__10.html", officialDomain: "www.gesetze-im-internet.de", title: "BEEG § 10 Andere Sozialleistungen", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "beeg-10-all", locator: "§ 10", text: "Bei Leistungen nach SGB II, SGB XII, Kinderzuschlag und AsylbLG bleibt Elterngeld nur in Höhe des vor der Geburt berücksichtigten Erwerbseinkommens bis 300 Euro unberücksichtigt. Ohne solches Einkommen ist der Mindestbetrag nicht automatisch zusätzlich geschützt. Elterngeld Plus halbiert diesen Schutz." }] },
  { key: "beeg-12", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/beeg/__12.html", officialDomain: "www.gesetze-im-internet.de", title: "BEEG § 12 Zuständigkeit", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "AUTHORITY_COMPETENCE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: ["RESIDENCE_STATE"], passages: [{ key: "beeg-12-all", locator: "§ 12", text: "Zuständig ist die vom Land bestimmte Behörde des Bezirks, in dem das Kind bei der ersten Antragstellung seinen inländischen Wohnsitz hat. Arbeitgeberort, Staatsangehörigkeit oder userLocale bestimmen die Stelle nicht. Die örtliche Stelle ist live zu prüfen." }] },
  { key: "beeg-13", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/beeg/__13.html", officialDomain: "www.gesetze-im-internet.de", title: "BEEG § 13 Rechtsweg", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "beeg-13-all", locator: "§ 13", text: "Streitigkeiten über Elterngeld nach den §§ 1 bis 12 gehören zur Sozialgerichtsbarkeit. Widerspruch und Anfechtungsklage haben keine aufschiebende Wirkung." }] },
  { key: "beeg-14", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/beeg/__14.html", officialDomain: "www.gesetze-im-internet.de", title: "BEEG § 14 Bußgeld", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "SANCTION", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "beeg-14-all", locator: "§ 14", text: "Vorsätzliche oder fahrlässige Verstöße gegen Nachweis-, Auskunfts- oder Mitteilungspflichten können mit Geldbuße bis 2000 Euro geahndet werden. Eine verspätete Unterlage ist nicht automatisch Betrug und nicht automatisch diese Höchstgeldbuße." }] },
  { key: "beeg-15", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/beeg/__15.html", officialDomain: "www.gesetze-im-internet.de", title: "BEEG § 15 Elternzeit", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "PROCESS_IDENTITY", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "beeg-15-all", locator: "§ 15", text: "Elternzeit ist arbeitsrechtliche Freistellung gegenüber dem Arbeitgeber. Elterngeld nach den §§ 1 bis 14 ist eine Geldleistung und nicht dieselbe Erklärung. Elternzeit ist nicht Voraussetzung für Elterngeld." }] },
  { key: "beeg-26", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/beeg/__26.html", officialDomain: "www.gesetze-im-internet.de", title: "BEEG § 26 SGB X", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "beeg-26-all", locator: "§ 26", text: "Soweit das BEEG keine besondere Regelung trifft, gilt für das Elterngeld das Erste Kapitel des Zehnten Buches Sozialgesetzbuch. Rückforderung richtet sich danach und ist nicht automatisch Betrug." }] },
  { key: "beeg-28", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/beeg/__28.html", officialDomain: "www.gesetze-im-internet.de", title: "BEEG § 28 Übergang", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "DEADLINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: ["EVENT_DATE"], passages: [{ key: "beeg-28-all", locator: "§ 28", text: "§ 1 Absatz 8 gilt für Kinder, die ab dem 1. April 2025 geboren oder zur Adoption aufgenommen wurden, mit 175000 Euro. Für Geburten vom 1. April 2024 bis vor dem 1. April 2025 gilt 200000 Euro. Ältere Geburtskohorten können nach älteren Fassungen zu beurteilen sein. Die 200000-Euro-Grenze ist nicht heutige Schwelle für Geburten 2026." }] },
  { key: "estg-2", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/estg/__2.html", officialDomain: "www.gesetze-im-internet.de", title: "EStG § 2 Einkommen", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "estg-2-all", locator: "§ 2 Abs. 5", text: "Das zu versteuernde Einkommen nach § 2 Absatz 5 EStG ist nicht Bruttoarbeitslohn und nicht das Nettogehalt. Für die Elterngeld-Einkommensgrenze ist dieser steuerliche Wert maßgeblich." }] },
  { key: "estg-32b", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/estg/__32b.html", officialDomain: "www.gesetze-im-internet.de", title: "EStG § 32b Progressionsvorbehalt", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "estg-32b-all", locator: "§ 32b", text: "Elterngeld ist keine gewöhnlich steuerpflichtige Einnahme, unterliegt aber dem Progressionsvorbehalt. Es ist steuerlich nicht bedeutungslos. Die individuelle Steuerfolge gehört zum Einkommensteuerpaket." }] },
  { key: "sgg-84", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/sgg/__84.html", officialDomain: "www.gesetze-im-internet.de", title: "SGG § 84 Widerspruch", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "DEADLINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: ["EVENT_DATE"], passages: [{ key: "sgg-84-all", locator: "§ 84", text: "Der Widerspruch ist binnen eines Monats nach Bekanntgabe schriftlich, in der gesetzlich zugelassenen elektronischen Form oder zur Niederschrift einzulegen. Bei Bekanntgabe im Ausland beträgt die Frist drei Monate. Das Bescheiddatum ist nicht der Fristbeginn." }] },
  { key: "sgg-66", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/sgg/__66.html", officialDomain: "www.gesetze-im-internet.de", title: "SGG § 66 Belehrung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "DEADLINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: ["EVENT_DATE"], passages: [{ key: "sgg-66-all", locator: "§ 66", text: "Fehlt eine richtige Rechtsbehelfsbelehrung oder ist sie unrichtig, kann sich die Frist verlängern. Eine individuelle Widerspruchsfrist darf ohne Bekanntgabe und Belehrungstatsachen nicht berechnet werden." }] },
  { key: "sgb1-60", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/sgb_1/__60.html", officialDomain: "www.gesetze-im-internet.de", title: "SGB I § 60 Mitwirkung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "REQUIRED_EVIDENCE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "sgb1-60-all", locator: "§ 60", text: "Wer eine Sozialleistung beantragt oder erhält, hat die für die Leistung erheblichen Tatsachen anzugeben und Änderungen mitzuteilen. Nicht jede Lebensänderung ist zu melden, wohl aber anspruchs- oder berechnungserhebliche Änderungen." }] },
  { key: "muschg-20", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/muschg_2018/__20.html", officialDomain: "www.gesetze-im-internet.de", title: "MuSchG § 20 Zuschuss", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "muschg-20-all", locator: "§ 20", text: "Der Zuschuss zum Mutterschaftsgeld des Arbeitgebers ist eine Mutterschaftsleistung und kein zusätzliches volles Elterngeld. Lebensmonate mit solchen Leistungen gelten als Basiselterngeldmonate." }] },
  { key: "egvo-68", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/egvo_883_2004/ART_68.html", officialDomain: "www.gesetze-im-internet.de", title: "VO 883/2004 Art. 68 Priorität", sourceClass: "EU_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "ELIGIBILITY", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: ["COUNTRY", "WORK_STATE", "RESIDENCE_STATE"], passages: [{ key: "egvo-68-all", locator: "Art. 68", text: "Bei Familienleistungen mehrerer Mitgliedstaaten bestimmt das Koordinierungsrecht den vorrangigen Staat. Deutscher Wohnsitz oder deutsche Staatsangehörigkeit machen Deutschland nicht automatisch zum primären Staat. Ein ausländischer Familienbezug schließt deutsches Elterngeld nicht automatisch aus und begründet keinen doppelten Vollanspruch." }] },
  { key: "familienportal", publisherKey: "bmfsfj", authorityKey: "bmfsfj", url: "https://www.familienportal.de/familienportal/familienleistungen/elterngeld", officialDomain: "www.familienportal.de", title: "Familienportal Elterngeld", sourceClass: "FEDERAL_SERVICE_PORTAL", sourceType: "authority_portal", retrievalMethod: "HTML_DOCUMENT", informationClass: "PROCESS_IDENTITY", handlingMode: "CACHE_AND_REVALIDATE", freshnessClass: "MONTHLY", staleBehavior: "REVALIDATE_BEFORE_USE", requiredContextKeys: [], passages: [{ key: "familienportal-all", locator: "Elterngeld", text: "Das Familienportal des Bundes erläutert Elterngeld, Varianten, Lebensmonate und Antragsweg. Ein Portalrechner ist Orientierung und kein bindender Anspruchsbeweis. Die örtliche Elterngeldstelle und das Landesformular sind live zu bestimmen." }] },
]);

export const ELG_UNITS: readonly UnitSpec[] = Object.freeze([
  { key: "elterngeld-not-elternzeit", category: "legal_system", temporal: "current_2026", type: "exception", text: "Elterngeld ist nicht Elternzeit.", sourceKey: "beeg-15", passageKey: "beeg-15-all", riskLevel: "high" },
  { key: "elternzeit-not-required", category: "legal_system", temporal: "current_2026", type: "exception", text: "Elternzeit ist nicht Voraussetzung für Elterngeld.", sourceKey: "beeg-15", passageKey: "beeg-15-all", riskLevel: "high" },
  { key: "elternzeit-notice-not-application", category: "legal_system", temporal: "current_2026", type: "exception", text: "Die Arbeitgeberanzeige der Elternzeit ist kein Elterngeldantrag.", sourceKey: "beeg-15", passageKey: "beeg-15-all", riskLevel: "high" },
  { key: "parent-not-automatic", category: "eligibility", temporal: "current_2026", type: "exception", text: "Elternschaft begründet nicht automatisch Elterngeld.", sourceKey: "beeg-1", passageKey: "beeg-1-all", riskLevel: "high" },
  { key: "citizenship-not-required", category: "eligibility", temporal: "current_2026", type: "exception", text: "Deutsche Staatsangehörigkeit ist nicht in jedem Fall erforderlich.", sourceKey: "beeg-1", passageKey: "beeg-1-all", riskLevel: "high" },
  { key: "address-not-all-conditions", category: "eligibility", temporal: "current_2026", type: "exception", text: "Eine deutsche Anschrift ersetzt nicht alle Anspruchsvoraussetzungen.", sourceKey: "beeg-1", passageKey: "beeg-1-all", riskLevel: "high" },
  { key: "marriage-not-required", category: "eligibility", temporal: "current_2026", type: "exception", text: "Ehe ist nicht Voraussetzung für Elterngeld.", sourceKey: "beeg-1", passageKey: "beeg-1-all", riskLevel: "medium" },
  { key: "biological-not-only", category: "eligibility", temporal: "current_2026", type: "exception", text: "Nur der leibliche Elternteil kann Elterngeld nicht allein beanspruchen; Aufnahme zur Adoption, Stiefkind und bestimmte Verwandte können unter den gesetzlichen Voraussetzungen berechtigt sein.", sourceKey: "beeg-1", passageKey: "beeg-1-all", riskLevel: "medium" },
  { key: "basic-section-1-gate", category: "eligibility", temporal: "current_2026", type: "duty", text: "Grundsätzlich muss Wohnsitz oder gewöhnlicher Aufenthalt in Deutschland, Haushaltsgemeinschaft, eigene Betreuung und keine volle Erwerbstätigkeit vorliegen.", sourceKey: "beeg-1", passageKey: "beeg-1-all", riskLevel: "high" },
  { key: "hours-32-average", category: "eligibility", temporal: "current_2026", type: "definition", text: "Nicht voll erwerbstätig ist, wer im Durchschnitt des Lebensmonats höchstens 32 Wochenstunden arbeitet.", sourceKey: "beeg-1", passageKey: "beeg-1-all", riskLevel: "high" },
  { key: "32-not-every-calendar-week", category: "eligibility", temporal: "current_2026", type: "exception", text: "32 Stunden bedeuten nicht notwendig 32 Stunden in jeder einzelnen Kalenderwoche.", sourceKey: "beeg-1", passageKey: "beeg-1-all", riskLevel: "high" },
  { key: "32-not-bonus-minimum", category: "eligibility", temporal: "current_2026", type: "exception", text: "Die 32-Stunden-Grenze ist nicht die Untergrenze des Partnerschaftsbonus.", sourceKey: "beeg-4b", passageKey: "beeg-4b-all", riskLevel: "high" },
  { key: "working-not-exclusion", category: "eligibility", temporal: "current_2026", type: "exception", text: "Erwerbstätigkeit schließt Elterngeld nicht automatisch aus.", sourceKey: "beeg-1", passageKey: "beeg-1-all", riskLevel: "high" },
  { key: "part-time-not-full-entitlement", category: "eligibility", temporal: "current_2026", type: "exception", text: "Teilzeit begründet nicht automatisch den Höchstbetrag.", sourceKey: "beeg-2", passageKey: "beeg-2-all", riskLevel: "medium" },
  { key: "foreign-not-exclusion", category: "status", temporal: "current_2026", type: "exception", text: "Ausländische Staatsangehörigkeit schließt Elterngeld nicht aus.", sourceKey: "beeg-1", passageKey: "beeg-1-all", riskLevel: "high" },
  { key: "title-not-automatic", category: "status", temporal: "current_2026", type: "exception", text: "Ein Aufenthaltstitel begründet nicht automatisch Elterngeld.", sourceKey: "beeg-1", passageKey: "beeg-1-all", riskLevel: "high" },
  { key: "duldung-not-simple", category: "status", temporal: "current_2026", type: "exception", text: "Eine Duldung ist ohne den genau bezeichneten Status kein einfaches Ja oder Nein.", sourceKey: "beeg-1", passageKey: "beeg-1-all", riskLevel: "high" },
  { key: "gestattung-not-title", category: "status", temporal: "current_2026", type: "exception", text: "Eine Aufenthaltsgestattung ist kein gewöhnlicher Aufenthaltstitel nach § 1 Absatz 7 BEEG.", sourceKey: "beeg-1", passageKey: "beeg-1-all", riskLevel: "high" },
  { key: "eu-not-automatic-primary", category: "status", temporal: "current_2026", type: "exception", text: "Unionsbürgerschaft macht Deutschland im grenzüberschreitenden Fall nicht automatisch zum vorrangigen Leistungsstaat.", sourceKey: "egvo-68", passageKey: "egvo-68-all", riskLevel: "high" },
  { key: "section-17-exact-status", category: "status", temporal: "current_2026", type: "procedure", text: "Für nicht freizügigkeitsberechtigte Personen sind die genau bezeichneten Titel und Bedingungen des § 1 Absatz 7 BEEG zu prüfen, einschließlich Niederlassung, Daueraufenthalt-EU, Blauer Karte, ICT, bestimmter Aufenthaltserlaubnisse, 15-Monats-Aufenthalt und Beschäftigungsduldung.", sourceKey: "beeg-1", passageKey: "beeg-1-all", riskLevel: "high", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "unclear-status-fail-closed", category: "status", temporal: "current_2026", type: "exception", text: "Ist der Aufenthaltsstatus unklar, darf ohne weitere Tatsachen nicht über den Elterngeldanspruch entschieden werden.", sourceKey: "beeg-1", passageKey: "beeg-1-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "threshold-175k-current", category: "threshold", temporal: "current_2026", type: "definition", text: "Für Kinder, die ab dem 1. April 2025 geboren oder zur Adoption aufgenommen wurden, entfällt der Anspruch bei zu versteuerndem Einkommen über 175000 Euro.", sourceKey: "beeg-1", passageKey: "beeg-1-all", riskLevel: "high", requiresEffectiveDate: true },
  { key: "threshold-is-taxable-income", category: "threshold", temporal: "current_2026", type: "definition", text: "Maßgeblich ist das zu versteuernde Einkommen nach § 2 Absatz 5 EStG, nicht Brutto oder Netto.", sourceKey: "estg-2", passageKey: "estg-2-all", riskLevel: "high" },
  { key: "175k-not-gross", category: "threshold", temporal: "current_2026", type: "exception", text: "175000 Euro sind keine Bruttolohnschwelle.", sourceKey: "estg-2", passageKey: "estg-2-all", riskLevel: "high" },
  { key: "175k-not-net", category: "threshold", temporal: "current_2026", type: "exception", text: "175000 Euro sind keine Nettolohnschwelle.", sourceKey: "estg-2", passageKey: "estg-2-all", riskLevel: "high" },
  { key: "one-salary-not-always-only", category: "threshold", temporal: "current_2026", type: "exception", text: "Das Gehalt eines Elternteils ist nicht immer der einzige für die Grenze maßgebliche Betrag.", sourceKey: "beeg-1", passageKey: "beeg-1-all", riskLevel: "high" },
  { key: "guess-not-binding-threshold", category: "threshold", temporal: "current_2026", type: "exception", text: "Eine geschätzte Jahreseinnahme ist keine bindende Feststellung des zu versteuernden Einkommens.", sourceKey: "beeg-8", passageKey: "beeg-8-all", riskLevel: "high" },
  { key: "legacy-200k-not-current-2026", category: "threshold", temporal: "current_2026", type: "exception", text: "Die 200000-Euro-Grenze ist nicht heutige Schwelle für Geburten 2026.", sourceKey: "beeg-28", passageKey: "beeg-28-all", riskLevel: "high" },
  { key: "individual-threshold-fail-closed", category: "threshold", temporal: "current_2026", type: "exception", text: "Ob die Einkommensgrenze überschritten ist, darf ohne Veranlagungszeitraum und Steuerbescheidfacts nicht entschieden werden.", sourceKey: "beeg-1", passageKey: "beeg-1-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["EVENT_DATE"] },
  { key: "basis-not-plus", category: "variant", temporal: "current_2026", type: "exception", text: "Basiselterngeld ist nicht Elterngeld Plus.", sourceKey: "beeg-4a", passageKey: "beeg-4a-all", riskLevel: "high" },
  { key: "plus-not-unrelated", category: "variant", temporal: "current_2026", type: "exception", text: "Elterngeld Plus ist keine andere, vom Elterngeld unabhängige Leistung.", sourceKey: "beeg-4a", passageKey: "beeg-4a-all", riskLevel: "medium" },
  { key: "plus-not-always-half-actual", category: "variant", temporal: "current_2026", type: "exception", text: "Elterngeld Plus ist nicht immer genau die Hälfte des tatsächlich gezahlten Basiselterngeldes.", sourceKey: "beeg-4a", passageKey: "beeg-4a-all", riskLevel: "high" },
  { key: "partnermonate-not-bonus", category: "variant", temporal: "current_2026", type: "exception", text: "Partnermonate sind nicht der Partnerschaftsbonus.", sourceKey: "beeg-4b", passageKey: "beeg-4b-all", riskLevel: "high" },
  { key: "bonus-24-to-32", category: "variant", temporal: "current_2026", type: "definition", text: "Der Partnerschaftsbonus setzt 24 bis 32 Wochenstunden im Durchschnitt des Lebensmonats voraus.", sourceKey: "beeg-4b", passageKey: "beeg-4b-all", riskLevel: "high" },
  { key: "bonus-2-to-4-months", category: "variant", temporal: "current_2026", type: "definition", text: "Der Partnerschaftsbonus umfasst je Elternteil mindestens zwei und höchstens vier aufeinander folgende gleichzeitige Elterngeld-Plus-Monate.", sourceKey: "beeg-4b", passageKey: "beeg-4b-all", riskLevel: "medium" },
  { key: "24-not-general-minimum", category: "variant", temporal: "current_2026", type: "exception", text: "24 Stunden sind nicht die allgemeine Elterngeld-Mindestarbeitszeit.", sourceKey: "beeg-4b", passageKey: "beeg-4b-all", riskLevel: "high" },
  { key: "min-300-max-1800", category: "amount", temporal: "current_2026", type: "definition", text: "Basiselterngeld beträgt mindestens 300 Euro und höchstens 1800 Euro monatlich, bevor Zuschläge.", sourceKey: "beeg-2", passageKey: "beeg-2-all", riskLevel: "medium" },
  { key: "plus-min-150-max-900", category: "amount", temporal: "current_2026", type: "definition", text: "Elterngeld Plus hat den gesetzlichen Mindestbetrag von 150 Euro und höchstens die Hälfte des Basiselterngeldes ohne Einnahmen nach der Geburt, regelmäßig bis 900 Euro.", sourceKey: "beeg-4a", passageKey: "beeg-4a-all", riskLevel: "medium" },
  { key: "sixtyfive-not-universal", category: "amount", temporal: "current_2026", type: "exception", text: "65 Prozent sind nicht der universelle Elterngeldsatz.", sourceKey: "beeg-2", passageKey: "beeg-2-all", riskLevel: "high" },
  { key: "sixtyseven-not-universal", category: "amount", temporal: "current_2026", type: "exception", text: "67 Prozent sind nicht der universelle Elterngeldsatz.", sourceKey: "beeg-2", passageKey: "beeg-2-all", riskLevel: "high" },
  { key: "payslip-net-not-elterngeld-netto", category: "amount", temporal: "current_2026", type: "exception", text: "Das Nettogehalt der Gehaltsabrechnung ist nicht das Elterngeld-Netto.", sourceKey: "beeg-2c", passageKey: "beeg-2c-all", riskLevel: "high" },
  { key: "1800-not-everyone", category: "amount", temporal: "current_2026", type: "exception", text: "1800 Euro stehen nicht jeder Person zu.", sourceKey: "beeg-2", passageKey: "beeg-2-all", riskLevel: "high" },
  { key: "no-calculator-without-facts", category: "amount", temporal: "current_2026", type: "exception", text: "Ein individueller Elterngeldbetrag darf ohne Bemessungszeitraum, Elterngeld-Netto, Lebensmonate und Anrechnungen nicht berechnet werden.", sourceKey: "beeg-2", passageKey: "beeg-2-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "replacement-rate-structure", category: "amount", temporal: "current_2026", type: "definition", text: "Der gesetzliche Ersatzsatz beginnt bei 67 Prozent, steigt unter 1000 Euro bis 100 Prozent und sinkt über 1200 Euro bis 65 Prozent; bei Einkommen nach der Geburt gilt der Unterschiedsbetrag, vor der Geburt höchstens 2770 Euro.", sourceKey: "beeg-2", passageKey: "beeg-2-all", riskLevel: "medium" },
  { key: "employee-12-months", category: "bemessung", temporal: "current_2026", type: "definition", text: "Für nichtselbständige Arbeit sind grundsätzlich die zwölf Kalendermonate vor dem Geburtsmonat maßgeblich.", sourceKey: "beeg-2b", passageKey: "beeg-2b-all", riskLevel: "medium" },
  { key: "last-12-slips-not-always", category: "bemessung", temporal: "current_2026", type: "exception", text: "Die letzten zwölf Gehaltsabrechnungen sind nicht immer der genaue Bemessungszeitraum.", sourceKey: "beeg-2b", passageKey: "beeg-2b-all", riskLevel: "high" },
  { key: "birth-month-not-automatically-included", category: "bemessung", temporal: "current_2026", type: "exception", text: "Der Geburtsmonat gehört nicht automatisch zum Arbeitnehmer-Bemessungszeitraum.", sourceKey: "beeg-2b", passageKey: "beeg-2b-all", riskLevel: "medium" },
  { key: "low-month-not-auto-skipped", category: "bemessung", temporal: "current_2026", type: "exception", text: "Ein einkommensschwacher Monat wird nicht automatisch übersprungen.", sourceKey: "beeg-2b", passageKey: "beeg-2b-all", riskLevel: "medium" },
  { key: "self-employed-tax-year", category: "bemessung", temporal: "current_2026", type: "definition", text: "Für selbständige Gewinneinkünfte ist der letzte abgeschlossene steuerliche Veranlagungszeitraum vor der Geburt maßgeblich.", sourceKey: "beeg-2b", passageKey: "beeg-2b-all", riskLevel: "medium" },
  { key: "mixed-moves-framework", category: "bemessung", temporal: "current_2026", type: "definition", text: "Mischeinkünfte aus selbständiger und nichtselbständiger Arbeit können den gesamten Bemessungszeitraum in das selbständige Regime verschieben.", sourceKey: "beeg-2b", passageKey: "beeg-2b-all", riskLevel: "high" },
  { key: "small-self-employment-35", category: "bemessung", temporal: "current_2026", type: "exception", text: "Betragen die Gewinneinkünfte durchschnittlich weniger als 35 Euro im Kalendermonat, kann auf Antrag das Arbeitnehmerregime gelten.", sourceKey: "beeg-2b", passageKey: "beeg-2b-all", riskLevel: "medium" },
  { key: "side-business-not-always-irrelevant", category: "bemessung", temporal: "current_2026", type: "exception", text: "Ein kleines Nebengewerbe ist nicht immer unbeachtlich.", sourceKey: "beeg-2b", passageKey: "beeg-2b-all", riskLevel: "high" },
  { key: "turnover-not-profit", category: "bemessung", temporal: "current_2026", type: "exception", text: "Umsatz ist nicht der selbständige Elterngeldgewinn.", sourceKey: "beeg-2d", passageKey: "beeg-2d-all", riskLevel: "high" },
  { key: "bonus-not-ordinary-income", category: "bemessung", temporal: "current_2026", type: "exception", text: "Weihnachtsgeld, Urlaubsgeld, Bonus oder Abfindung sind nicht automatisch laufendes Elterngeldeinkommen.", sourceKey: "beeg-2c", passageKey: "beeg-2c-all", riskLevel: "medium" },
  { key: "work-after-birth-can-reduce", category: "bemessung", temporal: "current_2026", type: "definition", text: "Erwerbseinkommen nach der Geburt kann das Elterngeld über den Unterschiedsbetrag mindern.", sourceKey: "beeg-2", passageKey: "beeg-2-all", riskLevel: "high" },
  { key: "20-hours-not-unchanged", category: "bemessung", temporal: "current_2026", type: "exception", text: "20 Wochenstunden bedeuten nicht automatisch unverändertes Elterngeld.", sourceKey: "beeg-2", passageKey: "beeg-2-all", riskLevel: "high" },
  { key: "below-32-not-income-ignored", category: "bemessung", temporal: "current_2026", type: "exception", text: "Unter 32 Stunden wird Erwerbseinkommen nicht ignoriert.", sourceKey: "beeg-2", passageKey: "beeg-2-all", riskLevel: "high" },
  { key: "plus-not-promised-better", category: "bemessung", temporal: "current_2026", type: "exception", text: "Elterngeld Plus darf ohne Berechnung nicht als die höhere Variante zugesagt werden.", sourceKey: "beeg-4a", passageKey: "beeg-4a-all", riskLevel: "high" },
  { key: "lebensmonat-not-calendar", category: "lebensmonat", temporal: "current_2026", type: "exception", text: "Ein Kalendermonat ist nicht notwendig ein Elterngeld-Lebensmonat.", sourceKey: "beeg-4", passageKey: "beeg-4-all", riskLevel: "high" },
  { key: "lebensmonat-from-birth-day", category: "lebensmonat", temporal: "current_2026", type: "definition", text: "Elterngeld wird für Lebensmonate des Kindes gezahlt, die am Geburtstag beginnen und nicht mit dem Kalendermonat zusammenfallen müssen.", sourceKey: "beeg-4", passageKey: "beeg-4-all", riskLevel: "high" },
  { key: "example-15th-not-universal", category: "lebensmonat", temporal: "current_2026", type: "exception", text: "Ein Beispiel vom 15. bis 14. ist keine universelle Lebensmonatsregel für jedes Kind.", sourceKey: "beeg-4", passageKey: "beeg-4-all", riskLevel: "medium" },
  { key: "joint-12-plus-possible-2", category: "duration", temporal: "current_2026", type: "definition", text: "Eltern haben gemeinsam Anspruch auf zwölf Basis-Monatsbeträge und bei gesetzlicher Einkommensminderung auf zwei Partnermonate.", sourceKey: "beeg-4", passageKey: "beeg-4-all", riskLevel: "medium" },
  { key: "not-always-14", category: "duration", temporal: "current_2026", type: "exception", text: "Eltern erhalten nicht immer automatisch 14 Basis-Monate.", sourceKey: "beeg-4", passageKey: "beeg-4-all", riskLevel: "high" },
  { key: "one-parent-max-12", category: "duration", temporal: "current_2026", type: "definition", text: "Ein Elternteil hat regelmäßig Anspruch auf höchstens zwölf Basis-Monatsbeträge zuzüglich Partnerschaftsbonus.", sourceKey: "beeg-4", passageKey: "beeg-4-all", riskLevel: "medium" },
  { key: "minimum-two-months", category: "duration", temporal: "current_2026", type: "definition", text: "Elterngeld ist mindestens für zwei Lebensmonate zu beziehen.", sourceKey: "beeg-4", passageKey: "beeg-4-all", riskLevel: "medium" },
  { key: "simultaneous-one-month", category: "duration", temporal: "current_2026", type: "definition", text: "Gleichzeitiger Basisbezug beider Eltern ist nur in einem der ersten zwölf Lebensmonate möglich.", sourceKey: "beeg-4", passageKey: "beeg-4-all", riskLevel: "high" },
  { key: "simultaneous-exceptions", category: "duration", temporal: "current_2026", type: "exception", text: "Bei Mehrlingen, bestimmten Frühgeburten, Kind mit Behinderung oder geschwisterbedingtem Bonus nach § 2a Absatz 2 Satz 3 können beide Eltern gleichzeitig Basiselterngeld beziehen.", sourceKey: "beeg-4", passageKey: "beeg-4-all", riskLevel: "medium" },
  { key: "plus-can-be-simultaneous", category: "duration", temporal: "current_2026", type: "definition", text: "Elterngeld Plus eines Elternteils kann gleichzeitig mit Basis oder Plus des anderen Elternteils bezogen werden.", sourceKey: "beeg-4", passageKey: "beeg-4-all", riskLevel: "medium" },
  { key: "plus-continuity-after-14", category: "duration", temporal: "current_2026", type: "definition", text: "Ab dem 15. Lebensmonat muss Elterngeld Plus lückenlos von wenigstens einem Elternteil bezogen werden, längstens bis zum 32. Lebensmonat.", sourceKey: "beeg-4", passageKey: "beeg-4-all", riskLevel: "high" },
  { key: "month-15-not-free-gaps", category: "duration", temporal: "current_2026", type: "exception", text: "Ab dem 15. Lebensmonat sind freie Lücken im Plus-Bezug nicht zulässig.", sourceKey: "beeg-4", passageKey: "beeg-4-all", riskLevel: "high" },
  { key: "premature-stepped-months", category: "special", temporal: "current_2026", type: "definition", text: "Frühgeburt mindestens sechs, acht, zwölf oder sechzehn Wochen vor dem errechneten Termin verlängert den gemeinsamen Basisanspruch um einen bis vier Monate.", sourceKey: "beeg-4", passageKey: "beeg-4-all", riskLevel: "medium" },
  { key: "premature-not-one-extra", category: "special", temporal: "current_2026", type: "exception", text: "Frühgeburt bedeutet nicht pauschal einen einzigen Extra-Monat.", sourceKey: "beeg-4", passageKey: "beeg-4-all", riskLevel: "high" },
  { key: "twins-one-claim", category: "special", temporal: "current_2026", type: "definition", text: "Bei Mehrlingen besteht nur ein Elterngeldanspruch, zuzüglich Mehrlingszuschlag von 300 Euro für das zweite und jedes weitere Kind.", sourceKey: "beeg-1", passageKey: "beeg-1-all", riskLevel: "high" },
  { key: "twins-not-same-as-singleton", category: "special", temporal: "current_2026", type: "exception", text: "Zwillinge führen nicht automatisch zumselben Betrag wie ein Einzelkind.", sourceKey: "beeg-2a", passageKey: "beeg-2a-all", riskLevel: "medium" },
  { key: "sibling-bonus-10-percent", category: "special", temporal: "current_2026", type: "definition", text: "Der Geschwisterbonus beträgt 10 Prozent, mindestens 75 Euro, nur bei den gesetzlichen Haushalts- und Altersvoraussetzungen.", sourceKey: "beeg-2a", passageKey: "beeg-2a-all", riskLevel: "medium" },
  { key: "another-child-not-automatic-bonus", category: "special", temporal: "current_2026", type: "exception", text: "Ein weiteres Kind begründet nicht automatisch den Geschwisterbonus.", sourceKey: "beeg-2a", passageKey: "beeg-2a-all", riskLevel: "high" },
  { key: "kindergeld-not-sibling-bonus", category: "special", temporal: "current_2026", type: "exception", text: "Kindergeld ersetzt nicht den Geschwisterbonus und begründet ihn nicht automatisch.", sourceKey: "beeg-2a", passageKey: "beeg-2a-all", riskLevel: "medium" },
  { key: "adoption-from-placement", category: "special", temporal: "current_2026", type: "definition", text: "Bei Aufnahme zur Adoption ist der Aufnahmezeitpunkt statt der Geburt maßgeblich.", sourceKey: "beeg-1", passageKey: "beeg-1-all", riskLevel: "medium" },
  { key: "stepchild-not-automatic", category: "special", temporal: "current_2026", type: "exception", text: "Ein Stiefkind begründet ohne die gesetzlichen Voraussetzungen keinen Elterngeldanspruch.", sourceKey: "beeg-1", passageKey: "beeg-1-all", riskLevel: "medium" },
  { key: "unmarried-not-single-parent", category: "special", temporal: "current_2026", type: "exception", text: "Unverheiratetsein bedeutet nicht automatisch Alleinerziehendenstatus nach § 4c BEEG.", sourceKey: "beeg-4c", passageKey: "beeg-4c-all", riskLevel: "high" },
  { key: "maternity-credits", category: "maternity", temporal: "current_2026", type: "definition", text: "Gesetzliches Mutterschaftsgeld und der Arbeitgeberzuschuss für die Zeit ab Geburt werden auf das Elterngeld angerechnet.", sourceKey: "beeg-3", passageKey: "beeg-3-all", riskLevel: "high" },
  { key: "maternity-counts-basis", category: "maternity", temporal: "current_2026", type: "definition", text: "Lebensmonate, in denen der Mutter anzurechnende Mutterschaftsleistungen zustehen, gelten als Basiselterngeldmonate.", sourceKey: "beeg-4", passageKey: "beeg-4-all", riskLevel: "high" },
  { key: "maternity-not-extra-full", category: "maternity", temporal: "current_2026", type: "exception", text: "Mutterschaftsgeld ist kein zusätzliches volles Elterngeld.", sourceKey: "beeg-3", passageKey: "beeg-3-all", riskLevel: "high" },
  { key: "no-application-first-months-not-unused", category: "maternity", temporal: "current_2026", type: "exception", text: "Kein gesonderter Elterngeldantrag in den ersten Monaten bedeutet nicht, dass Mutterschaftsmonate ungenutzt bleiben.", sourceKey: "beeg-4", passageKey: "beeg-4-all", riskLevel: "high" },
  { key: "mutterschutz-weeks-not-lebensmonate", category: "maternity", temporal: "current_2026", type: "exception", text: "Mutterschutzwochen sind nicht dieselben Zeiträume wie Elterngeld-Lebensmonate.", sourceKey: "beeg-4", passageKey: "beeg-4-all", riskLevel: "medium" },
  { key: "day-level-proration", category: "maternity", temporal: "current_2026", type: "procedure", text: "Stehen Anrechnungsbeträge nur für einen Teil des Lebensmonats zu, sind sie nur anteilig anzurechnen.", sourceKey: "beeg-3", passageKey: "beeg-3-all", riskLevel: "medium" },
  { key: "alg-not-exclusion", category: "benefits", temporal: "current_2026", type: "exception", text: "Arbeitslosengeld schließt Elterngeld nicht automatisch aus.", sourceKey: "beeg-3", passageKey: "beeg-3-all", riskLevel: "high" },
  { key: "elterngeld-not-always-on-top-of-alg", category: "benefits", temporal: "current_2026", type: "exception", text: "Elterngeld wird nicht immer ungekürzt neben Arbeitslosengeld gezahlt.", sourceKey: "beeg-3", passageKey: "beeg-3-all", riskLevel: "high" },
  { key: "sgb2-300-not-always", category: "benefits", temporal: "current_2026", type: "exception", text: "300 Euro Elterngeld bleiben bei SGB II oder SGB XII nicht immer zusätzlich unberücksichtigt.", sourceKey: "beeg-10", passageKey: "beeg-10-all", riskLevel: "high" },
  { key: "sgb2-protected-from-prebirth", category: "benefits", temporal: "current_2026", type: "definition", text: "Bei SGB II und SGB XII bleibt Elterngeld nur in Höhe des vor der Geburt berücksichtigten Erwerbseinkommens bis 300 Euro unberücksichtigt.", sourceKey: "beeg-10", passageKey: "beeg-10-all", riskLevel: "high" },
  { key: "kindergeld-not-elterngeld", category: "benefits", temporal: "current_2026", type: "exception", text: "Kindergeld ist nicht Elterngeld.", sourceKey: "familienportal", passageKey: "familienportal-all", riskLevel: "high" },
  { key: "health-not-automatic-free", category: "benefits", temporal: "current_2026", type: "exception", text: "Elterngeld bedeutet nicht in jedem Versicherungsverhältnis automatisch beitragsfreie Krankenversicherung.", sourceKey: "familienportal", passageKey: "familienportal-all", riskLevel: "medium" },
  { key: "written-application", category: "application", temporal: "current_2026", type: "duty", text: "Elterngeld ist schriftlich zu beantragen.", sourceKey: "beeg-7", passageKey: "beeg-7-all", riskLevel: "medium" },
  { key: "email-not-universally-sufficient", category: "application", temporal: "current_2026", type: "exception", text: "Eine gewöhnliche E-Mail ist nicht allgemein ausreichend.", sourceKey: "beeg-7", passageKey: "beeg-7-all", riskLevel: "high" },
  { key: "three-lebensmonate-retro", category: "application", temporal: "current_2026", type: "deadline", text: "Rückwirkung besteht nur für die letzten drei Lebensmonate vor Beginn des Lebensmonats, in dem der Antrag eingeht.", sourceKey: "beeg-7", passageKey: "beeg-7-all", riskLevel: "high" },
  { key: "three-not-calendar", category: "application", temporal: "current_2026", type: "exception", text: "Drei Lebensmonate sind nicht drei Kalendermonate.", sourceKey: "beeg-7", passageKey: "beeg-7-all", riskLevel: "high" },
  { key: "late-not-full-to-birth", category: "application", temporal: "current_2026", type: "exception", text: "Ein später Antrag führt nicht automatisch zur vollen Rückwirkung bis zur Geburt.", sourceKey: "beeg-7", passageKey: "beeg-7-all", riskLevel: "high" },
  { key: "paid-month-not-freely-changeable", category: "application", temporal: "current_2026", type: "exception", text: "Ein bereits ausgezahlter Monat ist nicht frei änderbar.", sourceKey: "beeg-7", passageKey: "beeg-7-all", riskLevel: "high" },
  { key: "plus-to-basis-exception", category: "application", temporal: "current_2026", type: "exception", text: "Ein bereits als Elterngeld Plus ausgezahlter Monat kann nachträglich in Basiselterngeld umgewandelt werden.", sourceKey: "beeg-7", passageKey: "beeg-7-all", riskLevel: "medium" },
  { key: "employer-not-authority", category: "application", temporal: "current_2026", type: "exception", text: "Der Arbeitgeber ist nicht die Elterngeldbehörde.", sourceKey: "beeg-9", passageKey: "beeg-9-all", riskLevel: "high" },
  { key: "provisional-not-final", category: "provisional", temporal: "current_2026", type: "exception", text: "Ein vorläufiger Bescheid ist nicht der endgültige Betrag.", sourceKey: "beeg-8", passageKey: "beeg-8-all", riskLevel: "high" },
  { key: "payment-not-final-entitlement", category: "provisional", temporal: "current_2026", type: "exception", text: "Eine Zahlung ist nicht notwendig der endgültige Anspruch.", sourceKey: "beeg-8", passageKey: "beeg-8-all", riskLevel: "high" },
  { key: "actual-income-must-be-shown", category: "provisional", temporal: "current_2026", type: "duty", text: "Nach Ablauf des Bezugszeitraums ist das tatsächliche Erwerbseinkommen nachzuweisen, wenn voraussichtliches Einkommen angegeben wurde.", sourceKey: "beeg-8", passageKey: "beeg-8-all", riskLevel: "high" },
  { key: "income-change-not-irrelevant", category: "provisional", temporal: "current_2026", type: "exception", text: "Einkommensänderungen nach der ersten Zahlung sind nicht unbeachtlich.", sourceKey: "beeg-8", passageKey: "beeg-8-all", riskLevel: "high" },
  { key: "material-changes-only", category: "provisional", temporal: "current_2026", type: "procedure", text: "Zu melden sind anspruchs- oder berechnungserhebliche Änderungen, nicht jede Lebensänderung.", sourceKey: "sgb1-60", passageKey: "sgb1-60-all", riskLevel: "medium" },
  { key: "recovery-not-fraud", category: "provisional", temporal: "current_2026", type: "exception", text: "Eine Rückforderung ist nicht automatisch Betrug.", sourceKey: "beeg-26", passageKey: "beeg-26-all", riskLevel: "high" },
  { key: "overpayment-not-criminal", category: "provisional", temporal: "current_2026", type: "exception", text: "Eine Überzahlung ist nicht automatisch eine Straftat.", sourceKey: "beeg-14", passageKey: "beeg-14-all", riskLevel: "high" },
  { key: "late-notice-not-2000", category: "provisional", temporal: "current_2026", type: "exception", text: "Eine verspätete Mitteilung ist nicht automatisch eine Geldbuße von 2000 Euro.", sourceKey: "beeg-14", passageKey: "beeg-14-all", riskLevel: "high" },
  { key: "individual-recovery-fail-closed", category: "provisional", temporal: "current_2026", type: "exception", text: "Ob und in welcher Höhe zurückgezahlt werden muss, darf ohne Bescheid und Tatsachen nicht entschieden werden.", sourceKey: "beeg-26", passageKey: "beeg-26-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "letter-not-always-final-approval", category: "decision", temporal: "current_2026", type: "exception", text: "Ein Elterngeldschreiben ist nicht immer der endgültige Bewilligungsbescheid.", sourceKey: "beeg-8", passageKey: "beeg-8-all", riskLevel: "medium" },
  { key: "bescheid-core-fields", category: "decision", temporal: "current_2026", type: "procedure", text: "Im Bescheid sind Kind, berechtigte Person, Lebensmonate, Variante, Bemessung, Anrechnungen, Betrag, Vorläufigkeit und Rechtsbehelfsbelehrung zu trennen.", sourceKey: "familienportal", passageKey: "familienportal-all", riskLevel: "medium" },
  { key: "widerspruch-one-month", category: "remedy", temporal: "current_2026", type: "deadline", text: "Der Widerspruch ist binnen eines Monats nach Bekanntgabe einzulegen.", sourceKey: "sgg-84", passageKey: "sgg-84-all", riskLevel: "high" },
  { key: "document-date-not-deadline", category: "remedy", temporal: "current_2026", type: "exception", text: "Das Bescheiddatum ist nicht der Beginn der Widerspruchsfrist.", sourceKey: "sgg-84", passageKey: "sgg-84-all", riskLevel: "high" },
  { key: "widerspruch-not-approval", category: "remedy", temporal: "current_2026", type: "exception", text: "Ein Widerspruch führt nicht automatisch zur Bewilligung.", sourceKey: "beeg-13", passageKey: "beeg-13-all", riskLevel: "high" },
  { key: "no-suspensive-effect", category: "remedy", temporal: "current_2026", type: "definition", text: "Widerspruch und Anfechtungsklage haben im Elterngeld keine aufschiebende Wirkung.", sourceKey: "beeg-13", passageKey: "beeg-13-all", riskLevel: "high" },
  { key: "social-court-jurisdiction", category: "remedy", temporal: "current_2026", type: "definition", text: "Elterngeldstreitigkeiten nach den §§ 1 bis 12 BEEG gehören zur Sozialgerichtsbarkeit.", sourceKey: "beeg-13", passageKey: "beeg-13-all", riskLevel: "medium" },
  { key: "individual-widerspruch-fail-closed", category: "remedy", temporal: "current_2026", type: "exception", text: "Eine individuelle Widerspruchsfrist darf ohne Bekanntgabe und Belehrungstatsachen nicht berechnet werden.", sourceKey: "sgg-66", passageKey: "sgg-66-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["EVENT_DATE"] },
  { key: "tax-free-but-progression", category: "tax", temporal: "current_2026", type: "definition", text: "Elterngeld ist keine gewöhnlich steuerpflichtige Einnahme, unterliegt aber dem Progressionsvorbehalt.", sourceKey: "estg-32b", passageKey: "estg-32b-all", riskLevel: "medium" },
  { key: "elterngeld-not-tax-irrelevant", category: "tax", temporal: "current_2026", type: "exception", text: "Elterngeld ist steuerlich nicht bedeutungslos.", sourceKey: "estg-32b", passageKey: "estg-32b-all", riskLevel: "high" },
  { key: "elterngeldstelle-not-finanzamt", category: "tax", temporal: "current_2026", type: "exception", text: "Die Elterngeldstelle ist nicht das Finanzamt.", sourceKey: "beeg-12", passageKey: "beeg-12-all", riskLevel: "medium" },
  { key: "child-residence-jurisdiction", category: "jurisdiction", temporal: "current_2026", type: "definition", text: "Zuständig ist die Landesbehörde des Bezirks, in dem das Kind bei der ersten Antragstellung seinen inländischen Wohnsitz hat.", sourceKey: "beeg-12", passageKey: "beeg-12-all", riskLevel: "high" },
  { key: "employer-location-not-authority", category: "jurisdiction", temporal: "current_2026", type: "exception", text: "Der Arbeitgeberort bestimmt nicht die Elterngeldstelle.", sourceKey: "beeg-12", passageKey: "beeg-12-all", riskLevel: "high" },
  { key: "userlocale-not-authority", category: "jurisdiction", temporal: "current_2026", type: "exception", text: "Die userLocale bestimmt nicht die zuständige Elterngeldstelle.", sourceKey: "beeg-12", passageKey: "beeg-12-all", riskLevel: "high" },
  { key: "land-not-exact-office", category: "jurisdiction", temporal: "current_2026", type: "exception", text: "Das Bundesland bestimmt nicht automatisch die genaue örtliche Stelle.", sourceKey: "beeg-12", passageKey: "beeg-12-all", riskLevel: "medium" },
  { key: "local-authority-fetch-live", category: "jurisdiction", temporal: "current_2026", type: "procedure", text: "Die aktuelle örtliche Elterngeldstelle und das Landesformular sind live zu bestimmen.", sourceKey: "familienportal", passageKey: "familienportal-all", riskLevel: "medium" },
  { key: "german-residence-not-always-primary", category: "cross_border", temporal: "current_2026", type: "exception", text: "Deutscher Wohnsitz macht Deutschland nicht immer zum vorrangigen EU-Leistungsstaat.", sourceKey: "egvo-68", passageKey: "egvo-68-all", riskLevel: "high" },
  { key: "foreign-benefit-not-auto-exclusion", category: "cross_border", temporal: "current_2026", type: "exception", text: "Eine ausländische Familienleistung schließt deutsches Elterngeld nicht automatisch aus.", sourceKey: "egvo-68", passageKey: "egvo-68-all", riskLevel: "high" },
  { key: "two-states-not-double-full", category: "cross_border", temporal: "current_2026", type: "exception", text: "Zwei Staaten bedeuten keinen doppelten Vollanspruch.", sourceKey: "egvo-68", passageKey: "egvo-68-all", riskLevel: "high" },
  { key: "foreign-income-not-ignored", category: "cross_border", temporal: "current_2026", type: "exception", text: "Ausländisches Erwerbseinkommen wird nicht automatisch ignoriert.", sourceKey: "beeg-2", passageKey: "beeg-2-all", riskLevel: "high" },
  { key: "foreign-income-fail-closed", category: "cross_border", temporal: "current_2026", type: "exception", text: "Die Wirkung ausländischen Einkommens darf ohne Staat, Steuerort, Wohnsitz und Koordinierungsfacts nicht bestimmt werden.", sourceKey: "egvo-68", passageKey: "egvo-68-all", riskLevel: "high", requiredContextKeys: ["COUNTRY", "WORK_STATE"] },
  { key: "cross-border-fail-closed", category: "cross_border", temporal: "current_2026", type: "exception", text: "Der vorrangige Staat darf ohne Wohnsitz, Beschäftigungsstaaten und Familienkonstellation nicht bestimmt werden.", sourceKey: "egvo-68", passageKey: "egvo-68-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["COUNTRY", "RESIDENCE_STATE", "WORK_STATE"] },
  { key: "portal-calculator-not-proof", category: "boundary", temporal: "current_2026", type: "exception", text: "Ein offizieller Rechner ist Orientierung und kein bindender Anspruchsbeweis.", sourceKey: "familienportal", passageKey: "familienportal-all", riskLevel: "high" },
  { key: "userlocale-not-jurisdiction", category: "boundary", temporal: "current_2026", type: "exception", text: "Die userLocale bestimmt nicht das anwendbare Elterngeldrecht.", sourceKey: "beeg-12", passageKey: "beeg-12-all", riskLevel: "high" },
]);

export const ELG_PROCESSES: readonly ElgProcessSpec[] = Object.freeze([
  { key: "elterngeld-einordnen", title: "Elterngeld einordnen 2026", trigger: "Eine Familienleistung nach der Geburt oder Aufnahme eines Kindes wird gefragt", safeFirstStep: "Elterngeld von Kindergeld, Elternzeit und Grundsicherung trennen.", riskLevel: "high" },
  { key: "grundanspruch-pruefen", title: "Grundanspruch prüfen 2026", trigger: "Unklar ist, ob die Grundvoraussetzungen des § 1 vorliegen", safeFirstStep: "Wohnsitz, Haushalt, Betreuung und Erwerbstätigkeit prüfen; Elternschaft nicht als Anspruch behandeln.", riskLevel: "high" },
  { key: "aufenthaltsstatus-pruefen", title: "Aufenthalts- oder Ausländerstatus prüfen 2026", trigger: "Die berechtigte Person ist nicht eindeutig freizügigkeitsberechtigt", safeFirstStep: "§ 1 Absatz 7 genau prüfen; Titel nicht als automatischen Anspruch behandeln.", riskLevel: "high" },
  { key: "einkommensgrenze-pruefen", title: "Einkommensgrenze prüfen 2026", trigger: "Hohes Einkommen oder die 175000-Euro-Grenze wird genannt", safeFirstStep: "Nur zu versteuerndes Einkommen verwenden; 200000 Euro nicht als heutige Schwelle für Geburten 2026 behandeln.", riskLevel: "high" },
  { key: "lebensmonat-bestimmen", title: "Lebensmonat bestimmen 2026", trigger: "Monate sollen geplant oder erklärt werden", safeFirstStep: "Lebensmonate nicht mit Kalendermonaten gleichsetzen.", riskLevel: "high" },
  { key: "variante-bestimmen", title: "Basis Plus Partnerschaftsbonus bestimmen 2026", trigger: "Unklar ist, welche Elterngeldvariante gemeint ist", safeFirstStep: "Basis, Plus, Partnermonate und Partnerschaftsbonus trennen.", riskLevel: "high" },
  { key: "elterngeld-vs-elternzeit", title: "Elterngeld gegen Elternzeit unterscheiden 2026", trigger: "Elternzeit und Elterngeld werden vermischt", safeFirstStep: "Geldleistung und Arbeitsfreistellung trennen; Elternzeit nicht als Pflicht behandeln.", riskLevel: "high" },
  { key: "bemessung-arbeitnehmer", title: "Bemessungszeitraum Arbeitnehmer bestimmen 2026", trigger: "Nichtselbständiges Einkommen vor der Geburt ist zu ordnen", safeFirstStep: "Zwölf Kalendermonate vor dem Geburtsmonat nennen; Abrechnungen nicht automatisch gleichsetzen.", riskLevel: "medium" },
  { key: "selbststaendig-misch", title: "Selbständig- oder Mischeinkünfte einordnen 2026", trigger: "Selbständigkeit oder gemischte Einkünfte liegen vor", safeFirstStep: "Steuerlichen Gewinnzeitraum und die 35-Euro-Ausnahme prüfen; Umsatz nicht als Gewinn behandeln.", riskLevel: "high" },
  { key: "elterngeld-netto", title: "Elterngeld-Netto einordnen 2026", trigger: "Nach dem maßgeblichen Netto wird gefragt", safeFirstStep: "Gesetzliche Standardabzüge von der Gehaltsabrechnung trennen.", riskLevel: "high" },
  { key: "einkommen-nach-geburt", title: "Einkommen nach Geburt einordnen 2026", trigger: "Nach der Geburt wird gearbeitet oder Einkommen erwartet", safeFirstStep: "Unterschiedsbetrag erklären; 20 Stunden nicht als unverändert behandeln.", riskLevel: "high" },
  { key: "basis-monate-planen", title: "Basiselterngeld-Monate planen 2026", trigger: "Basis-Monate sollen verteilt werden", safeFirstStep: "Zwölf gemeinsame Monate und mögliche Partnermonate nennen; 14 Monate nicht zusagen.", riskLevel: "medium" },
  { key: "partnermonate-einordnen", title: "Partnermonate einordnen 2026", trigger: "Zwei Extra-Monate des zweiten Elternteils werden erwartet", safeFirstStep: "Einkommensminderung prüfen; Partnermonate nicht mit Partnerschaftsbonus verwechseln.", riskLevel: "medium" },
  { key: "parallelen-basisbezug", title: "parallelen Basisbezug prüfen 2026", trigger: "Beide Eltern wollen gleichzeitig Basiselterngeld", safeFirstStep: "Nur einen der ersten zwölf Lebensmonate nennen, Ausnahmen gesondert prüfen.", riskLevel: "high" },
  { key: "plus-planen", title: "ElterngeldPlus planen 2026", trigger: "Monate sollen gestreckt oder mit Teilzeit kombiniert werden", safeFirstStep: "Ein-zu-zwei-Umwandlung und Kontinuität ab dem 15. Lebensmonat erklären.", riskLevel: "medium" },
  { key: "partnerschaftsbonus-pruefen", title: "Partnerschaftsbonus prüfen 2026", trigger: "Zusätzliche Plus-Monate bei beiderseitiger Teilzeit werden gewünscht", safeFirstStep: "24 bis 32 Stunden, zwei bis vier gleichzeitige Monate und Unterschied zu Partnermonaten prüfen.", riskLevel: "high" },
  { key: "alleinerziehend-sonderfall", title: "Alleinerziehenden- oder Sonderfall prüfen 2026", trigger: "Alleinige Betreuung oder § 4c wird geltend gemacht", safeFirstStep: "Unverheiratetsein nicht als Alleinerziehendenstatus behandeln.", riskLevel: "high" },
  { key: "fruehgeburt", title: "Frühgeburt behandeln 2026", trigger: "Das Kind wurde deutlich vor dem errechneten Termin geboren", safeFirstStep: "Gestufte Zusatzmonate nach Wochenabstand prüfen, nicht einen Pauschalmonat zusagen.", riskLevel: "medium" },
  { key: "mehrlinge", title: "Mehrlinge behandeln 2026", trigger: "Zwillinge oder Mehrlinge sind betroffen", safeFirstStep: "Einen Anspruch plus Mehrlingszuschlag nennen, nicht zwei Vollansprüche.", riskLevel: "medium" },
  { key: "geschwisterbonus", title: "Geschwisterbonus prüfen 2026", trigger: "Ein älteres Kind lebt im Haushalt", safeFirstStep: "Alters- und Haushaltsregeln prüfen; Kindergeld nicht als Bonusbeweis behandeln.", riskLevel: "medium" },
  { key: "mutterschaft-anrechnen", title: "Mutterschaftsleistungen anrechnen 2026", trigger: "Mutterschaftsgeld oder Arbeitgeberzuschuss liegt vor", safeFirstStep: "Anrechnung und Verbrauch als Basis-Monate erklären; keine Doppelzahlung zusagen.", riskLevel: "high" },
  { key: "ersatzleistungen", title: "andere Ersatzleistungen einordnen 2026", trigger: "Arbeitslosengeld, Krankengeld oder vergleichbare Leistungen laufen", safeFirstStep: "Keine automatische Sperre und keine automatische Volladdition annehmen.", riskLevel: "high" },
  { key: "antrag-vorbereiten", title: "Antrag vorbereiten 2026", trigger: "Ein Elterngeldantrag soll vorbereitet werden", safeFirstStep: "Kind, Lebensmonate, Variante, Einkommen, Status und Partnerdaten zusammenstellen.", riskLevel: "medium" },
  { key: "antrag-stellen", title: "Antrag stellen 2026", trigger: "Der Antrag soll übermittelt werden", safeFirstStep: "Schriftform oder den landesrechtlich zugelassenen Weg nutzen; E-Mail nicht als universell ausreichend behandeln.", riskLevel: "medium" },
  { key: "rueckwirkung", title: "rückwirkenden Anspruch bestimmen 2026", trigger: "Der Antrag kommt nach der Geburt oder Aufnahme", safeFirstStep: "Nur drei Lebensmonate vor dem Eingangslebensmonat nennen.", riskLevel: "high" },
  { key: "antrag-aendern", title: "Antrag ändern 2026", trigger: "Bereits gewählte Monate sollen geändert werden", safeFirstStep: "Ausgezahlte Monate nicht als frei änderbar behandeln; Plus-zu-Basis-Ausnahme prüfen.", riskLevel: "high" },
  { key: "unterlagen-nachreichen", title: "Unterlagen nachreichen 2026", trigger: "Nachweise fehlen oder werden angefordert", safeFirstStep: "Bundesanforderungen von Landeschecklisten trennen; Arbeitgeberbescheinigung einholen.", riskLevel: "medium" },
  { key: "vorlaeufiger-bescheid", title: "vorläufigen Bescheid verstehen 2026", trigger: "Eine vorläufige Zahlung oder ein Vorbehalt liegt vor", safeFirstStep: "Zahlung nicht als endgültigen Betrag behandeln.", riskLevel: "high" },
  { key: "tatsaechliches-einkommen", title: "tatsächliches Einkommen nachweisen 2026", trigger: "Nach dem Bezug soll das wirkliche Einkommen belegt werden", safeFirstStep: "Schätzung und Nachweis trennen; Nachberechnung und Rückforderung erklären.", riskLevel: "high" },
  { key: "aenderungen-melden", title: "Änderungen melden 2026", trigger: "Arbeitszeit, Einkommen, Haushalt oder Status ändert sich", safeFirstStep: "Nur erhebliche Änderungen verlangen, nicht jede Lebensänderung.", riskLevel: "medium" },
  { key: "rueckforderung", title: "Rückforderung einordnen 2026", trigger: "Eine Erstattungsforderung liegt vor", safeFirstStep: "Rückforderung nicht als Betrug behandeln; Einzelfall fail-closed halten.", riskLevel: "high" },
  { key: "bescheid-verstehen", title: "Elterngeldbescheid verstehen 2026", trigger: "Ein Bescheid oder Schreiben der Elterngeldstelle liegt vor", safeFirstStep: "Typ, Lebensmonate, Betrag, Vorläufigkeit und Belehrung trennen.", riskLevel: "medium" },
  { key: "widerspruch-einordnen", title: "Widerspruch einordnen 2026", trigger: "Der Bescheid soll angegriffen werden", safeFirstStep: "Monatsfrist nach Bekanntgabe nennen; keine aufschiebende Wirkung und keine automatische Bewilligung zusagen.", riskLevel: "high" },
  { key: "behoerde-bestimmen", title: "zuständige Elterngeldstelle bestimmen 2026", trigger: "Unklar ist, welche Stelle zuständig ist", safeFirstStep: "Wohnsitz des Kindes bei Erstantrag verwenden; Stelle live prüfen.", riskLevel: "medium" },
  { key: "eu-ausland", title: "EU- oder Auslandsfall einordnen 2026", trigger: "Wohnsitz, Arbeit oder Leistung liegt in einem anderen Staat", safeFirstStep: "Deutschland nicht automatisch als vorrangigen Staat behandeln; komplexe Koordination nur routen.", riskLevel: "high" },
  { key: "steuer-sozial-grenzen", title: "Steuer- oder Sozialleistungsgrenzen einordnen 2026", trigger: "Jobcenter, Steuer oder Krankenversicherung wird mit Elterngeld vermischt", safeFirstStep: "Progressionsvorbehalt, SGB-II-Schutz und Krankenversicherung nur als Grenze erklären.", riskLevel: "high" },
]);

export const ELG_FORMS: readonly ElgFormSpec[] = Object.freeze([
  { key: "antrag", name: "Antrag auf Elterngeld", identifier: "ELG-Antrag", purpose: "Schriftlicher Antrag mit Lebensmonaten und Variantenwahl", submissionChannels: ["written_to_elterngeldstelle", "land_digital_if_authorized"], sourceKey: "beeg-7", passageKey: "beeg-7-all" },
  { key: "aenderung", name: "Änderungsantrag Elterngeld", identifier: "ELG-Aenderung", purpose: "Änderung der Lebensmonate oder Variante bis zum Ende des Bezugszeitraums", submissionChannels: ["written_to_elterngeldstelle"], sourceKey: "beeg-7", passageKey: "beeg-7-all" },
  { key: "einkommen", name: "Einkommens- und Arbeitszeitnachweis", identifier: "ELG-Einkommensnachweis", purpose: "Nachweis des Erwerbseinkommens und der Wochenstunden", submissionChannels: ["employer_certificate_or_electronic_wage"], sourceKey: "beeg-9", passageKey: "beeg-9-all" },
  { key: "tatsaechlich", name: "Nachweis des tatsächlichen Einkommens", identifier: "ELG-Tatsaechliches-Einkommen", purpose: "Nachweis des wirklichen Erwerbseinkommens nach vorläufiger Festsetzung", submissionChannels: ["written_to_elterngeldstelle"], sourceKey: "beeg-8", passageKey: "beeg-8-all" },
  { key: "unterlagen", name: "Nachreichung von Unterlagen", identifier: "ELG-Unterlagen", purpose: "Nachreichung von Geburts-, Status-, Einkommens- oder Mutterschaftsnachweisen", submissionChannels: ["written_to_elterngeldstelle"], sourceKey: "sgb1-60", passageKey: "sgb1-60-all" },
  { key: "widerspruch", name: "Widerspruch gegen Elterngeldbescheid", identifier: "ELG-Widerspruch", purpose: "Widerspruch binnen eines Monats nach Bekanntgabe", submissionChannels: ["written_or_on_record_at_issuing_authority"], sourceKey: "sgg-84", passageKey: "sgg-84-all" },
]);

export const ELG_PROCESS_BINDINGS: readonly ElgBindingSpec[] = Object.freeze([
  { processKey: "elterngeld-einordnen", role: "orientation_basis", sequenceContext: "identify", claimKeys: ["kindergeld-not-elterngeld", "elterngeld-not-elternzeit", "portal-calculator-not-proof", "no-calculator-without-facts"] },
  { processKey: "grundanspruch-pruefen", role: "identification", sequenceContext: "section-1", claimKeys: ["basic-section-1-gate", "parent-not-automatic", "citizenship-not-required", "address-not-all-conditions", "marriage-not-required", "biological-not-only", "hours-32-average", "working-not-exclusion"] },
  { processKey: "aufenthaltsstatus-pruefen", role: "context_gate", sequenceContext: "section-1-7", claimKeys: ["section-17-exact-status", "foreign-not-exclusion", "title-not-automatic", "duldung-not-simple", "gestattung-not-title", "unclear-status-fail-closed"] },
  { processKey: "einkommensgrenze-pruefen", role: "deadline_gate", sequenceContext: "section-1-8", claimKeys: ["threshold-175k-current", "threshold-is-taxable-income", "175k-not-gross", "175k-not-net", "legacy-200k-not-current-2026", "one-salary-not-always-only", "individual-threshold-fail-closed"] },
  { processKey: "lebensmonat-bestimmen", role: "identification", sequenceContext: "life-month", claimKeys: ["lebensmonat-from-birth-day", "lebensmonat-not-calendar", "example-15th-not-universal"] },
  { processKey: "variante-bestimmen", role: "identification", sequenceContext: "variants", claimKeys: ["basis-not-plus", "plus-not-unrelated", "partnermonate-not-bonus", "plus-not-always-half-actual", "min-300-max-1800"] },
  { processKey: "elterngeld-vs-elternzeit", role: "negative_control", sequenceContext: "section-15", claimKeys: ["elterngeld-not-elternzeit", "elternzeit-not-required", "elternzeit-notice-not-application"] },
  { processKey: "bemessung-arbeitnehmer", role: "required_information", sequenceContext: "section-2b-1", claimKeys: ["employee-12-months", "last-12-slips-not-always", "birth-month-not-automatically-included", "low-month-not-auto-skipped"] },
  { processKey: "selbststaendig-misch", role: "context_gate", sequenceContext: "section-2b-2", claimKeys: ["self-employed-tax-year", "mixed-moves-framework", "small-self-employment-35", "side-business-not-always-irrelevant", "turnover-not-profit"] },
  { processKey: "elterngeld-netto", role: "identification", sequenceContext: "section-2c", claimKeys: ["payslip-net-not-elterngeld-netto", "replacement-rate-structure", "bonus-not-ordinary-income", "min-300-max-1800", "1800-not-everyone"] },
  { processKey: "einkommen-nach-geburt", role: "decision", sequenceContext: "section-2-3", claimKeys: ["work-after-birth-can-reduce", "20-hours-not-unchanged", "below-32-not-income-ignored", "plus-not-promised-better"] },
  { processKey: "basis-monate-planen", role: "application_route", sequenceContext: "section-4", claimKeys: ["joint-12-plus-possible-2", "not-always-14", "one-parent-max-12", "minimum-two-months"] },
  { processKey: "partnermonate-einordnen", role: "identification", sequenceContext: "partner-months", claimKeys: ["joint-12-plus-possible-2", "partnermonate-not-bonus"] },
  { processKey: "parallelen-basisbezug", role: "negative_control", sequenceContext: "section-4-6", claimKeys: ["simultaneous-one-month", "simultaneous-exceptions", "plus-can-be-simultaneous"] },
  { processKey: "plus-planen", role: "application_route", sequenceContext: "section-4a", claimKeys: ["basis-not-plus", "plus-continuity-after-14", "month-15-not-free-gaps", "plus-min-150-max-900"] },
  { processKey: "partnerschaftsbonus-pruefen", role: "decision", sequenceContext: "section-4b", claimKeys: ["bonus-24-to-32", "bonus-2-to-4-months", "24-not-general-minimum", "32-not-bonus-minimum", "partnermonate-not-bonus"] },
  { processKey: "alleinerziehend-sonderfall", role: "context_gate", sequenceContext: "section-4c", claimKeys: ["unmarried-not-single-parent"] },
  { processKey: "fruehgeburt", role: "decision", sequenceContext: "section-4-5", claimKeys: ["premature-stepped-months", "premature-not-one-extra"] },
  { processKey: "mehrlinge", role: "identification", sequenceContext: "multiples", claimKeys: ["twins-one-claim", "twins-not-same-as-singleton"] },
  { processKey: "geschwisterbonus", role: "identification", sequenceContext: "section-2a", claimKeys: ["sibling-bonus-10-percent", "another-child-not-automatic-bonus", "kindergeld-not-sibling-bonus"] },
  { processKey: "mutterschaft-anrechnen", role: "decision", sequenceContext: "section-3-4", claimKeys: ["maternity-credits", "maternity-counts-basis", "maternity-not-extra-full", "no-application-first-months-not-unused", "day-level-proration"] },
  { processKey: "ersatzleistungen", role: "negative_control", sequenceContext: "other-benefits", claimKeys: ["alg-not-exclusion", "elterngeld-not-always-on-top-of-alg"] },
  { processKey: "antrag-vorbereiten", role: "required_information", sequenceContext: "prepare", claimKeys: ["written-application", "bescheid-core-fields"] },
  { processKey: "antrag-stellen", role: "application_route", sequenceContext: "submit", claimKeys: ["written-application", "email-not-universally-sufficient"] },
  { processKey: "rueckwirkung", role: "deadline_gate", sequenceContext: "section-7-retro", claimKeys: ["three-lebensmonate-retro", "three-not-calendar", "late-not-full-to-birth"] },
  { processKey: "antrag-aendern", role: "legal_remedy_gate", sequenceContext: "section-7-2", claimKeys: ["paid-month-not-freely-changeable", "plus-to-basis-exception", "three-lebensmonate-retro"] },
  { processKey: "unterlagen-nachreichen", role: "evidence_requirement", sequenceContext: "evidence", claimKeys: ["employer-not-authority", "material-changes-only"] },
  { processKey: "vorlaeufiger-bescheid", role: "next_state", sequenceContext: "section-8", claimKeys: ["provisional-not-final", "payment-not-final-entitlement", "guess-not-binding-threshold"] },
  { processKey: "tatsaechliches-einkommen", role: "evidence_requirement", sequenceContext: "actual-income", claimKeys: ["actual-income-must-be-shown", "income-change-not-irrelevant"] },
  { processKey: "aenderungen-melden", role: "required_information", sequenceContext: "sgb-i-60", claimKeys: ["material-changes-only"] },
  { processKey: "rueckforderung", role: "negative_control", sequenceContext: "recovery", claimKeys: ["recovery-not-fraud", "overpayment-not-criminal", "late-notice-not-2000", "individual-recovery-fail-closed"] },
  { processKey: "bescheid-verstehen", role: "identification", sequenceContext: "notice", claimKeys: ["bescheid-core-fields", "letter-not-always-final-approval", "provisional-not-final"] },
  { processKey: "widerspruch-einordnen", role: "legal_remedy_gate", sequenceContext: "sgg-84", claimKeys: ["widerspruch-one-month", "document-date-not-deadline", "no-suspensive-effect", "widerspruch-not-approval", "social-court-jurisdiction", "individual-widerspruch-fail-closed"] },
  { processKey: "behoerde-bestimmen", role: "identification", sequenceContext: "section-12", claimKeys: ["child-residence-jurisdiction", "employer-location-not-authority", "userlocale-not-authority", "land-not-exact-office", "local-authority-fetch-live"] },
  { processKey: "eu-ausland", role: "context_gate", sequenceContext: "coordination", claimKeys: ["german-residence-not-always-primary", "eu-not-automatic-primary", "foreign-benefit-not-auto-exclusion", "two-states-not-double-full", "foreign-income-not-ignored", "foreign-income-fail-closed", "cross-border-fail-closed"] },
  { processKey: "steuer-sozial-grenzen", role: "negative_control", sequenceContext: "interfaces", claimKeys: ["tax-free-but-progression", "elterngeld-not-tax-irrelevant", "elterngeldstelle-not-finanzamt", "sgb2-300-not-always", "sgb2-protected-from-prebirth", "kindergeld-not-elterngeld", "health-not-automatic-free"] },
]);

export const ELG_PROCESS_SCENARIOS: readonly ElgProcessScenario[] = Object.freeze([
  { id: "employed-mother", label: "Berufstätige Mutter", coverage: "COVERED", requiredClaimKeys: ["basic-section-1-gate", "employee-12-months"], requiredProcessKeys: ["grundanspruch-pruefen"] },
  { id: "employed-second-parent", label: "Berufstätiger zweiter Elternteil", coverage: "COVERED", requiredClaimKeys: ["parent-not-automatic", "joint-12-plus-possible-2"], requiredProcessKeys: ["partnermonate-einordnen"] },
  { id: "both-employed", label: "Beide Eltern erwerbstätig", coverage: "COVERED", requiredClaimKeys: ["working-not-exclusion", "hours-32-average"], requiredProcessKeys: ["grundanspruch-pruefen"] },
  { id: "no-prebirth-income", label: "Kein Einkommen vor der Geburt", coverage: "COVERED", requiredClaimKeys: ["min-300-max-1800", "replacement-rate-structure"], requiredProcessKeys: ["elterngeld-netto"] },
  { id: "part-time-after-birth", label: "Teilzeit nach der Geburt", coverage: "COVERED", requiredClaimKeys: ["work-after-birth-can-reduce", "20-hours-not-unchanged"], requiredProcessKeys: ["einkommen-nach-geburt"] },
  { id: "over-32-hours", label: "Mehr als 32 Stunden geplant", coverage: "COVERED", requiredClaimKeys: ["hours-32-average", "working-not-exclusion"], requiredProcessKeys: ["grundanspruch-pruefen"] },
  { id: "self-employed", label: "Selbständig", coverage: "COVERED", requiredClaimKeys: ["self-employed-tax-year", "turnover-not-profit"], requiredProcessKeys: ["selbststaendig-misch"] },
  { id: "mixed-income", label: "Gemischte Einkünfte", coverage: "COVERED", requiredClaimKeys: ["mixed-moves-framework", "side-business-not-always-irrelevant"], requiredProcessKeys: ["selbststaendig-misch"] },
  { id: "small-self-employment", label: "Kleine Selbständigkeit unter 35 Euro", coverage: "COVERED", requiredClaimKeys: ["small-self-employment-35", "side-business-not-always-irrelevant"], requiredProcessKeys: ["selbststaendig-misch"] },
  { id: "high-income-couple", label: "Paar mit hohem Einkommen", coverage: "COVERED", requiredClaimKeys: ["threshold-175k-current", "one-salary-not-always-only"], requiredProcessKeys: ["einkommensgrenze-pruefen"] },
  { id: "near-175k", label: "Zu versteuerndes Einkommen nahe 175000", coverage: "COVERED", requiredClaimKeys: ["individual-threshold-fail-closed", "threshold-is-taxable-income"], requiredProcessKeys: ["einkommensgrenze-pruefen"] },
  { id: "gross-confused-with-threshold", label: "Brutto mit Schwelle verwechselt", coverage: "COVERED", requiredClaimKeys: ["175k-not-gross", "175k-not-net"], requiredProcessKeys: ["einkommensgrenze-pruefen"] },
  { id: "foreign-national", label: "Ausländische Staatsangehörigkeit", coverage: "COVERED", requiredClaimKeys: ["foreign-not-exclusion", "title-not-automatic"], requiredProcessKeys: ["aufenthaltsstatus-pruefen"] },
  { id: "eu-citizen", label: "Unionsbürger", coverage: "COVERED", requiredClaimKeys: ["eu-not-automatic-primary", "citizenship-not-required"], requiredProcessKeys: ["eu-ausland"] },
  { id: "blue-card", label: "Blaue Karte EU", coverage: "COVERED", requiredClaimKeys: ["section-17-exact-status", "title-not-automatic"], requiredProcessKeys: ["aufenthaltsstatus-pruefen"] },
  { id: "qualifying-permit", label: "Qualifizierende Aufenthaltserlaubnis", coverage: "COVERED", requiredClaimKeys: ["section-17-exact-status", "foreign-not-exclusion"], requiredProcessKeys: ["aufenthaltsstatus-pruefen"] },
  { id: "unclear-aufenthalt", label: "Unklarer Aufenthalt", coverage: "COVERED", requiredClaimKeys: ["unclear-status-fail-closed", "duldung-not-simple"], requiredProcessKeys: ["aufenthaltsstatus-pruefen"] },
  { id: "cross-border-worker", label: "Grenzgänger", coverage: "COVERED", requiredClaimKeys: ["cross-border-fail-closed", "german-residence-not-always-primary"], requiredProcessKeys: ["eu-ausland"] },
  { id: "lives-de-works-abroad", label: "Wohnsitz Deutschland Arbeit Ausland", coverage: "COVERED", requiredClaimKeys: ["german-residence-not-always-primary", "foreign-income-fail-closed"], requiredProcessKeys: ["eu-ausland"] },
  { id: "foreign-income", label: "Ausländisches Einkommen", coverage: "COVERED", requiredClaimKeys: ["foreign-income-not-ignored", "foreign-income-fail-closed"], requiredProcessKeys: ["eu-ausland"] },
  { id: "foreign-parental-benefit", label: "Ausländische Elternleistung", coverage: "COVERED", requiredClaimKeys: ["foreign-benefit-not-auto-exclusion", "two-states-not-double-full"], requiredProcessKeys: ["eu-ausland"] },
  { id: "basiselterngeld", label: "Basiselterngeld", coverage: "COVERED", requiredClaimKeys: ["basis-not-plus", "min-300-max-1800"], requiredProcessKeys: ["variante-bestimmen"] },
  { id: "elterngeld-plus", label: "Elterngeld Plus", coverage: "COVERED", requiredClaimKeys: ["plus-continuity-after-14", "plus-min-150-max-900"], requiredProcessKeys: ["plus-planen"] },
  { id: "partnerschaftsbonus", label: "Partnerschaftsbonus", coverage: "COVERED", requiredClaimKeys: ["bonus-24-to-32", "bonus-2-to-4-months"], requiredProcessKeys: ["partnerschaftsbonus-pruefen"] },
  { id: "confuses-partnermonate-bonus", label: "Partnermonate mit Bonus verwechselt", coverage: "COVERED", requiredClaimKeys: ["partnermonate-not-bonus", "24-not-general-minimum"], requiredProcessKeys: ["partnerschaftsbonus-pruefen"] },
  { id: "two-simultaneous-basis", label: "Zwei gleichzeitige Basis-Monate gewünscht", coverage: "COVERED", requiredClaimKeys: ["simultaneous-one-month", "plus-can-be-simultaneous"], requiredProcessKeys: ["parallelen-basisbezug"] },
  { id: "simultaneous-exception", label: "Ausnahme vom Gleichzeitigkeitslimit", coverage: "COVERED", requiredClaimKeys: ["simultaneous-exceptions", "simultaneous-one-month"], requiredProcessKeys: ["parallelen-basisbezug"] },
  { id: "mutterschaftsgeld", label: "Mutterschaftsgeld", coverage: "COVERED", requiredClaimKeys: ["maternity-credits", "maternity-not-extra-full"], requiredProcessKeys: ["mutterschaft-anrechnen"] },
  { id: "employer-maternity-subsidy", label: "Arbeitgeberzuschuss Mutterschaftsgeld", coverage: "COVERED", requiredClaimKeys: ["maternity-credits", "maternity-counts-basis"], requiredProcessKeys: ["mutterschaft-anrechnen"] },
  { id: "private-krankentagegeld", label: "Privates Krankentagegeld-Grenze", coverage: "COVERED", requiredClaimKeys: ["maternity-counts-basis", "day-level-proration"], requiredProcessKeys: ["mutterschaft-anrechnen"] },
  { id: "mid-month-birth", label: "Geburt in der Monatsmitte", coverage: "COVERED", requiredClaimKeys: ["lebensmonat-from-birth-day", "lebensmonat-not-calendar"], requiredProcessKeys: ["lebensmonat-bestimmen"] },
  { id: "late-application", label: "Später Antrag", coverage: "COVERED", requiredClaimKeys: ["three-lebensmonate-retro", "late-not-full-to-birth"], requiredProcessKeys: ["rueckwirkung"], requiredFormIdentifiers: ["ELG-Antrag"] },
  { id: "older-than-three-lebensmonate", label: "Antrag älter als drei Lebensmonate", coverage: "COVERED", requiredClaimKeys: ["three-not-calendar", "late-not-full-to-birth"], requiredProcessKeys: ["rueckwirkung"] },
  { id: "change-paid-month", label: "Bereits ausgezahlten Monat ändern", coverage: "COVERED", requiredClaimKeys: ["paid-month-not-freely-changeable", "plus-to-basis-exception"], requiredProcessKeys: ["antrag-aendern"], requiredFormIdentifiers: ["ELG-Aenderung"] },
  { id: "premature-birth", label: "Frühgeburt", coverage: "COVERED", requiredClaimKeys: ["premature-stepped-months", "premature-not-one-extra"], requiredProcessKeys: ["fruehgeburt"] },
  { id: "twins", label: "Zwillinge", coverage: "COVERED", requiredClaimKeys: ["twins-one-claim", "twins-not-same-as-singleton"], requiredProcessKeys: ["mehrlinge"] },
  { id: "older-sibling", label: "Älteres Geschwisterkind", coverage: "COVERED", requiredClaimKeys: ["sibling-bonus-10-percent", "another-child-not-automatic-bonus"], requiredProcessKeys: ["geschwisterbonus"] },
  { id: "sibling-disability", label: "Geschwisterkind mit Behinderung", coverage: "COVERED", requiredClaimKeys: ["sibling-bonus-10-percent", "another-child-not-automatic-bonus"], requiredProcessKeys: ["geschwisterbonus"] },
  { id: "adoption", label: "Adoption", coverage: "COVERED", requiredClaimKeys: ["adoption-from-placement", "biological-not-only"], requiredProcessKeys: ["grundanspruch-pruefen"] },
  { id: "single-parent", label: "Alleinerziehend", coverage: "COVERED", requiredClaimKeys: ["unmarried-not-single-parent"], requiredProcessKeys: ["alleinerziehend-sonderfall"] },
  { id: "alg-recipient", label: "ALG-Beziehende Person", coverage: "COVERED", requiredClaimKeys: ["alg-not-exclusion", "elterngeld-not-always-on-top-of-alg"], requiredProcessKeys: ["ersatzleistungen"] },
  { id: "grundsicherung-recipient", label: "Grundsicherungsbeziehende Person", coverage: "COVERED", requiredClaimKeys: ["sgb2-300-not-always", "sgb2-protected-from-prebirth"], requiredProcessKeys: ["steuer-sozial-grenzen"] },
  { id: "kindergeld-recipient", label: "Kindergeldbeziehende Person", coverage: "COVERED", requiredClaimKeys: ["kindergeld-not-elterngeld"], requiredProcessKeys: ["elterngeld-einordnen"] },
  { id: "tax-question", label: "Steuerfrage zu Elterngeld", coverage: "COVERED", requiredClaimKeys: ["tax-free-but-progression", "elterngeld-not-tax-irrelevant"], requiredProcessKeys: ["steuer-sozial-grenzen"] },
  { id: "provisional-bescheid", label: "Vorläufiger Bescheid", coverage: "COVERED", requiredClaimKeys: ["provisional-not-final", "payment-not-final-entitlement"], requiredProcessKeys: ["vorlaeufiger-bescheid"] },
  { id: "actual-income-higher", label: "Tatsächliches Einkommen höher", coverage: "COVERED", requiredClaimKeys: ["actual-income-must-be-shown", "income-change-not-irrelevant"], requiredProcessKeys: ["tatsaechliches-einkommen"], requiredFormIdentifiers: ["ELG-Tatsaechliches-Einkommen"] },
  { id: "hours-differ", label: "Tatsächliche Stunden weichen ab", coverage: "COVERED", requiredClaimKeys: ["income-change-not-irrelevant", "actual-income-must-be-shown"], requiredProcessKeys: ["tatsaechliches-einkommen"] },
  { id: "bonus-hours-fail", label: "Partnerschaftsbonus-Stunden nicht erfüllt", coverage: "COVERED", requiredClaimKeys: ["bonus-24-to-32", "recovery-not-fraud"], requiredProcessKeys: ["rueckforderung"] },
  { id: "recovery-demand", label: "Rückforderung", coverage: "COVERED", requiredClaimKeys: ["recovery-not-fraud", "individual-recovery-fail-closed"], requiredProcessKeys: ["rueckforderung"] },
  { id: "denial", label: "Ablehnung", coverage: "COVERED", requiredClaimKeys: ["widerspruch-one-month", "social-court-jurisdiction"], requiredProcessKeys: ["widerspruch-einordnen"], requiredFormIdentifiers: ["ELG-Widerspruch"] },
  { id: "widerspruch", label: "Widerspruch", coverage: "COVERED", requiredClaimKeys: ["no-suspensive-effect", "widerspruch-not-approval"], requiredProcessKeys: ["widerspruch-einordnen"] },
  { id: "bekanntgabe-unclear", label: "Bekanntgabe unklar", coverage: "COVERED", requiredClaimKeys: ["document-date-not-deadline", "individual-widerspruch-fail-closed"], requiredProcessKeys: ["widerspruch-einordnen"] },
  { id: "local-office-unknown", label: "Örtliche Stelle unbekannt", coverage: "COVERED", requiredClaimKeys: ["child-residence-jurisdiction", "local-authority-fetch-live"], requiredProcessKeys: ["behoerde-bestimmen"] },
  { id: "elternzeit-confused", label: "Elternzeit mit Elterngeld verwechselt", coverage: "COVERED", requiredClaimKeys: ["elterngeld-not-elternzeit", "elternzeit-not-required"], requiredProcessKeys: ["elterngeld-vs-elternzeit"] },
  { id: "exact-amount-no-facts", label: "Genauer Betrag ohne Tatsachen", coverage: "COVERED", requiredClaimKeys: ["no-calculator-without-facts", "portal-calculator-not-proof"], requiredProcessKeys: ["elterngeld-einordnen"] },
  { id: "complete-calculator", label: "Vollständiger individueller Rechner", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Orientierung." },
  { id: "complete-elternzeit-engine", label: "Vollständiges Elternzeit-Arbeitsrecht", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Abgrenzung." },
  { id: "dismissal-litigation", label: "Kündigungsschutzprozess", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Routing." },
  { id: "mutterschutz-employment", label: "Mutterschutz-Arbeitsrechtsmerits", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Anrechnungsgrenze." },
  { id: "complete-gkv-engine", label: "Vollständige Krankenversicherungsbeiträge", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Health-Insurance-Paket." },
  { id: "complete-est-calc", label: "Vollständige Steuerberechnung", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Einkommensteuer-Paket." },
  { id: "complete-sgb2-calc", label: "Vollständige Grundsicherungsberechnung", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Grundsicherungspaket." },
  { id: "complete-eu-coordination", label: "Vollständige EU-Koordination", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Fail-closed-Grenze." },
  { id: "foreign-family-law", label: "Ausländisches Familienleistungsrecht", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Routing." },
  { id: "custody-litigation", label: "Sorgerechtsstreit", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Außerhalb dieses Kerns." },
  { id: "parentage-litigation", label: "Abstammungsprozess", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Aufnahmegrenze." },
  { id: "fraud-defence", label: "Strafverteidigung Betrug", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Bußgeldgrenze." },
  { id: "court-strategy", label: "Vollständige Sozialgerichtsstrategie", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Rechtsweg." },
]);

const CONTEXT_GATE_POLICIES = Object.freeze([
  { sourceKey: "beeg-7", informationClass: "ELIGIBILITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["EVENT_DATE"] as const, riskClass: "HIGH" },
  { sourceKey: "beeg-1", informationClass: "DEADLINE" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "beeg-8", informationClass: "ELIGIBILITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "sgg-84", informationClass: "ELIGIBILITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["EVENT_DATE"] as const, riskClass: "HIGH" },
  { sourceKey: "egvo-68", informationClass: "AUTHORITY_COMPETENCE" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["COUNTRY", "WORK_STATE"] as const, riskClass: "HIGH" },
  { sourceKey: "beeg-2", informationClass: "REQUIRED_EVIDENCE" as const, handlingMode: "MANUAL_REVIEW_REQUIRED" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "familienportal", informationClass: "AUTHORITY_COMPETENCE" as const, handlingMode: "FETCH_LIVE" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "REVALIDATE_BEFORE_USE" as const, requiredContextKeys: ["RESIDENCE_STATE"] as const, riskClass: "MEDIUM" },
]);

export function evaluateElgProcessCompleteness(
  pack: CuratedDomainPack,
  units: readonly UnitSpec[] = ELG_UNITS,
) {
  const claimByKey = new Map(pack.claims.map((claim) => [String(claim.key), claim]));
  const processByKey = new Map(pack.processes.map((process) => [String(process.key), process]));
  const formIds = new Set(pack.forms.map((form) => String(form.identifier)));
  const rows = ELG_PROCESS_SCENARIOS.map((scenario) => {
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

export function buildElgFederalCorePack(): CuratedDomainPack {
  const item = factory(ELG_PACK_ID);
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
    bmfsfj: item("publishers", "bmfsfj", {
      name: "Bundesministerium für Familie, Senioren, Frauen und Jugend",
      type: "federal_ministry",
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
      officialPortalUrl: "https://www.gesetze-im-internet.de/beeg/",
    }),
    bmfsfj: item("authorities", "bmfsfj-familienportal", {
      publisherId: publishers.bmfsfj.id,
      name: "Familienportal des Bundes",
      type: "federal_ministry",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://www.familienportal.de/familienportal/familienleistungen/elterngeld",
    }),
  };

  const sources = ELG_OFFICIAL_SOURCES.map((spec) => {
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

  const claims = ELG_UNITS.map((unit) => {
    const source = sourceByKey.get(unit.sourceKey);
    const passage = passageByKey.get(unit.passageKey);
    if (!source || !passage) throw new Error(`ELG_UNIT_SOURCE_MISSING:${unit.key}`);
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
    if (!source) throw new Error(`ELG_CONTEXT_POLICY_SOURCE_MISSING:${spec.sourceKey}`);
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

  const processes = ELG_PROCESSES.map((spec) => item("processes", spec.key, {
    processGroupId: ELG_DOMAIN,
    title: spec.title,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
    riskLevel: spec.riskLevel,
    trigger: spec.trigger,
    safeFirstStep: spec.safeFirstStep,
    regionalVariationExpected:
      spec.key === "behoerde-bestimmen"
      || spec.key === "eu-ausland",
  }));
  const processByKey = new Map(processes.map((process) => [String(process.key), process]));
  const claimByKey = new Map(claims.map(({ claim }) => [String(claim.key), claim]));
  const processClaimLinks = ELG_PROCESS_BINDINGS.flatMap((binding) => {
    const process = processByKey.get(binding.processKey);
    if (!process) throw new Error(`ELG_PROCESS_MISSING:${binding.processKey}`);
    return binding.claimKeys.map((claimKey) => {
      const claim = claimByKey.get(claimKey);
      if (!claim) throw new Error(`ELG_PROCESS_CLAIM_MISSING:${binding.processKey}:${claimKey}`);
      return item("processClaimLinks", `${binding.processKey}:${claimKey}:${binding.role}`, {
        processId: process.id,
        claimId: claim.id,
        role: binding.role,
        required: true,
        sequenceContext: binding.sequenceContext,
        qualificationRequired: false,
      });
    });
  });

  const inspectRule = item("actorRules", "inspect-elterngeld-before-route", {
    actorState: "inspect_elterngeld_facts_before_route",
    userMustAct: true,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const thresholdRule = item("actorRules", "threshold-undetermined", {
    actorState: "individual_elterngeld_threshold_undetermined",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const deadlineRule = item("actorRules", "individual-deadline-undetermined", {
    actorState: "individual_elterngeld_deadline_undetermined",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const crossBorderRule = item("actorRules", "cross-border-undetermined", {
    actorState: "elterngeld_cross_border_priority_undetermined",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });

  const forms = ELG_FORMS.map((spec) => {
    const source = sourceByKey.get(spec.sourceKey);
    const passage = passageByKey.get(spec.passageKey);
    if (!source || !passage) throw new Error(`ELG_FORM_SOURCE_MISSING:${spec.key}`);
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
    packId: ELG_PACK_ID,
    domain: ELG_DOMAIN,
    canonicalLanguage: ELG_CANONICAL_LANGUAGE,
    trustDomain,
    jurisdictions: [jurisdiction],
    territorialScopes: [scope],
    publishers: [publishers.bmj, publishers.bmfsfj],
    authorities: [authorities.bmj, authorities.bmfsfj],
    sources: sources.map(({ source }) => source),
    sourceVersions: sources.map(({ version }) => version),
    passages: sources.flatMap(({ passages }) => passages),
    claims: claims.map(({ claim }) => claim),
    evidenceLinks: claims.map(({ evidence }) => evidence),
    citations: claims.map(({ citation }) => citation),
    actorRules: [inspectRule, thresholdRule, deadlineRule, crossBorderRule],
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

export function elgPackSummary(pack: CuratedDomainPack = buildElgFederalCorePack()) {
  const categories = Object.fromEntries(
    ELG_UNITS.reduce((counts, unit) => {
      counts.set(unit.category, (counts.get(unit.category) ?? 0) + 1);
      return counts;
    }, new Map<ElgUnitCategory, number>()),
  );
  const completeness = evaluateElgProcessCompleteness(pack);
  return Object.freeze({
    domain: pack.domain,
    packId: pack.packId,
    canonicalLanguage: pack.canonicalLanguage,
    claimCount: pack.claims.length,
    sourceCount: pack.sources.length,
    processCount: pack.processes.length,
    processClaimLinkCount: pack.processClaimLinks.length,
    formCount: pack.forms.length,
    current2026Count: ELG_UNITS.length,
    futureWatchCount: ELG_FUTURE_CHANGE_WATCH_ITEMS.length,
    g3ProcessStepLimitation: ELG_G3_PROCESS_STEP_LIMITATION,
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
