import { readFileSync } from "node:fs";
import path from "node:path";

import {
  buildBerlinServiceAreaPack,
  buildBremenServiceAreaPack,
} from "./anmeldung-city-state-service-area-packs";
import {
  CITY_STATE_INGESTION_ENV,
  CITY_STATE_INGESTION_OPERATION,
  CITY_STATE_INGESTOR,
  CITY_STATE_INSPECTION_SQL,
  CITY_STATE_ORDER,
  CITY_STATE_PACKS,
  CITY_STATE_RPC,
  configurationFromCityStateIngestionEnvironment,
  runCityStateProductionIngestion,
  type CityStateClientFactory,
  type CityStateIngestionConfiguration,
} from "./production-city-state-service-area-ingestion";

const ROOT = process.cwd();
const PROJECT_REF = "cdztcnfjxheudqhvepbq";
const HOST = "aws-0-eu-central-1.pooler.supabase.com";
const PASSWORD = "city-state-audit-secret";

function configuration(authorizedForApply: boolean): CityStateIngestionConfiguration {
  return Object.freeze({
    target: "local-disposable-proof",
    connectionString: "postgresql://local-disposable-proof.invalid/postgres",
    host: "127.0.0.1",
    port: 5432,
    database: "postgres",
    projectRef: PROJECT_REF,
    expectedWriter: CITY_STATE_INGESTOR,
    verifiedTls: false,
    authorizedForApply,
  });
}

function state(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    database: "postgres",
    writer: CITY_STATE_INGESTOR,
    superuser: false,
    create_db: false,
    create_role: false,
    replication: false,
    bypass_rls: false,
    database_owner: false,
    memberships: 0,
    schema_create: false,
    direct_dml: false,
    execute_g4: true,
    security_definer: true,
    fixed_search_path: true,
    migration043: true,
    berlin_present: false,
    bremen_present: false,
    ...overrides,
  };
}

function fakeFactory(
  inspection: Record<string, unknown>,
  trace: string[],
  failRpc = false,
): CityStateClientFactory {
  return () => ({
    connect: async () => { trace.push("CONNECT"); },
    query: async (sql, values) => {
      trace.push(sql);
      if (sql === CITY_STATE_INSPECTION_SQL) return { rows: [inspection] };
      if (sql.includes("knowledge_ingest_curated_service_area_pack($1::jsonb)")) {
        if (failRpc) throw new Error("fixture RPC failure");
        const payload = values?.[0] as Record<string, unknown>;
        const packId = String(payload.packId);
        const semanticCreated =
          packId === CITY_STATE_PACKS.berlin.packId && inspection.berlin_present !== true
            ? 15
            : packId === CITY_STATE_PACKS.bremen.packId
                && inspection.bremen_present !== true
              ? 16
              : 0;
        return { rows: [{
          result: {
            schemaVersion: 1,
            packId: payload.packId,
            domain: payload.domain,
            semanticCreated,
          },
        }] };
      }
      return { rows: [] };
    },
    end: async () => { trace.push("END"); },
  });
}

function rejected(report: Readonly<Record<string, unknown>>, code: string): boolean {
  return report.result === "REJECTED" && report.failureCode === code;
}

function environment(): Record<string, string | undefined> {
  return {
    [CITY_STATE_INGESTION_ENV.enabled]: "true",
    [CITY_STATE_INGESTION_ENV.target]: "production",
    [CITY_STATE_INGESTION_ENV.authorization]: CITY_STATE_INGESTION_OPERATION,
    [CITY_STATE_INGESTION_ENV.databaseUrl]:
      `postgresql://${CITY_STATE_INGESTOR}.${PROJECT_REF}:${PASSWORD}@${HOST}/postgres`,
    [CITY_STATE_INGESTION_ENV.databaseName]: "postgres",
    [CITY_STATE_INGESTION_ENV.writer]: CITY_STATE_INGESTOR,
    [CITY_STATE_INGESTION_ENV.expectedHost]: HOST,
    [CITY_STATE_INGESTION_ENV.projectRef]: PROJECT_REF,
    NODE_EXTRA_CA_CERTS: "local-audit-ca.pem",
  };
}

async function main(): Promise<void> {
  const checks: Record<string, boolean> = {};
  const executorSource = readFileSync(path.join(
    ROOT, "lib/vaylo/smart-talk/knowledge/packs/de/"
      + "anmeldung-ummeldung-abmeldung/production-city-state-service-area-ingestion.ts",
  ), "utf8");
  const cliSource = readFileSync(path.join(
    ROOT, "scripts/run-production-city-state-ingestion.ts",
  ), "utf8");
  const sourceModule = readFileSync(path.join(
    ROOT, "lib/vaylo/smart-talk/knowledge/packs/de/"
      + "anmeldung-ummeldung-abmeldung/anmeldung-city-state-service-area-packs.ts",
  ), "utf8");

  checks.C01 = JSON.stringify(CITY_STATE_ORDER) === '["berlin","bremen","hamburg"]'
    && JSON.stringify(Object.keys(CITY_STATE_PACKS)) === '["berlin","bremen","hamburg"]';
  checks.C02 = executorSource.includes('from "./anmeldung-city-state-service-area-packs"')
    && sourceModule.includes("Bremerhaven AGS 04012000 is excluded");
  checks.C03 = CITY_STATE_RPC
    === "public.knowledge_ingest_curated_service_area_pack(jsonb)"
    && !executorSource.includes("knowledge_ingest_curated_pack($1")
    && !executorSource.includes("knowledge_ingest_curated_locality_pack($1");
  checks.C04 = !/--payload|--path|--file|--jurisdiction|--ags|--sql|stdin/iu
    .test(cliSource);
  checks.C05 = /^--city=\(berlin\|bremen\|hamburg\)\$$/mu.test(cliSource)
    || cliSource.includes("/^--city=(berlin|bremen|hamburg)$/");
  checks.C06 = executorSource.includes("rejectUnauthorized: true")
    && !executorSource.includes("rejectUnauthorized: false");

  const validateTrace: string[] = [];
  const validate = await runCityStateProductionIngestion(
    configuration(true), "berlin", "validate",
    fakeFactory(state(), validateTrace),
  );
  checks.C07 = validate.result === "PASS" && validate.rpcInvoked === false
    && validate.mutationCount === 0 && !validateTrace.includes("BEGIN")
    && !validateTrace.some((sql) =>
      sql.includes("knowledge_ingest_curated_service_area_pack($1::jsonb)"));

  const unauthorized = await runCityStateProductionIngestion(
    configuration(false), "berlin", "apply",
    () => { throw new Error("must not construct client"); },
  );
  checks.C08 = rejected(unauthorized, "AUTHORIZATION_REQUIRED")
    && unauthorized.connectionAttempted === false;

  const before043 = await runCityStateProductionIngestion(
    configuration(true), "berlin", "validate",
    fakeFactory(state({ migration043: false }), []),
  );
  checks.C09 = rejected(
    before043, "INGESTOR_PRIVILEGE_OR_PREREQUISITE_MISMATCH",
  );
  const hbBeforeBe = await runCityStateProductionIngestion(
    configuration(true), "bremen", "apply",
    fakeFactory(state(), []),
  );
  checks.C10 = rejected(hbBeforeBe, "CITY_STATE_ORDER_MISMATCH")
    && hbBeforeBe.transactionRolledBack === true;
  const hhBeforeHb = await runCityStateProductionIngestion(
    configuration(true), "hamburg", "apply",
    fakeFactory(state({ berlin_present: true }), []),
  );
  checks.C11 = rejected(hhBeforeHb, "CITY_STATE_ORDER_MISMATCH")
    && hhBeforeHb.transactionRolledBack === true;
  const hbValid = await runCityStateProductionIngestion(
    configuration(true), "bremen", "validate",
    fakeFactory(state({ berlin_present: true }), []),
  );
  const hhValid = await runCityStateProductionIngestion(
    configuration(true), "hamburg", "validate",
    fakeFactory(state({ berlin_present: true, bremen_present: true }), []),
  );
  checks.C12 = hbValid.result === "PASS" && hhValid.result === "PASS";

  const wrongRole = await runCityStateProductionIngestion(
    configuration(true), "berlin", "validate",
    fakeFactory(state({ writer: "postgres" }), []),
  );
  checks.C13 = rejected(
    wrongRole, "INGESTOR_PRIVILEGE_OR_PREREQUISITE_MISMATCH",
  );
  const privileged = await runCityStateProductionIngestion(
    configuration(true), "berlin", "validate",
    fakeFactory(state({ superuser: true, direct_dml: true }), []),
  );
  checks.C14 = rejected(
    privileged, "INGESTOR_PRIVILEGE_OR_PREREQUISITE_MISMATCH",
  );

  const substitution = await runCityStateProductionIngestion(
    configuration(true), "berlin", "validate",
    () => { throw new Error("must not construct client"); },
    () => buildBremenServiceAreaPack(),
  );
  checks.C15 = rejected(substitution, "FIXED_PACK_INVALID")
    && substitution.connectionAttempted === false;
  const bremerhavenPack = structuredClone(
    buildBerlinServiceAreaPack(),
  ) as unknown as Record<string, unknown>;
  const bremerhavenJurisdictions =
    bremerhavenPack.jurisdictions as Record<string, unknown>[];
  bremerhavenJurisdictions[bremerhavenJurisdictions.length - 1]!.code = "04012000";
  const bremerhavenSubstitution = await runCityStateProductionIngestion(
    configuration(true), "berlin", "validate",
    () => { throw new Error("must not construct client"); },
    () => bremerhavenPack as never,
  );
  checks.C16 = rejected(bremerhavenSubstitution, "FIXED_PACK_INVALID")
    && bremerhavenSubstitution.connectionAttempted === false;

  const failureTrace: string[] = [];
  const failure = await runCityStateProductionIngestion(
    configuration(true), "berlin", "apply",
    fakeFactory(state(), failureTrace, true),
  );
  checks.C17 = rejected(failure, "EXECUTION_FAILED")
    && failure.transactionRolledBack === true
    && failureTrace.includes("ROLLBACK") && !failureTrace.includes("COMMIT")
    && failureTrace.filter((item) =>
      item.includes("knowledge_ingest_curated_service_area_pack($1::jsonb)"))
      .length === 1;

  const applyTrace: string[] = [];
  const apply = await runCityStateProductionIngestion(
    configuration(true), "berlin", "apply",
    fakeFactory(state(), applyTrace),
  );
  checks.C18 = apply.result === "PASS" && apply.transactionCommitted === true
    && applyTrace.filter((item) =>
      item.includes("knowledge_ingest_curated_service_area_pack($1::jsonb)"))
      .length === 1;

  const validEnvironment = environment();
  const accepts = (env: Record<string, string | undefined>) =>
    "target" in configurationFromCityStateIngestionEnvironment(env);
  const rejects = (env: Record<string, string | undefined>) => !accepts(env);
  checks.C19 = accepts(validEnvironment);
  checks.C20 = rejects({
    ...validEnvironment, [CITY_STATE_INGESTION_ENV.writer]: "postgres",
  });
  checks.C21 = rejects({
    ...validEnvironment, [CITY_STATE_INGESTION_ENV.projectRef]: "aaaaaaaaaaaaaaaaaaaa",
  }) && rejects({
    ...validEnvironment, [CITY_STATE_INGESTION_ENV.expectedHost]: "wrong.example",
  });
  checks.C22 = rejects({
    ...validEnvironment,
    [CITY_STATE_INGESTION_ENV.databaseUrl]:
      `${validEnvironment[CITY_STATE_INGESTION_ENV.databaseUrl]}?sslmode=disable`,
  });
  checks.C23 = rejects({
    ...validEnvironment, [CITY_STATE_INGESTION_ENV.forbiddenPublicUrl]: "forbidden",
  });
  const wrongAuthorization = configurationFromCityStateIngestionEnvironment({
    ...validEnvironment, [CITY_STATE_INGESTION_ENV.authorization]: "WRONG",
  });
  checks.C24 = "target" in wrongAuthorization
    && wrongAuthorization.authorizedForApply === false;
  checks.C25 = !/PUBLIC_RUNTIME_AUTHORIZED\s*=\s*true|NEXT_PUBLIC_SUPABASE/iu
    .test(executorSource + cliSource);
  checks.C26 = !cliSource.includes("Promise.all")
    && (cliSource.match(/runCityStateProductionIngestion/gu)?.length ?? 0) === 2;
  const encoded = JSON.stringify([
    validate, unauthorized, before043, hbBeforeBe, hhBeforeHb, failure, apply,
  ]);
  checks.C27 = !encoded.includes(PASSWORD) && !encoded.includes("postgresql://")
    && [validate, unauthorized, failure, apply]
      .every((item) => item.secretsPrinted === false);

  const allPassed = Object.values(checks).every(Boolean);
  process.stdout.write(`${JSON.stringify({
    phaseResult: allPassed ? "PASS" : "FAILED",
    operationId: CITY_STATE_INGESTION_OPERATION,
    allowedPacks: CITY_STATE_PACKS,
    checks,
    productionConnectionAttempted: false,
    productionIngestionAttempted: false,
    publicRuntimeAuthorized: false,
    allPassed,
  }, null, 2)}\n`);
  if (!allPassed) process.exitCode = 1;
}

void main().catch(() => {
  process.stderr.write(
    '{"phaseResult":"FAILED","message":"CITY_STATE_OPERATIONS_AUDIT_FAILED"}\n',
  );
  process.exitCode = 1;
});
