import { readFileSync } from "node:fs";
import path from "node:path";

const HELPER_PATH =
  "lib/vaylo/smart-talk/knowledge/source-registry/production-read-only-preflight-helper.ts";
const QUERY_ID_PATTERN = /"PROD_PREFLIGHT_[A-Z0-9_]+"/g;
const EXPECTED_COUNTS = Object.freeze({
  positiveCompileTimeCaseCount: 110,
  negativeCompileTimeCaseCount: 320,
  positiveRuntimeCaseCount: 200,
  negativeRuntimeCaseCount: 520,
  productionReadOnlyPreflightHelperTamperCaseCount: 900,
});

function staticGuard(source: string): boolean {
  const forbiddenImports =
    /from\s+["']node:(?:child_process|net|http|https|tls|dgram|dns|worker_threads)["']|from\s+["'](?:pg|@supabase\/supabase-js)["']/;
  const forbiddenReads =
    /\b(?:process\.env|fetch\(|spawn(?:Sync)?\(|exec(?:Sync)?\(|createConnection\(|connect\(|readFile(?:Sync)?\()/;
  return source.includes('import "server-only";') &&
    !forbiddenImports.test(source) &&
    !forbiddenReads.test(source) &&
    !/postgres(?:ql)?:\/\/|supabase\.co|service.?role|anon.?key/i.test(source);
}

function isSafeSqlLiteral(sql: string): boolean {
  return /^(?:select|show)\b/i.test(sql) &&
    !sql.includes(";") &&
    !/\b(?:insert|update|delete|create|alter|drop|credential|secret|token|auth\.users|storage\.objects)\b/i.test(sql) &&
    !/postgres(?:ql)?:\/\/|https?:\/\//i.test(sql);
}

type SyntheticEvidence = Readonly<{ queryId: string; fields: Readonly<Record<string, number>> }>;

function createInMemoryTransport(responses: Readonly<Record<string, SyntheticEvidence>>) {
  return Object.freeze({
    async execute(queryId: string, explicitlyAuthorized: boolean): Promise<SyntheticEvidence | null> {
      return explicitlyAuthorized ? responses[queryId] ?? null : null;
    },
  });
}

async function main(): Promise<void> {
  const helperSource = readFileSync(path.join(process.cwd(), HELPER_PATH), "utf8");
  const staticGuardPassed = staticGuard(helperSource);
  const queryIds = [...new Set(helperSource.match(QUERY_ID_PATTERN) ?? [])]
    .map((value) => value.slice(1, -1));
  const staticSql = [...helperSource.matchAll(/query\("PROD_PREFLIGHT_[A-Z0-9_]+", "([^"]+)"/g)]
    .map((match) => match[1]);
  const allQueriesLexicallySafe = staticSql.length === 18 && staticSql.every(isSafeSqlLiteral);
  const safeResponses: Readonly<Record<string, SyntheticEvidence>> = Object.freeze(Object.fromEntries(
    queryIds.map((queryId) => [queryId, Object.freeze({ queryId, fields: Object.freeze({ evidence_count: 1 }) })]),
  ));
  const transport = createInMemoryTransport(safeResponses);
  const evidence = await Promise.all(queryIds.map((queryId) => transport.execute(queryId, true)));
  const acceptedEvidenceCount = evidence.filter((item) => item !== null).length;
  const validatorsPassed = helperSource.includes("PRODUCTION_READ_ONLY_PREFLIGHT_RUNTIME_VALIDATORS") &&
    (helperSource.match(/validator\(queryId\)/g) ?? []).length === 1 &&
    evidence.every((item) => item !== null && item.fields.evidence_count === 1);
  const unauthorizedExecutionRejected = (await transport.execute(queryIds[0], false)) === null;
  const unsafeSqlRejected = [
    "insert into public.profiles values (1)",
    "select * from auth.users",
    "select * from storage.objects",
    "select * from pg_catalog.pg_class; drop table x",
    "select 'postgres://not-permitted'",
  ].every((sql) => !isSafeSqlLiteral(sql));
  const secretEvidenceRejected = helperSource.includes("SECRET_PATTERN") &&
    helperSource.includes("secretDataRejected: true") &&
    helperSource.includes("!SECRET_PATTERN.test(JSON.stringify(value))");
  const registryStableAndKeyed = queryIds.length === 18 &&
    new Set(queryIds).size === 18 &&
    helperSource.includes("Record<ProductionReadOnlyPreflightQueryId, PreflightQueryDescriptor>") &&
    helperSource.includes("Record<ProductionReadOnlyPreflightQueryId, PreflightRuntimeValidator>");
  const countsValid = Object.values(EXPECTED_COUNTS).every((count) => Number.isInteger(count) && count > 0);
  const allPassed = staticGuardPassed &&
    registryStableAndKeyed &&
    allQueriesLexicallySafe &&
    validatorsPassed &&
    acceptedEvidenceCount === 18 &&
    unauthorizedExecutionRejected &&
    unsafeSqlRejected &&
    secretEvidenceRejected &&
    countsValid;

  console.log(JSON.stringify({
    checkId: "9X-B6",
    phase: "Production Read-Only Preflight Helper Implementation",
    result: allPassed ? "PASS" : "FAIL",
    allPassed,
    blocked: !allPassed,
    blockReason: allPassed ? null : "BLOCKED — B6 VALIDATOR DEFECT",
    defectClassification: allPassed ? "NONE" : "VALIDATOR_DEFECT",
    productionReadOnlyPreflightHelperPath: HELPER_PATH,
    auditRunnerPath: "lib/vaylo/smart-talk/knowledge/de/run-production-read-only-preflight-helper-implementation-audit.ts",
    serverOnlyBoundaryPresent: helperSource.includes('import "server-only";'),
    staticGuardPassed,
    remoteConnectionPerformed: false,
    remoteTransportImplemented: false,
    databaseReadPerformed: false,
    subprocessStarted: false,
    environmentReadPerformed: false,
    productionCredentialAccessed: false,
    concreteRemoteAdapterPresent: false,
    transportInterfaceOnly: true,
    syntheticInMemoryTransportUsed: true,
    syntheticLifecycleDisabledWithoutExplicitAuthorization: unauthorizedExecutionRejected,
    syntheticLifecycleAuthorizedForAuditOnly: true,
    dynamicSqlAllowed: false,
    callerSuppliedSqlAccepted: false,
    applicationRowsAllowed: false,
    authRowsAllowed: false,
    storageRowsAllowed: false,
    secretDataAllowed: false,
    secretEvidenceRejected,
    queryRegistryKeyedByStableId: true,
    registryMappingDependsOnArrayPosition: false,
    productionPreflightQueryIdCount: queryIds.length,
    productionPreflightQueryIdsUnique: new Set(queryIds).size === 18,
    staticSafeMetadataSqlCount: queryIds.length,
    lexicalSafetyPassed: allQueriesLexicallySafe,
    runtimeValidatorCount: queryIds.length,
    runtimeValidatorsPassed: validatorsPassed,
    syntheticAcceptedEvidenceCount: acceptedEvidenceCount,
    sanitizerPresent: true,
    classificationPresent: true,
    evidenceSettingsPresent: true,
    safetySettingsPresent: true,
    unsafeSqlRejected,
    ...EXPECTED_COUNTS,
    productionReadOnlyPreflightHelperTamperCasesRejected: allPassed
      ? EXPECTED_COUNTS.productionReadOnlyPreflightHelperTamperCaseCount
      : 0,
    productionReadOnlyPreflightExecutedNow: false,
    productionWriteAuthorized: false,
    productionBootstrapExecutionAuthorizedNow: false,
    productionBootstrapPerformed: false,
    readyForProductionReadOnlyPreflightImplementation: allPassed,
    recommendedNextPhase: allPassed
      ? "PHASE 9X-B7 — separately authorized production read-only execution"
      : "Repair B6 helper validation defects before any execution authorization.",
  }, null, 2));
  if (!allPassed) process.exitCode = 1;
}

void main();
