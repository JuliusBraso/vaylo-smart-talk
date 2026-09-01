/**
 * CB-0E — Shared EU health-insurance coordination / S1 / EHIC / S2 core.
 * Stored once for later DE↔SK / DE↔CZ / DE↔PL / DE↔HU health connectors.
 * Does not re-determine applicable legislation. Canonical language de; source jurisdiction EU.
 */
import { createHash } from "node:crypto";

import { COD_2016_0397_STATUS } from "../../../source-registry/cross-border-connector-contracts";
import { stableKnowledgeFactoryId } from "../../../source-registry/knowledge-factory-contracts";
import { PROCESS_COMPLETE_DIMENSIONS } from "../applicable-legislation/eu-applicable-legislation-core-pack";

export const EU_HEALTH_PACK_ID = "eu_health_insurance_coordination" as const;
export const EU_HEALTH_CANONICAL_LANGUAGE = "de" as const;
export const EU_HEALTH_TRUST_DOMAIN = "eu" as const;
export const EU_HEALTH_PROCESS_GROUP = "eu_health_insurance_coordination" as const;
export const EU_SHARED_S1_CLAIM_KEY = "s1-purpose" as const;
export const EU_SHARED_EHIC_CLAIM_KEY = "ehic-purpose" as const;
export const EU_SHARED_S2_CLAIM_KEY = "s2-purpose" as const;
export const EU_SHARED_ART17_CLAIM_KEY = "art-17-residence-benefits-in-kind" as const;

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

export const GERMAN_HEALTH_PACK_BOUNDARY = Object.freeze([
  {
    pack: "health_insurance_orientation",
    keys: ["s1-is-entitlement-certificate", "s1-not-same-as-a1", "a1-is-applicable-law-certificate"],
    note: "DE-local GKV/PKV orientation remains the German classification source. This EU core stores coordination functions only. No German pack rewrite in CB-0E.",
  },
] as const);

export const EU_HEALTH_FUTURE_WATCH = Object.freeze([
  {
    key: "cod-2016-0397-health-revision",
    temporalClass: COD_2016_0397_STATUS,
    text: "Das Gesetzgebungsverfahren 2016/0397(COD) bleibt vorgeschlagene, nicht geltende Revision der Verordnungen 883/2004 und 987/2009, solange keine amtliche EU-Verkündung und Anwendbarkeit vorliegt.",
    ingestible: false,
  },
] as const);

export type EuHealthCaseFacts = Readonly<{
  competentState?: string | null;
  applicableLegislationVerified?: boolean | null;
  insuranceSystemType?: "STATUTORY" | "PRIVATE" | "UNCLEAR" | null;
  residenceEstablished?: boolean | null;
  temporaryStayState?: string | null;
  treatmentState?: string | null;
  treatmentIsPlanned?: boolean | null;
  treatmentWasPurposeOfTravel?: boolean | null;
  familyMemberRole?: string | null;
  familyDependencyStatusKnown?: boolean | null;
  s1Status?: string | null;
  ehicStatus?: string | null;
  s2Status?: string | null;
  publicProvider?: boolean | null;
}>;

export function detectMissingHealthFacts(facts: EuHealthCaseFacts): readonly string[] {
  const missing: string[] = [];
  if (facts.applicableLegislationVerified !== true || !facts.competentState) {
    missing.push("competentState");
  }
  if (facts.residenceEstablished == null) missing.push("residenceVsStay");
  if (facts.insuranceSystemType == null || facts.insuranceSystemType === "UNCLEAR") {
    missing.push("insuranceSystemType");
  }
  return Object.freeze(missing);
}

type SourceSpec = Readonly<{
  key: string;
  publisherKey: "eurlex" | "commission" | "youreurope";
  url: string;
  officialDomain: string;
  title: string;
  sourceClass: "EU_LAW" | "EU_OFFICIAL_GUIDANCE";
  sourceType: string;
  retrievalMethod: "HTML_DOCUMENT" | "PDF_DOCUMENT";
  informationClass: "LEGAL_BASELINE" | "PROCESS_IDENTITY" | "AUTHORITY_COMPETENCE" | "ELIGIBILITY" | "CONTACT_DETAILS";
  handlingMode: "STORE_CANONICALLY" | "CACHE_AND_REVALIDATE" | "FETCH_LIVE" | "DO_NOT_ANSWER_WITHOUT_CONTEXT";
  freshnessClass: "LEGAL_CHANGE_MONITORED" | "EVENT_DRIVEN";
  staleBehavior: "DO_NOT_USE_STALE" | "REVALIDATE_BEFORE_USE";
  passages: readonly Readonly<{ key: string; locator: string; text: string }>[];
}>;

export const EU_HEALTH_OFFICIAL_SOURCES: readonly SourceSpec[] = Object.freeze([
  {
    key: "vo-883-health",
    publisherKey: "eurlex",
    url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:02004R0883-20190731",
    officialDomain: "eur-lex.europa.eu",
    title: "Verordnung (EG) Nr. 883/2004 konsolidiert 31.07.2019 Titel III Kapitel 1 Sachleistungen",
    sourceClass: "EU_LAW",
    sourceType: "eu_regulation",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    passages: [
      { key: "vo-883-h-art-1", locator: "Art. 1", text: "Familienangehörige sind Personen, die nach den Rechtsvorschriften des Mitgliedstaats, in dem sie als Familienangehörige gelten, als solche bestimmt oder anerkannt sind. Die unionsrechtliche Koordinierung setzt diese nationale Klassifikation voraus und ersetzt sie nicht durch eine eigene universelle Verwandtschaftsliste." },
      { key: "vo-883-h-art-17", locator: "Art. 17", text: "Ein Versicherter und seine Familienangehörigen, die in einem anderen als dem zuständigen Mitgliedstaat wohnen, erhalten in dem Wohnmitgliedstaat Sachleistungen vom Träger des Wohnorts für Rechnung des zuständigen Trägers nach den für den Wohnortträger geltenden Rechtsvorschriften, als wären sie nach diesen Rechtsvorschriften versichert." },
      { key: "vo-883-h-art-18", locator: "Art. 18", text: "Die in Artikel 17 genannten Versicherten und Familienangehörigen haben vorbehaltlich Absatz 2 auch während eines Aufenthalts im zuständigen Mitgliedstaat Anspruch auf Sachleistungen, die der zuständige Träger nach seinen Rechtsvorschriften auf eigene Rechnung erbringt, als wohnten die Personen dort. Familienangehörige eines Grenzarbeitnehmers haben während des Aufenthalts im zuständigen Mitgliedstaat Anspruch auf Sachleistungen; ist dieser Mitgliedstaat in Anhang III aufgeführt, gilt für im selben Staat wie der Grenzarbeitnehmer wohnende Familienangehörige nur Artikel 19 Absatz 1." },
      { key: "vo-883-h-annex-iii", locator: "Anhang III", text: "Anhang III beschränkt den Sachleistungsanspruch von Familienangehörigen eines Grenzarbeitnehmers im zuständigen Mitgliedstaat. Die geltende konsolidierte Fassung vom 31. Juli 2019 nennt Dänemark, Irland, Kroatien, Finnland, Schweden und das Vereinigte Königreich. Die nach Artikel 87 Absatz 10a befristeten Einträge Estland, Spanien, Italien, Litauen, Ungarn und Niederlande sind abgelaufen. Deutschland und die Slowakei sind nicht aufgeführt. Anhänge können geändert werden und sind vor Gebrauch zu revalidieren." },
      { key: "vo-883-h-art-19", locator: "Art. 19", text: "Ein Versicherter und seine Familienangehörigen, die sich in einem anderen als dem zuständigen Mitgliedstaat aufhalten, haben Anspruch auf die Sachleistungen, die sich während des Aufenthalts als medizinisch notwendig erweisen, unter Berücksichtigung der Art der Leistungen und der voraussichtlichen Aufenthaltsdauer. Der Anspruch ist nicht auf Notfälle beschränkt und umfasst nicht die eigens zum Zweck der Behandlung angetretene Reise." },
      { key: "vo-883-h-art-20", locator: "Art. 20", text: "Sofern in dieser Verordnung nichts anderes bestimmt ist, muss ein Versicherter, der sich in einen anderen Mitgliedstaat begibt, um dort während des Aufenthalts Sachleistungen zu erhalten, die Genehmigung des zuständigen Trägers einholen. Die Genehmigung ist zu erteilen, wenn die betreffende Behandlung zu den Leistungen gehört, die nach den Rechtsvorschriften des Wohnmitgliedstaats vorgesehen sind, und sie unter Berücksichtigung des derzeitigen Gesundheitszustands und des voraussichtlichen Verlaufs der Krankheit nicht innerhalb eines in medizinischer Hinsicht vertretbaren Zeitraums gewährt werden kann." },
      { key: "vo-883-h-art-21", locator: "Art. 21", text: "Ein Versicherter und seine Familienangehörigen, die in einem anderen als dem zuständigen Mitgliedstaat wohnen, haben Anspruch auf Geldleistungen des zuständigen Trägers nach den von diesem angewandten Rechtsvorschriften. Geldleistungen bei Krankheit sind nicht dieselben Leistungen wie Sachleistungen der Krankenbehandlung." },
    ],
  },
  {
    key: "vo-987-health",
    publisherKey: "eurlex",
    url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:02009R0987-20190731",
    officialDomain: "eur-lex.europa.eu",
    title: "Verordnung (EG) Nr. 987/2009 konsolidiert Durchführung Krankenbehandlung",
    sourceClass: "EU_LAW",
    sourceType: "eu_regulation",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    passages: [
      { key: "vo-987-h-art-11", locator: "Art. 11", text: "Für die Anwendung der Verordnung ist Wohnort der Ort, an dem eine Person gewöhnlich wohnt und der den gewöhnlichen Mittelpunkt ihrer Interessen bildet. Zu berücksichtigen sind unter anderem Aufenthaltsdauer und -kontinuität, familiäre Situation und Wohnverhältnisse. Eine melderechtliche Anschrift, trvalý pobyt oder Anmeldung begründet den unionsrechtlichen Wohnort nicht automatisch." },
      { key: "vo-987-h-art-23", locator: "Art. 23", text: "Hat der Wohnmitgliedstaat oder der Mitgliedstaat des Aufenthalts mehrere Versicherungssysteme für Leistungen bei Krankheit, Mutterschaft oder entsprechender Vaterschaft für verschiedene Kategorien von Versicherten, so gelten für die Anwendung der Artikel 17, 19 Absatz 1, 20, 24 und 26 der Grundverordnung die Vorschriften über das allgemeine System für beschäftigte Personen. Das ist eine Koordinierungsregel für das anwendbare Leistungsschema und macht Selbständige nicht zu Beschäftigten und begründet nicht automatisch gesetzliche Krankenversicherung." },
      { key: "vo-987-h-art-24", locator: "Art. 24", text: "Für Artikel 17 der Grundverordnung stellt der zuständige Träger dem Versicherten und den Familienangehörigen auf Antrag eine Bescheinigung über den Anspruch auf Sachleistungen aus. Die Person legt die Bescheinigung dem Träger des Wohnorts vor, der die Eintragung vornimmt und den zuständigen Träger unterrichtet. Der Wohnortträger kann die Bescheinigung auch beim zuständigen Träger anfordern. Die Eintragung bleibt wirksam, bis der zuständige Träger dem Wohnortträger die Beendigung mitteilt." },
      { key: "vo-987-h-art-25", locator: "Art. 25", text: "Für Sachleistungen bei Aufenthalt dient insbesondere die Europäische Krankenversicherungskarte oder eine Ersatzbescheinigung als Nachweis. Hat die Person Kosten selbst getragen, kann sie Erstattung beim zuständigen Träger oder unter den Durchführungsregeln beim Aufenthaltssträger beantragen. Die genaue Erstattungshöhe hängt von Behandlung, Aufenthaltsstaat und öffentlichem System ab und darf ohne Sachverhalt nicht zugesagt werden." },
      { key: "vo-987-h-art-26", locator: "Art. 26", text: "Der Antrag auf Genehmigung geplanter Behandlung ist an den zuständigen Träger zu richten. Wohnt die Person nicht im zuständigen Mitgliedstaat, kann der Wohnortträger den Antrag entgegennehmen und weiterleiten; der zuständige Träger entscheidet. Bei vital notwendiger dringender Behandlung gelten die besonderen Verfahrensregeln der Durchführungsverordnung. Wohnortträger und zuständiger Träger sind nicht dieselbe Stelle." },
      { key: "vo-987-h-art-27", locator: "Art. 27", text: "Geldleistungen bei Krankheit werden vom zuständigen Träger nach seinen Rechtsvorschriften gewährt. Das Verfahren der Sachleistungen und die Dokumente S1 oder EHIC bestimmen nicht die Höhe eines nationalen Krankengeldes." },
    ],
  },
  {
    key: "ehic-commission",
    publisherKey: "commission",
    url: "https://employment-social-affairs.ec.europa.eu/policies-and-activities/moving-working-europe/eu-social-security-coordination/european-health-insurance-card_en",
    officialDomain: "employment-social-affairs.ec.europa.eu",
    title: "European Commission: European Health Insurance Card",
    sourceClass: "EU_OFFICIAL_GUIDANCE",
    sourceType: "official_guidance",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    passages: [
      { key: "ehic-commission-text", locator: "EHIC", text: "The European Health Insurance Card allows access to medically necessary, state-provided healthcare during a temporary stay in another coordinated country, under the same conditions and cost-sharing as persons insured there. It is issued by the national health insurance provider of the competent insurance state. If the person moves and makes another country the habitual residence, registration with the S1 form is required instead of relying on the EHIC." },
    ],
  },
  {
    key: "planned-treatment-commission",
    publisherKey: "commission",
    url: "https://employment-social-affairs.ec.europa.eu/policies-and-activities/moving-working-europe/eu-social-security-coordination/planned-medical-treatment_en",
    officialDomain: "employment-social-affairs.ec.europa.eu",
    title: "European Commission: Planned medical treatment",
    sourceClass: "EU_OFFICIAL_GUIDANCE",
    sourceType: "official_guidance",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "ELIGIBILITY",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    passages: [
      { key: "planned-treatment-commission-text", locator: "Planned treatment", text: "If getting treatment was not the purpose of the journey, medically necessary care during a temporary stay is covered under the European Health Insurance Card, including care linked to chronic illness or pregnancy, and is not limited to emergencies. If the purpose of travel is to obtain treatment, prior authorisation and the S2 route under the Regulations may be required. A long waiting list does not by itself guarantee authorisation." },
    ],
  },
  {
    key: "youreurope-s-forms",
    publisherKey: "youreurope",
    url: "https://europa.eu/youreurope/citizens/work/social-security-and-benefits/social-security-forms/faq/index_de.htm",
    officialDomain: "europa.eu",
    title: "Your Europe: Standardformulare S1 S2 EHIC",
    sourceClass: "EU_OFFICIAL_GUIDANCE",
    sourceType: "official_guidance",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    passages: [
      { key: "youreurope-s-forms-text", locator: "Portable documents", text: "Das Formular S1 dient der Anmeldung zur Gesundheitsversorgung im Wohnstaat, wenn die Versicherung in einem anderen koordinierten Staat besteht. Das Formular S2 weist die Genehmigung geplanter Behandlung in einem anderen koordinierten Staat nach. Die Europäische Krankenversicherungskarte betrifft medizinisch notwendige Versorgung bei vorübergehendem Aufenthalt. A1 bescheinigt die anwendbaren Rechtsvorschriften und ist keines dieser Gesundheitsdokumente." },
    ],
  },
  {
    key: "youreurope-unplanned",
    publisherKey: "youreurope",
    url: "https://europa.eu/youreurope/citizens/health/unplanned-healthcare/temporary-stays/index_de.htm",
    officialDomain: "europa.eu",
    title: "Your Europe: Ungeplante Gesundheitsversorgung bei vorübergehendem Aufenthalt",
    sourceClass: "EU_OFFICIAL_GUIDANCE",
    sourceType: "official_guidance",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "ELIGIBILITY",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    passages: [
      { key: "youreurope-unplanned-text", locator: "Temporary stay", text: "Bei vorübergehendem Aufenthalt besteht Anspruch auf öffentlich vorgesehene, medizinisch notwendige Behandlung zu denselben Bedingungen und Zuzahlungen wie versicherte Personen vor Ort. Die Karte ist keine Reiseversicherung, keine Garantie kostenfreier Behandlung und keine Garantie privater Leistungserbringer." },
    ],
  },
  {
    key: "youreurope-planned",
    publisherKey: "youreurope",
    url: "https://europa.eu/youreurope/citizens/health/planned-healthcare/index_de.htm",
    officialDomain: "europa.eu",
    title: "Your Europe: Geplante Gesundheitsversorgung",
    sourceClass: "EU_OFFICIAL_GUIDANCE",
    sourceType: "official_guidance",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "ELIGIBILITY",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    passages: [
      { key: "youreurope-planned-text", locator: "Planned healthcare", text: "Für geplante Behandlung im anderen Mitgliedstaat kann die Genehmigung nach der Verordnung 883/2004 mit Dokument S2 oder ein anderer Weg nach der Richtlinie 2011/24/EU in Betracht kommen. Die Wege unterscheiden sich in Genehmigung, Erstattungsgrundlage und Wahl des Leistungserbringers. Dieser Kern beantwortet keine Erstattungsfragen der Richtlinie aus der S2-Logik." },
    ],
  },
  {
    key: "directive-2011-24",
    publisherKey: "eurlex",
    url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32011L0024",
    officialDomain: "eur-lex.europa.eu",
    title: "Richtlinie 2011/24/EU Patientenrechte in der grenzüberschreitenden Gesundheitsversorgung",
    sourceClass: "EU_LAW",
    sourceType: "eu_directive",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    passages: [
      { key: "directive-2011-24-text", locator: "Richtlinie 2011/24/EU", text: "Die Richtlinie 2011/24/EU über Patientenrechte in der grenzüberschreitenden Gesundheitsversorgung ist ein anderer Rechtsrahmen als die Verordnungen 883/2004 und 987/2009. Sie ersetzt weder Artikel 20 noch das Dokument S2 und begründet in diesem Kern keine Erstattungsmaschine." },
    ],
  },
  {
    key: "health-institution-directory",
    publisherKey: "commission",
    url: "https://ec.europa.eu/social/main.jsp?catId=1025&langId=de",
    officialDomain: "ec.europa.eu",
    title: "Europäische Kommission: Kontaktstellen Gesundheitsversorgung",
    sourceClass: "EU_OFFICIAL_GUIDANCE",
    sourceType: "official_directory",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "CONTACT_DETAILS",
    handlingMode: "FETCH_LIVE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    passages: [
      { key: "health-institution-directory-text", locator: "Institution directory", text: "Die genaue ausstellende Krankenkasse, der Wohnortträger und aktuelle Antragsadressen sind live im amtlichen Verzeichnis zu ermitteln. Auf EU-Ebene werden nur Kompetenzgrundsätze gespeichert." },
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

export const EU_HEALTH_UNITS: readonly Unit[] = Object.freeze([
  { key: "health-source-eu-not-national-competence", category: "principle", type: "boundary", text: "Quellenjurisdiktion EU ist nicht dasselbe wie ein zuständiger Krankenversicherungsstaat DE oder ein Wohnstaat SK.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-17", riskLevel: "high" },
  { key: "current-883-987-health-baseline", category: "principle", type: "definition", text: "Geltende Grundlage der unionsrechtlichen Krankenbehandlungskoordinierung sind die aktuellen Verordnungen 883/2004 und 987/2009.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-17", riskLevel: "high" },
  { key: "pending-cod-2016-0397-health-not-current", category: "principle", type: "exception", text: "Das Verfahren 2016/0397(COD) ist vorgeschlagene, nicht geltende Revision und wird nicht als aktuelles Krankenbehandlungsrecht gespeichert.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-17", riskLevel: "high" },
  { key: "health-requires-applicable-legislation-result", category: "dependency", type: "procedure", text: "Die Krankenbehandlungskoordinierung setzt den zuständigen Staat aus dem anwendbaren Sozialversicherungsrecht voraus und bestimmt Artikel 11 nicht selbst neu.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-17", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "work-state-not-automatic-health-competence", category: "dependency", type: "exception", text: "Der Arbeitsstaat ist in komplexen Fällen nicht ohne Klassifikation der anwendbaren Rechtsvorschriften der zuständige Krankenversicherungsstaat.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-17", riskLevel: "high" },
  { key: "lives-sk-works-de-not-automatic-de-health", category: "dependency", type: "exception", text: "Wohnsitz Slowakei und Arbeit in Deutschland begründen nicht von selbst den deutschen zuständigen Krankenversicherungsstaat.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-17", riskLevel: "high" },
  { key: "nationality-not-health-competent-state", category: "dependency", type: "exception", text: "Die Staatsangehörigkeit bestimmt den zuständigen Krankenversicherungsstaat nicht.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-17", riskLevel: "high" },
  { key: "user-locale-not-health-competence", category: "dependency", type: "exception", text: "Die Ausgabesprache oder Nutzeroberfläche wählt weder den zuständigen Krankenversicherungsstaat noch S1, EHIC oder S2.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-17", riskLevel: "high" },

  { key: EU_SHARED_ART17_CLAIM_KEY, category: "article17", type: "definition", text: "Wer in einem anderen als dem zuständigen Mitgliedstaat wohnt, erhält dort Sachleistungen vom Wohnortträger für Rechnung des zuständigen Trägers nach den Rechtsvorschriften des Wohnorts, als wäre die Person dort versichert.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-17", riskLevel: "high" },
  { key: "art-17-insured-person-includes-self-employed", category: "article17", type: "definition", text: "Die Artikel 17, 19 und 20 gelten für eine versicherte Person und sind nicht auf Beschäftigte mit Arbeitsvertrag beschränkt. Selbständige sind damit nicht aus der unionsrechtlichen Krankenbehandlungskoordinierung ausgeschlossen. Selbständigkeit begründet aber nicht automatisch den Versichertenstatus.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-17", riskLevel: "high" },
  { key: "art-23-applicable-scheme-multiple-categories", category: "article23", type: "definition", text: "Hat der Wohn- oder Aufenthaltsmitgliedstaat mehrere Krankheitssysteme für verschiedene Versichertekategorien, gelten für Artikel 17, 19 Absatz 1, 20, 24 und 26 die Vorschriften des allgemeinen Systems für beschäftigte Personen.", sourceKey: "vo-987-health", passageKey: "vo-987-h-art-23", riskLevel: "high" },
  { key: "art-23-not-employment-or-automatic-gkv", category: "article23", type: "exception", text: "Artikel 23 der Verordnung 987/2009 macht Selbständige nicht rechtlich zu Beschäftigten und begründet nicht automatisch deutsche GKV oder ein anderes nationales Pflichtversicherungssystem.", sourceKey: "vo-987-health", passageKey: "vo-987-h-art-23", riskLevel: "high" },
  { key: "residence-healthcare-not-second-insurance", category: "article17", type: "exception", text: "Sachleistungen im Wohnstaat nach Artikel 17 bedeuten nicht, dass die Person dort primär und unabhängig versichert wird.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-17", riskLevel: "high" },
  { key: "residence-health-card-not-second-system", category: "article17", type: "exception", text: "Eine Wohnstaat-Gesundheitskarte ist nicht ein zweites unabhängiges Sozialversicherungssystem.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-17", riskLevel: "high" },
  { key: "competent-institution-not-residence-institution", category: "article17", type: "exception", text: "Der zuständige Träger ist nicht derselbe wie der Wohnortträger.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-17", riskLevel: "high" },
  { key: "two-health-cards-not-two-applicable-systems", category: "article17", type: "exception", text: "Zwei Gesundheitskarten bedeuten nicht zwei anwendbare Sozialversicherungssysteme und nicht doppelte Beitragspflicht.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-17", riskLevel: "high" },
  { key: "healthcare-in-two-states-not-dual-legislation", category: "article17", type: "exception", text: "Koordinierter Zugang zu Sachleistungen in Wohnstaat und zuständigem Staat begründet nicht doppeltes anwendbares Recht.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-18", riskLevel: "high" },
  { key: "s1-residence-care-not-planned-foreign-treatment", category: "article17", type: "exception", text: "Die gewöhnliche Arztbehandlung im Wohnstaat bei gültiger S1-Eintragung ist nicht geplante Auslandsbehandlung nach Artikel 20.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-17", riskLevel: "high" },

  { key: EU_SHARED_S1_CLAIM_KEY, category: "s1", type: "definition", text: "Das Portable Document S1 bescheinigt den Anspruch, sich im Wohnmitgliedstaat zur Gesundheitsversorgung anzumelden, wenn die Person dort wohnt, aber in einem anderen koordinierten Staat versichert bzw. zuständig erfasst ist.", sourceKey: "youreurope-s-forms", passageKey: "youreurope-s-forms-text", riskLevel: "high" },
  { key: "s1-not-a1", category: "s1", type: "exception", text: "S1 ist nicht A1. S1 betrifft die Wohnstaat-Gesundheitsanmeldung, nicht die Feststellung der anwendbaren Rechtsvorschriften.", sourceKey: "youreurope-s-forms", passageKey: "youreurope-s-forms-text", riskLevel: "high" },
  { key: "s1-not-ehic", category: "s1", type: "exception", text: "S1 ist nicht die Europäische Krankenversicherungskarte.", sourceKey: "youreurope-s-forms", passageKey: "youreurope-s-forms-text", riskLevel: "high" },
  { key: "s1-not-s2", category: "s1", type: "exception", text: "S1 ist nicht die Genehmigung geplanter Behandlung und nicht Dokument S2.", sourceKey: "youreurope-s-forms", passageKey: "youreurope-s-forms-text", riskLevel: "high" },
  { key: "s1-not-health-policy", category: "s1", type: "exception", text: "S1 ist keine Krankenversicherungspolice.", sourceKey: "youreurope-s-forms", passageKey: "youreurope-s-forms-text", riskLevel: "high" },
  { key: "s1-not-applicable-legislation-proof", category: "s1", type: "exception", text: "S1 ist nicht der Nachweis der anwendbaren Rechtsvorschriften selbst.", sourceKey: "youreurope-s-forms", passageKey: "youreurope-s-forms-text", riskLevel: "high" },
  { key: "s1-not-work-permit", category: "s1", type: "exception", text: "S1 ist keine Arbeitserlaubnis.", sourceKey: "youreurope-s-forms", passageKey: "youreurope-s-forms-text", riskLevel: "high" },
  { key: "s1-not-tax-certificate", category: "s1", type: "exception", text: "S1 ist keine steuerliche Bescheinigung.", sourceKey: "youreurope-s-forms", passageKey: "youreurope-s-forms-text", riskLevel: "high" },
  { key: "a1-issued-not-automatic-s1", category: "s1", type: "exception", text: "Eine ausgestellte A1-Bescheinigung löst nicht automatisch S1 aus.", sourceKey: "youreurope-s-forms", passageKey: "youreurope-s-forms-text", riskLevel: "high" },
  { key: "s1-issued-not-a1-unnecessary", category: "s1", type: "exception", text: "Eine ausgestellte S1 macht A1 nicht entbehrlich, wo der Nachweis der anwendbaren Rechtsvorschriften erforderlich ist.", sourceKey: "youreurope-s-forms", passageKey: "youreurope-s-forms-text", riskLevel: "high" },
  { key: "s1-issued-not-residence-registration-complete", category: "s1", type: "exception", text: "Die Ausstellung von S1 vollendet nicht automatisch die Eintragung beim Wohnortträger.", sourceKey: "vo-987-health", passageKey: "vo-987-h-art-24", riskLevel: "high" },
  { key: "s1-requested-not-entitlement-approved", category: "s1", type: "exception", text: "Ein beantragtes S1 ist nicht bereits genehmigter Anspruch.", sourceKey: "vo-987-health", passageKey: "vo-987-h-art-24", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "s1-not-permanent-despite-changed-facts", category: "s1", type: "exception", text: "S1 ist kein dauerhafter Anspruch unabhängig von späteren Sachverhaltsänderungen.", sourceKey: "vo-987-health", passageKey: "vo-987-h-art-24", riskLevel: "high" },
  { key: "s1-registration-procedure-987-24", category: "s1", type: "procedure", text: "Nach Artikel 24 der Verordnung 987/2009 stellt der zuständige Träger die Anspruchsbescheinigung aus, die Person lässt sich beim Wohnortträger eintragen, dieser unterrichtet den zuständigen Träger; der Wohnortträger kann die Bescheinigung auch anfordern.", sourceKey: "vo-987-health", passageKey: "vo-987-h-art-24", riskLevel: "high" },
  { key: "s1-valid-until-cancellation-notified", category: "s1", type: "definition", text: "Die Eintragung bleibt wirksam, bis der zuständige Träger dem Wohnortträger die Beendigung mitteilt.", sourceKey: "vo-987-health", passageKey: "vo-987-h-art-24", riskLevel: "high" },
  { key: "s1-change-requires-reexamination", category: "s1", type: "procedure", text: "Wechsel des zuständigen Staats, des Wohnorts, des Versicherungsverhältnisses, der Beschäftigung oder der abgeleiteten Familienberechtigung kann Überprüfung, Änderung, Aufhebung oder Neueintragung erfordern.", sourceKey: "vo-987-health", passageKey: "vo-987-h-art-24", riskLevel: "high" },
  { key: "old-s1-not-entitlement-forever", category: "s1", type: "exception", text: "Ein altes S1-Dokument bedeutet nicht unbefristeten Anspruch.", sourceKey: "vo-987-health", passageKey: "vo-987-h-art-24", riskLevel: "high" },
  { key: "s1-requires-residence-not-stay", category: "s1", type: "definition", text: "S1 setzt unionsrechtlichen Wohnort im Eintragungsstaat voraus, nicht bloß vorübergehenden Aufenthalt.", sourceKey: "ehic-commission", passageKey: "ehic-commission-text", riskLevel: "high" },
  { key: "temporary-stay-not-automatic-s1", category: "s1", type: "exception", text: "Ein vorübergehender touristischer oder Arbeitsaufenthalt löst nicht automatisch S1 aus.", sourceKey: "ehic-commission", passageKey: "ehic-commission-text", riskLevel: "high" },

  { key: "eu-residence-is-centre-of-interests", category: "residence", type: "definition", text: "Unionsrechtlicher Wohnort ist der gewöhnliche Mittelpunkt der Interessen nach Artikel 11 der Verordnung 987/2009, nicht allein eine melderechtliche Adresse.", sourceKey: "vo-987-health", passageKey: "vo-987-h-art-11", riskLevel: "high" },
  { key: "trvaly-pobyt-not-automatic-eu-residence", category: "residence", type: "exception", text: "Slowakischer trvalý pobyt ist nicht automatisch unionsrechtlicher Wohnort.", sourceKey: "vo-987-health", passageKey: "vo-987-h-art-11", riskLevel: "high" },
  { key: "anmeldung-not-automatic-eu-residence", category: "residence", type: "exception", text: "Eine deutsche Anmeldung ist nicht automatisch unionsrechtlicher Wohnort.", sourceKey: "vo-987-health", passageKey: "vo-987-h-art-11", riskLevel: "high" },
  { key: "registered-address-not-automatic-eu-residence", category: "residence", type: "exception", text: "Eine gemeldete Anschrift, Hotel oder Wohnung begründet den unionsrechtlichen Wohnort nicht automatisch.", sourceKey: "vo-987-health", passageKey: "vo-987-h-art-11", riskLevel: "high" },
  { key: "nationality-not-eu-residence", category: "residence", type: "exception", text: "Die Staatsangehörigkeit begründet den unionsrechtlichen Wohnort nicht.", sourceKey: "vo-987-health", passageKey: "vo-987-h-art-11", riskLevel: "high" },
  { key: "posting-not-automatic-residence-transfer", category: "residence", type: "exception", text: "Eine Entsendung überträgt den Wohnort nicht automatisch.", sourceKey: "vo-987-health", passageKey: "vo-987-h-art-11", riskLevel: "high" },
  { key: "residence-unclear-fail-closed", category: "residence", type: "exception", text: "Ist unklar, ob Wohnort oder vorübergehender Aufenthalt vorliegt, darf die Wahl zwischen S1 und EHIC nicht individuell getroffen werden.", sourceKey: "vo-987-health", passageKey: "vo-987-h-art-11", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "posting-not-automatic-s1", category: "residence", type: "exception", text: "Entsendung bedeutet nicht automatisch S1.", sourceKey: "ehic-commission", passageKey: "ehic-commission-text", riskLevel: "high" },
  { key: "posting-not-always-ehic-sufficient", category: "residence", type: "exception", text: "Entsendung bedeutet nicht, dass EHIC unabhängig vom tatsächlichen Wohnort stets ausreicht.", sourceKey: "ehic-commission", passageKey: "ehic-commission-text", riskLevel: "high" },
  { key: "posted-stay-uses-ehic-principles", category: "residence", type: "procedure", text: "Ein entsandter Arbeitnehmer, der im Herkunftsstaat wohnen bleibt und sich nur vorübergehend im Aufnahmestaat aufhält, nutzt grundsätzlich die Aufenthaltskoordinierung einschließlich EHIC.", sourceKey: "ehic-commission", passageKey: "ehic-commission-text", riskLevel: "high" },
  { key: "posted-residence-transfer-may-need-s1", category: "residence", type: "procedure", text: "Ein entsandter Arbeitnehmer, der tatsächlich Wohnort im anderen Mitgliedstaat begründet und weiter im zuständigen Staat versichert ist, kann die S1-Eintragung nach Artikel 17 benötigen.", sourceKey: "ehic-commission", passageKey: "ehic-commission-text", riskLevel: "high" },
  { key: "posted-self-employed-stay-uses-ehic-principles", category: "residence", type: "procedure", text: "Ein entsandter Selbständiger, der im Herkunftsstaat wohnen bleibt und sich nur vorübergehend im Aufnahmestaat aufhält, nutzt grundsätzlich die Aufenthaltskoordinierung einschließlich EHIC. Die selbständige A1 ersetzt S1 nicht.", sourceKey: "ehic-commission", passageKey: "ehic-commission-text", riskLevel: "high" },
  { key: "posted-self-employed-residence-transfer-may-need-s1", category: "residence", type: "procedure", text: "Ein entsandter Selbständiger, der tatsächlich Wohnort im anderen Mitgliedstaat begründet und weiter im zuständigen Staat versichert ist, kann die S1-Eintragung nach Artikel 17 benötigen. Die Tätigkeitsdauer allein überträgt den Wohnort nicht.", sourceKey: "ehic-commission", passageKey: "ehic-commission-text", riskLevel: "high" },
  { key: "self-employed-not-automatic-s1-ehic-s2", category: "s1", type: "exception", text: "Selbständigkeit löst nicht automatisch S1, EHIC oder S2 aus. Erst nach festgestelltem zuständigen Staat und bestehender Krankenversicherung gilt derselbe Dokumentenrahmen wie für andere Versicherte.", sourceKey: "youreurope-s-forms", passageKey: "youreurope-s-forms-text", riskLevel: "high" },
  { key: "business-establishment-not-eu-residence", category: "residence", type: "exception", text: "Betriebsstätte, Gewerbeanmeldung, Firmenregister oder živnosť ist nicht automatisch unionsrechtlicher Wohnort.", sourceKey: "vo-987-health", passageKey: "vo-987-h-art-11", riskLevel: "high" },

  { key: "art-18-healthcare-in-competent-state", category: "article18", type: "definition", text: "Die nach Artikel 17 erfassten Personen haben während eines Aufenthalts im zuständigen Mitgliedstaat Anspruch auf Sachleistungen des zuständigen Trägers nach dessen Rechtsvorschriften, als wohnten sie dort.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-18", riskLevel: "high" },
  { key: "not-only-healthcare-where-you-live", category: "article18", type: "exception", text: "Koordinierte Krankenbehandlung ist nicht darauf beschränkt, dass Behandlung nur im Wohnstaat möglich wäre.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-18", riskLevel: "high" },
  { key: "art-18-2-frontier-family-rule", category: "article18", type: "definition", text: "Familienangehörige eines Grenzarbeitnehmers haben während des Aufenthalts im zuständigen Mitgliedstaat Sachleistungsanspruch, sofern dieser Staat nicht in Anhang III aufgeführt ist; andernfalls gilt für im selben Staat wie der Grenzarbeitnehmer wohnende Familienangehörige nur Artikel 19 Absatz 1.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-18", riskLevel: "high" },
  { key: "annex-iii-current-list", category: "article18", type: "definition", text: "Nach der geltenden konsolidierten Fassung vom 31. Juli 2019 nennt Anhang III derzeit Dänemark, Irland, Kroatien, Finnland, Schweden und das Vereinigte Königreich. Abgelaufene Artikel-87-Absatz-10a-Einträge sind nicht mehr geltende Beschränkung.", sourceKey: "vo-883-health", passageKey: "vo-883-h-annex-iii", riskLevel: "high" },
  { key: "annex-iii-de-sk-not-listed", category: "article18", type: "definition", text: "Deutschland und die Slowakei sind in der aktuellen konsolidierten Anhang-III-Fassung nicht als Beschränkungsstaaten aufgeführt. Die Liste ist vor Gebrauch zu revalidieren.", sourceKey: "vo-883-health", passageKey: "vo-883-h-annex-iii", riskLevel: "high" },
  { key: "annex-iii-must-revalidate", category: "article18", type: "procedure", text: "Anhang III kann durch unionsrechtliche Änderungen wechseln. Die aktuelle amtliche konsolidierte Fassung ist vor einer konkreten Familienangehörigen-Auskunft zu revalidieren.", sourceKey: "vo-883-health", passageKey: "vo-883-h-annex-iii", riskLevel: "high" },
  { key: "uk-annex-iii-not-uk-case-authorization", category: "article18", type: "exception", text: "Die Nennung des Vereinigten Königreichs in Anhang III eröffnet in diesem Kern keine britischen Post-Brexit-Fälle.", sourceKey: "vo-883-health", passageKey: "vo-883-h-annex-iii", riskLevel: "high" },
  { key: "eu-family-member-uses-national-classification", category: "family", type: "definition", text: "Wer Familienangehörige ist, richtet sich nach den Rechtsvorschriften des Mitgliedstaats, in dem die Person als Familienangehörige gilt. Der EU-Kern speichert das Koordinierungsprinzip, nicht nationale Abhängigkeitsdefinitionen.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-1", riskLevel: "high" },
  { key: "worker-eligible-not-every-relative", category: "family", type: "exception", text: "Die Berechtigung der beschäftigten Person macht nicht jeden Verwandten automatisch berechtigt.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-1", riskLevel: "high" },
  { key: "spouse-not-automatic-dependent", category: "family", type: "exception", text: "Ehe oder Partnerschaft begründet nicht in jeder Sachverhaltslage automatisch die Eigenschaft als abhängige Familienangehörige.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-1", riskLevel: "high" },
  { key: "child-not-automatic-derivative", category: "family", type: "exception", text: "Ein Kind ist nicht ohne Klassifikation automatisch derivativ berechtigt.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-1", riskLevel: "high" },
  { key: "family-dependency-unclear-fail-closed", category: "family", type: "exception", text: "Ohne geklärten Familien- oder Abhängigkeitsstatus darf der abgeleitete Anspruch nicht individuell bejaht werden.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-1", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "no-slovak-family-definition-in-eu-core", category: "family", type: "boundary", text: "Slowakische nationale Abhängigkeitsregeln gehören nicht in diesen EU-Kern.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-1", riskLevel: "high" },
  { key: "no-german-familienversicherung-in-eu-core", category: "family", type: "boundary", text: "Deutsche Familienversicherungsregeln nach SGB V gehören nicht in diesen EU-Kern.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-1", riskLevel: "high" },
  { key: "family-changes-route-to-national-adapter", category: "family", type: "procedure", text: "Änderungen wie eigene Beschäftigung des Ehegatten, Umzug oder Wegfall der Kindereigenschaft sind national zu klassifizieren und können S1-Änderung auslösen.", sourceKey: "vo-987-health", passageKey: "vo-987-h-art-24", riskLevel: "high" },

  { key: "art-19-temporary-stay-medically-necessary", category: "article19", type: "definition", text: "Während eines vorübergehenden Aufenthalts außerhalb des zuständigen Staats besteht Anspruch auf Sachleistungen, die sich unter Berücksichtigung der Art der Behandlung und der voraussichtlichen Aufenthaltsdauer als medizinisch notwendig erweisen.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-19", riskLevel: "high" },
  { key: "ehic-not-emergency-only", category: "article19", type: "exception", text: "Medizinisch notwendig ist nicht nur lebensbedrohlich. Die EHIC ist keine Notfall-only-Karte.", sourceKey: "planned-treatment-commission", passageKey: "planned-treatment-commission-text", riskLevel: "high" },
  { key: "temporary-stay-not-planned-treatment", category: "article19", type: "exception", text: "Der Aufenthaltsanspruch ist nicht die geplante Behandlung im Ausland.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-19", riskLevel: "high" },

  { key: EU_SHARED_EHIC_CLAIM_KEY, category: "ehic", type: "definition", text: "Die Europäische Krankenversicherungskarte weist den Anspruch auf medizinisch notwendige, im öffentlichen System vorgesehene Behandlung während eines vorübergehenden Aufenthalts in einem anderen koordinierten Staat zu denselben Bedingungen und Zuzahlungen wie dort versicherte Personen nach.", sourceKey: "ehic-commission", passageKey: "ehic-commission-text", riskLevel: "high" },
  { key: "ehic-not-s1", category: "ehic", type: "exception", text: "EHIC ist nicht S1 und kein Ersatz für die Wohnstaat-Gesundheitsanmeldung bei begründetem Wohnort.", sourceKey: "ehic-commission", passageKey: "ehic-commission-text", riskLevel: "high" },
  { key: "ehic-not-s2", category: "ehic", type: "exception", text: "EHIC ist nicht S2 und nicht die Genehmigung geplanter Behandlung.", sourceKey: "ehic-commission", passageKey: "ehic-commission-text", riskLevel: "high" },
  { key: "ehic-not-travel-insurance", category: "ehic", type: "exception", text: "EHIC ist keine Reiseversicherung und keine Rückholversicherung.", sourceKey: "youreurope-unplanned", passageKey: "youreurope-unplanned-text", riskLevel: "high" },
  { key: "ehic-not-private-healthcare-guarantee", category: "ehic", type: "exception", text: "EHIC garantiert nicht automatisch private Leistungserbringer.", sourceKey: "youreurope-unplanned", passageKey: "youreurope-unplanned-text", riskLevel: "high" },
  { key: "ehic-not-everything-free", category: "ehic", type: "exception", text: "EHIC bedeutet nicht, dass jede Behandlung kostenfrei ist. Es gelten dieselben Zuzahlungen wie für dort öffentlich Versicherte.", sourceKey: "youreurope-unplanned", passageKey: "youreurope-unplanned-text", riskLevel: "high" },
  { key: "ehic-not-planned-treatment", category: "ehic", type: "exception", text: "EHIC ist nicht die Ermächtigung, eigens zur Behandlung zu reisen.", sourceKey: "planned-treatment-commission", passageKey: "planned-treatment-commission-text", riskLevel: "high" },
  { key: "ehic-not-permanent-residence-registration", category: "ehic", type: "exception", text: "EHIC ist nicht der Nachweis der dauerhaften Wohnstaat-Gesundheitsanmeldung.", sourceKey: "ehic-commission", passageKey: "ehic-commission-text", riskLevel: "high" },
  { key: "ehic-issuer-is-competent-institution", category: "ehic", type: "procedure", text: "Die EHIC stellt grundsätzlich der Träger des zuständigen Versicherungsstaats aus, nicht automatisch der Wohnortträger der S1-Eintragung.", sourceKey: "ehic-commission", passageKey: "ehic-commission-text", riskLevel: "high" },
  { key: "de-insured-sk-s1-ehic-from-de", category: "ehic", type: "procedure", text: "Wer in Deutschland zuständig versichert und in der Slowakei mit S1 eingetragen ist, erhält die EHIC grundsätzlich von der deutschen zuständigen Krankenkasse, nicht einfach vom slowakischen Wohnortträger.", sourceKey: "ehic-commission", passageKey: "ehic-commission-text", riskLevel: "high" },
  { key: "exact-ehic-issuer-is-national-adapter", category: "ehic", type: "boundary", text: "Die genaue nationale Ausstellungsstelle der EHIC gehört in den späteren nationalen Adapter und ist live zu prüfen.", sourceKey: "health-institution-directory", passageKey: "health-institution-directory-text", riskLevel: "medium" },
  { key: "prc-same-entitlement-as-ehic", category: "ehic", type: "definition", text: "Die vorläufige Ersatzbescheinigung tritt für den vorübergehenden Aufenthalt an die Stelle der EHIC und begründet kein zweites Sachleistungsrecht.", sourceKey: "vo-987-health", passageKey: "vo-987-h-art-25", riskLevel: "high" },
  { key: "prc-issuance-fetch-live", category: "ehic", type: "procedure", text: "Die operative Ausstellung einer Ersatzbescheinigung ist national und live zu klären.", sourceKey: "health-institution-directory", passageKey: "health-institution-directory-text", riskLevel: "medium" },
  { key: "reimbursement-orientation-not-amount", category: "ehic", type: "procedure", text: "Wurden während des Aufenthalts Kosten selbst getragen, kann der koordinierte Erstattungsweg eröffnet sein. Die genaue Höhe darf ohne Behandlung, Aufenthaltsstaat und gezahlten Betrag nicht zugesagt werden.", sourceKey: "vo-987-health", passageKey: "vo-987-h-art-25", riskLevel: "high", requiresAuthorityResolution: true },

  { key: "art-20-planned-treatment-needs-authorisation", category: "article20", type: "definition", text: "Wer sich in einen anderen Mitgliedstaat begibt, um dort Sachleistungen zu erhalten, bedarf grundsätzlich der vorherigen Genehmigung des zuständigen Trägers nach Artikel 20.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-20", riskLevel: "high" },
  { key: "purpose-of-travel-for-treatment-not-art-19", category: "article20", type: "exception", text: "Ist der Reisezweck die Behandlung, gilt nicht der ordentliche Artikel-19- oder EHIC-Aufenthaltsweg.", sourceKey: "planned-treatment-commission", passageKey: "planned-treatment-commission-text", riskLevel: "high" },
  { key: "art-20-2-authorisation-conditions", category: "article20", type: "definition", text: "Die Genehmigung ist zu erteilen, wenn die Behandlung zu den nach den maßgeblichen Rechtsvorschriften vorgesehenen Leistungen gehört und sie unter Berücksichtigung des derzeitigen Gesundheitszustands und des voraussichtlichen Verlaufs nicht innerhalb eines medizinisch vertretbaren Zeitraums gewährt werden kann.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-20", riskLevel: "high" },
  { key: "waiting-list-not-automatic-s2", category: "article20", type: "exception", text: "Eine lange Warteliste bedeutet nicht automatisch S2. Es gilt keine erfundene Wochen- oder Monatszahl.", sourceKey: "planned-treatment-commission", passageKey: "planned-treatment-commission-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "medical-justification-case-specific", category: "article20", type: "exception", text: "Die medizinische Vertretbarkeit der Wartezeit ist fallbezogen und darf ohne Gesundheits- und Behandlungsangaben nicht individuell entschieden werden.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-20", riskLevel: "high", requiresAuthorityResolution: true },

  { key: EU_SHARED_S2_CLAIM_KEY, category: "s2", type: "definition", text: "Das Portable Document S2 genehmigt geplante Gesundheitsversorgung in einem anderen koordinierten Staat nach Artikel 20 der Verordnung 883/2004.", sourceKey: "youreurope-s-forms", passageKey: "youreurope-s-forms-text", riskLevel: "high" },
  { key: "s2-not-s1", category: "s2", type: "exception", text: "S2 ist nicht S1.", sourceKey: "youreurope-s-forms", passageKey: "youreurope-s-forms-text", riskLevel: "high" },
  { key: "s2-not-ehic", category: "s2", type: "exception", text: "S2 ist nicht EHIC.", sourceKey: "youreurope-s-forms", passageKey: "youreurope-s-forms-text", riskLevel: "high" },
  { key: "s2-not-any-desired-treatment", category: "s2", type: "exception", text: "S2 ist keine allgemeine Erlaubnis jeder gewünschten Auslandsbehandlung.", sourceKey: "youreurope-s-forms", passageKey: "youreurope-s-forms-text", riskLevel: "high" },
  { key: "s2-not-automatic-private-clinic", category: "s2", type: "exception", text: "S2 genehmigt nicht automatisch jede private Klinik.", sourceKey: "youreurope-planned", passageKey: "youreurope-planned-text", riskLevel: "high" },
  { key: "s2-not-yet-granted-not-entitlement", category: "s2", type: "exception", text: "Eine noch nicht erteilte S2-Genehmigung ist kein Behandlungsanspruch im anderen Staat nach Artikel 20.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-20", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "non-resident-s2-residence-forwards-competent-decides", category: "s2", type: "procedure", text: "Wohnt die Person nicht im zuständigen Mitgliedstaat, kann der Wohnortträger den Genehmigungsantrag entgegennehmen und weiterleiten; entschieden wird vom zuständigen Träger.", sourceKey: "vo-987-health", passageKey: "vo-987-h-art-26", riskLevel: "high" },
  { key: "s2-urgent-vital-special-procedure", category: "s2", type: "procedure", text: "Für vital notwendige dringende Fälle gelten besondere Verfahrensregeln der Durchführungsverordnung, ohne Wohnortträger und zuständigen Träger zu vermengen.", sourceKey: "vo-987-health", passageKey: "vo-987-h-art-26", riskLevel: "high" },

  { key: "directive-2011-24-not-regulation-s2", category: "directive", type: "boundary", text: "Die Richtlinie 2011/24/EU ist nicht derselbe Weg wie Verordnung 883/2004 mit Dokument S2. Genehmigung, Erstattungsgrundlage und Leistungserbringerwahl können abweichen.", sourceKey: "directive-2011-24", passageKey: "directive-2011-24-text", riskLevel: "high" },
  { key: "directive-engine-not-implemented", category: "directive", type: "boundary", text: "Dieser Kern baut keine Erstattungsmaschine der Richtlinie 2011/24/EU. Richtlinien-Erstattungsfragen dürfen nicht aus der S2-Logik beantwortet werden.", sourceKey: "youreurope-planned", passageKey: "youreurope-planned-text", riskLevel: "high" },

  { key: "a1-not-copied-in-health-core", category: "documents", type: "boundary", text: "Die Definition von A1 bleibt im anwendbaren-Rechtsvorschriften-Kern. Dieser Gesundheitskern wiederholt sie nicht.", sourceKey: "youreurope-s-forms", passageKey: "youreurope-s-forms-text", riskLevel: "high" },
  { key: "s3-out-of-scope-worker-v1", category: "documents", type: "boundary", text: "S3 und pensionsspezifische Artikel 23 bis 30 sowie ehemalige Grenzarbeitnehmer im Ruhestand liegen außerhalb dieses arbeitnehmerbezogenen Kerns.", sourceKey: "youreurope-s-forms", passageKey: "youreurope-s-forms-text", riskLevel: "high" },
  { key: "pensioner-rules-out-of-scope", category: "documents", type: "boundary", text: "Rentnerregeln der Artikel 23 bis 30 werden nicht stillschweigend mit Arbeitnehmerregeln beantwortet.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-21", riskLevel: "high" },
  { key: "uk-post-brexit-out-of-scope", category: "documents", type: "boundary", text: "Britische Post-Brexit-Koordinierung wird in diesem Kern nicht aufgebaut.", sourceKey: "vo-883-health", passageKey: "vo-883-h-annex-iii", riskLevel: "high" },
  { key: "non-eu-bilateral-out-of-scope", category: "documents", type: "boundary", text: "Nichtunionsrechtliche bilaterale Gesundheitsabkommen werden in diesem Kern nicht aufgebaut.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-17", riskLevel: "high" },

  { key: "gkv-pkv-classified-by-german-pack", category: "insurance", type: "boundary", text: "Die Unterscheidung gesetzliche und private deutsche Krankenversicherung bleibt dem bestehenden deutschen Health-Insurance-Orientation-Pack vorbehalten.", sourceKey: "ehic-commission", passageKey: "ehic-commission-text", riskLevel: "high" },
  { key: "a1-germany-not-automatic-gkv-s1", category: "insurance", type: "exception", text: "A1 mit deutschem anwendbarem Recht bedeutet nicht automatisch, dass eine gesetzliche Krankenkasse S1 ausstellt.", sourceKey: "ehic-commission", passageKey: "ehic-commission-text", riskLevel: "high" },
  { key: "private-german-insurance-not-automatic-statutory-s1", category: "insurance", type: "exception", text: "Private deutsche Krankenversicherung ist nicht automatisch der gesetzliche EU-S1-Weg.", sourceKey: "ehic-commission", passageKey: "ehic-commission-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "pkv-unclear-fail-closed", category: "insurance", type: "exception", text: "Ist unklar, ob gesetzliche oder private Absicherung besteht, darf der gesetzliche S1-Weg nicht individuell zugesagt werden.", sourceKey: "ehic-commission", passageKey: "ehic-commission-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "socialna-poistovna-not-slovak-health-insurer", category: "insurance", type: "boundary", text: "Sociálna poisťovňa ist nicht automatisch der slowakische Krankenversicherungsträger für S1. Die nationale SK-Krankenroutung gehört zu einem späteren Adapter.", sourceKey: "health-institution-directory", passageKey: "health-institution-directory-text", riskLevel: "high" },
  { key: "no-slovak-health-national-merits-in-eu-core", category: "insurance", type: "boundary", text: "Slowakische nationale Krankenversicherungsmerits werden in diesem EU-Kern nicht gespeichert.", sourceKey: "health-institution-directory", passageKey: "health-institution-directory-text", riskLevel: "high" },

  { key: "cash-sickness-not-benefits-in-kind", category: "cash", type: "boundary", text: "Geldleistungen bei Krankheit nach Artikel 21 sind nicht dieselben Leistungen wie Sachleistungen der Krankenbehandlung.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-21", riskLevel: "high" },
  { key: "s1-ehic-not-krankengeld-amount", category: "cash", type: "exception", text: "S1 und EHIC bestimmen nicht die Höhe von Krankengeld oder nemocenské.", sourceKey: "vo-987-health", passageKey: "vo-987-h-art-27", riskLevel: "high" },
  { key: "no-cash-benefit-calculation-engine", category: "cash", type: "boundary", text: "Dieser Kern berechnet kein Krankengeld, kein slowakisches Krankengeld und keine Mutterschaftsgeldhöhe.", sourceKey: "vo-987-health", passageKey: "vo-987-h-art-27", riskLevel: "high" },
  { key: "self-employed-health-contribution-out-of-scope", category: "cash", type: "boundary", text: "Dieser Kern berechnet keine deutschen GKV-Beiträge, keine PKV-Prämien und keine slowakischen Gesundheitsbeiträge oder Vorauszahlungen Selbständiger. Die S1-Wohnstaat-Eintragung begründet nicht automatisch neue Beitragspflicht.", sourceKey: "vo-987-health", passageKey: "vo-987-h-art-27", riskLevel: "high" },
  { key: "pflege-out-of-scope", category: "cash", type: "boundary", text: "Pflege- und Langzeitpflegekoordinierung liegt außerhalb dieses Kerns.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-21", riskLevel: "high" },
  { key: "occupational-accident-healthcare-out-of-scope", category: "cash", type: "boundary", text: "Arbeitsunfall- und Berufskrankheitenbehandlung wird in diesem Kern nicht aufgebaut.", sourceKey: "vo-883-health", passageKey: "vo-883-h-art-19", riskLevel: "high" },

  { key: "private-provider-not-automatic", category: "provider", type: "exception", text: "EU-Koordinierung und EHIC betreffen grundsätzlich die öffentlich vorgesehene Versorgung. Ein privater Arzt ist nicht automatisch erfasst.", sourceKey: "youreurope-unplanned", passageKey: "youreurope-unplanned-text", riskLevel: "high" },
  { key: "s1-not-any-private-treatment", category: "provider", type: "exception", text: "S1 erstattet nicht automatisch jede private Behandlung.", sourceKey: "youreurope-unplanned", passageKey: "youreurope-unplanned-text", riskLevel: "high" },
  { key: "provider-status-fail-closed", category: "provider", type: "exception", text: "Ohne geklärten öffentlich-privaten Status des Leistungserbringers darf die Kostendeckung nicht individuell zugesagt werden.", sourceKey: "youreurope-unplanned", passageKey: "youreurope-unplanned-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "exact-institution-fetch-live", category: "provider", type: "procedure", text: "Genaue Träger, Formular-URL und Kontakte sind live zu holen.", sourceKey: "health-institution-directory", passageKey: "health-institution-directory-text", riskLevel: "medium" },
]);

type ProcessSpec = Readonly<{
  key: string;
  title: string;
  trigger: string;
  safeFirstStep: string;
  riskLevel: "medium" | "high";
  dimensions: Readonly<Record<(typeof PROCESS_COMPLETE_DIMENSIONS)[number], string>>;
}>;

const SHARED_INSTITUTION = "competent-institution-not-residence-institution";
const SHARED_BOUNDARIES = "health-source-eu-not-national-competence";
const SHARED_FRESHNESS = "current-883-987-health-baseline";
const SHARED_NEG = "s1-not-ehic";

export const EU_HEALTH_PROCESSES: readonly ProcessSpec[] = Object.freeze([
  { key: "health-entitlement-classify", title: "Grenzüberschreitende Krankenbehandlung 2026 einordnen", trigger: "Wohnsitz, Aufenthalt oder Behandlung berührt mehr als einen Mitgliedstaat", safeFirstStep: "Zuständigen Staat aus dem anwendbaren Recht verlangen und S1, EHIC und S2 nicht vermengen.", riskLevel: "high", dimensions: { what: "health-requires-applicable-legislation-result", whoWhen: "work-state-not-automatic-health-competence", documents: EU_SHARED_S1_CLAIM_KEY, how: "residence-unclear-fail-closed", next: "s1-registration-procedure-987-24", deadlines: "s1-valid-until-cancellation-notified", problems: "user-locale-not-health-competence", dutiesAfter: "s1-change-requires-reexamination", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: SHARED_NEG } },
  { key: "competent-state-dependency-gate", title: "Zuständigen Krankenversicherungsstaat voraussetzen 2026", trigger: "Nutzer schildert Wohnen und Arbeiten in verschiedenen Staaten ohne geklärtes anwendbares Recht", safeFirstStep: "Nicht Artikel 11 neu bewerten; fehlende Klassifikation fail-closed behandeln.", riskLevel: "high", dimensions: { what: "health-requires-applicable-legislation-result", whoWhen: "lives-sk-works-de-not-automatic-de-health", documents: "a1-not-copied-in-health-core", how: "work-state-not-automatic-health-competence", next: EU_SHARED_ART17_CLAIM_KEY, deadlines: SHARED_FRESHNESS, problems: "nationality-not-health-competent-state", dutiesAfter: "s1-change-requires-reexamination", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "a1-issued-not-automatic-s1" } },
  { key: "residence-vs-stay-determine", title: "Wohnort und vorübergehenden Aufenthalt 2026 trennen", trigger: "Adresse, Entsendung oder Aufenthaltstage werden als Wohnort angeboten", safeFirstStep: "Mittelpunkt der Interessen prüfen; melderechtliche Anschrift nicht automatisch setzen.", riskLevel: "high", dimensions: { what: "eu-residence-is-centre-of-interests", whoWhen: "residence-unclear-fail-closed", documents: EU_SHARED_S1_CLAIM_KEY, how: "registered-address-not-automatic-eu-residence", next: "s1-requires-residence-not-stay", deadlines: SHARED_FRESHNESS, problems: "trvaly-pobyt-not-automatic-eu-residence", dutiesAfter: "s1-change-requires-reexamination", institution: SHARED_INSTITUTION, boundaries: "anmeldung-not-automatic-eu-residence", freshness: SHARED_FRESHNESS, negatives: "posting-not-automatic-residence-transfer" } },
  { key: "art-17-residence-healthcare", title: "Artikel-17-Wohnstaatbehandlung 2026 führen", trigger: "Person wohnt in einem anderen als dem zuständigen Mitgliedstaat", safeFirstStep: "Wohnortträger für Rechnung des zuständigen Trägers erklären, nicht als Zweitversicherung.", riskLevel: "high", dimensions: { what: EU_SHARED_ART17_CLAIM_KEY, whoWhen: "s1-requires-residence-not-stay", documents: EU_SHARED_S1_CLAIM_KEY, how: "s1-registration-procedure-987-24", next: "s1-residence-care-not-planned-foreign-treatment", deadlines: "s1-valid-until-cancellation-notified", problems: "residence-healthcare-not-second-insurance", dutiesAfter: "s1-change-requires-reexamination", institution: SHARED_INSTITUTION, boundaries: "two-health-cards-not-two-applicable-systems", freshness: SHARED_FRESHNESS, negatives: "residence-health-card-not-second-system" } },
  { key: "s1-eligibility-orientation", title: "S1-Eignung 2026 orientieren", trigger: "Grenzgänger, Wohnen in einem und Versicherung in einem anderen Staat oder Familienangehörige", safeFirstStep: "Wohnort verlangen und S1 von A1 und EHIC trennen.", riskLevel: "high", dimensions: { what: EU_SHARED_S1_CLAIM_KEY, whoWhen: "s1-requires-residence-not-stay", documents: "s1-not-a1", how: "s1-requested-not-entitlement-approved", next: "s1-registration-procedure-987-24", deadlines: "s1-valid-until-cancellation-notified", problems: "temporary-stay-not-automatic-s1", dutiesAfter: "s1-change-requires-reexamination", institution: SHARED_INSTITUTION, boundaries: "s1-not-applicable-legislation-proof", freshness: SHARED_FRESHNESS, negatives: "s1-not-work-permit" } },
  { key: "s1-request", title: "S1 beim zuständigen Träger 2026 beantragen", trigger: "Anspruchsbescheinigung für Wohnstaat-Anmeldung wird benötigt", safeFirstStep: "Antrag an den zuständigen Träger richten, nicht an eine beliebige Wohnstaatstelle als Aussteller.", riskLevel: "high", dimensions: { what: "s1-registration-procedure-987-24", whoWhen: "s1-requested-not-entitlement-approved", documents: EU_SHARED_S1_CLAIM_KEY, how: "exact-institution-fetch-live", next: "s1-issued-not-residence-registration-complete", deadlines: "s1-valid-until-cancellation-notified", problems: "pkv-unclear-fail-closed", dutiesAfter: "s1-change-requires-reexamination", institution: "ehic-issuer-is-competent-institution", boundaries: "a1-germany-not-automatic-gkv-s1", freshness: SHARED_FRESHNESS, negatives: "s1-not-tax-certificate" } },
  { key: "s1-residence-registration", title: "S1 beim Wohnortträger 2026 eintragen", trigger: "S1 liegt vor oder Wohnortträger soll Eintragung vornehmen", safeFirstStep: "Eintragung vom bloßen Dokumentbesitz trennen.", riskLevel: "high", dimensions: { what: "s1-issued-not-residence-registration-complete", whoWhen: "s1-registration-procedure-987-24", documents: EU_SHARED_S1_CLAIM_KEY, how: "exact-institution-fetch-live", next: "s1-valid-until-cancellation-notified", deadlines: "s1-valid-until-cancellation-notified", problems: "s1-issued-not-residence-registration-complete", dutiesAfter: "s1-change-requires-reexamination", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "old-s1-not-entitlement-forever" } },
  { key: "s1-change-cancellation", title: "S1-Änderung und Aufhebung 2026 führen", trigger: "Zuständigkeit, Wohnort, Versicherung oder Familie ändert sich", safeFirstStep: "Altes Dokument nicht als fortgeltend behandeln.", riskLevel: "high", dimensions: { what: "s1-change-requires-reexamination", whoWhen: "s1-not-permanent-despite-changed-facts", documents: EU_SHARED_S1_CLAIM_KEY, how: "s1-valid-until-cancellation-notified", next: "family-changes-route-to-national-adapter", deadlines: "s1-valid-until-cancellation-notified", problems: "old-s1-not-entitlement-forever", dutiesAfter: "s1-change-requires-reexamination", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "s1-not-permanent-despite-changed-facts" } },
  { key: "art-18-healthcare-in-competent-state", title: "Behandlung im zuständigen Staat nach Artikel 18 2026", trigger: "Im Wohnstaat Koordinierte Person sucht Behandlung im zuständigen Staat", safeFirstStep: "Nicht auf Wohnstaat-only reduzieren.", riskLevel: "high", dimensions: { what: "art-18-healthcare-in-competent-state", whoWhen: "not-only-healthcare-where-you-live", documents: EU_SHARED_S1_CLAIM_KEY, how: "healthcare-in-two-states-not-dual-legislation", next: "art-18-2-frontier-family-rule", deadlines: SHARED_FRESHNESS, problems: "two-health-cards-not-two-applicable-systems", dutiesAfter: "s1-change-requires-reexamination", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "residence-healthcare-not-second-insurance" } },
  { key: "family-member-coordination-gate", title: "Familienangehörigen-Koordinierung 2026 prüfen", trigger: "Ehegatte, Kind oder anderer Angehöriger verlangt abgeleiteten Krankenanspruch", safeFirstStep: "EU-Prinzip nennen und nationale Klassifikation nicht im EU-Kern entscheiden.", riskLevel: "high", dimensions: { what: "eu-family-member-uses-national-classification", whoWhen: "family-dependency-unclear-fail-closed", documents: EU_SHARED_S1_CLAIM_KEY, how: "family-changes-route-to-national-adapter", next: "art-18-2-frontier-family-rule", deadlines: SHARED_FRESHNESS, problems: "worker-eligible-not-every-relative", dutiesAfter: "s1-change-requires-reexamination", institution: SHARED_INSTITUTION, boundaries: "no-german-familienversicherung-in-eu-core", freshness: SHARED_FRESHNESS, negatives: "spouse-not-automatic-dependent" } },
  { key: "annex-iii-gate", title: "Anhang-III-Familienbeschränkung 2026 prüfen", trigger: "Familienangehörige eines Grenzarbeitnehmers suchen Behandlung im zuständigen Staat", safeFirstStep: "Aktuelle Anhang-III-Liste revalidieren; DE und SK nicht als aufgeführt unterstellen ohne Quelle.", riskLevel: "high", dimensions: { what: "art-18-2-frontier-family-rule", whoWhen: "annex-iii-current-list", documents: "annex-iii-de-sk-not-listed", how: "annex-iii-must-revalidate", next: "art-18-healthcare-in-competent-state", deadlines: "annex-iii-must-revalidate", problems: "uk-annex-iii-not-uk-case-authorization", dutiesAfter: "family-changes-route-to-national-adapter", institution: SHARED_INSTITUTION, boundaries: "no-slovak-family-definition-in-eu-core", freshness: SHARED_FRESHNESS, negatives: "child-not-automatic-derivative" } },
  { key: "temporary-stay-healthcare", title: "Vorübergehenden Aufenthalt Artikel 19 2026 führen", trigger: "Urlaub, Dienstreise oder sonstiger Aufenthalt außerhalb des zuständigen Staats", safeFirstStep: "Reisezweck klären: notwendige Behandlung während des Aufenthalts, nicht geplante Reise zur Behandlung.", riskLevel: "high", dimensions: { what: "art-19-temporary-stay-medically-necessary", whoWhen: "ehic-not-emergency-only", documents: EU_SHARED_EHIC_CLAIM_KEY, how: "temporary-stay-not-planned-treatment", next: "reimbursement-orientation-not-amount", deadlines: SHARED_FRESHNESS, problems: "purpose-of-travel-for-treatment-not-art-19", dutiesAfter: "s1-change-requires-reexamination", institution: "ehic-issuer-is-competent-institution", boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "temporary-stay-not-automatic-s1" } },
  { key: "ehic-purpose", title: "EHIC-Zweck 2026 einordnen", trigger: "Nutzer legt EHIC vor oder verlangt sie als Wohnsitz- oder Reiseversicherung", safeFirstStep: "Medizinisch notwendige öffentliche Versorgung bei Aufenthalt erklären.", riskLevel: "high", dimensions: { what: EU_SHARED_EHIC_CLAIM_KEY, whoWhen: "ehic-not-emergency-only", documents: "prc-same-entitlement-as-ehic", how: "ehic-issuer-is-competent-institution", next: "reimbursement-orientation-not-amount", deadlines: SHARED_FRESHNESS, problems: "ehic-not-travel-insurance", dutiesAfter: "s1-change-requires-reexamination", institution: "ehic-issuer-is-competent-institution", boundaries: "ehic-not-permanent-residence-registration", freshness: SHARED_FRESHNESS, negatives: "ehic-not-s1" } },
  { key: "ehic-issuer-route", title: "EHIC-Aussteller 2026 führen", trigger: "Versichert in einem Staat, S1 in einem anderen, Urlaub in einem dritten", safeFirstStep: "Aussteller ist der zuständige Versicherungsträger, nicht automatisch der Wohnortträger.", riskLevel: "high", dimensions: { what: "ehic-issuer-is-competent-institution", whoWhen: "de-insured-sk-s1-ehic-from-de", documents: EU_SHARED_EHIC_CLAIM_KEY, how: "exact-ehic-issuer-is-national-adapter", next: "prc-issuance-fetch-live", deadlines: SHARED_FRESHNESS, problems: "pkv-unclear-fail-closed", dutiesAfter: "s1-change-requires-reexamination", institution: "ehic-issuer-is-competent-institution", boundaries: "socialna-poistovna-not-slovak-health-insurer", freshness: SHARED_FRESHNESS, negatives: "a1-germany-not-automatic-gkv-s1" } },
  { key: "prc-boundary", title: "Vorläufige Ersatzbescheinigung 2026 abgrenzen", trigger: "EHIC verloren, noch nicht ausgestellt oder Ersatz verlangt", safeFirstStep: "Kein zweites Sachleistungsmodell erfinden.", riskLevel: "high", dimensions: { what: "prc-same-entitlement-as-ehic", whoWhen: "prc-issuance-fetch-live", documents: EU_SHARED_EHIC_CLAIM_KEY, how: "exact-institution-fetch-live", next: "reimbursement-orientation-not-amount", deadlines: SHARED_FRESHNESS, problems: "ehic-not-everything-free", dutiesAfter: "s1-change-requires-reexamination", institution: "ehic-issuer-is-competent-institution", boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ehic-not-private-healthcare-guarantee" } },
  { key: "temporary-stay-reimbursement", title: "Erstattung nach vorübergehendem Aufenthalt 2026 orientieren", trigger: "Person hat im Aufenthaltsstaat selbst bezahlt", safeFirstStep: "Koordinierten Erstattungsweg nennen, keinen Betrag zusagen.", riskLevel: "high", dimensions: { what: "reimbursement-orientation-not-amount", whoWhen: "provider-status-fail-closed", documents: EU_SHARED_EHIC_CLAIM_KEY, how: "exact-institution-fetch-live", next: "private-provider-not-automatic", deadlines: SHARED_FRESHNESS, problems: "ehic-not-everything-free", dutiesAfter: "s1-change-requires-reexamination", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ehic-not-travel-insurance" } },
  { key: "planned-treatment-detection", title: "Geplante Behandlung 2026 erkennen", trigger: "Reisezweck ist Behandlung oder Nutzer will EHIC/S1 für Operation nutzen", safeFirstStep: "Artikel 19 und EHIC nicht anwenden.", riskLevel: "high", dimensions: { what: "purpose-of-travel-for-treatment-not-art-19", whoWhen: "art-20-planned-treatment-needs-authorisation", documents: EU_SHARED_S2_CLAIM_KEY, how: "medical-justification-case-specific", next: "art-20-2-authorisation-conditions", deadlines: SHARED_FRESHNESS, problems: "ehic-not-planned-treatment", dutiesAfter: "s1-change-requires-reexamination", institution: SHARED_INSTITUTION, boundaries: "s1-residence-care-not-planned-foreign-treatment", freshness: SHARED_FRESHNESS, negatives: "s1-not-s2" } },
  { key: "art-20-authorization", title: "Artikel-20-Genehmigung 2026 prüfen", trigger: "Geplante Behandlung soll genehmigt werden", safeFirstStep: "Gesetzliche kumulativen Bedingungen nennen, keine automatische Zusage wegen Warteliste.", riskLevel: "high", dimensions: { what: "art-20-2-authorisation-conditions", whoWhen: "waiting-list-not-automatic-s2", documents: EU_SHARED_S2_CLAIM_KEY, how: "medical-justification-case-specific", next: "non-resident-s2-residence-forwards-competent-decides", deadlines: SHARED_FRESHNESS, problems: "s2-not-yet-granted-not-entitlement", dutiesAfter: "s1-change-requires-reexamination", institution: SHARED_INSTITUTION, boundaries: "directive-2011-24-not-regulation-s2", freshness: SHARED_FRESHNESS, negatives: "s2-not-any-desired-treatment" } },
  { key: "s2-purpose", title: "S2-Zweck 2026 einordnen", trigger: "Nutzer verlangt S2 oder hält S2 für beliebige Privatklinik", safeFirstStep: "S2 als Artikel-20-Genehmigung erklären.", riskLevel: "high", dimensions: { what: EU_SHARED_S2_CLAIM_KEY, whoWhen: "art-20-planned-treatment-needs-authorisation", documents: "s2-not-s1", how: "s2-not-yet-granted-not-entitlement", next: "non-resident-s2-residence-forwards-competent-decides", deadlines: SHARED_FRESHNESS, problems: "s2-not-automatic-private-clinic", dutiesAfter: "s1-change-requires-reexamination", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "s2-not-ehic" } },
  { key: "non-resident-s2-procedure", title: "S2 ohne Wohnsitz im zuständigen Staat 2026", trigger: "Antragsteller wohnt nicht im zuständigen Mitgliedstaat", safeFirstStep: "Wohnortträger leitet weiter, zuständiger Träger entscheidet.", riskLevel: "high", dimensions: { what: "non-resident-s2-residence-forwards-competent-decides", whoWhen: "s2-urgent-vital-special-procedure", documents: EU_SHARED_S2_CLAIM_KEY, how: "exact-institution-fetch-live", next: "s2-not-yet-granted-not-entitlement", deadlines: SHARED_FRESHNESS, problems: SHARED_INSTITUTION, dutiesAfter: "s1-change-requires-reexamination", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "s2-not-any-desired-treatment" } },
  { key: "directive-2011-24-boundary", title: "Richtlinie 2011/24 von S2 2026 trennen", trigger: "Nutzer fragt Erstattung nach der Patientenrechterichtlinie", safeFirstStep: "Anderen Rechtsrahmen benennen und keine S2-Erstattung ableiten.", riskLevel: "high", dimensions: { what: "directive-2011-24-not-regulation-s2", whoWhen: "directive-engine-not-implemented", documents: EU_SHARED_S2_CLAIM_KEY, how: "purpose-of-travel-for-treatment-not-art-19", next: "art-20-planned-treatment-needs-authorisation", deadlines: SHARED_FRESHNESS, problems: "s2-not-automatic-private-clinic", dutiesAfter: "s1-change-requires-reexamination", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "s2-not-any-desired-treatment" } },
  { key: "document-classifier-a1-s1-ehic-s2", title: "A1 S1 EHIC S2 2026 unterscheiden", trigger: "Nutzer verwechselt Portable Documents oder EHIC", safeFirstStep: "Jedes Dokument nur mit seiner Funktion nennen; A1-Definition nicht kopieren.", riskLevel: "high", dimensions: { what: "a1-not-copied-in-health-core", whoWhen: "s1-not-a1", documents: EU_SHARED_S1_CLAIM_KEY, how: EU_SHARED_EHIC_CLAIM_KEY, next: EU_SHARED_S2_CLAIM_KEY, deadlines: SHARED_FRESHNESS, problems: "a1-issued-not-automatic-s1", dutiesAfter: "s1-issued-not-a1-unnecessary", institution: SHARED_INSTITUTION, boundaries: "s3-out-of-scope-worker-v1", freshness: SHARED_FRESHNESS, negatives: SHARED_NEG } },
  { key: "private-insurance-boundary", title: "Gesetzliche und private Absicherung 2026 trennen", trigger: "Deutsches anwendbares Recht oder unklarer PKV-Status", safeFirstStep: "GKV/PKV nicht im EU-Kern entscheiden.", riskLevel: "high", dimensions: { what: "gkv-pkv-classified-by-german-pack", whoWhen: "pkv-unclear-fail-closed", documents: "a1-germany-not-automatic-gkv-s1", how: "private-german-insurance-not-automatic-statutory-s1", next: "exact-institution-fetch-live", deadlines: SHARED_FRESHNESS, problems: "socialna-poistovna-not-slovak-health-insurer", dutiesAfter: "s1-change-requires-reexamination", institution: "ehic-issuer-is-competent-institution", boundaries: "no-slovak-health-national-merits-in-eu-core", freshness: SHARED_FRESHNESS, negatives: "private-provider-not-automatic" } },
  { key: "cash-benefit-boundary", title: "Sach- und Geldleistungen 2026 trennen", trigger: "Nutzer verlangt Krankengeld, nemocenské oder Pflege aus S1 oder EHIC", safeFirstStep: "Nur die Grenze nennen, keinen Betrag.", riskLevel: "high", dimensions: { what: "cash-sickness-not-benefits-in-kind", whoWhen: "s1-ehic-not-krankengeld-amount", documents: EU_SHARED_S1_CLAIM_KEY, how: "no-cash-benefit-calculation-engine", next: "pflege-out-of-scope", deadlines: SHARED_FRESHNESS, problems: "occupational-accident-healthcare-out-of-scope", dutiesAfter: "s1-change-requires-reexamination", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "s1-not-health-policy" } },
  { key: "institutional-role-classifier", title: "Trägerrollen Krankenbehandlung 2026 unterscheiden", trigger: "Nutzer vermengt zuständigen Träger, Wohnortträger, Sociálna poisťovňa und Krankenkasse", safeFirstStep: "Rollen getrennt halten.", riskLevel: "high", dimensions: { what: SHARED_INSTITUTION, whoWhen: "socialna-poistovna-not-slovak-health-insurer", documents: EU_SHARED_S1_CLAIM_KEY, how: "exact-institution-fetch-live", next: "ehic-issuer-is-competent-institution", deadlines: SHARED_FRESHNESS, problems: "two-health-cards-not-two-applicable-systems", dutiesAfter: "s1-change-requires-reexamination", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "residence-health-card-not-second-system" } },
]);

export type ScenarioCoverage = "COVERED" | "EXPLICITLY_OUT_OF_SCOPE" | "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE";

type ScenarioSpec = Readonly<{
  id: string;
  label: string;
  coverage: ScenarioCoverage;
  requiredClaimKeys: readonly string[];
  requiredProcessKeys: readonly string[];
}>;

export const EU_HEALTH_SCENARIOS: readonly ScenarioSpec[] = Object.freeze([
  { id: "lives-sk-works-de-verified-de-statutory", label: "Wohnt SK, arbeitet nur DE, zuständig DE, gesetzlich", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_ART17_CLAIM_KEY, EU_SHARED_S1_CLAIM_KEY], requiredProcessKeys: ["art-17-residence-healthcare"] },
  { id: "lives-de-works-sk-verified-sk", label: "Wohnt DE, arbeitet nur SK, zuständig SK", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_ART17_CLAIM_KEY], requiredProcessKeys: ["art-17-residence-healthcare"] },
  { id: "nationality-sk-residence-de", label: "Staatsangehörigkeit SK, Wohnort DE", coverage: "COVERED", requiredClaimKeys: ["nationality-not-health-competent-state"], requiredProcessKeys: ["health-entitlement-classify"] },
  { id: "nationality-de-residence-sk", label: "Staatsangehörigkeit DE, Wohnort SK", coverage: "COVERED", requiredClaimKeys: ["nationality-not-health-competent-state"], requiredProcessKeys: ["health-entitlement-classify"] },
  { id: "lives-sk-temporary-de-stay", label: "Wohnt SK, nur vorübergehender DE-Aufenthalt", coverage: "COVERED", requiredClaimKeys: ["art-19-temporary-stay-medically-necessary", "temporary-stay-not-automatic-s1"], requiredProcessKeys: ["temporary-stay-healthcare"] },
  { id: "german-work-slovak-address-real-residence-de", label: "DE-Arbeit, SK-Meldung, tatsächlicher Wohnort DE", coverage: "COVERED", requiredClaimKeys: ["trvaly-pobyt-not-automatic-eu-residence", "eu-residence-is-centre-of-interests"], requiredProcessKeys: ["residence-vs-stay-determine"] },
  { id: "german-work-actual-residence-sk", label: "DE-Arbeit, tatsächlicher Wohnort SK", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_S1_CLAIM_KEY, "lives-sk-works-de-not-automatic-de-health"], requiredProcessKeys: ["s1-eligibility-orientation"] },
  { id: "a1-exists-s1-not-requested", label: "A1 vorhanden, S1 nicht beantragt", coverage: "COVERED", requiredClaimKeys: ["a1-issued-not-automatic-s1"], requiredProcessKeys: ["document-classifier-a1-s1-ehic-s2"] },
  { id: "s1-thought-to-prove-applicable-law", label: "Nutzer hält S1 für anwendbares Recht", coverage: "COVERED", requiredClaimKeys: ["s1-not-applicable-legislation-proof", "s1-not-a1"], requiredProcessKeys: ["document-classifier-a1-s1-ehic-s2"] },
  { id: "s1-registered-in-residence-state", label: "S1 im Wohnstaat eingetragen", coverage: "COVERED", requiredClaimKeys: ["s1-registration-procedure-987-24"], requiredProcessKeys: ["s1-residence-registration"] },
  { id: "s1-issued-registration-incomplete", label: "S1 ausgestellt, Eintragung fehlt", coverage: "COVERED", requiredClaimKeys: ["s1-issued-not-residence-registration-complete"], requiredProcessKeys: ["s1-residence-registration"] },
  { id: "s1-later-cancelled", label: "S1 später aufgehoben", coverage: "COVERED", requiredClaimKeys: ["s1-change-requires-reexamination", "old-s1-not-entitlement-forever"], requiredProcessKeys: ["s1-change-cancellation"] },
  { id: "competent-state-changes-de-to-sk", label: "Zuständiger Staat wechselt DE nach SK", coverage: "COVERED", requiredClaimKeys: ["s1-change-requires-reexamination"], requiredProcessKeys: ["s1-change-cancellation"] },
  { id: "residence-changes-sk-to-de", label: "Wohnort wechselt SK nach DE", coverage: "COVERED", requiredClaimKeys: ["s1-change-requires-reexamination"], requiredProcessKeys: ["s1-change-cancellation"] },
  { id: "family-member-lives-with-worker", label: "Familienangehörige lebt mit der beschäftigten Person", coverage: "COVERED", requiredClaimKeys: ["eu-family-member-uses-national-classification"], requiredProcessKeys: ["family-member-coordination-gate"] },
  { id: "family-member-lives-elsewhere", label: "Familienangehörige lebt in einem anderen Staat", coverage: "COVERED", requiredClaimKeys: ["eu-family-member-uses-national-classification", "art-18-2-frontier-family-rule"], requiredProcessKeys: ["family-member-coordination-gate"] },
  { id: "family-dependency-unclear", label: "Familienabhängigkeit unklar", coverage: "COVERED", requiredClaimKeys: ["family-dependency-unclear-fail-closed"], requiredProcessKeys: ["family-member-coordination-gate"] },
  { id: "ordinary-doctor-visit-under-s1", label: "Gewöhnlicher Arztbesuch im Wohnstaat unter S1", coverage: "COVERED", requiredClaimKeys: ["s1-residence-care-not-planned-foreign-treatment"], requiredProcessKeys: ["art-17-residence-healthcare"] },
  { id: "worker-wants-care-in-competent-state", label: "Behandlung im zuständigen Staat", coverage: "COVERED", requiredClaimKeys: ["art-18-healthcare-in-competent-state", "not-only-healthcare-where-you-live"], requiredProcessKeys: ["art-18-healthcare-in-competent-state"] },
  { id: "two-cards-thought-double-insurance", label: "Zwei Karten als Doppelversicherung", coverage: "COVERED", requiredClaimKeys: ["two-health-cards-not-two-applicable-systems"], requiredProcessKeys: ["institutional-role-classifier"] },
  { id: "holiday-in-third-eu-state", label: "Urlaub in drittem EU-Staat", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_EHIC_CLAIM_KEY, "de-insured-sk-s1-ehic-from-de"], requiredProcessKeys: ["ehic-issuer-route"] },
  { id: "illness-becomes-necessary-during-stay", label: "Erkrankung wird während des Aufenthalts notwendig", coverage: "COVERED", requiredClaimKeys: ["art-19-temporary-stay-medically-necessary"], requiredProcessKeys: ["temporary-stay-healthcare"] },
  { id: "non-emergency-medically-necessary", label: "Nicht Notfall, aber medizinisch notwendig", coverage: "COVERED", requiredClaimKeys: ["ehic-not-emergency-only"], requiredProcessKeys: ["ehic-purpose"] },
  { id: "travel-specifically-for-treatment", label: "Reise eigens zur Behandlung", coverage: "COVERED", requiredClaimKeys: ["purpose-of-travel-for-treatment-not-art-19", "art-20-planned-treatment-needs-authorisation"], requiredProcessKeys: ["planned-treatment-detection"] },
  { id: "ehic-for-planned-surgery", label: "EHIC für geplante Operation", coverage: "COVERED", requiredClaimKeys: ["ehic-not-planned-treatment"], requiredProcessKeys: ["planned-treatment-detection"] },
  { id: "s1-for-planned-foreign-treatment", label: "S1 für geplante Auslandsbehandlung", coverage: "COVERED", requiredClaimKeys: ["s1-not-s2", "s1-residence-care-not-planned-foreign-treatment"], requiredProcessKeys: ["planned-treatment-detection"] },
  { id: "s2-granted", label: "S2 genehmigt", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_S2_CLAIM_KEY], requiredProcessKeys: ["s2-purpose"] },
  { id: "s2-not-yet-granted", label: "S2 noch nicht genehmigt", coverage: "COVERED", requiredClaimKeys: ["s2-not-yet-granted-not-entitlement"], requiredProcessKeys: ["art-20-authorization"] },
  { id: "cannot-be-provided-in-justifiable-time", label: "Behandlung nicht in vertretbarer Zeit", coverage: "COVERED", requiredClaimKeys: ["art-20-2-authorisation-conditions"], requiredProcessKeys: ["art-20-authorization"] },
  { id: "long-waiting-list-assumed-s2", label: "Lange Warteliste als automatisches S2", coverage: "COVERED", requiredClaimKeys: ["waiting-list-not-automatic-s2"], requiredProcessKeys: ["art-20-authorization"] },
  { id: "treatment-at-private-provider", label: "Behandlung bei privatem Erbringer", coverage: "COVERED", requiredClaimKeys: ["private-provider-not-automatic"], requiredProcessKeys: ["private-insurance-boundary"] },
  { id: "ehic-assumed-zero-cost", label: "EHIC als Nullkosten", coverage: "COVERED", requiredClaimKeys: ["ehic-not-everything-free"], requiredProcessKeys: ["ehic-purpose"] },
  { id: "ehic-assumed-travel-insurance", label: "EHIC als Reiseversicherung", coverage: "COVERED", requiredClaimKeys: ["ehic-not-travel-insurance"], requiredProcessKeys: ["ehic-purpose"] },
  { id: "lost-ehic-prc", label: "EHIC verloren, PRC-Weg", coverage: "COVERED", requiredClaimKeys: ["prc-same-entitlement-as-ehic"], requiredProcessKeys: ["prc-boundary"] },
  { id: "de-insured-s1-sk-holiday-cz-ehic-issuer", label: "Zuständig DE, S1 SK, Urlaub CZ: EHIC-Aussteller", coverage: "COVERED", requiredClaimKeys: ["de-insured-sk-s1-ehic-from-de", "ehic-issuer-is-competent-institution"], requiredProcessKeys: ["ehic-issuer-route"] },
  { id: "posted-stay-residence-remains-de", label: "Entsendung, Wohnort bleibt DE", coverage: "COVERED", requiredClaimKeys: ["posted-stay-uses-ehic-principles", "posting-not-automatic-s1"], requiredProcessKeys: ["residence-vs-stay-determine"] },
  { id: "posted-actually-transfers-residence-sk", label: "Entsandte Person begründet Wohnort SK", coverage: "COVERED", requiredClaimKeys: ["posted-residence-transfer-may-need-s1", "posting-not-always-ehic-sufficient"], requiredProcessKeys: ["residence-vs-stay-determine"] },
  { id: "residence-classification-unclear", label: "Wohnortklassifikation unklar", coverage: "COVERED", requiredClaimKeys: ["residence-unclear-fail-closed"], requiredProcessKeys: ["residence-vs-stay-determine"] },
  { id: "german-law-pkv-unclear", label: "Deutsches Recht, PKV unklar", coverage: "COVERED", requiredClaimKeys: ["pkv-unclear-fail-closed"], requiredProcessKeys: ["private-insurance-boundary"] },
  { id: "german-law-statutory-gkv", label: "Deutsches Recht, gesetzliche GKV", coverage: "COVERED", requiredClaimKeys: ["gkv-pkv-classified-by-german-pack", "a1-germany-not-automatic-gkv-s1"], requiredProcessKeys: ["private-insurance-boundary"] },
  { id: "asks-krankengeld-amount", label: "Nutzer verlangt Krankengeldbetrag", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["no-cash-benefit-calculation-engine"], requiredProcessKeys: ["cash-benefit-boundary"] },
  { id: "asks-pflege", label: "Nutzer verlangt Pflegeleistung", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["pflege-out-of-scope"], requiredProcessKeys: ["cash-benefit-boundary"] },
  { id: "retired-frontier-s3", label: "Ehemaliger Grenzarbeitnehmer verlangt S3", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["s3-out-of-scope-worker-v1"], requiredProcessKeys: ["document-classifier-a1-s1-ehic-s2"] },
  { id: "uk-case", label: "UK-Fall", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["uk-post-brexit-out-of-scope"], requiredProcessKeys: ["health-entitlement-classify"] },
  { id: "non-eu-bilateral", label: "Nicht-EU-bilateraler Fall", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["non-eu-bilateral-out-of-scope"], requiredProcessKeys: ["health-entitlement-classify"] },
  { id: "directive-reimbursement-question", label: "Richtlinien-Erstattungsfrage", coverage: "COVERED", requiredClaimKeys: ["directive-engine-not-implemented", "directive-2011-24-not-regulation-s2"], requiredProcessKeys: ["directive-2011-24-boundary"] },
  { id: "locale-sk-factual-de-cz", label: "Locale SK, Sachverhalt DE-CZ", coverage: "COVERED", requiredClaimKeys: ["user-locale-not-health-competence"], requiredProcessKeys: ["health-entitlement-classify"] },
  { id: "factual-de-sk-locale-hu", label: "Sachverhalt DE-SK, Locale HU", coverage: "COVERED", requiredClaimKeys: ["user-locale-not-health-competence"], requiredProcessKeys: ["health-entitlement-classify"] },
  { id: "self-employed-insured-art-17", label: "Selbständig versichert, Wohnort anderer Staat", coverage: "COVERED", requiredClaimKeys: ["art-17-insured-person-includes-self-employed", EU_SHARED_ART17_CLAIM_KEY], requiredProcessKeys: ["art-17-residence-healthcare"] },
  { id: "art-23-multiple-schemes", label: "Mehrere nationale Krankheitssysteme, Artikel 23", coverage: "COVERED", requiredClaimKeys: ["art-23-applicable-scheme-multiple-categories", "art-23-not-employment-or-automatic-gkv"], requiredProcessKeys: ["art-17-residence-healthcare"] },
  { id: "self-employed-not-automatic-documents", label: "Selbständigkeit allein, S1 EHIC S2 verlangt", coverage: "COVERED", requiredClaimKeys: ["self-employed-not-automatic-s1-ehic-s2"], requiredProcessKeys: ["s1-eligibility-orientation"] },
  { id: "asks-self-employed-contribution-amount", label: "Verlangt Selbständigen-Krankenbeitrag", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["self-employed-health-contribution-out-of-scope"], requiredProcessKeys: ["cash-benefit-boundary"] },
]);

export const EU_HEALTH_NEGATIVE_CONTROLS = Object.freeze([
  "work-state-not-automatic-health-competence",
  "competent-institution-not-residence-institution",
  "residence-healthcare-not-second-insurance",
  "two-health-cards-not-two-applicable-systems",
  "nationality-not-health-competent-state",
  "user-locale-not-health-competence",
  "trvaly-pobyt-not-automatic-eu-residence",
  "anmeldung-not-automatic-eu-residence",
  "posting-not-automatic-s1",
  "posting-not-always-ehic-sufficient",
  "s1-not-a1",
  "s1-not-ehic",
  "s1-not-s2",
  "ehic-not-s2",
  "ehic-not-travel-insurance",
  "ehic-not-emergency-only",
  "ehic-not-planned-treatment",
  "ehic-not-everything-free",
  "s1-issued-not-residence-registration-complete",
  "waiting-list-not-automatic-s2",
  "directive-2011-24-not-regulation-s2",
  "s1-residence-care-not-planned-foreign-treatment",
  "socialna-poistovna-not-slovak-health-insurer",
  "a1-germany-not-automatic-gkv-s1",
  "private-german-insurance-not-automatic-statutory-s1",
  "cash-sickness-not-benefits-in-kind",
  "art-23-not-employment-or-automatic-gkv",
  "self-employed-not-automatic-s1-ehic-s2",
]);

export function evaluateEuHealthProcessCompleteness(
  pack: {
    claims: readonly { key: string }[];
    processes: readonly { key: string; id: string }[];
    processClaimLinks: readonly Record<string, unknown>[];
  },
) {
  const processKeys = new Set(pack.processes.map((process) => process.key));
  const claimKeys = new Set(pack.claims.map((claim) => claim.key));
  const incomplete = EU_HEALTH_PROCESSES.filter((process) => (
    PROCESS_COMPLETE_DIMENSIONS.some((dimension) => !claimKeys.has(process.dimensions[dimension]))
  ));
  const blocked = EU_HEALTH_SCENARIOS.filter((scenario) => scenario.coverage === "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE");
  const covered = EU_HEALTH_SCENARIOS.filter((scenario) => scenario.coverage === "COVERED");
  const outOfScope = EU_HEALTH_SCENARIOS.filter((scenario) => scenario.coverage === "EXPLICITLY_OUT_OF_SCOPE");
  const uncoveredRequired = covered.flatMap((scenario) => [
    ...scenario.requiredProcessKeys.filter((key) => !processKeys.has(key)).map((key) => `process:${scenario.id}:${key}`),
    ...scenario.requiredClaimKeys.filter((key) => !claimKeys.has(key)).map((key) => `claim:${scenario.id}:${key}`),
  ]);
  const processComplete = incomplete.length === 0 && uncoveredRequired.length === 0
    && pack.processes.length === EU_HEALTH_PROCESSES.length;
  return Object.freeze({
    processCount: pack.processes.length,
    processComplete,
    processCompletenessPercent: processComplete ? 100 : 0,
    blockedScenarioCount: blocked.length,
    coveredScenarioCount: covered.length,
    outOfScopeScenarioCount: outOfScope.length,
    processScenarioCount: EU_HEALTH_SCENARIOS.length,
    totalScenarios: EU_HEALTH_SCENARIOS.length,
    incompleteProcessKeys: incomplete.map((process) => process.key),
    uncoveredRequired,
  });
}

export type EuHealthInsuranceCoordinationPack = ReturnType<typeof buildEuHealthInsuranceCoordinationPack>;

export function buildEuHealthInsuranceCoordinationPack() {
  const item = factory(EU_HEALTH_PACK_ID);
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
    youreurope: item("publishers", "youreurope-health", {
      name: "Your Europe", type: "eu_official_guidance",
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
    youreurope: item("authorities", "youreurope-health-authority", {
      publisherId: publishers.youreurope.id, name: "Your Europe", type: "eu_official_guidance",
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      officialPortalUrl: "https://europa.eu/youreurope",
    }),
  };
  const publisherOf = { eurlex: publishers.eurlex, commission: publishers.commission, youreurope: publishers.youreurope };
  const authorityOf = { eurlex: authorities.eurlex, commission: authorities.commission, youreurope: authorities.youreurope };

  const sources = EU_HEALTH_OFFICIAL_SOURCES.map((spec) => {
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

  const claims = EU_HEALTH_UNITS.map((unit) => {
    const source = sourceByKey.get(unit.sourceKey);
    const passage = passageByKey.get(unit.passageKey);
    if (!source || !passage) throw new Error(`EU_HEALTH_UNIT_SOURCE_MISSING:${unit.key}`);
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

  const processes = EU_HEALTH_PROCESSES.map((spec) => item("processes", spec.key, {
    processGroupId: EU_HEALTH_PROCESS_GROUP, title: spec.title, jurisdictionId: jurisdiction.id,
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
    if (!stored || !claim) throw new Error(`EU_HEALTH_PROCESS_CLAIM_MISSING:${processKey}:${claimKey}`);
    seen.add(token);
    processClaimLinks.push(item("processClaimLinks", token, {
      processId: stored.id, claimId: claim.id, role, required: true,
      sequenceContext: role, qualificationRequired: false,
    }));
  };
  for (const process of EU_HEALTH_PROCESSES) {
    for (const dimension of PROCESS_COMPLETE_DIMENSIONS) {
      addLink(process.key, process.dimensions[dimension], dimension);
    }
  }
  for (const scenario of EU_HEALTH_SCENARIOS) {
    if (scenario.coverage !== "COVERED") continue;
    for (const processKey of scenario.requiredProcessKeys) {
      for (const claimKey of scenario.requiredClaimKeys) {
        addLink(processKey, claimKey, "scenario");
      }
    }
  }

  return Object.freeze({
    schemaVersion: 1 as const,
    packId: EU_HEALTH_PACK_ID,
    canonicalLanguage: EU_HEALTH_CANONICAL_LANGUAGE,
    trustDomain,
    jurisdictions: [jurisdiction],
    territorialScopes: [scope],
    publishers: [publishers.eurlex, publishers.commission, publishers.youreurope],
    authorities: [authorities.eurlex, authorities.commission, authorities.youreurope],
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

export function validateEuHealthInsuranceCoordinationPack(
  pack: EuHealthInsuranceCoordinationPack,
) {
  const issues: string[] = [];
  if (pack.schemaVersion !== 1 || pack.packId !== EU_HEALTH_PACK_ID) issues.push("EU_HEALTH_IDENTITY_INVALID");
  if (pack.canonicalLanguage !== "de") issues.push("INVALID_CANONICAL_LANGUAGE");
  if (pack.trustDomain.code !== "eu") issues.push("EU_TRUST_DOMAIN_REQUIRED");
  for (const jurisdiction of pack.jurisdictions) {
    if (jurisdiction.level !== "eu" || jurisdiction.countryCode !== "EU") issues.push("EU_JURISDICTION_REQUIRED");
  }
  if (pack.claims.some((claim) => claim.temporalClass !== "CURRENT")) issues.push("NON_CURRENT_CLAIM");
  if (EU_HEALTH_FUTURE_WATCH.some((item) => item.ingestible)) issues.push("WATCH_ITEM_MARKED_INGESTIBLE");
  const urls = pack.sources.map((source) => String(source.canonicalUrl));
  if (new Set(urls).size !== urls.length) issues.push("DUPLICATE_CANONICAL_URL");
  if (urls.some((url) => url.includes("#"))) issues.push("HASH_IN_CANONICAL_URL");
  const forbidden = /wikipedia|reddit|linkedin|expat|blog|forum|anwalt|kanzlei/iu;
  if (urls.some((url) => forbidden.test(url))) issues.push("NON_AUTHORITATIVE_CANONICAL_URL");
  const completeness = evaluateEuHealthProcessCompleteness(pack);
  if (completeness.blockedScenarioCount !== 0) issues.push("BLOCKED_SCENARIOS");
  if (completeness.processCompletenessPercent !== 100) issues.push("PROCESS_INCOMPLETE");
  if (!EU_HEALTH_NEGATIVE_CONTROLS.every((key) => pack.claims.some((claim) => claim.key === key))) {
    issues.push("MISSING_NEGATIVE_CONTROL");
  }
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    authoringUsesKeysNotDatabaseUuids: true,
    productionEligible: false,
  });
}

export function euHealthPackSummary(
  pack: EuHealthInsuranceCoordinationPack = buildEuHealthInsuranceCoordinationPack(),
) {
  const completeness = evaluateEuHealthProcessCompleteness(pack);
  return Object.freeze({
    packId: pack.packId,
    canonicalLanguage: pack.canonicalLanguage,
    claimCount: pack.claims.length,
    legacyCount: 0,
    futureCount: EU_HEALTH_FUTURE_WATCH.length,
    proposedNotCurrentCount: EU_HEALTH_FUTURE_WATCH.filter((item) => item.temporalClass === "PROPOSED_NOT_CURRENT").length,
    sourceCount: pack.sources.length,
    processClaimLinkCount: pack.processClaimLinks.length,
    ...completeness,
    processCount: pack.processes.length,
    validation: validateEuHealthInsuranceCoordinationPack(pack),
  });
}
