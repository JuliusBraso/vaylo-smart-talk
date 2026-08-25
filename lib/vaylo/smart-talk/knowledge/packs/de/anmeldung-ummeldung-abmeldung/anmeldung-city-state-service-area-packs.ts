/**
 * ANMELDUNG-CITY-STATES-CONTENT-01
 *
 * Reviewed CuratedServiceAreaPack builders for DE-BE, Stadtgemeinde Bremen,
 * and DE-HH. Uses the Knowledge Factory 041 contract only. Does not copy
 * federal BMG claims and does not invent a grouped city-state jurisdiction.
 *
 * Municipality codes are Destatis AGS identifiers for the named inventory
 * territorial units. They are technical 041 municipality keys, not new
 * DE-XX legal claims. Bremerhaven AGS 04012000 is excluded from the Bremen pack.
 */

import { createHash } from "node:crypto";

import {
  knowledgeFactoryFingerprint,
  stableKnowledgeFactoryId,
  validateCuratedServiceAreaPack,
  type CuratedServiceAreaPack,
} from "../../../source-registry/knowledge-factory-contracts";
import { CITY_STATE_SERVICE_AREA_COMPETENCE } from "./anmeldung-laender-difference-inventory";

const DOMAIN = "anmeldung_ummeldung_abmeldung" as const;
const HASH = (value: string): string => createHash("sha256").update(value).digest("hex");

export const CITY_STATE_AGS = Object.freeze({
  berlin: "11000000",
  bremenCity: "04011000",
  bremenKreis: "04011",
  bremerhaven: "04012000",
  hamburg: "02000000",
});

export const CITY_STATE_SERVICE_AREA_PACK_IDS = Object.freeze([
  "anmeldung_service_area_berlin",
  "anmeldung_service_area_bremen",
  "anmeldung_service_area_hamburg",
] as const);

type FactoryItem = <T extends Readonly<Record<string, unknown>>>(
  entityClass: string,
  key: string,
  values: T,
) => Readonly<{ key: string; id: string } & T>;

function factory(packId: string): FactoryItem {
  return (entityClass, key, values) => Object.freeze({
    key,
    id: stableKnowledgeFactoryId(packId, entityClass, key),
    ...values,
  });
}

function sharedFoundation(item: FactoryItem) {
  const trustDomain = item("trustDomain", "de", { code: "de", name: "Deutschland" });
  const country = item("jurisdictions", "de", {
    level: "de_federal",
    code: "DE",
    countryCode: "DE",
    name: "Deutschland",
  });
  return { trustDomain, country };
}

type CityStateSpec = Readonly<{
  packId: (typeof CITY_STATE_SERVICE_AREA_PACK_IDS)[number];
  jurisdictionCode: "DE-BE" | "DE-HB" | "DE-HH";
  territorialScopeLabel: string;
  land: Readonly<{ key: string; code: string; name: string }>;
  kreis?: Readonly<{ key: string; code: string; name: string }>;
  municipality: Readonly<{ key: string; code: string; name: string }>;
  publisherName: string;
  authorityName: string;
  authorityType: "buergeramt";
  serviceLabel: string;
  competence: Readonly<{
    url: string;
    officialDomain: string;
    locator: string;
    text: string;
  }>;
  serviceRoute: Readonly<{
    url: string;
    officialDomain: string;
    locator: string;
    text: string;
  }>;
}>;

function origin(domain: string): string {
  return `https://${domain}`;
}

function buildCityStatePack(spec: CityStateSpec): CuratedServiceAreaPack {
  const item = factory(spec.packId);
  const { trustDomain, country } = sharedFoundation(item);
  const land = item("jurisdictions", spec.land.key, {
    level: "de_land",
    code: spec.land.code,
    countryCode: "DE",
    parentJurisdictionId: country.id,
    name: spec.land.name,
  });
  const kreis = spec.kreis
    ? item("jurisdictions", spec.kreis.key, {
        level: "de_kreis",
        code: spec.kreis.code,
        countryCode: "DE",
        parentJurisdictionId: land.id,
        name: spec.kreis.name,
      })
    : null;
  const municipality = item("jurisdictions", spec.municipality.key, {
    level: "de_gemeinde",
    code: spec.municipality.code,
    countryCode: "DE",
    parentJurisdictionId: kreis ? kreis.id : land.id,
    name: spec.municipality.name,
  });
  const jurisdictions = kreis
    ? [country, land, kreis, municipality]
    : [country, land, municipality];
  const scope = item("territorialScopes", spec.jurisdictionCode, {
    type: "service_area",
    jurisdictionIds: jurisdictions.map((entry) => entry.id),
    landCodes: [spec.land.code],
    kreisCodes: spec.kreis ? [spec.kreis.code] : [],
    municipalityCodes: [spec.municipality.code],
  });
  const publisher = item("publishers", spec.jurisdictionCode, {
    name: spec.publisherName,
    type: "city_state_service_portal",
    territorialScopeId: scope.id,
    trustDomainId: trustDomain.id,
  });
  const authority = item("authorities", spec.jurisdictionCode, {
    publisherId: publisher.id,
    name: spec.authorityName,
    type: spec.authorityType,
    jurisdictionId: municipality.id,
    territorialScopeId: scope.id,
    officialPortalUrl: spec.competence.url,
  });
  const competenceSource = item("sources", `${spec.jurisdictionCode}:competence`, {
    publisherId: publisher.id,
    authorityId: authority.id,
    jurisdictionId: municipality.id,
    territorialScopeId: scope.id,
    sourceType: "authority_portal",
    purpose: "Reviewed city-state authority competence and territorial scope",
    canonicalUrl: spec.competence.url,
    officialDomain: spec.competence.officialDomain,
    normalizedOrigin: origin(spec.competence.officialDomain),
    sourceClass: "AUTHORITY_PORTAL",
    authorityLevel: "SPECIFIC_AUTHORITY",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
  });
  const competenceVersion = item("sourceVersions", `${spec.jurisdictionCode}:competence`, {
    sourceId: competenceSource.id,
    versionSequence: 1,
    contentHash: HASH(spec.competence.text),
  });
  const competencePassage = item("passages", `${spec.jurisdictionCode}:competence`, {
    sourceVersionId: competenceVersion.id,
    order: 0,
    locator: spec.competence.locator,
    text: spec.competence.text,
    textHash: HASH(spec.competence.text),
  });
  const routeSource = item("sources", `${spec.jurisdictionCode}:service-route`, {
    publisherId: publisher.id,
    authorityId: authority.id,
    jurisdictionId: municipality.id,
    territorialScopeId: scope.id,
    sourceType: "authority_portal",
    purpose: "Official city-state residence-registration service route",
    canonicalUrl: spec.serviceRoute.url,
    officialDomain: spec.serviceRoute.officialDomain,
    normalizedOrigin: origin(spec.serviceRoute.officialDomain),
    sourceClass: "AUTHORITY_PORTAL",
    authorityLevel: "SPECIFIC_AUTHORITY",
    retrievalMethod: "HTML_DOCUMENT",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
  });
  const routeVersion = item("sourceVersions", `${spec.jurisdictionCode}:service-route`, {
    sourceId: routeSource.id,
    versionSequence: 1,
    contentHash: HASH(spec.serviceRoute.text),
  });
  const routePassage = item("passages", `${spec.jurisdictionCode}:service-route`, {
    sourceVersionId: routeVersion.id,
    order: 0,
    locator: spec.serviceRoute.locator,
    text: spec.serviceRoute.text,
    textHash: HASH(spec.serviceRoute.text),
  });
  const competence = item("competences", spec.jurisdictionCode, {
    authorityId: authority.id,
    territorialScopeId: scope.id,
    domain: DOMAIN,
    subjectMatter: "residence_registration_lifecycle",
    proceduralStage: "application",
    receivesApplication: true,
    decidesApplication: true,
    providesInformationOnly: false,
    sourceVersionId: competenceVersion.id,
    passageId: competencePassage.id,
    effectiveFrom: null,
    effectiveUntil: null,
  });
  const process = item("processBindings", spec.jurisdictionCode, {
    processGroupId: DOMAIN,
    title: `Local Anmeldung delivery for ${spec.territorialScopeLabel}`,
    jurisdictionId: municipality.id,
    territorialScopeId: scope.id,
    riskLevel: "medium",
    trigger: "Residence registration in the reviewed city-state service area.",
    safeFirstStep: "Use the official service route of the competent city-state authority.",
  });
  const competencePolicy = item("handlingPolicies", `${spec.jurisdictionCode}:competence`, {
    sourceId: competenceSource.id,
    informationClass: "AUTHORITY_COMPETENCE",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: [],
    riskClass: "MEDIUM",
  });
  const routePolicy = item("handlingPolicies", `${spec.jurisdictionCode}:service-route`, {
    sourceId: routeSource.id,
    informationClass: "ONLINE_SERVICE_URL",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: [],
    riskClass: "MEDIUM",
  });
  return Object.freeze({
    schemaVersion: 1,
    packId: spec.packId,
    domain: DOMAIN,
    countryCode: "DE",
    trustDomain,
    jurisdictions,
    territorialScopes: [scope],
    publishers: [publisher],
    authorities: [authority],
    sources: [competenceSource, routeSource],
    sourceVersions: [competenceVersion, routeVersion],
    passages: [competencePassage, routePassage],
    competences: [competence],
    processBindings: [process],
    handlingPolicies: [competencePolicy, routePolicy],
  });
}

const berlinEvidence = CITY_STATE_SERVICE_AREA_COMPETENCE[0];
const bremenEvidence = CITY_STATE_SERVICE_AREA_COMPETENCE[1];
const hamburgEvidence = CITY_STATE_SERVICE_AREA_COMPETENCE[2];

const SPECS: readonly CityStateSpec[] = Object.freeze([
  {
    packId: "anmeldung_service_area_berlin",
    jurisdictionCode: "DE-BE",
    territorialScopeLabel: "Land Berlin",
    land: { key: "land:DE-BE", code: "DE-BE", name: "Land Berlin" },
    municipality: { key: "municipality:11000000", code: CITY_STATE_AGS.berlin, name: "Berlin" },
    publisherName: berlinEvidence.source.publisher,
    authorityName: berlinEvidence.authority,
    authorityType: "buergeramt",
    serviceLabel: berlinEvidence.serviceLabel,
    competence: {
      url: berlinEvidence.source.url,
      officialDomain: "service.berlin.de",
      locator: "dienstleistung-120686-de-plain",
      text: [
        berlinEvidence.competence,
        `Territorial scope: ${berlinEvidence.territorialScope}.`,
        `Citizen-facing service label: ${berlinEvidence.serviceLabel}.`,
        "The label names the delivery office type and is not a separate legal authority.",
      ].join(" "),
    },
    serviceRoute: {
      url: "https://service.berlin.de/dienstleistung/120686/",
      officialDomain: "service.berlin.de",
      locator: "dienstleistung-120686",
      text: "Citywide online registration and Berlin form references are DE-BE service-area records. Appointment slots, opening hours and current online eligibility remain volatile and are not stored as stable pack facts.",
    },
  },
  {
    packId: "anmeldung_service_area_bremen",
    jurisdictionCode: "DE-HB",
    territorialScopeLabel: "Stadtgemeinde Bremen",
    land: { key: "land:DE-HB", code: "DE-HB", name: "Freie Hansestadt Bremen" },
    kreis: { key: "kreis:04011", code: CITY_STATE_AGS.bremenKreis, name: "Stadt Bremen" },
    municipality: {
      key: "municipality:04011000",
      code: CITY_STATE_AGS.bremenCity,
      name: "Stadtgemeinde Bremen",
    },
    publisherName: bremenEvidence.source.publisher,
    authorityName: bremenEvidence.authority,
    authorityType: "buergeramt",
    serviceLabel: bremenEvidence.serviceLabel,
    competence: {
      url: bremenEvidence.source.url,
      officialDomain: "www.service.bremen.de",
      locator: "buergeramt-116324",
      text: [
        bremenEvidence.competence,
        `Territorial scope: ${bremenEvidence.territorialScope}.`,
        `Delivery locations remain service labels: ${bremenEvidence.serviceLabel}.`,
        "BürgerServiceCenter Mitte, Nord and Stresemannstraße are not separate legal authorities.",
        "Bremerhaven is outside this service area.",
      ].join(" "),
    },
    serviceRoute: {
      url: "https://www.service.bremen.de/dienstleistungen/wohnsitz-als-alleinige-wohnung-oder-hauptwohnung-anmelden-204128",
      officialDomain: "www.service.bremen.de",
      locator: "wohnsitz-anmelden-204128",
      text: "Bremen forms and the citywide online route are service-area records for Stadtgemeinde Bremen. Appointment slots, opening hours and the 10-working-day service statement remain volatile and are not stored as stable pack facts.",
    },
  },
  {
    packId: "anmeldung_service_area_hamburg",
    jurisdictionCode: "DE-HH",
    territorialScopeLabel: "Freie und Hansestadt Hamburg",
    land: { key: "land:DE-HH", code: "DE-HH", name: "Freie und Hansestadt Hamburg" },
    municipality: { key: "municipality:02000000", code: CITY_STATE_AGS.hamburg, name: "Hamburg" },
    publisherName: hamburgEvidence.source.publisher,
    authorityName: hamburgEvidence.authority,
    authorityType: "buergeramt",
    serviceLabel: hamburgEvidence.serviceLabel,
    competence: {
      url: hamburgEvidence.source.url,
      officialDomain: "www.hamburg.de",
      locator: "wir-ueber-uns-194548",
      text: [
        hamburgEvidence.competence,
        `Territorial scope: ${hamburgEvidence.territorialScope}.`,
        `Citizen-facing location label: ${hamburgEvidence.serviceLabel}.`,
        "Standort labels are delivery locations, not separate legal authorities.",
      ].join(" "),
    },
    serviceRoute: {
      url: "https://www.hamburg.de/behoerdenfinder/info/11252936/n0",
      officialDomain: "www.hamburg.de",
      locator: "behoerdenfinder-11252936",
      text: "Hamburg service routes and forms belong to DE-HH service-area content. Appointment availability, opening hours and case-by-case online eligibility remain volatile and are not stored as stable pack facts.",
    },
  },
]);

export const CITY_STATE_PACK_SPECS = SPECS;

export function buildBerlinServiceAreaPack(): CuratedServiceAreaPack {
  return buildCityStatePack(SPECS[0]!);
}

export function buildBremenServiceAreaPack(): CuratedServiceAreaPack {
  return buildCityStatePack(SPECS[1]!);
}

export function buildHamburgServiceAreaPack(): CuratedServiceAreaPack {
  return buildCityStatePack(SPECS[2]!);
}

export function buildCityStateServiceAreaPacks(): readonly [
  CuratedServiceAreaPack,
  CuratedServiceAreaPack,
  CuratedServiceAreaPack,
] {
  return Object.freeze([
    buildBerlinServiceAreaPack(),
    buildBremenServiceAreaPack(),
    buildHamburgServiceAreaPack(),
  ]);
}

export function cityStatePackSummary(pack: CuratedServiceAreaPack) {
  const land = pack.jurisdictions.find((item) => item.level === "de_land");
  const municipality = pack.jurisdictions.find((item) => item.level === "de_gemeinde");
  const spec = SPECS.find((entry) => entry.packId === pack.packId);
  const validation = validateCuratedServiceAreaPack(pack);
  return Object.freeze({
    packId: pack.packId,
    jurisdictionCode: spec?.jurisdictionCode,
    territorialScope: spec?.territorialScopeLabel,
    authority: pack.authorities[0]?.name,
    serviceLabel: spec?.serviceLabel,
    competence: pack.competences[0]?.subjectMatter,
    landCode: land?.code,
    municipalityCode: municipality?.code,
    municipalityCodes: pack.territorialScopes[0]?.municipalityCodes,
    officialSources: pack.sources.map((source) => source.canonicalUrl),
    handlingMode: pack.handlingPolicies.map((policy) => policy.handlingMode),
    freshness: pack.handlingPolicies.map((policy) => policy.freshnessClass),
    entityCounts: Object.freeze({
      jurisdictions: pack.jurisdictions.length,
      territorialScopes: pack.territorialScopes.length,
      publishers: pack.publishers.length,
      authorities: pack.authorities.length,
      sources: pack.sources.length,
      sourceVersions: pack.sourceVersions.length,
      passages: pack.passages.length,
      competences: pack.competences.length,
      processBindings: pack.processBindings.length,
      handlingPolicies: pack.handlingPolicies.length,
    }),
    fingerprint: knowledgeFactoryFingerprint(pack),
    validator: Object.freeze({ valid: validation.valid, issues: validation.issues }),
  });
}
