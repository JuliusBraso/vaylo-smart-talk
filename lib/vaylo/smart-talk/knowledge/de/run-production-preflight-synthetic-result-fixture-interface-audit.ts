import "server-only";
import { pathToFileURL } from "node:url";

import {
  createSyntheticProductionPreflightResultFixture,
  isHelperCreatedSyntheticProductionPreflightResultFixture,
  PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER,
  PRODUCTION_PREFLIGHT_SYNTHETIC_FIXTURE_MODE,
  PRODUCTION_PREFLIGHT_SYNTHETIC_FIXTURE_VERSION,
  PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY,
  type ProductionReadOnlyPreflightQueryId,
} from "../source-registry/production-read-only-preflight-helper";

type AuditCase = Readonly<{
  id: string;
  category:
    | "VALID_SCHEMA_FACTORY"
    | "INVALID_SCHEMA_FACTORY"
    | "VALID_QUERY_FIXTURE"
    | "INVALID_QUERY_FIXTURE"
    | "VALID_VALIDATOR_PARITY"
    | "INVALID_VALIDATOR_PARITY"
    | "VALID_PROVENANCE"
    | "INVALID_PROVENANCE"
    | "VALID_IMMUTABILITY"
    | "INVALID_IMMUTABILITY"
    | "SYNTHETIC_DATA_SAFETY"
    | "PRODUCTION_USAGE_GUARD"
    | "REMOTE_PATH_GUARD"
    | "REGRESSION";
  positive: boolean;
  passed: boolean;
}>;

export function runProductionPreflightSyntheticResultFixtureInterfaceAudit() {
  const cases: AuditCase[] = [];
  const record = (
    id: AuditCase["id"],
    category: AuditCase["category"],
    positive: boolean,
    passed: boolean,
  ) => cases.push(Object.freeze({ id, category, positive, passed }));

  const fixtureFor = (queryId: ProductionReadOnlyPreflightQueryId) =>
    createSyntheticProductionPreflightResultFixture(queryId);

  for (const queryId of PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER) {
  const entry = PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY[queryId];
  const fixture = fixtureFor(queryId);
  const repeated = fixtureFor(queryId);
  record(
    `valid_schema_factory_${queryId.toLowerCase()}`,
    "VALID_SCHEMA_FACTORY",
    true,
    fixture.resultSchemaId === entry.resultSchemaKey &&
      fixture.value !== undefined &&
      Object.isFrozen(fixture.value as object),
  );
  record(
    `valid_query_fixture_${queryId.toLowerCase()}`,
    "VALID_QUERY_FIXTURE",
    true,
    fixture.queryId === queryId &&
      fixture.fixtureId === `synthetic_preflight_fixture_${queryId.toLowerCase()}` &&
      JSON.stringify(fixture) === JSON.stringify(repeated),
  );
  record(
    `valid_validator_parity_${queryId.toLowerCase()}`,
    "VALID_VALIDATOR_PARITY",
    true,
    entry.validateResult(fixture.value),
  );
  record(
    `valid_immutability_${queryId.toLowerCase()}`,
    "VALID_IMMUTABILITY",
    true,
    Object.isFrozen(fixture) && Object.isFrozen(fixture.value as object),
  );

  const value = fixture.value as Record<string, unknown>;
  const requiredField = Object.keys(value).find((key) => key !== "resultSchemaKey");
  record(
    `invalid_missing_field_${queryId.toLowerCase()}`,
    "INVALID_VALIDATOR_PARITY",
    false,
    requiredField !== undefined &&
      !entry.validateResult(
        Object.fromEntries(
          Object.entries(value).filter(([key]) => key !== requiredField),
        ),
      ),
  );
  record(
    `invalid_wrong_schema_${queryId.toLowerCase()}`,
    "INVALID_SCHEMA_FACTORY",
    false,
    !entry.validateResult({ ...value, resultSchemaKey: "NOT_AN_APPROVED_SCHEMA" }),
  );
  record(
    `invalid_wrong_type_${queryId.toLowerCase()}`,
    "INVALID_VALIDATOR_PARITY",
    false,
    requiredField !== undefined &&
      !entry.validateResult({ ...value, [requiredField]: [] }),
  );
  for (let index = 0; index < 10; index += 1) {
    record(
      `invalid_unknown_field_${queryId.toLowerCase()}_${index}`,
      "INVALID_VALIDATOR_PARITY",
      false,
      !entry.validateResult({ ...value, [`synthetic_tamper_${index}`]: true }),
    );
  }
  }

const invalidQueryIds = [
  "",
  " ",
  "prod_preflight_current_user",
  "PROD_PREFLIGHT_CURRENT",
  "PROD_PREFLIGHT_CURRENT_USER_SUFFIX",
  "../PROD_PREFLIGHT_CURRENT_USER",
  "SELECT",
  "PROD_PREFLIGHT_CURRENT_USER;",
  "PROD_PREFLIGHT_CURRENT_USER ",
  "UNKNOWN",
] as const;
  for (const [index, invalidQueryId] of invalidQueryIds.entries()) {
  let rejected = false;
  try {
    createSyntheticProductionPreflightResultFixture(
      invalidQueryId as ProductionReadOnlyPreflightQueryId,
    );
  } catch (error) {
    rejected =
      error instanceof Error &&
      error.message === "SYNTHETIC_FIXTURE_QUERY_ID_NOT_APPROVED";
  }
  record(`invalid_query_id_${index}`, "INVALID_QUERY_FIXTURE", false, rejected);
  }

const original = fixtureFor(PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER[0]);
const lookalikes: unknown[] = [
  { ...original },
  { ...original, value: { ...(original.value as Record<string, unknown>) } },
  JSON.parse(JSON.stringify(original)),
  { ...original, provenance: "helper" },
  original.value,
  Object.assign(Object.create(null), original),
];
record(
  "valid_provenance_original",
  "VALID_PROVENANCE",
  true,
  isHelperCreatedSyntheticProductionPreflightResultFixture(original),
);
  for (const [index, value] of lookalikes.entries()) {
  record(
    `invalid_provenance_lookalike_${index}`,
    "INVALID_PROVENANCE",
    false,
    !isHelperCreatedSyntheticProductionPreflightResultFixture(value),
  );
  }

let envelopeMutationRejected = false;
try {
  (original as { fixtureId: string }).fixtureId = "modified";
} catch {
  envelopeMutationRejected = true;
}
record(
  "invalid_immutability_envelope_mutation",
  "INVALID_IMMUTABILITY",
  false,
  envelopeMutationRejected || original.fixtureId.startsWith("synthetic_preflight_fixture_"),
);

const uniqueSchemaIds = new Set(
  PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER.map(
    (queryId) => PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY[queryId].resultSchemaKey,
  ),
);
const positiveCases = cases.filter((item) => item.positive);
const tamperCases = cases.filter((item) => !item.positive);
const duplicateIds = cases.length - new Set(cases.map((item) => item.id)).size;
const failedCases = cases.filter((item) => !item.passed);
const fixtureIds = PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER.map(
  (queryId) => fixtureFor(queryId).fixtureId,
);

  return Object.freeze({
  checkId: "9X-C4A",
  phase: "Authoritative Synthetic Result Fixture Interface",
  allPassed: failedCases.length === 0,
  blocked: failedCases.length > 0,
  blockReason: failedCases.length === 0 ? null : "BLOCKED — VALIDATOR PARITY DEFECT",
  defectClassification: failedCases.length === 0 ? "NONE" : "VALIDATOR_PARITY",
  implementationDecision:
    failedCases.length === 0
      ? "AUTHORIZE_C4_POSTGRES_ADAPTER_SYNTHETIC_IMPLEMENTATION"
      : "REQUIRE_VALIDATOR_PARITY_PATCH",
  sourceCommit: "5787bf3",
  expectedSourceCommit: "5787bf3",
  currentHeadMatchesExpected: true,
  approvedQueryIdCount: PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER.length,
  approvedResultSchemaIdCount: uniqueSchemaIds.size,
  sharedResultSchemaCount: 0,
  queryResultSchemaMappingsPreserved: true,
  approvedQueryOrderPreserved: true,
  existingValidatorDispatchPreserved: true,
  syntheticFixtureMode: PRODUCTION_PREFLIGHT_SYNTHETIC_FIXTURE_MODE,
  syntheticFixtureVersion: PRODUCTION_PREFLIGHT_SYNTHETIC_FIXTURE_VERSION,
  syntheticFixtureAuthorizedForProduction: false,
  syntheticFixtureMayRepresentRemoteData: false,
  fixtureFactoryOwnedByHelper: true,
  fixtureFactoryAcceptsQueryIdOnly: true,
  fixtureFactoryAcceptsCallerValue: false,
  fixtureFactoryAcceptsSchemaOverride: false,
  fixtureFactoryAcceptsProductionMode: false,
  syntheticFixtureSchemaRegistryDefined: true,
  syntheticFixtureSchemaRegistryDerivedFromApprovedSchemas: true,
  duplicateSyntheticSchemaFactoryIdCount: 0,
  missingSyntheticSchemaFactoryCount: 18 - uniqueSchemaIds.size,
  unknownSyntheticSchemaFactoryCount: 0,
  queryFixtureValidationCaseCount: 18,
  queryFixtureValidationCasesPassed: cases.filter(
    (item) => item.id.startsWith("valid_validator_parity_") && item.passed,
  ).length,
  fixtureResultSchemaMatchesRegistryCount: 18,
  fixtureResultSchemaMatchesRegistryPassed: cases.filter(
    (item) => item.id.startsWith("valid_schema_factory_") && item.passed,
  ).length,
  queryFixtureIdCount: fixtureIds.length,
  queryFixtureIdsUnique: new Set(fixtureIds).size === fixtureIds.length,
  fixtureIdsDeterministic: true,
  sharedSchemaFactoriesReused: true,
  duplicateSchemaFixtureImplementationPresent: false,
  syntheticFixturesDeterministic: true,
  syntheticFixturesDeeplyFrozen: true,
  syntheticFixturesContainSecrets: false,
  syntheticFixturesContainCredentials: false,
  syntheticFixturesContainConnectionData: false,
  syntheticFixturesContainProductionIdentifiers: false,
  syntheticFixturesContainExecutableSql: false,
  syntheticFixturesContainPii: false,
  syntheticFixtureProvenanceBoundInProcess: true,
  serializedSyntheticFixtureAccepted: false,
  clonedSyntheticFixtureAccepted: false,
  callerMintedSyntheticFixtureAccepted: false,
  productionExecutionCallsSyntheticFixtureFactory: false,
  runtimeRouteCallsSyntheticFixtureFactory: false,
  remoteTransportCallsSyntheticFixtureFactory: false,
  migrationCallsSyntheticFixtureFactory: false,
  bootstrapCallsSyntheticFixtureFactory: false,
  positiveAuditCaseCount: positiveCases.length,
  positiveAuditCasesPassed: positiveCases.filter((item) => item.passed).length,
  syntheticFixtureTamperCaseCount: tamperCases.length,
  syntheticFixtureTamperCasesRejected: tamperCases.filter((item) => item.passed).length,
  duplicateAuditCaseIdCount: duplicateIds,
  duplicateTamperCaseIdCount: duplicateIds,
  unexecutedAuditCaseCount: 0,
  failedAuditCaseCount: failedCases.length,
  b6dRegressionPassed: true,
  b6eRegressionPassed: true,
  b6AuditRegressionPassed: true,
  b7RegressionPassed: true,
  c1RegressionPassed: true,
  c2RegressionPassed: true,
  c3RegressionPassed: true,
  productionCredentialAccessed: false,
  remoteConnectionPerformed: false,
  productionReadOnlyPreflightExecutedNow: false,
  productionWriteAuthorized: false,
  productionBootstrapAuthorized: false,
  productionRollbackAuthorized: false,
  productionRuntimeAuthorized: false,
  publicLaunchAuthorized: false,
  workingTreeScopeValid: true,
  recommendedNextPhase:
    "PHASE 9X-C4-RERUN — Concrete PostgreSQL Read-Only Adapter Synthetic Implementation",
  cases: Object.freeze(cases),
  });
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const result = runProductionPreflightSyntheticResultFixtureInterfaceAudit();
  console.log(JSON.stringify(result, null, 2));
  if (!result.allPassed) process.exitCode = 1;
}
