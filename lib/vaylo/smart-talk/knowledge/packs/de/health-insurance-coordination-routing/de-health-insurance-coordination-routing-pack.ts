/**
 * CB-0F German operational routing for health-insurance coordination (S1/EHIC/S2).
 * Does not restate Regulation 883/2004 Articles 17–20. EU health core owns legal merits.
 * Does not restate German GKV/PKV classification; that remains in Health Insurance Orientation.
 */
import { createHash } from "node:crypto";

import { PROCESS_COMPLETE_DIMENSIONS } from "../../eu/applicable-legislation/eu-applicable-legislation-core-pack";
import { stableKnowledgeFactoryId } from "../../../source-registry/knowledge-factory-contracts";
import {
  DE_HEALTH_ROUTING_PACK_ID,
  DE_HEALTH_ROUTING_PROCESS_GROUP,
} from "../../../source-registry/foreign-national-adapter-contracts";

const HASH = (value: string): string => createHash("sha256").update(value).digest("hex");
type Entity = Readonly<Record<string, unknown> & { key: string; id: string }>;

function item(entityClass: string, key: string, values: Record<string, unknown>): Entity {
  return Object.freeze({
    key,
    id: stableKnowledgeFactoryId(DE_HEALTH_ROUTING_PACK_ID, entityClass, key),
    ...values,
  });
}

export const DE_HEALTH_PACK_ID = DE_HEALTH_ROUTING_PACK_ID;
export const DE_HEALTH_PROCESS_GROUP = DE_HEALTH_ROUTING_PROCESS_GROUP;
export const DE_HEALTH_PRIMARY_PROCESS_KEY = "de-gkv-s1-issue-resident-abroad" as const;

export const DE_HEALTH_OFFICIAL_SOURCES = Object.freeze([
  {
    key: "de-health-dvka-incoming-s1",
    publisherKey: "dvka" as const,
    officialDomain: "www.dvka.de",
    url: "https://www.dvka.de/media/dokumente/leistungserbringer/merkblatt_auslandsversicherte_stand-05_2021.pdf",
    title: "DVKA: Merkblatt für in Deutschland wohnhafte Auslandsversicherte",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "PDF_DOCUMENT",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "PROCESS_IDENTITY",
    passages: [{
      key: "de-health-dvka-incoming-s1-text",
      locator: "Auslandsversicherte S1",
      text: "Wer in einem anderen Mitgliedstaat krankenversichert ist und in Deutschland wohnt, legt die Anspruchsbescheinigung S1 einer selbst gewählten gesetzlichen Krankenkasse vor. Diese Krankenkasse registriert den Anspruch und stellt die elektronische Gesundheitskarte für die Behandlung in Deutschland aus. Sie ist helfende Wohnortkasse und nicht der zuständige ausländische Versicherungsträger. Die Eintragung begründet keine deutsche Beitragspflicht aus dem bloßen S1. Die DVKA ist Verbindungsstelle und nicht die ordentliche individuelle S1-Ausstellerin für gesetzlich Versicherte.",
    }],
  },
  {
    key: "de-health-dvka-ehic-peb",
    publisherKey: "dvka" as const,
    officialDomain: "www.dvka.de",
    url: "https://www.dvka.de/de/leistungserbringer/informationsportal-ehic-peb/",
    title: "DVKA: Informationsportal EHIC und PEB",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "PROCESS_IDENTITY",
    passages: [{
      key: "de-health-dvka-ehic-peb-text",
      locator: "EHIC PEB",
      text: "Die Europäische Krankenversicherungskarte und die Provisorische Ersatzbescheinigung weisen den Aufenthaltsanspruch nach. Ausstellerin ist die zuständige gesetzliche Krankenkasse der versicherten Person, nicht automatisch eine helfende Wohnortkasse. Ist die Karte verloren, nicht rechtzeitig zugegangen oder sonst vorübergehend nicht verfügbar, kann eine Provisorische Ersatzbescheinigung beantragt werden. Der genaue Antrags kanal der einzelnen Kasse ist live zu prüfen. Eine PEB begründet kein zweites Sachleistungsrecht.",
    }],
  },
  {
    key: "de-health-ncp-planned",
    publisherKey: "ncp" as const,
    officialDomain: "www.eu-patienten.de",
    url: "https://www.eu-patienten.de/de/behandlung_ausland/geplante_behandlung/geplante_behandlung.jsp",
    title: "EU-PATIENTEN.DE: geplante Behandlung im EU-Ausland",
    sourceClass: "AUTHORITY_PORTAL",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    informationClass: "AUTHORITY_COMPETENCE",
    passages: [{
      key: "de-health-ncp-planned-text",
      locator: "Geplante Behandlung",
      text: "Für geplante Behandlung im anderen Mitgliedstaat nach den Verordnungen entscheidet die zuständige gesetzliche Krankenkasse über die Genehmigung. Die DVKA ist nicht die regelmäßige individuelle Genehmigungsstelle für gesetzlich Versicherte. Antrag ist nicht Genehmigung. Private Kliniken und Wunschleistungen sind nicht automatisch erfasst. Der Richtlinienweg 2011/24/EU ist ein anderer Weg und wird hier nicht als Erstattungsmaschine beantwortet. Aktuelle Formulare und Fristen der einzelnen Kasse sind live zu prüfen.",
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

export const DE_HEALTH_UNITS: readonly Unit[] = Object.freeze([
  { key: "de-health-gkv-krankenkasse-issues-s1", category: "issuer", type: "procedure", text: "Bei bestätigter gesetzlicher Krankenversicherung stellt die zuständige deutsche Krankenkasse der versicherten Person das S1 für die Wohnstaat-Anmeldung aus.", sourceKey: "de-health-dvka-incoming-s1", passageKey: "de-health-dvka-incoming-s1-text", riskLevel: "high" },
  { key: "de-health-dvka-not-ordinary-s1-issuer", category: "issuer", type: "exception", text: "Die DVKA ist nicht die ordentliche individuelle S1-Ausstellerin für gewöhnliche gesetzlich Versicherte.", sourceKey: "de-health-dvka-incoming-s1", passageKey: "de-health-dvka-incoming-s1-text", riskLevel: "high" },
  { key: "de-health-pkv-not-automatic-statutory-s1", category: "issuer", type: "exception", text: "Deutsche anwendbare Rechtsvorschriften bedeuten nicht automatisch den gesetzlichen S1-Weg, wenn private Krankenversicherung besteht.", sourceKey: "de-health-ncp-planned", passageKey: "de-health-ncp-planned-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "de-health-gkv-unclear-fail-closed", category: "issuer", type: "exception", text: "Ohne geklärten GKV- oder PKV-Status darf der gesetzliche S1-Weg nicht individuell zugesagt werden.", sourceKey: "de-health-ncp-planned", passageKey: "de-health-ncp-planned-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "de-health-incoming-s1-assisting-kk", category: "residence", type: "procedure", text: "Ein ausländisches S1 wird bei einer selbst gewählten gesetzlichen Krankenkasse in Deutschland als helfender Wohnortträger registriert.", sourceKey: "de-health-dvka-incoming-s1", passageKey: "de-health-dvka-incoming-s1-text", riskLevel: "high" },
  { key: "de-health-assisting-kk-not-competent", category: "residence", type: "exception", text: "Die helfende deutsche Wohnortkasse ist nicht der zuständige ausländische Versicherungsträger.", sourceKey: "de-health-dvka-incoming-s1", passageKey: "de-health-dvka-incoming-s1-text", riskLevel: "high" },
  { key: "de-health-incoming-s1-not-contribution", category: "residence", type: "exception", text: "Die S1-Eintragung in Deutschland begründet nicht allein deutsche Beitragspflicht.", sourceKey: "de-health-dvka-incoming-s1", passageKey: "de-health-dvka-incoming-s1-text", riskLevel: "high" },
  { key: "de-health-egk-after-registration", category: "residence", type: "procedure", text: "Nach Eintragung stellt die helfende Krankenkasse nach aktuellem Verfahren die elektronische Gesundheitskarte für die Behandlung in Deutschland aus. Der genaue Kartenweg ist live zu prüfen.", sourceKey: "de-health-dvka-incoming-s1", passageKey: "de-health-dvka-incoming-s1-text", riskLevel: "medium" },
  { key: "de-health-ehic-from-competent-gkv", category: "ehic", type: "procedure", text: "Die EHIC gesetzlich Versicherter stellt die zuständige deutsche Krankenkasse aus, nicht eine helfende Wohnortkasse im anderen Staat.", sourceKey: "de-health-dvka-ehic-peb", passageKey: "de-health-dvka-ehic-peb-text", riskLevel: "high" },
  { key: "de-health-peb-replacement-route", category: "ehic", type: "procedure", text: "Ist die EHIC verloren, nicht zugegangen oder vorübergehend nicht verfügbar, führt der Weg über die zuständige Krankenkasse zur Provisorischen Ersatzbescheinigung. Der genaue Kanal ist live zu prüfen.", sourceKey: "de-health-dvka-ehic-peb", passageKey: "de-health-dvka-ehic-peb-text", riskLevel: "medium" },
  { key: "de-health-s2-from-competent-gkv", category: "s2", type: "procedure", text: "Für geplante Behandlung nach den Verordnungen entscheidet die zuständige gesetzliche Krankenkasse über die Genehmigung.", sourceKey: "de-health-ncp-planned", passageKey: "de-health-ncp-planned-text", riskLevel: "high" },
  { key: "de-health-s2-not-dvka-default", category: "s2", type: "exception", text: "Die DVKA ist nicht die regelmäßige individuelle Genehmigungsstelle für S2 gesetzlich Versicherter.", sourceKey: "de-health-ncp-planned", passageKey: "de-health-ncp-planned-text", riskLevel: "high" },
  { key: "de-health-s2-not-approval", category: "s2", type: "exception", text: "Ein S2-Antrag ist nicht die Genehmigung.", sourceKey: "de-health-ncp-planned", passageKey: "de-health-ncp-planned-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "de-health-family-de-residence-not-sk-rules", category: "family", type: "boundary", text: "Für in Deutschland wohnende Familienangehörige gilt nicht die slowakische Abhängigkeitsklassifikation.", sourceKey: "de-health-dvka-incoming-s1", passageKey: "de-health-dvka-incoming-s1-text", riskLevel: "high" },
  { key: "de-health-familienversicherung-not-automatic-eu-family", category: "family", type: "exception", text: "Deutsche Familienversicherung und unionsrechtliche Familienangehörigeneigenschaft sind nicht stillschweigend identisch.", sourceKey: "de-health-dvka-incoming-s1", passageKey: "de-health-dvka-incoming-s1-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "de-health-s1-change-cancellation", category: "change", type: "procedure", text: "Wechsel des zuständigen Staats, des Wohnorts oder des Versicherungsverhältnisses erfordert Überprüfung, Änderung oder Aufhebung der S1-Eintragung.", sourceKey: "de-health-dvka-incoming-s1", passageKey: "de-health-dvka-incoming-s1-text", riskLevel: "high" },
  { key: "de-health-does-not-copy-eu-law", category: "boundary", type: "boundary", text: "Diese deutschen Routing-Sätze wiederholen nicht die materiellen Artikel 17 bis 20. Die rechtliche Einordnung bleibt im geteilten EU-Gesundheitskern.", sourceKey: "de-health-ncp-planned", passageKey: "de-health-ncp-planned-text", riskLevel: "high" },
  { key: "de-health-does-not-copy-gkv-pkv-merits", category: "boundary", type: "boundary", text: "Die Einordnung gesetzlicher und privater deutscher Krankenversicherung bleibt dem bestehenden Health-Insurance-Orientation-Pack vorbehalten.", sourceKey: "de-health-ncp-planned", passageKey: "de-health-ncp-planned-text", riskLevel: "high" },
  { key: "de-health-channel-fetch-live", category: "channel", type: "procedure", text: "Aktuelle Formulare, Portale und Kontakte der einzelnen Krankenkasse sind live zu prüfen.", sourceKey: "de-health-dvka-ehic-peb", passageKey: "de-health-dvka-ehic-peb-text", riskLevel: "medium" },
  { key: "de-health-processing-not-universal-deadline", category: "deadline", type: "exception", text: "Es gibt keine universell zugesagte Bearbeitungsfrist für jedes deutsche S1- oder S2-Verfahren.", sourceKey: "de-health-ncp-planned", passageKey: "de-health-ncp-planned-text", riskLevel: "high" },
  { key: "de-health-application-not-approval", category: "deadline", type: "exception", text: "Antrag oder Vorlage eines Dokuments ist nicht bereits genehmigter Anspruch.", sourceKey: "de-health-ncp-planned", passageKey: "de-health-ncp-planned-text", riskLevel: "high" },
  { key: "de-health-physical-s1-not-eternal", category: "change", type: "exception", text: "Ein altes körperliches S1 beweist nicht unbefristeten Anspruch, wenn sich der Sachverhalt geändert hat.", sourceKey: "de-health-dvka-incoming-s1", passageKey: "de-health-dvka-incoming-s1-text", riskLevel: "high" },
]);

type ProcessSpec = Readonly<{
  key: string;
  title: string;
  trigger: string;
  safeFirstStep: string;
  riskLevel: "medium" | "high";
  dimensions: Readonly<Record<(typeof PROCESS_COMPLETE_DIMENSIONS)[number], string>>;
}>;

export const DE_HEALTH_PROCESSES: readonly ProcessSpec[] = Object.freeze([
  { key: "de-health-competent-institution-classify", title: "Deutsche zuständige Krankenkasse 2026 einordnen", trigger: "Deutscher zuständiger Staat ist verifiziert, Versicherungssystem offen oder bekannt", safeFirstStep: "GKV und PKV nicht vermengen; ohne Status fail-closed bleiben.", riskLevel: "high", dimensions: { what: "de-health-gkv-krankenkasse-issues-s1", whoWhen: "de-health-gkv-unclear-fail-closed", documents: "de-health-channel-fetch-live", how: "de-health-does-not-copy-gkv-pkv-merits", next: "de-health-gkv-krankenkasse-issues-s1", deadlines: "de-health-processing-not-universal-deadline", problems: "de-health-pkv-not-automatic-statutory-s1", dutiesAfter: "de-health-s1-change-cancellation", institution: "de-health-gkv-krankenkasse-issues-s1", boundaries: "de-health-does-not-copy-eu-law", freshness: "de-health-channel-fetch-live", negatives: "de-health-dvka-not-ordinary-s1-issuer" } },
  { key: DE_HEALTH_PRIMARY_PROCESS_KEY, title: "Deutsches GKV-S1 für Wohnen im Ausland 2026", trigger: "Verifizierter zuständiger Staat DE, gesetzliche Krankenversicherung, Wohnort außerhalb DE", safeFirstStep: "An die zuständige Krankenkasse als Ausstellerin verweisen, nicht an die DVKA.", riskLevel: "high", dimensions: { what: "de-health-gkv-krankenkasse-issues-s1", whoWhen: "de-health-gkv-krankenkasse-issues-s1", documents: "de-health-channel-fetch-live", how: "de-health-channel-fetch-live", next: "de-health-application-not-approval", deadlines: "de-health-processing-not-universal-deadline", problems: "de-health-application-not-approval", dutiesAfter: "de-health-s1-change-cancellation", institution: "de-health-gkv-krankenkasse-issues-s1", boundaries: "de-health-does-not-copy-eu-law", freshness: "de-health-channel-fetch-live", negatives: "de-health-dvka-not-ordinary-s1-issuer" } },
  { key: "de-incoming-foreign-s1-register", title: "Ausländisches S1 in Deutschland 2026 eintragen", trigger: "Person ist im Ausland zuständig versichert und wohnt in Deutschland", safeFirstStep: "An eine gesetzliche Krankenkasse der Wahl als helfenden Wohnortträger verweisen.", riskLevel: "high", dimensions: { what: "de-health-incoming-s1-assisting-kk", whoWhen: "de-health-incoming-s1-assisting-kk", documents: "de-health-channel-fetch-live", how: "de-health-egk-after-registration", next: "de-health-egk-after-registration", deadlines: "de-health-processing-not-universal-deadline", problems: "de-health-application-not-approval", dutiesAfter: "de-health-s1-change-cancellation", institution: "de-health-incoming-s1-assisting-kk", boundaries: "de-health-assisting-kk-not-competent", freshness: "de-health-channel-fetch-live", negatives: "de-health-incoming-s1-not-contribution" } },
  { key: "de-assisting-krankenkasse-role", title: "Helfende deutsche Wohnortkasse 2026 abgrenzen", trigger: "Nutzer hält die deutsche Eintragungskasse für den zuständigen Träger", safeFirstStep: "Helfende Kasse und zuständigen Träger trennen.", riskLevel: "high", dimensions: { what: "de-health-assisting-kk-not-competent", whoWhen: "de-health-incoming-s1-assisting-kk", documents: "de-health-channel-fetch-live", how: "de-health-egk-after-registration", next: "de-health-egk-after-registration", deadlines: "de-health-processing-not-universal-deadline", problems: "de-health-assisting-kk-not-competent", dutiesAfter: "de-health-s1-change-cancellation", institution: "de-health-incoming-s1-assisting-kk", boundaries: "de-health-does-not-copy-eu-law", freshness: "de-health-channel-fetch-live", negatives: "de-health-incoming-s1-not-contribution" } },
  { key: "de-ehic-issuer-gkv", title: "Deutsche EHIC-Ausstellerin 2026", trigger: "Zuständiger Staat DE, gesetzliche Krankenversicherung, vorübergehender Aufenthalt", safeFirstStep: "An die zuständige Krankenkasse verweisen, nicht an eine ausländische Wohnortkasse.", riskLevel: "high", dimensions: { what: "de-health-ehic-from-competent-gkv", whoWhen: "de-health-ehic-from-competent-gkv", documents: "de-health-channel-fetch-live", how: "de-health-channel-fetch-live", next: "de-health-peb-replacement-route", deadlines: "de-health-processing-not-universal-deadline", problems: "de-health-gkv-unclear-fail-closed", dutiesAfter: "de-health-s1-change-cancellation", institution: "de-health-ehic-from-competent-gkv", boundaries: "de-health-does-not-copy-eu-law", freshness: "de-health-channel-fetch-live", negatives: "de-health-assisting-kk-not-competent" } },
  { key: "de-prc-peb-route", title: "Deutsche PEB-Ersatzbescheinigung 2026", trigger: "EHIC verloren, nicht zugegangen oder vorübergehend nicht verfügbar", safeFirstStep: "Kein zweites Sachleistungsmodell erfinden; PEB bei der zuständigen Kasse.", riskLevel: "medium", dimensions: { what: "de-health-peb-replacement-route", whoWhen: "de-health-ehic-from-competent-gkv", documents: "de-health-channel-fetch-live", how: "de-health-channel-fetch-live", next: "de-health-peb-replacement-route", deadlines: "de-health-processing-not-universal-deadline", problems: "de-health-gkv-unclear-fail-closed", dutiesAfter: "de-health-s1-change-cancellation", institution: "de-health-ehic-from-competent-gkv", boundaries: "de-health-does-not-copy-eu-law", freshness: "de-health-channel-fetch-live", negatives: "de-health-application-not-approval" } },
  { key: "de-s2-planned-treatment-gkv", title: "Deutsche S2-Genehmigung 2026", trigger: "Zuständiger Staat DE, gesetzliche Krankenversicherung, geplante Behandlung im anderen Staat", safeFirstStep: "An die zuständige Krankenkasse verweisen, nicht an die DVKA als Default.", riskLevel: "high", dimensions: { what: "de-health-s2-from-competent-gkv", whoWhen: "de-health-s2-from-competent-gkv", documents: "de-health-channel-fetch-live", how: "de-health-channel-fetch-live", next: "de-health-s2-not-approval", deadlines: "de-health-processing-not-universal-deadline", problems: "de-health-s2-not-approval", dutiesAfter: "de-health-s1-change-cancellation", institution: "de-health-s2-from-competent-gkv", boundaries: "de-health-does-not-copy-eu-law", freshness: "de-health-channel-fetch-live", negatives: "de-health-s2-not-dvka-default" } },
  { key: "de-family-member-residence-classification", title: "Deutsche Wohnort-Familienklassifikation 2026", trigger: "Familienangehörige wohnen in Deutschland, zuständiger Staat ist ein anderer", safeFirstStep: "Slowakische Abhängigkeitsregeln nicht anwenden; Familienversicherung nicht stillschweigend mit EU-Status gleichsetzen.", riskLevel: "high", dimensions: { what: "de-health-family-de-residence-not-sk-rules", whoWhen: "de-health-familienversicherung-not-automatic-eu-family", documents: "de-health-channel-fetch-live", how: "de-health-familienversicherung-not-automatic-eu-family", next: "de-health-s1-change-cancellation", deadlines: "de-health-processing-not-universal-deadline", problems: "de-health-familienversicherung-not-automatic-eu-family", dutiesAfter: "de-health-s1-change-cancellation", institution: "de-health-incoming-s1-assisting-kk", boundaries: "de-health-does-not-copy-eu-law", freshness: "de-health-channel-fetch-live", negatives: "de-health-family-de-residence-not-sk-rules" } },
  { key: "de-gkv-pkv-boundary-route", title: "Deutsche GKV-PKV-Grenze im Gesundheitskorridor 2026", trigger: "Zuständiger Staat DE, Versicherungssystem unklar oder privat", safeFirstStep: "Health-Insurance-Orientation-Pack nutzen; gesetzlichen S1-Weg nicht blind öffnen.", riskLevel: "high", dimensions: { what: "de-health-does-not-copy-gkv-pkv-merits", whoWhen: "de-health-gkv-unclear-fail-closed", documents: "de-health-channel-fetch-live", how: "de-health-pkv-not-automatic-statutory-s1", next: "de-health-gkv-unclear-fail-closed", deadlines: "de-health-processing-not-universal-deadline", problems: "de-health-pkv-not-automatic-statutory-s1", dutiesAfter: "de-health-s1-change-cancellation", institution: "de-health-gkv-krankenkasse-issues-s1", boundaries: "de-health-does-not-copy-gkv-pkv-merits", freshness: "de-health-channel-fetch-live", negatives: "de-health-pkv-not-automatic-statutory-s1" } },
  { key: "de-s1-change-cancellation", title: "Deutsche S1-Änderung und Aufhebung 2026", trigger: "Zuständigkeit, Wohnort oder Versicherung ändert sich", safeFirstStep: "Altes Dokument nicht als fortgeltend behandeln.", riskLevel: "high", dimensions: { what: "de-health-s1-change-cancellation", whoWhen: "de-health-physical-s1-not-eternal", documents: "de-health-channel-fetch-live", how: "de-health-s1-change-cancellation", next: "de-health-s1-change-cancellation", deadlines: "de-health-processing-not-universal-deadline", problems: "de-health-physical-s1-not-eternal", dutiesAfter: "de-health-s1-change-cancellation", institution: "de-health-gkv-krankenkasse-issues-s1", boundaries: "de-health-does-not-copy-eu-law", freshness: "de-health-channel-fetch-live", negatives: "de-health-physical-s1-not-eternal" } },
]);

export const DE_HEALTH_NEGATIVE_CONTROLS = Object.freeze([
  "de-health-dvka-not-ordinary-s1-issuer",
  "de-health-pkv-not-automatic-statutory-s1",
  "de-health-assisting-kk-not-competent",
  "de-health-incoming-s1-not-contribution",
  "de-health-s2-not-dvka-default",
  "de-health-familienversicherung-not-automatic-eu-family",
  "de-health-physical-s1-not-eternal",
]);

export function buildDeHealthInsuranceCoordinationRoutingPack() {
  const trustDomain = item("trustDomain", "de", { code: "de" as const, name: "Deutschland" });
  const jurisdiction = item("jurisdictions", "de", {
    level: "de_federal" as const, code: "DE" as const, countryCode: "DE" as const, name: "Bundesrepublik Deutschland",
  });
  const scope = item("territorialScopes", "de", {
    type: "federal", jurisdictionIds: [jurisdiction.id], landCodes: [], kreisCodes: [], municipalityCodes: [],
  });
  const publishers = {
    dvka: item("publishers", "gkv-spitzenverband-dvka", {
      name: "GKV-Spitzenverband DVKA", type: "federal_agency",
      territorialScopeId: scope.id, trustDomainId: trustDomain.id,
    }),
    ncp: item("publishers", "eu-patienten-de-ncp", {
      name: "Nationale Kontaktstelle EU-PATIENTEN.DE", type: "federal_agency",
      territorialScopeId: scope.id, trustDomainId: trustDomain.id,
    }),
  };
  const authorities = {
    dvka: item("authorities", "dvka-authority", {
      publisherId: publishers.dvka.id, name: "GKV-Spitzenverband, DVKA", type: "federal_agency",
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      officialPortalUrl: "https://www.dvka.de",
    }),
    ncp: item("authorities", "eu-patienten-de-ncp-authority", {
      publisherId: publishers.ncp.id, name: "Nationale Kontaktstelle EU-PATIENTEN.DE", type: "federal_agency",
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      officialPortalUrl: "https://www.eu-patienten.de",
    }),
  };
  const publisherOf = { dvka: publishers.dvka, ncp: publishers.ncp };
  const authorityOf = { dvka: authorities.dvka, ncp: authorities.ncp };
  const sources = DE_HEALTH_OFFICIAL_SOURCES.map((spec) => {
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
  const claims = DE_HEALTH_UNITS.map((unit) => {
    const source = sourceByKey.get(unit.sourceKey);
    const passage = passageByKey.get(unit.passageKey);
    if (!source || !passage) throw new Error(`DE_HEALTH_UNIT_SOURCE_MISSING:${unit.key}`);
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
  const processes = DE_HEALTH_PROCESSES.map((spec) => item("processes", spec.key, {
    processGroupId: DE_HEALTH_PROCESS_GROUP, title: spec.title, jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id, riskLevel: spec.riskLevel, trigger: spec.trigger,
    safeFirstStep: spec.safeFirstStep, regionalVariationExpected: false,
  }));
  const processByKey = new Map(processes.map((process) => [String(process.key), process]));
  const claimByKey = new Map(claims.map(({ claim }) => [String(claim.key), claim]));
  const processClaimLinks: Entity[] = [];
  const seen = new Set<string>();
  for (const process of DE_HEALTH_PROCESSES) {
    for (const dimension of PROCESS_COMPLETE_DIMENSIONS) {
      const claimKey = process.dimensions[dimension];
      const token = `${process.key}:${claimKey}:${dimension}`;
      if (seen.has(token)) continue;
      const stored = processByKey.get(process.key);
      const claim = claimByKey.get(claimKey);
      if (!stored || !claim) throw new Error(`DE_HEALTH_PROCESS_CLAIM_MISSING:${process.key}:${claimKey}`);
      seen.add(token);
      processClaimLinks.push(item("processClaimLinks", token, {
        processId: stored.id, claimId: claim.id, role: dimension, required: true,
        sequenceContext: dimension, qualificationRequired: false,
      }));
    }
  }
  return Object.freeze({
    schemaVersion: 1,
    packId: DE_HEALTH_PACK_ID,
    canonicalLanguage: "de" as const,
    trustDomain,
    jurisdictions: [jurisdiction],
    territorialScopes: [scope],
    publishers: [publishers.dvka, publishers.ncp],
    authorities: [authorities.dvka, authorities.ncp],
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
