/**
 * Disposable CB-0B fixtures only. No substantive 883/987 or national SK/CZ/PL/HU law.
 */
import { createHash } from "node:crypto";

import { buildSyntheticFederalKindergeldPack } from "./knowledge-factory-synthetic-fixtures";
import { stableKnowledgeFactoryId } from "./knowledge-factory-contracts";
import {
  type CrossBorderCaseContext,
  type CuratedCrossBorderConnectorPack,
  type EuJurisdictionAnchorPack,
  type StableKnowledgeReference,
} from "./cross-border-connector-contracts";

const HASH = (value: string): string => createHash("sha256").update(value).digest("hex");

function item<T extends Readonly<Record<string, unknown>>>(
  packId: string,
  entityClass: string,
  key: string,
  values: T,
) {
  return Object.freeze({
    key,
    id: stableKnowledgeFactoryId(packId, entityClass, key),
    ...values,
  });
}

export const CB0B_GERMAN_PROCESS_KEY = "synthetic-kindergeld-process";
export const CB0B_GERMAN_CLAIM_KEY = "synthetic-kindergeld-orientation";
export const CB0B_EU_CLAIM_KEY = "cb0b-synthetic-eu-coordination-anchor";
export const CB0B_EU_PACK_ID = "eu_jurisdiction_anchor" as const;

export function buildSyntheticEuJurisdictionAnchorPack(): EuJurisdictionAnchorPack {
  const packId = CB0B_EU_PACK_ID;
  const trust = item(packId, "trustDomain", "eu", {
    code: "eu" as const, name: "Europäische Union",
  });
  const jurisdiction = item(packId, "jurisdictions", "eu", {
    level: "eu" as const, code: "EU" as const, countryCode: "EU" as const,
    name: "Europäische Union",
  });
  const scope = item(packId, "territorialScopes", "eu", {
    type: "supranational", jurisdictionIds: [jurisdiction.id],
    landCodes: [], kreisCodes: [], municipalityCodes: [],
  });
  const publisher = item(packId, "publishers", "synthetic-eu-publisher", {
    name: "Synthetic EU Publisher", type: "eu_publication",
    territorialScopeId: scope.id, trustDomainId: trust.id,
  });
  const authority = item(packId, "authorities", "synthetic-eu-authority", {
    publisherId: publisher.id, name: "Synthetic EU Coordination Authority",
    type: "eu_coordination", jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id, officialPortalUrl: "https://example.invalid/eu-coordination",
  });
  const passageText =
    "Synthetic local-only EU jurisdiction anchor. Not Regulation 883/2004 or 987/2009 current-law content.";
  const source = item(packId, "sources", "synthetic-eu-source", {
    publisherId: publisher.id, authorityId: authority.id,
    jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
    sourceType: "official_guidance", purpose: "Synthetic EU jurisdiction proof",
    canonicalUrl: "https://example.invalid/eu-coordination-anchor",
    officialDomain: "example.invalid", normalizedOrigin: "https://example.invalid",
    sourceClass: "EU_LAW", authorityLevel: "EU",
    retrievalMethod: "HTML_DOCUMENT", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE",
    supportsClaimTypes: ["definition"], highRiskUseAllowed: false,
    publicationIdentifier: "CB-0B synthetic EU anchor",
  });
  const version = item(packId, "sourceVersions", "synthetic-eu-version-1", {
    sourceId: source.id, versionSequence: 1, contentHash: HASH(passageText),
  });
  const passage = item(packId, "passages", "synthetic-eu-passage", {
    sourceVersionId: version.id, order: 0, headingPath: ["Synthetic EU"],
    locator: "synthetic-eu-proof", text: passageText, textHash: HASH(passageText),
  });
  const claim = item(packId, "claims", CB0B_EU_CLAIM_KEY, {
    type: "definition",
    text: "Synthetic EU-jurisdiction coordination anchor for connector-resolution proof only.",
    jurisdictionId: jurisdiction.id, territorialScopeId: scope.id,
    authorityId: authority.id, riskLevel: "medium",
    requiresEffectiveDate: false, requiresAuthorityResolution: true,
    temporalClass: "CURRENT" as const,
  });
  const evidence = item(packId, "evidenceLinks", "synthetic-eu-evidence", {
    claimId: claim.id, sourceVersionId: version.id, passageId: passage.id,
    role: "official_guidance", primary: true,
  });
  const citation = item(packId, "citations", "synthetic-eu-citation", {
    claimId: claim.id, sourceId: source.id, sourceVersionId: version.id,
    passageId: passage.id, publisherId: publisher.id,
    jurisdictionId: jurisdiction.id, label: "Synthetic EU proof",
    canonicalUrl: "https://example.invalid/eu-coordination-anchor",
  });
  return Object.freeze({
    schemaVersion: 1,
    packId,
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
  });
}

function germanProcessRef(): StableKnowledgeReference {
  return Object.freeze({
    entityClass: "processes" as const,
    key: CB0B_GERMAN_PROCESS_KEY,
    sourceJurisdiction: "DE" as const,
    trustDomain: "de" as const,
    temporalClass: "CURRENT" as const,
  });
}

function germanClaimRef(): StableKnowledgeReference {
  return Object.freeze({
    entityClass: "claims" as const,
    key: CB0B_GERMAN_CLAIM_KEY,
    sourceJurisdiction: "DE" as const,
    trustDomain: "de" as const,
    temporalClass: "CURRENT" as const,
  });
}

function euClaimRef(): StableKnowledgeReference {
  return Object.freeze({
    entityClass: "claims" as const,
    key: CB0B_EU_CLAIM_KEY,
    sourceJurisdiction: "EU" as const,
    trustDomain: "eu" as const,
    temporalClass: "CURRENT" as const,
  });
}

export function buildValidDeSkPlannedConnectorPack(): CuratedCrossBorderConnectorPack {
  return Object.freeze({
    schemaVersion: 1,
    packId: "cb0b_de_sk_planned",
    originMarket: "DE",
    connectedCountry: "SK",
    status: "planned",
    activationFromLocaleAllowed: false,
    activationRequiresVerifiedCaseContext: true,
    topicKey: "cb0b-infrastructure-proof",
    topicFamily: "SOCIAL_SECURITY_COORDINATION",
    germanProcessRef: germanProcessRef(),
    germanClaimRefs: [germanClaimRef()],
    euClaimRefs: [euClaimRef()],
    foreignClaimRefs: [],
    foreignProcessReference: "SK_NATIONAL_ADAPTER_NOT_YET_AUTHORIZED",
    actorRule: Object.freeze({
      actorState: "cross_border_competence_undetermined_without_verified_context",
      userMustAct: true,
      germanAuthorityMustAct: false,
      foreignAuthorityMustAct: false,
      institutionExchangeExpected: true,
    }),
    requiredCaseRoles: ["WORKER", "CHILD"] as const,
    requiredCaseStates: ["residenceState", "employmentState"] as const,
    handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT",
    freshnessClass: "EVENT_DRIVEN",
  });
}

export function buildValidCaseContext(): CrossBorderCaseContext {
  return Object.freeze({
    persons: [
      Object.freeze({
        role: "WORKER" as const,
        residenceState: "SK",
        employmentState: "DE",
        insuranceState: "DE",
        activityState: "DE",
        postingState: null,
      }),
      Object.freeze({
        role: "CHILD" as const,
        residenceState: "SK",
        employmentState: null,
        insuranceState: "SK",
        activityState: null,
        postingState: null,
      }),
    ],
    period: Object.freeze({ from: "2026-08-01", to: "2026-08-31" }),
    overlappingBenefits: Object.freeze(["kindergeld"]),
    workerPostingStatus: "WORKER" as const,
  });
}

export function buildMalformedCaseContext(): CrossBorderCaseContext {
  return Object.freeze({
    persons: [
      Object.freeze({
        role: "MOTHER" as unknown as "PARENT_A",
        residenceState: "slovak",
        employmentState: "de",
      }),
    ],
    period: Object.freeze({ from: "" }),
  });
}

export function connectorWithUnknownCorridor(): CuratedCrossBorderConnectorPack {
  return Object.freeze({
    ...buildValidDeSkPlannedConnectorPack(),
    connectedCountry: "AT" as CuratedCrossBorderConnectorPack["connectedCountry"],
  });
}

export function connectorWithLocaleActivation(): Record<string, unknown> {
  return {
    ...buildValidDeSkPlannedConnectorPack(),
    userLocale: "sk",
    activationFromLocaleAllowed: true,
  };
}

export function connectorWithoutVerifiedContext(): CuratedCrossBorderConnectorPack {
  return Object.freeze({
    ...buildValidDeSkPlannedConnectorPack(),
    activationRequiresVerifiedCaseContext: false as unknown as true,
  });
}

export function connectorMissingGermanReference(): CuratedCrossBorderConnectorPack {
  return Object.freeze({
    ...buildValidDeSkPlannedConnectorPack(),
    germanClaimRefs: [],
  });
}

export function connectorMissingEuReference(): CuratedCrossBorderConnectorPack {
  return Object.freeze({
    ...buildValidDeSkPlannedConnectorPack(),
    euClaimRefs: [],
  });
}

export function connectorWithAmbiguousReference(): Record<string, unknown> {
  const pack = buildValidDeSkPlannedConnectorPack();
  return {
    ...pack,
    germanClaimRefs: [{
      ...pack.germanClaimRefs[0],
      id: pack.euClaimRefs[0] ? "00000000-0000-4000-8000-000000000001" : "ambiguous",
    }],
  };
}

export function connectorWithWrongJurisdiction(): CuratedCrossBorderConnectorPack {
  return Object.freeze({
    ...buildValidDeSkPlannedConnectorPack(),
    germanClaimRefs: [Object.freeze({
      ...germanClaimRef(),
      sourceJurisdiction: "EU" as const,
    })],
  });
}

export function connectorWithWrongTrustDomain(): CuratedCrossBorderConnectorPack {
  return Object.freeze({
    ...buildValidDeSkPlannedConnectorPack(),
    euClaimRefs: [Object.freeze({
      ...euClaimRef(),
      trustDomain: "de" as const,
    })],
  });
}

export function connectorWithProposedClaim(): CuratedCrossBorderConnectorPack {
  return Object.freeze({
    ...buildValidDeSkPlannedConnectorPack(),
    euClaimRefs: [Object.freeze({
      ...euClaimRef(),
      temporalClass: "PROPOSED_NOT_CURRENT" as const,
    })],
  });
}

export function connectorWithForeignNationalRef(): CuratedCrossBorderConnectorPack {
  return Object.freeze({
    ...buildValidDeSkPlannedConnectorPack(),
    foreignClaimRefs: [Object.freeze({
      entityClass: "claims" as const,
      key: "sk-national-not-authorized",
      sourceJurisdiction: "EU" as const,
      trustDomain: "eu" as const,
      temporalClass: "CURRENT" as const,
    })],
  });
}

export function connectorPartialPayload(): Record<string, unknown> {
  const pack = { ...buildValidDeSkPlannedConnectorPack() } as Record<string, unknown>;
  delete pack.connectedCountry;
  return pack;
}

export function connectorWithDuplicateReference(): CuratedCrossBorderConnectorPack {
  return Object.freeze({
    ...buildValidDeSkPlannedConnectorPack(),
    germanClaimRefs: [germanClaimRef(), germanClaimRef()],
  });
}

export function connectorTaxTreatyContamination(): CuratedCrossBorderConnectorPack {
  return Object.freeze({
    ...buildValidDeSkPlannedConnectorPack(),
    topicFamily: "TAX_TREATY",
  });
}

export function skNationalCountryCodes(): readonly string[] {
  return Object.freeze(["SK", "CZ", "PL", "HU"]);
}

export function germanKindergeldFixture() {
  return buildSyntheticFederalKindergeldPack();
}
