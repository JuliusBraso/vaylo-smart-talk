import { Client } from "pg";

export const ANMELDUNG_CONTEXT_RPC = "public.knowledge_retrieve_anmeldung_context(uuid[], text)";

export type AnmeldungFederalEvidence = Readonly<{
  claimId: string;
  canonicalProposition: string;
  canonicalLanguage: string;
  jurisdictionCode: string;
  territorialScope: string | null;
  handlingMode: string;
  canonicalValueUsable: boolean;
  staleBehavior: string;
  sourceId: string;
  sourceVersionId: string;
  sourcePassageId: string;
  legalLocator: string | null;
  citationReference: string | null;
}>;

export type AnmeldungLocalEvidence = Readonly<{
  informationClass: string;
  handlingMode: string;
  freshnessClass: string;
  staleBehavior: string;
  canonicalValueUsable: boolean;
  requiresLiveFetch: boolean;
  requiresRevalidation: boolean;
  answerReady: boolean;
  usabilityState: string;
  sourceId: string;
  sourceVersionId: string;
  sourcePassageId: string;
  publisherId: string;
  publisherName: string;
  issuingAuthorityId: string | null;
  canonicalUrl: string;
  locator: string | null;
  passageText: string;
  jurisdictionId: string;
  territorialScopeId: string;
}>;

export type AnmeldungLocalContext = Readonly<{
  locality: Readonly<{
    municipalityCode: string;
    municipalityName: string;
    jurisdictionId: string;
    landCode: string | null;
    landName: string | null;
    districtCode: string | null;
    districtName: string | null;
    territorialScopeId: string;
  }>;
  authority: Readonly<{
    id: string;
    name: string;
    type: string;
    officialPortalUrl: string | null;
  }> | null;
  competence: Readonly<{
    id: string;
    subjectMatter: string;
    family: string;
    territorialScopeId: string;
    receivesApplication: boolean;
    decidesApplication: boolean;
    effectiveFrom: string | null;
    effectiveUntil: string | null;
    sourceVersionId: string;
    passageId: string | null;
    locator: string | null;
    canonicalUrl: string | null;
  }> | null;
  process: Readonly<{
    id: string;
    title: string;
    regionalVariationExpected: boolean;
  }> | null;
  evidence: readonly AnmeldungLocalEvidence[];
}>;

export type AnmeldungContextResult = Readonly<{
  packId: string;
  family: string;
  countryCode: string;
  federalEvidence: readonly AnmeldungFederalEvidence[];
  localContext: AnmeldungLocalContext | null;
}>;

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function mapFederal(row: Record<string, unknown>): AnmeldungFederalEvidence {
  return {
    claimId: String(row.claim_id),
    canonicalProposition: String(row.canonical_proposition),
    canonicalLanguage: String(row.canonical_language),
    jurisdictionCode: String(row.jurisdiction_code),
    territorialScope: row.territorial_scope == null ? null : String(row.territorial_scope),
    handlingMode: String(row.handling_mode),
    canonicalValueUsable: row.canonical_value_usable === true,
    staleBehavior: String(row.stale_behavior),
    sourceId: String(row.source_id),
    sourceVersionId: String(row.source_version_id),
    sourcePassageId: String(row.source_passage_id),
    legalLocator: row.legal_locator == null ? null : String(row.legal_locator),
    citationReference: row.citation_reference == null ? null : String(row.citation_reference),
  };
}

function mapLocalEvidence(row: Record<string, unknown>): AnmeldungLocalEvidence {
  return {
    informationClass: String(row.informationClass),
    handlingMode: String(row.handlingMode),
    freshnessClass: String(row.freshnessClass),
    staleBehavior: String(row.staleBehavior),
    canonicalValueUsable: row.canonicalValueUsable === true,
    requiresLiveFetch: row.requiresLiveFetch === true,
    requiresRevalidation: row.requiresRevalidation === true,
    answerReady: row.answerReady === true,
    usabilityState: String(row.usabilityState),
    sourceId: String(row.sourceId),
    sourceVersionId: String(row.sourceVersionId),
    sourcePassageId: String(row.sourcePassageId),
    publisherId: String(row.publisherId),
    publisherName: String(row.publisherName),
    issuingAuthorityId: row.issuingAuthorityId == null ? null : String(row.issuingAuthorityId),
    canonicalUrl: String(row.canonicalUrl),
    locator: row.locator == null ? null : String(row.locator),
    passageText: String(row.passageText),
    jurisdictionId: String(row.jurisdictionId),
    territorialScopeId: String(row.territorialScopeId),
  };
}

export function parseAnmeldungContextResult(payload: unknown): AnmeldungContextResult {
  const root = asRecord(payload);
  const localRaw = root.localContext;
  const local = localRaw == null ? null : asRecord(localRaw);
  const locality = local ? asRecord(local.locality) : {};
  const authority = local?.authority == null ? null : asRecord(local.authority);
  const competence = local?.competence == null ? null : asRecord(local.competence);
  const process = local?.process == null ? null : asRecord(local.process);
  return {
    packId: String(root.packId),
    family: String(root.family),
    countryCode: String(root.countryCode),
    federalEvidence: Array.isArray(root.federalEvidence)
      ? (root.federalEvidence as unknown[]).map((row) => mapFederal(asRecord(row)))
      : [],
    localContext: local == null ? null : {
      locality: {
        municipalityCode: String(locality.municipalityCode),
        municipalityName: String(locality.municipalityName),
        jurisdictionId: String(locality.jurisdictionId),
        landCode: locality.landCode == null ? null : String(locality.landCode),
        landName: locality.landName == null ? null : String(locality.landName),
        districtCode: locality.districtCode == null ? null : String(locality.districtCode),
        districtName: locality.districtName == null ? null : String(locality.districtName),
        territorialScopeId: String(locality.territorialScopeId),
      },
      authority: authority && {
        id: String(authority.id),
        name: String(authority.name),
        type: String(authority.type),
        officialPortalUrl: authority.officialPortalUrl == null ? null : String(authority.officialPortalUrl),
      },
      competence: competence && {
        id: String(competence.id),
        subjectMatter: String(competence.subjectMatter),
        family: String(competence.family),
        territorialScopeId: String(competence.territorialScopeId),
        receivesApplication: competence.receivesApplication === true,
        decidesApplication: competence.decidesApplication === true,
        effectiveFrom: competence.effectiveFrom == null ? null : String(competence.effectiveFrom),
        effectiveUntil: competence.effectiveUntil == null ? null : String(competence.effectiveUntil),
        sourceVersionId: String(competence.sourceVersionId),
        passageId: competence.passageId == null ? null : String(competence.passageId),
        locator: competence.locator == null ? null : String(competence.locator),
        canonicalUrl: competence.canonicalUrl == null ? null : String(competence.canonicalUrl),
      },
      process: process && {
        id: String(process.id),
        title: String(process.title),
        regionalVariationExpected: process.regionalVariationExpected === true,
      },
      evidence: Array.isArray(local.evidence)
        ? (local.evidence as unknown[]).map((row) => mapLocalEvidence(asRecord(row)))
        : [],
    },
  };
}

export async function retrieveAnmeldungContext(
  client: Client,
  claimIds: readonly string[],
  municipalityCode: string | null,
): Promise<AnmeldungContextResult> {
  const result = await client.query(
    "select public.knowledge_retrieve_anmeldung_context($1::uuid[], $2::text) as result",
    [claimIds, municipalityCode],
  );
  return parseAnmeldungContextResult(result.rows[0]?.result);
}
