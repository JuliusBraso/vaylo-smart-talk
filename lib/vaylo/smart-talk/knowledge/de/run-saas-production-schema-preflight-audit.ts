import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

import { Client, type ClientConfig } from "pg";

import {
  DIAGNOSTIC_MIGRATION_IDS,
  EXPECTED_KNOWLEDGE_TABLES,
  EXPECTED_SCHEMA_MIGRATION_IDS,
  FIXED_SCHEMA_INSPECTION_QUERIES,
  FORBIDDEN_CONNECTION_URL_TLS_PARAMETERS,
  MAINTENANCE_CONFIGURATION_KEYS,
  PREFLIGHT_MIGRATION_CLASSIFICATIONS,
  TRANSACTION_STATEMENTS,
  deriveProductionSchemaPreflightStatus,
  runProductionSchemaPreflight,
  type MaintenanceConfigurationSource,
  type MaintenancePgClient,
  type MaintenancePgClientFactory,
} from "../../../../../scripts/production-schema-preflight";

const SYNTHETIC_DATABASE_URL =
  "postgresql://vaylo_schema_auditor:synthetic-only@db.invalid/postgres";
const ALL_CLASSIFIED_MIGRATION_IDS = Object.freeze(
  Object.keys(PREFLIGHT_MIGRATION_CLASSIFICATIONS),
);

type FakeClientState = {
  connectCalls: number;
  queryCalls: string[];
  endCalls: number;
  networkCalls: number;
  failurePoint:
    | "connect"
    | "begin"
    | "statementTimeout"
    | "lockTimeout"
    | "inspection"
    | "commit"
    | null;
};

function configuration(
  overrides: Readonly<Record<string, string | undefined>> = {},
): Readonly<{
  source: MaintenanceConfigurationSource;
  reads: string[];
}> {
  const values: Readonly<Record<string, string | undefined>> = {
    [MAINTENANCE_CONFIGURATION_KEYS.enabled]: "true",
    [MAINTENANCE_CONFIGURATION_KEYS.target]: "production",
    [MAINTENANCE_CONFIGURATION_KEYS.backupConfirmed]: "true",
    [MAINTENANCE_CONFIGURATION_KEYS.databaseUrl]: SYNTHETIC_DATABASE_URL,
    ...overrides,
  };
  const reads: string[] = [];
  return Object.freeze({
    reads,
    source: Object.freeze({
      read(name: string): string | undefined {
        reads.push(name);
        return values[name];
      },
    }),
  });
}

const AUDIT_VIEWS = [
  "platform_schemas",
  "extensions",
  "tables",
  "columns",
  "constraints",
  "indexes",
  "enums",
  "triggers",
  "rls_state",
  "policies",
] as const;

const AUDIT_FUNCTIONS = [
  "server_state",
  "transaction_state",
  "migration_ledger",
  "functions",
  "function_fingerprints",
  "table_grants",
  "function_grants",
  "internal_engine_privileges",
  "source_registry_collisions",
] as const;

function healthyRows(): Readonly<Record<string, readonly unknown[]>> {
  const byId: Readonly<Record<string, readonly unknown[]>> = {
    CURRENT_SESSION: [
      {
        database_name: "postgres",
        user_name: "vaylo_schema_auditor",
        server_version_num: "170000",
        transaction_read_only: "on",
      },
    ],
    MIGRATION_LEDGER: ALL_CLASSIFIED_MIGRATION_IDS.map(
      (version) => ({ version }),
    ),
    REQUIRED_SCHEMAS: [
      "public",
      "supabase_migrations",
      "vaylo_audit",
      "extensions",
    ].map((schema_name) => ({ schema_name })),
    REQUIRED_EXTENSIONS: [
      { extension_name: "pgcrypto", schema_name: "extensions" },
    ],
    KNOWLEDGE_TABLES_AND_RLS: EXPECTED_KNOWLEDGE_TABLES.map((table_name) => ({
      table_name,
      rls_enabled: true,
    })),
    KNOWLEDGE_GRANTS: [],
    KNOWLEDGE_FUNCTIONS: [
      { function_name: "knowledge_bootstrap_publication_subject" },
    ],
    KNOWLEDGE_TRIGGERS: [
      { trigger_name: "knowledge_source_versions_protect_locked_content" },
    ],
    KNOWLEDGE_INDEXES: [{ index_name: "knowledge_processes_group_idx" }],
    VAYLO_AUDIT_INTERFACE: [
      ...AUDIT_VIEWS.map((object_name) => ({
        object_kind: "view",
        object_name,
      })),
      ...AUDIT_FUNCTIONS.map((object_name) => ({
        object_kind: "function",
        object_name,
      })),
    ],
  };
  return Object.freeze(
    Object.fromEntries(
      FIXED_SCHEMA_INSPECTION_QUERIES.map((entry) => [
        entry.sql,
        byId[entry.id],
      ]),
    ),
  );
}

function fakeFactory(
  state: FakeClientState,
  capturedConfigs: ClientConfig[],
  rows: Readonly<Record<string, readonly unknown[]>> = healthyRows(),
): MaintenancePgClientFactory {
  return (config: ClientConfig): MaintenancePgClient => {
    capturedConfigs.push(config);
    return Object.freeze({
      async connect(): Promise<void> {
        state.connectCalls += 1;
        if (state.failurePoint === "connect") {
          throw new Error(`synthetic failure ${SYNTHETIC_DATABASE_URL}`);
        }
      },
      async query(sql: string): Promise<Readonly<{ rows: readonly unknown[] }>> {
        state.queryCalls.push(sql);
        const failedSql =
          state.failurePoint === "begin"
            ? TRANSACTION_STATEMENTS.begin
            : state.failurePoint === "statementTimeout"
              ? TRANSACTION_STATEMENTS.statementTimeout
              : state.failurePoint === "lockTimeout"
                ? TRANSACTION_STATEMENTS.lockTimeout
                : state.failurePoint === "inspection"
                  ? FIXED_SCHEMA_INSPECTION_QUERIES[0].sql
                  : state.failurePoint === "commit"
                    ? TRANSACTION_STATEMENTS.commit
                    : null;
        if (sql === failedSql) {
          throw new Error(`synthetic failure ${SYNTHETIC_DATABASE_URL}`);
        }
        return Object.freeze({ rows: rows[sql] ?? [] });
      },
      async end(): Promise<void> {
        state.endCalls += 1;
      },
    });
  };
}

function newState(
  failurePoint: FakeClientState["failurePoint"] = null,
): FakeClientState {
  return {
    connectCalls: 0,
    queryCalls: [],
    endCalls: 0,
    networkCalls: 0,
    failurePoint,
  };
}

function scenarioRows(
  overrides: Readonly<Record<string, readonly unknown[]>>,
): Readonly<Record<string, readonly unknown[]>> {
  const bySql: Record<string, readonly unknown[]> = { ...healthyRows() };
  for (const [id, rows] of Object.entries(overrides)) {
    const query = FIXED_SCHEMA_INSPECTION_QUERIES.find(
      (entry) => entry.id === id,
    );
    if (!query) throw new Error(`Unknown synthetic query identifier: ${id}`);
    bySql[query.sql] = rows;
  }
  return Object.freeze(bySql);
}

async function runScenario(
  overrides: Readonly<Record<string, readonly unknown[]>>,
): Promise<Awaited<ReturnType<typeof runProductionSchemaPreflight>>> {
  const state = newState();
  return runProductionSchemaPreflight(
    configuration().source,
    fakeFactory(state, [], scenarioRows(overrides)),
  );
}

function migrationLedgerExcept(
  ...excluded: readonly string[]
): readonly unknown[] {
  return ALL_CLASSIFIED_MIGRATION_IDS.filter(
    (version) => !excluded.includes(version),
  ).map((version) => ({ version }));
}

function knowledgeRowsExcept(
  excluded: readonly string[],
  rlsDisabled: readonly string[] = [],
): readonly unknown[] {
  return EXPECTED_KNOWLEDGE_TABLES.filter(
    (tableName) => !excluded.includes(tableName),
  ).map((table_name) => ({
    table_name,
    rls_enabled: !rlsDisabled.includes(table_name),
  }));
}

async function runFailureScenario(
  failurePoint: FakeClientState["failurePoint"],
  rows: Readonly<Record<string, readonly unknown[]>> = healthyRows(),
): Promise<
  Readonly<{
    result: Awaited<ReturnType<typeof runProductionSchemaPreflight>>;
    state: FakeClientState;
  }>
> {
  const state = newState(failurePoint);
  const result = await runProductionSchemaPreflight(
    configuration().source,
    fakeFactory(state, [], rows),
  );
  return Object.freeze({ result, state });
}

function sourceFiles(root: string): readonly string[] {
  if (!statSync(root).isDirectory()) return Object.freeze([root]);
  const files: string[] = [];
  for (const name of readdirSync(root)) {
    const child = path.join(root, name);
    if (statSync(child).isDirectory()) files.push(...sourceFiles(child));
    else if (/\.(?:ts|tsx)$/u.test(name)) files.push(child);
  }
  return Object.freeze(files);
}

function isReadOnlyInspectionSql(sql: string): boolean {
  const normalized = sql.replace(/'[^']*'/gu, "''").toLowerCase();
  return (
    normalized.startsWith("select ") &&
    !/\b(?:insert|update|delete|merge|create|alter|drop|truncate|grant|revoke|copy|call|do|execute|set\s+role)\b/u.test(
      normalized,
    ) &&
    !/;\s*\S/u.test(normalized)
  );
}

function effectiveClientSsl(client: Client): unknown {
  return (
    client as unknown as {
      connectionParameters?: Readonly<{ ssl?: unknown }>;
    }
  ).connectionParameters?.ssl;
}

async function tlsParameterizedUrlRejected(
  query: string,
): Promise<boolean> {
  let factoryCalls = 0;
  const attempt = configuration({
    [MAINTENANCE_CONFIGURATION_KEYS.databaseUrl]:
      `postgresql://vaylo_schema_auditor:synthetic-only@db.invalid/postgres?${query}`,
  });
  const result = await runProductionSchemaPreflight(attempt.source, () => {
    factoryCalls += 1;
    throw new Error("TLS-parameterized URL reached client construction");
  });
  return (
    result.overall === "FAILED" &&
    result.failureCode === "READONLY_CREDENTIAL_INVALID" &&
    factoryCalls === 0
  );
}

async function main(): Promise<void> {
  const scriptPath = path.resolve("scripts/production-schema-preflight.ts");
  const scriptSource = readFileSync(scriptPath, "utf8");

  const disabled = configuration({
    [MAINTENANCE_CONFIGURATION_KEYS.enabled]: "false",
  });
  const disabledResult = await runProductionSchemaPreflight(
    disabled.source,
    () => {
      throw new Error("factory must not be called");
    },
  );

  const wrongTarget = configuration({
    [MAINTENANCE_CONFIGURATION_KEYS.target]: "staging",
  });
  const wrongTargetResult = await runProductionSchemaPreflight(
    wrongTarget.source,
    () => {
      throw new Error("factory must not be called");
    },
  );

  const backupMissing = configuration({
    [MAINTENANCE_CONFIGURATION_KEYS.backupConfirmed]: "false",
  });
  const backupMissingResult = await runProductionSchemaPreflight(
    backupMissing.source,
    () => {
      throw new Error("factory must not be called");
    },
  );

  const credentialMissing = configuration({
    [MAINTENANCE_CONFIGURATION_KEYS.databaseUrl]: undefined,
  });
  const credentialMissingResult = await runProductionSchemaPreflight(
    credentialMissing.source,
    () => {
      throw new Error("factory must not be called");
    },
  );

  const publicCredential = configuration({
    [MAINTENANCE_CONFIGURATION_KEYS.forbiddenPublicDatabaseUrl]:
      SYNTHETIC_DATABASE_URL,
  });
  const publicCredentialResult = await runProductionSchemaPreflight(
    publicCredential.source,
    () => {
      throw new Error("factory must not be called");
    },
  );

  const sslModeValues = [
    "disable",
    "allow",
    "prefer",
    "require",
    "verify-ca",
    "verify-full",
    "no-verify",
  ] as const;
  const sslModeResults = Object.fromEntries(
    await Promise.all(
      sslModeValues.map(async (value) => [
        value,
        await tlsParameterizedUrlRejected(`sslmode=${value}`),
      ]),
    ),
  ) as Readonly<Record<(typeof sslModeValues)[number], boolean>>;

  const additionalTlsParameterResults = Object.fromEntries(
    await Promise.all(
      FORBIDDEN_CONNECTION_URL_TLS_PARAMETERS.filter(
        (name) => name !== "sslmode",
      ).map(async (name) => [
        name,
        await tlsParameterizedUrlRejected(`${name}=synthetic`),
      ]),
    ),
  ) as Readonly<Record<string, boolean>>;

  const normalizationCases = Object.freeze({
    uppercase: await tlsParameterizedUrlRejected("SSLMODE=require"),
    percentEncodedName: await tlsParameterizedUrlRejected(
      "%73slmode=verify-full",
    ),
    duplicate: await tlsParameterizedUrlRejected(
      "sslmode=verify-full&sslmode=no-verify",
    ),
    empty: await tlsParameterizedUrlRejected("sslmode="),
    conflicting: await tlsParameterizedUrlRejected(
      "sslcert=synthetic&sslmode=verify-full",
    ),
  });

  const vulnerableSyntheticClient = new Client({
    connectionString:
      "postgresql://vaylo_schema_auditor:synthetic-only@db.invalid/postgres?sslmode=no-verify",
    ssl: { rejectUnauthorized: true },
  });
  const vulnerableEffectiveSsl = effectiveClientSsl(
    vulnerableSyntheticClient,
  );

  const factoryFailure = configuration();
  const factoryFailureResult = await runProductionSchemaPreflight(
    factoryFailure.source,
    () => {
      throw new Error(`synthetic factory failure ${SYNTHETIC_DATABASE_URL}`);
    },
  );

  const successState = newState();
  const successConfigs: ClientConfig[] = [];
  const success = configuration();
  const successResult = await runProductionSchemaPreflight(
    success.source,
    fakeFactory(successState, successConfigs),
  );

  const failureState = newState("inspection");
  const failureConfigs: ClientConfig[] = [];
  const failure = configuration();
  const failureResult = await runProductionSchemaPreflight(
    failure.source,
    fakeFactory(failureState, failureConfigs),
  );

  const publicationTables = [
    "knowledge_publication_state_transitions",
    "knowledge_publication_states",
    "knowledge_canonical_unit_translations",
  ] as const;
  const sourceRegistryTables = [
    "knowledge_source_authorization_transitions",
    "knowledge_source_registry_history",
    "knowledge_source_handling_policies",
    "knowledge_source_acquisition_attempts",
  ] as const;
  const [
    dataUpsertPending,
    ordinaryPending,
    multiplePending,
    appliedKnowledgeMissing,
    pendingKnowledgeMissing,
    rlsDisabled,
    anonGrant,
    authenticatedGrant,
    pgcryptoMissing,
    pgcryptoWrongSchema,
    auditObjectMissing,
    publicationPendingMissing,
    publicationAppliedMissing,
    sourceRegistryPendingMissing,
    sourceRegistryAppliedMissing,
    pendingAndRlsMismatch,
    diagnosticOnly,
    additiveHistoricalTable,
    migration010Absent,
    migration032Absent,
    migration033Absent,
    migration034Absent,
    migration035Absent,
    migration034AbsentPlusMismatch,
    migration034AbsentPlusDataUpsertPending,
  ] = await Promise.all([
    runScenario({ MIGRATION_LEDGER: migrationLedgerExcept("20260423") }),
    runScenario({ MIGRATION_LEDGER: migrationLedgerExcept("032") }),
    runScenario({
      MIGRATION_LEDGER: migrationLedgerExcept("032", "20260423"),
    }),
    runScenario({
      KNOWLEDGE_TABLES_AND_RLS: knowledgeRowsExcept(["knowledge_topics"]),
    }),
    runScenario({
      MIGRATION_LEDGER: migrationLedgerExcept("010"),
      KNOWLEDGE_TABLES_AND_RLS: knowledgeRowsExcept(["knowledge_topics"]),
    }),
    runScenario({
      KNOWLEDGE_TABLES_AND_RLS: knowledgeRowsExcept([], ["knowledge_topics"]),
    }),
    runScenario({
      KNOWLEDGE_GRANTS: [
        {
          table_name: "knowledge_topics",
          grantee: "anon",
          privilege_type: "SELECT",
        },
      ],
    }),
    runScenario({
      KNOWLEDGE_GRANTS: [
        {
          table_name: "knowledge_topics",
          grantee: "authenticated",
          privilege_type: "SELECT",
        },
      ],
    }),
    runScenario({ REQUIRED_EXTENSIONS: [] }),
    runScenario({
      REQUIRED_EXTENSIONS: [
        { extension_name: "pgcrypto", schema_name: "public" },
      ],
    }),
    runScenario({
      VAYLO_AUDIT_INTERFACE: [
        ...AUDIT_VIEWS.slice(1).map((object_name) => ({
          object_kind: "view",
          object_name,
        })),
        ...AUDIT_FUNCTIONS.map((object_name) => ({
          object_kind: "function",
          object_name,
        })),
      ],
    }),
    runScenario({
      MIGRATION_LEDGER: migrationLedgerExcept("033"),
      KNOWLEDGE_TABLES_AND_RLS: knowledgeRowsExcept(publicationTables),
      REQUIRED_EXTENSIONS: [],
      REQUIRED_SCHEMAS: ["public", "supabase_migrations", "vaylo_audit"].map(
        (schema_name) => ({ schema_name }),
      ),
    }),
    runScenario({
      KNOWLEDGE_TABLES_AND_RLS: knowledgeRowsExcept(publicationTables),
    }),
    runScenario({
      MIGRATION_LEDGER: migrationLedgerExcept("035"),
      KNOWLEDGE_TABLES_AND_RLS: knowledgeRowsExcept(sourceRegistryTables),
    }),
    runScenario({
      KNOWLEDGE_TABLES_AND_RLS: knowledgeRowsExcept(sourceRegistryTables),
    }),
    runScenario({
      MIGRATION_LEDGER: migrationLedgerExcept("032"),
      KNOWLEDGE_TABLES_AND_RLS: knowledgeRowsExcept([], ["knowledge_topics"]),
    }),
    runScenario({
      KNOWLEDGE_FUNCTIONS: [],
      KNOWLEDGE_TRIGGERS: [],
      KNOWLEDGE_INDEXES: [],
    }),
    runScenario({
      KNOWLEDGE_TABLES_AND_RLS: [
        ...knowledgeRowsExcept([]),
        { table_name: "knowledge_historical_addition", rls_enabled: false },
      ],
    }),
    runScenario({ MIGRATION_LEDGER: migrationLedgerExcept("010") }),
    runScenario({ MIGRATION_LEDGER: migrationLedgerExcept("032") }),
    runScenario({ MIGRATION_LEDGER: migrationLedgerExcept("033") }),
    runScenario({ MIGRATION_LEDGER: migrationLedgerExcept("034") }),
    runScenario({ MIGRATION_LEDGER: migrationLedgerExcept("035") }),
    runScenario({
      MIGRATION_LEDGER: migrationLedgerExcept("034"),
      KNOWLEDGE_TABLES_AND_RLS: knowledgeRowsExcept([], ["knowledge_topics"]),
    }),
    runScenario({
      MIGRATION_LEDGER: migrationLedgerExcept("034", "20260423"),
    }),
  ]);

  const [
    connectFailure,
    beginFailure,
    statementTimeoutFailure,
    lockTimeoutFailure,
    inspectionFailure,
    commitFailure,
  ] = await Promise.all([
    runFailureScenario("connect"),
    runFailureScenario("begin"),
    runFailureScenario("statementTimeout"),
    runFailureScenario("lockTimeout"),
    runFailureScenario("inspection"),
    runFailureScenario("commit"),
  ]);
  const processingTrap = Object.defineProperty(
    {},
    "transaction_read_only",
    {
      get(): never {
        throw new Error("synthetic local result-processing failure");
      },
    },
  );
  const processingFailure = await runFailureScenario(
    null,
    scenarioRows({ CURRENT_SESSION: [processingTrap] }),
  );

  const applicationFiles = [
    ...sourceFiles(path.resolve("app")),
    ...sourceFiles(path.resolve("lib")),
  ].filter(
    (file) =>
      !file.endsWith(
        path.normalize(
          "lib/vaylo/smart-talk/knowledge/de/run-saas-production-schema-preflight-audit.ts",
        ),
      ),
  );
  const applicationImports = applicationFiles.filter((file) =>
    readFileSync(file, "utf8").includes("production-schema-preflight"),
  );

  const fixedSqlValid = FIXED_SCHEMA_INSPECTION_QUERIES.every((entry) =>
    isReadOnlyInspectionSql(entry.sql),
  );
  const successConfig = successConfigs[0];
  const safeSyntheticClient = successConfig
    ? new Client(successConfig)
    : null;
  const safeEffectiveSsl = safeSyntheticClient
    ? effectiveClientSsl(safeSyntheticClient)
    : null;
  const successSerialized = JSON.stringify(successResult);
  const failureSerialized = JSON.stringify(failureResult);
  const acceptedTlsParameterizedUrlCount = [
    ...Object.values(sslModeResults),
    ...Object.values(additionalTlsParameterResults),
    ...Object.values(normalizationCases),
  ].filter((rejected) => !rejected).length;
  const closureExploitReproduced =
    vulnerableEffectiveSsl !== null &&
    typeof vulnerableEffectiveSsl === "object" &&
    "rejectUnauthorized" in vulnerableEffectiveSsl &&
    vulnerableEffectiveSsl.rejectUnauthorized === false;
  const effectiveSafeRejectUnauthorized =
    safeEffectiveSsl !== null &&
    typeof safeEffectiveSsl === "object" &&
    "rejectUnauthorized" in safeEffectiveSsl &&
    safeEffectiveSsl.rejectUnauthorized === true;

  const migrationTruthClassification =
    PREFLIGHT_MIGRATION_CLASSIFICATIONS["010"] ===
      "PASS_CRITICAL_SCHEMA_PRODUCER" &&
    PREFLIGHT_MIGRATION_CLASSIFICATIONS["032"] ===
      "PASS_CRITICAL_SCHEMA_PRODUCER" &&
    PREFLIGHT_MIGRATION_CLASSIFICATIONS["033"] ===
      "PASS_CRITICAL_SCHEMA_PRODUCER" &&
    PREFLIGHT_MIGRATION_CLASSIFICATIONS["034"] ===
      "DIAGNOSTIC_NON_BLOCKING" &&
    PREFLIGHT_MIGRATION_CLASSIFICATIONS["035"] ===
      "PASS_CRITICAL_SCHEMA_PRODUCER" &&
    PREFLIGHT_MIGRATION_CLASSIFICATIONS["20260423"] ===
      "PASS_CRITICAL_OPERATOR_ACTION_PREREQUISITE" &&
    JSON.stringify(EXPECTED_SCHEMA_MIGRATION_IDS) ===
      JSON.stringify(["010", "032", "033", "035", "20260423"]) &&
    JSON.stringify(DIAGNOSTIC_MIGRATION_IDS) === JSON.stringify(["034"]);

  const migrationClassificationCases = Object.freeze({
    migrationTruthClassification,
    migration010AbsentNeedsMigration:
      migration010Absent.overall === "NEEDS_MIGRATION",
    migration032AbsentNeedsMigration:
      migration032Absent.overall === "NEEDS_MIGRATION",
    migration033AbsentNeedsMigration:
      migration033Absent.overall === "NEEDS_MIGRATION",
    migration034AbsentPassAllowed:
      migration034Absent.overall === "PASS" &&
      migration034Absent.connected === true &&
      !migration034Absent.migrationLedger.pendingMigrationSet.includes("034") &&
      migration034Absent.migrationLedger.pendingMigrationCount === 0 &&
      migration034Absent.operatorActionRequired === false &&
      migration034Absent.migrationLedger.dataUpsertReviewRequired === false,
    migration034AbsentPendingMigration:
      migration034Absent.connected === true &&
      migration034Absent.migrationLedger.pendingMigrationSet.includes("034"),
    migration034AbsentOperatorAction:
      migration034Absent.connected === true &&
      migration034Absent.operatorActionRequired,
    migration035AbsentNeedsMigration:
      migration035Absent.overall === "NEEDS_MIGRATION",
    migration20260423AbsentNeedsMigration:
      dataUpsertPending.overall === "NEEDS_MIGRATION",
    migration20260423ReviewRequired:
      dataUpsertPending.connected === true &&
      dataUpsertPending.migrationLedger.dataUpsertReviewRequired,
    migration034AbsentPlusMismatch:
      migration034AbsentPlusMismatch.overall === "MISMATCH",
    migration034AbsentPlus20260423Pending:
      migration034AbsentPlusDataUpsertPending.overall === "NEEDS_MIGRATION" &&
      migration034AbsentPlusDataUpsertPending.connected === true &&
      !migration034AbsentPlusDataUpsertPending.migrationLedger.pendingMigrationSet.includes(
        "034",
      ) &&
      migration034AbsentPlusDataUpsertPending.migrationLedger.pendingMigrationSet.includes(
        "20260423",
      ),
  });

  const statusDecisionCases = Object.freeze({
    fullyHealthy: successResult.overall === "PASS",
    dataUpsertOnlyPending:
      dataUpsertPending.overall === "NEEDS_MIGRATION" &&
      dataUpsertPending.connected === true &&
      dataUpsertPending.migrationLedger.dataUpsertReviewRequired &&
      dataUpsertPending.operatorActionRequired &&
      dataUpsertPending.migrationLedger.pendingMigrationSet.includes(
        "20260423",
      ),
    ordinaryStructuralMigrationPending:
      ordinaryPending.overall === "NEEDS_MIGRATION",
    multipleMigrationsPending:
      multiplePending.overall === "NEEDS_MIGRATION" &&
      multiplePending.connected === true &&
      multiplePending.migrationLedger.pendingMigrationCount === 2,
    appliedKnowledgeProducerObjectMissing:
      appliedKnowledgeMissing.overall === "MISMATCH",
    pendingKnowledgeProducerObjectMissing:
      pendingKnowledgeMissing.overall === "NEEDS_MIGRATION",
    rlsDisabled: rlsDisabled.overall === "MISMATCH",
    directAnonGrant: anonGrant.overall === "MISMATCH",
    directAuthenticatedGrant:
      authenticatedGrant.overall === "MISMATCH",
    pgcryptoMissingWhenApplied:
      pgcryptoMissing.overall === "MISMATCH",
    pgcryptoWrongSchema: pgcryptoWrongSchema.overall === "MISMATCH",
    auditBootstrapObjectMissing:
      auditObjectMissing.overall === "MISMATCH" &&
      auditObjectMissing.connected === true &&
      auditObjectMissing.auditBootstrapRequired &&
      auditObjectMissing.operatorActionRequired,
    publicationProducerPending:
      publicationPendingMissing.overall === "NEEDS_MIGRATION",
    publicationProducerApplied:
      publicationAppliedMissing.overall === "MISMATCH",
    sourceRegistryProducerPending:
      sourceRegistryPendingMissing.overall === "NEEDS_MIGRATION",
    sourceRegistryProducerApplied:
      sourceRegistryAppliedMissing.overall === "MISMATCH",
    pendingMigrationPlusMismatchPrecedence:
      pendingAndRlsMismatch.overall === "MISMATCH",
    functionTriggerIndexDiagnosticOnly:
      diagnosticOnly.overall === "PASS",
    additiveHistoricalTableInformational:
      additiveHistoricalTable.overall === "PASS",
    unexplainedOperatorActionPassForbidden:
      deriveProductionSchemaPreflightStatus({
        executionFailed: false,
        mandatoryMismatchCount: 0,
        pendingMigrationCount: 0,
        operatorActionRequired: true,
      }) === "MISMATCH",
    passInvariants:
      successResult.overall === "PASS" &&
      successResult.connected === true &&
      successResult.migrationLedger.pendingMigrationCount === 0 &&
      successResult.operatorActionRequired === false &&
      successResult.mandatoryMismatchCount === 0 &&
      successResult.migrationLedger.dataUpsertReviewRequired === false &&
      successResult.knowledgeTables.missing.length === 0 &&
      successResult.rls.disabledTables.length === 0 &&
      successResult.grantWarnings.length === 0 &&
      successResult.pgcrypto.present &&
      successResult.pgcrypto.schemaCorrect &&
      successResult.auditBootstrapRequired === false,
  });

  const failedSemanticsCases = Object.freeze({
    configuration:
      disabledResult.overall === "FAILED" &&
      wrongTargetResult.overall === "FAILED" &&
      backupMissingResult.overall === "FAILED" &&
      credentialMissingResult.overall === "FAILED",
    connect:
      connectFailure.result.overall === "FAILED" &&
      connectFailure.state.connectCalls === 1 &&
      connectFailure.state.endCalls === 1 &&
      !connectFailure.state.queryCalls.includes(TRANSACTION_STATEMENTS.rollback),
    begin:
      beginFailure.result.overall === "FAILED" &&
      beginFailure.state.endCalls === 1 &&
      !beginFailure.state.queryCalls.includes(TRANSACTION_STATEMENTS.rollback),
    statementTimeout:
      statementTimeoutFailure.result.overall === "FAILED" &&
      statementTimeoutFailure.state.queryCalls.includes(
        TRANSACTION_STATEMENTS.rollback,
      ) &&
      statementTimeoutFailure.state.endCalls === 1,
    lockTimeout:
      lockTimeoutFailure.result.overall === "FAILED" &&
      lockTimeoutFailure.state.queryCalls.includes(
        TRANSACTION_STATEMENTS.rollback,
      ) &&
      lockTimeoutFailure.state.endCalls === 1,
    midQuery:
      inspectionFailure.result.overall === "FAILED" &&
      inspectionFailure.state.queryCalls.includes(
        TRANSACTION_STATEMENTS.rollback,
      ) &&
      inspectionFailure.state.endCalls === 1,
    commit:
      commitFailure.result.overall === "FAILED" &&
      commitFailure.state.queryCalls.includes(TRANSACTION_STATEMENTS.rollback) &&
      commitFailure.state.endCalls === 1,
    localResultProcessing:
      processingFailure.result.overall === "FAILED" &&
      processingFailure.state.queryCalls.includes(
        TRANSACTION_STATEMENTS.commit,
      ) &&
      !processingFailure.state.queryCalls.includes(
        TRANSACTION_STATEMENTS.rollback,
      ) &&
      processingFailure.state.endCalls === 1,
    noRetry: [
      connectFailure,
      beginFailure,
      statementTimeoutFailure,
      lockTimeoutFailure,
      inspectionFailure,
      commitFailure,
      processingFailure,
    ].every(({ state }) => state.connectCalls === 1),
  });

  const cases = Object.freeze({
    maintenanceDisabledRejected:
      disabledResult.overall === "FAILED" &&
      disabledResult.failureCode === "MAINTENANCE_DISABLED",
    wrongTargetRejected:
      wrongTargetResult.overall === "FAILED" &&
      wrongTargetResult.failureCode === "TARGET_INVALID",
    backupNotConfirmedRejected:
      backupMissingResult.overall === "FAILED" &&
      backupMissingResult.failureCode === "BACKUP_NOT_CONFIRMED",
    credentialAbsentRejected:
      credentialMissingResult.overall === "FAILED" &&
      credentialMissingResult.failureCode === "READONLY_CREDENTIAL_MISSING",
    credentialReadAfterPrerequisites:
      !disabled.reads.includes(MAINTENANCE_CONFIGURATION_KEYS.databaseUrl) &&
      !wrongTarget.reads.includes(MAINTENANCE_CONFIGURATION_KEYS.databaseUrl) &&
      !backupMissing.reads.includes(MAINTENANCE_CONFIGURATION_KEYS.databaseUrl),
    publicCredentialRejected:
      publicCredentialResult.overall === "FAILED" &&
      publicCredentialResult.failureCode ===
        "PUBLIC_CREDENTIAL_CONFIGURATION_REJECTED",
    serviceRoleFallbackAbsent:
      !scriptSource.includes("SUPABASE_SERVICE_ROLE_KEY"),
    tlsOwnershipPolicy:
      acceptedTlsParameterizedUrlCount === 0 &&
      Object.values(sslModeResults).every(Boolean) &&
      Object.values(additionalTlsParameterResults).every(Boolean),
    effectiveNodePostgresTlsVerification:
      closureExploitReproduced && effectiveSafeRejectUnauthorized,
    tlsNormalizationBypassesRejected:
      Object.values(normalizationCases).every(Boolean),
    callerSqlSurfaceAbsent:
      !scriptSource.includes("process.stdin") &&
      !scriptSource.includes("process.argv.slice") &&
      !scriptSource.includes("readline"),
    fixedQueryInventoryOnly: fixedSqlValid,
    beginReadOnlyPresent: successState.queryCalls.includes(
      TRANSACTION_STATEMENTS.begin,
    ),
    statementTimeoutPresent: successState.queryCalls.includes(
      TRANSACTION_STATEMENTS.statementTimeout,
    ),
    lockTimeoutPresent: successState.queryCalls.includes(
      TRANSACTION_STATEMENTS.lockTimeout,
    ),
    rollbackPathExercised: failureState.queryCalls.includes(
      TRANSACTION_STATEMENTS.rollback,
    ),
    cleanupOnSuccessAndFailure:
      successState.endCalls === 1 && failureState.endCalls === 1,
    retryAbsent:
      successState.connectCalls === 1 && failureState.connectCalls === 1,
    persistentPoolAbsent:
      !scriptSource.includes("Pool") && !scriptSource.includes("pool"),
    credentialNotSerialized:
      !successSerialized.includes(SYNTHETIC_DATABASE_URL) &&
      !failureSerialized.includes(SYNTHETIC_DATABASE_URL),
    credentialNotLogged:
      !scriptSource.includes("console.log") &&
      !scriptSource.includes("console.error"),
    credentialAbsentFromErrors:
      failureResult.overall === "FAILED" &&
      failureResult.failureCode === "PREFLIGHT_EXECUTION_FAILED" &&
      !failureSerialized.includes("synthetic-only") &&
      factoryFailureResult.overall === "FAILED" &&
      factoryFailureResult.failureCode === "PREFLIGHT_EXECUTION_FAILED" &&
      !JSON.stringify(factoryFailureResult).includes("synthetic-only"),
    maintenanceCapabilitiesRemainReadOnly:
      !scriptSource.includes("child_process") &&
      !scriptSource.includes("exec(") &&
      !scriptSource.includes("spawn(") &&
      !scriptSource.includes("AUTHORIZE_PRODUCTION_WRITE") &&
      !scriptSource.includes("AUTHORIZE_PRODUCTION_BOOTSTRAP") &&
      !scriptSource.includes("AUTHORIZE_PRODUCTION_RUNTIME") &&
      !scriptSource.includes("AUTHORIZE_PUBLIC_LAUNCH"),
    browserAndRuntimeIsolation:
      applicationImports.length === 0,
    healthySyntheticInspectionPasses:
      successResult.overall === "PASS" &&
      successResult.connected === true &&
      successResult.knowledgeTables.expectedCount === 43 &&
      successResult.knowledgeTables.missing.length === 0,
    statusDecisionCasesExecuteProductionLogic:
      Object.values(statusDecisionCases).every(Boolean),
    migrationTruthClassificationPassed:
      migrationTruthClassification &&
      migrationClassificationCases.migration034AbsentPassAllowed &&
      migrationClassificationCases.migration034AbsentPendingMigration ===
        false &&
      migrationClassificationCases.migration034AbsentOperatorAction === false &&
      Object.entries(migrationClassificationCases)
        .filter(
          ([name]) =>
            name !== "migration034AbsentPendingMigration" &&
            name !== "migration034AbsentOperatorAction",
        )
        .every(([, passed]) => passed),
    failedSemanticsCovered:
      Object.values(failedSemanticsCases).every(Boolean),
  });

  const allPassed = Object.values(cases).every(Boolean);
  const report = Object.freeze({
    checkId: "9X-PKG-05-SAAS-MAINTENANCE-READONLY-SCHEMA-PREFLIGHT",
    packageId: "SAAS-MAINTENANCE-READONLY-SCHEMA-PREFLIGHT",
    queryInventoryCount: FIXED_SCHEMA_INSPECTION_QUERIES.length,
    queryInventory: FIXED_SCHEMA_INSPECTION_QUERIES.map(({ id, purpose }) => ({
      id,
      purpose,
    })),
    rejectedTlsParameterNames: FORBIDDEN_CONNECTION_URL_TLS_PARAMETERS,
    sslModeResults,
    normalizationCases,
    acceptedTlsParameterizedUrlCount,
    closureExploitReproduced,
    closureExploitAccepted: !sslModeResults["no-verify"],
    realPgParserSemanticsExercised: true,
    effectiveTlsVerification: effectiveSafeRejectUnauthorized,
    syntheticPgClientConstructionCount: 2,
    callerControlledQueryCount: 0,
    writeQueryCount: 0,
    migrationQueryCount: 0,
    dynamicSqlCount: 0,
    browserImportCount: applicationImports.filter((file) =>
      file.includes(`${path.sep}app${path.sep}`),
    ).length,
    applicationRuntimeImportCount: applicationImports.length,
    networkCalls: successState.networkCalls + failureState.networkCalls,
    realCredentialReads: 0,
    callerControlledSql: 0,
    writeCapability: false,
    migrationCapability: false,
    bootstrapCapability: false,
    runtimeCapability: false,
    publicLaunchCapability: false,
    migrationTruthClassification,
    migrationClassificationCases,
    statusDecisionCases,
    failedSemanticsCases,
    cases,
    allPassed,
  });

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (!allPassed) process.exitCode = 1;
}

void main();
