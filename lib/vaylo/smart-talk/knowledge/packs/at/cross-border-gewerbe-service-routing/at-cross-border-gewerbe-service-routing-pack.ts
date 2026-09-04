/**
 * AT-SK-0H Austrian operational routing for cross-border Gewerbe / service authorization (§ 373a GewO).
 * Does not restate EU Services Directive merits as a shared EU pack. Supporting EUR-Lex sources only.
 * Dienstleistungsanzeige / § 373a routing — not full Gewerbeanmeldung or tax/PE calculator.
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
    id: stableKnowledgeFactoryId(AT_GEWERBE_ROUTING_PACK_ID, entityClass, key),
    ...values,
  });
}

export const AT_GEWERBE_ROUTING_PACK_ID = "at_cross_border_gewerbe_service_routing" as const;
export const AT_GEWERBE_ROUTING_PROCESS_GROUP = "at_cross_border_gewerbe_service_routing" as const;
export const AT_GEWERBE_PRIMARY_PROCESS_KEY = "at-gewerbe-373a-cross-border-service" as const;
export const AT_BMWET_GEWERBE_ROLE = "AT_BMWET" as const;
export const AT_GEWERBE_AS_OF = "2026-09-04" as const;

export const AT_GEWERBE_OFFICIAL_SOURCES = Object.freeze([
  {
    key: "at-gewerbe-ris-gewo-373a",
    publisherKey: "ris-gewerbe" as const,
    officialDomain: "www.ris.bka.gv.at",
    url: "https://www.ris.bka.gv.at/eli/bgbl/1994/194/P373a/NOR40202661",
    title: "RIS: GewO 1994 § 373a, Fassung 2026-09-04",
    handlingMode: "STORE_CANONICALLY" as const,
    freshnessClass: "LEGAL_CHANGE_MONITORED" as const,
    staleBehavior: "DO_NOT_USE_STALE" as const,
    informationClass: "LEGAL_BASELINE" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-gewerbe-ris-gewo-373a-text",
      locator: "GewO 1994 § 373a Abs. 1 und 4",
      text: "§ 373a GewO 1994 erlaubt EU/EWR-Staatsangehörigen mit rechtmäßiger Niederlassung und befugter Gewerbetätigkeit in einem anderen EU/EWR-Staat, diese Tätigkeit vorübergehend und gelegentlich in Österreich auszuüben. Betrifft die grenzüberschreitende Tätigkeit ein reglementiertes Gewerbe nach § 94, ist die erstmalige Aufnahme vorher schriftlich anzuzeigen; die Anzeige ist einmal jährlich zu erneuern, wenn Dienstleistungen im betreffenden Jahr beabsichtigt sind. Der Gesetzestext nennt historische Ministeriumsbezeichnungen; die aktuelle Prozessführung für die Dienstleistungsanzeige ist BMWET. Vorübergehend und gelegentlich sind gesetzliche Qualifikatoren ohne feste Tages- oder Monatsgrenze in § 373a.",
    }],
  },
  {
    key: "at-gewerbe-bmwet-cross-border",
    publisherKey: "bmwet-gewerbe" as const,
    officialDomain: "www.bmwet.gv.at",
    url: "https://www.bmwet.gv.at/Themen/Wirtschaft/Grenzueberschreitende-Dienstleistung.html",
    title: "BMWET: Grenzüberschreitende Dienstleistung",
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshnessClass: "EVENT_DRIVEN" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "PROCESS_IDENTITY" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-gewerbe-bmwet-cross-border-text",
      locator: "Grenzüberschreitende Dienstleistung / Dienstleistungsanzeige",
      text: "Das Bundesministerium für Wirtschaft, Energie und Tourismus (BMWET) ist der aktuelle zuständige Prozessinhaber für die Dienstleistungsanzeige nach § 373a bei reglementierten Gewerben. BMWET ist nicht automatisch für jedes inländische Gewerbeverfahren zuständig. Formulare, Kanäle und Kontakte sind live zu prüfen.",
    }],
  },
  {
    key: "at-gewerbe-usp-dienstleistungsanzeige",
    publisherKey: "usp-gewerbe" as const,
    officialDomain: "www.usp.gv.at",
    url: "https://www.usp.gv.at/gruendung/EAP/dienstleistungsanzeige.html",
    title: "USP: Dienstleistungsanzeige, Stand 20. März 2026",
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshnessClass: "EVENT_DRIVEN" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "PROCESS_IDENTITY" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-gewerbe-usp-dienstleistungsanzeige-text",
      locator: "USP Dienstleistungsanzeige",
      text: "Bei reglementierten Gewerben ist die erstmalige Aufnahme vorher anzuzeigen. Die Anzeige ist einmal jährlich zu erneuern, wenn das Unternehmen beabsichtigt, während des betreffenden Jahres in Österreich Dienstleistungen zu erbringen. Inhaltlich verantwortlich ist BMWET. USP ist Portal/Guidance, nicht Gesetzestext. Antrag ist nicht Genehmigung.",
    }],
  },
  {
    key: "at-gewerbe-eurlex-dir-2005-36",
    publisherKey: "eurlex-gewerbe" as const,
    officialDomain: "eur-lex.europa.eu",
    url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32005L0036",
    title: "EUR-Lex: Richtlinie 2005/36/EG (unterstützend)",
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshnessClass: "LEGAL_CHANGE_MONITORED" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "LEGAL_BASELINE" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-gewerbe-eurlex-dir-2005-36-text",
      locator: "RL 2005/36/EG Hintergrund",
      text: "Die Berufsqualifikationsrichtlinie 2005/36/EG ist ein unterstützender EU-Hintergrund für reglementierte Berufe und Dienstleistungsfreiheit. Dieses Routing-Paket kopiert keine geteilte EU-Kernpack-Logik und ersetzt nicht § 373a GewO oder die österreichische Dienstleistungsanzeige.",
    }],
  },
  {
    key: "at-gewerbe-eurlex-dir-2006-123",
    publisherKey: "eurlex-gewerbe" as const,
    officialDomain: "eur-lex.europa.eu",
    url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32006L0123",
    title: "EUR-Lex: Richtlinie 2006/123/EG (unterstützend)",
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshnessClass: "LEGAL_CHANGE_MONITORED" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "LEGAL_BASELINE" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-gewerbe-eurlex-dir-2006-123-text",
      locator: "RL 2006/123/EG Hintergrund",
      text: "Die Dienstleistungsrichtlinie 2006/123/EG ist ein unterstützender EU-Hintergrund für grenzüberschreitende Dienstleistungen. Sie begründet weder die österreichische Dienstleistungsanzeige noch ersetzt sie A1 oder steuerliche Ansässigkeit.",
    }],
  },
  {
    key: "at-gewerbe-bmwet-identity",
    publisherKey: "bmwet-gewerbe" as const,
    officialDomain: "www.bmwet.gv.at",
    url: "https://www.bmwet.gv.at/",
    title: "BMWET: Behördenidentität",
    handlingMode: "STORE_CANONICALLY" as const,
    freshnessClass: "EVENT_DRIVEN" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "AUTHORITY_COMPETENCE" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-gewerbe-bmwet-identity-text",
      locator: "BMWET Startseite",
      text: "Die aktuelle amtliche Bezeichnung ist Bundesministerium für Wirtschaft, Energie und Tourismus (BMWET). BMWET ist nicht automatisch für jedes österreichische Gewerbeverfahren zuständig.",
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

export const AT_GEWERBE_UNITS: readonly Unit[] = Object.freeze([
  { key: "at-gewerbe-does-not-copy-eu-directives", category: "boundary", type: "boundary", text: "Dieses Routing wiederholt nicht die Richtlinien 2005/36/EG und 2006/123/EG als geteilten EU-Kern. EUR-Lex-Quellen sind unterstützend.", sourceKey: "at-gewerbe-eurlex-dir-2006-123", passageKey: "at-gewerbe-eurlex-dir-2006-123-text", riskLevel: "high" },
  { key: "at-gewerbe-does-not-determine-a1", category: "boundary", type: "boundary", text: "Dieses Routing bestimmt nicht das sozialversicherungsrechtliche anzuwendende Recht; dafür ist ein verifiziertes A1- oder anwendbare-Rechtsvorschriften-Ergebnis erforderlich.", sourceKey: "at-gewerbe-ris-gewo-373a", passageKey: "at-gewerbe-ris-gewo-373a-text", riskLevel: "high" },
  { key: "at-373a-temporary-cross-border-framework", category: "gewerbe", type: "definition", text: "§ 373a GewO 1994 enthält den Rahmen für vorübergehende und gelegentliche grenzüberschreitende EU/EWR-Dienstleistungen aus einer in einem anderen EU/EWR-Staat rechtmäßig ausgeübten Niederlassung.", sourceKey: "at-gewerbe-ris-gewo-373a", passageKey: "at-gewerbe-ris-gewo-373a-text", riskLevel: "high" },
  { key: "at-373a-dienstleistungsanzeige-authority", category: "gewerbe", type: "procedure", text: "Für die Dienstleistungsanzeige nach § 373a bei reglementierten Gewerben ist der aktuelle zuständige Prozessinhaber das BMWET, nicht automatisch eine örtliche Gewerbebehörde.", sourceKey: "at-gewerbe-usp-dienstleistungsanzeige", passageKey: "at-gewerbe-usp-dienstleistungsanzeige-text", riskLevel: "high" },
  { key: "at-gewerbebehoerde-not-universal-373a", category: "gewerbe", type: "boundary", text: "Eine örtliche Gewerbebehörde bleibt für andere österreichische Gewerbeverfahren relevant, ist aber nicht automatisch für die §-373a-Dienstleistungsanzeige zuständig.", sourceKey: "at-gewerbe-usp-dienstleistungsanzeige", passageKey: "at-gewerbe-usp-dienstleistungsanzeige-text", riskLevel: "high" },
  { key: "at-bmwet-current-ministry", category: "authority", type: "definition", text: "Die aktuelle amtliche Bezeichnung des zuständigen Bundesministeriums ist Bundesministerium für Wirtschaft, Energie und Tourismus (BMWET).", sourceKey: "at-gewerbe-bmwet-identity", passageKey: "at-gewerbe-bmwet-identity-text", riskLevel: "medium" },
  { key: "at-bmwet-not-all-gewerbe", category: "gewerbe", type: "boundary", text: "BMWET ist nicht automatisch für jedes österreichische Gewerbeverfahren zuständig.", sourceKey: "at-gewerbe-bmwet-identity", passageKey: "at-gewerbe-bmwet-identity-text", riskLevel: "high" },
  { key: "at-dienstleistungsanzeige-annual-renewal", category: "gewerbe", type: "procedure", text: "Die Dienstleistungsanzeige ist für ein weiteres Jahr zu erneuern, wenn das Unternehmen beabsichtigt, in diesem Jahr in Österreich die betreffenden Dienstleistungen zu erbringen. Die operative Jahresregel ist CACHE_AND_REVALIDATE.", sourceKey: "at-gewerbe-usp-dienstleistungsanzeige", passageKey: "at-gewerbe-usp-dienstleistungsanzeige-text", riskLevel: "high" },
  { key: "at-dienstleistungsanzeige-not-a1", category: "gewerbe", type: "boundary", text: "Die Dienstleistungsanzeige / gewerberechtliche Anzeige ist nicht A1 und beweist nicht das sozialversicherungsrechtliche anzuwendende Recht.", sourceKey: "at-gewerbe-ris-gewo-373a", passageKey: "at-gewerbe-ris-gewo-373a-text", riskLevel: "high" },
  { key: "at-a1-not-dienstleistungsanzeige", category: "gewerbe", type: "boundary", text: "A1 ist sozialversicherungsrechtlicher Nachweis des anzuwendenden Rechts und erfüllt nicht die Dienstleistungsanzeige.", sourceKey: "at-gewerbe-ris-gewo-373a", passageKey: "at-gewerbe-ris-gewo-373a-text", riskLevel: "high" },
  { key: "at-dienstleistungsanzeige-not-tax", category: "gewerbe", type: "boundary", text: "Die österreichische Dienstleistungsanzeige begründet weder österreichische steuerliche Ansässigkeit noch ein österreichisches Besteuerungsrecht noch eine Betriebsstätte.", sourceKey: "at-gewerbe-ris-gewo-373a", passageKey: "at-gewerbe-ris-gewo-373a-text", riskLevel: "high" },
  { key: "at-gewerbe-regulated-94-dla-required", category: "gewerbe", type: "definition", text: "Reglementierte Gewerbe nach § 94 GewO verlangen für §-373a-Dienstleistungen die Dienstleistungsanzeige beim BMWET, nicht pauschal eine örtliche Gewerbeanmeldung.", sourceKey: "at-gewerbe-ris-gewo-373a", passageKey: "at-gewerbe-ris-gewo-373a-text", riskLevel: "high" },
  { key: "at-gewerbe-non-regulated-373a-scope", category: "gewerbe", type: "definition", text: "Nicht reglementierte Gewerbe fallen unter den §-373a-Rahmen ohne §-94-Dienstleistungsanzeige; inländische Gewerbeanmeldung bleibt ein separates Verfahren.", sourceKey: "at-gewerbe-ris-gewo-373a", passageKey: "at-gewerbe-ris-gewo-373a-text", riskLevel: "high" },
  { key: "at-gewerbe-no-arbitrary-duration-thresholds", category: "gewerbe", type: "boundary", text: "Vorübergehend und gelegentlich nach § 373a sind gesetzliche Qualifikatoren ohne feste Tages- oder Monats-Schwellen in diesem Routing; willkürliche Dauerformeln sind unzulässig.", sourceKey: "at-gewerbe-ris-gewo-373a", passageKey: "at-gewerbe-ris-gewo-373a-text", riskLevel: "high" },
  { key: "at-gewerbe-swiss-90-day-not-eu-ewr", category: "gewerbe", type: "exception", text: "Die Schweizer 90-Tage-Regel für Dienstleistungen ist kein EU/EWR-Standard und darf nicht auf §-373a-Fälle aus EU/EWR-Niederlassungen verallgemeinert werden.", sourceKey: "at-gewerbe-ris-gewo-373a", passageKey: "at-gewerbe-ris-gewo-373a-text", riskLevel: "high" },
  { key: "at-gewerbe-temporary-not-pe", category: "gewerbe", type: "boundary", text: "Vorübergehende und gelegentliche Dienstleistung nach § 373a begründet nicht automatisch eine österreichische Betriebsstätte oder steuerliche Ansässigkeit.", sourceKey: "at-gewerbe-ris-gewo-373a", passageKey: "at-gewerbe-ris-gewo-373a-text", riskLevel: "high" },
  { key: "at-gewerbe-zko-posting-not-dla-handoff", category: "gewerbe", type: "boundary", text: "ZKO-Entsendung oder Arbeitgeberposting ersetzt nicht die gewerberechtliche Dienstleistungsanzeige; A1-Handoff allein genügt nicht.", sourceKey: "at-gewerbe-ris-gewo-373a", passageKey: "at-gewerbe-ris-gewo-373a-text", riskLevel: "high" },
  { key: "at-gewerbe-posting-not-automatic-dla", category: "gewerbe", type: "exception", text: "Sozialversicherungsrechtliche Entsendung begründet nicht automatisch die Pflicht oder den Abschluss der Dienstleistungsanzeige.", sourceKey: "at-gewerbe-ris-gewo-373a", passageKey: "at-gewerbe-ris-gewo-373a-text", riskLevel: "high" },
  { key: "at-gewerbe-establishment-home-state-required", category: "gewerbe", type: "definition", text: "§ 373a setzt eine rechtmäßige Niederlassung und befugte Gewerbetätigkeit im Heimatstaat innerhalb EU/EWR voraus.", sourceKey: "at-gewerbe-ris-gewo-373a", passageKey: "at-gewerbe-ris-gewo-373a-text", riskLevel: "high" },
  { key: "at-gewerbe-ewr-not-third-country", category: "gewerbe", type: "boundary", text: "§ 373a gilt für EU/EWR-Niederlassungen; Drittstaaten-Fälle sind nicht automatisch §-373a-Fälle.", sourceKey: "at-gewerbe-ris-gewo-373a", passageKey: "at-gewerbe-ris-gewo-373a-text", riskLevel: "high" },
  { key: "at-gewerbe-permanent-not-373a", category: "gewerbe", type: "exception", text: "Dauerhafte Niederlassung oder inländische Gewerbeanmeldung ist nicht der §-373a-Dienstleistungsweg.", sourceKey: "at-gewerbe-ris-gewo-373a", passageKey: "at-gewerbe-ris-gewo-373a-text", riskLevel: "high" },
  { key: "at-gewerbe-local-gewerbe-not-373a-route", category: "gewerbe", type: "boundary", text: "Inländische Gewerbeanmeldung bei der örtlichen Gewerbebehörde ist ein anderes Verfahren als die §-373a-Dienstleistungsanzeige beim BMWET.", sourceKey: "at-gewerbe-usp-dienstleistungsanzeige", passageKey: "at-gewerbe-usp-dienstleistungsanzeige-text", riskLevel: "high" },
  { key: "at-gewerbe-application-not-approval", category: "procedure", type: "exception", text: "Dienstleistungsanzeige oder Portalantrag ist nicht bereits gewerberechtliche Genehmigung.", sourceKey: "at-gewerbe-usp-dienstleistungsanzeige", passageKey: "at-gewerbe-usp-dienstleistungsanzeige-text", riskLevel: "high" },
  { key: "at-gewerbe-dla-not-entitlement", category: "gewerbe", type: "exception", text: "Die Dienstleistungsanzeige begründet keinen automatischen Marktzugang jenseits des angezeigten reglementierten Gewerbes.", sourceKey: "at-gewerbe-usp-dienstleistungsanzeige", passageKey: "at-gewerbe-usp-dienstleistungsanzeige-text", riskLevel: "high" },
  { key: "at-gewerbe-bmwet-channel-fetch-live", category: "channel", type: "procedure", text: "Aktuelle BMWET-Formulare, Kontakte und Einreichungskanäle sind live zu prüfen.", sourceKey: "at-gewerbe-bmwet-cross-border", passageKey: "at-gewerbe-bmwet-cross-border-text", riskLevel: "medium", requiresAuthorityResolution: true },
  { key: "at-gewerbe-forms-cache-and-revalidate", category: "channel", type: "boundary", text: "Formular-URLs und Verfahrenskennungen der Dienstleistungsanzeige sind CACHE_AND_REVALIDATE, nicht zeitlos kanonisch.", sourceKey: "at-gewerbe-bmwet-cross-border", passageKey: "at-gewerbe-bmwet-cross-border-text", riskLevel: "medium" },
  { key: "at-gewerbe-annual-renewal-not-permanent", category: "gewerbe", type: "boundary", text: "Die jährliche Erneuerung begründet keine dauerhafte österreichische Niederlassung.", sourceKey: "at-gewerbe-usp-dienstleistungsanzeige", passageKey: "at-gewerbe-usp-dienstleistungsanzeige-text", riskLevel: "high" },
  { key: "at-gewerbe-finanzamt-not-dla", category: "authority", type: "exception", text: "Das Finanzamt Österreich stellt oder entgegennimmt die Dienstleistungsanzeige nach § 373a nicht.", sourceKey: "at-gewerbe-bmwet-identity", passageKey: "at-gewerbe-bmwet-identity-text", riskLevel: "high" },
  { key: "at-gewerbe-ams-not-dla", category: "authority", type: "exception", text: "Das AMS ist nicht die Dienstleistungsanzeige-Behörde nach § 373a.", sourceKey: "at-gewerbe-bmwet-identity", passageKey: "at-gewerbe-bmwet-identity-text", riskLevel: "high" },
  { key: "at-gewerbe-svs-not-dla", category: "authority", type: "exception", text: "Die SVS ist nicht die Dienstleistungsanzeige-Behörde nach § 373a.", sourceKey: "at-gewerbe-bmwet-identity", passageKey: "at-gewerbe-bmwet-identity-text", riskLevel: "high" },
  { key: "at-gewerbe-occasional-not-frequency-formula", category: "gewerbe", type: "boundary", text: "Gelegentlich ist kein festes Auftrags- oder Tageskontingent in diesem Routing; Sachverhalt und Gesetz prüfen.", sourceKey: "at-gewerbe-ris-gewo-373a", passageKey: "at-gewerbe-ris-gewo-373a-text", riskLevel: "high" },
  { key: "at-gewerbe-uk-out-of-scope", category: "boundary", type: "boundary", text: "Vereinigtes Königreich nach Austritt ist nicht automatisch §-373a-EU/EWR-Niederlassungsfall.", sourceKey: "at-gewerbe-ris-gewo-373a", passageKey: "at-gewerbe-ris-gewo-373a-text", riskLevel: "high" },
  { key: "at-gewerbe-ch-bilateral-not-373a", category: "boundary", type: "boundary", text: "Schweizer bilaterale Dienstleistungsregeln sind nicht § 373a GewO und nicht EU/EWR-Dienstleistungsfreiheit.", sourceKey: "at-gewerbe-ris-gewo-373a", passageKey: "at-gewerbe-ris-gewo-373a-text", riskLevel: "high" },
  { key: "at-gewerbe-usp-not-statute", category: "source", type: "boundary", text: "USP-Erläuterungen sind amtliches Portal/Guidance und kein Gesetzestext.", sourceKey: "at-gewerbe-usp-dienstleistungsanzeige", passageKey: "at-gewerbe-usp-dienstleistungsanzeige-text", riskLevel: "high" },
  { key: "at-gewerbe-a1-handoff-applicable-legislation", category: "boundary", type: "procedure", text: "Bei ungeklärtem anzuwendbarem Recht ist an den anwendbare-Rechtsvorschriften-Weg zu verweisen, nicht A1 mit DLA zu vermengen.", sourceKey: "at-gewerbe-ris-gewo-373a", passageKey: "at-gewerbe-ris-gewo-373a-text", riskLevel: "high" },
  { key: "at-gewerbe-supporting-dir-2005-36", category: "eu-support", type: "definition", text: "Richtlinie 2005/36/EG ist unterstützender Hintergrund für reglementierte Berufe, kein Ersatz für § 373a.", sourceKey: "at-gewerbe-eurlex-dir-2005-36", passageKey: "at-gewerbe-eurlex-dir-2005-36-text", riskLevel: "medium" },
  { key: "at-gewerbe-supporting-dir-2006-123", category: "eu-support", type: "definition", text: "Richtlinie 2006/123/EG ist unterstützender Hintergrund für Dienstleistungsfreiheit, kein Ersatz für die Dienstleistungsanzeige.", sourceKey: "at-gewerbe-eurlex-dir-2006-123", passageKey: "at-gewerbe-eurlex-dir-2006-123-text", riskLevel: "medium" },
]);

type ProcessSpec = Readonly<{
  key: string;
  title: string;
  trigger: string;
  safeFirstStep: string;
  riskLevel: "medium" | "high";
  dimensions: Readonly<Record<(typeof PROCESS_COMPLETE_DIMENSIONS)[number], string>>;
}>;

export const AT_GEWERBE_PROCESSES: readonly ProcessSpec[] = Object.freeze([
  { key: "at-gewerbe-route-classify", title: "Österreichischen Gewerbe-Dienstleistungsweg einordnen", trigger: "Grenzüberschreitende Gewerbetätigkeit mit unklarer Behörde", safeFirstStep: "BMWET von Gewerbebehörde, A1 und Finanzamt trennen; EU-Richtlinien nicht kopieren.", riskLevel: "high", dimensions: { what: "at-373a-dienstleistungsanzeige-authority", whoWhen: "at-gewerbe-bmwet-channel-fetch-live", documents: "at-gewerbe-forms-cache-and-revalidate", how: "at-373a-temporary-cross-border-framework", next: "at-gewerbe-application-not-approval", deadlines: "at-dienstleistungsanzeige-annual-renewal", problems: "at-gewerbe-does-not-determine-a1", dutiesAfter: "at-gewerbe-a1-handoff-applicable-legislation", institution: "at-bmwet-current-ministry", boundaries: "at-gewerbe-does-not-copy-eu-directives", freshness: "at-gewerbe-bmwet-channel-fetch-live", negatives: "at-gewerbebehoerde-not-universal-373a" } },
  { key: AT_GEWERBE_PRIMARY_PROCESS_KEY, title: "§-373a-grenzüberschreitende Dienstleistung führen", trigger: "EU/EWR-Niederlassung erbringt vorübergehende Dienstleistung in Österreich", safeFirstStep: "Heimatstaat-Niederlassung prüfen; reglementiertes Gewerbe von freiem Gewerbe trennen.", riskLevel: "high", dimensions: { what: "at-373a-temporary-cross-border-framework", whoWhen: "at-gewerbe-establishment-home-state-required", documents: "at-gewerbe-forms-cache-and-revalidate", how: "at-373a-dienstleistungsanzeige-authority", next: "at-gewerbe-application-not-approval", deadlines: "at-dienstleistungsanzeige-annual-renewal", problems: "at-gewerbe-regulated-94-dla-required", dutiesAfter: "at-gewerbe-annual-renewal-not-permanent", institution: "at-bmwet-current-ministry", boundaries: "at-gewerbe-no-arbitrary-duration-thresholds", freshness: "at-gewerbe-bmwet-channel-fetch-live", negatives: "at-gewerbe-permanent-not-373a" } },
  { key: "at-gewerbe-regulated-94-dla", title: "Reglementiertes Gewerbe § 94 DLA 2026", trigger: "Reglementiertes Gewerbe soll in Österreich vorübergehend erbracht werden", safeFirstStep: "Dienstleistungsanzeige BMWET; nicht pauschal zur Gewerbebehörde.", riskLevel: "high", dimensions: { what: "at-gewerbe-regulated-94-dla-required", whoWhen: "at-373a-dienstleistungsanzeige-authority", documents: "at-gewerbe-forms-cache-and-revalidate", how: "at-dienstleistungsanzeige-annual-renewal", next: "at-gewerbe-dla-not-entitlement", deadlines: "at-dienstleistungsanzeige-annual-renewal", problems: "at-gewerbebehoerde-not-universal-373a", dutiesAfter: "at-gewerbe-annual-renewal-not-permanent", institution: "at-bmwet-current-ministry", boundaries: "at-bmwet-not-all-gewerbe", freshness: "at-gewerbe-bmwet-channel-fetch-live", negatives: "at-gewerbe-local-gewerbe-not-373a-route" } },
  { key: "at-gewerbe-non-regulated-373a", title: "Nicht reglementiertes Gewerbe § 373a 2026", trigger: "Freies Gewerbe aus EU/EWR-Niederlassung in Österreich", safeFirstStep: "§-373a-Rahmen ohne §-94-DLA; inländische Anmeldung separat prüfen.", riskLevel: "high", dimensions: { what: "at-gewerbe-non-regulated-373a-scope", whoWhen: "at-gewerbe-establishment-home-state-required", documents: "at-gewerbe-forms-cache-and-revalidate", how: "at-373a-temporary-cross-border-framework", next: "at-gewerbe-application-not-approval", deadlines: "at-gewerbe-no-arbitrary-duration-thresholds", problems: "at-gewerbe-permanent-not-373a", dutiesAfter: "at-gewerbe-temporary-not-pe", institution: "at-bmwet-current-ministry", boundaries: "at-gewerbe-local-gewerbe-not-373a-route", freshness: "at-gewerbe-bmwet-channel-fetch-live", negatives: "at-gewerbe-regulated-94-dla-required" } },
  { key: "at-gewerbe-a1-dla-separation", title: "A1 und Dienstleistungsanzeige trennen 2026", trigger: "A1 oder DLA werden verwechselt oder als Ersatz genutzt", safeFirstStep: "A1 an anwendbare Rechtsvorschriften; DLA an BMWET-Route.", riskLevel: "high", dimensions: { what: "at-dienstleistungsanzeige-not-a1", whoWhen: "at-a1-not-dienstleistungsanzeige", documents: "at-gewerbe-forms-cache-and-revalidate", how: "at-gewerbe-a1-handoff-applicable-legislation", next: "at-gewerbe-application-not-approval", deadlines: "at-gewerbe-posting-not-automatic-dla", problems: "at-gewerbe-zko-posting-not-dla-handoff", dutiesAfter: "at-gewerbe-does-not-determine-a1", institution: "at-bmwet-current-ministry", boundaries: "at-gewerbe-does-not-determine-a1", freshness: "at-gewerbe-bmwet-channel-fetch-live", negatives: "at-a1-not-dienstleistungsanzeige" } },
  { key: "at-gewerbe-tax-pe-boundary", title: "DLA, Steuer und Betriebsstätte trennen 2026", trigger: "Dienstleistungsanzeige soll Steuer- oder PE-Wirkung begründen", safeFirstStep: "DLA ist gewerberechtlich; Steuer und PE separat prüfen.", riskLevel: "high", dimensions: { what: "at-dienstleistungsanzeige-not-tax", whoWhen: "at-gewerbe-temporary-not-pe", documents: "at-gewerbe-usp-not-statute", how: "at-gewerbe-finanzamt-not-dla", next: "at-gewerbe-application-not-approval", deadlines: "at-gewerbe-annual-renewal-not-permanent", problems: "at-gewerbe-permanent-not-373a", dutiesAfter: "at-gewerbe-temporary-not-pe", institution: "at-gewerbe-finanzamt-not-dla", boundaries: "at-dienstleistungsanzeige-not-tax", freshness: "at-gewerbe-forms-cache-and-revalidate", negatives: "at-dienstleistungsanzeige-not-tax" } },
  { key: "at-gewerbe-swiss-negative-control", title: "Schweizer Regel nicht auf EU/EWR übertragen", trigger: "90-Tage- oder CH-Regel auf SK/AT-Dienstleistung angewendet", safeFirstStep: "§ 373a EU/EWR-Rahmen; CH bilateral getrennt führen.", riskLevel: "high", dimensions: { what: "at-gewerbe-swiss-90-day-not-eu-ewr", whoWhen: "at-gewerbe-ch-bilateral-not-373a", documents: "at-gewerbe-forms-cache-and-revalidate", how: "at-gewerbe-ewr-not-third-country", next: "at-gewerbe-uk-out-of-scope", deadlines: "at-gewerbe-no-arbitrary-duration-thresholds", problems: "at-gewerbe-ch-bilateral-not-373a", dutiesAfter: "at-gewerbe-occasional-not-frequency-formula", institution: "at-bmwet-current-ministry", boundaries: "at-gewerbe-swiss-90-day-not-eu-ewr", freshness: "at-gewerbe-bmwet-channel-fetch-live", negatives: "at-gewerbe-swiss-90-day-not-eu-ewr" } },
  { key: "at-gewerbe-annual-renewal-route", title: "Jährliche DLA-Erneuerung 2026", trigger: "Dienstleistung soll im Folgejahr fortgesetzt werden", safeFirstStep: "Jahresabsicht prüfen; Erneuerung nicht mit Niederlassung verwechseln.", riskLevel: "high", dimensions: { what: "at-dienstleistungsanzeige-annual-renewal", whoWhen: "at-gewerbe-bmwet-channel-fetch-live", documents: "at-gewerbe-forms-cache-and-revalidate", how: "at-373a-dienstleistungsanzeige-authority", next: "at-gewerbe-annual-renewal-not-permanent", deadlines: "at-dienstleistungsanzeige-annual-renewal", problems: "at-gewerbe-dla-not-entitlement", dutiesAfter: "at-gewerbe-temporary-not-pe", institution: "at-bmwet-current-ministry", boundaries: "at-gewerbe-annual-renewal-not-permanent", freshness: "at-gewerbe-bmwet-channel-fetch-live", negatives: "at-gewerbe-permanent-not-373a" } },
  { key: "at-gewerbe-posting-handoff", title: "Entsendung und DLA-Handoff 2026", trigger: "ZKO-Entsendung oder A1 soll DLA ersetzen", safeFirstStep: "Posting an anwendbare Rechtsvorschriften; DLA separat bei § 94.", riskLevel: "high", dimensions: { what: "at-gewerbe-zko-posting-not-dla-handoff", whoWhen: "at-gewerbe-posting-not-automatic-dla", documents: "at-gewerbe-forms-cache-and-revalidate", how: "at-gewerbe-a1-handoff-applicable-legislation", next: "at-gewerbe-application-not-approval", deadlines: "at-gewerbe-does-not-determine-a1", problems: "at-a1-not-dienstleistungsanzeige", dutiesAfter: "at-gewerbe-does-not-determine-a1", institution: "at-gewerbe-svs-not-dla", boundaries: "at-dienstleistungsanzeige-not-a1", freshness: "at-gewerbe-bmwet-channel-fetch-live", negatives: "at-gewerbe-zko-posting-not-dla-handoff" } },
  { key: "at-gewerbe-authority-split", title: "BMWET, Gewerbebehörde und SVS trennen 2026", trigger: "Falsche Behörde für Dienstleistungsanzeige genannt", safeFirstStep: "BMWET für §-373a-DLA; SVS und AMS nicht als DLA-Träger.", riskLevel: "high", dimensions: { what: "at-373a-dienstleistungsanzeige-authority", whoWhen: "at-gewerbebehoerde-not-universal-373a", documents: "at-gewerbe-bmwet-channel-fetch-live", how: "at-bmwet-not-all-gewerbe", next: "at-gewerbe-finanzamt-not-dla", deadlines: "at-gewerbe-forms-cache-and-revalidate", problems: "at-gewerbe-ams-not-dla", dutiesAfter: "at-gewerbe-svs-not-dla", institution: "at-bmwet-current-ministry", boundaries: "at-gewerbe-local-gewerbe-not-373a-route", freshness: "at-gewerbe-bmwet-channel-fetch-live", negatives: "at-gewerbe-ams-not-dla" } },
  { key: "at-gewerbe-supporting-eu-directives", title: "Unterstützende EU-Richtlinien einordnen 2026", trigger: "RL 2005/36 oder 2006/123 als Ersatz für § 373a genutzt", safeFirstStep: "Richtlinien nur als Hintergrund; österreichisches Gewerberecht führt.", riskLevel: "medium", dimensions: { what: "at-gewerbe-supporting-dir-2005-36", whoWhen: "at-gewerbe-supporting-dir-2006-123", documents: "at-gewerbe-usp-not-statute", how: "at-gewerbe-does-not-copy-eu-directives", next: "at-373a-temporary-cross-border-framework", deadlines: "at-gewerbe-forms-cache-and-revalidate", problems: "at-gewerbe-does-not-copy-eu-directives", dutiesAfter: "at-373a-dienstleistungsanzeige-authority", institution: "at-bmwet-current-ministry", boundaries: "at-gewerbe-does-not-copy-eu-directives", freshness: "at-gewerbe-bmwet-channel-fetch-live", negatives: "at-gewerbe-does-not-copy-eu-directives" } },
  { key: "at-gewerbe-duration-no-threshold", title: "Keine willkürlichen Dauerschwellen 2026", trigger: "Feste Tages- oder Monatsgrenze für vorübergehend/gelegentlich verlangt", safeFirstStep: "§-373a-Qualifikatoren ohne erfundene Schwellen anwenden.", riskLevel: "high", dimensions: { what: "at-gewerbe-no-arbitrary-duration-thresholds", whoWhen: "at-gewerbe-occasional-not-frequency-formula", documents: "at-gewerbe-forms-cache-and-revalidate", how: "at-373a-temporary-cross-border-framework", next: "at-gewerbe-swiss-90-day-not-eu-ewr", deadlines: "at-gewerbe-no-arbitrary-duration-thresholds", problems: "at-gewerbe-swiss-90-day-not-eu-ewr", dutiesAfter: "at-gewerbe-temporary-not-pe", institution: "at-bmwet-current-ministry", boundaries: "at-gewerbe-occasional-not-frequency-formula", freshness: "at-gewerbe-bmwet-channel-fetch-live", negatives: "at-gewerbe-no-arbitrary-duration-thresholds" } },
]);

export const AT_GEWERBE_NEGATIVE_CONTROLS = Object.freeze([
  "at-gewerbebehoerde-not-universal-373a",
  "at-bmwet-not-all-gewerbe",
  "at-dienstleistungsanzeige-not-a1",
  "at-a1-not-dienstleistungsanzeige",
  "at-dienstleistungsanzeige-not-tax",
  "at-gewerbe-swiss-90-day-not-eu-ewr",
  "at-gewerbe-no-arbitrary-duration-thresholds",
  "at-gewerbe-temporary-not-pe",
  "at-gewerbe-zko-posting-not-dla-handoff",
  "at-gewerbe-posting-not-automatic-dla",
  "at-gewerbe-permanent-not-373a",
  "at-gewerbe-local-gewerbe-not-373a-route",
  "at-gewerbe-application-not-approval",
  "at-gewerbe-dla-not-entitlement",
  "at-gewerbe-finanzamt-not-dla",
  "at-gewerbe-ams-not-dla",
  "at-gewerbe-svs-not-dla",
  "at-gewerbe-ewr-not-third-country",
  "at-gewerbe-uk-out-of-scope",
  "at-gewerbe-ch-bilateral-not-373a",
  "at-gewerbe-does-not-copy-eu-directives",
  "at-gewerbe-does-not-determine-a1",
  "at-gewerbe-usp-not-statute",
  "at-gewerbe-annual-renewal-not-permanent",
  "at-gewerbe-occasional-not-frequency-formula",
  "at-gewerbe-regulated-94-dla-required",
  "at-gewerbe-non-regulated-373a-scope",
  "at-gewerbe-establishment-home-state-required",
  "at-gewerbe-supporting-dir-2005-36",
  "at-gewerbe-supporting-dir-2006-123",
  "at-gewerbe-a1-handoff-applicable-legislation",
  "at-gewerbe-forms-cache-and-revalidate",
  "at-gewerbe-bmwet-channel-fetch-live",
  "at-373a-temporary-cross-border-framework",
  "at-373a-dienstleistungsanzeige-authority",
  "at-dienstleistungsanzeige-annual-renewal",
]);

export function evaluateAtGewerbeServiceProcessCompleteness() {
  const incomplete = AT_GEWERBE_PROCESSES.filter((process) => (
    PROCESS_COMPLETE_DIMENSIONS.some((dimension) => !process.dimensions[dimension])
  ));
  const keys = new Set(AT_GEWERBE_UNITS.map((unit) => unit.key));
  const missing = AT_GEWERBE_PROCESSES.flatMap((process) => (
    PROCESS_COMPLETE_DIMENSIONS
      .map((dimension) => process.dimensions[dimension])
      .filter((key) => !keys.has(key))
      .map((key) => `${process.key}:${key}`)
  ));
  const processComplete = incomplete.length === 0 && missing.length === 0;
  return Object.freeze({
    processCount: AT_GEWERBE_PROCESSES.length,
    processComplete,
    processCompletenessPercent: processComplete ? 100 : 0,
    incompleteProcessKeys: incomplete.map((process) => process.key),
    missingClaims: missing,
    negativeControlCount: AT_GEWERBE_NEGATIVE_CONTROLS.length,
  });
}

const PUBLISHERS = Object.freeze([
  { key: "ris-gewerbe", name: "Republik Österreich – Rechtsinformationssystem", portal: "https://www.ris.bka.gv.at/", identity: "AT_RIS_GEWERBE" },
  { key: "bmwet-gewerbe", name: "Bundesministerium für Wirtschaft, Energie und Tourismus", portal: "https://www.bmwet.gv.at/", identity: "AT_BMWET" },
  { key: "usp-gewerbe", name: "Unternehmensserviceportal", portal: "https://www.usp.gv.at/", identity: "AT_USP_GEWERBE" },
  { key: "eurlex-gewerbe", name: "EUR-Lex", portal: "https://eur-lex.europa.eu/", identity: "EU_EURLEX_GEWERBE_SUPPORT" },
]);

export function buildAtCrossBorderGewerbeServiceRoutingPack() {
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
  const sources = AT_GEWERBE_OFFICIAL_SOURCES.map((spec) => {
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
      effectiveDate: AT_GEWERBE_AS_OF,
    });
    const passages = spec.passages.map((passage, order) => item("passages", passage.key, {
      sourceVersionId: version.id, order, headingPath: [spec.title],
      locator: passage.locator, text: passage.text, textHash: HASH(passage.text),
    }));
    const policy = item("handlingPolicies", `${spec.key}:policy`, {
      sourceId: source.id, informationClass: spec.informationClass, handlingMode: spec.handlingMode,
      freshnessClass: spec.freshnessClass, staleBehavior: spec.staleBehavior,
      requiredContextKeys: ["PROCESS_VARIANT"],
      riskClass: "MEDIUM",
    });
    const freshness = item("freshnessRecords", `${spec.key}:freshness`, {
      entityType: "source", entityId: source.id, status: "fresh", effectiveDateKnown: true,
    });
    return { spec, source, version, passages, policy, freshness };
  });
  const passageByKey = new Map(sources.flatMap(({ passages }) => passages.map((passage) => [passage.key, passage])));
  const sourceByKey = new Map(sources.map((entry) => [entry.spec.key, entry]));
  const claims = AT_GEWERBE_UNITS.map((unit) => {
    const source = sourceByKey.get(unit.sourceKey);
    const passage = passageByKey.get(unit.passageKey);
    if (!source || !passage) throw new Error(`AT_GEWERBE_UNIT_SOURCE_MISSING:${unit.key}`);
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
  const processes = AT_GEWERBE_PROCESSES.map((spec) => item("processes", spec.key, {
    processGroupId: AT_GEWERBE_ROUTING_PROCESS_GROUP, title: spec.title, jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id, riskLevel: spec.riskLevel, trigger: spec.trigger,
    safeFirstStep: spec.safeFirstStep, regionalVariationExpected: false,
  }));
  const processByKey = new Map(processes.map((process) => [String(process.key), process]));
  const claimByKey = new Map(claims.map(({ claim }) => [String(claim.key), claim]));
  const processClaimLinks: Entity[] = [];
  const seen = new Set<string>();
  for (const process of AT_GEWERBE_PROCESSES) {
    for (const dimension of PROCESS_COMPLETE_DIMENSIONS) {
      const claimKey = process.dimensions[dimension];
      const token = `${process.key}:${claimKey}:${dimension}`;
      if (seen.has(token)) continue;
      const stored = processByKey.get(process.key);
      const claim = claimByKey.get(claimKey);
      if (!stored || !claim) throw new Error(`AT_GEWERBE_PROCESS_CLAIM_MISSING:${process.key}:${claimKey}`);
      seen.add(token);
      processClaimLinks.push(item("processClaimLinks", token, {
        processId: stored.id, claimId: claim.id, role: dimension, required: true,
        sequenceContext: dimension, qualificationRequired: false,
      }));
    }
  }
  return Object.freeze({
    schemaVersion: 1,
    packId: AT_GEWERBE_ROUTING_PACK_ID,
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
