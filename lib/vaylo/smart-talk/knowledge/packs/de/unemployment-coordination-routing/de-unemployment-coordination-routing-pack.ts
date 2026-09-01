/**
 * CB-0J German operational routing for unemployment coordination.
 * Does not restate Regulation 883/2004 Articles 61–65a. EU unemployment core owns legal merits.
 * Does not restate Arbeitslosengeld national merits; links the existing SGB III core.
 */
import { createHash } from "node:crypto";

import { PROCESS_COMPLETE_DIMENSIONS } from "../../eu/applicable-legislation/eu-applicable-legislation-core-pack";
import { stableKnowledgeFactoryId } from "../../../source-registry/knowledge-factory-contracts";
import {
  DE_UNEMPLOYMENT_ROUTING_PACK_ID,
  DE_UNEMPLOYMENT_ROUTING_PROCESS_GROUP,
} from "../../../source-registry/foreign-national-adapter-contracts";

const HASH = (value: string): string => createHash("sha256").update(value).digest("hex");
type Entity = Readonly<Record<string, unknown> & { key: string; id: string }>;

function item(entityClass: string, key: string, values: Record<string, unknown>): Entity {
  return Object.freeze({
    key,
    id: stableKnowledgeFactoryId(DE_UNEMPLOYMENT_ROUTING_PACK_ID, entityClass, key),
    ...values,
  });
}

export const DE_UE_PACK_ID = DE_UNEMPLOYMENT_ROUTING_PACK_ID;
export const DE_UE_PROCESS_GROUP = DE_UNEMPLOYMENT_ROUTING_PROCESS_GROUP;
export const DE_UE_PRIMARY_PROCESS_KEY = "de-ue-employee-alg-cross-border" as const;
export const DE_AGENTUR_FUER_ARBEIT_ROLE = "DE_AGENTUR_FUER_ARBEIT" as const;
export const DE_UE_ART9_DECLARATION_VERSION = "2025" as const;
export const DE_UE_ART9_PUBLICATION_DATE = "2026-08-06" as const;
export const DE_UE_ART9_REFERENCE_YEAR_END = "2024-12-31" as const;

export const DE_UE_OFFICIAL_SOURCES = Object.freeze([
  {
    key: "de-ue-sgb3-28a",
    publisherKey: "bmj" as const,
    officialDomain: "www.gesetze-im-internet.de",
    url: "https://www.gesetze-im-internet.de/sgb_3/__28a.html",
    title: "Gesetze im Internet: § 28a SGB III Versicherungspflichtverhältnis auf Antrag",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    informationClass: "LEGAL_BASELINE",
    passages: [{
      key: "de-ue-sgb3-28a-text",
      locator: "§ 28a SGB III",
      text: "Das Versicherungspflichtverhältnis auf Antrag nach § 28a SGB III, in der Nutzerführung oft freiwillige Arbeitslosenversicherung genannt, kann eine selbständige Person begründen, die eine selbständige Tätigkeit mit mindestens 15 Stunden wöchentlich aufnimmt und ausübt. Voraussetzung ist, dass sie in den letzten 30 Monaten vor Aufnahme mindestens zwölf Monate versicherungspflichtig war oder unmittelbar zuvor Anspruch auf eine Entgeltersatzleistung nach dem SGB III hatte und weder versicherungspflichtig nach §§ 25, 26 noch versicherungsfrei nach §§ 27, 28 ist; geringfügige Beschäftigung schließt nicht aus. Der Antrag muss spätestens innerhalb von drei Monaten nach Aufnahme der berechtigten selbständigen Tätigkeit gestellt werden. Das Versicherungspflichtverhältnis endet unter anderem, wenn die Voraussetzungen des Absatzes 1 letztmals erfüllt sind, bei Bezug bestimmter Entgeltersatzleistungen, bei Beitragsrückstand von mehr als drei Monaten oder durch zulässige Kündigung nach fünf Jahren. Selbständigkeit in Deutschland begründet dieses Versicherungsverhältnis nicht automatisch. Eine Gewerbeanmeldung ist kein Nachweis der Antragspflichtversicherung.",
    }],
  },
  {
    key: "de-ue-sgb3-152",
    publisherKey: "bmj" as const,
    officialDomain: "www.gesetze-im-internet.de",
    url: "https://www.gesetze-im-internet.de/sgb_3/__152.html",
    title: "Gesetze im Internet: § 152 SGB III Fiktive Bemessung",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    informationClass: "LEGAL_BASELINE",
    passages: [{
      key: "de-ue-sgb3-152-text",
      locator: "§ 152 SGB III",
      text: "Kann im auf zwei Jahre erweiterten Bemessungsrahmen kein Bemessungszeitraum von mindestens 150 Tagen mit Anspruch auf Arbeitsentgelt festgestellt werden, ist nach § 152 SGB III ein fiktives Arbeitsentgelt zugrunde zu legen. Betriebsertrag, Gewinn oder steuerlicher Gewinn einer selbständigen Tätigkeit ist nicht automatisch Bemessungsentgelt. Dieses Routing-Paket berechnet keinen individuellen Arbeitslosengeldbetrag.",
    }],
  },
  {
    key: "de-ue-ba-freiwillige",
    publisherKey: "ba" as const,
    officialDomain: "www.arbeitsagentur.de",
    url: "https://www.arbeitsagentur.de/freiwillige-arbeitslosenversicherung",
    title: "Bundesagentur für Arbeit: Freiwillige Arbeitslosenversicherung",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "PROCESS_IDENTITY",
    passages: [{
      key: "de-ue-ba-freiwillige-text",
      locator: "Freiwillige Arbeitslosenversicherung",
      text: "Die Bundesagentur für Arbeit erläutert die freiwillige Arbeitslosenversicherung als Antragsweg, der dem gesetzlichen Versicherungspflichtverhältnis auf Antrag entspricht. Der Antrag ist innerhalb von drei Monaten nach Beginn der Selbständigkeit bei der Agentur für Arbeit zu stellen. Gewerbeanmeldung, Steuerbescheid oder Krankenkassenmitgliedschaft ersetzen den Versicherungsnachweis nicht. Ohne tatsächliche Antragspflichtversicherung sind selbständige Zeiten nicht automatisch Arbeitslosenversicherungszeiten. Formulare und Kanäle sind live zu prüfen.",
    }],
  },
  {
    key: "de-ue-ba-fw-28a",
    publisherKey: "ba" as const,
    officialDomain: "www.arbeitsagentur.de",
    url: "https://www.arbeitsagentur.de/datei/fw-sgb-iii-28a_ba037220.pdf",
    title: "Bundesagentur für Arbeit: Fachliche Weisungen § 28a SGB III",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "PDF_DOCUMENT",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "PROCESS_IDENTITY",
    passages: [{
      key: "de-ue-ba-fw-28a-text",
      locator: "FW § 28a SGB III",
      text: "Die fachlichen Weisungen zu § 28a SGB III bestätigen die 15-Stunden-Aufnahme, die 12-in-30- oder unmittelbare Entgeltersatzvoraussetzung, die Drei-Monats-Ausschlussfrist und die Beendigungstatbestände einschließlich Beitragsrückstand und Wegfall der selbständigen Voraussetzung. Historische Einschreibung ist keine ewige Deckung. Unterschreitet die selbständige Tätigkeit die 15-Stunden-Schwelle dauerhaft, endet die Antragspflichtversicherung. Diese Sätze wiederholen nicht die nationalen ALG-Merits des Bundeskerns.",
    }],
  },
  {
    key: "de-ue-ba-antrag-se",
    publisherKey: "ba" as const,
    officialDomain: "www.arbeitsagentur.de",
    url: "https://www.arbeitsagentur.de/datei/antrag-selbstaendige_ba033620.pdf",
    title: "Bundesagentur für Arbeit: Antrag Versicherungspflichtverhältnis auf Antrag – selbständige Tätigkeit",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "PDF_DOCUMENT",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "PROCESS_IDENTITY",
    passages: [{
      key: "de-ue-ba-antrag-se-text",
      locator: "Antrag Selbständige",
      text: "Der Antrag der Bundesagentur für Arbeit auf Versicherungspflichtverhältnis auf Antrag für selbständige Tätigkeit fragt ausdrücklich den zeitlichen Umfang von mindestens 15 Stunden wöchentlich ab. Das Portable Document U1 der Bundesagentur kann selbständige Erwerbstätigkeit und Nachweis der Antragspflichtversicherung erfassen. Finanzamt, Deutsche Rentenversicherung und Krankenkasse stellen das PD U1 für die Arbeitslosenkoordinierung nicht aus. Die zuständige Agentur für Arbeit ist live zu bestimmen.",
    }],
  },
  {
    key: "de-ue-art9-2025",
    publisherKey: "ba" as const,
    officialDomain: "employment-social-affairs.ec.europa.eu",
    url: "https://employment-social-affairs.ec.europa.eu/document/download/f3353e12-9488-4449-9dc9-fc9b36964cb3_en?filename=DE-%20Art%209%20%28ex2025%29%20-%20en.pdf",
    title: "European Commission: Germany Declaration Article 9 of Regulation (EC) No 883/2004 (2025)",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "PDF_DOCUMENT",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "LEGAL_BASELINE",
    passages: [{
      key: "de-ue-art9-2025-text",
      locator: "Article 65a(1) Germany 2025",
      text: "Die deutsche Artikel-9-Erklärung 2025, veröffentlicht am 6. August 2026 für das Bezugsjahr bis 31. Dezember 2024, stellt fest, dass deutsches Recht Selbständigen die Möglichkeit bietet, in das Arbeitslosensystem einbezogen zu werden, durch freiwillige Fortsetzung der Versicherung auf Antrag bei der Bundesagentur für Arbeit nach SGB III. Deutschland ist danach kein Wohnmitgliedstaat ohne Selbständigen-Arbeitslosensystem im Sinne von Artikel 65a. Diese Feststellung ist jährlich zu revalidieren und nicht als zeitloses Nein festzuschreiben. Systemische Deckungsmöglichkeit bedeutet nicht, dass die einzelne Person tatsächlich nach § 28a versichert war.",
    }],
  },
  {
    key: "de-ue-agentur-locator",
    publisherKey: "ba" as const,
    officialDomain: "www.arbeitsagentur.de",
    url: "https://www.arbeitsagentur.de/ueber-uns/kontakt",
    title: "Bundesagentur für Arbeit: Kontakt und Dienststelle",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "FETCH_LIVE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "ONLINE_SERVICE_URL",
    passages: [{
      key: "de-ue-agentur-locator-text",
      locator: "Agentur finden",
      text: "Zuständig für Arbeitslosengeld, Arbeitslosmeldung, PD U1 und PD U2 ist die Agentur für Arbeit der Kategorie DE_AGENTUR_FUER_ARBEIT, nicht das Jobcenter. Die genaue örtliche Agentur ist live zu bestimmen und nicht als bundesweit einheitliche Stelle festzuschreiben. Formulare, Portale und Kontakte sind live zu prüfen.",
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

export const DE_UE_UNITS: readonly Unit[] = Object.freeze([
  { key: "de-ue-agentur-role", category: "institution", type: "definition", text: "Für deutsches Arbeitslosengeld, Arbeitslosmeldung, PD U1 und PD U2 ist die zuständige deutsche Stelle die Agentur für Arbeit der Kategorie DE_AGENTUR_FUER_ARBEIT.", sourceKey: "de-ue-agentur-locator", passageKey: "de-ue-agentur-locator-text", riskLevel: "high" },
  { key: "de-ue-agentur-instance-fetch-live", category: "institution", type: "procedure", text: "Die genaue örtliche Agentur für Arbeit ist live zu bestimmen und nicht ohne Frische festzuschreiben.", sourceKey: "de-ue-agentur-locator", passageKey: "de-ue-agentur-locator-text", riskLevel: "medium" },
  { key: "de-ue-channel-fetch-live", category: "institution", type: "procedure", text: "Aktuelle Formulare, Portale und Kontakte der Agentur für Arbeit sind live zu prüfen.", sourceKey: "de-ue-agentur-locator", passageKey: "de-ue-agentur-locator-text", riskLevel: "medium" },
  { key: "de-ue-finanzamt-not-u1", category: "institution", type: "exception", text: "Das Finanzamt stellt das Portable Document U1 für die Arbeitslosenkoordinierung nicht aus.", sourceKey: "de-ue-ba-antrag-se", passageKey: "de-ue-ba-antrag-se-text", riskLevel: "high" },
  { key: "de-ue-krankenkasse-not-u1", category: "institution", type: "exception", text: "Die Krankenkasse stellt das Portable Document U1 für die Arbeitslosenkoordinierung nicht aus.", sourceKey: "de-ue-ba-antrag-se", passageKey: "de-ue-ba-antrag-se-text", riskLevel: "high" },
  { key: "de-ue-drv-not-u1", category: "institution", type: "exception", text: "Die Deutsche Rentenversicherung stellt das Portable Document U1 für die Arbeitslosenkoordinierung nicht aus.", sourceKey: "de-ue-ba-antrag-se", passageKey: "de-ue-ba-antrag-se-text", riskLevel: "high" },
  { key: "de-ue-does-not-copy-alg-core", category: "boundary", type: "boundary", text: "Dieses Routing-Paket wiederholt nicht die nationalen ALG-Merits des bestehenden SGB-III-Kerns zu Anwartschaft, Sperrzeit, Höhe und Arbeitslosmeldung.", sourceKey: "de-ue-agentur-locator", passageKey: "de-ue-agentur-locator-text", riskLevel: "high" },
  { key: "de-ue-does-not-copy-eu-law", category: "boundary", type: "boundary", text: "Dieses Routing-Paket wiederholt nicht die materiellen Artikel 61 bis 65a der Verordnung 883/2004.", sourceKey: "de-ue-art9-2025", passageKey: "de-ue-art9-2025-text", riskLevel: "high" },
  { key: "de-ue-does-not-determine-art-11", category: "boundary", type: "boundary", text: "Dieses Routing-Paket bestimmt nicht selbst die anwendbaren Rechtsvorschriften nach den Artikeln 11 bis 13; dafür ist der verifizierte CB-0C/0D-Befund erforderlich.", sourceKey: "de-ue-art9-2025", passageKey: "de-ue-art9-2025-text", riskLevel: "high" },
  { key: "de-ue-28a-legal-term", category: "self-employed", type: "definition", text: "Der gesetzliche Begriff ist nicht bloß freiwillige Versicherung, sondern Versicherungspflichtverhältnis auf Antrag nach § 28a SGB III.", sourceKey: "de-ue-sgb3-28a", passageKey: "de-ue-sgb3-28a-text", riskLevel: "high" },
  { key: "de-ue-28a-user-term", category: "self-employed", type: "definition", text: "Die Bundesagentur für Arbeit bezeichnet denselben Weg nutzerseitig als freiwillige Arbeitslosenversicherung; der gesetzliche Begriff bleibt Versicherungspflichtverhältnis auf Antrag.", sourceKey: "de-ue-ba-freiwillige", passageKey: "de-ue-ba-freiwillige-text", riskLevel: "high" },
  { key: "de-ue-28a-not-automatic", category: "self-employed", type: "exception", text: "Selbständige Tätigkeit in Deutschland begründet nicht automatisch Arbeitslosenversicherung. SELF_EMPLOYED_DE ist nicht automatisch nach § 28a versichert.", sourceKey: "de-ue-sgb3-28a", passageKey: "de-ue-sgb3-28a-text", riskLevel: "high" },
  { key: "de-ue-gewerbe-not-28a", category: "self-employed", type: "exception", text: "Eine Gewerbeanmeldung ist nicht der Nachweis eines Versicherungspflichtverhältnisses auf Antrag.", sourceKey: "de-ue-sgb3-28a", passageKey: "de-ue-sgb3-28a-text", riskLevel: "high" },
  { key: "de-ue-28a-15h-entry", category: "self-employed", type: "definition", text: "Für die Aufnahme in das Versicherungspflichtverhältnis auf Antrag wegen Selbständigkeit muss die selbständige Tätigkeit mindestens 15 Stunden wöchentlich umfassen.", sourceKey: "de-ue-sgb3-28a", passageKey: "de-ue-sgb3-28a-text", riskLevel: "high" },
  { key: "de-ue-28a-3-month-deadline", category: "self-employed", type: "procedure", text: "Der Antrag nach § 28a SGB III muss spätestens innerhalb von drei Monaten nach Aufnahme der berechtigten selbständigen Tätigkeit gestellt werden.", sourceKey: "de-ue-sgb3-28a", passageKey: "de-ue-sgb3-28a-text", riskLevel: "high" },
  { key: "de-ue-28a-12-in-30-or-benefit", category: "self-employed", type: "definition", text: "Voraussetzung ist mindestens zwölf Monate Versicherungspflicht in den letzten 30 Monaten vor Aufnahme oder unmittelbarer Anspruch auf eine SGB-III-Entgeltersatzleistung, ohne vorrangige Pflichtversicherung oder Versicherungsfreiheit.", sourceKey: "de-ue-sgb3-28a", passageKey: "de-ue-sgb3-28a-text", riskLevel: "high" },
  { key: "de-ue-28a-coverage-evidence", category: "self-employed", type: "procedure", text: "Tatsächliche §-28a-Deckung verlangt Nachweis, etwa Bescheid der Agentur, Beitragsunterlagen, PD U1 oder amtliche Bestätigung. Ohne Nachweis bleibt die Person nicht als arbeitslosenversichert zu führen.", sourceKey: "de-ue-ba-freiwillige", passageKey: "de-ue-ba-freiwillige-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "de-ue-28a-termination-review", category: "self-employed", type: "procedure", text: "Die Antragspflichtversicherung endet oder ruht bei Wegfall der 15-Stunden-Voraussetzung, Bezug bestimmter Entgeltersatzleistungen, Beitragsrückstand über drei Monate, Versicherungsfreiheits- oder Pflichtversicherungstatbestand oder zulässiger Kündigung nach der gesetzlichen Mindestdauer. Historische Einschreibung ist keine ewige Deckung.", sourceKey: "de-ue-ba-fw-28a", passageKey: "de-ue-ba-fw-28a-text", riskLevel: "high" },
  { key: "de-ue-28a-periods-can-count", category: "self-employed", type: "definition", text: "Verifizierte §-28a-Zeiten können nach Ende oder hinreichender Reduktion der Selbständigkeit und Erfüllung der übrigen ALG-Voraussetzungen zur deutschen Anwartschaft beitragen. Geschäftsaufgabe begründet Arbeitslosengeld nicht automatisch.", sourceKey: "de-ue-sgb3-28a", passageKey: "de-ue-sgb3-28a-text", riskLevel: "high" },
  { key: "de-ue-business-failure-not-alg", category: "self-employed", type: "exception", text: "Geschäftsaufgabe oder Betriebsschließung ist nicht automatisch Arbeitslosengeld.", sourceKey: "de-ue-sgb3-28a", passageKey: "de-ue-sgb3-28a-text", riskLevel: "high" },
  { key: "de-ue-15h-national-not-sk", category: "self-employed", type: "boundary", text: "Die deutsche 15-Stunden-Grenze der Beschäftigungslosigkeit nach § 138 SGB III ist deutsches nationales Recht und nicht auf die slowakische UoZ-Prüfung zu übertragen.", sourceKey: "de-ue-sgb3-28a", passageKey: "de-ue-sgb3-28a-text", riskLevel: "high" },
  { key: "de-ue-side-income-boundary", category: "self-employed", type: "boundary", text: "Nebeneinkommen während des Arbeitslosengeldes kann die Leistung beeinflussen. Dieses Routing berechnet keine Nebenverdienstformel; es verweist auf den bestehenden ALG-Kern.", sourceKey: "de-ue-agentur-locator", passageKey: "de-ue-agentur-locator-text", riskLevel: "high" },
  { key: "de-ue-fiktive-bemessung", category: "calculation", type: "definition", text: "Fehlen im erweiterten Bemessungsrahmen mindestens 150 Tage mit Anspruch auf Arbeitsentgelt, kann § 152 SGB III eine fiktive Bemessung verlangen. Selbständigengewinn ist dafür nicht automatisch Bemessungsentgelt.", sourceKey: "de-ue-sgb3-152", passageKey: "de-ue-sgb3-152-text", riskLevel: "high" },
  { key: "de-ue-profit-not-bemessungsentgelt", category: "calculation", type: "exception", text: "Betriebsertrag, Gewinn oder steuerlicher Gewinn ist nicht automatisch Bemessungsentgelt des Arbeitslosengeldes.", sourceKey: "de-ue-sgb3-152", passageKey: "de-ue-sgb3-152-text", riskLevel: "high" },
  { key: "de-ue-u1-employee", category: "u1", type: "procedure", text: "Die zuständige Agentur für Arbeit stellt das PD U1 auch für abhängige Beschäftigungszeiten aus. Die genaue Stelle ist live zu bestimmen.", sourceKey: "de-ue-ba-antrag-se", passageKey: "de-ue-ba-antrag-se-text", riskLevel: "high" },
  { key: "de-ue-u1-self-employed", category: "u1", type: "procedure", text: "Das deutsche PD U1 erfasst ausdrücklich selbständige Erwerbstätigkeit, soweit Antragspflichtversicherung bestand. U1 ist nicht auf Arbeitnehmerzeiten beschränkt.", sourceKey: "de-ue-ba-antrag-se", passageKey: "de-ue-ba-antrag-se-text", riskLevel: "high" },
  { key: "de-ue-u1-not-award", category: "u1", type: "exception", text: "Der Besitz eines PD U1 ist nicht die Bewilligung von Arbeitslosengeld.", sourceKey: "de-ue-ba-antrag-se", passageKey: "de-ue-ba-antrag-se-text", riskLevel: "high" },
  { key: "de-ue-u2-before-departure", category: "u2", type: "procedure", text: "Der Antrag auf das PD U2 für die Ausfuhr deutschen Arbeitslosengeldes in die Slowakei ist vor der Abreise bei der zuständigen Agentur für Arbeit zu stellen.", sourceKey: "de-ue-agentur-locator", passageKey: "de-ue-agentur-locator-text", riskLevel: "high" },
  { key: "de-ue-u2-four-weeks", category: "u2", type: "definition", text: "Vor der Ausfuhr besteht regelmäßig eine vierwöchige Verfügbarkeit in Deutschland, soweit nicht eine verkürzte Abreise zugelassen ist.", sourceKey: "de-ue-agentur-locator", passageKey: "de-ue-agentur-locator-text", riskLevel: "high" },
  { key: "de-ue-u2-authorized-shortening", category: "u2", type: "exception", text: "Die Vier-Wochen-Frist vor der Ausreise kann zugelassen verkürzt werden; sie ist keine absolute Sperre ohne Prüfung.", sourceKey: "de-ue-agentur-locator", passageKey: "de-ue-agentur-locator-text", riskLevel: "high" },
  { key: "de-ue-incoming-sk-u2", category: "u2", type: "procedure", text: "Wer mit slowakischem PD U2 in Deutschland Arbeit sucht, registriert sich bei der deutschen Arbeitsvermittlung innerhalb der im PD U2 genannten Frist. Das begründet kein deutsches Arbeitslosengeld.", sourceKey: "de-ue-agentur-locator", passageKey: "de-ue-agentur-locator-text", riskLevel: "high" },
  { key: "de-ue-application-not-approval", category: "procedure", type: "exception", text: "Antrag, Meldung oder PD-Antrag ist nicht bereits bewilligter Anspruch.", sourceKey: "de-ue-agentur-locator", passageKey: "de-ue-agentur-locator-text", riskLevel: "high" },
  { key: "de-ue-art9-2025-se-coverage-possible", category: "article65a", type: "definition", text: "Nach der deutschen Artikel-9-Erklärung 2025, veröffentlicht am 6. August 2026, bietet deutsches Recht Selbständigen eine Einbeziehung in das Arbeitslosensystem über Antragspflichtversicherung. Deutschland ist kein Wohnstaat ohne Selbständigen-Arbeitslosensystem.", sourceKey: "de-ue-art9-2025", passageKey: "de-ue-art9-2025-text", riskLevel: "high" },
  { key: "de-ue-art9-not-eternal-false", category: "article65a", type: "procedure", text: "Die Feststellung, dass Deutschland Selbständigen-Deckung ermöglicht, ist CACHE_AND_REVALIDATE und nicht als zeitloses Nein zu Artikel 65a festzuschreiben.", sourceKey: "de-ue-art9-2025", passageKey: "de-ue-art9-2025-text", riskLevel: "high" },
  { key: "de-ue-system-coverage-not-person-insured", category: "article65a", type: "exception", text: "Die systemische Möglichkeit der Selbständigen-Arbeitslosenversicherung bedeutet nicht, dass die einzelne Person tatsächlich versichert war.", sourceKey: "de-ue-art9-2025", passageKey: "de-ue-art9-2025-text", riskLevel: "high" },
  { key: "de-ue-activity-change-reeval", category: "mixed", type: "procedure", text: "Wechsel von Beschäftigung zu Selbständigkeit oder umgekehrt erfordert neue Prüfung von Versicherung, Antragspflicht, Fristen und späteren U1-Nachweisen. Arbeitnehmerversicherung läuft nicht stillschweigend fort.", sourceKey: "de-ue-sgb3-28a", passageKey: "de-ue-sgb3-28a-text", riskLevel: "high" },
  { key: "de-ue-director-status-unclear", category: "mixed", type: "procedure", text: "Geschäftsführer, Gesellschafter oder Unternehmensinhaber sind nicht automatisch Arbeitnehmer oder Selbständige. Unklarer Status bleibt unbeantwortet.", sourceKey: "de-ue-ba-freiwillige", passageKey: "de-ue-ba-freiwillige-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "de-ue-dormant-gewerbe-not-activity", category: "mixed", type: "exception", text: "Ein ruhendes Gewerbe belegt weder aktive Selbständigkeit noch deren Ende. Nullumsatz ist nicht automatisch Arbeitslosigkeit.", sourceKey: "de-ue-sgb3-28a", passageKey: "de-ue-sgb3-28a-text", riskLevel: "high" },
]);

type ProcessSpec = Readonly<{
  key: string;
  title: string;
  trigger: string;
  safeFirstStep: string;
  riskLevel: "medium" | "high";
  dimensions: Readonly<Record<(typeof PROCESS_COMPLETE_DIMENSIONS)[number], string>>;
}>;

export const DE_UE_PROCESSES: readonly ProcessSpec[] = Object.freeze([
  { key: "de-ue-route-classify", title: "Deutschen Arbeitslosenweg 2026 einordnen", trigger: "Arbeitslosigkeit mit Deutschlandbezug, Träger oder Versicherungsweg unbekannt", safeFirstStep: "Agentur für Arbeit von Jobcenter, Finanzamt und Krankenkasse trennen; ALG-Kern nicht kopieren.", riskLevel: "high", dimensions: { what: "de-ue-agentur-role", whoWhen: "de-ue-agentur-instance-fetch-live", documents: "de-ue-channel-fetch-live", how: "de-ue-does-not-copy-alg-core", next: "de-ue-application-not-approval", deadlines: "de-ue-application-not-approval", problems: "de-ue-does-not-determine-art-11", dutiesAfter: "de-ue-activity-change-reeval", institution: "de-ue-agentur-role", boundaries: "de-ue-does-not-copy-eu-law", freshness: "de-ue-channel-fetch-live", negatives: "de-ue-finanzamt-not-u1" } },
  { key: DE_UE_PRIMARY_PROCESS_KEY, title: "Deutschen ALG-Weg mit Auslandsbezug 2026 führen", trigger: "Abhängig Beschäftigte Person mit deutschem ALG-Bezug oder Anspruch und Auslandsfakten", safeFirstStep: "Nationalen ALG-Kern nicht duplizieren; Agentur live bestimmen; ausländische Zeiten über U1 oder Trägeraustausch führen.", riskLevel: "high", dimensions: { what: "de-ue-agentur-role", whoWhen: "de-ue-agentur-instance-fetch-live", documents: "de-ue-channel-fetch-live", how: "de-ue-u1-employee", next: "de-ue-application-not-approval", deadlines: "de-ue-application-not-approval", problems: "de-ue-u1-not-award", dutiesAfter: "de-ue-activity-change-reeval", institution: "de-ue-agentur-role", boundaries: "de-ue-does-not-copy-alg-core", freshness: "de-ue-agentur-instance-fetch-live", negatives: "de-ue-u1-not-award" } },
  { key: "de-ue-28a-coverage-verify", title: "Deutsche §-28a-Deckung 2026 prüfen", trigger: "Selbständige Person in Deutschland verlangt Arbeitslosenversicherung oder ALG", safeFirstStep: "Versicherungspflichtverhältnis auf Antrag und freiwillige Arbeitslosenversicherung benennen; Gewerbe nicht als Deckung setzen.", riskLevel: "high", dimensions: { what: "de-ue-28a-legal-term", whoWhen: "de-ue-28a-user-term", documents: "de-ue-28a-coverage-evidence", how: "de-ue-28a-15h-entry", next: "de-ue-28a-3-month-deadline", deadlines: "de-ue-28a-3-month-deadline", problems: "de-ue-28a-12-in-30-or-benefit", dutiesAfter: "de-ue-28a-termination-review", institution: "de-ue-agentur-role", boundaries: "de-ue-28a-not-automatic", freshness: "de-ue-channel-fetch-live", negatives: "de-ue-gewerbe-not-28a" } },
  { key: "de-ue-former-self-employed-alg", title: "Frühere Selbständigkeit in deutsches ALG 2026 führen", trigger: "Ehemalige selbständige Person mit möglichen §-28a-Zeiten verlangt Arbeitslosengeld", safeFirstStep: "Tatsächliche Deckung, Beendigung der Tätigkeit und fiktive Bemessung trennen; Geschäftsaufgabe nicht als Automatikanspruch setzen.", riskLevel: "high", dimensions: { what: "de-ue-28a-periods-can-count", whoWhen: "de-ue-28a-coverage-evidence", documents: "de-ue-channel-fetch-live", how: "de-ue-fiktive-bemessung", next: "de-ue-application-not-approval", deadlines: "de-ue-28a-termination-review", problems: "de-ue-profit-not-bemessungsentgelt", dutiesAfter: "de-ue-activity-change-reeval", institution: "de-ue-agentur-role", boundaries: "de-ue-does-not-copy-alg-core", freshness: "de-ue-channel-fetch-live", negatives: "de-ue-business-failure-not-alg" } },
  { key: "de-ue-u1-issue", title: "Deutsches PD U1 2026 ausstellen lassen", trigger: "Deutsche Versicherungs-, Beschäftigungs- oder selbständige Zeiten sollen in einem anderen Staat nachgewiesen werden", safeFirstStep: "An die Agentur für Arbeit verweisen; Finanzamt, DRV und Krankenkasse nicht als Aussteller nennen.", riskLevel: "high", dimensions: { what: "de-ue-u1-employee", whoWhen: "de-ue-u1-self-employed", documents: "de-ue-channel-fetch-live", how: "de-ue-u1-self-employed", next: "de-ue-application-not-approval", deadlines: "de-ue-application-not-approval", problems: "de-ue-u1-not-award", dutiesAfter: "de-ue-activity-change-reeval", institution: "de-ue-agentur-role", boundaries: "de-ue-does-not-copy-eu-law", freshness: "de-ue-agentur-instance-fetch-live", negatives: "de-ue-finanzamt-not-u1" } },
  { key: "de-ue-foreign-u1-into-claim", title: "Ausländisches PD U1 in deutschen ALG-Antrag 2026", trigger: "Ausländische EU-Zeiten sollen in einen deutschen ALG-Anspruch eingehen", safeFirstStep: "U1 als Zeitennachweis führen, nicht als Bewilligung; Aggregation dem EU-Kern überlassen.", riskLevel: "high", dimensions: { what: "de-ue-u1-not-award", whoWhen: "de-ue-agentur-role", documents: "de-ue-channel-fetch-live", how: "de-ue-u1-employee", next: "de-ue-application-not-approval", deadlines: "de-ue-application-not-approval", problems: "de-ue-does-not-determine-art-11", dutiesAfter: "de-ue-activity-change-reeval", institution: "de-ue-agentur-role", boundaries: "de-ue-does-not-copy-eu-law", freshness: "de-ue-channel-fetch-live", negatives: "de-ue-u1-not-award" } },
  { key: "de-ue-u2-export-sk", title: "Deutsches ALG mit PD U2 in die Slowakei 2026 ausführen", trigger: "ALG-Beziehende Person will in der Slowakei Arbeit suchen", safeFirstStep: "Vor Abreise bei der Agentur U2 beantragen; Vier-Wochen-Regel und mögliche Verkürzung erklären.", riskLevel: "high", dimensions: { what: "de-ue-u2-before-departure", whoWhen: "de-ue-u2-four-weeks", documents: "de-ue-channel-fetch-live", how: "de-ue-u2-authorized-shortening", next: "de-ue-application-not-approval", deadlines: "de-ue-u2-before-departure", problems: "de-ue-u2-four-weeks", dutiesAfter: "de-ue-activity-change-reeval", institution: "de-ue-agentur-role", boundaries: "de-ue-does-not-copy-eu-law", freshness: "de-ue-agentur-instance-fetch-live", negatives: "de-ue-incoming-sk-u2" } },
  { key: "de-ue-incoming-sk-u2", title: "Eingehendes slowakisches PD U2 in Deutschland 2026", trigger: "Person mit slowakischem U2 registriert sich bei einer deutschen Agentur", safeFirstStep: "Als deutsche Arbeitsuchendmeldung im Export führen, nicht als neuen ALG-Antrag.", riskLevel: "high", dimensions: { what: "de-ue-incoming-sk-u2", whoWhen: "de-ue-agentur-role", documents: "de-ue-channel-fetch-live", how: "de-ue-incoming-sk-u2", next: "de-ue-application-not-approval", deadlines: "de-ue-application-not-approval", problems: "de-ue-application-not-approval", dutiesAfter: "de-ue-activity-change-reeval", institution: "de-ue-agentur-role", boundaries: "de-ue-does-not-copy-alg-core", freshness: "de-ue-agentur-instance-fetch-live", negatives: "de-ue-u1-not-award" } },
  { key: "de-ue-frontier-employee", title: "Deutschen Grenzgänger-Arbeitnehmerweg 2026 routen", trigger: "Wohnsitz SK oder DE, letzte abhängige Tätigkeit im anderen Staat, Rückkehr täglich oder wöchentlich", safeFirstStep: "Grenzarbeitnehmerstatus nicht aus Staatsangehörigkeit ableiten; Teil- und Vollarbeitslosigkeit trennen.", riskLevel: "high", dimensions: { what: "de-ue-agentur-role", whoWhen: "de-ue-does-not-copy-eu-law", documents: "de-ue-channel-fetch-live", how: "de-ue-u1-employee", next: "de-ue-application-not-approval", deadlines: "de-ue-application-not-approval", problems: "de-ue-does-not-determine-art-11", dutiesAfter: "de-ue-activity-change-reeval", institution: "de-ue-agentur-role", boundaries: "de-ue-does-not-copy-eu-law", freshness: "de-ue-channel-fetch-live", negatives: "de-ue-does-not-determine-art-11" } },
  { key: "de-ue-frontier-self-employed", title: "Deutschen selbständigen Grenzgängerweg 2026 routen", trigger: "Selbständige letzte Tätigkeit DE oder SK, Wohnsitz im anderen Staat, Grenzarbeitnehmerfakten", safeFirstStep: "Zuerst Artikel 65, nicht automatisch 65a; aktuelle deutsche Artikel-9-Erklärung 2025 revalidieren.", riskLevel: "high", dimensions: { what: "de-ue-art9-2025-se-coverage-possible", whoWhen: "de-ue-system-coverage-not-person-insured", documents: "de-ue-28a-coverage-evidence", how: "de-ue-art9-not-eternal-false", next: "de-ue-28a-not-automatic", deadlines: "de-ue-28a-3-month-deadline", problems: "de-ue-28a-not-automatic", dutiesAfter: "de-ue-28a-termination-review", institution: "de-ue-agentur-role", boundaries: "de-ue-does-not-copy-eu-law", freshness: "de-ue-art9-not-eternal-false", negatives: "de-ue-system-coverage-not-person-insured" } },
  { key: "de-ue-minor-self-employment", title: "ALG und geringfügige Selbständigkeit unter 15 Stunden 2026", trigger: "ALG-Beziehende Person übt Selbständigkeit oder mehrere Tätigkeiten aus", safeFirstStep: "Deutsche 15-Stunden-Grenze und Stundenaddition erklären; nicht als slowakische UoZ-Regel übertragen.", riskLevel: "high", dimensions: { what: "de-ue-15h-national-not-sk", whoWhen: "de-ue-side-income-boundary", documents: "de-ue-channel-fetch-live", how: "de-ue-side-income-boundary", next: "de-ue-application-not-approval", deadlines: "de-ue-application-not-approval", problems: "de-ue-15h-national-not-sk", dutiesAfter: "de-ue-activity-change-reeval", institution: "de-ue-agentur-role", boundaries: "de-ue-does-not-copy-alg-core", freshness: "de-ue-channel-fetch-live", negatives: "de-ue-profit-not-bemessungsentgelt" } },
  { key: "de-ue-activity-change", title: "Deutschen Tätigkeitswechsel 2026 neu bewerten", trigger: "Beschäftigung endet und Selbständigkeit beginnt oder umgekehrt, oder Geschäftsführerstatus unklar", safeFirstStep: "Anwendbare Rechtsvorschriften nicht neu erfinden; § 28a-Frist und ruhendes Gewerbe prüfen.", riskLevel: "high", dimensions: { what: "de-ue-activity-change-reeval", whoWhen: "de-ue-director-status-unclear", documents: "de-ue-28a-coverage-evidence", how: "de-ue-dormant-gewerbe-not-activity", next: "de-ue-28a-3-month-deadline", deadlines: "de-ue-28a-3-month-deadline", problems: "de-ue-director-status-unclear", dutiesAfter: "de-ue-28a-termination-review", institution: "de-ue-agentur-role", boundaries: "de-ue-does-not-determine-art-11", freshness: "de-ue-channel-fetch-live", negatives: "de-ue-gewerbe-not-28a" } },
]);

export const DE_UE_NEGATIVE_CONTROLS = Object.freeze([
  "de-ue-28a-not-automatic",
  "de-ue-gewerbe-not-28a",
  "de-ue-finanzamt-not-u1",
  "de-ue-krankenkasse-not-u1",
  "de-ue-drv-not-u1",
  "de-ue-u1-not-award",
  "de-ue-profit-not-bemessungsentgelt",
  "de-ue-business-failure-not-alg",
  "de-ue-15h-national-not-sk",
  "de-ue-system-coverage-not-person-insured",
  "de-ue-does-not-copy-eu-law",
  "de-ue-does-not-copy-alg-core",
]);

export function buildDeUnemploymentCoordinationRoutingPack() {
  const trustDomain = item("trustDomain", "de", { code: "de" as const, name: "Deutschland" });
  const jurisdiction = item("jurisdictions", "de", {
    level: "de_federal" as const, code: "DE" as const, countryCode: "DE" as const, name: "Bundesrepublik Deutschland",
  });
  const scope = item("territorialScopes", "de", {
    type: "federal", jurisdictionIds: [jurisdiction.id], landCodes: [], kreisCodes: [], municipalityCodes: [],
  });
  const publishers = {
    ba: item("publishers", "ba-unemployment-routing", {
      name: "Bundesagentur für Arbeit", type: "federal_agency",
      territorialScopeId: scope.id, trustDomainId: trustDomain.id,
    }),
    bmj: item("publishers", "bmj-sgb3-routing", {
      name: "Bundesministerium der Justiz – Gesetze im Internet", type: "federal_agency",
      territorialScopeId: scope.id, trustDomainId: trustDomain.id,
    }),
  };
  const authorities = {
    ba: item("authorities", "ba-agentur-routing-authority", {
      publisherId: publishers.ba.id, name: "Agentur für Arbeit", type: "federal_agency",
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      officialPortalUrl: "https://www.arbeitsagentur.de",
    }),
    bmj: item("authorities", "bmj-sgb3-routing-authority", {
      publisherId: publishers.bmj.id, name: "Gesetze im Internet", type: "federal_agency",
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      officialPortalUrl: "https://www.gesetze-im-internet.de",
    }),
  };
  const publisherOf = { ba: publishers.ba, bmj: publishers.bmj };
  const authorityOf = { ba: authorities.ba, bmj: authorities.bmj };
  const sources = DE_UE_OFFICIAL_SOURCES.map((spec) => {
    const publisher = publisherOf[spec.publisherKey];
    const authority = authorityOf[spec.publisherKey];
    const origin = `https://${spec.officialDomain}`;
    const source = item("sources", spec.key, {
      publisherId: publisher.id, authorityId: authority.id,
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      sourceType: "official_guidance", purpose: spec.title, canonicalUrl: spec.url,
      officialDomain: spec.officialDomain, normalizedOrigin: origin,
      sourceClass: spec.sourceClass, authorityLevel: "FEDERAL",
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
  const claims = DE_UE_UNITS.map((unit) => {
    const source = sourceByKey.get(unit.sourceKey);
    const passage = passageByKey.get(unit.passageKey);
    if (!source || !passage) throw new Error(`DE_UE_UNIT_SOURCE_MISSING:${unit.key}`);
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
  const processes = DE_UE_PROCESSES.map((spec) => item("processes", spec.key, {
    processGroupId: DE_UE_PROCESS_GROUP, title: spec.title, jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id, riskLevel: spec.riskLevel, trigger: spec.trigger,
    safeFirstStep: spec.safeFirstStep, regionalVariationExpected: false,
  }));
  const processByKey = new Map(processes.map((process) => [String(process.key), process]));
  const claimByKey = new Map(claims.map(({ claim }) => [String(claim.key), claim]));
  const processClaimLinks: Entity[] = [];
  const seen = new Set<string>();
  for (const process of DE_UE_PROCESSES) {
    for (const dimension of PROCESS_COMPLETE_DIMENSIONS) {
      const claimKey = process.dimensions[dimension];
      const token = `${process.key}:${claimKey}:${dimension}`;
      if (seen.has(token)) continue;
      const stored = processByKey.get(process.key);
      const claim = claimByKey.get(claimKey);
      if (!stored || !claim) throw new Error(`DE_UE_PROCESS_CLAIM_MISSING:${process.key}:${claimKey}`);
      seen.add(token);
      processClaimLinks.push(item("processClaimLinks", token, {
        processId: stored.id, claimId: claim.id, role: dimension, required: true,
        sequenceContext: dimension, qualificationRequired: false,
      }));
    }
  }
  return Object.freeze({
    schemaVersion: 1,
    packId: DE_UE_PACK_ID,
    canonicalLanguage: "de" as const,
    trustDomain,
    jurisdictions: [jurisdiction],
    territorialScopes: [scope],
    publishers: [publishers.ba, publishers.bmj],
    authorities: [authorities.ba, authorities.bmj],
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
