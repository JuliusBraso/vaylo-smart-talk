import "server-only";

export const PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS = [
  "PROD_PREFLIGHT_TARGET_IDENTITY",
  "PROD_PREFLIGHT_SERVER_VERSION",
  "PROD_PREFLIGHT_CURRENT_DATABASE",
  "PROD_PREFLIGHT_CURRENT_USER",
  "PROD_PREFLIGHT_TRANSACTION_CAPABILITY",
  "PROD_PREFLIGHT_PGCRYPTO_EXTENSION",
  "PROD_PREFLIGHT_PGCRYPTO_SCHEMA",
  "PROD_PREFLIGHT_PGCRYPTO_DIGEST_SIGNATURE",
  "PROD_PREFLIGHT_PGCRYPTO_EXTENSION_OWNERSHIP",
  "PROD_PREFLIGHT_SHA256_CAPABILITY",
  "PROD_PREFLIGHT_AUDIT_ROLE_CONFLICTS",
  "PROD_PREFLIGHT_AUDIT_SCHEMA_CONFLICT",
  "PROD_PREFLIGHT_AUDIT_VIEW_CONFLICTS",
  "PROD_PREFLIGHT_AUDIT_FUNCTION_CONFLICTS",
  "PROD_PREFLIGHT_MIGRATION_LEDGER_IDENTITY",
  "PROD_PREFLIGHT_MIGRATION_LEDGER_COLUMNS",
  "PROD_PREFLIGHT_EXECUTOR_CAPABILITY",
  "PROD_PREFLIGHT_ROLLBACK_CAPABILITY",
] as const;

export type ProductionReadOnlyPreflightQueryId =
  (typeof PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS)[number];

export type PreflightSafetySettings = Readonly<{
  readOnly: true;
  statementTimeoutMs: 5_000;
  lockTimeoutMs: 1_000;
  applicationRowsAllowed: false;
  authRowsAllowed: false;
  storageRowsAllowed: false;
  secretDataAllowed: false;
  dynamicSqlAllowed: false;
}>;

export type PreflightQueryDescriptor = Readonly<{
  queryId: ProductionReadOnlyPreflightQueryId;
  sql: string;
  classification: "SERVER_METADATA" | "CATALOG_METADATA";
  evidenceKind: "BOOLEAN_COUNT_OR_NORMALIZED_IDENTIFIER";
  safety: PreflightSafetySettings;
}>;

const SAFETY: PreflightSafetySettings = Object.freeze({
  readOnly: true,
  statementTimeoutMs: 5_000,
  lockTimeoutMs: 1_000,
  applicationRowsAllowed: false,
  authRowsAllowed: false,
  storageRowsAllowed: false,
  secretDataAllowed: false,
  dynamicSqlAllowed: false,
});

function query(
  queryId: ProductionReadOnlyPreflightQueryId,
  sql: string,
  classification: PreflightQueryDescriptor["classification"],
): PreflightQueryDescriptor {
  return Object.freeze({
    queryId,
    sql,
    classification,
    evidenceKind: "BOOLEAN_COUNT_OR_NORMALIZED_IDENTIFIER",
    safety: SAFETY,
  });
}

// Templates are static metadata-only SQL. Callers can select an ID but cannot supply SQL.
export const PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY: Readonly<
  Record<ProductionReadOnlyPreflightQueryId, PreflightQueryDescriptor>
> = Object.freeze({
  PROD_PREFLIGHT_TARGET_IDENTITY: query("PROD_PREFLIGHT_TARGET_IDENTITY", "select current_database() as database_identifier", "SERVER_METADATA"),
  PROD_PREFLIGHT_SERVER_VERSION: query("PROD_PREFLIGHT_SERVER_VERSION", "select current_setting('server_version_num') as server_version_num", "SERVER_METADATA"),
  PROD_PREFLIGHT_CURRENT_DATABASE: query("PROD_PREFLIGHT_CURRENT_DATABASE", "select current_database() as current_database", "SERVER_METADATA"),
  PROD_PREFLIGHT_CURRENT_USER: query("PROD_PREFLIGHT_CURRENT_USER", "select current_user as current_user", "SERVER_METADATA"),
  PROD_PREFLIGHT_TRANSACTION_CAPABILITY: query("PROD_PREFLIGHT_TRANSACTION_CAPABILITY", "show transaction_read_only", "SERVER_METADATA"),
  PROD_PREFLIGHT_PGCRYPTO_EXTENSION: query("PROD_PREFLIGHT_PGCRYPTO_EXTENSION", "select count(*)::int as extension_count from pg_catalog.pg_extension where extname = 'pgcrypto'", "CATALOG_METADATA"),
  PROD_PREFLIGHT_PGCRYPTO_SCHEMA: query("PROD_PREFLIGHT_PGCRYPTO_SCHEMA", "select n.nspname as schema_name from pg_catalog.pg_extension e join pg_catalog.pg_namespace n on n.oid = e.extnamespace where e.extname = 'pgcrypto'", "CATALOG_METADATA"),
  PROD_PREFLIGHT_PGCRYPTO_DIGEST_SIGNATURE: query("PROD_PREFLIGHT_PGCRYPTO_DIGEST_SIGNATURE", "select count(*)::int as signature_count from pg_catalog.pg_proc p join pg_catalog.pg_namespace n on n.oid = p.pronamespace where n.nspname = 'extensions' and p.proname = 'digest'", "CATALOG_METADATA"),
  PROD_PREFLIGHT_PGCRYPTO_EXTENSION_OWNERSHIP: query("PROD_PREFLIGHT_PGCRYPTO_EXTENSION_OWNERSHIP", "select count(*)::int as membership_count from pg_catalog.pg_depend d join pg_catalog.pg_extension e on e.oid = d.refobjid where e.extname = 'pgcrypto'", "CATALOG_METADATA"),
  PROD_PREFLIGHT_SHA256_CAPABILITY: query("PROD_PREFLIGHT_SHA256_CAPABILITY", "select length(extensions.digest('preflight-safe-constant', 'sha256'))::int as digest_bytes", "CATALOG_METADATA"),
  PROD_PREFLIGHT_AUDIT_ROLE_CONFLICTS: query("PROD_PREFLIGHT_AUDIT_ROLE_CONFLICTS", "select count(*)::int as role_count from pg_catalog.pg_roles where rolname in ('vaylo_audit_owner', 'vaylo_audit_reader', 'vaylo_audit_writer')", "CATALOG_METADATA"),
  PROD_PREFLIGHT_AUDIT_SCHEMA_CONFLICT: query("PROD_PREFLIGHT_AUDIT_SCHEMA_CONFLICT", "select count(*)::int as schema_count from pg_catalog.pg_namespace where nspname = 'vaylo_audit'", "CATALOG_METADATA"),
  PROD_PREFLIGHT_AUDIT_VIEW_CONFLICTS: query("PROD_PREFLIGHT_AUDIT_VIEW_CONFLICTS", "select count(*)::int as view_count from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid = c.relnamespace where n.nspname = 'vaylo_audit' and c.relkind = 'v'", "CATALOG_METADATA"),
  PROD_PREFLIGHT_AUDIT_FUNCTION_CONFLICTS: query("PROD_PREFLIGHT_AUDIT_FUNCTION_CONFLICTS", "select count(*)::int as function_count from pg_catalog.pg_proc p join pg_catalog.pg_namespace n on n.oid = p.pronamespace where n.nspname = 'vaylo_audit'", "CATALOG_METADATA"),
  PROD_PREFLIGHT_MIGRATION_LEDGER_IDENTITY: query("PROD_PREFLIGHT_MIGRATION_LEDGER_IDENTITY", "select count(*)::int as relation_count from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid = c.relnamespace where n.nspname = 'supabase_migrations' and c.relname = 'schema_migrations'", "CATALOG_METADATA"),
  PROD_PREFLIGHT_MIGRATION_LEDGER_COLUMNS: query("PROD_PREFLIGHT_MIGRATION_LEDGER_COLUMNS", "select count(*)::int as column_count from information_schema.columns where table_schema = 'supabase_migrations' and table_name = 'schema_migrations'", "CATALOG_METADATA"),
  PROD_PREFLIGHT_EXECUTOR_CAPABILITY: query("PROD_PREFLIGHT_EXECUTOR_CAPABILITY", "select count(*)::int as capability_count from information_schema.role_table_grants where grantee = current_user", "CATALOG_METADATA"),
  PROD_PREFLIGHT_ROLLBACK_CAPABILITY: query("PROD_PREFLIGHT_ROLLBACK_CAPABILITY", "select count(*)::int as rollback_capability_count from information_schema.role_routine_grants where grantee = current_user", "CATALOG_METADATA"),
});

const FORBIDDEN_SQL = /\b(?:insert|update|delete|merge|create|alter|drop|truncate|copy|grant|revoke|call|do|vacuum|analyze|refresh|reindex|cluster|comment|listen|notify|set\s+(?:role|session_authorization))\b/i;
const FORBIDDEN_RELATIONS = /\b(?:profiles|user_documents|auth\.users|storage\.objects|knowledge_sources|knowledge_translations)\b/i;
const SECRET_PATTERN = /postgres(?:ql)?:\/\/|https?:\/\/|password|secret|token|credential|api[_-]?key|service.?role|anon.?key|eyJ[a-zA-Z0-9_-]+\./i;
const IDENTIFIER_PATTERN = /^[a-z0-9_:-]{1,128}$/i;

export function isLexicallySafePreflightSql(sql: string): boolean {
  const normalized = sql.trim();
  return normalized.length > 0 &&
    normalized.length <= 1_000 &&
    !normalized.includes(";") &&
    /^(?:select|show)\b/i.test(normalized) &&
    !FORBIDDEN_SQL.test(normalized) &&
    !FORBIDDEN_RELATIONS.test(normalized) &&
    !SECRET_PATTERN.test(normalized) &&
    (/^show\s+transaction_read_only$/i.test(normalized) ||
      /\b(?:pg_catalog|information_schema|current_database|current_user|current_setting|extensions\.digest)\b/i.test(normalized));
}

export type SanitizedPreflightEvidence = Readonly<{
  queryId: ProductionReadOnlyPreflightQueryId;
  classification: PreflightQueryDescriptor["classification"];
  rowCount: number;
  fields: Readonly<Record<string, boolean | number | string>>;
  secretDataRejected: true;
  bounded: true;
}>;

export function sanitizePreflightEvidence(
  queryId: ProductionReadOnlyPreflightQueryId,
  input: unknown,
): SanitizedPreflightEvidence | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const fields: Record<string, boolean | number | string> = {};
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (!IDENTIFIER_PATTERN.test(key) || Object.keys(fields).length >= 12) return null;
    if (typeof value === "boolean") fields[key] = value;
    else if (typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 10_000) fields[key] = value;
    else if (typeof value === "string" && value.length <= 128 && IDENTIFIER_PATTERN.test(value) && !SECRET_PATTERN.test(value)) fields[key] = value;
    else return null;
  }
  return Object.freeze({
    queryId,
    classification: PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY[queryId].classification,
    rowCount: 1,
    fields: Object.freeze(fields),
    secretDataRejected: true,
    bounded: true,
  });
}

export type PreflightRuntimeValidator = (input: unknown) => input is SanitizedPreflightEvidence;

function validator(queryId: ProductionReadOnlyPreflightQueryId): PreflightRuntimeValidator {
  return (input: unknown): input is SanitizedPreflightEvidence => {
    if (!input || typeof input !== "object") return false;
    const value = input as Partial<SanitizedPreflightEvidence>;
    return value.queryId === queryId &&
      value.classification === PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY[queryId].classification &&
      value.rowCount === 1 &&
      value.secretDataRejected === true &&
      value.bounded === true &&
      !!value.fields &&
      Object.keys(value.fields).length <= 12 &&
      !SECRET_PATTERN.test(JSON.stringify(value));
  };
}

export const PRODUCTION_READ_ONLY_PREFLIGHT_RUNTIME_VALIDATORS: Readonly<
  Record<ProductionReadOnlyPreflightQueryId, PreflightRuntimeValidator>
> = Object.freeze(Object.fromEntries(
  PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS.map((queryId) => [queryId, validator(queryId)]),
) as Record<ProductionReadOnlyPreflightQueryId, PreflightRuntimeValidator>);

export interface ProductionReadOnlyPreflightTransport {
  execute(request: Readonly<{
    query: PreflightQueryDescriptor;
    safety: PreflightSafetySettings;
  }>): Promise<unknown>;
}

export type PreflightLifecycleAuthorization = Readonly<{
  explicitlyAuthorized: boolean;
  authorizationReference: string | null;
}>;

export function createProductionReadOnlyPreflightExecutor(
  transport: ProductionReadOnlyPreflightTransport,
  authorization: PreflightLifecycleAuthorization,
) {
  return Object.freeze({
    async execute(queryId: ProductionReadOnlyPreflightQueryId): Promise<SanitizedPreflightEvidence | null> {
      if (!authorization.explicitlyAuthorized || !authorization.authorizationReference) return null;
      const descriptor = PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY[queryId];
      if (!isLexicallySafePreflightSql(descriptor.sql)) return null;
      const response = await transport.execute({ query: descriptor, safety: SAFETY });
      const sanitized = sanitizePreflightEvidence(queryId, response);
      return sanitized && PRODUCTION_READ_ONLY_PREFLIGHT_RUNTIME_VALIDATORS[queryId](sanitized)
        ? sanitized
        : null;
    },
  });
}

export function createSyntheticProductionReadOnlyPreflightExecutor(
  authorization: PreflightLifecycleAuthorization,
  responses: Readonly<Partial<Record<ProductionReadOnlyPreflightQueryId, unknown>>>,
) {
  const transport: ProductionReadOnlyPreflightTransport = {
    async execute({ query }) {
      return responses[query.queryId] ?? {};
    },
  };
  return createProductionReadOnlyPreflightExecutor(transport, authorization);
}
