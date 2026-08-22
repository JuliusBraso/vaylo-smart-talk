import { createHash } from "node:crypto";

import {
  stableKnowledgeFactoryId,
  type CuratedDomainPack,
  type CuratedServiceAreaPack,
} from "./knowledge-factory-contracts";

const hash = (value: string): string =>
  createHash("sha256").update(value).digest("hex");

function factory(packId: string) {
  return <T extends Readonly<Record<string, unknown>>>(
    entityClass: string,
    key: string,
    values: T,
  ) => Object.freeze({
    key,
    id: stableKnowledgeFactoryId(packId, entityClass, key),
    ...values,
  });
}

export function buildSyntheticFederalKindergeldPack(): CuratedDomainPack {
  const packId = "familienkasse_kindergeld";
  const item = factory(packId);
  const trust = item("trustDomain", "de", { code: "de", name: "Deutschland" });
  const jurisdiction = item("jurisdictions", "de", {
    level: "de_federal", code: "DE", countryCode: "DE", name: "Deutschland",
  });
  const scope = item("territorialScopes", "de", {
    type: "national", jurisdictionIds: [jurisdiction.id],
    landCodes: [], kreisCodes: [], municipalityCodes: [],
  });
  const publisher = item("publishers", "synthetic-federal-publisher", {
    name: "Synthetic Federal Publisher", type: "federal_publication",
    territorialScopeId: scope.id, trustDomainId: trust.id,
  });
  const authority = item("authorities", "synthetic-federal-authority", {
    publisherId: publisher.id, name: "Synthetic Familienkasse Authority",
    type: "federal_benefits_authority", jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id, officialPortalUrl: "https://example.invalid/kindergeld",
  });
  const passageText =
    "Synthetic local-only proof passage for a non-production Kindergeld orientation fixture.";
  const source = item("sources", "synthetic-kindergeld-source", {
    publisherId: publisher.id, authorityId: authority.id,
    jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
    sourceType: "official_guidance", purpose: "Synthetic contract proof",
    canonicalUrl: "https://example.invalid/kindergeld-proof",
    officialDomain: "example.invalid", normalizedOrigin: "https://example.invalid",
    sourceClass: "FEDERAL_ADMINISTRATIVE_GUIDANCE", authorityLevel: "FEDERAL",
    retrievalMethod: "HTML_DOCUMENT", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE",
    supportsClaimTypes: ["orientation"], highRiskUseAllowed: false,
  });
  const version = item("sourceVersions", "synthetic-kindergeld-version-1", {
    sourceId: source.id, versionSequence: 1, contentHash: hash(passageText),
  });
  const passage = item("passages", "synthetic-kindergeld-passage", {
    sourceVersionId: version.id, order: 0, headingPath: ["Synthetic"],
    locator: "synthetic-proof", text: passageText, textHash: hash(passageText),
  });
  const claim = item("claims", "synthetic-kindergeld-orientation", {
    type: "procedure", text: "Synthetic Kindergeld orientation claim for local contract proof only.",
    jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
    authorityId: authority.id, riskLevel: "medium",
    requiresEffectiveDate: false, requiresAuthorityResolution: true,
  });
  const evidence = item("evidenceLinks", "synthetic-kindergeld-evidence", {
    claimId: claim.id, sourceVersionId: version.id, passageId: passage.id,
    role: "official_guidance", primary: true,
  });
  const citation = item("citations", "synthetic-kindergeld-citation", {
    claimId: claim.id, sourceId: source.id, sourceVersionId: version.id,
    passageId: passage.id, publisherId: publisher.id,
    jurisdictionId: jurisdiction.id, label: "Synthetic proof",
    canonicalUrl: "https://example.invalid/kindergeld-proof",
  });
  const process = item("processes", "synthetic-kindergeld-process", {
    processGroupId: packId, title: "Synthetic Kindergeld orientation",
    jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
    riskLevel: "medium", trigger: "Synthetic proof trigger",
    safeFirstStep: "Consult the reviewed official source.",
    regionalVariationExpected: true,
  });
  const processClaimLink = item("processClaimLinks", "synthetic-kindergeld-process-claim", {
    processId: process.id, claimId: claim.id, role: "orientation_basis",
    required: true, sequenceContext: "orientation", qualificationRequired: false,
  });
  const policy = item("handlingPolicies", "synthetic-kindergeld-policy", {
    sourceId: source.id, informationClass: "PROCESS_IDENTITY",
    handlingMode: "STORE_CANONICALLY", freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [], riskClass: "MEDIUM",
  });
  const freshness = item("freshnessRecords", "synthetic-kindergeld-freshness", {
    entityType: "source", entityId: source.id, status: "fresh",
    effectiveDateKnown: false,
  });
  return Object.freeze({
    schemaVersion: 1,
    packId,
    domain: packId,
    canonicalLanguage: "de",
    trustDomain: trust,
    jurisdictions: [jurisdiction],
    territorialScopes: [scope],
    publishers: [publisher],
    authorities: [authority],
    sources: [source],
    sourceVersions: [version],
    passages: [passage],
    claims: [claim],
    evidenceLinks: [evidence],
    citations: [citation],
    actorRules: [],
    processes: [process],
    processClaimLinks: [processClaimLink],
    forms: [],
    fees: [],
    handlingPolicies: [policy],
    freshnessRecords: [freshness],
  });
}

function serviceAreaPack(
  packId: string,
  mixed: boolean,
): CuratedServiceAreaPack {
  const domain = "anmeldung_ummeldung_abmeldung" as const;
  const item = factory(packId);
  const trust = item("trustDomain", "de", { code: "de", name: "Deutschland" });
  const country = item("jurisdictions", "de", {
    level: "de_federal", code: "DE", countryCode: "DE", name: "Deutschland",
  });
  const land = item("jurisdictions", "synthetic-land", {
    level: "de_land", code: "S1", countryCode: "DE",
    parentJurisdictionId: country.id, name: "Synthetic Land",
  });
  const district = item("jurisdictions", "synthetic-district", {
    level: "de_kreis", code: "S1001", countryCode: "DE",
    parentJurisdictionId: land.id, name: "Synthetic District",
  });
  const municipalityKeys = mixed ? ["a", "b", "c"] : ["a", "b", "c"];
  const municipalities = municipalityKeys.map((key, index) =>
    item("jurisdictions", `municipality-${key}`, {
      level: "de_gemeinde", code: `S10010${index + 1}`, countryCode: "DE",
      parentJurisdictionId: district.id, name: `Synthetic Municipality ${key.toUpperCase()}`,
    }));
  const scopeA = item("territorialScopes", "service-area-a", {
    type: "service_area",
    jurisdictionIds: [country.id, land.id, district.id, ...municipalities.slice(0, mixed ? 2 : 3).map(({ id }) => id)],
    landCodes: ["S1"], kreisCodes: ["S1001"],
    municipalityCodes: municipalities.slice(0, mixed ? 2 : 3).map((entry) => entry.code),
  });
  const scopeB = mixed
    ? item("territorialScopes", "service-area-b", {
        type: "service_area",
        jurisdictionIds: [country.id, land.id, district.id, municipalities[2]!.id],
        landCodes: ["S1"], kreisCodes: ["S1001"],
        municipalityCodes: [municipalities[2]!.code],
      })
    : null;
  const scopes = scopeB ? [scopeA, scopeB] : [scopeA];
  const authoritySpecs = scopes.map((scope, index) => {
    const suffix = String.fromCharCode(97 + index);
    const publisher = item("publishers", `publisher-${suffix}`, {
      name: `Synthetic Service Publisher ${suffix.toUpperCase()}`,
      type: "intermunicipal_authority", territorialScopeId: scope.id,
      trustDomainId: trust.id,
    });
    const authority = item("authorities", `authority-${suffix}`, {
      publisherId: publisher.id, name: `Synthetic Shared Authority ${suffix.toUpperCase()}`,
      type: "verwaltungsgemeinschaft", jurisdictionId: district.id,
      territorialScopeId: scope.id,
      officialPortalUrl: `https://example.invalid/service-${suffix}`,
    });
    const passageText =
      `Synthetic reviewed local-only evidence for authority ${suffix.toUpperCase()} and its exact service area.`;
    const source = item("sources", `source-${suffix}`, {
      publisherId: publisher.id, authorityId: authority.id,
      jurisdictionId: district.id, territorialScopeId: scope.id,
      sourceType: "authority_portal", purpose: "Synthetic service-area proof",
      canonicalUrl: `https://example.invalid/service-${suffix}`,
      officialDomain: "example.invalid", normalizedOrigin: "https://example.invalid",
      sourceClass: "AUTHORITY_PORTAL", authorityLevel: "SPECIFIC_AUTHORITY",
      retrievalMethod: "HTML_DOCUMENT", handlingMode: "CACHE_AND_REVALIDATE",
      freshnessClass: "EVENT_DRIVEN", staleBehavior: "REVALIDATE_BEFORE_USE",
    });
    const version = item("sourceVersions", `version-${suffix}`, {
      sourceId: source.id, versionSequence: 1, contentHash: hash(passageText),
    });
    const passage = item("passages", `passage-${suffix}`, {
      sourceVersionId: version.id, order: 0, locator: "synthetic-service-area",
      text: passageText, textHash: hash(passageText),
    });
    const competence = item("competences", `competence-${suffix}`, {
      authorityId: authority.id, territorialScopeId: scope.id, domain,
      subjectMatter: "residence_registration_lifecycle",
      proceduralStage: "application", receivesApplication: true,
      decidesApplication: true, providesInformationOnly: false,
      sourceVersionId: version.id, passageId: passage.id,
      effectiveFrom: null, effectiveUntil: null,
    });
    const process = item("processBindings", `process-${suffix}`, {
      processGroupId: domain, title: `Synthetic local Anmeldung ${suffix.toUpperCase()}`,
      jurisdictionId: district.id, territorialScopeId: scope.id,
      riskLevel: "medium", trigger: "Synthetic residence move",
      safeFirstStep: "Contact the reviewed competent authority.",
    });
    const competencePolicy = item("handlingPolicies", `competence-policy-${suffix}`, {
      sourceId: source.id, informationClass: "AUTHORITY_COMPETENCE",
      handlingMode: "CACHE_AND_REVALIDATE", freshnessClass: "EVENT_DRIVEN",
      staleBehavior: "REVALIDATE_BEFORE_USE", requiredContextKeys: [],
      riskClass: "MEDIUM",
    });
    return { publisher, authority, source, version, passage, competence, process, competencePolicy };
  });
  const primary = authoritySpecs[0]!;
  const hoursText = "Synthetic opening-hours marker; current values require a live fetch.";
  const hoursSource = item("sources", "hours-source", {
    publisherId: primary.publisher.id, authorityId: primary.authority.id,
    jurisdictionId: district.id, territorialScopeId: scopeA.id,
    sourceType: "authority_portal", purpose: "Synthetic live-boundary proof",
    canonicalUrl: "https://example.invalid/service-hours",
    officialDomain: "example.invalid", normalizedOrigin: "https://example.invalid",
    sourceClass: "AUTHORITY_PORTAL", authorityLevel: "SPECIFIC_AUTHORITY",
    retrievalMethod: "HTML_DOCUMENT", handlingMode: "FETCH_LIVE",
    freshnessClass: "DAILY", staleBehavior: "REVALIDATE_BEFORE_USE",
  });
  const hoursVersion = item("sourceVersions", "hours-version", {
    sourceId: hoursSource.id, versionSequence: 1, contentHash: hash(hoursText),
  });
  const hoursPassage = item("passages", "hours-passage", {
    sourceVersionId: hoursVersion.id, order: 0, locator: "synthetic-hours",
    text: hoursText, textHash: hash(hoursText),
  });
  const hoursPolicy = item("handlingPolicies", "hours-policy", {
    sourceId: hoursSource.id, informationClass: "OPENING_HOURS",
    handlingMode: "FETCH_LIVE", freshnessClass: "DAILY",
    staleBehavior: "REVALIDATE_BEFORE_USE", requiredContextKeys: [],
    riskClass: "LOW",
  });
  return Object.freeze({
    schemaVersion: 1,
    packId,
    domain,
    countryCode: "DE",
    trustDomain: trust,
    jurisdictions: [country, land, district, ...municipalities],
    territorialScopes: scopes,
    publishers: authoritySpecs.map(({ publisher }) => publisher),
    authorities: authoritySpecs.map(({ authority }) => authority),
    sources: [...authoritySpecs.map(({ source }) => source), hoursSource],
    sourceVersions: [...authoritySpecs.map(({ version }) => version), hoursVersion],
    passages: [...authoritySpecs.map(({ passage }) => passage), hoursPassage],
    competences: authoritySpecs.map(({ competence }) => competence),
    processBindings: authoritySpecs.map(({ process }) => process),
    handlingPolicies: [
      ...authoritySpecs.map(({ competencePolicy }) => competencePolicy),
      hoursPolicy,
    ],
  });
}

export function buildSyntheticSharedAuthorityServiceAreaPack(): CuratedServiceAreaPack {
  return serviceAreaPack("synthetic_shared_service_area", false);
}

export function buildSyntheticMixedServiceAreaPack(): CuratedServiceAreaPack {
  return serviceAreaPack("synthetic_mixed_service_area", true);
}
