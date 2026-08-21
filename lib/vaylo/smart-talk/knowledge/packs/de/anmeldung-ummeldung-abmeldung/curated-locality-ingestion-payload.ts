import crypto from "node:crypto";

import { PACK_ENTITY_IDS as IDS, stablePackEntityId as stableId } from "./identity";
import { PACK_FAMILY, PACK_ID } from "./pack";

const PASSAGE_TEXT =
  "SYNTHETIC V2-B local disposable validation only. This municipality's Meldebehörde is competent for residence registration in this territorial scope. Not production-eligible.";

export const SYNTHETIC_LOCALITY_INGESTION = Object.freeze({
  productionEligible: false,
  landCode: "SYNTHETIC-DE-LAND-00",
  districtCode: "SYNTHETIC-DE-KREIS-000",
  municipalityCode: "SYNTHETIC-DE-GEMEINDE-0001",
  municipalityName: "SYNTHETIC V2-B Gemeinde",
  authorityName: "SYNTHETIC V2-B Meldebehörde",
  canonicalUrl: "https://synthetic-v2b-local-authority.example.invalid/meldewesen",
  officialDomain: "synthetic-v2b-local-authority.example.invalid",
});

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function buildSyntheticLocalityIngestionPayload(): Readonly<Record<string, unknown>> {
  const landId = stableId("v2b-synthetic:land");
  const districtId = stableId("v2b-synthetic:district");
  const localityId = stableId("v2b-synthetic:locality");
  const scopeId = stableId("v2b-synthetic:scope");
  const publisherId = stableId("v2b-synthetic:publisher");
  const authorityId = stableId("v2b-synthetic:authority");
  const sourceId = stableId("v2b-synthetic:source");
  const versionId = stableId("v2b-synthetic:source-version");
  const passageId = stableId("v2b-synthetic:passage");
  const competenceId = stableId("v2b-synthetic:competence");
  const processId = stableId("v2b-synthetic:process");
  return Object.freeze({
    packId: PACK_ID,
    family: PACK_FAMILY,
    countryCode: "DE",
    trustDomain: { id: IDS.trustDomain, code: "de", name: "Deutschland" },
    countryJurisdiction: {
      id: IDS.jurisdiction,
      level: "de_federal",
      code: "DE",
      countryCode: "DE",
      name: "Bundesrepublik Deutschland",
    },
    landJurisdiction: {
      id: landId,
      level: "de_land",
      code: SYNTHETIC_LOCALITY_INGESTION.landCode,
      countryCode: "DE",
      name: "SYNTHETIC V2-B Land",
      parentJurisdictionId: IDS.jurisdiction,
    },
    districtJurisdiction: {
      id: districtId,
      level: "de_kreis",
      code: SYNTHETIC_LOCALITY_INGESTION.districtCode,
      countryCode: "DE",
      name: "SYNTHETIC V2-B Kreis",
      parentJurisdictionId: landId,
    },
    locality: {
      id: localityId,
      level: "de_gemeinde",
      name: SYNTHETIC_LOCALITY_INGESTION.municipalityName,
      municipalityCode: SYNTHETIC_LOCALITY_INGESTION.municipalityCode,
      countryCode: "DE",
      parentJurisdictionId: districtId,
      landCode: SYNTHETIC_LOCALITY_INGESTION.landCode,
      districtCode: SYNTHETIC_LOCALITY_INGESTION.districtCode,
    },
    territorialScope: {
      id: scopeId,
      type: "municipality",
      jurisdictionIds: [IDS.jurisdiction, landId, districtId, localityId],
    },
    publisher: {
      id: publisherId,
      name: SYNTHETIC_LOCALITY_INGESTION.authorityName,
      territorialScopeId: scopeId,
      trustDomainId: IDS.trustDomain,
    },
    authority: {
      id: authorityId,
      publisherId,
      name: SYNTHETIC_LOCALITY_INGESTION.authorityName,
      type: "meldebehoerde",
      jurisdictionId: localityId,
      territorialScopeId: scopeId,
      url: SYNTHETIC_LOCALITY_INGESTION.canonicalUrl,
    },
    source: {
      id: sourceId,
      publisherId,
      canonicalUrl: SYNTHETIC_LOCALITY_INGESTION.canonicalUrl,
      officialDomain: SYNTHETIC_LOCALITY_INGESTION.officialDomain,
      normalizedOrigin: `https://${SYNTHETIC_LOCALITY_INGESTION.officialDomain}`,
      jurisdictionId: localityId,
      territorialScopeId: scopeId,
      authorityId,
      sourceClass: "AUTHORITY_PORTAL",
      authorityLevel: "MUNICIPALITY",
      handlingMode: "CACHE_AND_REVALIDATE",
      freshnessClass: "EVENT_DRIVEN",
      staleBehavior: "REVALIDATE_BEFORE_USE",
    },
    sourceVersion: { id: versionId, sourceId, contentHash: sha256(PASSAGE_TEXT) },
    passage: {
      id: passageId,
      locator: "synthetic-local-competence",
      text: PASSAGE_TEXT,
      textHash: sha256(PASSAGE_TEXT),
    },
    competence: {
      id: competenceId,
      authorityId,
      territorialScopeId: scopeId,
      subjectMatter: "residence_registration_lifecycle",
      family: PACK_FAMILY,
      effectiveFrom: "2020-01-01T00:00:00.000Z",
      effectiveUntil: null,
      sourceVersionId: versionId,
      passageId,
      receivesApplication: true,
      decidesApplication: true,
    },
    processBinding: {
      id: processId,
      title: "SYNTHETIC V2-B local operational delivery of Anmeldung",
      jurisdictionId: localityId,
      territorialScopeId: scopeId,
    },
    handlingPolicies: [
      {
        id: stableId("v2b-synthetic:handling:competence"),
        informationClass: "AUTHORITY_COMPETENCE",
        handlingMode: "CACHE_AND_REVALIDATE",
        freshnessClass: "EVENT_DRIVEN",
        staleBehavior: "REVALIDATE_BEFORE_USE",
        riskClass: "MEDIUM",
      },
      {
        id: stableId("v2b-synthetic:handling:contact"),
        informationClass: "CONTACT_DETAILS",
        handlingMode: "CACHE_AND_REVALIDATE",
        freshnessClass: "MONTHLY",
        staleBehavior: "REVALIDATE_BEFORE_USE",
        riskClass: "MEDIUM",
      },
      {
        id: stableId("v2b-synthetic:handling:service-url"),
        informationClass: "ONLINE_SERVICE_URL",
        handlingMode: "CACHE_AND_REVALIDATE",
        freshnessClass: "EVENT_DRIVEN",
        staleBehavior: "REVALIDATE_BEFORE_USE",
        riskClass: "MEDIUM",
      },
    ],
    // Required key. Empty array is valid; omitting the key is invalid.
    additionalEvidence: [],
  });
}
