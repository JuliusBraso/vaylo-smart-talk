/**
 * CB-0C — Shared EU applicable-legislation / posting / multi-state / PD A1 core.
 * Stored once for later DE↔SK / DE↔CZ / DE↔PL / DE↔HU connectors.
 * Canonical language is German explanatory text. Source jurisdiction remains EU.
 * Parallel EU foundation pack, not a German factory domain pack and not a corridor pack.
 */
import { createHash } from "node:crypto";

import { COD_2016_0397_STATUS } from "../../../source-registry/cross-border-connector-contracts";
import { stableKnowledgeFactoryId } from "../../../source-registry/knowledge-factory-contracts";

export const EU_AL_PACK_ID = "eu_applicable_legislation" as const;
export const EU_AL_CANONICAL_LANGUAGE = "de" as const;
export const EU_AL_TRUST_DOMAIN = "eu" as const;
export const EU_AL_PROCESS_GROUP = "eu_applicable_legislation" as const;
export const EU_SHARED_ARTICLE_12_CLAIM_KEY = "art-12-1-all-conditions" as const;
export const EU_SHARED_ONE_LEGISLATION_CLAIM_KEY = "one-legislation-principle" as const;

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

export const PROCESS_COMPLETE_DIMENSIONS = Object.freeze([
  "what", "whoWhen", "documents", "how", "next", "deadlines",
  "problems", "dutiesAfter", "institution", "boundaries", "freshness", "negatives",
] as const);
export type ProcessCompleteDimension = typeof PROCESS_COMPLETE_DIMENSIONS[number];

export const GERMAN_PACK_OVERLAP = Object.freeze([
  {
    pack: "health_insurance_orientation",
    keys: ["a1-is-applicable-law-certificate", "s1-not-same-as-a1"],
    note: "DE-local orientation. This EU A1 purpose claim is the future cross-border source of truth. No German pack rewrite in CB-0C.",
  },
  {
    pack: "arbeitslosengeld",
    keys: ["egvo-unemployment-export"],
    note: "Art. 64 / PD U1/U2 unemployment export is outside this applicable-legislation core except A1 ≠ U1/U2.",
  },
  {
    pack: "elterngeld",
    keys: ["egvo-68"],
    note: "Art. 68 family-benefit priority is outside this core.",
  },
] as const);

export const EU_AL_FUTURE_WATCH = Object.freeze([
  {
    key: "cod-2016-0397-revision",
    temporalClass: COD_2016_0397_STATUS,
    text: "Das Gesetzgebungsverfahren 2016/0397(COD) bleibt vorgeschlagene, nicht geltende Revision der Verordnungen 883/2004 und 987/2009, solange keine amtliche EU-Verkündung und Anwendbarkeit vorliegt.",
    ingestible: false,
  },
] as const);

type SourceSpec = Readonly<{
  key: string;
  publisherKey: "commission" | "eurlex" | "belgium" | "cjeu";
  url: string;
  officialDomain: string;
  title: string;
  sourceClass: "EU_LAW" | "EU_OFFICIAL_GUIDANCE";
  sourceType: string;
  retrievalMethod: "HTML_DOCUMENT" | "PDF_DOCUMENT";
  informationClass: "LEGAL_BASELINE" | "PROCESS_IDENTITY" | "AUTHORITY_COMPETENCE" | "ELIGIBILITY";
  handlingMode: "STORE_CANONICALLY" | "CACHE_AND_REVALIDATE" | "FETCH_LIVE" | "DO_NOT_ANSWER_WITHOUT_CONTEXT";
  freshnessClass: "LEGAL_CHANGE_MONITORED" | "EVENT_DRIVEN" | "MONTHLY";
  staleBehavior: "DO_NOT_USE_STALE" | "REVALIDATE_BEFORE_USE";
  requiredContextKeys: readonly ("COUNTRY" | "RESIDENCE_STATE" | "WORK_STATE" | "BUSINESS_ESTABLISHMENT_STATE" | "EVENT_DATE" | "PROCESS_VARIANT")[];
  passages: readonly Readonly<{ key: string; locator: string; text: string }>[];
}>;

export const EU_AL_OFFICIAL_SOURCES: readonly SourceSpec[] = Object.freeze([
  {
    key: "vo-883",
    publisherKey: "eurlex",
    url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32004R0883",
    officialDomain: "eur-lex.europa.eu",
    title: "Verordnung (EG) Nr. 883/2004 Titel II anwendbare Rechtsvorschriften",
    sourceClass: "EU_LAW",
    sourceType: "eu_regulation",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      { key: "vo-883-art-11", locator: "Art. 11", text: "Personen, für die diese Verordnung gilt, unterliegen den Rechtsvorschriften nur eines Mitgliedstaats. Die Staatsangehörigkeit bestimmt die anwendbaren Rechtsvorschriften nicht. Gewöhnliche Beschäftigung unterliegt grundsätzlich den Rechtsvorschriften des Beschäftigungsstaats; Wohnsitz ersetzt diese Regel nicht automatisch. Für Beamte, Bezieher von Arbeitslosenleistungen, sonst nicht erfasste Personen, Seeleute sowie Flug- und Kabinenpersonal gelten die besonderen Anknüpfungen des Artikels 11, ohne dass jede Sonderkategorie ein eigenes Vollrechtssystem eröffnet." },
      { key: "vo-883-art-12", locator: "Art. 12", text: "Ein Arbeitnehmer, der von seinem Arbeitgeber, der gewöhnlich Tätigkeiten in einem Mitgliedstaat ausübt, zur vorübergehenden Arbeit in einen anderen Mitgliedstaat entsandt wird, unterliegt weiterhin den Rechtsvorschriften des Entsendestaats, wenn die voraussichtliche Dauer 24 Monate nicht überschreitet und der Arbeitnehmer nicht einen anderen entsandten Arbeitnehmer ablöst. Ein Selbständiger, der gewöhnlich eine selbständige Tätigkeit in einem Mitgliedstaat ausübt und eine ähnliche Tätigkeit vorübergehend in einem anderen Mitgliedstaat ausübt, unterliegt weiterhin den Rechtsvorschriften des Herkunftsstaats, wenn die voraussichtliche Dauer 24 Monate nicht überschreitet. Weniger als 24 Monate allein begründet die Ausnahme nicht." },
      { key: "vo-883-art-13", locator: "Art. 13", text: "Wer gewöhnlich eine Beschäftigung in zwei oder mehr Mitgliedstaaten ausübt, unterliegt den Rechtsvorschriften des Wohnmitgliedstaats, wenn dort ein wesentlicher Teil der Tätigkeit ausgeübt wird. Andernfalls richten sich die Zweige nach Arbeitgeberzahl und Sitzstaaten, einschließlich des Falls mehrerer Arbeitgeber in verschiedenen Staaten. Wer gewöhnlich selbständig in zwei oder mehr Mitgliedstaaten tätig ist, unterliegt dem Wohnstaat bei wesentlichem Teil dort, sonst dem Mittelpunkt der Interessen. Wer in einem Mitgliedstaat beschäftigt und in einem anderen selbständig tätig ist, unterliegt den Rechtsvorschriften des Beschäftigungsstaats. Beamte mit zusätzlicher Erwerbstätigkeit unterliegen den Rechtsvorschriften des die Verwaltung beschäftigenden Mitgliedstaats." },
      { key: "vo-883-art-14-15", locator: "Art. 14 und 15", text: "Artikel 14 betrifft freiwillige Versicherung oder Weiterversicherung. Artikel 15 betrifft Hilfskräfte der Europäischen Gemeinschaften. Beide ändern nicht den Grundsatz der einen anwendbaren Rechtsvorschrift und ersetzen nicht die Entsendungs- oder Mehrstaatenregeln." },
      { key: "vo-883-art-16", locator: "Art. 16", text: "Zwei oder mehr Mitgliedstaaten, deren zuständige Behörden oder die von diesen Behörden bezeichneten Stellen können einvernehmlich Ausnahmen von den Artikeln 11 bis 15 im Interesse bestimmter Personen oder Personengruppen vorsehen. Eine solche Vereinbarung ist kein automatischer Anspruch und keine bloße Verlängerung der 24-Monats-Entsendung." },
    ],
  },
  {
    key: "vo-987",
    publisherKey: "eurlex",
    url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32009R0987",
    officialDomain: "eur-lex.europa.eu",
    title: "Verordnung (EG) Nr. 987/2009 Durchführung anwendbare Rechtsvorschriften",
    sourceClass: "EU_LAW",
    sourceType: "eu_regulation",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      { key: "vo-987-art-5", locator: "Art. 5", text: "Von einem Träger eines Mitgliedstaats ausgestellte Dokumente und Bescheinigungen, einschließlich der Bescheinigung über die anwendbaren Rechtsvorschriften, sind von Trägern anderer Mitgliedstaaten solange anzuerkennen, wie sie nicht von dem ausstellenden Träger zurückgenommen oder für ungültig erklärt sind. Ein Widerspruch der Aufnahmestelle macht die Bescheinigung nicht von selbst nichtig." },
      { key: "vo-987-art-6", locator: "Art. 6", text: "Bei Meinungsverschiedenheiten zwischen Trägern über die anwendbaren Rechtsvorschriften wird vorläufig eine Rechtsvorschrift angewandt, damit die Person nicht ohne Zuordnung bleibt. Die vorläufige Bestimmung ist nicht notwendig die endgültige Bestimmung. Die Person wählt den Staat nicht." },
      { key: "vo-987-art-14", locator: "Art. 14", text: "Der Arbeitgeber muss im Entsendestaat gewöhnlich wesentliche Tätigkeiten außer rein interner Verwaltung ausüben; der Sitz allein genügt nicht. Für neu eingestellte Entsandte gelten die Voraussetzungen der zuvor anwendbaren Rechtsvorschriften. Geringfügige Tätigkeiten können für die Mehrstaatenbestimmung unberücksichtigt bleiben, ohne dass ein universeller Stunden- oder Euro-Schwellenwert gilt. Der Mittelpunkt der Interessen Selbständiger ergibt sich aus mehreren tatsächlichen Kriterien." },
      { key: "vo-987-art-14-8", locator: "Art. 14 Abs. 8", text: "Artikel 14 Absatz 8 der Verordnung 987/2009 bestimmt den wesentlichen Teil einer Beschäftigung oder selbständigen Tätigkeit. Bei einer Beschäftigung sind Arbeitszeit und/oder Arbeitsentgelt die Kriterien. Bei einer selbständigen Tätigkeit bleiben Umsatz, Arbeitszeit, Zahl der Leistungen und/oder Einkommen Anhaltspunkte. Für Beschäftigte klärt C-203/24, dass wenigstens 25 Prozent der Arbeitszeit und/oder des Entgelts im Wohnstaat erreicht werden müssen und andere Umstände diese Schwelle nicht ersetzen." },
      { key: "vo-987-art-14-10", locator: "Art. 14 Abs. 10", text: "Artikel 14 Absatz 10 verlangt, die voraussichtliche Lage in den folgenden zwölf Kalendermonaten zu berücksichtigen. Die Prognose ermittelt die Anteile von Arbeitszeit und Entgelt; sie senkt die 25-Prozent-Schwelle für Beschäftigte nicht." },
      { key: "vo-987-art-15", locator: "Art. 15", text: "Der Arbeitgeber eines Entsanden unterrichtet den bezeichneten Träger des Entsendestaats nach Möglichkeit im Voraus. Eine später ausgestellte A1-Bescheinigung ist deshalb nicht automatisch ungültig." },
      { key: "vo-987-art-16", locator: "Art. 16", text: "Wer Tätigkeiten in zwei oder mehr Mitgliedstaaten ausübt, teilt dies dem vom Wohnmitgliedstaat bezeichneten Träger mit. Dieser Träger bestimmt vorläufig die anwendbaren Rechtsvorschriften, unterrichtet die Träger der anderen betroffenen Mitgliedstaaten, berücksichtigt Einwände und trifft die endgültige Bestimmung. Die Person und der deutsche Arbeitgeber wählen den zuständigen Staat nicht." },
      { key: "vo-987-art-18-20", locator: "Art. 18 bis 20", text: "Die Artikel 18 bis 20 regeln weitere Mitteilungen, die Information der Person und die Zusammenarbeit der Träger bei Änderung der tatsächlichen Lage. Materielle Änderungen sind dem zuständigen Träger zurückzumelden; eine ausgestellte A1-Bescheinigung friert die Rechtslage nicht dauerhaft ein." },
    ],
  },
  {
    key: "commission-ssc",
    publisherKey: "commission",
    url: "https://ec.europa.eu/social/main.jsp?catId=849&langId=de",
    officialDomain: "ec.europa.eu",
    title: "Europäische Kommission Koordinierung der sozialen Sicherheit",
    sourceClass: "EU_OFFICIAL_GUIDANCE",
    sourceType: "official_guidance",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: [],
    passages: [
      { key: "commission-ssc-text", locator: "Kommission Koordinierung", text: "Die Europäische Kommission erläutert die Koordinierung der sozialen Sicherheit auf Grundlage der geltenden Verordnungen 883/2004 und 987/2009. Politische Einigung oder Parlamentsänderungen im Verfahren 2016/0397(COD) ersetzen diese Texte nicht. Betriebliche A1-Anbieter, Lohnabrechnungsblogs oder Kanzlei-SEO sind keine kanonische Beweisquelle." },
    ],
  },
  {
    key: "practical-guide",
    publisherKey: "commission",
    url: "https://ec.europa.eu/social/main.jsp?catId=868&langId=de",
    officialDomain: "ec.europa.eu",
    title: "Praktischer Leitfaden anwendbare Rechtsvorschriften der Verwaltungskommission",
    sourceClass: "EU_OFFICIAL_GUIDANCE",
    sourceType: "official_guidance",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "ELIGIBILITY",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: ["PROCESS_VARIANT", "WORK_STATE"],
    passages: [
      { key: "practical-guide-text", locator: "Praktischer Leitfaden", text: "Der praktische Leitfaden der Verwaltungskommission erläutert Entsendedauer, vorherige Versicherung, Ablösung, wesentlichen Tätigkeitsteil und Homeoffice. Operative Sätze wie ein im Regelfall ausreichender Vorversicherungsmonat sind Auslegungshilfe und kein unabänderlicher Verordnungstext. Für den beschäftigten 25-Prozent-Test nach Artikel 14 Absatz 8 ist das Urteil C-203/24 Hakamp die geltende Auslegung; der Leitfaden allein ersetzt dieses Urteil nicht." },
    ],
  },
  {
    key: "your-europe-a1",
    publisherKey: "commission",
    url: "https://europa.eu/youreurope/citizens/work/social-security-forms/index_de.htm",
    officialDomain: "europa.eu",
    title: "Your Europe Portable Document A1",
    sourceClass: "EU_OFFICIAL_GUIDANCE",
    sourceType: "official_guidance",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: [],
    passages: [
      { key: "your-europe-a1-text", locator: "Your Europe A1", text: "Das Portable Document A1 bescheinigt, welche Rechtsvorschriften der sozialen Sicherheit gelten. Es ist kein Arbeitserlaubnisdokument, kein Visum, keine steuerliche Ansässigkeitsbescheinigung, keine EHIC und keine S1. Es befreit nicht von arbeitsrechtlichen Aufnahmebedingungen oder Meldepflichten des Aufnahmestaats." },
    ],
  },
  {
    key: "telework-framework",
    publisherKey: "belgium",
    url: "https://socialsecurity.belgium.be/en/internationally-active/cross-border-telework-eu-eea-and-switzerland",
    officialDomain: "socialsecurity.belgium.be",
    title: "Rahmenvereinbarung grenzüberschreitende Telearbeit Verwahrer Belgien",
    sourceClass: "EU_OFFICIAL_GUIDANCE",
    sourceType: "official_guidance",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "AUTHORITY_COMPETENCE",
    handlingMode: "FETCH_LIVE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: ["COUNTRY", "RESIDENCE_STATE", "WORK_STATE", "BUSINESS_ESTABLISHMENT_STATE"],
    passages: [
      { key: "telework-framework-text", locator: "Rahmenvereinbarung Art. 16", text: "Die multilaterale Rahmenvereinbarung zu gewöhnlicher grenzüberschreitender Telearbeit ist eine besondere Art-16-Route und nicht Artikel 13 selbst. Teilnehmende Staaten, Prozentsatzband, Antragsweg und Geltungsdaten sind beim belgischen Verwahrer aktuell zu prüfen. Eine Teilnahme von SK, CZ, PL oder HU darf nicht ohne Live-Prüfung unterstellt werden." },
    ],
  },
  {
    key: "eessi-directory",
    publisherKey: "commission",
    url: "https://ec.europa.eu/social/main.jsp?catId=1170&langId=de",
    officialDomain: "ec.europa.eu",
    title: "EESSI und Trägerverzeichnis der sozialen Sicherheit",
    sourceClass: "EU_OFFICIAL_GUIDANCE",
    sourceType: "official_guidance",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "AUTHORITY_COMPETENCE",
    handlingMode: "FETCH_LIVE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: ["COUNTRY", "RESIDENCE_STATE"],
    passages: [
      { key: "eessi-directory-text", locator: "Trägerverzeichnis", text: "Die genaue nationale A1-Ausstellungsstelle und der Wohnstaatsträger sind über das amtliche Trägerverzeichnis zu ermitteln. Auf EU-Ebene werden nur Kompetenzgrundsätze gespeichert. Die deutsche DVKA ist nicht die kanonische EU-Wahrheit für jeden Korridor." },
    ],
  },
  {
    key: "cjeu-herbosch",
    publisherKey: "cjeu",
    url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:62005CJ0002",
    officialDomain: "eur-lex.europa.eu",
    title: "EuGH C-2/05 Herbosch Kiere Bindungswirkung der Bescheinigung",
    sourceClass: "EU_LAW",
    sourceType: "cjeu_judgment",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      { key: "cjeu-herbosch-text", locator: "C-2/05", text: "Eine von dem zuständigen Träger ordnungsgemäß ausgestellte Bescheinigung über die anwendbaren Rechtsvorschriften bindet die Träger der anderen Mitgliedstaaten, solange sie nicht zurückgenommen oder nach den Koordinierungsmechanismen für ungültig erklärt ist." },
    ],
  },
  {
    key: "cjeu-altun",
    publisherKey: "cjeu",
    url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:62016CJ0359",
    officialDomain: "eur-lex.europa.eu",
    title: "EuGH C-359/16 Altun Dialog und Betrugsgrenze",
    sourceClass: "EU_LAW",
    sourceType: "cjeu_judgment",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      { key: "cjeu-altun-text", locator: "C-359/16", text: "Betrugs- oder Missbrauchsbedenken erlauben der betroffenen Person nicht, die A1-Bescheinigung selbst für ungültig zu erklären. Maßgeblich ist der institutionelle Dialog und das dafür vorgesehene Verfahren. Ein Prüfer des Aufnahmestaats macht die Bescheinigung nicht automatisch nichtig." },
    ],
  },
  {
    key: "cjeu-alpenrind",
    publisherKey: "cjeu",
    url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:62016CJ0527",
    officialDomain: "eur-lex.europa.eu",
    title: "EuGH C-527/16 Alpenrind Ablösungsverbot",
    sourceClass: "EU_LAW",
    sourceType: "cjeu_judgment",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "ELIGIBILITY",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: ["PROCESS_VARIANT", "WORK_STATE"],
    passages: [
      { key: "cjeu-alpenrind-text", locator: "C-527/16", text: "Die Entsendungsausnahme gilt nicht, wenn der Arbeitnehmer entsandt wird, um einen anderen entsandten Arbeitnehmer abzulösen. Ein anderer Vertrag, ein anderer Arbeitgebername oder ein anderer Beschäftigter setzt die 24-Monatsgrenze nicht automatisch neu. Die tatsächliche Ablösung darf ohne Sachverhalt nicht festgestellt werden." },
    ],
  },
  {
    key: "cjeu-hakamp",
    publisherKey: "cjeu",
    url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:62024CJ0203",
    officialDomain: "eur-lex.europa.eu",
    title: "EuGH C-203/24 Hakamp Urteil vom 4. September 2025 ECLI:EU:C:2025:662",
    sourceClass: "EU_LAW",
    sourceType: "cjeu_judgment",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "ELIGIBILITY",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: ["RESIDENCE_STATE", "WORK_STATE", "PROCESS_VARIANT"],
    passages: [
      { key: "cjeu-hakamp-text", locator: "C-203/24 Tenor 4.9.2025", text: "Urteil vom 4. September 2025, Rechtssache C-203/24 Hakamp, ECLI:EU:C:2025:662. Zur Bestimmung, ob eine gewöhnlich in zwei oder mehr Mitgliedstaaten beschäftigte Person einen wesentlichen Teil der Tätigkeit im Wohnmitgliedstaat ausübt, hat der zuständige Träger im Rahmen einer Gesamtbewertung festzustellen, ob wenigstens 25 Prozent der Arbeitszeit und/oder des Arbeitsentgelts dort entfallen. Andere Umstände oder Kriterien sind dabei nicht zu berücksichtigen. Die Bewertung stützt sich auf die voraussichtliche Lage in den folgenden zwölf Kalendermonaten nach Artikel 14 Absätze 8 und 10 der Verordnung 987/2009." },
    ],
  },
]);

type UnitSpec = Readonly<{
  key: string;
  category: string;
  type: "definition" | "exception" | "procedure" | "boundary";
  text: string;
  sourceKey: string;
  passageKey: string;
  riskLevel: "low" | "medium" | "high";
  requiresAuthorityResolution?: boolean;
}>;

export const EU_AL_UNITS: readonly UnitSpec[] = Object.freeze([
  { key: EU_SHARED_ONE_LEGISLATION_CLAIM_KEY, category: "principle", type: "definition", text: "Eine Person, die unter Titel II der Verordnung 883/2004 fällt, unterliegt den Rechtsvorschriften nur eines Mitgliedstaats.", sourceKey: "vo-883", passageKey: "vo-883-art-11", riskLevel: "high" },
  { key: "nationality-not-applicable-legislation", category: "principle", type: "exception", text: "Die Staatsangehörigkeit bestimmt die anwendbaren Rechtsvorschriften der sozialen Sicherheit nicht.", sourceKey: "vo-883", passageKey: "vo-883-art-11", riskLevel: "high" },
  { key: "locale-not-jurisdiction", category: "principle", type: "exception", text: "Die Ausgabesprache oder Nutzeroberfläche wählt weder den zuständigen Mitgliedstaat noch die anwendbaren Rechtsvorschriften.", sourceKey: "vo-883", passageKey: "vo-883-art-11", riskLevel: "high" },
  { key: "source-eu-not-applicable-state-de", category: "principle", type: "definition", text: "Die Quellenjurisdiktion EU ist nicht dasselbe wie ein anwendbarer Staat DE. Deutsche Erklärsprache macht Unionsrecht nicht zu deutschem nationalem Recht.", sourceKey: "vo-883", passageKey: "vo-883-art-11", riskLevel: "high" },
  { key: "cross-border-work-not-multi-systems", category: "principle", type: "exception", text: "Grenzüberschreitende Arbeit begründet nicht automatisch Beiträge in jedem Tätigkeitsstaat.", sourceKey: "vo-883", passageKey: "vo-883-art-11", riskLevel: "high" },
  { key: "two-employers-not-two-systems", category: "principle", type: "exception", text: "Zwei Arbeitgeber bedeuten nicht automatisch zwei nationale Sozialversicherungssysteme.", sourceKey: "vo-883", passageKey: "vo-883-art-13", riskLevel: "high" },
  { key: "residence-plus-work-not-choice", category: "principle", type: "exception", text: "Wohnsitz in einem Staat und Arbeit in einem anderen eröffnen keine Wahl zwischen beiden Systemen.", sourceKey: "vo-883", passageKey: "vo-883-art-11", riskLevel: "high" },
  { key: "current-883-987-baseline", category: "temporal", type: "definition", text: "Am 30. August 2026 bleiben die Verordnungen 883/2004 und 987/2009 die geltende Grundlage der anwendbaren Rechtsvorschriften.", sourceKey: "commission-ssc", passageKey: "commission-ssc-text", riskLevel: "high" },
  { key: "pending-cod-2016-0397-not-current", category: "temporal", type: "exception", text: "Das Verfahren 2016/0397(COD) ist vorgeschlagene, nicht geltende Revision und ersetzt die geltenden Verordnungen 883/2004 und 987/2009 nicht.", sourceKey: "commission-ssc", passageKey: "commission-ssc-text", riskLevel: "high" },
  { key: "political-agreement-not-current-rule", category: "temporal", type: "exception", text: "Politische Einigung, Ratskompromiss oder Parlamentsänderungen im ersten Lesen sind keine geltenden Koordinierungsregeln.", sourceKey: "commission-ssc", passageKey: "commission-ssc-text", riskLevel: "high" },
  { key: "uk-out-of-scope-v1", category: "scope", type: "boundary", text: "Das Vereinigte Königreich liegt außerhalb dieses v1-EU-Kerns; die 883/987-Regeln werden darauf nicht blind angewandt.", sourceKey: "vo-883", passageKey: "vo-883-art-11", riskLevel: "high" },
  { key: "bilateral-third-country-out-of-scope", category: "scope", type: "boundary", text: "Nicht-EWR-Drittstaaten und bilaterale Sozialversicherungsabkommen liegen außerhalb dieses Kerns.", sourceKey: "vo-883", passageKey: "vo-883-art-11", riskLevel: "high" },
  { key: "eea-switzerland-boundary", category: "scope", type: "definition", text: "Das 883/987-System gilt im aktuellen Unionskoordinierungsrahmen und über einschlägige Regelungen auch für EWR und Schweiz, ohne dass jede Drittstaatskonstellation gleichbehandelt wird.", sourceKey: "vo-883", passageKey: "vo-883-art-11", riskLevel: "medium" },
  { key: "sk-cz-pl-hu-are-eu-member-corridors", category: "scope", type: "definition", text: "DE mit SK, CZ, PL oder HU liegt unmittelbar im Anwendungsbereich der EU-Mitgliedstaatenkorridore dieses Kerns. Nationale SK/CZ/PL/HU-Sätze werden hier nicht gespeichert.", sourceKey: "vo-883", passageKey: "vo-883-art-11", riskLevel: "medium" },

  { key: "art-11-employed-lex-loci-laboris", category: "article11", type: "definition", text: "Wer eine Beschäftigung in einem Mitgliedstaat ausübt, unterliegt grundsätzlich den Rechtsvorschriften dieses Beschäftigungsstaats.", sourceKey: "vo-883", passageKey: "vo-883-art-11", riskLevel: "high" },
  { key: "art-11-self-employed-activity-state", category: "article11", type: "definition", text: "Wer eine selbständige Tätigkeit in einem Mitgliedstaat ausübt, unterliegt grundsätzlich den Rechtsvorschriften dieses Tätigkeitsstaats.", sourceKey: "vo-883", passageKey: "vo-883-art-11", riskLevel: "high" },
  { key: "art-11-civil-servant-boundary", category: "article11", type: "definition", text: "Beamte unterliegen den Rechtsvorschriften des Mitgliedstaats, dem die sie beschäftigende Verwaltung angehört. Dies ist nur eine Zuordnungsgrenze, kein Beamtenpensionsrecht.", sourceKey: "vo-883", passageKey: "vo-883-art-11", riskLevel: "medium" },
  { key: "art-11-unemployment-residence-boundary", category: "article11", type: "definition", text: "Bezieher von Arbeitslosenleistungen nach den besonderen Wohnsitzregeln unterliegen den Rechtsvorschriften des Wohnmitgliedstaats. Arbeitslosenexportrecht wird hier nicht ausgebaut.", sourceKey: "vo-883", passageKey: "vo-883-art-11", riskLevel: "medium" },
  { key: "art-11-not-otherwise-covered-residence", category: "article11", type: "definition", text: "Personen, die nicht bereits einer anderen Anknüpfung unterliegen, unterliegen den Rechtsvorschriften des Wohnmitgliedstaats.", sourceKey: "vo-883", passageKey: "vo-883-art-11", riskLevel: "medium" },
  { key: "art-11-seafarer-boundary", category: "article11", type: "definition", text: "Für Seeleute gilt die besondere Flaggen- und Arbeitgeberanknüpfung des Artikels 11 als Zuordnungsgrenze, nicht als eigenes Vollrechtsgebiet.", sourceKey: "vo-883", passageKey: "vo-883-art-11", riskLevel: "medium" },
  { key: "art-11-flight-crew-home-base", category: "article11", type: "definition", text: "Für Flug- und Kabinenpersonal gilt die Heimatbasisregel des Artikels 11, soweit sie aktuell angeordnet ist.", sourceKey: "vo-883", passageKey: "vo-883-art-11", riskLevel: "medium" },
  { key: "residence-not-automatic-employment-legislation", category: "article11", type: "exception", text: "Der Wohnsitzstaat ist für gewöhnliche Arbeitnehmer nicht automatisch der Beschäftigungsrechtsstaat.", sourceKey: "vo-883", passageKey: "vo-883-art-11", riskLevel: "high" },
  { key: "employer-registration-not-always-applicable", category: "article11", type: "exception", text: "Der Registrierungsstaat des Arbeitgebers ist nicht immer das anwendbare Recht.", sourceKey: "vo-883", passageKey: "vo-883-art-11", riskLevel: "high" },
  { key: "remote-work-not-posting-automatically", category: "article11", type: "exception", text: "Telearbeit oder Homeoffice ist nicht automatisch eine Entsendung nach Artikel 12.", sourceKey: "vo-883", passageKey: "vo-883-art-12", riskLevel: "high" },

  { key: EU_SHARED_ARTICLE_12_CLAIM_KEY, category: "article12", type: "definition", text: "Die Entsendungsausnahme für Arbeitnehmer verlangt kumulativ: Beschäftigung, gewöhnliche Versicherung im Entsendestaat, wesentliche Tätigkeit des Arbeitgebers dort, Entsendung in einen anderen Mitgliedstaat für Rechnung dieses Arbeitgebers, voraussichtliche Dauer von höchstens 24 Monaten und keine Ablösung eines anderen entsandten Arbeitnehmers.", sourceKey: "vo-883", passageKey: "vo-883-art-12", riskLevel: "high" },
  { key: "art-12-1-24-months-not-automatic", category: "article12", type: "exception", text: "Eine geplante Dauer unter 24 Monaten begründet die Entsendungsausnahme nicht automatisch.", sourceKey: "vo-883", passageKey: "vo-883-art-12", riskLevel: "high" },
  { key: "art-12-1-24-months-not-extension", category: "article12", type: "exception", text: "24 Monate sind keine automatische Verlängerung und keine automatische Weitergeltung nach Ablauf.", sourceKey: "vo-883", passageKey: "vo-883-art-12", riskLevel: "high" },
  { key: "business-trip-not-automatic-posting", category: "article12", type: "exception", text: "Eine ausländische Dienstreise ist nicht automatisch eine Entsendung nach Artikel 12.", sourceKey: "vo-883", passageKey: "vo-883-art-12", riskLevel: "high" },
  { key: "german-employer-not-automatic-german-legislation", category: "article12", type: "exception", text: "Ein deutscher Arbeitgeber bedeutet nicht automatisch deutsche Sozialversicherung.", sourceKey: "vo-883", passageKey: "vo-883-art-12", riskLevel: "high" },
  { key: "de-contract-not-automatic-art-12", category: "article12", type: "exception", text: "Ein Arbeitsvertrag mit einem deutschen Unternehmen erfüllt die Artikel-12-Bedingungen nicht automatisch.", sourceKey: "vo-883", passageKey: "vo-883-art-12", riskLevel: "high" },
  { key: "temporary-abroad-not-automatic-posting", category: "article12", type: "exception", text: "Vorübergehende Tätigkeit im Ausland ist nicht automatisch eine Entsendung.", sourceKey: "vo-883", passageKey: "vo-883-art-12", riskLevel: "high" },
  { key: "no-a1-not-automatic-art-12", category: "article12", type: "exception", text: "Ohne A1 in der Hand darf BIRELLO die Entsendungsausnahme nicht selbst zuerkennen.", sourceKey: "vo-987", passageKey: "vo-987-art-15", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "posting-30-months-not-art-12", category: "article12", type: "exception", text: "Eine geplante Entsendung von 30 Monaten fällt nicht unter die ordentliche 24-Monats-Ausnahme des Artikels 12.", sourceKey: "vo-883", passageKey: "vo-883-art-12", riskLevel: "high" },

  { key: "employer-substantial-activities-required", category: "employer-gate", type: "definition", text: "Der Arbeitgeber muss im Entsendestaat gewöhnlich wesentliche Tätigkeiten außer rein interner Verwaltung ausüben.", sourceKey: "vo-987", passageKey: "vo-987-art-14", riskLevel: "high" },
  { key: "registered-office-not-sufficient", category: "employer-gate", type: "exception", text: "Der satzungsmäßige Sitz allein beweist nicht, dass der Arbeitgeber dort gewöhnlich wesentliche Tätigkeiten ausübt.", sourceKey: "vo-987", passageKey: "vo-987-art-14", riskLevel: "high" },
  { key: "letterbox-not-sending-employer", category: "employer-gate", type: "exception", text: "Eine Briefkastengesellschaft ist nicht automatisch entsendefähiger Arbeitgeber.", sourceKey: "vo-987", passageKey: "vo-987-art-14", riskLevel: "high" },
  { key: "employer-substance-fail-closed", category: "employer-gate", type: "exception", text: "Die wesentliche Arbeitgebertätigkeit darf ohne Sachverhalt zu tatsächlicher Unternehmungstätigkeit nicht festgestellt werden.", sourceKey: "vo-987", passageKey: "vo-987-art-14", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "newly-recruited-prior-coverage", category: "employer-gate", type: "definition", text: "Ein eigens für die Entsendung eingestellter Arbeitnehmer darf nur unter den geltenden Voraussetzungen der zuvor anwendbaren Rechtsvorschriften entsandt werden.", sourceKey: "vo-987", passageKey: "vo-987-art-14", riskLevel: "high" },
  { key: "one-month-guidance-not-immutable-statute", category: "employer-gate", type: "exception", text: "Operative Hinweise, dass ein Monat Vorversicherung im Regelfall ausreichen kann, sind keine unabänderliche Verordnungsuniversale.", sourceKey: "practical-guide", passageKey: "practical-guide-text", riskLevel: "high" },
  { key: "new-worker-not-new-24-month-period", category: "employer-gate", type: "exception", text: "Ein neu eingestellter Arbeitnehmer begründet nicht automatisch einen neuen 24-Monatszeitraum.", sourceKey: "vo-987", passageKey: "vo-987-art-14", riskLevel: "high" },

  { key: "replacement-prohibition", category: "replacement", type: "definition", text: "Die Entsendungsausnahme gilt nicht, wenn der Arbeitnehmer entsandt wird, um einen anderen entsandten Arbeitnehmer im rechtlichen Sinne abzulösen.", sourceKey: "vo-883", passageKey: "vo-883-art-12", riskLevel: "high" },
  { key: "different-employee-not-new-period", category: "replacement", type: "exception", text: "Ein anderer Beschäftigter begründet nicht automatisch einen unabhängigen 24-Monatszeitraum.", sourceKey: "cjeu-alpenrind", passageKey: "cjeu-alpenrind-text", riskLevel: "high" },
  { key: "different-employer-not-replacement-impossible", category: "replacement", type: "exception", text: "Ein anderer Arbeitgeber macht eine Ablösung nicht automatisch unmöglich.", sourceKey: "cjeu-alpenrind", passageKey: "cjeu-alpenrind-text", riskLevel: "high" },
  { key: "new-contract-not-reset", category: "replacement", type: "exception", text: "Ein neuer Vertrag setzt die Entsendungsgrenze nicht automatisch zurück.", sourceKey: "cjeu-alpenrind", passageKey: "cjeu-alpenrind-text", riskLevel: "high" },
  { key: "replacement-fail-closed", category: "replacement", type: "exception", text: "Eine tatsächliche Ablösung darf ohne Sachverhalt nicht festgestellt werden.", sourceKey: "cjeu-alpenrind", passageKey: "cjeu-alpenrind-text", riskLevel: "high", requiresAuthorityResolution: true },

  { key: "art-12-2-self-employed-posting", category: "article12-2", type: "definition", text: "Die selbständige Entsendungsausnahme verlangt gewöhnliche selbständige Tätigkeit im Herkunftsstaat, vorübergehend ähnliche Tätigkeit in einem anderen Mitgliedstaat, voraussichtlich höchstens 24 Monate und fortbestehende Rückkehrmöglichkeit in die Herkunftstätigkeit.", sourceKey: "vo-883", passageKey: "vo-883-art-12", riskLevel: "high" },
  { key: "self-employed-not-employee-posting", category: "article12-2", type: "exception", text: "Selbständigkeit ist nicht dieselbe Klassifikation wie eine Arbeitnehmerentsendung.", sourceKey: "vo-883", passageKey: "vo-883-art-12", riskLevel: "high" },
  { key: "similar-activity-required", category: "article12-2", type: "definition", text: "Die Tätigkeit im anderen Mitgliedstaat muss der gewöhnlich ausgeübten selbständigen Tätigkeit ähnlich sein; der tatsächliche Charakter zählt, nicht die ausländische Bezeichnung.", sourceKey: "vo-987", passageKey: "vo-987-art-14", riskLevel: "high" },
  { key: "different-activity-may-defeat", category: "article12-2", type: "exception", text: "Eine vollständig andere Tätigkeit im Ausland kann die selbständige Entsendungsausnahme ausschließen.", sourceKey: "vo-987", passageKey: "vo-987-art-14", riskLevel: "high" },
  { key: "invoice-not-automatic-home-insurance", category: "article12-2", type: "exception", text: "Eine Rechnung eines deutschen Gewerbes begründet nicht automatisch deutsche Sozialversicherung.", sourceKey: "vo-883", passageKey: "vo-883-art-12", riskLevel: "high" },
  { key: "foreign-customer-not-automatic-posting", category: "article12-2", type: "exception", text: "Ein vorübergehender ausländischer Auftraggeber ist nicht automatisch Artikel 12 Absatz 2.", sourceKey: "vo-883", passageKey: "vo-883-art-12", riskLevel: "high" },

  { key: "art-16-exception-agreement", category: "article16", type: "definition", text: "Artikel 16 der Verordnung 883/2004 erlaubt zuständigen Stellen einvernehmliche Ausnahmen von den Artikeln 11 bis 15 im Interesse bestimmter Personen oder Gruppen.", sourceKey: "vo-883", passageKey: "vo-883-art-16", riskLevel: "high" },
  { key: "art-16-not-ordinary-art-12-extension", category: "article16", type: "exception", text: "Eine Artikel-16-Vereinbarung ist keine ordentliche Verlängerung der Artikel-12-Entsendung.", sourceKey: "vo-883", passageKey: "vo-883-art-16", riskLevel: "high" },
  { key: "a1-expiry-not-automatic-continuation", category: "article16", type: "exception", text: "Der Ablauf einer A1-Bescheinigung verlängert die Herkunftsrechtsvorschriften nicht automatisch.", sourceKey: "vo-883", passageKey: "vo-883-art-16", riskLevel: "high" },
  { key: "art-16-not-user-entitlement", category: "article16", type: "exception", text: "Artikel 16 ist kein Anspruch der Person auf Ausnahme nach Wunsch.", sourceKey: "vo-883", passageKey: "vo-883-art-16", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "posting-beyond-24-may-need-art-16", category: "article16", type: "definition", text: "Eine Verlängerung über den ordentlichen Artikel-12-Rahmen kann eine Artikel-16-Vereinbarung erfordern.", sourceKey: "vo-883", passageKey: "vo-883-art-16", riskLevel: "high" },

  { key: "art-13-1-multi-state-habitual", category: "article13", type: "definition", text: "Artikel 13 Absatz 1 setzt voraus, dass die Person gewöhnlich eine Beschäftigung in zwei oder mehr Mitgliedstaaten ausübt.", sourceKey: "vo-883", passageKey: "vo-883-art-13", riskLevel: "high" },
  { key: "isolated-trip-not-multi-state", category: "article13", type: "exception", text: "Eine gelegentliche einzelne Reise ist nicht automatisch gewöhnliche Mehrstaatentätigkeit.", sourceKey: "vo-987", passageKey: "vo-987-art-14", riskLevel: "high" },
  { key: "cjeu-c-203-24-hakamp", category: "article13", type: "definition", text: "Das Urteil C-203/24 Hakamp vom 4. September 2025, ECLI:EU:C:2025:662, legt Artikel 14 Absätze 8 und 10 der Verordnung 987/2009 für beschäftigte Mehrstaatentätigkeit verbindlich aus.", sourceKey: "cjeu-hakamp", passageKey: "cjeu-hakamp-text", riskLevel: "high" },
  { key: "substantial-activity-indicator-25", category: "article13", type: "definition", text: "Für eine beschäftigte Person muss der zuständige Träger feststellen, ob wenigstens 25 Prozent der Arbeitszeit und/oder wenigstens 25 Prozent des Arbeitsentgelts auf den Wohnmitgliedstaat entfallen.", sourceKey: "cjeu-hakamp", passageKey: "cjeu-hakamp-text", riskLevel: "high" },
  { key: "employed-25-not-optional-soft-guidance", category: "article13", type: "exception", text: "Für Beschäftigte ist die 25-Prozent-Schwelle nach C-203/24 keine optionale weiche Leitlinie.", sourceKey: "cjeu-hakamp", passageKey: "cjeu-hakamp-text", riskLevel: "high" },
  { key: "employed-time-25-satisfies", category: "article13", type: "definition", text: "Erreicht die voraussichtliche Arbeitszeit im Wohnstaat wenigstens 25 Prozent, ist der wesentliche Teil für Beschäftigte erfüllt, auch wenn das Entgelt darunter liegt.", sourceKey: "cjeu-hakamp", passageKey: "cjeu-hakamp-text", riskLevel: "high" },
  { key: "employed-pay-25-satisfies", category: "article13", type: "definition", text: "Erreicht das voraussichtliche Entgelt im Wohnstaat wenigstens 25 Prozent, ist der wesentliche Teil für Beschäftigte erfüllt, auch wenn die Arbeitszeit darunter liegt.", sourceKey: "cjeu-hakamp", passageKey: "cjeu-hakamp-text", riskLevel: "high" },
  { key: "employed-and-or-not-cumulative-both", category: "article13", type: "exception", text: "Arbeitszeit unter 25 Prozent bedeutet nicht automatisch das Scheitern, wenn das Entgelt wenigstens 25 Prozent erreicht; Entgelt unter 25 Prozent bedeutet nicht automatisch das Scheitern, wenn die Arbeitszeit wenigstens 25 Prozent erreicht.", sourceKey: "cjeu-hakamp", passageKey: "cjeu-hakamp-text", riskLevel: "high" },
  { key: "employed-both-below-25-not-substantial", category: "article13", type: "exception", text: "Liegen Arbeitszeit und Entgelt im Wohnstaat beide unter 25 Prozent, ist ein wesentlicher Wohnsitzanteil für Beschäftigte nicht festgestellt.", sourceKey: "cjeu-hakamp", passageKey: "cjeu-hakamp-text", riskLevel: "high" },
  { key: "employed-other-criteria-cannot-compensate", category: "article13", type: "exception", text: "Andere tatsächliche Umstände oder Kriterien können für Beschäftigte nicht ausgleichen, wenn Arbeitszeit und Entgelt beide unter 25 Prozent liegen.", sourceKey: "cjeu-hakamp", passageKey: "cjeu-hakamp-text", riskLevel: "high" },
  { key: "personal-ties-do-not-replace-employed-25", category: "article13", type: "exception", text: "Starke persönliche oder wirtschaftliche Bindungen an den Wohnstaat ersetzen für Beschäftigte nicht die fehlende 25-Prozent-Schwelle nach Artikel 14 Absatz 8.", sourceKey: "cjeu-hakamp", passageKey: "cjeu-hakamp-text", riskLevel: "high" },
  { key: "twenty-four-point-nine-not-automatic", category: "article13", type: "exception", text: "24,9 Prozent Arbeitszeit und 24,9 Prozent Entgelt sind nicht 25 Prozent und begründen für Beschäftigte keinen wesentlichen Wohnsitzanteil.", sourceKey: "cjeu-hakamp", passageKey: "cjeu-hakamp-text", riskLevel: "high" },
  { key: "salary-share-not-always-sufficient", category: "article13", type: "exception", text: "Ein Entgeltanteil unter 25 Prozent scheitert nicht automatisch, wenn die Arbeitszeit wenigstens 25 Prozent erreicht; der Entgeltanteil allein unter 25 Prozent genügt aber nicht, wenn auch die Arbeitszeit darunter liegt.", sourceKey: "cjeu-hakamp", passageKey: "cjeu-hakamp-text", riskLevel: "high" },
  { key: "one-historic-month-not-period", category: "article13", type: "exception", text: "Ein einzelner historischer Monat ist nicht der vollständige Beurteilungszeitraum.", sourceKey: "vo-987", passageKey: "vo-987-art-14-10", riskLevel: "high" },
  { key: "twelve-month-prospective", category: "article13", type: "definition", text: "Nach Artikel 14 Absatz 10 ist die voraussichtliche Lage in den folgenden zwölf Kalendermonaten zu berücksichtigen, um die Anteile von Arbeitszeit und Entgelt zu bemessen.", sourceKey: "vo-987", passageKey: "vo-987-art-14-10", riskLevel: "high" },
  { key: "twelve-month-projection-does-not-dilute-25", category: "article13", type: "exception", text: "Die Zwölfmonatsprognose ermittelt die Anteile; sie verdünnt die 25-Prozent-Schwelle für Beschäftigte nicht.", sourceKey: "vo-987", passageKey: "vo-987-art-14-10", riskLevel: "high" },
  { key: "substantial-activity-fail-closed", category: "article13", type: "exception", text: "Der wesentliche Tätigkeitsanteil darf ohne Arbeitszeit-, Entgelt- und Zwölfmonatsangaben nicht individuell festgestellt werden.", sourceKey: "vo-987", passageKey: "vo-987-art-14-10", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "substantial-in-residence-residence-law", category: "article13", type: "definition", text: "Liegt ein wesentlicher Teil der Beschäftigung im Wohnmitgliedstaat, gelten grundsätzlich dessen Rechtsvorschriften.", sourceKey: "vo-883", passageKey: "vo-883-art-13", riskLevel: "high" },
  { key: "lives-and-works-partly-not-automatic", category: "article13", type: "exception", text: "Wohnsitz in SK und teilweise Tätigkeit dort bedeuten nicht automatisch slowakische Rechtsvorschriften; der Wesentlichkeits-Test muss zuerst erfüllt sein.", sourceKey: "vo-883", passageKey: "vo-883-art-13", riskLevel: "high" },
  { key: "one-employer-branch", category: "article13", type: "definition", text: "Ohne wesentlichen Wohnsitzanteil und bei einem Arbeitgeber gelten grundsätzlich die Rechtsvorschriften des Sitzstaats dieses Arbeitgebers.", sourceKey: "vo-883", passageKey: "vo-883-art-13", riskLevel: "high" },
  { key: "several-employers-same-state", category: "article13", type: "definition", text: "Mehrere Arbeitgeber mit Sitz nur in einem Mitgliedstaat führen ohne wesentlichen Wohnsitzanteil grundsätzlich zu den Rechtsvorschriften dieses Sitzstaats.", sourceKey: "vo-883", passageKey: "vo-883-art-13", riskLevel: "high" },
  { key: "several-employers-incl-residence", category: "article13", type: "definition", text: "Mehrere Arbeitgeber in zwei Mitgliedstaaten, von denen einer der Wohnstaat ist, führen ohne wesentlichen Wohnsitzanteil grundsätzlich zu den Rechtsvorschriften des anderen Sitzstaats.", sourceKey: "vo-883", passageKey: "vo-883-art-13", riskLevel: "high" },
  { key: "several-employers-other-states-residence", category: "article13", type: "definition", text: "Mehrere Arbeitgeber in verschiedenen Mitgliedstaaten außer dem Wohnstaat führen ohne wesentlichen Wohnsitzanteil grundsätzlich zu den Rechtsvorschriften des Wohnstaats.", sourceKey: "vo-883", passageKey: "vo-883-art-13", riskLevel: "high" },
  { key: "less-than-25-not-always-employer-state", category: "article13", type: "exception", text: "Kein wesentlicher Wohnsitzanteil bedeutet nicht in jedem Mehrarbeitgeberfall automatisch den Arbeitgeberstaat; die Zweige des Artikels 13 Absatz 1 Buchstabe b Ziffern i bis iv bleiben maßgebend.", sourceKey: "vo-883", passageKey: "vo-883-art-13", riskLevel: "high" },
  { key: "substantial-25-not-every-art-13-outcome", category: "article13", type: "exception", text: "Ein festgestellter oder nicht festgestellter wesentlicher Teil entscheidet nicht allein jede Artikel-13-Folge; die Arbeitgeberkonfiguration bleibt nachgelagert relevant.", sourceKey: "vo-883", passageKey: "vo-883-art-13", riskLevel: "high" },

  { key: "art-13-2-self-employed-multi-state", category: "article13-2", type: "definition", text: "Wer gewöhnlich selbständig in zwei oder mehr Mitgliedstaaten tätig ist, unterliegt dem Wohnstaat bei wesentlichem Teil dort, sonst dem Mittelpunkt der Interessen.", sourceKey: "vo-883", passageKey: "vo-883-art-13", riskLevel: "high" },
  { key: "self-employed-turnover-indicators", category: "article13-2", type: "definition", text: "Für Selbständigkeit können Umsatz, Arbeitszeit, Zahl der Leistungen und Einkommen als Anhaltspunkte dienen.", sourceKey: "vo-987", passageKey: "vo-987-art-14-8", riskLevel: "medium" },
  { key: "employed-self-employed-substantial-tests-distinct", category: "article13-2", type: "exception", text: "C-203/24 betrifft beschäftigte Mehrstaatentätigkeit. Die selbständige Wesentlichkeitsprüfung nach Artikel 13 Absatz 2 und Artikel 14 Absatz 8 Buchstabe b wird dadurch nicht automatisch auf dieselbe gerichtliche 25-Prozent-Formel umgestellt.", sourceKey: "cjeu-hakamp", passageKey: "cjeu-hakamp-text", riskLevel: "high" },
  { key: "registration-not-centre", category: "article13-2", type: "exception", text: "Die Gewerbeanmeldung ist nicht automatisch der Mittelpunkt der Interessen.", sourceKey: "vo-987", passageKey: "vo-987-art-14", riskLevel: "high" },
  { key: "residence-not-centre-automatically", category: "article13-2", type: "exception", text: "Der Wohnsitz ist nicht automatisch der Mittelpunkt der Interessen.", sourceKey: "vo-987", passageKey: "vo-987-art-14", riskLevel: "high" },
  { key: "largest-customer-not-centre", category: "article13-2", type: "exception", text: "Der größte Auftraggeber ist nicht automatisch der Mittelpunkt der Interessen.", sourceKey: "vo-987", passageKey: "vo-987-art-14", riskLevel: "high" },
  { key: "centre-of-interest-fail-closed", category: "article13-2", type: "exception", text: "Der Mittelpunkt der Interessen darf ohne die tatsächlichen Tätigkeitskriterien nicht bestimmt werden.", sourceKey: "vo-987", passageKey: "vo-987-art-14", riskLevel: "high", requiresAuthorityResolution: true },

  { key: "art-13-3-employed-plus-self-employed", category: "mixed", type: "definition", text: "Wer in einem Mitgliedstaat beschäftigt und in einem anderen selbständig tätig ist, unterliegt nach geltendem Artikel 13 den Rechtsvorschriften des Beschäftigungsstaats.", sourceKey: "vo-883", passageKey: "vo-883-art-13", riskLevel: "high" },
  { key: "self-employed-abroad-not-second-system", category: "mixed", type: "exception", text: "Eine selbständige Tätigkeit im Ausland begründet nicht automatisch ein zweites Sozialversicherungssystem.", sourceKey: "vo-883", passageKey: "vo-883-art-13", riskLevel: "high" },
  { key: "art-13-4-civil-servant-mixed", category: "mixed", type: "definition", text: "Ein Beamter, der daneben eine Beschäftigung oder Selbständigkeit ausübt, unterliegt den Rechtsvorschriften des die Verwaltung beschäftigenden Mitgliedstaats. Beamtenpensionsrecht wird nicht aufgebaut.", sourceKey: "vo-883", passageKey: "vo-883-art-13", riskLevel: "medium" },
  { key: "marginal-activity-may-be-disregarded", category: "mixed", type: "definition", text: "Geringfügige Tätigkeiten können für die Bestimmung der anwendbaren Rechtsvorschriften nach den Mehrstaatenregeln unberücksichtigt bleiben, soweit das geltende Durchführungsrecht dies vorsieht.", sourceKey: "vo-987", passageKey: "vo-987-art-14", riskLevel: "high" },
  { key: "small-side-job-not-automatic-material", category: "mixed", type: "exception", text: "Ein kleiner Nebenjob ist nicht automatisch wesentlich.", sourceKey: "vo-987", passageKey: "vo-987-art-14", riskLevel: "high" },
  { key: "small-side-job-not-automatic-ignored", category: "mixed", type: "exception", text: "Ein kleiner Nebenjob wird nicht ohne rechtliche Einordnung automatisch ignoriert.", sourceKey: "vo-987", passageKey: "vo-987-art-14", riskLevel: "high" },
  { key: "no-invented-hourly-euro-threshold", category: "mixed", type: "exception", text: "Es gilt kein in diesem Kern erfundener universeller Stunden- oder Euro-Schwellenwert für Geringfügigkeit.", sourceKey: "vo-987", passageKey: "vo-987-art-14", riskLevel: "high" },

  { key: "telework-may-be-multi-state", category: "telework", type: "definition", text: "Grenzüberschreitendes Homeoffice kann Mehrstaatenarbeit sein und ist nicht automatisch Entsendung.", sourceKey: "practical-guide", passageKey: "practical-guide-text", riskLevel: "high" },
  { key: "home-office-not-automatic-employer-state-insurance", category: "telework", type: "exception", text: "Homeoffice aus SK, CZ, PL oder HU für einen deutschen Arbeitgeber bedeutet nicht automatisch deutsche Versicherung.", sourceKey: "vo-883", passageKey: "vo-883-art-13", riskLevel: "high" },
  { key: "framework-agreement-is-art-16-not-art-13", category: "telework", type: "definition", text: "Die Rahmenvereinbarung über gewöhnliche grenzüberschreitende Telearbeit ist eine besondere Artikel-16-Route und nicht Artikel 13 selbst.", sourceKey: "telework-framework", passageKey: "telework-framework-text", riskLevel: "high" },
  { key: "framework-participation-fetch-live", category: "telework", type: "procedure", text: "Teilnehmende Staaten der Telearbeits-Rahmenvereinbarung sind beim belgischen Verwahrer aktuell zu prüfen.", sourceKey: "telework-framework", passageKey: "telework-framework-text", riskLevel: "high" },
  { key: "framework-not-assume-corridor-states", category: "telework", type: "exception", text: "Eine Teilnahme von SK, CZ, PL oder HU darf nicht ohne Live-Prüfung unterstellt werden.", sourceKey: "telework-framework", passageKey: "telework-framework-text", riskLevel: "high" },
  { key: "framework-not-user-automatic-right", category: "telework", type: "exception", text: "Die Rahmenvereinbarung ist kein automatischer Anspruch; sie setzt Teilnahme beider betroffener Staaten und die übrigen Eignungsbedingungen voraus.", sourceKey: "telework-framework", passageKey: "telework-framework-text", riskLevel: "high", requiresAuthorityResolution: true },

  { key: "art-16-987-notify-residence", category: "procedure", type: "procedure", text: "Bei Tätigkeiten in zwei oder mehr Mitgliedstaaten ist der vom Wohnmitgliedstaat bezeichnete Träger zu unterrichten. Dieser bestimmt die anwendbaren Rechtsvorschriften.", sourceKey: "vo-987", passageKey: "vo-987-art-16", riskLevel: "high" },
  { key: "german-employer-not-always-first-contact", category: "procedure", type: "exception", text: "Der deutsche Arbeitgeber ist nicht immer die erste Anlaufstelle des zuständigen Trägers.", sourceKey: "vo-987", passageKey: "vo-987-art-16", riskLevel: "high" },
  { key: "user-cannot-choose-cheaper-state", category: "procedure", type: "exception", text: "Die Person darf den sozialversicherungsrechtlich günstigeren Staat nicht wählen.", sourceKey: "vo-987", passageKey: "vo-987-art-16", riskLevel: "high" },
  { key: "provisional-then-definitive", category: "procedure", type: "procedure", text: "Die Bestimmung verläuft über Unterrichtung, vorläufige Bestimmung, Unterrichtung anderer Träger, Einwandfrist, endgültige Bestimmung und Information der Person.", sourceKey: "vo-987", passageKey: "vo-987-art-16", riskLevel: "high" },
  { key: "disagreement-not-coverage-gap", category: "procedure", type: "definition", text: "Uneinigkeit der Träger bedeutet nicht, dass keine Rechtsvorschriften gelten; vorläufig ist eine Zuordnung sicherzustellen.", sourceKey: "vo-987", passageKey: "vo-987-art-6", riskLevel: "high" },
  { key: "disagreement-not-worker-choice", category: "procedure", type: "exception", text: "Bei Trägeruneinigkeit wählt die beschäftigte Person den Staat nicht.", sourceKey: "vo-987", passageKey: "vo-987-art-6", riskLevel: "high" },
  { key: "temporary-not-necessarily-final", category: "procedure", type: "exception", text: "Die vorläufige Bestimmung ist nicht notwendig die endgültige Bestimmung.", sourceKey: "vo-987", passageKey: "vo-987-art-6", riskLevel: "high" },
  { key: "birello-cannot-choose-legislation", category: "procedure", type: "exception", text: "Ohne A1 und ohne Trägerbestimmung darf BIRELLO die anwendbaren Rechtsvorschriften nicht selbst wählen.", sourceKey: "vo-987", passageKey: "vo-987-art-16", riskLevel: "high", requiresAuthorityResolution: true },

  { key: "pd-a1-purpose", category: "a1", type: "definition", text: "Das Portable Document A1 bescheinigt die für die Inhaberin oder den Inhaber anwendbaren Rechtsvorschriften der sozialen Sicherheit.", sourceKey: "your-europe-a1", passageKey: "your-europe-a1-text", riskLevel: "high" },
  { key: "a1-not-work-permit", category: "a1", type: "exception", text: "A1 ist keine Arbeitserlaubnis.", sourceKey: "your-europe-a1", passageKey: "your-europe-a1-text", riskLevel: "high" },
  { key: "a1-not-visa", category: "a1", type: "exception", text: "A1 ist kein Visum und kein Aufenthaltstitel.", sourceKey: "your-europe-a1", passageKey: "your-europe-a1-text", riskLevel: "high" },
  { key: "a1-not-tax-certificate", category: "a1", type: "exception", text: "A1 ist keine steuerliche Bescheinigung.", sourceKey: "your-europe-a1", passageKey: "your-europe-a1-text", riskLevel: "high" },
  { key: "a1-not-ehic", category: "a1", type: "exception", text: "A1 ist nicht die Europäische Krankenversicherungskarte.", sourceKey: "your-europe-a1", passageKey: "your-europe-a1-text", riskLevel: "high" },
  { key: "a1-not-s1", category: "a1", type: "exception", text: "A1 ist nicht dasselbe Dokument wie S1.", sourceKey: "your-europe-a1", passageKey: "your-europe-a1-text", riskLevel: "high" },
  { key: "a1-not-health-card", category: "a1", type: "exception", text: "A1 ist keine Krankenversicherungskarte.", sourceKey: "your-europe-a1", passageKey: "your-europe-a1-text", riskLevel: "high" },
  { key: "a1-not-host-labour-exemption", category: "a1", type: "exception", text: "A1 befreit nicht von arbeitsrechtlichen Aufnahmebedingungen des Aufnahmestaats zu Mindestentgelt, Arbeitszeit oder Sicherheit.", sourceKey: "your-europe-a1", passageKey: "your-europe-a1-text", riskLevel: "high" },
  { key: "a1-not-posting-notification-exemption", category: "a1", type: "exception", text: "A1 befreit nicht von aufnahmestaatlichen Entsendemeldungen.", sourceKey: "your-europe-a1", passageKey: "your-europe-a1-text", riskLevel: "high" },
  { key: "a1-issuer-competence-principle", category: "a1", type: "procedure", text: "Bei Entsendung stellt grundsätzlich der Träger der weitergeltenden Rechtsvorschriften A1 aus. Bei Mehrstaatenarbeit ist zuerst das Wohnstaatverfahren maßgeblich.", sourceKey: "vo-987", passageKey: "vo-987-art-16", riskLevel: "high" },
  { key: "host-institution-not-always-issuer", category: "a1", type: "exception", text: "Der Träger des Aufnahmestaats ist nicht immer der A1-Aussteller.", sourceKey: "vo-987", passageKey: "vo-987-art-16", riskLevel: "high" },
  { key: "employer-not-issuing-authority", category: "a1", type: "exception", text: "Der Arbeitgeber ist nicht die ausstellende Behörde der A1-Bescheinigung.", sourceKey: "eessi-directory", passageKey: "eessi-directory-text", riskLevel: "high" },
  { key: "no-hardcoded-dvka-as-eu-truth", category: "a1", type: "exception", text: "Nationale A1-Stellen, einschließlich der deutschen DVKA, sind nicht als kanonische EU-Wahrheit festgeschrieben; die genaue Stelle ist live zu ermitteln.", sourceKey: "eessi-directory", passageKey: "eessi-directory-text", riskLevel: "high" },
  { key: "a1-notify-in-advance-where-possible", category: "a1", type: "procedure", text: "Die Unterrichtung soll bei Entsendung nach Möglichkeit im Voraus erfolgen; operativ wird empfohlen, A1 vor Tätigkeitsbeginn zu erlangen.", sourceKey: "vo-987", passageKey: "vo-987-art-15", riskLevel: "medium" },
  { key: "later-a1-not-automatically-invalid", category: "a1", type: "exception", text: "Eine nach Tätigkeitsbeginn ausgestellte A1-Bescheinigung ist nicht automatisch ungültig.", sourceKey: "vo-987", passageKey: "vo-987-art-15", riskLevel: "high" },
  { key: "a1-binding-while-valid", category: "a1", type: "definition", text: "Eine gültige A1-Bescheinigung des zuständigen Trägers ist von anderen Trägern grundsätzlich anzuerkennen, solange sie nicht zurückgenommen oder für ungültig erklärt ist.", sourceKey: "vo-987", passageKey: "vo-987-art-5", riskLevel: "high" },
  { key: "inspector-disagree-not-void", category: "a1", type: "exception", text: "Ein widersprechender Prüfer des Aufnahmestaats macht A1 nicht automatisch nichtig.", sourceKey: "cjeu-herbosch", passageKey: "cjeu-herbosch-text", riskLevel: "high" },
  { key: "a1-not-immune-from-review", category: "a1", type: "exception", text: "A1 ist nicht gegen Überprüfung oder Rücknahme durch die vorgesehenen Mechanismen immun.", sourceKey: "cjeu-altun", passageKey: "cjeu-altun-text", riskLevel: "high" },
  { key: "fraud-not-user-void", category: "a1", type: "exception", text: "Betrugsbedenken erlauben der Person nicht, die Bescheinigung selbst für ungültig zu erklären.", sourceKey: "cjeu-altun", passageKey: "cjeu-altun-text", riskLevel: "high" },
  { key: "a1-not-permanently-frozen", category: "a1", type: "exception", text: "Eine ausgestellte A1-Bescheinigung friert die anwendbaren Rechtsvorschriften nicht dauerhaft ein.", sourceKey: "vo-987", passageKey: "vo-987-art-18-20", riskLevel: "high" },
  { key: "material-change-re-examine", category: "a1", type: "procedure", text: "Materielle Änderungen der Tätigkeit, des Wohnsitzes, der Arbeitgeberbeziehung oder der Entsendung sind dem zuständigen Träger zurückzumelden.", sourceKey: "vo-987", passageKey: "vo-987-art-18-20", riskLevel: "high" },

  { key: "ss-not-host-employment-law", category: "boundary", type: "boundary", text: "Die anwendbaren Rechtsvorschriften der sozialen Sicherheit sind nicht dasselbe wie die arbeitsrechtlichen Aufnahmebedingungen für entsandte Arbeitnehmer.", sourceKey: "your-europe-a1", passageKey: "your-europe-a1-text", riskLevel: "high" },
  { key: "ss-not-tax-residence", category: "boundary", type: "boundary", text: "Der sozialversicherungsrechtliche Staat ist nicht der steuerliche Wohnsitz und nicht automatisch der Besteuerungsstaat des Arbeitslohns.", sourceKey: "your-europe-a1", passageKey: "your-europe-a1-text", riskLevel: "high" },
  { key: "a1-not-183-day", category: "boundary", type: "exception", text: "183-Tage-Steuerregeln gehören nicht in diesen Kern.", sourceKey: "your-europe-a1", passageKey: "your-europe-a1-text", riskLevel: "high" },
  { key: "a1-de-not-tax-only-germany", category: "boundary", type: "exception", text: "A1 mit deutscher Sozialversicherung bedeutet nicht automatisch, dass der Arbeitslohn nur in Deutschland steuerpflichtig ist.", sourceKey: "your-europe-a1", passageKey: "your-europe-a1-text", riskLevel: "high" },
  { key: "a1-not-free-movement", category: "boundary", type: "exception", text: "A1 begründet keine unionsrechtlichen Freizügigkeits-, Aufenthalts- oder Visarechte und keine Drittstaatenerlaubnis.", sourceKey: "your-europe-a1", passageKey: "your-europe-a1-text", riskLevel: "high" },
  { key: "third-country-scope-boundary", category: "boundary", type: "boundary", text: "Für Drittstaatsangehörige können besondere persönliche und territoriale Anwendungsfragen entstehen; Einwanderungsrecht wird hier nicht aufgebaut.", sourceKey: "vo-883", passageKey: "vo-883-art-11", riskLevel: "medium" },
  { key: "healthcare-docs-out-of-engine", category: "boundary", type: "boundary", text: "Krankenversicherungsdokumente, Familienleistungen, Arbeitslosen- und Rentenkoordination werden über die für die Zuordnung nötigen Grenzen hinaus nicht aufgebaut.", sourceKey: "your-europe-a1", passageKey: "your-europe-a1-text", riskLevel: "medium" },
  { key: "no-posting-of-workers-directive-engine", category: "boundary", type: "boundary", text: "Die Richtlinie über die Entsendung von Arbeitnehmern als arbeitsrechtliches Vollsystem wird in diesem Kern nicht aufgebaut.", sourceKey: "your-europe-a1", passageKey: "your-europe-a1-text", riskLevel: "medium" },
  { key: "no-tax-treaty-engine", category: "boundary", type: "boundary", text: "Ein Doppelbesteuerungsabkommensmotor wird in diesem Kern nicht aufgebaut.", sourceKey: "your-europe-a1", passageKey: "your-europe-a1-text", riskLevel: "medium" },

  { key: "individual-classification-fail-closed", category: "facts", type: "exception", text: "Die individuelle anwendbare Rechtsvorschrift darf ohne Rolle, Status, Wohnsitzstaat, Tätigkeitsstaaten, Arbeitgeber und maßgeblichen Zeitraum nicht beantwortet werden.", sourceKey: "practical-guide", passageKey: "practical-guide-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "missing-percentages-fail-closed", category: "facts", type: "exception", text: "Ohne Angaben zu Arbeitszeit- oder Entgeltanteilen und zur voraussichtlichen Zwölfmonatslage darf der wesentliche Teil nicht festgestellt werden.", sourceKey: "vo-987", passageKey: "vo-987-art-14", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "missing-residence-fail-closed", category: "facts", type: "exception", text: "Ohne geklärten Wohnmitgliedstaat darf das Mehrstaatenverfahren nicht als Wahl der Person behandelt werden.", sourceKey: "vo-987", passageKey: "vo-987-art-16", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "slovak-national-working-only-de", category: "facts", type: "exception", text: "Eine slowakische Staatsangehörige, die ausschließlich in Deutschland beschäftigt ist, wird nicht allein wegen der Staatsangehörigkeit slowakisch versichert.", sourceKey: "vo-883", passageKey: "vo-883-art-11", riskLevel: "high" },
  { key: "german-national-resident-sk-multi-state", category: "facts", type: "exception", text: "Ein deutscher Staatsangehöriger mit Wohnsitz in der Slowakei und echter Mehrstaatenarbeit wird nicht allein wegen der Staatsangehörigkeit deutsch versichert.", sourceKey: "vo-883", passageKey: "vo-883-art-11", riskLevel: "high" },
]);

type ProcessSpec = Readonly<{
  key: string;
  title: string;
  trigger: string;
  safeFirstStep: string;
  riskLevel: "medium" | "high";
  dimensions: Readonly<Record<ProcessCompleteDimension, string>>;
}>;

const SHARED_FRESHNESS = "current-883-987-baseline";
const SHARED_INSTITUTION = "art-16-987-notify-residence";
const SHARED_BOUNDARIES = "ss-not-host-employment-law";
const SHARED_NEG = "nationality-not-applicable-legislation";

export const EU_AL_PROCESSES: readonly ProcessSpec[] = Object.freeze([
  { key: "applicable-legislation-classify", title: "Anwendbare Rechtsvorschriften 2026 einordnen", trigger: "Arbeit, Wohnsitz oder Versicherung berühren mehr als einen Mitgliedstaat", safeFirstStep: "Zuerst den Grundsatz der einen Rechtsvorschrift anwenden und Staatsangehörigkeit nicht als Anknüpfung nutzen.", riskLevel: "high", dimensions: { what: EU_SHARED_ONE_LEGISLATION_CLAIM_KEY, whoWhen: "art-11-employed-lex-loci-laboris", documents: "pd-a1-purpose", how: "individual-classification-fail-closed", next: "provisional-then-definitive", deadlines: "a1-notify-in-advance-where-possible", problems: "user-cannot-choose-cheaper-state", dutiesAfter: "material-change-re-examine", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: SHARED_NEG } },
  { key: "single-state-worker-classify", title: "Gewöhnliche Ein-Staat-Beschäftigung 2026 einordnen", trigger: "Wohnsitz in einem Mitgliedstaat, ausschließliche Beschäftigung in einem anderen", safeFirstStep: "Lex loci laboris prüfen und Wohnsitz nicht automatisch als Versicherungsstaat setzen.", riskLevel: "high", dimensions: { what: "art-11-employed-lex-loci-laboris", whoWhen: "residence-not-automatic-employment-legislation", documents: "pd-a1-purpose", how: "individual-classification-fail-closed", next: "a1-issuer-competence-principle", deadlines: "a1-notify-in-advance-where-possible", problems: "slovak-national-working-only-de", dutiesAfter: "material-change-re-examine", institution: "no-hardcoded-dvka-as-eu-truth", boundaries: "ss-not-tax-residence", freshness: SHARED_FRESHNESS, negatives: "residence-plus-work-not-choice" } },
  { key: "employee-posting-art-12-1", title: "Arbeitnehmerentsendung Artikel 12 Absatz 1 2026 prüfen", trigger: "Arbeitgeber sendet Beschäftigte vorübergehend in einen anderen Mitgliedstaat", safeFirstStep: "Alle kumulativen Artikel-12-Bedingungen prüfen, nicht nur die 24 Monate.", riskLevel: "high", dimensions: { what: EU_SHARED_ARTICLE_12_CLAIM_KEY, whoWhen: "art-12-1-24-months-not-automatic", documents: "pd-a1-purpose", how: "individual-classification-fail-closed", next: "a1-issuer-competence-principle", deadlines: "a1-notify-in-advance-where-possible", problems: "business-trip-not-automatic-posting", dutiesAfter: "material-change-re-examine", institution: "host-institution-not-always-issuer", boundaries: "a1-not-host-labour-exemption", freshness: SHARED_FRESHNESS, negatives: "german-employer-not-automatic-german-legislation" } },
  { key: "self-employed-posting-art-12-2", title: "Selbständige Entsendung Artikel 12 Absatz 2 2026 prüfen", trigger: "Selbständige Person übt vorübergehend ähnliche Tätigkeit in einem anderen Mitgliedstaat aus", safeFirstStep: "Herkunftstätigkeit, Ähnlichkeit, Dauer und Rückkehrbedingungen trennen von einer Arbeitnehmerentsendung.", riskLevel: "high", dimensions: { what: "art-12-2-self-employed-posting", whoWhen: "similar-activity-required", documents: "pd-a1-purpose", how: "individual-classification-fail-closed", next: "a1-issuer-competence-principle", deadlines: "art-12-1-24-months-not-extension", problems: "different-activity-may-defeat", dutiesAfter: "material-change-re-examine", institution: "host-institution-not-always-issuer", boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "self-employed-not-employee-posting" } },
  { key: "employer-normal-activity-gate", title: "Wesentliche Arbeitgebertätigkeit im Entsendestaat 2026 prüfen", trigger: "Zweifel, ob der Arbeitgeber im Entsendestaat wirklich wesentliche Tätigkeiten ausübt", safeFirstStep: "Sitz allein nicht genügen lassen; tatsächliche Unternehmungstätigkeit einordnen oder fail-closed bleiben.", riskLevel: "high", dimensions: { what: "employer-substantial-activities-required", whoWhen: "newly-recruited-prior-coverage", documents: "employer-substance-fail-closed", how: "employer-substance-fail-closed", next: "a1-issuer-competence-principle", deadlines: "one-month-guidance-not-immutable-statute", problems: "letterbox-not-sending-employer", dutiesAfter: "material-change-re-examine", institution: "no-hardcoded-dvka-as-eu-truth", boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "registered-office-not-sufficient" } },
  { key: "replacement-gate", title: "Ablösungsverbot der Entsendung 2026 prüfen", trigger: "Eine entsandte Person könnte eine zuvor entsandte Person ersetzen", safeFirstStep: "Ablösung als rechtliche Frage behandeln und ohne Sachverhalt nicht feststellen.", riskLevel: "high", dimensions: { what: "replacement-prohibition", whoWhen: "different-employee-not-new-period", documents: "replacement-fail-closed", how: "replacement-fail-closed", next: "a1-issuer-competence-principle", deadlines: "art-12-1-24-months-not-automatic", problems: "new-contract-not-reset", dutiesAfter: "material-change-re-examine", institution: "host-institution-not-always-issuer", boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "different-employer-not-replacement-impossible" } },
  { key: "multi-state-employed-classify", title: "Gewöhnliche Mehrstaatenbeschäftigung 2026 einordnen", trigger: "Beschäftigung wird gewöhnlich in zwei oder mehr Mitgliedstaaten ausgeübt", safeFirstStep: "Gewöhnlichkeit feststellen und einzelne Reisen nicht automatisch als Mehrstaatenarbeit werten.", riskLevel: "high", dimensions: { what: "art-13-1-multi-state-habitual", whoWhen: "isolated-trip-not-multi-state", documents: "missing-percentages-fail-closed", how: "twelve-month-prospective", next: "provisional-then-definitive", deadlines: "twelve-month-prospective", problems: "isolated-trip-not-multi-state", dutiesAfter: "material-change-re-examine", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "two-employers-not-two-systems" } },
  { key: "substantial-residence-activity-determine", title: "Wesentlichen Wohnsitzanteil 2026 bestimmen", trigger: "Mehrstaatenbeschäftigung mit Wohnsitz in einem der Tätigkeitsstaaten", safeFirstStep: "Für Beschäftigte prüfen, ob die voraussichtliche Zwölfmonatslage wenigstens 25 Prozent Arbeitszeit und/oder wenigstens 25 Prozent Entgelt im Wohnstaat erreicht; ohne diese Anteile fail-closed bleiben.", riskLevel: "high", dimensions: { what: "substantial-activity-indicator-25", whoWhen: "twelve-month-prospective", documents: "missing-percentages-fail-closed", how: "substantial-activity-fail-closed", next: "substantial-in-residence-residence-law", deadlines: "one-historic-month-not-period", problems: "employed-both-below-25-not-substantial", dutiesAfter: "material-change-re-examine", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "employed-25-not-optional-soft-guidance" } },
  { key: "multi-employer-art-13-branch", title: "Mehrarbeitgeberzweige des Artikels 13 2026 zuordnen", trigger: "Mehrere Arbeitgeber in einem oder mehreren Mitgliedstaaten", safeFirstStep: "Nicht auf Arbeitgeberstaat bei unter 25 Prozent verkürzen; die Sitzkonstellationen unterscheiden.", riskLevel: "high", dimensions: { what: "one-employer-branch", whoWhen: "several-employers-same-state", documents: "individual-classification-fail-closed", how: "several-employers-incl-residence", next: "provisional-then-definitive", deadlines: "twelve-month-prospective", problems: "less-than-25-not-always-employer-state", dutiesAfter: "material-change-re-examine", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "several-employers-other-states-residence" } },
  { key: "multi-state-self-employed-classify", title: "Selbständige Mehrstaatentätigkeit 2026 einordnen", trigger: "Selbständige Tätigkeit in zwei oder mehr Mitgliedstaaten", safeFirstStep: "Wesentlichen Wohnsitzanteil und Mittelpunkt der Interessen trennen und die beschäftigte Hakamp-Formel nicht automatisch auf Selbständige übertragen.", riskLevel: "high", dimensions: { what: "art-13-2-self-employed-multi-state", whoWhen: "self-employed-turnover-indicators", documents: "centre-of-interest-fail-closed", how: "centre-of-interest-fail-closed", next: "provisional-then-definitive", deadlines: "twelve-month-prospective", problems: "largest-customer-not-centre", dutiesAfter: "material-change-re-examine", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "employed-self-employed-substantial-tests-distinct" } },
  { key: "centre-of-interest-boundary", title: "Mittelpunkt der Interessen 2026 abgrenzen", trigger: "Selbständige Mehrstaatentätigkeit ohne wesentlichen Wohnsitzanteil", safeFirstStep: "Mehrere tatsächliche Kriterien verlangen und Anmeldung oder größten Kunden nicht genügen lassen.", riskLevel: "high", dimensions: { what: "centre-of-interest-fail-closed", whoWhen: "art-13-2-self-employed-multi-state", documents: "centre-of-interest-fail-closed", how: "centre-of-interest-fail-closed", next: "provisional-then-definitive", deadlines: "twelve-month-prospective", problems: "residence-not-centre-automatically", dutiesAfter: "material-change-re-examine", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "largest-customer-not-centre" } },
  { key: "employed-plus-self-employed-coordination", title: "Beschäftigung plus Selbständigkeit in verschiedenen Staaten 2026 zuordnen", trigger: "Gleichzeitige Beschäftigung in einem und Selbständigkeit in einem anderen Mitgliedstaat", safeFirstStep: "Den Beschäftigungszweig des geltenden Artikels 13 anwenden und kein zweites System unterstellen.", riskLevel: "high", dimensions: { what: "art-13-3-employed-plus-self-employed", whoWhen: "art-13-3-employed-plus-self-employed", documents: "individual-classification-fail-closed", how: "individual-classification-fail-closed", next: "provisional-then-definitive", deadlines: "twelve-month-prospective", problems: "self-employed-abroad-not-second-system", dutiesAfter: "material-change-re-examine", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "self-employed-abroad-not-second-system" } },
  { key: "civil-servant-mixed-activity-boundary", title: "Beamtenmischätigkeit 2026 als Zuordnungsgrenze einordnen", trigger: "Beamtenverhältnis plus private Beschäftigung oder Selbständigkeit", safeFirstStep: "Nur die Artikel-13-Zuordnung geben und kein Beamtenpensionsrecht aufbauen.", riskLevel: "medium", dimensions: { what: "art-13-4-civil-servant-mixed", whoWhen: "art-11-civil-servant-boundary", documents: "individual-classification-fail-closed", how: "individual-classification-fail-closed", next: "provisional-then-definitive", deadlines: "a1-notify-in-advance-where-possible", problems: "art-11-civil-servant-boundary", dutiesAfter: "material-change-re-examine", institution: SHARED_INSTITUTION, boundaries: "healthcare-docs-out-of-engine", freshness: SHARED_FRESHNESS, negatives: SHARED_NEG } },
  { key: "marginal-activity-boundary", title: "Geringfügige Mehrstaatentätigkeit 2026 abgrenzen", trigger: "Kleine Nebentätigkeit in einem zweiten Mitgliedstaat", safeFirstStep: "Weder automatisch wesentlich noch automatisch unbeachtlich behandeln; keinen erfundenen Schwellenwert nutzen.", riskLevel: "high", dimensions: { what: "marginal-activity-may-be-disregarded", whoWhen: "small-side-job-not-automatic-material", documents: "individual-classification-fail-closed", how: "individual-classification-fail-closed", next: "provisional-then-definitive", deadlines: "twelve-month-prospective", problems: "small-side-job-not-automatic-ignored", dutiesAfter: "material-change-re-examine", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "no-invented-hourly-euro-threshold" } },
  { key: "cross-border-telework-boundary", title: "Grenzüberschreitendes Homeoffice 2026 einordnen", trigger: "Regelmäßige Telearbeit im Wohnstaat für Arbeitgeber in einem anderen Mitgliedstaat", safeFirstStep: "Zuerst als mögliche Mehrstaatenarbeit und nicht als automatische Entsendung behandeln.", riskLevel: "high", dimensions: { what: "telework-may-be-multi-state", whoWhen: "remote-work-not-posting-automatically", documents: "missing-percentages-fail-closed", how: "individual-classification-fail-closed", next: "framework-agreement-is-art-16-not-art-13", deadlines: "twelve-month-prospective", problems: "home-office-not-automatic-employer-state-insurance", dutiesAfter: "material-change-re-examine", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "remote-work-not-posting-automatically" } },
  { key: "article-16-exception-route", title: "Artikel-16-Ausnahmevereinbarung 2026 abgrenzen", trigger: "Gewünschte Abweichung von den Artikeln 11 bis 15, einschließlich langer Entsendung oder Telearbeitsrahmen", safeFirstStep: "Als Stellenvereinbarung und nicht als Nutzeranspruch oder Artikel-12-Verlängerung behandeln.", riskLevel: "high", dimensions: { what: "art-16-exception-agreement", whoWhen: "posting-beyond-24-may-need-art-16", documents: "art-16-not-user-entitlement", how: "art-16-not-user-entitlement", next: "framework-participation-fetch-live", deadlines: "a1-expiry-not-automatic-continuation", problems: "art-16-not-ordinary-art-12-extension", dutiesAfter: "material-change-re-examine", institution: "no-hardcoded-dvka-as-eu-truth", boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "art-16-not-user-entitlement" } },
  { key: "residence-institution-notification", title: "Wohnstaatliche Mehrstaatenanzeige 2026 führen", trigger: "Tätigkeiten in zwei oder mehr Mitgliedstaaten, Bestimmung noch offen", safeFirstStep: "An den bezeichneten Träger des Wohnmitgliedstaats verweisen, nicht an den Wunschstaat der Person.", riskLevel: "high", dimensions: { what: "art-16-987-notify-residence", whoWhen: "missing-residence-fail-closed", documents: "missing-residence-fail-closed", how: "provisional-then-definitive", next: "provisional-then-definitive", deadlines: "a1-notify-in-advance-where-possible", problems: "german-employer-not-always-first-contact", dutiesAfter: "material-change-re-examine", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "user-cannot-choose-cheaper-state" } },
  { key: "provisional-definitive-determination", title: "Vorläufige und endgültige Bestimmung 2026 unterscheiden", trigger: "Wohnstaatträger hat bestimmt oder Träger streiten", safeFirstStep: "Vorläufige Deckung sichern und Endgültigkeit nicht unterstellen.", riskLevel: "high", dimensions: { what: "provisional-then-definitive", whoWhen: "temporary-not-necessarily-final", documents: "pd-a1-purpose", how: "provisional-then-definitive", next: "a1-issuer-competence-principle", deadlines: "a1-notify-in-advance-where-possible", problems: "disagreement-not-coverage-gap", dutiesAfter: "material-change-re-examine", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "temporary-not-necessarily-final" } },
  { key: "pd-a1-purpose-classification", title: "Portable Document A1 2026 einordnen", trigger: "Nutzer legt A1 vor oder verlangt A1 als Erlaubnis", safeFirstStep: "A1 als Bescheinigung der anwendbaren Rechtsvorschriften erklären und von Arbeits-, Steuer- und Gesundheitsdokumenten trennen.", riskLevel: "high", dimensions: { what: "pd-a1-purpose", whoWhen: "a1-issuer-competence-principle", documents: "pd-a1-purpose", how: "a1-issuer-competence-principle", next: "a1-binding-while-valid", deadlines: "a1-notify-in-advance-where-possible", problems: "a1-not-work-permit", dutiesAfter: "material-change-re-examine", institution: "employer-not-issuing-authority", boundaries: "a1-not-tax-certificate", freshness: SHARED_FRESHNESS, negatives: "a1-not-ehic" } },
  { key: "pd-a1-request-issuer-route", title: "A1-Antragsweg 2026 auf EU-Ebene führen", trigger: "A1 wird für Entsendung oder Mehrstaatenarbeit benötigt", safeFirstStep: "Nur Kompetenzgrundsätze nennen und die nationale Stelle live ermitteln.", riskLevel: "high", dimensions: { what: "a1-issuer-competence-principle", whoWhen: "host-institution-not-always-issuer", documents: "no-hardcoded-dvka-as-eu-truth", how: "no-hardcoded-dvka-as-eu-truth", next: "a1-binding-while-valid", deadlines: "a1-notify-in-advance-where-possible", problems: "employer-not-issuing-authority", dutiesAfter: "material-change-re-examine", institution: "no-hardcoded-dvka-as-eu-truth", boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "host-institution-not-always-issuer" } },
  { key: "pd-a1-timing", title: "A1-Zeitpunkt 2026 einordnen", trigger: "Tätigkeit beginnt bevor A1 vorliegt oder A1 wird nachträglich ausgestellt", safeFirstStep: "Vorausunterrichtung von späterer rechtlicher Wirkung der Bescheinigung trennen.", riskLevel: "high", dimensions: { what: "a1-notify-in-advance-where-possible", whoWhen: "later-a1-not-automatically-invalid", documents: "pd-a1-purpose", how: "individual-classification-fail-closed", next: "a1-binding-while-valid", deadlines: "a1-notify-in-advance-where-possible", problems: "no-a1-not-automatic-art-12", dutiesAfter: "material-change-re-examine", institution: "a1-issuer-competence-principle", boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "later-a1-not-automatically-invalid" } },
  { key: "pd-a1-change-withdrawal", title: "A1-Änderung und Rücknahme 2026 einordnen", trigger: "Sachverhalt ändert sich nach Ausstellung oder Angaben waren unrichtig", safeFirstStep: "Zurück zum zuständigen Träger leiten; A1 nicht als dauerhaft eingefroren behandeln.", riskLevel: "high", dimensions: { what: "a1-not-permanently-frozen", whoWhen: "material-change-re-examine", documents: "material-change-re-examine", how: "material-change-re-examine", next: "a1-not-immune-from-review", deadlines: "material-change-re-examine", problems: "a1-not-permanently-frozen", dutiesAfter: "material-change-re-examine", institution: "a1-issuer-competence-principle", boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "a1-not-immune-from-review" } },
  { key: "institutional-disagreement-dialogue", title: "Trägerdialog und Meinungsverschiedenheit 2026 einordnen", trigger: "Zwei Träger oder ein Prüfer des Aufnahmestaats bestreiten A1 oder die Zuordnung", safeFirstStep: "Institutionellen Dialog verlangen; weder Deckungslücke noch Nutzerannullierung unterstellen.", riskLevel: "high", dimensions: { what: "disagreement-not-coverage-gap", whoWhen: "inspector-disagree-not-void", documents: "a1-binding-while-valid", how: "provisional-then-definitive", next: "a1-not-immune-from-review", deadlines: "temporary-not-necessarily-final", problems: "fraud-not-user-void", dutiesAfter: "material-change-re-examine", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "disagreement-not-worker-choice" } },
  { key: "tax-employment-immigration-boundary", title: "Steuer-, Arbeits- und Aufenthaltsgrenzen 2026 halten", trigger: "Nutzer hält A1 für Steuer-, Arbeitserlaubnis- oder Visumersatz", safeFirstStep: "Die drei Rechtskreise trennen und 183-Tage-Steuerregeln nicht anwenden.", riskLevel: "high", dimensions: { what: "ss-not-tax-residence", whoWhen: "a1-not-free-movement", documents: "a1-not-tax-certificate", how: "no-tax-treaty-engine", next: "no-posting-of-workers-directive-engine", deadlines: "a1-not-183-day", problems: "a1-de-not-tax-only-germany", dutiesAfter: "material-change-re-examine", institution: "no-hardcoded-dvka-as-eu-truth", boundaries: "ss-not-host-employment-law", freshness: SHARED_FRESHNESS, negatives: "a1-not-work-permit" } },
]);

export type ScenarioCoverage = "COVERED" | "EXPLICITLY_OUT_OF_SCOPE" | "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE";

type ScenarioSpec = Readonly<{
  id: string;
  label: string;
  coverage: ScenarioCoverage;
  requiredClaimKeys: readonly string[];
  requiredProcessKeys: readonly string[];
  note?: string;
}>;

export const EU_AL_SCENARIOS: readonly ScenarioSpec[] = Object.freeze([
  { id: "works-only-de-lives-sk", label: "Arbeitet nur DE, wohnt SK", coverage: "COVERED", requiredClaimKeys: ["art-11-employed-lex-loci-laboris", "residence-not-automatic-employment-legislation"], requiredProcessKeys: ["single-state-worker-classify"] },
  { id: "works-only-de-lives-cz", label: "Arbeitet nur DE, wohnt CZ", coverage: "COVERED", requiredClaimKeys: ["art-11-employed-lex-loci-laboris", "sk-cz-pl-hu-are-eu-member-corridors"], requiredProcessKeys: ["single-state-worker-classify"] },
  { id: "lives-de-works-only-pl", label: "Wohnt DE, arbeitet nur PL", coverage: "COVERED", requiredClaimKeys: ["art-11-employed-lex-loci-laboris", "residence-not-automatic-employment-legislation"], requiredProcessKeys: ["single-state-worker-classify"] },
  { id: "de-employer-sends-to-sk-3-months", label: "Deutscher Arbeitgeber entsendet nach SK für 3 Monate", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_ARTICLE_12_CLAIM_KEY, "german-employer-not-automatic-german-legislation"], requiredProcessKeys: ["employee-posting-art-12-1"] },
  { id: "posting-23-months", label: "Entsendung 23 Monate", coverage: "COVERED", requiredClaimKeys: ["art-12-1-24-months-not-automatic", EU_SHARED_ARTICLE_12_CLAIM_KEY], requiredProcessKeys: ["employee-posting-art-12-1"] },
  { id: "planned-posting-30-months", label: "Geplante Entsendung 30 Monate", coverage: "COVERED", requiredClaimKeys: ["posting-30-months-not-art-12", "posting-beyond-24-may-need-art-16"], requiredProcessKeys: ["article-16-exception-route"] },
  { id: "replaces-posted-worker", label: "Ersetzt zuvor entsandten Arbeitnehmer", coverage: "COVERED", requiredClaimKeys: ["replacement-prohibition", "replacement-fail-closed"], requiredProcessKeys: ["replacement-gate"] },
  { id: "letterbox-sending-state", label: "Arbeitgeber nur Briefkasten im Entsendestaat", coverage: "COVERED", requiredClaimKeys: ["letterbox-not-sending-employer", "registered-office-not-sufficient"], requiredProcessKeys: ["employer-normal-activity-gate"] },
  { id: "hired-specifically-before-posting", label: "Eigens vor der Entsendung eingestellt", coverage: "COVERED", requiredClaimKeys: ["newly-recruited-prior-coverage", "one-month-guidance-not-immutable-statute"], requiredProcessKeys: ["employer-normal-activity-gate"] },
  { id: "self-employed-de-to-sk", label: "Selbständig DE, vorübergehend SK", coverage: "COVERED", requiredClaimKeys: ["art-12-2-self-employed-posting", "foreign-customer-not-automatic-posting"], requiredProcessKeys: ["self-employed-posting-art-12-2"] },
  { id: "self-employed-different-activity-abroad", label: "Selbständig wechselt zu ganz anderer Tätigkeit im Ausland", coverage: "COVERED", requiredClaimKeys: ["different-activity-may-defeat", "similar-activity-required"], requiredProcessKeys: ["self-employed-posting-art-12-2"] },
  { id: "employee-works-de-and-sk-weekly", label: "Arbeitnehmer arbeitet jede Woche DE und SK", coverage: "COVERED", requiredClaimKeys: ["art-13-1-multi-state-habitual", "isolated-trip-not-multi-state"], requiredProcessKeys: ["multi-state-employed-classify"] },
  { id: "lives-sk-at-least-25-there", label: "Wohnt SK und leistet dort wenigstens 25 Prozent Arbeitszeit oder Entgelt", coverage: "COVERED", requiredClaimKeys: ["substantial-in-residence-residence-law", "lives-and-works-partly-not-automatic", "substantial-activity-indicator-25"], requiredProcessKeys: ["substantial-residence-activity-determine"] },
  { id: "lives-sk-under-25-there", label: "Wohnt SK und liegt dort bei Arbeitszeit und Entgelt unter 25 Prozent", coverage: "COVERED", requiredClaimKeys: ["employed-both-below-25-not-substantial", "less-than-25-not-always-employer-state"], requiredProcessKeys: ["substantial-residence-activity-determine"] },
  { id: "employed-sk-30-time-20-pay", label: "Wohnsitz SK, 30 Prozent Arbeitszeit, 20 Prozent Entgelt", coverage: "COVERED", requiredClaimKeys: ["employed-time-25-satisfies", "employed-and-or-not-cumulative-both"], requiredProcessKeys: ["substantial-residence-activity-determine"] },
  { id: "employed-sk-20-time-30-pay", label: "Wohnsitz SK, 20 Prozent Arbeitszeit, 30 Prozent Entgelt", coverage: "COVERED", requiredClaimKeys: ["employed-pay-25-satisfies", "employed-and-or-not-cumulative-both"], requiredProcessKeys: ["substantial-residence-activity-determine"] },
  { id: "employed-sk-24-time-24-pay", label: "Wohnsitz SK, 24 Prozent Arbeitszeit und 24 Prozent Entgelt", coverage: "COVERED", requiredClaimKeys: ["employed-both-below-25-not-substantial", "twenty-four-point-nine-not-automatic"], requiredProcessKeys: ["substantial-residence-activity-determine"] },
  { id: "employed-sk-22-time-strong-ties", label: "Wohnsitz SK, 22 Prozent Arbeitszeit, starke Bindungen an SK", coverage: "COVERED", requiredClaimKeys: ["personal-ties-do-not-replace-employed-25", "employed-other-criteria-cannot-compensate"], requiredProcessKeys: ["substantial-residence-activity-determine"] },
  { id: "one-month-40-projected-12-month-20", label: "Ein Monat 40 Prozent SK, Zwölfmonatsprognose 20 Prozent", coverage: "COVERED", requiredClaimKeys: ["one-historic-month-not-period", "twelve-month-projection-does-not-dilute-25"], requiredProcessKeys: ["substantial-residence-activity-determine"] },
  { id: "one-employer-in-de", label: "Ein Arbeitgeber in DE", coverage: "COVERED", requiredClaimKeys: ["one-employer-branch", "substantial-25-not-every-art-13-outcome"], requiredProcessKeys: ["multi-employer-art-13-branch"] },
  { id: "two-employers-same-state", label: "Zwei Arbeitgeber derselbe Staat", coverage: "COVERED", requiredClaimKeys: ["several-employers-same-state"], requiredProcessKeys: ["multi-employer-art-13-branch"] },
  { id: "two-employers-different-states", label: "Zwei Arbeitgeber verschiedene Staaten", coverage: "COVERED", requiredClaimKeys: ["several-employers-other-states-residence", "less-than-25-not-always-employer-state"], requiredProcessKeys: ["multi-employer-art-13-branch"] },
  { id: "employers-including-residence-state", label: "Arbeitgeber in verschiedenen Staaten einschließlich Wohnstaat", coverage: "COVERED", requiredClaimKeys: ["several-employers-incl-residence"], requiredProcessKeys: ["multi-employer-art-13-branch"] },
  { id: "self-employed-several-states", label: "Selbständig in mehreren Staaten", coverage: "COVERED", requiredClaimKeys: ["art-13-2-self-employed-multi-state", "centre-of-interest-fail-closed", "employed-self-employed-substantial-tests-distinct"], requiredProcessKeys: ["multi-state-self-employed-classify"] },
  { id: "employed-de-self-employed-sk", label: "Beschäftigt DE plus selbständig SK", coverage: "COVERED", requiredClaimKeys: ["art-13-3-employed-plus-self-employed", "self-employed-abroad-not-second-system"], requiredProcessKeys: ["employed-plus-self-employed-coordination"] },
  { id: "civil-servant-plus-private", label: "Beamter plus private Tätigkeit", coverage: "COVERED", requiredClaimKeys: ["art-13-4-civil-servant-mixed"], requiredProcessKeys: ["civil-servant-mixed-activity-boundary"] },
  { id: "marginal-side-activity", label: "Geringfügige Nebentätigkeit", coverage: "COVERED", requiredClaimKeys: ["marginal-activity-may-be-disregarded", "small-side-job-not-automatic-ignored"], requiredProcessKeys: ["marginal-activity-boundary"] },
  { id: "cross-border-home-office", label: "Grenzüberschreitendes Homeoffice", coverage: "COVERED", requiredClaimKeys: ["telework-may-be-multi-state", "home-office-not-automatic-employer-state-insurance"], requiredProcessKeys: ["cross-border-telework-boundary"] },
  { id: "habitual-telework-framework-possibility", label: "Mögliche Telearbeits-Rahmenvereinbarung", coverage: "COVERED", requiredClaimKeys: ["framework-agreement-is-art-16-not-art-13", "framework-not-assume-corridor-states"], requiredProcessKeys: ["article-16-exception-route"] },
  { id: "unknown-residence-classification", label: "Wohnstaatklassifikation unbekannt", coverage: "COVERED", requiredClaimKeys: ["missing-residence-fail-closed"], requiredProcessKeys: ["residence-institution-notification"] },
  { id: "unknown-work-percentages", label: "Tätigkeitsanteile unbekannt", coverage: "COVERED", requiredClaimKeys: ["missing-percentages-fail-closed", "substantial-activity-fail-closed"], requiredProcessKeys: ["substantial-residence-activity-determine"] },
  { id: "work-pattern-changes-after-a1", label: "Tätigkeitsmuster ändert sich nach A1", coverage: "COVERED", requiredClaimKeys: ["a1-not-permanently-frozen", "material-change-re-examine"], requiredProcessKeys: ["pd-a1-change-withdrawal"] },
  { id: "a1-requested-before-posting", label: "A1 vor Entsendung beantragt", coverage: "COVERED", requiredClaimKeys: ["a1-notify-in-advance-where-possible"], requiredProcessKeys: ["pd-a1-timing"] },
  { id: "a1-issued-after-activity-begins", label: "A1 nach Tätigkeitsbeginn ausgestellt", coverage: "COVERED", requiredClaimKeys: ["later-a1-not-automatically-invalid"], requiredProcessKeys: ["pd-a1-timing"] },
  { id: "host-inspector-questions-a1", label: "Aufnahmestaatprüfer stellt A1 in Frage", coverage: "COVERED", requiredClaimKeys: ["inspector-disagree-not-void", "a1-binding-while-valid"], requiredProcessKeys: ["institutional-disagreement-dialogue"] },
  { id: "user-thinks-a1-is-work-permit", label: "Nutzer hält A1 für Arbeitserlaubnis", coverage: "COVERED", requiredClaimKeys: ["a1-not-work-permit"], requiredProcessKeys: ["pd-a1-purpose-classification"] },
  { id: "user-thinks-a1-decides-tax", label: "Nutzer hält A1 für Steuerentscheidung", coverage: "COVERED", requiredClaimKeys: ["a1-not-tax-certificate", "a1-de-not-tax-only-germany"], requiredProcessKeys: ["tax-employment-immigration-boundary"] },
  { id: "user-thinks-a1-eliminates-host-labour-law", label: "Nutzer hält A1 für Befreiung vom Aufnahmearbeitsrecht", coverage: "COVERED", requiredClaimKeys: ["a1-not-host-labour-exemption", "ss-not-host-employment-law"], requiredProcessKeys: ["tax-employment-immigration-boundary"] },
  { id: "no-a1-claims-art-12-automatically", label: "Kein A1, behauptet automatisches Artikel 12", coverage: "COVERED", requiredClaimKeys: ["no-a1-not-automatic-art-12", "birello-cannot-choose-legislation"], requiredProcessKeys: ["employee-posting-art-12-1"] },
  { id: "institutions-disagree", label: "Träger uneinig", coverage: "COVERED", requiredClaimKeys: ["disagreement-not-coverage-gap", "disagreement-not-worker-choice"], requiredProcessKeys: ["institutional-disagreement-dialogue"] },
  { id: "person-wants-cheaper-state", label: "Person will günstigeren Sozialversicherungsstaat wählen", coverage: "COVERED", requiredClaimKeys: ["user-cannot-choose-cheaper-state", "residence-plus-work-not-choice"], requiredProcessKeys: ["residence-institution-notification"] },
  { id: "nationality-as-decision-basis", label: "Staatsangehörigkeit als Entscheidungsgrundlage", coverage: "COVERED", requiredClaimKeys: ["nationality-not-applicable-legislation", "slovak-national-working-only-de"], requiredProcessKeys: ["applicable-legislation-classify"] },
  { id: "uk-scenario", label: "UK-Szenario", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "UK ist v1 außerhalb dieses Kerns." },
  { id: "non-eu-bilateral-agreement", label: "Nicht-EU bilaterales Abkommen", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Bilaterale Drittstaatsabkommen außerhalb." },
  { id: "2026-proposed-reform-question", label: "Frage zur vorgeschlagenen 2026-Revision", coverage: "COVERED", requiredClaimKeys: ["pending-cod-2016-0397-not-current", "political-agreement-not-current-rule"], requiredProcessKeys: ["applicable-legislation-classify"] },
]);

export const EU_AL_NEGATIVE_CONTROLS = Object.freeze([
  "cross-border-work-not-multi-systems",
  "nationality-not-applicable-legislation",
  "residence-not-automatic-employment-legislation",
  "employer-registration-not-always-applicable",
  "german-employer-not-automatic-german-legislation",
  "temporary-abroad-not-automatic-posting",
  "art-12-1-24-months-not-automatic",
  "art-12-1-24-months-not-extension",
  "new-worker-not-new-24-month-period",
  "different-employer-not-replacement-impossible",
  "registered-office-not-sufficient",
  "self-employed-not-employee-posting",
  "foreign-customer-not-automatic-posting",
  "employed-25-not-optional-soft-guidance",
  "employed-both-below-25-not-substantial",
  "employed-other-criteria-cannot-compensate",
  "employed-and-or-not-cumulative-both",
  "twenty-four-point-nine-not-automatic",
  "one-historic-month-not-period",
  "less-than-25-not-always-employer-state",
  "substantial-25-not-every-art-13-outcome",
  "employed-self-employed-substantial-tests-distinct",
  "registration-not-centre",
  "remote-work-not-posting-automatically",
  "telework-may-be-multi-state",
  "art-16-not-user-entitlement",
  "a1-not-work-permit",
  "a1-not-visa",
  "a1-not-tax-certificate",
  "a1-not-ehic",
  "a1-not-s1",
  "a1-not-host-labour-exemption",
  "a1-not-posting-notification-exemption",
  "a1-not-permanently-frozen",
  "inspector-disagree-not-void",
  "birello-cannot-choose-legislation",
  "user-cannot-choose-cheaper-state",
  "disagreement-not-coverage-gap",
  "ss-not-tax-residence",
  "pending-cod-2016-0397-not-current",
] as const);

type Entity = Readonly<Record<string, unknown> & { key: string; id: string }>;

export type EuApplicableLegislationCorePack = Readonly<{
  schemaVersion: 1;
  packId: typeof EU_AL_PACK_ID;
  canonicalLanguage: "de";
  trustDomain: Readonly<{ key: string; id: string; code: "eu"; name: string }>;
  jurisdictions: readonly Entity[];
  territorialScopes: readonly Entity[];
  publishers: readonly Entity[];
  authorities: readonly Entity[];
  sources: readonly Entity[];
  sourceVersions: readonly Entity[];
  passages: readonly Entity[];
  claims: readonly Entity[];
  evidenceLinks: readonly Entity[];
  citations: readonly Entity[];
  processes: readonly Entity[];
  processClaimLinks: readonly Entity[];
  handlingPolicies: readonly Entity[];
  freshnessRecords: readonly Entity[];
}>;

export function evaluateEuAlProcessCompleteness(
  pack: EuApplicableLegislationCorePack,
) {
  const claimByKey = new Map(pack.claims.map((claim) => [String(claim.key), claim]));
  const processByKey = new Map(pack.processes.map((process) => [String(process.key), process]));
  const processComplete = EU_AL_PROCESSES.every((process) =>
    PROCESS_COMPLETE_DIMENSIONS.every((dimension) => {
      const claimKey = process.dimensions[dimension];
      const claim = claimByKey.get(claimKey);
      const stored = processByKey.get(process.key);
      return Boolean(claim && stored && pack.processClaimLinks.some((link) =>
        link.processId === stored.id && link.claimId === claim.id));
    }));
  const rows = EU_AL_SCENARIOS.map((scenario) => {
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
      claimByKey.has(key) && EU_AL_UNITS.some((unit) => unit.key === key));
    const processesPresent = scenario.requiredProcessKeys.every((key) => processByKey.has(key));
    const bound = scenario.requiredProcessKeys.every((processKey) => {
      const process = processByKey.get(processKey);
      return scenario.requiredClaimKeys.some((claimKey) => {
        const claim = claimByKey.get(claimKey);
        return Boolean(process && claim && pack.processClaimLinks.some((link) =>
          link.processId === process.id && link.claimId === claim.id));
      });
    });
    const covered = claimsPresent && processesPresent && bound && processComplete;
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
  const inScope = rows.length - outOfScopeScenarioCount;
  return Object.freeze({
    rows,
    processScenarioCount: rows.length,
    coveredScenarioCount,
    outOfScopeScenarioCount,
    blockedScenarioCount,
    processComplete,
    processCompletenessPercent: inScope === 0 ? 0 : Math.round((coveredScenarioCount / inScope) * 100),
  });
}

export function buildEuApplicableLegislationCorePack(): EuApplicableLegislationCorePack {
  const item = factory(EU_AL_PACK_ID);
  const trustDomain = item("trustDomain", "eu", { code: "eu" as const, name: "Europäische Union" });
  const jurisdiction = item("jurisdictions", "eu", {
    level: "eu" as const, code: "EU" as const, countryCode: "EU" as const, name: "Europäische Union",
  });
  const scope = item("territorialScopes", "eu", {
    type: "supranational",
    jurisdictionIds: [jurisdiction.id],
    landCodes: [], kreisCodes: [], municipalityCodes: [],
  });
  const publishers = {
    eurlex: item("publishers", "eu-publications-office", {
      name: "Amt für Veröffentlichungen der Europäischen Union",
      type: "eu_publication", territorialScopeId: scope.id, trustDomainId: trustDomain.id,
    }),
    commission: item("publishers", "european-commission", {
      name: "Europäische Kommission",
      type: "eu_institution", territorialScopeId: scope.id, trustDomainId: trustDomain.id,
    }),
    belgium: item("publishers", "belgium-fps-social-security", {
      name: "Föderaler Öffentlicher Dienst Soziale Sicherheit Belgien",
      type: "eu_depositary", territorialScopeId: scope.id, trustDomainId: trustDomain.id,
    }),
    cjeu: item("publishers", "court-of-justice", {
      name: "Gerichtshof der Europäischen Union",
      type: "eu_court", territorialScopeId: scope.id, trustDomainId: trustDomain.id,
    }),
  };
  const authorities = {
    eurlex: item("authorities", "eu-publications-office-authority", {
      publisherId: publishers.eurlex.id, name: "EUR-Lex", type: "eu_publication",
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      officialPortalUrl: "https://eur-lex.europa.eu",
    }),
    commission: item("authorities", "european-commission-ssc", {
      publisherId: publishers.commission.id, name: "Europäische Kommission soziale Sicherheit",
      type: "eu_coordination", jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      officialPortalUrl: "https://ec.europa.eu/social/main.jsp?catId=849&langId=de",
    }),
    belgium: item("authorities", "belgium-telework-depositary", {
      publisherId: publishers.belgium.id, name: "Belgischer Verwahrer der Telearbeits-Rahmenvereinbarung",
      type: "eu_depositary", jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      officialPortalUrl: "https://socialsecurity.belgium.be/en/internationally-active/cross-border-telework-eu-eea-and-switzerland",
    }),
    cjeu: item("authorities", "cjeu-authority", {
      publisherId: publishers.cjeu.id, name: "Gerichtshof der Europäischen Union",
      type: "eu_court", jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      officialPortalUrl: "https://curia.europa.eu",
    }),
  };
  const publisherOf = {
    eurlex: publishers.eurlex, commission: publishers.commission, belgium: publishers.belgium, cjeu: publishers.cjeu,
  };
  const authorityOf = {
    eurlex: authorities.eurlex, commission: authorities.commission, belgium: authorities.belgium, cjeu: authorities.cjeu,
  };

  const sources = EU_AL_OFFICIAL_SOURCES.map((spec) => {
    const publisher = publisherOf[spec.publisherKey];
    const authority = authorityOf[spec.publisherKey];
    const origin = `https://${spec.officialDomain}`;
    const source = item("sources", spec.key, {
      publisherId: publisher.id, authorityId: authority.id,
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      sourceType: spec.sourceType, purpose: spec.title, canonicalUrl: spec.url,
      officialDomain: spec.officialDomain, normalizedOrigin: origin,
      sourceClass: spec.sourceClass, authorityLevel: "EU",
      retrievalMethod: spec.retrievalMethod, handlingMode: spec.handlingMode,
      freshnessClass: spec.freshnessClass, staleBehavior: spec.staleBehavior,
      supportsClaimTypes: ["definition", "exception", "procedure", "boundary"],
      highRiskUseAllowed: false, publicationIdentifier: spec.title,
    });
    const version = item("sourceVersions", `${spec.key}:v1`, {
      sourceId: source.id, versionSequence: 1,
      contentHash: HASH(spec.passages.map((passage) => passage.text).join("\n")),
    });
    const passages = spec.passages.map((passage, order) => item("passages", passage.key, {
      sourceVersionId: version.id, order, headingPath: [spec.title],
      locator: passage.locator, text: passage.text, textHash: HASH(passage.text),
    }));
    const riskClass = spec.handlingMode === "DO_NOT_ANSWER_WITHOUT_CONTEXT" || spec.handlingMode === "STORE_CANONICALLY"
      ? (spec.handlingMode === "DO_NOT_ANSWER_WITHOUT_CONTEXT" ? "HIGH" : "MEDIUM")
      : "MEDIUM";
    const policy = item("handlingPolicies", `${spec.key}:policy`, {
      sourceId: source.id,
      informationClass: spec.informationClass,
      handlingMode: spec.handlingMode,
      freshnessClass: spec.freshnessClass,
      staleBehavior: spec.staleBehavior,
      requiredContextKeys: spec.requiredContextKeys,
      riskClass,
    });
    const freshness = item("freshnessRecords", `${spec.key}:freshness`, {
      entityType: "source", entityId: source.id, status: "fresh", effectiveDateKnown: true,
    });
    return { spec, source, version, passages, policy, freshness };
  });
  const passageByKey = new Map(sources.flatMap(({ passages }) => passages.map((passage) => [passage.key, passage])));
  const sourceByKey = new Map(sources.map((entry) => [entry.spec.key, entry]));

  const extraPolicies = [
    { sourceKey: "vo-987", informationClass: "ELIGIBILITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["RESIDENCE_STATE", "WORK_STATE", "PROCESS_VARIANT"] as const, riskClass: "HIGH" },
    { sourceKey: "cjeu-hakamp", informationClass: "REQUIRED_EVIDENCE" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["RESIDENCE_STATE", "WORK_STATE", "PROCESS_VARIANT"] as const, riskClass: "HIGH" },
    { sourceKey: "practical-guide", informationClass: "AUTHORITY_COMPETENCE" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["RESIDENCE_STATE", "WORK_STATE", "BUSINESS_ESTABLISHMENT_STATE"] as const, riskClass: "HIGH" },
    { sourceKey: "eessi-directory", informationClass: "CONTACT_DETAILS" as const, handlingMode: "FETCH_LIVE" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "REVALIDATE_BEFORE_USE" as const, requiredContextKeys: ["COUNTRY", "RESIDENCE_STATE"] as const, riskClass: "MEDIUM" },
  ].map((spec) => {
    const source = sourceByKey.get(spec.sourceKey);
    if (!source) throw new Error(`EU_AL_CONTEXT_POLICY_SOURCE_MISSING:${spec.sourceKey}`);
    return item("handlingPolicies", `${spec.sourceKey}:${spec.informationClass}:context`, {
      sourceId: source.source.id, informationClass: spec.informationClass, handlingMode: spec.handlingMode,
      freshnessClass: spec.freshnessClass, staleBehavior: spec.staleBehavior,
      requiredContextKeys: spec.requiredContextKeys, riskClass: spec.riskClass,
    });
  });

  const claims = EU_AL_UNITS.map((unit) => {
    const source = sourceByKey.get(unit.sourceKey);
    const passage = passageByKey.get(unit.passageKey);
    if (!source || !passage) throw new Error(`EU_AL_UNIT_SOURCE_MISSING:${unit.key}`);
    const claim = item("claims", unit.key, {
      type: unit.type, text: unit.text, jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id, authorityId: source.source.authorityId,
      riskLevel: unit.riskLevel, requiresEffectiveDate: false,
      requiresAuthorityResolution: unit.requiresAuthorityResolution === true,
      temporalClass: "CURRENT" as const, category: unit.category,
    });
    const evidence = item("evidenceLinks", `${unit.key}:evidence`, {
      claimId: claim.id, sourceVersionId: source.version.id, passageId: passage.id,
      role: "official_guidance", primary: true,
    });
    const citation = item("citations", `${unit.key}:citation`, {
      claimId: claim.id, sourceId: source.source.id, sourceVersionId: source.version.id,
      passageId: passage.id, publisherId: source.source.publisherId,
      jurisdictionId: jurisdiction.id, label: source.spec.title, canonicalUrl: source.spec.url,
    });
    const claimFreshness = item("freshnessRecords", `${unit.key}:freshness`, {
      entityType: "claim", entityId: claim.id, status: "fresh", effectiveDateKnown: false,
    });
    return { unit, claim, evidence, citation, claimFreshness };
  });

  const processes = EU_AL_PROCESSES.map((spec) => item("processes", spec.key, {
    processGroupId: EU_AL_PROCESS_GROUP, title: spec.title, jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id, riskLevel: spec.riskLevel, trigger: spec.trigger,
    safeFirstStep: spec.safeFirstStep, regionalVariationExpected: false,
  }));
  const processByKey = new Map(processes.map((process) => [String(process.key), process]));
  const claimByKey = new Map(claims.map(({ claim }) => [String(claim.key), claim]));
  const processClaimLinks = (() => {
    const links: Entity[] = [];
    const seen = new Set<string>();
    const addLink = (processKey: string, claimKey: string, role: string) => {
      const token = `${processKey}:${claimKey}`;
      if (seen.has(token)) return;
      const stored = processByKey.get(processKey);
      const claim = claimByKey.get(claimKey);
      if (!stored) throw new Error(`EU_AL_PROCESS_MISSING:${processKey}`);
      if (!claim) throw new Error(`EU_AL_PROCESS_CLAIM_MISSING:${processKey}:${claimKey}`);
      seen.add(token);
      links.push(item("processClaimLinks", `${processKey}:${claimKey}:${role}`, {
        processId: stored.id, claimId: claim.id, role, required: true,
        sequenceContext: role, qualificationRequired: false,
      }));
    };
    for (const process of EU_AL_PROCESSES) {
      for (const dimension of PROCESS_COMPLETE_DIMENSIONS) {
        addLink(process.key, process.dimensions[dimension], dimension);
      }
    }
    for (const scenario of EU_AL_SCENARIOS) {
      if (scenario.coverage !== "COVERED") continue;
      for (const processKey of scenario.requiredProcessKeys) {
        for (const claimKey of scenario.requiredClaimKeys) {
          addLink(processKey, claimKey, "scenario");
        }
      }
    }
    return links;
  })();

  return Object.freeze({
    schemaVersion: 1,
    packId: EU_AL_PACK_ID,
    canonicalLanguage: EU_AL_CANONICAL_LANGUAGE,
    trustDomain,
    jurisdictions: [jurisdiction],
    territorialScopes: [scope],
    publishers: [publishers.eurlex, publishers.commission, publishers.belgium, publishers.cjeu],
    authorities: [authorities.eurlex, authorities.commission, authorities.belgium, authorities.cjeu],
    sources: sources.map(({ source }) => source),
    sourceVersions: sources.map(({ version }) => version),
    passages: sources.flatMap(({ passages }) => passages),
    claims: claims.map(({ claim }) => claim),
    evidenceLinks: claims.map(({ evidence }) => evidence),
    citations: claims.map(({ citation }) => citation),
    processes,
    processClaimLinks,
    handlingPolicies: [...sources.map(({ policy }) => policy), ...extraPolicies],
    freshnessRecords: [
      ...sources.map(({ freshness }) => freshness),
      ...claims.map(({ claimFreshness }) => claimFreshness),
    ],
  });
}

export function validateEuApplicableLegislationCorePack(
  pack: EuApplicableLegislationCorePack,
) {
  const issues: string[] = [];
  if (pack.schemaVersion !== 1 || pack.packId !== EU_AL_PACK_ID) issues.push("EU_AL_IDENTITY_INVALID");
  if (pack.canonicalLanguage !== "de") issues.push("INVALID_CANONICAL_LANGUAGE");
  if (pack.trustDomain.code !== "eu") issues.push("EU_TRUST_DOMAIN_REQUIRED");
  for (const jurisdiction of pack.jurisdictions) {
    if (jurisdiction.level !== "eu" || jurisdiction.countryCode !== "EU") issues.push("EU_JURISDICTION_REQUIRED");
  }
  if (pack.claims.some((claim) => claim.temporalClass !== "CURRENT")) issues.push("NON_CURRENT_CLAIM");
  if (EU_AL_FUTURE_WATCH.some((item) => item.ingestible)) issues.push("WATCH_ITEM_MARKED_INGESTIBLE");
  const urls = pack.sources.map((source) => String(source.canonicalUrl));
  if (new Set(urls).size !== urls.length) issues.push("DUPLICATE_CANONICAL_URL");
  if (urls.some((url) => url.includes("#"))) issues.push("HASH_IN_CANONICAL_URL");
  const forbidden = /wikipedia|reddit|linkedin|kpmg|payroll|relocation|anwalt|kanzlei|forum/iu;
  if (urls.some((url) => forbidden.test(url))) issues.push("NON_AUTHORITATIVE_CANONICAL_URL");
  const completeness = evaluateEuAlProcessCompleteness(pack);
  if (completeness.blockedScenarioCount !== 0) issues.push("BLOCKED_SCENARIOS");
  if (completeness.processCompletenessPercent !== 100) issues.push("PROCESS_INCOMPLETE");
  if (!EU_AL_NEGATIVE_CONTROLS.every((key) => pack.claims.some((claim) => claim.key === key))) {
    issues.push("MISSING_NEGATIVE_CONTROL");
  }
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    authoringUsesKeysNotDatabaseUuids: true,
    productionEligible: false,
  });
}

export function euAlPackSummary(pack: EuApplicableLegislationCorePack = buildEuApplicableLegislationCorePack()) {
  const completeness = evaluateEuAlProcessCompleteness(pack);
  return Object.freeze({
    packId: pack.packId,
    canonicalLanguage: pack.canonicalLanguage,
    claimCount: pack.claims.length,
    legacyCount: 0,
    futureCount: EU_AL_FUTURE_WATCH.length,
    proposedNotCurrentCount: EU_AL_FUTURE_WATCH.filter((item) => item.temporalClass === "PROPOSED_NOT_CURRENT").length,
    sourceCount: pack.sources.length,
    processCount: pack.processes.length,
    processClaimLinkCount: pack.processClaimLinks.length,
    processScenarioCount: completeness.processScenarioCount,
    coveredScenarioCount: completeness.coveredScenarioCount,
    outOfScopeScenarioCount: completeness.outOfScopeScenarioCount,
    blockedScenarioCount: completeness.blockedScenarioCount,
    processCompletenessPercent: completeness.processCompletenessPercent,
    sharedArticle12ClaimKey: EU_SHARED_ARTICLE_12_CLAIM_KEY,
    sharedArticle12ClaimId: pack.claims.find((claim) => claim.key === EU_SHARED_ARTICLE_12_CLAIM_KEY)?.id ?? null,
  });
}
