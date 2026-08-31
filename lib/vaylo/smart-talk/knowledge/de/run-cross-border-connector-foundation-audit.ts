/**
 * CB-0B dedicated local audit.
 * Disposable PostgreSQL 17 only. No production connection or public runtime.
 */
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

import { Client } from "pg";

import {
  KNOWLEDGE_FACTORY_DOMAINS,
  validateCuratedDomainPack,
} from "../source-registry/knowledge-factory-contracts";
import {
  COD_2016_0397_STATUS,
  CROSS_BORDER_CONNECTED_COUNTRIES,
  CROSS_BORDER_PERSON_ROLES,
  CROSS_BORDER_SOURCE_JURISDICTIONS,
  CROSS_BORDER_TEMPORAL_CLASSES,
  CROSS_BORDER_TOPIC_FAMILIES,
  detectMissingCrossBorderFacts,
  factoryIdForStableRef,
  validateCrossBorderCaseContext,
  validateCuratedCrossBorderConnectorPack,
  validateEuJurisdictionAnchorPack,
} from "../source-registry/cross-border-connector-contracts";
import {
  buildMalformedCaseContext,
  buildSyntheticEuJurisdictionAnchorPack,
  buildValidCaseContext,
  buildValidDeSkPlannedConnectorPack,
  CB0B_EU_CLAIM_KEY,
  CB0B_GERMAN_CLAIM_KEY,
  connectorPartialPayload,
  connectorTaxTreatyContamination,
  connectorWithAmbiguousReference,
  connectorWithDuplicateReference,
  connectorWithForeignNationalRef,
  connectorWithLocaleActivation,
  connectorWithProposedClaim,
  connectorWithUnknownCorridor,
  connectorWithoutVerifiedContext,
  connectorWithWrongJurisdiction,
  connectorWithWrongTrustDomain,
  connectorMissingEuReference,
  connectorMissingGermanReference,
  germanKindergeldFixture,
} from "../source-registry/cross-border-connector-synthetic-fixtures";

const ROOT = process.cwd();
const IMAGE = "postgres:17";
const DATABASE = "cb0b_core";
const PASSWORD = `cb0b-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const CONTAINER = `moja-cb0b-${process.pid}-${randomUUID().slice(0, 8)}`;
const MIGRATIONS = [
  "supabase/migrations/032_create_minimal_knowledge_schema.sql",
  "supabase/migrations/033_add_publication_and_canonical_translation_schema.sql",
  "supabase/migrations/034_fix_publication_and_translation_rpc_identifier_ambiguity.sql",
  "supabase/migrations/035_add_official_source_registry_and_handling_mode_contract.sql",
  "supabase/migrations/037_add_curated_knowledge_pack_ingestion_rpc.sql",
  "supabase/migrations/038_add_curated_knowledge_retrieval_rpc.sql",
  "supabase/migrations/039_add_curated_locality_pack_ingestion_rpc.sql",
  "supabase/migrations/040_add_anmeldung_context_retrieval_rpc.sql",
  "supabase/migrations/041_add_generalized_curated_knowledge_ingestion.sql",
  "supabase/migrations/042_make_knowledge_factory_ingestion_coexist.sql",
  "supabase/migrations/043_add_anmeldung_retrieval_compatibility.sql",
  "supabase/migrations/044_add_arbeitslosengeld_knowledge_factory_domain.sql",
  "supabase/migrations/045_add_einkommensteuer_knowledge_factory_domain.sql",
  "supabase/migrations/046_add_wohngeld_knowledge_factory_domain.sql",
  "supabase/migrations/047_add_versicherungsvertraege_knowledge_factory_domain.sql",
  "supabase/migrations/048_add_banking_zahlungsverkehr_knowledge_factory_domain.sql",
  "supabase/migrations/049_add_verkehrsordnungswidrigkeiten_knowledge_factory_domain.sql",
  "supabase/migrations/050_add_elterngeld_knowledge_factory_domain.sql",
  "supabase/migrations/051_add_cross_border_connector_ingestion.sql",
  "supabase/migrations/052_expand_eu_jurisdiction_foundation_ingestion.sql",
  "supabase/migrations/053_add_sk_national_adapter_and_de_sk_connector_ingestion.sql",
  "supabase/migrations/054_add_eu_health_insurance_coordination_ingestion.sql",
  "supabase/migrations/055_add_de_sk_health_insurance_coordination_ingestion.sql",
];
const DOMAIN_RPC = "select public.knowledge_ingest_curated_domain_pack($1::jsonb) as result";
const EU_RPC = "select public.knowledge_ingest_curated_eu_jurisdiction_anchor($1::jsonb) as result";
const CONNECTOR_RPC = "select public.knowledge_ingest_curated_cross_border_connector_pack($1::jsonb) as result";

function run(file: string, args: string[], timeout = 180_000) {
  return spawnSync(file, args, {
    cwd: ROOT,
    encoding: "utf8",
    timeout,
    windowsHide: true,
    shell: false,
    maxBuffer: 32 * 1024 * 1024,
  });
}

function source(...segments: string[]): string {
  return readFileSync(path.join(ROOT, ...segments), "utf8");
}

function sql(text: string, timeout = 120_000) {
  return run("docker", [
    "exec", "-i", CONTAINER, "psql", "-X", "-U", "postgres", "-d", DATABASE,
    "-v", "ON_ERROR_STOP=1", "-A", "-t", "-c", text,
  ], timeout);
}

function semanticCreated(row: unknown): number {
  const result = row as { result?: { semanticCreated?: number } };
  return Number(result.result?.semanticCreated ?? -1);
}

async function rejects(
  client: Client,
  rpc: string,
  payload: unknown,
  token: string,
): Promise<boolean> {
  try {
    await client.query(rpc, [payload]);
    return false;
  } catch (error: unknown) {
    return String(error instanceof Error ? error.message : error).includes(token);
  }
}

async function main(): Promise<void> {
  const german = germanKindergeldFixture();
  const eu = buildSyntheticEuJurisdictionAnchorPack();
  const connector = buildValidDeSkPlannedConnectorPack();
  const caseContext = buildValidCaseContext();
  const missingFacts = detectMissingCrossBorderFacts(
    { persons: [], period: null },
    connector.requiredCaseRoles,
    connector.requiredCaseStates,
  );
  const migration051 = source("supabase", "migrations", "051_add_cross_border_connector_ingestion.sql");
  const migration032 = source("supabase", "migrations", "032_create_minimal_knowledge_schema.sql");
  const factoryContracts = source(
    "lib", "vaylo", "smart-talk", "knowledge", "source-registry", "knowledge-factory-contracts.ts",
  );
  const connectorContracts = source(
    "lib", "vaylo", "smart-talk", "knowledge", "source-registry", "cross-border-connector-contracts.ts",
  );

  const germanValidation = validateCuratedDomainPack(german);
  const euValidation = validateEuJurisdictionAnchorPack(eu);
  const connectorValidation = validateCuratedCrossBorderConnectorPack(connector);
  const validContext = validateCrossBorderCaseContext(caseContext);
  const malformedContext = validateCrossBorderCaseContext(buildMalformedCaseContext());

  const staticCases = {
    germanFactoryUnchanged: KNOWLEDGE_FACTORY_DOMAINS.length === 17
      && !(KNOWLEDGE_FACTORY_DOMAINS as readonly string[]).includes("eu_social_security_coordination")
      && factoryContracts.includes('"elterngeld"')
      && !factoryContracts.includes("CuratedCrossBorderConnectorPack")
      && !/process_group_id in \(/u.test(migration051),
    connectorTablesReusedFrom032: /create table if not exists public\.knowledge_cross_border_connectors/.test(migration032)
      && /create table if not exists public\.knowledge_cross_border_processes/.test(migration032)
      && !/create table if not exists public\.knowledge_cross_border_connectors/.test(migration051)
      && migration051.includes("knowledge_cross_border_connectors")
      && migration051.includes("knowledge_cross_border_processes"),
    noDuplicateSchema: !/create table if not exists public\.knowledge_/.test(migration051),
    supportedCorridorsExact: CROSS_BORDER_CONNECTED_COUNTRIES.join(",") === "SK,CZ,PL,HU"
      && validateCuratedCrossBorderConnectorPack(connectorWithUnknownCorridor())
        .issues.includes("UNKNOWN_CORRIDOR"),
    localeCannotSelectCorridor: connectorValidation.valid
      && validateCuratedCrossBorderConnectorPack(
        connectorWithLocaleActivation() as never,
      ).issues.some((issue) => issue.includes("LOCALE"))
      && !connectorContracts.includes("activationFromLocaleAllowed: true"),
    verifiedContextRequired: connector.activationRequiresVerifiedCaseContext === true
      && validateCuratedCrossBorderConnectorPack(connectorWithoutVerifiedContext())
        .issues.includes("VERIFIED_CASE_CONTEXT_REQUIRED"),
    authoringRefsAreKeys: connectorValidation.authoringUsesKeysNotDatabaseUuids
      && !("id" in connector.germanClaimRefs[0])
      && connector.germanClaimRefs[0]?.key === CB0B_GERMAN_CLAIM_KEY
      && factoryIdForStableRef(connector.germanClaimRefs[0]).includes("-4"),
    resolverExactOneDocumented: migration051.includes("CONNECTOR_REFERENCE_UNRESOLVED")
      && migration051.includes("CONNECTOR_REFERENCE_AMBIGUOUS")
      && migration051.includes("stable_knowledge_factory_id"),
    euPathNarrow: CROSS_BORDER_SOURCE_JURISDICTIONS.join(",") === "DE,EU"
      && euValidation.valid
      && eu.jurisdictions[0]?.level === "eu"
      && eu.canonicalLanguage === "de",
    foreignNationalBlockedInContract: validateCuratedCrossBorderConnectorPack(
      connectorWithForeignNationalRef(),
    ).issues.includes("FOREIGN_NATIONAL_INGEST_NOT_AUTHORIZED"),
    germanCanonicalLanguageUnchanged: german.canonicalLanguage === "de"
      && eu.canonicalLanguage === "de"
      && /claim_language text not null default 'de' check \(claim_language = 'de'\)/.test(migration032),
    caseContextSupported: validContext.valid
      && !malformedContext.valid
      && CROSS_BORDER_PERSON_ROLES.join(",") === "PARENT_A,PARENT_B,CHILD,WORKER,FAMILY_MEMBER"
      && missingFacts.includes("person:WORKER")
      && missingFacts.includes("period"),
    noIdentityGraph: !/personId|identityGraph|nationalityGraph/.test(connectorContracts)
      && !("id" in caseContext.persons[0]),
    taxSeparation: CROSS_BORDER_TOPIC_FAMILIES.includes("TAX_TREATY")
      && CROSS_BORDER_TOPIC_FAMILIES.includes("SOCIAL_SECURITY_COORDINATION")
      && validateCuratedCrossBorderConnectorPack(connectorTaxTreatyContamination())
        .issues.includes("TAX_TREATY_ENGINE_NOT_AUTHORIZED"),
    temporalSeparation: CROSS_BORDER_TEMPORAL_CLASSES.join(",")
      === "CURRENT,LEGACY,FUTURE_ENACTED,PROPOSED_NOT_CURRENT"
      && COD_2016_0397_STATUS === "PROPOSED_NOT_CURRENT"
      && validateCuratedCrossBorderConnectorPack(connectorWithProposedClaim())
        .issues.some((issue) => issue.startsWith("PROPOSED_NOT_CURRENT_FORBIDDEN")),
    missingRefsRejected: validateCuratedCrossBorderConnectorPack(connectorMissingGermanReference())
      .issues.includes("MISSING_GERMAN_REFERENCE")
      && validateCuratedCrossBorderConnectorPack(connectorMissingEuReference())
        .issues.includes("MISSING_EU_REFERENCE")
      && validateCuratedCrossBorderConnectorPack(connectorWithDuplicateReference())
        .issues.some((issue) => issue.startsWith("DUPLICATE_REFERENCE")),
    germanPackStillValid: germanValidation.valid,
    noPublicRuntime: connectorValidation.productionEligible === false,
    noProductionInteraction: true,
  };

  const docker = run("docker", ["version", "--format", "{{.Server.Version}}"], 30_000);
  if (docker.status !== 0) {
    process.stdout.write(`${JSON.stringify({
      phaseResult: "BLOCKED",
      reason: "docker unavailable",
      staticCases,
      publicRuntimeAuthorized: false,
      productionInteractionPerformed: false,
    }, null, 2)}\n`);
    process.exitCode = 1;
    return;
  }

  const created = run("docker", [
    "run", "--name", CONTAINER, "--label", "phase=knowledge-cb0b",
    "-e", `POSTGRES_PASSWORD=${PASSWORD}`, "-e", `POSTGRES_DB=${DATABASE}`,
    "-p", "127.0.0.1::5432", "-d", IMAGE,
  ]);
  let admin: Client | undefined;
  let ingestor: Client | undefined;
  const live: Record<string, boolean> = {};
  let firstCreated = -1;
  let secondCreated = -1;
  let germanCreated = -1;
  let euCreated = -1;
  try {
    if (created.status !== 0) throw new Error(created.stderr);
    let ready = false;
    for (let attempt = 0; attempt < 80; attempt += 1) {
      if (sql("select 1;").status === 0) {
        ready = true;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 350));
    }
    if (!ready) throw new Error("PostgreSQL 17 did not become ready");
    if (sql("create role anon nologin; create role authenticated nologin; create role service_role nologin;").status !== 0) {
      throw new Error("role bootstrap");
    }
    for (const file of MIGRATIONS) {
      const target = `/tmp/${path.basename(file)}`;
      if (run("docker", ["cp", path.join(ROOT, file), `${CONTAINER}:${target}`]).status !== 0) {
        throw new Error(`copy ${file}`);
      }
      const applied = run("docker", [
        "exec", CONTAINER, "psql", "-X", "-U", "postgres", "-d", DATABASE,
        "-v", "ON_ERROR_STOP=1", "-f", target,
      ], 240_000);
      if (applied.status !== 0) throw new Error(`apply ${file}: ${applied.stderr.slice(-2000)}`);
    }
    const escaped = INGESTOR_PASSWORD.replaceAll("'", "''");
    if (sql(`
      create role birello_knowledge_ingestor login password '${escaped}';
      grant connect on database ${DATABASE} to birello_knowledge_ingestor;
      grant usage on schema public to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_domain_pack(jsonb)
        to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_eu_jurisdiction_anchor(jsonb)
        to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_cross_border_connector_pack(jsonb)
        to birello_knowledge_ingestor;
    `).status !== 0) throw new Error("grants");

    const port = run("docker", ["port", CONTAINER, "5432/tcp"]).stdout.trim().split(":").at(-1);
    if (!port) throw new Error("port");
    admin = new Client({
      connectionString: `postgres://postgres:${encodeURIComponent(PASSWORD)}@127.0.0.1:${port}/${DATABASE}`,
    });
    await admin.connect();
    ingestor = new Client({
      connectionString: `postgres://birello_knowledge_ingestor:${encodeURIComponent(INGESTOR_PASSWORD)}@127.0.0.1:${port}/${DATABASE}`,
    });
    await ingestor.connect();

    let germanIngest;
    try {
      germanIngest = await ingestor.query(DOMAIN_RPC, [german]);
    } catch (error: unknown) {
      throw new Error(`GERMAN_INGEST:${error instanceof Error ? error.message : "unknown"}`);
    }
    germanCreated = semanticCreated(germanIngest.rows[0]);
    let euIngest;
    try {
      euIngest = await ingestor.query(EU_RPC, [eu]);
    } catch (error: unknown) {
      throw new Error(`EU_INGEST:${error instanceof Error ? error.message : "unknown"}`);
    }
    euCreated = semanticCreated(euIngest.rows[0]);
    let first;
    try {
      first = await ingestor.query(CONNECTOR_RPC, [connector]);
    } catch (error: unknown) {
      throw new Error(`CONNECTOR_INGEST:${error instanceof Error ? error.message : "unknown"}`);
    }
    firstCreated = semanticCreated(first.rows[0]);
    const firstRow = first.rows[0] as {
      result?: {
        resolvedGermanClaimIds?: string[];
        resolvedEuClaimIds?: string[];
        status?: string;
        connectedCountry?: string;
      };
    };
    const second = await ingestor.query(CONNECTOR_RPC, [connector]);
    secondCreated = semanticCreated(second.rows[0]);

    const factoryClaimId = factoryIdForStableRef(connector.germanClaimRefs[0]!);
    const stored = await admin.query(
      `select c.id::text as id, c.connected_country, c.status, c.activation_from_locale_allowed,
              p.german_claim_ids::text[] as german_ids, p.eu_coordination_claim_ids::text[] as eu_ids,
              p.foreign_claim_ids::text[] as foreign_ids
         from public.knowledge_cross_border_connectors c
         join public.knowledge_cross_border_processes p on p.cross_border_connector_id = c.id`,
    );
    const connectorCount = await admin.query(
      "select count(*)::int n from public.knowledge_cross_border_connectors",
    );
    const processCount = await admin.query(
      "select count(*)::int n from public.knowledge_cross_border_processes",
    );
    const euJurisdiction = await admin.query(
      "select count(*)::int n from public.knowledge_jurisdictions where jurisdiction_level='eu' and country_code='EU'",
    );
    const activeCorridors = await admin.query(
      "select count(*)::int n from public.knowledge_cross_border_connectors where status='active'",
    );
    const grants = await admin.query(
      `select count(*)::int n from information_schema.role_routine_grants
        where routine_name in (
          'knowledge_ingest_curated_cross_border_connector_pack',
          'knowledge_ingest_curated_eu_jurisdiction_anchor'
        ) and grantee in ('PUBLIC','anon','authenticated','service_role')`,
    );

    const skDomain = {
      ...german,
      jurisdictions: [{ ...german.jurisdictions[0]!, countryCode: "SK" }],
    };
    const skEu = {
      ...eu,
      jurisdictions: [{ ...eu.jurisdictions[0]!, countryCode: "SK", code: "SK" as const }],
    };

    live.germanRegression = germanCreated > 0 && germanValidation.valid;
    live.euJurisdictionSupported = euCreated > 0 && Number(euJurisdiction.rows[0]?.n) === 1;
    live.firstCreatedPositive = firstCreated > 0;
    live.secondIngestionIdempotent = secondCreated === 0;
    live.noDuplicateConnectorRows = Number(connectorCount.rows[0]?.n) === 1
      && Number(processCount.rows[0]?.n) === 1;
    live.resolvedUuidMatchesFactoryKey = firstRow.result?.resolvedGermanClaimIds?.[0] === factoryClaimId
      && stored.rows[0]?.german_ids?.[0] === factoryClaimId;
    live.euUuidStored = firstRow.result?.resolvedEuClaimIds?.[0]
      === factoryIdForStableRef({ entityClass: "claims", key: CB0B_EU_CLAIM_KEY });
    live.statusPlanned = firstRow.result?.status === "planned"
      && stored.rows[0]?.status === "planned"
      && stored.rows[0]?.connected_country === "SK"
      && Number(activeCorridors.rows[0]?.n) === 0;
    live.localeActivationRejected = stored.rows[0]?.activation_from_locale_allowed === false
      && await rejects(ingestor, CONNECTOR_RPC, connectorWithLocaleActivation(), "CONNECTOR_LOCALE_ACTIVATION_FORBIDDEN");
    live.unknownCorridorRejected = await rejects(
      ingestor, CONNECTOR_RPC, connectorWithUnknownCorridor(), "CONNECTOR_UNKNOWN_CORRIDOR",
    );
    live.missingGermanRejected = await rejects(
      ingestor, CONNECTOR_RPC, connectorMissingGermanReference(), "CONNECTOR_MISSING_GERMAN_REFERENCE",
    );
    live.missingEuRejected = await rejects(
      ingestor, CONNECTOR_RPC, connectorMissingEuReference(), "CONNECTOR_MISSING_EU_REFERENCE",
    );
    live.ambiguousRejected = await rejects(
      ingestor, CONNECTOR_RPC, connectorWithAmbiguousReference(), "CONNECTOR_REFERENCE_AMBIGUOUS",
    );
    live.wrongJurisdictionRejected = await rejects(
      ingestor, CONNECTOR_RPC, connectorWithWrongJurisdiction(), "CONNECTOR_WRONG_JURISDICTION",
    );
    live.wrongTrustRejected = await rejects(
      ingestor, CONNECTOR_RPC, connectorWithWrongTrustDomain(), "CONNECTOR_WRONG_TRUST_DOMAIN",
    );
    live.proposedRejected = await rejects(
      ingestor, CONNECTOR_RPC, connectorWithProposedClaim(), "CONNECTOR_PROPOSED_NOT_CURRENT",
    );
    live.foreignNationalRejected = await rejects(
      ingestor, CONNECTOR_RPC, connectorWithForeignNationalRef(),
      "CONNECTOR_FOREIGN_NATIONAL_INGEST_NOT_AUTHORIZED",
    )
      && await rejects(ingestor, DOMAIN_RPC, skDomain, "CURATED_DOMAIN")
      && await rejects(ingestor, EU_RPC, skEu, "EU_ANCHOR_FOREIGN_NATIONAL_FORBIDDEN");
    live.partialPayloadRejected = await rejects(
      ingestor, CONNECTOR_RPC, connectorPartialPayload(), "CONNECTOR_PARTIAL_PAYLOAD",
    );
    live.verifiedContextEnforced = await rejects(
      ingestor, CONNECTOR_RPC, connectorWithoutVerifiedContext(),
      "CONNECTOR_VERIFIED_CONTEXT_REQUIRED",
    );
    live.noForeignClaimsStored = Array.isArray(stored.rows[0]?.foreign_ids)
      && stored.rows[0].foreign_ids.length === 0;
    live.noPublicGrants = Number(grants.rows[0]?.n) === 0;
  } finally {
    await ingestor?.end().catch(() => undefined);
    await admin?.end().catch(() => undefined);
    run("docker", ["rm", "-f", CONTAINER], 30_000);
  }

  const allPassed = Object.values(staticCases).every(Boolean) && Object.values(live).every(Boolean);
  process.stdout.write(`${JSON.stringify({
    phaseResult: allPassed ? "PASS" : "FAILED",
    staticCases,
    live,
    firstCreated,
    secondCreated,
    germanCreated,
    euCreated,
    corridors: CROSS_BORDER_CONNECTED_COUNTRIES,
    temporal: {
      classes: CROSS_BORDER_TEMPORAL_CLASSES,
      cod20160397: COD_2016_0397_STATUS,
    },
    publicRuntimeAuthorized: false,
    productionInteractionPerformed: false,
    substantiveEuRegulationClaimsIngested: 0,
    substantiveForeignNationalClaimsIngested: 0,
  }, null, 2)}\n`);
  if (!allPassed) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : "CB-0B audit failed"}\n`);
  process.exitCode = 1;
});
