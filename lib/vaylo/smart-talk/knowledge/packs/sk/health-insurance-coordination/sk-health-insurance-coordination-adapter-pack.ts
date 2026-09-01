/**
 * CB-0F Slovak national adapter for health-insurance coordination (S1/EHIC/S2).
 * EU Articles 17–20 remain in eu_health_insurance_coordination. This pack stores
 * Slovak public health-insurer routing only. Sociálna poisťovňa remains the A1
 * institution from CB-0D and is not the S1/EHIC/S2 institution.
 */
import { createHash } from "node:crypto";

import { PROCESS_COMPLETE_DIMENSIONS } from "../../eu/applicable-legislation/eu-applicable-legislation-core-pack";
import { stableKnowledgeFactoryId } from "../../../source-registry/knowledge-factory-contracts";
import {
  SK_HEALTH_ADAPTER_PACK_ID,
  SK_HEALTH_ADAPTER_PROCESS_GROUP,
  validateForeignNationalAdapterPack,
  type CuratedForeignNationalAdapterPack,
} from "../../../source-registry/foreign-national-adapter-contracts";

const HASH = (value: string): string => createHash("sha256").update(value).digest("hex");
type Entity = Readonly<Record<string, unknown> & { key: string; id: string }>;

function item(entityClass: string, key: string, values: Record<string, unknown>): Entity {
  return Object.freeze({
    key,
    id: stableKnowledgeFactoryId(SK_HEALTH_ADAPTER_PACK_ID, entityClass, key),
    ...values,
  });
}

export const SK_HEALTH_PACK_ID = SK_HEALTH_ADAPTER_PACK_ID;
export const SK_HEALTH_PROCESS_GROUP = SK_HEALTH_ADAPTER_PROCESS_GROUP;
export const SK_HEALTH_CANONICAL_LANGUAGE = "de" as const;
export const SK_HEALTH_PRIMARY_PROCESS_KEY = "sk-incoming-s1-register" as const;
export const SK_HEALTH_INSURER_ROLE = "SK_PUBLIC_HEALTH_INSURANCE_INSTITUTION" as const;
export const SK_HEALTH_INSURER_INSTANCES_AS_OF = "2024-udzs-vestnik-15" as const;

export const SK_HEALTH_OFFICIAL_SOURCES = Object.freeze([
  {
    key: "sk-health-580-2004",
    publisherKey: "slovlex" as const,
    officialDomain: "www.slov-lex.sk",
    url: "https://www.slov-lex.sk/pravne-predpisy/SK/ZZ/2004/580/",
    title: "Slov-Lex: Gesetz 580/2004 Z. z. über die Krankenversicherung",
    sourceType: "official_guidance",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    informationClass: "LEGAL_BASELINE",
    passages: [{
      key: "sk-health-580-2004-text",
      locator: "§ 3, § 9b, § 9c, § 9d, § 9f",
      text: "Nezaopatrený rodinný príslušník podľa § 3 ods. 2 písm. d) nie je každý manžel alebo každé dieťa; maßgeblich ist die gesetzliche Liste einschließlich Kind nach § 11 ods. 2 písm. a) und weiterer Alternativen. Nach § 3 ods. 3 písm. i) entscheidet bei fehlendem slowakischen Daueraufenthalt das Wohnstaatrecht über die Familienangehörigeneigenschaft. § 9c: wer in einem anderen Mitgliedstaat versichert ist und in der Slowakei wohnt, wählt eine slowakische Krankenversicherung als Wohnortträger; S1/S072 wird registriert; der Träger stellt den preukaz poistenca EU aus. Das ist keine zweite slowakische Pflichtversicherung und keine automatische Beitragsplicht. § 9b unterscheidet notwendige Behandlung, volle Wohnstaatversorgung und geplante Behandlung mit Zustimmung; S1/S072, EHIC/náhradný certifikát und S2/E112. § 9f: Antrag auf vorherige Zustimmung an die zuständige Krankenversicherung; gesetzliche Entscheidungsfrist 15 Arbeitstage, bei schwerer Erkrankung ohne Verzug; Widerspruch 20 Arbeitstage. § 9d ist der Richtlinien-Erstattungsweg und nicht S2.",
    }],
  },
  {
    key: "sk-health-udzs-insurers",
    publisherKey: "udzs" as const,
    officialDomain: "www.udzs-sk.sk",
    url: "https://www.udzs-sk.sk/wp-content/uploads/2025/08/Vestnik-c.-15-Sprava-o-stave-vykonavania-verejneho-zdravotneho-poistenia-za-rok-2024.pdf",
    title: "ÚDZS: Vestník č. 15 Správa o verejnom zdravotnom poistení 2024",
    sourceType: "official_guidance",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "PDF_DOCUMENT",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "AUTHORITY_COMPETENCE",
    passages: [{
      key: "sk-health-udzs-insurers-text",
      locator: "Verejné zdravotné poisťovne 2024",
      text: "Die Kategorie ist die öffentliche slowakische Krankenversicherung. Nach dem ÚDZS-Bericht für 2024 sind Instanzen Všeobecná zdravotná poisťovňa, a. s., Dôvera zdravotná poisťovňa, a. s. und Union zdravotná poisťovňa, a. s. Die genaue aktuelle Instanzliste, IČO und Kontakte sind live zu prüfen. Sociálna poisťovňa gehört nicht zu dieser Kategorie.",
    }],
  },
  {
    key: "sk-health-vszp-s1-operational",
    publisherKey: "vszp" as const,
    officialDomain: "www.vszp.sk",
    url: "https://www.vszp.sk/poistenci/zdravotna-starostlivost-cudzine/prenosny-dokument-s1.html",
    title: "VšZP: Prenosný dokument S1 (betrieblich VšZP)",
    sourceType: "official_guidance",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "PROCESS_IDENTITY",
    passages: [{
      key: "sk-health-vszp-s1-operational-text",
      locator: "S1 VšZP betrieblich",
      text: "Nach betrieblicher VšZP-Darstellung stellt die Krankenversicherung, nicht Sociálna poisťovňa, das S1 aus. Der Wohnortträger kann die Bescheinigung anfordern; die Person muss gleichwohl mitwirken. VšZP nennt als mögliche Antragsteller unter anderem Beschäftigte und SZČO, die in der Slowakei öffentlich krankenversichert sind und in einem anderen Mitgliedstaat wohnen. Für SZČO verlangt VšZP betrieblich die Angabe des tatsächlichen Orts der Tätigkeit; das gilt nicht ohne nationale Rechtsgrundlage für Dôvera oder Union. Entsendung mit A1 ist regelmäßig Aufenthalt, nicht automatisch S1. Trvalý pobyt ist nicht automatisch bydlisko. Formulare und Fristen sind live zu prüfen.",
    }],
  },
  {
    key: "sk-health-vszp-epzp-operational",
    publisherKey: "vszp" as const,
    officialDomain: "www.vszp.sk",
    url: "https://www.vszp.sk/epzp/",
    title: "VšZP: EPZP und náhradný certifikát (betrieblich VšZP)",
    sourceType: "official_guidance",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "FETCH_LIVE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "ONLINE_SERVICE_URL",
    passages: [{
      key: "sk-health-vszp-epzp-operational-text",
      locator: "EPZP VšZP betrieblich",
      text: "Nach betrieblicher VšZP-Darstellung stellt VšZP die Europäische Krankenversicherungskarte aus und kann einen náhradný certifikát ausstellen. Eine von VšZP genannte Ausstellungsfrist ist nicht die universelle Frist aller slowakischen Krankenversicherungen. Der genaue Kanal ist live zu prüfen.",
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

export const SK_HEALTH_UNITS: readonly Unit[] = Object.freeze([
  { key: "sk-health-public-insurer-category", category: "institution", type: "definition", text: "Für S1, S2 und EHIC ist die zuständige slowakische Stelle eine öffentliche Krankenversicherung der Kategorie SK_PUBLIC_HEALTH_INSURANCE_INSTITUTION.", sourceKey: "sk-health-udzs-insurers", passageKey: "sk-health-udzs-insurers-text", riskLevel: "high" },
  { key: "sk-health-current-insurer-instances", category: "institution", type: "definition", text: "Nach dem ÚDZS-Bericht 2024 gehören VšZP, Dôvera und Union zu den öffentlichen Krankenversicherungen. Die genaue aktuelle Instanzliste ist live zu prüfen.", sourceKey: "sk-health-udzs-insurers", passageKey: "sk-health-udzs-insurers-text", riskLevel: "medium" },
  { key: "sk-health-insurer-unknown-fail-closed", category: "institution", type: "exception", text: "Ohne bekannte zuständige slowakische Krankenversicherung darf der konkrete Aussteller nicht individuell genannt werden.", sourceKey: "sk-health-udzs-insurers", passageKey: "sk-health-udzs-insurers-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "sk-health-not-socialna-poistovna", category: "institution", type: "exception", text: "Sociálna poisťovňa ist nicht die slowakische Krankenversicherung für S1, EHIC oder S2.", sourceKey: "sk-health-udzs-insurers", passageKey: "sk-health-udzs-insurers-text", riskLevel: "high" },
  { key: "sk-health-sp-not-s1-issuer", category: "institution", type: "exception", text: "Sociálna poisťovňa stellt kein S1 aus.", sourceKey: "sk-health-vszp-s1-operational", passageKey: "sk-health-vszp-s1-operational-text", riskLevel: "high" },
  { key: "sk-health-sp-not-ehic-issuer", category: "institution", type: "exception", text: "Sociálna poisťovňa stellt keine EHIC aus.", sourceKey: "sk-health-vszp-epzp-operational", passageKey: "sk-health-vszp-epzp-operational-text", riskLevel: "high" },
  { key: "sk-health-sp-not-s2-institution", category: "institution", type: "exception", text: "Sociálna poisťovňa entscheidet nicht über S2.", sourceKey: "sk-health-580-2004", passageKey: "sk-health-580-2004-text", riskLevel: "high" },
  { key: "sk-health-outgoing-s1-from-insurer", category: "s1", type: "procedure", text: "Ist die Slowakei zuständiger Staat, stellt die zuständige slowakische Krankenversicherung das S1 aus.", sourceKey: "sk-health-vszp-s1-operational", passageKey: "sk-health-vszp-s1-operational-text", riskLevel: "high" },
  { key: "sk-health-employee-or-szco-may-request-s1", category: "s1", type: "procedure", text: "Nach betrieblicher VšZP-Darstellung können in der Slowakei öffentlich krankenversicherte Beschäftigte und SZČO mit Wohnort in einem anderen Mitgliedstaat den S1-Weg nutzen. SZČO-Status allein ersetzt nicht die öffentliche Krankenversicherung.", sourceKey: "sk-health-vszp-s1-operational", passageKey: "sk-health-vszp-s1-operational-text", riskLevel: "high" },
  { key: "sk-health-szco-place-of-activity-vszp-operational", category: "s1", type: "procedure", text: "VšZP verlangt betrieblich, dass eine SZČO bei der S1-Beantragung den tatsächlichen Ort der Tätigkeit angibt. Das ist keine universelle Anforderung aller slowakischen Krankenversicherungen.", sourceKey: "sk-health-vszp-s1-operational", passageKey: "sk-health-vszp-s1-operational-text", riskLevel: "medium" },
  { key: "sk-health-szco-or-zivnost-not-insurer-identity", category: "institution", type: "exception", text: "SZČO-Status, živnosť, Steueramt oder Sociálna poisťovňa identifizieren nicht die zuständige slowakische Krankenversicherung für S1, EHIC oder S2.", sourceKey: "sk-health-udzs-insurers", passageKey: "sk-health-udzs-insurers-text", riskLevel: "high" },
  { key: "sk-health-incoming-s1-choose-insurer", category: "s1", type: "procedure", text: "Wer in einem anderen Mitgliedstaat versichert ist und in der Slowakei wohnt, wählt nach § 9c eine slowakische Krankenversicherung als Wohnortträger und lässt S1 registrieren.", sourceKey: "sk-health-580-2004", passageKey: "sk-health-580-2004-text", riskLevel: "high" },
  { key: "sk-health-incoming-not-second-insurance", category: "s1", type: "exception", text: "Die S1-Eintragung in der Slowakei begründet keine zweite unabhängige slowakische Krankenversicherung.", sourceKey: "sk-health-580-2004", passageKey: "sk-health-580-2004-text", riskLevel: "high" },
  { key: "sk-health-incoming-not-contribution", category: "s1", type: "exception", text: "Die S1-Eintragung in der Slowakei begründet nicht automatisch slowakische Beitragspflicht.", sourceKey: "sk-health-580-2004", passageKey: "sk-health-580-2004-text", riskLevel: "high" },
  { key: "sk-health-eu-card-after-registration", category: "s1", type: "procedure", text: "Nach Eintragung stellt der gewählte Wohnortträger den preukaz poistenca EU nach aktuellem Verfahren aus.", sourceKey: "sk-health-580-2004", passageKey: "sk-health-580-2004-text", riskLevel: "medium" },
  { key: "sk-health-eu-card-not-ehic", category: "s1", type: "exception", text: "Der slowakische preukaz poistenca EU nach S1-Eintragung ist nicht automatisch die EHIC.", sourceKey: "sk-health-580-2004", passageKey: "sk-health-580-2004-text", riskLevel: "high" },
  { key: "sk-health-residence-investigation", category: "residence", type: "procedure", text: "Der Wohnortträger kann den tatsächlichen Wohnort, Arbeit, Familie und andere Ansprüche prüfen. Antrag ist nicht Genehmigung.", sourceKey: "sk-health-vszp-s1-operational", passageKey: "sk-health-vszp-s1-operational-text", riskLevel: "high" },
  { key: "sk-health-trvaly-pobyt-not-bydlisko", category: "residence", type: "exception", text: "Slowakischer trvalý pobyt ist nicht automatisch der für die S1-Eintragung maßgebliche Wohnort.", sourceKey: "sk-health-vszp-s1-operational", passageKey: "sk-health-vszp-s1-operational-text", riskLevel: "high" },
  { key: "sk-health-family-3-2-d", category: "family", type: "definition", text: "Die slowakische abhängige Familienangehörigeneigenschaft richtet sich nach § 3 ods. 2 písm. d) des Gesetzes 580/2004 und nicht nach deutschen Familienversicherungsregeln.", sourceKey: "sk-health-580-2004", passageKey: "sk-health-580-2004-text", riskLevel: "high" },
  { key: "sk-health-spouse-not-automatic", category: "family", type: "exception", text: "Der Ehegatte ist nicht automatisch abhängiger Familienangehöriger nach slowakischem Krankenversicherungsrecht.", sourceKey: "sk-health-580-2004", passageKey: "sk-health-580-2004-text", riskLevel: "high" },
  { key: "sk-health-child-not-automatic", category: "family", type: "exception", text: "Jedes Kind ist nicht automatisch derivativ berechtigt; die gesetzliche Klassifikation ist zu prüfen.", sourceKey: "sk-health-580-2004", passageKey: "sk-health-580-2004-text", riskLevel: "high" },
  { key: "sk-health-own-activity-overrides", category: "family", type: "exception", text: "Eigene Beschäftigung, selbständige Tätigkeit, Rente oder eigener Krankenanspruch kann den abgeleiteten Status überlagern.", sourceKey: "sk-health-580-2004", passageKey: "sk-health-580-2004-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "sk-health-s2-9b", category: "s2", type: "definition", text: "Geplante Behandlung im Ausland mit vorheriger Zustimmung ist in § 9b des Gesetzes 580/2004 von der notwendigen Aufenthaltsbehandlung und der vollen Wohnstaat-Sachleistung getrennt.", sourceKey: "sk-health-580-2004", passageKey: "sk-health-580-2004-text", riskLevel: "high" },
  { key: "sk-health-s2-9f-apply-to-insurer", category: "s2", type: "procedure", text: "Der Antrag auf vorherige Zustimmung nach § 9f ist an die zuständige Krankenversicherung zu richten.", sourceKey: "sk-health-580-2004", passageKey: "sk-health-580-2004-text", riskLevel: "high" },
  { key: "sk-health-s2-15-working-days", category: "s2", type: "definition", text: "Nach § 9f beträgt die gesetzliche Entscheidungsfrist 15 Arbeitstage, bei schwerer Erkrankung ohne Verzug. Widerspruch 20 Arbeitstage.", sourceKey: "sk-health-580-2004", passageKey: "sk-health-580-2004-text", riskLevel: "medium" },
  { key: "sk-health-s2-not-vszp-universal-deadline", category: "s2", type: "exception", text: "Eine betriebliche Frist einer einzelnen Krankenversicherung ist nicht die universelle DE-SK-S2-Frist.", sourceKey: "sk-health-vszp-epzp-operational", passageKey: "sk-health-vszp-epzp-operational-text", riskLevel: "high" },
  { key: "sk-health-directive-9d-not-s2", category: "s2", type: "boundary", text: "§ 9d des Gesetzes 580/2004 ist der Richtlinien-Erstattungsweg und nicht der Verordnungsweg mit S2.", sourceKey: "sk-health-580-2004", passageKey: "sk-health-580-2004-text", riskLevel: "high" },
  { key: "sk-health-ehic-from-competent-insurer", category: "ehic", type: "procedure", text: "Die EHIC stellt die zuständige slowakische Krankenversicherung aus, nicht eine ausländische Wohnortkasse.", sourceKey: "sk-health-vszp-epzp-operational", passageKey: "sk-health-vszp-epzp-operational-text", riskLevel: "high" },
  { key: "sk-health-prc-vszp-operational", category: "ehic", type: "procedure", text: "Der náhradný certifikát folgt dem EU-Ersatzmodell; der genaue VšZP-Kanal ist betrieblich und live zu prüfen und gilt nicht automatisch für alle Versicherer.", sourceKey: "sk-health-vszp-epzp-operational", passageKey: "sk-health-vszp-epzp-operational-text", riskLevel: "medium" },
  { key: "sk-health-channel-fetch-live", category: "channel", type: "procedure", text: "Aktuelle Formulare, Filialen und Portale der gewählten Krankenversicherung sind live zu prüfen.", sourceKey: "sk-health-vszp-s1-operational", passageKey: "sk-health-vszp-s1-operational-text", riskLevel: "medium" },
  { key: "sk-health-does-not-copy-eu-law", category: "boundary", type: "boundary", text: "Diese slowakischen Routing-Sätze wiederholen nicht die materiellen Artikel 17 bis 20. Die rechtliche Einordnung bleibt im geteilten EU-Gesundheitskern.", sourceKey: "sk-health-580-2004", passageKey: "sk-health-580-2004-text", riskLevel: "high" },
  { key: "sk-health-change-cancellation", category: "change", type: "procedure", text: "Wechsel des zuständigen Staats, des Wohnorts oder des Versicherungsverhältnisses erfordert Überprüfung der S1-Eintragung und des nationalen Nachweises.", sourceKey: "sk-health-580-2004", passageKey: "sk-health-580-2004-text", riskLevel: "high" },
  { key: "sk-health-physical-not-eternal", category: "change", type: "exception", text: "Ein altes körperliches S1 oder eine Wohnstaatkarte beweist nicht unbefristeten Anspruch nach Sachverhaltsänderung.", sourceKey: "sk-health-580-2004", passageKey: "sk-health-580-2004-text", riskLevel: "high" },
  { key: "sk-health-application-not-approval", category: "deadline", type: "exception", text: "Antrag oder Vorlage von S1 ist nicht bereits genehmigter Anspruch.", sourceKey: "sk-health-vszp-s1-operational", passageKey: "sk-health-vszp-s1-operational-text", riskLevel: "high" },
  { key: "sk-health-vszp-not-nationwide-unless-statute", category: "channel", type: "exception", text: "Betriebliche VšZP-Angaben gelten für VšZP und nicht ohne gesetzliche Grundlage für Dôvera oder Union.", sourceKey: "sk-health-vszp-s1-operational", passageKey: "sk-health-vszp-s1-operational-text", riskLevel: "high" },
]);

export const SK_HEALTH_NEGATIVE_CONTROLS = Object.freeze([
  "sk-health-not-socialna-poistovna",
  "sk-health-sp-not-s1-issuer",
  "sk-health-sp-not-ehic-issuer",
  "sk-health-sp-not-s2-institution",
  "sk-health-incoming-not-second-insurance",
  "sk-health-incoming-not-contribution",
  "sk-health-eu-card-not-ehic",
  "sk-health-trvaly-pobyt-not-bydlisko",
  "sk-health-spouse-not-automatic",
  "sk-health-child-not-automatic",
  "sk-health-directive-9d-not-s2",
  "sk-health-s2-not-vszp-universal-deadline",
  "sk-health-physical-not-eternal",
  "sk-health-szco-or-zivnost-not-insurer-identity",
]);

type ProcessSpec = Readonly<{
  key: string;
  title: string;
  trigger: string;
  safeFirstStep: string;
  riskLevel: "medium" | "high";
  dimensions: Readonly<Record<(typeof PROCESS_COMPLETE_DIMENSIONS)[number], string>>;
}>;

export const SK_HEALTH_PROCESSES: readonly ProcessSpec[] = Object.freeze([
  { key: "sk-health-insurer-classify", title: "Slowakische Krankenversicherung 2026 einordnen", trigger: "Zuständiger Staat SK oder Wohnstaat-Eintragung SK, Träger unbekannt oder bekannt", safeFirstStep: "Sociálna poisťovňa nicht als Krankenversicherung führen; Instanz live prüfen.", riskLevel: "high", dimensions: { what: "sk-health-public-insurer-category", whoWhen: "sk-health-insurer-unknown-fail-closed", documents: "sk-health-channel-fetch-live", how: "sk-health-current-insurer-instances", next: "sk-health-insurer-unknown-fail-closed", deadlines: "sk-health-s2-not-vszp-universal-deadline", problems: "sk-health-not-socialna-poistovna", dutiesAfter: "sk-health-change-cancellation", institution: "sk-health-public-insurer-category", boundaries: "sk-health-does-not-copy-eu-law", freshness: "sk-health-channel-fetch-live", negatives: "sk-health-not-socialna-poistovna" } },
  { key: "sk-outgoing-s1-issue", title: "Slowakisches S1 ausstellen 2026", trigger: "Zuständiger Staat SK, öffentliche Krankenversicherung bekannt, Wohnort im anderen Staat", safeFirstStep: "An die zuständige Krankenversicherung verweisen, nicht an Sociálna poisťovňa.", riskLevel: "high", dimensions: { what: "sk-health-outgoing-s1-from-insurer", whoWhen: "sk-health-outgoing-s1-from-insurer", documents: "sk-health-channel-fetch-live", how: "sk-health-channel-fetch-live", next: "sk-health-application-not-approval", deadlines: "sk-health-s2-not-vszp-universal-deadline", problems: "sk-health-application-not-approval", dutiesAfter: "sk-health-change-cancellation", institution: "sk-health-outgoing-s1-from-insurer", boundaries: "sk-health-does-not-copy-eu-law", freshness: "sk-health-channel-fetch-live", negatives: "sk-health-sp-not-s1-issuer" } },
  { key: SK_HEALTH_PRIMARY_PROCESS_KEY, title: "Ausländisches S1 in der Slowakei 2026 eintragen", trigger: "Person ist im Ausland zuständig versichert und wohnt in der Slowakei", safeFirstStep: "Wahl einer slowakischen Krankenversicherung nach § 9c; nicht Sociálna poisťovňa.", riskLevel: "high", dimensions: { what: "sk-health-incoming-s1-choose-insurer", whoWhen: "sk-health-incoming-s1-choose-insurer", documents: "sk-health-channel-fetch-live", how: "sk-health-residence-investigation", next: "sk-health-eu-card-after-registration", deadlines: "sk-health-s2-not-vszp-universal-deadline", problems: "sk-health-application-not-approval", dutiesAfter: "sk-health-change-cancellation", institution: "sk-health-incoming-s1-choose-insurer", boundaries: "sk-health-incoming-not-second-insurance", freshness: "sk-health-channel-fetch-live", negatives: "sk-health-incoming-not-contribution" } },
  { key: "sk-residence-verification", title: "Slowakische Wohnortprüfung 2026", trigger: "S1-Eintragung oder trvalý pobyt wird als Wohnort angeboten", safeFirstStep: "Trvalý pobyt nicht automatisch setzen; Untersuchung zulassen.", riskLevel: "high", dimensions: { what: "sk-health-residence-investigation", whoWhen: "sk-health-trvaly-pobyt-not-bydlisko", documents: "sk-health-channel-fetch-live", how: "sk-health-residence-investigation", next: "sk-health-application-not-approval", deadlines: "sk-health-s2-not-vszp-universal-deadline", problems: "sk-health-trvaly-pobyt-not-bydlisko", dutiesAfter: "sk-health-change-cancellation", institution: "sk-health-incoming-s1-choose-insurer", boundaries: "sk-health-does-not-copy-eu-law", freshness: "sk-health-channel-fetch-live", negatives: "sk-health-application-not-approval" } },
  { key: "sk-eu-residence-card-route", title: "Slowakischer EU-Versichertenausweis 2026", trigger: "S1 in der Slowakei eingetragen, Nachweis für Behandlung vor Ort verlangt", safeFirstStep: "Preukaz poistenca EU von der EHIC trennen.", riskLevel: "medium", dimensions: { what: "sk-health-eu-card-after-registration", whoWhen: "sk-health-incoming-s1-choose-insurer", documents: "sk-health-channel-fetch-live", how: "sk-health-eu-card-after-registration", next: "sk-health-eu-card-after-registration", deadlines: "sk-health-s2-not-vszp-universal-deadline", problems: "sk-health-eu-card-not-ehic", dutiesAfter: "sk-health-change-cancellation", institution: "sk-health-incoming-s1-choose-insurer", boundaries: "sk-health-incoming-not-second-insurance", freshness: "sk-health-channel-fetch-live", negatives: "sk-health-eu-card-not-ehic" } },
  { key: "sk-ehic-epzp-issue", title: "Slowakische EHIC 2026 ausstellen", trigger: "Zuständiger Staat SK, vorübergehender Aufenthalt in einem anderen Staat", safeFirstStep: "An die zuständige Krankenversicherung verweisen, nicht an eine deutsche Wohnortkasse.", riskLevel: "high", dimensions: { what: "sk-health-ehic-from-competent-insurer", whoWhen: "sk-health-ehic-from-competent-insurer", documents: "sk-health-channel-fetch-live", how: "sk-health-channel-fetch-live", next: "sk-health-prc-vszp-operational", deadlines: "sk-health-s2-not-vszp-universal-deadline", problems: "sk-health-insurer-unknown-fail-closed", dutiesAfter: "sk-health-change-cancellation", institution: "sk-health-ehic-from-competent-insurer", boundaries: "sk-health-does-not-copy-eu-law", freshness: "sk-health-channel-fetch-live", negatives: "sk-health-sp-not-ehic-issuer" } },
  { key: "sk-prc-nahradny-certifikat", title: "Slowakischer náhradný certifikát 2026", trigger: "EHIC verloren, nicht zugegangen oder vorübergehend nicht verfügbar", safeFirstStep: "Kein zweites Sachleistungsmodell; betrieblichen Kanal der zuständigen Kasse live prüfen.", riskLevel: "medium", dimensions: { what: "sk-health-prc-vszp-operational", whoWhen: "sk-health-ehic-from-competent-insurer", documents: "sk-health-channel-fetch-live", how: "sk-health-channel-fetch-live", next: "sk-health-prc-vszp-operational", deadlines: "sk-health-s2-not-vszp-universal-deadline", problems: "sk-health-vszp-not-nationwide-unless-statute", dutiesAfter: "sk-health-change-cancellation", institution: "sk-health-ehic-from-competent-insurer", boundaries: "sk-health-does-not-copy-eu-law", freshness: "sk-health-channel-fetch-live", negatives: "sk-health-sp-not-ehic-issuer" } },
  { key: "sk-s2-prior-authorization", title: "Slowakische S2-Vorabzustimmung 2026", trigger: "Zuständiger Staat SK, geplante Behandlung im anderen Staat", safeFirstStep: "Antrag an die zuständige Krankenversicherung nach § 9f; nicht Sociálna poisťovňa.", riskLevel: "high", dimensions: { what: "sk-health-s2-9f-apply-to-insurer", whoWhen: "sk-health-s2-9f-apply-to-insurer", documents: "sk-health-channel-fetch-live", how: "sk-health-s2-9b", next: "sk-health-application-not-approval", deadlines: "sk-health-s2-15-working-days", problems: "sk-health-application-not-approval", dutiesAfter: "sk-health-change-cancellation", institution: "sk-health-s2-9f-apply-to-insurer", boundaries: "sk-health-does-not-copy-eu-law", freshness: "sk-health-channel-fetch-live", negatives: "sk-health-sp-not-s2-institution" } },
  { key: "sk-s2-statutory-application", title: "Gesetzliche S2-Anforderungen Slowakei 2026", trigger: "Nutzer verlangt Fristen oder Formulare für geplante Behandlung", safeFirstStep: "Gesetzliche 15-Arbeitstage-Frist von betrieblichen Versichererfristen trennen.", riskLevel: "high", dimensions: { what: "sk-health-s2-15-working-days", whoWhen: "sk-health-s2-9f-apply-to-insurer", documents: "sk-health-channel-fetch-live", how: "sk-health-s2-9f-apply-to-insurer", next: "sk-health-application-not-approval", deadlines: "sk-health-s2-15-working-days", problems: "sk-health-s2-not-vszp-universal-deadline", dutiesAfter: "sk-health-change-cancellation", institution: "sk-health-s2-9f-apply-to-insurer", boundaries: "sk-health-directive-9d-not-s2", freshness: "sk-health-channel-fetch-live", negatives: "sk-health-vszp-not-nationwide-unless-statute" } },
  { key: "sk-family-member-classification", title: "Slowakische Familienklassifikation 2026", trigger: "Familienangehörige wohnen in der Slowakei oder verlangen abgeleiteten Anspruch", safeFirstStep: "§ 3 ods. 2 písm. d) anwenden; Ehe oder Kind nicht automatisch setzen.", riskLevel: "high", dimensions: { what: "sk-health-family-3-2-d", whoWhen: "sk-health-own-activity-overrides", documents: "sk-health-channel-fetch-live", how: "sk-health-spouse-not-automatic", next: "sk-health-change-cancellation", deadlines: "sk-health-s2-not-vszp-universal-deadline", problems: "sk-health-own-activity-overrides", dutiesAfter: "sk-health-change-cancellation", institution: "sk-health-incoming-s1-choose-insurer", boundaries: "sk-health-does-not-copy-eu-law", freshness: "sk-health-channel-fetch-live", negatives: "sk-health-child-not-automatic" } },
  { key: "sk-s1-change-cancellation", title: "Slowakische S1-Änderung 2026", trigger: "Zuständigkeit, Wohnort oder Versicherung ändert sich", safeFirstStep: "Altes Dokument nicht als fortgeltend behandeln.", riskLevel: "high", dimensions: { what: "sk-health-change-cancellation", whoWhen: "sk-health-physical-not-eternal", documents: "sk-health-channel-fetch-live", how: "sk-health-change-cancellation", next: "sk-health-change-cancellation", deadlines: "sk-health-s2-not-vszp-universal-deadline", problems: "sk-health-physical-not-eternal", dutiesAfter: "sk-health-change-cancellation", institution: "sk-health-public-insurer-category", boundaries: "sk-health-does-not-copy-eu-law", freshness: "sk-health-channel-fetch-live", negatives: "sk-health-physical-not-eternal" } },
  { key: "sk-insurer-live-routing", title: "Aktuellen slowakischen Krankenkanal 2026 prüfen", trigger: "Nutzer verlangt heutige URL, Filiale oder Formular", safeFirstStep: "Instanzliste und Formulare live holen; VšZP nicht auf alle Versicherer übertragen.", riskLevel: "medium", dimensions: { what: "sk-health-channel-fetch-live", whoWhen: "sk-health-current-insurer-instances", documents: "sk-health-channel-fetch-live", how: "sk-health-channel-fetch-live", next: "sk-health-channel-fetch-live", deadlines: "sk-health-s2-not-vszp-universal-deadline", problems: "sk-health-vszp-not-nationwide-unless-statute", dutiesAfter: "sk-health-change-cancellation", institution: "sk-health-public-insurer-category", boundaries: "sk-health-does-not-copy-eu-law", freshness: "sk-health-channel-fetch-live", negatives: "sk-health-vszp-not-nationwide-unless-statute" } },
]);

export function buildSkHealthInsuranceCoordinationAdapterPack(): CuratedForeignNationalAdapterPack {
  const trustDomain = item("trustDomain", "sk", {
    code: "sk" as const, name: "Slowakische Republik",
  });
  const jurisdiction = item("jurisdictions", "sk", {
    level: "foreign_national" as const, code: "SK" as const, countryCode: "SK" as const,
    name: "Slowakische Republik",
  });
  const scope = item("territorialScopes", "sk", {
    type: "foreign_national",
    jurisdictionIds: [jurisdiction.id],
    landCodes: [], kreisCodes: [], municipalityCodes: [],
  });
  const publishers = {
    slovlex: item("publishers", "slov-lex", {
      name: "Slov-Lex", type: "foreign_national_publication",
      territorialScopeId: scope.id, trustDomainId: trustDomain.id,
    }),
    udzs: item("publishers", "udzs", {
      name: "Úrad pre dohľad nad zdravotnou starostlivosťou", type: "foreign_national_authority",
      territorialScopeId: scope.id, trustDomainId: trustDomain.id,
    }),
    vszp: item("publishers", "vszp-operational", {
      name: "Všeobecná zdravotná poisťovňa", type: "foreign_national_authority",
      territorialScopeId: scope.id, trustDomainId: trustDomain.id,
    }),
  };
  const authorities = {
    slovlex: item("authorities", "slov-lex-authority", {
      publisherId: publishers.slovlex.id, name: "Slov-Lex", type: "foreign_national_publication",
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      officialPortalUrl: "https://www.slov-lex.sk",
    }),
    udzs: item("authorities", "udzs-authority", {
      publisherId: publishers.udzs.id, name: "ÚDZS", type: "foreign_national_authority",
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      officialPortalUrl: "https://www.udzs-sk.sk",
    }),
    vszp: item("authorities", "vszp-authority", {
      publisherId: publishers.vszp.id, name: "VšZP", type: "foreign_national_authority",
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      officialPortalUrl: "https://www.vszp.sk",
    }),
  };
  const publisherOf = { slovlex: publishers.slovlex, udzs: publishers.udzs, vszp: publishers.vszp };
  const authorityOf = { slovlex: authorities.slovlex, udzs: authorities.udzs, vszp: authorities.vszp };
  const sources = SK_HEALTH_OFFICIAL_SOURCES.map((spec) => {
    const publisher = publisherOf[spec.publisherKey];
    const authority = authorityOf[spec.publisherKey];
    const origin = `https://${spec.officialDomain}`;
    const source = item("sources", spec.key, {
      publisherId: publisher.id, authorityId: authority.id,
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      sourceType: spec.sourceType, purpose: spec.title, canonicalUrl: spec.url,
      officialDomain: spec.officialDomain, normalizedOrigin: origin,
      sourceClass: spec.sourceClass, authorityLevel: "SPECIFIC_AUTHORITY",
      retrievalMethod: spec.retrievalMethod, handlingMode: spec.handlingMode,
      freshnessClass: spec.freshnessClass, staleBehavior: spec.staleBehavior,
      supportsClaimTypes: ["definition", "exception", "procedure", "boundary"],
      highRiskUseAllowed: false, publicationIdentifier: spec.title,
      sourceLanguage: "sk",
    });
    const version = item("sourceVersions", `${spec.key}:v1`, {
      sourceId: source.id, versionSequence: 1,
      contentHash: HASH(spec.passages.map((passage) => passage.text).join("\n")),
    });
    const passages = spec.passages.map((passage, order) => item("passages", passage.key, {
      sourceVersionId: version.id, order, headingPath: [spec.title],
      locator: passage.locator, text: passage.text, textHash: HASH(passage.text), language: "sk",
    }));
    const policy = item("handlingPolicies", `${spec.key}:policy`, {
      sourceId: source.id, informationClass: spec.informationClass, handlingMode: spec.handlingMode,
      freshnessClass: spec.freshnessClass, staleBehavior: spec.staleBehavior,
      requiredContextKeys: spec.handlingMode === "STORE_CANONICALLY"
        ? []
        : spec.handlingMode === "FETCH_LIVE"
          ? ["COUNTRY"]
          : ["PROCESS_VARIANT"],
      riskClass: "MEDIUM",
    });
    const freshness = item("freshnessRecords", `${spec.key}:freshness`, {
      entityType: "source", entityId: source.id, status: "fresh", effectiveDateKnown: true,
    });
    return { spec, source, version, passages, policy, freshness };
  });
  const passageByKey = new Map(sources.flatMap(({ passages }) => passages.map((passage) => [passage.key, passage])));
  const sourceByKey = new Map(sources.map((entry) => [entry.spec.key, entry]));
  const claims = SK_HEALTH_UNITS.map((unit) => {
    const source = sourceByKey.get(unit.sourceKey);
    const passage = passageByKey.get(unit.passageKey);
    if (!source || !passage) throw new Error(`SK_HEALTH_UNIT_SOURCE_MISSING:${unit.key}`);
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
      originalLanguage: "sk",
    });
    const claimFreshness = item("freshnessRecords", `${unit.key}:freshness`, {
      entityType: "claim", entityId: claim.id, status: "fresh", effectiveDateKnown: false,
    });
    return { unit, claim, evidence, citation, claimFreshness };
  });
  const processes = SK_HEALTH_PROCESSES.map((spec) => item("processes", spec.key, {
    processGroupId: SK_HEALTH_PROCESS_GROUP, title: spec.title, jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id, riskLevel: spec.riskLevel, trigger: spec.trigger,
    safeFirstStep: spec.safeFirstStep, regionalVariationExpected: false,
  }));
  const processByKey = new Map(processes.map((process) => [String(process.key), process]));
  const claimByKey = new Map(claims.map(({ claim }) => [String(claim.key), claim]));
  const processClaimLinks: Entity[] = [];
  const seen = new Set<string>();
  for (const process of SK_HEALTH_PROCESSES) {
    for (const dimension of PROCESS_COMPLETE_DIMENSIONS) {
      const claimKey = process.dimensions[dimension];
      const token = `${process.key}:${claimKey}:${dimension}`;
      if (seen.has(token)) continue;
      const stored = processByKey.get(process.key);
      const claim = claimByKey.get(claimKey);
      if (!stored || !claim) throw new Error(`SK_HEALTH_PROCESS_CLAIM_MISSING:${process.key}:${claimKey}`);
      seen.add(token);
      processClaimLinks.push(item("processClaimLinks", token, {
        processId: stored.id, claimId: claim.id, role: dimension, required: true,
        sequenceContext: dimension, qualificationRequired: false,
      }));
    }
  }
  return Object.freeze({
    schemaVersion: 1,
    packId: SK_HEALTH_PACK_ID,
    countryCode: "SK" as const,
    canonicalLanguage: SK_HEALTH_CANONICAL_LANGUAGE,
    trustDomain: trustDomain as CuratedForeignNationalAdapterPack["trustDomain"],
    jurisdictions: [jurisdiction],
    territorialScopes: [scope],
    publishers: [publishers.slovlex, publishers.udzs, publishers.vszp],
    authorities: [authorities.slovlex, authorities.udzs, authorities.vszp],
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

export function skHealthPackSummary(
  pack: CuratedForeignNationalAdapterPack = buildSkHealthInsuranceCoordinationAdapterPack(),
) {
  return Object.freeze({
    packId: pack.packId,
    claimCount: pack.claims.length,
    processCount: pack.processes.length,
    insurerRole: SK_HEALTH_INSURER_ROLE,
    insurerInstancesAsOf: SK_HEALTH_INSURER_INSTANCES_AS_OF,
    validation: validateForeignNationalAdapterPack(pack),
  });
}
