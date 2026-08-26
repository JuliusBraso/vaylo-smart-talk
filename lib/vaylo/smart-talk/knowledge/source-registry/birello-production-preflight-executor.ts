import "server-only";

import { Client, type ClientConfig } from "pg";

import {
  FIRST_PACK_CANONICAL_UNIT_IDS,
  V2A_ADDED_CANONICAL_UNIT_IDS,
} from "../packs/de/anmeldung-ummeldung-abmeldung/pack";
import { stablePackEntityId } from "../packs/de/anmeldung-ummeldung-abmeldung/identity";
import { WEILTINGEN_PILOT } from "../packs/de/anmeldung-ummeldung-abmeldung/bayern-weiltingen-locality-pilot";

export const IMPLEMENTED_BIRELLO_REMOTE_PREFLIGHT_EXECUTOR = true as const;
export const BIRELLO_PREFLIGHT_ROLE = "birello_preflight_reader" as const;
export const BIRELLO_PREFLIGHT_QUERY_ORDER = Object.freeze([
  "session", "migrations", "columns", "enums", "functions",
  "roles", "privileges", "firstPack", "duplicates", "weiltingen",
  "catalogFit", "semanticRoots", "sourceUniqueness",
  "retrievalMetadata", "trustDomains",
] as const);
export type BirelloPreflightQueryId = typeof BIRELLO_PREFLIGHT_QUERY_ORDER[number];
export const BIRELLO_PREFLIGHT_REQUIRED_TABLES = Object.freeze([
  "knowledge_claims",
  "knowledge_jurisdictions",
  "knowledge_territorial_scopes",
  "knowledge_authorities",
  "knowledge_authority_competences",
  "knowledge_sources",
] as const);
export type BirelloPreflightRequiredTable =
  typeof BIRELLO_PREFLIGHT_REQUIRED_TABLES[number];
export type BirelloPreflightRequiredTablePrivileges =
  Readonly<Record<BirelloPreflightRequiredTable, boolean>>;
export const BIRELLO_PREFLIGHT_ENV = Object.freeze({
  enabled: "BIRELLO_PRODUCTION_PREFLIGHT_ENABLED",
  target: "BIRELLO_PRODUCTION_PREFLIGHT_TARGET",
  databaseUrl: "BIRELLO_PRODUCTION_PREFLIGHT_DATABASE_URL",
  databaseName: "BIRELLO_PRODUCTION_PREFLIGHT_DATABASE_NAME",
  expectedHost: "BIRELLO_PRODUCTION_PREFLIGHT_EXPECTED_HOST",
  projectRef: "BIRELLO_PRODUCTION_PREFLIGHT_PROJECT_REF",
  forbiddenPublicUrl: "NEXT_PUBLIC_BIRELLO_PRODUCTION_PREFLIGHT_DATABASE_URL",
} as const);

export type BirelloPreflightConfiguration = Readonly<{
  target: "production" | "local-disposable-proof";
  connectionString: string;
  host: string;
  port: number;
  database: string;
  user: typeof BIRELLO_PREFLIGHT_ROLE;
  verifiedTls: boolean;
  caMechanism: "NODE_EXTRA_CA_CERTS" | "SYSTEM_TRUST_STORE" | "LOCAL_TEST_ONLY";
}>;

export type BirelloPreflightClient = Readonly<{
  connect(): Promise<void>;
  query(sql: string): Promise<Readonly<{ rows: readonly Record<string, unknown>[] }>>;
  end(): Promise<void>;
}>;

export type BirelloPreflightClientFactory =
  (configuration: BirelloPreflightConfiguration) => BirelloPreflightClient;

export type BirelloPreflightReport =
  | Readonly<{
      result: "CONFIGURATION_REQUIRED";
      missing: readonly string[];
      connectionAttempted: false;
      secretsPrinted: false;
    }>
  | Readonly<{
      result: "REJECTED";
      failureCode:
        | "CONFIGURATION_INVALID"
        | "TARGET_IDENTITY_MISMATCH"
        | "SESSION_IDENTITY_MISMATCH"
        | "READ_ONLY_MISMATCH"
        | "QUERY_CONTRACT_MISMATCH"
        | "DNS_FAILED"
        | "CONNECTION_REFUSED"
        | "CONNECTION_TIMEOUT"
        | "TLS_FAILED"
        | "AUTHENTICATION_FAILED"
        | "ROLE_LOGIN_REJECTED"
        | "DATABASE_NOT_FOUND"
        | "POOLER_REJECTED"
        | "READ_ONLY_SETUP_FAILED"
        | "QUERY_EXECUTION_FAILED"
        | "EXECUTION_FAILED_UNKNOWN";
      failureStage: "configuration" | "connect" | "read_only_setup" | "identity" | "query";
      sqlState: string | null;
      driverCode: string | null;
      failedQueryId: BirelloPreflightQueryId | null;
      completedQueryIds: readonly BirelloPreflightQueryId[];
      preflightPublicSchemaUsage: boolean | null;
      preflightRequiredTablePrivileges: BirelloPreflightRequiredTablePrivileges | null;
      preflightRequiredRlsPolicies: BirelloPreflightRequiredTablePrivileges | null;
      connectionAttempted: boolean;
      secretsPrinted: false;
    }>
  | Readonly<{
      result: "PASS";
      connectionAttempted: true;
      target: Readonly<{
        host: string;
        port: number;
        database: string;
        role: typeof BIRELLO_PREFLIGHT_ROLE;
        verifiedTls: boolean;
        caMechanism: BirelloPreflightConfiguration["caMechanism"];
        transactionReadOnly: true;
      }>;
      migrationLedger: readonly string[];
      catalog039: Readonly<{
        requiredTablesPresent: boolean;
        requiredColumnsPresent: boolean;
        requiredEnumValuesPresent: boolean;
      }>;
      functions: readonly Readonly<{
        name: string;
        arguments: string;
        resultType: string;
        owner: string;
        securityDefiner: boolean;
        fixedSearchPath: boolean;
        executeIngestor: boolean;
        executeReader: boolean;
        executePreflight: boolean;
      }>[];
      roles: readonly Readonly<{
        role: string;
        login: boolean;
        superuser: boolean;
        createDb: boolean;
        createRole: boolean;
        bypassRls: boolean;
      }>[];
      privileges: readonly Readonly<{
        role: string;
        schemaCreate: boolean;
        directKnowledgeDml: boolean;
        executableFunctions: readonly string[];
      }>[];
      firstPack: Readonly<{
        expectedIds: readonly string[];
        observedIds: readonly string[];
        missingIds: readonly string[];
        sourceOnlyV2AIdsPresent: readonly string[];
        duplicateSemanticCount: number;
      }>;
      weiltingen: Readonly<{
        municipality: number;
        scope: number;
        authority: number;
        competence: number;
        sources: number;
      }>;
      catalogFit: Readonly<{
        retrievalMetadataTable: boolean;
        retrievalMetadataColumnsPresent: boolean;
        retrievalMetadataUnique: boolean;
        retrievalMetadataSelect: boolean;
        trustDomainTable: boolean;
        trustDomainCodeUnique: boolean;
        trustDomainSelect: boolean;
        sourceNormalizedUrlUniqueIndex: boolean;
        scopeTypeUnconstrained: boolean;
      }>;
      retrievalMetadata: Readonly<{
        selectVisible: boolean;
        federalClaimCount: number;
        metadataCount: number | null;
        missingMetadata: number | null;
        duplicateMetadata: number | null;
      }>;
      trustDomain: Readonly<{
        selectVisible: boolean;
        semanticDeCount: number | null;
        duplicateCodeCount: number | null;
      }>;
      deJurisdiction: Readonly<{
        semanticDeCount: number;
        duplicateCount: number;
        parentRootValid: boolean;
      }>;
      deByWeiltingen: Readonly<{
        landCount: number;
        kreisCount: number;
        municipalityCount: number;
        parentChainValid: boolean;
        municipalityScopeValid: boolean;
        competenceFamilyValid: boolean;
      }>;
      sourceUniqueness: Readonly<{
        uniqueIndexPresent: boolean;
        sourceCount: number;
        duplicateNormalizedUrlCount: number;
      }>;
      grantFit: Readonly<{
        migration042GrantFit: boolean;
        migration043GrantFit: boolean;
        ingestorHasG3: boolean;
        ingestorHasG4: boolean;
        readerHas038: boolean;
        readerHas040: boolean;
        preflightHasMutationExecute: boolean;
      }>;
      fit: Readonly<{
        missingSelect: readonly string[];
        migration042Ready: boolean;
        migration043Ready: boolean;
        ledger042: "APPLIED" | "PENDING" | "UNEXPECTED";
        ledger043: "APPLIED" | "PENDING" | "UNEXPECTED";
      }>;
      fixedQueryCount: number;
      preflightPublicSchemaUsage: boolean;
      preflightRequiredTablePrivileges: BirelloPreflightRequiredTablePrivileges;
      preflightRequiredRlsPolicies: BirelloPreflightRequiredTablePrivileges;
      secretsPrinted: false;
    }>;

const REQUIRED_TABLE_COLUMNS = Object.freeze({
  knowledge_trust_domains: ["id", "code", "name"],
  knowledge_jurisdictions: [
    "id", "parent_jurisdiction_id", "jurisdiction_level", "jurisdiction_code",
    "country_code", "name",
  ],
  knowledge_territorial_scopes: [
    "id", "scope_type", "jurisdiction_ids", "municipality_codes",
  ],
  knowledge_publishers: ["id", "trust_domain_id", "territorial_competence_id", "publisher_name"],
  knowledge_authorities: [
    "id", "publisher_id", "authority_name", "authority_type", "jurisdiction_id",
    "territorial_scope_id", "official_portal_url",
  ],
  knowledge_authority_competences: [
    "id", "authority_id", "territorial_scope_id", "subject_matter", "personal_scope",
    "effective_from", "effective_until", "competence_source_version_id", "competence_passage_id",
  ],
  knowledge_sources: [
    "id", "publisher_id", "canonical_url", "official_domain", "normalized_origin",
    "normalized_canonical_url", "jurisdiction_id", "territorial_scope_id",
    "issuing_authority_id", "source_class", "authority_level", "default_handling_mode",
  ],
  knowledge_source_versions: ["id", "source_id", "content_hash"],
  knowledge_source_passages: ["id", "source_version_id", "section_identifier", "text"],
  knowledge_processes: ["id", "title", "jurisdiction_id", "territorial_scope_id"],
  knowledge_source_handling_policies: [
    "id", "source_id", "information_class", "process_scope", "handling_mode",
    "freshness_class", "stale_behavior",
  ],
  knowledge_retrieval_metadata: [
    "id", "entity_type", "entity_id", "full_text_indexed", "vector_indexed",
    "jurisdiction_filter_required", "effective_date_filter_required",
    "review_status_filter_required", "trust_domain_filter_required",
    "authoritative_by_vector_similarity", "source_authorization_filter_required",
    "handling_policy_filter_required", "stale_policy_filter_required",
  ],
} as const);

const REQUIRED_ENUM_VALUES = Object.freeze({
  knowledge_source_class: ["AUTHORITY_PORTAL"],
  knowledge_authority_level: ["MUNICIPALITY"],
  knowledge_handling_mode: ["CACHE_AND_REVALIDATE", "FETCH_LIVE"],
  knowledge_freshness_class: ["EVENT_DRIVEN", "MONTHLY", "DAILY"],
  knowledge_stale_behavior: ["REVALIDATE_BEFORE_USE"],
  knowledge_information_class: [
    "AUTHORITY_COMPETENCE", "CONTACT_DETAILS", "LOCAL_PROCESS_VARIANT",
    "ONLINE_SERVICE_URL", "FORM_URL", "OPENING_HOURS",
  ],
} as const);

const FIRST_PACK_CLAIM_IDS = FIRST_PACK_CANONICAL_UNIT_IDS.map((id) =>
  stablePackEntityId(`claim:${id}`));
const SOURCE_ONLY_CLAIM_IDS = V2A_ADDED_CANONICAL_UNIT_IDS.map((id) =>
  stablePackEntityId(`claim:${id}`));
const PILOT_IDS = Object.freeze({
  municipality: stablePackEntityId("v2c-weiltingen:locality"),
  scope: stablePackEntityId("v2c-weiltingen:scope"),
  authority: stablePackEntityId("v2c-weiltingen:authority"),
  competence: stablePackEntityId("v2c-weiltingen:competence"),
  sources: [
    "anmeldung", "hours", "appointments",
  ].map((key) => stablePackEntityId(`v2c-weiltingen:source:${key}`)),
});

function sqlUuidArray(values: readonly string[]): string {
  return `array[${values.map((value) => `'${value}'::uuid`).join(",")}]`;
}

export const BIRELLO_PREFLIGHT_FIXED_QUERIES = Object.freeze({
  session: `select current_database() as database, current_user as role,
    current_setting('transaction_read_only') as transaction_read_only`,
  migrations: `select version::text as version
    from supabase_migrations.schema_migrations order by version::text`,
  columns: `select c.relname as table_name,a.attname as column_name
    from pg_catalog.pg_class c
    join pg_catalog.pg_namespace n on n.oid=c.relnamespace
    join pg_catalog.pg_attribute a on a.attrelid=c.oid
    where n.nspname='public' and a.attnum>0 and not a.attisdropped
      and c.relname = any(array[${Object.keys(REQUIRED_TABLE_COLUMNS)
        .map((name) => `'${name}'`).join(",")}])
    order by c.relname,a.attnum`,
  enums: `select t.typname as enum_name, e.enumlabel as enum_value
    from pg_catalog.pg_type t
    join pg_catalog.pg_namespace n on n.oid=t.typnamespace
    join pg_catalog.pg_enum e on e.enumtypid=t.oid
    where n.nspname='public'
      and t.typname = any(array[${Object.keys(REQUIRED_ENUM_VALUES)
        .map((name) => `'${name}'`).join(",")}])
    order by t.typname,e.enumsortorder`,
  functions: `select p.proname as name,
      pg_catalog.pg_get_function_identity_arguments(p.oid) as arguments,
      pg_catalog.pg_get_function_result(p.oid) as result_type,
      pg_catalog.pg_get_userbyid(p.proowner) as owner,
      p.prosecdef as security_definer, coalesce(p.proconfig,'{}'::text[]) as config,
      pg_catalog.has_function_privilege(
        'birello_knowledge_ingestor', p.oid, 'EXECUTE') as execute_ingestor,
      pg_catalog.has_function_privilege(
        'birello_knowledge_reader', p.oid, 'EXECUTE') as execute_reader,
      pg_catalog.has_function_privilege(
        'birello_preflight_reader', p.oid, 'EXECUTE') as execute_preflight
    from pg_catalog.pg_proc p join pg_catalog.pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public' and p.proname = any(array[
      'knowledge_retrieve_evidence_packets',
      'knowledge_ingest_curated_pack',
      'knowledge_ingest_curated_locality_pack',
      'knowledge_retrieve_anmeldung_context',
      'knowledge_ingest_curated_domain_pack',
      'knowledge_ingest_curated_service_area_pack'
    ]) order by p.proname`,
  roles: `select rolname as role,rolcanlogin as login,rolsuper as superuser,
      rolcreatedb as create_db,rolcreaterole as create_role,rolbypassrls as bypass_rls
    from pg_catalog.pg_roles where rolname = any(array[
      'birello_preflight_reader','birello_knowledge_ingestor','birello_knowledge_reader'
    ]) order by rolname`,
  privileges: `select r.rolname as role,
      pg_catalog.has_schema_privilege(r.rolname,'public','CREATE') as schema_create,
      pg_catalog.has_schema_privilege(r.rolname,'public','USAGE') as preflight_public_schema_usage,
      exists(select 1 from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid=c.relnamespace
        where n.nspname='public' and c.relname like 'knowledge\\_%' escape '\\'
          and c.relkind in ('r','p','v','m','f')
          and (pg_catalog.has_table_privilege(r.rolname,c.oid,'INSERT')
            or pg_catalog.has_table_privilege(r.rolname,c.oid,'UPDATE')
            or pg_catalog.has_table_privilege(r.rolname,c.oid,'DELETE')
            or pg_catalog.has_table_privilege(r.rolname,c.oid,'TRUNCATE'))) as direct_dml,
      coalesce((select jsonb_agg(p.proname order by p.proname)
        from pg_catalog.pg_proc p join pg_catalog.pg_namespace n on n.oid=p.pronamespace
        where n.nspname='public' and p.proname like 'knowledge\\_%' escape '\\'
          and pg_catalog.has_function_privilege(r.rolname,p.oid,'EXECUTE')),'[]'::jsonb) as executable
      ,jsonb_build_object(
        'knowledge_claims',pg_catalog.has_table_privilege(r.rolname,'public.knowledge_claims','SELECT'),
        'knowledge_jurisdictions',pg_catalog.has_table_privilege(r.rolname,'public.knowledge_jurisdictions','SELECT'),
        'knowledge_territorial_scopes',pg_catalog.has_table_privilege(r.rolname,'public.knowledge_territorial_scopes','SELECT'),
        'knowledge_authorities',pg_catalog.has_table_privilege(r.rolname,'public.knowledge_authorities','SELECT'),
        'knowledge_authority_competences',pg_catalog.has_table_privilege(r.rolname,'public.knowledge_authority_competences','SELECT'),
        'knowledge_sources',pg_catalog.has_table_privilege(r.rolname,'public.knowledge_sources','SELECT')
      ) as preflight_required_table_privileges
      ,jsonb_build_object(
        'knowledge_claims',exists(select 1 from pg_catalog.pg_policies x where x.schemaname='public' and x.tablename='knowledge_claims' and x.policyname='birello_preflight_reader_select' and x.roles @> array['birello_preflight_reader'::name] and x.cmd in ('SELECT','ALL') and x.qual='true'),
        'knowledge_jurisdictions',exists(select 1 from pg_catalog.pg_policies x where x.schemaname='public' and x.tablename='knowledge_jurisdictions' and x.policyname='birello_preflight_reader_select' and x.roles @> array['birello_preflight_reader'::name] and x.cmd in ('SELECT','ALL') and x.qual='true'),
        'knowledge_territorial_scopes',exists(select 1 from pg_catalog.pg_policies x where x.schemaname='public' and x.tablename='knowledge_territorial_scopes' and x.policyname='birello_preflight_reader_select' and x.roles @> array['birello_preflight_reader'::name] and x.cmd in ('SELECT','ALL') and x.qual='true'),
        'knowledge_authorities',exists(select 1 from pg_catalog.pg_policies x where x.schemaname='public' and x.tablename='knowledge_authorities' and x.policyname='birello_preflight_reader_select' and x.roles @> array['birello_preflight_reader'::name] and x.cmd in ('SELECT','ALL') and x.qual='true'),
        'knowledge_authority_competences',exists(select 1 from pg_catalog.pg_policies x where x.schemaname='public' and x.tablename='knowledge_authority_competences' and x.policyname='birello_preflight_reader_select' and x.roles @> array['birello_preflight_reader'::name] and x.cmd in ('SELECT','ALL') and x.qual='true'),
        'knowledge_sources',exists(select 1 from pg_catalog.pg_policies x where x.schemaname='public' and x.tablename='knowledge_sources' and x.policyname='birello_preflight_reader_select' and x.roles @> array['birello_preflight_reader'::name] and x.cmd in ('SELECT','ALL') and x.qual='true')
      ) as preflight_required_rls_policies
    from pg_catalog.pg_roles r where r.rolname = any(array[
      'birello_preflight_reader','birello_knowledge_ingestor','birello_knowledge_reader'
    ]) order by r.rolname`,
  firstPack: `select id::text as id, claim_text_canonical
    from public.knowledge_claims
    where id = any(${sqlUuidArray([...FIRST_PACK_CLAIM_IDS, ...SOURCE_ONLY_CLAIM_IDS])})
    order by id`,
  duplicates: `select count(*)::int as count from (
      select claim_text_canonical from public.knowledge_claims
      group by claim_text_canonical having count(*) > 1
    ) duplicate_claims`,
  weiltingen: `select
      (select count(*)::int from public.knowledge_jurisdictions
        where id='${PILOT_IDS.municipality}'::uuid and jurisdiction_code='${WEILTINGEN_PILOT.municipalityCode}') as municipality,
      (select count(*)::int from public.knowledge_territorial_scopes
        where id='${PILOT_IDS.scope}'::uuid) as scope,
      (select count(*)::int from public.knowledge_authorities
        where id='${PILOT_IDS.authority}'::uuid) as authority,
      (select count(*)::int from public.knowledge_authority_competences
        where id='${PILOT_IDS.competence}'::uuid) as competence,
      (select count(*)::int from public.knowledge_sources
        where id = any(${sqlUuidArray(PILOT_IDS.sources)})) as sources`,
  catalogFit: `select
      exists(select 1 from pg_catalog.pg_class c
        join pg_catalog.pg_namespace n on n.oid=c.relnamespace
        where n.nspname='public' and c.relname='knowledge_retrieval_metadata'
          and c.relkind='r') as retrieval_metadata_table,
      (select count(*)::int from pg_catalog.pg_class c
        join pg_catalog.pg_namespace n on n.oid=c.relnamespace
        join pg_catalog.pg_attribute a on a.attrelid=c.oid
        where n.nspname='public' and c.relname='knowledge_retrieval_metadata'
          and a.attnum>0 and not a.attisdropped
          and a.attname = any(array[
            'id','entity_type','entity_id','full_text_indexed','vector_indexed',
            'jurisdiction_filter_required','effective_date_filter_required',
            'review_status_filter_required','trust_domain_filter_required',
            'authoritative_by_vector_similarity',
            'source_authorization_filter_required',
            'handling_policy_filter_required','stale_policy_filter_required'
          ])) = 13 as retrieval_metadata_columns_present,
      exists(select 1 from pg_catalog.pg_constraint x
        join pg_catalog.pg_class c on c.oid=x.conrelid
        join pg_catalog.pg_namespace n on n.oid=c.relnamespace
        where n.nspname='public' and c.relname='knowledge_retrieval_metadata'
          and x.contype='u'
          and pg_catalog.pg_get_constraintdef(x.oid)
            like '%(entity_type, entity_id)%') as retrieval_metadata_unique,
      pg_catalog.has_table_privilege(
        'birello_preflight_reader','public.knowledge_retrieval_metadata','SELECT')
        as retrieval_metadata_select,
      exists(select 1 from pg_catalog.pg_class c
        join pg_catalog.pg_namespace n on n.oid=c.relnamespace
        where n.nspname='public' and c.relname='knowledge_trust_domains'
          and c.relkind='r') as trust_domain_table,
      exists(select 1 from pg_catalog.pg_constraint x
        join pg_catalog.pg_class c on c.oid=x.conrelid
        join pg_catalog.pg_namespace n on n.oid=c.relnamespace
        where n.nspname='public' and c.relname='knowledge_trust_domains'
          and x.contype='u'
          and pg_catalog.pg_get_constraintdef(x.oid) like '%(code)%')
        as trust_domain_code_unique,
      pg_catalog.has_table_privilege(
        'birello_preflight_reader','public.knowledge_trust_domains','SELECT')
        as trust_domain_select,
      exists(select 1 from pg_catalog.pg_indexes
        where schemaname='public' and tablename='knowledge_sources'
          and indexname='ux_sources_normalized_canonical_url')
        as source_normalized_url_unique_index,
      not exists(select 1 from pg_catalog.pg_constraint x
        join pg_catalog.pg_class c on c.oid=x.conrelid
        join pg_catalog.pg_namespace n on n.oid=c.relnamespace
        where n.nspname='public' and c.relname='knowledge_territorial_scopes'
          and x.contype='c'
          and pg_catalog.pg_get_constraintdef(x.oid) ilike '%scope_type%')
        as scope_type_unconstrained`,
  semanticRoots: `with federal as (
      select id from public.knowledge_jurisdictions
       where country_code='DE' and jurisdiction_level='de_federal'
         and jurisdiction_code='DE' and parent_jurisdiction_id is null
         and status='active'
    ), land as (
      select id, parent_jurisdiction_id from public.knowledge_jurisdictions
       where country_code='DE' and jurisdiction_level='de_land'
         and jurisdiction_code in ('09','DE-BY') and status='active'
    ), kreis as (
      select id, parent_jurisdiction_id from public.knowledge_jurisdictions
       where country_code='DE' and jurisdiction_level='de_kreis'
         and jurisdiction_code='09571' and status='active'
    ), municipality as (
      select id, parent_jurisdiction_id from public.knowledge_jurisdictions
       where id='${PILOT_IDS.municipality}'::uuid
         and jurisdiction_code='${WEILTINGEN_PILOT.municipalityCode}'
         and jurisdiction_level='de_gemeinde' and status='active'
    )
    select
      (select count(*)::int from federal) as federal_de_count,
      greatest((select count(*)::int from public.knowledge_jurisdictions
        where country_code='DE' and jurisdiction_level='de_federal'
          and jurisdiction_code='DE' and parent_jurisdiction_id is null) - 1, 0)
        as federal_de_duplicate_count,
      (select count(*)::int from land) as land_by_count,
      (select count(*)::int from kreis) as kreis_count,
      (select count(*)::int from municipality) as municipality_count,
      exists (
        select 1 from municipality m
        join kreis k on k.id = m.parent_jurisdiction_id
        join land l on l.id = k.parent_jurisdiction_id
        join federal f on f.id = l.parent_jurisdiction_id
      ) as parent_chain_valid,
      exists (
        select 1 from public.knowledge_territorial_scopes ts
         where ts.id='${PILOT_IDS.scope}'::uuid
           and ts.scope_type='municipality'
           and ts.municipality_codes = array['${WEILTINGEN_PILOT.municipalityCode}']
      ) as municipality_scope_valid,
      exists (
        select 1 from public.knowledge_authority_competences c
         where c.id='${PILOT_IDS.competence}'::uuid
           and c.personal_scope='residence_registration_lifecycle'
           and c.subject_matter='residence_registration_lifecycle'
      ) as competence_family_valid`,
  sourceUniqueness: `select
      exists(select 1 from pg_catalog.pg_indexes
        where schemaname='public' and tablename='knowledge_sources'
          and indexname='ux_sources_normalized_canonical_url') as unique_index_present,
      (select count(*)::int from public.knowledge_sources) as source_count,
      (select count(*)::int from (
        select normalized_canonical_url from public.knowledge_sources
         where normalized_canonical_url is not null
         group by 1 having count(*)>1
      ) duplicates) as duplicate_normalized_url_count`,
  retrievalMetadata: `select
      (select count(*)::int from public.knowledge_claims
        where id = any(${sqlUuidArray([...FIRST_PACK_CLAIM_IDS, ...SOURCE_ONLY_CLAIM_IDS])}))
        as federal_claim_count,
      (select count(*)::int from public.knowledge_retrieval_metadata r
        where r.entity_type='claim'
          and r.entity_id = any(${sqlUuidArray([...FIRST_PACK_CLAIM_IDS, ...SOURCE_ONLY_CLAIM_IDS])}))
        as metadata_count,
      (select count(*)::int from unnest(${sqlUuidArray([...FIRST_PACK_CLAIM_IDS, ...SOURCE_ONLY_CLAIM_IDS])}) claim(id)
        where not exists (
          select 1 from public.knowledge_retrieval_metadata r
           where r.entity_type='claim' and r.entity_id=claim.id
        )) as missing_metadata,
      (select count(*)::int from (
        select r.entity_id from public.knowledge_retrieval_metadata r
         where r.entity_type='claim'
           and r.entity_id = any(${sqlUuidArray([...FIRST_PACK_CLAIM_IDS, ...SOURCE_ONLY_CLAIM_IDS])})
         group by r.entity_id having count(*)>1
      ) duplicates) as duplicate_metadata`,
  trustDomains: `select
      (select count(*)::int from public.knowledge_trust_domains where code='de')
        as semantic_de_count,
      (select count(*)::int from (
        select code from public.knowledge_trust_domains group by code having count(*)>1
      ) duplicates) as duplicate_code_count`,
} as const);

function productionClientFactory(configuration: BirelloPreflightConfiguration): BirelloPreflightClient {
  const clientConfig: ClientConfig = {
    connectionString: configuration.connectionString,
    ssl: configuration.verifiedTls ? { rejectUnauthorized: true } : undefined,
    application_name: "birello_production_activation_preflight",
  };
  const client = new Client(clientConfig);
  return {
    connect: async () => { await client.connect(); },
    query: async (sql) => ({ rows: (await client.query(sql)).rows }),
    end: () => client.end(),
  };
}

function requiredEnvironmentNames(): readonly string[] {
  return [
    BIRELLO_PREFLIGHT_ENV.enabled,
    BIRELLO_PREFLIGHT_ENV.target,
    BIRELLO_PREFLIGHT_ENV.databaseUrl,
    BIRELLO_PREFLIGHT_ENV.databaseName,
    BIRELLO_PREFLIGHT_ENV.expectedHost,
    BIRELLO_PREFLIGHT_ENV.projectRef,
  ];
}

export function configurationFromBirelloPreflightEnvironment(
  environment: Readonly<Record<string, string | undefined>> = process.env,
): BirelloPreflightConfiguration | BirelloPreflightReport {
  if (environment[BIRELLO_PREFLIGHT_ENV.forbiddenPublicUrl]) {
    return Object.freeze({
      result: "REJECTED" as const, failureCode: "CONFIGURATION_INVALID" as const,
      failureStage: "configuration" as const, sqlState: null, driverCode: null,
      failedQueryId: null, completedQueryIds: Object.freeze([]),
      preflightPublicSchemaUsage: null,
      preflightRequiredTablePrivileges: null, preflightRequiredRlsPolicies: null,
      connectionAttempted: false, secretsPrinted: false,
    });
  }
  const missing = requiredEnvironmentNames().filter((name) => !environment[name]?.trim());
  if (missing.length) {
    return Object.freeze({
      result: "CONFIGURATION_REQUIRED" as const,
      missing: Object.freeze(missing),
      connectionAttempted: false as const,
      secretsPrinted: false as const,
    });
  }
  try {
    const url = new URL(environment[BIRELLO_PREFLIGHT_ENV.databaseUrl]!);
    const database = environment[BIRELLO_PREFLIGHT_ENV.databaseName]!.trim();
    const expectedHost = environment[BIRELLO_PREFLIGHT_ENV.expectedHost]!.trim().toLowerCase();
    const projectRef = environment[BIRELLO_PREFLIGHT_ENV.projectRef]!.trim().toLowerCase();
    const acceptedUsernames = new Set([
      BIRELLO_PREFLIGHT_ROLE,
      `${BIRELLO_PREFLIGHT_ROLE}.${projectRef}`,
    ]);
    const forbiddenParameters = [...url.searchParams.keys()].some((key) =>
      key.toLowerCase().startsWith("ssl") || ["requiressl", "uselibpqcompat"].includes(key.toLowerCase()));
    if (
      environment[BIRELLO_PREFLIGHT_ENV.enabled] !== "true"
      || environment[BIRELLO_PREFLIGHT_ENV.target] !== "production"
      || !/^[a-z0-9]{20}$/.test(projectRef)
      || !["postgres:", "postgresql:"].includes(url.protocol)
      || !acceptedUsernames.has(url.username)
      || !url.password
      || url.hostname.toLowerCase() !== expectedHost
      || url.pathname.slice(1) !== database
      || ["localhost", "127.0.0.1", "::1"].includes(url.hostname)
      || forbiddenParameters
    ) throw new Error("invalid");
    return Object.freeze({
      target: "production" as const,
      connectionString: url.toString(),
      host: url.hostname,
      port: url.port ? Number(url.port) : 5432,
      database,
      user: BIRELLO_PREFLIGHT_ROLE,
      verifiedTls: true,
      caMechanism: environment.NODE_EXTRA_CA_CERTS
        ? "NODE_EXTRA_CA_CERTS" as const
        : "SYSTEM_TRUST_STORE" as const,
    });
  } catch {
    return Object.freeze({
      result: "REJECTED" as const, failureCode: "CONFIGURATION_INVALID" as const,
      failureStage: "configuration" as const, sqlState: null, driverCode: null,
      failedQueryId: null, completedQueryIds: Object.freeze([]),
      preflightPublicSchemaUsage: null,
      preflightRequiredTablePrivileges: null, preflightRequiredRlsPolicies: null,
      connectionAttempted: false, secretsPrinted: false,
    });
  }
}

function isReport(value: BirelloPreflightConfiguration | BirelloPreflightReport):
  value is BirelloPreflightReport {
  return "result" in value;
}

function valuesFor(rows: readonly Record<string, unknown>[], key: string): string[] {
  return rows.map((row) => row[key]).filter((value): value is string => typeof value === "string");
}

function requiredTableBooleans(value: unknown): BirelloPreflightRequiredTablePrivileges {
  const record = typeof value === "object" && value !== null
    ? value as Record<string, unknown>
    : {};
  return Object.freeze(Object.fromEntries(BIRELLO_PREFLIGHT_REQUIRED_TABLES.map(
    (table) => [table, record[table] === true],
  )) as Record<BirelloPreflightRequiredTable, boolean>);
}

function ledgerStatus(
  versions: readonly string[],
  prefix: "042" | "043",
): "APPLIED" | "PENDING" | "UNEXPECTED" {
  const matches = versions.filter((version) =>
    version === prefix || version.startsWith(`${prefix}_`));
  if (matches.length === 1) return "APPLIED";
  if (matches.length === 0) return "PENDING";
  return "UNEXPECTED";
}

function functionByName(
  rows: readonly Readonly<{
    name: string;
    arguments: string;
    resultType: string;
    securityDefiner: boolean;
    fixedSearchPath: boolean;
    executeIngestor: boolean;
    executeReader: boolean;
    executePreflight: boolean;
  }>[],
  name: string,
) {
  return rows.find((row) => row.name === name);
}

type ExecutionFailureStage = "connect" | "read_only_setup" | "identity" | "query";

function safeErrorField(error: unknown, key: "code" | "message"): string {
  if (typeof error !== "object" || error === null || !(key in error)) return "";
  const value = (error as Record<string, unknown>)[key];
  return typeof value === "string" ? value : "";
}

function classifyExecutionFailure(
  error: unknown,
  stage: ExecutionFailureStage,
  currentQueryId: BirelloPreflightQueryId | null,
  completedQueryIds: readonly BirelloPreflightQueryId[],
  publicSchemaUsage: boolean | null,
  tablePrivileges: BirelloPreflightRequiredTablePrivileges | null,
  rlsPolicies: BirelloPreflightRequiredTablePrivileges | null,
): Extract<BirelloPreflightReport, { result: "REJECTED" }> {
  const code = safeErrorField(error, "code").toUpperCase();
  const message = safeErrorField(error, "message");
  const lowerMessage = message.toLowerCase();
  const sqlState = /^[0-9A-Z]{5}$/.test(code) ? code : null;
  const driverCode = /^[A-Z][A-Z0-9_]{1,63}$/.test(code) && sqlState === null
    ? code
    : null;
  const failureCode =
    message === "TARGET_IDENTITY_MISMATCH" ? "TARGET_IDENTITY_MISMATCH"
    : message === "ROLE_IDENTITY_MISMATCH" ? "SESSION_IDENTITY_MISMATCH"
    : message === "READ_ONLY_MISMATCH" ? "READ_ONLY_MISMATCH"
    : message === "QUERY_CONTRACT_MISMATCH" ? "QUERY_CONTRACT_MISMATCH"
    : code === "28P01" ? "AUTHENTICATION_FAILED"
    : code === "28000" ? "ROLE_LOGIN_REJECTED"
    : code === "3D000" ? "DATABASE_NOT_FOUND"
    : code === "ENOTFOUND" || code === "EAI_AGAIN" ? "DNS_FAILED"
    : code === "ECONNREFUSED" ? "CONNECTION_REFUSED"
    : code === "ETIMEDOUT" || code === "ESOCKETTIMEDOUT" ? "CONNECTION_TIMEOUT"
    : [
        "UNABLE_TO_VERIFY_LEAF_SIGNATURE", "CERT_HAS_EXPIRED",
        "DEPTH_ZERO_SELF_SIGNED_CERT", "SELF_SIGNED_CERT_IN_CHAIN",
        "ERR_TLS_CERT_ALTNAME_INVALID", "UNABLE_TO_GET_ISSUER_CERT_LOCALLY",
      ].includes(code) ? "TLS_FAILED"
    : stage === "connect" && /(tenant|pooler|supavisor|user not found)/i.test(lowerMessage)
      ? "POOLER_REJECTED"
    : stage === "read_only_setup" ? "READ_ONLY_SETUP_FAILED"
    : stage === "identity" || stage === "query" ? "QUERY_EXECUTION_FAILED"
    : "EXECUTION_FAILED_UNKNOWN";
  return Object.freeze({
    result: "REJECTED" as const,
    failureCode,
    failureStage: stage,
    sqlState,
    driverCode,
    failedQueryId: failureCode === "QUERY_EXECUTION_FAILED" ? currentQueryId : null,
    completedQueryIds: Object.freeze([...completedQueryIds]),
    preflightPublicSchemaUsage: publicSchemaUsage,
    preflightRequiredTablePrivileges: tablePrivileges,
    preflightRequiredRlsPolicies: rlsPolicies,
    connectionAttempted: true,
    secretsPrinted: false as const,
  });
}

export async function runBirelloProductionPreflight(
  configurationOrReport: BirelloPreflightConfiguration | BirelloPreflightReport,
  clientFactory: BirelloPreflightClientFactory = productionClientFactory,
): Promise<BirelloPreflightReport> {
  if (isReport(configurationOrReport)) return configurationOrReport;
  const configuration = configurationOrReport;
  let connected = false;
  let transaction = false;
  let client: BirelloPreflightClient;
  let failureStage: ExecutionFailureStage = "connect";
  let currentQueryId: BirelloPreflightQueryId | null = null;
  const completedQueryIds: BirelloPreflightQueryId[] = [];
  let publicSchemaUsage: boolean | null = null;
  let tablePrivileges: BirelloPreflightRequiredTablePrivileges | null = null;
  let rlsPolicies: BirelloPreflightRequiredTablePrivileges | null = null;
  try {
    client = clientFactory(configuration);
    await client.connect();
    connected = true;
    failureStage = "read_only_setup";
    await client.query("BEGIN READ ONLY");
    transaction = true;
    await client.query("SET LOCAL statement_timeout = '10s'");
    await client.query("SET LOCAL lock_timeout = '1s'");
    await client.query("SET LOCAL idle_in_transaction_session_timeout = '15s'");

    failureStage = "identity";
    currentQueryId = "session";
    const results: Record<string, readonly Record<string, unknown>[]> = {
      session: (await client.query(BIRELLO_PREFLIGHT_FIXED_QUERIES.session)).rows,
    };
    completedQueryIds.push("session");
    const session = results.session[0];
    if (session?.database !== configuration.database) {
      throw new Error("TARGET_IDENTITY_MISMATCH");
    }
    if (session?.role !== BIRELLO_PREFLIGHT_ROLE) {
      throw new Error("ROLE_IDENTITY_MISMATCH");
    }
    if (session?.transaction_read_only !== "on") {
      throw new Error("READ_ONLY_MISMATCH");
    }
    failureStage = "query";
    for (const id of BIRELLO_PREFLIGHT_QUERY_ORDER.slice(1)) {
      currentQueryId = id;
      if (id === "retrievalMetadata" || id === "trustDomains") {
        const catalog = results.catalogFit?.[0];
        const visible = id === "retrievalMetadata"
          ? catalog?.retrieval_metadata_select === true
          : catalog?.trust_domain_select === true;
        if (!visible) {
          results[id] = Object.freeze([{ select_visible: false }]);
          completedQueryIds.push(id);
          continue;
        }
      }
      results[id] = (await client.query(BIRELLO_PREFLIGHT_FIXED_QUERIES[id])).rows;
      completedQueryIds.push(id);
      if (id === "privileges") {
        const preflightRow = results[id].find((row) => row.role === BIRELLO_PREFLIGHT_ROLE);
        publicSchemaUsage = preflightRow?.preflight_public_schema_usage === true;
        tablePrivileges = requiredTableBooleans(
          preflightRow?.preflight_required_table_privileges);
        rlsPolicies = requiredTableBooleans(preflightRow?.preflight_required_rls_policies);
      }
    }

    const columnRows = results.columns ?? [];
    const requiredTablesPresent = Object.keys(REQUIRED_TABLE_COLUMNS).every((table) =>
      columnRows.some((row) => row.table_name === table));
    const requiredColumnsPresent = Object.entries(REQUIRED_TABLE_COLUMNS).every(([table, columns]) =>
      columns.every((column) => columnRows.some((row) =>
        row.table_name === table && row.column_name === column)));
    const enumRows = results.enums ?? [];
    const requiredEnumValuesPresent = Object.entries(REQUIRED_ENUM_VALUES).every(([type, values]) =>
      values.every((value) => enumRows.some((row) =>
        row.enum_name === type && row.enum_value === value)));
    const functionRows = results.functions ?? [];
    const roleRows = results.roles ?? [];
    const privilegeRows = results.privileges ?? [];
    const observedClaimIds = valuesFor(results.firstPack ?? [], "id");
    const expectedClaimIds = [...FIRST_PACK_CLAIM_IDS].sort();
    const sourceOnlyPresent = SOURCE_ONLY_CLAIM_IDS.filter((id) => observedClaimIds.includes(id));
    const functions = Object.freeze(functionRows.map((row) => Object.freeze({
      name: String(row.name), arguments: String(row.arguments),
      resultType: String(row.result_type ?? ""),
      owner: String(row.owner ?? ""),
      securityDefiner: row.security_definer === true,
      fixedSearchPath: Array.isArray(row.config)
        && row.config.some((value) => value === "search_path=pg_catalog, public"),
      executeIngestor: row.execute_ingestor === true,
      executeReader: row.execute_reader === true,
      executePreflight: row.execute_preflight === true,
    })));
    const catalog = results.catalogFit?.[0];
    const roots = results.semanticRoots?.[0];
    const sources = results.sourceUniqueness?.[0];
    const metadataRow = results.retrievalMetadata?.[0];
    const trustRow = results.trustDomains?.[0];
    const retrievalMetadataSelect = catalog?.retrieval_metadata_select === true;
    const trustDomainSelect = catalog?.trust_domain_select === true;
    const missingSelect = [
      ...(retrievalMetadataSelect ? [] : ["knowledge_retrieval_metadata.SELECT"]),
      ...(trustDomainSelect ? [] : ["knowledge_trust_domains.SELECT"]),
    ];
    const retrievalMetadata = Object.freeze({
      selectVisible: retrievalMetadataSelect,
      federalClaimCount: retrievalMetadataSelect
        ? Number(metadataRow?.federal_claim_count ?? -1)
        : observedClaimIds.length,
      metadataCount: retrievalMetadataSelect ? Number(metadataRow?.metadata_count ?? -1) : null,
      missingMetadata: retrievalMetadataSelect ? Number(metadataRow?.missing_metadata ?? -1) : null,
      duplicateMetadata: retrievalMetadataSelect
        ? Number(metadataRow?.duplicate_metadata ?? -1) : null,
    });
    const trustDomain = Object.freeze({
      selectVisible: trustDomainSelect,
      semanticDeCount: trustDomainSelect ? Number(trustRow?.semantic_de_count ?? -1) : null,
      duplicateCodeCount: trustDomainSelect ? Number(trustRow?.duplicate_code_count ?? -1) : null,
    });
    const deJurisdiction = Object.freeze({
      semanticDeCount: Number(roots?.federal_de_count ?? -1),
      duplicateCount: Number(roots?.federal_de_duplicate_count ?? -1),
      parentRootValid: Number(roots?.federal_de_count) === 1
        && Number(roots?.federal_de_duplicate_count) === 0,
    });
    const deByWeiltingen = Object.freeze({
      landCount: Number(roots?.land_by_count ?? -1),
      kreisCount: Number(roots?.kreis_count ?? -1),
      municipalityCount: Number(roots?.municipality_count ?? -1),
      parentChainValid: roots?.parent_chain_valid === true,
      municipalityScopeValid: roots?.municipality_scope_valid === true,
      competenceFamilyValid: roots?.competence_family_valid === true,
    });
    const sourceUniqueness = Object.freeze({
      uniqueIndexPresent: sources?.unique_index_present === true
        || catalog?.source_normalized_url_unique_index === true,
      sourceCount: Number(sources?.source_count ?? -1),
      duplicateNormalizedUrlCount: Number(sources?.duplicate_normalized_url_count ?? -1),
    });
    const g3 = functionByName(functions, "knowledge_ingest_curated_domain_pack");
    const g4 = functionByName(functions, "knowledge_ingest_curated_service_area_pack");
    const rpc038 = functionByName(functions, "knowledge_retrieve_evidence_packets");
    const rpc040 = functionByName(functions, "knowledge_retrieve_anmeldung_context");
    const g3Compatible = Boolean(
      g3
      && g3.arguments === "p_payload jsonb"
      && g3.resultType.toLowerCase().includes("jsonb")
      && g3.securityDefiner
      && g3.fixedSearchPath,
    );
    const g4Compatible = Boolean(
      g4
      && g4.arguments === "p_payload jsonb"
      && g4.resultType.toLowerCase().includes("jsonb")
      && g4.securityDefiner
      && g4.fixedSearchPath,
    );
    const rpc038Compatible = Boolean(
      rpc038
      && rpc038.arguments === "p_claim_ids uuid[], p_jurisdiction_codes text[]"
      && rpc038.securityDefiner
      && rpc038.fixedSearchPath,
    );
    const rpc040Compatible = Boolean(
      rpc040
      && rpc040.arguments === "p_claim_ids uuid[], p_municipality_code text"
      && rpc040.resultType.toLowerCase().includes("jsonb")
      && rpc040.securityDefiner
      && rpc040.fixedSearchPath,
    );
    const grantFit = Object.freeze({
      migration042GrantFit: g3?.executeIngestor === true && g4?.executeIngestor === true
        && g3.executeReader === false && g4.executeReader === false
        && g3.executePreflight === false && g4.executePreflight === false,
      migration043GrantFit: rpc038?.executeReader === true && rpc040?.executeReader === true
        && rpc038.executeIngestor === false && rpc040.executeIngestor === false
        && rpc038.executePreflight === false && rpc040.executePreflight === false,
      ingestorHasG3: g3?.executeIngestor === true,
      ingestorHasG4: g4?.executeIngestor === true,
      readerHas038: rpc038?.executeReader === true,
      readerHas040: rpc040?.executeReader === true,
      preflightHasMutationExecute: g3?.executePreflight === true
        || g4?.executePreflight === true
        || rpc038?.executePreflight === true
        || rpc040?.executePreflight === true,
    });
    const catalogFit = Object.freeze({
      retrievalMetadataTable: catalog?.retrieval_metadata_table === true,
      retrievalMetadataColumnsPresent: catalog?.retrieval_metadata_columns_present === true,
      retrievalMetadataUnique: catalog?.retrieval_metadata_unique === true,
      retrievalMetadataSelect: retrievalMetadataSelect,
      trustDomainTable: catalog?.trust_domain_table === true,
      trustDomainCodeUnique: catalog?.trust_domain_code_unique === true,
      trustDomainSelect: trustDomainSelect,
      sourceNormalizedUrlUniqueIndex: catalog?.source_normalized_url_unique_index === true,
      scopeTypeUnconstrained: catalog?.scope_type_unconstrained === true,
    });
    const migrationLedger = Object.freeze(valuesFor(results.migrations ?? [], "version"));
    const ledger042 = ledgerStatus(migrationLedger, "042");
    const ledger043 = ledgerStatus(migrationLedger, "043");
    const firstPackComplete = expectedClaimIds.every((id) => observedClaimIds.includes(id))
      && sourceOnlyPresent.length === SOURCE_ONLY_CLAIM_IDS.length;
    const migration042Ready = ledger042 === "PENDING"
      && missingSelect.filter((name) => name.startsWith("knowledge_trust_domains")).length === 0
      && catalogFit.trustDomainTable && catalogFit.trustDomainCodeUnique
      && trustDomain.semanticDeCount === 1 && trustDomain.duplicateCodeCount === 0
      && deJurisdiction.parentRootValid
      && sourceUniqueness.uniqueIndexPresent
      && sourceUniqueness.duplicateNormalizedUrlCount === 0
      && g3Compatible === true && g4Compatible === true
      && grantFit.migration042GrantFit
      && !grantFit.preflightHasMutationExecute;
    const migration043Ready = ledger042 === "PENDING" && ledger043 === "PENDING"
      && missingSelect.filter((name) => name.startsWith("knowledge_retrieval_metadata")).length === 0
      && catalogFit.retrievalMetadataTable
      && catalogFit.retrievalMetadataColumnsPresent
      && catalogFit.retrievalMetadataUnique
      && retrievalMetadata.federalClaimCount === 41
      && retrievalMetadata.metadataCount === 41
      && retrievalMetadata.missingMetadata === 0
      && retrievalMetadata.duplicateMetadata === 0
      && rpc038Compatible === true && rpc040Compatible === true
      && catalogFit.scopeTypeUnconstrained
      && deByWeiltingen.municipalityScopeValid
      && deByWeiltingen.competenceFamilyValid
      && grantFit.migration043GrantFit
      && firstPackComplete;

    await client.query("COMMIT");
    transaction = false;
    return Object.freeze({
      result: "PASS" as const,
      connectionAttempted: true as const,
      target: Object.freeze({
        host: configuration.host, port: configuration.port, database: configuration.database,
        role: BIRELLO_PREFLIGHT_ROLE, verifiedTls: configuration.verifiedTls,
        caMechanism: configuration.caMechanism, transactionReadOnly: true as const,
      }),
      migrationLedger,
      catalog039: Object.freeze({
        requiredTablesPresent, requiredColumnsPresent, requiredEnumValuesPresent,
      }),
      functions,
      roles: Object.freeze(roleRows.map((row) => Object.freeze({
        role: String(row.role), login: row.login === true, superuser: row.superuser === true,
        createDb: row.create_db === true, createRole: row.create_role === true,
        bypassRls: row.bypass_rls === true,
      }))),
      privileges: Object.freeze(privilegeRows.map((row) => Object.freeze({
        role: String(row.role), schemaCreate: row.schema_create === true,
        directKnowledgeDml: row.direct_dml === true,
        executableFunctions: Object.freeze(Array.isArray(row.executable)
          ? row.executable.filter((value): value is string => typeof value === "string")
          : []),
      }))),
      firstPack: Object.freeze({
        expectedIds: Object.freeze(expectedClaimIds),
        observedIds: Object.freeze(observedClaimIds),
        missingIds: Object.freeze(expectedClaimIds.filter((id) => !observedClaimIds.includes(id))),
        sourceOnlyV2AIdsPresent: Object.freeze(sourceOnlyPresent),
        duplicateSemanticCount: Number(results.duplicates?.[0]?.count ?? -1),
      }),
      weiltingen: Object.freeze({
        municipality: Number(results.weiltingen?.[0]?.municipality ?? -1),
        scope: Number(results.weiltingen?.[0]?.scope ?? -1),
        authority: Number(results.weiltingen?.[0]?.authority ?? -1),
        competence: Number(results.weiltingen?.[0]?.competence ?? -1),
        sources: Number(results.weiltingen?.[0]?.sources ?? -1),
      }),
      catalogFit,
      retrievalMetadata,
      trustDomain,
      deJurisdiction,
      deByWeiltingen,
      sourceUniqueness,
      grantFit,
      fit: Object.freeze({
        missingSelect: Object.freeze(missingSelect),
        migration042Ready,
        migration043Ready,
        ledger042,
        ledger043,
      }),
      fixedQueryCount: Object.keys(BIRELLO_PREFLIGHT_FIXED_QUERIES).length,
      preflightPublicSchemaUsage: publicSchemaUsage === true,
      preflightRequiredTablePrivileges: tablePrivileges
        ?? requiredTableBooleans(null),
      preflightRequiredRlsPolicies: rlsPolicies ?? requiredTableBooleans(null),
      secretsPrinted: false as const,
    });
  } catch (error) {
    if (transaction) {
      try { await client!.query("ROLLBACK"); } catch { /* sanitized primary failure */ }
    }
    const classified = classifyExecutionFailure(
      error, failureStage, currentQueryId, completedQueryIds,
      publicSchemaUsage, tablePrivileges, rlsPolicies);
    return Object.freeze({ ...classified, connectionAttempted: connected || failureStage === "connect" });
  } finally {
    if (connected) {
      try { await client!.end(); } catch { /* sanitized cleanup */ }
    }
  }
}
