/**
 * CB-0G — Shared EU family-benefits coordination / Article 67–69 core.
 * Stored once for later DE↔SK / DE↔CZ / DE↔PL / DE↔HU family connectors.
 * Coordinates existing or potential national rights. Does not invent entitlement.
 * Canonical language de; source jurisdiction EU.
 */
import { createHash } from "node:crypto";

import { COD_2016_0397_STATUS } from "../../../source-registry/cross-border-connector-contracts";
import { stableKnowledgeFactoryId } from "../../../source-registry/knowledge-factory-contracts";
import { PROCESS_COMPLETE_DIMENSIONS } from "../applicable-legislation/eu-applicable-legislation-core-pack";

export const EU_FAMILY_PACK_ID = "eu_family_benefits_coordination" as const;
export const EU_FAMILY_CANONICAL_LANGUAGE = "de" as const;
export const EU_FAMILY_TRUST_DOMAIN = "eu" as const;
export const EU_FAMILY_PROCESS_GROUP = "eu_family_benefits_coordination" as const;
export const EU_SHARED_ART1Z_CLAIM_KEY = "art-1z-family-benefit" as const;
export const EU_SHARED_ART67_CLAIM_KEY = "art-67-family-residing-elsewhere" as const;
export const EU_SHARED_ART68_CLAIM_KEY = "art-68-priority-rules" as const;
export const EU_SHARED_ART682_CLAIM_KEY = "art-68-2-differential-supplement" as const;
export const EU_SHARED_ART69_CLAIM_KEY = "art-69-orphan-special" as const;
export const EU_SHARED_ART60_CLAIM_KEY = "art-60-whole-family-fiction" as const;
export const EU_SHARED_F3_CLAIM_KEY = "decision-f3-per-family-member-comparison" as const;

const HASH = (value: string): string => createHash("sha256").update(value).digest("hex");
type Entity = Readonly<Record<string, unknown> & { key: string; id: string }>;
type FactoryItem = <T extends Readonly<Record<string, unknown>>>(
  entityClass: string, key: string, values: T,
) => Readonly<{ key: string; id: string } & T>;

function factory(packId: string): FactoryItem {
  return (entityClass, key, values) => Object.freeze({
    key, id: stableKnowledgeFactoryId(packId, entityClass, key), ...values,
  });
}

export const GERMAN_KINDERGELD_PACK_BOUNDARY = Object.freeze([
  {
    pack: "familienkasse_kindergeld",
    keys: [
      "eligible-person-residence-or-unlimited-tax",
      "claimant-tax-id-required",
      "non-free-movement-residence-title",
    ],
    note: "German Kindergeld eligibility, child definitions, amounts and Familienkasse process remain the national core. CB-0G stores EU coordination only.",
  },
] as const);

export const GERMAN_ELTERNGELD_PACK_BOUNDARY = Object.freeze([
  {
    pack: "elterngeld",
    keys: [
      "german-residence-not-always-primary",
      "two-states-not-double-full",
      "eu-not-automatic-primary",
      "foreign-benefit-not-auto-exclusion",
    ],
    note: "BEEG merits, amounts, Lebensmonate and Elterngeldstelle routing remain the national core. Current Elterngeld coordination uses 883/987, not 2016/0397.",
  },
] as const);

export const EU_FAMILY_FUTURE_WATCH = Object.freeze([
  {
    key: "cod-2016-0397-family-revision",
    temporalClass: COD_2016_0397_STATUS,
    text: "Das Gesetzgebungsverfahren 2016/0397(COD) hat am 7. Juli 2026 die erste Lesung des Europäischen Parlaments (T10-0239/2026) erreicht und wartet auf den Standpunkt des Rates in erster Lesung. Es bleibt vorgeschlagene, nicht geltende Revision.",
    ingestible: false,
  },
  {
    key: "cod-2016-0397-child-raising-personal-right",
    temporalClass: COD_2016_0397_STATUS,
    text: "Der Parlaments-Erstlesungstext 2026 enthält Vorschläge zu Familienleistungen, die Einkommen während der Kindererziehung ersetzen sollen, einschließlich persönlicher Rechte, eines vorgesehenen Anhangs XIII und einer möglichen Abweichung von Artikel 68. Diese Konzepte sind nicht geltendes Recht.",
    ingestible: false,
  },
] as const);

export type EuFamilyCaseFacts = Readonly<{
  primaryBenefitState?: string | null;
  secondaryBenefitState?: string | null;
  childResidenceKnown?: boolean | null;
  secondParentActivityKnown?: boolean | null;
  overlapSamePeriod?: boolean | null;
  overlapSameFamilyMember?: boolean | null;
  entitlementBasis?: "ACTIVITY" | "PENSION" | "RESIDENCE" | "UNCLEAR" | null;
  nationalEntitlementVerified?: boolean | null;
  amountKnown?: boolean | null;
  applicantIsBeneficiary?: boolean | null;
}>;

export function detectMissingFamilyFacts(facts: EuFamilyCaseFacts): readonly string[] {
  const missing: string[] = [];
  if (facts.childResidenceKnown !== true) missing.push("childResidence");
  if (facts.secondParentActivityKnown !== true) missing.push("secondParentActivity");
  if (facts.nationalEntitlementVerified !== true) missing.push("nationalEntitlement");
  if (facts.entitlementBasis == null || facts.entitlementBasis === "UNCLEAR") {
    missing.push("entitlementBasis");
  }
  if (facts.amountKnown !== true) missing.push("exactAmount");
  if (facts.applicantIsBeneficiary == null) missing.push("applicantVsBeneficiary");
  return Object.freeze(missing);
}

type SourceSpec = Readonly<{
  key: string;
  publisherKey: "eurlex" | "commission" | "oeil";
  url: string;
  officialDomain: string;
  title: string;
  sourceClass: "EU_LAW" | "EU_OFFICIAL_GUIDANCE";
  sourceType: string;
  retrievalMethod: "HTML_DOCUMENT";
  informationClass: "LEGAL_BASELINE" | "PROCESS_IDENTITY" | "AUTHORITY_COMPETENCE" | "ELIGIBILITY" | "CONTACT_DETAILS";
  handlingMode: "STORE_CANONICALLY" | "CACHE_AND_REVALIDATE" | "FETCH_LIVE" | "DO_NOT_ANSWER_WITHOUT_CONTEXT";
  freshnessClass: "LEGAL_CHANGE_MONITORED" | "EVENT_DRIVEN";
  staleBehavior: "DO_NOT_USE_STALE" | "REVALIDATE_BEFORE_USE";
  passages: readonly Readonly<{ key: string; locator: string; text: string }>[];
}>;

export const EU_FAMILY_OFFICIAL_SOURCES: readonly SourceSpec[] = Object.freeze([
  {
    key: "vo-883-family",
    publisherKey: "eurlex",
    url: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:02004R0883-20190731",
    officialDomain: "eur-lex.europa.eu",
    title: "Verordnung (EG) Nr. 883/2004 konsolidiert 31.07.2019 Titel III Kapitel 8 Familienleistungen",
    sourceClass: "EU_LAW",
    sourceType: "eu_regulation",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    passages: [
      { key: "vo-883-fb-art-1z", locator: "Art. 1 Buchst. z", text: "Familienleistungen sind alle Sach- oder Geldleistungen zum Ausgleich von Familienlasten, mit Ausnahme von Unterhaltsvorschüssen und von in Anhang I aufgeführten besonderen Geburts- und Adoptionsbeihilfen. Die nationale Bezeichnung mit Kind, Familie, Eltern oder Geburt ersetzt diese unionsrechtliche Klassifikation nicht." },
      { key: "vo-883-fb-art-3", locator: "Art. 3 Abs. 1 Buchst. j", text: "Die Verordnung gilt für Familienleistungen als Zweig der sozialen Sicherheit. Sozialhilfe und steuerliche Vorteile sind nicht automatisch Familienleistungen im Sinne des Artikels 1 Buchstabe z." },
      { key: "vo-883-fb-art-67", locator: "Art. 67", text: "Eine Person hat Anspruch auf Familienleistungen nach den Rechtsvorschriften des zuständigen Mitgliedstaats auch für Familienangehörige, die in einem anderen Mitgliedstaat wohnen, als wohnten sie im zuständigen Mitgliedstaat. Ein Rentenbezieher hat Anspruch nach den Rechtsvorschriften des für seine Rente zuständigen Mitgliedstaats. Die Fiktion ersetzt nicht die nationalen Anspruchsvoraussetzungen." },
      { key: "vo-883-fb-art-68", locator: "Art. 68", text: "Bestehen für denselben Zeitraum und dieselben Familienangehörigen Ansprüche nach den Rechtsvorschriften mehrerer Mitgliedstaaten, gilt bei unterschiedlichen Grundlagen zuerst die Erwerbstätigkeit, dann die Rente, dann der Wohnsitz. Erwerbstätigkeit umfasst Rechte aufgrund einer Beschäftigung oder selbständigen Tätigkeit gleichrangig; Beschäftigung überragt Selbständigkeit nicht und Selbständigkeit überragt Beschäftigung nicht. Selbständigkeit ist nicht automatisch eine Wohnsitzgrundlage. Selbständigkeit in einem Staat begründet nicht automatisch ein nationales Familienleistungsrecht dieses Staats. Eine Person mit Beschäftigung und Selbständigkeit begründet nicht automatisch zwei mitgliedstaatliche ACTIVITY-Rechte. Mehrere Betriebe, Gewerberegistrierung, Steuerwohnsitz oder Gesellschaftsstellung ersetzen nicht die rechtliche Anspruchsgrundlage. Nullumsatz bedeutet nicht automatisch das Ende der Tätigkeit; ruhende Registrierung ist nicht verifizierte aktuelle Tätigkeit. Betriebsschließung beendet Familienleistungen nicht automatisch. Nationale Mischeinkünfte für Elterngeld sind nicht zwei Artikel-68-Staatenrechte. Bei gleicher Grundlage entscheidet der Wohnort der Kinder, sofern dort die betreffende Grundlage besteht; andernfalls gelten die weiteren Kriterien einschließlich des höchsten Betrags mit Kostenteilung. Nachrangige Ansprüche ruhen bis zur Höhe der vorrangigen Leistung; ein Unterschiedsbetrag kann geschuldet sein, nicht jedoch zwingend bei nur wohnsitzbasiertem nachrangigem Anspruch für in einem anderen Mitgliedstaat wohnende Kinder. Ein bei einem nicht vorrangigen Träger gestellter Antrag ist unverzüglich weiterzuleiten; das ursprüngliche Antragsdatum bleibt erhalten." },
      { key: "vo-883-fb-art-69", locator: "Art. 69", text: "Besteht nach den durch die Artikel 67 und 68 bestimmten Rechtsvorschriften kein Anspruch auf zusätzliche oder besondere Familienleistungen für Waisen, werden diese hilfsweise nach den Rechtsvorschriften des Mitgliedstaats gezahlt, dem der verstorbene Arbeitnehmer am längsten unterlag, soweit dort ein Anspruch erworben wurde; andernfalls in absteigender Dauer der Versicherungs- oder Wohnzeiten." },
      { key: "vo-883-fb-annex-i", locator: "Anhang I", text: "Anhang I listet Unterhaltsvorschüsse und besondere Geburts- und Adoptionsbeihilfen, die vom Familienleistungsbegriff des Artikels 1 Buchstabe z ausgenommen sind. Für Deutschland ist der Unterhaltsvorschuss nach dem Unterhaltsvorschussgesetz aufgeführt. Die Ländereinträge sind vor Gebrauch zu revalidieren und begründen keine Klassifikation anderer nationaler Leistungen." },
    ],
  },
  {
    key: "vo-987-family",
    publisherKey: "eurlex",
    url: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:02009R0987-20190731",
    officialDomain: "eur-lex.europa.eu",
    title: "Verordnung (EG) Nr. 987/2009 konsolidiert 31.07.2019 Familienleistungen Artikel 58 bis 61",
    sourceClass: "EU_LAW",
    sourceType: "eu_regulation",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    passages: [
      { key: "vo-987-fb-art-6", locator: "Art. 6", text: "Bei Meinungsverschiedenheiten der Träger über die vorläufig anzuwendenden Rechtsvorschriften bleibt die Person nicht ohne Schutz. Die vorläufige Zahlung ist nicht die endgültige Vorrangbestimmung. Die Familie wählt den Staat nicht." },
      { key: "vo-987-fb-art-58", locator: "Art. 58", text: "Können bei gleicher Grundlage nach Artikel 68 Absatz 1 Buchstabe b Ziffern i und ii die vorrangigen Rechtsvorschriften nicht nach dem Wohnort der Kinder bestimmt werden, berechnet jeder betroffene Träger den Betrag nach seinem Recht. Der Träger mit dem höchsten Betrag zahlt den vollen Betrag; die anderen Träger erstatten ihm anteilig. Die Familie muss die Hälften nicht selbst bei jedem Staat eintreiben. Artikel 58 gilt nicht, wenn der Vorrang bereits nach Kind Wohnort und Tätigkeit feststeht." },
      { key: "vo-987-fb-art-59", locator: "Art. 59", text: "Wechseln die anwendbaren Rechtsvorschriften oder die Familienleistungskompetenz im Laufe eines Kalendermonats, zahlt der zu Beginn des Monats leistende Träger bis zum Monatsende weiter. Der andere Staat übernimmt anschließend. Ein untertägiger oder tagesweiser Schnitt folgt daraus nicht automatisch." },
      { key: "vo-987-fb-art-60", locator: "Art. 60", text: "Für die Artikel 67 und 68 ist die Lage der gesamten Familie so zu berücksichtigen, als unterlägen alle beteiligten Personen den Rechtsvorschriften des betreffenden Mitgliedstaats und wohnten dort, insbesondere für das Antragsrecht. Der vorrangige Träger leistet nach seinem Recht und leitet mögliche nachrangige Differenzansprüche weiter. Der nicht vorrangige Träger trifft unverzüglich eine vorläufige Vorrangentscheidung und leitet den Antrag weiter; der andere Träger hat zwei Monate Zeit zur Stellungnahme. Schweigen lässt die vorläufige Entscheidung gelten. Bei Uneinigkeit gilt Artikel 6; maßgeblicher Wohnortträger ist der Träger am Wohnort des Kindes. Vorläufig zu viel Geleistetes kann zwischen Trägern nach Artikel 73 ausgeglichen werden." },
      { key: "vo-987-fb-art-61", locator: "Art. 61", text: "Artikel 61 der Verordnung 987/2009 führt die besonderen Waisenfamilienleistungen nach Artikel 69 der Grundverordnung durch. Nationale Waisenleistungstatbestände werden hier nicht aufgebaut." },
      { key: "vo-987-fb-art-73", locator: "Art. 73", text: "Vorläufig zu viel gezahlte Leistungen können zwischen den Trägern erstattet werden. Das begründet nicht automatisch, dass die Familie alles sofort zurückzahlen muss; Rückforderung richtet sich nach endgültigen Entscheidungen, nationalem Verfahren und Trägerausgleich." },
    ],
  },
  {
    key: "cjeu-trapkowski",
    publisherKey: "eurlex",
    url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:62014CJ0378",
    officialDomain: "eur-lex.europa.eu",
    title: "EuGH C-378/14 Trapkowski",
    sourceClass: "EU_LAW",
    sourceType: "cjeu_judgment",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    passages: [
      { key: "cjeu-trapkowski-text", locator: "C-378/14", text: "Übt die gewöhnlich antragsberechtigte Person das Recht nicht aus, ist ein Antrag des anderen Elternteils, einer als Elternteil behandelten Person oder einer für das Kind handelnden Person oder Einrichtung zu berücksichtigen. Wer antragsbefugt ist, ist nicht automatisch die nach nationalem Recht leistungsberechtigte Empfangsperson. Das Unionsrecht bestimmt den Zahlungsempfänger nicht universell." },
    ],
  },
  {
    key: "cjeu-moser",
    publisherKey: "eurlex",
    url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:62018CJ0032",
    officialDomain: "eur-lex.europa.eu",
    title: "EuGH C-32/18 Moser",
    sourceClass: "EU_LAW",
    sourceType: "cjeu_judgment",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    passages: [
      { key: "cjeu-moser-text", locator: "C-32/18", text: "Die Fiktion der gesamten Familie nach Artikel 60 Absatz 1 der Verordnung 987/2009 gilt auch für die Bestimmung des Anspruchs nach den nachrangigen Rechtsvorschriften. Nur den erwerbstätigen Elternteil zu betrachten reicht nicht. Fallbezogene Einkommensberechnungsregeln aus Moser zu Elterngeld und österreichischem Kinderbetreuungsgeld sind nicht auf jede Familienleistung zu verallgemeinern." },
    ],
  },
  {
    key: "commission-family-benefits",
    publisherKey: "commission",
    url: "https://ec.europa.eu/social/main.jsp?catId=863&langId=de",
    officialDomain: "ec.europa.eu",
    title: "Europäische Kommission: Koordinierung der sozialen Sicherheit Familienleistungen",
    sourceClass: "EU_OFFICIAL_GUIDANCE",
    sourceType: "official_guidance",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    passages: [
      { key: "commission-family-text", locator: "Familienleistungen", text: "Die Kommission erläutert die Koordinierung von Familienleistungen nach den geltenden Verordnungen 883/2004 und 987/2009, einschließlich Vorrang, Unterschiedsbetrag und Verfahren zwischen den Trägern. Operative Hinweise sind vor Gebrauch zu revalidieren und ersetzen nicht den Verordnungstext." },
    ],
  },
  {
    key: "oeil-cod-2016-0397-family",
    publisherKey: "oeil",
    url: "https://oeil.europarl.europa.eu/oeil/en/procedure-file?reference=2016/0397(COD)",
    officialDomain: "oeil.europarl.europa.eu",
    title: "Legislativverfahren 2016/0397(COD) Stand nach der Parlamentserstlesung 2026",
    sourceClass: "EU_OFFICIAL_GUIDANCE",
    sourceType: "official_guidance",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    passages: [
      { key: "oeil-cod-family-text", locator: "2016/0397(COD)", text: "Nach der ersten Lesung des Europäischen Parlaments am 7. Juli 2026 bleibt das Verfahren 2016/0397(COD) im Stadium der erwarteten Ratsposition. Vorgeschlagene Sonderregeln für einkommensersetzende Kindererziehungsleistungen sind nicht geltendes Familienleistungsrecht." },
    ],
  },
  {
    key: "family-institution-directory",
    publisherKey: "commission",
    url: "https://employment-social-affairs.ec.europa.eu/policies-and-activities/moving-working-europe/eu-social-security-coordination/family-benefits_en",
    officialDomain: "employment-social-affairs.ec.europa.eu",
    title: "Europäische Kommission: Familienleistungen Kontakt und aktuelle nationale Beträge",
    sourceClass: "EU_OFFICIAL_GUIDANCE",
    sourceType: "official_directory",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "CONTACT_DETAILS",
    handlingMode: "FETCH_LIVE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    passages: [
      { key: "family-institution-directory-text", locator: "Institution directory", text: "Zuständige Familienleistungsträger, aktuelle Antragswege und geltende nationale Beträge sind live bei den nationalen Stellen zu ermitteln. Dieser EU-Kern speichert keine Euro-Beträge und kein allgemeines Umrechnungsmodell." },
    ],
  },
  {
    key: "decision-f3-family",
    publisherKey: "eurlex",
    url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32019D0626(01)",
    officialDomain: "eur-lex.europa.eu",
    title: "Beschluss Nr. F3 der Verwaltungskommission vom 19. Dezember 2018 zur Auslegung des Artikels 68",
    sourceClass: "EU_LAW",
    sourceType: "eu_decision",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    passages: [
      { key: "decision-f3-family-text", locator: "Beschluss F3", text: "Beschluss Nr. F3 der Verwaltungskommission vom 19. Dezember 2018 betrifft die Auslegung des Artikels 68 der Verordnung 883/2004 und die Methode zur Berechnung des Unterschiedsbetrags. Er gilt ab dem 16. Juli 2019 und ist geltendes Auslegungsrecht. Der nachrangige Träger vergleicht für jedes Familienmitglied den Betrag der nach den vorrangigen Rechtsvorschriften gewährten Familienleistungen mit dem Betrag nach den nachrangigen Rechtsvorschriften und zahlt gegebenenfalls den Unterschied. Der Vergleich ist kein universelles Paar zweier Leistungsnamen und erlaubt nicht zwei volle Leistungen für denselben Zeitraum und dieselbe Person." },
    ],
  },
]);

type Unit = Readonly<{
  key: string;
  category: string;
  type: "definition" | "exception" | "procedure" | "boundary";
  text: string;
  sourceKey: string;
  passageKey: string;
  riskLevel: "medium" | "high";
  requiresAuthorityResolution?: true;
}>;

export const EU_FAMILY_UNITS: readonly Unit[] = Object.freeze([
  { key: "fb-eu-coordination-not-national-entitlement", category: "principle", type: "boundary", text: "Die unionsrechtliche Koordinierung der Familienleistungen schafft keinen nationalen Anspruch, wo die nationalen Voraussetzungen nicht erfüllt sind.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-67", riskLevel: "high" },
  { key: "current-883-987-family-baseline", category: "principle", type: "definition", text: "Geltende Grundlage der unionsrechtlichen Familienleistungskoordinierung sind die aktuellen Verordnungen 883/2004 und 987/2009.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "pending-cod-2016-0397-family-not-current", category: "principle", type: "exception", text: "Das Verfahren 2016/0397(COD) ist nach der Parlamentserstlesung vom 7. Juli 2026 weiterhin vorgeschlagene, nicht geltende Revision und wird nicht als aktuelles Familienleistungsrecht gespeichert.", sourceKey: "oeil-cod-2016-0397-family", passageKey: "oeil-cod-family-text", riskLevel: "high" },
  { key: "proposed-child-raising-category-not-current", category: "principle", type: "exception", text: "Vorgeschlagene Sonderregeln für einkommensersetzende Kindererziehungsleistungen, persönliche Rechte, Anhang XIII oder eine Abweichung von Artikel 68 sind nicht geltendes Elterngeld- oder Familienleistungsrecht.", sourceKey: "oeil-cod-2016-0397-family", passageKey: "oeil-cod-family-text", riskLevel: "high" },
  { key: "fb-source-eu-not-national-competence", category: "principle", type: "boundary", text: "Quellenjurisdiktion EU ist nicht dasselbe wie ein nationaler Familienleistungsstaat DE oder SK.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-applicable-legislation-not-automatic-primary", category: "principle", type: "exception", text: "Der nach Titel II zuständige Sozialversicherungsstaat ist nicht automatisch der vorrangige Familienleistungsstaat nach Artikel 68.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-nationality-not-priority", category: "principle", type: "exception", text: "Die Staatsangehörigkeit bestimmt den vorrangigen Familienleistungsstaat nicht.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-user-locale-not-priority", category: "principle", type: "exception", text: "Die Ausgabesprache oder Nutzeroberfläche wählt weder den vorrangigen noch den nachrangigen Familienleistungsstaat.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },

  { key: EU_SHARED_ART1Z_CLAIM_KEY, category: "classification", type: "definition", text: "Familienleistungen nach Artikel 1 Buchstabe z der Verordnung 883/2004 sind Sach- oder Geldleistungen zum Ausgleich von Familienlasten, ausgenommen Unterhaltsvorschüsse und in Anhang I aufgeführte besondere Geburts- und Adoptionsbeihilfen.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-1z", riskLevel: "high" },
  { key: "fb-name-not-automatic-family-benefit", category: "classification", type: "exception", text: "Ein Leistungsname mit Kind, Familie, Eltern oder Geburt macht die Leistung nicht automatisch zur Familienleistung nach Artikel 1 Buchstabe z.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-1z", riskLevel: "high" },
  { key: "fb-social-assistance-not-automatic-family-benefit", category: "classification", type: "exception", text: "Sozialhilfe ist nicht automatisch eine koordinierte Familienleistung.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-3", riskLevel: "high" },
  { key: "fb-tax-advantage-not-automatic-family-benefit", category: "classification", type: "exception", text: "Ein steuerlicher Vorteil ist nicht automatisch eine koordinierte Familienleistung.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-3", riskLevel: "high" },
  { key: "fb-class-family-benefit-current", category: "classification", type: "definition", text: "FAMILY_BENEFIT_CURRENT bedeutet: die nationale Leistung ist nach Zweck, Voraussetzungen und unionsrechtlicher Quelle derzeit als Familienleistung im Sinne des Artikels 1 Buchstabe z einzuordnen, nicht nach dem bloßen Leistungsnamen.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-1z", riskLevel: "high" },
  { key: "fb-class-excluded-annex-i", category: "classification", type: "exception", text: "EXCLUDED_ANNEX_I bedeutet: die Leistung ist als Unterhaltsvorschuss oder besondere Geburts- oder Adoptionsbeihilfe in Anhang I aufgeführt und fällt nicht unter die Koordinierung der Artikel 67 und 68.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-annex-i", riskLevel: "high" },
  { key: "fb-class-other-social-security", category: "classification", type: "boundary", text: "OTHER_SOCIAL_SECURITY_BRANCH bedeutet: die Leistung kann einem anderen Zweig der sozialen Sicherheit unterfallen und ist dann nicht nach den Familienleistungsregeln der Artikel 67 und 68 zu koordinieren.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-3", riskLevel: "high" },
  { key: "fb-class-social-assistance-or-other", category: "classification", type: "boundary", text: "SOCIAL_ASSISTANCE_OR_OTHER bedeutet: die Leistung ist nicht ohne weitere Prüfung eine Familienleistung nach Artikel 1 Buchstabe z.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-3", riskLevel: "high" },
  { key: "fb-class-requires-authority", category: "classification", type: "procedure", text: "CLASSIFICATION_REQUIRES_AUTHORITY bedeutet: Zweck, gesetzliche Voraussetzungen und unionsrechtliche Quelle reichen ohne Träger- oder Rechtsprechungsklärung nicht für eine sichere Einordnung.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-1z", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "fb-class-proposed-future", category: "classification", type: "exception", text: "PROPOSED_FUTURE_CLASSIFICATION bedeutet: eine vorgeschlagene künftige Einordnung, insbesondere aus 2016/0397(COD), ist nicht geltendes Recht.", sourceKey: "oeil-cod-2016-0397-family", passageKey: "oeil-cod-family-text", riskLevel: "high" },
  { key: "fb-no-keyword-classifier", category: "classification", type: "exception", text: "Es gibt keinen universellen Namens- oder Stichwortklassifikator für Familienleistungen. Maßgeblich sind Zweck, gesetzliche Voraussetzungen und unionsrechtliche Quelle.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-1z", riskLevel: "high" },

  { key: "fb-annex-i-exclusions", category: "annex", type: "definition", text: "Anhang I nimmt Unterhaltsvorschüsse und besondere Geburts- und Adoptionsbeihilfen vom Familienleistungsbegriff des Artikels 1 Buchstabe z aus.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-annex-i", riskLevel: "high" },
  { key: "fb-unterhaltsvorschuss-annex-i", category: "annex", type: "exception", text: "Der deutsche Unterhaltsvorschuss nach dem Unterhaltsvorschussgesetz ist in Anhang I aufgeführt und daher keine nach Artikel 67 und 68 koordinierte Familienleistung.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-annex-i", riskLevel: "high" },
  { key: "fb-special-childbirth-annex-i", category: "annex", type: "exception", text: "Eine in Anhang I aufgeführte besondere Geburts- oder Adoptionsbeihilfe ist keine nach Artikel 67 und 68 koordinierte Familienleistung.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-annex-i", riskLevel: "high" },
  { key: "fb-annex-i-must-revalidate", category: "annex", type: "procedure", text: "Die Ländereinträge des Anhangs I sind vor einer konkreten Auskunft zu revalidieren. Eine veraltete Länderliste ohne Frischemetadaten darf nicht festgeschrieben werden.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-annex-i", riskLevel: "high" },
  { key: "fb-annex-i-not-other-national-classifications", category: "annex", type: "boundary", text: "Die Nennung des Unterhaltsvorschusses in Anhang I erlaubt keine Schlussfolgerung auf die Einordnung anderer deutscher oder slowakischer Familienleistungen.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-annex-i", riskLevel: "high" },

  { key: EU_SHARED_ART67_CLAIM_KEY, category: "article67", type: "definition", text: "Nach Artikel 67 hat eine nach den Rechtsvorschriften des zuständigen Mitgliedstaats berechtigte Person Anspruch auf Familienleistungen auch für in einem anderen Mitgliedstaat wohnende Familienangehörige, als wohnten diese im zuständigen Mitgliedstaat.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-67", riskLevel: "high" },
  { key: "fb-art-67-pensioner-rule-distinct", category: "article67", type: "definition", text: "Für Rentenbezieher bestimmt Artikel 67 gesondert die Rechtsvorschriften des für die Rente zuständigen Mitgliedstaats. Diese Rentenregel ist von der allgemeinen Familienangehörigenfiktion zu trennen.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-67", riskLevel: "high" },
  { key: "fb-child-abroad-not-automatic-loss", category: "article67", type: "exception", text: "Wohnen des Kindes in der Slowakei bedeutet nicht automatisch den Wegfall eines deutschen Familienleistungsanspruchs.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-67", riskLevel: "high" },
  { key: "fb-family-abroad-not-automatic-entitlement", category: "article67", type: "exception", text: "Wohnen der Familie im Ausland begründet nicht automatisch einen Familienleistungsanspruch.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-67", riskLevel: "high" },
  { key: "fb-art-67-fiction-not-national-conditions", category: "article67", type: "exception", text: "Die Artikel-67-Fiktion ersetzt nicht nationale Voraussetzungen wie Kindeseigenschaft, Alter, Verwandtschaft, Antragsberechtigung und Leistungsbetrag.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-67", riskLevel: "high" },
  { key: "fb-child-need-not-live-in-employment-state", category: "article67", type: "exception", text: "Das Kind muss für den unionsrechtlichen Familienleistungsanspruch nicht im Beschäftigungsstaat wohnen. Artikel 67 räumt das Wohnsitzerfordernis aus, soweit die nationalen Voraussetzungen im Übrigen erfüllt sind.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-67", riskLevel: "high" },

  { key: EU_SHARED_ART60_CLAIM_KEY, category: "article60", type: "definition", text: "Nach Artikel 60 Absatz 1 der Verordnung 987/2009 ist für die Artikel 67 und 68 die Lage der gesamten Familie so zu berücksichtigen, als unterlägen alle beteiligten Personen den Rechtsvorschriften des betreffenden Mitgliedstaats und wohnten dort, insbesondere für das Antragsrecht.", sourceKey: "vo-987-family", passageKey: "vo-987-fb-art-60", riskLevel: "high" },
  { key: "fb-whole-family-applies-to-secondary", category: "article60", type: "definition", text: "Die Fiktion der gesamten Familie gilt auch bei der Prüfung nachrangiger nationaler Ansprüche, nicht nur beim vorrangigen Staat.", sourceKey: "cjeu-moser", passageKey: "cjeu-moser-text", riskLevel: "high" },
  { key: "fb-working-parent-only-insufficient", category: "article60", type: "exception", text: "Nur den erwerbstätigen Elternteil zu betrachten reicht für die Familienleistungskoordinierung nicht.", sourceKey: "cjeu-moser", passageKey: "cjeu-moser-text", riskLevel: "high" },
  { key: "fb-second-parent-activity-can-change-priority", category: "article60", type: "definition", text: "Eine Erwerbstätigkeit des zweiten Elternteils kann den Vorrang nach Artikel 68 wesentlich ändern.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-child-residence-can-change-priority", category: "article60", type: "definition", text: "Der Wohnort des Kindes kann den Vorrang nach Artikel 68 wesentlich ändern.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-multiple-children-not-one-child-state", category: "article60", type: "procedure", text: "Mehrere Kinder dürfen nicht auf einen einzigen globalen Kinderstaat zusammengezogen werden. Wohnort, Qualifikation und Zeitraum können kindbezogen unterschiedlich sein.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "trapkowski-applicant-not-beneficiary", category: "article60", type: "exception", text: "Nach C-378/14 Trapkowski ist Antragsbefugnis nicht dasselbe wie der Anspruch, die Leistung zu empfangen. Das nationale Recht bestimmt den Zahlungsempfänger vorbehaltlich des Unionsrechts.", sourceKey: "cjeu-trapkowski", passageKey: "cjeu-trapkowski-text", riskLevel: "high" },
  { key: "fb-other-parent-may-apply", category: "article60", type: "procedure", text: "Übt die gewöhnlich berechtigte Person das Antragsrecht nicht aus, ist ein Antrag des anderen Elternteils, einer als Elternteil behandelten Person oder einer für das Kind handelnden Person oder Einrichtung zu berücksichtigen.", sourceKey: "cjeu-trapkowski", passageKey: "cjeu-trapkowski-text", riskLevel: "high" },
  { key: "fb-other-parent-not-automatic-payee", category: "article60", type: "exception", text: "Dass der andere Elternteil den Antrag stellt, bedeutet nicht automatisch, dass dieser Elternteil die Leistung erhält.", sourceKey: "cjeu-trapkowski", passageKey: "cjeu-trapkowski-text", riskLevel: "high" },
  { key: "fb-working-parent-not-automatic-payee", category: "article60", type: "exception", text: "Es ist keine unionsrechtliche Regel, dass der erwerbstätige Elternteil die Familienleistung erhält.", sourceKey: "cjeu-trapkowski", passageKey: "cjeu-trapkowski-text", riskLevel: "high" },
  { key: "moser-whole-family-secondary", category: "article60", type: "definition", text: "C-32/18 Moser bestätigt, dass die Fiktion der gesamten Familie auch den Umfang nachrangiger Ansprüche bestimmt, einschließlich der Koordinierung von Elterngeld und ausländischer Kinderbetreuungsleistung im dortigen Sachverhalt.", sourceKey: "cjeu-moser", passageKey: "cjeu-moser-text", riskLevel: "high" },
  { key: "fb-moser-calculation-not-universal", category: "article60", type: "boundary", text: "Fallbezogene Einkommensberechnungsregeln aus Moser gelten nur, wo der Sachverhalt rechtlich vergleichbar und klar begrenzt ist, nicht für jede Familienleistung.", sourceKey: "cjeu-moser", passageKey: "cjeu-moser-text", riskLevel: "high" },

  { key: "fb-overlap-same-period-and-member", category: "overlap", type: "definition", text: "Artikel 68 gilt, wenn für denselben Zeitraum und dieselben Familienangehörigen Familienleistungen nach den Rechtsvorschriften mehrerer Mitgliedstaaten vorgesehen sind.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-two-working-parents-not-automatic-overlap", category: "overlap", type: "exception", text: "Zwei in verschiedenen Staaten erwerbstätige Elternteile lösen die Vorrangregeln nicht allein aus. Zuerst sind mögliche nationale Rechte, Zeitraum, Familienangehörige und die Familienleistungsklassifikation zu prüfen.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-national-rights-required-for-overlap", category: "overlap", type: "procedure", text: "Ohne verifizierte oder zumindest mögliche nationale Familienleistungsrechte in mehr als einem Staat darf die Vorranglogik nicht aktiviert werden.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high", requiresAuthorityResolution: true },

  { key: "fb-basis-activity", category: "basis", type: "definition", text: "ACTIVITY als Anspruchsgrundlage im Sinne des Artikels 68 umfasst Rechte aufgrund einer Beschäftigung oder selbständigen Tätigkeit.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-employed-and-self-employed-same-activity-tier", category: "basis", type: "exception", text: "Beschäftigung und selbständige Tätigkeit stehen in Artikel 68 auf derselben ACTIVITY-Stufe; weder Beschäftigung noch Selbständigkeit überragt die andere.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-self-employed-not-automatic-residence", category: "basis", type: "exception", text: "Selbständige Tätigkeit ist nicht automatisch eine wohnsitzbasierte Anspruchsgrundlage nach Artikel 68.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-self-employment-not-automatic-national-right", category: "basis", type: "exception", text: "Selbständigkeit in einem Staat begründet nicht automatisch ein erwerbstätigkeitsbasiertes nationales Familienleistungsrecht dieses Staats.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-single-person-mixed-not-two-activity-rights", category: "basis", type: "exception", text: "Beschäftigung und Selbständigkeit derselben Person in verschiedenen Staaten begründen nicht automatisch zwei Artikel-68-ACTIVITY-Rechte; jedes nationale Recht muss gesondert bestehen.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-zero-income-not-activity-ceased", category: "basis", type: "exception", text: "Nullumsatz oder fehlender Gewinn bedeutet nicht automatisch, dass die selbständige Tätigkeit beendet ist.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-dormant-registration-not-current-activity", category: "basis", type: "exception", text: "Eine ruhende Gewerbe- oder živnosť-Registrierung ist nicht verifizierte aktuelle Erwerbstätigkeit.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "fb-company-owner-not-automatic-self-employed", category: "basis", type: "exception", text: "Gesellschaftsstellung als Inhaber oder Geschäftsführer ist nicht automatisch selbständige Tätigkeit im Sinne des Artikels 68.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "fb-mixed-income-not-two-article-68-states", category: "basis", type: "exception", text: "Nationale Mischeinkünfte aus Beschäftigung und Selbständigkeit für Elterngeld sind nicht zwei mitgliedstaatliche Artikel-68-ACTIVITY-Rechte.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-business-registration-not-priority", category: "priority", type: "exception", text: "Der Staat der Gewerbe- oder Unternehmensregistrierung bestimmt den Artikel-68-Vorrang nicht.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-tax-residence-not-priority", category: "priority", type: "exception", text: "Der Steuerwohnsitz bestimmt den Artikel-68-Vorrang nicht automatisch.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-business-closure-not-automatic-benefit-end", category: "basis", type: "exception", text: "Betriebsschließung beendet Familienleistungsrechte nicht automatisch; Vorrang und Grundlage sind erneut zu prüfen.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-basis-pension", category: "basis", type: "definition", text: "PENSION als Anspruchsgrundlage bedeutet Rechte aufgrund des Bezugs einer Rente. Dieser Kern baut keine Rentenansprüche auf.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-basis-residence", category: "basis", type: "definition", text: "RESIDENCE als Anspruchsgrundlage bedeutet Rechte allein aufgrund des Wohnsitzes.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-basis-not-from-benefit-name", category: "basis", type: "exception", text: "Die Anspruchsgrundlage darf nicht allein aus Leistungsname, zahlender Stelle oder Wohnort des Kindes abgeleitet werden. Maßgeblich ist die rechtliche Grundlage im konkreten Fall.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-unemployed-basis-not-universal", category: "basis", type: "exception", text: "Arbeitslosigkeit bedeutet nicht universell eine erwerbstätigkeits- oder eine wohnsitzbasierte Familienleistung. Ist die Grundlage unklar, ist der nationale Adapter oder eine amtliche Einordnung erforderlich.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "fb-applicable-legislation-not-automatic-activity-right", category: "basis", type: "exception", text: "Der Staat der anwendbaren Rechtsvorschriften begründet nicht in jedem Fall ein erwerbstätigkeitsbasiertes Familienleistungsrecht. Ein nationaler Anspruch muss nach dem Recht dieses Staats bestehen.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-pension-basis-not-pension-merits", category: "basis", type: "boundary", text: "Die Einordnung als rentenbasierter Familienleistungsanspruch ersetzt keine Prüfung des Rentenanspruchs selbst.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },

  { key: EU_SHARED_ART68_CLAIM_KEY, category: "priority", type: "definition", text: "Artikel 68 bestimmt den Vorrang bei überlappenden Familienleistungsansprüchen desselben Zeitraums und derselben Familienangehörigen nach Grundlage und Hilfskriterien, nicht nach Staatsangehörigkeit oder Ausgabesprache.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-activity-before-pension-before-residence", category: "priority", type: "definition", text: "Bei unterschiedlichen Grundlagen gilt streng: zuerst Rechte aufgrund Beschäftigung oder Selbständigkeit, dann Rechte aufgrund einer Rente, zuletzt Rechte aufgrund des Wohnsitzes.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-child-residence-not-override-different-bases", category: "priority", type: "exception", text: "Der Wohnort des Kindes überlagert die Rangfolge Erwerbstätigkeit vor Rente vor Wohnsitz nicht, wenn die Rechte auf unterschiedlichen Grundlagen beruhen.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-de-activity-vs-sk-residence", category: "priority", type: "procedure", text: "Steht ein deutsches erwerbstätigkeitsbasiertes Recht einem nur wohnsitzbasierten slowakischen Recht gegenüber, hat das erwerbstätigkeitsbasierte Recht Vorrang.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-sk-activity-vs-de-residence", category: "priority", type: "procedure", text: "Steht ein slowakisches erwerbstätigkeitsbasiertes Recht einem nur wohnsitzbasierten deutschen Recht gegenüber, hat das slowakische erwerbstätigkeitsbasierte Recht Vorrang.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-same-basis-activity-child-residence", category: "priority", type: "procedure", text: "Beruhen beide Rechte auf Erwerbstätigkeit, hat der Wohnmitgliedstaat der Kinder Vorrang, sofern dort ebenfalls eine Beschäftigung oder Selbständigkeit besteht.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-higher-amount-not-automatic-primary", category: "priority", type: "exception", text: "Der höhere Leistungsbetrag macht einen Staat nicht automatisch zum vorrangigen Staat, wenn Kindwohnort und Erwerbstätigkeit den Vorrang bereits lösen.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-child-residence-not-always-primary", category: "priority", type: "exception", text: "Der Wohnort des Kindes ist nicht in jedem Artikel-68-Fall der vorrangige Staat, insbesondere nicht bei unterschiedlichen Grundlagen.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-unresolved-same-basis-activity", category: "priority", type: "procedure", text: "Wohnen die Kinder in keinem der Staaten, in denen die betreffenden Erwerbstätigkeiten ausgeübt werden, löst das Kindwohnsitzkriterium den Vorrang zwischen diesen Staaten nicht.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-art-58-cost-sharing", category: "priority", type: "procedure", text: "Artikel 58 der Verordnung 987/2009 gilt, wenn der Vorrang bei gleicher Grundlage nicht nach dem Kindwohnort bestimmt werden kann: jeder Staat berechnet, der Staat mit dem höchsten Betrag zahlt voll, die anderen Träger erstatten anteilig.", sourceKey: "vo-987-family", passageKey: "vo-987-fb-art-58", riskLevel: "high" },
  { key: "fb-art-58-not-ordinary-primary-secondary", category: "priority", type: "exception", text: "Artikel 58 gilt nicht für gewöhnliche Vorrang- und Nachrangfälle, in denen der Vorrang bereits feststeht.", sourceKey: "vo-987-family", passageKey: "vo-987-fb-art-58", riskLevel: "high" },
  { key: "fb-art-58-not-user-collects-half", category: "priority", type: "exception", text: "Artikel 58 bedeutet nicht, dass die Familie die Hälften selbst bei jedem Staat eintreiben muss. Es handelt sich um Trägerkostenteilung.", sourceKey: "vo-987-family", passageKey: "vo-987-fb-art-58", riskLevel: "high" },
  { key: "fb-same-basis-pension-priority", category: "priority", type: "procedure", text: "Beruhen konkurrierende Rechte beide auf einer Rente, entscheidet der Wohnort der Kinder, sofern dort eine Rente zahlbar ist, sonst die längste Versicherungs- oder Wohnzeit.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-same-basis-residence-child", category: "priority", type: "procedure", text: "Beruhen konkurrierende Rechte beide nur auf Wohnsitz, bestimmt der Wohnort der Kinder den Vorrang, nicht der Wohnort der Eltern.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-parent-residence-not-child-residence", category: "priority", type: "exception", text: "Elternwohnsitz ist nicht Kindwohnsitz.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },

  { key: "fb-primary-benefit-state-model", category: "states", type: "definition", text: "primaryBenefitState ist der nach verifizierter Artikel-68-Analyse vorrangige Familienleistungsstaat. Er ist nicht identisch mit dem zuständigen Sozialversicherungsstaat aus Titel II.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-secondary-benefit-state-model", category: "states", type: "definition", text: "secondaryBenefitState ist ein Staat mit bestehendem, aber nach Artikel 68 nachrangigem nationalem Anspruch. Nachrang bedeutet nicht fehlenden Anspruch.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-secondary-not-no-entitlement", category: "states", type: "exception", text: "Nachrang bedeutet nicht, dass aus dem zweiten Staat nichts gezahlt werden kann.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-secondary-not-full-second-benefit", category: "states", type: "exception", text: "Nachrang bedeutet nicht den vollen zweiten Familienleistungsanspruch für denselben Zeitraum und dieselbe Person.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },

  { key: EU_SHARED_ART682_CLAIM_KEY, category: "supplement", type: "definition", text: "Nach Artikel 68 Absatz 2 ruhen nachrangige Ansprüche bis zur Höhe der vorrangigen Leistung. Ein Unterschiedsbetrag kann für den überschießenden Teil geschuldet sein, sofern die nationalen Ansprüche, Klassifikation, Zeitraum, Familienangehörige und Berechnungsgrundlagen geklärt sind.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-two-full-benefits-not-normal", category: "supplement", type: "exception", text: "Zwei volle überlappende Familienleistungen für denselben Zeitraum und dieselbe Person sind nicht das normale Ergebnis des Artikels 68.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-secondary-never-pays-false", category: "supplement", type: "exception", text: "Die Aussage, aus dem zweiten Staat könne niemals etwas gezahlt werden, ist als allgemeine Regel unzutreffend.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-residence-only-supplement-exception", category: "supplement", type: "exception", text: "Ein Unterschiedsbetrag braucht nach Artikel 68 Absatz 2 Satz 2 nicht für Kinder gezahlt zu werden, die in einem anderen Mitgliedstaat wohnen, wenn der fragliche Anspruch nur auf Wohnsitz beruht.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-residence-only-not-always-payable", category: "supplement", type: "exception", text: "Ein nur wohnsitzbasierter nachrangiger Anspruch begründet nicht immer einen Unterschiedsbetrag.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-residence-only-not-always-forbidden", category: "supplement", type: "exception", text: "Ein nur wohnsitzbasierter nachrangiger Anspruch schließt den Unterschiedsbetrag nicht immer aus. Maßgeblich ist, wo die Kinder im Verhältnis zu diesem Staat wohnen.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-exact-amount-fail-closed", category: "supplement", type: "procedure", text: "Ein genauer Euro-Unterschiedsbetrag darf ohne verifizierte nationale Ansprüche, Klassifikation, Zeitraum, Familienangehörige, vorrangigen Staat und aktuelle nationale Berechnungsgrundlagen nicht genannt werden.", sourceKey: "family-institution-directory", passageKey: "family-institution-directory-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "fb-no-naive-amount-calculator", category: "supplement", type: "boundary", text: "Zwei Überschriftenbeträge ergeben keinen universellen Unterschiedsbetragsrechner. Perioden, Währungen und einkommensabhängige Teile müssen vergleichbar sein.", sourceKey: "family-institution-directory", passageKey: "family-institution-directory-text", riskLevel: "high" },
  { key: "fb-currency-period-fail-closed", category: "supplement", type: "procedure", text: "Ohne amtlich normalisierte Beträge, Zahlungsrhythmen und Zeiträume bleibt die genaue Differenz unbeantwortet.", sourceKey: "family-institution-directory", passageKey: "family-institution-directory-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: EU_SHARED_F3_CLAIM_KEY, category: "decision-f3", type: "definition", text: "Nach geltendem Beschluss F3 der Verwaltungskommission vom 19. Dezember 2018, wirksam ab 16. Juli 2019, vergleicht der nachrangige Träger für jedes Familienmitglied den Betrag der nach den vorrangigen Rechtsvorschriften gewährten Familienleistungen mit dem Betrag nach den nachrangigen Rechtsvorschriften und zahlt gegebenenfalls den Unterschied.", sourceKey: "decision-f3-family", passageKey: "decision-f3-family-text", riskLevel: "high" },
  { key: "fb-f3-secondary-compares-baskets", category: "decision-f3", type: "procedure", text: "Der Beschluss-F3-Vergleich setzt für dasselbe Familienmitglied und denselben relevanten Zeitraum den Korb der vorrangigen Familienleistungen dem Korb der nachrangigen Familienleistungen gegenüber, nicht eine einzelne Leistungsüberschrift.", sourceKey: "decision-f3-family", passageKey: "decision-f3-family-text", riskLevel: "high" },
  { key: "fb-f3-not-one-benefit-pair", category: "decision-f3", type: "exception", text: "Beschluss F3 erlaubt keinen universellen Einzelleistungsvergleich wie Kindergeld minus ausländische Kinderzulage oder Elterngeld minus ausländisches Elterngeld als allgemeine Regel.", sourceKey: "decision-f3-family", passageKey: "decision-f3-family-text", riskLevel: "high" },
  { key: "fb-f3-not-two-full-benefits", category: "decision-f3", type: "exception", text: "Beschluss F3 erlaubt nicht zwei volle überlappende Familienleistungen für denselben Zeitraum und dieselbe Person; er beschreibt den Unterschiedsbetrag, nicht eine Doppelzahlung.", sourceKey: "decision-f3-family", passageKey: "decision-f3-family-text", riskLevel: "high" },
  { key: "fb-f3-family-member-not-global-family", category: "decision-f3", type: "procedure", text: "Der F3-Vergleich ist familienmitgliedbezogen. Mehrere Kinder oder unterschiedliche Zeiträume dürfen nicht zu einem einzigen globalen Familienbetrag zusammengezogen werden.", sourceKey: "decision-f3-family", passageKey: "decision-f3-family-text", riskLevel: "high" },
  { key: "fb-f3-current-effective", category: "decision-f3", type: "definition", text: "Beschluss F3 ist geltendes Auslegungsrecht zu Artikel 68. Er ist nicht vorgeschlagenes Recht aus 2016/0397(COD).", sourceKey: "decision-f3-family", passageKey: "decision-f3-family-text", riskLevel: "high" },

  { key: "fb-art-68-3-forwarding", category: "procedure", type: "procedure", text: "Wird der Antrag bei einem anwendbaren, aber nicht vorrangigen Träger gestellt, leitet dieser den Antrag unverzüglich an den vorrangigen Träger weiter und unterrichtet die Person.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-filing-date-preserved", category: "procedure", type: "definition", text: "Der vorrangige Träger behandelt den Antrag, als sei er unmittelbar bei ihm gestellt worden. Das ursprüngliche Antragsdatum bleibt erhalten.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-filed-secondary-not-lost", category: "procedure", type: "exception", text: "Die Stellung des Antrags im nachrangigen Staat bedeutet nicht den Verlust des Antrags.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-restart-from-zero-false", category: "procedure", type: "exception", text: "Die Person muss den Antrag nicht allgemein von null neu beginnen, weil zunächst der nicht vorrangige Träger angerufen wurde.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-application-not-approval", category: "procedure", type: "exception", text: "Annahme oder Weiterleitung des Antrags ist nicht die Feststellung des nationalen Anspruchs. Das Artikel-60-Verfahren ersetzt nicht die nationale Anspruchsprüfung.", sourceKey: "vo-987-family", passageKey: "vo-987-fb-art-60", riskLevel: "high" },
  { key: "fb-primary-institution-pays-and-forwards", category: "procedure", type: "procedure", text: "Hält sich der empfangende Träger für vorrangig, leistet er nach seinem Recht und leitet mögliche nachrangige Differenzinformationen unverzüglich weiter, einschließlich Entscheidung und gezahltem Betrag.", sourceKey: "vo-987-family", passageKey: "vo-987-fb-art-60", riskLevel: "high" },
  { key: "fb-provisional-priority-decision", category: "procedure", type: "procedure", text: "Hält sich der Träger für anwendbar, aber nicht vorrangig, trifft er unverzüglich eine vorläufige Vorrangentscheidung, leitet den Antrag weiter und unterrichtet die antragstellende Person.", sourceKey: "vo-987-family", passageKey: "vo-987-fb-art-60", riskLevel: "high" },
  { key: "fb-two-month-institution-response", category: "procedure", type: "definition", text: "Der andere Träger hat zwei Monate ab Zugang, um Stellung zu nehmen. Die Frist ist eine Trägerantwortregel, kein Zahlungsversprechen an die Familie.", sourceKey: "vo-987-family", passageKey: "vo-987-fb-art-60", riskLevel: "high" },
  { key: "fb-two-month-not-user-payment-guarantee", category: "procedure", type: "exception", text: "Die Zweimonatsfrist garantiert nicht, dass die Familienleistung der Person innerhalb von zwei Monaten endgültig ausgezahlt wird.", sourceKey: "vo-987-family", passageKey: "vo-987-fb-art-60", riskLevel: "high" },
  { key: "fb-silence-makes-provisional-apply", category: "procedure", type: "definition", text: "Antwortet der andere Träger nicht innerhalb von zwei Monaten, gilt die vorläufige Vorrangentscheidung nach Artikel 60 Absatz 3.", sourceKey: "vo-987-family", passageKey: "vo-987-fb-art-60", riskLevel: "high" },
  { key: "fb-disagreement-routes-to-art-6", category: "procedure", type: "procedure", text: "Uneinigkeit über den Vorrang führt nach Artikel 60 Absatz 4 zu Artikel 6 Absätze 2 bis 5 der Verordnung 987/2009. Die Familie wählt den Staat nicht.", sourceKey: "vo-987-family", passageKey: "vo-987-fb-art-60", riskLevel: "high" },
  { key: "fb-disagreement-child-residence-institution", category: "procedure", type: "definition", text: "Für dieses Familienleistungsverfahren ist der maßgebliche Wohnortträger nach Artikel 6 der Träger am Wohnort des Kindes.", sourceKey: "vo-987-family", passageKey: "vo-987-fb-art-60", riskLevel: "high" },
  { key: "fb-family-does-not-choose-state", category: "procedure", type: "exception", text: "Uneinigkeit der Träger bedeutet nicht, dass die Familie den bevorzugten Staat wählt, und nicht, dass kein Staat handeln muss.", sourceKey: "vo-987-family", passageKey: "vo-987-fb-art-6", riskLevel: "high" },
  { key: "fb-provisional-not-final", category: "procedure", type: "exception", text: "Eine vorläufige Zahlung ist nicht die endgültige Vorrang- oder Anspruchsbestimmung.", sourceKey: "vo-987-family", passageKey: "vo-987-fb-art-6", riskLevel: "high" },
  { key: "fb-overpayment-institutional-settlement", category: "procedure", type: "procedure", text: "Hat ein Träger vorläufig mehr gezahlt als endgültig geschuldet, können Trägererstattungen nach Artikel 60 Absatz 5 und Artikel 73 greifen.", sourceKey: "vo-987-family", passageKey: "vo-987-fb-art-73", riskLevel: "high" },
  { key: "fb-family-not-told-repay-immediately", category: "procedure", type: "exception", text: "Vorläufige Überzahlung bedeutet nicht automatisch, dass die Familie alles sofort zurückzahlen muss. Rückforderung hängt von endgültigen Entscheidungen, nationalem Verfahren und Trägerausgleich ab.", sourceKey: "vo-987-family", passageKey: "vo-987-fb-art-73", riskLevel: "high" },

  { key: "fb-art-59-month-end-continuation", category: "article59", type: "procedure", text: "Wechseln anwendbare Rechtsvorschriften oder Familienleistungskompetenz im Kalendermonat, zahlt der zu Beginn des Monats leistende Träger bis zum Monatsende weiter.", sourceKey: "vo-987-family", passageKey: "vo-987-fb-art-59", riskLevel: "high" },
  { key: "fb-mid-month-not-day-split", category: "article59", type: "exception", text: "Ein Beschäftigungswechsel mitten im Monat führt nicht automatisch zu einem tagesweisen Leistungsschnitt.", sourceKey: "vo-987-family", passageKey: "vo-987-fb-art-59", riskLevel: "high" },

  { key: EU_SHARED_ART69_CLAIM_KEY, category: "orphan", type: "definition", text: "Artikel 69 sieht eine hilfsweise Koordinierung zusätzlicher oder besonderer Familienleistungen für Waisen vor, wenn nach den Artikeln 67 und 68 kein solches Recht besteht, zuerst nach der längsten Unterworfenheit des verstorbenen Arbeitnehmers.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-69", riskLevel: "high" },
  { key: "fb-art-61-orphan-implementing", category: "orphan", type: "procedure", text: "Artikel 61 der Verordnung 987/2009 führt die besonderen Waisenfamilienleistungen durch. Ob eine konkrete nationale Waisenleistung existiert, entscheidet später der nationale Adapter.", sourceKey: "vo-987-family", passageKey: "vo-987-fb-art-61", riskLevel: "high" },
  { key: "fb-no-national-orphan-merits", category: "orphan", type: "boundary", text: "Dieser EU-Kern speichert keine nationalen Waisenleistungstatbestände.", sourceKey: "vo-987-family", passageKey: "vo-987-fb-art-61", riskLevel: "high" },

  { key: "fb-child-residence-not-citizenship", category: "facts", type: "exception", text: "Der Kindwohnsitz folgt nicht aus Staatsangehörigkeit, alleiniger Meldeadresse, Elternadresse oder Schule ohne hinreichenden Gesamtzusammenhang.", sourceKey: "vo-987-family", passageKey: "vo-987-fb-art-60", riskLevel: "high" },
  { key: "fb-child-residence-unclear-fail-closed", category: "facts", type: "procedure", text: "Ist der Kindwohnsitz für Artikel 68 wesentlich unklar, darf der vorrangige Staat nicht bestimmt werden.", sourceKey: "vo-987-family", passageKey: "vo-987-fb-art-60", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "fb-second-parent-activity-unclear-fail-closed", category: "facts", type: "procedure", text: "Ist die Erwerbstätigkeit des zweiten Elternteils unbekannt, darf der Vorrang nicht so bestimmt werden, als existierte keine zweite Tätigkeit.", sourceKey: "vo-987-family", passageKey: "vo-987-fb-art-60", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "fb-kindergeld-national-not-in-eu-core", category: "boundary", type: "boundary", text: "Deutsche Kindergeldvoraussetzungen, Kindesdefinitionen, Beträge und Familienkasse-Verfahren werden in diesem EU-Kern nicht dupliziert.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-67", riskLevel: "high" },
  { key: "fb-elterngeld-national-not-in-eu-core", category: "boundary", type: "boundary", text: "Deutsche Elterngeldmerits nach dem BEEG, Betragsberechnung, Einkommensgrenzen und Lebensmonate werden in diesem EU-Kern nicht dupliziert. Die geltende Koordinierung nutzt 883/987, nicht 2016/0397.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-uk-family-out-of-scope", category: "boundary", type: "exception", text: "Britische Post-Brexit-Familienleistungsfälle liegen außerhalb dieses EU-Kerns.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-non-eu-bilateral-out-of-scope", category: "boundary", type: "exception", text: "Nicht-unionsrechtliche bilaterale Familienleistungsabkommen liegen außerhalb dieses EU-Kerns.", sourceKey: "vo-883-family", passageKey: "vo-883-fb-art-68", riskLevel: "high" },
  { key: "fb-fact-change-requires-reclassification", category: "facts", type: "procedure", text: "Wohnortwechsel des Kindes, Aufnahme einer Erwerbstätigkeit des anderen Elternteils oder Wechsel des Beschäftigungsstaats erfordern eine erneute Vorrang- und Klassifikationsprüfung.", sourceKey: "vo-987-family", passageKey: "vo-987-fb-art-59", riskLevel: "high" },
  { key: "fb-exact-institution-fetch-live", category: "institution", type: "procedure", text: "Die genaue zuständige Familienleistungstelle, aktuelle Antragsadressen und geltende nationale Beträge sind live zu ermitteln.", sourceKey: "family-institution-directory", passageKey: "family-institution-directory-text", riskLevel: "medium" },
  { key: "fb-institution-not-user-chosen", category: "institution", type: "exception", text: "Die Familie wählt den zuständigen Familienleistungsträger nicht nach Belieben oder nach der höheren Leistung.", sourceKey: "vo-987-family", passageKey: "vo-987-fb-art-6", riskLevel: "high" },
  { key: "fb-commission-guidance-revalidate", category: "freshness", type: "procedure", text: "Operative Hinweise der Kommission zur Familienleistungskoordinierung sind vor Gebrauch zu revalidieren und ersetzen nicht den Verordnungstext.", sourceKey: "commission-family-benefits", passageKey: "commission-family-text", riskLevel: "medium" },
]);

type ProcessSpec = Readonly<{
  key: string;
  title: string;
  trigger: string;
  safeFirstStep: string;
  riskLevel: "medium" | "high";
  dimensions: Readonly<Record<(typeof PROCESS_COMPLETE_DIMENSIONS)[number], string>>;
}>;

const SHARED_INSTITUTION = "fb-institution-not-user-chosen";
const SHARED_BOUNDARIES = "fb-eu-coordination-not-national-entitlement";
const SHARED_FRESHNESS = "current-883-987-family-baseline";
const SHARED_NEG = "fb-nationality-not-priority";

export const EU_FAMILY_PROCESSES: readonly ProcessSpec[] = Object.freeze([
  { key: "fb-classification-gate", title: "EU-Familienleistungsklassifikation 2026 prüfen", trigger: "Eine Zahlung mit Familien-, Kinder- oder Elternbezug soll koordiniert werden", safeFirstStep: "Zweck und gesetzliche Voraussetzungen verlangen, nicht den Leistungsnamen.", riskLevel: "high", dimensions: { what: EU_SHARED_ART1Z_CLAIM_KEY, whoWhen: "fb-no-keyword-classifier", documents: "fb-class-requires-authority", how: "fb-class-family-benefit-current", next: "fb-class-excluded-annex-i", deadlines: SHARED_FRESHNESS, problems: "fb-name-not-automatic-family-benefit", dutiesAfter: "fb-fact-change-requires-reclassification", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "fb-social-assistance-not-automatic-family-benefit" } },
  { key: "annex-i-exclusion-gate", title: "Anhang-I-Ausschluss 2026 prüfen", trigger: "Unterhaltsvorschuss oder besondere Geburtsbeihilfe wird als Familienleistung angeboten", safeFirstStep: "Aktuellen Anhang I revalidieren.", riskLevel: "high", dimensions: { what: "fb-annex-i-exclusions", whoWhen: "fb-unterhaltsvorschuss-annex-i", documents: "fb-annex-i-must-revalidate", how: "fb-special-childbirth-annex-i", next: "fb-class-excluded-annex-i", deadlines: "fb-annex-i-must-revalidate", problems: "fb-annex-i-not-other-national-classifications", dutiesAfter: "fb-fact-change-requires-reclassification", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "fb-tax-advantage-not-automatic-family-benefit" } },
  { key: "art-67-eligibility-orient", title: "Artikel-67-Familienangehörigenfiktion 2026 orientieren", trigger: "Familienangehörige wohnen in einem anderen Mitgliedstaat", safeFirstStep: "Fiktion von nationalen Voraussetzungen trennen.", riskLevel: "high", dimensions: { what: EU_SHARED_ART67_CLAIM_KEY, whoWhen: "fb-art-67-pensioner-rule-distinct", documents: "fb-kindergeld-national-not-in-eu-core", how: "fb-art-67-fiction-not-national-conditions", next: "fb-child-need-not-live-in-employment-state", deadlines: SHARED_FRESHNESS, problems: "fb-family-abroad-not-automatic-entitlement", dutiesAfter: "fb-fact-change-requires-reclassification", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "fb-child-abroad-not-automatic-loss" } },
  { key: "whole-family-fact-model", title: "Gesamtfamilienfiktion Artikel 60 2026 anwenden", trigger: "Nur ein Elternteil oder nur ein Kind wird als Sachverhalt angeboten", safeFirstStep: "Zweite Elternperson, Kindwohnsitze und Zeiträume verlangen.", riskLevel: "high", dimensions: { what: EU_SHARED_ART60_CLAIM_KEY, whoWhen: "fb-whole-family-applies-to-secondary", documents: "fb-second-parent-activity-unclear-fail-closed", how: "fb-working-parent-only-insufficient", next: "fb-multiple-children-not-one-child-state", deadlines: SHARED_FRESHNESS, problems: "fb-child-residence-unclear-fail-closed", dutiesAfter: "fb-fact-change-requires-reclassification", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "fb-second-parent-activity-can-change-priority" } },
  { key: "applicant-vs-beneficiary", title: "Antragsteller und Empfänger 2026 trennen", trigger: "Der andere Elternteil stellt den Antrag oder verlangt Auszahlung", safeFirstStep: "Trapkowski anwenden: Antragsrecht ist nicht Zahlungsanspruch.", riskLevel: "high", dimensions: { what: "trapkowski-applicant-not-beneficiary", whoWhen: "fb-other-parent-may-apply", documents: "fb-working-parent-not-automatic-payee", how: EU_SHARED_ART60_CLAIM_KEY, next: "fb-application-not-approval", deadlines: SHARED_FRESHNESS, problems: "fb-other-parent-not-automatic-payee", dutiesAfter: "fb-fact-change-requires-reclassification", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "fb-working-parent-not-automatic-payee" } },
  { key: "national-entitlement-collect", title: "Mögliche nationale Familienleistungsrechte 2026 sammeln", trigger: "Vorrang soll bestimmt werden, bevor nationale Rechte geklärt sind", safeFirstStep: "Keine Vorranglogik ohne mögliche nationale Rechte.", riskLevel: "high", dimensions: { what: "fb-national-rights-required-for-overlap", whoWhen: "fb-eu-coordination-not-national-entitlement", documents: "fb-kindergeld-national-not-in-eu-core", how: "fb-elterngeld-national-not-in-eu-core", next: "fb-class-requires-authority", deadlines: SHARED_FRESHNESS, problems: "fb-applicable-legislation-not-automatic-activity-right", dutiesAfter: "fb-fact-change-requires-reclassification", institution: "fb-exact-institution-fetch-live", boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: SHARED_NEG } },
  { key: "overlapping-rights-detect", title: "Überlappende Familienleistungsrechte 2026 erkennen", trigger: "Eltern arbeiten in verschiedenen Staaten", safeFirstStep: "Gleichen Zeitraum und denselben Familienangehörigen prüfen.", riskLevel: "high", dimensions: { what: "fb-overlap-same-period-and-member", whoWhen: "fb-two-working-parents-not-automatic-overlap", documents: "fb-national-rights-required-for-overlap", how: EU_SHARED_ART68_CLAIM_KEY, next: "fb-basis-activity", deadlines: SHARED_FRESHNESS, problems: "fb-child-residence-unclear-fail-closed", dutiesAfter: "fb-fact-change-requires-reclassification", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "fb-two-working-parents-not-automatic-overlap" } },
  { key: "entitlement-basis-classify", title: "Anspruchsgrundlage Artikel 68 2026 einordnen", trigger: "Vorrang soll nach Kindwohnsitz oder Betrag bestimmt werden", safeFirstStep: "ACTIVITY, PENSION oder RESIDENCE nach der rechtlichen Grundlage bestimmen.", riskLevel: "high", dimensions: { what: "fb-basis-activity", whoWhen: "fb-basis-pension", documents: "fb-basis-residence", how: "fb-basis-not-from-benefit-name", next: "fb-activity-before-pension-before-residence", deadlines: SHARED_FRESHNESS, problems: "fb-unemployed-basis-not-universal", dutiesAfter: "fb-fact-change-requires-reclassification", institution: SHARED_INSTITUTION, boundaries: "fb-pension-basis-not-pension-merits", freshness: SHARED_FRESHNESS, negatives: "fb-applicable-legislation-not-automatic-activity-right" } },
  { key: "different-basis-priority", title: "Vorrang bei unterschiedlichen Grundlagen 2026 bestimmen", trigger: "Ein Recht ist erwerbstätigkeitsbasiert, das andere wohnsitz- oder rentenbasiert", safeFirstStep: "Erwerbstätigkeit vor Rente vor Wohnsitz anwenden.", riskLevel: "high", dimensions: { what: "fb-activity-before-pension-before-residence", whoWhen: "fb-de-activity-vs-sk-residence", documents: "fb-sk-activity-vs-de-residence", how: "fb-child-residence-not-override-different-bases", next: "fb-primary-benefit-state-model", deadlines: SHARED_FRESHNESS, problems: "fb-child-residence-not-always-primary", dutiesAfter: "fb-fact-change-requires-reclassification", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "fb-higher-amount-not-automatic-primary" } },
  { key: "same-basis-activity-priority", title: "Vorrang bei beiderseitiger Erwerbstätigkeit 2026 bestimmen", trigger: "Beide Rechte beruhen auf Beschäftigung oder Selbständigkeit", safeFirstStep: "Kindwohnsitz nur zählen, wenn dort ebenfalls eine Tätigkeit besteht.", riskLevel: "high", dimensions: { what: "fb-same-basis-activity-child-residence", whoWhen: "fb-second-parent-activity-can-change-priority", documents: "fb-child-residence-can-change-priority", how: "fb-higher-amount-not-automatic-primary", next: "fb-unresolved-same-basis-activity", deadlines: SHARED_FRESHNESS, problems: "fb-child-residence-not-always-primary", dutiesAfter: "fb-fact-change-requires-reclassification", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "fb-higher-amount-not-automatic-primary" } },
  { key: "child-residence-activity-gate", title: "Kindwohnsitz und Tätigkeit 2026 prüfen", trigger: "Kind wohnt in einem dritten Staat oder der Wohnort ist unklar", safeFirstStep: "Nicht annehmen, der Kindwohnsitz siege immer.", riskLevel: "high", dimensions: { what: "fb-child-residence-can-change-priority", whoWhen: "fb-child-residence-unclear-fail-closed", documents: "fb-child-residence-not-citizenship", how: "fb-unresolved-same-basis-activity", next: "fb-art-58-cost-sharing", deadlines: SHARED_FRESHNESS, problems: "fb-parent-residence-not-child-residence", dutiesAfter: "fb-fact-change-requires-reclassification", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "fb-child-residence-not-always-primary" } },
  { key: "art-58-unresolved-same-basis", title: "Artikel-58-Kostenteilung 2026 führen", trigger: "Gleiche Grundlage, Kind wohnt in keinem Tätigkeitsstaat", safeFirstStep: "Trägerkostenteilung erklären, keine Hälften-Eintreibung durch die Familie.", riskLevel: "high", dimensions: { what: "fb-art-58-cost-sharing", whoWhen: "fb-unresolved-same-basis-activity", documents: "fb-exact-amount-fail-closed", how: "fb-art-58-not-user-collects-half", next: "fb-art-58-not-ordinary-primary-secondary", deadlines: SHARED_FRESHNESS, problems: "fb-currency-period-fail-closed", dutiesAfter: "fb-fact-change-requires-reclassification", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "fb-art-58-not-ordinary-primary-secondary" } },
  { key: "same-basis-pension-priority", title: "Vorrang bei beiderseitiger Rente 2026 bestimmen", trigger: "Beide Rechte beruhen auf einer Rente", safeFirstStep: "Kindwohnsitz prüfen, sofern dort eine Rente zahlbar ist.", riskLevel: "high", dimensions: { what: "fb-same-basis-pension-priority", whoWhen: "fb-basis-pension", documents: "fb-pension-basis-not-pension-merits", how: "fb-art-67-pensioner-rule-distinct", next: "fb-primary-benefit-state-model", deadlines: SHARED_FRESHNESS, problems: "fb-child-residence-unclear-fail-closed", dutiesAfter: "fb-fact-change-requires-reclassification", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: SHARED_NEG } },
  { key: "same-basis-residence-priority", title: "Vorrang bei beiderseitigem Wohnsitzrecht 2026 bestimmen", trigger: "Beide Rechte beruhen nur auf Wohnsitz", safeFirstStep: "Kindwohnsitz, nicht Elternwohnsitz verwenden.", riskLevel: "high", dimensions: { what: "fb-same-basis-residence-child", whoWhen: "fb-parent-residence-not-child-residence", documents: "fb-basis-residence", how: "fb-residence-only-supplement-exception", next: "fb-primary-benefit-state-model", deadlines: SHARED_FRESHNESS, problems: "fb-child-residence-unclear-fail-closed", dutiesAfter: "fb-fact-change-requires-reclassification", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "fb-child-residence-not-always-primary" } },
  { key: "primary-state-determine", title: "Vorrangigen Familienleistungsstaat 2026 bestimmen", trigger: "primaryBenefitState wird mit dem zuständigen Sozialversicherungsstaat gleichgesetzt", safeFirstStep: "Nur verifizierte Artikel-68-Analyse verwenden.", riskLevel: "high", dimensions: { what: "fb-primary-benefit-state-model", whoWhen: "fb-applicable-legislation-not-automatic-primary", documents: EU_SHARED_ART68_CLAIM_KEY, how: "fb-activity-before-pension-before-residence", next: "fb-secondary-benefit-state-model", deadlines: SHARED_FRESHNESS, problems: "fb-user-locale-not-priority", dutiesAfter: "fb-fact-change-requires-reclassification", institution: SHARED_INSTITUTION, boundaries: "fb-source-eu-not-national-competence", freshness: SHARED_FRESHNESS, negatives: SHARED_NEG } },
  { key: "secondary-state-determine", title: "Nachrangigen Familienleistungsstaat 2026 bestimmen", trigger: "Ein zweiter Staat hat einen möglichen Anspruch", safeFirstStep: "Nachrang nicht als Anspruchsausschluss behandeln.", riskLevel: "high", dimensions: { what: "fb-secondary-benefit-state-model", whoWhen: "fb-secondary-not-no-entitlement", documents: "fb-secondary-not-full-second-benefit", how: EU_SHARED_ART682_CLAIM_KEY, next: "fb-whole-family-applies-to-secondary", deadlines: SHARED_FRESHNESS, problems: "fb-secondary-never-pays-false", dutiesAfter: "fb-fact-change-requires-reclassification", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "fb-two-full-benefits-not-normal" } },
  { key: "differential-supplement-orient", title: "Unterschiedsbetrag Artikel 68 Absatz 2 2026 orientieren", trigger: "Nachrangiger nationaler Anspruch könnte höher sein", safeFirstStep: "Prinzip nennen, keinen Euro-Betrag erfinden.", riskLevel: "high", dimensions: { what: EU_SHARED_ART682_CLAIM_KEY, whoWhen: "fb-secondary-not-no-entitlement", documents: "fb-exact-amount-fail-closed", how: "fb-no-naive-amount-calculator", next: "fb-residence-only-supplement-exception", deadlines: SHARED_FRESHNESS, problems: "fb-currency-period-fail-closed", dutiesAfter: "fb-fact-change-requires-reclassification", institution: "fb-exact-institution-fetch-live", boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "fb-two-full-benefits-not-normal" } },
  { key: "residence-only-supplement-exception", title: "Wohnsitz-Unterschiedsbetragsausnahme 2026 prüfen", trigger: "Nachrangiges Recht ist nur wohnsitzbasiert", safeFirstStep: "Prüfen, wo die Kinder im Verhältnis zu diesem Staat wohnen.", riskLevel: "high", dimensions: { what: "fb-residence-only-supplement-exception", whoWhen: "fb-residence-only-not-always-payable", documents: "fb-residence-only-not-always-forbidden", how: "fb-same-basis-residence-child", next: EU_SHARED_ART682_CLAIM_KEY, deadlines: SHARED_FRESHNESS, problems: "fb-parent-residence-not-child-residence", dutiesAfter: "fb-fact-change-requires-reclassification", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "fb-residence-only-not-always-payable" } },
  { key: "exact-amount-fail-closed", title: "Genaue Beträge 2026 fail-closed halten", trigger: "Nutzer verlangt den genauen Unterschied in Euro", safeFirstStep: "Ohne aktuelle nationale Beträge nicht antworten.", riskLevel: "high", dimensions: { what: "fb-exact-amount-fail-closed", whoWhen: "fb-no-naive-amount-calculator", documents: "fb-currency-period-fail-closed", how: "fb-exact-institution-fetch-live", next: EU_SHARED_ART682_CLAIM_KEY, deadlines: SHARED_FRESHNESS, problems: "fb-higher-amount-not-automatic-primary", dutiesAfter: "fb-fact-change-requires-reclassification", institution: "fb-exact-institution-fetch-live", boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "fb-two-full-benefits-not-normal" } },
  { key: "application-forwarding", title: "Antragswegleitung Artikel 68 Absatz 3 2026 führen", trigger: "Antrag wurde zuerst im nicht vorrangigen Staat gestellt", safeFirstStep: "Weiterleitung und Datumserhalt erklären, nicht Neustart.", riskLevel: "high", dimensions: { what: "fb-art-68-3-forwarding", whoWhen: "fb-filed-secondary-not-lost", documents: "fb-filing-date-preserved", how: "fb-restart-from-zero-false", next: "fb-application-not-approval", deadlines: SHARED_FRESHNESS, problems: "fb-application-not-approval", dutiesAfter: "fb-fact-change-requires-reclassification", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "fb-restart-from-zero-false" } },
  { key: "primary-institution-art-60", title: "Vorrangträgerverfahren Artikel 60 2026 führen", trigger: "Der empfangende Träger hält sich für vorrangig", safeFirstStep: "Leistung nach eigenem Recht und Weiterleitung möglicher Differenz.", riskLevel: "high", dimensions: { what: "fb-primary-institution-pays-and-forwards", whoWhen: EU_SHARED_ART60_CLAIM_KEY, documents: "fb-application-not-approval", how: "fb-exact-institution-fetch-live", next: EU_SHARED_ART682_CLAIM_KEY, deadlines: SHARED_FRESHNESS, problems: "fb-application-not-approval", dutiesAfter: "fb-fact-change-requires-reclassification", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: SHARED_NEG } },
  { key: "secondary-provisional-priority", title: "Vorläufige Vorrangentscheidung 2026 führen", trigger: "Träger ist anwendbar, aber nicht vorrangig", safeFirstStep: "Unverzüglich vorläufig entscheiden und weiterleiten.", riskLevel: "high", dimensions: { what: "fb-provisional-priority-decision", whoWhen: "fb-two-month-institution-response", documents: "fb-filing-date-preserved", how: "fb-silence-makes-provisional-apply", next: "fb-two-month-not-user-payment-guarantee", deadlines: "fb-two-month-institution-response", problems: "fb-provisional-not-final", dutiesAfter: "fb-fact-change-requires-reclassification", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "fb-two-month-not-user-payment-guarantee" } },
  { key: "institutional-disagreement", title: "Trägeruneinigkeit und vorläufigen Schutz 2026 führen", trigger: "Träger streiten über den Vorrang", safeFirstStep: "Artikel 6 und Kindwohnsitzträger nennen; Familie wählt nicht.", riskLevel: "high", dimensions: { what: "fb-disagreement-routes-to-art-6", whoWhen: "fb-disagreement-child-residence-institution", documents: "fb-family-does-not-choose-state", how: "fb-provisional-not-final", next: "fb-overpayment-institutional-settlement", deadlines: "fb-two-month-institution-response", problems: "fb-family-not-told-repay-immediately", dutiesAfter: "fb-fact-change-requires-reclassification", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "fb-family-does-not-choose-state" } },
  { key: "competence-change-during-month", title: "Kompetenzwechsel im Kalendermonat 2026 führen", trigger: "Beschäftigung oder Zuständigkeit wechselt mitten im Monat", safeFirstStep: "Monatsende-Fortsetzung nach Artikel 59, keinen Tagesschnitt.", riskLevel: "high", dimensions: { what: "fb-art-59-month-end-continuation", whoWhen: "fb-mid-month-not-day-split", documents: "fb-fact-change-requires-reclassification", how: "fb-primary-benefit-state-model", next: "fb-secondary-benefit-state-model", deadlines: SHARED_FRESHNESS, problems: "fb-mid-month-not-day-split", dutiesAfter: "fb-fact-change-requires-reclassification", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "fb-mid-month-not-day-split" } },
  { key: "family-fact-change-reclass", title: "Sachverhaltsänderung Familienleistungen 2026 neu prüfen", trigger: "Kind zieht um, Elternteil nimmt Arbeit auf oder Beschäftigungsstaat wechselt", safeFirstStep: "Vorrang und Klassifikation neu prüfen.", riskLevel: "high", dimensions: { what: "fb-fact-change-requires-reclassification", whoWhen: "fb-child-residence-can-change-priority", documents: "fb-second-parent-activity-can-change-priority", how: EU_SHARED_ART68_CLAIM_KEY, next: "fb-art-59-month-end-continuation", deadlines: SHARED_FRESHNESS, problems: "fb-child-residence-unclear-fail-closed", dutiesAfter: "fb-fact-change-requires-reclassification", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: SHARED_NEG } },
  { key: "art-69-orphan-route", title: "Besondere Waisenfamilienleistungen 2026 führen", trigger: "Zusätzliche oder besondere Waisenfamilienleistung wird verlangt", safeFirstStep: "Artikel 69 und 61 nennen, keine nationalen Waisenmerits erfinden.", riskLevel: "high", dimensions: { what: EU_SHARED_ART69_CLAIM_KEY, whoWhen: "fb-art-61-orphan-implementing", documents: "fb-no-national-orphan-merits", how: "fb-art-67-pensioner-rule-distinct", next: "fb-class-requires-authority", deadlines: SHARED_FRESHNESS, problems: "fb-national-rights-required-for-overlap", dutiesAfter: "fb-fact-change-requires-reclassification", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: SHARED_NEG } },
  { key: "current-vs-proposed-reform-gate", title: "Geltendes Recht und 2016/0397 2026 trennen", trigger: "Nutzer behandelt vorgeschlagene Kindererziehungsregeln als geltendes Recht", safeFirstStep: "Erstlesung 2026 als nicht geltende Revision kennzeichnen.", riskLevel: "high", dimensions: { what: "pending-cod-2016-0397-family-not-current", whoWhen: "proposed-child-raising-category-not-current", documents: "fb-class-proposed-future", how: "fb-elterngeld-national-not-in-eu-core", next: SHARED_FRESHNESS, deadlines: SHARED_FRESHNESS, problems: "fb-class-proposed-future", dutiesAfter: "fb-commission-guidance-revalidate", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "proposed-child-raising-category-not-current" } },
  { key: "national-classifier-boundary", title: "Nationale Familienleistungskerne 2026 abgrenzen", trigger: "Kindergeld- oder Elterngeldvoraussetzungen sollen im EU-Kern entschieden werden", safeFirstStep: "An nationale Kerne und späteren Korridor verweisen.", riskLevel: "high", dimensions: { what: "fb-kindergeld-national-not-in-eu-core", whoWhen: "fb-elterngeld-national-not-in-eu-core", documents: "moser-whole-family-secondary", how: "fb-moser-calculation-not-universal", next: "fb-class-requires-authority", deadlines: SHARED_FRESHNESS, problems: "fb-uk-family-out-of-scope", dutiesAfter: "fb-fact-change-requires-reclassification", institution: "fb-exact-institution-fetch-live", boundaries: "fb-non-eu-bilateral-out-of-scope", freshness: SHARED_FRESHNESS, negatives: SHARED_NEG } },
  { key: "decision-f3-basket-method", title: "Beschluss-F3-Familienmitgliedskorb 2026 anwenden", trigger: "Unterschiedsbetrag soll aus zwei Leistungsnamen oder einem Gesamtfamilienbetrag berechnet werden", safeFirstStep: "Pro Familienmitglied vorrangigen und nachrangigen Korb verlangen; keine Einzelleistungspaare.", riskLevel: "high", dimensions: { what: EU_SHARED_F3_CLAIM_KEY, whoWhen: "fb-f3-secondary-compares-baskets", documents: "fb-f3-family-member-not-global-family", how: "fb-exact-amount-fail-closed", next: "fb-f3-not-one-benefit-pair", deadlines: "fb-f3-current-effective", problems: "fb-currency-period-fail-closed", dutiesAfter: "fb-fact-change-requires-reclassification", institution: "fb-exact-institution-fetch-live", boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "fb-f3-not-two-full-benefits" } },
]);

export type ScenarioCoverage = "COVERED" | "EXPLICITLY_OUT_OF_SCOPE" | "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE";

type ScenarioSpec = Readonly<{
  id: string;
  label: string;
  coverage: ScenarioCoverage;
  requiredClaimKeys: readonly string[];
  requiredProcessKeys: readonly string[];
}>;

export const EU_FAMILY_SCENARIOS: readonly ScenarioSpec[] = Object.freeze([
  { id: "parent-a-works-de-b-not-working-child-sk", label: "Elternteil A arbeitet DE, B nicht erwerbstätig, Kind SK", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_ART67_CLAIM_KEY, "fb-child-abroad-not-automatic-loss"], requiredProcessKeys: ["art-67-eligibility-orient"] },
  { id: "parent-a-de-parent-b-sk-child-sk", label: "A arbeitet DE, B arbeitet SK, Kind SK", coverage: "COVERED", requiredClaimKeys: ["fb-same-basis-activity-child-residence"], requiredProcessKeys: ["same-basis-activity-priority"] },
  { id: "parent-a-de-parent-b-sk-child-de", label: "A arbeitet DE, B arbeitet SK, Kind DE", coverage: "COVERED", requiredClaimKeys: ["fb-same-basis-activity-child-residence"], requiredProcessKeys: ["same-basis-activity-priority"] },
  { id: "parent-a-de-parent-b-sk-child-hu", label: "A arbeitet DE, B arbeitet SK, Kind HU", coverage: "COVERED", requiredClaimKeys: ["fb-unresolved-same-basis-activity", "fb-art-58-cost-sharing"], requiredProcessKeys: ["art-58-unresolved-same-basis"] },
  { id: "parent-a-de-parent-b-pension-sk-child-sk", label: "A arbeitet DE, B Rente SK, Kind SK", coverage: "COVERED", requiredClaimKeys: ["fb-activity-before-pension-before-residence"], requiredProcessKeys: ["different-basis-priority"] },
  { id: "de-activity-vs-sk-residence-only", label: "DE Erwerbstätigkeit gegen SK nur Wohnsitz", coverage: "COVERED", requiredClaimKeys: ["fb-de-activity-vs-sk-residence"], requiredProcessKeys: ["different-basis-priority"] },
  { id: "sk-activity-vs-de-residence-only", label: "SK Erwerbstätigkeit gegen DE nur Wohnsitz", coverage: "COVERED", requiredClaimKeys: ["fb-sk-activity-vs-de-residence"], requiredProcessKeys: ["different-basis-priority"] },
  { id: "two-pension-based-rights", label: "Zwei rentenbasierte Rechte", coverage: "COVERED", requiredClaimKeys: ["fb-same-basis-pension-priority"], requiredProcessKeys: ["same-basis-pension-priority"] },
  { id: "two-residence-based-rights", label: "Zwei wohnsitzbasierte Rechte", coverage: "COVERED", requiredClaimKeys: ["fb-same-basis-residence-child"], requiredProcessKeys: ["same-basis-residence-priority"] },
  { id: "child-residence-unclear", label: "Kindwohnsitz unklar", coverage: "COVERED", requiredClaimKeys: ["fb-child-residence-unclear-fail-closed"], requiredProcessKeys: ["child-residence-activity-gate"] },
  { id: "second-parent-activity-unknown", label: "Tätigkeit des zweiten Elternteils unbekannt", coverage: "COVERED", requiredClaimKeys: ["fb-second-parent-activity-unclear-fail-closed"], requiredProcessKeys: ["whole-family-fact-model"] },
  { id: "employment-begins-mid-period", label: "Beschäftigung beginnt mitten im Zeitraum", coverage: "COVERED", requiredClaimKeys: ["fb-fact-change-requires-reclassification"], requiredProcessKeys: ["family-fact-change-reclass"] },
  { id: "competence-changes-mid-calendar-month", label: "Kompetenz wechselt im Kalendermonat", coverage: "COVERED", requiredClaimKeys: ["fb-art-59-month-end-continuation", "fb-mid-month-not-day-split"], requiredProcessKeys: ["competence-change-during-month"] },
  { id: "german-benefit-higher-sk-primary", label: "Deutsche Leistung höher, SK vorrangig durch Tätigkeit und Kindwohnsitz", coverage: "COVERED", requiredClaimKeys: ["fb-higher-amount-not-automatic-primary", "fb-same-basis-activity-child-residence"], requiredProcessKeys: ["same-basis-activity-priority"] },
  { id: "slovak-benefit-higher-de-primary", label: "Slowakische Leistung hypothetisch höher, DE vorrangig", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_ART682_CLAIM_KEY, "fb-higher-amount-not-automatic-primary"], requiredProcessKeys: ["differential-supplement-orient"] },
  { id: "secondary-lower-than-primary", label: "Nachrangiger Anspruch niedriger als vorrangiger", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_ART682_CLAIM_KEY, "fb-secondary-not-full-second-benefit"], requiredProcessKeys: ["differential-supplement-orient"] },
  { id: "secondary-equal-to-primary", label: "Nachrangiger Anspruch gleich dem vorrangigen", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_ART682_CLAIM_KEY], requiredProcessKeys: ["differential-supplement-orient"] },
  { id: "secondary-higher-than-primary", label: "Nachrangiger Anspruch höher als vorrangiger", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_ART682_CLAIM_KEY, "fb-secondary-not-no-entitlement"], requiredProcessKeys: ["differential-supplement-orient"] },
  { id: "residence-only-secondary-child-in-that-state", label: "Nachrang nur Wohnsitz, Kind wohnt in diesem Staat", coverage: "COVERED", requiredClaimKeys: ["fb-residence-only-not-always-forbidden"], requiredProcessKeys: ["residence-only-supplement-exception"] },
  { id: "residence-only-secondary-child-in-other-state", label: "Nachrang nur Wohnsitz, Kind wohnt in einem anderen Staat", coverage: "COVERED", requiredClaimKeys: ["fb-residence-only-supplement-exception"], requiredProcessKeys: ["residence-only-supplement-exception"] },
  { id: "application-filed-first-in-primary", label: "Antrag zuerst im vorrangigen Staat", coverage: "COVERED", requiredClaimKeys: ["fb-primary-institution-pays-and-forwards"], requiredProcessKeys: ["primary-institution-art-60"] },
  { id: "application-filed-first-in-secondary", label: "Antrag zuerst im nachrangigen Staat", coverage: "COVERED", requiredClaimKeys: ["fb-art-68-3-forwarding", "fb-filed-secondary-not-lost"], requiredProcessKeys: ["application-forwarding"] },
  { id: "secondary-forwards-application", label: "Nachrangträger leitet den Antrag weiter", coverage: "COVERED", requiredClaimKeys: ["fb-art-68-3-forwarding"], requiredProcessKeys: ["application-forwarding"] },
  { id: "original-filing-date-preserved", label: "Ursprüngliches Antragsdatum bleibt erhalten", coverage: "COVERED", requiredClaimKeys: ["fb-filing-date-preserved"], requiredProcessKeys: ["application-forwarding"] },
  { id: "second-institution-responds-within-two-months", label: "Zweiter Träger antwortet innerhalb von zwei Monaten", coverage: "COVERED", requiredClaimKeys: ["fb-two-month-institution-response"], requiredProcessKeys: ["secondary-provisional-priority"] },
  { id: "second-institution-silent-two-months", label: "Zweiter Träger antwortet nicht innerhalb von zwei Monaten", coverage: "COVERED", requiredClaimKeys: ["fb-silence-makes-provisional-apply"], requiredProcessKeys: ["secondary-provisional-priority"] },
  { id: "institutions-disagree-on-priority", label: "Träger uneinig über den Vorrang", coverage: "COVERED", requiredClaimKeys: ["fb-disagreement-routes-to-art-6", "fb-family-does-not-choose-state"], requiredProcessKeys: ["institutional-disagreement"] },
  { id: "provisional-payment-made", label: "Vorläufige Zahlung geleistet", coverage: "COVERED", requiredClaimKeys: ["fb-provisional-not-final"], requiredProcessKeys: ["institutional-disagreement"] },
  { id: "provisional-overpayment-identified", label: "Vorläufige Überzahlung später festgestellt", coverage: "COVERED", requiredClaimKeys: ["fb-overpayment-institutional-settlement", "fb-family-not-told-repay-immediately"], requiredProcessKeys: ["institutional-disagreement"] },
  { id: "other-parent-submits-application", label: "Anderer Elternteil stellt den Antrag", coverage: "COVERED", requiredClaimKeys: ["fb-other-parent-may-apply"], requiredProcessKeys: ["applicant-vs-beneficiary"] },
  { id: "other-parent-assumes-payment-entitlement", label: "Anderer Elternteil hält Antrag für Auszahlungsanspruch", coverage: "COVERED", requiredClaimKeys: ["trapkowski-applicant-not-beneficiary", "fb-other-parent-not-automatic-payee"], requiredProcessKeys: ["applicant-vs-beneficiary"] },
  { id: "child-lives-abroad-national-entitlement-otherwise-exists", label: "Kind lebt im Ausland, nationaler Anspruch im Übrigen möglich", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_ART67_CLAIM_KEY, "fb-art-67-fiction-not-national-conditions"], requiredProcessKeys: ["art-67-eligibility-orient"] },
  { id: "user-thinks-child-must-live-in-employment-state", label: "Nutzer meint, Kind müsse im Beschäftigungsstaat wohnen", coverage: "COVERED", requiredClaimKeys: ["fb-child-need-not-live-in-employment-state"], requiredProcessKeys: ["art-67-eligibility-orient"] },
  { id: "nationality-proposed-as-priority", label: "Staatsangehörigkeit als Vorrangkriterium", coverage: "COVERED", requiredClaimKeys: ["fb-nationality-not-priority"], requiredProcessKeys: ["primary-state-determine"] },
  { id: "locale-proposed-as-priority", label: "Locale als Vorrangkriterium", coverage: "COVERED", requiredClaimKeys: ["fb-user-locale-not-priority"], requiredProcessKeys: ["primary-state-determine"] },
  { id: "kindergeld-national-not-verified", label: "Deutsche Kindergeldvoraussetzungen noch nicht verifiziert", coverage: "COVERED", requiredClaimKeys: ["fb-kindergeld-national-not-in-eu-core", "fb-national-rights-required-for-overlap"], requiredProcessKeys: ["national-entitlement-collect"] },
  { id: "elterngeld-national-not-verified", label: "Deutsche Elterngeldvoraussetzungen noch nicht verifiziert", coverage: "COVERED", requiredClaimKeys: ["fb-elterngeld-national-not-in-eu-core"], requiredProcessKeys: ["national-classifier-boundary"] },
  { id: "payment-named-child-benefit-classification-unknown", label: "Zahlung heißt child benefit, EU-Klassifikation unbekannt", coverage: "COVERED", requiredClaimKeys: ["fb-name-not-automatic-family-benefit", "fb-class-requires-authority"], requiredProcessKeys: ["fb-classification-gate"] },
  { id: "german-unterhaltsvorschuss", label: "Deutscher Unterhaltsvorschuss", coverage: "COVERED", requiredClaimKeys: ["fb-unterhaltsvorschuss-annex-i"], requiredProcessKeys: ["annex-i-exclusion-gate"] },
  { id: "special-childbirth-allowance-annex-i", label: "Besondere Geburtsbeihilfe in Anhang I", coverage: "COVERED", requiredClaimKeys: ["fb-special-childbirth-annex-i"], requiredProcessKeys: ["annex-i-exclusion-gate"] },
  { id: "user-wants-both-full-benefits", label: "Nutzer will beide volle Leistungen", coverage: "COVERED", requiredClaimKeys: ["fb-two-full-benefits-not-normal"], requiredProcessKeys: ["differential-supplement-orient"] },
  { id: "user-thinks-secondary-never-pays", label: "Nutzer meint, der nachrangige Staat zahle nie", coverage: "COVERED", requiredClaimKeys: ["fb-secondary-never-pays-false"], requiredProcessKeys: ["secondary-state-determine"] },
  { id: "exact-differential-without-national-amounts", label: "Genauer Unterschiedsbetrag ohne aktuelle nationale Beträge", coverage: "COVERED", requiredClaimKeys: ["fb-exact-amount-fail-closed"], requiredProcessKeys: ["exact-amount-fail-closed"] },
  { id: "different-benefit-periods", label: "Unterschiedliche Leistungszeiträume", coverage: "COVERED", requiredClaimKeys: ["fb-overlap-same-period-and-member", "fb-currency-period-fail-closed"], requiredProcessKeys: ["overlapping-rights-detect"] },
  { id: "multiple-children-same-residence", label: "Mehrere Kinder gleicher Wohnort", coverage: "COVERED", requiredClaimKeys: ["fb-multiple-children-not-one-child-state"], requiredProcessKeys: ["whole-family-fact-model"] },
  { id: "children-in-different-member-states", label: "Kinder in verschiedenen Mitgliedstaaten", coverage: "COVERED", requiredClaimKeys: ["fb-multiple-children-not-one-child-state"], requiredProcessKeys: ["whole-family-fact-model"] },
  { id: "spouse-starts-employment-during-claim", label: "Ehegatte nimmt während des Anspruchszeitraums Arbeit auf", coverage: "COVERED", requiredClaimKeys: ["fb-second-parent-activity-can-change-priority", "fb-fact-change-requires-reclassification"], requiredProcessKeys: ["family-fact-change-reclass"] },
  { id: "child-moves-de-to-sk", label: "Kind zieht DE nach SK", coverage: "COVERED", requiredClaimKeys: ["fb-fact-change-requires-reclassification", "fb-child-residence-can-change-priority"], requiredProcessKeys: ["family-fact-change-reclass"] },
  { id: "worker-changes-de-to-sk-employment", label: "Beschäftigung wechselt DE nach SK", coverage: "COVERED", requiredClaimKeys: ["fb-fact-change-requires-reclassification", "fb-art-59-month-end-continuation"], requiredProcessKeys: ["competence-change-during-month"] },
  { id: "pension-based-claimant", label: "Rentenbasierte antragstellende Person", coverage: "COVERED", requiredClaimKeys: ["fb-basis-pension", "fb-art-67-pensioner-rule-distinct"], requiredProcessKeys: ["same-basis-pension-priority"] },
  { id: "orphan-special-family-benefit", label: "Besondere Waisenfamilienleistung", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_ART69_CLAIM_KEY], requiredProcessKeys: ["art-69-orphan-route"] },
  { id: "cod-2016-0397-reform-question", label: "Frage zur vorgeschlagenen Reform 2016/0397", coverage: "COVERED", requiredClaimKeys: ["pending-cod-2016-0397-family-not-current"], requiredProcessKeys: ["current-vs-proposed-reform-gate"] },
  { id: "proposed-child-raising-treated-as-current", label: "Vorgeschlagene Kindererziehungsregel als geltendes Recht", coverage: "COVERED", requiredClaimKeys: ["proposed-child-raising-category-not-current"], requiredProcessKeys: ["current-vs-proposed-reform-gate"] },
  { id: "uk-specific-case", label: "UK-spezifischer Fall", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["fb-uk-family-out-of-scope"], requiredProcessKeys: ["national-classifier-boundary"] },
  { id: "non-eu-bilateral-family-benefit", label: "Nicht-EU-bilateraler Familienleistungsfall", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["fb-non-eu-bilateral-out-of-scope"], requiredProcessKeys: ["national-classifier-boundary"] },
  { id: "locale-sk-factual-de-cz", label: "Locale SK, Sachverhalt DE-CZ", coverage: "COVERED", requiredClaimKeys: ["fb-user-locale-not-priority"], requiredProcessKeys: ["primary-state-determine"] },
  { id: "factual-de-sk-locale-hu", label: "Künftiger DE-SK-Fall, Locale HU", coverage: "COVERED", requiredClaimKeys: ["fb-user-locale-not-priority"], requiredProcessKeys: ["primary-state-determine"] },
  { id: "f3-per-family-member-comparison", label: "Beschluss F3 Vergleich je Familienmitglied", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_F3_CLAIM_KEY, "fb-f3-secondary-compares-baskets"], requiredProcessKeys: ["decision-f3-basket-method"] },
  { id: "f3-not-one-to-one-pairing", label: "Einzelleistungspaar statt F3-Korb", coverage: "COVERED", requiredClaimKeys: ["fb-f3-not-one-benefit-pair", "fb-f3-not-two-full-benefits"], requiredProcessKeys: ["decision-f3-basket-method"] },
]);

export const EU_FAMILY_NEGATIVE_CONTROLS = Object.freeze([
  "fb-nationality-not-priority",
  "fb-user-locale-not-priority",
  "fb-applicable-legislation-not-automatic-primary",
  "fb-child-residence-not-always-primary",
  "fb-higher-amount-not-automatic-primary",
  "fb-activity-before-pension-before-residence",
  "fb-two-full-benefits-not-normal",
  "fb-secondary-not-no-entitlement",
  "fb-secondary-not-full-second-benefit",
  "fb-residence-only-not-always-payable",
  "fb-residence-only-not-always-forbidden",
  "fb-child-abroad-not-automatic-loss",
  "fb-art-67-fiction-not-national-conditions",
  "fb-other-parent-not-automatic-payee",
  "fb-filed-secondary-not-lost",
  "fb-application-not-approval",
  "fb-two-month-not-user-payment-guarantee",
  "fb-family-does-not-choose-state",
  "fb-provisional-not-final",
  "fb-mid-month-not-day-split",
  "fb-name-not-automatic-family-benefit",
  "fb-unterhaltsvorschuss-annex-i",
  "pending-cod-2016-0397-family-not-current",
  "proposed-child-raising-category-not-current",
  "fb-f3-not-one-benefit-pair",
  "fb-f3-not-two-full-benefits",
  "fb-employed-and-self-employed-same-activity-tier",
  "fb-self-employed-not-automatic-residence",
  "fb-self-employment-not-automatic-national-right",
  "fb-single-person-mixed-not-two-activity-rights",
  "fb-zero-income-not-activity-ceased",
  "fb-dormant-registration-not-current-activity",
  "fb-company-owner-not-automatic-self-employed",
  "fb-mixed-income-not-two-article-68-states",
  "fb-business-registration-not-priority",
  "fb-tax-residence-not-priority",
  "fb-business-closure-not-automatic-benefit-end",
]);

export function evaluateEuFamilyProcessCompleteness(
  pack: {
    claims: readonly { key: string }[];
    processes: readonly { key: string; id: string }[];
    processClaimLinks: readonly Record<string, unknown>[];
  },
) {
  const processKeys = new Set(pack.processes.map((process) => process.key));
  const claimKeys = new Set(pack.claims.map((claim) => claim.key));
  const incomplete = EU_FAMILY_PROCESSES.filter((process) => (
    PROCESS_COMPLETE_DIMENSIONS.some((dimension) => !claimKeys.has(process.dimensions[dimension]))
  ));
  const blocked = EU_FAMILY_SCENARIOS.filter((scenario) => scenario.coverage === "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE");
  const covered = EU_FAMILY_SCENARIOS.filter((scenario) => scenario.coverage === "COVERED");
  const outOfScope = EU_FAMILY_SCENARIOS.filter((scenario) => scenario.coverage === "EXPLICITLY_OUT_OF_SCOPE");
  const uncoveredRequired = covered.flatMap((scenario) => [
    ...scenario.requiredProcessKeys.filter((key) => !processKeys.has(key)).map((key) => `process:${scenario.id}:${key}`),
    ...scenario.requiredClaimKeys.filter((key) => !claimKeys.has(key)).map((key) => `claim:${scenario.id}:${key}`),
  ]);
  const processComplete = incomplete.length === 0 && uncoveredRequired.length === 0
    && pack.processes.length === EU_FAMILY_PROCESSES.length;
  return Object.freeze({
    processCount: pack.processes.length,
    processComplete,
    processCompletenessPercent: processComplete ? 100 : 0,
    blockedScenarioCount: blocked.length,
    coveredScenarioCount: covered.length,
    outOfScopeScenarioCount: outOfScope.length,
    processScenarioCount: EU_FAMILY_SCENARIOS.length,
    totalScenarios: EU_FAMILY_SCENARIOS.length,
    incompleteProcessKeys: incomplete.map((process) => process.key),
    uncoveredRequired,
  });
}

export type EuFamilyBenefitsCoordinationPack = ReturnType<typeof buildEuFamilyBenefitsCoordinationPack>;

export function buildEuFamilyBenefitsCoordinationPack() {
  const item = factory(EU_FAMILY_PACK_ID);
  const trustDomain = item("trustDomain", "eu", { code: "eu" as const, name: "Europäische Union" });
  const jurisdiction = item("jurisdictions", "eu", {
    level: "eu" as const, code: "EU" as const, countryCode: "EU" as const, name: "Europäische Union",
  });
  const scope = item("territorialScopes", "eu", {
    type: "eu", jurisdictionIds: [jurisdiction.id], landCodes: [], kreisCodes: [], municipalityCodes: [],
  });
  const publishers = {
    eurlex: item("publishers", "eurlex", {
      name: "Amt für Veröffentlichungen der Europäischen Union", type: "eu_publication",
      territorialScopeId: scope.id, trustDomainId: trustDomain.id,
    }),
    commission: item("publishers", "commission", {
      name: "Europäische Kommission", type: "eu_institution",
      territorialScopeId: scope.id, trustDomainId: trustDomain.id,
    }),
    oeil: item("publishers", "oeil-family", {
      name: "Europäisches Parlament Observatoire législatif", type: "eu_institution",
      territorialScopeId: scope.id, trustDomainId: trustDomain.id,
    }),
  };
  const authorities = {
    eurlex: item("authorities", "eurlex-authority", {
      publisherId: publishers.eurlex.id, name: "EUR-Lex", type: "eu_publication",
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      officialPortalUrl: "https://eur-lex.europa.eu",
    }),
    commission: item("authorities", "commission-authority", {
      publisherId: publishers.commission.id, name: "Europäische Kommission", type: "eu_institution",
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      officialPortalUrl: "https://commission.europa.eu",
    }),
    oeil: item("authorities", "oeil-family-authority", {
      publisherId: publishers.oeil.id, name: "Europäisches Parlament OEIL", type: "eu_institution",
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      officialPortalUrl: "https://oeil.europarl.europa.eu",
    }),
  };
  const publisherOf = { eurlex: publishers.eurlex, commission: publishers.commission, oeil: publishers.oeil };
  const authorityOf = { eurlex: authorities.eurlex, commission: authorities.commission, oeil: authorities.oeil };

  const sources = EU_FAMILY_OFFICIAL_SOURCES.map((spec) => {
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
    const riskClass = spec.handlingMode === "FETCH_LIVE" ? "MEDIUM" : spec.handlingMode === "DO_NOT_ANSWER_WITHOUT_CONTEXT" ? "HIGH" : "MEDIUM";
    const staleBehavior = spec.handlingMode === "FETCH_LIVE" ? "REVALIDATE_BEFORE_USE" : spec.staleBehavior;
    const policy = item("handlingPolicies", `${spec.key}:policy`, {
      sourceId: source.id, informationClass: spec.informationClass, handlingMode: spec.handlingMode,
      freshnessClass: spec.freshnessClass, staleBehavior,
      requiredContextKeys: spec.handlingMode === "FETCH_LIVE"
        ? ["COUNTRY", "RESIDENCE_STATE"]
        : spec.handlingMode === "DO_NOT_ANSWER_WITHOUT_CONTEXT"
          ? ["RESIDENCE_STATE", "WORK_STATE"]
          : spec.handlingMode === "CACHE_AND_REVALIDATE"
            ? ["PROCESS_VARIANT"]
            : [],
      riskClass,
    });
    const freshness = item("freshnessRecords", `${spec.key}:freshness`, {
      entityType: "source", entityId: source.id, status: "fresh", effectiveDateKnown: true,
    });
    return { spec, source, version, passages, policy, freshness };
  });
  const passageByKey = new Map(sources.flatMap(({ passages }) => passages.map((passage) => [passage.key, passage])));
  const sourceByKey = new Map(sources.map((entry) => [entry.spec.key, entry]));

  const claims = EU_FAMILY_UNITS.map((unit) => {
    const source = sourceByKey.get(unit.sourceKey);
    const passage = passageByKey.get(unit.passageKey);
    if (!source || !passage) throw new Error(`EU_FAMILY_UNIT_SOURCE_MISSING:${unit.key}`);
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

  const processes = EU_FAMILY_PROCESSES.map((spec) => item("processes", spec.key, {
    processGroupId: EU_FAMILY_PROCESS_GROUP, title: spec.title, jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id, riskLevel: spec.riskLevel, trigger: spec.trigger,
    safeFirstStep: spec.safeFirstStep, regionalVariationExpected: false,
  }));
  const processByKey = new Map(processes.map((process) => [String(process.key), process]));
  const claimByKey = new Map(claims.map(({ claim }) => [String(claim.key), claim]));
  const processClaimLinks: Entity[] = [];
  const seen = new Set<string>();
  const addLink = (processKey: string, claimKey: string, role: string) => {
    const token = `${processKey}:${claimKey}:${role}`;
    if (seen.has(token)) return;
    const stored = processByKey.get(processKey);
    const claim = claimByKey.get(claimKey);
    if (!stored || !claim) throw new Error(`EU_FAMILY_PROCESS_CLAIM_MISSING:${processKey}:${claimKey}`);
    seen.add(token);
    processClaimLinks.push(item("processClaimLinks", token, {
      processId: stored.id, claimId: claim.id, role, required: true,
      sequenceContext: role, qualificationRequired: false,
    }));
  };
  for (const process of EU_FAMILY_PROCESSES) {
    for (const dimension of PROCESS_COMPLETE_DIMENSIONS) {
      addLink(process.key, process.dimensions[dimension], dimension);
    }
  }
  for (const scenario of EU_FAMILY_SCENARIOS) {
    if (scenario.coverage !== "COVERED") continue;
    for (const processKey of scenario.requiredProcessKeys) {
      for (const claimKey of scenario.requiredClaimKeys) {
        addLink(processKey, claimKey, "scenario");
      }
    }
  }

  return Object.freeze({
    schemaVersion: 1 as const,
    packId: EU_FAMILY_PACK_ID,
    canonicalLanguage: EU_FAMILY_CANONICAL_LANGUAGE,
    trustDomain,
    jurisdictions: [jurisdiction],
    territorialScopes: [scope],
    publishers: [publishers.eurlex, publishers.commission, publishers.oeil],
    authorities: [authorities.eurlex, authorities.commission, authorities.oeil],
    sources: sources.map(({ source }) => source),
    sourceVersions: sources.map(({ version }) => version),
    passages: sources.flatMap(({ passages }) => passages),
    claims: claims.map(({ claim }) => claim),
    evidenceLinks: claims.map(({ evidence }) => evidence),
    citations: claims.map(({ citation }) => citation),
    processes,
    processClaimLinks,
    handlingPolicies: sources.map(({ policy }) => policy),
    freshnessRecords: [
      ...sources.map(({ freshness }) => freshness),
      ...claims.map(({ claimFreshness }) => claimFreshness),
    ],
  });
}

export function validateEuFamilyBenefitsCoordinationPack(
  pack: EuFamilyBenefitsCoordinationPack,
) {
  const issues: string[] = [];
  if (pack.schemaVersion !== 1 || pack.packId !== EU_FAMILY_PACK_ID) issues.push("EU_FAMILY_IDENTITY_INVALID");
  if (pack.canonicalLanguage !== "de") issues.push("INVALID_CANONICAL_LANGUAGE");
  if (pack.trustDomain.code !== "eu") issues.push("EU_TRUST_DOMAIN_REQUIRED");
  for (const jurisdiction of pack.jurisdictions) {
    if (jurisdiction.level !== "eu" || jurisdiction.countryCode !== "EU") issues.push("EU_JURISDICTION_REQUIRED");
  }
  if (pack.claims.some((claim) => claim.temporalClass !== "CURRENT")) issues.push("NON_CURRENT_CLAIM");
  if (EU_FAMILY_FUTURE_WATCH.some((item) => item.ingestible)) issues.push("WATCH_ITEM_MARKED_INGESTIBLE");
  const urls = pack.sources.map((source) => String(source.canonicalUrl));
  if (new Set(urls).size !== urls.length) issues.push("DUPLICATE_CANONICAL_URL");
  if (urls.some((url) => url.includes("#"))) issues.push("HASH_IN_CANONICAL_URL");
  const forbidden = /wikipedia|reddit|linkedin|expat|blog|forum|anwalt|kanzlei/iu;
  if (urls.some((url) => forbidden.test(url))) issues.push("NON_AUTHORITATIVE_CANONICAL_URL");
  const completeness = evaluateEuFamilyProcessCompleteness(pack);
  if (completeness.blockedScenarioCount !== 0) issues.push("BLOCKED_SCENARIOS");
  if (completeness.processCompletenessPercent !== 100) issues.push("PROCESS_INCOMPLETE");
  if (!EU_FAMILY_NEGATIVE_CONTROLS.every((key) => pack.claims.some((claim) => claim.key === key))) {
    issues.push("MISSING_NEGATIVE_CONTROL");
  }
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    authoringUsesKeysNotDatabaseUuids: true,
    productionEligible: false,
  });
}

export function euFamilyPackSummary(
  pack: EuFamilyBenefitsCoordinationPack = buildEuFamilyBenefitsCoordinationPack(),
) {
  const completeness = evaluateEuFamilyProcessCompleteness(pack);
  return Object.freeze({
    packId: pack.packId,
    canonicalLanguage: pack.canonicalLanguage,
    claimCount: pack.claims.length,
    legacyCount: 0,
    futureCount: EU_FAMILY_FUTURE_WATCH.length,
    proposedNotCurrentCount: EU_FAMILY_FUTURE_WATCH.filter((item) => item.temporalClass === "PROPOSED_NOT_CURRENT").length,
    sourceCount: pack.sources.length,
    processClaimLinkCount: pack.processClaimLinks.length,
    ...completeness,
    processCount: pack.processes.length,
    validation: validateEuFamilyBenefitsCoordinationPack(pack),
  });
}
