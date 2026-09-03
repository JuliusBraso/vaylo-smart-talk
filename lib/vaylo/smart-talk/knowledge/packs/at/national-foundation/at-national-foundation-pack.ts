/**
 * AT-SK-0C Austrian national foundation pack.
 * Authority identities, source hierarchy, and bounded national facts only.
 * Not a process-complete AT benefits / Gewerbe / tax / treaty pack.
 */
import { createHash } from "node:crypto";

import {
  AT_AUTHORITY_IDENTITY_KEYS,
  AT_FOUNDATION_INTERNAL_PROCESS_KEYS,
  AT_NATIONAL_CANONICAL_LANGUAGE,
  AT_NATIONAL_COUNTRY_CODE,
  AT_NATIONAL_FOUNDATION_AS_OF,
  AT_NATIONAL_FOUNDATION_EXPLICITLY_NOT_BUILT,
  AT_NATIONAL_FOUNDATION_PACK_ID,
  AT_NATIONAL_FOUNDATION_PROCESS_GROUP,
  AT_NATIONAL_JURISDICTION_LEVEL,
  AT_NATIONAL_TRUST_DOMAIN,
} from "../../../source-registry/at-national-foundation-contracts";
import { stableKnowledgeFactoryId } from "../../../source-registry/knowledge-factory-contracts";

const HASH = (value: string): string => createHash("sha256").update(value).digest("hex");
type Entity = Readonly<Record<string, unknown> & { key: string; id: string }>;

function item(entityClass: string, key: string, values: Record<string, unknown>): Entity {
  return Object.freeze({
    key,
    id: stableKnowledgeFactoryId(AT_NATIONAL_FOUNDATION_PACK_ID, entityClass, key),
    ...values,
  });
}

type SourceSpec = Readonly<{
  key: string;
  publisherKey: string;
  officialDomain: string;
  url: string;
  title: string;
  sourceType: string;
  sourceClass: "FEDERAL_LAW" | "FEDERAL_ADMINISTRATIVE_GUIDANCE" | "FEDERAL_SERVICE_PORTAL" | "AUTHORITY_PORTAL" | "OFFICIAL_ONLINE_SERVICE";
  sourceTypeClass: "AUTHENTIC_STATUTE" | "COMPETENT_AUTHORITY_GUIDANCE" | "OFFICIAL_SERVICE_PORTAL" | "OFFICIAL_FORM" | "OFFICIAL_INSTITUTIONAL_INFORMATION";
  hierarchyLevel: "PRIMARY_LAW" | "COMPETENT_FEDERAL_MINISTRY" | "COMPETENT_NATIONAL_ADMINISTRATIVE_OR_INSURANCE_AUTHORITY" | "OFFICIAL_GOVERNMENT_SERVICE_PORTAL" | "OFFICIAL_FORM_OR_DIGITAL_PROCEDURE";
  retrievalMethod: "HTML_DOCUMENT";
  handlingMode: "STORE_CANONICALLY" | "CACHE_AND_REVALIDATE" | "FETCH_LIVE";
  freshnessClass: "LEGAL_CHANGE_MONITORED" | "EVENT_DRIVEN";
  staleBehavior: "DO_NOT_USE_STALE" | "REVALIDATE_BEFORE_USE";
  informationClass: "LEGAL_BASELINE" | "AUTHORITY_COMPETENCE" | "PROCESS_IDENTITY" | "ONLINE_SERVICE_URL" | "CONTACT_DETAILS";
  effectiveDate?: string;
  passages: readonly { key: string; locator: string; text: string }[];
}>;

export const AT_FOUNDATION_OFFICIAL_SOURCES: readonly SourceSpec[] = Object.freeze([
  {
    key: "at-ris-legal-information",
    publisherKey: "ris",
    officialDomain: "www.ris.bka.gv.at",
    url: "https://www.ris.bka.gv.at/",
    title: "Rechtsinformationssystem des Bundes (RIS)",
    sourceType: "official_legal_information",
    sourceClass: "FEDERAL_LAW",
    sourceTypeClass: "AUTHENTIC_STATUTE",
    hierarchyLevel: "PRIMARY_LAW",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    informationClass: "LEGAL_BASELINE",
    passages: [{
      key: "at-ris-legal-information-text",
      locator: "RIS / Bundesrecht",
      text: "RIS ist die aktuelle amtliche Rechtsinformationsquelle für österreichisches Bundesrecht. RIS entscheidet nicht über den Einzelfall einer Person in Versicherung, Steuer oder Gewerbe.",
    }],
  },
  {
    key: "at-ris-gewo-373a",
    publisherKey: "ris",
    officialDomain: "www.ris.bka.gv.at",
    url: "https://www.ris.bka.gv.at/eli/bgbl/1994/194/P373a/NOR40202661",
    title: "RIS: GewO 1994 § 373a, Fassung 2026-09-03",
    sourceType: "statute",
    sourceClass: "FEDERAL_LAW",
    sourceTypeClass: "AUTHENTIC_STATUTE",
    hierarchyLevel: "PRIMARY_LAW",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    informationClass: "LEGAL_BASELINE",
    effectiveDate: "2018-05-25",
    passages: [{
      key: "at-ris-gewo-373a-text",
      locator: "GewO 1994 § 373a Abs. 1 und 4, gültig ab 25.05.2018",
      text: "§ 373a GewO 1994 erlaubt EU/EWR-Staatsangehörigen, die in einem anderen EU/EWR-Staat niedergelassen sind und dort eine vom Gewerberecht erfasste Tätigkeit befugt ausüben, diese Tätigkeit vorübergehend und gelegentlich in Österreich auszuüben. Betrifft die grenzüberschreitende Tätigkeit ein reglementiertes Gewerbe nach § 94, ist die erstmalige Aufnahme vorher schriftlich anzuzeigen. Die Anzeige ist einmal jährlich zu erneuern, wenn der Dienstleister beabsichtigt, während des betreffenden Jahres vorübergehend oder gelegentlich Dienstleistungen zu erbringen. Der Gesetzestext nennt noch den Bundesminister für Wirtschaft und Arbeit; das ist nicht die aktuelle Behördenbezeichnung.",
    }],
  },
  {
    key: "at-ris-estg-1",
    publisherKey: "ris",
    officialDomain: "www.ris.bka.gv.at",
    url: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10004570",
    title: "RIS: EStG 1988 § 1, Fassung 2026-09-03",
    sourceType: "statute",
    sourceClass: "FEDERAL_LAW",
    sourceTypeClass: "AUTHENTIC_STATUTE",
    hierarchyLevel: "PRIMARY_LAW",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    informationClass: "LEGAL_BASELINE",
    effectiveDate: "1988-07-30",
    passages: [{
      key: "at-ris-estg-1-text",
      locator: "EStG 1988 § 1 Abs. 1 und 2, Fassung 2026-09-03",
      text: "Einkommensteuerpflichtig sind nur natürliche Personen. Unbeschränkt steuerpflichtig sind natürliche Personen, die im Inland einen Wohnsitz oder ihren gewöhnlichen Aufenthalt haben. Die beiden Anknüpfungen sind alternativ, nicht kumulativ. Das ist inländisches EStG und nicht die Ansässigkeit nach einem DBA.",
    }],
  },
  {
    key: "at-ris-bao-26",
    publisherKey: "ris",
    officialDomain: "www.ris.bka.gv.at",
    url: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10003940&Paragraf=26",
    title: "RIS: BAO § 26, tagesaktuelle Fassung 2026-09-03",
    sourceType: "statute",
    sourceClass: "FEDERAL_LAW",
    sourceTypeClass: "AUTHENTIC_STATUTE",
    hierarchyLevel: "PRIMARY_LAW",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    informationClass: "LEGAL_BASELINE",
    passages: [{
      key: "at-ris-bao-26-text",
      locator: "BAO § 26 Abs. 1 und 2",
      text: "Wohnsitz im Sinn der Abgabenvorschriften besteht, wo jemand eine Wohnung unter Umständen innehat, die auf Beibehaltung und Benutzung schließen lassen. Gewöhnlicher Aufenthalt besteht, wo jemand unter Umständen verweilt, die erkennen lassen, dass der Aufenthalt nicht nur vorübergehend ist. Knüpft unbeschränkte Abgabepflicht an den gewöhnlichen Aufenthalt, tritt sie ein, wenn der Aufenthalt im Inland länger als sechs Monate dauert, und erfasst auch die ersten sechs Monate, vorbehaltlich der gesetzlichen Grenzen. Das ist nicht die 183-Tage-Regel eines DBA.",
    }],
  },
  {
    key: "at-usp-dienstleistungsanzeige",
    publisherKey: "usp",
    officialDomain: "www.usp.gv.at",
    url: "https://www.usp.gv.at/gruendung/EAP/dienstleistungsanzeige.html",
    title: "USP: Dienstleistungsanzeige, Stand 20. März 2026, Inhalt BMWET",
    sourceType: "official_guidance",
    sourceClass: "FEDERAL_SERVICE_PORTAL",
    sourceTypeClass: "OFFICIAL_SERVICE_PORTAL",
    hierarchyLevel: "OFFICIAL_GOVERNMENT_SERVICE_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "PROCESS_IDENTITY",
    passages: [{
      key: "at-usp-dienstleistungsanzeige-text",
      locator: "USP Dienstleistungsanzeige, letzte Aktualisierung 20. März 2026",
      text: "Bei reglementierten Gewerben ist die erstmalige Aufnahme vorher anzuzeigen. Die Anzeige ist einmal jährlich zu erneuern, wenn das Unternehmen beabsichtigt, während des betreffenden Jahres in Österreich Dienstleistungen zu erbringen. Inhaltlich verantwortlich ist das Bundesministerium für Wirtschaft, Energie und Tourismus. STALE_OFFICIAL_GUIDANCE: der Fließtext nennt noch Bundesministerium für Arbeit und Wirtschaft (BMAW). Die aktuelle Behördenidentität ist BMWET. USP ist Portal/Guidance, nicht Gesetzestext.",
    }],
  },
  {
    key: "at-bmwet-identity",
    publisherKey: "bmwet",
    officialDomain: "www.bmwet.gv.at",
    url: "https://www.bmwet.gv.at/",
    title: "Bundesministerium für Wirtschaft, Energie und Tourismus (BMWET)",
    sourceType: "official_institutional",
    sourceClass: "AUTHORITY_PORTAL",
    sourceTypeClass: "OFFICIAL_INSTITUTIONAL_INFORMATION",
    hierarchyLevel: "COMPETENT_FEDERAL_MINISTRY",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "AUTHORITY_COMPETENCE",
    passages: [{
      key: "at-bmwet-identity-text",
      locator: "BMWET Startseite, 2026-09-03",
      text: "Die aktuelle amtliche Bezeichnung des zuständigen Bundesministeriums ist Bundesministerium für Wirtschaft, Energie und Tourismus (BMWET). BMWET ist nicht automatisch für jedes innerstaatliche Gewerbeverfahren zuständig.",
    }],
  },
  {
    key: "at-bmf-zustrl",
    publisherKey: "bmf",
    officialDomain: "findok.bmf.gv.at",
    url: "https://findok.bmf.gv.at/findok/volltext(suche:Standardsuche)?segmentId=7196a328-5806-42b3-b349-edf37de9d6b6",
    title: "BMF Findok: Richtlinien zur Zuständigkeit der Finanzämter (ZustRL)",
    sourceType: "official_guidance",
    sourceClass: "FEDERAL_ADMINISTRATIVE_GUIDANCE",
    sourceTypeClass: "COMPETENT_AUTHORITY_GUIDANCE",
    hierarchyLevel: "COMPETENT_FEDERAL_MINISTRY",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "AUTHORITY_COMPETENCE",
    passages: [{
      key: "at-bmf-zustrl-text",
      locator: "ZustRL 2.1 / BAO § 56 und § 60",
      text: "Seit 2021 besteht das Finanzamt Österreich mit bundesweitem Wirkungsbereich. Es hat eine umfassende Zuständigkeit für Aufgaben, die nicht einer anderen Abgabenbehörde des Bundes übertragen sind. Die institutionelle Zuständigkeit folgt nicht mehr dem vor-2021-Modell eines ausschließlich örtlichen Wohnsitz-Finanzamts.",
    }],
  },
  {
    key: "at-oesterreich-gv-familienbeihilfe",
    publisherKey: "oesterreich-gv",
    officialDomain: "www.oesterreich.gv.at",
    url: "https://www.oesterreich.gv.at/de/themen/familie_und_partnerschaft/familienbeihilfe/Seite.450233",
    title: "oesterreich.gv.at: Familienbeihilfe Beantragung",
    sourceType: "official_guidance",
    sourceClass: "FEDERAL_SERVICE_PORTAL",
    sourceTypeClass: "OFFICIAL_SERVICE_PORTAL",
    hierarchyLevel: "OFFICIAL_GOVERNMENT_SERVICE_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "PROCESS_IDENTITY",
    passages: [{
      key: "at-oesterreich-gv-familienbeihilfe-text",
      locator: "Familienbeihilfe – Beantragung",
      text: "Die Finanzverwaltung / das Finanzamt Österreich verwaltet die Familienbeihilfe. Das Portal beschreibt den Antragsweg, ist aber nicht der Gesetzestext und entscheidet nicht die unionsrechtliche Priorität nach Artikel 68.",
    }],
  },
  {
    key: "at-svs-identity",
    publisherKey: "svs",
    officialDomain: "www.svs.at",
    url: "https://www.svs.at/",
    title: "Sozialversicherungsanstalt der Selbständigen (SVS)",
    sourceType: "official_institutional",
    sourceClass: "AUTHORITY_PORTAL",
    sourceTypeClass: "OFFICIAL_INSTITUTIONAL_INFORMATION",
    hierarchyLevel: "COMPETENT_NATIONAL_ADMINISTRATIVE_OR_INSURANCE_AUTHORITY",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "AUTHORITY_COMPETENCE",
    passages: [{
      key: "at-svs-identity-text",
      locator: "SVS Institution",
      text: "Die SVS ist der österreichische Sozialversicherungsträger für gesetzlich zugeordnete selbständig erwerbstätige Gruppen, einschließlich Gewerbetreibender und Neuer Selbständiger nach geltendem österreichischem Recht. Selbständigkeit allein beweist weder österreichisches anzuwendendes Recht noch immer SVS.",
    }],
  },
  {
    key: "at-oegk-identity",
    publisherKey: "oegk",
    officialDomain: "www.gesundheitskasse.at",
    url: "https://www.gesundheitskasse.at/",
    title: "Österreichische Gesundheitskasse (ÖGK)",
    sourceType: "official_institutional",
    sourceClass: "AUTHORITY_PORTAL",
    sourceTypeClass: "OFFICIAL_INSTITUTIONAL_INFORMATION",
    hierarchyLevel: "COMPETENT_NATIONAL_ADMINISTRATIVE_OR_INSURANCE_AUTHORITY",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "AUTHORITY_COMPETENCE",
    passages: [{
      key: "at-oegk-identity-text",
      locator: "ÖGK Institution",
      text: "Die ÖGK ist ein großer gesetzlicher österreichischer Kranken-/Sozialversicherungsträger für die ihr gesetzlich zugeordneten Versichertengruppen. Beschäftigung in Österreich beweist nicht automatisch ÖGK.",
    }],
  },
  {
    key: "at-bvaeb-identity",
    publisherKey: "bvaeb",
    officialDomain: "www.bvaeb.at",
    url: "https://www.bvaeb.at/",
    title: "Versicherungsanstalt öffentlich Bediensteter, Eisenbahnen und Bergbau (BVAEB)",
    sourceType: "official_institutional",
    sourceClass: "AUTHORITY_PORTAL",
    sourceTypeClass: "OFFICIAL_INSTITUTIONAL_INFORMATION",
    hierarchyLevel: "COMPETENT_NATIONAL_ADMINISTRATIVE_OR_INSURANCE_AUTHORITY",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "AUTHORITY_COMPETENCE",
    passages: [{
      key: "at-bvaeb-identity-text",
      locator: "BVAEB Institution",
      text: "Die BVAEB ist ein eigener österreichischer Sozial-/Krankenversicherungsträger für gesetzlich zugeordnete Gruppen des öffentlichen Dienstes, der Eisenbahnen und des Bergbaus. Österreichisch versichert ist nicht automatisch ÖGK.",
    }],
  },
  {
    key: "at-dachverband-identity",
    publisherKey: "dachverband",
    officialDomain: "www.sozialversicherung.at",
    url: "https://www.sozialversicherung.at/",
    title: "Dachverband der österreichischen Sozialversicherungsträger",
    sourceType: "official_institutional",
    sourceClass: "AUTHORITY_PORTAL",
    sourceTypeClass: "OFFICIAL_INSTITUTIONAL_INFORMATION",
    hierarchyLevel: "COMPETENT_NATIONAL_ADMINISTRATIVE_OR_INSURANCE_AUTHORITY",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "AUTHORITY_COMPETENCE",
    passages: [{
      key: "at-dachverband-identity-text",
      locator: "Dachverband Institution",
      text: "Der Dachverband der österreichischen Sozialversicherungsträger ist die Koordinations- und Dachorganisation der Träger. Er ist nicht der voreingestellte individuelle Versicherungsträger eines Einzelfalls.",
    }],
  },
  {
    key: "at-ams-identity",
    publisherKey: "ams",
    officialDomain: "www.ams.at",
    url: "https://www.ams.at/",
    title: "Arbeitsmarktservice Österreich (AMS)",
    sourceType: "official_institutional",
    sourceClass: "AUTHORITY_PORTAL",
    sourceTypeClass: "OFFICIAL_INSTITUTIONAL_INFORMATION",
    hierarchyLevel: "COMPETENT_NATIONAL_ADMINISTRATIVE_OR_INSURANCE_AUTHORITY",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "AUTHORITY_COMPETENCE",
    passages: [{
      key: "at-ams-identity-text",
      locator: "AMS Institution",
      text: "Das AMS ist die nationale österreichische Arbeitsmarkt- und Arbeitslosenverwaltungsbehörde. AMS-Identität entscheidet nicht das sozialversicherungsrechtliche anzuwendende Recht. Genaue Geschäftsstellen und Kontakte sind FETCH_LIVE.",
    }],
  },
  {
    key: "at-ams-office-live",
    publisherKey: "ams",
    officialDomain: "www.ams.at",
    url: "https://www.ams.at/organisation/geschaeftsstellen",
    title: "AMS: genaue Geschäftsstelle und Kontakt",
    sourceType: "authority_portal",
    sourceClass: "OFFICIAL_ONLINE_SERVICE",
    sourceTypeClass: "OFFICIAL_FORM",
    hierarchyLevel: "OFFICIAL_FORM_OR_DIGITAL_PROCEDURE",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "FETCH_LIVE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "CONTACT_DETAILS",
    passages: [{
      key: "at-ams-office-live-text",
      locator: "AMS lokale Geschäftsstelle",
      text: "Telefon, Anschrift, E-Mail, regionale Geschäftsstelle und Öffnungszeiten des AMS werden nicht kanonisch eingefroren. Exact office/contact ist FETCH_LIVE.",
    }],
  },
  {
    key: "at-finanzonline-live",
    publisherKey: "faoe",
    officialDomain: "finanzonline.bmf.gv.at",
    url: "https://finanzonline.bmf.gv.at/",
    title: "FinanzOnline / genaue Amtsstelle des Finanzamts Österreich",
    sourceType: "authority_portal",
    sourceClass: "OFFICIAL_ONLINE_SERVICE",
    sourceTypeClass: "OFFICIAL_FORM",
    hierarchyLevel: "OFFICIAL_FORM_OR_DIGITAL_PROCEDURE",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "FETCH_LIVE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "ONLINE_SERVICE_URL",
    passages: [{
      key: "at-finanzonline-live-text",
      locator: "FinanzOnline / Servicestellen",
      text: "Trotz bundesweiter institutioneller Zuständigkeit des Finanzamts Österreich sind genaue Amtsstelle, Kontakt und Formularzugang FETCH_LIVE und nicht ewig festgeschrieben.",
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

export const AT_FOUNDATION_UNITS: readonly Unit[] = Object.freeze([
  { key: "at-ris-legal-source-not-case-authority", category: "source", type: "boundary", text: "RIS ist amtliche Rechtsinformationsquelle für österreichisches Recht und nicht die fallentscheidende Behörde eines individuellen Leistungs-, Versicherungs-, Steuer- oder Gewerbefalls.", sourceKey: "at-ris-legal-information", passageKey: "at-ris-legal-information-text", riskLevel: "high" },
  { key: "at-svs-self-employed-carrier", category: "authority", type: "definition", text: "Die SVS ist der österreichische Sozialversicherungsträger für gesetzlich zugeordnete selbständig erwerbstätige Gruppen, einschließlich Gewerbetreibender und Neuer Selbständiger.", sourceKey: "at-svs-identity", passageKey: "at-svs-identity-text", riskLevel: "high" },
  { key: "at-svs-not-universal-self-employed", category: "authority", type: "boundary", text: "activityType=SELF_EMPLOYED beweist nicht österreichisches anzuwendendes Recht und nicht automatisch SVS in jeder Ausnahmegruppe.", sourceKey: "at-svs-identity", passageKey: "at-svs-identity-text", riskLevel: "high" },
  { key: "at-oegk-major-carrier", category: "authority", type: "definition", text: "Die ÖGK ist ein großer gesetzlicher österreichischer Kranken-/Sozialversicherungsträger für die ihr gesetzlich zugeordneten Versichertengruppen.", sourceKey: "at-oegk-identity", passageKey: "at-oegk-identity-text", riskLevel: "high" },
  { key: "at-oegk-not-universal-insured", category: "authority", type: "boundary", text: "Eine in Österreich versicherte oder beschäftigte Person ist nicht automatisch bei der ÖGK versichert.", sourceKey: "at-oegk-identity", passageKey: "at-oegk-identity-text", riskLevel: "high" },
  { key: "at-bvaeb-special-carrier", category: "authority", type: "definition", text: "Die BVAEB ist ein eigener österreichischer Sozial-/Krankenversicherungsträger für gesetzlich zugeordnete Gruppen des öffentlichen Dienstes, der Eisenbahnen und des Bergbaus.", sourceKey: "at-bvaeb-identity", passageKey: "at-bvaeb-identity-text", riskLevel: "high" },
  { key: "at-dachverband-coordination-not-default-carrier", category: "authority", type: "boundary", text: "Der Dachverband der österreichischen Sozialversicherungsträger ist Koordinations- und Dachorgan und nicht der voreingestellte individuelle Versicherungsträger.", sourceKey: "at-dachverband-identity", passageKey: "at-dachverband-identity-text", riskLevel: "high" },
  { key: "at-ams-employment-service", category: "authority", type: "definition", text: "Das AMS ist die nationale österreichische Arbeitsmarkt- und Arbeitslosenverwaltungsbehörde.", sourceKey: "at-ams-identity", passageKey: "at-ams-identity-text", riskLevel: "medium" },
  { key: "at-ams-not-applicable-legislation", category: "authority", type: "boundary", text: "AMS-Zuständigkeit für Arbeitslosenverwaltung ist nicht automatisch die Feststellung des sozialversicherungsrechtlichen anzuwendenden Staates.", sourceKey: "at-ams-identity", passageKey: "at-ams-identity-text", riskLevel: "high" },
  { key: "at-faoe-nationwide-tax", category: "authority", type: "definition", text: "Das Finanzamt Österreich ist die bundesweite österreichische Steuerbehörde mit umfassender Zuständigkeit für private Steuerpflichtige und KMU, soweit keine andere Abgabenbehörde zuständig ist.", sourceKey: "at-bmf-zustrl", passageKey: "at-bmf-zustrl-text", riskLevel: "high" },
  { key: "at-faoe-not-local-wohnsitz-model", category: "authority", type: "boundary", text: "Die institutionelle Zuständigkeit des Finanzamts Österreich darf nicht aus einem vor-2021-Modell ausschließlich nach Wohnsitzbezirk auf ein altes Ortsfinanzamt abgeleitet werden.", sourceKey: "at-bmf-zustrl", passageKey: "at-bmf-zustrl-text", riskLevel: "high" },
  { key: "at-faoe-familienbeihilfe-administration", category: "authority", type: "definition", text: "Das Finanzamt Österreich ist die zuständige Verwaltungsbehörde für die Familienbeihilfe.", sourceKey: "at-oesterreich-gv-familienbeihilfe", passageKey: "at-oesterreich-gv-familienbeihilfe-text", riskLevel: "high" },
  { key: "at-familienbeihilfe-admin-not-tax-residence", category: "authority", type: "boundary", text: "Die Verwaltung der Familienbeihilfe durch das Finanzamt Österreich ist kein Ergebnis der steuerlichen Ansässigkeit.", sourceKey: "at-oesterreich-gv-familienbeihilfe", passageKey: "at-oesterreich-gv-familienbeihilfe-text", riskLevel: "high" },
  { key: "at-familienbeihilfe-admin-not-article68", category: "authority", type: "boundary", text: "Die Identität des Finanzamts Österreich entscheidet nicht die unionsrechtliche Priorität nach Artikel 68.", sourceKey: "at-oesterreich-gv-familienbeihilfe", passageKey: "at-oesterreich-gv-familienbeihilfe-text", riskLevel: "high" },
  { key: "at-faoe-not-unemployment-authority", category: "authority", type: "boundary", text: "Das Finanzamt Österreich ist nicht die österreichische Arbeitslosenbehörde.", sourceKey: "at-ams-identity", passageKey: "at-ams-identity-text", riskLevel: "high" },
  { key: "at-bmwet-current-ministry", category: "authority", type: "definition", text: "Die aktuelle amtliche Bezeichnung des zuständigen Bundesministeriums ist Bundesministerium für Wirtschaft, Energie und Tourismus (BMWET).", sourceKey: "at-bmwet-identity", passageKey: "at-bmwet-identity-text", riskLevel: "medium" },
  { key: "at-373a-temporary-cross-border-framework", category: "gewerbe", type: "definition", text: "§ 373a GewO 1994 enthält den Rahmen für vorübergehende und gelegentliche grenzüberschreitende EU/EWR-Dienstleistungen aus einer in einem anderen EU/EWR-Staat rechtmäßig ausgeübten Niederlassung.", sourceKey: "at-ris-gewo-373a", passageKey: "at-ris-gewo-373a-text", riskLevel: "high" },
  { key: "at-373a-dienstleistungsanzeige-authority", category: "gewerbe", type: "procedure", text: "Für die Dienstleistungsanzeige nach § 373a bei reglementierten Gewerben ist der aktuelle zuständige Prozessinhaber das BMWET, nicht automatisch eine örtliche Gewerbebehörde.", sourceKey: "at-usp-dienstleistungsanzeige", passageKey: "at-usp-dienstleistungsanzeige-text", riskLevel: "high" },
  { key: "at-gewerbebehoerde-not-universal-373a", category: "gewerbe", type: "boundary", text: "Eine örtliche Gewerbebehörde bleibt für andere österreichische Gewerbeverfahren relevant, ist aber nicht automatisch für die §-373a-Dienstleistungsanzeige zuständig.", sourceKey: "at-usp-dienstleistungsanzeige", passageKey: "at-usp-dienstleistungsanzeige-text", riskLevel: "high" },
  { key: "at-bmwet-not-all-gewerbe", category: "gewerbe", type: "boundary", text: "BMWET ist nicht automatisch für jedes österreichische Gewerbeverfahren zuständig.", sourceKey: "at-bmwet-identity", passageKey: "at-bmwet-identity-text", riskLevel: "high" },
  { key: "at-dienstleistungsanzeige-annual-renewal", category: "gewerbe", type: "procedure", text: "Die Dienstleistungsanzeige ist für ein weiteres Jahr zu erneuern, wenn das Unternehmen beabsichtigt, in diesem Jahr in Österreich die betreffenden Dienstleistungen zu erbringen. Die operative Jahresregel ist CACHE_AND_REVALIDATE.", sourceKey: "at-usp-dienstleistungsanzeige", passageKey: "at-usp-dienstleistungsanzeige-text", riskLevel: "high" },
  { key: "at-dienstleistungsanzeige-not-a1", category: "gewerbe", type: "boundary", text: "Die Dienstleistungsanzeige / gewerberechtliche Anzeige ist nicht A1 und beweist nicht das sozialversicherungsrechtliche anzuwendende Recht.", sourceKey: "at-ris-gewo-373a", passageKey: "at-ris-gewo-373a-text", riskLevel: "high" },
  { key: "at-a1-not-dienstleistungsanzeige", category: "gewerbe", type: "boundary", text: "A1 ist sozialversicherungsrechtlicher Nachweis des anzuwendenden Rechts und erfüllt nicht die Dienstleistungsanzeige.", sourceKey: "at-ris-gewo-373a", passageKey: "at-ris-gewo-373a-text", riskLevel: "high" },
  { key: "at-dienstleistungsanzeige-not-tax", category: "gewerbe", type: "boundary", text: "Die österreichische Dienstleistungsanzeige begründet weder österreichische steuerliche Ansässigkeit noch ein österreichisches Besteuerungsrecht noch eine Betriebsstätte.", sourceKey: "at-ris-gewo-373a", passageKey: "at-ris-gewo-373a-text", riskLevel: "high" },
  { key: "at-activity-not-tax-residence", category: "tax", type: "boundary", text: "Österreichische Tätigkeit allein bestimmt nicht die österreichische steuerliche Ansässigkeit.", sourceKey: "at-ris-estg-1", passageKey: "at-ris-estg-1-text", riskLevel: "high" },
  { key: "at-activity-not-applicable-legislation", category: "authority", type: "boundary", text: "Österreichische Tätigkeit allein bestimmt nicht den österreichischen sozialversicherungsrechtlichen Anwendungsstaat.", sourceKey: "at-svs-identity", passageKey: "at-svs-identity-text", riskLevel: "high" },
  { key: "at-estg-1-wohnsitz-or-habitual", category: "tax", type: "definition", text: "Nach geltendem EStG 1988 § 1 sind natürliche Personen mit österreichischem Wohnsitz oder gewöhnlichem Aufenthalt grundsätzlich unbeschränkt einkommensteuerpflichtig. Die Anknüpfung ist ODER, nicht UND.", sourceKey: "at-ris-estg-1", passageKey: "at-ris-estg-1-text", riskLevel: "high" },
  { key: "at-bao-26-wohnsitz", category: "tax", type: "definition", text: "Wohnsitz nach BAO § 26 besteht, wo eine Wohnung unter Umständen innegehabt wird, die auf Beibehaltung und Benutzung schließen lassen.", sourceKey: "at-ris-bao-26", passageKey: "at-ris-bao-26-text", riskLevel: "high" },
  { key: "at-bao-26-habitual-abode", category: "tax", type: "definition", text: "Gewöhnlicher Aufenthalt nach BAO § 26 besteht bei nicht nur vorübergehender Anwesenheit; knüpft unbeschränkte Abgabepflicht daran, löst ein Aufenthalt von mehr als sechs Monaten die gesetzliche Folge von Anfang an aus, vorbehaltlich der gesetzlichen Grenzen.", sourceKey: "at-ris-bao-26", passageKey: "at-ris-bao-26-text", riskLevel: "high" },
  { key: "at-domestic-tax-not-treaty-residence", category: "tax", type: "boundary", text: "Ein österreichischer inländischer Ansässigkeitskandidat nach EStG/BAO ist nicht die Ansässigkeit nach dem DBA AT-SK und nicht automatisch Artikel 4.", sourceKey: "at-ris-estg-1", passageKey: "at-ris-estg-1-text", riskLevel: "high" },
  { key: "at-bao-six-month-not-treaty-183", category: "tax", type: "boundary", text: "Die Sechs-Monats-Regel des BAO § 26 ist nicht die 183-Tage-Regel eines Doppelbesteuerungsabkommens.", sourceKey: "at-ris-bao-26", passageKey: "at-ris-bao-26-text", riskLevel: "high" },
  { key: "at-usp-not-statute", category: "source", type: "boundary", text: "USP-Erläuterungen sind amtliches Portal/Guidance und kein Gesetzestext.", sourceKey: "at-usp-dienstleistungsanzeige", passageKey: "at-usp-dienstleistungsanzeige-text", riskLevel: "high" },
  { key: "at-oesterreich-gv-not-statute", category: "source", type: "boundary", text: "oesterreich.gv.at ist amtliches Serviceportal und kein Gesetzestext.", sourceKey: "at-oesterreich-gv-familienbeihilfe", passageKey: "at-oesterreich-gv-familienbeihilfe-text", riskLevel: "high" },
  { key: "at-exact-office-fetch-live", category: "freshness", type: "procedure", text: "Genaue Amtsstelle, Telefon, Anschrift, E-Mail und Öffnungszeiten werden nicht kanonisch gespeichert; sie sind FETCH_LIVE.", sourceKey: "at-ams-office-live", passageKey: "at-ams-office-live-text", riskLevel: "medium", requiresAuthorityResolution: true },
  { key: "at-form-url-not-eternal", category: "freshness", type: "boundary", text: "Formular-URL und Verfahrenskennung der Dienstleistungsanzeige oder FinanzOnline werden nicht als zeitlose kanonische Tatsache gespeichert.", sourceKey: "at-finanzonline-live", passageKey: "at-finanzonline-live-text", riskLevel: "medium" },
  { key: "at-no-benefit-amounts", category: "freshness", type: "boundary", text: "Familienbeihilfe-, Arbeitslosengeld-, Beitrags- und Steuertarifbeträge sind keine Foundation-Tatsachen und werden hier nicht gespeichert.", sourceKey: "at-ris-legal-information", passageKey: "at-ris-legal-information-text", riskLevel: "high" },
]);

const PUBLISHERS = Object.freeze([
  { key: "ris", name: "Rechtsinformationssystem des Bundes", type: "national_legal_publication", portal: "https://www.ris.bka.gv.at/", identity: "AT_RIS" as const, authorityType: "LEGAL_SOURCE" },
  { key: "bmf", name: "Bundesministerium für Finanzen", type: "national_ministry", portal: "https://www.bmf.gv.at/", identity: "AT_BMF" as const, authorityType: "POLICY_MINISTRY" },
  { key: "faoe", name: "Finanzamt Österreich", type: "national_tax_authority", portal: "https://www.bmf.gv.at/", identity: "AT_FINANZAMT_OESTERREICH" as const, authorityType: "TAX_AUTHORITY" },
  { key: "bmwet", name: "Bundesministerium für Wirtschaft, Energie und Tourismus", type: "national_ministry", portal: "https://www.bmwet.gv.at/", identity: "AT_BMWET" as const, authorityType: "POLICY_MINISTRY" },
  { key: "svs", name: "Sozialversicherungsanstalt der Selbständigen", type: "national_insurance_carrier", portal: "https://www.svs.at/", identity: "AT_SVS" as const, authorityType: "SOCIAL_INSURANCE_CARRIER" },
  { key: "oegk", name: "Österreichische Gesundheitskasse", type: "national_insurance_carrier", portal: "https://www.gesundheitskasse.at/", identity: "AT_OEGK" as const, authorityType: "HEALTH_INSURANCE_CARRIER" },
  { key: "bvaeb", name: "Versicherungsanstalt öffentlich Bediensteter, Eisenbahnen und Bergbau", type: "national_insurance_carrier", portal: "https://www.bvaeb.at/", identity: "AT_BVAEB" as const, authorityType: "HEALTH_INSURANCE_CARRIER" },
  { key: "dachverband", name: "Dachverband der österreichischen Sozialversicherungsträger", type: "national_coordination_body", portal: "https://www.sozialversicherung.at/", identity: "AT_DACHVERBAND" as const, authorityType: "COORDINATION_BODY" },
  { key: "ams", name: "Arbeitsmarktservice Österreich", type: "national_employment_service", portal: "https://www.ams.at/", identity: "AT_AMS" as const, authorityType: "EMPLOYMENT_SERVICE" },
  { key: "usp", name: "Unternehmensserviceportal", type: "national_service_portal", portal: "https://www.usp.gv.at/", identity: "AT_USP" as const, authorityType: "SERVICE_PORTAL" },
  { key: "oesterreich-gv", name: "oesterreich.gv.at", type: "national_service_portal", portal: "https://www.oesterreich.gv.at/", identity: "AT_OESTERREICH_GV" as const, authorityType: "SERVICE_PORTAL" },
]);

const PROCESSES = Object.freeze([
  {
    key: "at_authority_routing",
    title: "Österreichische Behördenzuordnung der Foundation",
    trigger: "Welche österreichische Institution ist Quelle, Behörde oder beides für den konkreten Foundation-Prozess?",
    safeFirstStep: "Rollen und Domänen trennen; bei unbekannter Versichertengruppe fail-closed.",
    riskLevel: "high",
    claimKeys: ["at-ris-legal-source-not-case-authority", "at-svs-not-universal-self-employed", "at-oegk-not-universal-insured", "at-exact-office-fetch-live"],
  },
  {
    key: "at_official_source_selection",
    title: "Auswahl österreichischer amtlicher Quellen",
    trigger: "Gesetzestext, Ministeriumshinweis oder Portal konkurrieren zur selben Rechtsfrage.",
    safeFirstStep: "Geltendes RIS-Gesetz vor Erläuterung; Portal nicht als Gesetz labeln.",
    riskLevel: "high",
    claimKeys: ["at-ris-legal-source-not-case-authority", "at-usp-not-statute", "at-oesterreich-gv-not-statute"],
  },
  {
    key: "at_cross_border_gewerbe_authority_boundary",
    title: "Grenze der §-373a-Dienstleistungsanzeige-Zuständigkeit",
    trigger: "Grenzüberschreitende reglementierte Gewerbedienstleistung nach Österreich.",
    safeFirstStep: "§ 373a / BMWET-Route prüfen; nicht pauschal zur örtlichen Gewerbebehörde leiten; nicht mit A1 vermengen.",
    riskLevel: "high",
    claimKeys: ["at-373a-dienstleistungsanzeige-authority", "at-gewerbebehoerde-not-universal-373a", "at-dienstleistungsanzeige-not-a1", "at-a1-not-dienstleistungsanzeige"],
  },
]);

export function buildAtNationalFoundationPack() {
  const trustDomain = item("trustDomain", "at", {
    code: AT_NATIONAL_TRUST_DOMAIN,
    name: "Österreich",
  });
  const jurisdiction = item("jurisdictions", "at", {
    level: AT_NATIONAL_JURISDICTION_LEVEL,
    code: AT_NATIONAL_COUNTRY_CODE,
    countryCode: AT_NATIONAL_COUNTRY_CODE,
    name: "Republik Österreich",
  });
  const scope = item("territorialScopes", "at", {
    type: "at_national",
    jurisdictionIds: [jurisdiction.id],
    landCodes: [], kreisCodes: [], municipalityCodes: [],
  });
  const publishers = Object.fromEntries(PUBLISHERS.map((spec) => [spec.key, item("publishers", spec.key, {
    name: spec.name,
    type: spec.type,
    territorialScopeId: scope.id,
    trustDomainId: trustDomain.id,
  })]));
  const authorities = Object.fromEntries(PUBLISHERS.map((spec) => [spec.key, item("authorities", spec.identity, {
    publisherId: publishers[spec.key].id,
    name: spec.name,
    type: spec.authorityType,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
    officialPortalUrl: spec.portal,
    identityKey: spec.identity,
  })]));
  const sources = AT_FOUNDATION_OFFICIAL_SOURCES.map((spec) => {
    const authority = authorities[spec.publisherKey];
    const origin = `https://${spec.officialDomain}`;
    const source = item("sources", spec.key, {
      publisherId: publishers[spec.publisherKey].id,
      authorityId: authority.id,
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      sourceType: spec.sourceType,
      purpose: spec.title,
      canonicalUrl: spec.url,
      officialDomain: spec.officialDomain,
      normalizedOrigin: origin,
      sourceClass: spec.sourceClass,
      sourceTypeClass: spec.sourceTypeClass,
      hierarchyLevel: spec.hierarchyLevel,
      authorityLevel: "SPECIFIC_AUTHORITY",
      retrievalMethod: spec.retrievalMethod,
      handlingMode: spec.handlingMode,
      freshnessClass: spec.freshnessClass,
      staleBehavior: spec.staleBehavior,
      supportsClaimTypes: ["definition", "exception", "procedure", "boundary"],
      highRiskUseAllowed: false,
      publicationIdentifier: spec.title,
      effectiveDate: spec.effectiveDate ?? null,
    });
    const version = item("sourceVersions", `${spec.key}:v1`, {
      sourceId: source.id,
      versionSequence: 1,
      contentHash: HASH(spec.passages.map((passage) => passage.text).join("\n")),
      effectiveDate: spec.effectiveDate ?? AT_NATIONAL_FOUNDATION_AS_OF,
    });
    const passages = spec.passages.map((passage, order) => item("passages", passage.key, {
      sourceVersionId: version.id,
      order,
      headingPath: [spec.title],
      locator: passage.locator,
      text: passage.text,
      textHash: HASH(passage.text),
    }));
    const policy = item("handlingPolicies", `${spec.key}:form`, {
      sourceId: source.id,
      informationClass: spec.informationClass,
      handlingMode: spec.handlingMode,
      freshnessClass: spec.freshnessClass,
      staleBehavior: spec.staleBehavior,
      requiredContextKeys: spec.handlingMode === "FETCH_LIVE" ? ["COUNTRY"] : ["PROCESS_VARIANT"],
      riskClass: "MEDIUM",
    });
    const freshness = item("freshnessRecords", `${spec.key}:freshness`, {
      entityType: "source",
      entityId: source.id,
      status: "fresh",
      effectiveDateKnown: Boolean(spec.effectiveDate),
    });
    return { spec, source, version, passages, policy, freshness };
  });
  const passageByKey = new Map(sources.flatMap(({ passages }) => passages.map((passage) => [passage.key, passage])));
  const sourceByKey = new Map(sources.map((entry) => [entry.spec.key, entry]));
  const claims = AT_FOUNDATION_UNITS.map((unit) => {
    const source = sourceByKey.get(unit.sourceKey);
    const passage = passageByKey.get(unit.passageKey);
    if (!source || !passage) throw new Error(`AT_FOUNDATION_UNIT_SOURCE_MISSING:${unit.key}`);
    const claim = item("claims", unit.key, {
      type: unit.type,
      text: unit.text,
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      authorityId: source.source.authorityId,
      riskLevel: unit.riskLevel,
      requiresEffectiveDate: false,
      requiresAuthorityResolution: unit.requiresAuthorityResolution === true,
      temporalClass: "CURRENT" as const,
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
  const processes = PROCESSES.map((spec) => item("processes", spec.key, {
    processGroupId: AT_NATIONAL_FOUNDATION_PROCESS_GROUP,
    title: spec.title,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
    riskLevel: spec.riskLevel,
    trigger: spec.trigger,
    safeFirstStep: spec.safeFirstStep,
    regionalVariationExpected: false,
    processComplete: false,
    foundationInternal: true,
  }));
  const processByKey = new Map(processes.map((process) => [String(process.key), process]));
  const claimByKey = new Map(claims.map(({ claim }) => [String(claim.key), claim]));
  const processClaimLinks: Entity[] = [];
  for (const process of PROCESSES) {
    for (const claimKey of process.claimKeys) {
      const stored = processByKey.get(process.key);
      const claim = claimByKey.get(claimKey);
      if (!stored || !claim) throw new Error(`AT_FOUNDATION_PROCESS_CLAIM_MISSING:${process.key}:${claimKey}`);
      processClaimLinks.push(item("processClaimLinks", `${process.key}:${claimKey}`, {
        processId: stored.id,
        claimId: claim.id,
        role: "foundation_boundary",
        required: true,
        sequenceContext: "foundation",
        qualificationRequired: false,
      }));
    }
  }
  return Object.freeze({
    schemaVersion: 1 as const,
    packId: AT_NATIONAL_FOUNDATION_PACK_ID,
    countryCode: AT_NATIONAL_COUNTRY_CODE,
    canonicalLanguage: AT_NATIONAL_CANONICAL_LANGUAGE,
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

export function atNationalFoundationCounts(pack = buildAtNationalFoundationPack()) {
  return Object.freeze({
    packId: pack.packId,
    sources: pack.sources.length,
    authorityIdentities: pack.authorities.length,
    foundationClaims: pack.claims.length,
    processes: pack.processes.length,
    processClaimLinks: pack.processClaimLinks.length,
    identityKeys: AT_AUTHORITY_IDENTITY_KEYS,
    internalProcessKeys: AT_FOUNDATION_INTERNAL_PROCESS_KEYS,
    explicitlyNotBuilt: AT_NATIONAL_FOUNDATION_EXPLICITLY_NOT_BUILT,
    atSkTreatyClaims: 0,
    commercialCanonicalSourceCount: 0,
  });
}
