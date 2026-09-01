/**
 * CB-0I — Shared EU unemployment coordination / aggregation / U1 / U2 / frontier-worker core.
 * Stored once for later DE↔SK / DE↔CZ / DE↔PL / DE↔HU unemployment connectors.
 * Coordinates existing or potential national unemployment rights. Does not invent entitlement.
 * Canonical language de; source jurisdiction EU.
 */
import { createHash } from "node:crypto";

import { COD_2016_0397_STATUS } from "../../../source-registry/cross-border-connector-contracts";
import { stableKnowledgeFactoryId } from "../../../source-registry/knowledge-factory-contracts";
import { PROCESS_COMPLETE_DIMENSIONS } from "../applicable-legislation/eu-applicable-legislation-core-pack";

export const EU_UNEMP_PACK_ID = "eu_unemployment_coordination" as const;
export const EU_UNEMP_CANONICAL_LANGUAGE = "de" as const;
export const EU_UNEMP_TRUST_DOMAIN = "eu" as const;
export const EU_UNEMP_PROCESS_GROUP = "eu_unemployment_coordination" as const;
export const EU_UNEMP_REG_883_CURRENT_CELEX = "02004R0883-20190731" as const;
export const EU_UNEMP_REG_987_CURRENT_CELEX = "02009R0987-20180101" as const;
export const EU_UNEMP_REG_883_CURRENT_CONSOLIDATION_DATE = "2019-07-31" as const;
export const EU_UNEMP_REG_987_CURRENT_CONSOLIDATION_DATE = "2018-01-01" as const;
export const EU_SHARED_ART1F_CLAIM_KEY = "ue-art-1f-frontier-worker" as const;
export const EU_SHARED_ART61_CLAIM_KEY = "ue-art-61-aggregation" as const;
export const EU_SHARED_ART62_CLAIM_KEY = "ue-art-62-calculation" as const;
export const EU_SHARED_ART64_CLAIM_KEY = "ue-art-64-export" as const;
export const EU_SHARED_ART65_CLAIM_KEY = "ue-art-65-frontier-residence" as const;
export const EU_SHARED_ART65A_CLAIM_KEY = "ue-art-65a-self-employed-exception" as const;
export const EU_SHARED_PD_U1_CLAIM_KEY = "ue-pd-u1-period-evidence" as const;
export const EU_SHARED_PD_U2_CLAIM_KEY = "ue-pd-u2-export-authorization" as const;
export const EU_SHARED_PD_U3_CLAIM_KEY = "ue-pd-u3-export-warning" as const;
export const EU_SHARED_JELTES_CLAIM_KEY = "ue-jeltes-no-choice" as const;
export const EU_SHARED_DECISION_U3_CLAIM_KEY = "ue-decision-u3-contractual-link" as const;

export const REUSED_EU_RESIDENCE_CLAIM_KEYS = Object.freeze([
  "art-11-not-otherwise-covered-residence",
] as const);

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

export const GERMAN_ALG_PACK_BOUNDARY = Object.freeze([
  {
    pack: "arbeitslosengeld",
    keys: [
      "pd-u1-insurance-periods",
      "pd-u2-export-job-search",
      "u2-three-months-extend-six",
      "apply-u2-before-leaving",
      "u1-not-u2",
      "u2-not-ordinary-travel",
      "egvo-unemployment-export",
      "domestic-absence-not-u2",
    ],
    note: "German ALG qualifying period, amounts, duration, Sperrzeit and Agentur routing remain the national core. CB-0I does not duplicate them.",
  },
] as const);

export const EU_UNEMP_FUTURE_WATCH = Object.freeze([
  {
    key: "cod-2016-0397-six-month-u2-export",
    temporalClass: COD_2016_0397_STATUS,
    text: "Der Parlaments-Erstlesungstext 2026 und die vorläufige politische Einigung schlagen eine sechsmonatige Regelausfuhr von Arbeitslosenleistungen vor. Das bleibt vorgeschlagene, nicht geltende Revision.",
    ingestible: false,
  },
  {
    key: "cod-2016-0397-22-week-last-activity-rule",
    temporalClass: COD_2016_0397_STATUS,
    text: "Der Reformtext 2016/0397(COD) enthält ein vorgeschlagenes 22-Wochen-Schwellenkonzept der letzten Tätigkeit für die grenzüberschreitende Leistungskompetenz. Es ist nicht geltendes Recht und ändert Artikel 65 nicht.",
    ingestible: false,
  },
] as const);

export type EuUnempCaseFacts = Readonly<{
  unemploymentStatus?: "WHOLE" | "PARTIAL" | "INTERMITTENT" | "UNCLEAR" | null;
  employmentRelationshipKnown?: boolean | null;
  lastActivityState?: string | null;
  residenceVerified?: boolean | null;
  frontierWorkerStatusKnown?: boolean | null;
  lastActivityType?: "EMPLOYED" | "SELF_EMPLOYED" | "SPECIAL_CIVIL_SERVANT" | "UNKNOWN" | null;
  nationalEntitlementVerified?: boolean | null;
  lastSalaryKnown?: boolean | null;
  article65aNotificationVerified?: boolean | null;
  exportPurposeIsJobSearch?: boolean | null;
}>;

export function detectMissingUnemploymentFacts(facts: EuUnempCaseFacts): readonly string[] {
  const missing: string[] = [];
  if (facts.unemploymentStatus == null || facts.unemploymentStatus === "UNCLEAR") {
    missing.push("unemploymentType");
  }
  if (facts.employmentRelationshipKnown !== true) missing.push("contractualLink");
  if (!facts.lastActivityState) missing.push("lastActivityState");
  if (facts.residenceVerified !== true) missing.push("residence");
  if (facts.frontierWorkerStatusKnown !== true) missing.push("frontierWorkerStatus");
  if (facts.lastActivityType == null || facts.lastActivityType === "UNKNOWN") {
    missing.push("lastActivityType");
  }
  if (facts.nationalEntitlementVerified !== true) missing.push("nationalEntitlement");
  if (facts.lastSalaryKnown !== true) missing.push("exactSalary");
  if (facts.lastActivityType === "SELF_EMPLOYED" && facts.article65aNotificationVerified !== true) {
    missing.push("article65aNotification");
  }
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
  retrievalMethod: "HTML_DOCUMENT" | "PDF_DOCUMENT";
  informationClass: "LEGAL_BASELINE" | "PROCESS_IDENTITY" | "AUTHORITY_COMPETENCE" | "ELIGIBILITY" | "CONTACT_DETAILS";
  handlingMode: "STORE_CANONICALLY" | "CACHE_AND_REVALIDATE" | "FETCH_LIVE" | "DO_NOT_ANSWER_WITHOUT_CONTEXT";
  freshnessClass: "LEGAL_CHANGE_MONITORED" | "EVENT_DRIVEN";
  staleBehavior: "DO_NOT_USE_STALE" | "REVALIDATE_BEFORE_USE";
  passages: readonly Readonly<{ key: string; locator: string; text: string }>[];
}>;

export const EU_UNEMP_OFFICIAL_SOURCES: readonly SourceSpec[] = Object.freeze([
  {
    key: "ue-vo-883",
    publisherKey: "eurlex",
    url: `https://eur-lex.europa.eu/legal-content/DE/TXT/PDF/?uri=CELEX:${EU_UNEMP_REG_883_CURRENT_CELEX}`,
    officialDomain: "eur-lex.europa.eu",
    title: "Verordnung (EG) Nr. 883/2004 konsolidiert 31.07.2019 Titel III Kapitel 6 Arbeitslosenleistungen",
    sourceClass: "EU_LAW",
    sourceType: "eu_regulation",
    retrievalMethod: "PDF_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    passages: [
      { key: "ue-vo-883-art-1f", locator: "Art. 1 Buchst. f", text: "Grenzarbeitnehmer ist, wer in einem Mitgliedstaat eine Beschäftigung oder selbständige Tätigkeit ausübt, in einem anderen Mitgliedstaat wohnt und in der Regel täglich oder mindestens einmal wöchentlich dorthin zurückkehrt. Bloße Grenzüberschreitung, Staatsangehörigkeit oder eine Meldeadresse ersetzen diese Rückkehrhäufigkeit nicht." },
      { key: "ue-vo-883-art-7", locator: "Art. 7", text: "Geldleistungen dürfen grundsätzlich nicht allein deshalb gekürzt oder entzogen werden, weil die berechtigte Person in einem anderen Mitgliedstaat wohnt. Titel III Kapitel 6 enthält besondere Arbeitslosenregeln; Artikel 7 begründet daher keine allgemeine Ausfuhr von Arbeitslosenleistungen ohne Artikel 64 oder 65." },
      { key: "ue-vo-883-art-11-3-c", locator: "Art. 11 Abs. 3 Buchst. c", text: "Wer Arbeitslosenleistungen nach Artikel 65 bezieht, unterliegt den Rechtsvorschriften des Wohnmitgliedstaats. Dieser Titel-II-Kontext bestimmt nicht automatisch den zahlenden Arbeitslosenträger außerhalb der Kapitel-6-Regeln." },
      { key: "ue-vo-883-art-61", locator: "Art. 61", text: "Erfordern die zuständigen Rechtsvorschriften Versicherungs-, Beschäftigungs- oder Selbständigkeitszeiten für Erwerb, Fortbestand, Wiederaufleben oder Dauer der Arbeitslosenleistung, sind in einem anderen Mitgliedstaat zurückgelegte Zeiten der jeweiligen Kategorie nach Artikel 61 zu berücksichtigen. Artikel 61 Absatz 2 verlangt grundsätzlich die letzte einschlägige Zeit im Anspruchsstaat, außer in Fällen des Artikels 65 Absatz 5 Buchstabe a." },
      { key: "ue-vo-883-art-62", locator: "Art. 62", text: "Richtet sich die Arbeitslosenleistung nach dem früheren Entgelt oder Berufseinkommen, ist grundsätzlich das Entgelt der letzten Tätigkeit nach den vom zuständigen Träger angewandten Rechtsvorschriften maßgeblich. In Fällen des Artikels 65 Absatz 5 Buchstabe a berücksichtigt der Wohnsitzträger das tatsächlich in dem Staat der letzten Tätigkeit bezogene Entgelt; ein Mittelwert beider Staaten folgt daraus nicht." },
      { key: "ue-vo-883-art-63", locator: "Art. 63", text: "Kapitel 6 gilt für arbeitslose Personen, die nach den Rechtsvorschriften der Mitgliedstaaten Anspruch auf Arbeitslosenleistungen haben. Es koordiniert diesen Zweig und ersetzt nicht nationale Anspruchsvoraussetzungen, Sozialhilfe oder andere Leistungszweige." },
      { key: "ue-vo-883-art-64", locator: "Art. 64", text: "Eine vollständig arbeitslose Person mit bestehendem Anspruch kann unter kontrollierten Voraussetzungen in einem anderen Mitgliedstaat Arbeit suchen und den Anspruch behalten. Regelmäßig sind vier Wochen Verfügbarkeit vor der Abreise, Sieben-Tage-Meldung am Zielort, drei Monate Regelausfuhr und eine ermessensabhängige Verlängerung bis höchstens sechs Monate vorgesehen, begrenzt durch die restliche nationale Anspruchsdauer. Der zuständige Träger bleibt leistungspflichtig." },
      { key: "ue-vo-883-art-65", locator: "Art. 65", text: "Teilweise oder intermittierend Arbeitslose bleiben dem zuständigen Staat der letzten Tätigkeit zugeordnet. Vollständig arbeitslose Grenzarbeitnehmer stellen sich den Diensten des Wohnmitgliedstaats zur Verfügung und erhalten Leistungen nach dessen Rechtsvorschriften. Nicht-Grenzgänger, die nicht in den Wohnstaat zurückkehren, bleiben dem letzten Beschäftigungsstaat zugeordnet. Erstattung zwischen Trägern betrifft die ersten drei Monate, unter weiteren Voraussetzungen fünf Monate, und begründet keine zweite Nutzerleistung." },
      { key: "ue-vo-883-art-65a", locator: "Art. 65a", text: "Artikel 65a ist eine enge Ausnahme für vollständig arbeitslose Grenzarbeitnehmer mit letzter selbständiger Tätigkeit, wenn der Wohnmitgliedstaat amtlich mitgeteilt hat, dass dort keine Kategorie Selbständiger in ein Arbeitslosensystem einbezogen ist. Dann können Verfügbarkeit und Leistung dem Staat der letzten Selbständigkeit folgen. Die Ausfuhr in den Wohnstaat richtet sich mutatis mutandis nach Artikel 64, ohne die Vier-Wochen-Bedingung des Artikels 64 Absatz 1 Buchstabe a, soweit Artikel 65a sie ausschließt." },
    ],
  },
  {
    key: "ue-vo-987",
    publisherKey: "eurlex",
    url: `https://eur-lex.europa.eu/legal-content/DE/TXT/PDF/?uri=CELEX:${EU_UNEMP_REG_987_CURRENT_CELEX}`,
    officialDomain: "eur-lex.europa.eu",
    title: "Verordnung (EG) Nr. 987/2009 konsolidiert 01.01.2018 Arbeitslosenleistungen Artikel 11 und 54 bis 57 sowie 70",
    sourceClass: "EU_LAW",
    sourceType: "eu_regulation",
    retrievalMethod: "PDF_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    passages: [
      { key: "ue-vo-987-art-11", locator: "Art. 11", text: "Der Wohnsitz im Sinne der Koordinierung ist der tatsächliche Mittelpunkt der Interessen. Er folgt nicht aus trvalý pobyt, Anmeldung, Staatsangehörigkeit, alleiniger Steueransässigkeit, einem Adressfeld oder einer einfachen 183-Tage-Regel." },
      { key: "ue-vo-987-art-54", locator: "Art. 54", text: "Träger tauschen die für Zusammenrechnung und Berechnung erforderlichen Zeiten und Entgeltangaben aus. Für Artikel 62 Absatz 3 übermittelt der Träger der letzten Tätigkeit auf Ersuchen das notwendige Entgelt. Familienangehörige in einem anderen Mitgliedstaat können für Zuschläge wie im zuständigen Staat wohnhaft gelten, sofern nicht eine andere Person im Wohnstaat der Familienangehörigen bereits eine Arbeitslosenleistung bezieht, die diese Personen berücksichtigt." },
      { key: "ue-vo-987-art-55", locator: "Art. 55", text: "Bei Ausfuhr nach Artikel 64 unterwirft der Zielstaat die Person den dort geltenden Kontrollen der Arbeitsuche und teilt dem leistenden Träger erhebliche Umstände mit. Das Portable Document U2 befreit nicht von Pflichten." },
      { key: "ue-vo-987-art-56", locator: "Art. 56", text: "Artikel 56 führt die Verfügbarkeit und Meldung vollständig arbeitsloser Personen nach Artikel 65 durch, einschließlich ergänzender Meldung im früheren Tätigkeitsstaat. Wohnsitzpflichten haben bei Kollision verfahrensrechtliche Bedeutung. Die Person wählt nicht den günstigeren Leistungsstaat." },
      { key: "ue-vo-987-art-57", locator: "Art. 57", text: "Personen eines besonderen Arbeitslosensystems für Beamte unterliegen besonderen Durchführungsregeln und sind nicht automatisch nach den gewöhnlichen Artikel-56-Wegen zu führen. Nationale Beamtenmerits werden hier nicht aufgebaut." },
      { key: "ue-vo-987-art-70", locator: "Art. 70", text: "Artikel 70 führt die Erstattung von Arbeitslosenleistungen nach Artikel 65 Absätze 6 und 7 zwischen Trägern durch. Die Erstattung ist Trägerausgleich, keine zweite Zahlung an die arbeitslose Person." },
    ],
  },
  {
    key: "ue-decision-u1",
    publisherKey: "eurlex",
    url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32010D0424(11)",
    officialDomain: "eur-lex.europa.eu",
    title: "Beschluss Nr. U1 der Verwaltungskommission vom 12. Juni 2009 zu Familienangehörigenzuschlägen nach Artikel 54 Absatz 3",
    sourceClass: "EU_LAW",
    sourceType: "eu_decision",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    passages: [
      { key: "ue-decision-u1-text", locator: "Beschluss U1", text: "Beschluss Nr. U1 der Verwaltungskommission vom 12. Juni 2009 betrifft Familienangehörigenzuschläge bei Arbeitslosenleistungen nach Artikel 54 Absatz 3 der Verordnung 987/2009. Er ist nicht das Portable Document U1. Nationale Zuschlagsformeln werden nicht aufgebaut." },
    ],
  },
  {
    key: "ue-decision-u2",
    publisherKey: "eurlex",
    url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32010D0424(12)",
    officialDomain: "eur-lex.europa.eu",
    title: "Beschluss Nr. U2 der Verwaltungskommission vom 12. Juni 2009 zum Anwendungsbereich des Artikels 65 Absatz 2 für Nicht-Grenzarbeitnehmer",
    sourceClass: "EU_LAW",
    sourceType: "eu_decision",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    passages: [
      { key: "ue-decision-u2-text", locator: "Beschluss U2", text: "Beschluss Nr. U2 der Verwaltungskommission vom 12. Juni 2009 betrifft den Anwendungsbereich des Artikels 65 Absatz 2 für vollständig arbeitslose Personen, die keine Grenzarbeitnehmer sind. Er ist nicht das Portable Document U2 zur Ausfuhr bestehender Arbeitslosenleistungen." },
    ],
  },
  {
    key: "ue-decision-u3",
    publisherKey: "eurlex",
    url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32010D0424(13)",
    officialDomain: "eur-lex.europa.eu",
    title: "Beschluss Nr. U3 der Verwaltungskommission vom 12. Juni 2009 zur Teilarbeitslosigkeit nach Artikel 65 Absatz 1",
    sourceClass: "EU_LAW",
    sourceType: "eu_decision",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    passages: [
      { key: "ue-decision-u3-text", locator: "Beschluss U3", text: "Beschluss Nr. U3 der Verwaltungskommission vom 12. Juni 2009 betrifft den Anwendungsbereich der Teilarbeitslosigkeit nach Artikel 65 Absatz 1. Maßgeblich ist, ob ein vertragliches Beschäftigungsverhältnis fortbesteht. Null Stunden, Kurzarbeit oder vorübergehende Freistellung bedeuten nicht automatisch Vollarbeitslosigkeit. Dieser Beschluss ist nicht das Portable Document U3." },
    ],
  },
  {
    key: "ue-decision-u4",
    publisherKey: "eurlex",
    url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32012D0225(04)",
    officialDomain: "eur-lex.europa.eu",
    title: "Beschluss Nr. U4 der Verwaltungskommission vom 13. Dezember 2011 zum Erstattungsverfahren nach Artikel 65 Absätze 6 und 7",
    sourceClass: "EU_LAW",
    sourceType: "eu_decision",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    passages: [
      { key: "ue-decision-u4-text", locator: "Beschluss U4", text: "Beschluss Nr. U4 der Verwaltungskommission vom 13. Dezember 2011 betrifft das Erstattungsverfahren zwischen Trägern nach Artikel 65 Absätze 6 und 7. Es handelt sich um Trägerausgleich im Hintergrund, den die arbeitslose Person nicht persönlich als zweite Leistung beantragt." },
    ],
  },
  {
    key: "ue-cjeu-jeltes",
    publisherKey: "eurlex",
    url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:62011CJ0443",
    officialDomain: "eur-lex.europa.eu",
    title: "EuGH C-443/11 Jeltes u. a.",
    sourceClass: "EU_LAW",
    sourceType: "cjeu_judgment",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    passages: [
      { key: "ue-cjeu-jeltes-text", locator: "C-443/11", text: "Nach C-443/11 Jeltes kann ein vollständig arbeitsloser Grenzarbeitnehmer die Arbeitslosenleistung nicht vom früheren Beschäftigungsstaat verlangen, nur weil Bindungen oder Arbeitsaussichten dort stärker sind. Die ergänzende Meldung dort dient der Arbeitsuche, nicht einer zweiten Leistung und nicht der Kompetenzwahl. Die historische Miethe-Ausnahme gilt unter der geltenden Verordnung 883/2004 nicht." },
    ],
  },
  {
    key: "ue-commission-unemployment",
    publisherKey: "commission",
    url: "https://europa.eu/youreurope/citizens/work/unemployment-and-benefits/index_de.htm",
    officialDomain: "europa.eu",
    title: "Your Europe: Arbeitslosigkeit und Leistungen Portable Documents U1 U2 U3",
    sourceClass: "EU_OFFICIAL_GUIDANCE",
    sourceType: "official_guidance",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    passages: [
      { key: "ue-commission-unemployment-text", locator: "Your Europe Arbeitslosigkeit", text: "Die Kommission erläutert Portable Documents U1 als Zeitennachweis, U2 als Ausfuhrgenehmigung bestehender Arbeitslosenleistung und U3 als Hinweis auf Umstände, die den exportierten Anspruch berühren können. Operative Hinweise sind vor Gebrauch zu revalidieren. Die Dokumente ersetzen nicht den Verordnungstext und begründen den nationalen Anspruch nicht selbst." },
    ],
  },
  {
    key: "ue-oeil-cod-2016-0397",
    publisherKey: "oeil",
    url: "https://oeil.europarl.europa.eu/oeil/popups/ficheprocedure.do?reference=2016/0397(COD)&l=de",
    officialDomain: "oeil.europarl.europa.eu",
    title: "Legislativverfahren 2016/0397(COD) Stand nach der Parlamentserstlesung 7. Juli 2026",
    sourceClass: "EU_OFFICIAL_GUIDANCE",
    sourceType: "official_guidance",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    passages: [
      { key: "ue-oeil-cod-text", locator: "2016/0397(COD)", text: "Nach der ersten Lesung des Europäischen Parlaments am 7. Juli 2026 bleibt das Verfahren 2016/0397(COD) im Stadium der erwarteten Ratsposition. Vorgeschlagene sechsmonatige Regelausfuhr und ein 22-Wochen-Schwellenkonzept der letzten Tätigkeit sind nicht geltendes Arbeitslosenkoordinierungsrecht." },
    ],
  },
  {
    key: "ue-art-65a-notification",
    publisherKey: "commission",
    url: "https://employment-social-affairs.ec.europa.eu/policies-and-activities/moving-working-europe/eu-social-security-coordination_en",
    officialDomain: "employment-social-affairs.ec.europa.eu",
    title: "Europäische Kommission: Koordinierung der sozialen Sicherheit Mitteilungslage zu Artikel 65a",
    sourceClass: "EU_OFFICIAL_GUIDANCE",
    sourceType: "official_guidance",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "AUTHORITY_COMPETENCE",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    passages: [
      { key: "ue-art-65a-notification-text", locator: "Artikel 65a Mitteilung", text: "Ob ein Wohnmitgliedstaat mitgeteilt hat, dass Selbständige dort nicht in ein Arbeitslosensystem einbezogen sind, ist vor einer Artikel-65a-Auskunft live oder aus revalidierter amtlicher Liste zu prüfen. Eine aus dem Gedächtnis gespeicherte Länderliste darf nicht festgeschrieben werden." },
    ],
  },
  {
    key: "ue-institution-directory",
    publisherKey: "commission",
    url: "https://ec.europa.eu/social/main.jsp?catId=572&langId=de",
    officialDomain: "ec.europa.eu",
    title: "Europäische Kommission: Verzeichnis der Träger der sozialen Sicherheit Arbeitslosigkeit",
    sourceClass: "EU_OFFICIAL_GUIDANCE",
    sourceType: "official_directory",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "CONTACT_DETAILS",
    handlingMode: "FETCH_LIVE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    passages: [
      { key: "ue-institution-directory-text", locator: "Institution directory", text: "Zuständige Arbeitslosenträger, aktuelle Antragswege und geltende nationale Beträge oder Fristen sind live bei den nationalen Stellen zu ermitteln. Dieser EU-Kern speichert keine Euro-Beträge und keine nationale Anspruchsdauer." },
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

export const EU_UNEMP_UNITS: readonly Unit[] = Object.freeze([
  { key: "ue-not-national-entitlement", category: "principle", type: "boundary", text: "Die unionsrechtliche Koordinierung der Arbeitslosenleistungen schafft keinen nationalen Anspruch, wo die nationalen Voraussetzungen nicht erfüllt sind.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-63", riskLevel: "high" },
  { key: "ue-current-883-987-baseline", category: "principle", type: "definition", text: "Geltende Grundlage der unionsrechtlichen Arbeitslosenkoordinierung sind die Verordnung 883/2004 in der Konsolidierung vom 31. Juli 2019 und die Verordnung 987/2009 in der Konsolidierung vom 1. Januar 2018.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-63", riskLevel: "high" },
  { key: "ue-unemp-scope-not-other-branches", category: "principle", type: "exception", text: "Kranken-, Erwerbsminderungs-, Mutterschafts- oder Rentenleistungen, Abfindungen und Insolvenzausfallgeld sind nicht stillschweigend mit Arbeitslosenleistungen nach Kapitel 6 zu vermengen, sofern sie nicht gesondert eingeordnet sind.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-63", riskLevel: "high" },
  { key: "ue-alg-not-jobcenter", category: "principle", type: "exception", text: "Arbeitslosengeld der Arbeitslosenversicherung ist nicht automatisch Jobcenter-Grundsicherung oder Bürgergeld.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-63", riskLevel: "high" },
  { key: "ue-benefit-not-social-assistance", category: "principle", type: "exception", text: "Eine koordinierte Arbeitslosenleistung ist nicht Sozialhilfe. Artikel 61 bis 65 koordinieren nicht automatisch Grundsicherung.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-63", riskLevel: "high" },
  { key: "ue-national-classification-adapter", category: "principle", type: "boundary", text: "Die nationale Einordnung einer Leistung als Arbeitslosenleistung oder Sozialhilfe gehört zum späteren nationalen Adapter, nicht zu diesem EU-Kern.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-63", riskLevel: "high" },
  { key: "ue-alg-national-not-in-eu-core", category: "principle", type: "boundary", text: "Deutsche Anspruchsdauer, Anwartschaft, Sperrzeit, Betragsformel und Agentur-für-Arbeit-Routing werden in diesem EU-Kern nicht dupliziert.", sourceKey: "ue-institution-directory", passageKey: "ue-institution-directory-text", riskLevel: "high" },
  { key: "ue-no-national-amount", category: "principle", type: "procedure", text: "Ein genauer nationaler Euro-Betrag der Arbeitslosenleistung darf ohne geltendes nationales Recht und aktuelle Trägerangaben nicht genannt werden.", sourceKey: "ue-institution-directory", passageKey: "ue-institution-directory-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "ue-no-national-duration", category: "principle", type: "boundary", text: "Dieser EU-Kern entscheidet nicht die genaue nationale Anspruchsdauer in Monaten.", sourceKey: "ue-institution-directory", passageKey: "ue-institution-directory-text", riskLevel: "high" },
  { key: "ue-no-national-qualifying-period", category: "principle", type: "boundary", text: "Die nationale Anwartschaftszeit bleibt nationales Recht und wird nicht durch Artikel 61 ersetzt; die Verordnung bestimmt nur die unionsrechtliche Zusammenrechnung.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-61", riskLevel: "high" },
  { key: "ue-uk-out-of-scope", category: "principle", type: "exception", text: "Britische Post-Brexit-Arbeitslosenfälle liegen außerhalb dieses EU-Kerns.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-63", riskLevel: "high" },
  { key: "ue-non-eu-bilateral-out-of-scope", category: "principle", type: "exception", text: "Nicht-unionsrechtliche bilaterale Arbeitslosenabkommen liegen außerhalb dieses EU-Kerns.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-63", riskLevel: "high" },
  { key: "ue-source-eu-not-national", category: "principle", type: "boundary", text: "Quellenjurisdiktion EU ist nicht dasselbe wie ein nationaler Arbeitslosenstaat.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-63", riskLevel: "high" },
  { key: "ue-no-corridor-in-this-core", category: "principle", type: "boundary", text: "Dieser EU-Kern legt keinen bilateralen Arbeitslosen-Korridor und keinen nationalen Arbeitslosen-Adapter an.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-63", riskLevel: "high" },
  { key: "ue-four-corridor-reuse", category: "principle", type: "boundary", text: "Spätere Arbeitslosen-Korridore DE mit SK, CZ, PL oder HU müssen dieselben unionsrechtlichen Stable-Refs zu Artikel 61, 62, 64, 65, 65a, U1, U2, U3, Beschluss U3 und Jeltes verlinken. Kopierte EU-Ansprüche in Korridore gehören nicht in diesen Kern.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-63", riskLevel: "high" },
  { key: "ue-pending-cod-not-current", category: "principle", type: "exception", text: "Das Verfahren 2016/0397(COD) ist nach der Parlamentserstlesung vom 7. Juli 2026 weiterhin vorgeschlagene, nicht geltende Revision und wird nicht als aktuelles Arbeitslosenrecht gespeichert.", sourceKey: "ue-oeil-cod-2016-0397", passageKey: "ue-oeil-cod-text", riskLevel: "high" },
  { key: "ue-ep-first-reading-not-law", category: "principle", type: "exception", text: "Die erste Lesung des Europäischen Parlaments vom 7. Juli 2026 ist nicht geltendes, verkündetes und anwendbares Verordnungsrecht.", sourceKey: "ue-oeil-cod-2016-0397", passageKey: "ue-oeil-cod-text", riskLevel: "high" },
  { key: "ue-proposed-six-month-not-current", category: "principle", type: "exception", text: "Eine sechsmonatige Regelausfuhr von Arbeitslosenleistungen ist vorgeschlagene Revision und nicht geltendes Artikel-64-Recht.", sourceKey: "ue-oeil-cod-2016-0397", passageKey: "ue-oeil-cod-text", riskLevel: "high" },
  { key: "ue-proposed-22-week-not-current", category: "principle", type: "exception", text: "Ein 22-Wochen-Schwellenkonzept der letzten Tätigkeit für die grenzüberschreitende Leistungskompetenz ist nicht geltendes Artikel-65-Recht.", sourceKey: "ue-oeil-cod-2016-0397", passageKey: "ue-oeil-cod-text", riskLevel: "high" },
  { key: "ue-provisional-agreement-not-law", category: "principle", type: "exception", text: "Eine vorläufige politische Einigung ist nicht anwendbares Koordinierungsrecht.", sourceKey: "ue-oeil-cod-2016-0397", passageKey: "ue-oeil-cod-text", riskLevel: "high" },
  { key: "ue-no-proposed-aggregation-threshold", category: "principle", type: "exception", text: "Weder eine historische Dreimonats- noch eine vorgeschlagene 22-Wochen-Schwelle ändert das geltende Artikel-61-Recht. Ausländische Zeiten zählen nicht erst nach einer erfundenen Wartezeit im neuen Staat.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-61", riskLevel: "high" },

  { key: "ue-nationality-not-payer", category: "facts", type: "exception", text: "Die Staatsangehörigkeit bestimmt den zahlenden Arbeitslosenstaat nicht.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-65", riskLevel: "high" },
  { key: "ue-locale-not-payer", category: "facts", type: "exception", text: "Die Ausgabesprache oder Nutzeroberfläche wählt weder den zuständigen noch den zahlenden Arbeitslosenstaat.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-65", riskLevel: "high" },
  { key: "ue-registered-address-not-residence", category: "facts", type: "exception", text: "Eine Meldeadresse ist nicht automatisch der unionsrechtliche Wohnsitz.", sourceKey: "ue-vo-987", passageKey: "ue-vo-987-art-11", riskLevel: "high" },
  { key: "ue-work-de-not-auto-payer", category: "facts", type: "exception", text: "Tätigkeit in Deutschland bedeutet nicht automatisch, dass Deutschland die Arbeitslosenleistung zahlt.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-65", riskLevel: "high" },
  { key: "ue-work-other-not-auto-payer", category: "facts", type: "exception", text: "Tätigkeit in einem anderen Mitgliedstaat bedeutet nicht automatisch, dass dieser Staat die Arbeitslosenleistung zahlt.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-65", riskLevel: "high" },

  { key: "ue-residence-centre-of-interests", category: "residence", type: "definition", text: "Der unionsrechtliche Wohnsitz ist der tatsächliche Mittelpunkt der Interessen. Er wird nicht aus trvalý pobyt, Anmeldung, Staatsangehörigkeit, Steueransässigkeit, einem Adressfeld oder einer 183-Tage-Regel abgeleitet.", sourceKey: "ue-vo-987", passageKey: "ue-vo-987-art-11", riskLevel: "high" },
  { key: "ue-residence-not-anmeldung", category: "residence", type: "exception", text: "Eine deutsche Anmeldung belegt nicht automatisch den unionsrechtlichen Wohnsitz.", sourceKey: "ue-vo-987", passageKey: "ue-vo-987-art-11", riskLevel: "high" },
  { key: "ue-residence-unclear-fail-closed", category: "residence", type: "procedure", text: "Ist der Wohnsitz für Artikel 65 wesentlich unklar, darf der Leistungsstaat nicht bestimmt werden.", sourceKey: "ue-vo-987", passageKey: "ue-vo-987-art-11", riskLevel: "high", requiresAuthorityResolution: true },

  { key: EU_SHARED_ART1F_CLAIM_KEY, category: "frontier", type: "definition", text: "Nach Artikel 1 Buchstabe f ist Grenzarbeitnehmer, wer in einem Mitgliedstaat beschäftigt oder selbständig tätig ist, in einem anderen wohnt und in der Regel täglich oder mindestens einmal wöchentlich dorthin zurückkehrt.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-1f", riskLevel: "high" },
  { key: "ue-cross-border-not-auto-frontier", category: "frontier", type: "exception", text: "Ein grenzüberschreitend tätiger Arbeitnehmer ist nicht automatisch Grenzarbeitnehmer nach Artikel 1 Buchstabe f.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-1f", riskLevel: "high" },
  { key: "ue-address-not-auto-frontier", category: "frontier", type: "exception", text: "Tätigkeit in einem Staat plus Anschrift in einem anderen Staat macht nicht automatisch zum Grenzarbeitnehmer.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-1f", riskLevel: "high" },
  { key: "ue-nationality-not-frontier", category: "frontier", type: "exception", text: "Die Staatsangehörigkeit bestimmt den Grenzarbeitnehmerstatus nicht.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-1f", riskLevel: "high" },
  { key: "ue-return-frequency-required", category: "frontier", type: "definition", text: "Die Rückkehrhäufigkeit täglich oder mindestens einmal wöchentlich ist Tatbestandsmerkmal des Grenzarbeitnehmers und darf nicht übergangen werden.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-1f", riskLevel: "high" },
  { key: "ue-frontier-unclear-fail-closed", category: "frontier", type: "procedure", text: "Ist der Grenzarbeitnehmerstatus unklar, darf nicht so entschieden werden, als sei die Person Grenzarbeitnehmer.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-1f", riskLevel: "high", requiresAuthorityResolution: true },

  { key: "ue-type-gate-mandatory", category: "type", type: "procedure", text: "Vor der Artikel-65-Wegewahl ist Vollarbeitslosigkeit, Teilarbeitslosigkeit oder intermittierende Arbeitslosigkeit zu klassifizieren. Die bloße Frage, ob jemand arbeitslos ist, reicht nicht.", sourceKey: "ue-decision-u3", passageKey: "ue-decision-u3-text", riskLevel: "high" },
  { key: "ue-whole-unemployment", category: "type", type: "definition", text: "Vollarbeitslosigkeit setzt typischerweise das Ende des vertraglichen Beschäftigungsverhältnisses und den Wegfall der Bindung an den früheren Arbeitgeber voraus.", sourceKey: "ue-decision-u3", passageKey: "ue-decision-u3-text", riskLevel: "high" },
  { key: "ue-partial-unemployment", category: "type", type: "definition", text: "Teilarbeitslosigkeit liegt nahe, wenn die Tätigkeit ruht, das vertragliche Band zum Arbeitgeber aber fortbesteht und eine Rückkehr auf den Arbeitsplatz möglich bleibt.", sourceKey: "ue-decision-u3", passageKey: "ue-decision-u3-text", riskLevel: "high" },
  { key: "ue-intermittent-unemployment", category: "type", type: "definition", text: "Intermittierende Arbeitslosigkeit ist von Voll- und Teilarbeitslosigkeit zu trennen und folgt dem zuständigen Staat der letzten Tätigkeit nach Artikel 65 Absatz 1.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-65", riskLevel: "high" },
  { key: "ue-type-unclear-fail-closed", category: "type", type: "procedure", text: "Ist der Arbeitslosigkeitstyp unklar, darf der Leistungsstaat nicht bestimmt werden.", sourceKey: "ue-decision-u3", passageKey: "ue-decision-u3-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: EU_SHARED_DECISION_U3_CLAIM_KEY, category: "type", type: "definition", text: "Nach Beschluss U3 der Verwaltungskommission hängt die Natur der Arbeitslosigkeit wesentlich davon ab, ob ein vertragliches Beschäftigungsverhältnis besteht oder aufrechterhalten wird.", sourceKey: "ue-decision-u3", passageKey: "ue-decision-u3-text", riskLevel: "high" },
  { key: "ue-zero-hours-not-whole", category: "type", type: "exception", text: "Null Arbeitsstunden bedeuten nicht automatisch Vollarbeitslosigkeit.", sourceKey: "ue-decision-u3", passageKey: "ue-decision-u3-text", riskLevel: "high" },
  { key: "ue-layoff-not-whole", category: "type", type: "exception", text: "Vorübergehende Freistellung bedeutet nicht automatisch Vollarbeitslosigkeit.", sourceKey: "ue-decision-u3", passageKey: "ue-decision-u3-text", riskLevel: "high" },
  { key: "ue-short-time-not-whole", category: "type", type: "exception", text: "Kurzarbeit bedeutet nicht automatisch Vollarbeitslosigkeit.", sourceKey: "ue-decision-u3", passageKey: "ue-decision-u3-text", riskLevel: "high" },
  { key: "ue-contract-exists-gate", category: "type", type: "procedure", text: "Ob der Arbeitsvertrag fortbesteht, darf nicht übergangen werden und ist ein zentrales Einfallstor vor der Artikel-65-Wegewahl.", sourceKey: "ue-decision-u3", passageKey: "ue-decision-u3-text", riskLevel: "high" },
  { key: "ue-suspension-not-termination", category: "type", type: "exception", text: "Vorübergehende Aussetzung des Vertrags ist nicht dasselbe wie Beendigung des Beschäftigungsverhältnisses.", sourceKey: "ue-decision-u3", passageKey: "ue-decision-u3-text", riskLevel: "high" },
  { key: "ue-whole-not-partial", category: "type", type: "exception", text: "Vollarbeitslosigkeit ist nicht Teilarbeitslosigkeit.", sourceKey: "ue-decision-u3", passageKey: "ue-decision-u3-text", riskLevel: "high" },
  { key: "ue-decision-u3-not-portable-u3", category: "type", type: "exception", text: "Beschluss U3 der Verwaltungskommission zur Teilarbeitslosigkeit ist nicht das Portable Document U3.", sourceKey: "ue-decision-u3", passageKey: "ue-decision-u3-text", riskLevel: "high" },
  { key: "ue-short-time-national-merits", category: "type", type: "boundary", text: "Nationale Kurzarbeitstatbestände und -beträge werden in diesem EU-Kern nicht aufgebaut.", sourceKey: "ue-decision-u3", passageKey: "ue-decision-u3-text", riskLevel: "high" },

  { key: "ue-art-7-not-general-unemp-export", category: "article7", type: "exception", text: "Artikel 7 begründet keine allgemeine Ausfuhr von Arbeitslosenleistungen ohne die besonderen Regeln der Artikel 64 und 65.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-7", riskLevel: "high" },
  { key: "ue-art-11-3-c-unemp-receipt-context", category: "article11", type: "definition", text: "Wer Arbeitslosenleistungen nach Artikel 65 bezieht, unterliegt nach Artikel 11 Absatz 3 Buchstabe c den Rechtsvorschriften des Wohnmitgliedstaats. Das ist Titel-II-Kontext, nicht automatisch die gesamte Leistungskompetenz außerhalb Kapitel 6.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-11-3-c", riskLevel: "high" },
  { key: "ue-art-63-cash-scope", category: "article63", type: "definition", text: "Artikel 63 begrenzt Kapitel 6 auf Personen mit Anspruch auf Arbeitslosenleistungen nach den Rechtsvorschriften der Mitgliedstaaten.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-63", riskLevel: "high" },

  { key: "ue-art-65-1-partial-intermittent", category: "article65", type: "definition", text: "Nach Artikel 65 Absatz 1 bleibt eine teilweise oder intermittierend arbeitslose Person dem zuständigen Staat der letzten Tätigkeit zugeordnet, auch wenn sie in einem anderen Mitgliedstaat wohnt.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-65", riskLevel: "high" },
  { key: "ue-partial-not-residence-route", category: "article65", type: "exception", text: "Teilarbeitslosigkeit mit Wohnsitz in einem anderen Mitgliedstaat führt nicht automatisch zur Wohnsitz-Arbeitslosenleistung.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-65", riskLevel: "high" },
  { key: "ue-partial-available-competent-state", category: "article65", type: "procedure", text: "Teilweise oder intermittierend Arbeitslose müssen dem Arbeitgeber oder den Diensten des zuständigen Staats der letzten Tätigkeit zur Verfügung stehen.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-65", riskLevel: "high" },
  { key: "ue-partial-not-u2", category: "article65", type: "exception", text: "Teilarbeitslosigkeit eröffnet nicht den Artikel-64-Export mit Portable Document U2, der eine vollständig arbeitslose Person mit bestehendem Anspruch voraussetzt.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-64", riskLevel: "high" },
  { key: EU_SHARED_ART65_CLAIM_KEY, category: "article65", type: "definition", text: "Ein vollständig arbeitsloser Grenzarbeitnehmer stellt sich den Diensten des Wohnmitgliedstaats zur Verfügung und erhält Arbeitslosenleistungen nach dessen Rechtsvorschriften, als hätte die letzte Tätigkeit dort unterlegen.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-65", riskLevel: "high" },
  { key: "ue-whole-routing-not-collapsed", category: "article65", type: "procedure", text: "Vollarbeitslosigkeit von Grenzarbeitnehmern, rückkehrenden Nicht-Grenzgängern, im letzten Tätigkeitsstaat verbleibenden Nicht-Grenzgängern, Artikel-65a-Fällen und besonderen Beamtenregelungen darf nicht auf einen einzigen Weg zusammengezogen werden.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-65", riskLevel: "high" },
  { key: "ue-last-work-not-payer-frontier", category: "article65", type: "exception", text: "Der letzte Beschäftigungsstaat ist für vollständig arbeitslose Grenzarbeitnehmer nach geltendem Artikel 65 nicht der leistende Staat.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-65", riskLevel: "high" },
  { key: "ue-current-65-frontier-residence-model", category: "article65", type: "definition", text: "Das Wohnsitzmodell des Artikels 65 für vollständig arbeitslose Grenzarbeitnehmer bleibt am 1. September 2026 geltendes Recht.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-65", riskLevel: "high" },
  { key: "ue-supplementary-registration", category: "article65", type: "procedure", text: "Eine vollständig arbeitslose Person des Wohnsitzwegs darf sich ergänzend bei den Diensten des früheren Tätigkeitsstaats zur Arbeitsuche melden.", sourceKey: "ue-vo-987", passageKey: "ue-vo-987-art-56", riskLevel: "high" },
  { key: "ue-supplementary-not-second-benefit", category: "article65", type: "exception", text: "Die ergänzende Meldung im früheren Tätigkeitsstaat begründet keine zweite Arbeitslosenleistung.", sourceKey: "ue-cjeu-jeltes", passageKey: "ue-cjeu-jeltes-text", riskLevel: "high" },
  { key: "ue-supplementary-not-competence-transfer", category: "article65", type: "exception", text: "Die ergänzende Meldung überträgt die Leistungskompetenz nicht auf den früheren Tätigkeitsstaat.", sourceKey: "ue-cjeu-jeltes", passageKey: "ue-cjeu-jeltes-text", riskLevel: "high" },
  { key: EU_SHARED_JELTES_CLAIM_KEY, category: "jeltes", type: "exception", text: "Nach C-443/11 Jeltes kann ein vollständig arbeitsloser Grenzarbeitnehmer die Leistung nicht vom früheren Beschäftigungsstaat verlangen, nur weil Bindungen oder Arbeitsaussichten dort stärker sind.", sourceKey: "ue-cjeu-jeltes", passageKey: "ue-cjeu-jeltes-text", riskLevel: "high" },
  { key: "ue-job-prospects-not-competence", category: "jeltes", type: "exception", text: "Bessere Arbeitsaussichten im früheren Beschäftigungsstaat begründen nicht die Leistungskompetenz.", sourceKey: "ue-cjeu-jeltes", passageKey: "ue-cjeu-jeltes-text", riskLevel: "high" },
  { key: "ue-ties-not-choice", category: "jeltes", type: "exception", text: "Enge Bindungen zum früheren Beschäftigungsstaat eröffnen keine Wahl des Leistungsstaats.", sourceKey: "ue-cjeu-jeltes", passageKey: "ue-cjeu-jeltes-text", riskLevel: "high" },
  { key: "ue-do-not-choose-better-benefit", category: "jeltes", type: "exception", text: "Die Person darf nicht angewiesen werden, sich in beiden Staaten zu melden und die günstigere Leistung zu wählen.", sourceKey: "ue-vo-987", passageKey: "ue-vo-987-art-56", riskLevel: "high" },
  { key: "ue-do-not-resurrect-miethe", category: "jeltes", type: "exception", text: "Die historische Miethe-Ausnahme gilt unter der geltenden Verordnung 883/2004 nicht und darf nicht wiederbelebt werden.", sourceKey: "ue-cjeu-jeltes", passageKey: "ue-cjeu-jeltes-text", riskLevel: "high" },
  { key: "ue-decision-u2-non-frontier-scope", category: "article65", type: "definition", text: "Beschluss U2 der Verwaltungskommission betrifft den Anwendungsbereich des Artikels 65 Absatz 2 für vollständig arbeitslose Personen, die keine Grenzarbeitnehmer sind.", sourceKey: "ue-decision-u2", passageKey: "ue-decision-u2-text", riskLevel: "high" },
  { key: "ue-decision-u2-not-portable-u2", category: "article65", type: "exception", text: "Beschluss U2 der Verwaltungskommission ist nicht das Portable Document U2.", sourceKey: "ue-decision-u2", passageKey: "ue-decision-u2-text", riskLevel: "high" },
  { key: "ue-non-frontier-not-auto-frontier", category: "article65", type: "exception", text: "Wer die wöchentliche Rückkehr des Artikels 1 Buchstabe f nicht erfüllt, darf nicht automatisch den Grenzarbeitnehmerweg erhalten.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-1f", riskLevel: "high" },
  { key: "ue-non-frontier-return-residence", category: "article65", type: "procedure", text: "Kehrt ein vollständig arbeitsloser Nicht-Grenzgänger, der während der Tätigkeit im anderen Staat gewohnt hat, in den Wohnstaat zurück oder bleibt er dort, kann der Wohnsitzweg des Artikels 65 greifen.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-65", riskLevel: "high" },
  { key: "ue-non-frontier-remain-last-state", category: "article65", type: "procedure", text: "Kehrt ein vollständig arbeitsloser Nicht-Grenzgänger nicht in den Wohnmitgliedstaat zurück, richtet Artikel 65 Absatz 2 die Verfügbarkeit auf den Staat der letzten Rechtsvorschriften.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-65", riskLevel: "high" },
  { key: "ue-residence-not-always-pays", category: "article65", type: "exception", text: "Der Wohnsitzstaat zahlt nicht in jedem Arbeitslosenfall.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-65", riskLevel: "high" },
  { key: "ue-last-work-not-always-pays", category: "article65", type: "exception", text: "Der letzte Tätigkeitsstaat zahlt nicht in jedem Arbeitslosenfall.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-65", riskLevel: "high" },
  { key: "ue-art-65-5b-transition", category: "article65", type: "procedure", text: "Erhielt ein Nicht-Grenzgänger zuerst Leistungen zu Lasten des letzten zuständigen Staats und kehrt dann in den Wohnstaat zurück, kann Artikel 65 Absatz 5 Buchstabe b zunächst Artikel 64 verlangen; der Wohnsitzanspruch nach Artikel 65 Absatz 5 Buchstabe a ruht während des Artikel-64-Bezugs.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-65", riskLevel: "high" },
  { key: "ue-art-65-5b-not-double", category: "article65", type: "exception", text: "Artikel 65 Absatz 5 Buchstabe b bedeutet nicht zwei gleichzeitige Arbeitslosenleistungen.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-65", riskLevel: "high" },
  { key: "ue-art-65-5b-not-choice", category: "article65", type: "exception", text: "Artikel 65 Absatz 5 Buchstabe b erlaubt keine freie gleichzeitige Wahl des Leistungsstaats.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-65", riskLevel: "high" },

  { key: EU_SHARED_ART61_CLAIM_KEY, category: "article61", type: "definition", text: "Nach Artikel 61 sind in einem anderen Mitgliedstaat zurückgelegte Versicherungs-, Beschäftigungs- oder Selbständigkeitszeiten für Erwerb, Fortbestand, Wiederaufleben oder Dauer der Arbeitslosenleistung zu berücksichtigen, soweit die zuständige Regelung solche Zeiten verlangt.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-61", riskLevel: "high" },
  { key: "ue-art-61-category-compatibility", category: "article61", type: "procedure", text: "Ausländische Beschäftigungs- oder Selbständigkeitszeiten zählen nicht automatisch als Versicherungszeiten, wenn sie nach den zuständigen Rechtsvorschriften nicht als solche gelten würden.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-61", riskLevel: "high" },
  { key: "ue-foreign-not-auto-insurance", category: "article61", type: "exception", text: "Ausländische Arbeitszeiten sind nicht automatisch Versicherungszeiten.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-61", riskLevel: "high" },
  { key: "ue-not-sum-years-abroad", category: "article61", type: "exception", text: "Jahre im Ausland dürfen nicht bloß addiert werden. Kategorie, Überlappung und Nachweis bleiben maßgeblich.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-61", riskLevel: "high" },
  { key: "ue-art-61-2-recent-period", category: "article61", type: "definition", text: "Artikel 61 Absatz 2 verlangt grundsätzlich, dass die letzte einschlägige Versicherungs-, Beschäftigungs- oder Selbständigkeitszeit unter den Rechtsvorschriften des Anspruchsstaats zurückgelegt wurde.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-61", riskLevel: "high" },
  { key: "ue-art-61-2-except-65-5a", category: "article61", type: "exception", text: "Die letzte-Zeit-Bedingung des Artikels 61 Absatz 2 gilt nicht in Fällen des Artikels 65 Absatz 5 Buchstabe a. Für den Wohnsitzweg darf keine künstliche letzte Beschäftigung im Wohnstaat verlangt werden.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-61", riskLevel: "high" },
  { key: "ue-art-61-not-national-entitlement", category: "article61", type: "exception", text: "Die Zusammenrechnung nach Artikel 61 ersetzt nicht den nationalen Anspruch.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-61", riskLevel: "high" },
  { key: "ue-overlapping-periods-manual-review", category: "article61", type: "procedure", text: "Überlappende Zeiten dürfen nicht naiv addiert werden. Lassen sie sich nicht rechtlich normalisieren, ist eine manuelle Prüfung erforderlich.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-61", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "ue-multi-state-periods", category: "article61", type: "procedure", text: "Artikel 61 kann Zeiten aus mehr als zwei Mitgliedstaaten verlangen. Eine Beschränkung auf nur zwei Staaten ist unzulässig.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-61", riskLevel: "high" },

  { key: EU_SHARED_PD_U1_CLAIM_KEY, category: "u1", type: "definition", text: "Das Portable Document U1 bescheinigt Versicherungs- oder Beschäftigungs- und Selbständigkeitszeiten für die Arbeitslosenkoordinierung. Es ist Nachweis, nicht Leistungsbewilligung.", sourceKey: "ue-commission-unemployment", passageKey: "ue-commission-unemployment-text", riskLevel: "medium" },
  { key: "ue-u1-not-award", category: "u1", type: "exception", text: "Das Portable Document U1 ist keine Leistungsbewilligung.", sourceKey: "ue-commission-unemployment", passageKey: "ue-commission-unemployment-text", riskLevel: "high" },
  { key: "ue-u1-not-amount", category: "u1", type: "exception", text: "Das Portable Document U1 ist nicht der Leistungsbetrag.", sourceKey: "ue-commission-unemployment", passageKey: "ue-commission-unemployment-text", riskLevel: "high" },
  { key: "ue-u1-not-payer-decision", category: "u1", type: "exception", text: "Ein U1 aus einem Staat bedeutet nicht, dass dieser Staat die Arbeitslosenleistung zahlen muss.", sourceKey: "ue-commission-unemployment", passageKey: "ue-commission-unemployment-text", riskLevel: "high" },
  { key: "ue-u1-not-registration", category: "u1", type: "exception", text: "Das Portable Document U1 ist nicht die Arbeitsuchendmeldung.", sourceKey: "ue-commission-unemployment", passageKey: "ue-commission-unemployment-text", riskLevel: "high" },
  { key: "ue-u1-not-constitutive", category: "u1", type: "exception", text: "Portable Documents begründen den Anspruch nicht selbst.", sourceKey: "ue-commission-unemployment", passageKey: "ue-commission-unemployment-text", riskLevel: "high" },
  { key: "ue-u1-absence-not-impossible", category: "u1", type: "exception", text: "Fehlt ein U1, ist der Anspruch nicht automatisch unmöglich. Träger können die Zeiten auf dem Trägerweg austauschen.", sourceKey: "ue-vo-987", passageKey: "ue-vo-987-art-54", riskLevel: "high" },
  { key: "ue-u1-speeds-processing", category: "u1", type: "definition", text: "Ein U1 kann die Bearbeitung beschleunigen, bleibt aber nicht der einzige zulässige Nachweisweg.", sourceKey: "ue-commission-unemployment", passageKey: "ue-commission-unemployment-text", riskLevel: "medium" },
  { key: "ue-u1-not-cv", category: "u1", type: "exception", text: "Ein U1 ist kein allgemeiner Lebenslauf der Erwerbsbiografie und erlaubt keine unbewiesenen nationalen Ansprüche.", sourceKey: "ue-commission-unemployment", passageKey: "ue-commission-unemployment-text", riskLevel: "high" },
  { key: "ue-u1-issuer-not-payer", category: "u1", type: "exception", text: "Der ausstellende U1-Staat ist nicht automatisch der leistende Arbeitslosenstaat.", sourceKey: "ue-commission-unemployment", passageKey: "ue-commission-unemployment-text", riskLevel: "high" },
  { key: "ue-institutional-period-exchange", category: "u1", type: "procedure", text: "Nach Artikel 54 der Verordnung 987/2009 tauschen Träger die erforderlichen Zeiten aus. Die Person muss nicht jedes Papier selbst beschaffen, wo der Trägerweg den Nachweis herstellen kann.", sourceKey: "ue-vo-987", passageKey: "ue-vo-987-art-54", riskLevel: "high" },
  { key: "ue-eessi-exchange", category: "u1", type: "procedure", text: "Träger tauschen Sozialversicherungsangaben elektronisch aus. Portable Documents bleiben bürgerbezogene Werkzeuge; dieser Kern baut keinen eigenen Datenaustausch auf.", sourceKey: "ue-vo-987", passageKey: "ue-vo-987-art-54", riskLevel: "medium" },
  { key: "ue-a1-not-u1", category: "documents", type: "exception", text: "Das Portable Document A1 bescheinigt anwendbare Rechtsvorschriften und ist nicht das Portable Document U1.", sourceKey: "ue-commission-unemployment", passageKey: "ue-commission-unemployment-text", riskLevel: "high" },

  { key: EU_SHARED_ART62_CLAIM_KEY, category: "article62", type: "definition", text: "Artikel 62 bestimmt die rechtlich maßgebliche Entgeltquelle für die Berechnung der Arbeitslosenleistung, nicht die nationale Betragsformel.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-62", riskLevel: "high" },
  { key: "ue-art-62-last-activity-remuneration", category: "article62", type: "definition", text: "Grundsätzlich ist das Entgelt der letzten Tätigkeit nach den vom zuständigen Träger angewandten Rechtsvorschriften maßgeblich.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-62", riskLevel: "high" },
  { key: "ue-art-62-3-residence-uses-activity-salary", category: "article62", type: "definition", text: "In Fällen des Artikels 65 Absatz 5 Buchstabe a berücksichtigt der Wohnsitzträger das tatsächlich im Staat der letzten Tätigkeit bezogene Entgelt.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-62", riskLevel: "high" },
  { key: "ue-residence-pay-not-residence-salary", category: "article62", type: "exception", text: "Dass der Wohnsitzstaat zahlt, bedeutet nicht automatisch, dass ein Wohnsitzgehalt zugrunde zu legen ist.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-62", riskLevel: "high" },
  { key: "ue-not-average-both-states", category: "article62", type: "exception", text: "Artikel 62 Absatz 3 erlaubt keinen Mittelwert der Entgelte beider Mitgliedstaaten.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-62", riskLevel: "high" },
  { key: "ue-art-54-2-salary-exchange", category: "article62", type: "procedure", text: "Nach Artikel 54 Absatz 2 übermittelt der Träger der letzten Tätigkeit auf Ersuchen die für Artikel 62 Absatz 3 notwendigen Entgeltangaben.", sourceKey: "ue-vo-987", passageKey: "ue-vo-987-art-54", riskLevel: "high" },
  { key: "ue-user-not-reconstruct-wage-exchange", category: "article62", type: "exception", text: "Die Person muss den amtlichen Entgeltaustausch nicht vollständig selbst rekonstruieren. Persönliche Unterlagen können helfen, der Trägerweg bleibt der rechtliche Hauptmechanismus.", sourceKey: "ue-vo-987", passageKey: "ue-vo-987-art-54", riskLevel: "high" },
  { key: "ue-art-54-3-family-increases", category: "article62", type: "definition", text: "Hängt der nationale Betrag von der Zahl der Familienangehörigen ab, können in einem anderen Mitgliedstaat wohnende Familienangehörige wie im zuständigen Staat wohnhaft zu behandeln sein.", sourceKey: "ue-vo-987", passageKey: "ue-vo-987-art-54", riskLevel: "high" },
  { key: "ue-art-54-3-exception-other-person", category: "article62", type: "exception", text: "Artikel 54 Absatz 3 greift nicht, wenn eine andere Person im Wohnstaat der Familienangehörigen bereits eine Arbeitslosenleistung bezieht, deren Berechnung diese Personen berücksichtigt.", sourceKey: "ue-vo-987", passageKey: "ue-vo-987-art-54", riskLevel: "high" },
  { key: "ue-no-family-amount-formula", category: "article62", type: "boundary", text: "Nationale familienabhängige Betragsformeln werden in diesem EU-Kern nicht aufgebaut.", sourceKey: "ue-decision-u1", passageKey: "ue-decision-u1-text", riskLevel: "high" },
  { key: "ue-exact-salary-fail-closed", category: "article62", type: "procedure", text: "Ohne geklärtes letztes Entgelt und amtlichen Austausch darf kein genauer Berechnungsbetrag genannt werden.", sourceKey: "ue-institution-directory", passageKey: "ue-institution-directory-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "ue-decision-u1-family-increases", category: "article62", type: "definition", text: "Beschluss U1 der Verwaltungskommission betrifft Familienangehörigenzuschläge nach Artikel 54 Absatz 3 und ist nicht das Portable Document U1.", sourceKey: "ue-decision-u1", passageKey: "ue-decision-u1-text", riskLevel: "high" },

  { key: EU_SHARED_ART64_CLAIM_KEY, category: "article64", type: "definition", text: "Artikel 64 erlaubt einer vollständig arbeitslosen Person mit bestehendem Anspruch, unter kontrollierten Voraussetzungen in einem anderen Mitgliedstaat Arbeit zu suchen und den Anspruch zu behalten. Es ist Ausfuhr eines bestehenden Anspruchs, nicht Begründung eines neuen Anspruchs im Zielstaat.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-64", riskLevel: "high" },
  { key: "ue-export-not-new-benefit", category: "article64", type: "exception", text: "Die Ausfuhr nach Artikel 64 schafft keine neue Arbeitslosenleistung im Zielstaat.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-64", riskLevel: "high" },
  { key: EU_SHARED_PD_U2_CLAIM_KEY, category: "article64", type: "definition", text: "Das Portable Document U2 bescheinigt die Genehmigung, eine bestehende Arbeitslosenleistung während der Arbeitsuche in einem anderen Mitgliedstaat zu behalten.", sourceKey: "ue-commission-unemployment", passageKey: "ue-commission-unemployment-text", riskLevel: "medium" },
  { key: "ue-u2-not-u1", category: "article64", type: "exception", text: "Das Portable Document U2 ist nicht das Portable Document U1.", sourceKey: "ue-commission-unemployment", passageKey: "ue-commission-unemployment-text", riskLevel: "high" },
  { key: "ue-u2-not-new-benefit", category: "article64", type: "exception", text: "Das Portable Document U2 ist kein neuer Arbeitslosenanspruch.", sourceKey: "ue-commission-unemployment", passageKey: "ue-commission-unemployment-text", riskLevel: "high" },
  { key: "ue-u2-not-destination-benefit", category: "article64", type: "exception", text: "Das Portable Document U2 ist nicht die Leistung des Zielstaats.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-64", riskLevel: "high" },
  { key: "ue-u2-not-auto-six-months", category: "article64", type: "exception", text: "Das Portable Document U2 bedeutet nicht automatisch eine sechsmonatige Ausfuhr.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-64", riskLevel: "high" },
  { key: "ue-art-64-four-week-default", category: "article64", type: "procedure", text: "Vor der Abreise muss die vollständig arbeitslose Person in der Regel mindestens vier Wochen nach Eintritt der Arbeitslosigkeit als Arbeitsuchende gemeldet und den Diensten des zuständigen Staats zur Verfügung gewesen sein.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-64", riskLevel: "high" },
  { key: "ue-four-week-not-absolute", category: "article64", type: "exception", text: "Die Vier-Wochen-Regel ist die geltende Regelbedingung, kein ausnahmsloses Verbot. Die zuständigen Dienste können eine frühere Abreise genehmigen.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-64", riskLevel: "high" },
  { key: "ue-art-64-seven-day-registration", category: "article64", type: "procedure", text: "Nach Ankunft im Zielstaat muss sich die Person dort bei den Diensten der Arbeitsuche melden. Erfolgt die Meldung innerhalb von sieben Tagen nach Wegfall der Verfügbarkeit im verlassenen Staat, gilt die Kontinuität für den Zeitraum vor der Meldung.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-64", riskLevel: "high" },
  { key: "ue-seven-day-not-national-deadline", category: "article64", type: "exception", text: "Die Sieben-Tage-Regel ist eine unionsrechtliche Ausfuhrmeldung und keine nationale Antragsfrist der Arbeitslosenleistung.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-64", riskLevel: "high" },
  { key: "ue-seven-day-not-always-forgiven", category: "article64", type: "exception", text: "Eine verspätete Zielstaatsmeldung ist nicht stets folgenlos. Eine Verlängerung darf nicht zugesagt werden.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-64", riskLevel: "high" },
  { key: "ue-art-64-three-month-standard", category: "article64", type: "definition", text: "Die geltende Regelausfuhr nach Artikel 64 beträgt drei Monate.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-64", riskLevel: "high" },
  { key: "ue-art-64-extend-max-six", category: "article64", type: "procedure", text: "Die zuständigen Dienste können die Ausfuhr ermessensabhängig bis höchstens sechs Monate verlängern, begrenzt durch die restliche nationale Anspruchsdauer.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-64", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "ue-six-not-automatic", category: "article64", type: "exception", text: "Sechs Monate sind kein automatisches Recht und nicht die geltende Regelmindestdauer.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-64", riskLevel: "high" },
  { key: "ue-six-not-current-standard", category: "article64", type: "exception", text: "Sechs Monate sind nicht der geltende Standard der Artikel-64-Ausfuhr.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-64", riskLevel: "high" },
  { key: "ue-three-not-guaranteed-duration", category: "article64", type: "exception", text: "Drei Monate sind nicht die garantierte gesamte nationale Anspruchsdauer.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-64", riskLevel: "high" },
  { key: "ue-remaining-national-limit", category: "article64", type: "boundary", text: "Die Ausfuhr ist stets durch die restliche nationale Anspruchsdauer begrenzt und nicht länger.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-64", riskLevel: "high" },
  { key: "ue-payer-remains-competent", category: "article64", type: "definition", text: "Während der Artikel-64-Ausfuhr bleibt der zuständige Träger nach seinen Rechtsvorschriften und auf eigene Rechnung leistungspflichtig.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-64", riskLevel: "high" },
  { key: "ue-destination-not-payer", category: "article64", type: "exception", text: "Der Zielstaat wird nicht allein durch die U2-Meldung zum leistenden Staat.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-64", riskLevel: "high" },
  { key: "ue-destination-controls-art-55", category: "article64", type: "procedure", text: "Nach Artikel 55 der Verordnung 987/2009 unterwirft der Zielstaat die Person den dort geltenden Kontrollen und teilt erhebliche Umstände mit.", sourceKey: "ue-vo-987", passageKey: "ue-vo-987-art-55", riskLevel: "high" },
  { key: "ue-u2-not-no-obligations", category: "article64", type: "exception", text: "Ein U2 bedeutet nicht, dass im Ausland keine Pflichten bestehen.", sourceKey: "ue-vo-987", passageKey: "ue-vo-987-art-55", riskLevel: "high" },
  { key: EU_SHARED_PD_U3_CLAIM_KEY, category: "article64", type: "definition", text: "Das Portable Document U3 unterrichtet während der Ausfuhr darüber, dass Umstände entstanden sind, die den Anspruch berühren können, und dem leistenden Träger mitgeteilt wurden.", sourceKey: "ue-commission-unemployment", passageKey: "ue-commission-unemployment-text", riskLevel: "medium" },
  { key: "ue-u3-not-auto-cancellation", category: "article64", type: "exception", text: "Ein Portable Document U3 ist keine automatische endgültige Einstellung. Der leistende Träger entscheidet die Folgen nach den anwendbaren Regeln.", sourceKey: "ue-commission-unemployment", passageKey: "ue-commission-unemployment-text", riskLevel: "high" },
  { key: "ue-return-before-expiry", category: "article64", type: "procedure", text: "Kehrt die Person am oder vor Ablauf der gestatteten Artikel-64-Frist in den zuständigen Staat zurück, kann der Restanspruch nach dessen Recht fortbestehen, soweit der nationale Anspruch nicht anderweitig beendet ist.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-64", riskLevel: "high" },
  { key: "ue-late-return-fail-closed", category: "article64", type: "procedure", text: "Eine verspätete Rückkehr ohne Genehmigung kann den Restanspruch unter den Rechtsvorschriften des zuständigen Staats gefährden, sofern diese nicht günstiger sind oder eine ausnahmsweise verspätete Rückkehr genehmigt wird. Die Entscheidung liegt beim zuständigen Träger.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-64", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "ue-late-return-not-always-destroys", category: "article64", type: "exception", text: "Ein Tag Verspätung zerstört nicht stets und dauerhaft alle Rechte.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-64", riskLevel: "high" },
  { key: "ue-late-return-not-never-matters", category: "article64", type: "exception", text: "Verspätete Rückkehr ist nicht folgenlos.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-64", riskLevel: "high" },
  { key: "ue-multiple-destinations-no-reset", category: "article64", type: "procedure", text: "Die Person darf in mehr als einem Mitgliedstaat Arbeit suchen, aber die gesamte Artikel-64-Ausfuhrfrist zwischen Beschäftigungszeiten bleibt den geltenden Gesamtobergrenzen unterworfen. Ein Zielwechsel setzt die Frist nicht automatisch zurück.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-64", riskLevel: "high" },
  { key: "ue-no-existing-entitlement-no-u2", category: "article64", type: "exception", text: "Ohne bestehenden Arbeitslosenanspruch gibt es keine Artikel-64-Ausfuhr.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-64", riskLevel: "high" },
  { key: "ue-national-entitlement-required-for-export", category: "article64", type: "procedure", text: "Vor der Ausfuhr ist zu prüfen, ob ein bestehender nationaler Anspruch verifiziert oder zumindest möglich ist.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-64", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "ue-physical-u2-not-still-valid", category: "article64", type: "exception", text: "Der physische Besitz eines U2 bedeutet nicht, dass der Anspruch nach einer wesentlichen Änderung automatisch fortbesteht.", sourceKey: "ue-commission-unemployment", passageKey: "ue-commission-unemployment-text", riskLevel: "high" },
  { key: "ue-job-during-export-recheck", category: "article64", type: "procedure", text: "Findet die Person während der Ausfuhr Arbeit, ist die Koordinierung neu zu prüfen; das U2 setzt den Anspruch nicht fort, als bestünde weiterhin Arbeitslosigkeit.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-64", riskLevel: "high" },
  { key: "ue-extension-requires-authorization", category: "article64", type: "procedure", text: "Eine Verlängerung über drei Monate bedarf der Genehmigung der zuständigen Dienste und darf nicht als Automatismus dargestellt werden.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-64", riskLevel: "high", requiresAuthorityResolution: true },

  { key: "ue-art-65-reimburse-3-months", category: "reimbursement", type: "definition", text: "Zahlt der Wohnsitzträger nach Artikel 65 Absatz 5 Buchstabe a, kann der frühere zuständige Staat die ersten drei Monate erstatten.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-65", riskLevel: "high" },
  { key: "ue-art-65-reimburse-5-months", category: "reimbursement", type: "definition", text: "Die Erstattung kann fünf Monate erreichen, wenn in den vorangegangenen 24 Monaten mindestens 12 Monate qualifizierender Zeiten im früheren zuständigen Staat zurückgelegt wurden.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-65", riskLevel: "high" },
  { key: "ue-reimburse-not-two-benefits", category: "reimbursement", type: "exception", text: "Die Trägererstattung nach Artikel 65 bedeutet nicht zwei Leistungen an die arbeitslose Person.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-65", riskLevel: "high" },
  { key: "ue-reimburse-not-payer-change", category: "reimbursement", type: "exception", text: "Die Erstattung durch den früheren Beschäftigungsstaat macht diesen nicht zum leistenden Träger gegenüber der Person.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-65", riskLevel: "high" },
  { key: "ue-decision-u4-back-office", category: "reimbursement", type: "procedure", text: "Beschluss U4 der Verwaltungskommission betrifft das Erstattungsverfahren zwischen Trägern im Hintergrund.", sourceKey: "ue-decision-u4", passageKey: "ue-decision-u4-text", riskLevel: "high" },
  { key: "ue-user-not-claim-reimbursement", category: "reimbursement", type: "exception", text: "Die Person beantragt die Artikel-65-Erstattung nicht persönlich als eigene Leistung.", sourceKey: "ue-decision-u4", passageKey: "ue-decision-u4-text", riskLevel: "high" },
  { key: "ue-art-70-reimbursement-procedure", category: "reimbursement", type: "procedure", text: "Artikel 70 der Verordnung 987/2009 führt die Erstattung der Arbeitslosenleistungen zwischen den Trägern durch.", sourceKey: "ue-vo-987", passageKey: "ue-vo-987-art-70", riskLevel: "high" },

  { key: EU_SHARED_ART65A_CLAIM_KEY, category: "article65a", type: "definition", text: "Artikel 65a kann vollständig arbeitslose Grenzarbeitnehmer mit letzter selbständiger Tätigkeit dem Staat der letzten Selbständigkeit zuordnen, wenn der Wohnmitgliedstaat amtlich mitgeteilt hat, dass dort keine Kategorie Selbständiger in ein Arbeitslosensystem einbezogen ist.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-65a", riskLevel: "high" },
  { key: "ue-self-employed-not-auto-65a", category: "article65a", type: "exception", text: "Selbständige Grenzarbeitnehmer fallen nicht automatisch unter Artikel 65a.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-65a", riskLevel: "high" },
  { key: "ue-art-65a-requires-notification", category: "article65a", type: "exception", text: "Artikel 65a setzt die amtliche Mitteilung des Wohnmitgliedstaats voraus.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-65a", riskLevel: "high" },
  { key: "ue-art-65a-notification-lookup", category: "article65a", type: "procedure", text: "Die aktuelle Mitteilungslage zu Artikel 65a ist vor der Auskunft zu revalidieren. Ist sie unbekannt, darf nicht ohne amtliche Klärung geantwortet werden.", sourceKey: "ue-art-65a-notification", passageKey: "ue-art-65a-notification-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "ue-art-65a-export-mutatis", category: "article65a", type: "procedure", text: "Gilt Artikel 65a und sucht die Person Arbeit im Wohnstaat, findet Artikel 64 mutatis mutandis mit den besonderen Artikel-65a-Änderungen Anwendung.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-65a", riskLevel: "high" },
  { key: "ue-art-65a-no-four-week", category: "article65a", type: "exception", text: "Wo Artikel 65a die Vier-Wochen-Bedingung des Artikels 64 Absatz 1 Buchstabe a ausschließt, darf sie nicht blind verlangt werden.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-65a", riskLevel: "high" },

  { key: "ue-art-57-civil-servant", category: "civil", type: "boundary", text: "Artikel 57 der Verordnung 987/2009 schafft besondere Regeln für Personen eines besonderen Arbeitslosensystems für Beamte.", sourceKey: "ue-vo-987", passageKey: "ue-vo-987-art-57", riskLevel: "high" },
  { key: "ue-civil-servant-not-ordinary-56", category: "civil", type: "exception", text: "Besondere Beamten-Arbeitslosensysteme sind nicht automatisch über den gewöhnlichen Artikel-56-Weg zu führen.", sourceKey: "ue-vo-987", passageKey: "ue-vo-987-art-57", riskLevel: "high" },
  { key: "ue-art-56-availability", category: "civil", type: "procedure", text: "Artikel 56 führt Verfügbarkeit und Meldung vollständig arbeitsloser Personen nach Artikel 65 durch.", sourceKey: "ue-vo-987", passageKey: "ue-vo-987-art-56", riskLevel: "high" },
  { key: "ue-posted-not-infer-payer", category: "posted", type: "exception", text: "Endet eine Entsendung, darf der zahlende Arbeitslosenstaat nicht allein aus dem physischen Entsendungsort abgeleitet werden. Maßgeblich bleiben anwendbare Rechtsvorschriften, Wohnsitz, Arbeitslosigkeitstyp und Artikel 65 oder 65a.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-65", riskLevel: "high" },
  { key: "ue-title-ii-not-unemp-state", category: "states", type: "exception", text: "Der nach Titel II zuständige Sozialversicherungsstaat ist nicht automatisch der zahlende Arbeitslosenstaat.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-11-3-c", riskLevel: "high" },
  { key: "ue-contributions-not-auto-payer", category: "states", type: "exception", text: "Beiträge zur Arbeitslosenversicherung in einem Staat bedeuten nicht notwendig, dass dieser Staat die Leistung zahlt.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-65", riskLevel: "high" },
  { key: "ue-no-recent-residence-contrib-not-impossible", category: "states", type: "exception", text: "Fehlende jüngste Beiträge im Wohnstaat machen den Artikel-65-Wohnsitzweg nicht unmöglich.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-65", riskLevel: "high" },
  { key: "ue-a1-not-unemp-award", category: "documents", type: "exception", text: "Ein A1 ist keine Bewilligung der Arbeitslosenleistung.", sourceKey: "ue-commission-unemployment", passageKey: "ue-commission-unemployment-text", riskLevel: "high" },
  { key: "ue-document-classifier", category: "documents", type: "definition", text: "A1 betrifft anwendbare Rechtsvorschriften, U1 Zeiten der Arbeitslosigkeit, U2 die Ausfuhr bestehender Arbeitslosenleistung und U3 einen Hinweis auf ausfuhrrelevante Umstände. S1, S2 und die EHIC sind andere Dokumente.", sourceKey: "ue-commission-unemployment", passageKey: "ue-commission-unemployment-text", riskLevel: "high" },
  { key: "ue-portable-not-rights", category: "documents", type: "exception", text: "Portable Documents belegen oder operationalisieren die Koordinierung, schaffen aber nicht selbst den nationalen Anspruch.", sourceKey: "ue-commission-unemployment", passageKey: "ue-commission-unemployment-text", riskLevel: "high" },
  { key: "ue-physical-u1-not-approved", category: "documents", type: "exception", text: "Der physische Besitz eines U1 bedeutet nicht, dass der Anspruch bewilligt ist.", sourceKey: "ue-commission-unemployment", passageKey: "ue-commission-unemployment-text", riskLevel: "high" },
  { key: "ue-institution-fetch-live", category: "institution", type: "procedure", text: "Die genaue zuständige Arbeitslosenstelle, aktuelle Antragswege und nationale Beträge sind live zu ermitteln.", sourceKey: "ue-institution-directory", passageKey: "ue-institution-directory-text", riskLevel: "medium" },
  { key: "ue-freshness-revalidate", category: "freshness", type: "procedure", text: "Operative Hinweise der Kommission zur Arbeitslosenkoordinierung sind vor Gebrauch zu revalidieren und ersetzen nicht den Verordnungstext.", sourceKey: "ue-commission-unemployment", passageKey: "ue-commission-unemployment-text", riskLevel: "medium" },
  { key: "ue-fact-change-recheck", category: "facts", type: "procedure", text: "Wohnsitzwechsel, Vertragsende, Aufnahme einer Tätigkeit oder Wechsel des Tätigkeitsstaats erfordern eine erneute Koordinierungsprüfung.", sourceKey: "ue-vo-883", passageKey: "ue-vo-883-art-65", riskLevel: "high" },
  { key: "ue-commission-guidance-revalidate", category: "freshness", type: "procedure", text: "Your-Europe-Hinweise zu U1, U2 und U3 sind vor Gebrauch zu revalidieren und ersetzen nicht den Verordnungstext.", sourceKey: "ue-commission-unemployment", passageKey: "ue-commission-unemployment-text", riskLevel: "medium" },
]);

type ProcessSpec = Readonly<{
  key: string;
  title: string;
  trigger: string;
  safeFirstStep: string;
  riskLevel: "medium" | "high";
  dimensions: Readonly<Record<(typeof PROCESS_COMPLETE_DIMENSIONS)[number], string>>;
}>;

const SHARED_INSTITUTION = "ue-institution-fetch-live";
const SHARED_FRESHNESS = "ue-freshness-revalidate";
const SHARED_BOUNDARIES = "ue-not-national-entitlement";
const SHARED_NEG = "ue-nationality-not-payer";

export const EU_UNEMP_PROCESSES: readonly ProcessSpec[] = Object.freeze([
  { key: "ue-classify-coordination", title: "EU-Arbeitslosenkoordinierung 2026 einordnen", trigger: "Eine grenzüberschreitende Arbeitslosigkeit soll koordiniert werden", safeFirstStep: "Typ, Wohnsitz, Grenzarbeitnehmerstatus und letzte Tätigkeit verlangen, nicht die Staatsangehörigkeit.", riskLevel: "high", dimensions: { what: "ue-current-883-987-baseline", whoWhen: "ue-type-gate-mandatory", documents: "ue-document-classifier", how: "ue-whole-routing-not-collapsed", next: EU_SHARED_ART65_CLAIM_KEY, deadlines: SHARED_FRESHNESS, problems: "ue-title-ii-not-unemp-state", dutiesAfter: "ue-fact-change-recheck", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: SHARED_NEG } },
  { key: "ue-benefit-branch-boundary", title: "Arbeitslosenleistungszweig 2026 abgrenzen", trigger: "Grundsicherung, Bürgergeld oder Sozialhilfe wird als Arbeitslosenleistung angeboten", safeFirstStep: "Versicherungsleistung von Sozialhilfe trennen.", riskLevel: "high", dimensions: { what: "ue-art-63-cash-scope", whoWhen: "ue-unemp-scope-not-other-branches", documents: "ue-national-classification-adapter", how: "ue-alg-not-jobcenter", next: "ue-benefit-not-social-assistance", deadlines: SHARED_FRESHNESS, problems: "ue-alg-national-not-in-eu-core", dutiesAfter: "ue-fact-change-recheck", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-benefit-not-social-assistance" } },
  { key: "ue-residence-determine", title: "Unionsrechtlichen Wohnsitz 2026 bestimmen", trigger: "Meldeadresse, Anmeldung oder Staatsangehörigkeit wird als Wohnsitz angeboten", safeFirstStep: "Mittelpunkt der Interessen verlangen, keine Registerfiktion.", riskLevel: "high", dimensions: { what: "ue-residence-centre-of-interests", whoWhen: "ue-residence-unclear-fail-closed", documents: "ue-registered-address-not-residence", how: "ue-residence-not-anmeldung", next: EU_SHARED_ART1F_CLAIM_KEY, deadlines: SHARED_FRESHNESS, problems: "ue-residence-unclear-fail-closed", dutiesAfter: "ue-fact-change-recheck", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-registered-address-not-residence" } },
  { key: "ue-frontier-classify", title: "Grenzarbeitnehmer Artikel 1 Buchstabe f 2026 klassifizieren", trigger: "Tätigkeit und Wohnsitz liegen in verschiedenen Mitgliedstaaten", safeFirstStep: "Rückkehrhäufigkeit prüfen, nicht die Anschrift allein.", riskLevel: "high", dimensions: { what: EU_SHARED_ART1F_CLAIM_KEY, whoWhen: "ue-return-frequency-required", documents: "ue-frontier-unclear-fail-closed", how: "ue-cross-border-not-auto-frontier", next: "ue-address-not-auto-frontier", deadlines: SHARED_FRESHNESS, problems: "ue-frontier-unclear-fail-closed", dutiesAfter: "ue-fact-change-recheck", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-nationality-not-frontier" } },
  { key: "ue-type-classify", title: "Voll- Teil- oder intermittierende Arbeitslosigkeit 2026 klassifizieren", trigger: "Jemand ist arbeitslos und der Leistungsstaat soll bestimmt werden", safeFirstStep: "Nicht nur fragen, ob Arbeitslosigkeit besteht; den Typ klassifizieren.", riskLevel: "high", dimensions: { what: "ue-type-gate-mandatory", whoWhen: "ue-whole-unemployment", documents: "ue-contract-exists-gate", how: "ue-partial-unemployment", next: "ue-intermittent-unemployment", deadlines: SHARED_FRESHNESS, problems: "ue-type-unclear-fail-closed", dutiesAfter: "ue-fact-change-recheck", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-whole-not-partial" } },
  { key: "ue-decision-u3-contract-gate", title: "Beschluss-U3-Vertragsband 2026 prüfen", trigger: "Null Stunden, Kurzarbeit oder Freistellung wird als Vollarbeitslosigkeit angeboten", safeFirstStep: "Ob der Vertrag fortbesteht, zuerst klären.", riskLevel: "high", dimensions: { what: EU_SHARED_DECISION_U3_CLAIM_KEY, whoWhen: "ue-contract-exists-gate", documents: "ue-suspension-not-termination", how: "ue-zero-hours-not-whole", next: "ue-layoff-not-whole", deadlines: SHARED_FRESHNESS, problems: "ue-short-time-not-whole", dutiesAfter: "ue-short-time-national-merits", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-decision-u3-not-portable-u3" } },
  { key: "ue-art-65-1-partial-route", title: "Artikel-65-Absatz-1-Teilweg 2026 führen", trigger: "Teilweise oder intermittierend arbeitslose Person wohnt in einem anderen Mitgliedstaat", safeFirstStep: "Zuständigen Staat der letzten Tätigkeit nennen, nicht den Wohnsitzstaat.", riskLevel: "high", dimensions: { what: "ue-art-65-1-partial-intermittent", whoWhen: "ue-partial-available-competent-state", documents: "ue-contract-exists-gate", how: "ue-partial-not-residence-route", next: "ue-partial-not-u2", deadlines: SHARED_FRESHNESS, problems: "ue-type-unclear-fail-closed", dutiesAfter: "ue-fact-change-recheck", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-partial-not-residence-route" } },
  { key: "ue-whole-frontier-residence-route", title: "Vollarbeitslose Grenzarbeitnehmer Wohnsitzweg 2026 führen", trigger: "Vollständig arbeitsloser Grenzarbeitnehmer verlangt Leistung vom letzten Beschäftigungsstaat", safeFirstStep: "Wohnsitzträger nach Artikel 65 nennen.", riskLevel: "high", dimensions: { what: EU_SHARED_ART65_CLAIM_KEY, whoWhen: "ue-current-65-frontier-residence-model", documents: "ue-art-61-2-except-65-5a", how: "ue-last-work-not-payer-frontier", next: "ue-supplementary-registration", deadlines: SHARED_FRESHNESS, problems: EU_SHARED_JELTES_CLAIM_KEY, dutiesAfter: "ue-fact-change-recheck", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-work-de-not-auto-payer" } },
  { key: "ue-supplementary-job-search", title: "Ergänzende Meldung im früheren Tätigkeitsstaat 2026 führen", trigger: "Grenzarbeitnehmer will sich zusätzlich im letzten Arbeitsstaat melden", safeFirstStep: "Arbeitsuchehilfe erklären, keine zweite Leistung.", riskLevel: "high", dimensions: { what: "ue-supplementary-registration", whoWhen: "ue-art-56-availability", documents: "ue-supplementary-not-competence-transfer", how: "ue-do-not-choose-better-benefit", next: EU_SHARED_JELTES_CLAIM_KEY, deadlines: SHARED_FRESHNESS, problems: "ue-supplementary-not-second-benefit", dutiesAfter: "ue-fact-change-recheck", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-supplementary-not-second-benefit" } },
  { key: "ue-jeltes-no-second-benefit", title: "Jeltes Wahlverbot 2026 anwenden", trigger: "Nutzer meint, stärkere Bindungen erlaubten die Leistung im früheren Beschäftigungsstaat", safeFirstStep: "Jeltes nennen; Miethe nicht wiederbeleben.", riskLevel: "high", dimensions: { what: EU_SHARED_JELTES_CLAIM_KEY, whoWhen: "ue-ties-not-choice", documents: "ue-do-not-resurrect-miethe", how: "ue-job-prospects-not-competence", next: EU_SHARED_ART65_CLAIM_KEY, deadlines: SHARED_FRESHNESS, problems: "ue-do-not-choose-better-benefit", dutiesAfter: "ue-fact-change-recheck", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-job-prospects-not-competence" } },
  { key: "ue-non-frontier-classify", title: "Nicht-Grenzgänger nach Beschluss U2 2026 klassifizieren", trigger: "Wohnsitz und Tätigkeit liegen in verschiedenen Staaten, wöchentliche Rückkehr fehlt", safeFirstStep: "Grenzarbeitnehmerregeln nicht automatisch anwenden.", riskLevel: "high", dimensions: { what: "ue-decision-u2-non-frontier-scope", whoWhen: "ue-non-frontier-not-auto-frontier", documents: "ue-decision-u2-not-portable-u2", how: "ue-cross-border-not-auto-frontier", next: "ue-whole-routing-not-collapsed", deadlines: SHARED_FRESHNESS, problems: "ue-frontier-unclear-fail-closed", dutiesAfter: "ue-fact-change-recheck", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-decision-u2-not-portable-u2" } },
  { key: "ue-non-frontier-return-route", title: "Nicht-Grenzgänger Rückkehr in den Wohnstaat 2026 führen", trigger: "Vollständig arbeitsloser Nicht-Grenzgänger kehrt in den Wohnstaat zurück", safeFirstStep: "Wohnsitzweg prüfen, wöchentliche Rückkehr nach der Arbeitslosigkeit nicht verlangen.", riskLevel: "high", dimensions: { what: "ue-non-frontier-return-residence", whoWhen: EU_SHARED_ART65_CLAIM_KEY, documents: "ue-art-61-2-except-65-5a", how: "ue-decision-u2-non-frontier-scope", next: "ue-art-65-5b-transition", deadlines: SHARED_FRESHNESS, problems: "ue-residence-not-always-pays", dutiesAfter: "ue-fact-change-recheck", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-last-work-not-always-pays" } },
  { key: "ue-non-frontier-remain-route", title: "Nicht-Grenzgänger Verbleib im letzten Staat 2026 führen", trigger: "Vollständig arbeitsloser Nicht-Grenzgänger bleibt im letzten Tätigkeitsstaat", safeFirstStep: "Nicht sagen, der Wohnsitzstaat zahle stets.", riskLevel: "high", dimensions: { what: "ue-non-frontier-remain-last-state", whoWhen: "ue-decision-u2-non-frontier-scope", documents: "ue-art-56-availability", how: "ue-residence-not-always-pays", next: "ue-last-work-not-always-pays", deadlines: SHARED_FRESHNESS, problems: "ue-residence-not-always-pays", dutiesAfter: "ue-fact-change-recheck", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-residence-not-always-pays" } },
  { key: "ue-art-65-5b-transition", title: "Artikel-65-Absatz-5-Buchstabe-b-Übergang 2026 führen", trigger: "Nicht-Grenzgänger erhielt zuerst Leistung im letzten Staat und kehrt dann heim", safeFirstStep: "Artikel 64 zuerst, keine Doppelzahlung, keine freie Wahl.", riskLevel: "high", dimensions: { what: "ue-art-65-5b-transition", whoWhen: EU_SHARED_ART64_CLAIM_KEY, documents: "ue-art-65-5b-not-double", how: "ue-art-65-5b-not-choice", next: "ue-non-frontier-return-residence", deadlines: SHARED_FRESHNESS, problems: "ue-art-65-5b-not-double", dutiesAfter: "ue-fact-change-recheck", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-art-65-5b-not-choice" } },
  { key: "ue-art-61-aggregation", title: "Artikel-61-Zusammenrechnung 2026 führen", trigger: "Ausländische Zeiten sollen für die nationale Anwartschaft zählen", safeFirstStep: "Kategorie prüfen, Jahre nicht bloß addieren.", riskLevel: "high", dimensions: { what: EU_SHARED_ART61_CLAIM_KEY, whoWhen: "ue-multi-state-periods", documents: EU_SHARED_PD_U1_CLAIM_KEY, how: "ue-art-61-category-compatibility", next: "ue-art-61-2-recent-period", deadlines: SHARED_FRESHNESS, problems: "ue-overlapping-periods-manual-review", dutiesAfter: "ue-fact-change-recheck", institution: SHARED_INSTITUTION, boundaries: "ue-no-national-qualifying-period", freshness: SHARED_FRESHNESS, negatives: "ue-art-61-not-national-entitlement" } },
  { key: "ue-art-61-period-compatibility", title: "Artikel-61-Zeitkategorie 2026 prüfen", trigger: "Beschäftigungszeiten sollen als Versicherungszeiten zählen", safeFirstStep: "Kategorienkompatibilität nach dem zuständigen Recht prüfen.", riskLevel: "high", dimensions: { what: "ue-art-61-category-compatibility", whoWhen: "ue-foreign-not-auto-insurance", documents: "ue-not-sum-years-abroad", how: EU_SHARED_ART61_CLAIM_KEY, next: "ue-overlapping-periods-manual-review", deadlines: SHARED_FRESHNESS, problems: "ue-overlapping-periods-manual-review", dutiesAfter: "ue-fact-change-recheck", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-foreign-not-auto-insurance" } },
  { key: "ue-art-61-2-recent-period", title: "Artikel-61-Absatz-2-letzte-Zeit 2026 prüfen", trigger: "Zusammenrechnung ohne letzte Zeit im Anspruchsstaat", safeFirstStep: "Artikel 65 Absatz 5 Buchstabe a als Ausnahme prüfen.", riskLevel: "high", dimensions: { what: "ue-art-61-2-recent-period", whoWhen: "ue-art-61-2-except-65-5a", documents: EU_SHARED_ART61_CLAIM_KEY, how: "ue-no-proposed-aggregation-threshold", next: EU_SHARED_ART65_CLAIM_KEY, deadlines: SHARED_FRESHNESS, problems: "ue-art-61-not-national-entitlement", dutiesAfter: "ue-fact-change-recheck", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-art-61-2-except-65-5a" } },
  { key: "ue-art-65-5a-aggregation-exception", title: "Artikel-65-Absatz-5-Buchstabe-a-Zusammenrechnungsausnahme 2026 anwenden", trigger: "Wohnsitzweg ohne jüngste Beschäftigung im Wohnstaat", safeFirstStep: "Keine künstliche letzte Wohnsitzbeschäftigung verlangen.", riskLevel: "high", dimensions: { what: "ue-art-61-2-except-65-5a", whoWhen: EU_SHARED_ART65_CLAIM_KEY, documents: "ue-no-recent-residence-contrib-not-impossible", how: EU_SHARED_ART61_CLAIM_KEY, next: "ue-art-62-3-residence-uses-activity-salary", deadlines: SHARED_FRESHNESS, problems: "ue-contributions-not-auto-payer", dutiesAfter: "ue-fact-change-recheck", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-art-61-2-except-65-5a" } },
  { key: "ue-u1-evidence", title: "Portable Document U1 2026 führen", trigger: "Nutzer hält U1 für Bewilligung oder glaubt ohne U1 sei der Anspruch unmöglich", safeFirstStep: "U1 als Zeitennachweis erklären, nicht als Anspruch.", riskLevel: "high", dimensions: { what: EU_SHARED_PD_U1_CLAIM_KEY, whoWhen: "ue-u1-not-constitutive", documents: "ue-u1-not-cv", how: "ue-u1-speeds-processing", next: "ue-institutional-period-exchange", deadlines: SHARED_FRESHNESS, problems: "ue-u1-absence-not-impossible", dutiesAfter: "ue-physical-u1-not-approved", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-u1-not-award" } },
  { key: "ue-institutional-period-exchange", title: "Trägerzeitenaustausch 2026 führen", trigger: "Zeiten liegen in mehreren Staaten oder U1 fehlt", safeFirstStep: "Trägerweg nennen, nicht jedes Papier persönlich verlangen.", riskLevel: "high", dimensions: { what: "ue-institutional-period-exchange", whoWhen: "ue-eessi-exchange", documents: EU_SHARED_PD_U1_CLAIM_KEY, how: "ue-u1-absence-not-impossible", next: "ue-multi-state-periods", deadlines: SHARED_FRESHNESS, problems: "ue-overlapping-periods-manual-review", dutiesAfter: "ue-fact-change-recheck", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-u1-issuer-not-payer" } },
  { key: "ue-art-62-remuneration-source", title: "Artikel-62-Entgeltquelle 2026 bestimmen", trigger: "Berechnungsgrundlage der Arbeitslosenleistung ist unklar", safeFirstStep: "Entgeltquelle identifizieren, keinen Euro-Betrag erfinden.", riskLevel: "high", dimensions: { what: EU_SHARED_ART62_CLAIM_KEY, whoWhen: "ue-art-62-last-activity-remuneration", documents: "ue-exact-salary-fail-closed", how: "ue-no-national-amount", next: "ue-art-62-3-residence-uses-activity-salary", deadlines: SHARED_FRESHNESS, problems: "ue-exact-salary-fail-closed", dutiesAfter: "ue-fact-change-recheck", institution: SHARED_INSTITUTION, boundaries: "ue-no-national-duration", freshness: SHARED_FRESHNESS, negatives: "ue-not-average-both-states" } },
  { key: "ue-art-62-3-salary-route", title: "Artikel-62-Absatz-3-Wohnsitzgehalt 2026 führen", trigger: "Wohnsitzstaat zahlt und Nutzer nimmt Wohnsitzgehalt an", safeFirstStep: "Entgelt der letzten Tätigkeit im anderen Staat nennen.", riskLevel: "high", dimensions: { what: "ue-art-62-3-residence-uses-activity-salary", whoWhen: "ue-residence-pay-not-residence-salary", documents: "ue-art-54-2-salary-exchange", how: "ue-not-average-both-states", next: "ue-user-not-reconstruct-wage-exchange", deadlines: SHARED_FRESHNESS, problems: "ue-exact-salary-fail-closed", dutiesAfter: "ue-fact-change-recheck", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-residence-pay-not-residence-salary" } },
  { key: "ue-art-54-salary-exchange", title: "Artikel-54-Entgeltaustausch 2026 führen", trigger: "Entgelt der letzten Tätigkeit fehlt dem Wohnsitzträger", safeFirstStep: "Trägeraustausch erklären, keine vollständige Selbstrekonstruktion.", riskLevel: "high", dimensions: { what: "ue-art-54-2-salary-exchange", whoWhen: "ue-user-not-reconstruct-wage-exchange", documents: "ue-exact-salary-fail-closed", how: EU_SHARED_ART62_CLAIM_KEY, next: "ue-art-62-3-residence-uses-activity-salary", deadlines: SHARED_FRESHNESS, problems: "ue-exact-salary-fail-closed", dutiesAfter: "ue-fact-change-recheck", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-not-average-both-states" } },
  { key: "ue-family-increase-boundary", title: "Familienangehörigenzuschlag Artikel 54 Absatz 3 2026 abgrenzen", trigger: "Familienangehörige wohnen in einem anderen Mitgliedstaat und der Betrag hängt von ihrer Zahl ab", safeFirstStep: "Fiktion und Ausnahme nach Beschluss U1 nennen, keine nationale Formel.", riskLevel: "high", dimensions: { what: "ue-art-54-3-family-increases", whoWhen: "ue-decision-u1-family-increases", documents: "ue-art-54-3-exception-other-person", how: "ue-no-family-amount-formula", next: "ue-no-national-amount", deadlines: SHARED_FRESHNESS, problems: "ue-no-family-amount-formula", dutiesAfter: "ue-fact-change-recheck", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-art-54-3-exception-other-person" } },
  { key: "ue-art-64-export-eligibility", title: "Artikel-64-Ausfuhrfähigkeit 2026 prüfen", trigger: "Person will mit bestehendem Anspruch im Ausland Arbeit suchen", safeFirstStep: "Bestehenden Anspruch und Vollarbeitslosigkeit verlangen.", riskLevel: "high", dimensions: { what: EU_SHARED_ART64_CLAIM_KEY, whoWhen: "ue-national-entitlement-required-for-export", documents: EU_SHARED_PD_U2_CLAIM_KEY, how: "ue-export-not-new-benefit", next: "ue-art-64-four-week-default", deadlines: "ue-art-64-three-month-standard", problems: "ue-no-existing-entitlement-no-u2", dutiesAfter: "ue-job-during-export-recheck", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-u2-not-new-benefit" } },
  { key: "ue-four-week-gate", title: "Vier-Wochen-Verfügbarkeit Artikel 64 2026 prüfen", trigger: "U2 wird vor Ablauf von vier Wochen oder danach verlangt", safeFirstStep: "Regelbedingung nennen und frühere Abreise als mögliche Genehmigung, nicht als Recht.", riskLevel: "high", dimensions: { what: "ue-art-64-four-week-default", whoWhen: "ue-four-week-not-absolute", documents: EU_SHARED_PD_U2_CLAIM_KEY, how: "ue-extension-requires-authorization", next: "ue-art-64-seven-day-registration", deadlines: "ue-art-64-four-week-default", problems: "ue-partial-not-u2", dutiesAfter: "ue-fact-change-recheck", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-four-week-not-absolute" } },
  { key: "ue-u2-request", title: "Portable Document U2 2026 beantragen", trigger: "Ausfuhrgenehmigung für bestehende Arbeitslosenleistung wird verlangt", safeFirstStep: "U2 von U1 und von Beschluss U2 trennen.", riskLevel: "high", dimensions: { what: EU_SHARED_PD_U2_CLAIM_KEY, whoWhen: "ue-u2-not-u1", documents: "ue-decision-u2-not-portable-u2", how: "ue-payer-remains-competent", next: "ue-destination-not-payer", deadlines: "ue-art-64-three-month-standard", problems: "ue-u2-not-auto-six-months", dutiesAfter: "ue-physical-u2-not-still-valid", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-u2-not-destination-benefit" } },
  { key: "ue-seven-day-registration", title: "Sieben-Tage-Zielstaatsmeldung 2026 führen", trigger: "Person ist mit U2 in den Zielstaat gereist", safeFirstStep: "Sieben-Tage-Meldung als Ausfuhrregel erklären, nicht als nationale Antragsfrist.", riskLevel: "high", dimensions: { what: "ue-art-64-seven-day-registration", whoWhen: "ue-seven-day-not-national-deadline", documents: EU_SHARED_PD_U2_CLAIM_KEY, how: "ue-destination-controls-art-55", next: "ue-seven-day-not-always-forgiven", deadlines: "ue-art-64-seven-day-registration", problems: "ue-seven-day-not-always-forgiven", dutiesAfter: "ue-u2-not-no-obligations", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-seven-day-not-national-deadline" } },
  { key: "ue-export-duration", title: "Artikel-64-Ausfuhrdauer 2026 führen", trigger: "Drei Monate, sechs Monate oder restliche nationale Dauer werden vermengt", safeFirstStep: "Drei Monate Regel, höchstens sechs auf Genehmigung, begrenzt durch nationale Restdauer.", riskLevel: "high", dimensions: { what: "ue-art-64-three-month-standard", whoWhen: "ue-art-64-extend-max-six", documents: "ue-remaining-national-limit", how: "ue-six-not-automatic", next: "ue-three-not-guaranteed-duration", deadlines: "ue-art-64-extend-max-six", problems: "ue-proposed-six-month-not-current", dutiesAfter: "ue-multiple-destinations-no-reset", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-six-not-current-standard" } },
  { key: "ue-destination-control", title: "Zielstaatskontrollen Artikel 55 2026 führen", trigger: "Nutzer meint, U2 befreie von Pflichten im Ausland", safeFirstStep: "Kontrollen des Zielstaats und Informationspflicht nennen.", riskLevel: "high", dimensions: { what: "ue-destination-controls-art-55", whoWhen: "ue-u2-not-no-obligations", documents: EU_SHARED_PD_U3_CLAIM_KEY, how: "ue-payer-remains-competent", next: "ue-destination-not-payer", deadlines: SHARED_FRESHNESS, problems: "ue-physical-u2-not-still-valid", dutiesAfter: "ue-job-during-export-recheck", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-u2-not-destination-benefit" } },
  { key: "ue-u3-warning", title: "Portable Document U3 2026 führen", trigger: "Portable U3 geht ein oder wird mit Beschluss U3 verwechselt", safeFirstStep: "Hinweis, nicht automatische Einstellung; nicht Beschluss U3.", riskLevel: "high", dimensions: { what: EU_SHARED_PD_U3_CLAIM_KEY, whoWhen: "ue-u3-not-auto-cancellation", documents: "ue-decision-u3-not-portable-u3", how: "ue-payer-remains-competent", next: "ue-destination-controls-art-55", deadlines: SHARED_FRESHNESS, problems: "ue-physical-u2-not-still-valid", dutiesAfter: "ue-fact-change-recheck", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-decision-u3-not-portable-u3" } },
  { key: "ue-return-before-expiry", title: "Rückkehr vor Ablauf der Ausfuhr 2026 führen", trigger: "Person kehrt vor Ablauf des U2 in den zuständigen Staat zurück", safeFirstStep: "Restanspruch nach nationalem Recht, keine zugesagte Restdauer.", riskLevel: "high", dimensions: { what: "ue-return-before-expiry", whoWhen: "ue-remaining-national-limit", documents: EU_SHARED_PD_U2_CLAIM_KEY, how: "ue-no-national-duration", next: "ue-payer-remains-competent", deadlines: "ue-art-64-three-month-standard", problems: "ue-three-not-guaranteed-duration", dutiesAfter: "ue-fact-change-recheck", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-three-not-guaranteed-duration" } },
  { key: "ue-late-return", title: "Verspätete Rückkehr Artikel 64 2026 fail-closed führen", trigger: "Person kehrt nach Ablauf ohne Genehmigung zurück", safeFirstStep: "Weder Totalverlust noch Folgenlosigkeit behaupten; Träger entscheiden lassen.", riskLevel: "high", dimensions: { what: "ue-late-return-fail-closed", whoWhen: "ue-late-return-not-always-destroys", documents: "ue-late-return-not-never-matters", how: "ue-extension-requires-authorization", next: SHARED_INSTITUTION, deadlines: "ue-art-64-three-month-standard", problems: "ue-late-return-not-never-matters", dutiesAfter: "ue-fact-change-recheck", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-late-return-not-always-destroys" } },
  { key: "ue-art-65-reimbursement", title: "Artikel-65-Trägererstattung 2026 abgrenzen", trigger: "Früherer Beschäftigungsstaat erstattet dem Wohnsitzträger", safeFirstStep: "Drei oder fünf Monate als Trägerausgleich erklären, nicht als zweite Nutzerleistung.", riskLevel: "high", dimensions: { what: "ue-art-65-reimburse-3-months", whoWhen: "ue-art-65-reimburse-5-months", documents: "ue-art-70-reimbursement-procedure", how: "ue-reimburse-not-two-benefits", next: "ue-user-not-claim-reimbursement", deadlines: SHARED_FRESHNESS, problems: "ue-reimburse-not-payer-change", dutiesAfter: "ue-fact-change-recheck", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-reimburse-not-two-benefits" } },
  { key: "ue-decision-u4", title: "Beschluss-U4-Erstattungsverfahren 2026 führen", trigger: "Nutzer will die Erstattung selbst beantragen oder berechnen", safeFirstStep: "Hintergrundverfahren der Träger, keinen Nutzerbetrag.", riskLevel: "high", dimensions: { what: "ue-decision-u4-back-office", whoWhen: "ue-user-not-claim-reimbursement", documents: "ue-art-70-reimbursement-procedure", how: "ue-reimburse-not-payer-change", next: "ue-art-65-reimburse-3-months", deadlines: SHARED_FRESHNESS, problems: "ue-no-national-amount", dutiesAfter: "ue-fact-change-recheck", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-reimburse-not-two-benefits" } },
  { key: "ue-art-65a-exception", title: "Artikel-65a-Selbständigenausnahme 2026 prüfen", trigger: "Selbständiger Grenzarbeitnehmer ist vollständig arbeitslos", safeFirstStep: "Nicht automatisch 65a; Mitteilung des Wohnstaats verlangen.", riskLevel: "high", dimensions: { what: EU_SHARED_ART65A_CLAIM_KEY, whoWhen: "ue-self-employed-not-auto-65a", documents: "ue-art-65a-requires-notification", how: "ue-art-65a-export-mutatis", next: "ue-art-65a-no-four-week", deadlines: SHARED_FRESHNESS, problems: "ue-art-65a-notification-lookup", dutiesAfter: "ue-fact-change-recheck", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-self-employed-not-auto-65a" } },
  { key: "ue-art-65a-notification", title: "Artikel-65a-Mitteilungslage 2026 nachschlagen", trigger: "Ob der Wohnstaat Selbständige in ein Arbeitslosensystem einbezieht, ist unbekannt", safeFirstStep: "Ohne revalidierte Mitteilung nicht antworten.", riskLevel: "high", dimensions: { what: "ue-art-65a-notification-lookup", whoWhen: "ue-art-65a-requires-notification", documents: EU_SHARED_ART65A_CLAIM_KEY, how: SHARED_INSTITUTION, next: "ue-self-employed-not-auto-65a", deadlines: SHARED_FRESHNESS, problems: "ue-art-65a-notification-lookup", dutiesAfter: "ue-commission-guidance-revalidate", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-self-employed-not-auto-65a" } },
  { key: "ue-civil-servant-boundary", title: "Besonderes Beamten-Arbeitslosensystem 2026 abgrenzen", trigger: "Person unterliegt einem besonderen Arbeitslosensystem für Beamte", safeFirstStep: "Nicht den gewöhnlichen Artikel-56-Weg automatisch nutzen.", riskLevel: "high", dimensions: { what: "ue-art-57-civil-servant", whoWhen: "ue-civil-servant-not-ordinary-56", documents: "ue-national-classification-adapter", how: "ue-art-56-availability", next: "ue-type-gate-mandatory", deadlines: SHARED_FRESHNESS, problems: "ue-type-unclear-fail-closed", dutiesAfter: "ue-fact-change-recheck", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: SHARED_NEG } },
  { key: "ue-current-vs-proposed", title: "Geltendes Recht und 2016/0397 2026 trennen", trigger: "Nutzer behandelt vorgeschlagene 22-Wochen- oder Sechs-Monats-Regeln als geltendes Recht", safeFirstStep: "Erstlesung 2026 als nicht geltende Revision kennzeichnen.", riskLevel: "high", dimensions: { what: "ue-pending-cod-not-current", whoWhen: "ue-ep-first-reading-not-law", documents: "ue-proposed-six-month-not-current", how: "ue-proposed-22-week-not-current", next: "ue-provisional-agreement-not-law", deadlines: SHARED_FRESHNESS, problems: "ue-no-proposed-aggregation-threshold", dutiesAfter: "ue-commission-guidance-revalidate", institution: SHARED_INSTITUTION, boundaries: SHARED_BOUNDARIES, freshness: SHARED_FRESHNESS, negatives: "ue-proposed-six-month-not-current" } },
  { key: "ue-document-classifier", title: "A1 U1 U2 U3 Dokumentklassifikation 2026 führen", trigger: "A1, U1, U2 oder U3 werden vertauscht", safeFirstStep: "Funktionen trennen; Portable Documents sind nicht der Anspruch selbst.", riskLevel: "high", dimensions: { what: "ue-document-classifier", whoWhen: "ue-a1-not-u1", documents: "ue-portable-not-rights", how: EU_SHARED_PD_U1_CLAIM_KEY, next: EU_SHARED_PD_U2_CLAIM_KEY, deadlines: SHARED_FRESHNESS, problems: "ue-a1-not-unemp-award", dutiesAfter: EU_SHARED_PD_U3_CLAIM_KEY, institution: SHARED_INSTITUTION, boundaries: "ue-posted-not-infer-payer", freshness: SHARED_FRESHNESS, negatives: "ue-u2-not-u1" } },
]);

export type ScenarioCoverage = "COVERED" | "EXPLICITLY_OUT_OF_SCOPE" | "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE";

type ScenarioSpec = Readonly<{
  id: string;
  label: string;
  coverage: ScenarioCoverage;
  requiredClaimKeys: readonly string[];
  requiredProcessKeys: readonly string[];
}>;

export const EU_UNEMP_SCENARIOS: readonly ScenarioSpec[] = Object.freeze([
  { id: "ue-live-sk-work-de-return-daily-terminated", label: "Wohnsitz anderer Mitgliedstaat, Tätigkeit DE, tägliche Rückkehr, Vertrag beendet", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_ART1F_CLAIM_KEY, EU_SHARED_ART65_CLAIM_KEY], requiredProcessKeys: ["ue-frontier-classify", "ue-whole-frontier-residence-route"] },
  { id: "ue-live-sk-work-de-return-weekly-terminated", label: "Wohnsitz anderer Mitgliedstaat, Tätigkeit DE, wöchentliche Rückkehr, Vertrag beendet", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_ART1F_CLAIM_KEY, "ue-return-frequency-required"], requiredProcessKeys: ["ue-frontier-classify"] },
  { id: "ue-live-sk-work-de-return-monthly-terminated", label: "Wohnsitz anderer Mitgliedstaat, Tätigkeit DE, monatliche Rückkehr, Vertrag beendet", coverage: "COVERED", requiredClaimKeys: ["ue-cross-border-not-auto-frontier", "ue-non-frontier-not-auto-frontier"], requiredProcessKeys: ["ue-non-frontier-classify"] },
  { id: "ue-live-de-work-other-return-weekly-terminated", label: "Wohnsitz DE, Tätigkeit anderer Mitgliedstaat, wöchentliche Rückkehr, Vertrag beendet", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_ART1F_CLAIM_KEY, EU_SHARED_ART65_CLAIM_KEY], requiredProcessKeys: ["ue-whole-frontier-residence-route"] },
  { id: "ue-nationality-other-residence-de", label: "Staatsangehörigkeit anderer Mitgliedstaat, tatsächlicher Wohnsitz DE", coverage: "COVERED", requiredClaimKeys: ["ue-nationality-not-payer", "ue-residence-centre-of-interests"], requiredProcessKeys: ["ue-residence-determine"] },
  { id: "ue-nationality-de-residence-other", label: "Staatsangehörigkeit DE, tatsächlicher Wohnsitz anderer Mitgliedstaat", coverage: "COVERED", requiredClaimKeys: ["ue-nationality-not-payer"], requiredProcessKeys: ["ue-residence-determine"] },
  { id: "ue-locale-other-factual-de-cz", label: "Locale eines anderen Staats, Sachverhalt DE-CZ", coverage: "COVERED", requiredClaimKeys: ["ue-locale-not-payer"], requiredProcessKeys: ["ue-classify-coordination"] },
  { id: "ue-locale-hu-factual-de-other", label: "Locale HU, tatsächlicher DE-Fall mit anderem Mitgliedstaat", coverage: "COVERED", requiredClaimKeys: ["ue-locale-not-payer"], requiredProcessKeys: ["ue-classify-coordination"] },
  { id: "ue-registered-other-actual-residence-de", label: "Meldeadresse anderer Mitgliedstaat, tatsächlicher Wohnsitz DE", coverage: "COVERED", requiredClaimKeys: ["ue-registered-address-not-residence"], requiredProcessKeys: ["ue-residence-determine"] },
  { id: "ue-anmeldung-de-actual-residence-other", label: "Deutsche Anmeldung, tatsächlicher Wohnsitz anderer Mitgliedstaat", coverage: "COVERED", requiredClaimKeys: ["ue-residence-not-anmeldung"], requiredProcessKeys: ["ue-residence-determine"] },
  { id: "ue-residence-unclear", label: "Wohnsitz unklar", coverage: "COVERED", requiredClaimKeys: ["ue-residence-unclear-fail-closed"], requiredProcessKeys: ["ue-residence-determine"] },
  { id: "ue-frontier-status-unclear", label: "Grenzarbeitnehmerstatus unklar", coverage: "COVERED", requiredClaimKeys: ["ue-frontier-unclear-fail-closed"], requiredProcessKeys: ["ue-frontier-classify"] },
  { id: "ue-contract-terminated", label: "Arbeitsvertrag beendet", coverage: "COVERED", requiredClaimKeys: ["ue-whole-unemployment"], requiredProcessKeys: ["ue-type-classify"] },
  { id: "ue-contract-suspended-still-valid", label: "Vertrag ruht, bleibt aber gültig", coverage: "COVERED", requiredClaimKeys: ["ue-partial-unemployment", EU_SHARED_DECISION_U3_CLAIM_KEY], requiredProcessKeys: ["ue-decision-u3-contract-gate"] },
  { id: "ue-temporary-layoff", label: "Vorübergehende Freistellung", coverage: "COVERED", requiredClaimKeys: ["ue-layoff-not-whole"], requiredProcessKeys: ["ue-decision-u3-contract-gate"] },
  { id: "ue-zero-hours-contract-retained", label: "Null Stunden, Vertrag bleibt", coverage: "COVERED", requiredClaimKeys: ["ue-zero-hours-not-whole"], requiredProcessKeys: ["ue-decision-u3-contract-gate"] },
  { id: "ue-whole-unemployment", label: "Vollarbeitslosigkeit", coverage: "COVERED", requiredClaimKeys: ["ue-whole-unemployment", "ue-whole-not-partial"], requiredProcessKeys: ["ue-type-classify"] },
  { id: "ue-partial-unemployment", label: "Teilarbeitslosigkeit", coverage: "COVERED", requiredClaimKeys: ["ue-partial-unemployment"], requiredProcessKeys: ["ue-type-classify"] },
  { id: "ue-intermittent-unemployment", label: "Intermittierende Arbeitslosigkeit", coverage: "COVERED", requiredClaimKeys: ["ue-intermittent-unemployment"], requiredProcessKeys: ["ue-art-65-1-partial-route"] },
  { id: "ue-whole-frontier-claims-former-work-state", label: "Vollarbeitsloser Grenzarbeitnehmer verlangt Leistung vom früheren Tätigkeitsstaat", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_JELTES_CLAIM_KEY, "ue-last-work-not-payer-frontier"], requiredProcessKeys: ["ue-jeltes-no-second-benefit"] },
  { id: "ue-whole-frontier-supplementary-registration", label: "Vollarbeitsloser Grenzarbeitnehmer meldet sich ergänzend im früheren Tätigkeitsstaat", coverage: "COVERED", requiredClaimKeys: ["ue-supplementary-registration", "ue-supplementary-not-second-benefit"], requiredProcessKeys: ["ue-supplementary-job-search"] },
  { id: "ue-user-thinks-jeltes-allows-choice", label: "Nutzer meint, Jeltes erlaube die Wahl", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_JELTES_CLAIM_KEY, "ue-ties-not-choice"], requiredProcessKeys: ["ue-jeltes-no-second-benefit"] },
  { id: "ue-non-frontier-returns-to-residence", label: "Nicht-Grenzgänger kehrt in den Wohnstaat zurück", coverage: "COVERED", requiredClaimKeys: ["ue-non-frontier-return-residence"], requiredProcessKeys: ["ue-non-frontier-return-route"] },
  { id: "ue-non-frontier-stays-in-last-work-state", label: "Nicht-Grenzgänger bleibt im letzten Tätigkeitsstaat", coverage: "COVERED", requiredClaimKeys: ["ue-non-frontier-remain-last-state"], requiredProcessKeys: ["ue-non-frontier-remain-route"] },
  { id: "ue-non-frontier-then-returns-home", label: "Nicht-Grenzgänger erhält zuerst letzte Staatsleistung und kehrt dann heim", coverage: "COVERED", requiredClaimKeys: ["ue-art-65-5b-transition", "ue-art-65-5b-not-double"], requiredProcessKeys: ["ue-art-65-5b-transition"] },
  { id: "ue-user-assumes-residence-always-pays", label: "Nutzer nimmt an, der Wohnsitzstaat zahle stets", coverage: "COVERED", requiredClaimKeys: ["ue-residence-not-always-pays"], requiredProcessKeys: ["ue-non-frontier-remain-route"] },
  { id: "ue-user-assumes-last-work-always-pays", label: "Nutzer nimmt an, der letzte Tätigkeitsstaat zahle stets", coverage: "COVERED", requiredClaimKeys: ["ue-last-work-not-always-pays"], requiredProcessKeys: ["ue-whole-frontier-residence-route"] },
  { id: "ue-de-last-periods-other-residence-65-5a", label: "Letzte Zeiten DE, Wohnsitz anderer Mitgliedstaat, Artikel 65 Absatz 5 Buchstabe a", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_ART65_CLAIM_KEY, "ue-art-61-2-except-65-5a"], requiredProcessKeys: ["ue-art-65-5a-aggregation-exception"] },
  { id: "ue-other-last-periods-de-residence-65-5a", label: "Letzte Zeiten anderer Mitgliedstaat, Wohnsitz DE, Artikel 65 Absatz 5 Buchstabe a", coverage: "COVERED", requiredClaimKeys: ["ue-art-61-2-except-65-5a", "ue-work-other-not-auto-payer"], requiredProcessKeys: ["ue-art-65-5a-aggregation-exception"] },
  { id: "ue-foreign-periods-needed-for-qualifying", label: "Ausländische Zeiten für die nationale Anwartschaft erforderlich", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_ART61_CLAIM_KEY], requiredProcessKeys: ["ue-art-61-aggregation"] },
  { id: "ue-foreign-periods-not-needed", label: "Ausländische Zeiten nicht erforderlich", coverage: "COVERED", requiredClaimKeys: ["ue-art-61-not-national-entitlement"], requiredProcessKeys: ["ue-art-61-aggregation"] },
  { id: "ue-insurance-category-mismatch", label: "Versicherungskategorie passt nicht", coverage: "COVERED", requiredClaimKeys: ["ue-art-61-category-compatibility"], requiredProcessKeys: ["ue-art-61-period-compatibility"] },
  { id: "ue-employment-not-insurance-under-competent-law", label: "Beschäftigungszeit zählt nach zuständigem Recht nicht als Versicherungszeit", coverage: "COVERED", requiredClaimKeys: ["ue-foreign-not-auto-insurance"], requiredProcessKeys: ["ue-art-61-period-compatibility"] },
  { id: "ue-most-recent-period-in-claiming-state", label: "Letzte einschlägige Zeit im Anspruchsstaat vorhanden", coverage: "COVERED", requiredClaimKeys: ["ue-art-61-2-recent-period"], requiredProcessKeys: ["ue-art-61-2-recent-period"] },
  { id: "ue-most-recent-period-absent-outside-exception", label: "Letzte Zeit fehlt außerhalb der Artikel-65-Ausnahme", coverage: "COVERED", requiredClaimKeys: ["ue-art-61-2-recent-period"], requiredProcessKeys: ["ue-art-61-2-recent-period"] },
  { id: "ue-art-65-5a-no-recent-residence-employment", label: "Artikel 65 Absatz 5 Buchstabe a ohne jüngste Wohnsitzbeschäftigung", coverage: "COVERED", requiredClaimKeys: ["ue-art-61-2-except-65-5a", "ue-no-recent-residence-contrib-not-impossible"], requiredProcessKeys: ["ue-art-65-5a-aggregation-exception"] },
  { id: "ue-user-thinks-u1-grants-benefit", label: "Nutzer hält U1 für Leistungsbewilligung", coverage: "COVERED", requiredClaimKeys: ["ue-u1-not-award"], requiredProcessKeys: ["ue-u1-evidence"] },
  { id: "ue-user-has-no-u1", label: "Nutzer besitzt kein U1", coverage: "COVERED", requiredClaimKeys: ["ue-u1-absence-not-impossible"], requiredProcessKeys: ["ue-u1-evidence"] },
  { id: "ue-institution-obtains-periods-electronically", label: "Träger beschafft Zeiten elektronisch", coverage: "COVERED", requiredClaimKeys: ["ue-institutional-period-exchange", "ue-eessi-exchange"], requiredProcessKeys: ["ue-institutional-period-exchange"] },
  { id: "ue-u1-contains-multiple-foreign-periods", label: "U1 enthält Zeiten mehrerer Mitgliedstaaten", coverage: "COVERED", requiredClaimKeys: ["ue-multi-state-periods"], requiredProcessKeys: ["ue-institutional-period-exchange"] },
  { id: "ue-overlapping-period-evidence", label: "Überlappende Zeitennachweise", coverage: "COVERED", requiredClaimKeys: ["ue-overlapping-periods-manual-review"], requiredProcessKeys: ["ue-art-61-period-compatibility"] },
  { id: "ue-residence-pays-using-former-work-salary", label: "Wohnsitzstaat zahlt mit Entgelt der letzten Tätigkeit", coverage: "COVERED", requiredClaimKeys: ["ue-art-62-3-residence-uses-activity-salary"], requiredProcessKeys: ["ue-art-62-3-salary-route"] },
  { id: "ue-user-assumes-residence-salary-must-be-used", label: "Nutzer nimmt an, Wohnsitzgehalt müsse verwendet werden", coverage: "COVERED", requiredClaimKeys: ["ue-residence-pay-not-residence-salary"], requiredProcessKeys: ["ue-art-62-3-salary-route"] },
  { id: "ue-salary-information-missing", label: "Entgeltangaben fehlen", coverage: "COVERED", requiredClaimKeys: ["ue-exact-salary-fail-closed", "ue-art-54-2-salary-exchange"], requiredProcessKeys: ["ue-art-54-salary-exchange"] },
  { id: "ue-amount-depends-on-family-members-abroad", label: "Betrag hängt von Familienangehörigen im Ausland ab", coverage: "COVERED", requiredClaimKeys: ["ue-art-54-3-family-increases"], requiredProcessKeys: ["ue-family-increase-boundary"] },
  { id: "ue-family-member-already-counted-elsewhere", label: "Familienangehörige bereits in anderer Arbeitslosenleistung berücksichtigt", coverage: "COVERED", requiredClaimKeys: ["ue-art-54-3-exception-other-person"], requiredProcessKeys: ["ue-family-increase-boundary"] },
  { id: "ue-existing-entitlement-job-search-abroad", label: "Bestehender nationaler Anspruch, Arbeitsuche im Ausland", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_ART64_CLAIM_KEY, EU_SHARED_PD_U2_CLAIM_KEY], requiredProcessKeys: ["ue-art-64-export-eligibility"] },
  { id: "ue-partially-unemployed-asks-for-u2", label: "Teilarbeitslose Person verlangt U2", coverage: "COVERED", requiredClaimKeys: ["ue-partial-not-u2"], requiredProcessKeys: ["ue-art-65-1-partial-route"] },
  { id: "ue-wholly-unemployed-no-existing-entitlement", label: "Vollarbeitslos ohne bestehenden Anspruch", coverage: "COVERED", requiredClaimKeys: ["ue-no-existing-entitlement-no-u2"], requiredProcessKeys: ["ue-art-64-export-eligibility"] },
  { id: "ue-u2-requested-after-four-weeks", label: "U2 nach vier Wochen verlangt", coverage: "COVERED", requiredClaimKeys: ["ue-art-64-four-week-default"], requiredProcessKeys: ["ue-four-week-gate"] },
  { id: "ue-early-u2-before-four-weeks", label: "Frühere U2-Abreise vor vier Wochen verlangt", coverage: "COVERED", requiredClaimKeys: ["ue-four-week-not-absolute"], requiredProcessKeys: ["ue-four-week-gate"] },
  { id: "ue-destination-registration-within-seven-days", label: "Zielstaatsmeldung innerhalb von sieben Tagen", coverage: "COVERED", requiredClaimKeys: ["ue-art-64-seven-day-registration"], requiredProcessKeys: ["ue-seven-day-registration"] },
  { id: "ue-destination-registration-after-seven-days", label: "Zielstaatsmeldung nach sieben Tagen", coverage: "COVERED", requiredClaimKeys: ["ue-seven-day-not-always-forgiven"], requiredProcessKeys: ["ue-seven-day-registration"] },
  { id: "ue-user-assumes-late-registration-always-forgiven", label: "Nutzer nimmt an, verspätete Meldung sei stets folgenlos", coverage: "COVERED", requiredClaimKeys: ["ue-seven-day-not-always-forgiven"], requiredProcessKeys: ["ue-seven-day-registration"] },
  { id: "ue-three-month-export", label: "Dreimonatige Ausfuhr", coverage: "COVERED", requiredClaimKeys: ["ue-art-64-three-month-standard"], requiredProcessKeys: ["ue-export-duration"] },
  { id: "ue-extension-requested-before-three-months-expire", label: "Verlängerung vor Ablauf von drei Monaten verlangt", coverage: "COVERED", requiredClaimKeys: ["ue-art-64-extend-max-six", "ue-extension-requires-authorization"], requiredProcessKeys: ["ue-export-duration"] },
  { id: "ue-user-assumes-six-months-automatic", label: "Nutzer nimmt sechs Monate als Automatismus an", coverage: "COVERED", requiredClaimKeys: ["ue-six-not-automatic", "ue-six-not-current-standard"], requiredProcessKeys: ["ue-export-duration"] },
  { id: "ue-national-entitlement-shorter-than-three-months", label: "Nationale Restdauer kürzer als drei Monate", coverage: "COVERED", requiredClaimKeys: ["ue-remaining-national-limit", "ue-three-not-guaranteed-duration"], requiredProcessKeys: ["ue-export-duration"] },
  { id: "ue-claimant-changes-destination-during-export", label: "Zielstaat wechselt während der Ausfuhr", coverage: "COVERED", requiredClaimKeys: ["ue-multiple-destinations-no-reset"], requiredProcessKeys: ["ue-export-duration"] },
  { id: "ue-claimant-finds-job-during-export", label: "Person findet während der Ausfuhr Arbeit", coverage: "COVERED", requiredClaimKeys: ["ue-job-during-export-recheck"], requiredProcessKeys: ["ue-destination-control"] },
  { id: "ue-portable-u3-received", label: "Portable Document U3 geht ein", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_PD_U3_CLAIM_KEY, "ue-u3-not-auto-cancellation"], requiredProcessKeys: ["ue-u3-warning"] },
  { id: "ue-user-thinks-portable-u3-equals-decision-u3", label: "Nutzer hält Portable U3 für Beschluss U3", coverage: "COVERED", requiredClaimKeys: ["ue-decision-u3-not-portable-u3"], requiredProcessKeys: ["ue-u3-warning"] },
  { id: "ue-user-returns-before-u2-expiry", label: "Rückkehr vor Ablauf des U2", coverage: "COVERED", requiredClaimKeys: ["ue-return-before-expiry"], requiredProcessKeys: ["ue-return-before-expiry"] },
  { id: "ue-user-returns-after-expiry-without-authorization", label: "Rückkehr nach Ablauf ohne Genehmigung", coverage: "COVERED", requiredClaimKeys: ["ue-late-return-fail-closed"], requiredProcessKeys: ["ue-late-return"] },
  { id: "ue-material-change-while-holding-physical-u2", label: "Wesentliche Änderung bei physischem U2", coverage: "COVERED", requiredClaimKeys: ["ue-physical-u2-not-still-valid"], requiredProcessKeys: ["ue-u2-request"] },
  { id: "ue-former-work-state-reimburses-residence", label: "Früherer Tätigkeitsstaat erstattet dem Wohnsitzträger", coverage: "COVERED", requiredClaimKeys: ["ue-art-65-reimburse-3-months"], requiredProcessKeys: ["ue-art-65-reimbursement"] },
  { id: "ue-user-thinks-reimbursement-is-second-payment", label: "Nutzer hält Erstattung für zweite Zahlung", coverage: "COVERED", requiredClaimKeys: ["ue-reimburse-not-two-benefits"], requiredProcessKeys: ["ue-art-65-reimbursement"] },
  { id: "ue-three-month-institutional-reimbursement", label: "Dreimonatige Trägererstattung", coverage: "COVERED", requiredClaimKeys: ["ue-art-65-reimburse-3-months"], requiredProcessKeys: ["ue-art-65-reimbursement"] },
  { id: "ue-five-month-reimbursement-conditions-fulfilled", label: "Fünfmonatige Erstattung unter erfüllten Voraussetzungen", coverage: "COVERED", requiredClaimKeys: ["ue-art-65-reimburse-5-months"], requiredProcessKeys: ["ue-art-65-reimbursement"] },
  { id: "ue-self-employed-frontier-ordinary-65", label: "Selbständiger Grenzarbeitnehmer, gewöhnlicher Artikel 65", coverage: "COVERED", requiredClaimKeys: ["ue-self-employed-not-auto-65a"], requiredProcessKeys: ["ue-art-65a-exception"] },
  { id: "ue-self-employed-frontier-potential-65a", label: "Selbständiger Grenzarbeitnehmer, möglicher Artikel 65a", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_ART65A_CLAIM_KEY], requiredProcessKeys: ["ue-art-65a-exception"] },
  { id: "ue-art-65a-residence-notification-unknown", label: "Artikel-65a-Mitteilung des Wohnstaats unbekannt", coverage: "COVERED", requiredClaimKeys: ["ue-art-65a-notification-lookup"], requiredProcessKeys: ["ue-art-65a-notification"] },
  { id: "ue-special-civil-servant-scheme", label: "Besonderes Beamten-Arbeitslosensystem", coverage: "COVERED", requiredClaimKeys: ["ue-art-57-civil-servant", "ue-civil-servant-not-ordinary-56"], requiredProcessKeys: ["ue-civil-servant-boundary"] },
  { id: "ue-posted-worker-loses-job", label: "Entsandte Person verliert die Beschäftigung", coverage: "COVERED", requiredClaimKeys: ["ue-posted-not-infer-payer"], requiredProcessKeys: ["ue-document-classifier"] },
  { id: "ue-a1-exists-payer-unresolved", label: "A1 vorhanden, zahlender Arbeitslosenstaat unklar", coverage: "COVERED", requiredClaimKeys: ["ue-a1-not-unemp-award", "ue-title-ii-not-unemp-state"], requiredProcessKeys: ["ue-document-classifier"] },
  { id: "ue-a1-state-mistaken-for-unemployment-state", label: "A1-Staat mit Arbeitslosenstaat verwechselt", coverage: "COVERED", requiredClaimKeys: ["ue-a1-not-u1", "ue-title-ii-not-unemp-state"], requiredProcessKeys: ["ue-document-classifier"] },
  { id: "ue-jobcenter-grundsicherung-requested", label: "Jobcenter-Grundsicherung verlangt", coverage: "COVERED", requiredClaimKeys: ["ue-alg-not-jobcenter", "ue-benefit-not-social-assistance"], requiredProcessKeys: ["ue-benefit-branch-boundary"] },
  { id: "ue-exact-german-alg-amount-requested", label: "Genauer deutscher Arbeitslosengeldbetrag verlangt", coverage: "COVERED", requiredClaimKeys: ["ue-no-national-amount", "ue-alg-national-not-in-eu-core"], requiredProcessKeys: ["ue-art-62-remuneration-source"] },
  { id: "ue-exact-foreign-unemployment-amount-requested", label: "Genauer ausländischer Arbeitslosenbetrag verlangt", coverage: "COVERED", requiredClaimKeys: ["ue-no-national-amount"], requiredProcessKeys: ["ue-art-62-remuneration-source"] },
  { id: "ue-proposed-22-week-treated-as-current", label: "Vorgeschlagene 22-Wochen-Regel als geltendes Recht", coverage: "COVERED", requiredClaimKeys: ["ue-proposed-22-week-not-current"], requiredProcessKeys: ["ue-current-vs-proposed"] },
  { id: "ue-proposed-six-month-standard-treated-as-current", label: "Vorgeschlagene sechsmonatige Regelausfuhr als geltendes Recht", coverage: "COVERED", requiredClaimKeys: ["ue-proposed-six-month-not-current"], requiredProcessKeys: ["ue-current-vs-proposed"] },
  { id: "ue-ep-first-reading-treated-as-final-law", label: "Parlamentserstlesung als endgültiges Recht", coverage: "COVERED", requiredClaimKeys: ["ue-ep-first-reading-not-law", "ue-pending-cod-not-current"], requiredProcessKeys: ["ue-current-vs-proposed"] },
  { id: "uk-case", label: "UK-spezifischer Fall", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["ue-uk-out-of-scope"], requiredProcessKeys: ["ue-benefit-branch-boundary"] },
  { id: "non-eu-bilateral", label: "Nicht-EU-bilateraler Arbeitslosenfall", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["ue-non-eu-bilateral-out-of-scope"], requiredProcessKeys: ["ue-benefit-branch-boundary"] },
]);

export const EU_UNEMP_NEGATIVE_CONTROLS = Object.freeze([
  "ue-nationality-not-payer",
  "ue-locale-not-payer",
  "ue-registered-address-not-residence",
  "ue-work-de-not-auto-payer",
  "ue-work-other-not-auto-payer",
  "ue-title-ii-not-unemp-state",
  "ue-cross-border-not-auto-frontier",
  "ue-return-frequency-required",
  "ue-whole-not-partial",
  "ue-zero-hours-not-whole",
  "ue-suspension-not-termination",
  "ue-partial-not-residence-route",
  EU_SHARED_JELTES_CLAIM_KEY,
  "ue-supplementary-not-second-benefit",
  "ue-job-prospects-not-competence",
  "ue-u1-not-award",
  "ue-u1-issuer-not-payer",
  "ue-u1-not-amount",
  "ue-u1-absence-not-impossible",
  "ue-u2-not-new-benefit",
  "ue-u2-not-destination-benefit",
  "ue-u2-not-u1",
  "ue-decision-u2-not-portable-u2",
  "ue-decision-u3-not-portable-u3",
  "ue-u3-not-auto-cancellation",
  "ue-four-week-not-absolute",
  "ue-seven-day-not-national-deadline",
  "ue-three-not-guaranteed-duration",
  "ue-six-not-automatic",
  "ue-proposed-six-month-not-current",
  "ue-proposed-22-week-not-current",
  "ue-ep-first-reading-not-law",
  "ue-foreign-not-auto-insurance",
  "ue-art-61-not-national-entitlement",
  "ue-art-61-2-except-65-5a",
  "ue-residence-pay-not-residence-salary",
  "ue-not-average-both-states",
  "ue-reimburse-not-two-benefits",
  "ue-reimburse-not-payer-change",
  "ue-self-employed-not-auto-65a",
  "ue-art-65a-requires-notification",
  "ue-a1-not-u1",
  "ue-a1-not-unemp-award",
  "ue-alg-not-jobcenter",
  "ue-benefit-not-social-assistance",
]);

export function evaluateEuUnempProcessCompleteness(
  pack: {
    claims: readonly { key: string }[];
    processes: readonly { key: string; id: string }[];
    processClaimLinks: readonly Record<string, unknown>[];
  },
) {
  const processKeys = new Set(pack.processes.map((process) => process.key));
  const claimKeys = new Set(pack.claims.map((claim) => claim.key));
  const incomplete = EU_UNEMP_PROCESSES.filter((process) => (
    PROCESS_COMPLETE_DIMENSIONS.some((dimension) => !claimKeys.has(process.dimensions[dimension]))
  ));
  const blocked = EU_UNEMP_SCENARIOS.filter((scenario) => scenario.coverage === "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE");
  const covered = EU_UNEMP_SCENARIOS.filter((scenario) => scenario.coverage === "COVERED");
  const outOfScope = EU_UNEMP_SCENARIOS.filter((scenario) => scenario.coverage === "EXPLICITLY_OUT_OF_SCOPE");
  const uncoveredRequired = covered.flatMap((scenario) => [
    ...scenario.requiredProcessKeys.filter((key) => !processKeys.has(key)).map((key) => `process:${scenario.id}:${key}`),
    ...scenario.requiredClaimKeys.filter((key) => !claimKeys.has(key)).map((key) => `claim:${scenario.id}:${key}`),
  ]);
  const processComplete = incomplete.length === 0 && uncoveredRequired.length === 0
    && pack.processes.length === EU_UNEMP_PROCESSES.length;
  return Object.freeze({
    processCount: pack.processes.length,
    processComplete,
    processCompletenessPercent: processComplete ? 100 : 0,
    blockedScenarioCount: blocked.length,
    coveredScenarioCount: covered.length,
    outOfScopeScenarioCount: outOfScope.length,
    processScenarioCount: EU_UNEMP_SCENARIOS.length,
    totalScenarios: EU_UNEMP_SCENARIOS.length,
    incompleteProcessKeys: incomplete.map((process) => process.key),
    uncoveredRequired,
  });
}

export type EuUnemploymentCoordinationPack = ReturnType<typeof buildEuUnemploymentCoordinationPack>;

export function buildEuUnemploymentCoordinationPack() {
  const item = factory(EU_UNEMP_PACK_ID);
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
    oeil: item("publishers", "oeil-unemployment", {
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
    oeil: item("authorities", "oeil-unemployment-authority", {
      publisherId: publishers.oeil.id, name: "Europäisches Parlament OEIL", type: "eu_institution",
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      officialPortalUrl: "https://oeil.europarl.europa.eu",
    }),
  };
  const publisherOf = { eurlex: publishers.eurlex, commission: publishers.commission, oeil: publishers.oeil };
  const authorityOf = { eurlex: authorities.eurlex, commission: authorities.commission, oeil: authorities.oeil };

  const sources = EU_UNEMP_OFFICIAL_SOURCES.map((spec) => {
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

  const claims = EU_UNEMP_UNITS.map((unit) => {
    const source = sourceByKey.get(unit.sourceKey);
    const passage = passageByKey.get(unit.passageKey);
    if (!source || !passage) throw new Error(`EU_UNEMP_UNIT_SOURCE_MISSING:${unit.key}`);
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

  const processes = EU_UNEMP_PROCESSES.map((spec) => item("processes", spec.key, {
    processGroupId: EU_UNEMP_PROCESS_GROUP, title: spec.title, jurisdictionId: jurisdiction.id,
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
    if (!stored || !claim) throw new Error(`EU_UNEMP_PROCESS_CLAIM_MISSING:${processKey}:${claimKey}`);
    seen.add(token);
    processClaimLinks.push(item("processClaimLinks", token, {
      processId: stored.id, claimId: claim.id, role, required: true,
      sequenceContext: role, qualificationRequired: false,
    }));
  };
  for (const process of EU_UNEMP_PROCESSES) {
    for (const dimension of PROCESS_COMPLETE_DIMENSIONS) {
      addLink(process.key, process.dimensions[dimension], dimension);
    }
  }
  for (const scenario of EU_UNEMP_SCENARIOS) {
    if (scenario.coverage !== "COVERED") continue;
    for (const processKey of scenario.requiredProcessKeys) {
      for (const claimKey of scenario.requiredClaimKeys) {
        addLink(processKey, claimKey, "scenario");
      }
    }
  }

  return Object.freeze({
    schemaVersion: 1 as const,
    packId: EU_UNEMP_PACK_ID,
    canonicalLanguage: EU_UNEMP_CANONICAL_LANGUAGE,
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

export function validateEuUnemploymentCoordinationPack(
  pack: EuUnemploymentCoordinationPack,
) {
  const issues: string[] = [];
  if (pack.schemaVersion !== 1 || pack.packId !== EU_UNEMP_PACK_ID) issues.push("EU_UNEMP_IDENTITY_INVALID");
  if (pack.canonicalLanguage !== "de") issues.push("INVALID_CANONICAL_LANGUAGE");
  if (pack.trustDomain.code !== "eu") issues.push("EU_TRUST_DOMAIN_REQUIRED");
  for (const jurisdiction of pack.jurisdictions) {
    if (jurisdiction.level !== "eu" || jurisdiction.countryCode !== "EU") issues.push("EU_JURISDICTION_REQUIRED");
  }
  if (pack.claims.some((claim) => claim.temporalClass !== "CURRENT")) issues.push("NON_CURRENT_CLAIM");
  if (EU_UNEMP_FUTURE_WATCH.some((item) => item.ingestible)) issues.push("WATCH_ITEM_MARKED_INGESTIBLE");
  const urls = pack.sources.map((source) => String(source.canonicalUrl));
  if (new Set(urls).size !== urls.length) issues.push("DUPLICATE_CANONICAL_URL");
  if (urls.some((url) => url.includes("#"))) issues.push("HASH_IN_CANONICAL_URL");
  const forbidden = /wikipedia|reddit|linkedin|expat|blog|forum|anwalt|kanzlei/iu;
  if (urls.some((url) => forbidden.test(url))) issues.push("NON_AUTHORITATIVE_CANONICAL_URL");
  const completeness = evaluateEuUnempProcessCompleteness(pack);
  if (completeness.blockedScenarioCount !== 0) issues.push("BLOCKED_SCENARIOS");
  if (completeness.processCompletenessPercent !== 100) issues.push("PROCESS_INCOMPLETE");
  if (!EU_UNEMP_NEGATIVE_CONTROLS.every((key) => pack.claims.some((claim) => claim.key === key))) {
    issues.push("MISSING_NEGATIVE_CONTROL");
  }
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    authoringUsesKeysNotDatabaseUuids: true,
    productionEligible: false,
  });
}

export function euUnempPackSummary(
  pack: EuUnemploymentCoordinationPack = buildEuUnemploymentCoordinationPack(),
) {
  const completeness = evaluateEuUnempProcessCompleteness(pack);
  return Object.freeze({
    packId: pack.packId,
    canonicalLanguage: pack.canonicalLanguage,
    claimCount: pack.claims.length,
    legacyCount: 0,
    futureCount: EU_UNEMP_FUTURE_WATCH.length,
    proposedNotCurrentCount: EU_UNEMP_FUTURE_WATCH.filter((item) => item.temporalClass === "PROPOSED_NOT_CURRENT").length,
    sourceCount: pack.sources.length,
    processClaimLinkCount: pack.processClaimLinks.length,
    ...completeness,
    processCount: pack.processes.length,
    validation: validateEuUnemploymentCoordinationPack(pack),
  });
}

