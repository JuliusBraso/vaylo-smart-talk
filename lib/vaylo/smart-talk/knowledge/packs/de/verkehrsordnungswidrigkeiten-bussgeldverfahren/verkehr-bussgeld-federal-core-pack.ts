/**
 * KNOWLEDGE-EXPANSION — German road-traffic administrative-offence
 * and Bußgeldverfahren process-complete core.
 * Official-source G3 CuratedDomainPack for domain
 * verkehrsordnungswidrigkeiten_bussgeldverfahren.
 * Canonical language is German only. Not a runtime route.
 *
 * This pack is the OWiG / StVG Bußgeld lifecycle. It does not replace
 * vehicle_registration_and_driving_licence, rechnung_mahnung or private
 * insurance and does not implement criminal-traffic, MPU or measurement
 * litigation merits.
 */
import { createHash } from "node:crypto";

import {
  KNOWLEDGE_FACTORY_SCHEMA_VERSION,
  stableKnowledgeFactoryId,
  type CuratedDomainPack,
} from "../../../source-registry/knowledge-factory-contracts";

export const OWI_DOMAIN = "verkehrsordnungswidrigkeiten_bussgeldverfahren" as const;
export const OWI_PACK_ID = OWI_DOMAIN;
export const OWI_CANONICAL_LANGUAGE = "de" as const;

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

export type OwiUnitCategory =
  | "legal_system"
  | "classifier"
  | "role"
  | "anhoerung"
  | "witness"
  | "halter"
  | "verwarnung"
  | "bescheid"
  | "offence"
  | "points"
  | "fahrverbot"
  | "einspruch"
  | "limitation"
  | "payment"
  | "evidence"
  | "authenticity"
  | "boundary"
  | "deadline";

export type OwiContextKey = "EVENT_DATE" | "PROCESS_VARIANT" | "COUNTRY";
export type OwiHandlingMode =
  | "STORE_CANONICALLY"
  | "CACHE_AND_REVALIDATE"
  | "FETCH_LIVE"
  | "MANUAL_REVIEW_REQUIRED"
  | "DO_NOT_ANSWER_WITHOUT_CONTEXT";
export type OwiFreshnessClass = "LEGAL_CHANGE_MONITORED" | "MONTHLY" | "EVENT_DRIVEN";
export type OwiStaleBehavior = "DO_NOT_USE_STALE" | "REVALIDATE_BEFORE_USE";
export type OwiInformationClass =
  | "LEGAL_BASELINE"
  | "PROCESS_IDENTITY"
  | "AUTHORITY_COMPETENCE"
  | "ELIGIBILITY"
  | "DEADLINE"
  | "REQUIRED_EVIDENCE"
  | "FORM_URL"
  | "ONLINE_SERVICE_URL"
  | "SANCTION";
export type OwiProcessRole =
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
export type OwiScenarioCoverage =
  | "COVERED"
  | "EXPLICITLY_OUT_OF_SCOPE"
  | "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE";

export const OWI_G3_PROCESS_STEP_LIMITATION =
  "G3 CuratedDomainPack and knowledge_ingest_curated_domain_pack persist processes and process_claim_links with process_step_id null; knowledge_process_steps are not ingestible without a later factory extension.";

export type OwiTemporalClass = "current_2026";

export type OwiFutureChangeWatchItem = Readonly<{
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
  publisherKey: "bmj" | "kba";
  authorityKey: "bmj" | "kba";
  url: string;
  officialDomain: string;
  title: string;
  sourceClass: "FEDERAL_LAW" | "FEDERAL_REGULATION" | "FEDERAL_ADMINISTRATIVE_GUIDANCE" | "FEDERAL_SERVICE_PORTAL";
  sourceType: "federal_statute" | "federal_guidance" | "authority_portal";
  retrievalMethod: "HTML_DOCUMENT";
  informationClass: OwiInformationClass;
  handlingMode: OwiHandlingMode;
  freshnessClass: OwiFreshnessClass;
  staleBehavior: OwiStaleBehavior;
  requiredContextKeys: readonly OwiContextKey[];
  passages: readonly Readonly<{ key: string; locator: string; text: string }>[];
}>;

type UnitSpec = Readonly<{
  key: string;
  category: OwiUnitCategory;
  temporal: OwiTemporalClass;
  type: "duty" | "deadline" | "definition" | "procedure" | "exception";
  text: string;
  sourceKey: string;
  passageKey: string;
  riskLevel: "low" | "medium" | "high";
  requiresEffectiveDate?: true;
  requiresAuthorityResolution?: true;
  requiredContextKeys?: readonly OwiContextKey[];
}>;

type OwiProcessSpec = Readonly<{
  key: string;
  title: string;
  trigger: string;
  safeFirstStep: string;
  riskLevel: "low" | "medium" | "high";
}>;

type OwiFormSpec = Readonly<{
  key: string;
  name: string;
  identifier: string;
  purpose: string;
  submissionChannels: readonly string[];
  sourceKey: string;
  passageKey: string;
}>;

type OwiBindingSpec = Readonly<{
  processKey: string;
  role: OwiProcessRole;
  sequenceContext: string;
  claimKeys: readonly string[];
}>;

type OwiProcessScenario = Readonly<{
  id: string;
  label: string;
  coverage: OwiScenarioCoverage;
  requiredClaimKeys: readonly string[];
  requiredProcessKeys: readonly string[];
  requiredFormIdentifiers?: readonly string[];
  note?: string;
}>;

export const OWI_FUTURE_WATCH_SOURCE = Object.freeze({
  url: "https://www.gesetze-im-internet.de/stvg/__26.html",
  officialDomain: "www.gesetze-im-internet.de",
  title: "StVG § 26 Zuständige Verwaltungsbehörde; Verjährung",
});

export const OWI_FUTURE_CHANGE_WATCH_ITEMS: readonly OwiFutureChangeWatchItem[] = Object.freeze([
  {
    id: "owi-legacy-stvg-26-three-month",
    key: "legacy-stvg-26-three-month-pre-2026-07-01",
    officialSourceUrl: OWI_FUTURE_WATCH_SOURCE.url,
    officialDomain: OWI_FUTURE_WATCH_SOURCE.officialDomain,
    officialSourceTitle: OWI_FUTURE_WATCH_SOURCE.title,
    targetYear: 2026,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "LEGACY: Die vor dem 1. Juli 2026 geltende dreimonatige Verfolgungsverjährung vor Bußgeldbescheid oder öffentlicher Klage ist nicht heutiges Recht nach § 26 Absatz 3 Satz 1 StVG.",
  },
  {
    id: "owi-future-watch-bkatv-tables",
    key: "future-bkatv-tables",
    officialSourceUrl: "https://www.gesetze-im-internet.de/bkatv_2013/__1.html",
    officialDomain: "www.gesetze-im-internet.de",
    officialSourceTitle: "BKatV § 1",
    targetYear: 2027,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "Künftige Änderungen der BKatV-Regelsätze sind nicht als zeitlose Beträge ingestierbar.",
  },
  {
    id: "owi-future-watch-fev-anlage-13",
    key: "future-fev-anlage-13",
    officialSourceUrl: "https://www.gesetze-im-internet.de/fev_2010/anlage_13.html",
    officialDomain: "www.gesetze-im-internet.de",
    officialSourceTitle: "FeV Anlage 13",
    targetYear: 2027,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "Künftige Punktebewertungen der FeV Anlage 13 sind nicht als zeitlose Zuordnung ingestierbar.",
  },
  {
    id: "owi-future-watch-stvg-owi-amendments",
    key: "future-stvg-owi-amendments",
    officialSourceUrl: OWI_FUTURE_WATCH_SOURCE.url,
    officialDomain: OWI_FUTURE_WATCH_SOURCE.officialDomain,
    officialSourceTitle: OWI_FUTURE_WATCH_SOURCE.title,
    targetYear: 2028,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "Politisch vereinbarte oder nur vorgeschlagene weitere StVG- oder OWiG-Änderungen sind nicht heutiges Bußgeldrecht.",
  },
]);

export const OWI_OFFICIAL_SOURCES: readonly OfficialSourceSpec[] = Object.freeze([
  { key: "owig-17", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/owig_1968/__17.html", officialDomain: "www.gesetze-im-internet.de", title: "OWiG § 17 Höhe der Geldbuße", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "owig-17-all", locator: "§ 17", text: "Die Geldbuße beträgt mindestens fünf Euro und, soweit das Gesetz nichts anderes bestimmt, höchstens eintausend Euro. Bei der Zumessung sind Bedeutung der Ordnungswidrigkeit und Vorwurf zu berücksichtigen; die wirtschaftlichen Verhältnisse des Betroffenen kommen in der Regel in Betracht. Die Geldbuße ist nicht automatisch der zu zahlende Gesamtbetrag." }] },
  { key: "owig-33", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/owig_1968/__33.html", officialDomain: "www.gesetze-im-internet.de", title: "OWiG § 33 Unterbrechung der Verfolgungsverjährung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "DEADLINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: ["EVENT_DATE"], passages: [{ key: "owig-33-all", locator: "§ 33", text: "Die Verfolgungsverjährung wird unterbrochen durch gesetzlich bezeichnete Handlungen, darunter erste Vernehmung oder Bekanntgabe der Einleitung, richterliche Vernehmungen, Erlass oder Zustellung des Bußgeldbescheides und weitere Verfahrensakte. Bei schriftlicher Anordnung ist regelmäßig der Abfassungszeitpunkt maßgebend, nicht notwendig der Empfang. Nach Unterbrechung beginnt die Frist neu, begrenzt durch die absolute Höchstfrist." }] },
  { key: "owig-46", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/owig_1968/__46.html", officialDomain: "www.gesetze-im-internet.de", title: "OWiG § 46 Anwendung der Strafprozessordnung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "owig-46-all", locator: "§ 46", text: "Soweit das OWiG nichts anderes bestimmt, gelten für das Bußgeldverfahren die Vorschriften der Strafprozessordnung sinngemäß. Das begründet kein vollständiges Strafverfahren und keine Pflicht, jede Zeugenfrage ohne Prüfung der Rolle zu beantworten." }] },
  { key: "owig-51", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/owig_1968/__51.html", officialDomain: "www.gesetze-im-internet.de", title: "OWiG § 51 Zustellung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "DEADLINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: ["EVENT_DATE"], passages: [{ key: "owig-51-all", locator: "§ 51", text: "Zustellungen richten sich nach den für die handelnde Behörde geltenden Zustellungsvorschriften. Werden mehreren Empfangsberechtigten zugestellt, ist für die Fristberechnung die zuletzt bewirkte Zustellung maßgebend. Das auf dem Schreiben gedruckte Datum ist nicht die Zustellung." }] },
  { key: "owig-52", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/owig_1968/__52.html", officialDomain: "www.gesetze-im-internet.de", title: "OWiG § 52 Wiedereinsetzung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "DEADLINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"], passages: [{ key: "owig-52-all", locator: "§ 52", text: "War jemand ohne Verschulden verhindert, eine Frist einzuhalten, kann Wiedereinsetzung in den vorigen Stand nach den insoweit anwendbaren Vorschriften der Strafprozessordnung in Betracht kommen. Wiedereinsetzung ist nicht zugesagt und hemmt die Vollstreckung nicht automatisch." }] },
  { key: "owig-55", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/owig_1968/__55.html", officialDomain: "www.gesetze-im-internet.de", title: "OWiG § 55 Anhörung des Betroffenen", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "PROCESS_IDENTITY", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "owig-55-all", locator: "§ 55", text: "Dem Betroffenen ist Gelegenheit zu geben, sich zur Beschuldigung zu äußern. Der Anhörungsbogen ist kein Geständnisformular und kein Bußgeldbescheid. Zur Sache darf der Betroffene schweigen; das erlaubt keine falschen Angaben zur Identität." }] },
  { key: "owig-56", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/owig_1968/__56.html", officialDomain: "www.gesetze-im-internet.de", title: "OWiG § 56 Verwarnung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "owig-56-all", locator: "§ 56", text: "Bei geringfügigen Ordnungswidrigkeiten kann die Verwaltungsbehörde verwarnen und ein Verwarnungsgeld von fünf bis fünfundfünfzig Euro erheben. Wirksam ist die Verwarnung nur bei Einverständnis nach Belehrung über das Weigerungsrecht und Zahlung sofort oder innerhalb einer Frist, die eine Woche betragen soll. Kosten werden nicht erhoben. Nach wirksamer Verwarnung kann die Tat unter denselben tatsächlichen und rechtlichen Gesichtspunkten nicht mehr verfolgt werden." }] },
  { key: "owig-66", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/owig_1968/__66.html", officialDomain: "www.gesetze-im-internet.de", title: "OWiG § 66 Inhalt des Bußgeldbescheides", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "REQUIRED_EVIDENCE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "owig-66-all", locator: "§ 66", text: "Der Bußgeldbescheid enthält Person, Tat, Zeit, Ort, gesetzliche Merkmale, angewendete Vorschriften, Beweismittel, Geldbuße und Nebenfolgen sowie Hinweise auf Rechtskraft, Einspruch, mögliche nachteiligere Entscheidung, Zahlungsfrist nach Rechtskraft und Erzwingungshaft. Der bloße Geldbußenbetrag ist nicht die vollständige Rechtsfolge." }] },
  { key: "owig-67", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/owig_1968/__67.html", officialDomain: "www.gesetze-im-internet.de", title: "OWiG § 67 Einspruch", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "DEADLINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: ["EVENT_DATE"], passages: [{ key: "owig-67-all", locator: "§ 67", text: "Gegen den Bußgeldbescheid kann der Betroffene innerhalb von zwei Wochen nach Zustellung schriftlich oder zur Niederschrift bei der erlassenden Verwaltungsbehörde Einspruch einlegen. Der Einspruch kann auf bestimmte Beschwerdepunkte beschränkt werden. Tatdatum oder Bescheiddatum sind nicht der Fristbeginn." }] },
  { key: "owig-69", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/owig_1968/__69.html", officialDomain: "www.gesetze-im-internet.de", title: "OWiG § 69 Zwischenverfahren", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "PROCESS_IDENTITY", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "owig-69-all", locator: "§ 69", text: "Ein nicht rechtzeitiger oder sonst unwirksamer Einspruch wird als unzulässig verworfen. Ist er zulässig, prüft die Behörde, ob sie den Bescheid aufrechterhält oder zurücknimmt, und darf weitere Ermittlungen vornehmen. Wird der Bescheid nicht zurückgenommen, kann die Sache über die Staatsanwaltschaft zum Amtsgericht gelangen. Einspruch ist keine automatische Aufhebung." }] },
  { key: "owig-96", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/owig_1968/__96.html", officialDomain: "www.gesetze-im-internet.de", title: "OWiG § 96 Erzwingungshaft", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "SANCTION", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "owig-96-all", locator: "§ 96", text: "Erzwingungshaft darf nur angeordnet werden, wenn die Geldbuße unbezahlt ist, Zahlungsunfähigkeit nicht dargetan wurde, die gesetzliche Belehrung erteilt ist und keine Umstände der Zahlungsunfähigkeit bekannt sind. Sie ist kein Ersatzstrafurteil und lässt die Geldbuße nicht entfallen. Unbezahlte Geldbuße ist nicht automatisch sofortige Haft." }] },
  { key: "owig-107", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/owig_1968/__107.html", officialDomain: "www.gesetze-im-internet.de", title: "OWiG § 107 Gebühren und Auslagen", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "owig-107-all", locator: "§ 107", text: "Bei Festsetzung einer Geldbuße beträgt die Gebühr fünf vom Hundert der festgesetzten Geldbuße, mindestens 25 Euro und höchstens 7500 Euro, zuzüglich gesetzlicher Auslagen. Bei einer abschließenden Entscheidung nach § 25a StVG beträgt die Gebühr 20 Euro. Geldbuße, Gebühr und Auslagen sind zu trennen." }] },
  { key: "owig-111", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/owig_1968/__111.html", officialDomain: "www.gesetze-im-internet.de", title: "OWiG § 111 Falsche Namensangabe", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "SANCTION", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "owig-111-all", locator: "§ 111", text: "Wer einer zuständigen Behörde unrichtige Angaben über bestimmte Personalien macht oder die Angabe verweigert, handelt ordnungswidrig. Schweigen zur Sache ist keine Erlaubnis, über Name, Geburt, Wohnort oder Staatsangehörigkeit falsch Auskunft zu geben." }] },
  { key: "stvg-4", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/stvg/__4.html", officialDomain: "www.gesetze-im-internet.de", title: "StVG § 4 Fahreignungs-Bewertungssystem", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "stvg-4-all", locator: "§ 4", text: "Punkte entstehen aus rechtskräftig geahndeten, im System bezeichneten Entscheidungen, nicht allein aus der Geldbuße. Ein bis drei Punkte bedeuten Vormerkung, vier oder fünf Punkte Ermahnung, sechs oder sieben Punkte Verwarnung, acht oder mehr Punkte Ungeeignetheit und Entziehung. Die StVG-Verwarnung ist nicht die OWiG-Verwarnung. Ein Punkt ist keine Entziehung." }] },
  { key: "stvg-24a", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/stvg/__24a.html", officialDomain: "www.gesetze-im-internet.de", title: "StVG § 24a Alkohol und THC", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: ["PROCESS_VARIANT"], passages: [{ key: "stvg-24a-all", locator: "§ 24a", text: "Ordnungswidrig handelt, wer ein Kraftfahrzeug mit 0,25 mg/l oder mehr Atemalkohol oder 0,5 Promille oder mehr Blutalkohol oder mit 3,5 ng/ml oder mehr THC im Blutserum führt, ferner unter der Wirkung bestimmter anderer Mittel oder bei kombinierter THC- und Alkoholwirkung. Schwellenwerte ersetzen keine strafrechtliche Würdigung nach den §§ 316 oder 315c StGB." }] },
  { key: "stvg-24c", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/stvg/__24c.html", officialDomain: "www.gesetze-im-internet.de", title: "StVG § 24c Alkohol- und Cannabisverbot Fahranfänger", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "stvg-24c-all", locator: "§ 24c", text: "In der Probezeit oder vor Vollendung des 21. Lebensjahres ist es als Kraftfahrzeugführer ordnungswidrig, Alkohol oder Tetrahydrocannabinol zu sich zu nehmen oder die Fahrt unter deren Wirkung anzutreten. Das Alter allein entscheidet nicht über jede Probezeitfolge." }] },
  { key: "stvg-25", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/stvg/__25.html", officialDomain: "www.gesetze-im-internet.de", title: "StVG § 25 Fahrverbot", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"], passages: [{ key: "stvg-25-all", locator: "§ 25", text: "Das Fahrverbot dauert einen Monat bis drei Monate und ist von der Entziehung der Fahrerlaubnis zu trennen. Bei § 24a StVG ist es in der Regel anzuordnen. Es wird wirksam mit Verwahrung oder Vermerk, spätestens einen Monat nach Rechtskraft, unter den Voraussetzungen des Absatzes 3 abweichend spätestens vier Monate nach Rechtskraft. Die Viermonatsregel gilt nicht für jede Person." }] },
  { key: "stvg-25a", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/stvg/__25a.html", officialDomain: "www.gesetze-im-internet.de", title: "StVG § 25a Halterkosten", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "stvg-25a-all", locator: "§ 25a", text: "Kann bei einem Halt- oder Parkverstoß der Fahrer vor Verjährung nicht ermittelt werden oder wäre die Ermittlung unverhältnismäßig, können dem Halter die Verfahrenskosten auferlegt werden. Das ist keine Verurteilung des Halters wegen der Fahrertat und keine allgemeine Halterhaftung für Geschwindigkeitsverstöße." }] },
  { key: "stvg-26", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/stvg/__26.html", officialDomain: "www.gesetze-im-internet.de", title: "StVG § 26 Behörde und Verjährung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "DEADLINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: ["EVENT_DATE"], passages: [{ key: "stvg-26-all", locator: "§ 26", text: "Seit dem 1. Juli 2026 beträgt die Verfolgungsverjährung bei Ordnungswidrigkeiten nach § 24 Absatz 1 StVG sechs Monate. Für bestimmte Fahrzeugbauartverstöße gelten zwei Jahre, für bestimmte Fälle des § 24 Absatz 2 fünf Jahre. Die frühere dreimonatige Frist vor Bußgeldbescheid ist nicht heutiges Recht. Sechs Monate seit der Tat bedeuten nicht automatisch Verjährung." }] },
  { key: "stvo-1", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/stvo_2013/__1.html", officialDomain: "www.gesetze-im-internet.de", title: "StVO § 1 Grundregeln", sourceClass: "FEDERAL_REGULATION", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "stvo-1-all", locator: "§ 1", text: "Die Teilnahme am Straßenverkehr erfordert ständige Vorsicht und gegenseitige Rücksicht. Ein Verkehrsvorgang ist nicht automatisch eine Ordnungswidrigkeit und nicht automatisch eine Straftat." }] },
  { key: "bkatv-1", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/bkatv_2013/__1.html", officialDomain: "www.gesetze-im-internet.de", title: "BKatV § 1 Regelsätze", sourceClass: "FEDERAL_REGULATION", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "CACHE_AND_REVALIDATE", freshnessClass: "MONTHLY", staleBehavior: "REVALIDATE_BEFORE_USE", requiredContextKeys: ["EVENT_DATE"], passages: [{ key: "bkatv-1-all", locator: "§ 1", text: "Die Bußgeldkatalog-Verordnung bestimmt Regelsätze und Regelannahmen für Vorsatz oder Fahrlässigkeit. Der Katalogwert ist nicht das garantierte Einzelergebnis." }] },
  { key: "bkatv-4", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/bkatv_2013/__4.html", officialDomain: "www.gesetze-im-internet.de", title: "BKatV § 4 Regelfahrverbot", sourceClass: "FEDERAL_REGULATION", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "CACHE_AND_REVALIDATE", freshnessClass: "MONTHLY", staleBehavior: "REVALIDATE_BEFORE_USE", requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"], passages: [{ key: "bkatv-4-all", locator: "§ 4", text: "Ein Regelfahrverbot kommt bei groben Katalogtaten, bei beharrlicher Pflichtverletzung und in der Regel bei § 24a StVG in Betracht. Für Wiederholung gilt insbesondere eine frühere rechtskräftige Geldbuße wegen mindestens 26 km/h Überschreitung und eine weitere solche Tat innerhalb eines Jahres seit Rechtskraft. 26 km/h allein begründen ohne qualifizierte Vortat nicht automatisch das Wiederholungsfahrverbot." }] },
  { key: "fev-40", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/fev_2010/__40.html", officialDomain: "www.gesetze-im-internet.de", title: "FeV § 40 Bewertung", sourceClass: "FEDERAL_REGULATION", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "fev-40-all", locator: "§ 40", text: "Dem Fahreignungs-Bewertungssystem sind die in Anlage 13 bezeichneten Zuwiderhandlungen mit der dort festgelegten Bewertung zugrunde zu legen. Punkte dürfen nicht aus dem Erinnerungswert der Geldbuße erfunden werden." }] },
  { key: "fev-anlage-13", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/fev_2010/anlage_13.html", officialDomain: "www.gesetze-im-internet.de", title: "FeV Anlage 13 Punktebewertung", sourceClass: "FEDERAL_REGULATION", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "CACHE_AND_REVALIDATE", freshnessClass: "MONTHLY", staleBehavior: "REVALIDATE_BEFORE_USE", requiredContextKeys: ["EVENT_DATE"], passages: [{ key: "fev-anlage-13-all", locator: "Anlage 13", text: "Anlage 13 bewertet bezeichnete Ordnungswidrigkeiten mit einem oder zwei Punkten und bestimmte Straftaten mit zwei oder drei Punkten. Die Zuordnung ist anhand der aktuellen Anlage und der rechtskräftigen Entscheidung zu prüfen, nicht aus dem Bußgeldbetrag." }] },
  { key: "stvzo-31a", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/stvzo_2012/__31a.html", officialDomain: "www.gesetze-im-internet.de", title: "StVZO § 31a Fahrtenbuch", sourceClass: "FEDERAL_REGULATION", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "stvzo-31a-all", locator: "§ 31a", text: "Die zuständige Behörde kann dem Halter die Führung eines Fahrtenbuchs anordnen, wenn nach einem Verkehrsverstoß die Feststellung des Führers nicht möglich war. Das Fahrtenbuch ist kein Bußgeld und folgt nicht automatisch auf jeden unbekannten Fahrer. Es ist von den Halterkosten nach § 25a StVG zu trennen." }] },
  { key: "stpo-52", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/stpo/__52.html", officialDomain: "www.gesetze-im-internet.de", title: "StPO § 52 Zeugnisverweigerung Angehörige", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: ["PROCESS_VARIANT"], passages: [{ key: "stpo-52-all", locator: "§ 52", text: "Ein Zeugnisverweigerungsrecht besteht für gesetzlich bezeichnete Angehörige, nicht für jede familiäre Beziehung und nicht für jede Person. Der Zeuge ist nicht der Betroffene." }] },
  { key: "stpo-55", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/stpo/__55.html", officialDomain: "www.gesetze-im-internet.de", title: "StPO § 55 Auskunftsverweigerung", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: ["PROCESS_VARIANT"], passages: [{ key: "stpo-55-all", locator: "§ 55", text: "Ein Zeuge kann die Auskunft auf Fragen verweigern, deren Beantwortung ihn oder einen Angehörigen der Gefahr der Verfolgung wegen einer Straftat oder Ordnungswidrigkeit aussetzen würde. Das ist kein Recht, jedes amtliche Auskunftsverlangen pauschal zu ignorieren." }] },
  { key: "stgb-316", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/stgb/__316.html", officialDomain: "www.gesetze-im-internet.de", title: "StGB § 316 Trunkenheit im Verkehr", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: ["PROCESS_VARIANT"], passages: [{ key: "stgb-316-all", locator: "§ 316", text: "Wer im Verkehr ein Fahrzeug führt, obwohl er infolge des Genusses alkoholischer Getränke oder anderer berauschender Mittel nicht in der Lage ist, das Fahrzeug sicher zu führen, kann eine Straftat begehen. Ein Strafbefehl ist kein Bußgeldbescheid. Strafrechtliche Merits liegen außerhalb dieses Kerns." }] },
  { key: "stgb-142", publisherKey: "bmj", authorityKey: "bmj", url: "https://www.gesetze-im-internet.de/stgb/__142.html", officialDomain: "www.gesetze-im-internet.de", title: "StGB § 142 Unfallflucht", sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT", informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], passages: [{ key: "stgb-142-all", locator: "§ 142", text: "Unerlaubtes Entfernen vom Unfallort ist eine Straftat und kein gewöhnliches Bußgeldverfahren. Zivil- oder Versicherungsfragen ersetzen die strafrechtliche Einordnung nicht." }] },
  { key: "kba-punkte", publisherKey: "kba", authorityKey: "kba", url: "https://www.kba.de/DE/Statistik/Kraftfahrer/Verkehrsauffaelligkeiten/Massnahmenstufen/massnahmenstufen_node.html", officialDomain: "www.kba.de", title: "KBA Maßnahmenstufen Fahreignung", sourceClass: "FEDERAL_ADMINISTRATIVE_GUIDANCE", sourceType: "federal_guidance", retrievalMethod: "HTML_DOCUMENT", informationClass: "PROCESS_IDENTITY", handlingMode: "CACHE_AND_REVALIDATE", freshnessClass: "MONTHLY", staleBehavior: "REVALIDATE_BEFORE_USE", requiredContextKeys: [], passages: [{ key: "kba-punkte-all", locator: "Maßnahmenstufen", text: "Das Kraftfahrt-Bundesamt beschreibt die Stufen 1 bis 3 Punkte als Vormerkung, 4 bis 5 als Ermahnung, 6 bis 7 als Verwarnung und 8 oder mehr als Entziehung, sofern die Vorstufen durchlaufen wurden. Eine KBA-Mitteilung ist kein neuer Bußgeldbescheid. Die örtliche Bußgeldstelle ist live zu bestimmen." }] },
]);

export const OWI_UNITS: readonly UnitSpec[] = Object.freeze([
  { key: "police-letter-not-bescheid", category: "legal_system", temporal: "current_2026", type: "exception", text: "Ein Polizeischreiben ist nicht automatisch ein Bußgeldbescheid.", sourceKey: "owig-66", passageKey: "owig-66-all", riskLevel: "high" },
  { key: "traffic-not-automatically-owi", category: "legal_system", temporal: "current_2026", type: "exception", text: "Ein Verkehrsvorgang ist nicht automatisch eine Ordnungswidrigkeit.", sourceKey: "stvo-1", passageKey: "stvo-1-all", riskLevel: "high" },
  { key: "fine-looking-not-strafbefehl", category: "legal_system", temporal: "current_2026", type: "exception", text: "Ein bußgeldähnliches Schreiben ist nicht automatisch ein Strafbefehl.", sourceKey: "stgb-316", passageKey: "stgb-316-all", riskLevel: "high" },
  { key: "bussgeld-not-criminal-conviction", category: "legal_system", temporal: "current_2026", type: "exception", text: "Eine Geldbuße ist keine strafrechtliche Verurteilung.", sourceKey: "owig-17", passageKey: "owig-17-all", riskLevel: "high" },
  { key: "fahrverbot-not-entziehung", category: "fahrverbot", temporal: "current_2026", type: "exception", text: "Ein Fahrverbot ist nicht die Entziehung der Fahrerlaubnis.", sourceKey: "stvg-25", passageKey: "stvg-25-all", riskLevel: "high" },
  { key: "points-not-criminal-record", category: "points", temporal: "current_2026", type: "exception", text: "Punkte im Fahreignungsregister sind kein Strafregister.", sourceKey: "stvg-4", passageKey: "stvg-4-all", riskLevel: "high" },
  { key: "unclear-legal-system-fail-closed", category: "legal_system", temporal: "current_2026", type: "exception", text: "Ist unklar, ob Ordnungswidrigkeit, Strafsache, Fahrerlaubnissache oder Zivil- oder Versicherungssache vorliegt, darf ohne weitere Tatsachen nicht abschließend geantwortet werden.", sourceKey: "stvo-1", passageKey: "stvo-1-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "userlocale-not-jurisdiction", category: "boundary", temporal: "current_2026", type: "exception", text: "Die userLocale bestimmt nicht das anwendbare Bußgeldrecht und nicht die zuständige Bußgeldbehörde.", sourceKey: "stvg-26", passageKey: "stvg-26-all", riskLevel: "high", requiredContextKeys: ["COUNTRY"] },
  { key: "criminal-route-out", category: "boundary", temporal: "current_2026", type: "procedure", text: "Bei strafrechtlichem Verdacht, etwa Trunkenheit, Unfallflucht oder Fahren ohne Fahrerlaubnis, ist in die strafrechtliche Beratung zu leiten.", sourceKey: "stgb-316", passageKey: "stgb-316-all", riskLevel: "high" },
  { key: "licence-admin-not-bussgeld", category: "legal_system", temporal: "current_2026", type: "exception", text: "Eine Fahrerlaubnisangelegenheit der Fahrerlaubnisbehörde ist nicht das Bußgeldverfahren.", sourceKey: "stvg-4", passageKey: "stvg-4-all", riskLevel: "high" },
  { key: "civil-insurance-not-bussgeld", category: "legal_system", temporal: "current_2026", type: "exception", text: "Ein zivilrechtlicher Unfall- oder Versicherungsstreit ist nicht das Bußgeldverfahren.", sourceKey: "stgb-142", passageKey: "stgb-142-all", riskLevel: "high" },
  { key: "anhoerung-not-bescheid", category: "classifier", temporal: "current_2026", type: "exception", text: "Ein Anhörungsbogen ist kein Bußgeldbescheid.", sourceKey: "owig-55", passageKey: "owig-55-all", riskLevel: "high" },
  { key: "zeugenbogen-not-anhoerung", category: "classifier", temporal: "current_2026", type: "exception", text: "Ein Zeugenfragebogen ist keine Anhörung des Betroffenen.", sourceKey: "owig-55", passageKey: "owig-55-all", riskLevel: "high" },
  { key: "verwarnung-not-bescheid", category: "classifier", temporal: "current_2026", type: "exception", text: "Eine Verwarnung nach § 56 OWiG ist kein Bußgeldbescheid.", sourceKey: "owig-56", passageKey: "owig-56-all", riskLevel: "high" },
  { key: "kostenbescheid-not-geldbusse", category: "classifier", temporal: "current_2026", type: "exception", text: "Ein Kostenbescheid nach § 25a StVG ist keine Geldbuße wegen der Verkehrstat.", sourceKey: "stvg-25a", passageKey: "stvg-25a-all", riskLevel: "high" },
  { key: "payment-reminder-not-new-bescheid", category: "classifier", temporal: "current_2026", type: "exception", text: "Eine Zahlungsaufforderung oder Mahnung ist kein neuer Bußgeldbescheid.", sourceKey: "owig-66", passageKey: "owig-66-all", riskLevel: "high" },
  { key: "owig-verwarnung-not-stvg-verwarnung", category: "classifier", temporal: "current_2026", type: "exception", text: "Die OWiG-Verwarnung ist nicht die Punkte-Verwarnung nach § 4 StVG.", sourceKey: "stvg-4", passageKey: "stvg-4-all", riskLevel: "high" },
  { key: "halter-not-fahrer", category: "role", temporal: "current_2026", type: "exception", text: "Der Fahrzeughalter ist nicht automatisch der Fahrer.", sourceKey: "stvg-25a", passageKey: "stvg-25a-all", riskLevel: "high" },
  { key: "zeuge-not-betroffener", category: "role", temporal: "current_2026", type: "exception", text: "Ein Zeuge ist nicht der Betroffene.", sourceKey: "stpo-52", passageKey: "stpo-52-all", riskLevel: "high" },
  { key: "betroffener-not-finally-responsible", category: "role", temporal: "current_2026", type: "exception", text: "Der Betroffene ist nicht bereits rechtskräftig verantwortlich.", sourceKey: "owig-55", passageKey: "owig-55-all", riskLevel: "medium" },
  { key: "letter-to-keeper-not-committed", category: "role", temporal: "current_2026", type: "exception", text: "Ein an den Halter gerichtetes Schreiben bedeutet nicht, dass der Halter die Tat begangen hat.", sourceKey: "stvg-25a", passageKey: "stvg-25a-all", riskLevel: "high" },
  { key: "anhoerung-opportunity", category: "anhoerung", temporal: "current_2026", type: "duty", text: "Dem Betroffenen ist Gelegenheit zu geben, sich zur Beschuldigung zu äußern.", sourceKey: "owig-55", passageKey: "owig-55-all", riskLevel: "medium" },
  { key: "receiving-anhoerung-not-imposed", category: "anhoerung", temporal: "current_2026", type: "exception", text: "Der Empfang einer Anhörung bedeutet nicht, dass bereits eine Geldbuße festgesetzt ist.", sourceKey: "owig-55", passageKey: "owig-55-all", riskLevel: "high" },
  { key: "betroffener-not-obliged-to-confess", category: "anhoerung", temporal: "current_2026", type: "exception", text: "Der Betroffene ist nicht verpflichtet, die Tat zuzugeben.", sourceKey: "owig-55", passageKey: "owig-55-all", riskLevel: "high" },
  { key: "silence-not-false-identity", category: "anhoerung", temporal: "current_2026", type: "exception", text: "Schweigen zur Sache erlaubt keine falschen Angaben zur Identität.", sourceKey: "owig-111", passageKey: "owig-111-all", riskLevel: "high" },
  { key: "never-fabricate-identity", category: "anhoerung", temporal: "current_2026", type: "duty", text: "Name, Anschrift oder andere Personalien dürfen nicht erfunden werden.", sourceKey: "owig-111", passageKey: "owig-111-all", riskLevel: "high" },
  { key: "false-identity-can-be-owi", category: "anhoerung", temporal: "current_2026", type: "definition", text: "Unrichtige oder verweigerte Angaben zu bestimmten Personalien gegenüber einer zuständigen Behörde können selbst eine Ordnungswidrigkeit nach § 111 OWiG sein.", sourceKey: "owig-111", passageKey: "owig-111-all", riskLevel: "high" },
  { key: "stpo-52-family-not-universal", category: "witness", temporal: "current_2026", type: "exception", text: "Eine familiäre Beziehung begründet nicht für jede Person automatisch das Zeugnisverweigerungsrecht nach § 52 StPO.", sourceKey: "stpo-52", passageKey: "stpo-52-all", riskLevel: "high" },
  { key: "stpo-55-self-incrimination", category: "witness", temporal: "current_2026", type: "definition", text: "Ein Zeuge kann die Auskunft auf Fragen verweigern, deren Beantwortung ihn oder einen Angehörigen der Verfolgungsgefahr aussetzen würde.", sourceKey: "stpo-55", passageKey: "stpo-55-all", riskLevel: "high" },
  { key: "witness-not-ignore-every-requirement", category: "witness", temporal: "current_2026", type: "exception", text: "Ein Auskunftsverweigerungsrecht ist kein Recht, jedes amtliche Verlangen pauschal zu ignorieren.", sourceKey: "stpo-55", passageKey: "stpo-55-all", riskLevel: "high" },
  { key: "no-blanket-never-answer", category: "witness", temporal: "current_2026", type: "procedure", text: "Ob ein Zeugenfragebogen beantwortet werden muss, hängt von Rolle, Verwandtschaft, Behörde und der konkret verlangten Angabe ab.", sourceKey: "owig-46", passageKey: "owig-46-all", riskLevel: "high", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "no-us-style-owner-liability", category: "halter", temporal: "current_2026", type: "exception", text: "Der Halter haftet nicht automatisch für die Geldbuße des Fahrers.", sourceKey: "stvg-25a", passageKey: "stvg-25a-all", riskLevel: "high" },
  { key: "section-25a-costs-not-driver-fine", category: "halter", temporal: "current_2026", type: "exception", text: "Halterkosten nach § 25a StVG sind keine Verurteilung des Halters wegen der Fahrertat.", sourceKey: "stvg-25a", passageKey: "stvg-25a-all", riskLevel: "high" },
  { key: "parking-cost-not-ordinary-bussgeld", category: "halter", temporal: "current_2026", type: "exception", text: "Ein Parkkostenbescheid ist kein gewöhnlicher Bußgeldbescheid gegen den Halter wegen der Fahrertat.", sourceKey: "stvg-25a", passageKey: "stvg-25a-all", riskLevel: "high" },
  { key: "section-25a-fee-20", category: "halter", temporal: "current_2026", type: "definition", text: "Die Gebühr für eine abschließende Entscheidung nach § 25a StVG beträgt 20 Euro zuzüglich gesetzlicher Auslagen.", sourceKey: "owig-107", passageKey: "owig-107-all", riskLevel: "medium" },
  { key: "fahrtenbuch-not-bussgeld", category: "halter", temporal: "current_2026", type: "exception", text: "Ein Fahrtenbuch ist kein Bußgeld.", sourceKey: "stvzo-31a", passageKey: "stvzo-31a-all", riskLevel: "high" },
  { key: "unidentified-not-no-consequences", category: "halter", temporal: "current_2026", type: "exception", text: "Ein nicht ermittelter Fahrer bedeutet nicht, dass für den Halter keine Folgen möglich sind.", sourceKey: "stvzo-31a", passageKey: "stvzo-31a-all", riskLevel: "high" },
  { key: "fahrtenbuch-not-automatic", category: "halter", temporal: "current_2026", type: "exception", text: "Ein Fahrtenbuch folgt nicht automatisch auf jeden unbekannten Fahrer.", sourceKey: "stvzo-31a", passageKey: "stvzo-31a-all", riskLevel: "high" },
  { key: "fahrtenbuch-not-25a", category: "halter", temporal: "current_2026", type: "exception", text: "Halterkosten nach § 25a StVG und die Fahrtenbuchanordnung nach § 31a StVZO sind verschiedene Mechanismen.", sourceKey: "stvzo-31a", passageKey: "stvzo-31a-all", riskLevel: "high" },
  { key: "verwarnung-5-to-55", category: "verwarnung", temporal: "current_2026", type: "definition", text: "Das Verwarnungsgeld nach § 56 OWiG beträgt fünf bis fünfundfünfzig Euro.", sourceKey: "owig-56", passageKey: "owig-56-all", riskLevel: "medium" },
  { key: "verwarnung-needs-consent-and-payment", category: "verwarnung", temporal: "current_2026", type: "duty", text: "Eine wirksame Verwarnung setzt Einverständnis nach Belehrung über das Weigerungsrecht und Zahlung nach Bestimmung der Behörde voraus.", sourceKey: "owig-56", passageKey: "owig-56-all", riskLevel: "medium" },
  { key: "effective-verwarnung-closes-prosecution", category: "verwarnung", temporal: "current_2026", type: "definition", text: "Nach wirksamer Verwarnung kann die Tat unter denselben tatsächlichen und rechtlichen Gesichtspunkten nicht mehr verfolgt werden.", sourceKey: "owig-56", passageKey: "owig-56-all", riskLevel: "medium" },
  { key: "unpaid-verwarnung-not-late-final", category: "verwarnung", temporal: "current_2026", type: "exception", text: "Eine nicht gezahlte Verwarnung ist nicht dasselbe wie die verspätete Zahlung eines rechtskräftigen Bußgeldbescheides.", sourceKey: "owig-56", passageKey: "owig-56-all", riskLevel: "high" },
  { key: "no-fees-for-effective-verwarnung", category: "verwarnung", temporal: "current_2026", type: "definition", text: "Für eine wirksame Verwarnung nach § 56 OWiG werden keine Gebühren und Auslagen erhoben.", sourceKey: "owig-56", passageKey: "owig-56-all", riskLevel: "medium" },
  { key: "verwarnung-not-mandatory-acceptance", category: "verwarnung", temporal: "current_2026", type: "exception", text: "Eine Verwarnung muss nicht angenommen werden.", sourceKey: "owig-56", passageKey: "owig-56-all", riskLevel: "medium" },
  { key: "bescheid-required-contents", category: "bescheid", temporal: "current_2026", type: "definition", text: "Der Bußgeldbescheid muss Person, Tat, Zeit, Ort, gesetzliche Merkmale, Vorschriften, Beweismittel, Geldbuße und Nebenfolgen sowie die gesetzlichen Hinweise enthalten.", sourceKey: "owig-66", passageKey: "owig-66-all", riskLevel: "medium" },
  { key: "fine-alone-not-complete", category: "bescheid", temporal: "current_2026", type: "exception", text: "Der Geldbußenbetrag allein ist nicht die vollständige Rechtsfolge.", sourceKey: "owig-66", passageKey: "owig-66-all", riskLevel: "high" },
  { key: "section-107-fee-5-percent", category: "bescheid", temporal: "current_2026", type: "definition", text: "Die Gebühr beträgt fünf vom Hundert der festgesetzten Geldbuße, mindestens 25 Euro und höchstens 7500 Euro.", sourceKey: "owig-107", passageKey: "owig-107-all", riskLevel: "medium" },
  { key: "fee-not-additional-offence", category: "bescheid", temporal: "current_2026", type: "exception", text: "Die Gebühr ist keine zusätzliche Verkehrstat.", sourceKey: "owig-107", passageKey: "owig-107-all", riskLevel: "medium" },
  { key: "hundred-fine-not-hundred-total", category: "bescheid", temporal: "current_2026", type: "exception", text: "Eine Geldbuße von 100 Euro ist nicht notwendig ein Gesamtzahlbetrag von 100 Euro.", sourceKey: "owig-107", passageKey: "owig-107-all", riskLevel: "high" },
  { key: "bkatv-not-guaranteed-result", category: "offence", temporal: "current_2026", type: "exception", text: "Ein BKatV-Regelsatz ist nicht das garantierte Einzelergebnis.", sourceKey: "bkatv-1", passageKey: "bkatv-1-all", riskLevel: "high" },
  { key: "speeding-not-automatic-fahrverbot", category: "offence", temporal: "current_2026", type: "exception", text: "Ein Geschwindigkeitsverstoß begründet nicht automatisch ein Fahrverbot.", sourceKey: "bkatv-4", passageKey: "bkatv-4-all", riskLevel: "high" },
  { key: "camera-not-final-speed", category: "evidence", temporal: "current_2026", type: "exception", text: "Ein gemessener Kamerawert ist ohne amtliches Verfahren und Abzugsfacts nicht automatisch die rechtlich verwertbare Endgeschwindigkeit.", sourceKey: "bkatv-1", passageKey: "bkatv-1-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "measurement-fail-closed", category: "evidence", temporal: "current_2026", type: "exception", text: "Messgerät, Toleranz oder Messakte dürfen ohne maßgebliche Unterlagen nicht abschließend bewertet werden.", sourceKey: "bkatv-1", passageKey: "bkatv-1-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "classify-common-offences", category: "offence", temporal: "current_2026", type: "procedure", text: "Geschwindigkeit, Rotlicht, Abstand, Mobiltelefon, Gurt, Parken, Vorfahrt, Überholen, Umweltzone, Fahrzeugmängel sowie Alkohol und Cannabis sind einzuordnen, ohne jeden Katalogsatz als Rechenengine auszuführen.", sourceKey: "bkatv-1", passageKey: "bkatv-1-all", riskLevel: "medium", requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "alcohol-05-not-complete-criminal", category: "offence", temporal: "current_2026", type: "exception", text: "Die 0,5-Promille-Regel ist kein vollständiges Strafhaftungsengine.", sourceKey: "stvg-24a", passageKey: "stvg-24a-all", riskLevel: "high" },
  { key: "thc-35-not-complete-criminal", category: "offence", temporal: "current_2026", type: "exception", text: "Der Wert 3,5 ng/ml THC ist kein vollständiges strafrechtliches Ergebnis.", sourceKey: "stvg-24a", passageKey: "stvg-24a-all", riskLevel: "high" },
  { key: "alcohol-not-always-owi", category: "offence", temporal: "current_2026", type: "exception", text: "Ein Alkohol- oder Cannabisvorgang ist nicht immer eine Ordnungswidrigkeit.", sourceKey: "stgb-316", passageKey: "stgb-316-all", riskLevel: "high" },
  { key: "section-24c-novice", category: "offence", temporal: "current_2026", type: "definition", text: "In der Probezeit oder vor Vollendung des 21. Lebensjahres gelten besondere Alkohol- und Cannabisverbote für Kraftfahrzeugführer.", sourceKey: "stvg-24c", passageKey: "stvg-24c-all", riskLevel: "medium" },
  { key: "strafbefehl-not-bescheid", category: "boundary", temporal: "current_2026", type: "exception", text: "Ein Strafbefehl ist kein Bußgeldbescheid.", sourceKey: "stgb-316", passageKey: "stgb-316-all", riskLevel: "high" },
  { key: "beschuldigtenanhoerung-not-owi", category: "boundary", temporal: "current_2026", type: "exception", text: "Eine Beschuldigtenanhörung ist nicht automatisch die OWiG-Anhörung.", sourceKey: "stgb-316", passageKey: "stgb-316-all", riskLevel: "high" },
  { key: "criminal-fine-not-geldbusse", category: "boundary", temporal: "current_2026", type: "exception", text: "Eine strafrechtliche Geldstrafe ist keine OWiG-Geldbuße.", sourceKey: "stgb-316", passageKey: "stgb-316-all", riskLevel: "high" },
  { key: "hit-and-run-is-criminal", category: "boundary", temporal: "current_2026", type: "definition", text: "Unerlaubtes Entfernen vom Unfallort ist eine Straftat und kein gewöhnliches Bußgeldverfahren.", sourceKey: "stgb-142", passageKey: "stgb-142-all", riskLevel: "high" },
  { key: "fine-not-automatically-points", category: "points", temporal: "current_2026", type: "exception", text: "Eine Geldbuße begründet nicht automatisch Punkte.", sourceKey: "stvg-4", passageKey: "stvg-4-all", riskLevel: "high" },
  { key: "one-point-not-withdrawal", category: "points", temporal: "current_2026", type: "exception", text: "Ein Punkt ist keine Entziehung der Fahrerlaubnis.", sourceKey: "stvg-4", passageKey: "stvg-4-all", riskLevel: "high" },
  { key: "fahrverbot-not-points", category: "points", temporal: "current_2026", type: "exception", text: "Ein Fahrverbot ist nicht dasselbe wie Punkte.", sourceKey: "stvg-4", passageKey: "stvg-4-all", riskLevel: "medium" },
  { key: "points-1-3-vormerkung", category: "points", temporal: "current_2026", type: "definition", text: "Ein bis drei Punkte bedeuten die Vormerkung im Fahreignungs-Bewertungssystem.", sourceKey: "stvg-4", passageKey: "stvg-4-all", riskLevel: "medium" },
  { key: "points-4-5-ermahnung", category: "points", temporal: "current_2026", type: "definition", text: "Vier oder fünf Punkte führen zur schriftlichen Ermahnung.", sourceKey: "stvg-4", passageKey: "stvg-4-all", riskLevel: "medium" },
  { key: "points-6-7-verwarnung", category: "points", temporal: "current_2026", type: "definition", text: "Sechs oder sieben Punkte führen zur schriftlichen Verwarnung nach § 4 StVG.", sourceKey: "stvg-4", passageKey: "stvg-4-all", riskLevel: "medium" },
  { key: "points-8-withdrawal", category: "points", temporal: "current_2026", type: "definition", text: "Acht oder mehr Punkte gelten als Ungeeignetheit; die Fahrerlaubnis ist zu entziehen, sofern die Vorstufen durchlaufen wurden.", sourceKey: "stvg-4", passageKey: "stvg-4-all", riskLevel: "high" },
  { key: "points-from-final-decisions", category: "points", temporal: "current_2026", type: "definition", text: "Punkte entstehen aus rechtskräftig geahndeten, in FeV Anlage 13 bezeichneten Entscheidungen.", sourceKey: "fev-40", passageKey: "fev-40-all", riskLevel: "high" },
  { key: "fev-anlage-13-mapping", category: "points", temporal: "current_2026", type: "procedure", text: "Die Punktezahl einer Tat ist anhand der aktuellen FeV Anlage 13 und der rechtskräftigen Entscheidung zu bestimmen.", sourceKey: "fev-anlage-13", passageKey: "fev-anlage-13-all", riskLevel: "high" },
  { key: "kba-letter-not-bescheid", category: "points", temporal: "current_2026", type: "exception", text: "Eine KBA-Punktmitteilung ist kein neuer Bußgeldbescheid.", sourceKey: "kba-punkte", passageKey: "kba-punkte-all", riskLevel: "high" },
  { key: "duration-1-to-3-months", category: "fahrverbot", temporal: "current_2026", type: "definition", text: "Das Fahrverbot dauert einen Monat bis drei Monate.", sourceKey: "stvg-25", passageKey: "stvg-25-all", riskLevel: "medium" },
  { key: "fahrverbot-not-permanent-loss", category: "fahrverbot", temporal: "current_2026", type: "exception", text: "Ein Fahrverbot ist nicht der dauerhafte Verlust der Fahrerlaubnis.", sourceKey: "stvg-25", passageKey: "stvg-25-all", riskLevel: "high" },
  { key: "four-month-not-universal", category: "fahrverbot", temporal: "current_2026", type: "exception", text: "Die Viermonatsregel gilt nicht für jede Person.", sourceKey: "stvg-25", passageKey: "stvg-25-all", riskLevel: "high" },
  { key: "first-bussgeld-not-four-month", category: "fahrverbot", temporal: "current_2026", type: "exception", text: "Das erste Bußgeld überhaupt begründet nicht automatisch die Viermonatsregel.", sourceKey: "stvg-25", passageKey: "stvg-25-all", riskLevel: "high" },
  { key: "individual-fahrverbot-start-fail-closed", category: "fahrverbot", temporal: "current_2026", type: "exception", text: "Der individuelle Beginn eines Fahrverbots darf ohne Rechtskraft, Vorentscheidungen und Führerscheinbehandlung nicht bestimmt werden.", sourceKey: "stvg-25", passageKey: "stvg-25-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "repeat-26-needs-prior", category: "fahrverbot", temporal: "current_2026", type: "exception", text: "Eine Überschreitung von 26 km/h begründet ohne qualifizierte frühere Entscheidung und Jahresfrist nicht automatisch das Wiederholungsfahrverbot.", sourceKey: "bkatv-4", passageKey: "bkatv-4-all", riskLevel: "high" },
  { key: "section-24a-regel-fahrverbot", category: "fahrverbot", temporal: "current_2026", type: "definition", text: "Bei einer Geldbuße nach § 24a StVG ist in der Regel auch ein Fahrverbot anzuordnen.", sourceKey: "stvg-25", passageKey: "stvg-25-all", riskLevel: "medium" },
  { key: "foreign-licence-not-irrelevant", category: "fahrverbot", temporal: "current_2026", type: "exception", text: "Ein ausländischer Führerschein macht das Fahrverbot nicht bedeutungslos.", sourceKey: "stvg-25", passageKey: "stvg-25-all", riskLevel: "high" },
  { key: "foreign-licence-fail-closed", category: "fahrverbot", temporal: "current_2026", type: "exception", text: "Die Wirkung auf einen ausländischen Führerschein darf ohne Land, Wohnsitz und Ausstellungsstaat nicht bestimmt werden.", sourceKey: "stvg-25", passageKey: "stvg-25-all", riskLevel: "high", requiredContextKeys: ["COUNTRY", "PROCESS_VARIANT"] },
  { key: "two-weeks-after-zustellung", category: "einspruch", temporal: "current_2026", type: "deadline", text: "Der Einspruch gegen den Bußgeldbescheid ist innerhalb von zwei Wochen nach Zustellung einzulegen.", sourceKey: "owig-67", passageKey: "owig-67-all", riskLevel: "high" },
  { key: "tatdatum-not-deadline", category: "einspruch", temporal: "current_2026", type: "exception", text: "Das Tatdatum ist nicht der Beginn der Einspruchsfrist.", sourceKey: "owig-67", passageKey: "owig-67-all", riskLevel: "high" },
  { key: "bescheiddatum-not-deadline", category: "einspruch", temporal: "current_2026", type: "exception", text: "Das Bescheiddatum ist nicht der Beginn der Einspruchsfrist.", sourceKey: "owig-67", passageKey: "owig-67-all", riskLevel: "high" },
  { key: "anhoerung-not-einspruch-target", category: "einspruch", temporal: "current_2026", type: "exception", text: "Der Anhörungsbogen ist kein Ziel des Einspruchs nach § 67 OWiG.", sourceKey: "owig-67", passageKey: "owig-67-all", riskLevel: "high" },
  { key: "two-weeks-not-every-deadline", category: "einspruch", temporal: "current_2026", type: "exception", text: "Zwei Wochen sind nicht jede Frist jedes Verkehrsschreibens.", sourceKey: "owig-67", passageKey: "owig-67-all", riskLevel: "high" },
  { key: "individual-deadline-fail-closed", category: "einspruch", temporal: "current_2026", type: "exception", text: "Eine individuelle Einspruchsfrist darf ohne Zustellungstatsachen nicht berechnet werden.", sourceKey: "owig-67", passageKey: "owig-67-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["EVENT_DATE"] },
  { key: "letter-date-not-zustellung", category: "einspruch", temporal: "current_2026", type: "exception", text: "Das auf dem Schreiben gedruckte Datum ist nicht die Zustellung.", sourceKey: "owig-51", passageKey: "owig-51-all", riskLevel: "high" },
  { key: "mailbox-guess-not-zustellung", category: "einspruch", temporal: "current_2026", type: "exception", text: "Ein geratenes Briefkasten-Datum ist keine nachgewiesene Zustellung.", sourceKey: "owig-51", passageKey: "owig-51-all", riskLevel: "high" },
  { key: "einspruch-not-automatic-cancel", category: "einspruch", temporal: "current_2026", type: "exception", text: "Ein Einspruch hebt den Bußgeldbescheid nicht automatisch auf.", sourceKey: "owig-69", passageKey: "owig-69-all", riskLevel: "high" },
  { key: "einspruch-not-automatic-reduction", category: "einspruch", temporal: "current_2026", type: "exception", text: "Ein Einspruch führt nicht automatisch zur Herabsetzung der Geldbuße.", sourceKey: "owig-69", passageKey: "owig-69-all", riskLevel: "high" },
  { key: "einspruch-not-risk-free", category: "einspruch", temporal: "current_2026", type: "exception", text: "Ein Einspruch ist kein risikofreier Wiederholungsversuch.", sourceKey: "owig-66", passageKey: "owig-66-all", riskLevel: "high" },
  { key: "worse-outcome-possible", category: "einspruch", temporal: "current_2026", type: "definition", text: "Nach einem Einspruch kann auch eine für den Betroffenen nachteiligere Entscheidung getroffen werden.", sourceKey: "owig-66", passageKey: "owig-66-all", riskLevel: "high" },
  { key: "after-einspruch-authority-reexamines", category: "einspruch", temporal: "current_2026", type: "procedure", text: "Bei zulässigem Einspruch prüft die Behörde, ob sie den Bescheid aufrechterhält oder zurücknimmt, und darf weiter ermitteln.", sourceKey: "owig-69", passageKey: "owig-69-all", riskLevel: "medium" },
  { key: "late-einspruch-inadmissible", category: "einspruch", temporal: "current_2026", type: "definition", text: "Ein nicht rechtzeitiger oder sonst unwirksamer Einspruch wird als unzulässig verworfen.", sourceKey: "owig-69", passageKey: "owig-69-all", riskLevel: "high" },
  { key: "amtsgericht-orientation-only", category: "einspruch", temporal: "current_2026", type: "procedure", text: "Nach Aufrechterhaltung kann die Sache zum Amtsgericht gelangen; das begründet keine Prozessstrategie.", sourceKey: "owig-69", passageKey: "owig-69-all", riskLevel: "high" },
  { key: "wiedereinsetzung-not-promised", category: "einspruch", temporal: "current_2026", type: "exception", text: "Wiedereinsetzung in den vorigen Stand darf nicht zugesagt werden.", sourceKey: "owig-52", passageKey: "owig-52-all", riskLevel: "high" },
  { key: "individual-wiedereinsetzung-fail-closed", category: "einspruch", temporal: "current_2026", type: "exception", text: "Ob Wiedereinsetzung in Betracht kommt, darf ohne Verschuldens- und Fristfacts nicht entschieden werden.", sourceKey: "owig-52", passageKey: "owig-52-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "current-six-month-section-26", category: "limitation", temporal: "current_2026", type: "deadline", text: "Seit dem 1. Juli 2026 beträgt die Verfolgungsverjährung bei Ordnungswidrigkeiten nach § 24 Absatz 1 StVG sechs Monate.", sourceKey: "stvg-26", passageKey: "stvg-26-all", riskLevel: "high", requiresEffectiveDate: true },
  { key: "effective-1-july-2026", category: "limitation", temporal: "current_2026", type: "definition", text: "Die einheitliche Sechsmonatsfrist des § 26 Absatz 3 Satz 1 StVG gilt seit dem 1. Juli 2026.", sourceKey: "stvg-26", passageKey: "stvg-26-all", riskLevel: "high", requiresEffectiveDate: true },
  { key: "two-year-and-five-year-special", category: "limitation", temporal: "current_2026", type: "deadline", text: "Für bestimmte Fahrzeugbauartverstöße gelten zwei Jahre, für bestimmte Fälle des § 24 Absatz 2 StVG fünf Jahre.", sourceKey: "stvg-26", passageKey: "stvg-26-all", riskLevel: "medium" },
  { key: "six-months-not-automatic-bar", category: "limitation", temporal: "current_2026", type: "exception", text: "Sechs Monate seit der Tat bedeuten nicht automatisch Verjährung.", sourceKey: "stvg-26", passageKey: "stvg-26-all", riskLevel: "high" },
  { key: "no-letter-not-no-interruption", category: "limitation", temporal: "current_2026", type: "exception", text: "Kein empfangenes Schreiben bedeutet nicht, dass keine Unterbrechungshandlung vorliegt.", sourceKey: "owig-33", passageKey: "owig-33-all", riskLevel: "high" },
  { key: "interruption-not-necessarily-receipt", category: "limitation", temporal: "current_2026", type: "exception", text: "Der Empfangstag eines Anhörungsbogens ist nicht notwendig der Unterbrechungszeitpunkt.", sourceKey: "owig-33", passageKey: "owig-33-all", riskLevel: "high" },
  { key: "historic-three-month-not-current", category: "limitation", temporal: "current_2026", type: "exception", text: "Die frühere dreimonatige Frist vor Bußgeldbescheid ist nicht heutiges Recht.", sourceKey: "stvg-26", passageKey: "stvg-26-all", riskLevel: "high" },
  { key: "individual-verjaehrung-fail-closed", category: "limitation", temporal: "current_2026", type: "exception", text: "Eine individuelle Verfolgungsverjährung darf ohne Tatdatum, Unterbrechungsakte und Aktenlage nicht berechnet werden.", sourceKey: "owig-33", passageKey: "owig-33-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "payment-after-rechtskraft", category: "payment", temporal: "current_2026", type: "deadline", text: "Nach Rechtskraft ist die Geldbuße spätestens zwei Wochen danach oder zu einem späteren bestimmten Fälligkeitstag zu zahlen.", sourceKey: "owig-66", passageKey: "owig-66-all", riskLevel: "medium" },
  { key: "einspruch-deadline-not-payment-deadline", category: "payment", temporal: "current_2026", type: "exception", text: "Die Einspruchsfrist ist nicht die Zahlungsfrist.", sourceKey: "owig-66", passageKey: "owig-66-all", riskLevel: "high" },
  { key: "cannot-pay-not-ignore", category: "payment", temporal: "current_2026", type: "exception", text: "Zahlungsunfähigkeit erlaubt nicht, die Geldbuße zu ignorieren.", sourceKey: "owig-96", passageKey: "owig-96-all", riskLevel: "high" },
  { key: "installments-not-automatic", category: "payment", temporal: "current_2026", type: "exception", text: "Ratenzahlung ist nicht automatisch bewilligt.", sourceKey: "owig-17", passageKey: "owig-17-all", riskLevel: "medium" },
  { key: "unpaid-not-automatic-prison", category: "payment", temporal: "current_2026", type: "exception", text: "Eine unbezahlte Geldbuße ist nicht automatisch sofortige Haft.", sourceKey: "owig-96", passageKey: "owig-96-all", riskLevel: "high" },
  { key: "erzwingungshaft-not-criminal-sentence", category: "payment", temporal: "current_2026", type: "exception", text: "Erzwingungshaft ist kein Ersatzstrafurteil für die Verkehrstat.", sourceKey: "owig-96", passageKey: "owig-96-all", riskLevel: "high" },
  { key: "erzwingungshaft-not-debt-gone", category: "payment", temporal: "current_2026", type: "exception", text: "Erzwingungshaft lässt die Geldbuße nicht entfallen.", sourceKey: "owig-96", passageKey: "owig-96-all", riskLevel: "high" },
  { key: "erzwingungshaft-conditions", category: "payment", temporal: "current_2026", type: "definition", text: "Erzwingungshaft setzt unbezahlte Geldbuße, nicht dargetane Zahlungsunfähigkeit, gesetzliche Belehrung und fehlende bekannte Unfähigkeitsumstände voraus.", sourceKey: "owig-96", passageKey: "owig-96-all", riskLevel: "high" },
  { key: "camera-not-auto-valid-or-invalid", category: "evidence", temporal: "current_2026", type: "exception", text: "Ein Kameramodell ist nicht automatisch gültig oder ungültig.", sourceKey: "bkatv-1", passageKey: "bkatv-1-all", riskLevel: "high" },
  { key: "blurry-not-automatic-dismissal", category: "evidence", temporal: "current_2026", type: "exception", text: "Ein unscharfes Foto führt nicht automatisch zur Einstellung.", sourceKey: "owig-66", passageKey: "owig-66-all", riskLevel: "high" },
  { key: "photo-not-birello-biometric", category: "evidence", temporal: "current_2026", type: "exception", text: "BIRELLO darf aus einer Gesichtsfotoähnlichkeit nicht feststellen, dass eine Person der Fahrer ist oder nicht ist.", sourceKey: "owig-66", passageKey: "owig-66-all", riskLevel: "high" },
  { key: "missing-face-not-holder-liable", category: "evidence", temporal: "current_2026", type: "exception", text: "Fehlende Gesichtserkennbarkeit macht den Halter nicht automatisch bußgeldpflichtig.", sourceKey: "stvg-25a", passageKey: "stvg-25a-all", riskLevel: "high" },
  { key: "logo-not-authenticity", category: "authenticity", temporal: "current_2026", type: "exception", text: "Ein Polizeilogo beweist nicht die Echtheit eines Schreibens.", sourceKey: "kba-punkte", passageKey: "kba-punkte-all", riskLevel: "high" },
  { key: "pdf-not-authenticity", category: "authenticity", temporal: "current_2026", type: "exception", text: "Ein amtlich wirkendes PDF beweist nicht die Echtheit.", sourceKey: "kba-punkte", passageKey: "kba-punkte-all", riskLevel: "high" },
  { key: "qr-not-safe", category: "authenticity", temporal: "current_2026", type: "exception", text: "Ein QR-Code ist kein sicherer Zahlungsweg.", sourceKey: "kba-punkte", passageKey: "kba-punkte-all", riskLevel: "high" },
  { key: "independent-authority-contact", category: "authenticity", temporal: "current_2026", type: "procedure", text: "Bei verdächtiger Bußgeldkommunikation ist die Behörde unabhängig über einen bekannten offiziellen Kanal zu prüfen.", sourceKey: "kba-punkte", passageKey: "kba-punkte-all", riskLevel: "high" },
  { key: "foreign-residence-not-unenforceable", category: "boundary", temporal: "current_2026", type: "exception", text: "Ein ausländischer Wohnsitz macht eine deutsche Geldbuße nicht automatisch unvollstreckbar.", sourceKey: "stvg-26", passageKey: "stvg-26-all", riskLevel: "high" },
  { key: "police-not-always-final-authority", category: "boundary", temporal: "current_2026", type: "exception", text: "Ein Polizeibeamter ist nicht immer die endgültige Bußgeldbehörde.", sourceKey: "stvg-26", passageKey: "stvg-26-all", riskLevel: "high" },
  { key: "police-letter-not-court", category: "boundary", temporal: "current_2026", type: "exception", text: "Ein Polizeischreiben ist keine Gerichtsentscheidung.", sourceKey: "owig-69", passageKey: "owig-69-all", riskLevel: "medium" },
  { key: "land-not-exact-office", category: "boundary", temporal: "current_2026", type: "exception", text: "Das Bundesland bestimmt nicht automatisch die genaue örtliche Bußgeldstelle.", sourceKey: "stvg-26", passageKey: "stvg-26-all", riskLevel: "medium" },
  { key: "local-authority-fetch-live", category: "boundary", temporal: "current_2026", type: "procedure", text: "Die aktuelle örtliche Bußgeldbehörde oder Kontaktstelle ist live zu bestimmen.", sourceKey: "kba-punkte", passageKey: "kba-punkte-all", riskLevel: "medium" },
  { key: "probezeit-not-from-age-alone", category: "boundary", temporal: "current_2026", type: "exception", text: "Das Alter allein entscheidet nicht über jede Probezeitfolge.", sourceKey: "stvg-24c", passageKey: "stvg-24c-all", riskLevel: "medium" },
  { key: "do-not-pay-if-einspruch-intended", category: "payment", temporal: "current_2026", type: "procedure", text: "Ohne geklärten Verfahrensstand soll nicht zur sofortigen Zahlung geraten werden, wenn der Betroffene Einspruch beabsichtigt.", sourceKey: "owig-67", passageKey: "owig-67-all", riskLevel: "high" },
]);

export const OWI_PROCESSES: readonly OwiProcessSpec[] = Object.freeze([
  { key: "schreiben-einordnen", title: "Verkehrsschreiben einordnen 2026", trigger: "Ein Schreiben, das wie Polizei oder Bußgeld wirkt, liegt vor", safeFirstStep: "Dokumenttyp und Rechtsrahmen trennen; Polizeischreiben nicht als Bußgeldbescheid behandeln.", riskLevel: "high" },
  { key: "rechtsrahmen-bestimmen", title: "OWi Strafsache Fahrerlaubnis Zivil bestimmen 2026", trigger: "Unklar ist, ob Ordnungswidrigkeit, Straftat, Fahrerlaubnis- oder Versicherungssache vorliegt", safeFirstStep: "Ohne gesicherten Rechtsrahmen nicht abschließend antworten.", riskLevel: "high" },
  { key: "empfaengerrolle-bestimmen", title: "Empfängerrolle bestimmen 2026", trigger: "Unklar ist, ob Betroffener, Halter, Fahrer oder Zeuge angesprochen ist", safeFirstStep: "Halter nicht mit Fahrer und Zeuge nicht mit Betroffenem gleichsetzen.", riskLevel: "high" },
  { key: "anhoerung-betroffener", title: "Anhörung als Betroffener behandeln 2026", trigger: "Ein Anhörungsbogen als Betroffener liegt vor", safeFirstStep: "Anhörung nicht als Bescheid behandeln; zur Sache darf geschwiegen werden, Personalien nicht erfinden.", riskLevel: "high" },
  { key: "zeugenfragebogen", title: "Zeugenfragebogen behandeln 2026", trigger: "Ein Zeugenfragebogen liegt vor", safeFirstStep: "Rolle, Verwandtschaft und verlangte Angabe prüfen; nicht pauschal zum Schweigen raten.", riskLevel: "high" },
  { key: "halter-fahrer-grenze", title: "Halter- oder Fahrergrenze bestimmen 2026", trigger: "Der Halter war nicht der Fahrer oder der Fahrer ist unbekannt", safeFirstStep: "Keine US-Halterhaftung annehmen; § 25a und Fahrtenbuch getrennt prüfen.", riskLevel: "high" },
  { key: "verwarnung-einordnen", title: "Verwarnung einordnen 2026", trigger: "Eine Verwarnung oder ein Verwarnungsgeld liegt vor", safeFirstStep: "OWiG-Verwarnung und Punkte-Verwarnung trennen; Annahme ist nicht Pflicht.", riskLevel: "medium" },
  { key: "bussgeldbescheid-pruefen", title: "Bußgeldbescheid prüfen 2026", trigger: "Ein Bußgeldbescheid liegt vor", safeFirstStep: "Inhalt, Zustellung, Geldbuße, Nebenfolgen und Rechtsbehelf trennen.", riskLevel: "high" },
  { key: "geldbusse-gebuehren", title: "Geldbuße Gebühren Auslagen einordnen 2026", trigger: "Unklar ist, was zu zahlen ist", safeFirstStep: "Geldbuße, fünf Prozent Gebühr und Auslagen trennen.", riskLevel: "medium" },
  { key: "tatvorwurf-bkatv", title: "Tatvorwurf oder BKatV einordnen 2026", trigger: "Ein Katalogverstoß soll eingeordnet werden", safeFirstStep: "Nur klassifizieren; Regelsatz nicht als garantiertes Ergebnis behandeln.", riskLevel: "medium" },
  { key: "geschwindigkeit", title: "Geschwindigkeitsverstoß einordnen 2026", trigger: "Eine Geschwindigkeitsmessung wird vorgeworfen", safeFirstStep: "Messwert nicht als Endgeschwindigkeit behandeln; Fahrverbot nicht automatisch annehmen.", riskLevel: "high" },
  { key: "alkohol-cannabis", title: "Alkohol- oder Cannabisgrenze einordnen 2026", trigger: "Alkohol, THC oder andere Mittel werden vorgeworfen", safeFirstStep: "OWi-Schwellen und Straftat trennen; 0,5 Promille oder 3,5 ng/ml nicht als Strafengine behandeln.", riskLevel: "high" },
  { key: "punkte-bestimmen", title: "Punkte bestimmen 2026", trigger: "Gefragt wird, wie viele Punkte eine Tat hat", safeFirstStep: "Nur FeV Anlage 13 und rechtskräftige Entscheidung verwenden; Geldbuße nicht als Punktbeweis.", riskLevel: "high" },
  { key: "punktestand-einordnen", title: "Fahreignungs-Punktestand einordnen 2026", trigger: "Ein Punktestand oder eine KBA-Mitteilung liegt vor", safeFirstStep: "Stufen 1–3, 4–5, 6–7 und 8+ trennen; KBA-Schreiben nicht als Bußgeldbescheid lesen.", riskLevel: "high" },
  { key: "fahrverbot-einordnen", title: "Fahrverbot einordnen 2026", trigger: "Ein Fahrverbot ist angeordnet oder droht", safeFirstStep: "Fahrverbot und Entziehung trennen; Dauer und Wirksamkeit nicht ohne Tatsachen festlegen.", riskLevel: "high" },
  { key: "viermonatsregel", title: "Viermonatsregel einordnen 2026", trigger: "Der Beginn des Fahrverbots innerhalb von vier Monaten wird gewünscht", safeFirstStep: "Zwei-Jahres-Vorentscheidung prüfen; erste Geldbuße nicht mit der Regel gleichsetzen.", riskLevel: "high" },
  { key: "fahrtenbuch-boundary", title: "Fahrtenbuch-Grenze einordnen 2026", trigger: "Ein Fahrtenbuch wird angedroht oder angeordnet", safeFirstStep: "Fahrtenbuch nicht mit Bußgeld oder § 25a verwechseln.", riskLevel: "medium" },
  { key: "halterkosten-25a", title: "Halterkosten nach § 25a behandeln 2026", trigger: "Ein Kostenbescheid wegen Haltens oder Parkens liegt vor", safeFirstStep: "Kosten nicht als Fahrergeldbuße behandeln.", riskLevel: "medium" },
  { key: "einspruch-einordnen", title: "Einspruch einordnen 2026", trigger: "Gegen einen Bußgeldbescheid soll Einspruch eingelegt werden", safeFirstStep: "Zwei Wochen nach Zustellung nennen; kein risikofreies Ergebnis versprechen.", riskLevel: "high" },
  { key: "zustellung-frist", title: "Zustellung und Einspruchsfrist bestimmen 2026", trigger: "Die Einspruchsfrist soll berechnet werden", safeFirstStep: "Ohne Zustellungstatsachen keine individuelle Frist berechnen.", riskLevel: "high" },
  { key: "nach-einspruch", title: "Verfahren nach Einspruch verstehen 2026", trigger: "Einspruch ist eingelegt oder die Behörde hält den Bescheid aufrecht", safeFirstStep: "Weitere Prüfung, mögliche Rücknahme und Amtsgerichtsweg erklären, ohne Ausgang vorherzusagen.", riskLevel: "high" },
  { key: "wiedereinsetzung", title: "Versäumte Frist oder Wiedereinsetzung 2026", trigger: "Die Einspruchsfrist ist versäumt", safeFirstStep: "Wiedereinsetzung nicht zusagen und ohne Verschuldensfacts fail-closed bleiben.", riskLevel: "high" },
  { key: "verjaehrung-bestimmen", title: "Verfolgungsverjährung bestimmen 2026", trigger: "Gefragt wird, ob die Tat verjährt ist", safeFirstStep: "Aktuelle Sechsmonatsfrist seit 1. Juli 2026 nennen; Einzelfall ohne Akte nicht berechnen.", riskLevel: "high" },
  { key: "verjaehrungsunterbrechung", title: "Verjährungsunterbrechung einordnen 2026", trigger: "Eine Anhörung oder ein Verfahrensakt könnte die Frist unterbrochen haben", safeFirstStep: "Empfang nicht mit Abfassung gleichsetzen; kein Brief nicht als fehlende Unterbrechung behandeln.", riskLevel: "high" },
  { key: "zahlung-rechtskraft", title: "Zahlung nach Rechtskraft einordnen 2026", trigger: "Nach Rechtskraft oder Fälligkeit soll gezahlt werden", safeFirstStep: "Einspruchsfrist und Zahlungsfrist trennen.", riskLevel: "medium" },
  { key: "zahlungserleichterung", title: "Zahlungserleichterung beantragen 2026", trigger: "Die Geldbuße kann nicht sofort gezahlt werden", safeFirstStep: "Nicht ignorieren; Ratenzahlung nicht als automatisch bewilligt behandeln.", riskLevel: "medium" },
  { key: "erzwingungshaft", title: "Vollstreckung oder Erzwingungshaft einordnen 2026", trigger: "Haft oder Vollstreckung wird angedroht", safeFirstStep: "Gesetzliche Voraussetzungen nennen; unbezahlte Geldbuße nicht als sofortige Haft behandeln.", riskLevel: "high" },
  { key: "technische-beweisfrage", title: "Technische Beweisfrage-Grenze 2026", trigger: "Messgerät, Foto oder Toleranz wird angegriffen", safeFirstStep: "Keine Internetmythen; Messung nur mit Unterlagen und sonst zur Fachprüfung leiten.", riskLevel: "high" },
  { key: "behoerde-bestimmen", title: "Zuständige Behörde bestimmen 2026", trigger: "Unklar ist, wer Polizei, Bußgeldbehörde, KBA oder Gericht ist", safeFirstStep: "Rollen trennen; örtliche Stelle live prüfen.", riskLevel: "medium" },
  { key: "auslaendische-fahrerlaubnis", title: "Ausländische Fahrerlaubnis oder grenzüberschreitende Grenze 2026", trigger: "Ausländischer Führerschein oder Wohnsitz ist betroffen", safeFirstStep: "Fahrverbot nicht für wirkungslos erklären; komplexe Vollstreckung nur routen.", riskLevel: "high" },
  { key: "authentizitaet-phishing", title: "Authentizität oder Fake-Bußgeld prüfen 2026", trigger: "Ein bußgeldähnliches Schreiben verlangt sofortige Zahlung über Link oder QR-Code", safeFirstStep: "Logo und PDF nicht als Echtheit behandeln; unabhängig über bekannten Behördenkanal prüfen.", riskLevel: "high" },
]);

export const OWI_FORMS: readonly OwiFormSpec[] = Object.freeze([
  { key: "einspruch", name: "Einspruch gegen den Bußgeldbescheid", identifier: "OWI-Einspruch", purpose: "Schriftlicher oder zur Niederschrift erklärter Einspruch innerhalb von zwei Wochen nach Zustellung", submissionChannels: ["written_or_on_record_at_issuing_authority"], sourceKey: "owig-67", passageKey: "owig-67-all" },
  { key: "anhoerung-stellungnahme", name: "Stellungnahme zur Anhörung", identifier: "OWI-Anhoerung-Stellungnahme", purpose: "Freiwillige Äußerung des Betroffenen zur Beschuldigung", submissionChannels: ["written_to_authority"], sourceKey: "owig-55", passageKey: "owig-55-all" },
  { key: "zahlungserleichterung-antrag", name: "Antrag auf Zahlungserleichterung", identifier: "OWI-Zahlungserleichterung", purpose: "Darlegung, warum sofortige Zahlung nach den wirtschaftlichen Verhältnissen nicht zumutbar ist", submissionChannels: ["written_or_on_record"], sourceKey: "owig-66", passageKey: "owig-66-all" },
  { key: "wiedereinsetzung-antrag", name: "Antrag auf Wiedereinsetzung", identifier: "OWI-Wiedereinsetzung", purpose: "Wiedereinsetzung nach unverschuldeter Fristversäumung", submissionChannels: ["written_to_authority_or_court"], sourceKey: "owig-52", passageKey: "owig-52-all" },
  { key: "gerichtliche-entscheidung-62", name: "Antrag auf gerichtliche Entscheidung", identifier: "OWI-Gerichtliche-Entscheidung", purpose: "Gerichtliche Entscheidung gegen die Verwerfung eines Einspruchs oder gegen bestimmte Verwaltungsmaßnahmen", submissionChannels: ["written_to_authority"], sourceKey: "owig-69", passageKey: "owig-69-all" },
  { key: "halterkosten-anfechtung", name: "Antrag gegen Halterkostenentscheidung", identifier: "OWI-Halterkosten-Antrag", purpose: "Gerichtliche Entscheidung gegen eine Kostenentscheidung nach § 25a StVG binnen zwei Wochen nach Zustellung", submissionChannels: ["written_to_authority"], sourceKey: "stvg-25a", passageKey: "stvg-25a-all" },
]);

export const OWI_PROCESS_BINDINGS: readonly OwiBindingSpec[] = Object.freeze([
  { processKey: "schreiben-einordnen", role: "orientation_basis", sequenceContext: "classify-letter", claimKeys: ["police-letter-not-bescheid", "anhoerung-not-bescheid", "verwarnung-not-bescheid", "payment-reminder-not-new-bescheid"] },
  { processKey: "rechtsrahmen-bestimmen", role: "identification", sequenceContext: "legal-system-gate", claimKeys: ["traffic-not-automatically-owi", "unclear-legal-system-fail-closed", "criminal-route-out", "licence-admin-not-bussgeld", "civil-insurance-not-bussgeld", "fine-looking-not-strafbefehl", "bussgeld-not-criminal-conviction", "userlocale-not-jurisdiction", "bkatv-not-guaranteed-result", "strafbefehl-not-bescheid"] },
  { processKey: "empfaengerrolle-bestimmen", role: "identification", sequenceContext: "roles", claimKeys: ["halter-not-fahrer", "zeuge-not-betroffener", "betroffener-not-finally-responsible", "letter-to-keeper-not-committed"] },
  { processKey: "anhoerung-betroffener", role: "negative_control", sequenceContext: "section-55", claimKeys: ["anhoerung-not-bescheid", "anhoerung-opportunity", "receiving-anhoerung-not-imposed", "betroffener-not-obliged-to-confess", "silence-not-false-identity", "never-fabricate-identity", "false-identity-can-be-owi"] },
  { processKey: "zeugenfragebogen", role: "context_gate", sequenceContext: "witness", claimKeys: ["zeugenbogen-not-anhoerung", "zeuge-not-betroffener", "stpo-52-family-not-universal", "stpo-55-self-incrimination", "witness-not-ignore-every-requirement", "no-blanket-never-answer"] },
  { processKey: "halter-fahrer-grenze", role: "negative_control", sequenceContext: "keeper", claimKeys: ["halter-not-fahrer", "no-us-style-owner-liability", "section-25a-costs-not-driver-fine", "fahrtenbuch-not-bussgeld"] },
  { processKey: "verwarnung-einordnen", role: "decision", sequenceContext: "section-56", claimKeys: ["verwarnung-not-bescheid", "verwarnung-5-to-55", "verwarnung-needs-consent-and-payment", "effective-verwarnung-closes-prosecution", "unpaid-verwarnung-not-late-final", "no-fees-for-effective-verwarnung", "verwarnung-not-mandatory-acceptance", "owig-verwarnung-not-stvg-verwarnung"] },
  { processKey: "bussgeldbescheid-pruefen", role: "required_information", sequenceContext: "section-66", claimKeys: ["bescheid-required-contents", "fine-alone-not-complete", "police-letter-not-bescheid"] },
  { processKey: "geldbusse-gebuehren", role: "identification", sequenceContext: "section-107", claimKeys: ["section-107-fee-5-percent", "fee-not-additional-offence", "hundred-fine-not-hundred-total"] },
  { processKey: "tatvorwurf-bkatv", role: "identification", sequenceContext: "bkatv", claimKeys: ["classify-common-offences", "bkatv-not-guaranteed-result", "kostenbescheid-not-geldbusse", "fine-not-automatically-points"] },
  { processKey: "geschwindigkeit", role: "context_gate", sequenceContext: "speed", claimKeys: ["speeding-not-automatic-fahrverbot", "camera-not-final-speed", "measurement-fail-closed", "repeat-26-needs-prior"] },
  { processKey: "alkohol-cannabis", role: "context_gate", sequenceContext: "intoxication", claimKeys: ["alcohol-05-not-complete-criminal", "thc-35-not-complete-criminal", "alcohol-not-always-owi", "section-24c-novice", "section-24a-regel-fahrverbot", "criminal-route-out"] },
  { processKey: "punkte-bestimmen", role: "deadline_gate", sequenceContext: "fev-13", claimKeys: ["points-from-final-decisions", "fev-anlage-13-mapping", "fine-not-automatically-points"] },
  { processKey: "punktestand-einordnen", role: "decision", sequenceContext: "section-4", claimKeys: ["points-1-3-vormerkung", "points-4-5-ermahnung", "points-6-7-verwarnung", "points-8-withdrawal", "one-point-not-withdrawal", "points-not-criminal-record", "kba-letter-not-bescheid", "owig-verwarnung-not-stvg-verwarnung", "fahrverbot-not-entziehung"] },
  { processKey: "fahrverbot-einordnen", role: "decision", sequenceContext: "section-25", claimKeys: ["fahrverbot-not-entziehung", "fahrverbot-not-permanent-loss", "duration-1-to-3-months", "fahrverbot-not-points"] },
  { processKey: "viermonatsregel", role: "context_gate", sequenceContext: "section-25-3", claimKeys: ["four-month-not-universal", "first-bussgeld-not-four-month", "individual-fahrverbot-start-fail-closed"] },
  { processKey: "fahrtenbuch-boundary", role: "legal_remedy_gate", sequenceContext: "section-31a", claimKeys: ["fahrtenbuch-not-bussgeld", "fahrtenbuch-not-automatic", "unidentified-not-no-consequences", "fahrtenbuch-not-25a"] },
  { processKey: "halterkosten-25a", role: "legal_remedy_gate", sequenceContext: "section-25a", claimKeys: ["section-25a-costs-not-driver-fine", "parking-cost-not-ordinary-bussgeld", "section-25a-fee-20", "kostenbescheid-not-geldbusse"] },
  { processKey: "einspruch-einordnen", role: "legal_remedy_gate", sequenceContext: "section-67", claimKeys: ["two-weeks-after-zustellung", "einspruch-not-automatic-cancel", "einspruch-not-risk-free", "worse-outcome-possible", "anhoerung-not-einspruch-target"] },
  { processKey: "zustellung-frist", role: "deadline_gate", sequenceContext: "section-51-67", claimKeys: ["letter-date-not-zustellung", "bescheiddatum-not-deadline", "tatdatum-not-deadline", "individual-deadline-fail-closed", "two-weeks-not-every-deadline", "mailbox-guess-not-zustellung"] },
  { processKey: "nach-einspruch", role: "next_state", sequenceContext: "section-69", claimKeys: ["after-einspruch-authority-reexamines", "einspruch-not-automatic-reduction", "late-einspruch-inadmissible", "amtsgericht-orientation-only"] },
  { processKey: "wiedereinsetzung", role: "context_gate", sequenceContext: "section-52", claimKeys: ["wiedereinsetzung-not-promised", "individual-wiedereinsetzung-fail-closed"] },
  { processKey: "verjaehrung-bestimmen", role: "deadline_gate", sequenceContext: "section-26", claimKeys: ["current-six-month-section-26", "effective-1-july-2026", "historic-three-month-not-current", "six-months-not-automatic-bar", "two-year-and-five-year-special", "individual-verjaehrung-fail-closed"] },
  { processKey: "verjaehrungsunterbrechung", role: "deadline_gate", sequenceContext: "section-33", claimKeys: ["interruption-not-necessarily-receipt", "no-letter-not-no-interruption", "individual-verjaehrung-fail-closed"] },
  { processKey: "zahlung-rechtskraft", role: "deadline_gate", sequenceContext: "payment", claimKeys: ["payment-after-rechtskraft", "einspruch-deadline-not-payment-deadline", "do-not-pay-if-einspruch-intended", "cannot-pay-not-ignore"] },
  { processKey: "zahlungserleichterung", role: "application_route", sequenceContext: "relief", claimKeys: ["cannot-pay-not-ignore", "installments-not-automatic"] },
  { processKey: "erzwingungshaft", role: "negative_control", sequenceContext: "section-96", claimKeys: ["erzwingungshaft-conditions", "unpaid-not-automatic-prison", "erzwingungshaft-not-criminal-sentence", "erzwingungshaft-not-debt-gone"] },
  { processKey: "technische-beweisfrage", role: "evidence_requirement", sequenceContext: "measurement", claimKeys: ["measurement-fail-closed", "camera-not-auto-valid-or-invalid", "blurry-not-automatic-dismissal", "photo-not-birello-biometric", "missing-face-not-holder-liable"] },
  { processKey: "behoerde-bestimmen", role: "identification", sequenceContext: "authority", claimKeys: ["police-not-always-final-authority", "police-letter-not-court", "land-not-exact-office", "local-authority-fetch-live"] },
  { processKey: "auslaendische-fahrerlaubnis", role: "context_gate", sequenceContext: "cross-border", claimKeys: ["foreign-licence-not-irrelevant", "foreign-licence-fail-closed", "foreign-residence-not-unenforceable"] },
  { processKey: "authentizitaet-phishing", role: "negative_control", sequenceContext: "fake-fine", claimKeys: ["logo-not-authenticity", "pdf-not-authenticity", "qr-not-safe", "independent-authority-contact"] },
]);

export const OWI_PROCESS_SCENARIOS: readonly OwiProcessScenario[] = Object.freeze([
  { id: "generic-police-letter", label: "Allgemeines Polizeischreiben", coverage: "COVERED", requiredClaimKeys: ["police-letter-not-bescheid", "traffic-not-automatically-owi"], requiredProcessKeys: ["schreiben-einordnen"] },
  { id: "anhoerungsbogen", label: "Anhörungsbogen", coverage: "COVERED", requiredClaimKeys: ["anhoerung-not-bescheid", "betroffener-not-obliged-to-confess"], requiredProcessKeys: ["anhoerung-betroffener"], requiredFormIdentifiers: ["OWI-Anhoerung-Stellungnahme"] },
  { id: "zeugenfragebogen", label: "Zeugenfragebogen", coverage: "COVERED", requiredClaimKeys: ["zeugenbogen-not-anhoerung", "no-blanket-never-answer"], requiredProcessKeys: ["zeugenfragebogen"] },
  { id: "holder-not-driver", label: "Halter war nicht Fahrer", coverage: "COVERED", requiredClaimKeys: ["halter-not-fahrer", "no-us-style-owner-liability"], requiredProcessKeys: ["halter-fahrer-grenze"] },
  { id: "spouse-may-have-driven", label: "Angehöriger könnte gefahren sein", coverage: "COVERED", requiredClaimKeys: ["stpo-52-family-not-universal", "zeuge-not-betroffener"], requiredProcessKeys: ["zeugenfragebogen"] },
  { id: "unknown-driver", label: "Unbekannter Fahrer", coverage: "COVERED", requiredClaimKeys: ["unidentified-not-no-consequences", "fahrtenbuch-not-automatic"], requiredProcessKeys: ["fahrtenbuch-boundary"] },
  { id: "parking-25a", label: "Parkverstoß Halterkosten", coverage: "COVERED", requiredClaimKeys: ["section-25a-costs-not-driver-fine", "parking-cost-not-ordinary-bussgeld"], requiredProcessKeys: ["halterkosten-25a"], requiredFormIdentifiers: ["OWI-Halterkosten-Antrag"] },
  { id: "fahrtenbuch-boundary", label: "Fahrtenbuch-Grenze", coverage: "COVERED", requiredClaimKeys: ["fahrtenbuch-not-bussgeld", "fahrtenbuch-not-25a"], requiredProcessKeys: ["fahrtenbuch-boundary"] },
  { id: "verwarnung-20", label: "Verwarnung 20 Euro", coverage: "COVERED", requiredClaimKeys: ["verwarnung-5-to-55", "verwarnung-not-bescheid"], requiredProcessKeys: ["verwarnung-einordnen"] },
  { id: "verwarnung-unpaid", label: "Verwarnung nicht gezahlt", coverage: "COVERED", requiredClaimKeys: ["unpaid-verwarnung-not-late-final", "verwarnung-not-mandatory-acceptance"], requiredProcessKeys: ["verwarnung-einordnen"] },
  { id: "bussgeldbescheid", label: "Bußgeldbescheid", coverage: "COVERED", requiredClaimKeys: ["bescheid-required-contents", "fine-alone-not-complete"], requiredProcessKeys: ["bussgeldbescheid-pruefen"] },
  { id: "fine-plus-fees", label: "Verwirrung Geldbuße und Gebühren", coverage: "COVERED", requiredClaimKeys: ["hundred-fine-not-hundred-total", "section-107-fee-5-percent"], requiredProcessKeys: ["geldbusse-gebuehren"] },
  { id: "speeding", label: "Geschwindigkeitsverstoß", coverage: "COVERED", requiredClaimKeys: ["speeding-not-automatic-fahrverbot", "camera-not-final-speed"], requiredProcessKeys: ["geschwindigkeit"] },
  { id: "red-light", label: "Rotlichtverstoß", coverage: "COVERED", requiredClaimKeys: ["classify-common-offences", "bkatv-not-guaranteed-result"], requiredProcessKeys: ["tatvorwurf-bkatv"] },
  { id: "mobile-phone", label: "Mobiltelefon", coverage: "COVERED", requiredClaimKeys: ["classify-common-offences", "fine-not-automatically-points"], requiredProcessKeys: ["tatvorwurf-bkatv"] },
  { id: "parking", label: "Parkverstoß", coverage: "COVERED", requiredClaimKeys: ["classify-common-offences", "kostenbescheid-not-geldbusse"], requiredProcessKeys: ["tatvorwurf-bkatv"] },
  { id: "distance", label: "Abstandsverstoß", coverage: "COVERED", requiredClaimKeys: ["classify-common-offences", "bkatv-not-guaranteed-result"], requiredProcessKeys: ["tatvorwurf-bkatv"] },
  { id: "alcohol-owi", label: "Alkohol-Ordnungswidrigkeit", coverage: "COVERED", requiredClaimKeys: ["alcohol-05-not-complete-criminal", "section-24a-regel-fahrverbot"], requiredProcessKeys: ["alkohol-cannabis"] },
  { id: "cannabis-owi", label: "Cannabis-Ordnungswidrigkeit", coverage: "COVERED", requiredClaimKeys: ["thc-35-not-complete-criminal", "alcohol-not-always-owi"], requiredProcessKeys: ["alkohol-cannabis"] },
  { id: "possible-criminal-intoxication", label: "Mögliche strafbare Trunkenheit", coverage: "COVERED", requiredClaimKeys: ["alcohol-not-always-owi", "criminal-route-out"], requiredProcessKeys: ["alkohol-cannabis"] },
  { id: "driving-without-licence", label: "Fahren ohne Fahrerlaubnis", coverage: "COVERED", requiredClaimKeys: ["criminal-route-out", "strafbefehl-not-bescheid"], requiredProcessKeys: ["rechtsrahmen-bestimmen"] },
  { id: "hit-and-run", label: "Unfallflucht", coverage: "COVERED", requiredClaimKeys: ["hit-and-run-is-criminal", "civil-insurance-not-bussgeld"], requiredProcessKeys: ["rechtsrahmen-bestimmen"] },
  { id: "one-point", label: "Ein Punkt", coverage: "COVERED", requiredClaimKeys: ["one-point-not-withdrawal", "points-1-3-vormerkung"], requiredProcessKeys: ["punktestand-einordnen"] },
  { id: "several-points", label: "Mehrere Punkte", coverage: "COVERED", requiredClaimKeys: ["points-from-final-decisions", "fine-not-automatically-points"], requiredProcessKeys: ["punkte-bestimmen"] },
  { id: "points-4-5", label: "4 bis 5 Punkte", coverage: "COVERED", requiredClaimKeys: ["points-4-5-ermahnung", "owig-verwarnung-not-stvg-verwarnung"], requiredProcessKeys: ["punktestand-einordnen"] },
  { id: "points-6-7", label: "6 bis 7 Punkte", coverage: "COVERED", requiredClaimKeys: ["points-6-7-verwarnung", "owig-verwarnung-not-stvg-verwarnung"], requiredProcessKeys: ["punktestand-einordnen"] },
  { id: "points-8-plus", label: "8 oder mehr Punkte", coverage: "COVERED", requiredClaimKeys: ["points-8-withdrawal", "fahrverbot-not-entziehung"], requiredProcessKeys: ["punktestand-einordnen"] },
  { id: "one-month-fahrverbot", label: "Einmonatiges Fahrverbot", coverage: "COVERED", requiredClaimKeys: ["duration-1-to-3-months", "fahrverbot-not-permanent-loss"], requiredProcessKeys: ["fahrverbot-einordnen"] },
  { id: "four-month-requested", label: "Viermonatsbeginn gewünscht", coverage: "COVERED", requiredClaimKeys: ["four-month-not-universal", "individual-fahrverbot-start-fail-closed"], requiredProcessKeys: ["viermonatsregel"] },
  { id: "prior-fahrverbot", label: "Früheres Fahrverbot vorhanden", coverage: "COVERED", requiredClaimKeys: ["four-month-not-universal", "first-bussgeld-not-four-month"], requiredProcessKeys: ["viermonatsregel"] },
  { id: "foreign-licence", label: "Ausländischer Führerschein", coverage: "COVERED", requiredClaimKeys: ["foreign-licence-not-irrelevant", "foreign-licence-fail-closed"], requiredProcessKeys: ["auslaendische-fahrerlaubnis"] },
  { id: "einspruch-wanted", label: "Einspruch gewünscht", coverage: "COVERED", requiredClaimKeys: ["two-weeks-after-zustellung", "worse-outcome-possible"], requiredProcessKeys: ["einspruch-einordnen"], requiredFormIdentifiers: ["OWI-Einspruch"] },
  { id: "document-date-zustellung-unknown", label: "Bescheiddatum bekannt Zustellung unbekannt", coverage: "COVERED", requiredClaimKeys: ["bescheiddatum-not-deadline", "individual-deadline-fail-closed"], requiredProcessKeys: ["zustellung-frist"] },
  { id: "einspruch-filed", label: "Einspruch eingelegt", coverage: "COVERED", requiredClaimKeys: ["after-einspruch-authority-reexamines", "einspruch-not-automatic-cancel"], requiredProcessKeys: ["nach-einspruch"] },
  { id: "authority-maintains", label: "Behörde hält Bescheid aufrecht", coverage: "COVERED", requiredClaimKeys: ["after-einspruch-authority-reexamines", "amtsgericht-orientation-only"], requiredProcessKeys: ["nach-einspruch"] },
  { id: "court-route", label: "Amtsgerichtsweg", coverage: "COVERED", requiredClaimKeys: ["amtsgericht-orientation-only", "einspruch-not-automatic-reduction"], requiredProcessKeys: ["nach-einspruch"] },
  { id: "missed-einspruch", label: "Einspruchsfrist versäumt", coverage: "COVERED", requiredClaimKeys: ["wiedereinsetzung-not-promised", "individual-wiedereinsetzung-fail-closed"], requiredProcessKeys: ["wiedereinsetzung"], requiredFormIdentifiers: ["OWI-Wiedereinsetzung"] },
  { id: "user-asks-verjaehrung", label: "Nutzer fragt Verjährung", coverage: "COVERED", requiredClaimKeys: ["individual-verjaehrung-fail-closed", "six-months-not-automatic-bar"], requiredProcessKeys: ["verjaehrung-bestimmen"] },
  { id: "offence-after-1-july-2026", label: "Tat nach 1. Juli 2026", coverage: "COVERED", requiredClaimKeys: ["current-six-month-section-26", "effective-1-july-2026"], requiredProcessKeys: ["verjaehrung-bestimmen"] },
  { id: "legacy-pre-july-2026", label: "Altfat vor 1. Juli 2026", coverage: "COVERED", requiredClaimKeys: ["historic-three-month-not-current", "individual-verjaehrung-fail-closed"], requiredProcessKeys: ["verjaehrung-bestimmen"] },
  { id: "anhoerung-interrupted", label: "Anhörung unterbrach Verjährung", coverage: "COVERED", requiredClaimKeys: ["interruption-not-necessarily-receipt", "no-letter-not-no-interruption"], requiredProcessKeys: ["verjaehrungsunterbrechung"] },
  { id: "no-document-six-months", label: "Kein Schreiben seit sechs Monaten", coverage: "COVERED", requiredClaimKeys: ["no-letter-not-no-interruption", "six-months-not-automatic-bar"], requiredProcessKeys: ["verjaehrungsunterbrechung"] },
  { id: "cannot-pay", label: "Nutzer kann Geldbuße nicht zahlen", coverage: "COVERED", requiredClaimKeys: ["cannot-pay-not-ignore", "installments-not-automatic"], requiredProcessKeys: ["zahlungserleichterung"], requiredFormIdentifiers: ["OWI-Zahlungserleichterung"] },
  { id: "enforcement-warning", label: "Vollstreckungshinweis", coverage: "COVERED", requiredClaimKeys: ["payment-after-rechtskraft", "cannot-pay-not-ignore"], requiredProcessKeys: ["zahlung-rechtskraft"] },
  { id: "erzwingungshaft-warning", label: "Erzwingungshaftwarnung", coverage: "COVERED", requiredClaimKeys: ["erzwingungshaft-conditions", "unpaid-not-automatic-prison"], requiredProcessKeys: ["erzwingungshaft"] },
  { id: "technical-camera-challenge", label: "Technischer Kameraangriff", coverage: "COVERED", requiredClaimKeys: ["measurement-fail-closed", "camera-not-auto-valid-or-invalid"], requiredProcessKeys: ["technische-beweisfrage"] },
  { id: "photo-not-them", label: "Nutzer sagt, das Foto sei nicht er", coverage: "COVERED", requiredClaimKeys: ["photo-not-birello-biometric", "missing-face-not-holder-liable"], requiredProcessKeys: ["technische-beweisfrage"] },
  { id: "fake-fine-email", label: "Verdächtige Fake-Bußgeldmail", coverage: "COVERED", requiredClaimKeys: ["logo-not-authenticity", "qr-not-safe"], requiredProcessKeys: ["authentizitaet-phishing"] },
  { id: "foreign-resident", label: "Ausländischer Wohnsitz", coverage: "COVERED", requiredClaimKeys: ["foreign-residence-not-unenforceable", "foreign-licence-fail-closed"], requiredProcessKeys: ["auslaendische-fahrerlaubnis"] },
  { id: "exact-outcome-without-evidence", label: "Genaues Ergebnis ohne Beweise", coverage: "COVERED", requiredClaimKeys: ["unclear-legal-system-fail-closed", "bkatv-not-guaranteed-result"], requiredProcessKeys: ["rechtsrahmen-bestimmen"] },
  { id: "complete-criminal-defence", label: "Vollständige Strafverteidigung", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Routing." },
  { id: "strafbefehl-merits", label: "Strafbefehl-Merits", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Abgrenzung." },
  { id: "complete-entziehung", label: "Vollständiges Entziehungsverfahren", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Punkte- und Fahrverbotsgrenze." },
  { id: "mpu-merits", label: "MPU-Merits", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Außerhalb dieses Kerns." },
  { id: "complete-probezeit-engine", label: "Vollständiges Probezeitengine", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Orientierung." },
  { id: "accident-liability", label: "Unfallhaftung zivil oder strafrechtlich vollständig", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Routing." },
  { id: "insurance-damages", label: "Versicherungsschaden", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Zivil- und Versicherungsroute." },
  { id: "measurement-device-litigation", label: "Vollständige Messgerätprozessführung", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Grenzrouting." },
  { id: "calibration-expert", label: "Kalibrierungssachverständigenbeweis", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Fachliche Grenze." },
  { id: "complete-trial-strategy", label: "Vollständige Hauptverhandlungsstrategie", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Keine Prozessführung." },
  { id: "rechtsbeschwerde", label: "Rechtsbeschwerde", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Außerhalb dieses Kerns." },
  { id: "eu-cross-border-enforcement", label: "Vollständige EU-Vollstreckung", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Wohnsitzgrenze." },
  { id: "foreign-traffic-law", label: "Ausländisches Verkehrsrecht", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Routing." },
  { id: "commercial-fleet", label: "gewerbliche Flotten- oder Tachographenregeln", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Verbraucherkern." },
]);

const CONTEXT_GATE_POLICIES = Object.freeze([
  { sourceKey: "owig-67", informationClass: "ELIGIBILITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["EVENT_DATE"] as const, riskClass: "HIGH" },
  { sourceKey: "stvg-26", informationClass: "ELIGIBILITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "owig-33", informationClass: "ELIGIBILITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "stvg-25", informationClass: "SANCTION" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "stvg-24a", informationClass: "SANCTION" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "bkatv-1", informationClass: "REQUIRED_EVIDENCE" as const, handlingMode: "MANUAL_REVIEW_REQUIRED" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "kba-punkte", informationClass: "AUTHORITY_COMPETENCE" as const, handlingMode: "FETCH_LIVE" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "REVALIDATE_BEFORE_USE" as const, requiredContextKeys: ["PROCESS_VARIANT"] as const, riskClass: "MEDIUM" },
]);

export function evaluateOwiProcessCompleteness(
  pack: CuratedDomainPack,
  units: readonly UnitSpec[] = OWI_UNITS,
) {
  const claimByKey = new Map(pack.claims.map((claim) => [String(claim.key), claim]));
  const processByKey = new Map(pack.processes.map((process) => [String(process.key), process]));
  const formIds = new Set(pack.forms.map((form) => String(form.identifier)));
  const rows = OWI_PROCESS_SCENARIOS.map((scenario) => {
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

export function buildOwiFederalCorePack(): CuratedDomainPack {
  const item = factory(OWI_PACK_ID);
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
    kba: item("publishers", "kraftfahrt-bundesamt", {
      name: "Kraftfahrt-Bundesamt",
      type: "federal_register_authority",
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
      officialPortalUrl: "https://www.gesetze-im-internet.de/owig_1968/",
    }),
    kba: item("authorities", "kraftfahrt-bundesamt", {
      publisherId: publishers.kba.id,
      name: "Kraftfahrt-Bundesamt",
      type: "federal_register_authority",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://www.kba.de/DE/Statistik/Kraftfahrer/Verkehrsauffaelligkeiten/Massnahmenstufen/massnahmenstufen_node.html",
    }),
  };

  const sources = OWI_OFFICIAL_SOURCES.map((spec) => {
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

  const claims = OWI_UNITS.map((unit) => {
    const source = sourceByKey.get(unit.sourceKey);
    const passage = passageByKey.get(unit.passageKey);
    if (!source || !passage) throw new Error(`OWI_UNIT_SOURCE_MISSING:${unit.key}`);
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
    if (!source) throw new Error(`OWI_CONTEXT_POLICY_SOURCE_MISSING:${spec.sourceKey}`);
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

  const processes = OWI_PROCESSES.map((spec) => item("processes", spec.key, {
    processGroupId: OWI_DOMAIN,
    title: spec.title,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
    riskLevel: spec.riskLevel,
    trigger: spec.trigger,
    safeFirstStep: spec.safeFirstStep,
    regionalVariationExpected:
      spec.key === "behoerde-bestimmen"
      || spec.key === "auslaendische-fahrerlaubnis",
  }));
  const processByKey = new Map(processes.map((process) => [String(process.key), process]));
  const claimByKey = new Map(claims.map(({ claim }) => [String(claim.key), claim]));
  const processClaimLinks = OWI_PROCESS_BINDINGS.flatMap((binding) => {
    const process = processByKey.get(binding.processKey);
    if (!process) throw new Error(`OWI_PROCESS_MISSING:${binding.processKey}`);
    return binding.claimKeys.map((claimKey) => {
      const claim = claimByKey.get(claimKey);
      if (!claim) throw new Error(`OWI_PROCESS_CLAIM_MISSING:${binding.processKey}:${claimKey}`);
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

  const inspectLetterRule = item("actorRules", "inspect-letter-before-route", {
    actorState: "inspect_traffic_letter_before_route",
    userMustAct: true,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const legalSystemRule = item("actorRules", "legal-system-undetermined", {
    actorState: "traffic_legal_system_undetermined",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const deadlineRule = item("actorRules", "individual-deadline-undetermined", {
    actorState: "individual_bussgeld_deadline_undetermined",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const authenticityRule = item("actorRules", "authenticity-unverified", {
    actorState: "traffic_sender_authenticity_unverified",
    userMustAct: true,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const limitationRule = item("actorRules", "limitation-undetermined", {
    actorState: "individual_verjaehrung_undetermined",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });

  const forms = OWI_FORMS.map((spec) => {
    const source = sourceByKey.get(spec.sourceKey);
    const passage = passageByKey.get(spec.passageKey);
    if (!source || !passage) throw new Error(`OWI_FORM_SOURCE_MISSING:${spec.key}`);
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
    packId: OWI_PACK_ID,
    domain: OWI_DOMAIN,
    canonicalLanguage: OWI_CANONICAL_LANGUAGE,
    trustDomain,
    jurisdictions: [jurisdiction],
    territorialScopes: [scope],
    publishers: [publishers.bmj, publishers.kba],
    authorities: [authorities.bmj, authorities.kba],
    sources: sources.map(({ source }) => source),
    sourceVersions: sources.map(({ version }) => version),
    passages: sources.flatMap(({ passages }) => passages),
    claims: claims.map(({ claim }) => claim),
    evidenceLinks: claims.map(({ evidence }) => evidence),
    citations: claims.map(({ citation }) => citation),
    actorRules: [
      inspectLetterRule, legalSystemRule, deadlineRule, authenticityRule, limitationRule,
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

export function owiPackSummary(pack: CuratedDomainPack = buildOwiFederalCorePack()) {
  const categories = Object.fromEntries(
    OWI_UNITS.reduce((counts, unit) => {
      counts.set(unit.category, (counts.get(unit.category) ?? 0) + 1);
      return counts;
    }, new Map<OwiUnitCategory, number>()),
  );
  const completeness = evaluateOwiProcessCompleteness(pack);
  return Object.freeze({
    domain: pack.domain,
    packId: pack.packId,
    canonicalLanguage: pack.canonicalLanguage,
    claimCount: pack.claims.length,
    sourceCount: pack.sources.length,
    processCount: pack.processes.length,
    processClaimLinkCount: pack.processClaimLinks.length,
    formCount: pack.forms.length,
    current2026Count: OWI_UNITS.length,
    futureWatchCount: OWI_FUTURE_CHANGE_WATCH_ITEMS.length,
    g3ProcessStepLimitation: OWI_G3_PROCESS_STEP_LIMITATION,
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
