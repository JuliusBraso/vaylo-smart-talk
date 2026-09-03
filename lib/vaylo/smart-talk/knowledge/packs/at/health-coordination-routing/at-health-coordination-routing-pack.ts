/**
 * AT-SK-0E Austrian operational routing for health coordination (S1 / EKVK / PEB / S2).
 * Does not restate Regulation 883/2004 Articles 17–20. EU health core owns legal merits.
 * Does not re-determine applicable legislation. Consumes a verified 0D result.
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
    id: stableKnowledgeFactoryId(AT_HEALTH_ROUTING_PACK_ID, entityClass, key),
    ...values,
  });
}

export const AT_HEALTH_ROUTING_PACK_ID = "at_health_coordination_routing" as const;
export const AT_HEALTH_ROUTING_PROCESS_GROUP = "at_health_coordination_routing" as const;
export const AT_HEALTH_PRIMARY_PROCESS_KEY = "at-health-carrier-resolve" as const;
export const AT_HEALTH_AS_OF = "2026-09-03" as const;

export type AtHealthCarrier = "SVS" | "OEGK" | "BVAEB" | "OTHER_VERIFIED_AT_CARRIER" | "UNRESOLVED";
export type AtHealthInsuranceCategory = "ORDINARY_EMPLOYEE" | "SPECIAL_BVAEB" | "SELF_EMPLOYED_COVERED" | "UNKNOWN";
export type AtHealthSituation = "RESIDENCE_IN_OTHER_MEMBER_STATE" | "TEMPORARY_STAY" | "PLANNED_TREATMENT";
export type AtS1Status =
  | "NOT_REQUIRED"
  | "ELIGIBILITY_UNRESOLVED"
  | "REQUEST_REQUIRED"
  | "REQUESTED"
  | "ISSUED"
  | "REGISTRATION_REQUIRED"
  | "REGISTERED"
  | "SUPERSEDED"
  | "CANCELLED"
  | "REASSESSMENT_REQUIRED";
export type AtEhicStatus =
  | "VALID_EHIC"
  | "PROVISIONAL_CERTIFICATE_REQUIRED"
  | "EXPIRED"
  | "NOT_AVAILABLE"
  | "ENTITLEMENT_UNRESOLVED"
  | "PLANNED_TREATMENT_NOT_EHIC";
export type AtS2Status =
  | "NOT_PLANNED_TREATMENT"
  | "AUTHORIZATION_REQUIRED"
  | "AUTHORIZATION_PENDING"
  | "AUTHORIZED"
  | "REFUSED"
  | "MEDICAL_ASSESSMENT_REQUIRED"
  | "PROCEDURAL_ROUTE_UNRESOLVED";

export const AT_HEALTH_OFFICIAL_SOURCES = Object.freeze([
  {
    key: "at-health-oegk-wohnsitz",
    publisherKey: "oegk-health" as const,
    officialDomain: "www.oegk.at",
    url: "https://www.oegk.at/cdscontent/?contentid=10007.909404&portal=oegkdgportal",
    title: "ÖGK: Ausländische Krankmeldungen und Wohnsitzbescheinigung, Newsletter März 2026",
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshnessClass: "EVENT_DRIVEN" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "PROCESS_IDENTITY" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-health-oegk-wohnsitz-text",
      locator: "Wohnsitzbescheinigung / geplante Behandlung",
      text: "Versicherte der ÖGK mit Wohnsitz im Ausland können medizinische Leistungen im Wohnsitzstaat in Anspruch nehmen. Damit die Abrechnung über den Krankenversicherungsträger im Wohnsitzstaat funktioniert, ist ein Antrag auf Wohnsitzbescheinigung bei der ÖGK zu stellen. Geplante Behandlungen im Ausland sind vorab von der ÖGK zu bewilligen, ausgenommen es liegt eine Wohnsitzbescheinigung vor. Die Wohnsitzbescheinigung ist der österreichische operative S1-Weg der ÖGK für ihre Versicherten und gilt nicht universell für SVS oder BVAEB.",
    }],
  },
  {
    key: "at-health-oegk-s2",
    publisherKey: "oegk-health" as const,
    officialDomain: "www.oegk.at",
    url: "https://www.oegk.at/cdscontent/?contentid=10007.870660&portal=oegkportal",
    title: "ÖGK: Geplante Behandlung oder Untersuchung im Ausland, PD S2",
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshnessClass: "EVENT_DRIVEN" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "PROCESS_IDENTITY" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-health-oegk-s2-text",
      locator: "PD S2 nach medizinischer Bewilligung",
      text: "Von einer geplanten Behandlung spricht die ÖGK, wenn die Intention der Reise die Inanspruchnahme einer Behandlung oder Untersuchung ist. In einer Vertragseinrichtung eines ausländischen Krankenversicherungsträgers in der EU, dem EWR, der Schweiz oder dem Vereinigten Königreich erfolgt nach medizinischer Bewilligung die Ausstellung des Portable Document S2. Die medizinische Bewilligung setzt voraus, dass die Behandlung zu den vorgesehenen Leistungen gehört und sie nicht innerhalb eines medizinisch vertretbaren Zeitraums in Österreich gewährt werden kann. Der Antrag muss spätestens zwei Wochen vor Beginn gestellt werden; die medizinische Beurteilung erfolgt anhand eines von einem österreichischen allgemein öffentlichen Krankenhaus ausgefüllten Antrags. Privateinrichtungen sind nicht automatisch erfasst. Kostenbeiträge vor Ort können anfallen. Die Regelungen gelten nicht für akut notwendige Behandlungen während Urlaub oder Dienstreise. ÖGK-Formulare und Fristen gelten nicht automatisch für SVS oder BVAEB. Exakte Stellen und Kontakte sind live zu prüfen.",
    }],
  },
  {
    key: "at-health-dachverband-ekvk",
    publisherKey: "dachverband-health" as const,
    officialDomain: "www.sozialversicherung.at",
    url: "https://www.sozialversicherung.at/cdscontent/?contentid=10007.846024&portal=svportal",
    title: "Dachverband: Europäische Krankenversicherungskarte EKVK und PEB",
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshnessClass: "EVENT_DRIVEN" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "PROCESS_IDENTITY" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-health-dachverband-ekvk-text",
      locator: "EKVK Rückseite e-card / PEB",
      text: "Die Europäische Krankenversicherungskarte befindet sich auf der Rückseite der e-card. Vertragsärzte und Vertragskrankenanstalten im Aufenthaltsstaat sind verpflichtet, die EKVK zu akzeptieren und wie einen nationalen Patienten zu behandeln. Bei Ärzten und Spitälern ohne Vertrag mit der Sozialversicherung des Aufenthaltsstaates muss die Rechnung vorerst selbst bezahlt werden. Sind Datenfelder mit Sternchen befüllt, gilt die Karte nicht als Anspruchsnachweis; dann ist vor Reiseantritt beim zuständigen Krankenversicherungsträger die Bescheinigung als provisorischer Ersatz für die EKVK (PEB) zu beantragen. Die EKVK stellt der zuständige österreichische Krankenversicherungsträger aus, nicht automatisch ÖGK.",
    }],
  },
  {
    key: "at-health-gv-ekvk",
    publisherKey: "oesterreich-gv" as const,
    officialDomain: "www.oesterreich.gv.at",
    url: "https://www.oesterreich.gv.at/de/themen/gesundheit/elektronisches-gesundheitssystem/ecard/Ausstellung-einer-Europ%C3%A4ischen-Krankenversicherungskarte",
    title: "oesterreich.gv.at: Ausstellung einer Europäischen Krankenversicherungskarte",
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshnessClass: "EVENT_DRIVEN" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "PROCESS_IDENTITY" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-health-gv-ekvk-text",
      locator: "EKVK / Ersatzbescheinigung",
      text: "Die EKVK ist auf der Rückseite der e-card aufgebracht und dient vorübergehenden Aufenthalten. Kann die EKVK nicht aktiviert werden, stellt der zuständige Versicherungsträger eine provisorische Ersatzbescheinigung aus. Die EKVK wird vom jeweiligen zuständigen Krankenversicherungsträger ausgestellt. Exakte Kundenservice-Kontakte sind live zu prüfen.",
    }],
  },
  {
    key: "at-health-svs-residence",
    publisherKey: "svs-health" as const,
    officialDomain: "www.svs.at",
    url: "https://www.svs.at/cdscontent/?contentid=10007.816725&portal=svsportal",
    title: "SVS: EU/EWR/Vertragsstaaten, Auslandsbetreuungsschein bei Wohnsitz im anderen Staat",
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshnessClass: "EVENT_DRIVEN" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "AUTHORITY_COMPETENCE" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-health-svs-residence-text",
      locator: "Dauerbetreuung im Wohnsitzstaat",
      text: "Wer bei der SVS versichert ist und in einem Mitgliedstaat der EU, des EWR oder in einem Vertragsstaat wohnt, kann die Dauerbetreuung im Wohnsitzstaat beantragen. Die SVS stellt einen Auslandsbetreuungsschein aus, der an den zuständigen Krankenversicherungsträger im Wohnortstaat übermittelt wird; bei EU/EWR, der Schweiz und Serbien erfolgt dies elektronisch. Die Person erhält die gleiche medizinische Betreuung wie Versicherte des Wohnstaats. Umfang und Selbstbehalte richten sich nach dem Wohnortstaat. Selbständigkeit allein oder Tätigkeit in Österreich begründet nicht automatisch SVS-Krankenkompetenz.",
    }],
  },
  {
    key: "at-health-svs-s2",
    publisherKey: "svs-health" as const,
    officialDomain: "www.svs.at",
    url: "https://www.svs.at/cdscontent/load?contentid=10008.796957&version=1752563644",
    title: "SVS: Antrag auf Kostenübernahme einer geplanten Krankenbehandlung im Ausland, Art. 20 VO 883/2004",
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshnessClass: "EVENT_DRIVEN" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "PROCESS_IDENTITY" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-health-svs-s2-text",
      locator: "Art. 20 geplante Krankenbehandlung",
      text: "Die SVS führt einen eigenen Antrag auf Kostenübernahme einer geplanten Krankenbehandlung im Ausland nach Artikel 20 der Verordnung 883/2004. Voraussetzungen sind eine medizinisch notwendige Behandlung und dass diese in keiner österreichischen Einrichtung, in der Regel Universitätsklinik, möglich ist. Die medizinische Stellungnahme bleibt MEDICAL_ASSESSMENT_REQUIRED. Das SVS-Formular gilt nicht für ÖGK oder BVAEB.",
    }],
  },
  {
    key: "at-health-bvaeb-abroad",
    publisherKey: "bvaeb-health" as const,
    officialDomain: "www.bvaeb.at",
    url: "https://www.bvaeb.at/cdscontent/?contentid=10007.853920&portal=bvaebbportal",
    title: "BVAEB: Spitalsaufenthalt im Ausland, EKVK und geplante Anstaltspflege",
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshnessClass: "EVENT_DRIVEN" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "AUTHORITY_COMPETENCE" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "at-health-bvaeb-abroad-text",
      locator: "EKVK / geplante Anstaltspflege",
      text: "Ein Spitalsaufenthalt im Ausland kann mittels Betreuungsschein oder Europäischer Krankenversicherungskarte direkt mit der BVAEB abgerechnet werden. Für geplante Anstaltspflege im Ausland, weil eine gleichwertige Behandlung in Österreich nicht oder nicht zeitgerecht möglich ist, ist vor Inanspruchnahme die zuständige Kundenservicestelle zu kontaktieren. Die genaue aktuelle S2-Verfahrensführung der BVAEB ist AUTHORITY_VERIFIED_BUT_CURRENT_PROCEDURE_FETCH_REQUIRED und darf nicht aus ÖGK-Formularen abgeleitet werden.",
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

export const AT_HEALTH_UNITS: readonly Unit[] = Object.freeze([
  { key: "at-health-does-not-copy-eu-law", category: "boundary", type: "boundary", text: "Diese österreichischen Gesundheitsrouting-Sätze wiederholen nicht die materiellen Artikel 17 bis 20. Die rechtliche Einordnung bleibt im geteilten EU-Gesundheitskern.", sourceKey: "at-health-oegk-s2", passageKey: "at-health-oegk-s2-text", riskLevel: "high" },
  { key: "at-health-requires-al-result", category: "dependency", type: "procedure", text: "Österreichisches Gesundheitsrouting setzt ein verifiziertes Ergebnis der anwendbaren Rechtsvorschriften voraus. Fehlt es, gilt APPLICABLE_LEGISLATION_CONTEXT_REQUIRED.", sourceKey: "at-health-oegk-wohnsitz", passageKey: "at-health-oegk-wohnsitz-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "at-health-does-not-redetermine-al", category: "dependency", type: "exception", text: "Die Gesundheitsschicht bestimmt anwendbare Rechtsvorschriften nicht neu und überschreibt sie nicht aus S1, EHIC oder S2.", sourceKey: "at-health-oegk-wohnsitz", passageKey: "at-health-oegk-wohnsitz-text", riskLevel: "high" },
  { key: "at-health-ordinary-employee-oegk-candidate", category: "carrier", type: "procedure", text: "Für die verifizierte ordentliche österreichische Arbeitnehmerkategorie ist die ÖGK der aktuelle operative Gesundheits- und S1-Kandidat, nicht ein universeller Träger.", sourceKey: "at-health-oegk-wohnsitz", passageKey: "at-health-oegk-wohnsitz-text", riskLevel: "high" },
  { key: "at-health-employee-not-always-oegk", category: "carrier", type: "exception", text: "Ein österreichischer Arbeitnehmer ist nicht automatisch ÖGK-Krankenfall. Die Trägerwahl folgt der gesetzlich zugeordneten Versichertengruppe.", sourceKey: "at-health-bvaeb-abroad", passageKey: "at-health-bvaeb-abroad-text", riskLevel: "high" },
  { key: "at-health-bvaeb-special-route", category: "carrier", type: "procedure", text: "Für gesetzlich der BVAEB zugeordnete Gruppen ist die BVAEB der eigene Kranken-, EKVK- und geplante-Auslandsbehandlungsweg.", sourceKey: "at-health-bvaeb-abroad", passageKey: "at-health-bvaeb-abroad-text", riskLevel: "high" },
  { key: "at-health-unknown-carrier-unresolved", category: "carrier", type: "exception", text: "Ohne geklärte österreichische Versicherungskategorie bleibt die Gesundheitsträgerzuordnung UNRESOLVED. Es gibt keine Einfüge- oder Standardwahl.", sourceKey: "at-health-bvaeb-abroad", passageKey: "at-health-bvaeb-abroad-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "at-health-svs-self-employed-route", category: "carrier", type: "procedure", text: "Für Personen, die tatsächlich der österreichischen Selbständigenversicherung unterliegen, ist die SVS der österreichische Gesundheits- und Auslandsbetreuungsschein-Weg.", sourceKey: "at-health-svs-residence", passageKey: "at-health-svs-residence-text", riskLevel: "high" },
  { key: "at-health-svs-not-automatic-from-status", category: "carrier", type: "exception", text: "Selbständigenstatus, ein österreichisches Projekt oder eine SVS-Mitgliedschaft allein begründet nicht österreichische Krankenkompetenz und nicht automatisch den SVS-S1-Weg.", sourceKey: "at-health-svs-residence", passageKey: "at-health-svs-residence-text", riskLevel: "high" },
  { key: "at-health-oegk-s1-wohnsitzbescheinigung", category: "s1", type: "procedure", text: "Ist Österreich zuständig und die Person der ÖGK zugeordnet, ist der aktuelle operative S1-Weg der Antrag auf Wohnsitzbescheinigung bei der ÖGK für die Eintragung im Wohnstaat.", sourceKey: "at-health-oegk-wohnsitz", passageKey: "at-health-oegk-wohnsitz-text", riskLevel: "high" },
  { key: "at-health-svs-auslandsbetreuungsschein", category: "s1", type: "procedure", text: "Ist Österreich zuständig und die Person der SVS zugeordnet, stellt die SVS den Auslandsbetreuungsschein für die Dauerbetreuung im Wohnsitzstaat aus und übermittelt ihn an den Wohnortträger.", sourceKey: "at-health-svs-residence", passageKey: "at-health-svs-residence-text", riskLevel: "high" },
  { key: "at-health-s1-issuer-not-registration", category: "s1", type: "boundary", text: "S1_ISSUING_INSTITUTION und S1_RESIDENCE_REGISTRATION_INSTITUTION sind zu trennen. Der zuständige österreichische Träger stellt aus; der Wohnstaatträger trägt ein.", sourceKey: "at-health-svs-residence", passageKey: "at-health-svs-residence-text", riskLevel: "high" },
  { key: "at-health-incoming-s1-fail-closed", category: "s1", type: "exception", text: "Ist die Slowakei zuständig und Österreich Wohnstaat, darf der österreichische Eintragungsträger nicht geraten werden. Ohne verifizierte Kategorie gilt AUTHORITY_UNRESOLVED.", sourceKey: "at-health-oegk-wohnsitz", passageKey: "at-health-oegk-wohnsitz-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "at-health-s1-not-boolean", category: "s1", type: "boundary", text: "S1 ist kein einzelnes Ja/Nein. Mögliche Zustände sind NOT_REQUIRED, ELIGIBILITY_UNRESOLVED, REQUEST_REQUIRED, REQUESTED, ISSUED, REGISTRATION_REQUIRED, REGISTERED, SUPERSEDED, CANCELLED und REASSESSMENT_REQUIRED.", sourceKey: "at-health-oegk-wohnsitz", passageKey: "at-health-oegk-wohnsitz-text", riskLevel: "high" },
  { key: "at-health-s1-not-automatic-for-stay", category: "s1", type: "exception", text: "Vorübergehender Aufenthalt oder Entsendung löst nicht automatisch den österreichischen S1-Weg aus.", sourceKey: "at-health-oegk-s2", passageKey: "at-health-oegk-s2-text", riskLevel: "high" },
  { key: "at-health-ekvk-on-ecard", category: "ehic", type: "definition", text: "Für österreichisch Versicherte ist die europäische Krankenversicherungsberechtigung operativ die EKVK auf der Rückseite der e-card, sofern die Datenfelder vollständig sind.", sourceKey: "at-health-dachverband-ekvk", passageKey: "at-health-dachverband-ekvk-text", riskLevel: "high" },
  { key: "at-health-peb-replacement", category: "ehic", type: "procedure", text: "Fehlt eine gültige EKVK, etwa bei Sternchenfeldern, Verlust oder Ablauf, führt der Weg über den zuständigen österreichischen Krankenversicherungsträger zur PEB. Fehlende Karte bedeutet nicht fehlenden Anspruch.", sourceKey: "at-health-dachverband-ekvk", passageKey: "at-health-dachverband-ekvk-text", riskLevel: "high" },
  { key: "at-health-ehic-from-competent-carrier", category: "ehic", type: "procedure", text: "Die EKVK oder PEB stellt der zuständige österreichische Krankenversicherungsträger aus, nicht der Wohnortträger eines anderen Staats und nicht automatisch ÖGK.", sourceKey: "at-health-gv-ekvk", passageKey: "at-health-gv-ekvk-text", riskLevel: "high" },
  { key: "at-health-ehic-not-private-or-free", category: "ehic", type: "exception", text: "EKVK gilt bei Vertragspartnern des Aufenthaltsstaats. Private Anbieter und Nullkosten sind nicht garantiert.", sourceKey: "at-health-dachverband-ekvk", passageKey: "at-health-dachverband-ekvk-text", riskLevel: "high" },
  { key: "at-health-oegk-s2-prior-approval", category: "s2", type: "procedure", text: "Für ÖGK-Versicherte erfolgt nach medizinischer Vorabbewilligung die Ausstellung von PD S2 für geplante Behandlung in einer Vertragseinrichtung. Nicht zuerst behandeln und später automatisch erstatten.", sourceKey: "at-health-oegk-s2", passageKey: "at-health-oegk-s2-text", riskLevel: "high" },
  { key: "at-health-svs-s2-art20", category: "s2", type: "procedure", text: "Für SVS-Versicherte besteht ein eigener Artikel-20-Antrag auf geplante Krankenbehandlung im Ausland. Das SVS-Formular gilt nicht für andere Träger.", sourceKey: "at-health-svs-s2", passageKey: "at-health-svs-s2-text", riskLevel: "high" },
  { key: "at-health-bvaeb-s2-fetch-required", category: "s2", type: "procedure", text: "Die BVAEB ist für geplante Auslandsanstaltspflege ihrer Versicherten zuständig, aber das genaue aktuelle S2-Verfahren ist AUTHORITY_VERIFIED_BUT_CURRENT_PROCEDURE_FETCH_REQUIRED.", sourceKey: "at-health-bvaeb-abroad", passageKey: "at-health-bvaeb-abroad-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "at-health-s2-not-oegk-universal", category: "s2", type: "exception", text: "ÖGK-S2-Formulare, Zwei-Wochen-Frist und Krankenhausbeiblatt gelten nicht automatisch für SVS oder BVAEB.", sourceKey: "at-health-oegk-s2", passageKey: "at-health-oegk-s2-text", riskLevel: "high" },
  { key: "at-health-s2-not-treat-first", category: "s2", type: "exception", text: "Geplante Behandlung darf nicht mit dem Hinweis beantwortet werden, zuerst zu behandeln und S2 später automatisch zu erhalten.", sourceKey: "at-health-oegk-s2", passageKey: "at-health-oegk-s2-text", riskLevel: "high" },
  { key: "at-health-medical-assessment-required", category: "s2", type: "boundary", text: "BIRELLO diagnostiziert nicht und berechnet keine medizinisch vertretbare Wartezeit. Soweit medizinische Kriterien gelten, bleibt MEDICAL_ASSESSMENT_REQUIRED.", sourceKey: "at-health-svs-s2", passageKey: "at-health-svs-s2-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "at-health-office-fetch-live", category: "channel", type: "procedure", text: "Exakte ÖGK-Stellen, SVS-Landesstellen, BVAEB-Kundenservice, Telefon, E-Mail und Öffnungszeiten sind FETCH_LIVE.", sourceKey: "at-health-oegk-s2", passageKey: "at-health-oegk-s2-text", riskLevel: "medium" },
  { key: "at-health-provider-fetch-live", category: "channel", type: "procedure", text: "Die Teilnahme eines konkreten Krankenhauses oder Arztes am gesetzlichen System ist FETCH_LIVE und darf nicht kanonisch eingefroren werden.", sourceKey: "at-health-oegk-s2", passageKey: "at-health-oegk-s2-text", riskLevel: "medium" },
  { key: "at-health-material-change-reassessment", category: "change", type: "procedure", text: "Wechsel des zuständigen Staats, Trägers, Wohnorts, Familienstatus oder der A1-Bestimmung erfordert HEALTH_COORDINATION_REASSESSMENT_REQUIRED. Alte S1- oder EKVK-Annahmen bleiben nicht stillschweigend gültig.", sourceKey: "at-health-oegk-wohnsitz", passageKey: "at-health-oegk-wohnsitz-text", riskLevel: "high" },
  { key: "at-health-old-s1-not-eternal", category: "change", type: "exception", text: "Ein altes österreichisches S1 oder eine alte Trägerzuordnung ist nach zuständigem Staatswechsel nicht automatisch aktueller Anspruch.", sourceKey: "at-health-oegk-wohnsitz", passageKey: "at-health-oegk-wohnsitz-text", riskLevel: "high" },
  { key: "at-health-a1-not-s1-or-ehic", category: "boundary", type: "boundary", text: "A1 ist weder S1 noch EHIC noch S2. A1 kann Nachweis der anwendbaren Rechtsvorschriften sein, ersetzt aber nicht die Wohnort- oder Aufenthaltsklassifikation.", sourceKey: "at-health-oegk-wohnsitz", passageKey: "at-health-oegk-wohnsitz-text", riskLevel: "high" },
  { key: "at-health-not-family-benefit", category: "boundary", type: "boundary", text: "S1-Familienangehörigenanspruch ist nicht Artikel-68-Familienleistungspriorität und nicht Familienbeihilfe.", sourceKey: "at-health-oegk-wohnsitz", passageKey: "at-health-oegk-wohnsitz-text", riskLevel: "high" },
  { key: "at-health-not-unemployment", category: "boundary", type: "boundary", text: "Der zuständige Krankenstaat ist nicht automatisch der Arbeitslosenleistungsstaat und nicht U1/U2/U3.", sourceKey: "at-health-oegk-wohnsitz", passageKey: "at-health-oegk-wohnsitz-text", riskLevel: "high" },
  { key: "at-health-not-tax", category: "boundary", type: "boundary", text: "S1, EKVK oder S2 bestimmen weder steuerliche Ansässigkeit noch Besteuerungsrecht.", sourceKey: "at-health-oegk-wohnsitz", passageKey: "at-health-oegk-wohnsitz-text", riskLevel: "high" },
  { key: "at-health-not-gewerbe", category: "boundary", type: "boundary", text: "S1, EKVK und S2 sind keine österreichische Gewerbeberechtigung und keine Dienstleistungsanzeige.", sourceKey: "at-health-svs-residence", passageKey: "at-health-svs-residence-text", riskLevel: "high" },
  { key: "at-health-directive-handoff", category: "boundary", type: "boundary", text: "Der Verordnungsweg mit PD S2 ist nicht die Richtlinie 2011/24/EU. Fehlt der S2-Weg, gilt CROSS_BORDER_HEALTHCARE_DIRECTIVE_REVIEW_REQUIRED oder EXPLICITLY_OUT_OF_SCOPE.", sourceKey: "at-health-oegk-s2", passageKey: "at-health-oegk-s2-text", riskLevel: "high" },
  { key: "at-health-membership-not-competence", category: "boundary", type: "exception", text: "Bestehende Mitgliedschaft bei ÖGK, SVS oder BVAEB ist Kontext, nicht der unionsrechtliche Merits-Schluss über den zuständigen Krankenstaat.", sourceKey: "at-health-svs-residence", passageKey: "at-health-svs-residence-text", riskLevel: "high" },
  { key: "at-health-activity-not-insurer", category: "boundary", type: "exception", text: "Tätigkeitsstaat, bureaucracyCountry, marketPackCountry oder Nationalität wählt den Krankenversicherungsträger nicht.", sourceKey: "at-health-svs-residence", passageKey: "at-health-svs-residence-text", riskLevel: "high" },
  { key: "at-health-forms-cache-and-revalidate", category: "forms", type: "boundary", text: "Österreichische Formbezeichnungen Wohnsitzbescheinigung, Auslandsbetreuungsschein, EKVK, PEB und S2-Anträge sind operative Metadaten und CACHE_AND_REVALIDATE.", sourceKey: "at-health-oegk-s2", passageKey: "at-health-oegk-s2-text", riskLevel: "medium" },
]);

type ProcessSpec = Readonly<{
  key: string;
  title: string;
  trigger: string;
  safeFirstStep: string;
  riskLevel: "medium" | "high";
  dimensions: Readonly<Record<(typeof PROCESS_COMPLETE_DIMENSIONS)[number], string>>;
}>;

export const AT_HEALTH_PROCESSES: readonly ProcessSpec[] = Object.freeze([
  { key: AT_HEALTH_PRIMARY_PROCESS_KEY, title: "Österreichischen zuständigen Krankenversicherungsträger 2026 auflösen", trigger: "Verifizierter zuständiger Staat AT, Versicherungskategorie offen oder bekannt", safeFirstStep: "ÖGK, SVS und BVAEB unterscheiden; unbekannte Kategorie fail-closed lassen.", riskLevel: "high", dimensions: { what: "at-health-ordinary-employee-oegk-candidate", whoWhen: "at-health-unknown-carrier-unresolved", documents: "at-health-requires-al-result", how: "at-health-unknown-carrier-unresolved", next: "at-health-oegk-s1-wohnsitzbescheinigung", deadlines: "at-health-forms-cache-and-revalidate", problems: "at-health-employee-not-always-oegk", dutiesAfter: "at-health-material-change-reassessment", institution: "at-health-unknown-carrier-unresolved", boundaries: "at-health-does-not-copy-eu-law", freshness: "at-health-office-fetch-live", negatives: "at-health-membership-not-competence" } },
  { key: "at-health-s1-issue-at-competent", title: "Österreichisches S1 bei zuständigem Staat AT 2026", trigger: "Verifizierter zuständiger Staat AT, tatsächlicher Wohnort in einem anderen Mitgliedstaat", safeFirstStep: "Zuständigen österreichischen Träger auflösen; ÖGK nicht universell setzen.", riskLevel: "high", dimensions: { what: "at-health-oegk-s1-wohnsitzbescheinigung", whoWhen: "at-health-s1-issuer-not-registration", documents: "at-health-requires-al-result", how: "at-health-svs-auslandsbetreuungsschein", next: "at-health-s1-not-boolean", deadlines: "at-health-forms-cache-and-revalidate", problems: "at-health-s1-not-automatic-for-stay", dutiesAfter: "at-health-material-change-reassessment", institution: "at-health-s1-issuer-not-registration", boundaries: "at-health-does-not-redetermine-al", freshness: "at-health-office-fetch-live", negatives: "at-health-a1-not-s1-or-ehic" } },
  { key: "at-health-s1-register-foreign-at-residence", title: "Ausländisches S1 in Österreich 2026 eintragen", trigger: "Verifizierter zuständiger Staat nicht AT, tatsächlicher Wohnort AT", safeFirstStep: "Eintragungsträger nicht raten; ohne Kategorie fail-closed bleiben.", riskLevel: "high", dimensions: { what: "at-health-incoming-s1-fail-closed", whoWhen: "at-health-s1-issuer-not-registration", documents: "at-health-requires-al-result", how: "at-health-unknown-carrier-unresolved", next: "at-health-s1-not-boolean", deadlines: "at-health-forms-cache-and-revalidate", problems: "at-health-incoming-s1-fail-closed", dutiesAfter: "at-health-material-change-reassessment", institution: "at-health-incoming-s1-fail-closed", boundaries: "at-health-does-not-redetermine-al", freshness: "at-health-office-fetch-live", negatives: "at-health-activity-not-insurer" } },
  { key: "at-health-oegk-cross-border-residence", title: "ÖGK-Wohnsitzbescheinigung für Grenzgänger/Wohnen im Ausland 2026", trigger: "Verifizierte ÖGK-Kategorie, zuständiger Staat AT, Wohnort außerhalb AT", safeFirstStep: "Wohnsitzbescheinigung bei der ÖGK, nicht als zweite Versicherung.", riskLevel: "high", dimensions: { what: "at-health-oegk-s1-wohnsitzbescheinigung", whoWhen: "at-health-ordinary-employee-oegk-candidate", documents: "at-health-office-fetch-live", how: "at-health-s1-issuer-not-registration", next: "at-health-s1-not-boolean", deadlines: "at-health-forms-cache-and-revalidate", problems: "at-health-employee-not-always-oegk", dutiesAfter: "at-health-material-change-reassessment", institution: "at-health-ordinary-employee-oegk-candidate", boundaries: "at-health-does-not-copy-eu-law", freshness: "at-health-office-fetch-live", negatives: "at-health-employee-not-always-oegk" } },
  { key: "at-health-svs-residence-s1", title: "SVS-Auslandsbetreuungsschein 2026", trigger: "Verifizierte SVS-Selbständigenkategorie, zuständiger Staat AT, Wohnort im anderen Staat", safeFirstStep: "SVS-Weg nur nach verifizierter Kategorie; Selbständigkeit nicht als Trägerbeweis.", riskLevel: "high", dimensions: { what: "at-health-svs-auslandsbetreuungsschein", whoWhen: "at-health-svs-not-automatic-from-status", documents: "at-health-office-fetch-live", how: "at-health-svs-auslandsbetreuungsschein", next: "at-health-s1-not-boolean", deadlines: "at-health-forms-cache-and-revalidate", problems: "at-health-svs-not-automatic-from-status", dutiesAfter: "at-health-material-change-reassessment", institution: "at-health-svs-self-employed-route", boundaries: "at-health-does-not-copy-eu-law", freshness: "at-health-office-fetch-live", negatives: "at-health-membership-not-competence" } },
  { key: "at-health-bvaeb-route-or-fetch", title: "BVAEB-Gesundheitsweg oder Verfahrensabruf 2026", trigger: "Verifizierte BVAEB-Gruppe, S1, EKVK oder geplante Behandlung", safeFirstStep: "BVAEB führen; ÖGK-Formulare nicht übertragen; S2-Details live holen.", riskLevel: "high", dimensions: { what: "at-health-bvaeb-special-route", whoWhen: "at-health-bvaeb-s2-fetch-required", documents: "at-health-office-fetch-live", how: "at-health-bvaeb-s2-fetch-required", next: "at-health-peb-replacement", deadlines: "at-health-forms-cache-and-revalidate", problems: "at-health-employee-not-always-oegk", dutiesAfter: "at-health-material-change-reassessment", institution: "at-health-bvaeb-special-route", boundaries: "at-health-s2-not-oegk-universal", freshness: "at-health-office-fetch-live", negatives: "at-health-unknown-carrier-unresolved" } },
  { key: "at-health-ekvk-access", title: "Österreichische EKVK 2026", trigger: "Zuständiger Staat AT, vorübergehender Aufenthalt in einem anderen Staat", safeFirstStep: "EKVK vom zuständigen Träger, nicht vom Wohn- oder Tätigkeitsstaat ableiten.", riskLevel: "high", dimensions: { what: "at-health-ekvk-on-ecard", whoWhen: "at-health-ehic-from-competent-carrier", documents: "at-health-office-fetch-live", how: "at-health-ekvk-on-ecard", next: "at-health-peb-replacement", deadlines: "at-health-forms-cache-and-revalidate", problems: "at-health-unknown-carrier-unresolved", dutiesAfter: "at-health-material-change-reassessment", institution: "at-health-ehic-from-competent-carrier", boundaries: "at-health-does-not-copy-eu-law", freshness: "at-health-office-fetch-live", negatives: "at-health-ehic-not-private-or-free" } },
  { key: "at-health-peb-replacement", title: "Österreichische PEB-Ersatzbescheinigung 2026", trigger: "EKVK verloren, abgelaufen, mit Sternchen oder sonst nicht verfügbar", safeFirstStep: "Kein zweites Sachleistungsmodell; PEB beim zuständigen Träger.", riskLevel: "medium", dimensions: { what: "at-health-peb-replacement", whoWhen: "at-health-ehic-from-competent-carrier", documents: "at-health-office-fetch-live", how: "at-health-peb-replacement", next: "at-health-peb-replacement", deadlines: "at-health-forms-cache-and-revalidate", problems: "at-health-unknown-carrier-unresolved", dutiesAfter: "at-health-material-change-reassessment", institution: "at-health-ehic-from-competent-carrier", boundaries: "at-health-does-not-copy-eu-law", freshness: "at-health-office-fetch-live", negatives: "at-health-a1-not-s1-or-ehic" } },
  { key: "at-health-temporary-stay", title: "Österreichischer vorübergehender Aufenthaltsweg 2026", trigger: "Zuständiger Staat AT, Aufenthalt nicht Wohnort, Reisezweck nicht geplante Behandlung", safeFirstStep: "EKVK/PEB prüfen; S1 nicht automatisch öffnen.", riskLevel: "high", dimensions: { what: "at-health-s1-not-automatic-for-stay", whoWhen: "at-health-ekvk-on-ecard", documents: "at-health-requires-al-result", how: "at-health-ehic-from-competent-carrier", next: "at-health-peb-replacement", deadlines: "at-health-forms-cache-and-revalidate", problems: "at-health-s1-not-automatic-for-stay", dutiesAfter: "at-health-material-change-reassessment", institution: "at-health-ehic-from-competent-carrier", boundaries: "at-health-does-not-redetermine-al", freshness: "at-health-office-fetch-live", negatives: "at-health-ehic-not-private-or-free" } },
  { key: "at-health-s2-application", title: "Österreichischer S2-Antrag 2026", trigger: "Zuständiger Staat AT, Reisezweck geplante Behandlung", safeFirstStep: "Träger auflösen; ÖGK-Formular nicht universell setzen; nicht zuerst behandeln.", riskLevel: "high", dimensions: { what: "at-health-oegk-s2-prior-approval", whoWhen: "at-health-svs-s2-art20", documents: "at-health-medical-assessment-required", how: "at-health-s2-not-treat-first", next: "at-health-s2-not-treat-first", deadlines: "at-health-forms-cache-and-revalidate", problems: "at-health-s2-not-oegk-universal", dutiesAfter: "at-health-material-change-reassessment", institution: "at-health-unknown-carrier-unresolved", boundaries: "at-health-directive-handoff", freshness: "at-health-office-fetch-live", negatives: "at-health-s2-not-treat-first" } },
  { key: "at-health-s2-medical-handoff", title: "Österreichische S2-Medizinprüfung 2026 übergeben", trigger: "S2-Antrag liegt vor, medizinische Kriterien sind offen", safeFirstStep: "MEDICAL_ASSESSMENT_REQUIRED; keine Diagnose oder Wartezeit berechnen.", riskLevel: "high", dimensions: { what: "at-health-medical-assessment-required", whoWhen: "at-health-oegk-s2-prior-approval", documents: "at-health-medical-assessment-required", how: "at-health-bvaeb-s2-fetch-required", next: "at-health-s2-not-treat-first", deadlines: "at-health-forms-cache-and-revalidate", problems: "at-health-medical-assessment-required", dutiesAfter: "at-health-material-change-reassessment", institution: "at-health-unknown-carrier-unresolved", boundaries: "at-health-does-not-copy-eu-law", freshness: "at-health-office-fetch-live", negatives: "at-health-s2-not-oegk-universal" } },
  { key: "at-health-material-change", title: "Österreichische Gesundheits-Neuwertung 2026", trigger: "Zuständiger Staat, Träger, Wohnort oder A1-Bestimmung ändert sich", safeFirstStep: "Altes S1 oder alte Trägerlage nicht fortschreiben.", riskLevel: "high", dimensions: { what: "at-health-material-change-reassessment", whoWhen: "at-health-old-s1-not-eternal", documents: "at-health-requires-al-result", how: "at-health-material-change-reassessment", next: "at-health-material-change-reassessment", deadlines: "at-health-forms-cache-and-revalidate", problems: "at-health-old-s1-not-eternal", dutiesAfter: "at-health-material-change-reassessment", institution: "at-health-unknown-carrier-unresolved", boundaries: "at-health-does-not-redetermine-al", freshness: "at-health-office-fetch-live", negatives: "at-health-old-s1-not-eternal" } },
  { key: "at-health-office-provider-fetch-live", title: "Österreichische Stellen und Anbieter 2026 live prüfen", trigger: "Nutzer verlangt heutige Filiale, Telefon, Formular oder Krankenhausvertrag", safeFirstStep: "Keine kanonische Kontakt- oder Anbieterliste ausgeben.", riskLevel: "medium", dimensions: { what: "at-health-office-fetch-live", whoWhen: "at-health-provider-fetch-live", documents: "at-health-office-fetch-live", how: "at-health-provider-fetch-live", next: "at-health-office-fetch-live", deadlines: "at-health-forms-cache-and-revalidate", problems: "at-health-unknown-carrier-unresolved", dutiesAfter: "at-health-material-change-reassessment", institution: "at-health-unknown-carrier-unresolved", boundaries: "at-health-does-not-copy-eu-law", freshness: "at-health-office-fetch-live", negatives: "at-health-ehic-not-private-or-free" } },
]);

export type VerifiedApplicableLegislationInput = Readonly<{
  applicableLegislationState?: "AT" | "SK" | "DE" | "OTHER" | "UNKNOWN" | "UNRESOLVED" | null;
  applicableLegislationStatus?: "VERIFIED" | "UNRESOLVED" | "MISSING" | null;
  competentHealthStateCandidate?: "AT" | "SK" | "DE" | "OTHER" | "UNRESOLVED" | null;
  competentCarrierCategory?: AtHealthInsuranceCategory | null;
  effectiveFrom?: string | null;
  effectiveTo?: string | null;
}>;

export function consumeVerifiedApplicableLegislation(
  input: VerifiedApplicableLegislationInput,
): Readonly<{ ready: boolean; reason: string; competentState: string | null }> {
  if (input.applicableLegislationStatus !== "VERIFIED") {
    return Object.freeze({ ready: false, reason: "APPLICABLE_LEGISLATION_CONTEXT_REQUIRED", competentState: null });
  }
  const state = input.applicableLegislationState ?? input.competentHealthStateCandidate ?? null;
  if (!state || state === "UNKNOWN" || state === "UNRESOLVED") {
    return Object.freeze({ ready: false, reason: "APPLICABLE_LEGISLATION_CONTEXT_REQUIRED", competentState: null });
  }
  return Object.freeze({ ready: true, reason: "VERIFIED_APPLICABLE_LEGISLATION_CONSUMED", competentState: state });
}

export function routeAtHealthCarrier(input: Readonly<{
  insuranceCategory?: AtHealthInsuranceCategory | null;
  applicableLegislationState?: VerifiedApplicableLegislationInput["applicableLegislationState"];
}>): Readonly<{ carrier: AtHealthCarrier; issues: readonly string[] }> {
  const consumed = consumeVerifiedApplicableLegislation({
    applicableLegislationState: input.applicableLegislationState ?? "AT",
    applicableLegislationStatus: input.applicableLegislationState ? "VERIFIED" : "MISSING",
  });
  const issues: string[] = [];
  if (!consumed.ready && input.applicableLegislationState != null) {
    issues.push(consumed.reason);
  }
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

export function classifyAtSkHealthSituation(input: Readonly<{
  applicableLegislation?: VerifiedApplicableLegislationInput | null;
  residenceState?: string | null;
  temporaryStayState?: string | null;
  purposeOfTravel?: "PLANNED_TREATMENT" | "TEMPORARY_STAY" | "UNCLEAR" | null;
  residenceVsStayKnown?: boolean | null;
}>): Readonly<{ situation: AtHealthSituation | null; reason: string }> {
  const consumed = consumeVerifiedApplicableLegislation(input.applicableLegislation ?? {});
  if (!consumed.ready) {
    return Object.freeze({ situation: null, reason: "APPLICABLE_LEGISLATION_CONTEXT_REQUIRED" });
  }
  if (input.purposeOfTravel === "PLANNED_TREATMENT") {
    return Object.freeze({ situation: "PLANNED_TREATMENT", reason: "PURPOSE_OF_TRAVEL_PLANNED_TREATMENT" });
  }
  if (input.residenceVsStayKnown !== true || !input.residenceState) {
    return Object.freeze({ situation: null, reason: "RESIDENCE_VS_STAY_UNRESOLVED" });
  }
  if (consumed.competentState && input.residenceState !== consumed.competentState) {
    return Object.freeze({ situation: "RESIDENCE_IN_OTHER_MEMBER_STATE", reason: "RESIDENCE_DIFFERS_FROM_COMPETENT_STATE" });
  }
  if (input.temporaryStayState && input.temporaryStayState !== consumed.competentState) {
    return Object.freeze({ situation: "TEMPORARY_STAY", reason: "TEMPORARY_STAY_IN_OTHER_STATE" });
  }
  if (input.purposeOfTravel === "UNCLEAR") {
    return Object.freeze({ situation: null, reason: "RESIDENCE_VS_STAY_UNRESOLVED" });
  }
  return Object.freeze({ situation: null, reason: "SITUATION_UNRESOLVED" });
}

export function evaluateAtHealthProcessCompleteness() {
  const incomplete = AT_HEALTH_PROCESSES.filter((process) => (
    PROCESS_COMPLETE_DIMENSIONS.some((dimension) => !process.dimensions[dimension])
  ));
  const keys = new Set(AT_HEALTH_UNITS.map((unit) => unit.key));
  const missing = AT_HEALTH_PROCESSES.flatMap((process) => (
    PROCESS_COMPLETE_DIMENSIONS
      .map((dimension) => process.dimensions[dimension])
      .filter((key) => !keys.has(key))
      .map((key) => `${process.key}:${key}`)
  ));
  const processComplete = incomplete.length === 0 && missing.length === 0;
  return Object.freeze({
    processCount: AT_HEALTH_PROCESSES.length,
    processComplete,
    processCompletenessPercent: processComplete ? 100 : 0,
    incompleteProcessKeys: incomplete.map((process) => process.key),
    missingClaims: missing,
  });
}

const PUBLISHERS = Object.freeze([
  { key: "oegk-health", name: "Österreichische Gesundheitskasse", portal: "https://www.gesundheitskasse.at/", identity: "AT_OEGK_HEALTH" },
  { key: "svs-health", name: "Sozialversicherungsanstalt der Selbständigen", portal: "https://www.svs.at/", identity: "AT_SVS_HEALTH" },
  { key: "bvaeb-health", name: "Versicherungsanstalt öffentlich Bediensteter, Eisenbahnen und Bergbau", portal: "https://www.bvaeb.at/", identity: "AT_BVAEB_HEALTH" },
  { key: "dachverband-health", name: "Dachverband der österreichischen Sozialversicherungsträger", portal: "https://www.sozialversicherung.at/", identity: "AT_DACHVERBAND_HEALTH" },
  { key: "oesterreich-gv", name: "oesterreich.gv.at", portal: "https://www.oesterreich.gv.at/", identity: "AT_OESTERREICH_GV_HEALTH" },
]);

export function buildAtHealthCoordinationRoutingPack() {
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
  const sources = AT_HEALTH_OFFICIAL_SOURCES.map((spec) => {
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
      effectiveDate: AT_HEALTH_AS_OF,
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
        : ["RESIDENCE_STATE", "COMPETENT_STATE"],
      riskClass: "MEDIUM",
    });
    const freshness = item("freshnessRecords", `${spec.key}:freshness`, {
      entityType: "source", entityId: source.id, status: "fresh", effectiveDateKnown: true,
    });
    return { spec, source, version, passages, policy, freshness };
  });
  const passageByKey = new Map(sources.flatMap(({ passages }) => passages.map((passage) => [passage.key, passage])));
  const sourceByKey = new Map(sources.map((entry) => [entry.spec.key, entry]));
  const claims = AT_HEALTH_UNITS.map((unit) => {
    const source = sourceByKey.get(unit.sourceKey);
    const passage = passageByKey.get(unit.passageKey);
    if (!source || !passage) throw new Error(`AT_HEALTH_UNIT_SOURCE_MISSING:${unit.key}`);
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
  const processes = AT_HEALTH_PROCESSES.map((spec) => item("processes", spec.key, {
    processGroupId: AT_HEALTH_ROUTING_PROCESS_GROUP, title: spec.title, jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id, riskLevel: spec.riskLevel, trigger: spec.trigger,
    safeFirstStep: spec.safeFirstStep, regionalVariationExpected: false,
  }));
  const processByKey = new Map(processes.map((process) => [String(process.key), process]));
  const claimByKey = new Map(claims.map(({ claim }) => [String(claim.key), claim]));
  const processClaimLinks: Entity[] = [];
  const seen = new Set<string>();
  for (const process of AT_HEALTH_PROCESSES) {
    for (const dimension of PROCESS_COMPLETE_DIMENSIONS) {
      const claimKey = process.dimensions[dimension];
      const token = `${process.key}:${claimKey}:${dimension}`;
      if (seen.has(token)) continue;
      const stored = processByKey.get(process.key);
      const claim = claimByKey.get(claimKey);
      if (!stored || !claim) throw new Error(`AT_HEALTH_PROCESS_CLAIM_MISSING:${process.key}:${claimKey}`);
      seen.add(token);
      processClaimLinks.push(item("processClaimLinks", token, {
        processId: stored.id, claimId: claim.id, role: dimension, required: true,
        sequenceContext: dimension, qualificationRequired: false,
      }));
    }
  }
  return Object.freeze({
    schemaVersion: 1,
    packId: AT_HEALTH_ROUTING_PACK_ID,
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
