/**
 * CB-0D German operational routing for applicable legislation / PD A1.
 * Does not restate Regulation 883/2004 Articles 11–16. EU core owns legal merits.
 */
import { createHash } from "node:crypto";

import { PROCESS_COMPLETE_DIMENSIONS } from "../../eu/applicable-legislation/eu-applicable-legislation-core-pack";
import { stableKnowledgeFactoryId } from "../../../source-registry/knowledge-factory-contracts";
import {
  DE_ROUTING_PACK_ID,
  DE_ROUTING_PROCESS_GROUP,
} from "../../../source-registry/foreign-national-adapter-contracts";

const HASH = (value: string): string => createHash("sha256").update(value).digest("hex");
type Entity = Readonly<Record<string, unknown> & { key: string; id: string }>;

function item(entityClass: string, key: string, values: Record<string, unknown>): Entity {
  return Object.freeze({
    key,
    id: stableKnowledgeFactoryId(DE_ROUTING_PACK_ID, entityClass, key),
    ...values,
  });
}

export const DE_AL_ROUTING_PACK_ID = DE_ROUTING_PACK_ID;
export const DE_AL_ROUTING_PROCESS_GROUP = DE_ROUTING_PROCESS_GROUP;
export const DE_AL_PRIMARY_PROCESS_KEY = "de-german-a1-issuer-select" as const;

export const DE_AL_OFFICIAL_SOURCES = Object.freeze([
  {
    key: "dvka-faq",
    url: "https://www.dvka.de/de/versicherte/faq/",
    title: "DVKA: FAQ Versicherte A1 und Mehrstaatenarbeit",
    handlingMode: "STORE_CANONICALLY" as const,
    freshnessClass: "LEGAL_CHANGE_MONITORED" as const,
    staleBehavior: "DO_NOT_USE_STALE" as const,
    informationClass: "AUTHORITY_COMPETENCE" as const,
    retrievalMethod: "HTML_DOCUMENT" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "dvka-faq-text",
      locator: "FAQ A1",
      text: "Bei Entsendung stellt die gesetzliche Krankenkasse, bei der die Person versichert ist, die A1-Bescheinigung aus, unabhängig von Pflicht-, freiwilliger oder Familienversicherung. Ist die Person nicht gesetzlich krankenversichert und nicht Mitglied einer berufsständischen Versorgungseinrichtung, stellt der zuständige Rentenversicherungsträger A1 aus. Bei berufsständischer Versorgung ohne gesetzliche Krankenversicherung ist die Arbeitsgemeinschaft Berufsständischer Versorgungseinrichtungen e.V. zuständig. Bei gewöhnlicher Erwerbstätigkeit in mehreren Mitgliedstaaten und Wohnort in Deutschland ist der GKV-Spitzenverband, DVKA für die Feststellung des anwendbaren Rechts zuständig.",
    }],
  },
  {
    key: "dvka-nachweis",
    url: "https://www.dvka.de/de/arbeitgeber-erwerbstaetige/antraege-finden/nachweis-erwerbstaetigkeit/",
    title: "DVKA: Nachweis über die Anwendung der deutschen Rechtsvorschriften",
    handlingMode: "STORE_CANONICALLY" as const,
    freshnessClass: "LEGAL_CHANGE_MONITORED" as const,
    staleBehavior: "DO_NOT_USE_STALE" as const,
    informationClass: "PROCESS_IDENTITY" as const,
    retrievalMethod: "HTML_DOCUMENT" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "dvka-nachweis-text",
      locator: "A1-Issuer Grenzgänger",
      text: "Als Nachweis über die Anwendung der deutschen Rechtsvorschriften kann A1 beantragt werden. Zuständig sind die gesetzliche Krankenkasse, der Träger der gesetzlichen Rentenversicherung oder die Arbeitsgemeinschaft Berufsständischer Versorgungseinrichtungen e.V., je nach Versicherungsverhältnis. Anträge sind ausschließlich elektronisch zu übermitteln.",
    }],
  },
  {
    key: "dvka-elektronisch",
    url: "https://www.dvka.de/de/arbeitgeber-erwerbstaetige/antraege-finden/elektronisches-antragsverfahren-01_01_2025.html",
    title: "DVKA: elektronisches Antragsverfahren A1",
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshnessClass: "EVENT_DRIVEN" as const,
    staleBehavior: "REVALIDATE_BEFORE_USE" as const,
    informationClass: "ONLINE_SERVICE_URL" as const,
    retrievalMethod: "HTML_DOCUMENT" as const,
    sourceClass: "OFFICIAL_ONLINE_SERVICE" as const,
    passages: [{
      key: "dvka-elektronisch-text",
      locator: "Elektronisches Verfahren",
      text: "Seit dem 1. Januar 2025 sind Anträge auf A1-Bescheinigungen innerhalb des Antrags- und Bescheinigungsverfahrens A1 ausschließlich elektronisch zu stellen. Arbeitgeber nutzen ein zertifiziertes Abrechnungsprogramm oder das SV-Meldeportal. Die genaue aktuelle Portaladresse ist live zu prüfen.",
    }],
  },
  {
    key: "dvka-telework",
    url: "https://www.dvka.de/de/arbeitgeber-erwerbstaetige/antraege-finden/telearbeit/",
    title: "DVKA: Telearbeit Rahmenübereinkommen ab 01.07.2023",
    handlingMode: "STORE_CANONICALLY" as const,
    freshnessClass: "LEGAL_CHANGE_MONITORED" as const,
    staleBehavior: "DO_NOT_USE_STALE" as const,
    informationClass: "AUTHORITY_COMPETENCE" as const,
    retrievalMethod: "HTML_DOCUMENT" as const,
    sourceClass: "AUTHORITY_PORTAL" as const,
    passages: [{
      key: "dvka-telework-text",
      locator: "Rahmenübereinkommen",
      text: "Liegt der Arbeitgebersitz in Deutschland und sollen deutsche Rechtsvorschriften nach dem multilateralen Rahmenübereinkommen gelten, ist der Antrag auf Ausnahmevereinbarung elektronisch an den GKV-Spitzenverband, DVKA zu übermitteln. Die Vereinbarung gilt höchstens drei Jahre, Verlängerung auf erneuten Antrag. Rückwirkung regelmäßig höchstens drei Monate, sofern durchgängig Beiträge in Deutschland entrichtet wurden. 50 Prozent oder mehr Telearbeit im Wohnstaat fällt nicht unter das Rahmenübereinkommen. Selbständige und regelmäßige Drittstaatstätigkeit sind nicht erfasst. Ohne Antrag gilt nicht automatisch Arbeitgeberstaatsrecht. Gewöhnliche Mehrstaatenarbeit mit Wohnsitz in Deutschland bestimmt die DVKA, nicht automatisch die Krankenkasse.",
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

export const DE_AL_UNITS: readonly Unit[] = Object.freeze([
  { key: "de-posting-issuer-krankenkasse", category: "issuer", type: "procedure", text: "Bei Entsendung aus Deutschland stellt die gesetzliche Krankenkasse, bei der die Person versichert ist, die A1-Bescheinigung aus.", sourceKey: "dvka-faq", passageKey: "dvka-faq-text", riskLevel: "high" },
  { key: "de-posting-issuer-drv", category: "issuer", type: "procedure", text: "Ist die Person nicht gesetzlich krankenversichert, stellt der zuständige Träger der Deutschen Rentenversicherung die Entsendungs-A1 aus.", sourceKey: "dvka-faq", passageKey: "dvka-faq-text", riskLevel: "high" },
  { key: "de-posting-issuer-abv", category: "issuer", type: "procedure", text: "Ist die Person nicht gesetzlich krankenversichert und Mitglied einer berufsständischen Versorgungseinrichtung, ist die Arbeitsgemeinschaft Berufsständischer Versorgungseinrichtungen e.V. die Entsendungs-A1-Stelle.", sourceKey: "dvka-faq", passageKey: "dvka-faq-text", riskLevel: "high" },
  { key: "de-dvka-not-ordinary-posting-issuer", category: "issuer", type: "exception", text: "Die DVKA ist nicht in jedem Fall die ordentliche deutsche Ausstellungsstelle für eine Artikel-12-Entsendungs-A1.", sourceKey: "dvka-faq", passageKey: "dvka-faq-text", riskLevel: "high" },
  { key: "de-issuer-unknown-without-category", category: "issuer", type: "exception", text: "Ohne die deutsche Versicherungskategorie darf die genaue A1-Ausstellungsstelle nicht individuell genannt werden.", sourceKey: "dvka-faq", passageKey: "dvka-faq-text", riskLevel: "high", requiresAuthorityResolution: true },
  { key: "de-dvka-residence-multi-state", category: "multi-state", type: "procedure", text: "Bei gewöhnlicher Erwerbstätigkeit in mehreren Mitgliedstaaten und Wohnsitz in Deutschland ist der GKV-Spitzenverband, DVKA für die Feststellung der anwendbaren Rechtsvorschriften zuständig.", sourceKey: "dvka-faq", passageKey: "dvka-faq-text", riskLevel: "high" },
  { key: "de-krankenkasse-not-art13-first", category: "multi-state", type: "exception", text: "Die deutsche Krankenkasse ist nicht automatisch die erste Bestimmungsstelle für Artikel-13-Mehrstaatenarbeit.", sourceKey: "dvka-faq", passageKey: "dvka-faq-text", riskLevel: "high" },
  { key: "de-employer-not-why-dvka", category: "multi-state", type: "exception", text: "Ein deutscher Arbeitgeber allein macht die DVKA nicht zur zuständigen Mehrstaatenstelle. Maßgeblich ist der Wohnsitz in Deutschland im Wohnstaatverfahren.", sourceKey: "dvka-faq", passageKey: "dvka-faq-text", riskLevel: "high" },
  { key: "de-art16-dvka", category: "article16", type: "procedure", text: "Wird deutsche Gesetzgebung über eine Artikel-16-Ausnahmevereinbarung beantragt, ist der GKV-Spitzenverband, DVKA die zuständige deutsche Stelle.", sourceKey: "dvka-telework", passageKey: "dvka-telework-text", riskLevel: "high" },
  { key: "de-art16-not-art12-issuer", category: "article16", type: "exception", text: "Die deutsche Artikel-16-Ausnahmestelle ist nicht in jedem Fall dieselbe Stelle wie die ordentliche Artikel-12-Entsendungsausstellerin.", sourceKey: "dvka-telework", passageKey: "dvka-telework-text", riskLevel: "high" },
  { key: "de-electronic-sv-meldeportal", category: "channel", type: "procedure", text: "Deutsche A1-Anträge im EU-Verfahren sind seit dem 1. Januar 2025 ausschließlich elektronisch zu stellen. Arbeitgeber nutzen ein zertifiziertes Abrechnungsprogramm oder das SV-Meldeportal. Die genaue aktuelle Einreichungsadresse ist live zu prüfen.", sourceKey: "dvka-elektronisch", passageKey: "dvka-elektronisch-text", riskLevel: "medium" },
  { key: "de-framework-request-to-dvka", category: "telework", type: "procedure", text: "Soll nach der multilateralen Telearbeits-Rahmenvereinbarung deutsches Recht gelten, weil der Arbeitgeber in Deutschland sitzt, ist der Antrag elektronisch an die DVKA zu richten. Deutsches Recht gilt dadurch nicht automatisch.", sourceKey: "dvka-telework", passageKey: "dvka-telework-text", riskLevel: "high" },
  { key: "de-framework-not-automatic", category: "telework", type: "exception", text: "Homeoffice oder 30 Prozent Telearbeit bedeutet nicht automatisch deutsches Arbeitgeberstaatsrecht. Es bedarf eines Antrags und der übrigen Rahmenbedingungen.", sourceKey: "dvka-telework", passageKey: "dvka-telework-text", riskLevel: "high" },
  { key: "de-framework-max-three-years", category: "telework", type: "definition", text: "Nach aktueller DVKA-Darstellung wird eine Rahmenvereinbarung für eine Person höchstens für drei Jahre geschlossen, Verlängerung auf erneuten Antrag.", sourceKey: "dvka-telework", passageKey: "dvka-telework-text", riskLevel: "medium" },
  { key: "de-framework-retro-three-months", category: "telework", type: "definition", text: "Ein Antrag zur Inanspruchnahme des Rahmenübereinkommens kann nach aktueller DVKA-Darstellung für höchstens drei Monate rückwirkend gestellt werden, sofern in diesem Zeitraum durchgängig Beiträge in Deutschland entrichtet wurden.", sourceKey: "dvka-telework", passageKey: "dvka-telework-text", riskLevel: "medium" },
  { key: "de-routing-does-not-copy-eu-law", category: "boundary", type: "boundary", text: "Diese deutschen Routing-Sätze wiederholen nicht die materiellen Artikel 11 bis 16. Die rechtliche Einordnung bleibt im geteilten EU-Kern.", sourceKey: "dvka-faq", passageKey: "dvka-faq-text", riskLevel: "high" },
  { key: "de-single-state-work-may-need-a1-proof", category: "single-state", type: "procedure", text: "Wer ausschließlich in Deutschland arbeitet, unterliegt grundsätzlich deutschem Recht; A1 kann als Nachweis verlangt werden, ohne dass daraus Mehrstaatenarbeit wird.", sourceKey: "dvka-nachweis", passageKey: "dvka-nachweis-text", riskLevel: "medium" },
]);

type ProcessSpec = Readonly<{
  key: string;
  title: string;
  trigger: string;
  safeFirstStep: string;
  riskLevel: "medium" | "high";
  dimensions: Readonly<Record<(typeof PROCESS_COMPLETE_DIMENSIONS)[number], string>>;
}>;

export const DE_AL_PROCESSES: readonly ProcessSpec[] = Object.freeze([
  { key: DE_AL_PRIMARY_PROCESS_KEY, title: "Deutsche A1-Ausstellerin 2026 auswählen", trigger: "Deutsche Entsendungs-A1 wird benötigt und die Versicherungskategorie ist offen oder bekannt", safeFirstStep: "Krankenkasse, DRV und ABV unterscheiden; DVKA nicht als Universalausstellerin behandeln.", riskLevel: "high", dimensions: { what: "de-posting-issuer-krankenkasse", whoWhen: "de-issuer-unknown-without-category", documents: "de-electronic-sv-meldeportal", how: "de-issuer-unknown-without-category", next: "de-electronic-sv-meldeportal", deadlines: "de-electronic-sv-meldeportal", problems: "de-dvka-not-ordinary-posting-issuer", dutiesAfter: "de-electronic-sv-meldeportal", institution: "de-posting-issuer-krankenkasse", boundaries: "de-routing-does-not-copy-eu-law", freshness: "de-electronic-sv-meldeportal", negatives: "de-dvka-not-ordinary-posting-issuer" } },
  { key: "de-posting-krankenkasse-route", title: "Entsendungs-A1 gesetzliche Krankenkasse 2026", trigger: "Person ist gesetzlich krankenversichert und wird aus Deutschland entsandt", safeFirstStep: "An die bestehende gesetzliche Krankenkasse verweisen, nicht an die DVKA.", riskLevel: "high", dimensions: { what: "de-posting-issuer-krankenkasse", whoWhen: "de-posting-issuer-krankenkasse", documents: "de-electronic-sv-meldeportal", how: "de-electronic-sv-meldeportal", next: "de-electronic-sv-meldeportal", deadlines: "de-electronic-sv-meldeportal", problems: "de-dvka-not-ordinary-posting-issuer", dutiesAfter: "de-electronic-sv-meldeportal", institution: "de-posting-issuer-krankenkasse", boundaries: "de-routing-does-not-copy-eu-law", freshness: "de-electronic-sv-meldeportal", negatives: "de-dvka-not-ordinary-posting-issuer" } },
  { key: "de-posting-drv-route", title: "Entsendungs-A1 Deutsche Rentenversicherung 2026", trigger: "Person ist nicht gesetzlich krankenversichert und nicht in einem Versorgungswerk", safeFirstStep: "Den zuständigen DRV-Träger führen, nicht die Krankenkasse.", riskLevel: "high", dimensions: { what: "de-posting-issuer-drv", whoWhen: "de-posting-issuer-drv", documents: "de-electronic-sv-meldeportal", how: "de-electronic-sv-meldeportal", next: "de-electronic-sv-meldeportal", deadlines: "de-electronic-sv-meldeportal", problems: "de-issuer-unknown-without-category", dutiesAfter: "de-electronic-sv-meldeportal", institution: "de-posting-issuer-drv", boundaries: "de-routing-does-not-copy-eu-law", freshness: "de-electronic-sv-meldeportal", negatives: "de-dvka-not-ordinary-posting-issuer" } },
  { key: "de-posting-abv-route", title: "Entsendungs-A1 berufsständische Versorgung 2026", trigger: "Person ist nicht gesetzlich krankenversichert und Mitglied eines Versorgungswerks", safeFirstStep: "ABV e.V. führen, nicht DVKA als Entsendungsausstellerin.", riskLevel: "high", dimensions: { what: "de-posting-issuer-abv", whoWhen: "de-posting-issuer-abv", documents: "de-electronic-sv-meldeportal", how: "de-electronic-sv-meldeportal", next: "de-electronic-sv-meldeportal", deadlines: "de-electronic-sv-meldeportal", problems: "de-issuer-unknown-without-category", dutiesAfter: "de-electronic-sv-meldeportal", institution: "de-posting-issuer-abv", boundaries: "de-routing-does-not-copy-eu-law", freshness: "de-electronic-sv-meldeportal", negatives: "de-dvka-not-ordinary-posting-issuer" } },
  { key: "de-residence-multi-state-dvka", title: "Wohnsitz Deutschland Mehrstaatenbestimmung DVKA 2026", trigger: "Wohnsitz DE und gewöhnliche Tätigkeit in DE und SK", safeFirstStep: "DVKA als Wohnstaatstelle führen, nicht die Krankenkasse als erste Bestimmungsstelle.", riskLevel: "high", dimensions: { what: "de-dvka-residence-multi-state", whoWhen: "de-krankenkasse-not-art13-first", documents: "de-electronic-sv-meldeportal", how: "de-dvka-residence-multi-state", next: "de-electronic-sv-meldeportal", deadlines: "de-electronic-sv-meldeportal", problems: "de-employer-not-why-dvka", dutiesAfter: "de-electronic-sv-meldeportal", institution: "de-dvka-residence-multi-state", boundaries: "de-routing-does-not-copy-eu-law", freshness: "de-electronic-sv-meldeportal", negatives: "de-krankenkasse-not-art13-first" } },
  { key: "de-art16-exception-dvka", title: "Deutsche Artikel-16-Ausnahme DVKA 2026", trigger: "Deutsche Rechtsvorschriften werden über eine Ausnahmevereinbarung beantragt", safeFirstStep: "DVKA als deutsche Ausnahmestelle führen und nicht mit der Artikel-12-Ausstellerroute vermengen.", riskLevel: "high", dimensions: { what: "de-art16-dvka", whoWhen: "de-art16-not-art12-issuer", documents: "de-electronic-sv-meldeportal", how: "de-art16-dvka", next: "de-framework-request-to-dvka", deadlines: "de-framework-retro-three-months", problems: "de-framework-not-automatic", dutiesAfter: "de-electronic-sv-meldeportal", institution: "de-art16-dvka", boundaries: "de-routing-does-not-copy-eu-law", freshness: "de-electronic-sv-meldeportal", negatives: "de-art16-not-art12-issuer" } },
  { key: "de-framework-telework-dvka-request", title: "DE-Arbeitgeber Telearbeitsrahmen DVKA 2026", trigger: "Arbeitgeber in Deutschland, Wohnsitz anderer Signatarstaat, Telearbeit 25 bis unter 50 Prozent", safeFirstStep: "Elektronischen Ausnahmeantrag an die DVKA führen; deutsches Recht nicht automatisch annehmen.", riskLevel: "high", dimensions: { what: "de-framework-request-to-dvka", whoWhen: "de-framework-max-three-years", documents: "de-electronic-sv-meldeportal", how: "de-framework-request-to-dvka", next: "de-art16-dvka", deadlines: "de-framework-retro-three-months", problems: "de-framework-not-automatic", dutiesAfter: "de-electronic-sv-meldeportal", institution: "de-framework-request-to-dvka", boundaries: "de-routing-does-not-copy-eu-law", freshness: "de-electronic-sv-meldeportal", negatives: "de-framework-not-automatic" } },
  { key: "de-single-state-a1-proof-route", title: "Ein-Staat-Tätigkeit Deutschland A1-Nachweis 2026", trigger: "Ausschließliche Arbeit in Deutschland, Nachweis im anderen Staat gewünscht", safeFirstStep: "Lex-loci-laboris nicht neu bewerten; nur den deutschen Nachweisweg nennen.", riskLevel: "medium", dimensions: { what: "de-single-state-work-may-need-a1-proof", whoWhen: "de-issuer-unknown-without-category", documents: "de-electronic-sv-meldeportal", how: "de-electronic-sv-meldeportal", next: "de-electronic-sv-meldeportal", deadlines: "de-electronic-sv-meldeportal", problems: "de-issuer-unknown-without-category", dutiesAfter: "de-electronic-sv-meldeportal", institution: "de-posting-issuer-krankenkasse", boundaries: "de-routing-does-not-copy-eu-law", freshness: "de-electronic-sv-meldeportal", negatives: "de-dvka-not-ordinary-posting-issuer" } },
]);

export function buildDeApplicableLegislationRoutingPack() {
  const trustDomain = item("trustDomain", "de", { code: "de" as const, name: "Deutschland" });
  const jurisdiction = item("jurisdictions", "de", {
    level: "de_federal" as const, code: "DE" as const, countryCode: "DE" as const, name: "Bundesrepublik Deutschland",
  });
  const scope = item("territorialScopes", "de", {
    type: "federal", jurisdictionIds: [jurisdiction.id], landCodes: [], kreisCodes: [], municipalityCodes: [],
  });
  const publisher = item("publishers", "gkv-spitzenverband-dvka", {
    name: "GKV-Spitzenverband DVKA", type: "federal_agency",
    territorialScopeId: scope.id, trustDomainId: trustDomain.id,
  });
  const authority = item("authorities", "dvka-authority", {
    publisherId: publisher.id, name: "GKV-Spitzenverband, DVKA", type: "federal_agency",
    jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
    officialPortalUrl: "https://www.dvka.de",
  });
  const sources = DE_AL_OFFICIAL_SOURCES.map((spec) => {
    const source = item("sources", spec.key, {
      publisherId: publisher.id, authorityId: authority.id,
      jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
      sourceType: "official_guidance", purpose: spec.title, canonicalUrl: spec.url,
      officialDomain: "www.dvka.de", normalizedOrigin: "https://www.dvka.de",
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
      freshnessClass: spec.freshnessClass,
      staleBehavior: spec.staleBehavior,
      requiredContextKeys: spec.handlingMode === "CACHE_AND_REVALIDATE"
        ? ["PROCESS_VARIANT"]
        : ["RESIDENCE_STATE", "WORK_STATE"],
      riskClass: spec.handlingMode === "CACHE_AND_REVALIDATE" ? "MEDIUM" : "MEDIUM",
    });
    const freshness = item("freshnessRecords", `${spec.key}:freshness`, {
      entityType: "source", entityId: source.id, status: "fresh", effectiveDateKnown: true,
    });
    return { spec, source, version, passages, policy, freshness };
  });
  const passageByKey = new Map(sources.flatMap(({ passages }) => passages.map((passage) => [passage.key, passage])));
  const sourceByKey = new Map(sources.map((entry) => [entry.spec.key, entry]));
  const claims = DE_AL_UNITS.map((unit) => {
    const source = sourceByKey.get(unit.sourceKey);
    const passage = passageByKey.get(unit.passageKey);
    if (!source || !passage) throw new Error(`DE_AL_UNIT_SOURCE_MISSING:${unit.key}`);
    const claim = item("claims", unit.key, {
      type: unit.type, text: unit.text, jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id, authorityId: authority.id,
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
      passageId: passage.id, publisherId: publisher.id,
      jurisdictionId: jurisdiction.id, label: source.spec.title, canonicalUrl: source.spec.url,
    });
    const claimFreshness = item("freshnessRecords", `${unit.key}:freshness`, {
      entityType: "claim", entityId: claim.id, status: "fresh", effectiveDateKnown: false,
    });
    return { unit, claim, evidence, citation, claimFreshness };
  });
  const processes = DE_AL_PROCESSES.map((spec) => item("processes", spec.key, {
    processGroupId: DE_AL_ROUTING_PROCESS_GROUP, title: spec.title, jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id, riskLevel: spec.riskLevel, trigger: spec.trigger,
    safeFirstStep: spec.safeFirstStep, regionalVariationExpected: false,
  }));
  const processByKey = new Map(processes.map((process) => [String(process.key), process]));
  const claimByKey = new Map(claims.map(({ claim }) => [String(claim.key), claim]));
  const processClaimLinks: Entity[] = [];
  const seen = new Set<string>();
  for (const process of DE_AL_PROCESSES) {
    for (const dimension of PROCESS_COMPLETE_DIMENSIONS) {
      const claimKey = process.dimensions[dimension];
      const token = `${process.key}:${claimKey}:${dimension}`;
      if (seen.has(token)) continue;
      const stored = processByKey.get(process.key);
      const claim = claimByKey.get(claimKey);
      if (!stored || !claim) throw new Error(`DE_AL_PROCESS_CLAIM_MISSING:${process.key}:${claimKey}`);
      seen.add(token);
      processClaimLinks.push(item("processClaimLinks", token, {
        processId: stored.id, claimId: claim.id, role: dimension, required: true,
        sequenceContext: dimension, qualificationRequired: false,
      }));
    }
  }
  return Object.freeze({
    schemaVersion: 1,
    packId: DE_AL_ROUTING_PACK_ID,
    canonicalLanguage: "de" as const,
    trustDomain,
    jurisdictions: [jurisdiction],
    territorialScopes: [scope],
    publishers: [publisher],
    authorities: [authority],
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
