/**
 * AT-SK-0G Austrian operational routing for unemployment coordination (Arbeitslosengeld).
 * Does not restate Regulation 883/2004 Articles 61–65a. EU unemployment core owns legal merits.
 * Arbeitslosengeld / Notstandshilfe routing only — not full national benefit calculator.
 */
import { createHash } from "node:crypto";

import { PROCESS_COMPLETE_DIMENSIONS } from "../../eu/applicable-legislation/eu-applicable-legislation-core-pack";
import {
  AT_NATIONAL_COUNTRY_CODE,
  AT_NATIONAL_JURISDICTION_LEVEL,
  AT_NATIONAL_TRUST_DOMAIN,
} from "../../../source-registry/at-national-foundation-contracts";
import { stableKnowledgeFactoryId } from "../../../source-registry/knowledge-factory-contracts";

const HASH = (value: string): string => createHash("sha256").update(value).digest("hex");
type Entity = Readonly<Record<string, unknown> & { key: string; id: string }>;

function item(entityClass: string, key: string, values: Record<string, unknown>): Entity {
  return Object.freeze({
    key,
    id: stableKnowledgeFactoryId(AT_UE_ROUTING_PACK_ID, entityClass, key),
    ...values,
  });
}

export const AT_UE_ROUTING_PACK_ID = "at_unemployment_coordination_routing" as const;
export const AT_UE_ROUTING_PROCESS_GROUP = "at_unemployment_coordination_routing" as const;
export const AT_UE_PRIMARY_PROCESS_KEY = "at-ue-arbeitslosengeld-cross-border" as const;
export const AT_AMS_ROLE = "AT_AMS" as const;
export const AT_UE_AS_OF = "2026-09-04" as const;
export const AT_UE_ART9_DECLARATION_VERSION = "2025" as const;
export const AT_UE_ART9_PUBLICATION_DATE = "2026-08-06" as const;
export const AT_UE_ART9_REFERENCE_YEAR_END = "2024-12-31" as const;

export const AT_UE_OFFICIAL_SOURCES = Object.freeze([
  {
    key: "at-ue-alvg-ris",
    publisherKey: "ris-ue" as const,
    officialDomain: "www.ris.bka.gv.at",
    url: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10008163",
    title: "RIS: Arbeitslosenversicherungsgesetz 1977 (AlVG)",
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshnessClass: "LEGAL_CHANGE_MONITORED" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "LEGAL_BASELINE" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-ue-alvg-ris-text",
      locator: "AlVG §3 §12",
      text: "Nach Art. 1 § 3 AlVG können selbständig Erwerbstätige, die nicht der Pflichtversicherung in der Pensionsversicherung unterliegen, in die Arbeitslosenversicherung einbezogen werden, wenn sie fristgerecht ihren Eintritt erklären. Die SVS weist auf Frist und Bindungsdauer hin. Die Frist beträgt sechs Monate ab Verständigung; bei Mitteilung binnen drei Monaten kann die Einbeziehung rückwirkend greifen. § 12 AlVG verlangt für Arbeitslosigkeit die Beendigung einer Erwerbstätigkeit, kein Vorliegen der Pflichtpensionsversicherung und keine neue oder weitere Erwerbstätigkeit. Selbständigkeit allein begründet keine Arbeitslosenversicherung. Dieses Routing-Paket berechnet keine individuelle Arbeitslosengeldhöhe.",
    }],
  },
  {
    key: "at-ue-ams-services",
    publisherKey: "ams-ue" as const,
    officialDomain: "www.ams.at",
    url: "https://www.ams.at/arbeitsuchende/arbeitslosengeld-und-notstandshilfe",
    title: "AMS: Arbeitslosengeld und Notstandshilfe",
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshnessClass: "EVENT_DRIVEN" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "PROCESS_IDENTITY" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-ue-ams-services-text",
      locator: "Arbeitslosengeld / Notstandshilfe / Verfügbarkeit",
      text: "Das Arbeitsmarktservice Österreich der Kategorie AT_AMS ist die zuständige österreichische Stelle für Arbeitslosmeldung, Arbeitslosengeld, Notstandshilfe, PD U1 und PD U2. Arbeitslosengeld ist die laufende Versicherungsleistung bei erfüllter Anwartschaft und Verfügbarkeit. Notstandshilfe ist eine eigenständige bedarfsorientierte Arbeitslosen-Geldleistung nach erschöpftem Bezugsrecht und gehört zum Arbeitslosen-Koordinierungskontext, ist aber kein Ersatz für unionsrechtliche Leistungskompetenz und kein vollständiger Leistungsrechner. Für die Ausfuhr österreichischen Arbeitslosengeldes gilt derzeit die dreimonatige operative Ausfuhrpraxis des AMS im Einklang mit Artikel 64; Formulare und Fristen sind live zu prüfen.",
    }],
  },
  {
    key: "at-ue-ams-locator",
    publisherKey: "ams-ue" as const,
    officialDomain: "www.ams.at",
    url: "https://www.ams.at/kontakt/ams-in-ihrer-naehe",
    title: "AMS: Geschäftsstelle und Kontakt",
    handlingMode: "FETCH_LIVE" as const,
    freshnessClass: "EVENT_DRIVEN" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "ONLINE_SERVICE_URL" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-ue-ams-locator-text",
      locator: "AMS Geschäftsstelle",
      text: "Die genaue örtliche AMS-Geschäftsstelle, Telefon, E-Mail und Öffnungszeiten sind live zu bestimmen und nicht ohne Frische festzuschreiben. Das AMS ist nicht Finanzamt, nicht SVS als ordentlicher Leistungsträger und nicht Krankenversicherungsträger.",
    }],
  },
  {
    key: "at-ue-oesterreich-gv",
    publisherKey: "oesterreich-gv-ue" as const,
    officialDomain: "www.oesterreich.gv.at",
    url: "https://www.oesterreich.gv.at/de/themen/arbeit_und_pension/arbeitslosigkeit/Seite.450234",
    title: "oesterreich.gv.at: Arbeitslosigkeit und Arbeitslosengeld",
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshnessClass: "EVENT_DRIVEN" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "PROCESS_IDENTITY" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-ue-oesterreich-gv-text",
      locator: "Arbeitslosmeldung / MeinAMS",
      text: "Arbeitslose Personen melden sich beim AMS. MeinAMS ist der aktuelle persönliche elektronische Servicekanal für viele AMS-Verfahren. Die Nutzung von MeinAMS begründet keinen automatischen Leistungsanspruch. Antrag oder Meldung ist nicht Genehmigung. Kanäle und Formulare sind live zu prüfen.",
    }],
  },
  {
    key: "at-ue-svs-alvg3",
    publisherKey: "svs-ue" as const,
    officialDomain: "www.svs.at",
    url: "https://www.svs.at/cdscontent/?contentid=10007.816725&portal=svsportal",
    title: "SVS: Rolle bei freiwilliger Arbeitslosenversicherung selbständig Erwerbstätiger",
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshnessClass: "EVENT_DRIVEN" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "AUTHORITY_COMPETENCE" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-ue-svs-alvg3-text",
      locator: "Art. 1 § 3 AlVG / SVS Verständigung",
      text: "Die SVS ist für die Verständigung und den Versicherungsweg nach Art. 1 § 3 AlVG zuständig, nicht für die ordentliche Auszahlung von Arbeitslosengeld oder Notstandshilfe. SVS-Mitgliedschaft oder Selbständigenstatus allein begründet weder Arbeitslosengeld noch PD U1. Die SVS stellt das PD U1 für die Arbeitslosenkoordinierung nicht aus. Finanzamt stellt PD U1 ebenfalls nicht aus.",
    }],
  },
  {
    key: "at-ue-art9-2025",
    publisherKey: "ams-ue" as const,
    officialDomain: "employment-social-affairs.ec.europa.eu",
    url: "https://employment-social-affairs.ec.europa.eu/document/download/f3353e12-9488-4449-9dc9-fc9b36964cb3_en?filename=AT-%20Art%209%20%28ex2025%29%20-%20en.pdf",
    title: "European Commission: Austria Declaration Article 9 of Regulation (EC) No 883/2004 (2025)",
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshnessClass: "EVENT_DRIVEN" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "LEGAL_BASELINE" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-ue-art9-2025-text",
      locator: "Article 65a(1) Austria 2025",
      text: "Die österreichische Artikel-9-Erklärung 2025, veröffentlicht am 6. August 2026 für das Bezugsjahr bis 31. Dezember 2024, stellt fest, dass österreichisches Recht Selbständigen die Möglichkeit bietet, in das Arbeitslosensystem einbezogen zu werden, insbesondere über Art. 1 § 3 AlVG. Österreich ist danach kein Wohnmitgliedstaat ohne Selbständigen-Arbeitslosensystem im Sinne von Artikel 65a. Die Feststellung ist jährlich zu revalidieren. Systemische Deckungsmöglichkeit bedeutet nicht, dass die einzelne Person tatsächlich versichert war.",
    }],
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

export const AT_UE_UNITS: readonly Unit[] = Object.freeze([
  { key: "at-ue-does-not-copy-eu-law", category: "boundary", type: "boundary", text: "Dieses österreichische Arbeitslosenrouting wiederholt nicht die materiellen Artikel 61 bis 65a. Die rechtliche Einordnung bleibt im geteilten EU-Arbeitslosenkern.", sourceKey: "at-ue-art9-2025", passageKey: "at-ue-art9-2025-text", riskLevel: "high" },
  { key: "at-ue-does-not-determine-art-11", category: "boundary", type: "boundary", text: "Dieses Routing bestimmt nicht selbst die anwendbaren Rechtsvorschriften nach den Artikeln 11 bis 13; dafür ist ein verifiziertes anwendbare-Rechtsvorschriften-Ergebnis erforderlich.", sourceKey: "at-ue-art9-2025", passageKey: "at-ue-art9-2025-text", riskLevel: "high" },
  { key: "at-ue-ams-role", category: "institution", type: "definition", text: "Für österreichisches Arbeitslosengeld, Notstandshilfe, Arbeitslosmeldung, PD U1 und PD U2 ist das AMS der Kategorie AT_AMS zuständig.", sourceKey: "at-ue-ams-services", passageKey: "at-ue-ams-services-text", riskLevel: "high" },
  { key: "at-ue-ams-instance-fetch-live", category: "institution", type: "procedure", text: "Die genaue örtliche AMS-Geschäftsstelle ist live zu bestimmen und nicht ohne Frische festzuschreiben.", sourceKey: "at-ue-ams-locator", passageKey: "at-ue-ams-locator-text", riskLevel: "medium", requiresAuthorityResolution: true },
  { key: "at-ue-channel-fetch-live", category: "channel", type: "procedure", text: "Aktuelle AMS-Formulare, MeinAMS-Zugänge und Kontakte sind live zu prüfen.", sourceKey: "at-ue-ams-locator", passageKey: "at-ue-ams-locator-text", riskLevel: "medium" },
  { key: "at-ue-arbeitslosengeld-scope", category: "scope", type: "definition", text: "Dieser Pack umfasst die operative Routung von Arbeitslosengeld und Notstandshilfe im Koordinierungskontext, nicht vollständige nationale Leistungsberechnung.", sourceKey: "at-ue-ams-services", passageKey: "at-ue-ams-services-text", riskLevel: "high" },
  { key: "at-ue-notstandshilfe-unemployment-cash", category: "scope", type: "definition", text: "Notstandshilfe ist eine bedarfsorientierte Arbeitslosen-Geldleistung nach erschöpftem Arbeitslosengeld und gehört zum Arbeitslosen-Koordinierungskontext.", sourceKey: "at-ue-ams-services", passageKey: "at-ue-ams-services-text", riskLevel: "high" },
  { key: "at-ue-notstandshilfe-not-full-calculator", category: "scope", type: "boundary", text: "Notstandshilfe wird hier als Arbeitslosen-Geldleistung klassifiziert und geroutet, aber nicht als vollständiger individueller Leistungsrechner behandelt.", sourceKey: "at-ue-ams-services", passageKey: "at-ue-ams-services-text", riskLevel: "high" },
  { key: "at-ue-alvg-3-voluntary-se", category: "self-employed", type: "definition", text: "Art. 1 § 3 AlVG ist der gesetzliche Weg der freiwilligen Einbeziehung selbständig Erwerbstätiger in die österreichische Arbeitslosenversicherung, sofern keine Pflichtpensionsversicherung besteht.", sourceKey: "at-ue-alvg-ris", passageKey: "at-ue-alvg-ris-text", riskLevel: "high" },
  { key: "at-ue-alvg-3-not-automatic", category: "self-employed", type: "exception", text: "Selbständige Tätigkeit in Österreich begründet nicht automatisch Arbeitslosenversicherung nach Art. 1 § 3 AlVG.", sourceKey: "at-ue-alvg-ris", passageKey: "at-ue-alvg-ris-text", riskLevel: "high" },
  { key: "at-ue-alvg-3-six-month-entry", category: "self-employed", type: "procedure", text: "Der Eintritt in die Arbeitslosenversicherung nach Art. 1 § 3 AlVG muss innerhalb von sechs Monaten ab SVS-Verständigung erklärt werden; bei Mitteilung binnen drei Monaten kann die Einbeziehung rückwirkend greifen.", sourceKey: "at-ue-alvg-ris", passageKey: "at-ue-alvg-ris-text", riskLevel: "high" },
  { key: "at-ue-alvg-3-svs-notification", category: "self-employed", type: "procedure", text: "Die SVS weist auf Frist, Bindungsdauer und Wahlmöglichkeit der Beitragsgrundlage hin; ohne tatsächliche Einbeziehung bleibt die Person nicht versichert.", sourceKey: "at-ue-svs-alvg3", passageKey: "at-ue-svs-alvg3-text", riskLevel: "high" },
  { key: "at-ue-svs-voluntary-insurance-role", category: "institution", type: "definition", text: "Die SVS verwaltet den Versicherungsweg nach Art. 1 § 3 AlVG für qualifizierte Selbständige, nicht die ordentliche Auszahlung von Arbeitslosengeld.", sourceKey: "at-ue-svs-alvg3", passageKey: "at-ue-svs-alvg3-text", riskLevel: "high" },
  { key: "at-ue-svs-not-ordinary-payer", category: "institution", type: "exception", text: "Die SVS ist nicht der ordentliche Zahlungsträger von Arbeitslosengeld oder Notstandshilfe; das AMS bleibt Leistungs- und Ausfuhrbehörde.", sourceKey: "at-ue-svs-alvg3", passageKey: "at-ue-svs-alvg3-text", riskLevel: "high" },
  { key: "at-ue-svs-not-u1-issuer", category: "institution", type: "exception", text: "Die SVS stellt das PD U1 für die Arbeitslosenkoordinierung nicht aus.", sourceKey: "at-ue-svs-alvg3", passageKey: "at-ue-svs-alvg3-text", riskLevel: "high" },
  { key: "at-ue-finanzamt-not-u1", category: "institution", type: "exception", text: "Das Finanzamt stellt das PD U1 für die Arbeitslosenkoordinierung nicht aus.", sourceKey: "at-ue-svs-alvg3", passageKey: "at-ue-svs-alvg3-text", riskLevel: "high" },
  { key: "at-ue-meinams-personal-route", category: "channel", type: "procedure", text: "MeinAMS ist der aktuelle persönliche elektronische Servicekanal für viele AMS-Verfahren einschließlich Arbeitslosmeldung und Leistungsanträge.", sourceKey: "at-ue-oesterreich-gv", passageKey: "at-ue-oesterreich-gv-text", riskLevel: "high" },
  { key: "at-ue-meinams-not-entitlement", category: "channel", type: "exception", text: "Die Nutzung von MeinAMS begründet keinen automatischen Arbeitslosengeldanspruch.", sourceKey: "at-ue-oesterreich-gv", passageKey: "at-ue-oesterreich-gv-text", riskLevel: "high" },
  { key: "at-ue-u1-employee", category: "u1", type: "procedure", text: "Das AMS stellt PD U1 für abhängige Beschäftigungszeiten aus, soweit Arbeitslosenversicherung bestand.", sourceKey: "at-ue-ams-services", passageKey: "at-ue-ams-services-text", riskLevel: "high" },
  { key: "at-ue-u1-self-employed", category: "u1", type: "procedure", text: "Das österreichische PD U1 kann selbständige Zeiten nach Art. 1 § 3 AlVG erfassen, soweit Versicherung nachgewiesen ist.", sourceKey: "at-ue-alvg-ris", passageKey: "at-ue-alvg-ris-text", riskLevel: "high" },
  { key: "at-ue-u1-not-award", category: "u1", type: "exception", text: "PD U1 ist nicht die Bewilligung von Arbeitslosengeld oder Notstandshilfe.", sourceKey: "at-ue-ams-services", passageKey: "at-ue-ams-services-text", riskLevel: "high" },
  { key: "at-ue-u2-before-departure", category: "u2", type: "procedure", text: "Der Antrag auf PD U2 für die Ausfuhr österreichischen Arbeitslosengeldes ist vor der Abreise beim AMS zu stellen.", sourceKey: "at-ue-ams-services", passageKey: "at-ue-ams-services-text", riskLevel: "high" },
  { key: "at-ue-u2-three-month-operational", category: "u2", type: "definition", text: "Die derzeitige operative AMS-Ausfuhrpraxis für Arbeitslosengeld entspricht dem dreimonatigen unionsrechtlichen Standard nach Artikel 64, vorbehaltlich zulässiger Verlängerung.", sourceKey: "at-ue-ams-services", passageKey: "at-ue-ams-services-text", riskLevel: "high" },
  { key: "at-ue-u2-four-weeks", category: "u2", type: "definition", text: "Vor der Ausfuhr besteht regelmäßig eine vierwöchige Verfügbarkeit in Österreich, soweit nicht eine verkürzte Abreise zugelassen ist.", sourceKey: "at-ue-ams-services", passageKey: "at-ue-ams-services-text", riskLevel: "high" },
  { key: "at-ue-u2-authorized-shortening", category: "u2", type: "exception", text: "Die Vier-Wochen-Frist vor der Ausreise kann zugelassen verkürzt werden; sie ist keine absolute Sperre ohne Prüfung.", sourceKey: "at-ue-ams-services", passageKey: "at-ue-ams-services-text", riskLevel: "high" },
  { key: "at-ue-incoming-foreign-u2", category: "u2", type: "procedure", text: "Wer mit ausländischem PD U2 in Österreich Arbeit sucht, registriert sich beim AMS innerhalb der im PD U2 genannten Frist. Das begründet kein österreichisches Arbeitslosengeld.", sourceKey: "at-ue-ams-services", passageKey: "at-ue-ams-services-text", riskLevel: "high" },
  { key: "at-ue-foreign-u2-not-alg", category: "u2", type: "exception", text: "Eingehendes ausländisches PD U2 ist nicht österreichisches Arbeitslosengeld.", sourceKey: "at-ue-ams-services", passageKey: "at-ue-ams-services-text", riskLevel: "high" },
  { key: "at-ue-application-not-approval", category: "procedure", type: "exception", text: "Arbeitslosmeldung, MeinAMS-Antrag oder PD-Antrag ist nicht bereits bewilligter Anspruch.", sourceKey: "at-ue-oesterreich-gv", passageKey: "at-ue-oesterreich-gv-text", riskLevel: "high" },
  { key: "at-ue-art9-2025-se-coverage-possible", category: "article65a", type: "definition", text: "Nach der österreichischen Artikel-9-Erklärung 2025 bietet österreichisches Recht Selbständigen eine Einbeziehung in das Arbeitslosensystem über Art. 1 § 3 AlVG. Österreich ist kein Wohnstaat ohne Selbständigen-Arbeitslosensystem.", sourceKey: "at-ue-art9-2025", passageKey: "at-ue-art9-2025-text", riskLevel: "high" },
  { key: "at-ue-art9-not-eternal-false", category: "article65a", type: "procedure", text: "Die Feststellung zur Selbständigen-Deckungsmöglichkeit ist CACHE_AND_REVALIDATE und nicht als zeitloses Nein zu Artikel 65a festzuschreiben.", sourceKey: "at-ue-art9-2025", passageKey: "at-ue-art9-2025-text", riskLevel: "high" },
  { key: "at-ue-system-coverage-not-person-insured", category: "article65a", type: "exception", text: "Die systemische Möglichkeit nach Art. 1 § 3 AlVG bedeutet nicht, dass die einzelne Person tatsächlich versichert war.", sourceKey: "at-ue-art9-2025", passageKey: "at-ue-art9-2025-text", riskLevel: "high" },
  { key: "at-ue-2026-minor-work-boundary", category: "availability", type: "definition", text: "Für Verfügbarkeit gelten die aktuellen österreichischen Wochenstundengrenzen, regelmäßig mindestens 20 Stunden, mit besonderen Regeln bei Betreuungspflichten. Dies ist die 2026-Grenze für Arbeitslosigkeitsstatus, nicht slowakische UoZ-Logik.", sourceKey: "at-ue-ams-services", passageKey: "at-ue-ams-services-text", riskLevel: "high" },
  { key: "at-ue-minor-work-not-sk-rule", category: "availability", type: "boundary", text: "Die österreichische Verfügbarkeits- und Nebentätigkeitsgrenze ist nationales Recht und nicht auf die slowakische UoZ-Prüfung zu übertragen.", sourceKey: "at-ue-ams-services", passageKey: "at-ue-ams-services-text", riskLevel: "high" },
  { key: "at-ue-waiting-period-gate", category: "entitlement", type: "definition", text: "Arbeitslosengeld verlangt eine anwartschaftsbegründende Versicherungszeit nach AlVG, etwa 52 Wochen bei Erstbezug oder 28 Wochen bei Wiederbezug; dieses Routing berechnet die Anwartschaft nicht im Detail.", sourceKey: "at-ue-ams-services", passageKey: "at-ue-ams-services-text", riskLevel: "high" },
  { key: "at-ue-amount-not-calculator", category: "calculation", type: "boundary", text: "Dieses Routing berechnet keine individuelle Arbeitslosengeld- oder Notstandshilfehöhe.", sourceKey: "at-ue-alvg-ris", passageKey: "at-ue-alvg-ris-text", riskLevel: "high" },
  { key: "at-ue-activity-change-reeval", category: "mixed", type: "procedure", text: "Wechsel von Beschäftigung zu Selbständigkeit oder umgekehrt erfordert neue Prüfung von Versicherung, Art. 1 § 3 AlVG-Fristen und späteren U1-Nachweisen.", sourceKey: "at-ue-alvg-ris", passageKey: "at-ue-alvg-ris-text", riskLevel: "high" },
  { key: "at-ue-dormant-gewerbe-not-activity", category: "mixed", type: "exception", text: "Ein ruhendes Gewerbe belegt weder aktive Selbständigkeit noch deren Ende.", sourceKey: "at-ue-alvg-ris", passageKey: "at-ue-alvg-ris-text", riskLevel: "high" },
  { key: "at-ue-business-failure-not-alg", category: "mixed", type: "exception", text: "Geschäftsaufgabe oder Betriebsschließung ist nicht automatisch Arbeitslosengeld.", sourceKey: "at-ue-alvg-ris", passageKey: "at-ue-alvg-ris-text", riskLevel: "high" },
  { key: "at-ue-director-status-unclear", category: "mixed", type: "procedure", text: "Geschäftsführer, Gesellschafter oder Unternehmensinhaber sind nicht automatisch Arbeitnehmer oder Selbständige im Sinne von Art. 1 § 3 AlVG. Unklarer Status bleibt unbeantwortet.", sourceKey: "at-ue-alvg-ris", passageKey: "at-ue-alvg-ris-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "at-ue-not-health-insurer", category: "boundary", type: "exception", text: "Krankenversicherungsträger sind nicht der ordentliche Arbeitslosengeldträger.", sourceKey: "at-ue-ams-locator", passageKey: "at-ue-ams-locator-text", riskLevel: "high" },
  { key: "at-ue-not-family-benefit", category: "boundary", type: "exception", text: "Familienbeihilfe oder andere Familienleistungen sind nicht Arbeitslosengeld oder Notstandshilfe.", sourceKey: "at-ue-ams-services", passageKey: "at-ue-ams-services-text", riskLevel: "high" },
  { key: "at-ue-side-income-boundary", category: "calculation", type: "boundary", text: "Nebeneinkommen während des Arbeitslosengeldes kann die Leistung beeinflussen. Dieses Routing berechnet keine Nebenverdienstformel.", sourceKey: "at-ue-ams-services", passageKey: "at-ue-ams-services-text", riskLevel: "high" },
]);

type ProcessSpec = Readonly<{
  key: string;
  title: string;
  trigger: string;
  safeFirstStep: string;
  riskLevel: "medium" | "high";
  dimensions: Readonly<Record<(typeof PROCESS_COMPLETE_DIMENSIONS)[number], string>>;
}>;

export const AT_UE_PROCESSES: readonly ProcessSpec[] = Object.freeze([
  { key: "at-ue-route-classify", title: "Österreichischen Arbeitslosenweg 2026 einordnen", trigger: "Arbeitslosigkeit mit Auslandsbezug, Träger unbekannt", safeFirstStep: "AMS von SVS, Finanzamt und Krankenkasse trennen; EU-Artikel nicht kopieren.", riskLevel: "high", dimensions: { what: "at-ue-ams-role", whoWhen: "at-ue-ams-instance-fetch-live", documents: "at-ue-channel-fetch-live", how: "at-ue-arbeitslosengeld-scope", next: "at-ue-application-not-approval", deadlines: "at-ue-application-not-approval", problems: "at-ue-does-not-determine-art-11", dutiesAfter: "at-ue-activity-change-reeval", institution: "at-ue-ams-role", boundaries: "at-ue-does-not-copy-eu-law", freshness: "at-ue-channel-fetch-live", negatives: "at-ue-finanzamt-not-u1" } },
  { key: AT_UE_PRIMARY_PROCESS_KEY, title: "Grenzüberschreitenden Arbeitslosengeldweg 2026 führen", trigger: "Arbeitslosigkeit mit Wohnsitz, Tätigkeit oder Versicherung im Ausland", safeFirstStep: "AMS live bestimmen; ausländische Zeiten über U1 oder Trägeraustausch führen.", riskLevel: "high", dimensions: { what: "at-ue-ams-role", whoWhen: "at-ue-ams-instance-fetch-live", documents: "at-ue-channel-fetch-live", how: "at-ue-u1-employee", next: "at-ue-application-not-approval", deadlines: "at-ue-application-not-approval", problems: "at-ue-u1-not-award", dutiesAfter: "at-ue-activity-change-reeval", institution: "at-ue-ams-role", boundaries: "at-ue-does-not-copy-eu-law", freshness: "at-ue-ams-instance-fetch-live", negatives: "at-ue-u1-not-award" } },
  { key: "at-ue-alvg3-coverage-verify", title: "Art. 1 § 3 AlVG-Deckung 2026 prüfen", trigger: "Selbständige Person in Österreich verlangt Arbeitslosenversicherung oder Arbeitslosengeld", safeFirstStep: "SVS-Verständigung und Frist prüfen; Gewerbe nicht als Deckung setzen.", riskLevel: "high", dimensions: { what: "at-ue-alvg-3-voluntary-se", whoWhen: "at-ue-svs-voluntary-insurance-role", documents: "at-ue-alvg-3-svs-notification", how: "at-ue-alvg-3-six-month-entry", next: "at-ue-alvg-3-not-automatic", deadlines: "at-ue-alvg-3-six-month-entry", problems: "at-ue-alvg-3-not-automatic", dutiesAfter: "at-ue-activity-change-reeval", institution: "at-ue-svs-voluntary-insurance-role", boundaries: "at-ue-alvg-3-not-automatic", freshness: "at-ue-channel-fetch-live", negatives: "at-ue-svs-not-ordinary-payer" } },
  { key: "at-ue-former-self-employed-alg", title: "Frühere Selbständigkeit in österreichisches ALG 2026", trigger: "Ehemalige selbständige Person mit möglichen Art.-1-§-3-Zeiten verlangt Arbeitslosengeld", safeFirstStep: "Tatsächliche Deckung und Tätigkeitsende trennen; Geschäftsaufgabe nicht als Automatikanspruch setzen.", riskLevel: "high", dimensions: { what: "at-ue-alvg-3-voluntary-se", whoWhen: "at-ue-alvg-3-svs-notification", documents: "at-ue-channel-fetch-live", how: "at-ue-waiting-period-gate", next: "at-ue-application-not-approval", deadlines: "at-ue-alvg-3-six-month-entry", problems: "at-ue-amount-not-calculator", dutiesAfter: "at-ue-activity-change-reeval", institution: "at-ue-ams-role", boundaries: "at-ue-business-failure-not-alg", freshness: "at-ue-channel-fetch-live", negatives: "at-ue-business-failure-not-alg" } },
  { key: "at-ue-u1-issue", title: "Österreichisches PD U1 2026 ausstellen lassen", trigger: "Österreichische Versicherungs- oder Beschäftigungszeiten sollen im anderen Staat nachgewiesen werden", safeFirstStep: "An das AMS verweisen; SVS und Finanzamt nicht als Aussteller nennen.", riskLevel: "high", dimensions: { what: "at-ue-u1-employee", whoWhen: "at-ue-u1-self-employed", documents: "at-ue-channel-fetch-live", how: "at-ue-u1-self-employed", next: "at-ue-application-not-approval", deadlines: "at-ue-application-not-approval", problems: "at-ue-u1-not-award", dutiesAfter: "at-ue-activity-change-reeval", institution: "at-ue-ams-role", boundaries: "at-ue-does-not-copy-eu-law", freshness: "at-ue-ams-instance-fetch-live", negatives: "at-ue-svs-not-u1-issuer" } },
  { key: "at-ue-foreign-u1-into-claim", title: "Ausländisches PD U1 in österreichischen Anspruch 2026", trigger: "Ausländische EU-Zeiten sollen in einen österreichischen ALG-Anspruch eingehen", safeFirstStep: "U1 als Zeitennachweis führen, nicht als Bewilligung.", riskLevel: "high", dimensions: { what: "at-ue-u1-not-award", whoWhen: "at-ue-ams-role", documents: "at-ue-channel-fetch-live", how: "at-ue-u1-employee", next: "at-ue-application-not-approval", deadlines: "at-ue-application-not-approval", problems: "at-ue-does-not-determine-art-11", dutiesAfter: "at-ue-activity-change-reeval", institution: "at-ue-ams-role", boundaries: "at-ue-does-not-copy-eu-law", freshness: "at-ue-channel-fetch-live", negatives: "at-ue-u1-not-award" } },
  { key: "at-ue-u2-export-sk", title: "Österreichisches ALG mit PD U2 in die Slowakei 2026", trigger: "ALG-Beziehende Person will in der Slowakei Arbeit suchen", safeFirstStep: "Vor Abreise U2 beim AMS beantragen; dreimonatige Ausfuhr und Vier-Wochen-Regel erklären.", riskLevel: "high", dimensions: { what: "at-ue-u2-before-departure", whoWhen: "at-ue-u2-four-weeks", documents: "at-ue-channel-fetch-live", how: "at-ue-u2-authorized-shortening", next: "at-ue-u2-three-month-operational", deadlines: "at-ue-u2-before-departure", problems: "at-ue-u2-four-weeks", dutiesAfter: "at-ue-activity-change-reeval", institution: "at-ue-ams-role", boundaries: "at-ue-does-not-copy-eu-law", freshness: "at-ue-ams-instance-fetch-live", negatives: "at-ue-foreign-u2-not-alg" } },
  { key: "at-ue-incoming-sk-u2", title: "Eingehendes slowakisches PD U2 in Österreich 2026", trigger: "Person mit slowakischem U2 registriert sich beim AMS", safeFirstStep: "Als Zielstaatsregistrierung führen, nicht als neuen ALG-Antrag.", riskLevel: "high", dimensions: { what: "at-ue-incoming-foreign-u2", whoWhen: "at-ue-ams-role", documents: "at-ue-channel-fetch-live", how: "at-ue-incoming-foreign-u2", next: "at-ue-application-not-approval", deadlines: "at-ue-application-not-approval", problems: "at-ue-foreign-u2-not-alg", dutiesAfter: "at-ue-activity-change-reeval", institution: "at-ue-ams-role", boundaries: "at-ue-arbeitslosengeld-scope", freshness: "at-ue-ams-instance-fetch-live", negatives: "at-ue-u1-not-award" } },
  { key: "at-ue-frontier-employee", title: "Österreichischen Grenzgänger-Arbeitnehmerweg 2026", trigger: "Wohnsitz SK oder AT, letzte abhängige Tätigkeit im anderen Staat", safeFirstStep: "Grenzarbeitnehmerstatus nicht aus Staatsangehörigkeit ableiten.", riskLevel: "high", dimensions: { what: "at-ue-ams-role", whoWhen: "at-ue-does-not-copy-eu-law", documents: "at-ue-channel-fetch-live", how: "at-ue-u1-employee", next: "at-ue-application-not-approval", deadlines: "at-ue-application-not-approval", problems: "at-ue-does-not-determine-art-11", dutiesAfter: "at-ue-activity-change-reeval", institution: "at-ue-ams-role", boundaries: "at-ue-does-not-copy-eu-law", freshness: "at-ue-channel-fetch-live", negatives: "at-ue-does-not-determine-art-11" } },
  { key: "at-ue-frontier-self-employed", title: "Österreichischen selbständigen Grenzgängerweg 2026", trigger: "Letzte Selbständigkeit AT oder SK, Wohnsitz im anderen Staat", safeFirstStep: "Artikel 65 zuerst; österreichische Artikel-9-Erklärung 2025 revalidieren.", riskLevel: "high", dimensions: { what: "at-ue-art9-2025-se-coverage-possible", whoWhen: "at-ue-system-coverage-not-person-insured", documents: "at-ue-alvg-3-svs-notification", how: "at-ue-art9-not-eternal-false", next: "at-ue-alvg-3-not-automatic", deadlines: "at-ue-alvg-3-six-month-entry", problems: "at-ue-alvg-3-not-automatic", dutiesAfter: "at-ue-activity-change-reeval", institution: "at-ue-ams-role", boundaries: "at-ue-does-not-copy-eu-law", freshness: "at-ue-art9-not-eternal-false", negatives: "at-ue-system-coverage-not-person-insured" } },
  { key: "at-ue-notstandshilfe-route", title: "Notstandshilfe 2026 routen", trigger: "Arbeitslosengeld erschöpft oder Notstandshilfe verlangt", safeFirstStep: "Als Arbeitslosen-Geldleistung klassifizieren, nicht als vollständigen Rechner.", riskLevel: "high", dimensions: { what: "at-ue-notstandshilfe-unemployment-cash", whoWhen: "at-ue-notstandshilfe-not-full-calculator", documents: "at-ue-channel-fetch-live", how: "at-ue-ams-role", next: "at-ue-application-not-approval", deadlines: "at-ue-application-not-approval", problems: "at-ue-amount-not-calculator", dutiesAfter: "at-ue-activity-change-reeval", institution: "at-ue-ams-role", boundaries: "at-ue-notstandshilfe-not-full-calculator", freshness: "at-ue-channel-fetch-live", negatives: "at-ue-amount-not-calculator" } },
  { key: "at-ue-meinams-route", title: "MeinAMS persönlichen Weg 2026", trigger: "Elektronische Arbeitslosmeldung oder Leistungsantrag", safeFirstStep: "Kanal live prüfen; Antrag nicht als Genehmigung setzen.", riskLevel: "high", dimensions: { what: "at-ue-meinams-personal-route", whoWhen: "at-ue-ams-instance-fetch-live", documents: "at-ue-channel-fetch-live", how: "at-ue-meinams-personal-route", next: "at-ue-application-not-approval", deadlines: "at-ue-application-not-approval", problems: "at-ue-meinams-not-entitlement", dutiesAfter: "at-ue-activity-change-reeval", institution: "at-ue-ams-role", boundaries: "at-ue-arbeitslosengeld-scope", freshness: "at-ue-channel-fetch-live", negatives: "at-ue-meinams-not-entitlement" } },
  { key: "at-ue-minor-work-availability", title: "Verfügbarkeit und Nebentätigkeit 2026", trigger: "Teilzeit, Betreuung oder Nebentätigkeit während Arbeitslosigkeit", safeFirstStep: "Österreichische 20-Stunden-Grenze erklären; nicht auf SK UoZ übertragen.", riskLevel: "high", dimensions: { what: "at-ue-2026-minor-work-boundary", whoWhen: "at-ue-minor-work-not-sk-rule", documents: "at-ue-channel-fetch-live", how: "at-ue-side-income-boundary", next: "at-ue-application-not-approval", deadlines: "at-ue-application-not-approval", problems: "at-ue-minor-work-not-sk-rule", dutiesAfter: "at-ue-activity-change-reeval", institution: "at-ue-ams-role", boundaries: "at-ue-amount-not-calculator", freshness: "at-ue-channel-fetch-live", negatives: "at-ue-side-income-boundary" } },
  { key: "at-ue-activity-change", title: "Tätigkeitswechsel 2026 neu bewerten", trigger: "Beschäftigung endet und Selbständigkeit beginnt oder umgekehrt", safeFirstStep: "Art. 1 § 3 AlVG-Frist und ruhendes Gewerbe prüfen.", riskLevel: "high", dimensions: { what: "at-ue-activity-change-reeval", whoWhen: "at-ue-director-status-unclear", documents: "at-ue-alvg-3-svs-notification", how: "at-ue-dormant-gewerbe-not-activity", next: "at-ue-alvg-3-six-month-entry", deadlines: "at-ue-alvg-3-six-month-entry", problems: "at-ue-director-status-unclear", dutiesAfter: "at-ue-activity-change-reeval", institution: "at-ue-ams-role", boundaries: "at-ue-does-not-determine-art-11", freshness: "at-ue-channel-fetch-live", negatives: "at-ue-business-failure-not-alg" } },
  { key: "at-ue-authority-split", title: "AMS und SVS 2026 trennen", trigger: "SVS, Finanzamt oder Krankenkasse werden als ALG-Träger angeboten", safeFirstStep: "AMS als Leistungsträger; SVS nur für Art. 1 § 3 AlVG.", riskLevel: "high", dimensions: { what: "at-ue-ams-role", whoWhen: "at-ue-svs-not-ordinary-payer", documents: "at-ue-channel-fetch-live", how: "at-ue-svs-voluntary-insurance-role", next: "at-ue-svs-not-u1-issuer", deadlines: "at-ue-application-not-approval", problems: "at-ue-finanzamt-not-u1", dutiesAfter: "at-ue-activity-change-reeval", institution: "at-ue-ams-role", boundaries: "at-ue-not-health-insurer", freshness: "at-ue-ams-instance-fetch-live", negatives: "at-ue-svs-not-u1-issuer" } },
]);

export const AT_UE_NEGATIVE_CONTROLS = Object.freeze([
  "at-ue-alvg-3-not-automatic",
  "at-ue-svs-not-ordinary-payer",
  "at-ue-svs-not-u1-issuer",
  "at-ue-finanzamt-not-u1",
  "at-ue-u1-not-award",
  "at-ue-foreign-u2-not-alg",
  "at-ue-meinams-not-entitlement",
  "at-ue-system-coverage-not-person-insured",
  "at-ue-business-failure-not-alg",
  "at-ue-minor-work-not-sk-rule",
  "at-ue-notstandshilfe-not-full-calculator",
  "at-ue-does-not-copy-eu-law",
  "at-ue-does-not-determine-art-11",
]);

export function evaluateAtUnemploymentProcessCompleteness() {
  const incomplete = AT_UE_PROCESSES.filter((process) => (
    PROCESS_COMPLETE_DIMENSIONS.some((dimension) => !process.dimensions[dimension])
  ));
  const keys = new Set(AT_UE_UNITS.map((unit) => unit.key));
  const missing = AT_UE_PROCESSES.flatMap((process) => (
    PROCESS_COMPLETE_DIMENSIONS
      .map((dimension) => process.dimensions[dimension])
      .filter((key) => !keys.has(key))
      .map((key) => `${process.key}:${key}`)
  ));
  const processComplete = incomplete.length === 0 && missing.length === 0;
  return Object.freeze({
    processCount: AT_UE_PROCESSES.length,
    processComplete,
    processCompletenessPercent: processComplete ? 100 : 0,
    incompleteProcessKeys: incomplete.map((process) => process.key),
    missingClaims: missing,
  });
}

const PUBLISHERS = Object.freeze([
  { key: "ris-ue", name: "Republik Österreich – Rechtsinformationssystem", portal: "https://www.ris.bka.gv.at/", identity: "AT_RIS_UE" },
  { key: "ams-ue", name: "Arbeitsmarktservice Österreich", portal: "https://www.ams.at/", identity: "AT_AMS" },
  { key: "oesterreich-gv-ue", name: "oesterreich.gv.at", portal: "https://www.oesterreich.gv.at/", identity: "AT_OESTERREICH_GV_UE" },
  { key: "svs-ue", name: "Sozialversicherung der Selbständigen", portal: "https://www.svs.at/", identity: "AT_SVS_UE" },
]);

export function buildAtUnemploymentCoordinationRoutingPack() {
  const trustDomain = item("trustDomain", "at", { code: AT_NATIONAL_TRUST_DOMAIN, name: "Österreich" });
  const jurisdiction = item("jurisdictions", "at", {
    level: AT_NATIONAL_JURISDICTION_LEVEL,
    code: AT_NATIONAL_COUNTRY_CODE,
    countryCode: AT_NATIONAL_COUNTRY_CODE,
    name: "Republik Österreich",
  });
  const scope = item("territorialScopes", "at", {
    type: "at_national", jurisdictionIds: [jurisdiction.id], landCodes: [], kreisCodes: [], municipalityCodes: [],
  });
  const publishers = Object.fromEntries(PUBLISHERS.map((spec) => [spec.key, item("publishers", spec.key, {
    name: spec.name, type: "national_ministry",
    territorialScopeId: scope.id, trustDomainId: trustDomain.id,
  })]));
  const authorities = Object.fromEntries(PUBLISHERS.map((spec) => [spec.key, item("authorities", spec.identity + ":" + spec.key, {
    publisherId: publishers[spec.key].id, name: spec.name, type: "national_ministry",
    jurisdictionId: jurisdiction.id, territorialScopeId: scope.id, officialPortalUrl: spec.portal,
  })]));
  const sources = AT_UE_OFFICIAL_SOURCES.map((spec) => {
    const source = item("sources", spec.key, {
      publisherId: publishers[spec.publisherKey].id,
      authorityId: authorities[spec.publisherKey].id,
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      sourceType: "official_guidance", purpose: spec.title, canonicalUrl: spec.url,
      officialDomain: spec.officialDomain, normalizedOrigin: `https://${spec.officialDomain}`,
      sourceClass: spec.sourceClass, authorityLevel: "SPECIFIC_AUTHORITY",
      retrievalMethod: "HTML_DOCUMENT", handlingMode: spec.handlingMode,
      freshnessClass: spec.freshnessClass, staleBehavior: spec.staleBehavior,
      supportsClaimTypes: ["definition", "exception", "procedure", "boundary"],
      highRiskUseAllowed: false, publicationIdentifier: spec.title,
    });
    const version = item("sourceVersions", `${spec.key}:v1`, {
      sourceId: source.id, versionSequence: 1,
      contentHash: HASH(spec.passages.map((passage) => passage.text).join("\n")),
      effectiveDate: AT_UE_AS_OF,
    });
    const passages = spec.passages.map((passage, order) => item("passages", passage.key, {
      sourceVersionId: version.id, order, headingPath: [spec.title],
      locator: passage.locator, text: passage.text, textHash: HASH(passage.text),
    }));
    const policy = item("handlingPolicies", `${spec.key}:policy`, {
      sourceId: source.id, informationClass: spec.informationClass, handlingMode: spec.handlingMode,
      freshnessClass: spec.freshnessClass, staleBehavior: spec.staleBehavior,
      requiredContextKeys: spec.handlingMode === "FETCH_LIVE" ? ["COUNTRY"] : ["PROCESS_VARIANT"],
      riskClass: "MEDIUM",
    });
    const freshness = item("freshnessRecords", `${spec.key}:freshness`, {
      entityType: "source", entityId: source.id, status: "fresh", effectiveDateKnown: true,
    });
    return { spec, source, version, passages, policy, freshness };
  });
  const passageByKey = new Map(sources.flatMap(({ passages }) => passages.map((passage) => [passage.key, passage])));
  const sourceByKey = new Map(sources.map((entry) => [entry.spec.key, entry]));
  const claims = AT_UE_UNITS.map((unit) => {
    const source = sourceByKey.get(unit.sourceKey);
    const passage = passageByKey.get(unit.passageKey);
    if (!source || !passage) throw new Error(`AT_UE_UNIT_SOURCE_MISSING:${unit.key}`);
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
  const processes = AT_UE_PROCESSES.map((spec) => item("processes", spec.key, {
    processGroupId: AT_UE_ROUTING_PROCESS_GROUP, title: spec.title, jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id, riskLevel: spec.riskLevel, trigger: spec.trigger,
    safeFirstStep: spec.safeFirstStep, regionalVariationExpected: false,
  }));
  const processByKey = new Map(processes.map((process) => [String(process.key), process]));
  const claimByKey = new Map(claims.map(({ claim }) => [String(claim.key), claim]));
  const processClaimLinks: Entity[] = [];
  const seen = new Set<string>();
  for (const process of AT_UE_PROCESSES) {
    for (const dimension of PROCESS_COMPLETE_DIMENSIONS) {
      const claimKey = process.dimensions[dimension];
      const token = `${process.key}:${claimKey}:${dimension}`;
      if (seen.has(token)) continue;
      const stored = processByKey.get(process.key);
      const claim = claimByKey.get(claimKey);
      if (!stored || !claim) throw new Error(`AT_UE_PROCESS_CLAIM_MISSING:${process.key}:${claimKey}`);
      seen.add(token);
      processClaimLinks.push(item("processClaimLinks", token, {
        processId: stored.id, claimId: claim.id, role: dimension, required: true,
        sequenceContext: dimension, qualificationRequired: false,
      }));
    }
  }
  return Object.freeze({
    schemaVersion: 1,
    packId: AT_UE_ROUTING_PACK_ID,
    canonicalLanguage: "de" as const,
    countryCode: AT_NATIONAL_COUNTRY_CODE,
    trustDomain,
    jurisdictions: [jurisdiction],
    territorialScopes: [scope],
    publishers: Object.values(publishers),
    authorities: Object.values(authorities),
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
