/**
 * AT-SK-0F Austrian operational routing for family-benefits coordination (Familienbeihilfe).
 * Does not restate Regulation 883/2004 Articles 67–69. EU family core owns legal merits.
 * Familienbeihilfe scope only — not Kinderbetreuungsgeld, Familienbonus Plus or tax credits.
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
    id: stableKnowledgeFactoryId(AT_FB_ROUTING_PACK_ID, entityClass, key),
    ...values,
  });
}

export const AT_FB_ROUTING_PACK_ID = "at_family_benefits_coordination_routing" as const;
export const AT_FB_ROUTING_PROCESS_GROUP = "at_family_benefits_coordination_routing" as const;
export const AT_FB_PRIMARY_PROCESS_KEY = "at-fb-familienbeihilfe-application" as const;
export const AT_FB_AS_OF = "2026-09-04" as const;
export const AT_FINANZAMT_OESTERREICH_ROLE = "AT_FINANZAMT_OESTERREICH" as const;

export const AT_FB_OFFICIAL_SOURCES = Object.freeze([
  {
    key: "at-fb-flag-ris",
    publisherKey: "ris-fb" as const,
    officialDomain: "www.ris.bka.gv.at",
    url: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10002586",
    title: "RIS: Familienlastenausgleichsgesetz 1967 (FLAG)",
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshnessClass: "LEGAL_CHANGE_MONITORED" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "LEGAL_BASELINE" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-fb-flag-ris-text",
      locator: "FLAG §10 §53 §55",
      text: "Nach § 10 FLAG kann Familienbeihilfe längstens fünf Jahre rückwirkend vom Beginn des Antragsmonats gewährt werden; diese nationale Rückwirkungsgrenze ist nicht jede unionsrechtliche oder verfahrensrechtliche Frist. § 53 FLAG regelt den EWR-Gleichbehandlungs- und Kindwohnsitzbezug; ein Kind im Ausland begründet keinen automatischen Ausschluss österreichischer Familienbeihilfe. § 55 FLAG hob die frühere Wohnsitzpreis-Indexierung nach dem aufgehobenen § 8a mit Wirkung ab 1. Jänner 2019 auf. Die aktuelle unionsrechtliche Ablehnung der Wohnsitzpreis-Indexierung folgt auch aus C-328/20. Historische Indexierungsregeln dürfen keinen aktuellen 2026-Fall lösen.",
    }],
  },
  {
    key: "at-fb-oesterreich-gv",
    publisherKey: "oesterreich-gv-fb" as const,
    officialDomain: "www.oesterreich.gv.at",
    url: "https://www.oesterreich.gv.at/de/themen/familie_und_partnerschaft/familienbeihilfe/Seite.450233",
    title: "oesterreich.gv.at: Familienbeihilfe Beantragung",
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshnessClass: "EVENT_DRIVEN" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "PROCESS_IDENTITY" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-fb-oesterreich-gv-text",
      locator: "Familienbeihilfe Antrag",
      text: "Die Finanzverwaltung bzw. das Finanzamt Österreich verwaltet die Familienbeihilfe. Der Antrag kann über FinanzOnline oder das Formular Beih100 Familienbeihilfe Zuerkennung, Änderung, Wegfall gestellt werden. Formulare, Kanäle und Kontakte sind live zu prüfen. Antrag ist nicht Genehmigung. Das Portal ist kein Gesetzestext und bestimmt nicht die unionsrechtliche Priorität nach Artikel 68.",
    }],
  },
  {
    key: "at-fb-bmf-beih100",
    publisherKey: "bmf-fb" as const,
    officialDomain: "www.bmf.gv.at",
    url: "https://www.bmf.gv.at/themen/familienleistungen/familienbeihilfe.html",
    title: "BMF: Familienbeihilfe Formulare und Beih100",
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshnessClass: "EVENT_DRIVEN" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "PROCESS_IDENTITY" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-fb-bmf-beih100-text",
      locator: "Beih100 / Beih38",
      text: "Das BMF stellt Formulare und Leitfäden bereit, darunter Beih100 für Zuerkennung, Änderung oder Wegfall der Familienbeihilfe und Beih38 für Ausgleichs- oder Differenzzahlung. Beih38 ist der operative österreichische Nachweis- und Antragsweg für Differenzzahlungen, beweist aber nicht automatisch, dass Österreich nachrangig ist. Die unionsrechtliche Priorität bleibt im geteilten EU-Familienkern. BMF-Leitfäden sind nicht die individuelle Prioritätsentscheidung.",
    }],
  },
  {
    key: "at-fb-finanzonline",
    publisherKey: "bmf-fb" as const,
    officialDomain: "finanzonline.bmf.gv.at",
    url: "https://finanzonline.bmf.gv.at/",
    title: "FinanzOnline: elektronischer Familienbeihilfe-Antrag",
    handlingMode: "FETCH_LIVE" as const,
    freshnessClass: "EVENT_DRIVEN" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "ONLINE_SERVICE_URL" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-fb-finanzonline-text",
      locator: "FinanzOnline Familienbeihilfe",
      text: "FinanzOnline ist ein aktueller elektronischer Antrags- und Verwaltungskanal für Familienbeihilfe. Die Nutzung von FinanzOnline begründet keinen automatischen Anspruch und bestimmt nicht den unionsrechtlichen Vorrang. Genaue Zugänge und Formularversionen sind live zu prüfen.",
    }],
  },
  {
    key: "at-fb-bmf-guidance",
    publisherKey: "bmf-fb" as const,
    officialDomain: "www.bmf.gv.at",
    url: "https://www.bmf.gv.at/themen/familienleistungen/familienbeihilfe-ausland.html",
    title: "BMF: Familienbeihilfe mit Auslandsbezug",
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshnessClass: "EVENT_DRIVEN" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "PROCESS_IDENTITY" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-fb-bmf-guidance-text",
      locator: "Auslandsbezug / Weiterleitung",
      text: "Bei Auslandsbezug verlangt die österreichische Verwaltung Nachweise über ausländische Familienleistungen und empfiehlt operationell, zuerst im vorrangigen Mitgliedstaat zu beantragen. Diese Empfehlung ist RECOMMENDED_OPERATIONAL_APPLICATION_ROUTE und ersetzt nicht die unionsrechtliche Weiterleitung nach Artikel 68 Absatz 3. Ein beim nachrangigen Träger gestellter Antrag ist routingseitig nicht verloren. Änderungen von Wohnsitz, Tätigkeit, Familie oder ausländischen Leistungen sind zu melden.",
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

export const AT_FB_UNITS: readonly Unit[] = Object.freeze([
  { key: "at-fb-does-not-copy-eu-law", category: "boundary", type: "boundary", text: "Diese österreichischen Familienleistungsrouting-Sätze wiederholen nicht die materiellen Artikel 67 bis 69. Die rechtliche Einordnung bleibt im geteilten EU-Familienkern.", sourceKey: "at-fb-bmf-guidance", passageKey: "at-fb-bmf-guidance-text", riskLevel: "high" },
  { key: "at-fb-does-not-copy-familienbeihilfe-merits", category: "boundary", type: "boundary", text: "Diese Routing-Sätze wiederholen nicht die nationalen Familienbeihilfevoraussetzungen, Kindesdefinitionen oder Betragsmerits des FLAG.", sourceKey: "at-fb-flag-ris", passageKey: "at-fb-flag-ris-text", riskLevel: "high" },
  { key: "at-fb-familienbeihilfe-scope-only", category: "scope", type: "definition", text: "Dieser Pack umfasst nur die operative Routung der Familienbeihilfe, nicht Kinderbetreuungsgeld, Familienbonus Plus, Mehrkindzuschlag oder allgemeine Steuergutschriften.", sourceKey: "at-fb-oesterreich-gv", passageKey: "at-fb-oesterreich-gv-text", riskLevel: "high" },
  { key: "at-fb-not-kinderbetreuungsgeld", category: "scope", type: "exception", text: "Familienbeihilfe ist nicht Kinderbetreuungsgeld; der Familienbeihilfeweg führt nicht in die Kinderbetreuungsgeld-Routung.", sourceKey: "at-fb-oesterreich-gv", passageKey: "at-fb-oesterreich-gv-text", riskLevel: "high" },
  { key: "at-fb-not-familienbonus-plus", category: "scope", type: "exception", text: "Familienbeihilfe ist nicht Familienbonus Plus; Familienbonus Plus ist ausdrücklich außerhalb dieses Routing-Packs.", sourceKey: "at-fb-oesterreich-gv", passageKey: "at-fb-oesterreich-gv-text", riskLevel: "high" },
  { key: "at-fb-finanzamt-oesterreich-role", category: "institution", type: "definition", text: "Für Familienbeihilfe ist die zuständige österreichische Verwaltungsbehörde das Finanzamt Österreich der Kategorie AT_FINANZAMT_OESTERREICH.", sourceKey: "at-fb-oesterreich-gv", passageKey: "at-fb-oesterreich-gv-text", riskLevel: "high" },
  { key: "at-fb-finanzamt-instance-fetch-live", category: "institution", type: "procedure", text: "Die genaue Amtsstelle, Kontakte und Formularzugänge des Finanzamts Österreich sind live zu bestimmen und nicht ohne Frische festzuschreiben.", sourceKey: "at-fb-finanzonline", passageKey: "at-fb-finanzonline-text", riskLevel: "medium", requiresAuthorityResolution: true },
  { key: "at-fb-finanzamt-not-priority", category: "priority", type: "exception", text: "Das Finanzamt Österreich verwaltet Familienbeihilfe, bestimmt aber nicht den unionsrechtlichen Vorrang nach Artikel 68.", sourceKey: "at-fb-oesterreich-gv", passageKey: "at-fb-oesterreich-gv-text", riskLevel: "high" },
  { key: "at-fb-bmf-guidance-role", category: "institution", type: "definition", text: "Das BMF stellt Gesetz, Leitfäden und Formulare für Familienbeihilfe bereit, entscheidet aber nicht die unionsrechtliche Priorität.", sourceKey: "at-fb-bmf-beih100", passageKey: "at-fb-bmf-beih100-text", riskLevel: "high" },
  { key: "at-fb-bmf-not-priority-decision", category: "priority", type: "exception", text: "BMF-Leitfäden und Formulare sind nicht die individuelle Artikel-68-Prioritätsentscheidung.", sourceKey: "at-fb-bmf-beih100", passageKey: "at-fb-bmf-beih100-text", riskLevel: "high" },
  { key: "at-fb-beih100-operational-route", category: "procedure", type: "procedure", text: "Beih100 Familienbeihilfe Zuerkennung, Änderung, Wegfall ist der aktuelle operative Papier- oder Download-Weg für Familienbeihilfe; Formularversionen sind live zu prüfen.", sourceKey: "at-fb-bmf-beih100", passageKey: "at-fb-bmf-beih100-text", riskLevel: "high" },
  { key: "at-fb-beih100-not-art68-merits", category: "boundary", type: "exception", text: "Beih100 ist nicht die unionsrechtliche Artikel-68-Einordnung und begründet keinen automatischen Vorrang.", sourceKey: "at-fb-bmf-beih100", passageKey: "at-fb-bmf-beih100-text", riskLevel: "high" },
  { key: "at-fb-finanzonline-route", category: "channel", type: "procedure", text: "FinanzOnline ist ein aktueller elektronischer Antrags- und Verwaltungskanal für Familienbeihilfe.", sourceKey: "at-fb-finanzonline", passageKey: "at-fb-finanzonline-text", riskLevel: "high" },
  { key: "at-fb-finanzonline-not-entitlement", category: "eligibility", type: "exception", text: "Die Nutzung von FinanzOnline begründet keinen automatischen Familienbeihilfeanspruch.", sourceKey: "at-fb-finanzonline", passageKey: "at-fb-finanzonline-text", riskLevel: "high" },
  { key: "at-fb-beih38-differential-route", category: "procedure", type: "procedure", text: "Beih38 Antrag auf Gewährung einer Ausgleichs- oder Differenzzahlung ist der operative österreichische Nachweis- und Antragsweg für Differenzzahlungen nach ausländischer Vorleistung.", sourceKey: "at-fb-bmf-beih100", passageKey: "at-fb-bmf-beih100-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "at-fb-beih38-not-secondary-proof", category: "priority", type: "exception", text: "Ein eingereichtes Beih38 beweist nicht automatisch, dass Österreich nachrangig ist; die unionsrechtliche Priorität kommt zuerst.", sourceKey: "at-fb-bmf-beih100", passageKey: "at-fb-bmf-beih100-text", riskLevel: "high" },
  { key: "at-fb-primary-full-payment-route", category: "procedure", type: "procedure", text: "Bei verifiziertem österreichischem Vorrang führt der Weg über Beih100 oder FinanzOnline zur vollen Familienbeihilfe; Beträge sind nicht zeitlos.", sourceKey: "at-fb-oesterreich-gv", passageKey: "at-fb-oesterreich-gv-text", riskLevel: "high" },
  { key: "at-fb-secondary-differential-review", category: "procedure", type: "procedure", text: "Bei verifiziertem österreichischem Nachrang bleibt eine Differenzzahlungsprüfung offen; Beih38 oder vergleichbarer Nachweis kann erforderlich sein.", sourceKey: "at-fb-bmf-beih100", passageKey: "at-fb-bmf-beih100-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "at-fb-secondary-no-difference", category: "procedure", type: "exception", text: "Nachrang bedeutet nicht automatisch eine Differenzzahlung; ohne verifizierte Körbe und Perioden bleibt die genaue Differenz unbeantwortet.", sourceKey: "at-fb-bmf-beih100", passageKey: "at-fb-bmf-beih100-text", riskLevel: "high" },
  { key: "at-fb-no-national-entitlement", category: "eligibility", type: "exception", text: "Ohne verifiziertes oder mögliches österreichisches Familienbeihilferecht bleibt die nationale Routung fail-closed.", sourceKey: "at-fb-flag-ris", passageKey: "at-fb-flag-ris-text", riskLevel: "high" },
  { key: "at-fb-national-eligibility-gate", category: "eligibility", type: "procedure", text: "Nationale Familienbeihilfeansprüche müssen von der unionsrechtlichen Priorität getrennt geprüft werden.", sourceKey: "at-fb-flag-ris", passageKey: "at-fb-flag-ris-text", riskLevel: "high" },
  { key: "at-fb-eu-coordination-not-national-entitlement", category: "boundary", type: "boundary", text: "EU-Familienleistungskoordinierung ersetzt nicht die nationalen Familienbeihilfevoraussetzungen.", sourceKey: "at-fb-bmf-guidance", passageKey: "at-fb-bmf-guidance-text", riskLevel: "high" },
  { key: "at-fb-misfiled-not-lost", category: "procedure", type: "exception", text: "Ein beim nicht vorrangigen Träger gestellter Antrag ist routingseitig nicht verloren; die unionsrechtliche Weiterleitung bleibt dem EU-Kern vorbehalten.", sourceKey: "at-fb-bmf-guidance", passageKey: "at-fb-bmf-guidance-text", riskLevel: "high" },
  { key: "at-fb-forwarding-handoff", category: "procedure", type: "procedure", text: "Wurde der Antrag bei einem nachrangigen österreichischen Träger eingereicht, ist die unionsrechtliche Weiterleitung an den vorrangigen Staat nicht als fachlich verloren zu behandeln.", sourceKey: "at-fb-bmf-guidance", passageKey: "at-fb-bmf-guidance-text", riskLevel: "high" },
  { key: "at-fb-filing-date-preserved", category: "deadline", type: "procedure", text: "Ein Weiterleitungsereignis setzt das geschützte ursprüngliche Antragsdatum nicht automatisch auf das Weiterleitungsdatum zurück.", sourceKey: "at-fb-bmf-guidance", passageKey: "at-fb-bmf-guidance-text", riskLevel: "high" },
  { key: "at-fb-recommended-route-not-legal-forwarding", category: "procedure", type: "exception", text: "Die österreichische Empfehlung, zuerst im vorrangigen Staat zu beantragen, ist RECOMMENDED_OPERATIONAL_APPLICATION_ROUTE und ersetzt nicht die unionsrechtliche Gültigkeit eines bei Österreich als Nachrang eingegangenen Antrags.", sourceKey: "at-fb-bmf-guidance", passageKey: "at-fb-bmf-guidance-text", riskLevel: "high" },
  { key: "at-fb-flag-10-five-year-boundary", category: "deadline", type: "definition", text: "Nach § 10 FLAG kann Familienbeihilfe längstens fünf Jahre rückwirkend vom Beginn des Antragsmonats gewährt werden.", sourceKey: "at-fb-flag-ris", passageKey: "at-fb-flag-ris-text", riskLevel: "high" },
  { key: "at-fb-flag-10-not-universal-deadline", category: "deadline", type: "exception", text: "Die §-10-Fünfjahresgrenze gilt nicht automatisch für jede Rückforderung, jeden Einspruch, jede Differenzstreitigkeit oder jede Meldepflicht.", sourceKey: "at-fb-flag-ris", passageKey: "at-fb-flag-ris-text", riskLevel: "high" },
  { key: "at-fb-flag-53-eea-equal-treatment", category: "eligibility", type: "definition", text: "§ 53 FLAG regelt den EWR-Gleichbehandlungs- und Kindwohnsitzbezug; ein Kind im Ausland begründet keinen automatischen Ausschluss österreichischer Familienbeihilfe.", sourceKey: "at-fb-flag-ris", passageKey: "at-fb-flag-ris-text", riskLevel: "high" },
  { key: "at-fb-child-abroad-not-automatic-denial", category: "eligibility", type: "exception", text: "Kind wohnt in der Slowakei oder einem anderen EWR-Staat ist nicht automatisch kein österreichischer Familienbeihilfeanspruch.", sourceKey: "at-fb-flag-ris", passageKey: "at-fb-flag-ris-text", riskLevel: "high" },
  { key: "at-fb-c328-20-indexation-rejected", category: "priority", type: "exception", text: "Aktuelle Familienbeihilfe darf nicht bloß wegen niedrigerer Preisniveaus im Kindwohnsitzstaat gekürzt werden; C-328/20 lehnt die Wohnsitzpreis-Indexierung ab.", sourceKey: "at-fb-flag-ris", passageKey: "at-fb-flag-ris-text", riskLevel: "high" },
  { key: "at-fb-flag-55-former-8a-superseded", category: "temporal", type: "definition", text: "§ 55 FLAG hob die frühere Wohnsitzpreis-Indexierung nach dem aufgehobenen § 8a mit Wirkung ab 1. Jänner 2019 auf.", sourceKey: "at-fb-flag-ris", passageKey: "at-fb-flag-ris-text", riskLevel: "high" },
  { key: "at-fb-historical-indexation-not-current", category: "temporal", type: "boundary", text: "Die frühere §-8a-Indexierung ist HISTORICAL_SUPERSEDED_RULE und darf keinen aktuellen 2026-Fall lösen.", sourceKey: "at-fb-flag-ris", passageKey: "at-fb-flag-ris-text", riskLevel: "high" },
  { key: "at-fb-amount-live-gate", category: "amount", type: "definition", text: "Aktuelle Familienbeihilfebeträge sind temporal und vor einer konkreten Auskunft FETCH_LIVE oder CACHE_AND_REVALIDATE erforderlich.", sourceKey: "at-fb-bmf-beih100", passageKey: "at-fb-bmf-beih100-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "at-fb-channel-fetch-live", category: "channel", type: "procedure", text: "Aktuelle Formulare, Portale und Kontakte des Finanzamts Österreich und des BMF sind live zu prüfen.", sourceKey: "at-fb-finanzonline", passageKey: "at-fb-finanzonline-text", riskLevel: "medium" },
  { key: "at-fb-application-not-approval", category: "deadline", type: "exception", text: "Antrag oder Vorlage von Beih100, Beih38 oder FinanzOnline ist nicht bereits genehmigter Anspruch.", sourceKey: "at-fb-oesterreich-gv", passageKey: "at-fb-oesterreich-gv-text", riskLevel: "high" },
  { key: "at-fb-change-reporting", category: "change", type: "procedure", text: "Änderungen von Wohnsitz, Tätigkeit, Familie oder ausländischen Familienleistungen sind dem Finanzamt Österreich zu melden.", sourceKey: "at-fb-bmf-guidance", passageKey: "at-fb-bmf-guidance-text", riskLevel: "high" },
  { key: "at-fb-not-health-insurer", category: "boundary", type: "exception", text: "Krankenversicherungsträger sind nicht der ordentliche Familienbeihilfeträger.", sourceKey: "at-fb-oesterreich-gv", passageKey: "at-fb-oesterreich-gv-text", riskLevel: "high" },
  { key: "at-fb-not-a1-priority", category: "boundary", type: "exception", text: "Ein A1- oder anwendbare-Rechtsvorschriften-Ergebnis bestimmt nicht automatisch den Familienleistungsvorrang.", sourceKey: "at-fb-bmf-guidance", passageKey: "at-fb-bmf-guidance-text", riskLevel: "high" },
  { key: "at-fb-not-s1-family", category: "boundary", type: "exception", text: "S1-Familienangehörigenanspruch ist nicht Artikel-68-Familienleistungspriorität und nicht Familienbeihilfe.", sourceKey: "at-fb-oesterreich-gv", passageKey: "at-fb-oesterreich-gv-text", riskLevel: "high" },
  { key: "at-fb-kinderabsetzbetrag-classification-oos", category: "scope", type: "boundary", text: "Kinderabsetzbetrag wird nicht automatisch in den F3-Korb aufgenommen; ohne verifizierte EU-Klassifikation bleibt die Einordnung außerhalb dieses Packs.", sourceKey: "at-fb-oesterreich-gv", passageKey: "at-fb-oesterreich-gv-text", riskLevel: "high" },
]);

type ProcessSpec = Readonly<{
  key: string;
  title: string;
  trigger: string;
  safeFirstStep: string;
  riskLevel: "medium" | "high";
  dimensions: Readonly<Record<(typeof PROCESS_COMPLETE_DIMENSIONS)[number], string>>;
}>;

export const AT_FB_PROCESSES: readonly ProcessSpec[] = Object.freeze([
  { key: "at-fb-route-classify", title: "Österreichischen Familienbeihilfeweg 2026 einordnen", trigger: "Familienbeihilfe mit Auslandsbezug, Träger unbekannt", safeFirstStep: "Finanzamt Österreich und BMF trennen; Kinderbetreuungsgeld und Familienbonus Plus ausschließen.", riskLevel: "high", dimensions: { what: "at-fb-familienbeihilfe-scope-only", whoWhen: "at-fb-finanzamt-oesterreich-role", documents: "at-fb-channel-fetch-live", how: "at-fb-not-kinderbetreuungsgeld", next: "at-fb-not-familienbonus-plus", deadlines: "at-fb-application-not-approval", problems: "at-fb-finanzamt-not-priority", dutiesAfter: "at-fb-change-reporting", institution: "at-fb-finanzamt-oesterreich-role", boundaries: "at-fb-does-not-copy-eu-law", freshness: "at-fb-channel-fetch-live", negatives: "at-fb-not-familienbonus-plus" } },
  { key: AT_FB_PRIMARY_PROCESS_KEY, title: "Grenzüberschreitenden Familienbeihilfeantrag 2026 führen", trigger: "Familienbeihilfe mit Wohnsitz, Tätigkeit oder Kind im Ausland", safeFirstStep: "Beih100 oder FinanzOnline; Formulare live prüfen.", riskLevel: "high", dimensions: { what: "at-fb-beih100-operational-route", whoWhen: "at-fb-finanzamt-oesterreich-role", documents: "at-fb-channel-fetch-live", how: "at-fb-finanzonline-route", next: "at-fb-application-not-approval", deadlines: "at-fb-application-not-approval", problems: "at-fb-no-national-entitlement", dutiesAfter: "at-fb-change-reporting", institution: "at-fb-finanzamt-oesterreich-role", boundaries: "at-fb-does-not-copy-familienbeihilfe-merits", freshness: "at-fb-finanzamt-instance-fetch-live", negatives: "at-fb-finanzonline-not-entitlement" } },
  { key: "at-fb-finanzamt-authority", title: "Finanzamt Österreich 2026 live bestimmen", trigger: "Nutzer verlangt die zuständige Familienbeihilfebehörde", safeFirstStep: "Instanz live holen; nicht als Artikel-68-Vorrang setzen.", riskLevel: "high", dimensions: { what: "at-fb-finanzamt-oesterreich-role", whoWhen: "at-fb-finanzamt-instance-fetch-live", documents: "at-fb-channel-fetch-live", how: "at-fb-finanzamt-instance-fetch-live", next: "at-fb-channel-fetch-live", deadlines: "at-fb-application-not-approval", problems: "at-fb-finanzamt-not-priority", dutiesAfter: "at-fb-change-reporting", institution: "at-fb-finanzamt-oesterreich-role", boundaries: "at-fb-does-not-copy-eu-law", freshness: "at-fb-finanzamt-instance-fetch-live", negatives: "at-fb-bmf-not-priority-decision" } },
  { key: "at-fb-finanzonline-beih100-route", title: "FinanzOnline und Beih100 2026 routen", trigger: "Elektronischer oder Papierantrag Familienbeihilfe", safeFirstStep: "Kanal live prüfen; Antrag nicht als Genehmigung setzen.", riskLevel: "high", dimensions: { what: "at-fb-finanzonline-route", whoWhen: "at-fb-beih100-operational-route", documents: "at-fb-channel-fetch-live", how: "at-fb-beih100-operational-route", next: "at-fb-application-not-approval", deadlines: "at-fb-application-not-approval", problems: "at-fb-beih100-not-art68-merits", dutiesAfter: "at-fb-change-reporting", institution: "at-fb-finanzamt-oesterreich-role", boundaries: "at-fb-does-not-copy-familienbeihilfe-merits", freshness: "at-fb-channel-fetch-live", negatives: "at-fb-finanzonline-not-entitlement" } },
  { key: "at-fb-primary-full-payment", title: "Österreichische Volleistung 2026 routen", trigger: "Verifizierter österreichischer Vorrang und nationales Recht", safeFirstStep: "Beih100 oder FinanzOnline; Betrag nicht zeitlos versprechen.", riskLevel: "high", dimensions: { what: "at-fb-primary-full-payment-route", whoWhen: "at-fb-finanzamt-oesterreich-role", documents: "at-fb-channel-fetch-live", how: "at-fb-amount-live-gate", next: "at-fb-application-not-approval", deadlines: "at-fb-amount-live-gate", problems: "at-fb-finanzamt-not-priority", dutiesAfter: "at-fb-change-reporting", institution: "at-fb-finanzamt-oesterreich-role", boundaries: "at-fb-does-not-copy-eu-law", freshness: "at-fb-amount-live-gate", negatives: "at-fb-no-national-entitlement" } },
  { key: "at-fb-secondary-differential-review", title: "Österreichische Differenzzahlung 2026 prüfen", trigger: "Verifizierter österreichischer Nachrang", safeFirstStep: "Beih38 nur nach unionsrechtlicher Priorität; Körbe verlangen.", riskLevel: "high", dimensions: { what: "at-fb-secondary-differential-review", whoWhen: "at-fb-beih38-differential-route", documents: "at-fb-channel-fetch-live", how: "at-fb-beih38-not-secondary-proof", next: "at-fb-secondary-no-difference", deadlines: "at-fb-amount-live-gate", problems: "at-fb-beih38-not-secondary-proof", dutiesAfter: "at-fb-change-reporting", institution: "at-fb-finanzamt-oesterreich-role", boundaries: "at-fb-does-not-copy-eu-law", freshness: "at-fb-amount-live-gate", negatives: "at-fb-secondary-no-difference" } },
  { key: "at-fb-beih38-differential", title: "Beih38 Differenzzahlung 2026", trigger: "Nachrangige österreichische Familienbeihilfe oder Ausgleichszahlung", safeFirstStep: "An das Finanzamt Österreich verweisen; Beih38 ist nicht Vorrangbeweis.", riskLevel: "high", dimensions: { what: "at-fb-beih38-differential-route", whoWhen: "at-fb-finanzamt-oesterreich-role", documents: "at-fb-channel-fetch-live", how: "at-fb-beih38-differential-route", next: "at-fb-secondary-no-difference", deadlines: "at-fb-amount-live-gate", problems: "at-fb-beih38-not-secondary-proof", dutiesAfter: "at-fb-change-reporting", institution: "at-fb-finanzamt-oesterreich-role", boundaries: "at-fb-does-not-copy-familienbeihilfe-merits", freshness: "at-fb-channel-fetch-live", negatives: "at-fb-beih38-not-secondary-proof" } },
  { key: "at-fb-secondary-application-forwarding", title: "Antrag in Österreich bei Nachrang 2026", trigger: "Antrag beim Finanzamt Österreich, Österreich vermutlich nachrangig", safeFirstStep: "Nicht als verloren behandeln; Weiterleitung dem EU-Kern überlassen.", riskLevel: "high", dimensions: { what: "at-fb-misfiled-not-lost", whoWhen: "at-fb-forwarding-handoff", documents: "at-fb-channel-fetch-live", how: "at-fb-recommended-route-not-legal-forwarding", next: "at-fb-filing-date-preserved", deadlines: "at-fb-application-not-approval", problems: "at-fb-misfiled-not-lost", dutiesAfter: "at-fb-change-reporting", institution: "at-fb-finanzamt-oesterreich-role", boundaries: "at-fb-does-not-copy-eu-law", freshness: "at-fb-channel-fetch-live", negatives: "at-fb-recommended-route-not-legal-forwarding" } },
  { key: "at-fb-eu-forwarding-handoff", title: "EU-Weiterleitungshandoff 2026", trigger: "Nachrangiger österreichischer Träger hat Antrag erhalten", safeFirstStep: "FORWARD_TO_PRIMARY_INSTITUTION; Antragsdatum erhalten.", riskLevel: "high", dimensions: { what: "at-fb-forwarding-handoff", whoWhen: "at-fb-filing-date-preserved", documents: "at-fb-channel-fetch-live", how: "at-fb-misfiled-not-lost", next: "at-fb-filing-date-preserved", deadlines: "at-fb-flag-10-five-year-boundary", problems: "at-fb-recommended-route-not-legal-forwarding", dutiesAfter: "at-fb-change-reporting", institution: "at-fb-finanzamt-oesterreich-role", boundaries: "at-fb-does-not-copy-eu-law", freshness: "at-fb-channel-fetch-live", negatives: "at-fb-misfiled-not-lost" } },
  { key: "at-fb-filing-date-preservation", title: "Ursprüngliches Antragsdatum 2026 erhalten", trigger: "Antrag wurde weitergeleitet oder zuerst im anderen Staat gestellt", safeFirstStep: "Weiterleitungsdatum nicht automatisch als neues Antragsdatum setzen.", riskLevel: "high", dimensions: { what: "at-fb-filing-date-preserved", whoWhen: "at-fb-flag-10-five-year-boundary", documents: "at-fb-channel-fetch-live", how: "at-fb-filing-date-preserved", next: "at-fb-flag-10-not-universal-deadline", deadlines: "at-fb-flag-10-five-year-boundary", problems: "at-fb-flag-10-not-universal-deadline", dutiesAfter: "at-fb-change-reporting", institution: "at-fb-finanzamt-oesterreich-role", boundaries: "at-fb-does-not-copy-eu-law", freshness: "at-fb-channel-fetch-live", negatives: "at-fb-flag-10-not-universal-deadline" } },
  { key: "at-fb-child-abroad-equality", title: "Kind im Ausland und § 53 FLAG 2026", trigger: "Kind wohnt in SK oder anderem EWR-Staat", safeFirstStep: "Nicht automatisch ablehnen; EU-Koordination und FLAG § 53 trennen.", riskLevel: "high", dimensions: { what: "at-fb-flag-53-eea-equal-treatment", whoWhen: "at-fb-child-abroad-not-automatic-denial", documents: "at-fb-channel-fetch-live", how: "at-fb-national-eligibility-gate", next: "at-fb-eu-coordination-not-national-entitlement", deadlines: "at-fb-application-not-approval", problems: "at-fb-child-abroad-not-automatic-denial", dutiesAfter: "at-fb-change-reporting", institution: "at-fb-finanzamt-oesterreich-role", boundaries: "at-fb-does-not-copy-eu-law", freshness: "at-fb-channel-fetch-live", negatives: "at-fb-child-abroad-not-automatic-denial" } },
  { key: "at-fb-indexation-rejection-current", title: "Aktuelle Wohnsitzpreis-Indexierung ablehnen", trigger: "Familienbeihilfe soll wegen Kindwohnsitz SK gekürzt werden", safeFirstStep: "C-328/20 und § 55 FLAG führen; früheres § 8a nicht anwenden.", riskLevel: "high", dimensions: { what: "at-fb-c328-20-indexation-rejected", whoWhen: "at-fb-flag-55-former-8a-superseded", documents: "at-fb-c328-20-indexation-rejected", how: "at-fb-historical-indexation-not-current", next: "at-fb-child-abroad-not-automatic-denial", deadlines: "at-fb-historical-indexation-not-current", problems: "at-fb-historical-indexation-not-current", dutiesAfter: "at-fb-change-reporting", institution: "at-fb-finanzamt-oesterreich-role", boundaries: "at-fb-does-not-copy-eu-law", freshness: "at-fb-historical-indexation-not-current", negatives: "at-fb-historical-indexation-not-current" } },
  { key: "at-fb-flag-10-retroactive-boundary", title: "§ 10 FLAG Fünfjahresgrenze 2026", trigger: "Rückwirkende Familienbeihilfe oder weitergeleiteter Antrag", safeFirstStep: "Fünf Jahre ab Antragsmonat; nicht jede Frist universalisieren.", riskLevel: "high", dimensions: { what: "at-fb-flag-10-five-year-boundary", whoWhen: "at-fb-filing-date-preserved", documents: "at-fb-flag-10-five-year-boundary", how: "at-fb-flag-10-not-universal-deadline", next: "at-fb-filing-date-preserved", deadlines: "at-fb-flag-10-five-year-boundary", problems: "at-fb-flag-10-not-universal-deadline", dutiesAfter: "at-fb-change-reporting", institution: "at-fb-finanzamt-oesterreich-role", boundaries: "at-fb-does-not-copy-familienbeihilfe-merits", freshness: "at-fb-flag-10-five-year-boundary", negatives: "at-fb-flag-10-not-universal-deadline" } },
  { key: "at-fb-material-change-reassessment", title: "Familienbeihilfe nach Sachverhaltsänderung neu prüfen", trigger: "Tätigkeit, Wohnsitz, Kind oder ausländische Leistung ändert sich", safeFirstStep: "Vorrang und nationale Rechte erneut klassifizieren; alten Anspruch nicht fortschreiben.", riskLevel: "high", dimensions: { what: "at-fb-change-reporting", whoWhen: "at-fb-national-eligibility-gate", documents: "at-fb-channel-fetch-live", how: "at-fb-change-reporting", next: "at-fb-change-reporting", deadlines: "at-fb-application-not-approval", problems: "at-fb-no-national-entitlement", dutiesAfter: "at-fb-change-reporting", institution: "at-fb-finanzamt-oesterreich-role", boundaries: "at-fb-does-not-copy-eu-law", freshness: "at-fb-channel-fetch-live", negatives: "at-fb-misfiled-not-lost" } },
  { key: "at-fb-amount-freshness-handoff", title: "Aktuelle Familienbeihilfebeträge 2026 revalidieren", trigger: "Nutzer verlangt eine zeitlose Familienbeihilfehöhe", safeFirstStep: "CURRENT_AMOUNT_LOOKUP_REQUIRED; Betrag nicht als zeitlos speichern.", riskLevel: "high", dimensions: { what: "at-fb-amount-live-gate", whoWhen: "at-fb-amount-live-gate", documents: "at-fb-channel-fetch-live", how: "at-fb-amount-live-gate", next: "at-fb-secondary-no-difference", deadlines: "at-fb-amount-live-gate", problems: "at-fb-secondary-no-difference", dutiesAfter: "at-fb-change-reporting", institution: "at-fb-finanzamt-oesterreich-role", boundaries: "at-fb-does-not-copy-familienbeihilfe-merits", freshness: "at-fb-amount-live-gate", negatives: "at-fb-secondary-no-difference" } },
]);

export const AT_FB_NEGATIVE_CONTROLS = Object.freeze([
  "at-fb-finanzamt-not-priority",
  "at-fb-not-kinderbetreuungsgeld",
  "at-fb-not-familienbonus-plus",
  "at-fb-beih38-not-secondary-proof",
  "at-fb-finanzonline-not-entitlement",
  "at-fb-bmf-not-priority-decision",
  "at-fb-c328-20-indexation-rejected",
  "at-fb-historical-indexation-not-current",
  "at-fb-child-abroad-not-automatic-denial",
  "at-fb-not-a1-priority",
  "at-fb-does-not-copy-eu-law",
  "at-fb-does-not-copy-familienbeihilfe-merits",
]);

export function evaluateAtFamilyProcessCompleteness() {
  const incomplete = AT_FB_PROCESSES.filter((process) => (
    PROCESS_COMPLETE_DIMENSIONS.some((dimension) => !process.dimensions[dimension])
  ));
  const keys = new Set(AT_FB_UNITS.map((unit) => unit.key));
  const missing = AT_FB_PROCESSES.flatMap((process) => (
    PROCESS_COMPLETE_DIMENSIONS
      .map((dimension) => process.dimensions[dimension])
      .filter((key) => !keys.has(key))
      .map((key) => `${process.key}:${key}`)
  ));
  const processComplete = incomplete.length === 0 && missing.length === 0;
  return Object.freeze({
    processCount: AT_FB_PROCESSES.length,
    processComplete,
    processCompletenessPercent: processComplete ? 100 : 0,
    incompleteProcessKeys: incomplete.map((process) => process.key),
    missingClaims: missing,
  });
}

const PUBLISHERS = Object.freeze([
  { key: "ris-fb", name: "Republik Österreich – Rechtsinformationssystem", portal: "https://www.ris.bka.gv.at/", identity: "AT_RIS_FB" },
  { key: "oesterreich-gv-fb", name: "oesterreich.gv.at", portal: "https://www.oesterreich.gv.at/", identity: "AT_OESTERREICH_GV_FB" },
  { key: "bmf-fb", name: "Bundesministerium für Finanzen", portal: "https://www.bmf.gv.at/", identity: "AT_BMF_FB" },
]);

export function buildAtFamilyBenefitsCoordinationRoutingPack() {
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
  const sources = AT_FB_OFFICIAL_SOURCES.map((spec) => {
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
      effectiveDate: AT_FB_AS_OF,
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
  const claims = AT_FB_UNITS.map((unit) => {
    const source = sourceByKey.get(unit.sourceKey);
    const passage = passageByKey.get(unit.passageKey);
    if (!source || !passage) throw new Error(`AT_FB_UNIT_SOURCE_MISSING:${unit.key}`);
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
  const processes = AT_FB_PROCESSES.map((spec) => item("processes", spec.key, {
    processGroupId: AT_FB_ROUTING_PROCESS_GROUP, title: spec.title, jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id, riskLevel: spec.riskLevel, trigger: spec.trigger,
    safeFirstStep: spec.safeFirstStep, regionalVariationExpected: false,
  }));
  const processByKey = new Map(processes.map((process) => [String(process.key), process]));
  const claimByKey = new Map(claims.map(({ claim }) => [String(claim.key), claim]));
  const processClaimLinks: Entity[] = [];
  const seen = new Set<string>();
  for (const process of AT_FB_PROCESSES) {
    for (const dimension of PROCESS_COMPLETE_DIMENSIONS) {
      const claimKey = process.dimensions[dimension];
      const token = `${process.key}:${claimKey}:${dimension}`;
      if (seen.has(token)) continue;
      const stored = processByKey.get(process.key);
      const claim = claimByKey.get(claimKey);
      if (!stored || !claim) throw new Error(`AT_FB_PROCESS_CLAIM_MISSING:${process.key}:${claimKey}`);
      seen.add(token);
      processClaimLinks.push(item("processClaimLinks", token, {
        processId: stored.id, claimId: claim.id, role: dimension, required: true,
        sequenceContext: dimension, qualificationRequired: false,
      }));
    }
  }
  return Object.freeze({
    schemaVersion: 1,
    packId: AT_FB_ROUTING_PACK_ID,
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
