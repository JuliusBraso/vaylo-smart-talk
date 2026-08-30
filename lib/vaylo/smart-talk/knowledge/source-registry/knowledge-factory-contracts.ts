import { createHash } from "node:crypto";

export const KNOWLEDGE_FACTORY_SCHEMA_VERSION = 1 as const;
export const KNOWLEDGE_FACTORY_DOMAINS = Object.freeze([
  "anmeldung_ummeldung_abmeldung",
  "steuer_id_and_basic_finanzamt_letters",
  "health_insurance_orientation",
  "jobcenter_buergergeld",
  "familienkasse_kindergeld",
  "rechnung_mahnung",
  "kuendigung_orientation",
  "auslaenderbehoerde_limited_orientation",
  "vehicle_registration_and_driving_licence",
  "housing_orientation",
  "arbeitslosengeld",
  "einkommensteuer_steuererklaerung",
  "wohngeld",
  "versicherungsvertraege_versicherungsschreiben",
  "banking_zahlungsverkehr",
  "verkehrsordnungswidrigkeiten_bussgeldverfahren",
] as const);
export type KnowledgeFactoryDomain = typeof KNOWLEDGE_FACTORY_DOMAINS[number];

export const KNOWLEDGE_HANDLING_MODES = Object.freeze([
  "STORE_CANONICALLY",
  "FETCH_LIVE",
  "CACHE_AND_REVALIDATE",
  "MANUAL_REVIEW_REQUIRED",
  "DO_NOT_ANSWER_WITHOUT_CONTEXT",
] as const);

type Entity = Readonly<Record<string, unknown> & { key: string; id: string }>;
type TrustDomain = Readonly<{ key: string; id: string; code: string; name: string }>;

export type CuratedDomainPack = Readonly<{
  schemaVersion: typeof KNOWLEDGE_FACTORY_SCHEMA_VERSION;
  packId: KnowledgeFactoryDomain;
  domain: KnowledgeFactoryDomain;
  canonicalLanguage: "de";
  trustDomain: TrustDomain;
  jurisdictions: readonly Entity[];
  territorialScopes: readonly Entity[];
  publishers: readonly Entity[];
  authorities: readonly Entity[];
  sources: readonly Entity[];
  sourceVersions: readonly Entity[];
  passages: readonly Entity[];
  claims: readonly Entity[];
  evidenceLinks: readonly Entity[];
  citations: readonly Entity[];
  actorRules: readonly Entity[];
  processes: readonly Entity[];
  processClaimLinks: readonly Entity[];
  forms: readonly Entity[];
  fees: readonly Entity[];
  handlingPolicies: readonly Entity[];
  freshnessRecords: readonly Entity[];
}>;

export type CuratedServiceAreaPack = Readonly<{
  schemaVersion: typeof KNOWLEDGE_FACTORY_SCHEMA_VERSION;
  packId: string;
  domain: KnowledgeFactoryDomain;
  countryCode: "DE";
  trustDomain: TrustDomain;
  jurisdictions: readonly Entity[];
  territorialScopes: readonly Entity[];
  publishers: readonly Entity[];
  authorities: readonly Entity[];
  sources: readonly Entity[];
  sourceVersions: readonly Entity[];
  passages: readonly Entity[];
  competences: readonly Entity[];
  processBindings: readonly Entity[];
  handlingPolicies: readonly Entity[];
}>;

export type KnowledgeFactoryValidation = Readonly<{
  valid: boolean;
  issues: readonly string[];
  fingerprint: string;
  metadata: Readonly<{
    schemaVersion: 1;
    packId: string;
    domain: KnowledgeFactoryDomain;
    jurisdictionIds: readonly string[];
    territorialScopeIds: readonly string[];
    sourceIds: readonly string[];
    productionEligible: boolean;
    retrievalClass: "FEDERAL_EVIDENCE" | "SERVICE_AREA_CONTEXT";
  }>;
}>;

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u;
const SHA256 = /^[0-9a-f]{64}$/u;

const DOMAIN_BOUNDS = Object.freeze({
  jurisdictions: [1, 30],
  territorialScopes: [1, 30],
  publishers: [1, 30],
  authorities: [1, 30],
  sources: [1, 50],
  sourceVersions: [1, 100],
  passages: [1, 250],
  claims: [0, 500],
  evidenceLinks: [0, 500],
  citations: [0, 500],
  actorRules: [0, 50],
  processes: [0, 100],
  processClaimLinks: [0, 500],
  forms: [0, 100],
  fees: [0, 100],
  handlingPolicies: [0, 250],
  freshnessRecords: [0, 250],
} as const);
const SERVICE_BOUNDS = Object.freeze({
  jurisdictions: [3, 60],
  territorialScopes: [1, 20],
  publishers: [1, 20],
  authorities: [1, 20],
  sources: [1, 100],
  sourceVersions: [1, 100],
  passages: [1, 250],
  competences: [1, 50],
  processBindings: [0, 50],
  handlingPolicies: [1, 250],
} as const);

export function stableKnowledgeFactoryId(
  _packId: string,
  entityClass: string,
  key: string,
): string {
  const hash = createHash("sha256")
    .update(`knowledge-factory:${entityClass}:${key}`)
    .digest("hex");
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-8${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

export function knowledgeFactoryFingerprint(
  payload: CuratedDomainPack | CuratedServiceAreaPack,
): string {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

function text(entity: Readonly<Record<string, unknown>>, key: string): string {
  return typeof entity[key] === "string" ? entity[key] : "";
}

function references(
  issues: string[],
  items: readonly Entity[],
  field: string,
  allowed: ReadonlySet<string>,
  required = true,
): void {
  for (const item of items) {
    const value = text(item, field);
    if ((required || value) && !allowed.has(value)) issues.push(`UNKNOWN_REFERENCE:${field}:${item.key}`);
  }
}

function baseValidation(
  packId: string,
  domain: string,
  trustDomain: TrustDomain,
  groups: Readonly<Record<string, readonly Entity[]>>,
  bounds: Readonly<Record<string, readonly [number, number]>>,
): string[] {
  const issues: string[] = [];
  if (!(KNOWLEDGE_FACTORY_DOMAINS as readonly string[]).includes(domain)) {
    issues.push("UNSUPPORTED_DOMAIN");
  }
  if (!/^[a-z0-9_]{3,80}$/u.test(packId)) issues.push("INVALID_PACK_ID");
  const all = [{ className: "trustDomain", entity: trustDomain as Entity }];
  for (const [className, items] of Object.entries(groups)) {
    const [minimum, maximum] = bounds[className] ?? [0, 0];
    if (items.length < minimum || items.length > maximum) issues.push(`BOUND:${className}`);
    for (const entity of items) all.push({ className, entity });
  }
  const ids = new Set<string>();
  for (const { className, entity } of all) {
    if (!entity.key || !UUID_V4.test(entity.id)) issues.push(`INVALID_ID:${className}`);
    if (entity.id !== stableKnowledgeFactoryId(packId, className, entity.key)) {
      issues.push(`NONDETERMINISTIC_ID:${className}:${entity.key}`);
    }
    if (ids.has(entity.id)) issues.push(`DUPLICATE_ID:${entity.id}`);
    ids.add(entity.id);
  }
  return issues;
}

function handlingValidation(issues: string[], policies: readonly Entity[]): void {
  for (const policy of policies) {
    const mode = text(policy, "handlingMode");
    if (!(KNOWLEDGE_HANDLING_MODES as readonly string[]).includes(mode)) {
      issues.push(`UNSUPPORTED_HANDLING:${policy.key}`);
    }
    if (mode === "FETCH_LIVE" && text(policy, "staleBehavior") !== "REVALIDATE_BEFORE_USE") {
      issues.push(`UNSAFE_FETCH_LIVE:${policy.key}`);
    }
    if (
      mode === "DO_NOT_ANSWER_WITHOUT_CONTEXT"
      && (!Array.isArray(policy.requiredContextKeys) || policy.requiredContextKeys.length === 0)
    ) issues.push(`MISSING_CONTEXT_GATE:${policy.key}`);
  }
}

export function validateCuratedDomainPack(
  payload: CuratedDomainPack,
): KnowledgeFactoryValidation {
  const groups = {
    jurisdictions: payload.jurisdictions,
    territorialScopes: payload.territorialScopes,
    publishers: payload.publishers,
    authorities: payload.authorities,
    sources: payload.sources,
    sourceVersions: payload.sourceVersions,
    passages: payload.passages,
    claims: payload.claims,
    evidenceLinks: payload.evidenceLinks,
    citations: payload.citations,
    actorRules: payload.actorRules,
    processes: payload.processes,
    processClaimLinks: payload.processClaimLinks,
    forms: payload.forms,
    fees: payload.fees,
    handlingPolicies: payload.handlingPolicies,
    freshnessRecords: payload.freshnessRecords,
  };
  const issues = baseValidation(payload.packId, payload.domain, payload.trustDomain, groups, DOMAIN_BOUNDS);
  if (payload.schemaVersion !== 1) issues.push("UNSUPPORTED_SCHEMA_VERSION");
  if (payload.canonicalLanguage !== "de") issues.push("INVALID_CANONICAL_LANGUAGE");
  if (payload.packId !== payload.domain) issues.push("PACK_DOMAIN_MISMATCH");
  if (!payload.claims.length && !payload.processes.length) issues.push("EMPTY_SEMANTIC_PACK");

  const jurisdictions = new Set(payload.jurisdictions.map(({ id }) => id));
  const scopes = new Set(payload.territorialScopes.map(({ id }) => id));
  const publishers = new Set(payload.publishers.map(({ id }) => id));
  const authorities = new Set(payload.authorities.map(({ id }) => id));
  const sources = new Set(payload.sources.map(({ id }) => id));
  const versions = new Set(payload.sourceVersions.map(({ id }) => id));
  const passages = new Set(payload.passages.map(({ id }) => id));
  const claims = new Set(payload.claims.map(({ id }) => id));
  references(issues, payload.publishers, "territorialScopeId", scopes);
  references(issues, payload.authorities, "publisherId", publishers);
  references(issues, payload.authorities, "jurisdictionId", jurisdictions);
  references(issues, payload.authorities, "territorialScopeId", scopes);
  references(issues, payload.sources, "publisherId", publishers);
  references(issues, payload.sources, "authorityId", authorities);
  references(issues, payload.sources, "jurisdictionId", jurisdictions);
  references(issues, payload.sources, "territorialScopeId", scopes);
  references(issues, payload.sourceVersions, "sourceId", sources);
  references(issues, payload.passages, "sourceVersionId", versions);
  references(issues, payload.claims, "jurisdictionId", jurisdictions);
  references(issues, payload.evidenceLinks, "claimId", claims);
  references(issues, payload.evidenceLinks, "sourceVersionId", versions);
  references(issues, payload.evidenceLinks, "passageId", passages);
  references(issues, payload.citations, "claimId", claims);
  references(issues, payload.citations, "sourceId", sources);
  references(issues, payload.citations, "sourceVersionId", versions);
  references(issues, payload.citations, "passageId", passages);
  references(issues, payload.processes, "jurisdictionId", jurisdictions);
  const processes = new Set(payload.processes.map(({ id }) => id));
  references(issues, payload.processClaimLinks, "processId", processes);
  references(issues, payload.processClaimLinks, "claimId", claims);
  references(issues, payload.actorRules, "jurisdictionId", jurisdictions);
  references(issues, payload.forms, "authorityId", authorities);
  references(issues, payload.forms, "jurisdictionId", jurisdictions);
  references(issues, payload.forms, "sourceVersionId", versions);
  references(issues, payload.fees, "jurisdictionId", jurisdictions);
  references(issues, payload.fees, "sourceVersionId", versions);
  references(issues, payload.fees, "passageId", passages);
  references(issues, payload.handlingPolicies, "sourceId", sources);
  for (const passage of payload.passages) {
    if (!SHA256.test(text(passage, "textHash"))) issues.push(`INVALID_HASH:${passage.key}`);
  }
  for (const version of payload.sourceVersions) {
    if (!SHA256.test(text(version, "contentHash"))) issues.push(`INVALID_HASH:${version.key}`);
  }
  for (const claim of payload.claims) {
    if (!payload.evidenceLinks.some((link) => link.claimId === claim.id)) {
      issues.push(`CLAIM_WITHOUT_EVIDENCE:${claim.key}`);
    }
  }
  const semantic = new Set<string>();
  for (const claim of payload.claims) {
    const identity = [
      text(claim, "jurisdictionId"), text(claim, "territorialScopeId"),
      text(claim, "type"), text(claim, "text").trim().toLocaleLowerCase("de-DE"),
    ].join("|");
    if (semantic.has(identity)) issues.push(`SEMANTIC_COLLISION:${claim.key}`);
    semantic.add(identity);
  }
  for (const process of payload.processes) {
    if (process.processGroupId !== payload.domain) issues.push(`PROCESS_DOMAIN_MISMATCH:${process.key}`);
  }
  const processClaimSemantics = new Set<string>();
  for (const link of payload.processClaimLinks) {
    const identity = [link.processId, link.claimId, link.role].join("|");
    if (processClaimSemantics.has(identity)) {
      issues.push(`PROCESS_CLAIM_COLLISION:${link.key}`);
    }
    processClaimSemantics.add(identity);
  }
  const freshnessClasses: Readonly<Record<string, ReadonlySet<string>>> = {
    source: sources,
    source_version: versions,
    source_passage: passages,
    claim: claims,
    process: processes,
  };
  for (const freshness of payload.freshnessRecords) {
    const entityType = text(freshness, "entityType");
    const allowed = freshnessClasses[entityType];
    if (!allowed?.has(text(freshness, "entityId"))) {
      issues.push(`INVALID_FRESHNESS_REFERENCE:${freshness.key}`);
    }
  }
  handlingValidation(issues, payload.handlingPolicies);
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    fingerprint: knowledgeFactoryFingerprint(payload),
    metadata: Object.freeze({
      schemaVersion: 1,
      packId: payload.packId,
      domain: payload.domain,
      jurisdictionIds: Object.freeze([...jurisdictions]),
      territorialScopeIds: Object.freeze([...scopes]),
      sourceIds: Object.freeze([...sources]),
      productionEligible: false,
      retrievalClass: "FEDERAL_EVIDENCE" as const,
    }),
  });
}

export function validateCuratedServiceAreaPack(
  payload: CuratedServiceAreaPack,
): KnowledgeFactoryValidation {
  const groups = {
    jurisdictions: payload.jurisdictions,
    territorialScopes: payload.territorialScopes,
    publishers: payload.publishers,
    authorities: payload.authorities,
    sources: payload.sources,
    sourceVersions: payload.sourceVersions,
    passages: payload.passages,
    competences: payload.competences,
    processBindings: payload.processBindings,
    handlingPolicies: payload.handlingPolicies,
  };
  const issues = baseValidation(payload.packId, payload.domain, payload.trustDomain, groups, SERVICE_BOUNDS);
  if (payload.schemaVersion !== 1 || payload.countryCode !== "DE") issues.push("SERVICE_IDENTITY_INVALID");
  const jurisdictions = new Set(payload.jurisdictions.map(({ id }) => id));
  const municipalities = new Set(
    payload.jurisdictions.filter((item) => item.level === "de_gemeinde").map(({ id }) => id),
  );
  const municipalityCodes = new Set(
    payload.jurisdictions.filter((item) => item.level === "de_gemeinde")
      .map((item) => text(item, "code")),
  );
  if (!municipalities.size || municipalities.size > 50) issues.push("MUNICIPALITY_BOUND");
  for (const jurisdiction of payload.jurisdictions) {
    const parent = text(jurisdiction, "parentJurisdictionId");
    if (jurisdiction.level !== "de_federal" && !jurisdictions.has(parent)) {
      issues.push(`UNKNOWN_PARENT:${jurisdiction.key}`);
    }
  }
  const scopes = new Set(payload.territorialScopes.map(({ id }) => id));
  for (const scope of payload.territorialScopes) {
    const codes = Array.isArray(scope.municipalityCodes) ? scope.municipalityCodes : [];
    if (!codes.length || codes.some((code) => !municipalityCodes.has(String(code)))) {
      issues.push(`INVALID_SERVICE_SCOPE:${scope.key}`);
    }
  }
  const publishers = new Set(payload.publishers.map(({ id }) => id));
  const authorities = new Set(payload.authorities.map(({ id }) => id));
  const sources = new Set(payload.sources.map(({ id }) => id));
  const versions = new Set(payload.sourceVersions.map(({ id }) => id));
  const passages = new Set(payload.passages.map(({ id }) => id));
  references(issues, payload.publishers, "territorialScopeId", scopes);
  references(issues, payload.authorities, "publisherId", publishers);
  references(issues, payload.authorities, "jurisdictionId", jurisdictions);
  references(issues, payload.authorities, "territorialScopeId", scopes);
  references(issues, payload.sources, "publisherId", publishers);
  references(issues, payload.sources, "authorityId", authorities);
  references(issues, payload.sources, "jurisdictionId", jurisdictions);
  references(issues, payload.sources, "territorialScopeId", scopes);
  references(issues, payload.sourceVersions, "sourceId", sources);
  references(issues, payload.passages, "sourceVersionId", versions);
  references(issues, payload.competences, "authorityId", authorities);
  references(issues, payload.competences, "territorialScopeId", scopes);
  references(issues, payload.competences, "sourceVersionId", versions);
  references(issues, payload.competences, "passageId", passages);
  references(issues, payload.processBindings, "jurisdictionId", jurisdictions);
  references(issues, payload.processBindings, "territorialScopeId", scopes);
  references(issues, payload.handlingPolicies, "sourceId", sources);
  for (const competence of payload.competences) {
    const authority = payload.authorities.find(({ id }) => id === competence.authorityId);
    if (!authority || authority.territorialScopeId !== competence.territorialScopeId) {
      issues.push(`COMPETENCE_SCOPE_MISMATCH:${competence.key}`);
    }
    if (competence.domain !== payload.domain) issues.push(`COMPETENCE_DOMAIN_MISMATCH:${competence.key}`);
  }
  for (const version of payload.sourceVersions) {
    if (!SHA256.test(text(version, "contentHash"))) issues.push(`INVALID_HASH:${version.key}`);
  }
  for (const passage of payload.passages) {
    if (!SHA256.test(text(passage, "textHash"))) issues.push(`INVALID_HASH:${passage.key}`);
  }
  handlingValidation(issues, payload.handlingPolicies);
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    fingerprint: knowledgeFactoryFingerprint(payload),
    metadata: Object.freeze({
      schemaVersion: 1,
      packId: payload.packId,
      domain: payload.domain,
      jurisdictionIds: Object.freeze([...jurisdictions]),
      territorialScopeIds: Object.freeze([...scopes]),
      sourceIds: Object.freeze([...sources]),
      productionEligible: false,
      retrievalClass: "SERVICE_AREA_CONTEXT" as const,
    }),
  });
}
