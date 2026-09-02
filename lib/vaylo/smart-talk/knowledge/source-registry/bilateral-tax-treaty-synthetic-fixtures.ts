/**
 * Disposable CB-TAX-0B fixtures only.
 * Synthetic DE-SK treaty-version metadata. No Article 4/14/15/23 merits.
 */
import { stableKnowledgeFactoryId } from "./knowledge-factory-contracts";
import {
  BILATERAL_TAX_CANONICAL_TREATY_KEY,
  BILATERAL_TAX_JURISDICTION_LEVEL,
  BILATERAL_TAX_TRUST_DOMAIN,
  type BilateralTaxStableRef,
  type CrossBorderTaxCaseContext,
  type CrossBorderTaxIncomeItem,
  type CuratedBilateralTaxTreatyPack,
} from "./bilateral-tax-treaty-contracts";

const PACK_ID = "de_sk_bilateral_tax_treaty_foundation";

function item<T extends Readonly<Record<string, unknown>>>(
  entityClass: string,
  key: string,
  values: T,
) {
  return Object.freeze({
    key,
    id: stableKnowledgeFactoryId(PACK_ID, entityClass, key),
    ...values,
  });
}

export const CB_TAX_0B_CLAIM_KEY = "cb-tax-0b-synthetic-treaty-identity";
export const CB_TAX_0B_PACK_ID = PACK_ID;

const TREATY_CLAIM_REF: BilateralTaxStableRef = Object.freeze({
  entityClass: "claims",
  key: CB_TAX_0B_CLAIM_KEY,
  sourceJurisdiction: "BILATERAL",
  trustDomain: BILATERAL_TAX_TRUST_DOMAIN,
  temporalClass: "CURRENT",
  claimRole: "bilateral_treaty",
});

export function buildValidDeSkTaxFoundationPack(): CuratedBilateralTaxTreatyPack {
  const trust = item("trustDomain", "bilateral_tax_treaty", {
    code: BILATERAL_TAX_TRUST_DOMAIN,
    name: "Bilateral tax treaty provenance",
  });
  const jurisdiction = item("jurisdictions", "de-sk", {
    level: BILATERAL_TAX_JURISDICTION_LEVEL,
    code: BILATERAL_TAX_CANONICAL_TREATY_KEY,
    treatyCountries: ["DE", "SK"] as const,
    countryCode: null,
    authorityCountry: "MULTILATERAL" as const,
  });
  const scope = item("territorialScopes", "de-sk", {
    type: "bilateral_tax_treaty",
    jurisdictionIds: [jurisdiction.id],
    treatyCountries: ["DE", "SK"] as const,
  });
  const publisher = item("publishers", "synthetic-bilateral-tax-publisher", {
    name: "Synthetic bilateral tax publisher",
    type: "treaty_depositary",
    territorialScopeId: scope.id,
    trustDomainId: trust.id,
  });
  const authority = item("authorities", "synthetic-bilateral-tax-authority", {
    publisherId: publisher.id,
    name: "Synthetic DE-SK tax treaty authority",
    type: "bilateral_treaty",
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
    authorityCountry: "MULTILATERAL" as const,
  });
  const claim = item("claims", CB_TAX_0B_CLAIM_KEY, {
    type: "definition",
    text: "Synthetic DE-SK bilateral tax treaty identity metadata. Not Article 4, 14, 15, or 23 content.",
    riskLevel: "high" as const,
    temporalClass: "CURRENT" as const,
    claimRole: "bilateral_treaty" as const,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
    authorityId: authority.id,
  });
  return Object.freeze({
    schemaVersion: 1,
    packId: PACK_ID,
    treatyKey: BILATERAL_TAX_CANONICAL_TREATY_KEY,
    countryA: "DE",
    countryB: "SK",
    canonicalLanguage: "de",
    topicFamily: "TAX_TREATY",
    lifecycleState: "draft",
    sourceRefs: [TREATY_CLAIM_REF],
    claimUnits: [TREATY_CLAIM_REF],
    processGroups: ["TAX_RESIDENCE" as const],
    effectiveFrom: "1983-11-17",
    effectiveTo: null,
    temporalVersion: "pre_2025",
    active: false,
    publicRuntimeAllowed: false,
    trustDomain: trust,
    jurisdiction,
    territorialScope: scope,
    publisher,
    authority,
    claims: [claim],
    versions: [
      {
        temporalVersion: "pre_2025",
        effectiveFrom: "1983-11-17",
        effectiveTo: "2024-12-31",
        baseTreatyDate: "1980-12-19",
        mliModified: false,
        mliEffectiveFrom: null,
        mliAdoptionDate: "2016-11-24",
        deMliSignatureDate: "2017-06-07",
        skMliSignatureDate: "2017-06-07",
        deMliEntryIntoForce: "2021-04-01",
        skMliEntryIntoForce: "2019-01-01",
        germanArticle35CompletionDate: "2024-10-02",
        taxType: "ALL_SUBJECT_TO_ARTICLE_SPECIFIC_RULES",
        sourceKind: "AUTHENTIC_BILATERAL_TREATY" as const,
        sourceVersion: "foundation-pre-2025",
      },
      {
        temporalVersion: "from_2025",
        effectiveFrom: "2025-01-01",
        effectiveTo: null,
        baseTreatyDate: "1980-12-19",
        mliModified: true,
        mliEffectiveFrom: "2025-01-01",
        mliAdoptionDate: "2016-11-24",
        deMliSignatureDate: "2017-06-07",
        skMliSignatureDate: "2017-06-07",
        deMliEntryIntoForce: "2021-04-01",
        skMliEntryIntoForce: "2019-01-01",
        germanArticle35CompletionDate: "2024-10-02",
        taxType: "ALL_SUBJECT_TO_ARTICLE_SPECIFIC_RULES",
        sourceKind: "AUTHENTIC_BEPS_MLI" as const,
        sourceVersion: "foundation-2025-mli",
      },
    ],
    processes: [
      {
        processGroupId: "TAX_RESIDENCE" as const,
        temporalVersion: "pre_2025",
        claimRefs: [TREATY_CLAIM_REF],
      },
      {
        processGroupId: "TAX_RESIDENCE" as const,
        temporalVersion: "from_2025",
        claimRefs: [TREATY_CLAIM_REF],
      },
    ],
  });
}

export function taxPackWithEuTrust(): CuratedBilateralTaxTreatyPack {
  const pack = buildValidDeSkTaxFoundationPack();
  return Object.freeze({
    ...pack,
    trustDomain: { ...pack.trustDomain, code: "eu" as never },
  });
}

export function taxPackWithUnsupportedPair(pair: "DE-CZ" | "DE-PL" | "DE-HU" | "SK-CZ" | "XX-YY") {
  const [countryA, countryB] = pair.split("-") as [string, string];
  const pack = buildValidDeSkTaxFoundationPack();
  return {
    ...pack,
    treatyKey: pair,
    countryA,
    countryB,
    jurisdiction: { ...pack.jurisdiction, code: pair, treatyCountries: [countryA, countryB] },
  };
}

export function taxPackWithHardcodedUuid(): CuratedBilateralTaxTreatyPack {
  const pack = buildValidDeSkTaxFoundationPack();
  return Object.freeze({
    ...pack,
    claims: [{ ...pack.claims[0]!, id: "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee" }],
  });
}

export function taxPackWithZeroClaimRefs(): CuratedBilateralTaxTreatyPack {
  const pack = buildValidDeSkTaxFoundationPack();
  return Object.freeze({
    ...pack,
    sourceRefs: [],
    claimUnits: [],
    processes: pack.processes.map((process) => ({ ...process, claimRefs: [] })),
  });
}

export function taxPackWithAmbiguousClaimRefs(): CuratedBilateralTaxTreatyPack {
  const pack = buildValidDeSkTaxFoundationPack();
  const duplicate: BilateralTaxStableRef = { ...TREATY_CLAIM_REF };
  return Object.freeze({
    ...pack,
    claimUnits: [TREATY_CLAIM_REF, duplicate],
  });
}

export function taxPackWithLocale(): Record<string, unknown> {
  return { ...buildValidDeSkTaxFoundationPack(), userLocale: "sk" };
}

export function taxPackWithClaimRefDatabaseUuid(): Record<string, unknown> {
  const pack = buildValidDeSkTaxFoundationPack();
  return {
    ...pack,
    claimUnits: [{ ...pack.claimUnits[0]!, id: "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee" }],
  };
}

export function incompleteTaxCaseContext(): CrossBorderTaxCaseContext {
  return Object.freeze({
    taxYear: null,
    nationality: "SK",
    domesticResidenceCandidates: ["DUAL_DOMESTIC_RESIDENCE_CANDIDATE" as const],
    treatyResidenceState: "TREATY_RESIDENCE_UNRESOLVED",
    residenceDeterminationStatus: "INCOMPLETE",
    workStates: ["DE"],
    incomeItems: [unresolvedSelfEmployedIncomeItem()],
    relevantDateRange: { from: null, to: null },
    sourceCountryFacts: {},
    treatyVersionContext: {
      treatyKey: "DE-SK",
      temporalVersion: null,
      effectiveFrom: null,
      effectiveTo: null,
      mliModified: null,
    },
    classificationStatus: "INCOMPLETE",
    socialSecurityCompetentState: "DE",
    socialSecurityActivityType: "SELF_EMPLOYED",
  });
}

export function unresolvedSelfEmployedIncomeItem(): CrossBorderTaxIncomeItem {
  return Object.freeze({
    incomeItemId: "item-szco-unresolved",
    incomeCategory: "UNKNOWN",
    activityType: "SELF_EMPLOYED",
    periodStart: "2026-01-01",
    periodEnd: "2026-12-31",
    payerState: "DE",
    employerState: null,
    physicalWorkStates: ["SK"],
    sourceStateCandidate: null,
    sourceStateVerified: null,
    treatyArticleCandidate: null,
    treatyArticleVerified: null,
    treatyArticleState: "ARTICLE_UNRESOLVED",
    fixedBaseState: null,
    permanentEstablishmentState: null,
    taxingRightStates: [],
    reliefMethodCandidate: null,
    classificationStatus: "UNRESOLVED",
  });
}

export function employedIncomeItem(): CrossBorderTaxIncomeItem {
  return Object.freeze({
    ...unresolvedSelfEmployedIncomeItem(),
    incomeItemId: "item-employed-unresolved",
    incomeCategory: "EMPLOYMENT_INCOME",
    activityType: "EMPLOYED",
    employerState: "DE",
    payerState: "DE",
    physicalWorkStates: ["SK"],
  });
}

export function mixedIncomeItem(): CrossBorderTaxIncomeItem {
  return Object.freeze({
    ...unresolvedSelfEmployedIncomeItem(),
    incomeItemId: "item-mixed-unresolved",
    activityType: "MIXED_EMPLOYED_SELF_EMPLOYED",
  });
}

export function selfEmployedAutoArticle14Item(): CrossBorderTaxIncomeItem {
  return Object.freeze({
    ...unresolvedSelfEmployedIncomeItem(),
    treatyArticleCandidate: "14",
    treatyArticleState: "ARTICLE_VERIFIED",
  });
}

export function employerToTaxingRightShortcut(): CrossBorderTaxIncomeItem {
  return Object.freeze({
    ...employedIncomeItem(),
    taxingRightDerivedFrom: "employerState",
    taxingRightStates: ["DE"],
  });
}

export function nationalityResidenceShortcut() {
  return {
    treatyResidenceState: "TREATY_RESIDENT_SK" as const,
    residenceDeterminationStatus: "DETERMINED" as const,
    taxResidenceBasis: "NATIONALITY",
    nationality: "SK",
  };
}
