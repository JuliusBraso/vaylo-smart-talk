/**
 * AT-SK-0D Austrian operational routing for applicable legislation / PD A1.
 * Does not restate Regulation 883/2004 Articles 11–16. EU core owns legal merits.
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
    id: stableKnowledgeFactoryId(AT_AL_ROUTING_PACK_ID, entityClass, key),
    ...values,
  });
}

export const AT_AL_ROUTING_PACK_ID = "at_applicable_legislation_routing" as const;
export const AT_AL_ROUTING_PROCESS_GROUP = "at_applicable_legislation_routing" as const;
export const AT_AL_PRIMARY_PROCESS_KEY = "at-carrier-resolve" as const;
export const AT_AL_AS_OF = "2026-09-03" as const;

export const AT_AL_OFFICIAL_SOURCES = Object.freeze([
  {
    key: "at-oegk-forms",
    publisherKey: "oegk" as const,
    officialDomain: "www.oegk.at",
    url: "https://www.oegk.at/cdscontent/?contentid=10007.904892&portal=oegkdgportal",
    title: "ÖGK: Formulare zwischenstaatliche Anträge E1–E4, Stand 01.08.2026",
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshnessClass: "EVENT_DRIVEN" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "PROCESS_IDENTITY" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-oegk-forms-text",
      locator: "E1 E2 E3 E4 / ELDA",
      text: "Anträge für Entsendungen bzw. Beschäftigungen in mehreren Staaten können mittels ELDA angefordert werden. Amtliche Formkategorien sind E1 Entsendung eines Arbeitnehmers in einen anderen Staat, E2 Beschäftigung für einen Arbeitgeber in mehreren Staaten, E3 Beschäftigung für mehrere Arbeitgeber in mehreren Staaten und E4 selbständige und unselbständige Tätigkeit in verschiedenen Staaten. Papierformulare sind nur in Ausnahmefällen, etwa ohne ELDA-Zugang, vorgesehen. Formbezeichnungen sind operative Routing-Metadaten und nicht ewig.",
    }],
  },
  {
    key: "at-oegk-decisions",
    publisherKey: "oegk" as const,
    officialDomain: "www.oegk.at",
    url: "https://www.oegk.at/cdscontent/?contentid=10007.906273&portal=oegkdgportal",
    title: "ÖGK: Zwischenstaatliche Anträge, Entscheidung und ausländische A1",
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshnessClass: "EVENT_DRIVEN" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "AUTHORITY_COMPETENCE" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-oegk-decisions-text",
      locator: "Österreichische oder ausländische Rechtsvorschriften",
      text: "Bei Festlegung der österreichischen Rechtsvorschriften erfolgt eine Ausstellung der Bescheinigung PD A1. Bei Festlegung von ausländischen Rechtsvorschriften erfolgt ein Informationsschreiben; der ausländische Sozialversicherungsträger stellt PD A1 aus. Ein österreichischer Antrag ist nicht automatisch ein österreichisches A1-Ergebnis. ELDA ist der elektronische Datenaustauschkanal, nicht die zuständige Rechtsbehörde.",
    }],
  },
  {
    key: "at-svs-entsendung",
    publisherKey: "svs" as const,
    officialDomain: "www.svs.at",
    url: "https://www.svs.at/cdscontent/?contentid=10007.816700",
    title: "SVS: Entsendung selbständig tätiger Personen, PD A1",
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshnessClass: "EVENT_DRIVEN" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "PROCESS_IDENTITY" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-svs-entsendung-text",
      locator: "SVS Entsendebescheinigung",
      text: "Für Personen, die der österreichischen Selbständigenversicherung unterliegen und vorübergehend in einem anderen Mitgliedstaat tätig werden, stellt die SVS den österreichischen Antragsweg auf die Entsendebescheinigung PD A1 bereit, über Kundencenter oder digitalen Antrag. Selbständigenstatus oder ein österreichisches Projekt allein begründet nicht die Anwendbarkeit österreichischer Rechtsvorschriften. Die materiellen Entsendungsvoraussetzungen bleiben unionsrechtlich.",
    }],
  },
  {
    key: "at-svs-mixed",
    publisherKey: "svs" as const,
    officialDomain: "www.svs.at",
    url: "https://www.svs.at/cdscontent/?contentid=10007.816694",
    title: "SVS: Selbständig und unselbständig in verschiedenen Staaten",
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshnessClass: "EVENT_DRIVEN" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "AUTHORITY_COMPETENCE" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-svs-mixed-text",
      locator: "Wohnsitzstaatliche Bestimmung",
      text: "Bei gemischter selbständiger und unselbständiger Tätigkeit in verschiedenen Staaten trifft die Entscheidung über die anwendbaren Rechtsvorschriften der zuständige Träger des Wohnortstaates. Die SVS ist nicht automatisch Bestimmungsstelle, nur weil eine selbständige Tätigkeit in Österreich ausgeübt wird.",
    }],
  },
  {
    key: "at-bvaeb-identity",
    publisherKey: "bvaeb" as const,
    officialDomain: "www.bvaeb.at",
    url: "https://www.bvaeb.at/",
    title: "BVAEB: Trägeridentität öffentlich Bedienstete, Eisenbahnen und Bergbau",
    handlingMode: "STORE_CANONICALLY" as const,
    freshnessClass: "LEGAL_CHANGE_MONITORED" as const,
    staleBehavior: "DO_NOT_USE_STALE" as const,
    informationClass: "AUTHORITY_COMPETENCE" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-bvaeb-identity-text",
      locator: "BVAEB Träger",
      text: "Die Versicherungsanstalt öffentlich Bediensteter, Eisenbahnen und Bergbau ist ein eigener österreichischer Sozialversicherungsträger für gesetzlich zugeordnete Gruppen. Sie hat eigene A1-/Entsende- und Mehrstaatenverfahren. Ein österreichischer Arbeitnehmer ist nicht automatisch ÖGK-Fall.",
    }],
  },
  {
    key: "at-dachverband-telework",
    publisherKey: "dachverband" as const,
    officialDomain: "www.sozialversicherung.at",
    url: "https://www.sozialversicherung.at/cdscontent/?contentid=10007.889331",
    title: "Dachverband: Grenzüberschreitende Telearbeit, Rahmenvereinbarung",
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshnessClass: "EVENT_DRIVEN" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "AUTHORITY_COMPETENCE" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-dachverband-telework-text",
      locator: "Antrag Dachverband / BMASGPK",
      text: "Für die multilaterale Rahmenvereinbarung über gewöhnliche grenzüberschreitende Telearbeit ist auf österreichischer Seite der Dachverband der österreichischen Sozialversicherungsträger die Verfahrensstelle, nicht automatisch ÖGK oder SVS. Die Unterzeichnung Österreichs erfolgte durch das Bundesministerium für Arbeit, Soziales, Gesundheit, Pflege und Konsumentenschutz. Der Rahmen gilt für Arbeitnehmer, zwei beteiligte Staaten und Telearbeit unter 50 Prozent der Gesamttätigkeit. Nach österreichischer Gesetzgebungsfolge stellt der zuständige österreichische Versicherungsträger PD A1 aus; der Dachverband ist nicht der universelle A1-Aussteller. Scheitert der Rahmen, bleibt eine allgemeine Artikel-16-Prüfung möglich. Die Teilnahme einzelner Staaten, einschließlich der Slowakei, folgt nicht aus der EU-Mitgliedschaft allein und ist anhand der aktuellen amtlichen Signatarliste zu revalidieren. Die genaue Amtsstelle ist live zu prüfen.",
    }],
  },
  {
    key: "at-elda-channel",
    publisherKey: "elda" as const,
    officialDomain: "www.elda.at",
    url: "https://www.elda.at/",
    title: "ELDA: elektronischer Datenaustauschkanal",
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshnessClass: "EVENT_DRIVEN" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "ONLINE_SERVICE_URL" as const,
    sourceClass: "OFFICIAL_ONLINE_SERVICE" as const,
    passages: [{
      key: "at-elda-channel-text",
      locator: "ELDA Kanal",
      text: "ELDA ist der elektronische Datenaustausch mit den österreichischen Sozialversicherungsträgern. ELDA ist Anwendungs- und Übermittlungskanal, nicht zuständige Rechtsbehörde und nicht materielles Kollisionsrecht.",
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

export const AT_AL_UNITS: readonly Unit[] = Object.freeze([
  { key: "at-routing-does-not-copy-eu-law", category: "boundary", type: "boundary", text: "Diese österreichischen Routing-Sätze wiederholen nicht die materiellen Artikel 11 bis 16. Die rechtliche Einordnung bleibt im geteilten EU-Kern.", sourceKey: "at-oegk-decisions", passageKey: "at-oegk-decisions-text", riskLevel: "high" },
  { key: "at-ordinary-employee-oegk-candidate", category: "carrier", type: "procedure", text: "Für die ordentliche österreichische Arbeitnehmerentsendung ist die ÖGK der aktuelle operative Kandidat über ELDA und Formkategorie E1, sofern die Person der ÖGK-Gruppe zugeordnet ist.", sourceKey: "at-oegk-forms", passageKey: "at-oegk-forms-text", riskLevel: "high" },
  { key: "at-employee-not-always-oegk", category: "carrier", type: "exception", text: "Ein österreichischer Arbeitnehmer ist nicht automatisch ÖGK-Fall. Die Trägerwahl folgt der gesetzlich zugeordneten Versichertengruppe.", sourceKey: "at-bvaeb-identity", passageKey: "at-bvaeb-identity-text", riskLevel: "high" },
  { key: "at-bvaeb-special-employee-route", category: "carrier", type: "procedure", text: "Für gesetzlich der BVAEB zugeordnete Gruppen ist die BVAEB der eigene A1-/Entsende- und Mehrstaatenweg. Der generische ÖGK-E1–E4-Prozess ersetzt die BVAEB nicht.", sourceKey: "at-bvaeb-identity", passageKey: "at-bvaeb-identity-text", riskLevel: "high" },
  { key: "at-unknown-carrier-unresolved", category: "carrier", type: "exception", text: "Ohne geklärte österreichische Versicherungskategorie bleibt die Trägerzuordnung AUTHORITY_UNRESOLVED. Es gibt keine Einfüge- oder Standardwahl.", sourceKey: "at-bvaeb-identity", passageKey: "at-bvaeb-identity-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "at-svs-self-employed-a1-route", category: "carrier", type: "procedure", text: "Für Personen, die tatsächlich der österreichischen Selbständigenversicherung unterliegen, ist die SVS der österreichische Antragsweg für vorübergehende selbständige Tätigkeit in einem anderen Mitgliedstaat.", sourceKey: "at-svs-entsendung", passageKey: "at-svs-entsendung-text", riskLevel: "high" },
  { key: "at-svs-not-automatic-from-status", category: "carrier", type: "exception", text: "Selbständigenstatus, ein österreichisches Projekt oder eine SVS-Mitgliedschaft allein begründet nicht österreichische Rechtsvorschriften und nicht automatisch SVS-Bestimmungskompetenz.", sourceKey: "at-svs-entsendung", passageKey: "at-svs-entsendung-text", riskLevel: "high" },
  { key: "at-elda-is-channel-not-authority", category: "channel", type: "exception", text: "ELDA ist elektronischer Antrags- und Austauschkanal, nicht zuständige Rechtsbehörde und nicht materielles Kollisionsrecht.", sourceKey: "at-elda-channel", passageKey: "at-elda-channel-text", riskLevel: "high" },
  { key: "at-e1-employee-posting-form", category: "forms", type: "procedure", text: "E1 ist die aktuelle österreichische operative Formkategorie für die Arbeitnehmerentsendung in einen anderen Staat. Die Bezeichnung ist CACHE_AND_REVALIDATE.", sourceKey: "at-oegk-forms", passageKey: "at-oegk-forms-text", riskLevel: "medium" },
  { key: "at-e2-one-employer-form", category: "forms", type: "procedure", text: "E2 ist die aktuelle österreichische operative Formkategorie für Beschäftigung für einen Arbeitgeber in mehreren Staaten, soweit österreichische Verfahrenskompetenz besteht.", sourceKey: "at-oegk-forms", passageKey: "at-oegk-forms-text", riskLevel: "medium" },
  { key: "at-e3-multiple-employers-form", category: "forms", type: "procedure", text: "E3 ist die aktuelle österreichische operative Formkategorie für Beschäftigung für mehrere Arbeitgeber in mehreren Staaten. Die Arbeitgeberzahl allein bestimmt nicht die anwendbaren Rechtsvorschriften.", sourceKey: "at-oegk-forms", passageKey: "at-oegk-forms-text", riskLevel: "medium" },
  { key: "at-e4-mixed-form", category: "forms", type: "procedure", text: "E4 ist die aktuelle österreichische operative Formkategorie für selbständige und unselbständige Tätigkeit in verschiedenen Staaten. Die gemischte Kollisionsprüfung bleibt im EU-Kern.", sourceKey: "at-oegk-forms", passageKey: "at-oegk-forms-text", riskLevel: "medium" },
  { key: "at-forms-cache-and-revalidate", category: "forms", type: "boundary", text: "Österreichische Formbezeichnungen E1 bis E4 und Kanalnamen sind operative Metadaten und nicht zeitlos.", sourceKey: "at-oegk-forms", passageKey: "at-oegk-forms-text", riskLevel: "medium" },
  { key: "at-austrian-result-issues-a1", category: "result", type: "procedure", text: "Wird österreichische Gesetzgebung bestimmt, stellt der zuständige österreichische Träger PD A1 aus oder übermittelt es.", sourceKey: "at-oegk-decisions", passageKey: "at-oegk-decisions-text", riskLevel: "high" },
  { key: "at-foreign-result-foreign-issuer", category: "result", type: "procedure", text: "Wird die Gesetzgebung eines anderen Staates bestimmt, teilt die österreichische Seite das Ergebnis mit; der ausländische Träger stellt PD A1 aus.", sourceKey: "at-oegk-decisions", passageKey: "at-oegk-decisions-text", riskLevel: "high" },
  { key: "at-application-not-austrian-outcome", category: "result", type: "exception", text: "Ein österreichischer Antrag oder ELDA-Kanal begründet nicht automatisch österreichische Rechtsvorschriften und nicht automatisch eine österreichische A1.", sourceKey: "at-oegk-decisions", passageKey: "at-oegk-decisions-text", riskLevel: "high" },
  { key: "at-membership-not-merits", category: "result", type: "exception", text: "Bestehende Mitgliedschaft bei SVS, ÖGK oder BVAEB ist Kontext, nicht der unionsrechtliche Merits-Schluss.", sourceKey: "at-svs-entsendung", passageKey: "at-svs-entsendung-text", riskLevel: "high" },
  { key: "at-carrier-after-al-facts", category: "carrier", type: "boundary", text: "Österreichische Trägerauflösung erfolgt erst mit ausreichenden Tatsachen zur anwendbaren Gesetzgebung. Der Träger beweist nicht den Anwendungsstaat.", sourceKey: "at-oegk-decisions", passageKey: "at-oegk-decisions-text", riskLevel: "high" },
  { key: "at-residence-state-institution", category: "residence", type: "procedure", text: "Bei gewöhnlicher Mehrstaatentätigkeit hat der Träger des Wohnsitzstaates die zentrale verfahrensrechtliche Rolle. Wohnsitz Slowakei plus Tätigkeit Österreich oder Deutschland leitet die Bestimmung nicht automatisch nach Österreich.", sourceKey: "at-svs-mixed", passageKey: "at-svs-mixed-text", riskLevel: "high" },
  { key: "at-bureaucracy-not-competence", category: "residence", type: "exception", text: "Der aktuelle bureaucracyCountry-Selektor Österreich überschreibt nicht die wohnsitzstaatliche Bestimmungskompetenz.", sourceKey: "at-svs-mixed", passageKey: "at-svs-mixed-text", riskLevel: "high" },
  { key: "at-activity-not-automatic-legislation", category: "residence", type: "exception", text: "Österreichische Tätigkeit allein bedeutet nicht automatisch österreichische Rechtsvorschriften.", sourceKey: "at-svs-entsendung", passageKey: "at-svs-entsendung-text", riskLevel: "high" },
  { key: "at-dachverband-framework-route", category: "telework", type: "procedure", text: "Der österreichische Anfangsweg der multilateralen Telearbeits-Rahmenvereinbarung geht an den Dachverband, nicht automatisch an ÖGK oder SVS.", sourceKey: "at-dachverband-telework", passageKey: "at-dachverband-telework-text", riskLevel: "high" },
  { key: "at-dachverband-not-universal-issuer", category: "telework", type: "exception", text: "Der Dachverband ist Verfahrensstelle der Rahmenvereinbarung, nicht der universelle österreichische A1-Aussteller.", sourceKey: "at-dachverband-telework", passageKey: "at-dachverband-telework-text", riskLevel: "high" },
  { key: "at-framework-processor-not-issuer", category: "telework", type: "boundary", text: "Rahmenverfahrensstelle und späterer A1-ausstellender Träger sind zu trennen. Folgt österreichische Gesetzgebung, stellt der zuständige Versicherungsträger PD A1 aus.", sourceKey: "at-dachverband-telework", passageKey: "at-dachverband-telework-text", riskLevel: "high" },
  { key: "at-framework-two-state-only", category: "telework", type: "exception", text: "Die Rahmenvereinbarung ist ein Zwei-Staaten-Mechanismus. Ein Drei-Staaten-Muster AT+SK+DE fällt nicht automatisch darunter.", sourceKey: "at-dachverband-telework", passageKey: "at-dachverband-telework-text", riskLevel: "high" },
  { key: "at-framework-employee-only", category: "telework", type: "exception", text: "Die Rahmenvereinbarung gilt für qualifizierte Arbeitnehmer. Selbständige und gemischte Beschäftigung plus Selbständigkeit sind ausgeschlossen.", sourceKey: "at-dachverband-telework", passageKey: "at-dachverband-telework-text", riskLevel: "high" },
  { key: "at-telework-at-signatory-current", category: "telework", type: "definition", text: "Österreich ist nach aktueller amtlicher österreichischer Darstellung und der zu revalidierenden Signatarliste teilnehmender Staat der multilateralen Telearbeits-Rahmenvereinbarung seit 1. Juli 2023. Die Liste ist CACHE_AND_REVALIDATE.", sourceKey: "at-dachverband-telework", passageKey: "at-dachverband-telework-text", riskLevel: "high" },
  { key: "at-telework-sk-signatory-current", category: "telework", type: "definition", text: "Die Slowakei ist nach der aktuellen, vor Gebrauch zu revalidierenden amtlichen Signatarlage ein teilnehmender Staat. Teilnahme folgt nicht aus der EU-Mitgliedschaft allein.", sourceKey: "at-dachverband-telework", passageKey: "at-dachverband-telework-text", riskLevel: "high" },
  { key: "at-framework-not-general-art16", category: "article16", type: "exception", text: "Ein gescheiterter Telearbeitsrahmen ist nicht die Ablehnung jeder Artikel-16-Möglichkeit. Es bleibt GENERAL_ARTICLE16_REVIEW.", sourceKey: "at-dachverband-telework", passageKey: "at-dachverband-telework-text", riskLevel: "high" },
  { key: "at-general-art16-bmasgpk", category: "article16", type: "procedure", text: "Für allgemeine Artikel-16-Ausnahmen außerhalb des Telearbeitsrahmens ist das aktuelle zuständige Bundesministerium laut amtlicher österreichischer Darstellung 2026 das Bundesministerium für Arbeit, Soziales, Gesundheit, Pflege und Konsumentenschutz. Die genaue Amtsstelle ist FETCH_LIVE.", sourceKey: "at-dachverband-telework", passageKey: "at-dachverband-telework-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "at-a1-operational-validity-revalidate", category: "practice", type: "definition", text: "Österreichische operative Gültigkeits- oder Wiedervorlagepraxis für PD A1 in Mehrstaaten- oder Kollisionslagen ist österreichische Verwaltungspraxis, nicht unionsgesetzliche Norm, und ist CACHE_AND_REVALIDATE.", sourceKey: "at-oegk-decisions", passageKey: "at-oegk-decisions-text", riskLevel: "medium" },
  { key: "at-material-change-reevaluation", category: "change", type: "procedure", text: "Eine bestehende A1 ist nicht ewig. Wohnsitz-, Arbeitgeber-, Tätigkeitsart-, Tätigkeitsstaat-, Verteilungs- oder Projektwechsel kann APPLICABLE_LEGISLATION_REASSESSMENT_REQUIRED auslösen.", sourceKey: "at-oegk-decisions", passageKey: "at-oegk-decisions-text", riskLevel: "high" },
  { key: "at-old-a1-not-current-proof", category: "change", type: "exception", text: "Eine alte A1 ist nach wesentlicher Sachverhaltsänderung nicht automatisch Nachweis der aktuellen Bestimmung.", sourceKey: "at-oegk-decisions", passageKey: "at-oegk-decisions-text", riskLevel: "high" },
  { key: "at-a1-evidence-not-source-of-law", category: "a1", type: "boundary", text: "PD A1 bestätigt, welche staatlichen Sozialversicherungsvorschriften gelten. Fehlen der Urkunde bedeutet nicht automatisch Fehlen anwendbarer Rechtsvorschriften. APPLICABLE_LEGISLATION_RESULT und A1_DOCUMENT_STATUS sind zu trennen.", sourceKey: "at-oegk-decisions", passageKey: "at-oegk-decisions-text", riskLevel: "high" },
  { key: "at-a1-not-work-permit-or-dla", category: "boundary", type: "boundary", text: "A1 ist weder Arbeitserlaubnis noch Dienstleistungsanzeige noch Gewerbeberechtigung.", sourceKey: "at-oegk-decisions", passageKey: "at-oegk-decisions-text", riskLevel: "high" },
  { key: "at-business-authorization-handoff", category: "boundary", type: "procedure", text: "Bei vorübergehender Tätigkeit einer slowakischen SZČO in Österreich kann zusätzlich BUSINESS_AUTHORIZATION_REVIEW_REQUIRED anfallen. A1 erfüllt österreichische Gewerbeanforderungen nicht.", sourceKey: "at-svs-entsendung", passageKey: "at-svs-entsendung-text", riskLevel: "high" },
  { key: "at-health-family-unemp-tax-handoff", category: "boundary", type: "boundary", text: "Anwendbare Gesetzgebung speist künftige Gesundheits-, Familien- und Arbeitslosenwege, bestimmt aber nicht S1, EHIC, S2, Artikel 68, Artikel 65, steuerliche Ansässigkeit oder Besteuerungsrecht.", sourceKey: "at-oegk-decisions", passageKey: "at-oegk-decisions-text", riskLevel: "high" },
  { key: "at-client-not-a1-issuer", category: "boundary", type: "exception", text: "Auftraggeber, Agentur oder Kundenunternehmen in Österreich oder der Slowakei ist keine zuständige Stelle. clientCountry ist nicht der A1-Ausstellungsstaat.", sourceKey: "at-svs-entsendung", passageKey: "at-svs-entsendung-text", riskLevel: "high" },
]);

type ProcessSpec = Readonly<{
  key: string;
  title: string;
  trigger: string;
  safeFirstStep: string;
  riskLevel: "medium" | "high";
  dimensions: Readonly<Record<(typeof PROCESS_COMPLETE_DIMENSIONS)[number], string>>;
}>;

export const AT_AL_PROCESSES: readonly ProcessSpec[] = Object.freeze([
  { key: AT_AL_PRIMARY_PROCESS_KEY, title: "Österreichischen A1-Träger 2026 auflösen", trigger: "Österreichische Verfahrenskompetenz ist möglich, die Versichertengruppe ist offen oder bekannt", safeFirstStep: "ÖGK, SVS und BVAEB unterscheiden; unbekannte Kategorie fail-closed lassen.", riskLevel: "high", dimensions: { what: "at-ordinary-employee-oegk-candidate", whoWhen: "at-unknown-carrier-unresolved", documents: "at-carrier-after-al-facts", how: "at-unknown-carrier-unresolved", next: "at-elda-is-channel-not-authority", deadlines: "at-forms-cache-and-revalidate", problems: "at-employee-not-always-oegk", dutiesAfter: "at-material-change-reevaluation", institution: "at-unknown-carrier-unresolved", boundaries: "at-routing-does-not-copy-eu-law", freshness: "at-forms-cache-and-revalidate", negatives: "at-membership-not-merits" } },
  { key: "at-employee-posting-oegk", title: "Österreichische Arbeitnehmerentsendung ÖGK/ELDA/E1 2026", trigger: "Ordentliche österreichische Arbeitnehmerentsendung in einen anderen Mitgliedstaat", safeFirstStep: "ÖGK als Kandidat und ELDA/E1 als Kanal führen; ÖGK nicht universell setzen.", riskLevel: "high", dimensions: { what: "at-e1-employee-posting-form", whoWhen: "at-ordinary-employee-oegk-candidate", documents: "at-e1-employee-posting-form", how: "at-elda-is-channel-not-authority", next: "at-austrian-result-issues-a1", deadlines: "at-forms-cache-and-revalidate", problems: "at-employee-not-always-oegk", dutiesAfter: "at-material-change-reevaluation", institution: "at-ordinary-employee-oegk-candidate", boundaries: "at-routing-does-not-copy-eu-law", freshness: "at-forms-cache-and-revalidate", negatives: "at-elda-is-channel-not-authority" } },
  { key: "at-employee-posting-bvaeb", title: "Österreichische BVAEB-Sonderentsendung 2026", trigger: "Gesetzlich der BVAEB zugeordnete Arbeitnehmerentsendung", safeFirstStep: "BVAEB-Weg führen und nicht in den generischen ÖGK-E1-Prozess zwingen.", riskLevel: "high", dimensions: { what: "at-bvaeb-special-employee-route", whoWhen: "at-bvaeb-special-employee-route", documents: "at-elda-is-channel-not-authority", how: "at-elda-is-channel-not-authority", next: "at-austrian-result-issues-a1", deadlines: "at-forms-cache-and-revalidate", problems: "at-employee-not-always-oegk", dutiesAfter: "at-material-change-reevaluation", institution: "at-bvaeb-special-employee-route", boundaries: "at-routing-does-not-copy-eu-law", freshness: "at-forms-cache-and-revalidate", negatives: "at-unknown-carrier-unresolved" } },
  { key: "at-self-employed-posting-svs", title: "Österreichische selbständige Entsendung SVS 2026", trigger: "Person unterliegt österreichischer Selbständigenversicherung und sucht vorübergehende ähnliche Tätigkeit in einem anderen Mitgliedstaat", safeFirstStep: "SVS-Antragsweg führen; EU-Artikel-12-Absatz-2-Test nicht neu schreiben.", riskLevel: "high", dimensions: { what: "at-svs-self-employed-a1-route", whoWhen: "at-svs-not-automatic-from-status", documents: "at-svs-self-employed-a1-route", how: "at-svs-self-employed-a1-route", next: "at-austrian-result-issues-a1", deadlines: "at-forms-cache-and-revalidate", problems: "at-svs-not-automatic-from-status", dutiesAfter: "at-material-change-reevaluation", institution: "at-svs-self-employed-a1-route", boundaries: "at-routing-does-not-copy-eu-law", freshness: "at-forms-cache-and-revalidate", negatives: "at-membership-not-merits" } },
  { key: "at-employee-multi-state-one-employer", title: "Österreichische Arbeitnehmer-Mehrstaaten E2 2026", trigger: "Ein Arbeitgeber, Arbeit in mehreren Staaten, österreichische Verfahrenskompetenz möglich", safeFirstStep: "E2 als operativen Weg führen; Artikel 13 im EU-Kern belassen.", riskLevel: "high", dimensions: { what: "at-e2-one-employer-form", whoWhen: "at-residence-state-institution", documents: "at-e2-one-employer-form", how: "at-elda-is-channel-not-authority", next: "at-austrian-result-issues-a1", deadlines: "at-forms-cache-and-revalidate", problems: "at-application-not-austrian-outcome", dutiesAfter: "at-material-change-reevaluation", institution: "at-residence-state-institution", boundaries: "at-routing-does-not-copy-eu-law", freshness: "at-forms-cache-and-revalidate", negatives: "at-bureaucracy-not-competence" } },
  { key: "at-employee-multi-state-multiple-employers", title: "Österreichische Arbeitnehmer-Mehrstaaten E3 2026", trigger: "Mehrere Arbeitgeber, Arbeit in mehreren Staaten", safeFirstStep: "E3 als operativen Weg führen; Arbeitgeberzahl nicht als Merits behandeln.", riskLevel: "high", dimensions: { what: "at-e3-multiple-employers-form", whoWhen: "at-residence-state-institution", documents: "at-e3-multiple-employers-form", how: "at-elda-is-channel-not-authority", next: "at-austrian-result-issues-a1", deadlines: "at-forms-cache-and-revalidate", problems: "at-application-not-austrian-outcome", dutiesAfter: "at-material-change-reevaluation", institution: "at-residence-state-institution", boundaries: "at-routing-does-not-copy-eu-law", freshness: "at-forms-cache-and-revalidate", negatives: "at-activity-not-automatic-legislation" } },
  { key: "at-self-employed-multi-state", title: "Österreichische selbständige Mehrstaatenroute 2026", trigger: "Wohnsitz Österreich und selbständige Tätigkeit in zwei oder mehr Mitgliedstaaten, Kategorie geklärt", safeFirstStep: "EU-Merits zuerst; SVS nur bei verifizierter österreichischer Selbständigenkategorie und Wohnsitzkompetenz.", riskLevel: "high", dimensions: { what: "at-svs-self-employed-a1-route", whoWhen: "at-residence-state-institution", documents: "at-svs-self-employed-a1-route", how: "at-svs-not-automatic-from-status", next: "at-foreign-result-foreign-issuer", deadlines: "at-forms-cache-and-revalidate", problems: "at-svs-not-automatic-from-status", dutiesAfter: "at-material-change-reevaluation", institution: "at-residence-state-institution", boundaries: "at-routing-does-not-copy-eu-law", freshness: "at-forms-cache-and-revalidate", negatives: "at-bureaucracy-not-competence" } },
  { key: "at-mixed-employed-self-employed", title: "Österreichische gemischte E4-Route 2026", trigger: "Gleichzeitige Beschäftigung und Selbständigkeit in verschiedenen Staaten, österreichische Verfahrensrolle möglich", safeFirstStep: "E4 nur als Verfahrensweg; Artikel 13 Absatz 3 nicht als österreichisches Recht schreiben.", riskLevel: "high", dimensions: { what: "at-e4-mixed-form", whoWhen: "at-residence-state-institution", documents: "at-e4-mixed-form", how: "at-elda-is-channel-not-authority", next: "at-foreign-result-foreign-issuer", deadlines: "at-forms-cache-and-revalidate", problems: "at-application-not-austrian-outcome", dutiesAfter: "at-material-change-reevaluation", institution: "at-residence-state-institution", boundaries: "at-routing-does-not-copy-eu-law", freshness: "at-forms-cache-and-revalidate", negatives: "at-membership-not-merits" } },
  { key: "at-telework-framework-dachverband", title: "Österreichischer Telearbeitsrahmen Dachverband 2026", trigger: "Antrag auf die multilaterale Telearbeits-Rahmenvereinbarung mit österreichischer Verfahrensseite", safeFirstStep: "Dachverband führen; ÖGK/SVS nicht als Anfangsstelle setzen.", riskLevel: "high", dimensions: { what: "at-dachverband-framework-route", whoWhen: "at-framework-employee-only", documents: "at-telework-at-signatory-current", how: "at-dachverband-framework-route", next: "at-framework-processor-not-issuer", deadlines: "at-forms-cache-and-revalidate", problems: "at-framework-two-state-only", dutiesAfter: "at-material-change-reevaluation", institution: "at-dachverband-framework-route", boundaries: "at-framework-not-general-art16", freshness: "at-telework-sk-signatory-current", negatives: "at-dachverband-not-universal-issuer" } },
  { key: "at-general-article16-handoff", title: "Allgemeine österreichische Artikel-16-Ausnahme 2026", trigger: "Rahmenvereinbarung scheitert oder es wird eine sonstige Ausnahmevereinbarung gesucht", safeFirstStep: "Aktuelles Bundesministerium 2026 führen und nicht automatisch alle Artikel-16-Wege verneinen.", riskLevel: "high", dimensions: { what: "at-general-art16-bmasgpk", whoWhen: "at-framework-not-general-art16", documents: "at-general-art16-bmasgpk", how: "at-general-art16-bmasgpk", next: "at-foreign-result-foreign-issuer", deadlines: "at-forms-cache-and-revalidate", problems: "at-framework-not-general-art16", dutiesAfter: "at-material-change-reevaluation", institution: "at-general-art16-bmasgpk", boundaries: "at-routing-does-not-copy-eu-law", freshness: "at-forms-cache-and-revalidate", negatives: "at-dachverband-not-universal-issuer" } },
  { key: "at-foreign-legislation-foreign-a1", title: "Ausländische Gesetzgebung, ausländischer A1-Aussteller 2026", trigger: "Österreichische Stelle bestimmt oder übermittelt ausländische Rechtsvorschriften", safeFirstStep: "Ausländischen Träger als A1-Aussteller führen; österreichischen Antrag nicht als österreichisches Ergebnis behandeln.", riskLevel: "high", dimensions: { what: "at-foreign-result-foreign-issuer", whoWhen: "at-application-not-austrian-outcome", documents: "at-a1-evidence-not-source-of-law", how: "at-foreign-result-foreign-issuer", next: "at-foreign-result-foreign-issuer", deadlines: "at-a1-operational-validity-revalidate", problems: "at-application-not-austrian-outcome", dutiesAfter: "at-material-change-reevaluation", institution: "at-foreign-result-foreign-issuer", boundaries: "at-routing-does-not-copy-eu-law", freshness: "at-a1-operational-validity-revalidate", negatives: "at-application-not-austrian-outcome" } },
  { key: "at-material-change-reevaluation-route", title: "Österreichische A1-Neuwertung nach Sachänderung 2026", trigger: "Bestehende A1 und wesentlicher Wohnsitz-, Arbeitgeber-, Tätigkeits- oder Projektwechsel", safeFirstStep: "APPLICABLE_LEGISLATION_REASSESSMENT_REQUIRED zurückgeben, nicht die alte Urkunde fortschreiben.", riskLevel: "high", dimensions: { what: "at-material-change-reevaluation", whoWhen: "at-old-a1-not-current-proof", documents: "at-a1-evidence-not-source-of-law", how: "at-material-change-reevaluation", next: "at-material-change-reevaluation", deadlines: "at-a1-operational-validity-revalidate", problems: "at-old-a1-not-current-proof", dutiesAfter: "at-material-change-reevaluation", institution: "at-unknown-carrier-unresolved", boundaries: "at-a1-evidence-not-source-of-law", freshness: "at-a1-operational-validity-revalidate", negatives: "at-old-a1-not-current-proof" } },
  { key: "at-business-authorization-handoff-route", title: "A1 gegen österreichische Gewerbe-/Dienstleistungsanzeige 2026", trigger: "Person hält A1 für Dienstleistungsanzeige, Gewerbe oder Arbeitserlaubnis", safeFirstStep: "BUSINESS_AUTHORIZATION_REVIEW_REQUIRED anbieten und die Rechtskreise trennen.", riskLevel: "high", dimensions: { what: "at-business-authorization-handoff", whoWhen: "at-a1-not-work-permit-or-dla", documents: "at-a1-not-work-permit-or-dla", how: "at-business-authorization-handoff", next: "at-business-authorization-handoff", deadlines: "at-forms-cache-and-revalidate", problems: "at-a1-not-work-permit-or-dla", dutiesAfter: "at-health-family-unemp-tax-handoff", institution: "at-client-not-a1-issuer", boundaries: "at-health-family-unemp-tax-handoff", freshness: "at-forms-cache-and-revalidate", negatives: "at-a1-not-work-permit-or-dla" } },
]);

export type AtAlCarrier = "SVS" | "OEGK" | "BVAEB" | "OTHER_VERIFIED_AT_CARRIER" | "UNRESOLVED";
export type AtAlInsuranceCategory = "ORDINARY_EMPLOYEE" | "SPECIAL_BVAEB" | "SELF_EMPLOYED_COVERED" | "UNKNOWN";

export function routeAtApplicableLegislationCarrier(input: Readonly<{
  insuranceCategory?: AtAlInsuranceCategory | null;
  applicableLegislationState?: "AT" | "SK" | "DE" | "OTHER" | "UNRESOLVED" | null;
}>): Readonly<{ carrier: AtAlCarrier; issues: readonly string[] }> {
  const issues: string[] = [];
  if (input.applicableLegislationState && input.applicableLegislationState !== "AT") {
    issues.push("CARRIER_RESOLUTION_IS_NOT_APPLICABLE_LEGISLATION");
  }
  const category = input.insuranceCategory ?? "UNKNOWN";
  if (category === "ORDINARY_EMPLOYEE") {
    return Object.freeze({ carrier: "OEGK", issues: Object.freeze([...issues, "OEGK_CANDIDATE_NOT_UNIVERSAL"]) });
  }
  if (category === "SPECIAL_BVAEB") {
    return Object.freeze({ carrier: "BVAEB", issues: Object.freeze(issues) });
  }
  if (category === "SELF_EMPLOYED_COVERED") {
    return Object.freeze({ carrier: "SVS", issues: Object.freeze([...issues, "SVS_NOT_AUTOMATIC_FROM_SELF_EMPLOYED_LABEL"]) });
  }
  return Object.freeze({ carrier: "UNRESOLVED", issues: Object.freeze([...issues, "AUTHORITY_UNRESOLVED"]) });
}

export function evaluateAtSkTeleworkFrameworkGate(input: Readonly<{
  activityType?: "EMPLOYED" | "SELF_EMPLOYED" | "MIXED" | "UNKNOWN";
  residenceState?: string | null;
  employerState?: string | null;
  activityStates?: readonly string[] | null;
  teleworkPercent?: number | null;
  bothSignatoriesVerified?: boolean | null;
  habitualTelework?: boolean | null;
  mutualRequest?: boolean | null;
}>): Readonly<{ pass: boolean; reason: string }> {
  if (!input.activityType || input.activityType === "UNKNOWN") {
    return Object.freeze({ pass: false, reason: "FAIL_CLOSED_MISSING_FACTS" });
  }
  if (input.activityType === "SELF_EMPLOYED") {
    return Object.freeze({ pass: false, reason: "SELF_EMPLOYED_EXCLUDED" });
  }
  if (input.activityType === "MIXED") {
    return Object.freeze({ pass: false, reason: "MIXED_ACTIVITY_EXCLUDED" });
  }
  if (input.bothSignatoriesVerified !== true) {
    return Object.freeze({ pass: false, reason: "SIGNATORIES_NOT_VERIFIED" });
  }
  const states = new Set((input.activityStates ?? []).filter(Boolean));
  if (input.residenceState) states.add(input.residenceState);
  if (input.employerState) states.add(input.employerState);
  if (states.size !== 2) {
    return Object.freeze({ pass: false, reason: "TWO_STATE_REQUIRED" });
  }
  if (typeof input.teleworkPercent !== "number" || Number.isNaN(input.teleworkPercent)) {
    return Object.freeze({ pass: false, reason: "FAIL_CLOSED_MISSING_FACTS" });
  }
  if (input.teleworkPercent < 25 || input.teleworkPercent >= 50) {
    return Object.freeze({ pass: false, reason: "PERCENT_THRESHOLD_FAIL" });
  }
  if (input.habitualTelework !== true || input.mutualRequest !== true) {
    return Object.freeze({ pass: false, reason: "FAIL_CLOSED_MISSING_FACTS" });
  }
  return Object.freeze({ pass: true, reason: "FRAMEWORK_THRESHOLD_PASS" });
}

export function evaluateAtAlProcessCompleteness() {
  const incomplete = AT_AL_PROCESSES.filter((process) => (
    PROCESS_COMPLETE_DIMENSIONS.some((dimension) => !process.dimensions[dimension])
  ));
  const keys = new Set(AT_AL_UNITS.map((unit) => unit.key));
  const missing = AT_AL_PROCESSES.flatMap((process) => (
    PROCESS_COMPLETE_DIMENSIONS
      .map((dimension) => process.dimensions[dimension])
      .filter((key) => !keys.has(key))
      .map((key) => `${process.key}:${key}`)
  ));
  const processComplete = incomplete.length === 0 && missing.length === 0;
  return Object.freeze({
    processCount: AT_AL_PROCESSES.length,
    processComplete,
    processCompletenessPercent: processComplete ? 100 : 0,
    incompleteProcessKeys: incomplete.map((process) => process.key),
    missingClaims: missing,
  });
}

const PUBLISHERS = Object.freeze([
  { key: "oegk", name: "Österreichische Gesundheitskasse", portal: "https://www.gesundheitskasse.at/", identity: "AT_OEGK" },
  { key: "svs", name: "Sozialversicherungsanstalt der Selbständigen", portal: "https://www.svs.at/", identity: "AT_SVS" },
  { key: "bvaeb", name: "Versicherungsanstalt öffentlich Bediensteter, Eisenbahnen und Bergbau", portal: "https://www.bvaeb.at/", identity: "AT_BVAEB" },
  { key: "dachverband", name: "Dachverband der österreichischen Sozialversicherungsträger", portal: "https://www.sozialversicherung.at/", identity: "AT_DACHVERBAND" },
  { key: "elda", name: "ELDA elektronischer Datenaustausch", portal: "https://www.elda.at/", identity: "AT_DACHVERBAND" },
]);

export function buildAtApplicableLegislationRoutingPack() {
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
    name: spec.name, type: "national_insurance_carrier",
    territorialScopeId: scope.id, trustDomainId: trustDomain.id,
  })]));
  const authorities = Object.fromEntries(PUBLISHERS.map((spec) => [spec.key, item("authorities", spec.identity + ":" + spec.key, {
    publisherId: publishers[spec.key].id, name: spec.name, type: "national_insurance_carrier",
    jurisdictionId: jurisdiction.id, territorialScopeId: scope.id, officialPortalUrl: spec.portal,
  })]));
  const sources = AT_AL_OFFICIAL_SOURCES.map((spec) => {
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
      effectiveDate: AT_AL_AS_OF,
    });
    const passages = spec.passages.map((passage, order) => item("passages", passage.key, {
      sourceVersionId: version.id, order, headingPath: [spec.title],
      locator: passage.locator, text: passage.text, textHash: HASH(passage.text),
    }));
    const policy = item("handlingPolicies", `${spec.key}:policy`, {
      sourceId: source.id, informationClass: spec.informationClass, handlingMode: spec.handlingMode,
      freshnessClass: spec.freshnessClass, staleBehavior: spec.staleBehavior,
      requiredContextKeys: spec.handlingMode === "CACHE_AND_REVALIDATE"
        ? ["PROCESS_VARIANT"]
        : ["RESIDENCE_STATE", "WORK_STATE"],
      riskClass: "MEDIUM",
    });
    const freshness = item("freshnessRecords", `${spec.key}:freshness`, {
      entityType: "source", entityId: source.id, status: "fresh", effectiveDateKnown: true,
    });
    return { spec, source, version, passages, policy, freshness };
  });
  const passageByKey = new Map(sources.flatMap(({ passages }) => passages.map((passage) => [passage.key, passage])));
  const sourceByKey = new Map(sources.map((entry) => [entry.spec.key, entry]));
  const claims = AT_AL_UNITS.map((unit) => {
    const source = sourceByKey.get(unit.sourceKey);
    const passage = passageByKey.get(unit.passageKey);
    if (!source || !passage) throw new Error(`AT_AL_UNIT_SOURCE_MISSING:${unit.key}`);
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
  const processes = AT_AL_PROCESSES.map((spec) => item("processes", spec.key, {
    processGroupId: AT_AL_ROUTING_PROCESS_GROUP, title: spec.title, jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id, riskLevel: spec.riskLevel, trigger: spec.trigger,
    safeFirstStep: spec.safeFirstStep, regionalVariationExpected: false,
  }));
  const processByKey = new Map(processes.map((process) => [String(process.key), process]));
  const claimByKey = new Map(claims.map(({ claim }) => [String(claim.key), claim]));
  const processClaimLinks: Entity[] = [];
  const seen = new Set<string>();
  for (const process of AT_AL_PROCESSES) {
    for (const dimension of PROCESS_COMPLETE_DIMENSIONS) {
      const claimKey = process.dimensions[dimension];
      const token = `${process.key}:${claimKey}:${dimension}`;
      if (seen.has(token)) continue;
      const stored = processByKey.get(process.key);
      const claim = claimByKey.get(claimKey);
      if (!stored || !claim) throw new Error(`AT_AL_PROCESS_CLAIM_MISSING:${process.key}:${claimKey}`);
      seen.add(token);
      processClaimLinks.push(item("processClaimLinks", token, {
        processId: stored.id, claimId: claim.id, role: dimension, required: true,
        sequenceContext: dimension, qualificationRequired: false,
      }));
    }
  }
  return Object.freeze({
    schemaVersion: 1,
    packId: AT_AL_ROUTING_PACK_ID,
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
