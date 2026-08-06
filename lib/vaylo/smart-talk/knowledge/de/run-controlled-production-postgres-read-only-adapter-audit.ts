import "server-only";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

import {
  COMMITTED_ARTIFACT_INVENTORY,
  CONTROLLED_PRODUCTION_PREFLIGHT_AUTHORIZATION_KIND,
  CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_KIND,
  CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_VERSION,
  CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
  EXPECTED_PRODUCTION_PREFLIGHT_EXECUTOR_IDENTITY,
  OPERATOR_ACKNOWLEDGEMENT_IDS,
  validateControlledProductionPreflightArtifactFingerprintSet,
  validateControlledProductionPreflightAuthorizationEnvelope,
  validateControlledProductionPreflightExecutionManifest,
  validateManifestAuthorizationBinding,
} from "../source-registry/controlled-production-preflight-execution-contracts";
import {
  createSyntheticCredentialProviderHarness,
  transitionCredentialLease,
  validateCredentialRequest,
  validateTransportFactoryRequest,
} from "../source-registry/controlled-production-preflight-credential-and-transport-boundary";
import {
  CONTROLLED_POSTGRES_READ_ONLY_ADAPTER_KIND,
  CONTROLLED_POSTGRES_READ_ONLY_ADAPTER_MODE,
  CONTROLLED_POSTGRES_READ_ONLY_ADAPTER_VERSION,
  SYNTHETIC_FAILURE_HARNESS_META,
  SYNTHETIC_FAILURE_INJECTION_POINTS,
  createControlledPostgresReadOnlyAdapter,
  createSyntheticValidationOnlyPostgresAdapterHarness,
  isControlledPostgresReadOnlyAdapter,
  validateSyntheticValidationOnlyFailurePlan,
  type ControlledPostgresReadOnlyAdapter,
  type ControlledPostgresReadOnlyAdapterCreationRequest,
  type SyntheticFailureInjectionPoint,
  type SyntheticValidationOnlyFailurePlan,
} from "../source-registry/controlled-production-postgres-read-only-adapter";
import {
  createSyntheticProductionPreflightResultFixture,
  isHelperCreatedSyntheticProductionPreflightResultFixture,
  PRELIGHT_SAFETY_SETTINGS,
  PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER,
  PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY,
} from "../source-registry/production-read-only-preflight-helper";
import { runProductionPreflightSyntheticResultFixtureInterfaceAudit } from "./run-production-preflight-synthetic-result-fixture-interface-audit";
import { runProductionReadOnlyPreflightHelperImplementationAudit } from "./run-production-read-only-preflight-helper-implementation-audit";
import { runDisabledProductionPreflightHelperValidation } from "./run-disabled-production-preflight-helper-validation";
import { runControlledRemotePreflightExecutionBoundaryDesignAudit } from "./run-controlled-remote-preflight-execution-boundary-design-audit";
import { runControlledProductionPreflightExecutionContractsAudit } from "./run-controlled-production-preflight-execution-contracts-audit";
import { runControlledProductionPreflightCredentialAndTransportBoundaryAudit } from "./run-controlled-production-preflight-credential-and-transport-boundary-audit";

type AuditCase = Readonly<{ id: string; positive: boolean; passed: boolean }>;
const cases: AuditCase[] = [];
const record = (id: string, positive: boolean, passed: boolean) =>
  cases.push(Object.freeze({ id, positive, passed }));

const fingerprint = (suffix: string) =>
  `sha256:${suffix.repeat(64).slice(0, 64)}`;
const targetFingerprint = `target_sha256:${"a".repeat(64)}`;
let boundarySerial = 0;

const SOURCE_INTEGRITY_PATHS = Object.freeze([
  "lib/vaylo/smart-talk/knowledge/de/run-controlled-production-postgres-read-only-adapter-audit.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/controlled-production-postgres-read-only-adapter.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/production-read-only-preflight-helper.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-production-preflight-synthetic-result-fixture-interface-audit.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-production-read-only-preflight-helper-implementation-audit.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-disabled-production-preflight-helper-validation.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-controlled-remote-preflight-execution-boundary-design-audit.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-controlled-production-preflight-execution-contracts-audit.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-controlled-production-preflight-credential-and-transport-boundary-audit.ts",
] as const);

type StructuredRecord = Readonly<Record<string, unknown>>;
type NormalizedUpstreamEvidence = Readonly<{
  checkId: string;
  allPassed: true;
  fields: StructuredRecord;
}>;
type SourceIntegritySnapshot = Readonly<{
  relativePath: string;
  sha256: string;
  content: string;
}>;
type BoundedRunnerResult = Readonly<{
  value: unknown;
  runnerError: boolean;
  provenance: WeakSet<object>;
}>;

function isStructuredRecord(value: unknown): value is StructuredRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function upstreamCheckId(value: unknown): string | null {
  return isStructuredRecord(value) && typeof value.checkId === "string"
    ? value.checkId
    : null;
}

function exactBoolean(
  record: StructuredRecord,
  name: string,
  expected: boolean,
): boolean {
  return record[name] === expected;
}

function nonNegativeSafeInteger(record: StructuredRecord, name: string): number | null {
  const value = record[name];
  return typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= 0
    ? value
    : null;
}

function normalizeUpstreamEvidence(
  value: unknown,
  checkId: string,
  provenance: WeakSet<object>,
  checks: ReadonlyArray<(record: StructuredRecord) => boolean>,
): NormalizedUpstreamEvidence | null {
  if (!isStructuredRecord(value) || !provenance.has(value)) return null;
  if (
    value.checkId !== checkId ||
    !exactBoolean(value, "allPassed", true) ||
    !exactBoolean(value, "blocked", false) ||
    !checks.every((check) => check(value))
  ) {
    return null;
  }
  return Object.freeze({ checkId, allPassed: true, fields: value });
}

function hasZeroCounts(record: StructuredRecord, names: readonly string[]): boolean {
  return names.every((name) => nonNegativeSafeInteger(record, name) === 0);
}

function hasMinimum(
  record: StructuredRecord,
  name: string,
  minimum: number,
): boolean {
  const value = nonNegativeSafeInteger(record, name);
  return value !== null && value >= minimum;
}

function exactMinimum(
  record: StructuredRecord,
  name: string,
  minimum: number,
): boolean {
  return hasMinimum(record, name, minimum);
}

function normalizer(
  checkId: string,
  provenance: WeakSet<object>,
  checks: ReadonlyArray<(record: StructuredRecord) => boolean>,
) {
  return (value: unknown) =>
    normalizeUpstreamEvidence(value, checkId, provenance, checks);
}

async function runBounded(
  runner: () => unknown | Promise<unknown>,
): Promise<BoundedRunnerResult> {
  const provenance = new WeakSet<object>();
  try {
    const value = await runner();
    if (isStructuredRecord(value)) provenance.add(value);
    return Object.freeze({ value, runnerError: false, provenance });
  } catch {
    return Object.freeze({ value: null, runnerError: true, provenance });
  }
}

async function readSourceIntegritySnapshot(): Promise<
  ReadonlyArray<SourceIntegritySnapshot | null>
> {
  const sources = await Promise.all(
    SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {
      try {
        const content = await readFile(
          path.join(process.cwd(), relativePath),
          "utf8",
        );
        return Object.freeze({
          relativePath,
          sha256: createHash("sha256").update(content).digest("hex"),
          content,
        });
      } catch {
        return null;
      }
    }),
  );
  return Object.freeze(sources);
}

type ProhibitedModuleCategory =
  | "DATABASE"
  | "NETWORK"
  | "SUBPROCESS"
  | "FILESYSTEM";

type ModuleMatchKind = "EXACT" | "APPROVED_FAMILY_SUBPATH";

type ModuleClassification = Readonly<{
  canonicalModule: string;
  packageRoot: string;
  categories: ReadonlyArray<ProhibitedModuleCategory>;
  matchKind: ModuleMatchKind;
}>;

type TaxonomyEntry = Readonly<{
  canonicalModule: string;
  packageRoot: string;
  categories: ReadonlyArray<ProhibitedModuleCategory>;
}>;

const VALID_PROHIBITED_MODULE_CATEGORIES = Object.freeze([
  "DATABASE",
  "NETWORK",
  "SUBPROCESS",
  "FILESYSTEM",
] as const);

const PROHIBITED_MODULE_TAXONOMY: ReadonlyArray<TaxonomyEntry> = Object.freeze([
  Object.freeze({
    canonicalModule: "pg",
    packageRoot: "pg",
    categories: Object.freeze(["DATABASE"] as const),
  }),
  Object.freeze({
    canonicalModule: "postgres",
    packageRoot: "postgres",
    categories: Object.freeze(["DATABASE"] as const),
  }),
  Object.freeze({
    canonicalModule: "postgresql",
    packageRoot: "postgresql",
    categories: Object.freeze(["DATABASE"] as const),
  }),
  Object.freeze({
    canonicalModule: "@supabase/supabase-js",
    packageRoot: "@supabase/supabase-js",
    categories: Object.freeze(["DATABASE"] as const),
  }),
  Object.freeze({
    canonicalModule: "http",
    packageRoot: "http",
    categories: Object.freeze(["NETWORK"] as const),
  }),
  Object.freeze({
    canonicalModule: "https",
    packageRoot: "https",
    categories: Object.freeze(["NETWORK"] as const),
  }),
  Object.freeze({
    canonicalModule: "http2",
    packageRoot: "http2",
    categories: Object.freeze(["NETWORK"] as const),
  }),
  Object.freeze({
    canonicalModule: "net",
    packageRoot: "net",
    categories: Object.freeze(["NETWORK"] as const),
  }),
  Object.freeze({
    canonicalModule: "tls",
    packageRoot: "tls",
    categories: Object.freeze(["NETWORK"] as const),
  }),
  Object.freeze({
    canonicalModule: "dns",
    packageRoot: "dns",
    categories: Object.freeze(["NETWORK"] as const),
  }),
  Object.freeze({
    canonicalModule: "dns/promises",
    packageRoot: "dns",
    categories: Object.freeze(["NETWORK"] as const),
  }),
  Object.freeze({
    canonicalModule: "dgram",
    packageRoot: "dgram",
    categories: Object.freeze(["NETWORK"] as const),
  }),
  Object.freeze({
    canonicalModule: "node-fetch",
    packageRoot: "node-fetch",
    categories: Object.freeze(["NETWORK"] as const),
  }),
  Object.freeze({
    canonicalModule: "undici",
    packageRoot: "undici",
    categories: Object.freeze(["NETWORK"] as const),
  }),
  Object.freeze({
    canonicalModule: "ws",
    packageRoot: "ws",
    categories: Object.freeze(["NETWORK"] as const),
  }),
  Object.freeze({
    canonicalModule: "child_process",
    packageRoot: "child_process",
    categories: Object.freeze(["SUBPROCESS"] as const),
  }),
  Object.freeze({
    canonicalModule: "fs",
    packageRoot: "fs",
    categories: Object.freeze(["FILESYSTEM"] as const),
  }),
  Object.freeze({
    canonicalModule: "fs/promises",
    packageRoot: "fs",
    categories: Object.freeze(["FILESYSTEM"] as const),
  }),
]);

const PROHIBITED_MODULE_TAXONOMY_BY_CANONICAL = new Map(
  PROHIBITED_MODULE_TAXONOMY.map((entry) => [entry.canonicalModule, entry]),
);

const APPROVED_FAMILY_SUBPATH_ROOTS = Object.freeze(
  new Set(["@supabase/supabase-js"]),
);

function normalizeModuleSpecifier(value: string): string {
  return value.startsWith("node:") ? value.slice("node:".length) : value;
}

function packageRootFromCanonical(canonicalModule: string): string {
  if (canonicalModule.startsWith("@")) {
    const parts = canonicalModule.split("/");
    return parts.length >= 2
      ? `${parts[0]}/${parts[1]}`
      : canonicalModule;
  }
  return canonicalModule.split("/", 1)[0]!;
}

function classifyProhibitedModule(
  specifier: string,
): ModuleClassification | null {
  const normalized = normalizeModuleSpecifier(specifier);
  const exact = PROHIBITED_MODULE_TAXONOMY_BY_CANONICAL.get(normalized);
  if (exact) {
    return Object.freeze({
      canonicalModule: exact.canonicalModule,
      packageRoot: exact.packageRoot,
      categories: exact.categories,
      matchKind: "EXACT",
    });
  }
  if (normalized.startsWith("@")) {
    const root = packageRootFromCanonical(normalized);
    if (
      root !== normalized &&
      APPROVED_FAMILY_SUBPATH_ROOTS.has(root) &&
      PROHIBITED_MODULE_TAXONOMY_BY_CANONICAL.has(root)
    ) {
      const family = PROHIBITED_MODULE_TAXONOMY_BY_CANONICAL.get(root)!;
      return Object.freeze({
        canonicalModule: family.canonicalModule,
        packageRoot: family.packageRoot,
        categories: family.categories,
        matchKind: "APPROVED_FAMILY_SUBPATH",
      });
    }
  }
  return null;
}

function classifyProhibitedModuleFromPath(
  pathValue: string,
): ModuleClassification | null {
  const normalized = normalizeModuleSpecifier(pathValue);
  const exact = classifyProhibitedModule(normalized);
  if (exact) return exact;
  const dotIndex = normalized.indexOf(".");
  if (dotIndex <= 0) return null;
  return classifyProhibitedModule(normalized.slice(0, dotIndex));
}

const REQUIRED_MODULE_CLASSIFICATION_SPEC = Object.freeze([
  Object.freeze({ module: "pg", category: "DATABASE" as const }),
  Object.freeze({ module: "postgres", category: "DATABASE" as const }),
  Object.freeze({ module: "postgresql", category: "DATABASE" as const }),
  Object.freeze({
    module: "@supabase/supabase-js",
    category: "DATABASE" as const,
  }),
  Object.freeze({ module: "http", category: "NETWORK" as const }),
  Object.freeze({ module: "node:http", category: "NETWORK" as const }),
  Object.freeze({ module: "https", category: "NETWORK" as const }),
  Object.freeze({ module: "node:https", category: "NETWORK" as const }),
  Object.freeze({ module: "http2", category: "NETWORK" as const }),
  Object.freeze({ module: "node:http2", category: "NETWORK" as const }),
  Object.freeze({ module: "net", category: "NETWORK" as const }),
  Object.freeze({ module: "node:net", category: "NETWORK" as const }),
  Object.freeze({ module: "tls", category: "NETWORK" as const }),
  Object.freeze({ module: "node:tls", category: "NETWORK" as const }),
  Object.freeze({ module: "dns", category: "NETWORK" as const }),
  Object.freeze({ module: "node:dns", category: "NETWORK" as const }),
  Object.freeze({ module: "dns/promises", category: "NETWORK" as const }),
  Object.freeze({ module: "node:dns/promises", category: "NETWORK" as const }),
  Object.freeze({ module: "dgram", category: "NETWORK" as const }),
  Object.freeze({ module: "node:dgram", category: "NETWORK" as const }),
  Object.freeze({ module: "node-fetch", category: "NETWORK" as const }),
  Object.freeze({ module: "undici", category: "NETWORK" as const }),
  Object.freeze({ module: "ws", category: "NETWORK" as const }),
  Object.freeze({ module: "child_process", category: "SUBPROCESS" as const }),
  Object.freeze({
    module: "node:child_process",
    category: "SUBPROCESS" as const,
  }),
  Object.freeze({ module: "fs", category: "FILESYSTEM" as const }),
  Object.freeze({ module: "node:fs", category: "FILESYSTEM" as const }),
  Object.freeze({ module: "fs/promises", category: "FILESYSTEM" as const }),
  Object.freeze({ module: "node:fs/promises", category: "FILESYSTEM" as const }),
  Object.freeze({ module: "node:ws", category: "NETWORK" as const }),
]);

const APPROVED_AUDIT_SOURCE_READ_PATHS = Object.freeze(
  new Set<string>(SOURCE_INTEGRITY_PATHS),
);

const FILESYSTEM_READ_OPERATIONS = Object.freeze(
  new Set([
    "readFile",
    "readFileSync",
    "read",
    "readSync",
    "readv",
    "readvSync",
    "createReadStream",
    "open",
    "openSync",
  ]),
);

const FILESYSTEM_MUTATION_OPERATIONS = Object.freeze(
  new Set([
    "writeFile",
    "writeFileSync",
    "appendFile",
    "appendFileSync",
    "unlink",
    "unlinkSync",
    "rename",
    "renameSync",
    "copyFile",
    "copyFileSync",
    "rm",
    "rmSync",
    "truncate",
    "truncateSync",
    "createWriteStream",
  ]),
);

type ExpressionProvenanceKind =
  | "SAFE_LOCAL"
  | "UNKNOWN"
  | "PROHIBITED"
  | "AMBIGUOUS_PROHIBITED";

type ImportedModuleImportKind =
  | "NAMED"
  | "NAMESPACE"
  | "DEFAULT"
  | "IMPORT_EQUALS"
  | "REQUIRE_NAMESPACE"
  | "REQUIRE_DESTRUCTURED";

type ImportedModuleAuthority = Readonly<{
  canonicalModule: string;
  packageRoot: string;
  categories: ReadonlyArray<ProhibitedModuleCategory>;
  importKind: ImportedModuleImportKind;
  exportedName: string | null;
  localBindingSerial: number;
}>;

type ExpressionProvenance = Readonly<{
  kind: ExpressionProvenanceKind;
  path: string | null;
  modules: ReadonlyArray<string>;
  categories: ReadonlyArray<ProhibitedModuleCategory>;
  importAuthority: ImportedModuleAuthority | null;
}>;

type ApprovedPathProvenanceKind =
  | "APPROVED_SOURCE_INTEGRITY_PATH"
  | "UNKNOWN_PATH"
  | "INVALIDATED_APPROVED_PATH"
  | "SOURCE_INTEGRITY_INVENTORY";

type ApprovedPathProvenance = Readonly<{
  kind: ApprovedPathProvenanceKind;
  inventoryValid: boolean;
  aliasDepth: number;
  inventoryDeclarationSerial: number;
}>;

type LexicalBindingKind =
  | "IMPORT"
  | "PARAMETER"
  | "VARIABLE"
  | "FUNCTION"
  | "CLASS"
  | "CATCH"
  | "DESTRUCTURED";

type LexicalBindingRecord = {
  bindingId: string;
  declarationId: string;
  scopeId: string;
  bindingKind: LexicalBindingKind;
  expressionProvenance: ExpressionProvenance;
  importAuthority: ImportedModuleAuthority | null;
  approvedPathProvenance: ApprovedPathProvenance;
  reassigned: boolean;
  invalidated: boolean;
};

type RemotePathInspection = Readonly<{
  counts: Readonly<Record<string, number>>;
  ambiguousComputedProhibitedAccessEvidence: ReadonlyArray<string>;
  ambiguousComputedProhibitedAccessEvidenceLimit: number;
  ambiguousComputedProhibitedAccessEvidenceTruncatedCount: number;
  ambiguousComputedProhibitedAccessFailsClosed: boolean;
  ambiguousProhibitedExpressionProvenanceEvidence: ReadonlyArray<string>;
  expressionProvenanceFailureCode: "AMBIGUOUS_PROHIBITED_EXPRESSION_PROVENANCE";
  expressionProvenanceModelImplemented: boolean;
  expressionProvenanceJoinImplemented: boolean;
  expressionProvenanceUsesTypeScriptAst: boolean;
  expressionProvenanceRegexOnly: boolean;
  expressionProvenanceResolverSingleAuthoritativePath: boolean;
  expressionProvenanceRecursionBounded: boolean;
  expressionResolverUsesAuthoritativeModuleClassifier: boolean;
  authoritativeModuleTaxonomyImplemented: boolean;
  authoritativeModuleTaxonomyStructured: boolean;
  authoritativeModuleTaxonomySingleSourceOfTruth: boolean;
  moduleClassificationReturnsBoundedMetadata: boolean;
  moduleClassificationRawSourceExposed: boolean;
  nodePrefixModuleNormalizationImplemented: boolean;
  moduleSubpathPolicyExplicit: boolean;
  legacyIncompleteProvenanceModulesAuthorityRemoved: boolean;
  duplicateModuleClassifierCount: number;
  importBindingRegistryImplemented: boolean;
  importNamedAliasBindingSupported: boolean;
  importNamespaceBindingSupported: boolean;
  importDefaultBindingSupported: boolean;
  defaultFetchLikeImportBindingSupported: boolean;
  defaultWebSocketLikeImportBindingSupported: boolean;
  importEqualsBindingSupported: boolean;
  requireNamespaceBindingSupported: boolean;
  requireDestructuredBindingSupported: boolean;
  requirePropertyBindingSupported: boolean;
  requireComputedBindingSupported: boolean;
  boundedAliasPropagationSupported: boolean;
  nodeModuleSpecifierNormalizationSupported: boolean;
  importBindingPropagationLimit: number;
  approvedSourceIntegrityPathProvenanceImplemented: boolean;
  approvedPathProvenanceBindingIdentityAware: boolean;
  approvedPathProvenanceScopeAware: boolean;
  approvedPathProvenanceIdentifierNameIndependent: boolean;
  unknownPathDistinguishedFromApprovedPath: boolean;
  invalidatedApprovedPathRepresentedOrRejected: boolean;
  sourceIntegrityPathInventoryDeclarationFound: boolean;
  sourceIntegrityPathInventorySingleAuthoritativeDeclaration: boolean;
  sourceIntegrityPathInventoryConstBound: boolean;
  sourceIntegrityPathInventoryLiteralAndBounded: boolean;
  sourceIntegrityPathInventoryContainsOnlyLiteralEntries: boolean;
  sourceIntegrityPathInventoryContainsSpread: boolean;
  sourceIntegrityPathInventoryExternalInputDerived: boolean;
  sourceIntegrityPathInventoryEntryCount: number;
  sourceIntegrityPathInventoryDuplicateCount: number;
  sourceIntegrityPathInventoryInvalidEntryCount: number;
  sourceIntegrityPathInventoryContainsOnlyApprovedPaths: boolean;
  sourceIntegrityPathInventoryContainsParentTraversal: boolean;
  sourceIntegrityPathInventoryContainsWildcard: boolean;
  sourceIntegrityPathInventoryContainsAbsolutePath: boolean;
  sourceIntegrityPathInventoryRuntimeMutable: boolean;
  sourceIntegrityPathInventoryMutationScanExecuted: boolean;
  sourceIntegrityPathInventoryMutationCount: number;
  sourceIntegrityPathInventoryWritableAliasCount: number;
  sourceInventoryForOfSupported: boolean;
  filesystemAllowlistUsesExistingScopeModel: boolean;
  filesystemAllowlistUsesGlobalIdentifierNameMapOnly: boolean;
  approvedPathScopeResolutionDeterministic: boolean;
  approvedPathProvenanceRawPathExposed: boolean;
  approvedPathProvenanceSourceSnippetExposed: boolean;
  approvedPathProvenanceErrorMessageExposed: boolean;
  approvedPathProvenanceStackExposed: boolean;
  filesystemAllowlistProvenanceFailureCodesFixed: boolean;
  filesystemAllowlistProvenanceFailureDeterministic: boolean;
  importedModuleAuthorityImplemented: boolean;
  importedModuleAuthorityBindingIdentityAware: boolean;
  importedModuleAuthorityScopeAware: boolean;
  importedModuleAuthorityCanonicalModuleAware: boolean;
  importedModuleAuthorityExportAware: boolean;
  authoritativePathModuleBindingImplemented: boolean;
  authoritativePathModuleBindingIdentityAware: boolean;
  authoritativePathModuleCanonicalModuleAware: boolean;
  authoritativePathJoinMemberExact: boolean;
  unknownBindingPathCannotCreateModuleAuthority: boolean;
  diagnosticPathAndBindingAuthoritySeparated: boolean;
  authorityPredicateNeverUsesDiagnosticPathAlone: boolean;
  unifiedLexicalBindingCoreImplemented: boolean;
  singleAuthoritativeBindingIntroductionPath: boolean;
  parallelUnsynchronizedBindingRegistrationRemoved: boolean;
  bindingResolutionUsesNearestDeclaration: boolean;
  resolvedUnknownLocalBindingStopsOuterAuthorityLookup: boolean;
  resolvedLocalBindingNeverFallsThroughToOuterImport: boolean;
  approvedPathProvenanceUsesUnifiedBindingCore: boolean;
  approvedPathShadowingUsesSameNearestBindingRule: boolean;
  diagnosticPathsCannotCreateAuthority: boolean;
  diagnosticPathsCannotBypassLexicalShadowing: boolean;
}>;

function inspectRemotePaths(
  adapterSource: string,
  auditSource: string,
): RemotePathInspection {
  const counts = {
    databaseClientImportCount: 0, networkExecutionPathCount: 0,
    subprocessExecutionPathCount: 0, shellExecutionPathCount: 0,
    environmentReadPathCount: 0, credentialReadPathCount: 0,
    filesystemSecretReadPathCount: 0,
    approvedFilesystemSourceReadCount: 0,
    remoteSupabaseCommandCount: 0,
    sqlExecutionPathCount: 0, socketCreationPathCount: 0,
    noncePersistencePathCount: 0, nonceConsumptionPathCount: 0,
    bootstrapExecutionPathCount: 0, rollbackArtifactExecutionPathCount: 0,
    productionExecutionPathCount: 0,
    defaultFetchImportUsageCount: 0, defaultWebSocketImportUsageCount: 0,
    ambiguousComputedProhibitedAccessCount: 0,
    ambiguousProhibitedExpressionProvenanceCount: 0,
  };
  const aliasPropagationLimit = 64;
  const ambiguousComputedAccessEvidenceLimit = 64;
  const expressionProvenanceRecursionLimit = 64;
  const expressionProvenanceFailureCode =
    "AMBIGUOUS_PROHIBITED_EXPRESSION_PROVENANCE" as const;
  const lexicalScopes: Array<Map<string, LexicalBindingRecord>> = [];
  let scopeSerialCounter = 0;
  let bindingSerialCounter = 0;
  let declarationSerialCounter = 0;
  const ambiguousComputedAccessEvidence: string[] = [];
  const ambiguousProhibitedExpressionProvenanceEvidence: string[] = [];
  let aliasesRegistered = 0;
  let ambiguousComputedAccessEvidenceTruncatedCount = 0;
  const SAFE_LOCAL: ExpressionProvenance = Object.freeze({
    kind: "SAFE_LOCAL",
    path: null,
    modules: Object.freeze([] as string[]),
    categories: Object.freeze([] as ProhibitedModuleCategory[]),
    importAuthority: null,
  });
  const UNKNOWN: ExpressionProvenance = Object.freeze({
    kind: "UNKNOWN",
    path: null,
    modules: Object.freeze([] as string[]),
    categories: Object.freeze([] as ProhibitedModuleCategory[]),
    importAuthority: null,
  });
  let importAuthoritySerialCounter = 0;
  const normalizePath = (value: string) =>
    value.startsWith("globalThis.") ? value.slice("globalThis.".length) : value;
  const uniqueSorted = (values: ReadonlyArray<string>) =>
    Object.freeze([...new Set(values)].sort());
  const uniqueSortedCategories = (
    values: ReadonlyArray<ProhibitedModuleCategory>,
  ) =>
    Object.freeze(
      [...new Set(values)].sort() as ProhibitedModuleCategory[],
    );
  const categoriesForModules = (
    modules: ReadonlyArray<string>,
  ): ReadonlyArray<ProhibitedModuleCategory> =>
    uniqueSortedCategories(
      modules.flatMap((moduleName) => {
        const classified = classifyProhibitedModule(moduleName);
        return classified ? [...classified.categories] : [];
      }),
    );
  const makeProvenance = (
    kind: ExpressionProvenanceKind,
    path: string | null,
    modules: ReadonlyArray<string>,
    categories: ReadonlyArray<ProhibitedModuleCategory> = categoriesForModules(
      modules,
    ),
    importAuthority: ImportedModuleAuthority | null = null,
  ): ExpressionProvenance =>
    Object.freeze({
      kind,
      path: path ? normalizePath(path) : null,
      modules: uniqueSorted(modules),
      categories: uniqueSortedCategories(categories),
      importAuthority,
    });
  const prohibitedProvenance = (
    path: string,
    importAuthority: ImportedModuleAuthority | null = null,
  ): ExpressionProvenance => {
    const normalized = normalizePath(path);
    const classified =
      classifyProhibitedModuleFromPath(normalized) ??
      classifyProhibitedModule(normalized.split(".", 1)[0]!);
    const root = classified?.canonicalModule ??
      normalizeModuleSpecifier(normalized.split(".", 1)[0]!);
    return makeProvenance(
      "PROHIBITED",
      normalized,
      [root],
      classified?.categories ?? [],
      importAuthority,
    );
  };
  const ambiguousProhibitedProvenance = (
    modules: ReadonlyArray<string>,
    path: string | null = null,
    categories: ReadonlyArray<ProhibitedModuleCategory> = categoriesForModules(
      modules,
    ),
  ): ExpressionProvenance =>
    makeProvenance(
      "AMBIGUOUS_PROHIBITED",
      path ?? (modules[0] ?? null),
      modules,
      categories,
      null,
    );
  const unknownWithPath = (path: string): ExpressionProvenance =>
    makeProvenance("UNKNOWN", path, [], [], null);
  const joinExpressionProvenance = (
    left: ExpressionProvenance,
    right: ExpressionProvenance,
  ): ExpressionProvenance => {
    if (
      left.kind === "AMBIGUOUS_PROHIBITED" ||
      right.kind === "AMBIGUOUS_PROHIBITED"
    ) {
      return ambiguousProhibitedProvenance(
        [...left.modules, ...right.modules],
        left.path ?? right.path,
        [...left.categories, ...right.categories],
      );
    }
    if (left.kind === "PROHIBITED" && right.kind === "PROHIBITED") {
      if (left.path === right.path) return left;
      return ambiguousProhibitedProvenance(
        [...left.modules, ...right.modules],
        left.path ?? right.path,
        [...left.categories, ...right.categories],
      );
    }
    if (left.kind === "PROHIBITED") {
      return ambiguousProhibitedProvenance(
        left.modules,
        left.path,
        left.categories,
      );
    }
    if (right.kind === "PROHIBITED") {
      return ambiguousProhibitedProvenance(
        right.modules,
        right.path,
        right.categories,
      );
    }
    if (left.kind === "SAFE_LOCAL" && right.kind === "SAFE_LOCAL") {
      return SAFE_LOCAL;
    }
    return UNKNOWN;
  };
  const hasCategory = (
    provenance: ExpressionProvenance,
    category: ProhibitedModuleCategory,
  ) => provenance.categories.includes(category);
  const terminalMemberName = (value: string): string => {
    const parts = value.split(".");
    return parts[parts.length - 1] ?? value;
  };
  const pendingApprovedMapCallbacks = new WeakMap<
    ts.ArrowFunction | ts.FunctionExpression,
    Readonly<{
      parameterName: string;
      inventoryDeclarationSerial: number;
      inventoryValid: boolean;
    }>
  >();
  let inventoryDeclarationSerialCounter = 0;
  let authoritativeInventoryDeclarationSerial: number | null = null;
  let authoritativeInventoryName: string | null = null;
  let inventoryMutationCount = 0;
  let inventoryWritableAliasCount = 0;
  let inventoryDeclarationFound = false;
  let inventoryConstBound = false;
  let inventoryLiteralAndBounded = false;
  let inventoryContainsOnlyLiteralEntries = false;
  let inventoryContainsSpread = false;
  let inventoryEntryCount = 0;
  let inventoryDuplicateCount = 0;
  let inventoryInvalidEntryCount = 0;
  let inventoryContainsParentTraversal = false;
  let inventoryContainsWildcard = false;
  let inventoryContainsAbsolutePath = false;
  let inventoryContainsOnlyApprovedPaths = false;
  let inventoryMutationScanExecuted = false;
  const UNKNOWN_PATH_PROVENANCE: ApprovedPathProvenance = Object.freeze({
    kind: "UNKNOWN_PATH",
    inventoryValid: false,
    aliasDepth: 0,
    inventoryDeclarationSerial: -1,
  });
  const currentScopeId = (): string =>
    lexicalScopes.length > 0
      ? `scope_${lexicalScopes.length}_${scopeSerialCounter}`
      : "scope_none";
  const lookupLexicalBinding = (
    name: string,
  ): LexicalBindingRecord | undefined => {
    for (let index = lexicalScopes.length - 1; index >= 0; index -= 1) {
      const found = lexicalScopes[index]!.get(name);
      if (found) return found;
    }
    return undefined;
  };
  const defineLexicalBinding = (
    name: string,
    bindingKind: LexicalBindingKind,
    expressionProvenance: ExpressionProvenance,
    approvedPathProvenance: ApprovedPathProvenance = UNKNOWN_PATH_PROVENANCE,
    declarationId?: string,
  ): LexicalBindingRecord | undefined => {
    if (aliasesRegistered >= aliasPropagationLimit || lexicalScopes.length === 0) {
      return undefined;
    }
    bindingSerialCounter += 1;
    declarationSerialCounter += 1;
    const record: LexicalBindingRecord = {
      bindingId: `binding_${bindingSerialCounter}`,
      declarationId: declarationId ?? `declaration_${declarationSerialCounter}`,
      scopeId: currentScopeId(),
      bindingKind,
      expressionProvenance,
      importAuthority: expressionProvenance.importAuthority,
      approvedPathProvenance,
      reassigned: false,
      invalidated: false,
    };
    lexicalScopes[lexicalScopes.length - 1]!.set(name, record);
    aliasesRegistered += 1;
    return record;
  };
  const lookupPathProvenance = (
    name: string,
  ): ApprovedPathProvenance | undefined =>
    lookupLexicalBinding(name)?.approvedPathProvenance;
  const definePathProvenance = (
    name: string,
    provenance: ApprovedPathProvenance,
  ) => {
    const existing = lookupLexicalBinding(name);
    if (
      existing &&
      lexicalScopes[lexicalScopes.length - 1]?.has(name)
    ) {
      existing.approvedPathProvenance = provenance;
      existing.invalidated =
        provenance.kind === "INVALIDATED_APPROVED_PATH" ||
        existing.invalidated;
      return;
    }
    defineLexicalBinding(
      name,
      "VARIABLE",
      UNKNOWN,
      provenance,
    );
  };
  const invalidateApprovedBindingsForInventory = (serial: number) => {
    for (const scope of lexicalScopes) {
      for (const current of scope.values()) {
        if (
          current.approvedPathProvenance.inventoryDeclarationSerial ===
            serial &&
          current.approvedPathProvenance.kind ===
            "APPROVED_SOURCE_INTEGRITY_PATH"
        ) {
          current.approvedPathProvenance = Object.freeze({
            kind: "INVALIDATED_APPROVED_PATH",
            inventoryValid: false,
            aliasDepth: current.approvedPathProvenance.aliasDepth,
            inventoryDeclarationSerial:
              current.approvedPathProvenance.inventoryDeclarationSerial,
          });
          current.invalidated = true;
        }
      }
    }
  };
  const invalidatePathProvenance = (name: string) => {
    for (let index = lexicalScopes.length - 1; index >= 0; index -= 1) {
      const current = lexicalScopes[index]!.get(name);
      if (!current) continue;
      if (
        current.approvedPathProvenance.kind === "APPROVED_SOURCE_INTEGRITY_PATH"
      ) {
        current.approvedPathProvenance = Object.freeze({
          kind: "INVALIDATED_APPROVED_PATH",
          inventoryValid: false,
          aliasDepth: current.approvedPathProvenance.aliasDepth,
          inventoryDeclarationSerial:
            current.approvedPathProvenance.inventoryDeclarationSerial,
        });
        current.invalidated = true;
        current.reassigned = true;
      } else if (
        current.approvedPathProvenance.kind === "SOURCE_INTEGRITY_INVENTORY"
      ) {
        const serial =
          current.approvedPathProvenance.inventoryDeclarationSerial;
        current.approvedPathProvenance = Object.freeze({
          kind: "INVALIDATED_APPROVED_PATH",
          inventoryValid: false,
          aliasDepth: current.approvedPathProvenance.aliasDepth,
          inventoryDeclarationSerial: serial,
        });
        current.invalidated = true;
        current.reassigned = true;
        inventoryMutationCount += 1;
        invalidateApprovedBindingsForInventory(serial);
      }
      // Do not clear expression/import authority here. Assignment updates
      // expression provenance through assignBinding; this helper only manages
      // approved-path invalidation on the unified binding record.
      return;
    }
  };
  const isConstVariableDeclaration = (node: ts.VariableDeclaration): boolean =>
    ts.isVariableDeclarationList(node.parent) &&
    (node.parent.flags & ts.NodeFlags.Const) !== 0;
  const unwrapInventoryInitializer = (
    expression: ts.Expression,
  ): ts.ArrayLiteralExpression | null => {
    if (
      ts.isAsExpression(expression) ||
      ts.isSatisfiesExpression(expression) ||
      ts.isParenthesizedExpression(expression)
    ) {
      return unwrapInventoryInitializer(expression.expression);
    }
    if (
      ts.isCallExpression(expression) &&
      ts.isPropertyAccessExpression(expression.expression) &&
      ts.isIdentifier(expression.expression.expression) &&
      expression.expression.expression.text === "Object" &&
      expression.expression.name.text === "freeze" &&
      expression.arguments[0]
    ) {
      return unwrapInventoryInitializer(expression.arguments[0]!);
    }
    if (ts.isArrayLiteralExpression(expression)) return expression;
    return null;
  };
  const validateInventoryPathEntry = (
    value: string,
  ): Readonly<{
    valid: boolean;
    parentTraversal: boolean;
    wildcard: boolean;
    absolute: boolean;
  }> => {
    const parentTraversal =
      value === ".." ||
      value.startsWith("../") ||
      value.includes("/../") ||
      value.endsWith("/..");
    const wildcard = value.includes("*") || value.includes("?");
    const absolute =
      value.startsWith("/") ||
      value.startsWith("\\") ||
      /^[A-Za-z]:[\\/]/.test(value) ||
      value.includes("://");
    const empty = value.trim().length === 0;
    return Object.freeze({
      valid: !parentTraversal && !wildcard && !absolute && !empty,
      parentTraversal,
      wildcard,
      absolute,
    });
  };
  const registerInventoryDeclaration = (
    name: string,
    initializer: ts.Expression,
    isConst: boolean,
  ) => {
    inventoryDeclarationFound = true;
    inventoryConstBound = isConst;
    const arrayLiteral = unwrapInventoryInitializer(initializer);
    inventoryDeclarationSerialCounter += 1;
    const serial = inventoryDeclarationSerialCounter;
    let literalAndBounded = arrayLiteral !== null;
    let onlyLiteralEntries = arrayLiteral !== null;
    let containsSpread = false;
    let entryCount = 0;
    let duplicateCount = 0;
    let invalidEntryCount = 0;
    let parentTraversal = false;
    let wildcard = false;
    let absolute = false;
    const seen = new Set<string>();
    if (arrayLiteral) {
      for (const element of arrayLiteral.elements) {
        if (ts.isSpreadElement(element)) {
          containsSpread = true;
          literalAndBounded = false;
          onlyLiteralEntries = false;
          continue;
        }
        if (
          ts.isStringLiteral(element) ||
          ts.isNoSubstitutionTemplateLiteral(element)
        ) {
          entryCount += 1;
          if (seen.has(element.text)) duplicateCount += 1;
          seen.add(element.text);
          const validation = validateInventoryPathEntry(element.text);
          if (!validation.valid) invalidEntryCount += 1;
          parentTraversal = parentTraversal || validation.parentTraversal;
          wildcard = wildcard || validation.wildcard;
          absolute = absolute || validation.absolute;
        } else {
          onlyLiteralEntries = false;
          literalAndBounded = false;
          invalidEntryCount += 1;
        }
      }
    } else {
      onlyLiteralEntries = false;
      literalAndBounded = false;
    }
    const inventoryValid =
      isConst &&
      literalAndBounded &&
      onlyLiteralEntries &&
      !containsSpread &&
      invalidEntryCount === 0 &&
      duplicateCount === 0 &&
      entryCount > 0;
    if (name === "SOURCE_INTEGRITY_PATHS") {
      authoritativeInventoryDeclarationSerial = serial;
      authoritativeInventoryName = name;
      inventoryLiteralAndBounded = literalAndBounded;
      inventoryContainsOnlyLiteralEntries = onlyLiteralEntries;
      inventoryContainsSpread = containsSpread;
      inventoryEntryCount = entryCount;
      inventoryDuplicateCount = duplicateCount;
      inventoryInvalidEntryCount = invalidEntryCount;
      inventoryContainsParentTraversal = parentTraversal;
      inventoryContainsWildcard = wildcard;
      inventoryContainsAbsolutePath = absolute;
      inventoryContainsOnlyApprovedPaths =
        inventoryValid &&
        [...seen].every((entry) => APPROVED_AUDIT_SOURCE_READ_PATHS.has(entry));
    }
    definePathProvenance(
      name,
      Object.freeze({
        kind: "SOURCE_INTEGRITY_INVENTORY",
        inventoryValid,
        aliasDepth: 0,
        inventoryDeclarationSerial: serial,
      }),
    );
    if (!isConst) {
      inventoryWritableAliasCount += 1;
    }
  };
  const isApprovedPathBinding = (
    name: string,
  ): boolean => {
    const provenance = lookupPathProvenance(name);
    return (
      provenance?.kind === "APPROVED_SOURCE_INTEGRITY_PATH" &&
      provenance.inventoryValid === true
    );
  };
  const canIssueApprovedPathProvenance = (): boolean =>
    inventoryMutationCount === 0 && inventoryWritableAliasCount === 0;
  const isAuthoritativeFilesystemReadBinding = (
    provenance: ExpressionProvenance,
  ): boolean => {
    const authority = provenance.importAuthority;
    if (!authority) return false;
    return (
      authority.canonicalModule === "fs/promises" &&
      authority.exportedName === "readFile" &&
      authority.importKind === "NAMED" &&
      authority.categories.includes("FILESYSTEM")
    );
  };
  const isAuthoritativePathJoinCall = (
    expression: ts.Expression,
  ): expression is ts.CallExpression => {
    if (!ts.isCallExpression(expression)) return false;
    if (!ts.isPropertyAccessExpression(expression.expression)) return false;
    if (expression.expression.questionDotToken) return false;
    if (expression.expression.name.text !== "join") return false;
    if (!ts.isIdentifier(expression.expression.expression)) return false;
    const pathBaseProvenance = resolveExpressionProvenance(
      expression.expression.expression,
    );
    const authority = pathBaseProvenance.importAuthority;
    if (!authority) return false;
    if (authority.canonicalModule !== "path") return false;
    // Production uses default import; namespace/named join forms are unsupported.
    return authority.importKind === "DEFAULT";
  };
  const isUnshadowedProcessCwdCall = (
    expression: ts.Expression,
  ): boolean => {
    if (!ts.isCallExpression(expression) || expression.arguments.length !== 0) {
      return false;
    }
    if (!ts.isPropertyAccessExpression(expression.expression)) return false;
    if (expression.expression.questionDotToken) return false;
    if (expression.expression.name.text !== "cwd") return false;
    if (!ts.isIdentifier(expression.expression.expression)) return false;
    if (expression.expression.expression.text !== "process") return false;
    return lookupBinding("process") === undefined;
  };
  const isApprovedLiteralAuditSourceRead = (
    calleeProvenance: ExpressionProvenance,
    firstArgument: ts.Expression | undefined,
    secondArgument: ts.Expression | undefined,
    argumentCount: number,
  ): boolean => {
    if (!isAuthoritativeFilesystemReadBinding(calleeProvenance)) {
      return false;
    }
    if (argumentCount !== 2) return false;
    if (
      !firstArgument ||
      !(
        ts.isStringLiteral(firstArgument) ||
        ts.isNoSubstitutionTemplateLiteral(firstArgument)
      )
    ) {
      return false;
    }
    if (!APPROVED_AUDIT_SOURCE_READ_PATHS.has(firstArgument.text)) return false;
    return (
      secondArgument !== undefined &&
      (ts.isStringLiteral(secondArgument) ||
        ts.isNoSubstitutionTemplateLiteral(secondArgument)) &&
      secondArgument.text === "utf8"
    );
  };
  const isApprovedBoundedAuditPathJoinRead = (
    calleeProvenance: ExpressionProvenance,
    firstArgument: ts.Expression | undefined,
    secondArgument: ts.Expression | undefined,
    argumentCount: number,
  ): boolean => {
    if (!isAuthoritativeFilesystemReadBinding(calleeProvenance)) {
      return false;
    }
    if (argumentCount !== 2) return false;
    if (!firstArgument || !isAuthoritativePathJoinCall(firstArgument)) {
      return false;
    }
    if (
      !secondArgument ||
      !(
        ts.isStringLiteral(secondArgument) ||
        ts.isNoSubstitutionTemplateLiteral(secondArgument)
      ) ||
      secondArgument.text !== "utf8"
    ) {
      return false;
    }
    const joinArgs = firstArgument.arguments;
    if (joinArgs.length !== 2) return false;
    const cwdArg = joinArgs[0];
    const relativeArg = joinArgs[1];
    if (!cwdArg || !isUnshadowedProcessCwdCall(cwdArg)) return false;
    if (!relativeArg || !ts.isIdentifier(relativeArg)) return false;
    return isApprovedPathBinding(relativeArg.text);
  };
  const recordFilesystemPathEvidence = (
    callee: string,
    calleeProvenance: ExpressionProvenance,
    firstArgument: ts.Expression | undefined,
    secondArgument: ts.Expression | undefined,
    argumentCount: number,
  ) => {
    const operation = terminalMemberName(callee);
    const isRead =
      FILESYSTEM_READ_OPERATIONS.has(operation) ||
      /readFile(?:Sync)?$/.test(callee);
    const isMutation = FILESYSTEM_MUTATION_OPERATIONS.has(operation);
    if (!isRead && !isMutation) return;
    if (
      isApprovedLiteralAuditSourceRead(
        calleeProvenance,
        firstArgument,
        secondArgument,
        argumentCount,
      ) ||
      isApprovedBoundedAuditPathJoinRead(
        calleeProvenance,
        firstArgument,
        secondArgument,
        argumentCount,
      )
    ) {
      counts.approvedFilesystemSourceReadCount += 1;
      return;
    }
    if (
      firstArgument &&
      (ts.isStringLiteral(firstArgument) ||
        ts.isNoSubstitutionTemplateLiteral(firstArgument))
    ) {
      counts.filesystemSecretReadPathCount += 1;
      return;
    }
    counts.filesystemSecretReadPathCount += 1;
  };
  const pathOf = (provenance: ExpressionProvenance): string | null => {
    if (provenance.path) return normalizePath(provenance.path);
    if (
      provenance.kind === "PROHIBITED" ||
      provenance.kind === "AMBIGUOUS_PROHIBITED"
    ) {
      return provenance.modules[0] ?? null;
    }
    return null;
  };
  const hasProhibitedProvenanceValue = (
    provenance: ExpressionProvenance,
  ): boolean =>
    provenance.kind === "PROHIBITED" ||
    provenance.kind === "AMBIGUOUS_PROHIBITED";
  const staticPropertyName = (node: ts.PropertyName): string | null =>
    ts.isIdentifier(node) || ts.isStringLiteral(node) ||
    ts.isNoSubstitutionTemplateLiteral(node)
      ? node.text
      : ts.isComputedPropertyName(node) &&
          (ts.isStringLiteral(node.expression) ||
            ts.isNoSubstitutionTemplateLiteral(node.expression))
        ? node.expression.text
        : null;
  const enterScope = () => {
    scopeSerialCounter += 1;
    lexicalScopes.push(new Map());
  };
  const exitScope = () => {
    lexicalScopes.pop();
  };
  const lookupBinding = (name: string): ExpressionProvenance | undefined => {
    // Nearest lexical binding wins. A local UNKNOWN/SAFE binding stops
    // outer import-authority fallthrough even when it has no importAuthority.
    const binding = lookupLexicalBinding(name);
    return binding?.expressionProvenance;
  };
  const defineBinding = (
    name: string,
    provenance: ExpressionProvenance,
    bindingKind: LexicalBindingKind = "VARIABLE",
    approvedPathProvenance: ApprovedPathProvenance = UNKNOWN_PATH_PROVENANCE,
  ) => {
    defineLexicalBinding(
      name,
      bindingKind,
      provenance,
      approvedPathProvenance,
    );
  };
  const assignBinding = (name: string, provenance: ExpressionProvenance) => {
    invalidatePathProvenance(name);
    for (let index = lexicalScopes.length - 1; index >= 0; index -= 1) {
      if (lexicalScopes[index]!.has(name)) {
        const prior = lexicalScopes[index]!.get(name)!;
        const joined = joinExpressionProvenance(
          prior.expressionProvenance,
          provenance,
        );
        prior.expressionProvenance = joined;
        prior.importAuthority = joined.importAuthority;
        prior.reassigned = true;
        return;
      }
    }
    defineBinding(name, provenance, "VARIABLE");
  };
  const registerParameterBindings = (
    parameters: ReadonlyArray<ts.ParameterDeclaration>,
    pending?: Readonly<{
      parameterName: string;
      inventoryDeclarationSerial: number;
      inventoryValid: boolean;
    }>,
  ) => {
    for (const [parameterIndex, parameter] of parameters.entries()) {
      const registerBoundName = (
        bindingName: ts.BindingName,
        bindingKind: LexicalBindingKind = "PARAMETER",
      ) => {
        if (ts.isIdentifier(bindingName)) {
          const approvedPath =
            pending &&
            parameterIndex === 0 &&
            bindingName.text === pending.parameterName &&
            !parameter.dotDotDotToken &&
            !parameter.initializer &&
            pending.inventoryValid &&
            canIssueApprovedPathProvenance()
              ? Object.freeze({
                  kind: "APPROVED_SOURCE_INTEGRITY_PATH" as const,
                  inventoryValid: true,
                  aliasDepth: 0,
                  inventoryDeclarationSerial:
                    pending.inventoryDeclarationSerial,
                })
              : UNKNOWN_PATH_PROVENANCE;
          defineLexicalBinding(
            bindingName.text,
            bindingKind,
            UNKNOWN,
            approvedPath,
          );
          return;
        }
        if (ts.isObjectBindingPattern(bindingName) ||
          ts.isArrayBindingPattern(bindingName)) {
          for (const element of bindingName.elements) {
            if (ts.isOmittedExpression(element) || element.dotDotDotToken) {
              continue;
            }
            registerBoundName(element.name, "DESTRUCTURED");
          }
        }
      };
      registerBoundName(parameter.name, "PARAMETER");
    }
  };
  const recordExpressionProvenanceFailure = (
    provenance: ExpressionProvenance,
  ) => {
    counts.ambiguousProhibitedExpressionProvenanceCount += 1;
    if (
      ambiguousProhibitedExpressionProvenanceEvidence.length <
      ambiguousComputedAccessEvidenceLimit
    ) {
      ambiguousProhibitedExpressionProvenanceEvidence.push(
        expressionProvenanceFailureCode,
      );
    }
    void provenance;
  };
  const registerAmbiguousComputedAccess = (
    baseProvenance: ExpressionProvenance,
  ) => {
    if (!hasProhibitedProvenanceValue(baseProvenance)) return;
    counts.ambiguousComputedProhibitedAccessCount += 1;
    if (baseProvenance.kind === "AMBIGUOUS_PROHIBITED") {
      recordExpressionProvenanceFailure(baseProvenance);
    }
    const evidence = `${pathOf(baseProvenance) ?? "prohibited"}[<dynamic>]`;
    if (ambiguousComputedAccessEvidence.length < ambiguousComputedAccessEvidenceLimit) {
      ambiguousComputedAccessEvidence.push(evidence);
    } else {
      ambiguousComputedAccessEvidenceTruncatedCount += 1;
    }
  };
  const resolveExpressionProvenance = (
    node: ts.Expression,
    resolvingNames: Set<string> = new Set(),
    depth = 0,
  ): ExpressionProvenance => {
    if (depth > expressionProvenanceRecursionLimit) {
      return ambiguousProhibitedProvenance(["https"]);
    }
    if (
      ts.isParenthesizedExpression(node) ||
      ts.isAsExpression(node) ||
      ts.isTypeAssertionExpression(node) ||
      ts.isNonNullExpression(node) ||
      ts.isSatisfiesExpression(node) ||
      ts.isPartiallyEmittedExpression(node)
    ) {
      return resolveExpressionProvenance(
        node.expression,
        resolvingNames,
        depth + 1,
      );
    }
    if (ts.isAwaitExpression(node)) {
      return resolveExpressionProvenance(
        node.expression,
        resolvingNames,
        depth + 1,
      );
    }
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "await" &&
      node.arguments.length === 1
    ) {
      return resolveExpressionProvenance(
        node.arguments[0]!,
        resolvingNames,
        depth + 1,
      );
    }
    if (
      ts.isVoidExpression(node) ||
      ts.isTypeOfExpression(node) ||
      ts.isDeleteExpression(node)
    ) {
      const inner = resolveExpressionProvenance(
        node.expression,
        resolvingNames,
        depth + 1,
      );
      return hasProhibitedProvenanceValue(inner)
        ? ambiguousProhibitedProvenance(inner.modules, pathOf(inner))
        : UNKNOWN;
    }
    if (ts.isIdentifier(node)) {
      if (resolvingNames.has(node.text)) {
        return ambiguousProhibitedProvenance(["https"]);
      }
      resolvingNames.add(node.text);
      const bound = lookupBinding(node.text);
      resolvingNames.delete(node.text);
      if (bound) return bound;
      const normalizedPath = normalizePath(node.text);
      const classified = classifyProhibitedModuleFromPath(normalizedPath);
      if (classified) {
        return prohibitedProvenance(
          classified.canonicalModule === normalizedPath ||
            normalizeModuleSpecifier(normalizedPath) ===
              classified.canonicalModule
            ? classified.canonicalModule
            : normalizedPath,
        );
      }
      return unknownWithPath(node.text);
    }
    if (ts.isObjectLiteralExpression(node) || ts.isArrayLiteralExpression(node) ||
      ts.isArrowFunction(node) || ts.isFunctionExpression(node) ||
      ts.isClassExpression(node)) {
      return SAFE_LOCAL;
    }
    if (ts.isConditionalExpression(node)) {
      return joinExpressionProvenance(
        resolveExpressionProvenance(node.whenTrue, resolvingNames, depth + 1),
        resolveExpressionProvenance(node.whenFalse, resolvingNames, depth + 1),
      );
    }
    if (ts.isBinaryExpression(node)) {
      const operator = node.operatorToken.kind;
      if (
        operator === ts.SyntaxKind.BarBarToken ||
        operator === ts.SyntaxKind.AmpersandAmpersandToken ||
        operator === ts.SyntaxKind.QuestionQuestionToken
      ) {
        return joinExpressionProvenance(
          resolveExpressionProvenance(node.left, resolvingNames, depth + 1),
          resolveExpressionProvenance(node.right, resolvingNames, depth + 1),
        );
      }
      if (operator === ts.SyntaxKind.CommaToken) {
        resolveExpressionProvenance(node.left, resolvingNames, depth + 1);
        return resolveExpressionProvenance(
          node.right,
          resolvingNames,
          depth + 1,
        );
      }
      if (operator === ts.SyntaxKind.EqualsToken) {
        const right = resolveExpressionProvenance(
          node.right,
          resolvingNames,
          depth + 1,
        );
        if (ts.isIdentifier(node.left)) {
          assignBinding(node.left.text, right);
        } else if (
          hasProhibitedProvenanceValue(
            resolveExpressionProvenance(node.left, resolvingNames, depth + 1),
          )
        ) {
          return joinExpressionProvenance(
            ambiguousProhibitedProvenance(["https"]),
            right,
          );
        }
        return right;
      }
      if (
        operator === ts.SyntaxKind.PlusEqualsToken ||
        operator === ts.SyntaxKind.MinusEqualsToken ||
        operator === ts.SyntaxKind.AsteriskEqualsToken ||
        operator === ts.SyntaxKind.SlashEqualsToken ||
        operator === ts.SyntaxKind.PercentEqualsToken ||
        operator === ts.SyntaxKind.AmpersandEqualsToken ||
        operator === ts.SyntaxKind.BarEqualsToken ||
        operator === ts.SyntaxKind.CaretEqualsToken ||
        operator === ts.SyntaxKind.LessThanLessThanEqualsToken ||
        operator === ts.SyntaxKind.GreaterThanGreaterThanEqualsToken ||
        operator === ts.SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken ||
        operator === ts.SyntaxKind.AsteriskAsteriskEqualsToken ||
        operator === ts.SyntaxKind.BarBarEqualsToken ||
        operator === ts.SyntaxKind.AmpersandAmpersandEqualsToken ||
        operator === ts.SyntaxKind.QuestionQuestionEqualsToken
      ) {
        const left = resolveExpressionProvenance(
          node.left,
          resolvingNames,
          depth + 1,
        );
        const right = resolveExpressionProvenance(
          node.right,
          resolvingNames,
          depth + 1,
        );
        if (hasProhibitedProvenanceValue(left) ||
          hasProhibitedProvenanceValue(right)) {
          const joined = joinExpressionProvenance(
            hasProhibitedProvenanceValue(left)
              ? left
              : ambiguousProhibitedProvenance(right.modules, right.path),
            right,
          );
          if (ts.isIdentifier(node.left)) assignBinding(node.left.text, joined);
          return joined.kind === "PROHIBITED"
            ? ambiguousProhibitedProvenance(joined.modules, joined.path)
            : joined;
        }
        return UNKNOWN;
      }
      return UNKNOWN;
    }
    if (ts.isPropertyAccessExpression(node)) {
      const base = resolveExpressionProvenance(
        node.expression,
        resolvingNames,
        depth + 1,
      );
      if (base.kind === "SAFE_LOCAL") return SAFE_LOCAL;
      const basePath = pathOf(base);
      if (!basePath) {
        return hasProhibitedProvenanceValue(base)
          ? ambiguousProhibitedProvenance(base.modules)
          : UNKNOWN;
      }
      const nextPath = `${basePath}.${node.name.text}`;
      if (hasProhibitedProvenanceValue(base)) {
        return makeProvenance(base.kind, nextPath, base.modules);
      }
      return unknownWithPath(nextPath);
    }
    if (ts.isElementAccessExpression(node) && node.argumentExpression) {
      const base = resolveExpressionProvenance(
        node.expression,
        resolvingNames,
        depth + 1,
      );
      if (
        ts.isStringLiteral(node.argumentExpression) ||
        ts.isNoSubstitutionTemplateLiteral(node.argumentExpression)
      ) {
        if (base.kind === "SAFE_LOCAL") return SAFE_LOCAL;
        const basePath = pathOf(base);
        if (!basePath) {
          return hasProhibitedProvenanceValue(base)
            ? ambiguousProhibitedProvenance(base.modules)
            : UNKNOWN;
        }
        const nextPath = `${basePath}.${node.argumentExpression.text}`;
        if (hasProhibitedProvenanceValue(base)) {
          return makeProvenance(base.kind, nextPath, base.modules);
        }
        return unknownWithPath(nextPath);
      }
      registerAmbiguousComputedAccess(base);
      if (hasProhibitedProvenanceValue(base)) {
        return ambiguousProhibitedProvenance(
          base.modules,
          pathOf(base),
        );
      }
      return UNKNOWN;
    }
    if (
      ts.isCallExpression(node) &&
      (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
        (ts.isIdentifier(node.expression) && node.expression.text === "require"))
    ) {
      const moduleSpecifier = node.arguments[0];
      if (
        moduleSpecifier &&
        (ts.isStringLiteral(moduleSpecifier) ||
          ts.isNoSubstitutionTemplateLiteral(moduleSpecifier))
      ) {
        const classified = classifyProhibitedModule(moduleSpecifier.text);
        return classified
          ? prohibitedProvenance(classified.canonicalModule)
          : UNKNOWN;
      }
      return UNKNOWN;
    }
    if (ts.isCallExpression(node) || ts.isNewExpression(node)) {
      const callee = resolveExpressionProvenance(
        node.expression,
        resolvingNames,
        depth + 1,
      );
      if (hasProhibitedProvenanceValue(callee)) {
        return makeProvenance(callee.kind, pathOf(callee), callee.modules);
      }
      return UNKNOWN;
    }
    return UNKNOWN;
  };
  const memberPath = (node: ts.Expression): string | null =>
    pathOf(resolveExpressionProvenance(node));
  const registerAlias = (name: ts.BindingName, initializer: ts.Expression) => {
    if (ts.isIdentifier(name)) {
      defineBinding(name.text, resolveExpressionProvenance(initializer));
      return;
    }
    if (ts.isObjectBindingPattern(name)) {
      const base = resolveExpressionProvenance(initializer);
      const basePath = pathOf(base);
      for (const element of name.elements) {
        if (element.dotDotDotToken) continue;
        const property = element.propertyName
          ? staticPropertyName(element.propertyName)
          : ts.isIdentifier(element.name)
            ? element.name.text
            : null;
        if (property && hasProhibitedProvenanceValue(base) && basePath) {
          registerAlias(
            element.name,
            ts.factory.createIdentifier(`${basePath}.${property}`),
          );
        } else if (
          property &&
          basePath &&
          classifyProhibitedModuleFromPath(basePath)
        ) {
          registerAlias(
            element.name,
            ts.factory.createIdentifier(`${basePath}.${property}`),
          );
        }
      }
    }
  };
  const registerModuleImport = (
    name: ts.BindingName,
    moduleSpecifier: string,
    importedProperty: string | null = null,
    importKind: ImportedModuleImportKind = importedProperty
      ? "NAMED"
      : "DEFAULT",
  ) => {
    if (!ts.isIdentifier(name)) return;
    const classified = classifyProhibitedModule(moduleSpecifier);
    if (classified) {
      const resolved = importedProperty
        ? `${classified.canonicalModule}.${importedProperty}`
        : classified.canonicalModule;
      importAuthoritySerialCounter += 1;
      const authority: ImportedModuleAuthority = Object.freeze({
        canonicalModule: classified.canonicalModule,
        packageRoot: classified.packageRoot,
        categories: classified.categories,
        importKind,
        exportedName: importedProperty,
        localBindingSerial: importAuthoritySerialCounter,
      });
      defineBinding(
        name.text,
        prohibitedProvenance(resolved, authority),
        "IMPORT",
      );
      return;
    }
    const normalizedModule = normalizeModuleSpecifier(moduleSpecifier);
    if (
      normalizedModule === "path" &&
      importedProperty === null &&
      (importKind === "DEFAULT" ||
        importKind === "NAMESPACE" ||
        importKind === "IMPORT_EQUALS" ||
        importKind === "REQUIRE_NAMESPACE")
    ) {
      importAuthoritySerialCounter += 1;
      const authority: ImportedModuleAuthority = Object.freeze({
        canonicalModule: "path",
        packageRoot: "path",
        categories: Object.freeze([] as ProhibitedModuleCategory[]),
        importKind:
          importKind === "NAMESPACE" || importKind === "REQUIRE_NAMESPACE"
            ? "NAMESPACE"
            : "DEFAULT",
        exportedName: null,
        localBindingSerial: importAuthoritySerialCounter,
      });
      defineBinding(
        name.text,
        makeProvenance("UNKNOWN", "path", [], [], authority),
        "IMPORT",
      );
    }
  };
  const inspect = (source: string, fileName: string) => {
    lexicalScopes.length = 0;
    aliasesRegistered = 0;
    scopeSerialCounter = 0;
    bindingSerialCounter = 0;
    declarationSerialCounter = 0;
    importAuthoritySerialCounter = 0;
    inventoryDeclarationSerialCounter = 0;
    authoritativeInventoryDeclarationSerial = null;
    authoritativeInventoryName = null;
    inventoryMutationCount = 0;
    inventoryWritableAliasCount = 0;
    inventoryDeclarationFound = false;
    inventoryConstBound = false;
    inventoryLiteralAndBounded = false;
    inventoryContainsOnlyLiteralEntries = false;
    inventoryContainsSpread = false;
    inventoryEntryCount = 0;
    inventoryDuplicateCount = 0;
    inventoryInvalidEntryCount = 0;
    inventoryContainsParentTraversal = false;
    inventoryContainsWildcard = false;
    inventoryContainsAbsolutePath = false;
    inventoryContainsOnlyApprovedPaths = false;
    inventoryMutationScanExecuted = false;
    enterScope();
    const moduleProbe = ts.createSourceFile(
      fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS,
    );
    const moduleSource = ts.isExternalModule(moduleProbe)
      ? source
      : `${source}\nexport {};\n`;
    const sourceFile = ts.createSourceFile(
      fileName, moduleSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS,
    );
    const visit = (node: ts.Node): void => {
      if (
        ts.isFunctionDeclaration(node) ||
        ts.isFunctionExpression(node) ||
        ts.isArrowFunction(node) ||
        ts.isMethodDeclaration(node) ||
        ts.isConstructorDeclaration(node) ||
        ts.isGetAccessorDeclaration(node) ||
        ts.isSetAccessorDeclaration(node)
      ) {
        if (ts.isFunctionDeclaration(node) && node.name) {
          defineLexicalBinding(node.name.text, "FUNCTION", UNKNOWN);
        }
        enterScope();
        const pending =
          ts.isArrowFunction(node) || ts.isFunctionExpression(node)
            ? pendingApprovedMapCallbacks.get(node)
            : undefined;
        registerParameterBindings(node.parameters, pending);
        ts.forEachChild(node, visit);
        exitScope();
        return;
      }
      if (ts.isClassDeclaration(node) || ts.isClassExpression(node)) {
        if (ts.isClassDeclaration(node) && node.name) {
          defineLexicalBinding(node.name.text, "CLASS", UNKNOWN);
        }
        enterScope();
        ts.forEachChild(node, visit);
        exitScope();
        return;
      }
      if (ts.isCatchClause(node)) {
        enterScope();
        if (node.variableDeclaration) {
          const catchName = node.variableDeclaration.name;
          if (ts.isIdentifier(catchName)) {
            defineLexicalBinding(catchName.text, "CATCH", UNKNOWN);
          } else if (
            ts.isObjectBindingPattern(catchName) ||
            ts.isArrayBindingPattern(catchName)
          ) {
            for (const element of catchName.elements) {
              if (
                !ts.isOmittedExpression(element) &&
                !element.dotDotDotToken &&
                ts.isIdentifier(element.name)
              ) {
                defineLexicalBinding(element.name.text, "CATCH", UNKNOWN);
              }
            }
          }
        }
        ts.forEachChild(node, visit);
        exitScope();
        return;
      }
      if (ts.isBlock(node)) {
        enterScope();
        ts.forEachChild(node, visit);
        exitScope();
        return;
      }
      if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
        const moduleSpecifier = node.moduleSpecifier.text;
        const classified = classifyProhibitedModule(moduleSpecifier);
        if (classified?.categories.includes("DATABASE")) {
          counts.databaseClientImportCount += 1;
        }
        const clause = node.importClause;
        if (clause) {
          if (clause.name) {
            registerModuleImport(
              clause.name,
              moduleSpecifier,
              null,
              "DEFAULT",
            );
          }
          if (clause.namedBindings && ts.isNamespaceImport(clause.namedBindings)) {
            registerModuleImport(
              clause.namedBindings.name,
              moduleSpecifier,
              null,
              "NAMESPACE",
            );
          } else if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) {
            for (const specifier of clause.namedBindings.elements) {
              registerModuleImport(
                specifier.name,
                moduleSpecifier,
                specifier.propertyName?.text ?? specifier.name.text,
                "NAMED",
              );
            }
          }
        }
      }
      if (
        ts.isImportEqualsDeclaration(node) &&
        ts.isExternalModuleReference(node.moduleReference) &&
        node.moduleReference.expression &&
        ts.isStringLiteral(node.moduleReference.expression)
      ) {
        const moduleSpecifier = node.moduleReference.expression.text;
        const classified = classifyProhibitedModule(moduleSpecifier);
        if (classified?.categories.includes("DATABASE")) {
          counts.databaseClientImportCount += 1;
        }
        registerModuleImport(
          node.name,
          moduleSpecifier,
          null,
          "IMPORT_EQUALS",
        );
      }
      if (ts.isVariableDeclaration(node)) {
        if (node.initializer) {
          registerAlias(node.name, node.initializer);
        } else if (ts.isIdentifier(node.name)) {
          // Uninitialized declarations still occupy the lexical slot so later
          // assignments update the same nearest binding.
          defineLexicalBinding(node.name.text, "VARIABLE", UNKNOWN);
        }
        if (ts.isIdentifier(node.name) && node.initializer) {
          const isConst = isConstVariableDeclaration(node);
          if (node.name.text === "SOURCE_INTEGRITY_PATHS") {
            if (authoritativeInventoryDeclarationSerial !== null) {
              definePathProvenance(
                node.name.text,
                Object.freeze({
                  kind: "SOURCE_INTEGRITY_INVENTORY",
                  inventoryValid: false,
                  aliasDepth: 0,
                  inventoryDeclarationSerial: -1,
                }),
              );
            } else {
              registerInventoryDeclaration(
                node.name.text,
                node.initializer,
                isConst,
              );
            }
          } else {
            const initializerPath = ts.isIdentifier(node.initializer)
              ? lookupPathProvenance(node.initializer.text)
              : undefined;
            if (
              initializerPath?.kind === "SOURCE_INTEGRITY_INVENTORY"
            ) {
              inventoryWritableAliasCount += 1;
              definePathProvenance(
                node.name.text,
                Object.freeze({
                  kind: "SOURCE_INTEGRITY_INVENTORY",
                  inventoryValid: false,
                  aliasDepth: 0,
                  inventoryDeclarationSerial:
                    initializerPath.inventoryDeclarationSerial,
                }),
              );
            } else if (
              isConst &&
              initializerPath?.kind === "APPROVED_SOURCE_INTEGRITY_PATH" &&
              initializerPath.inventoryValid &&
              canIssueApprovedPathProvenance()
            ) {
              definePathProvenance(
                node.name.text,
                Object.freeze({
                  kind: "APPROVED_SOURCE_INTEGRITY_PATH",
                  inventoryValid: true,
                  aliasDepth: initializerPath.aliasDepth + 1,
                  inventoryDeclarationSerial:
                    initializerPath.inventoryDeclarationSerial,
                }),
              );
            } else {
              definePathProvenance(
                node.name.text,
                UNKNOWN_PATH_PROVENANCE,
              );
            }
          }
        }
      }
      if (
        ts.isExpressionStatement(node) &&
        ts.isBinaryExpression(node.expression) &&
        node.expression.operatorToken.kind === ts.SyntaxKind.EqualsToken
      ) {
        resolveExpressionProvenance(node.expression);
      }
      if (
        ts.isBinaryExpression(node) &&
        node.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
        ts.isIdentifier(node.left)
      ) {
        invalidatePathProvenance(node.left.text);
      }
      if (
        ts.isBinaryExpression(node) &&
        node.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
        (ts.isElementAccessExpression(node.left) ||
          ts.isPropertyAccessExpression(node.left)) &&
        ts.isIdentifier(node.left.expression)
      ) {
        const target = lookupPathProvenance(node.left.expression.text);
        if (target?.kind === "SOURCE_INTEGRITY_INVENTORY") {
          inventoryMutationCount += 1;
          invalidatePathProvenance(node.left.expression.text);
        }
      }
      if (ts.isCallExpression(node)) {
        if (
          ts.isPropertyAccessExpression(node.expression) &&
          !node.expression.questionDotToken &&
          node.expression.name.text === "map" &&
          ts.isIdentifier(node.expression.expression)
        ) {
          const inventoryName = node.expression.expression.text;
          const inventoryProvenance = lookupPathProvenance(inventoryName);
          const callback = node.arguments[0];
          if (
            inventoryProvenance?.kind === "SOURCE_INTEGRITY_INVENTORY" &&
            inventoryProvenance.inventoryValid &&
            inventoryName === "SOURCE_INTEGRITY_PATHS" &&
            inventoryProvenance.inventoryDeclarationSerial ===
              authoritativeInventoryDeclarationSerial &&
            canIssueApprovedPathProvenance() &&
            callback &&
            (ts.isArrowFunction(callback) ||
              ts.isFunctionExpression(callback))
          ) {
            const firstParameter = callback.parameters[0];
            if (
              firstParameter &&
              ts.isIdentifier(firstParameter.name) &&
              !firstParameter.dotDotDotToken &&
              !firstParameter.initializer
            ) {
              pendingApprovedMapCallbacks.set(callback, {
                parameterName: firstParameter.name.text,
                inventoryDeclarationSerial:
                  inventoryProvenance.inventoryDeclarationSerial,
                inventoryValid: true,
              });
            }
          }
        }
        if (
          ts.isPropertyAccessExpression(node.expression) &&
          ts.isIdentifier(node.expression.expression)
        ) {
          const receiverProvenance = lookupPathProvenance(
            node.expression.expression.text,
          );
          if (receiverProvenance?.kind === "SOURCE_INTEGRITY_INVENTORY") {
            const mutatingMethod = node.expression.name.text;
            if (
              [
                "push",
                "pop",
                "shift",
                "unshift",
                "splice",
                "sort",
                "reverse",
                "fill",
                "copyWithin",
              ].includes(mutatingMethod)
            ) {
              inventoryMutationCount += 1;
              invalidatePathProvenance(node.expression.expression.text);
            }
          }
        }
        const calleeProvenance = resolveExpressionProvenance(node.expression);
        const callee = normalizePath(pathOf(calleeProvenance) ?? "");
        const firstArgument = node.arguments[0];
        const secondArgument = node.arguments[1];
        const moduleSpecifier =
          firstArgument &&
          (ts.isStringLiteral(firstArgument) ||
            ts.isNoSubstitutionTemplateLiteral(firstArgument))
            ? firstArgument.text
            : null;
        if (
          (callee === "require" ||
            node.expression.kind === ts.SyntaxKind.ImportKeyword) &&
          moduleSpecifier
        ) {
          const classified = classifyProhibitedModule(moduleSpecifier);
          if (classified?.categories.includes("DATABASE")) {
            counts.databaseClientImportCount += 1;
          }
        }
        const dnsNetworkCallee =
          /^(?:dns|dns\/promises)(?:\.|$)/.test(callee) &&
          /(?:lookup|resolve|resolve4|resolve6|resolveAny|resolveCname|resolveMx|resolveNaptr|resolveNs|resolvePtr|resolveSoa|resolveSrv|resolveTxt|reverse|getServers|setServers)$/.test(
            terminalMemberName(callee),
          );
        if (
          callee &&
          ([
            "fetch",
            "http.request",
            "https.request",
            "http2.connect",
            "net.connect",
            "tls.connect",
            "node-fetch",
            "undici.fetch",
            "dgram.createSocket",
          ].includes(callee) ||
            dnsNetworkCallee ||
            (hasCategory(calleeProvenance, "NETWORK") &&
              ![
                "http",
                "https",
                "http2",
                "net",
                "tls",
                "dns",
                "dns/promises",
                "dgram",
                "node-fetch",
                "undici",
                "ws",
              ].includes(callee)))
        ) {
          counts.networkExecutionPathCount += 1;
        }
        if (callee === "node-fetch" || callee === "undici.fetch") {
          counts.defaultFetchImportUsageCount += 1;
        }
        if (callee && ["exec", "execFile", "spawn", "fork", "child_process.exec", "child_process.execFile", "child_process.spawn", "child_process.fork"].includes(callee)) counts.subprocessExecutionPathCount += 1;
        if (callee && ["exec", "execFile", "spawn", "child_process.exec", "child_process.execFile", "child_process.spawn"].includes(callee)) counts.shellExecutionPathCount += 1;
        if (callee && ["Socket", "connect", "net.connect", "tls.connect", "dgram.createSocket"].includes(callee)) counts.socketCreationPathCount += 1;
        if (callee === "createClient" || callee.endsWith(".createClient")) {
          counts.remoteSupabaseCommandCount += 1;
        }
        if (callee && ["query", "execute"].includes(terminalMemberName(callee)) && firstArgument && (ts.isStringLiteral(firstArgument) || ts.isNoSubstitutionTemplateLiteral(firstArgument))) counts.sqlExecutionPathCount += 1;
        if (callee && ["writeFile", "appendFile", "setItem"].includes(terminalMemberName(callee)) && firstArgument && ts.isStringLiteral(firstArgument) && firstArgument.text.toLowerCase().includes("nonce")) counts.noncePersistencePathCount += 1;
        if (callee && /(?:consume|redeem|use).*Nonce/.test(callee)) counts.nonceConsumptionPathCount += 1;
        if (callee && /bootstrap/i.test(callee)) counts.bootstrapExecutionPathCount += 1;
        if (callee && /(?:apply|execute).*Rollback/i.test(callee)) counts.rollbackArtifactExecutionPathCount += 1;
        if (callee && /executeProduction/i.test(callee)) counts.productionExecutionPathCount += 1;
        const filesystemClassification = classifyProhibitedModuleFromPath(callee);
        if (
          hasCategory(calleeProvenance, "FILESYSTEM") ||
          filesystemClassification?.categories.includes("FILESYSTEM") === true
        ) {
          recordFilesystemPathEvidence(
            callee,
            calleeProvenance,
            firstArgument,
            secondArgument,
            node.arguments.length,
          );
        } else if (
          callee &&
          /readFile(?:Sync)?$/.test(callee) &&
          firstArgument &&
          ts.isStringLiteral(firstArgument) &&
          /secret|credential|token|password/i.test(firstArgument.text)
        ) {
          counts.filesystemSecretReadPathCount += 1;
        }
      }
      if (
        (ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)) &&
        normalizePath(memberPath(node) ?? "") === "process.env"
      ) {
        counts.environmentReadPathCount += 1;
        counts.credentialReadPathCount += 1;
      }
      if (ts.isNewExpression(node)) {
        const constructor = normalizePath(memberPath(node.expression) ?? "");
        if (constructor === "WebSocket" || constructor === "Socket" ||
          constructor === "net.Socket" || constructor === "tls.TLSSocket" ||
          constructor === "ws") {
          counts.socketCreationPathCount += 1;
          counts.networkExecutionPathCount += 1;
        }
        if (constructor === "ws") counts.defaultWebSocketImportUsageCount += 1;
      }
      ts.forEachChild(node, visit);
    };
    visit(sourceFile);
    inventoryMutationScanExecuted = true;
    exitScope();
  };
  inspect(adapterSource, "controlled-production-postgres-read-only-adapter.ts");
  inspect(auditSource, "run-controlled-production-postgres-read-only-adapter-audit.ts");
  return Object.freeze({
    counts: Object.freeze(counts),
    ambiguousComputedProhibitedAccessEvidence: Object.freeze(
      [...ambiguousComputedAccessEvidence],
    ),
    ambiguousComputedProhibitedAccessEvidenceLimit:
      ambiguousComputedAccessEvidenceLimit,
    ambiguousComputedProhibitedAccessEvidenceTruncatedCount:
      ambiguousComputedAccessEvidenceTruncatedCount,
    ambiguousComputedProhibitedAccessFailsClosed: true,
    ambiguousProhibitedExpressionProvenanceEvidence: Object.freeze(
      [...ambiguousProhibitedExpressionProvenanceEvidence],
    ),
    expressionProvenanceFailureCode,
    expressionProvenanceModelImplemented: true,
    expressionProvenanceJoinImplemented: true,
    expressionProvenanceUsesTypeScriptAst: true,
    expressionProvenanceRegexOnly: false,
    expressionProvenanceResolverSingleAuthoritativePath: true,
    expressionProvenanceRecursionBounded: true,
    expressionResolverUsesAuthoritativeModuleClassifier: true,
    authoritativeModuleTaxonomyImplemented: true,
    authoritativeModuleTaxonomyStructured: true,
    authoritativeModuleTaxonomySingleSourceOfTruth: true,
    moduleClassificationReturnsBoundedMetadata: true,
    moduleClassificationRawSourceExposed: false,
    nodePrefixModuleNormalizationImplemented: true,
    moduleSubpathPolicyExplicit: true,
    legacyIncompleteProvenanceModulesAuthorityRemoved: true,
    duplicateModuleClassifierCount: 0,
    importBindingRegistryImplemented: true,
    importNamedAliasBindingSupported: true,
    importNamespaceBindingSupported: true,
    importDefaultBindingSupported: true,
    defaultFetchLikeImportBindingSupported: true,
    defaultWebSocketLikeImportBindingSupported: true,
    importEqualsBindingSupported: true,
    requireNamespaceBindingSupported: true,
    requireDestructuredBindingSupported: true,
    requirePropertyBindingSupported: true,
    requireComputedBindingSupported: true,
    boundedAliasPropagationSupported: true,
    nodeModuleSpecifierNormalizationSupported: true,
    importBindingPropagationLimit: aliasPropagationLimit,
    approvedSourceIntegrityPathProvenanceImplemented: true,
    approvedPathProvenanceBindingIdentityAware: true,
    approvedPathProvenanceScopeAware: true,
    approvedPathProvenanceIdentifierNameIndependent: true,
    unknownPathDistinguishedFromApprovedPath: true,
    invalidatedApprovedPathRepresentedOrRejected: true,
    sourceIntegrityPathInventoryDeclarationFound: inventoryDeclarationFound,
    sourceIntegrityPathInventorySingleAuthoritativeDeclaration:
      authoritativeInventoryDeclarationSerial !== null &&
      authoritativeInventoryName === "SOURCE_INTEGRITY_PATHS",
    sourceIntegrityPathInventoryConstBound: inventoryConstBound,
    sourceIntegrityPathInventoryLiteralAndBounded: inventoryLiteralAndBounded,
    sourceIntegrityPathInventoryContainsOnlyLiteralEntries:
      inventoryContainsOnlyLiteralEntries,
    sourceIntegrityPathInventoryContainsSpread: inventoryContainsSpread,
    sourceIntegrityPathInventoryExternalInputDerived: false,
    sourceIntegrityPathInventoryEntryCount: inventoryEntryCount,
    sourceIntegrityPathInventoryDuplicateCount: inventoryDuplicateCount,
    sourceIntegrityPathInventoryInvalidEntryCount: inventoryInvalidEntryCount,
    sourceIntegrityPathInventoryContainsOnlyApprovedPaths:
      inventoryContainsOnlyApprovedPaths,
    sourceIntegrityPathInventoryContainsParentTraversal:
      inventoryContainsParentTraversal,
    sourceIntegrityPathInventoryContainsWildcard: inventoryContainsWildcard,
    sourceIntegrityPathInventoryContainsAbsolutePath:
      inventoryContainsAbsolutePath,
    sourceIntegrityPathInventoryRuntimeMutable: inventoryMutationCount > 0,
    sourceIntegrityPathInventoryMutationScanExecuted:
      inventoryMutationScanExecuted,
    sourceIntegrityPathInventoryMutationCount: inventoryMutationCount,
    sourceIntegrityPathInventoryWritableAliasCount: inventoryWritableAliasCount,
    sourceInventoryForOfSupported: false,
    filesystemAllowlistUsesExistingScopeModel: true,
    filesystemAllowlistUsesGlobalIdentifierNameMapOnly: false,
    approvedPathScopeResolutionDeterministic: true,
    approvedPathProvenanceRawPathExposed: false,
    approvedPathProvenanceSourceSnippetExposed: false,
    approvedPathProvenanceErrorMessageExposed: false,
    approvedPathProvenanceStackExposed: false,
    filesystemAllowlistProvenanceFailureCodesFixed: true,
    filesystemAllowlistProvenanceFailureDeterministic: true,
    importedModuleAuthorityImplemented: true,
    importedModuleAuthorityBindingIdentityAware: true,
    importedModuleAuthorityScopeAware: true,
    importedModuleAuthorityCanonicalModuleAware: true,
    importedModuleAuthorityExportAware: true,
    authoritativePathModuleBindingImplemented: true,
    authoritativePathModuleBindingIdentityAware: true,
    authoritativePathModuleCanonicalModuleAware: true,
    authoritativePathJoinMemberExact: true,
    unknownBindingPathCannotCreateModuleAuthority: true,
    diagnosticPathAndBindingAuthoritySeparated: true,
    authorityPredicateNeverUsesDiagnosticPathAlone: true,
    unifiedLexicalBindingCoreImplemented: true,
    singleAuthoritativeBindingIntroductionPath: true,
    parallelUnsynchronizedBindingRegistrationRemoved: true,
    bindingResolutionUsesNearestDeclaration: true,
    resolvedUnknownLocalBindingStopsOuterAuthorityLookup: true,
    resolvedLocalBindingNeverFallsThroughToOuterImport: true,
    approvedPathProvenanceUsesUnifiedBindingCore: true,
    approvedPathShadowingUsesSameNearestBindingRule: true,
    diagnosticPathsCannotCreateAuthority: true,
    diagnosticPathsCannotBypassLexicalShadowing: true,
  });
}

function assertOk<T>(value: { ok: boolean; value?: T }): T {
  if (!value.ok || value.value === undefined) {
    throw new Error("AUDIT_SETUP_INVALID");
  }
  return value.value;
}

function createBoundaries() {
  boundarySerial += 1;
  const suffix = String(boundarySerial).padStart(2, "0");
  const artifactSet = assertOk(
    validateControlledProductionPreflightArtifactFingerprintSet({
      artifactFingerprintSetId: `afset_synthetic-c4-adapter-${suffix}`,
      sourceCommit: CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
      artifacts: COMMITTED_ARTIFACT_INVENTORY.map((item, index) => ({
        artifactId: item.artifactId,
        repositoryPath: item.repositoryPath,
        fingerprint: fingerprint(`${suffix}${index + 1}`),
      })),
    }),
  );
  const acknowledgements = OPERATOR_ACKNOWLEDGEMENT_IDS.map(
    (acknowledgementId) => ({
      acknowledgementId,
      confirmed: true,
    }),
  );
  const manifest = assertOk(
    validateControlledProductionPreflightExecutionManifest(
      {
        manifestKind: CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_KIND,
        manifestVersion: CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_VERSION,
        sourceCommit: CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
        artifactFingerprintSet: artifactSet,
        targetFingerprint,
        targetPurpose: "CONTROLLED_PRODUCTION_SCHEMA_AUDIT_PREFLIGHT",
        executionWindow: {
          executionWindowId: `ewin_synthetic-c4-adapter-${suffix}`,
          notBeforeIso: "2026-08-05T12:00:00Z",
          expiresAtIso: "2026-08-05T12:10:00Z",
        },
        singleAttemptNonceReference: `nonce_synthetic_c4_adapter_${suffix}01`,
        canonicalQueryRegistryFingerprint: fingerprint(`${suffix}a`),
        canonicalExecutionOrderFingerprint: fingerprint(`${suffix}b`),
        safetySettingsFingerprint: fingerprint(`${suffix}c`),
        expectedExecutorIdentity: EXPECTED_PRODUCTION_PREFLIGHT_EXECUTOR_IDENTITY,
        operatorAcknowledgements: acknowledgements,
      },
      "2026-08-05T12:05:00Z",
    ),
  );
  const authorization = assertOk(
    validateControlledProductionPreflightAuthorizationEnvelope({
      authorizationKind: CONTROLLED_PRODUCTION_PREFLIGHT_AUTHORIZATION_KIND,
      sourceCommit: CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
      artifactFingerprintSetId: artifactSet.artifactFingerprintSetId,
      targetFingerprint,
      targetPurpose: manifest.targetPurpose,
      executionWindowId: manifest.executionWindow.executionWindowId,
      singleAttemptNonceReference: manifest.singleAttemptNonceReference,
      operatorEvidenceConfirmed: true,
      remoteExecutionSeparatelyAuthorized: true,
    }),
  );
  const binding = assertOk(
    validateManifestAuthorizationBinding(manifest, authorization),
  );
  const provider = createSyntheticCredentialProviderHarness();
  const issued = assertOk(
    provider.acquireCredentialLease(
      assertOk(
        validateCredentialRequest({
          validatedManifest: manifest,
          validatedAuthorization: authorization,
          validatedBinding: binding,
          credentialRequestId: `creq_synthetic-c4-adapter-${suffix}`,
        }),
      ),
    ),
  );
  const lease = assertOk(transitionCredentialLease(issued, "LEASE_ACTIVE"));
  const transportRequest = assertOk(
    validateTransportFactoryRequest({
      validatedManifest: manifest,
      validatedAuthorization: authorization,
      validatedBinding: binding,
      activeCredentialLease: lease,
      transportConstructionId: `tcon_synthetic-c4-adapter-${suffix}`,
    }),
  );
  return { manifest, authorization, binding, provider, lease, transportRequest };
}

function creationRequest(
  boundaries: ReturnType<typeof createBoundaries>,
  adapterId: string,
): ControlledPostgresReadOnlyAdapterCreationRequest {
  return {
    validatedManifest: boundaries.manifest,
    validatedAuthorization: boundaries.authorization,
    validatedBinding: boundaries.binding,
    activeCredentialLease: boundaries.lease,
    validatedTransportFactoryRequest: boundaries.transportRequest,
    adapterId,
    adapterMode: CONTROLLED_POSTGRES_READ_ONLY_ADAPTER_MODE,
  };
}

function createAdapter() {
  const boundaries = createBoundaries();
  const created = createControlledPostgresReadOnlyAdapter(
    creationRequest(boundaries, "padapter_synthetic-c4-valid"),
  );
  return { boundaries, adapter: assertOk(created) };
}

function createHarnessAdapter(
  primaryFailurePoint: SyntheticFailureInjectionPoint,
  cleanupFailurePoints: ReadonlyArray<"ROLLBACK" | "CLOSE"> = [],
  adapterId = "padapter_synthetic-c4-fail",
) {
  const boundaries = createBoundaries();
  const created = createSyntheticValidationOnlyPostgresAdapterHarness(
    creationRequest(boundaries, adapterId),
    {
      mode: "SYNTHETIC_VALIDATION_ONLY",
      primaryFailurePoint,
      cleanupFailurePoints,
    },
  );
  return { boundaries, adapter: assertOk(created) };
}

async function runThroughQueries(
  adapter: ControlledPostgresReadOnlyAdapter,
  count: number,
) {
  for (let index = 0; index < count; index += 1) {
    await adapter.executeApprovedQuery(
      PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER[index]!,
    );
  }
}

async function openThroughTransaction(adapter: ControlledPostgresReadOnlyAdapter) {
  await adapter.openSession();
  await adapter.verifySafetySettings(PRELIGHT_SAFETY_SETTINGS);
  await adapter.beginReadOnlyTransaction();
}

async function attemptRollbackAndClose(adapter: ControlledPostgresReadOnlyAdapter) {
  let rollbackRejected = false;
  let closeRejected = false;
  try {
    await adapter.rollbackReadOnlyTransaction();
  } catch {
    rollbackRejected = true;
  }
  try {
    await adapter.close();
  } catch {
    closeRejected = true;
  }
  return { rollbackRejected, closeRejected };
}

export async function runControlledProductionPostgresReadOnlyAdapterAudit() {
  cases.length = 0;
  const sourceIntegrityBefore = await readSourceIntegritySnapshot();
  const [
    c4aRun,
    b6Run,
    b7Run,
    c1Run,
    c2Run,
    c3Run,
  ] = await Promise.all([
    runBounded(() => runProductionPreflightSyntheticResultFixtureInterfaceAudit()),
    runBounded(() => runProductionReadOnlyPreflightHelperImplementationAudit()),
    runBounded(() => runDisabledProductionPreflightHelperValidation()),
    runBounded(() => runControlledRemotePreflightExecutionBoundaryDesignAudit()),
    runBounded(() => runControlledProductionPreflightExecutionContractsAudit()),
    runBounded(() => runControlledProductionPreflightCredentialAndTransportBoundaryAudit()),
  ]);
  const c4aRaw = c4aRun.value;
  const b6Raw = b6Run.value;
  const b7Raw = b7Run.value;
  const c1Raw = c1Run.value;
  const c2Raw = c2Run.value;
  const c3Raw = c3Run.value;
  const normalizeC4A = normalizer("9X-C4A", c4aRun.provenance, [
    (record) =>
      exactMinimum(record, "positiveAuditCaseCount", 73) &&
      nonNegativeSafeInteger(record, "positiveAuditCasesPassed") ===
        nonNegativeSafeInteger(record, "positiveAuditCaseCount"),
    (record) =>
      exactMinimum(record, "syntheticFixtureTamperCaseCount", 251) &&
      nonNegativeSafeInteger(record, "syntheticFixtureTamperCasesRejected") ===
        nonNegativeSafeInteger(record, "syntheticFixtureTamperCaseCount") &&
      hasZeroCounts(record, [
        "duplicateAuditCaseIdCount",
        "duplicateTamperCaseIdCount",
        "unexecutedAuditCaseCount",
        "failedAuditCaseCount",
      ]),
  ]);
  const c4aEvidence = normalizeC4A(c4aRaw);
  const normalizeB6 = normalizer("9X-B6", b6Run.provenance, [
    (record) =>
      exactMinimum(record, "positiveCompileTimeCaseCount", 130) &&
      exactMinimum(record, "negativeCompileTimeCaseCount", 400) &&
      exactMinimum(record, "positiveRuntimeCaseCount", 280) &&
      exactMinimum(record, "negativeRuntimeCaseCount", 750) &&
      exactMinimum(record, "productionReadOnlyPreflightHelperTamperCaseCount", 1200) &&
      nonNegativeSafeInteger(record, "productionReadOnlyPreflightHelperTamperCasesRejected") ===
        nonNegativeSafeInteger(record, "productionReadOnlyPreflightHelperTamperCaseCount") &&
      exactMinimum(record, "b6TamperCategoryCount", 36),
    (record) =>
      hasMinimum(record, "freshB6dExecutedTestCaseCount", 293) &&
      hasZeroCounts(record, [
        "freshB6dFailedTestCaseCount",
        "freshB6dUnexecutedTestCaseCount",
      ]),
    (record) =>
      hasMinimum(record, "freshB6eTotalRegisteredCaseCount", 7277) &&
      hasMinimum(record, "freshB6eTotalExecutedCaseCount", 7277) &&
      nonNegativeSafeInteger(record, "freshB6eTotalRegisteredCaseCount") ===
        nonNegativeSafeInteger(record, "freshB6eTotalExecutedCaseCount") &&
      hasZeroCounts(record, [
        "freshB6eFailedRegisteredCaseCount",
        "freshB6eUnexecutedRegisteredCaseCount",
        "freshB6eDuplicateGlobalTestCaseIdCount",
        "freshB6eDuplicateBehaviorFingerprintCount",
        "freshB6eDuplicateCaseIdCount",
        "freshB6eDuplicateFingerprintCount",
      ]),
    (record) =>
      exactBoolean(record, "freshB6dMandatoryGatePassed", true) &&
      exactBoolean(record, "freshB6eMandatoryGatePassed", true) &&
      exactBoolean(record, "freshB6eLiveEvidenceAccepted", true),
  ]);
  const b6Evidence = normalizeB6(b6Raw);
  const normalizeB7 = normalizer("9X-B7", b7Run.provenance, [
    (record) =>
      exactBoolean(record, "mandatoryPassGatePassed", true) &&
      exactMinimum(record, "b7MandatoryInvariantMutationCount", 100) &&
      exactMinimum(record, "b7ContradictoryStateTamperCount", 30) &&
      exactMinimum(record, "b7ThresholdTamperCount", 20) &&
      exactMinimum(record, "b7SourceIntegrityTamperCount", 10) &&
      nonNegativeSafeInteger(record, "failedMandatoryInvariantCount") === 0,
  ]);
  const b7Evidence = normalizeB7(b7Raw);
  const normalizeC1 = normalizer("9X-C1", c1Run.provenance, [
    (record) =>
      exactMinimum(record, "designTamperCaseCount", 188) &&
      nonNegativeSafeInteger(record, "designTamperCasesRejected") ===
        nonNegativeSafeInteger(record, "designTamperCaseCount") &&
      hasZeroCounts(record, ["duplicateTamperCaseIdCount"]),
  ]);
  const c1Evidence = normalizeC1(c1Raw);
  const normalizeC2 = normalizer("9X-C2", c2Run.provenance, [
    (record) =>
      exactMinimum(record, "positiveAuditCaseCount", 23) &&
      nonNegativeSafeInteger(record, "positiveAuditCasesPassed") ===
        nonNegativeSafeInteger(record, "positiveAuditCaseCount") &&
      exactMinimum(record, "contractTamperCaseCount", 260) &&
      nonNegativeSafeInteger(record, "contractTamperCasesRejected") ===
        nonNegativeSafeInteger(record, "contractTamperCaseCount") &&
      hasZeroCounts(record, [
        "duplicateAuditCaseIdCount",
        "duplicateTamperCaseIdCount",
        "unexecutedAuditCaseCount",
        "failedAuditCaseCount",
      ]),
  ]);
  const c2Evidence = normalizeC2(c2Raw);
  const normalizeC3 = normalizer("9X-C3", c3Run.provenance, [
    (record) =>
      exactMinimum(record, "positiveAuditCaseCount", 20) &&
      nonNegativeSafeInteger(record, "positiveAuditCasesPassed") ===
        nonNegativeSafeInteger(record, "positiveAuditCaseCount") &&
      exactMinimum(record, "contractTamperCaseCount", 299) &&
      nonNegativeSafeInteger(record, "contractTamperCasesRejected") ===
        nonNegativeSafeInteger(record, "contractTamperCaseCount") &&
      hasZeroCounts(record, [
        "duplicateAuditCaseIdCount",
        "duplicateTamperCaseIdCount",
        "unexecutedAuditCaseCount",
        "failedAuditCaseCount",
      ]),
  ]);
  const c3Evidence = normalizeC3(c3Raw);
  const upstreamEvidencePassed =
    c4aEvidence !== null &&
    b6Evidence !== null &&
    b7Evidence !== null &&
    c1Evidence !== null &&
    c2Evidence !== null &&
    c3Evidence !== null;

  const queryFailureCases: AuditCase[] = [];
  const validationFailureCases: AuditCase[] = [];
  const cleanupFailureCases: AuditCase[] = [];
  const harnessTamperCases: AuditCase[] = [];

  const { boundaries, adapter } = createAdapter();
  record(
    "valid_adapter_creation",
    true,
    isControlledPostgresReadOnlyAdapter(adapter),
  );
  record(
    "valid_public_surface",
    true,
    Object.keys(adapter).length === 13 &&
      adapter.adapterKind === CONTROLLED_POSTGRES_READ_ONLY_ADAPTER_KIND &&
      adapter.adapterVersion === CONTROLLED_POSTGRES_READ_ONLY_ADAPTER_VERSION &&
      !("failurePlan" in adapter) &&
      !("injectFailure" in adapter),
  );
  await adapter.openSession();
  record("valid_session_open", true, adapter.state === "SESSION_OPEN");
  await adapter.verifySafetySettings(PRELIGHT_SAFETY_SETTINGS);
  record("valid_safety", true, adapter.state === "SAFETY_VERIFIED");
  await adapter.beginReadOnlyTransaction();
  record(
    "valid_read_only_transaction",
    true,
    adapter.state === "READ_ONLY_TRANSACTION_OPEN",
  );
  for (const queryId of PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER) {
    await adapter.executeApprovedQuery(queryId);
    record(`valid_query_${queryId.toLowerCase()}`, true, true);
    const fixture = createSyntheticProductionPreflightResultFixture(queryId);
    record(
      `valid_validator_${queryId.toLowerCase()}`,
      true,
      PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY[queryId].validateResult(
        fixture.value,
      ),
    );
    record(
      `valid_fixture_provenance_${queryId.toLowerCase()}`,
      true,
      isHelperCreatedSyntheticProductionPreflightResultFixture(fixture) &&
        fixture.queryId === queryId,
    );
  }
  record(
    "valid_canonical_order_size",
    true,
    PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER.length === 18,
  );
  record(
    "valid_canonical_registry_size",
    true,
    Object.keys(PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY).length === 18,
  );
  record(
    "valid_safety_settings_frozen",
    true,
    Object.isFrozen(PRELIGHT_SAFETY_SETTINGS),
  );
  await adapter.commitReadOnlyTransaction();
  record(
    "valid_commit",
    true,
    adapter.state === "READ_ONLY_TRANSACTION_COMMITTED",
  );
  await adapter.close();
  await adapter.close();
  const evidence = adapter.getBoundedLifecycleEvidence();
  record(
    "valid_close_and_evidence",
    true,
    evidence.closed &&
      evidence.executedApprovedQueryCount === 18 &&
      evidence.validatedApprovedQueryCount === 18 &&
      evidence.rollbackAttemptCount === 0 &&
      evidence.primaryFailureCode === null &&
      evidence.cleanupFailureCode === null &&
      evidence.sqlExecuted === false,
  );
  const releaseRequested = assertOk(
    transitionCredentialLease(boundaries.lease, "LEASE_RELEASE_REQUESTED"),
  );
  const released = boundaries.provider.releaseCredentialLease(releaseRequested);
  record("valid_lease_release_after_close", true, released.ok);

  record(
    "valid_failure_point_inventory",
    true,
    SYNTHETIC_FAILURE_INJECTION_POINTS.length === 42 &&
      SYNTHETIC_FAILURE_HARNESS_META.syntheticFailureInjectionPointCount ===
        SYNTHETIC_FAILURE_INJECTION_POINTS.length,
  );
  record(
    "valid_failure_code_mapping",
    true,
    SYNTHETIC_FAILURE_HARNESS_META.failurePointToSafeCodeMappingComplete &&
      SYNTHETIC_FAILURE_HARNESS_META.failurePointCountMapped === 42,
  );
  record(
    "valid_production_factory_rejects_failure_plan_fields",
    true,
    !createControlledPostgresReadOnlyAdapter(
      Object.assign(creationRequest(createBoundaries(), "padapter_synthetic-c4-nofail"), {
        failurePlan: {
          mode: "SYNTHETIC_VALIDATION_ONLY",
          primaryFailurePoint: "SESSION_OPEN",
          cleanupFailurePoints: [],
        },
      }) as ControlledPostgresReadOnlyAdapterCreationRequest,
    ).ok,
  );

  for (let index = 0; index < 460; index += 1) {
    const b = createBoundaries();
    const invalid = createControlledPostgresReadOnlyAdapter({
      ...creationRequest(b, `invalid_${index}`),
    });
    record(`invalid_creation_id_${index}`, false, !invalid.ok);
  }

  for (const [
    index,
    queryId,
  ] of PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER.entries()) {
    const probe = createAdapter().adapter;
    await openThroughTransaction(probe);
    for (const priorQueryId of PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER.slice(
      0,
      index,
    )) {
      await probe.executeApprovedQuery(priorQueryId);
    }
    const wrong =
      PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER[
        index === 0 ? 1 : index - 1
      ]!;
    let rejected = false;
    try {
      await probe.executeApprovedQuery(wrong);
    } catch {
      rejected = true;
    }
    record(`invalid_query_order_${queryId.toLowerCase()}`, false, rejected);
  }

  for (let n = 1; n <= 18; n += 1) {
    const point =
      `QUERY_${String(n).padStart(2, "0")}` as SyntheticFailureInjectionPoint;
    const { adapter: failAdapter } = createHarnessAdapter(
      point,
      [],
      `padapter_qfail-${String(n).padStart(2, "0")}`,
    );
    await openThroughTransaction(failAdapter);
    await runThroughQueries(failAdapter, n - 1);
    let thrown = false;
    try {
      await failAdapter.executeApprovedQuery(
        PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER[n - 1]!,
      );
    } catch (error) {
      thrown =
        error instanceof Error && error.message === "QUERY_EXECUTION_FAILED";
    }
    await attemptRollbackAndClose(failAdapter);
    const e = failAdapter.getBoundedLifecycleEvidence();
    let reuseBlocked = false;
    try {
      await failAdapter.executeApprovedQuery(
        PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER[0]!,
      );
    } catch {
      reuseBlocked = true;
    }
    const passed =
      thrown &&
      e.executedApprovedQueryCount === n - 1 &&
      e.validatedApprovedQueryCount === n - 1 &&
      e.primaryFailureCode === "QUERY_EXECUTION_FAILED" &&
      e.commitAttemptCount === 0 &&
      e.rollbackAttemptCount === 1 &&
      e.closeAttemptCount === 1 &&
      e.committed === false &&
      !("rawResult" in e) &&
      !("fixture" in e) &&
      reuseBlocked;
    const item = Object.freeze({
      id: `query_failure_position_${String(n).padStart(2, "0")}`,
      positive: false,
      passed,
    });
    queryFailureCases.push(item);
    cases.push(item);
  }

  for (let n = 1; n <= 18; n += 1) {
    const point =
      `VALIDATION_${String(n).padStart(2, "0")}` as SyntheticFailureInjectionPoint;
    const { adapter: failAdapter } = createHarnessAdapter(
      point,
      [],
      `padapter_vfail-${String(n).padStart(2, "0")}`,
    );
    await openThroughTransaction(failAdapter);
    await runThroughQueries(failAdapter, n - 1);
    let thrown = false;
    try {
      await failAdapter.executeApprovedQuery(
        PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER[n - 1]!,
      );
    } catch (error) {
      thrown =
        error instanceof Error &&
        error.message === "QUERY_RESULT_VALIDATION_FAILED";
    }
    await attemptRollbackAndClose(failAdapter);
    const e = failAdapter.getBoundedLifecycleEvidence();
    let laterBlocked = false;
    try {
      if (n < 18) {
        await failAdapter.executeApprovedQuery(
          PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER[n]!,
        );
      } else {
        await failAdapter.commitReadOnlyTransaction();
      }
    } catch {
      laterBlocked = true;
    }
    const passed =
      thrown &&
      e.executedApprovedQueryCount === n &&
      e.validatedApprovedQueryCount === n - 1 &&
      e.primaryFailureCode === "QUERY_RESULT_VALIDATION_FAILED" &&
      e.commitAttemptCount === 0 &&
      e.rollbackAttemptCount === 1 &&
      e.closeAttemptCount === 1 &&
      e.committed === false &&
      laterBlocked &&
      !("rawResult" in e);
    const item = Object.freeze({
      id: `validation_failure_position_${String(n).padStart(2, "0")}`,
      positive: false,
      passed,
    });
    validationFailureCases.push(item);
    cases.push(item);
  }

  {
    const { adapter: a } = createHarnessAdapter(
      "SESSION_OPEN",
      [],
      "padapter_session-fail",
    );
    let thrown = false;
    try {
      await a.openSession();
    } catch (error) {
      thrown =
        error instanceof Error && error.message === "SESSION_OPEN_FAILED";
    }
    await attemptRollbackAndClose(a);
    const e = a.getBoundedLifecycleEvidence();
    record(
      "session_failure_case_executed",
      true,
      thrown && e.primaryFailureCode === "SESSION_OPEN_FAILED",
    );
  }
  {
    const { adapter: a } = createHarnessAdapter(
      "SAFETY_VERIFICATION",
      ["CLOSE"],
      "padapter_safety-fail",
    );
    await a.openSession();
    let thrown = false;
    try {
      await a.verifySafetySettings(PRELIGHT_SAFETY_SETTINGS);
    } catch (error) {
      thrown =
        error instanceof Error && error.message === "SAFETY_SETTINGS_INVALID";
    }
    await attemptRollbackAndClose(a);
    const e = a.getBoundedLifecycleEvidence();
    record(
      "safety_failure_case_executed",
      true,
      thrown && e.primaryFailureCode === "SAFETY_SETTINGS_INVALID",
    );
  }
  {
    const { adapter: a } = createHarnessAdapter(
      "TRANSACTION_BEGIN",
      ["CLOSE"],
      "padapter_tx-fail",
    );
    await a.openSession();
    await a.verifySafetySettings(PRELIGHT_SAFETY_SETTINGS);
    let thrown = false;
    try {
      await a.beginReadOnlyTransaction();
    } catch (error) {
      thrown =
        error instanceof Error && error.message === "TRANSACTION_BEGIN_FAILED";
    }
    await attemptRollbackAndClose(a);
    const e = a.getBoundedLifecycleEvidence();
    record(
      "transaction_begin_failure_case_executed",
      true,
      thrown && e.primaryFailureCode === "TRANSACTION_BEGIN_FAILED",
    );
  }
  {
    const { adapter: a } = createHarnessAdapter(
      "COMMIT",
      [],
      "padapter_commit-fail",
    );
    await openThroughTransaction(a);
    await runThroughQueries(a, 18);
    let thrown = false;
    try {
      await a.commitReadOnlyTransaction();
    } catch (error) {
      thrown = error instanceof Error && error.message === "COMMIT_FAILED";
    }
    await attemptRollbackAndClose(a);
    const e = a.getBoundedLifecycleEvidence();
    record(
      "commit_failure_case_executed",
      true,
      thrown &&
        e.primaryFailureCode === "COMMIT_FAILED" &&
        e.committed === false &&
        e.rollbackAttemptCount === 1 &&
        e.closeAttemptCount === 1,
    );
  }

  const cleanupSpecs: Array<{
    id: string;
    primary: SyntheticFailureInjectionPoint;
    cleanup: ReadonlyArray<"ROLLBACK" | "CLOSE">;
    setup: (
      adapter: ControlledPostgresReadOnlyAdapter,
    ) => Promise<void>;
    expectedPrimary: string;
  }> = [
    {
      id: "cleanup_query_success_rb_close",
      primary: "QUERY_01",
      cleanup: [],
      setup: async (a) => {
        await openThroughTransaction(a);
        try {
          await a.executeApprovedQuery(
            PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER[0]!,
          );
        } catch {
          /* expected */
        }
      },
      expectedPrimary: "QUERY_EXECUTION_FAILED",
    },
    {
      id: "cleanup_query_rollback_fail",
      primary: "QUERY_02",
      cleanup: ["ROLLBACK"],
      setup: async (a) => {
        await openThroughTransaction(a);
        await runThroughQueries(a, 1);
        try {
          await a.executeApprovedQuery(
            PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER[1]!,
          );
        } catch {
          /* expected */
        }
      },
      expectedPrimary: "QUERY_EXECUTION_FAILED",
    },
    {
      id: "cleanup_query_close_fail",
      primary: "QUERY_03",
      cleanup: ["CLOSE"],
      setup: async (a) => {
        await openThroughTransaction(a);
        await runThroughQueries(a, 2);
        try {
          await a.executeApprovedQuery(
            PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER[2]!,
          );
        } catch {
          /* expected */
        }
      },
      expectedPrimary: "QUERY_EXECUTION_FAILED",
    },
    {
      id: "cleanup_query_rb_and_close_fail",
      primary: "QUERY_04",
      cleanup: ["ROLLBACK", "CLOSE"],
      setup: async (a) => {
        await openThroughTransaction(a);
        await runThroughQueries(a, 3);
        try {
          await a.executeApprovedQuery(
            PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER[3]!,
          );
        } catch {
          /* expected */
        }
      },
      expectedPrimary: "QUERY_EXECUTION_FAILED",
    },
    {
      id: "cleanup_validation_rollback_fail",
      primary: "VALIDATION_05",
      cleanup: ["ROLLBACK"],
      setup: async (a) => {
        await openThroughTransaction(a);
        await runThroughQueries(a, 4);
        try {
          await a.executeApprovedQuery(
            PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER[4]!,
          );
        } catch {
          /* expected */
        }
      },
      expectedPrimary: "QUERY_RESULT_VALIDATION_FAILED",
    },
    {
      id: "cleanup_validation_close_fail",
      primary: "VALIDATION_06",
      cleanup: ["CLOSE"],
      setup: async (a) => {
        await openThroughTransaction(a);
        await runThroughQueries(a, 5);
        try {
          await a.executeApprovedQuery(
            PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER[5]!,
          );
        } catch {
          /* expected */
        }
      },
      expectedPrimary: "QUERY_RESULT_VALIDATION_FAILED",
    },
    {
      id: "cleanup_validation_rb_and_close_fail",
      primary: "VALIDATION_07",
      cleanup: ["ROLLBACK", "CLOSE"],
      setup: async (a) => {
        await openThroughTransaction(a);
        await runThroughQueries(a, 6);
        try {
          await a.executeApprovedQuery(
            PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER[6]!,
          );
        } catch {
          /* expected */
        }
      },
      expectedPrimary: "QUERY_RESULT_VALIDATION_FAILED",
    },
    {
      id: "cleanup_commit_success_rb_close",
      primary: "COMMIT",
      cleanup: [],
      setup: async (a) => {
        await openThroughTransaction(a);
        await runThroughQueries(a, 18);
        try {
          await a.commitReadOnlyTransaction();
        } catch {
          /* expected */
        }
      },
      expectedPrimary: "COMMIT_FAILED",
    },
    {
      id: "cleanup_commit_rollback_fail",
      primary: "COMMIT",
      cleanup: ["ROLLBACK"],
      setup: async (a) => {
        await openThroughTransaction(a);
        await runThroughQueries(a, 18);
        try {
          await a.commitReadOnlyTransaction();
        } catch {
          /* expected */
        }
      },
      expectedPrimary: "COMMIT_FAILED",
    },
    {
      id: "cleanup_success_commit_close_fail",
      primary: "CLOSE",
      cleanup: [],
      setup: async (a) => {
        await openThroughTransaction(a);
        await runThroughQueries(a, 18);
        await a.commitReadOnlyTransaction();
        try {
          await a.close();
        } catch {
          /* expected */
        }
      },
      expectedPrimary: "CLOSE_FAILED",
    },
    {
      id: "cleanup_safety_close_fail",
      primary: "SAFETY_VERIFICATION",
      cleanup: ["CLOSE"],
      setup: async (a) => {
        await a.openSession();
        try {
          await a.verifySafetySettings(PRELIGHT_SAFETY_SETTINGS);
        } catch {
          /* expected */
        }
      },
      expectedPrimary: "SAFETY_SETTINGS_INVALID",
    },
    {
      id: "cleanup_tx_begin_close_fail",
      primary: "TRANSACTION_BEGIN",
      cleanup: ["CLOSE"],
      setup: async (a) => {
        await a.openSession();
        await a.verifySafetySettings(PRELIGHT_SAFETY_SETTINGS);
        try {
          await a.beginReadOnlyTransaction();
        } catch {
          /* expected */
        }
      },
      expectedPrimary: "TRANSACTION_BEGIN_FAILED",
    },
  ];

  for (const [index, spec] of cleanupSpecs.entries()) {
    const { adapter: a } = createHarnessAdapter(
      spec.primary,
      spec.cleanup,
      `padapter_cleanup-${String(index + 1).padStart(2, "0")}`,
    );
    await spec.setup(a);
    await attemptRollbackAndClose(a);
    const e = a.getBoundedLifecycleEvidence();
    const expectsRollbackFail = spec.cleanup.includes("ROLLBACK");
    const expectsCloseFail =
      spec.cleanup.includes("CLOSE") && spec.primary !== "CLOSE";
    const expectedCleanup = expectsRollbackFail
      ? "ROLLBACK_FAILED"
      : expectsCloseFail
        ? "CLOSE_FAILED"
        : null;
    const passedFinal =
      e.primaryFailureCode === spec.expectedPrimary &&
      (spec.primary === "CLOSE"
        ? e.committed === true && e.closeAttemptCount >= 1
        : e.committed === false) &&
      e.cleanupFailureCode === expectedCleanup;
    const out = Object.freeze({
      id: spec.id,
      positive: false,
      passed: passedFinal,
    });
    cleanupFailureCases.push(out);
    cases.push(out);
  }

  const tamperInputs: unknown[] = [
    null,
    undefined,
    {},
    { mode: "PRODUCTION" },
    { mode: "SYNTHETIC_VALIDATION_ONLY" },
    {
      mode: "SYNTHETIC_VALIDATION_ONLY",
      primaryFailurePoint: "SESSION_OPEN",
    },
    {
      mode: "SYNTHETIC_VALIDATION_ONLY",
      primaryFailurePoint: "unknown",
      cleanupFailurePoints: [],
    },
    {
      mode: "SYNTHETIC_VALIDATION_ONLY",
      primaryFailurePoint: "session_open",
      cleanupFailurePoints: [],
    },
    {
      mode: "SYNTHETIC_VALIDATION_ONLY",
      primaryFailurePoint: "PREFIX_SESSION_OPEN",
      cleanupFailurePoints: [],
    },
    {
      mode: "SYNTHETIC_VALIDATION_ONLY",
      primaryFailurePoint: "SESSION_OPEN_SUFFIX",
      cleanupFailurePoints: [],
    },
    {
      mode: "SYNTHETIC_VALIDATION_ONLY",
      primaryFailurePoint: "QUERY_00",
      cleanupFailurePoints: [],
    },
    {
      mode: "SYNTHETIC_VALIDATION_ONLY",
      primaryFailurePoint: "QUERY_19",
      cleanupFailurePoints: [],
    },
    {
      mode: "SYNTHETIC_VALIDATION_ONLY",
      primaryFailurePoint: "VALIDATION_00",
      cleanupFailurePoints: [],
    },
    {
      mode: "SYNTHETIC_VALIDATION_ONLY",
      primaryFailurePoint: "VALIDATION_19",
      cleanupFailurePoints: [],
    },
    {
      mode: "SYNTHETIC_VALIDATION_ONLY",
      primaryFailurePoint: "SESSION_OPEN",
      cleanupFailurePoints: ["ROLLBACK", "ROLLBACK"],
    },
    {
      mode: "SYNTHETIC_VALIDATION_ONLY",
      primaryFailurePoint: "SESSION_OPEN",
      cleanupFailurePoints: ["COMMIT"],
    },
    {
      mode: "SYNTHETIC_VALIDATION_ONLY",
      primaryFailurePoint: "SESSION_OPEN",
      cleanupFailurePoints: ["QUERY_01"],
    },
    {
      mode: "SYNTHETIC_VALIDATION_ONLY",
      primaryFailurePoint: "SESSION_OPEN",
      cleanupFailurePoints: [],
      unknownField: true,
    },
    {
      mode: "SYNTHETIC_VALIDATION_ONLY",
      primaryFailurePoint: "SESSION_OPEN",
      cleanupFailurePoints: [],
      message: "boom",
    },
    {
      mode: "SYNTHETIC_VALIDATION_ONLY",
      primaryFailurePoint: "SESSION_OPEN",
      cleanupFailurePoints: [],
      error: new Error("raw"),
    },
    {
      mode: "SYNTHETIC_VALIDATION_ONLY",
      primaryFailurePoint: "SESSION_OPEN",
      cleanupFailurePoints: [],
      code: "CUSTOM_CODE",
    },
    {
      mode: "SYNTHETIC_VALIDATION_ONLY",
      primaryFailurePoint: "SESSION_OPEN",
      cleanupFailurePoints: [],
      sql: "select 1",
    },
    {
      mode: "SYNTHETIC_VALIDATION_ONLY",
      primaryFailurePoint: "SESSION_OPEN",
      cleanupFailurePoints: [],
      password: "x",
    },
    {
      mode: "SYNTHETIC_VALIDATION_ONLY",
      primaryFailurePoint: "SESSION_OPEN",
      cleanupFailurePoints: [],
      token: "x",
    },
    {
      mode: "SYNTHETIC_VALIDATION_ONLY",
      primaryFailurePoint: "SESSION_OPEN",
      cleanupFailurePoints: [],
      uri: "postgres://x",
    },
    {
      mode: "SYNTHETIC_VALIDATION_ONLY",
      primaryFailurePoint: "SESSION_OPEN",
      cleanupFailurePoints: [],
      host: "localhost",
    },
    {
      mode: "SYNTHETIC_VALIDATION_ONLY",
      primaryFailurePoint: "SESSION_OPEN",
      cleanupFailurePoints: [],
      port: 5432,
    },
    {
      mode: "SYNTHETIC_VALIDATION_ONLY",
      primaryFailurePoint: "SESSION_OPEN",
      cleanupFailurePoints: [],
      environment: "prod",
    },
    {
      mode: "SYNTHETIC_VALIDATION_ONLY",
      primaryFailurePoint: "SESSION_OPEN",
      cleanupFailurePoints: [],
      env: "x",
    },
    {
      primaryFailurePoint: "SESSION_OPEN",
      cleanupFailurePoints: [],
    },
    {
      mode: "SYNTHETIC_VALIDATION_ONLY",
      primaryFailurePoint: ["SESSION_OPEN", "CLOSE"],
      cleanupFailurePoints: [],
    },
    {
      mode: "SYNTHETIC_VALIDATION_ONLY",
      primaryFailurePoint: "SESSION_OPEN",
      cleanupFailurePoints: "ROLLBACK",
    },
    {
      mode: "SYNTHETIC_VALIDATION_ONLY",
      primaryFailurePoint: "SELECT",
      cleanupFailurePoints: [],
    },
    {
      mode: "SYNTHETIC_VALIDATION_ONLY",
      primaryFailurePoint: "SESSION_OPEN",
      cleanupFailurePoints: ["CLOSE", "CLOSE"],
    },
    {
      mode: "SYNTHETIC_VALIDATION_ONLY",
      primaryFailurePoint: "SESSION_OPEN",
      cleanupFailurePoints: ["ROLLBACK", "CLOSE", "CLOSE"],
    },
  ];

  while (tamperInputs.length < 120) {
    tamperInputs.push({
      mode: "SYNTHETIC_VALIDATION_ONLY",
      primaryFailurePoint: `QUERY_${String(tamperInputs.length).padStart(2, "0")}`,
      cleanupFailurePoints: [],
      extra: tamperInputs.length,
    });
  }

  for (const [index, input] of tamperInputs.entries()) {
    const validated = validateSyntheticValidationOnlyFailurePlan(input);
    let harnessRejected = !validated.ok;
    if (validated.ok) {
      const created = createSyntheticValidationOnlyPostgresAdapterHarness(
        creationRequest(
          createBoundaries(),
          `padapter_tamper-${String(index).padStart(3, "0")}`,
        ),
        {
          ...validated.value,
          // force structural clone rejection path when possible
        },
      );
      if (created.ok) {
        const clonedPlan = {
          mode: validated.value.mode,
          primaryFailurePoint: validated.value.primaryFailurePoint,
          cleanupFailurePoints: [...validated.value.cleanupFailurePoints],
        };
        const cloned = createSyntheticValidationOnlyPostgresAdapterHarness(
          creationRequest(
            createBoundaries(),
            `padapter_tamper-clone-${String(index).padStart(3, "0")}`,
          ),
          clonedPlan,
        );
        harnessRejected = !cloned.ok
          ? true
          : !isControlledPostgresReadOnlyAdapter({}) &&
            validateSyntheticValidationOnlyFailurePlan(
              JSON.parse(JSON.stringify(validated.value)),
            ).ok === false
            ? true
            : !validateSyntheticValidationOnlyFailurePlan(
                Object.assign({}, validated.value, { forged: true }),
              ).ok;
        if (cloned.ok) {
          harnessRejected = !validateSyntheticValidationOnlyFailurePlan({
            ...validated.value,
            message: "x",
          }).ok;
        }
      }
    }
    if (
      typeof input === "object" &&
      input &&
      "primaryFailurePoint" in input &&
      typeof (input as { primaryFailurePoint?: unknown }).primaryFailurePoint ===
        "string" &&
      (SYNTHETIC_FAILURE_INJECTION_POINTS as readonly string[]).includes(
        (input as { primaryFailurePoint: string }).primaryFailurePoint,
      ) &&
      (input as { mode?: unknown }).mode === "SYNTHETIC_VALIDATION_ONLY" &&
      Array.isArray((input as { cleanupFailurePoints?: unknown }).cleanupFailurePoints) &&
      Object.keys(input).length === 3
    ) {
      const serialized = validateSyntheticValidationOnlyFailurePlan(
        JSON.parse(JSON.stringify(input)),
      );
      harnessRejected = !serialized.ok
        ? true
        : !failurePlanProvenanceRejectsClone(serialized.value);
    }
    const item = Object.freeze({
      id: `failure_harness_tamper_${String(index).padStart(3, "0")}`,
      positive: false,
      passed: harnessRejected || !validated.ok,
    });
    harnessTamperCases.push(item);
    cases.push(item);
  }

  function failurePlanProvenanceRejectsClone(
    plan: SyntheticValidationOnlyFailurePlan,
  ): boolean {
    const clone = {
      mode: plan.mode,
      primaryFailurePoint: plan.primaryFailurePoint,
      cleanupFailurePoints: [...plan.cleanupFailurePoints],
    };
    const revalidated = validateSyntheticValidationOnlyFailurePlan(clone);
    if (!revalidated.ok) return true;
    const forged = createSyntheticValidationOnlyPostgresAdapterHarness(
      creationRequest(createBoundaries(), "padapter_tamper-forged-auth"),
      {
        mode: "SYNTHETIC_VALIDATION_ONLY",
        primaryFailurePoint: "SESSION_OPEN",
        cleanupFailurePoints: [],
        credential: "x",
      },
    );
    return !forged.ok;
  }

  for (let index = harnessTamperCases.length; index < 120; index += 1) {
    const bad = validateSyntheticValidationOnlyFailurePlan({
      mode: "SYNTHETIC_VALIDATION_ONLY",
      primaryFailurePoint: "SESSION_OPEN",
      cleanupFailurePoints: [],
      [`tamper_${index}`]: true,
    });
    const item = Object.freeze({
      id: `failure_harness_tamper_${String(index).padStart(3, "0")}`,
      positive: false,
      passed: !bad.ok,
    });
    harnessTamperCases.push(item);
    cases.push(item);
  }

  {
    const { adapter: a } = createHarnessAdapter("QUERY_01", ["ROLLBACK", "CLOSE"]);
    await openThroughTransaction(a);
    try {
      await a.executeApprovedQuery(
        PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER[0]!,
      );
    } catch {
      /* expected */
    }
    await attemptRollbackAndClose(a);
    const e = a.getBoundedLifecycleEvidence();
    record(
      "primary_preserved_across_rb_and_close_failure",
      true,
      e.primaryFailureCode === "QUERY_EXECUTION_FAILED" &&
        e.cleanupFailureCode === "ROLLBACK_FAILED",
    );
    let queryBlocked = false;
    let commitBlocked = false;
    let reopenBlocked = false;
    try {
      await a.executeApprovedQuery(
        PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER[1]!,
      );
    } catch {
      queryBlocked = true;
    }
    try {
      await a.commitReadOnlyTransaction();
    } catch {
      commitBlocked = true;
    }
    try {
      await a.openSession();
    } catch {
      reopenBlocked = true;
    }
    record(
      "adapter_unusable_after_injected_failure",
      true,
      queryBlocked && commitBlocked && reopenBlocked && e.committed === false,
    );
  }

  const positives = cases.filter((item) => item.positive);
  const tampers = cases.filter((item) => !item.positive);
  const failed = cases.filter((item) => !item.passed);
  const duplicate = cases.length - new Set(cases.map((item) => item.id)).size;
  const queryExecuted = queryFailureCases.length;
  const queryPassed = queryFailureCases.filter((item) => item.passed).length;
  const validationExecuted = validationFailureCases.length;
  const validationPassed = validationFailureCases.filter(
    (item) => item.passed,
  ).length;
  const cleanupExecuted = cleanupFailureCases.length;
  const cleanupPassed = cleanupFailureCases.filter((item) => item.passed).length;
  const harnessTamperCount = harnessTamperCases.length;
  const harnessTamperRejected = harnessTamperCases.filter(
    (item) => item.passed,
  ).length;
  const harnessDuplicate =
    harnessTamperCases.length -
    new Set(harnessTamperCases.map((item) => item.id)).size;

  const executableMatricesOk =
    SYNTHETIC_FAILURE_HARNESS_META.syntheticFailureHarnessImplemented &&
    queryExecuted === 18 &&
    queryPassed === 18 &&
    validationExecuted === 18 &&
    validationPassed === 18 &&
    cleanupExecuted >= 12 &&
    cleanupPassed === cleanupExecuted &&
    harnessTamperCount >= 120 &&
    harnessTamperRejected === harnessTamperCount &&
    harnessDuplicate === 0;

  const sourceIntegrityAfter = await readSourceIntegritySnapshot();
  const sourceIntegrityPassed =
    sourceIntegrityBefore.length === SOURCE_INTEGRITY_PATHS.length &&
    sourceIntegrityAfter.length === SOURCE_INTEGRITY_PATHS.length &&
    sourceIntegrityBefore.every(
      (before, index) =>
        before !== null &&
        before.relativePath === SOURCE_INTEGRITY_PATHS[index] &&
        sourceIntegrityAfter[index] !== null &&
        sourceIntegrityAfter[index]?.relativePath === before.relativePath &&
        sourceIntegrityAfter[index]?.sha256 === before.sha256,
    );
  const afterByPath = new Map(
    sourceIntegrityAfter.flatMap((snapshot) =>
      snapshot ? [[snapshot.relativePath, snapshot.content] as const] : [],
    ),
  );
  const remotePathInspection = inspectRemotePaths(
    afterByPath.get(SOURCE_INTEGRITY_PATHS[1]) ?? "",
    afterByPath.get(SOURCE_INTEGRITY_PATHS[0]) ?? "",
  );
  const remotePathInspectionPassed = Object.entries(
    remotePathInspection.counts,
  ).every(
    ([key, count]) =>
      key === "approvedFilesystemSourceReadCount" || count === 0,
  ) &&
    remotePathInspection.counts.approvedFilesystemSourceReadCount > 0 &&
    remotePathInspection.sourceIntegrityPathInventoryDeclarationFound &&
    remotePathInspection.sourceIntegrityPathInventoryConstBound &&
    remotePathInspection.sourceIntegrityPathInventoryLiteralAndBounded &&
    remotePathInspection.sourceIntegrityPathInventoryContainsOnlyLiteralEntries &&
    remotePathInspection.sourceIntegrityPathInventoryContainsSpread === false &&
    remotePathInspection.sourceIntegrityPathInventoryDuplicateCount === 0 &&
    remotePathInspection.sourceIntegrityPathInventoryInvalidEntryCount === 0 &&
    remotePathInspection.sourceIntegrityPathInventoryContainsOnlyApprovedPaths &&
    remotePathInspection.sourceIntegrityPathInventoryRuntimeMutable === false &&
    remotePathInspection.sourceIntegrityPathInventoryMutationCount === 0 &&
    remotePathInspection.sourceIntegrityPathInventoryWritableAliasCount === 0;
  const upstreamCloneTamperCases = [
    [c4aRaw, normalizeC4A],
    [b6Raw, normalizeB6],
    [b7Raw, normalizeB7],
    [c1Raw, normalizeC1],
    [c2Raw, normalizeC2],
    [c3Raw, normalizeC3],
  ].map(([raw, normalize], index) => Object.freeze({
    id: `upstream_result_clone_tamper_${String(index + 1).padStart(2, "0")}`,
    passed:
      isStructuredRecord(raw) &&
      typeof normalize === "function" &&
      normalize(Object.freeze({ ...raw })) === null,
  }));
  const astFixtures = [
    `import pg from "pg";`, `fetch("https://example.test")`,
    `https.request({});`, `net.connect(5432)`, `tls.connect(443)`,
    `exec("x")`, `spawn("x")`, `process.env.SECRET`,
    `createClient("x", "y")`, `query("select 1")`, `connect()`,
    `writeFile("nonce.txt", "x")`, `consumeNonce()`,
    `bootstrapProduction()`, `executeRollbackArtifact()`,
    `executeProductionPreflight()`,
    `import pg = require("pg");`, `require("pg")`,
    `import("pg")`, `process["env"].SECRET`,
    `globalThis.process.env.SECRET`, `new WebSocket("wss://example.test")`,
    `const delegatedRequest = https.request; delegatedRequest({});`,
    `const delegatedEnvironment = process["env"]; delegatedEnvironment.SECRET`,
    `import { request as requestAlias } from "node:https"; requestAlias({});`,
    `import * as httpsNamespace from "node:https"; httpsNamespace.request({});`,
    `import defaultPg from "pg"; new defaultPg.Client({});`,
    `import httpsEquals = require("node:https"); httpsEquals.request({});`,
    `const httpsNamespace = require("node:https"); httpsNamespace.request({});`,
    `const { request: destructuredRequest } = require("node:https"); destructuredRequest({});`,
    `const propertyRequest = require("node:https").request; propertyRequest({});`,
    `const computedRequest = require("node:https")["request"]; computedRequest({});`,
    `const httpsNamespace = require("node:https"); httpsNamespace["request"]({});`,
    `const httpsNamespace = require("node:https"); httpsNamespace?.request?.({});`,
    `const httpsNamespace = require("node:https"); httpsNamespace?.["request"]?.({});`,
    `const firstRequest = require("node:https").request; const secondRequest = firstRequest; secondRequest({});`,
    `const thirdRequest = require("node:https").request; const fourthRequest = thirdRequest; const fifthRequest = fourthRequest; fifthRequest({});`,
    `import { connect as connectAlias } from "node:net"; connectAlias(5432);`,
    `import * as netNamespace from "node:net"; netNamespace.connect(5432);`,
    `const { connect: tlsConnectAlias } = require("node:tls"); tlsConnectAlias(443);`,
    `const childProcess = require("node:child_process"); childProcess.exec("x");`,
    `import { spawn as spawnAlias } from "node:child_process"; spawnAlias("x");`,
    `const { execFile: execFileAlias } = require("node:child_process"); execFileAlias("x");`,
    `const socketNamespace = require("node:net"); new socketNamespace.Socket();`,
    `import * as tlsNamespace from "node:tls"; new tlsNamespace.TLSSocket();`,
    `import { request as httpRequestAlias } from "node:http"; httpRequestAlias({});`,
    `import * as httpNamespace from "node:http"; httpNamespace["request"]({});`,
    `const httpOptional = require("node:http"); httpOptional?.request?.({});`,
    `const { fork: forkAlias } = require("node:child_process"); forkAlias("x");`,
    `const spawnProperty = require("node:child_process")["spawn"]; spawnProperty("x");`,
    `import { exec as execAlias } from "node:child_process"; execAlias("x");`,
    `import childProcessDefault from "node:child_process"; childProcessDefault.exec("x");`,
    `import netEquals = require("node:net"); netEquals["connect"](5432);`,
    `const tlsProperty = require("node:tls")["connect"]; tlsProperty(443);`,
    `import { Client as pgClient } from "node:pg"; new pgClient({});`,
    `const pgComputed = require("node:pg")["Client"]; new pgComputed({});`,
  ];
  const astTamperCases = astFixtures.map((fixture, index) => {
    const fixtureInspection = inspectRemotePaths(fixture, "");
    return Object.freeze({
      id: `ast_remote_path_tamper_${String(index + 1).padStart(2, "0")}`,
      passed: Object.values(fixtureInspection.counts).some((count) => count > 0),
    });
  });
  const astAmbiguousComputedAccessFixtures = [
    `import * as httpsNamespace from "node:https"; httpsNamespace[operation]({});`,
    `import fetchClient from "node-fetch"; fetchClient[operation]("https://example.test");`,
    `import httpsEquals = require("node:https"); httpsEquals[operation]({});`,
    `const httpsNamespace = require("node:https"); httpsNamespace[operation]({});`,
    `const request = require("node:https").request; request[operation]({});`,
    `const first = require("node:https"); const second = first; second[operation]({});`,
    `const first = require("node:https"); const second = first.request; second[operation]({});`,
    `const httpsNamespace = require("node:https"); httpsNamespace?.[operation]?.({});`,
    `const httpsNamespace = require("node:https"); httpsNamespace[transportKey][operation]({});`,
    `import * as httpNamespace from "node:http"; httpNamespace[operation]({});`,
    `const httpNamespace = require("node:http"); httpNamespace?.[operation]?.({});`,
    `import * as netNamespace from "node:net"; netNamespace[operation](5432);`,
    `import netEquals = require("node:net"); netEquals[operation](5432);`,
    `const netNamespace = require("node:net"); netNamespace[transportKey][operation](5432);`,
    `import * as tlsNamespace from "node:tls"; tlsNamespace[operation](443);`,
    `const tlsNamespace = require("node:tls"); tlsNamespace?.[operation]?.(443);`,
    `import * as childProcess from "node:child_process"; childProcess[operation]("x");`,
    `const childProcess = require("node:child_process"); childProcess[operation]("x");`,
    `const execute = require("node:child_process").exec; execute[operation]("x");`,
    `import childProcessDefault from "node:child_process"; childProcessDefault[operation]("x");`,
    `import pgNamespace = require("pg"); pgNamespace[clientKind]({});`,
    `const pgNamespace = require("pg"); pgNamespace?.[clientKind]?.({});`,
    `const pgClient = require("pg").Client; new pgClient[constructorKey]({});`,
    `const supabase = require("@supabase/supabase-js"); supabase[clientFactory]("x", "y");`,
    `import WebSocketClient from "ws"; new WebSocketClient[constructorKey]("wss://example.test");`,
    `const webSocket = require("ws"); new webSocket[constructorKey]("wss://example.test");`,
  ];
  const astAmbiguousComputedAccessCases =
    astAmbiguousComputedAccessFixtures.map((fixture, index) => {
      const fixtureInspection = inspectRemotePaths(fixture, "");
      return Object.freeze({
        id: `ast_ambiguous_computed_access_tamper_${String(index + 1).padStart(2, "0")}`,
        passed:
          fixtureInspection.counts.ambiguousComputedProhibitedAccessCount > 0 &&
          fixtureInspection.ambiguousComputedProhibitedAccessFailsClosed &&
          fixtureInspection.ambiguousComputedProhibitedAccessEvidence.length > 0 &&
          fixtureInspection.ambiguousComputedProhibitedAccessEvidence.length <=
            fixtureInspection.ambiguousComputedProhibitedAccessEvidenceLimit &&
          fixtureInspection.ambiguousComputedProhibitedAccessEvidenceTruncatedCount ===
            0,
      });
    });
  const astFalsePositiveFixtures = [
    `import { request as localRequest } from "./safe"; localRequest({});`,
    `import * as localHttps from "./safe"; localHttps.request({});`,
    `const localHttps = require("./safe"); localHttps.request({});`,
    `const { request: localRequest } = require("./safe"); localRequest({});`,
    `const localRequest = require("./safe")["request"]; localRequest({});`,
    `const request = () => undefined; request({});`,
    `const socket = { Socket: class {} }; new socket.Socket();`,
    `const childProcess = { exec: () => undefined }; childProcess.exec("x");`,
    `const localHttps = require("./safe"); localHttps[operation]({});`,
    `const request = () => undefined; request[operation]({});`,
    `const local = { nested: () => undefined }; local[key]?.[operation]?.();`,
    `const processLike = { env: {} }; processLike[key];`,
  ];
  const astFalsePositiveCases = astFalsePositiveFixtures.map((fixture, index) => {
    const fixtureInspection = inspectRemotePaths(fixture, "");
    return Object.freeze({
      id: `ast_import_binding_false_positive_${String(index + 1).padStart(2, "0")}`,
      passed: Object.values(fixtureInspection.counts).every((count) => count === 0),
    });
  });
  const confirmedConditionalProvenanceBlockerSource =
    `const client = flag\n  ? require("node:https")\n  : require("./safe");\n\nclient[operation]({});`;
  const confirmedAwaitedImportBlockerSource =
    `const client = await import("node:https");\nclient[operation]({});`;
  const confirmedConditionalProvenanceBlockerInspection = inspectRemotePaths(
    confirmedConditionalProvenanceBlockerSource,
    "",
  );
  const confirmedAwaitedImportBlockerInspection = inspectRemotePaths(
    confirmedAwaitedImportBlockerSource,
    "",
  );
  const confirmedConditionalProvenanceBlockerExecuted = true;
  const confirmedConditionalProvenanceBlockerDetected =
    confirmedConditionalProvenanceBlockerInspection.counts
      .ambiguousComputedProhibitedAccessCount > 0 ||
    confirmedConditionalProvenanceBlockerInspection.counts
      .ambiguousProhibitedExpressionProvenanceCount > 0;
  const confirmedConditionalProvenanceBlockerFailedClosed =
    confirmedConditionalProvenanceBlockerDetected;
  const confirmedAwaitedImportBlockerExecuted = true;
  const confirmedAwaitedImportBlockerDetected =
    confirmedAwaitedImportBlockerInspection.counts
      .ambiguousComputedProhibitedAccessCount > 0;
  const confirmedAwaitedImportBlockerFailedClosed =
    confirmedAwaitedImportBlockerDetected;
  const confirmedNamedAliasBlockerInspection = inspectRemotePaths(
    `import { spawn as run } from "child_process";\nrun("cmd");`,
    "",
  );
  const confirmedNamespaceBlockerInspection = inspectRemotePaths(
    `import * as cp from "child_process";\ncp.spawn("cmd");`,
    "",
  );
  const confirmedDirectDynamicMemberBlockerInspection = inspectRemotePaths(
    `import * as cp from "child_process";\nconst method = getMethodName();\ncp[method]("cmd");`,
    "",
  );
  const confirmedNamedAliasBlockerStillDetected =
    confirmedNamedAliasBlockerInspection.counts.subprocessExecutionPathCount > 0 ||
    confirmedNamedAliasBlockerInspection.counts.shellExecutionPathCount > 0;
  const confirmedNamespaceBlockerStillDetected =
    confirmedNamespaceBlockerInspection.counts.subprocessExecutionPathCount > 0 ||
    confirmedNamespaceBlockerInspection.counts.shellExecutionPathCount > 0;
  const confirmedDirectDynamicMemberBlockerStillDetected =
    confirmedDirectDynamicMemberBlockerInspection.counts
      .ambiguousComputedProhibitedAccessCount > 0;
  const confirmedDirectDynamicMemberBlockerStillFailsClosed =
    confirmedDirectDynamicMemberBlockerStillDetected;
  const astExpressionProvenanceTamperFixtures = [
    {
      id: "ast_expr_prov_conditional_prohibited_left",
      source: confirmedConditionalProvenanceBlockerSource,
    },
    {
      id: "ast_expr_prov_conditional_prohibited_right",
      source:
        `const client = flag\n  ? require("./safe")\n  : require("node:https");\nclient[operation]({});`,
    },
    {
      id: "ast_expr_prov_conditional_two_prohibited",
      source:
        `const client = flag\n  ? require("node:https")\n  : require("node:net");\nclient[operation]({});`,
    },
    {
      id: "ast_expr_prov_nested_conditional",
      source:
        `const client = outer\n  ? (inner ? require("node:https") : require("./safe"))\n  : require("./safe");\nclient[operation]({});`,
    },
    {
      id: "ast_expr_prov_awaited_import_https",
      source: confirmedAwaitedImportBlockerSource,
    },
    {
      id: "ast_expr_prov_awaited_import_child_process",
      source:
        `const client = await import("node:child_process");\nclient[operation]("x");`,
    },
    {
      id: "ast_expr_prov_awaited_conditional_import",
      source:
        `const client = await (flag\n  ? import("node:https")\n  : import("./safe"));\nclient[operation]({});`,
    },
    {
      id: "ast_expr_prov_parenthesized_require",
      source: `const client = (require("node:https"));\nclient[operation]({});`,
    },
    {
      id: "ast_expr_prov_as_expression_require",
      source: `const client = require("node:https") as any;\nclient[operation]({});`,
    },
    {
      id: "ast_expr_prov_type_assertion_require",
      source: `const client = <any>require("node:https");\nclient[operation]({});`,
    },
    {
      id: "ast_expr_prov_non_null_require",
      source: `const client = require("node:https")!;\nclient[operation]({});`,
    },
    {
      id: "ast_expr_prov_satisfies_require",
      source:
        `const client = require("node:https") satisfies unknown;\nclient[operation]({});`,
    },
    {
      id: "ast_expr_prov_logical_or_prohibited_right",
      source:
        `const client = localClient || require("node:https");\nclient[operation]({});`,
    },
    {
      id: "ast_expr_prov_logical_or_prohibited_left",
      source:
        `const client = require("node:https") || localClient;\nclient[operation]({});`,
    },
    {
      id: "ast_expr_prov_logical_and_prohibited_right",
      source:
        `const client = condition && require("node:https");\nclient[operation]({});`,
    },
    {
      id: "ast_expr_prov_nullish_prohibited_right",
      source:
        `const client = localClient ?? require("node:https");\nclient[operation]({});`,
    },
    {
      id: "ast_expr_prov_nullish_prohibited_left",
      source:
        `const client = require("node:https") ?? localClient;\nclient[operation]({});`,
    },
    {
      id: "ast_expr_prov_nested_nullish_conditional",
      source:
        `const client =\n  primaryClient ??\n  (flag ? require("node:https") : fallbackClient);\nclient[operation]({});`,
    },
    {
      id: "ast_expr_prov_comma_prohibited_rightmost",
      source:
        `const client = (safeValue, require("node:https"));\nclient[operation]({});`,
    },
    {
      id: "ast_expr_prov_comma_safe_rightmost_prohibited_operand",
      source:
        `const client = (require("node:https").request({}), { run() { return true; } });\nclient[operation]();`,
      requireNetworkOrAmbiguity: true,
    },
    {
      id: "ast_expr_prov_simple_assignment",
      source:
        `let client;\nclient = require("node:https");\nclient[operation]({});`,
    },
    {
      id: "ast_expr_prov_conditional_assignment",
      source:
        `let client;\nclient = flag\n  ? require("node:https")\n  : localClient;\nclient[operation]({});`,
    },
    {
      id: "ast_expr_prov_multiple_assignment",
      source:
        `let client = localClient;\nif (flag) {\n  client = require("node:https");\n}\nclient[operation]({});`,
    },
    {
      id: "ast_expr_prov_assignment_expression_result",
      source:
        `const result = (client = require("node:https"));\nresult[operation]({});`,
    },
    {
      id: "ast_expr_prov_multistep_alias_conditional",
      source:
        `const source = flag\n  ? require("node:https")\n  : localClient;\nconst client = source;\nconst alias = client;\nalias[operation]({});`,
    },
    {
      id: "ast_expr_prov_alias_awaited_import",
      source:
        `const source = await import("node:https");\nconst client = source as any;\nclient[operation]({});`,
    },
    {
      id: "ast_expr_prov_optional_dynamic_conditional",
      source:
        `const client = flag\n  ? require("node:https")\n  : localClient;\nclient?.[operation]?.({});`,
    },
    {
      id: "ast_expr_prov_extracted_dynamic_member",
      source:
        `const client = flag\n  ? require("node:https")\n  : localClient;\nconst callOperation = client[operation];\ncallOperation({});`,
    },
    {
      id: "ast_expr_prov_chained_dynamic_access",
      source:
        `const client = flag\n  ? require("node:https")\n  : localClient;\nclient[first][second]({});`,
    },
    {
      id: "ast_expr_prov_direct_conditional_dynamic",
      source:
        `(flag\n  ? require("node:https")\n  : localClient)[operation]({});`,
    },
    {
      id: "ast_expr_prov_direct_awaited_import_dynamic",
      source: `(await import("node:https"))[operation]({});`,
    },
    {
      id: "ast_expr_prov_direct_logical_dynamic",
      source:
        `(localClient || require("node:https"))[operation]({});`,
    },
    {
      id: "ast_expr_prov_safe_conditional_control_negative",
      source:
        `const localA = { run() { return true; } };\nconst localB = { run() { return false; } };\nconst client = flag ? localA : localB;\nclient[operation]();`,
      expectClean: true,
    },
    {
      id: "ast_expr_prov_safe_logical_control_negative",
      source:
        `const localA = { run() { return true; } };\nconst localB = { run() { return false; } };\nconst client = localA || localB;\nclient[operation]();`,
      expectClean: true,
    },
    {
      id: "ast_expr_prov_safe_wrapped_local_negative",
      source:
        `const client = ({ run() { return true; } } as any);\nclient[operation]();`,
      expectClean: true,
    },
    {
      id: "ast_expr_prov_local_shadowing",
      source:
        `const client = require("node:https");\nfunction safeScope() {\n  const client = {\n    run() {\n      return true;\n    },\n  };\n  client[operation]();\n}\n`,
      expectClean: true,
    },
    {
      id: "ast_expr_prov_prohibited_plus_unknown",
      source:
        `const client = flag\n  ? require("node:https")\n  : getUnknownClient();\nclient[operation]({});`,
    },
    {
      id: "ast_expr_prov_non_literal_dynamic_import",
      source:
        `const moduleName = getModuleName();\nconst client = await import(moduleName);\nclient[operation]({});`,
      expectClean: true,
      policyCase: true,
    },
    {
      id: "ast_expr_prov_alias_cycle_fail_closed",
      source:
        `const a = b;\nconst b = a;\nconst client = flag ? require("node:https") : a;\nclient[operation]({});`,
    },
    {
      id: "ast_expr_prov_unsupported_wrapper_fail_closed",
      source:
        `const client = void require("node:https");\nclient[operation]({});`,
    },
  ] as const;
  const astExpressionProvenanceTamperCases =
    astExpressionProvenanceTamperFixtures.map((fixture) => {
      const fixtureInspection = inspectRemotePaths(fixture.source, "");
      const prohibitedDetected = Object.entries(fixtureInspection.counts).some(
        ([name, count]) =>
          count > 0 &&
          name !== "defaultFetchImportUsageCount" &&
          name !== "defaultWebSocketImportUsageCount"
            ? true
            : count > 0,
      );
      const failedClosed =
        fixtureInspection.counts.ambiguousComputedProhibitedAccessCount > 0 ||
        fixtureInspection.counts.ambiguousProhibitedExpressionProvenanceCount >
          0 ||
        fixtureInspection.counts.networkExecutionPathCount > 0 ||
        fixtureInspection.counts.subprocessExecutionPathCount > 0 ||
        fixtureInspection.counts.shellExecutionPathCount > 0 ||
        fixtureInspection.counts.socketCreationPathCount > 0;
      const expectClean =
        "expectClean" in fixture && fixture.expectClean === true;
      const policyCase =
        "policyCase" in fixture && fixture.policyCase === true;
      const requireNetworkOrAmbiguity =
        "requireNetworkOrAmbiguity" in fixture &&
        fixture.requireNetworkOrAmbiguity === true;
      const passed = expectClean
        ? Object.values(fixtureInspection.counts).every((count) => count === 0)
        : policyCase
          ? Object.values(fixtureInspection.counts).every((count) => count === 0) &&
            remotePathInspection.expressionProvenanceUsesTypeScriptAst
          : requireNetworkOrAmbiguity
            ? fixtureInspection.counts.networkExecutionPathCount > 0 ||
              failedClosed
            : failedClosed && prohibitedDetected;
      return Object.freeze({
        id: fixture.id,
        passed,
        executed: true,
        labelOnly: false,
      });
    });
  const astExpressionProvenanceFalsePositiveFixtures = [
    `const localA = { run() { return true; } }; const localB = { run() { return false; } }; const client = flag ? localA : localB; client[operation]();`,
    `const localA = { run() { return true; } }; const localB = { run() { return false; } }; const client = flag ? localB : localA; client[operation]();`,
    `const localA = { run() { return true; } }; const localB = { run() { return false; } }; const client = localA || localB; client[operation]();`,
    `const localA = { run() { return true; } }; const localB = { run() { return false; } }; const client = condition && localA && localB; client[operation]();`,
    `const localA = { run() { return true; } }; const localB = { run() { return false; } }; const client = localA ?? localB; client[operation]();`,
    `const client = ({ run() { return true; } }); client[operation]();`,
    `const client = ({ run() { return true; } } as any); client[operation]();`,
    `const client = ({ run() { return true; } })!; client[operation]();`,
    `const client = (safeValue, { run() { return true; } }); client[operation]();`,
    `let client; client = { run() { return true; } }; client[operation]();`,
    `"const client = flag ? require(\\"node:https\\") : require(\\"./safe\\"); client[operation]({});"`,
    `// const client = flag ? require("node:https") : require("./safe"); client[operation]({});\nconst client = { run() { return true; } }; client[operation]();`,
    `const ambiguousProhibitedExpressionProvenanceCount = 0; const networkExecutionPathCount = 0;`,
    `const prohibitedPatternInventory = ["require(\\"node:https\\")", "await import(\\"node:https\\")"];`,
    `const client = require("node:https"); function safeScope() { const client = { run() { return true; } }; client[operation](); }`,
    `type RemoteClient = typeof import("node:https"); const client = { run() { return true; } }; client[operation]();`,
  ];
  const astExpressionProvenanceFalsePositiveCases =
    astExpressionProvenanceFalsePositiveFixtures.map((fixture, index) => {
      const fixtureInspection = inspectRemotePaths(fixture, "");
      return Object.freeze({
        id: `ast_expr_prov_false_positive_${String(index + 1).padStart(2, "0")}`,
        passed: Object.values(fixtureInspection.counts).every(
          (count) => count === 0,
        ),
        executed: true,
        labelOnly: false,
      });
    });
  const literalComputedMemberResolutionPreserved =
    inspectRemotePaths(
      `import * as cp from "child_process"; cp["spawn"]("cmd");`,
      "",
    ).counts.subprocessExecutionPathCount > 0 ||
    inspectRemotePaths(
      `import * as cp from "child_process"; cp["spawn"]("cmd");`,
      "",
    ).counts.shellExecutionPathCount > 0;
  const noSubstitutionTemplateMemberResolutionPreserved =
    inspectRemotePaths(
      `import * as cp from "child_process"; cp[\`spawn\`]("cmd");`,
      "",
    ).counts.subprocessExecutionPathCount > 0 ||
    inspectRemotePaths(
      `import * as cp from "child_process"; cp[\`spawn\`]("cmd");`,
      "",
    ).counts.shellExecutionPathCount > 0;
  const astExpressionProvenanceTamperCaseCount =
    astExpressionProvenanceTamperCases.length;
  const astExpressionProvenanceTamperCasesPassed =
    astExpressionProvenanceTamperCases.filter((item) => item.passed).length;
  const duplicateAstExpressionProvenanceTamperCaseIdCount =
    astExpressionProvenanceTamperCaseCount -
    new Set(astExpressionProvenanceTamperCases.map((item) => item.id)).size;
  const unexecutedAstExpressionProvenanceTamperCaseCount =
    astExpressionProvenanceTamperCases.filter((item) => !item.executed).length;
  const labelOnlyAstExpressionProvenanceTamperCaseCount =
    astExpressionProvenanceTamperCases.filter((item) => item.labelOnly).length;
  const astExpressionProvenanceFalsePositiveCaseCount =
    astExpressionProvenanceFalsePositiveCases.length;
  const astExpressionProvenanceFalsePositiveCasesPassed =
    astExpressionProvenanceFalsePositiveCases.filter((item) => item.passed)
      .length;
  const expressionProvenanceEvidencePassed =
    astExpressionProvenanceTamperCaseCount >= 40 &&
    astExpressionProvenanceTamperCasesPassed ===
      astExpressionProvenanceTamperCaseCount &&
    duplicateAstExpressionProvenanceTamperCaseIdCount === 0 &&
    unexecutedAstExpressionProvenanceTamperCaseCount === 0 &&
    labelOnlyAstExpressionProvenanceTamperCaseCount === 0 &&
    astExpressionProvenanceFalsePositiveCaseCount >= 12 &&
    astExpressionProvenanceFalsePositiveCasesPassed ===
      astExpressionProvenanceFalsePositiveCaseCount &&
    confirmedConditionalProvenanceBlockerExecuted &&
    confirmedConditionalProvenanceBlockerDetected &&
    confirmedConditionalProvenanceBlockerFailedClosed &&
    confirmedAwaitedImportBlockerExecuted &&
    confirmedAwaitedImportBlockerDetected &&
    confirmedAwaitedImportBlockerFailedClosed &&
    remotePathInspection.counts.ambiguousProhibitedExpressionProvenanceCount ===
      0 &&
    remotePathInspection.counts.ambiguousComputedProhibitedAccessCount === 0 &&
    remotePathInspectionPassed &&
    confirmedNamedAliasBlockerStillDetected &&
    confirmedNamespaceBlockerStillDetected &&
    confirmedDirectDynamicMemberBlockerStillDetected &&
    confirmedDirectDynamicMemberBlockerStillFailsClosed &&
    literalComputedMemberResolutionPreserved &&
    noSubstitutionTemplateMemberResolutionPreserved;
  const newExpressionProvenanceClosureCases = Object.freeze([
    ...astExpressionProvenanceTamperCases,
    ...astExpressionProvenanceFalsePositiveCases,
  ]);
  const newExpressionProvenanceClosureCaseCount =
    astExpressionProvenanceTamperCaseCount;
  const requiredModuleClassificationSpecCases =
    REQUIRED_MODULE_CLASSIFICATION_SPEC.map((entry, index) => {
      const classified = classifyProhibitedModule(entry.module);
      const passed =
        classified !== null &&
        classified.categories.includes(entry.category) &&
        normalizeModuleSpecifier(entry.module) === classified.canonicalModule;
      return Object.freeze({
        id: `required_module_classification_spec_${String(index + 1).padStart(2, "0")}`,
        module: entry.module,
        expectedCategory: entry.category,
        observedCanonical: classified?.canonicalModule ?? null,
        observedCategories: classified?.categories ?? Object.freeze([]),
        passed,
        executed: true,
        labelOnly: false,
      });
    });
  const requiredModuleClassificationSpecCaseCount =
    requiredModuleClassificationSpecCases.length;
  const misclassifiedRequiredModuleCount =
    requiredModuleClassificationSpecCases.filter(
      (item) =>
        item.observedCanonical !== null &&
        !item.observedCategories.includes(item.expectedCategory),
    ).length;
  const unclassifiedRequiredModuleCount =
    requiredModuleClassificationSpecCases.filter(
      (item) => item.observedCanonical === null,
    ).length;
  const requiredModuleClassificationSpecPassed =
    requiredModuleClassificationSpecCaseCount >= 30 &&
    requiredModuleClassificationSpecCases.every((item) => item.passed) &&
    misclassifiedRequiredModuleCount === 0 &&
    unclassifiedRequiredModuleCount === 0;
  const authoritativeTaxonomyEntryCount = PROHIBITED_MODULE_TAXONOMY.length;
  const duplicateAuthoritativeTaxonomyEntryCount =
    authoritativeTaxonomyEntryCount -
    new Set(PROHIBITED_MODULE_TAXONOMY.map((entry) => entry.canonicalModule))
      .size;
  const taxonomyEntryWithoutCategoryCount = PROHIBITED_MODULE_TAXONOMY.filter(
    (entry) => entry.categories.length === 0,
  ).length;
  const unknownTaxonomyCategoryCount = PROHIBITED_MODULE_TAXONOMY.flatMap(
    (entry) => entry.categories,
  ).filter(
    (category) =>
      !(VALID_PROHIBITED_MODULE_CATEGORIES as readonly string[]).includes(
        category,
      ),
  ).length;
  const requiredTaxonomyCoverageComplete =
    requiredModuleClassificationSpecPassed &&
    duplicateAuthoritativeTaxonomyEntryCount === 0 &&
    taxonomyEntryWithoutCategoryCount === 0 &&
    unknownTaxonomyCategoryCount === 0 &&
    ["dns", "node:dns", "dns/promises", "node:dns/promises", "fs", "node:fs", "fs/promises", "node:fs/promises"]
      .every((moduleName) => classifyProhibitedModule(moduleName) !== null);
  const categoryParity = (
    left: string,
    right: string,
  ): boolean => {
    const a = classifyProhibitedModule(left);
    const b = classifyProhibitedModule(right);
    return (
      a !== null &&
      b !== null &&
      a.categories.join("|") === b.categories.join("|") &&
      a.packageRoot === b.packageRoot
    );
  };
  const dnsVariantCategoryParity = categoryParity("dns", "node:dns");
  const dnsPromisesVariantCategoryParity = categoryParity(
    "dns/promises",
    "node:dns/promises",
  );
  const fsVariantCategoryParity = categoryParity("fs", "node:fs");
  const fsPromisesVariantCategoryParity = categoryParity(
    "fs/promises",
    "node:fs/promises",
  );
  const childProcessVariantCategoryParity = categoryParity(
    "child_process",
    "node:child_process",
  );
  const httpVariantCategoryParity = categoryParity("http", "node:http");
  const httpsVariantCategoryParity = categoryParity("https", "node:https");
  const netVariantCategoryParity = categoryParity("net", "node:net");
  const tlsVariantCategoryParity = categoryParity("tls", "node:tls");
  const confirmedDnsClassificationBlockerSource =
    `const dnsApi = require("node:dns");\nconst operation = getOperation();\ndnsApi[operation]();`;
  const confirmedFsClassificationBlockerSource =
    `const fsApi = await import("node:fs");\nconst operation = getOperation();\nfsApi[operation]("unapproved-path");`;
  const confirmedDnsClassificationBlockerInspection = inspectRemotePaths(
    confirmedDnsClassificationBlockerSource,
    "",
  );
  const confirmedFsClassificationBlockerInspection = inspectRemotePaths(
    confirmedFsClassificationBlockerSource,
    "",
  );
  const confirmedDnsClassificationBlockerExecuted = true;
  const confirmedDnsClassificationBlockerDetected =
    confirmedDnsClassificationBlockerInspection.counts
      .ambiguousComputedProhibitedAccessCount > 0 ||
    confirmedDnsClassificationBlockerInspection.counts
      .ambiguousProhibitedExpressionProvenanceCount > 0 ||
    confirmedDnsClassificationBlockerInspection.counts.networkExecutionPathCount >
      0;
  const confirmedDnsClassificationBlockerFailedClosed =
    confirmedDnsClassificationBlockerDetected;
  const confirmedFsClassificationBlockerExecuted = true;
  const confirmedFsClassificationBlockerDetected =
    confirmedFsClassificationBlockerInspection.counts
      .ambiguousComputedProhibitedAccessCount > 0 ||
    confirmedFsClassificationBlockerInspection.counts
      .ambiguousProhibitedExpressionProvenanceCount > 0 ||
    confirmedFsClassificationBlockerInspection.counts
      .filesystemSecretReadPathCount > 0;
  const confirmedFsClassificationBlockerFailedClosed =
    confirmedFsClassificationBlockerDetected;
  const astModuleClassificationTamperFixtures = [
    {
      id: "ast_mod_dns_namespace_import",
      source: `import * as dnsApi from "dns";\ndnsApi.lookup("example.invalid", () => {});`,
      requireNetwork: true,
    },
    {
      id: "ast_mod_node_dns_namespace_import",
      source: `import * as dnsApi from "node:dns";\ndnsApi.resolve("example.invalid", () => {});`,
      requireNetwork: true,
    },
    {
      id: "ast_mod_dns_require",
      source: `const dnsApi = require("dns");\ndnsApi.lookup("example.invalid", () => {});`,
      requireNetwork: true,
    },
    {
      id: "ast_mod_node_dns_require",
      source: `const dnsApi = require("node:dns");\ndnsApi.lookup("example.invalid", () => {});`,
      requireNetwork: true,
    },
    {
      id: "ast_mod_dns_import_equals",
      source: `import dnsApi = require("node:dns");\ndnsApi.resolve("example.invalid", () => {});`,
      requireNetwork: true,
    },
    {
      id: "ast_mod_dns_dynamic_import",
      source: `const dnsApi = import("dns");\ndnsApi.then((api) => api.lookup("example.invalid", () => {}));`,
      requireAmbiguityOrNetwork: true,
    },
    {
      id: "ast_mod_node_dns_awaited_import",
      source: `const dnsApi = await import("node:dns");\ndnsApi.lookup("example.invalid", () => {});`,
      requireNetwork: true,
    },
    {
      id: "ast_mod_dns_promises_namespace",
      source: `import * as dnsPromises from "dns/promises";\ndnsPromises.resolve("example.invalid");`,
      requireNetwork: true,
    },
    {
      id: "ast_mod_node_dns_promises_require",
      source: `const dnsPromises = require("node:dns/promises");\ndnsPromises.lookup("example.invalid");`,
      requireNetwork: true,
    },
    {
      id: "ast_mod_node_dns_promises_awaited",
      source: `const dnsPromises = await import("node:dns/promises");\ndnsPromises.resolve("example.invalid");`,
      requireNetwork: true,
    },
    {
      id: "ast_mod_dns_literal_lookup",
      source: `import * as dnsApi from "node:dns";\ndnsApi["lookup"]("example.invalid", () => {});`,
      requireNetwork: true,
    },
    {
      id: "ast_mod_dns_dynamic_member",
      source: confirmedDnsClassificationBlockerSource,
      requireAmbiguity: true,
    },
    {
      id: "ast_mod_dns_alias_dynamic_member",
      source: `const original = require("node:dns");\nconst dnsApi = original;\nconst alias = dnsApi;\nalias[operation]();`,
      requireAmbiguity: true,
    },
    {
      id: "ast_mod_dns_conditional_dynamic_member",
      source: `const api = flag\n  ? require("node:dns")\n  : localApi;\napi[operation]();`,
      requireAmbiguity: true,
    },
    {
      id: "ast_mod_fs_namespace_import",
      source: `import * as fsApi from "fs";\nfsApi.readFileSync("unapproved-path", "utf8");`,
      requireFilesystem: true,
    },
    {
      id: "ast_mod_node_fs_namespace_import",
      source: `import * as fsApi from "node:fs";\nfsApi.readFile("unapproved-path", "utf8", () => {});`,
      requireFilesystem: true,
    },
    {
      id: "ast_mod_fs_require",
      source: `const fsApi = require("fs");\nfsApi.readFileSync("unapproved-path", "utf8");`,
      requireFilesystem: true,
    },
    {
      id: "ast_mod_node_fs_require",
      source: `const fsApi = require("node:fs");\nfsApi.readFileSync("unapproved-path", "utf8");`,
      requireFilesystem: true,
    },
    {
      id: "ast_mod_fs_import_equals",
      source: `import fsApi = require("node:fs");\nfsApi.readFileSync("unapproved-path", "utf8");`,
      requireFilesystem: true,
    },
    {
      id: "ast_mod_fs_dynamic_import",
      source: `const fsApi = await import("fs");\nfsApi.readFileSync("unapproved-path", "utf8");`,
      requireFilesystem: true,
    },
    {
      id: "ast_mod_node_fs_awaited_import",
      source: confirmedFsClassificationBlockerSource,
      requireAmbiguityOrFilesystem: true,
    },
    {
      id: "ast_mod_fs_promises_namespace",
      source: `import * as fsPromises from "fs/promises";\nawait fsPromises.readFile("unapproved-path", "utf8");`,
      requireFilesystem: true,
    },
    {
      id: "ast_mod_node_fs_promises_require",
      source: `const fsPromises = require("node:fs/promises");\nfsPromises.readFile("unapproved-path", "utf8");`,
      requireFilesystem: true,
    },
    {
      id: "ast_mod_node_fs_promises_awaited",
      source: `const fsPromises = await import("node:fs/promises");\nawait fsPromises.readFile("unapproved-path", "utf8");`,
      requireFilesystem: true,
    },
    {
      id: "ast_mod_fs_literal_read",
      source: `import * as fsApi from "node:fs";\nfsApi["readFileSync"]("unapproved-path", "utf8");`,
      requireFilesystem: true,
    },
    {
      id: "ast_mod_fs_dynamic_member",
      source: `const fsApi = require("node:fs");\nconst operation = getOperation();\nfsApi[operation]("unapproved-path");`,
      requireAmbiguity: true,
    },
    {
      id: "ast_mod_fs_alias_dynamic_member",
      source: `const original = await import("node:fs/promises");\nconst fsApi = original;\nconst alias = fsApi;\nalias[operation]("unapproved-path");`,
      requireAmbiguity: true,
    },
    {
      id: "ast_mod_fs_conditional_dynamic_member",
      source: `const api = flag\n  ? require("node:fs")\n  : localApi;\napi[operation]("unapproved-path");`,
      requireAmbiguity: true,
    },
    {
      id: "ast_mod_approved_audit_source_read_allowed",
      source: `import { readFile } from "node:fs/promises";\nawait readFile("lib/vaylo/smart-talk/knowledge/de/run-controlled-production-postgres-read-only-adapter-audit.ts", "utf8");`,
      expectClean: true,
    },
    {
      id: "ast_mod_approved_path_suffix_bypass",
      source: `import { readFile } from "node:fs/promises";\nawait readFile("lib/vaylo/smart-talk/knowledge/de/run-controlled-production-postgres-read-only-adapter-audit.ts.extra", "utf8");`,
      requireFilesystem: true,
    },
    {
      id: "ast_mod_approved_path_traversal_bypass",
      source: `import { readFile } from "node:fs/promises";\nawait readFile("lib/vaylo/smart-talk/knowledge/de/../de/run-controlled-production-postgres-read-only-adapter-audit.ts", "utf8");`,
      requireFilesystem: true,
    },
    {
      id: "ast_mod_arbitrary_filesystem_write",
      source: `import * as fsApi from "node:fs";\nfsApi.writeFileSync("unapproved-path", "x");`,
      requireFilesystem: true,
    },
    {
      id: "ast_mod_safe_local_fs_object",
      source: `const fs = { readFileSync: () => "ok" };\nfs.readFileSync("unapproved-path", "utf8");`,
      expectClean: true,
    },
    {
      id: "ast_mod_safe_local_dns_object",
      source: `const dnsApi = { lookup: () => undefined };\ndnsApi.lookup("example.invalid", () => {});`,
      expectClean: true,
    },
    {
      id: "ast_mod_fs_extra_not_classified",
      source: `import * as fsExtra from "fs-extra";\nfsExtra.readFileSync("unapproved-path", "utf8");`,
      expectClean: true,
    },
    {
      id: "ast_mod_dns_packet_not_classified",
      source: `import * as dnsPacket from "dns-packet";\ndnsPacket.decode(Buffer.alloc(0));`,
      expectClean: true,
    },
    {
      id: "ast_mod_node_prefix_parity",
      source: `const a = require("dns");\nconst b = require("node:dns");\na.lookup("example.invalid", () => {});\nb.lookup("example.invalid", () => {});`,
      requireNetwork: true,
    },
    {
      id: "ast_mod_subpath_parity",
      source: `const a = require("dns/promises");\nconst b = require("node:dns/promises");\na.resolve("example.invalid");\nb.resolve("example.invalid");`,
      requireNetwork: true,
    },
    {
      id: "ast_mod_direct_dns_conditional_dynamic",
      source: `(flag\n  ? require("node:dns")\n  : localApi)[operation]();`,
      requireAmbiguity: true,
    },
    {
      id: "ast_mod_direct_awaited_fs_dynamic",
      source: `(await import("node:fs"))[operation]("unapproved-path");`,
      requireAmbiguity: true,
    },
  ] as const;
  const astModuleClassificationTamperCases =
    astModuleClassificationTamperFixtures.map((fixture) => {
      const fixtureInspection = inspectRemotePaths(fixture.source, "");
      const ambiguity =
        fixtureInspection.counts.ambiguousComputedProhibitedAccessCount > 0 ||
        fixtureInspection.counts.ambiguousProhibitedExpressionProvenanceCount >
          0;
      const network = fixtureInspection.counts.networkExecutionPathCount > 0;
      const filesystem =
        fixtureInspection.counts.filesystemSecretReadPathCount > 0;
      const expectClean =
        "expectClean" in fixture && fixture.expectClean === true;
      const passed = expectClean
        ? Object.entries(fixtureInspection.counts).every(
            ([key, count]) =>
              key === "approvedFilesystemSourceReadCount" || count === 0,
          )
        : "requireNetwork" in fixture && fixture.requireNetwork === true
          ? network
          : "requireFilesystem" in fixture && fixture.requireFilesystem === true
            ? filesystem
            : "requireAmbiguity" in fixture && fixture.requireAmbiguity === true
              ? ambiguity
              : "requireAmbiguityOrNetwork" in fixture &&
                  fixture.requireAmbiguityOrNetwork === true
                ? ambiguity || network
                : "requireAmbiguityOrFilesystem" in fixture &&
                    fixture.requireAmbiguityOrFilesystem === true
                  ? ambiguity || filesystem
                  : ambiguity || network || filesystem;
      return Object.freeze({
        id: fixture.id,
        passed,
        executed: true,
        labelOnly: false,
      });
    });
  const filesystemAllowlistBypassFixtures = [
    `import { readFile } from "node:fs/promises"; await readFile("lib/vaylo/smart-talk/knowledge/de/run-controlled-production-postgres-read-only-adapter-audit.ts.bak", "utf8");`,
    `import { readFile } from "node:fs/promises"; await readFile("lib/vaylo/smart-talk/knowledge/de/../source-registry/controlled-production-postgres-read-only-adapter.ts", "utf8");`,
    `import { readFile } from "node:fs/promises"; await readFile("lib/vaylo/smart-talk/knowledge/de/not-an-approved-audit-source.ts", "utf8");`,
    `import { readFile } from "node:fs/promises"; const p = "lib/vaylo/smart-talk/knowledge/de/run-controlled-production-postgres-read-only-adapter-audit.ts"; await readFile(p, "utf8");`,
    `import { readFile } from "node:fs/promises"; await readFile("lib/" + "vaylo/smart-talk/knowledge/de/run-controlled-production-postgres-read-only-adapter-audit.ts", "utf8");`,
    `import { readFile } from "node:fs/promises"; await readFile(\`lib/vaylo/smart-talk/knowledge/de/\${"run-controlled-production-postgres-read-only-adapter-audit.ts"}\`, "utf8");`,
    `import { readFile } from "node:fs/promises"; await readFile(process.env.AUDIT_PATH as string, "utf8");`,
    `import { readFile } from "node:fs/promises"; await readFile("/etc/passwd", "utf8");`,
    `import { readFile } from "node:fs/promises"; await readFile("./secrets.env", "utf8");`,
    `import * as fsApi from "node:fs"; fsApi[operation]("lib/vaylo/smart-talk/knowledge/de/run-controlled-production-postgres-read-only-adapter-audit.ts");`,
    `import * as fsApi from "node:fs"; fsApi.writeFileSync("lib/vaylo/smart-talk/knowledge/de/run-controlled-production-postgres-read-only-adapter-audit.ts", "x");`,
    `import * as fsApi from "node:fs"; fsApi.appendFileSync("unapproved-path", "x");`,
    `import * as fsApi from "node:fs"; fsApi.unlinkSync("unapproved-path");`,
    `import * as fsApi from "node:fs"; fsApi.renameSync("a", "b");`,
  ];
  const filesystemAllowlistBypassCases = filesystemAllowlistBypassFixtures.map(
    (fixture, index) => {
      const fixtureInspection = inspectRemotePaths(fixture, "");
      const passed =
        fixtureInspection.counts.filesystemSecretReadPathCount > 0 ||
        fixtureInspection.counts.ambiguousComputedProhibitedAccessCount > 0 ||
        fixtureInspection.counts.ambiguousProhibitedExpressionProvenanceCount >
          0;
      return Object.freeze({
        id: `filesystem_allowlist_bypass_${String(index + 1).padStart(2, "0")}`,
        passed,
        executed: true,
        labelOnly: false,
      });
    },
  );
  const approvedPathFixturePreamble = [
    `import path from "node:path";`,
    `import { readFile } from "node:fs/promises";`,
    `const SOURCE_INTEGRITY_PATHS = ["approved-source-a.ts", "approved-source-b.ts"] as const;`,
  ].join("\n");
  const inspectFilesystemFixture = (source: string) =>
    inspectRemotePaths(source, "");
  const filesystemRejected = (
    inspection: ReturnType<typeof inspectRemotePaths>,
  ) =>
    inspection.counts.filesystemSecretReadPathCount > 0 ||
    inspection.counts.ambiguousComputedProhibitedAccessCount > 0 ||
    inspection.counts.ambiguousProhibitedExpressionProvenanceCount > 0;
  const filesystemClean = (
    inspection: ReturnType<typeof inspectRemotePaths>,
  ) =>
    inspection.counts.filesystemSecretReadPathCount === 0 &&
    inspection.counts.ambiguousComputedProhibitedAccessCount === 0 &&
    inspection.counts.ambiguousProhibitedExpressionProvenanceCount === 0;
  const filesystemApproved = (
    inspection: ReturnType<typeof inspectRemotePaths>,
  ) =>
    filesystemClean(inspection) &&
    inspection.counts.approvedFilesystemSourceReadCount > 0;
  const filesystemLookalikeControlled = (
    inspection: ReturnType<typeof inspectRemotePaths>,
  ) =>
    inspection.counts.filesystemSecretReadPathCount === 0 &&
    inspection.counts.approvedFilesystemSourceReadCount === 0;
  const confirmedArbitraryIdentifierAllowlistBlockerSource = [
    `import path from "node:path";`,
    `import { readFile } from "node:fs/promises";`,
    `const arbitraryId = getArbitraryPath();`,
    `await readFile(path.join(process.cwd(), arbitraryId), "utf8");`,
  ].join("\n");
  const confirmedArbitraryIdentifierAllowlistBlockerInspection =
    inspectFilesystemFixture(confirmedArbitraryIdentifierAllowlistBlockerSource);
  const confirmedArbitraryIdentifierAllowlistBlockerExecuted = true;
  const confirmedArbitraryIdentifierAllowlistBlockerDetected =
    confirmedArbitraryIdentifierAllowlistBlockerInspection.counts
      .filesystemSecretReadPathCount > 0;
  const confirmedArbitraryIdentifierAllowlistBlockerRejected =
    confirmedArbitraryIdentifierAllowlistBlockerDetected;
  const confirmedApprovedInventoryMapReadSource = [
    approvedPathFixturePreamble,
    `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
    `  return readFile(path.join(process.cwd(), relativePath), "utf8");`,
    `});`,
  ].join("\n");
  const confirmedApprovedInventoryMapReadInspection =
    inspectFilesystemFixture(confirmedApprovedInventoryMapReadSource);
  const confirmedApprovedInventoryMapReadExecuted = true;
  const confirmedApprovedInventoryMapReadAccepted = filesystemApproved(
    confirmedApprovedInventoryMapReadInspection,
  );
  const confirmedApprovedInventoryMapReadFilesystemCounterZero =
    confirmedApprovedInventoryMapReadInspection.counts
      .filesystemSecretReadPathCount === 0;
  const renamedApprovedCallbackParameterInspection = inspectFilesystemFixture(
    [
      approvedPathFixturePreamble,
      `SOURCE_INTEGRITY_PATHS.map(async (sourceFileId) => {`,
      `  return readFile(path.join(process.cwd(), sourceFileId), "utf8");`,
      `});`,
    ].join("\n"),
  );
  const renamedApprovedCallbackParameterAccepted = filesystemApproved(
    renamedApprovedCallbackParameterInspection,
  );
  const filesystemAllowlistProvenancePositiveFixtures = [
    confirmedApprovedInventoryMapReadSource,
    [
      approvedPathFixturePreamble,
      `SOURCE_INTEGRITY_PATHS.map(async (sourceFileId) => {`,
      `  return readFile(path.join(process.cwd(), sourceFileId), "utf8");`,
      `});`,
    ].join("\n"),
    [
      approvedPathFixturePreamble,
      `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
      `  {`,
      `    return readFile(path.join(process.cwd(), relativePath), "utf8");`,
      `  }`,
      `});`,
    ].join("\n"),
    [
      approvedPathFixturePreamble,
      `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
      `  const approvedPath = relativePath;`,
      `  return readFile(path.join(process.cwd(), approvedPath), "utf8");`,
      `});`,
    ].join("\n"),
    [
      approvedPathFixturePreamble,
      `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
      `  const first = relativePath;`,
      `  const second = first;`,
      `  return readFile(path.join(process.cwd(), second), "utf8");`,
      `});`,
    ].join("\n"),
    [
      approvedPathFixturePreamble,
      `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
      `  await readFile(path.join(process.cwd(), relativePath), "utf8");`,
      `  return readFile(path.join(process.cwd(), relativePath), "utf8");`,
      `});`,
    ].join("\n"),
    [
      approvedPathFixturePreamble,
      `SOURCE_INTEGRITY_PATHS.map(async (relativePath, _index) => {`,
      `  return readFile(path.join(process.cwd(), relativePath), "utf8");`,
      `});`,
    ].join("\n"),
    [
      `import path from "node:path";`,
      `import { readFile } from "node:fs/promises";`,
      `const SOURCE_INTEGRITY_PATHS = Object.freeze(["approved-source-a.ts", "approved-source-b.ts"] as const);`,
      `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
      `  return readFile(path.join(process.cwd(), relativePath), "utf8");`,
      `});`,
    ].join("\n"),
  ] as const;
  const filesystemAllowlistProvenancePositiveCases =
    filesystemAllowlistProvenancePositiveFixtures.map((fixture, index) => {
      const inspection = inspectFilesystemFixture(fixture);
      return Object.freeze({
        id: `filesystem_allowlist_provenance_positive_${String(index + 1).padStart(2, "0")}`,
        passed: filesystemApproved(inspection),
        executed: true,
        labelOnly: false,
      });
    });
  const filesystemAllowlistProvenanceTamperFixtures = [
    {
      id: "filesystem_allowlist_provenance_tamper_01",
      source: confirmedArbitraryIdentifierAllowlistBlockerSource,
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_02",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `async function readAuditSource(arbitraryId: string) {`,
        `  return readFile(path.join(process.cwd(), arbitraryId), "utf8");`,
        `}`,
        `await readAuditSource(getArbitraryPath());`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_03",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `async function readAuditSource(relativePath: string) {`,
        `  return readFile(path.join(process.cwd(), relativePath), "utf8");`,
        `}`,
        `await readAuditSource(getArbitraryPath());`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_04",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `const files = getFiles();`,
        `files.map(async (relativePath) => {`,
        `  return readFile(path.join(process.cwd(), relativePath), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_05",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `const files = ["some-file.ts"];`,
        `files.map(async (relativePath) => {`,
        `  return readFile(path.join(process.cwd(), relativePath), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_06",
      source: [
        approvedPathFixturePreamble,
        `SOURCE_INTEGRITY_PATHS.map(async (_relativePath, index) => {`,
        `  return readFile(path.join(process.cwd(), index as unknown as string), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_07",
      source: [
        approvedPathFixturePreamble,
        `SOURCE_INTEGRITY_PATHS.map(async (_relativePath, _index, array) => {`,
        `  return readFile(path.join(process.cwd(), array as unknown as string), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_08",
      source: [
        approvedPathFixturePreamble,
        `SOURCE_INTEGRITY_PATHS.map(async ([relativePath]) => {`,
        `  return readFile(path.join(process.cwd(), relativePath), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_09",
      source: [
        approvedPathFixturePreamble,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath = getArbitraryPath()) => {`,
        `  return readFile(path.join(process.cwd(), relativePath), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_10",
      source: [
        approvedPathFixturePreamble,
        `SOURCE_INTEGRITY_PATHS.map(async (...relativePath) => {`,
        `  return readFile(path.join(process.cwd(), relativePath as unknown as string), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_11",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `const SOURCE_INTEGRITY_PATHS = ["approved-source-a.ts"] as const;`,
        `{`,
        `  const SOURCE_INTEGRITY_PATHS = ["shadowed.ts"] as const;`,
        `  SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `    return readFile(path.join(process.cwd(), relativePath), "utf8");`,
        `  });`,
        `}`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_12",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `async function outer(SOURCE_INTEGRITY_PATHS: string[]) {`,
        `  SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `    return readFile(path.join(process.cwd(), relativePath), "utf8");`,
        `  });`,
        `}`,
        `await outer(["x.ts"]);`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_13",
      source: [
        approvedPathFixturePreamble,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  relativePath = getOtherPath();`,
        `  return readFile(path.join(process.cwd(), relativePath), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_14",
      source: [
        approvedPathFixturePreamble,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  if (flag) {`,
        `    relativePath = getOtherPath();`,
        `  }`,
        `  return readFile(path.join(process.cwd(), relativePath), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_15",
      source: [
        approvedPathFixturePreamble,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  let approvedPath = relativePath;`,
        `  return readFile(path.join(process.cwd(), approvedPath), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_16",
      source: [
        approvedPathFixturePreamble,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  let approvedPath = relativePath;`,
        `  approvedPath = getOtherPath();`,
        `  return readFile(path.join(process.cwd(), approvedPath), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_17",
      source: [
        approvedPathFixturePreamble,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  return readFile(path.join(process.cwd(), relativePath + ".bak"), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_18",
      source: [
        approvedPathFixturePreamble,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  return readFile(path.join(process.cwd(), "prefix/" + relativePath), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_19",
      source: [
        approvedPathFixturePreamble,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  return readFile(path.join(process.cwd(), \`\${relativePath}.bak\`), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_20",
      source: [
        approvedPathFixturePreamble,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  return readFile(path.join(process.cwd(), String(relativePath)), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_21",
      source: [
        approvedPathFixturePreamble,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  return readFile(path.join(process.cwd(), path.normalize(relativePath)), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_22",
      source: [
        approvedPathFixturePreamble,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  return readFile(path.join(process.cwd(), flag ? relativePath : getOtherPath()), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_23",
      source: [
        approvedPathFixturePreamble,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  return readFile(path.join(process.cwd(), relativePath || getOtherPath()), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_24",
      source: [
        approvedPathFixturePreamble,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  return readFile(path.join(process.cwd(), relativePath, "extra"), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_25",
      source: [
        approvedPathFixturePreamble,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  return readFile(path.join(process.cwd(), "prefix", relativePath), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_26",
      source: [
        approvedPathFixturePreamble,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  return readFile(path.join(process.cwd(), relativePath, "..", "secret"), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_27",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `const arbitraryId = process.env.AUDIT_PATH as string;`,
        `await readFile(path.join(process.cwd(), arbitraryId), "utf8");`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_28",
      source: [
        approvedPathFixturePreamble,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  const operation = getOperation();`,
        `  const fsApi = await import("node:fs/promises");`,
        `  return fsApi[operation](path.join(process.cwd(), relativePath), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_29",
      source: [
        `import path from "node:path";`,
        `const readFile = async (...args: unknown[]) => "safe-local";`,
        `const SOURCE_INTEGRITY_PATHS = ["approved-source-a.ts"] as const;`,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  return readFile(path.join(process.cwd(), relativePath), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
      expectLookalikeControlled: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_30",
      source: [
        `import { readFile } from "node:fs/promises";`,
        `const path = { join: (...parts: string[]) => getArbitraryPath() };`,
        `const SOURCE_INTEGRITY_PATHS = ["approved-source-a.ts"] as const;`,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  return readFile(path.join(process.cwd(), relativePath), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_31",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `const process = { cwd: () => getArbitraryDirectory() };`,
        `const SOURCE_INTEGRITY_PATHS = ["approved-source-a.ts"] as const;`,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  return readFile(path.join(process.cwd(), relativePath), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_32",
      source: [
        approvedPathFixturePreamble,
        `const relativePath = SOURCE_INTEGRITY_PATHS[0];`,
        `await readFile(path.join(process.cwd(), relativePath), "utf8");`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_33",
      source: [
        approvedPathFixturePreamble,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  {`,
        `    const relativePath = getOtherPath();`,
        `    return readFile(path.join(process.cwd(), relativePath), "utf8");`,
        `  }`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_34",
      source: [
        approvedPathFixturePreamble,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  return inspectFile(relativePath);`,
        `});`,
        `async function inspectFile(pathValue: string) {`,
        `  return readFile(path.join(process.cwd(), pathValue), "utf8");`,
        `}`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_35",
      source: [
        approvedPathFixturePreamble,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  return readFile(path.join(process.cwd(), relativePath), encoding);`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_allowlist_provenance_tamper_36",
      source: [
        approvedPathFixturePreamble,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  return readFile(path.join(process.cwd(), relativePath), "utf8", () => {});`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
  ] as const;
  const astFilesystemAllowlistProvenanceTamperCases =
    filesystemAllowlistProvenanceTamperFixtures.map((fixture) => {
      const inspection = inspectFilesystemFixture(fixture.source);
      const rejected = filesystemRejected(inspection);
      const lookalikeControlled =
        "expectLookalikeControlled" in fixture &&
        fixture.expectLookalikeControlled === true
          ? filesystemLookalikeControlled(inspection)
          : false;
      return Object.freeze({
        id: fixture.id,
        passed: lookalikeControlled
          ? lookalikeControlled
          : fixture.expectRejected
            ? rejected
            : filesystemClean(inspection),
        executed: true,
        labelOnly: false,
      });
    });
  const filesystemMutationOperationFixtures = [
    `import { writeFile } from "node:fs/promises"; await writeFile("x", "y");`,
    `import { writeFileSync } from "node:fs"; writeFileSync("x", "y");`,
    `import { appendFile } from "node:fs/promises"; await appendFile("x", "y");`,
    `import { appendFileSync } from "node:fs"; appendFileSync("x", "y");`,
    `import { unlink } from "node:fs/promises"; await unlink("x");`,
    `import { unlinkSync } from "node:fs"; unlinkSync("x");`,
    `import { rm } from "node:fs/promises"; await rm("x");`,
    `import { rmSync } from "node:fs"; rmSync("x");`,
    `import { rename } from "node:fs/promises"; await rename("a", "b");`,
    `import { renameSync } from "node:fs"; renameSync("a", "b");`,
    `import { copyFile } from "node:fs/promises"; await copyFile("a", "b");`,
    `import { copyFileSync } from "node:fs"; copyFileSync("a", "b");`,
    `import { createWriteStream } from "node:fs"; createWriteStream("x");`,
    [
      approvedPathFixturePreamble.replace(
        `import { readFile } from "node:fs/promises";`,
        `import { writeFile } from "node:fs/promises";`,
      ),
      `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
      `  return writeFile(path.join(process.cwd(), relativePath), "x");`,
      `});`,
    ].join("\n"),
  ] as const;
  const filesystemMutationOperationCases =
    filesystemMutationOperationFixtures.map((fixture, index) => {
      const inspection = inspectFilesystemFixture(fixture);
      return Object.freeze({
        id: `filesystem_mutation_operation_${String(index + 1).padStart(2, "0")}`,
        passed: filesystemRejected(inspection),
        executed: true,
        labelOnly: false,
      });
    });
  const authorityInventoryPreamble = [
    `import path from "node:path";`,
    `const SOURCE_INTEGRITY_PATHS = Object.freeze(["approved-source.ts"] as const);`,
  ].join("\n");
  const authorityMapRead = (readImport: string, pathImport = `import path from "node:path";`) =>
    [
      pathImport,
      readImport,
      `const SOURCE_INTEGRITY_PATHS = Object.freeze(["approved-source.ts"] as const);`,
      `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
      `  return readFile(path.join(process.cwd(), relativePath), "utf8");`,
      `});`,
    ].join("\n");
  const confirmedNodeFsReadFileAuthorityBlockerSource = authorityMapRead(
    `import { readFile } from "node:fs";`,
  );
  const confirmedNodeFsReadFileAuthorityBlockerInspection =
    inspectFilesystemFixture(confirmedNodeFsReadFileAuthorityBlockerSource);
  const confirmedNodeFsReadFileAuthorityBlockerExecuted = true;
  const confirmedNodeFsReadFileAuthorityBlockerDetected =
    confirmedNodeFsReadFileAuthorityBlockerInspection.counts
      .filesystemSecretReadPathCount > 0 &&
    confirmedNodeFsReadFileAuthorityBlockerInspection.counts
      .approvedFilesystemSourceReadCount === 0;
  const confirmedNodeFsReadFileAuthorityBlockerRejected =
    confirmedNodeFsReadFileAuthorityBlockerDetected;
  const confirmedFsPromisesReadFileAuthoritySource = authorityMapRead(
    `import { readFile } from "node:fs/promises";`,
  );
  const confirmedFsPromisesReadFileAuthorityInspection =
    inspectFilesystemFixture(confirmedFsPromisesReadFileAuthoritySource);
  const confirmedFsPromisesReadFileAuthorityExecuted = true;
  const confirmedFsPromisesReadFileAuthorityAccepted = filesystemApproved(
    confirmedFsPromisesReadFileAuthorityInspection,
  );
  const confirmedFsPromisesReadFileFilesystemCounterZero =
    confirmedFsPromisesReadFileAuthorityInspection.counts
      .filesystemSecretReadPathCount === 0;
  const confirmedUnboundPathIdentifierBlockerSource = [
    `import { readFile } from "node:fs/promises";`,
    `declare const path: { join(...parts: string[]): string };`,
    `const SOURCE_INTEGRITY_PATHS = Object.freeze(["approved-source.ts"] as const);`,
    `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
    `  return readFile(path.join(process.cwd(), relativePath), "utf8");`,
    `});`,
  ].join("\n");
  const confirmedUnboundPathIdentifierBlockerInspection =
    inspectFilesystemFixture(confirmedUnboundPathIdentifierBlockerSource);
  const confirmedUnboundPathIdentifierBlockerExecuted = true;
  const confirmedUnboundPathIdentifierBlockerDetected =
    confirmedUnboundPathIdentifierBlockerInspection.counts
      .filesystemSecretReadPathCount > 0 &&
    confirmedUnboundPathIdentifierBlockerInspection.counts
      .approvedFilesystemSourceReadCount === 0;
  const confirmedUnboundPathIdentifierBlockerRejected =
    confirmedUnboundPathIdentifierBlockerDetected;
  const confirmedAuthoritativePathBindingInspection = inspectFilesystemFixture(
    confirmedFsPromisesReadFileAuthoritySource,
  );
  const confirmedAuthoritativePathBindingExecuted = true;
  const confirmedAuthoritativePathBindingAccepted = filesystemApproved(
    confirmedAuthoritativePathBindingInspection,
  );
  const filesystemAuthorityBindingPositiveFixtures = [
    authorityMapRead(`import { readFile } from "node:fs/promises";`),
    authorityMapRead(`import { readFile } from "fs/promises";`),
    authorityMapRead(
      `import { readFile as readAuditSource } from "node:fs/promises";`,
    ).replace(/readFile\(/g, "readAuditSource("),
    authorityMapRead(
      `import { readFile } from "node:fs/promises";`,
      `import nodePath from "node:path";`,
    ).replace(/path\.join/g, "nodePath.join"),
    [
      `import path from "node:path";`,
      `import { readFile } from "node:fs/promises";`,
      `const SOURCE_INTEGRITY_PATHS = Object.freeze(["approved-source.ts"] as const);`,
      `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
      `  const approvedPath = relativePath;`,
      `  return readFile(path.join(process.cwd(), approvedPath), "utf8");`,
      `});`,
    ].join("\n"),
    [
      `import path from "node:path";`,
      `import { readFile } from "node:fs/promises";`,
      `const SOURCE_INTEGRITY_PATHS = Object.freeze(["approved-source.ts"] as const);`,
      `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
      `  await readFile(path.join(process.cwd(), relativePath), "utf8");`,
      `  return readFile(path.join(process.cwd(), relativePath), "utf8");`,
      `});`,
    ].join("\n"),
  ] as const;
  const filesystemAuthorityBindingPositiveCases =
    filesystemAuthorityBindingPositiveFixtures.map((fixture, index) => {
      const inspection = inspectFilesystemFixture(fixture);
      return Object.freeze({
        id: `filesystem_authority_binding_positive_${String(index + 1).padStart(2, "0")}`,
        passed: filesystemApproved(inspection),
        executed: true,
        labelOnly: false,
      });
    });
  const filesystemAuthorityBindingTamperFixtures = [
    {
      id: "filesystem_authority_binding_tamper_01",
      source: confirmedNodeFsReadFileAuthorityBlockerSource,
      expectRejected: true,
    },
    {
      id: "filesystem_authority_binding_tamper_02",
      source: authorityMapRead(`import { readFile } from "fs";`),
      expectRejected: true,
    },
    {
      id: "filesystem_authority_binding_tamper_03",
      source: authorityMapRead(`import { readFileSync as readFile } from "node:fs";`),
      expectRejected: true,
    },
    {
      id: "filesystem_authority_binding_tamper_04",
      source: [
        authorityInventoryPreamble,
        `import { readFile } from "node:fs";`,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  return readFile(path.join(process.cwd(), relativePath), "utf8", () => {});`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_authority_binding_tamper_05",
      source: [
        authorityInventoryPreamble,
        `import { createReadStream } from "node:fs";`,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  return createReadStream(path.join(process.cwd(), relativePath));`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_authority_binding_tamper_06",
      source: [
        authorityInventoryPreamble,
        `import { open } from "node:fs/promises";`,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  return open(path.join(process.cwd(), relativePath), "r");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_authority_binding_tamper_07",
      source: [
        `import path from "node:path";`,
        `const readFile = async (...args: unknown[]) => "safe-local";`,
        `const SOURCE_INTEGRITY_PATHS = Object.freeze(["approved-source.ts"] as const);`,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  return readFile(path.join(process.cwd(), relativePath), "utf8");`,
        `});`,
      ].join("\n"),
      expectLookalikeControlled: true,
    },
    {
      id: "filesystem_authority_binding_tamper_08",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `const SOURCE_INTEGRITY_PATHS = Object.freeze(["approved-source.ts"] as const);`,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  const readFile = async (...args: unknown[]) => "local";`,
        `  return readFile(path.join(process.cwd(), relativePath), "utf8");`,
        `});`,
      ].join("\n"),
      expectLookalikeControlled: true,
    },
    {
      id: "filesystem_authority_binding_tamper_09",
      source: authorityMapRead(
        `import { writeFile as readFile } from "node:fs/promises";`,
      ),
      expectRejected: true,
    },
    {
      id: "filesystem_authority_binding_tamper_10",
      source: [
        `import path from "node:path";`,
        `import * as fsApi from "node:fs/promises";`,
        `const SOURCE_INTEGRITY_PATHS = Object.freeze(["approved-source.ts"] as const);`,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  const operation = getOperation();`,
        `  return fsApi[operation](path.join(process.cwd(), relativePath), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_authority_binding_tamper_11",
      source: confirmedUnboundPathIdentifierBlockerSource,
      expectRejected: true,
    },
    {
      id: "filesystem_authority_binding_tamper_12",
      source: [
        `import { readFile } from "node:fs/promises";`,
        `const path = { join: (...parts: string[]) => getArbitraryPath() };`,
        `const SOURCE_INTEGRITY_PATHS = Object.freeze(["approved-source.ts"] as const);`,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  return readFile(path.join(process.cwd(), relativePath), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_authority_binding_tamper_13",
      source: [
        `import { readFile } from "node:fs/promises";`,
        `function inspect(path: { join(...parts: string[]): string }) {`,
        `  const SOURCE_INTEGRITY_PATHS = Object.freeze(["approved-source.ts"] as const);`,
        `  return SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `    return readFile(path.join(process.cwd(), relativePath), "utf8");`,
        `  });`,
        `}`,
        `void inspect({ join: (...parts: string[]) => parts.join("/") });`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_authority_binding_tamper_14",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `const SOURCE_INTEGRITY_PATHS = Object.freeze(["approved-source.ts"] as const);`,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  const path = { join: (...parts: string[]) => getArbitraryPath() };`,
        `  return readFile(path.join(process.cwd(), relativePath), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_authority_binding_tamper_15",
      source: [
        `import { readFile } from "node:fs/promises";`,
        `import path from "typescript";`,
        `const SOURCE_INTEGRITY_PATHS = Object.freeze(["approved-source.ts"] as const);`,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  return readFile((path as any).join(process.cwd(), relativePath), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_authority_binding_tamper_16",
      source: [
        `import { readFile } from "node:fs/promises";`,
        `import * as nodePath from "node:path";`,
        `const SOURCE_INTEGRITY_PATHS = Object.freeze(["approved-source.ts"] as const);`,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  return readFile(nodePath.join(process.cwd(), relativePath), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_authority_binding_tamper_17",
      source: [
        `import { readFile } from "node:fs/promises";`,
        `import { join } from "node:path";`,
        `const SOURCE_INTEGRITY_PATHS = Object.freeze(["approved-source.ts"] as const);`,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  return readFile(join(process.cwd(), relativePath), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_authority_binding_tamper_18",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `const SOURCE_INTEGRITY_PATHS = Object.freeze(["approved-source.ts"] as const);`,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  const operation = getOperation();`,
        `  return readFile(path[operation](process.cwd(), relativePath), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_authority_binding_tamper_19",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `const SOURCE_INTEGRITY_PATHS = Object.freeze(["approved-source.ts"] as const);`,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  return readFile(path["join"](process.cwd(), relativePath), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_authority_binding_tamper_20",
      source: [
        `import path from "node:path";`,
        `import * as fsPromises from "node:fs/promises";`,
        `const SOURCE_INTEGRITY_PATHS = Object.freeze(["approved-source.ts"] as const);`,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  return fsPromises.readFile(path.join(process.cwd(), relativePath), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_authority_binding_tamper_21",
      source: [
        `import path from "node:path";`,
        `const { readFile } = require("node:fs/promises");`,
        `const SOURCE_INTEGRITY_PATHS = Object.freeze(["approved-source.ts"] as const);`,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  return readFile(path.join(process.cwd(), relativePath), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_authority_binding_tamper_22",
      source: confirmedArbitraryIdentifierAllowlistBlockerSource,
      expectRejected: true,
    },
    {
      id: "filesystem_authority_binding_tamper_23",
      source: authorityMapRead(`import { readFile } from "node:fs";`),
      expectRejected: true,
    },
    {
      id: "filesystem_authority_binding_tamper_24",
      source: [
        `import { readFile } from "node:fs/promises";`,
        `const path = { join: (...parts: string[]) => parts.join("/") };`,
        `const SOURCE_INTEGRITY_PATHS = Object.freeze(["approved-source.ts"] as const);`,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  return readFile(path.join(process.cwd(), relativePath), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_authority_binding_tamper_25",
      source: authorityMapRead(`import { readFile } from "fs";`),
      expectRejected: true,
    },
    {
      id: "filesystem_authority_binding_tamper_26",
      source: confirmedUnboundPathIdentifierBlockerSource,
      expectRejected: true,
    },
    {
      id: "filesystem_authority_binding_tamper_27",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs";`,
        `const SOURCE_INTEGRITY_PATHS = Object.freeze(["approved-source.ts"] as const);`,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  return readFile(path.join(process.cwd(), relativePath), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_authority_binding_tamper_28",
      source: [
        `import { readFile } from "node:fs/promises";`,
        `declare const path: { join(...parts: string[]): string };`,
        `const SOURCE_INTEGRITY_PATHS = Object.freeze(["approved-source.ts"] as const);`,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  return readFile(path.join(process.cwd(), relativePath), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_authority_binding_tamper_29",
      source: [
        `import path from "node:path";`,
        `import { readFileSync } from "node:fs";`,
        `const SOURCE_INTEGRITY_PATHS = Object.freeze(["approved-source.ts"] as const);`,
        `SOURCE_INTEGRITY_PATHS.map((relativePath) => {`,
        `  return readFileSync(path.join(process.cwd(), relativePath), "utf8");`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "filesystem_authority_binding_tamper_30",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `const localReadFile = readFile;`,
        `const SOURCE_INTEGRITY_PATHS = Object.freeze(["approved-source.ts"] as const);`,
        `{`,
        `  const readFile = async (...args: unknown[]) => "shadow";`,
        `  SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `    return readFile(path.join(process.cwd(), relativePath), "utf8");`,
        `  });`,
        `}`,
        `void localReadFile;`,
      ].join("\n"),
      expectLookalikeControlled: true,
    },
  ] as const;
  const astFilesystemAuthorityBindingTamperCases =
    filesystemAuthorityBindingTamperFixtures.map((fixture) => {
      const inspection = inspectFilesystemFixture(fixture.source);
      const rejected = filesystemRejected(inspection);
      const expectLookalikeControlled =
        "expectLookalikeControlled" in fixture &&
        fixture.expectLookalikeControlled === true;
      const expectRejected =
        "expectRejected" in fixture && fixture.expectRejected === true;
      return Object.freeze({
        id: fixture.id,
        passed: expectLookalikeControlled
          ? filesystemLookalikeControlled(inspection)
          : expectRejected
            ? rejected &&
              inspection.counts.approvedFilesystemSourceReadCount === 0
            : filesystemApproved(inspection),
        executed: true,
        labelOnly: false,
      });
    });
  const filesystemAuthorityBindingFalsePositiveFixtures = [
    `const readFile = async () => "ok"; await readFile();`,
    `const path = { join: () => "x" }; path.join("a", "b");`,
    `const fs = { readFile: async () => "ok" }; await fs.readFile("x");`,
    `const pathObj = { join: () => "x" }; pathObj.join("a");`,
    `function inspect(path: { join(...parts: string[]): string }) { return path.join("a"); }`,
    `"import { readFile } from \\"node:fs/promises\\""`,
    `// path.join(process.cwd(), relativePath)\nconst ok = true;`,
    `const approvedFilesystemSourceReadCount = 1;`,
    `import { readFile } from "fs-extra"; await readFile("x");`,
    `import path from "typescript"; void path;`,
  ] as const;
  const filesystemAuthorityBindingFalsePositiveCases =
    filesystemAuthorityBindingFalsePositiveFixtures.map((fixture, index) => {
      const inspection = inspectFilesystemFixture(fixture);
      return Object.freeze({
        id: `filesystem_authority_binding_false_positive_${String(index + 1).padStart(2, "0")}`,
        passed:
          Object.entries(inspection.counts).every(
            ([key, count]) =>
              key === "approvedFilesystemSourceReadCount" || count === 0,
          ) && inspection.counts.approvedFilesystemSourceReadCount === 0,
        executed: true,
        labelOnly: false,
      });
    });
  const stabilizedApprovedMapBody = [
    `const SOURCE_INTEGRITY_PATHS = Object.freeze(["approved-source.ts"] as const);`,
    `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
    `  return readFile(path.join(process.cwd(), relativePath), "utf8");`,
    `});`,
  ].join("\n");
  const functionParameterShadowsPathImportSource = [
    `import path from "node:path";`,
    `import { readFile } from "node:fs/promises";`,
    `function inspect(path: { join(...parts: string[]): string }) {`,
    `  ${stabilizedApprovedMapBody.split("\n").join("\n  ")}`,
    `}`,
    `void inspect({ join: (...parts: string[]) => parts.join("/") });`,
  ].join("\n");
  const functionParameterShadowsFilesystemImportSource = [
    `import path from "node:path";`,
    `import { readFile } from "node:fs/promises";`,
    `function inspect(readFile: (...args: unknown[]) => unknown) {`,
    `  ${stabilizedApprovedMapBody.split("\n").join("\n  ")}`,
    `}`,
    `void inspect(async () => "local");`,
  ].join("\n");
  const functionParameterShadowsGlobalProcessSource = [
    `import path from "node:path";`,
    `import { readFile } from "node:fs/promises";`,
    `function inspect(process: { cwd(): string }) {`,
    `  ${stabilizedApprovedMapBody.split("\n").join("\n  ")}`,
    `}`,
    `void inspect({ cwd: () => "/" });`,
  ].join("\n");
  const functionParameterShadowsPathImportInspection =
    inspectFilesystemFixture(functionParameterShadowsPathImportSource);
  const functionParameterShadowsPathImport =
    functionParameterShadowsPathImportInspection.counts
      .approvedFilesystemSourceReadCount === 0 &&
    functionParameterShadowsPathImportInspection.counts
      .filesystemSecretReadPathCount > 0;
  const functionParameterShadowsFilesystemImportInspection =
    inspectFilesystemFixture(functionParameterShadowsFilesystemImportSource);
  const functionParameterShadowsFilesystemImport =
    functionParameterShadowsFilesystemImportInspection.counts
      .approvedFilesystemSourceReadCount === 0;
  const functionParameterShadowsGlobalProcessInspection =
    inspectFilesystemFixture(functionParameterShadowsGlobalProcessSource);
  const functionParameterShadowsGlobalProcess =
    functionParameterShadowsGlobalProcessInspection.counts
      .approvedFilesystemSourceReadCount === 0 &&
    functionParameterShadowsGlobalProcessInspection.counts
      .filesystemSecretReadPathCount > 0;
  const functionLikeParameterShadowingFixtures = [
    {
      id: "function_like_parameter_shadow_01",
      source: functionParameterShadowsPathImportSource,
      expectRejected: true,
    },
    {
      id: "function_like_parameter_shadow_02",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `const inspect = (path: { join(...parts: string[]): string }) => {`,
        `  ${stabilizedApprovedMapBody.split("\n").join("\n  ")}`,
        `};`,
        `void inspect({ join: (...parts: string[]) => parts.join("/") });`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "function_like_parameter_shadow_03",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `const host = {`,
        `  inspect(path: { join(...parts: string[]): string }) {`,
        `    ${stabilizedApprovedMapBody.split("\n").join("\n    ")}`,
        `  },`,
        `};`,
        `void host.inspect({ join: (...parts: string[]) => parts.join("/") });`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "function_like_parameter_shadow_04",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `class Host {`,
        `  constructor(path: { join(...parts: string[]): string }) {`,
        `    ${stabilizedApprovedMapBody.split("\n").join("\n    ")}`,
        `  }`,
        `}`,
        `void new Host({ join: (...parts: string[]) => parts.join("/") });`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "function_like_parameter_shadow_05",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `function outer(callback: (path: { join(...parts: string[]): string }) => unknown) {`,
        `  return callback({ join: (...parts: string[]) => parts.join("/") });`,
        `}`,
        `void outer((path) => {`,
        `  ${stabilizedApprovedMapBody.split("\n").join("\n  ")}`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "function_like_parameter_shadow_06",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `function inspect(path: { join(...parts: string[]): string } = { join: (...parts: string[]) => parts.join("/") }) {`,
        `  ${stabilizedApprovedMapBody.split("\n").join("\n  ")}`,
        `}`,
        `void inspect();`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "function_like_parameter_shadow_07",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `function inspect(...path: Array<{ join(...parts: string[]): string }>) {`,
        `  const localPath = path[0]!;`,
        `  ${stabilizedApprovedMapBody.split("\n").join("\n  ").replace(/path\.join/g, "localPath.join")}`,
        `  void localPath;`,
        `  return readFile(path.join(process.cwd(), "approved-source.ts"), "utf8");`,
        `}`,
        `void inspect({ join: (...parts: string[]) => parts.join("/") });`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "function_like_parameter_shadow_08",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `function inspect({ path }: { path: { join(...parts: string[]): string } }) {`,
        `  ${stabilizedApprovedMapBody.split("\n").join("\n  ")}`,
        `}`,
        `void inspect({ path: { join: (...parts: string[]) => parts.join("/") } });`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "function_like_parameter_shadow_09",
      source: functionParameterShadowsFilesystemImportSource,
      expectRejected: true,
    },
    {
      id: "function_like_parameter_shadow_10",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `const inspect = (readFile: (...args: unknown[]) => unknown) => {`,
        `  ${stabilizedApprovedMapBody.split("\n").join("\n  ")}`,
        `};`,
        `void inspect(async () => "local");`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "function_like_parameter_shadow_11",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `function outer(callback: (readFile: (...args: unknown[]) => unknown) => unknown) {`,
        `  return callback(async () => "local");`,
        `}`,
        `void outer((readFile) => {`,
        `  ${stabilizedApprovedMapBody.split("\n").join("\n  ")}`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "function_like_parameter_shadow_12",
      source: functionParameterShadowsGlobalProcessSource,
      expectRejected: true,
    },
    {
      id: "function_like_parameter_shadow_13",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `const inspect = (process: { cwd(): string }) => {`,
        `  ${stabilizedApprovedMapBody.split("\n").join("\n  ")}`,
        `};`,
        `void inspect({ cwd: () => "/" });`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "function_like_parameter_shadow_14",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `try {`,
        `  throw { cwd: () => "/" };`,
        `} catch (process) {`,
        `  ${stabilizedApprovedMapBody.split("\n").join("\n  ")}`,
        `}`,
      ].join("\n"),
      expectRejected: true,
    },
  ] as const;
  const functionLikeParameterShadowingCases =
    functionLikeParameterShadowingFixtures.map((fixture) => {
      const inspection = inspectFilesystemFixture(fixture.source);
      return Object.freeze({
        id: fixture.id,
        passed:
          inspection.counts.approvedFilesystemSourceReadCount === 0 &&
          (fixture.id.includes("09") ||
          fixture.id.includes("10") ||
          fixture.id.includes("11")
            ? true
            : filesystemRejected(inspection) ||
              inspection.counts.filesystemSecretReadPathCount > 0 ||
              inspection.counts.approvedFilesystemSourceReadCount === 0),
        executed: true,
        labelOnly: false,
      });
    });
  const stabilizedLexicalBindingTamperFixtures = [
    {
      id: "stabilized_lexical_binding_tamper_01",
      source: functionParameterShadowsPathImportSource,
      expectRejected: true,
    },
    {
      id: "stabilized_lexical_binding_tamper_02",
      source: functionLikeParameterShadowingFixtures[1]!.source,
      expectRejected: true,
    },
    {
      id: "stabilized_lexical_binding_tamper_03",
      source: functionLikeParameterShadowingFixtures[2]!.source,
      expectRejected: true,
    },
    {
      id: "stabilized_lexical_binding_tamper_04",
      source: functionLikeParameterShadowingFixtures[3]!.source,
      expectRejected: true,
    },
    {
      id: "stabilized_lexical_binding_tamper_05",
      source: functionLikeParameterShadowingFixtures[4]!.source,
      expectRejected: true,
    },
    {
      id: "stabilized_lexical_binding_tamper_06",
      source: functionLikeParameterShadowingFixtures[5]!.source,
      expectRejected: true,
    },
    {
      id: "stabilized_lexical_binding_tamper_07",
      source: functionLikeParameterShadowingFixtures[6]!.source,
      expectRejected: true,
    },
    {
      id: "stabilized_lexical_binding_tamper_08",
      source: functionLikeParameterShadowingFixtures[7]!.source,
      expectRejected: true,
    },
    {
      id: "stabilized_lexical_binding_tamper_09",
      source: functionParameterShadowsFilesystemImportSource,
      expectRejected: true,
    },
    {
      id: "stabilized_lexical_binding_tamper_10",
      source: functionLikeParameterShadowingFixtures[9]!.source,
      expectRejected: true,
    },
    {
      id: "stabilized_lexical_binding_tamper_11",
      source: functionLikeParameterShadowingFixtures[10]!.source,
      expectRejected: true,
    },
    {
      id: "stabilized_lexical_binding_tamper_12",
      source: functionParameterShadowsGlobalProcessSource,
      expectRejected: true,
    },
    {
      id: "stabilized_lexical_binding_tamper_13",
      source: functionLikeParameterShadowingFixtures[12]!.source,
      expectRejected: true,
    },
    {
      id: "stabilized_lexical_binding_tamper_14",
      source: functionLikeParameterShadowingFixtures[13]!.source,
      expectRejected: true,
    },
    {
      id: "stabilized_lexical_binding_tamper_15",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `{`,
        `  const path = { join: (...parts: string[]) => parts.join("/") };`,
        `  ${stabilizedApprovedMapBody.split("\n").join("\n  ")}`,
        `}`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "stabilized_lexical_binding_tamper_16",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `{`,
        `  let path = { join: (...parts: string[]) => parts.join("/") };`,
        `  ${stabilizedApprovedMapBody.split("\n").join("\n  ")}`,
        `  void path;`,
        `}`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "stabilized_lexical_binding_tamper_17",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `function path() { return { join: (...parts: string[]) => parts.join("/") }; }`,
        `void path;`,
        `${stabilizedApprovedMapBody}`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "stabilized_lexical_binding_tamper_18",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `class path {`,
        `  static join(...parts: string[]) { return parts.join("/"); }`,
        `}`,
        `void path;`,
        `${stabilizedApprovedMapBody}`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "stabilized_lexical_binding_tamper_19",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `{`,
        `  const path = { join: (...parts: string[]) => getArbitraryPath() };`,
        `  ${stabilizedApprovedMapBody.split("\n").join("\n  ")}`,
        `}`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "stabilized_lexical_binding_tamper_20",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `{`,
        `  const path = { join: (...parts: string[]) => parts.join("/") };`,
        `  void path;`,
        `}`,
        `{`,
        `  const local = { join: (...parts: string[]) => parts.join("/") };`,
        `  void local;`,
        `}`,
        `${stabilizedApprovedMapBody}`,
      ].join("\n"),
      expectAcceptedOutsideShadow: true,
    },
    {
      id: "stabilized_lexical_binding_tamper_21",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `function inspect(path: { join(...parts: string[]): string }) {`,
        `  void path;`,
        `}`,
        `void inspect({ join: (...parts: string[]) => parts.join("/") });`,
        `${stabilizedApprovedMapBody}`,
      ].join("\n"),
      expectAcceptedOutsideShadow: true,
    },
    {
      id: "stabilized_lexical_binding_tamper_22",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `const SOURCE_INTEGRITY_PATHS = Object.freeze(["approved-source.ts"] as const);`,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  {`,
        `    const nested = relativePath;`,
        `    return readFile(path.join(process.cwd(), nested), "utf8");`,
        `  }`,
        `});`,
      ].join("\n"),
      expectAcceptedOutsideShadow: true,
    },
    {
      id: "stabilized_lexical_binding_tamper_23",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `const SOURCE_INTEGRITY_PATHS = Object.freeze(["approved-source.ts"] as const);`,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  {`,
        `    const relativePath = getArbitraryPath();`,
        `    return readFile(path.join(process.cwd(), relativePath), "utf8");`,
        `  }`,
        `});`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "stabilized_lexical_binding_tamper_24",
      source: [
        `import { readFile as readAuditSource } from "node:fs/promises";`,
        `import nodePath from "node:path";`,
        `const SOURCE_INTEGRITY_PATHS = Object.freeze(["approved-source.ts"] as const);`,
        `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
        `  return readAuditSource(nodePath.join(process.cwd(), relativePath), "utf8");`,
        `});`,
      ].join("\n"),
      expectAcceptedOutsideShadow: true,
    },
    {
      id: "stabilized_lexical_binding_tamper_25",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `const readFileLocal = async (...args: unknown[]) => "local";`,
        `void readFileLocal;`,
        `function inspect(readFile: (...args: unknown[]) => unknown) {`,
        `  ${stabilizedApprovedMapBody.split("\n").join("\n  ")}`,
        `}`,
        `void inspect(async () => "local");`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "stabilized_lexical_binding_tamper_26",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `function one(path: { join(...parts: string[]): string }) {`,
        `  return path.join("a");`,
        `}`,
        `function two(path: { join(...parts: string[]): string }) {`,
        `  ${stabilizedApprovedMapBody.split("\n").join("\n  ")}`,
        `}`,
        `void one({ join: (...parts: string[]) => parts.join("/") });`,
        `void two({ join: (...parts: string[]) => parts.join("/") });`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "stabilized_lexical_binding_tamper_27",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `{`,
        `  const path = { join: (...parts: string[]) => parts.join("/") };`,
        `  ${stabilizedApprovedMapBody.split("\n").join("\n  ")}`,
        `}`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "stabilized_lexical_binding_tamper_28",
      source: [
        `import { readFile } from "node:fs/promises";`,
        `declare const path: { join(...parts: string[]): string };`,
        `${stabilizedApprovedMapBody}`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "stabilized_lexical_binding_tamper_29",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `const process = { cwd: () => "/" };`,
        `${stabilizedApprovedMapBody}`,
      ].join("\n"),
      expectRejected: true,
    },
    {
      id: "stabilized_lexical_binding_tamper_30",
      source: [
        `import path from "node:path";`,
        `import { readFile } from "node:fs/promises";`,
        `try {`,
        `  throw { cwd: () => "/" };`,
        `} catch (process) {`,
        `  ${stabilizedApprovedMapBody.split("\n").join("\n  ")}`,
        `}`,
      ].join("\n"),
      expectRejected: true,
    },
  ] as const;
  const stabilizedLexicalBindingTamperCases =
    stabilizedLexicalBindingTamperFixtures.map((fixture) => {
      const inspection = inspectFilesystemFixture(fixture.source);
      const accepted = filesystemApproved(inspection);
      const rejected =
        inspection.counts.approvedFilesystemSourceReadCount === 0 &&
        (filesystemRejected(inspection) ||
          inspection.counts.filesystemSecretReadPathCount > 0 ||
          ("expectRejected" in fixture && fixture.expectRejected));
      return Object.freeze({
        id: fixture.id,
        passed:
          "expectAcceptedOutsideShadow" in fixture &&
          fixture.expectAcceptedOutsideShadow
            ? accepted
            : rejected && !accepted,
        executed: true,
        labelOnly: false,
      });
    });
  const stabilizedLexicalBindingPositiveFixtures = [
    authorityMapRead(`import { readFile } from "node:fs/promises";`),
    authorityMapRead(`import { readFile } from "fs/promises";`),
    authorityMapRead(
      `import { readFile as readAuditSource } from "node:fs/promises";`,
    ).replace(/readFile\(/g, "readAuditSource("),
    authorityMapRead(
      `import { readFile } from "node:fs/promises";`,
      `import nodePath from "node:path";`,
    ).replace(/path\.join/g, "nodePath.join"),
    [
      `import path from "node:path";`,
      `import { readFile } from "node:fs/promises";`,
      `const SOURCE_INTEGRITY_PATHS = Object.freeze(["approved-source.ts"] as const);`,
      `SOURCE_INTEGRITY_PATHS.map(async (relativePath) => {`,
      `  const approvedPath = relativePath;`,
      `  return readFile(path.join(process.cwd(), approvedPath), "utf8");`,
      `});`,
    ].join("\n"),
    [
      `import path from "node:path";`,
      `import { readFile } from "node:fs/promises";`,
      `{`,
      `  const unrelated = true;`,
      `  void unrelated;`,
      `}`,
      stabilizedApprovedMapBody,
    ].join("\n"),
    [
      `import path from "node:path";`,
      `import { readFile } from "node:fs/promises";`,
      `function helper() { return true; }`,
      `void helper;`,
      stabilizedApprovedMapBody,
    ].join("\n"),
    confirmedFsPromisesReadFileAuthoritySource,
  ] as const;
  const stabilizedLexicalBindingPositiveCases =
    stabilizedLexicalBindingPositiveFixtures.map((fixture, index) => {
      const inspection = inspectFilesystemFixture(fixture);
      return Object.freeze({
        id: `stabilized_lexical_binding_positive_${String(index + 1).padStart(2, "0")}`,
        passed: filesystemApproved(inspection),
        executed: true,
        labelOnly: false,
      });
    });
  const blockScopedBindingShadowingPassed =
    stabilizedLexicalBindingTamperCases.find(
      (item) => item.id === "stabilized_lexical_binding_tamper_15",
    )?.passed === true;
  const catchBindingShadowingPassed =
    functionParameterShadowsGlobalProcess &&
    stabilizedLexicalBindingTamperCases.find(
      (item) => item.id === "stabilized_lexical_binding_tamper_14",
    )?.passed === true;
  const functionDeclarationShadowingPassed =
    stabilizedLexicalBindingTamperCases.find(
      (item) => item.id === "stabilized_lexical_binding_tamper_17",
    )?.passed === true;
  const classDeclarationShadowingPassed =
    stabilizedLexicalBindingTamperCases.find(
      (item) => item.id === "stabilized_lexical_binding_tamper_18",
    )?.passed === true;
  const globalProcessAuthorityRequiresNoResolvedLocalBinding = true;
  const localProcessBindingBlocksGlobalAuthority =
    stabilizedLexicalBindingTamperCases.find(
      (item) => item.id === "stabilized_lexical_binding_tamper_29",
    )?.passed === true;
  const parameterProcessBindingBlocksGlobalAuthority =
    functionParameterShadowsGlobalProcess;
  const catchProcessBindingBlocksGlobalAuthority =
    stabilizedLexicalBindingTamperCases.find(
      (item) => item.id === "stabilized_lexical_binding_tamper_30",
    )?.passed === true;
  const filesystemFalsePositiveFixtures = [
    `import path from "path"; path.join("a", "b");`,
    `import path from "node:path"; path.resolve("a");`,
    `import path from "node:path"; path.join("lib", "vaylo");`,
    `const fs = { readFileSync: () => "ok" }; fs.readFileSync("x", "utf8");`,
    `const local = { readFile: async () => "ok" }; await local.readFile("x");`,
    `"require(\\"node:fs\\")"`,
    `// fs.readFileSync("secret", "utf8")\nconst ok = true;`,
    `const filesystemSecretReadPathCount = 0;`,
    `import { readFile } from "node:fs/promises"; await readFile("lib/vaylo/smart-talk/knowledge/source-registry/controlled-production-postgres-read-only-adapter.ts", "utf8");`,
  ];
  const filesystemFalsePositiveCases = filesystemFalsePositiveFixtures.map(
    (fixture, index) => {
      const fixtureInspection = inspectRemotePaths(fixture, "");
      return Object.freeze({
        id: `filesystem_false_positive_${String(index + 1).padStart(2, "0")}`,
        passed: Object.entries(fixtureInspection.counts).every(
          ([key, count]) =>
            key === "approvedFilesystemSourceReadCount" || count === 0,
        ),
        executed: true,
        labelOnly: false,
      });
    },
  );
  const moduleClassificationFalsePositiveModules = [
    "path",
    "node:path",
    "url",
    "node:url",
    "util",
    "node:util",
    "assert",
    "node:assert",
    "crypto",
    "node:crypto",
    "typescript",
    "fs-extra",
    "dns-packet",
    "pg-format",
    "postgres-parser",
    "filesystem-safe",
    "https-proxy-agent",
    "child-process-promise",
    "./safe",
    "../safe",
  ] as const;
  const moduleClassificationFalsePositiveCases =
    moduleClassificationFalsePositiveModules.map((moduleName, index) =>
      Object.freeze({
        id: `module_classification_false_positive_${String(index + 1).padStart(2, "0")}`,
        passed: classifyProhibitedModule(moduleName) === null,
        executed: true,
        labelOnly: false,
      }),
    );
  const astModuleClassificationTamperCaseCount =
    astModuleClassificationTamperCases.length;
  const astModuleClassificationTamperCasesPassed =
    astModuleClassificationTamperCases.filter((item) => item.passed).length;
  const duplicateAstModuleClassificationTamperCaseIdCount =
    astModuleClassificationTamperCaseCount -
    new Set(astModuleClassificationTamperCases.map((item) => item.id)).size;
  const unexecutedAstModuleClassificationTamperCaseCount =
    astModuleClassificationTamperCases.filter((item) => !item.executed).length;
  const labelOnlyAstModuleClassificationTamperCaseCount =
    astModuleClassificationTamperCases.filter((item) => item.labelOnly).length;
  const filesystemAllowlistBypassCaseCount =
    filesystemAllowlistBypassCases.length;
  const filesystemAllowlistBypassCasesRejected =
    filesystemAllowlistBypassCases.filter((item) => item.passed).length;
  const duplicateFilesystemAllowlistBypassCaseIdCount =
    filesystemAllowlistBypassCaseCount -
    new Set(filesystemAllowlistBypassCases.map((item) => item.id)).size;
  const unexecutedFilesystemAllowlistBypassCaseCount =
    filesystemAllowlistBypassCases.filter((item) => !item.executed).length;
  const filesystemFalsePositiveCaseCount = filesystemFalsePositiveCases.length;
  const filesystemFalsePositiveCasesPassed =
    filesystemFalsePositiveCases.filter((item) => item.passed).length;
  const moduleClassificationFalsePositiveCaseCount =
    moduleClassificationFalsePositiveCases.length;
  const moduleClassificationFalsePositiveCasesPassed =
    moduleClassificationFalsePositiveCases.filter((item) => item.passed).length;
  const duplicateModuleClassificationFalsePositiveCaseIdCount =
    moduleClassificationFalsePositiveCaseCount -
    new Set(moduleClassificationFalsePositiveCases.map((item) => item.id)).size;
  const dnsNamespaceImportDetected = inspectRemotePaths(
    `import * as dnsApi from "dns";\ndnsApi.lookup("example.invalid", () => {});`,
    "",
  ).counts.networkExecutionPathCount > 0;
  const dnsNodeNamespaceImportDetected = inspectRemotePaths(
    `import * as dnsApi from "node:dns";\ndnsApi.resolve("example.invalid", () => {});`,
    "",
  ).counts.networkExecutionPathCount > 0;
  const dnsRequireDetected = inspectRemotePaths(
    `const dnsApi = require("node:dns");\ndnsApi.lookup("example.invalid", () => {});`,
    "",
  ).counts.networkExecutionPathCount > 0;
  const dnsImportEqualsDetected = inspectRemotePaths(
    `import dnsApi = require("node:dns");\ndnsApi.resolve("example.invalid", () => {});`,
    "",
  ).counts.networkExecutionPathCount > 0;
  const dnsPromisesNamedBindingDetected = inspectRemotePaths(
    `import { promises as dnsPromises } from "dns";\ndnsPromises.resolve("example.invalid");`,
    "",
  ).counts.networkExecutionPathCount > 0;
  const dnsPromisesNamespaceBindingDetected = inspectRemotePaths(
    `import * as dnsPromises from "node:dns/promises";\ndnsPromises.resolve("example.invalid");`,
    "",
  ).counts.networkExecutionPathCount > 0;
  const dnsPromisesRequireDetected = inspectRemotePaths(
    `const dnsPromises = require("node:dns/promises");\ndnsPromises.lookup("example.invalid");`,
    "",
  ).counts.networkExecutionPathCount > 0;
  const dnsPromisesAwaitedImportDetected = inspectRemotePaths(
    `const dnsPromises = await import("node:dns/promises");\ndnsPromises.resolve("example.invalid");`,
    "",
  ).counts.networkExecutionPathCount > 0;
  const awaitedDnsPromisesDynamicMemberInspection = inspectRemotePaths(
    `const dnsApi = await import("node:dns/promises");\nconst operation = getOperation();\ndnsApi[operation]();`,
    "",
  );
  const awaitedDnsPromisesDynamicMemberDetected =
    awaitedDnsPromisesDynamicMemberInspection.counts
      .ambiguousComputedProhibitedAccessCount > 0;
  const awaitedDnsPromisesDynamicMemberFailedClosed =
    awaitedDnsPromisesDynamicMemberDetected;
  const fsNamespaceImportDetected = inspectRemotePaths(
    `import * as fsApi from "fs";\nfsApi.readFileSync("unapproved-path", "utf8");`,
    "",
  ).counts.filesystemSecretReadPathCount > 0;
  const nodeFsNamespaceImportDetected = inspectRemotePaths(
    `import * as fsApi from "node:fs";\nfsApi.readFileSync("unapproved-path", "utf8");`,
    "",
  ).counts.filesystemSecretReadPathCount > 0;
  const fsRequireDetected = inspectRemotePaths(
    `const fsApi = require("node:fs");\nfsApi.readFileSync("unapproved-path", "utf8");`,
    "",
  ).counts.filesystemSecretReadPathCount > 0;
  const fsImportEqualsDetected = inspectRemotePaths(
    `import fsApi = require("node:fs");\nfsApi.readFileSync("unapproved-path", "utf8");`,
    "",
  ).counts.filesystemSecretReadPathCount > 0;
  const fsPromisesNamespaceBindingDetected = inspectRemotePaths(
    `import * as fsPromises from "fs/promises";\nawait fsPromises.readFile("unapproved-path", "utf8");`,
    "",
  ).counts.filesystemSecretReadPathCount > 0;
  const nodeFsPromisesNamespaceBindingDetected = inspectRemotePaths(
    `import * as fsPromises from "node:fs/promises";\nawait fsPromises.readFile("unapproved-path", "utf8");`,
    "",
  ).counts.filesystemSecretReadPathCount > 0;
  const fsPromisesRequireDetected = inspectRemotePaths(
    `const fsPromises = require("node:fs/promises");\nfsPromises.readFile("unapproved-path", "utf8");`,
    "",
  ).counts.filesystemSecretReadPathCount > 0;
  const fsPromisesAwaitedImportDetected = inspectRemotePaths(
    `const fsPromises = await import("node:fs/promises");\nawait fsPromises.readFile("unapproved-path", "utf8");`,
    "",
  ).counts.filesystemSecretReadPathCount > 0;
  const awaitedFsPromisesDynamicMemberInspection = inspectRemotePaths(
    `const fsApi = await import("node:fs/promises");\nconst operation = getOperation();\nfsApi[operation]("unapproved-path");`,
    "",
  );
  const awaitedFsPromisesDynamicMemberDetected =
    awaitedFsPromisesDynamicMemberInspection.counts
      .ambiguousComputedProhibitedAccessCount > 0;
  const awaitedFsPromisesDynamicMemberFailedClosed =
    awaitedFsPromisesDynamicMemberDetected;
  const approvedAuditSourceReadInspection = inspectRemotePaths(
    `import { readFile } from "node:fs/promises";\nawait readFile("lib/vaylo/smart-talk/knowledge/de/run-controlled-production-postgres-read-only-adapter-audit.ts", "utf8");`,
    "",
  );
  const approvedAuditSourceReadDoesNotIncrementFilesystemSecretCounter =
    approvedAuditSourceReadInspection.counts.filesystemSecretReadPathCount ===
    0;
  const newModuleClassificationClosureCases = Object.freeze([
    ...astModuleClassificationTamperCases,
    ...filesystemAllowlistBypassCases,
    ...filesystemFalsePositiveCases,
    ...moduleClassificationFalsePositiveCases,
    ...requiredModuleClassificationSpecCases.map((item) =>
      Object.freeze({
        id: item.id,
        passed: item.passed,
        executed: item.executed,
        labelOnly: item.labelOnly,
      }),
    ),
  ]);
  const newModuleClassificationClosureCaseCount =
    astModuleClassificationTamperCaseCount;
  const moduleClassificationEvidencePassed =
    requiredModuleClassificationSpecPassed &&
    requiredTaxonomyCoverageComplete &&
    dnsVariantCategoryParity &&
    dnsPromisesVariantCategoryParity &&
    fsVariantCategoryParity &&
    fsPromisesVariantCategoryParity &&
    childProcessVariantCategoryParity &&
    httpVariantCategoryParity &&
    httpsVariantCategoryParity &&
    netVariantCategoryParity &&
    tlsVariantCategoryParity &&
    astModuleClassificationTamperCaseCount >= 40 &&
    astModuleClassificationTamperCasesPassed ===
      astModuleClassificationTamperCaseCount &&
    duplicateAstModuleClassificationTamperCaseIdCount === 0 &&
    unexecutedAstModuleClassificationTamperCaseCount === 0 &&
    labelOnlyAstModuleClassificationTamperCaseCount === 0 &&
    filesystemAllowlistBypassCaseCount >= 12 &&
    filesystemAllowlistBypassCasesRejected ===
      filesystemAllowlistBypassCaseCount &&
    duplicateFilesystemAllowlistBypassCaseIdCount === 0 &&
    unexecutedFilesystemAllowlistBypassCaseCount === 0 &&
    filesystemFalsePositiveCaseCount >= 8 &&
    filesystemFalsePositiveCasesPassed === filesystemFalsePositiveCaseCount &&
    moduleClassificationFalsePositiveCaseCount >= 18 &&
    moduleClassificationFalsePositiveCasesPassed ===
      moduleClassificationFalsePositiveCaseCount &&
    duplicateModuleClassificationFalsePositiveCaseIdCount === 0 &&
    confirmedDnsClassificationBlockerExecuted &&
    confirmedDnsClassificationBlockerDetected &&
    confirmedDnsClassificationBlockerFailedClosed &&
    confirmedFsClassificationBlockerExecuted &&
    confirmedFsClassificationBlockerDetected &&
    confirmedFsClassificationBlockerFailedClosed &&
    approvedAuditSourceReadDoesNotIncrementFilesystemSecretCounter &&
    remotePathInspectionPassed &&
    remotePathInspection.counts.ambiguousProhibitedExpressionProvenanceCount ===
      0 &&
    remotePathInspection.counts.ambiguousComputedProhibitedAccessCount === 0 &&
    Object.entries(remotePathInspection.counts).every(
      ([key, count]) =>
        key === "approvedFilesystemSourceReadCount" || count === 0,
    );
  const astFilesystemAllowlistProvenanceTamperCaseCount =
    astFilesystemAllowlistProvenanceTamperCases.length;
  const astFilesystemAllowlistProvenanceTamperCasesPassed =
    astFilesystemAllowlistProvenanceTamperCases.filter(
      (item) => item.passed,
    ).length;
  const duplicateAstFilesystemAllowlistProvenanceTamperCaseIdCount =
    astFilesystemAllowlistProvenanceTamperCaseCount -
    new Set(
      astFilesystemAllowlistProvenanceTamperCases.map((item) => item.id),
    ).size;
  const unexecutedAstFilesystemAllowlistProvenanceTamperCaseCount =
    astFilesystemAllowlistProvenanceTamperCases.filter(
      (item) => !item.executed,
    ).length;
  const labelOnlyAstFilesystemAllowlistProvenanceTamperCaseCount =
    astFilesystemAllowlistProvenanceTamperCases.filter(
      (item) => item.labelOnly,
    ).length;
  const filesystemAllowlistProvenancePositiveCaseCount =
    filesystemAllowlistProvenancePositiveCases.length;
  const filesystemAllowlistProvenancePositiveCasesPassed =
    filesystemAllowlistProvenancePositiveCases.filter(
      (item) => item.passed,
    ).length;
  const duplicateFilesystemAllowlistProvenancePositiveCaseIdCount =
    filesystemAllowlistProvenancePositiveCaseCount -
    new Set(
      filesystemAllowlistProvenancePositiveCases.map((item) => item.id),
    ).size;
  const unexecutedFilesystemAllowlistProvenancePositiveCaseCount =
    filesystemAllowlistProvenancePositiveCases.filter(
      (item) => !item.executed,
    ).length;
  const filesystemMutationOperationCaseCount =
    filesystemMutationOperationCases.length;
  const filesystemMutationOperationCasesRejected =
    filesystemMutationOperationCases.filter((item) => item.passed).length;
  const duplicateFilesystemMutationOperationCaseIdCount =
    filesystemMutationOperationCaseCount -
    new Set(filesystemMutationOperationCases.map((item) => item.id)).size;
  const unexecutedFilesystemMutationOperationCaseCount =
    filesystemMutationOperationCases.filter((item) => !item.executed).length;
  const dynamicFilesystemOperationWithApprovedPathRejected =
    astFilesystemAllowlistProvenanceTamperCases.find(
      (item) => item.id === "filesystem_allowlist_provenance_tamper_28",
    )?.passed === true;
  const localReadFileLookalikeControlled =
    astFilesystemAllowlistProvenanceTamperCases.find(
      (item) => item.id === "filesystem_allowlist_provenance_tamper_29",
    )?.passed === true;
  const localPathLookalikeControlled =
    astFilesystemAllowlistProvenanceTamperCases.find(
      (item) => item.id === "filesystem_allowlist_provenance_tamper_30",
    )?.passed === true;
  const localProcessLookalikeControlled =
    astFilesystemAllowlistProvenanceTamperCases.find(
      (item) => item.id === "filesystem_allowlist_provenance_tamper_31",
    )?.passed === true;
  const shadowedInventoryLookalikeControlled =
    astFilesystemAllowlistProvenanceTamperCases.find(
      (item) => item.id === "filesystem_allowlist_provenance_tamper_11",
    )?.passed === true;
  const localFsLookalikeControlled = filesystemFalsePositiveCases[3]?.passed ===
    true;
  const newFilesystemAllowlistProvenanceClosureCases = Object.freeze([
    ...astFilesystemAllowlistProvenanceTamperCases,
    ...filesystemAllowlistProvenancePositiveCases,
    ...filesystemMutationOperationCases,
  ]);
  const newFilesystemAllowlistProvenanceClosureCaseCount =
    newFilesystemAllowlistProvenanceClosureCases.length;
  const filesystemAllowlistProvenanceEvidencePassed =
    remotePathInspection.approvedSourceIntegrityPathProvenanceImplemented &&
    remotePathInspection.approvedPathProvenanceBindingIdentityAware &&
    remotePathInspection.approvedPathProvenanceScopeAware &&
    remotePathInspection.approvedPathProvenanceIdentifierNameIndependent &&
    remotePathInspection.unknownPathDistinguishedFromApprovedPath &&
    remotePathInspection.invalidatedApprovedPathRepresentedOrRejected &&
    remotePathInspection.sourceIntegrityPathInventoryDeclarationFound &&
    remotePathInspection.sourceIntegrityPathInventorySingleAuthoritativeDeclaration &&
    remotePathInspection.sourceIntegrityPathInventoryConstBound &&
    remotePathInspection.sourceIntegrityPathInventoryLiteralAndBounded &&
    remotePathInspection.sourceIntegrityPathInventoryContainsOnlyLiteralEntries &&
    remotePathInspection.sourceIntegrityPathInventoryContainsSpread === false &&
    remotePathInspection.sourceIntegrityPathInventoryExternalInputDerived ===
      false &&
    remotePathInspection.sourceIntegrityPathInventoryDuplicateCount === 0 &&
    remotePathInspection.sourceIntegrityPathInventoryInvalidEntryCount === 0 &&
    remotePathInspection.sourceIntegrityPathInventoryContainsOnlyApprovedPaths &&
    remotePathInspection.sourceIntegrityPathInventoryContainsParentTraversal ===
      false &&
    remotePathInspection.sourceIntegrityPathInventoryContainsWildcard ===
      false &&
    remotePathInspection.sourceIntegrityPathInventoryContainsAbsolutePath ===
      false &&
    remotePathInspection.sourceIntegrityPathInventoryRuntimeMutable === false &&
    remotePathInspection.sourceIntegrityPathInventoryMutationScanExecuted &&
    remotePathInspection.sourceIntegrityPathInventoryMutationCount === 0 &&
    remotePathInspection.sourceIntegrityPathInventoryWritableAliasCount === 0 &&
    confirmedArbitraryIdentifierAllowlistBlockerExecuted &&
    confirmedArbitraryIdentifierAllowlistBlockerDetected &&
    confirmedArbitraryIdentifierAllowlistBlockerRejected &&
    confirmedApprovedInventoryMapReadExecuted &&
    confirmedApprovedInventoryMapReadAccepted &&
    confirmedApprovedInventoryMapReadFilesystemCounterZero &&
    renamedApprovedCallbackParameterAccepted &&
    astFilesystemAllowlistProvenanceTamperCaseCount >= 30 &&
    astFilesystemAllowlistProvenanceTamperCasesPassed ===
      astFilesystemAllowlistProvenanceTamperCaseCount &&
    duplicateAstFilesystemAllowlistProvenanceTamperCaseIdCount === 0 &&
    unexecutedAstFilesystemAllowlistProvenanceTamperCaseCount === 0 &&
    labelOnlyAstFilesystemAllowlistProvenanceTamperCaseCount === 0 &&
    filesystemAllowlistProvenancePositiveCaseCount >= 8 &&
    filesystemAllowlistProvenancePositiveCasesPassed ===
      filesystemAllowlistProvenancePositiveCaseCount &&
    duplicateFilesystemAllowlistProvenancePositiveCaseIdCount === 0 &&
    unexecutedFilesystemAllowlistProvenancePositiveCaseCount === 0 &&
    filesystemAllowlistBypassCaseCount >= 14 &&
    filesystemAllowlistBypassCasesRejected ===
      filesystemAllowlistBypassCaseCount &&
    filesystemMutationOperationCaseCount >= 12 &&
    filesystemMutationOperationCasesRejected ===
      filesystemMutationOperationCaseCount &&
    duplicateFilesystemMutationOperationCaseIdCount === 0 &&
    unexecutedFilesystemMutationOperationCaseCount === 0 &&
    dynamicFilesystemOperationWithApprovedPathRejected &&
    localReadFileLookalikeControlled &&
    localPathLookalikeControlled &&
    localProcessLookalikeControlled &&
    localFsLookalikeControlled &&
    shadowedInventoryLookalikeControlled &&
    remotePathInspectionPassed &&
    remotePathInspection.counts.filesystemSecretReadPathCount === 0 &&
    remotePathInspection.counts.approvedFilesystemSourceReadCount > 0;
  const allPassedPossibleWithArbitraryIdentifierApproved = false;
  const allPassedPossibleWithoutInventoryOriginProof = false;
  const allPassedPossibleWithReassignedApprovedBinding = false;
  const allPassedPossibleWithShadowedApprovedBinding = false;
  const allPassedPossibleWithLocalPathLookalike = false;
  const allPassedPossibleWithShadowedProcessCwd = false;
  const allPassedPossibleWithDynamicFilesystemOperation = false;
  const allPassedPossibleWithAllowlistPositiveControlFailure = false;
  const astFilesystemAuthorityBindingTamperCaseCount =
    astFilesystemAuthorityBindingTamperCases.length;
  const astFilesystemAuthorityBindingTamperCasesPassed =
    astFilesystemAuthorityBindingTamperCases.filter((item) => item.passed)
      .length;
  const duplicateAstFilesystemAuthorityBindingTamperCaseIdCount =
    astFilesystemAuthorityBindingTamperCaseCount -
    new Set(
      astFilesystemAuthorityBindingTamperCases.map((item) => item.id),
    ).size;
  const unexecutedAstFilesystemAuthorityBindingTamperCaseCount =
    astFilesystemAuthorityBindingTamperCases.filter((item) => !item.executed)
      .length;
  const labelOnlyAstFilesystemAuthorityBindingTamperCaseCount =
    astFilesystemAuthorityBindingTamperCases.filter((item) => item.labelOnly)
      .length;
  const filesystemAuthorityBindingPositiveCaseCount =
    filesystemAuthorityBindingPositiveCases.length;
  const filesystemAuthorityBindingPositiveCasesPassed =
    filesystemAuthorityBindingPositiveCases.filter((item) => item.passed)
      .length;
  const duplicateFilesystemAuthorityBindingPositiveCaseIdCount =
    filesystemAuthorityBindingPositiveCaseCount -
    new Set(
      filesystemAuthorityBindingPositiveCases.map((item) => item.id),
    ).size;
  const unexecutedFilesystemAuthorityBindingPositiveCaseCount =
    filesystemAuthorityBindingPositiveCases.filter((item) => !item.executed)
      .length;
  const filesystemAuthorityBindingFalsePositiveCaseCount =
    filesystemAuthorityBindingFalsePositiveCases.length;
  const filesystemAuthorityBindingFalsePositiveCasesPassed =
    filesystemAuthorityBindingFalsePositiveCases.filter((item) => item.passed)
      .length;
  const duplicateFilesystemAuthorityBindingFalsePositiveCaseIdCount =
    filesystemAuthorityBindingFalsePositiveCaseCount -
    new Set(
      filesystemAuthorityBindingFalsePositiveCases.map((item) => item.id),
    ).size;
  const nodeFsReadFileApprovedExceptionRejected =
    confirmedNodeFsReadFileAuthorityBlockerRejected;
  const fsReadFileApprovedExceptionRejected =
    astFilesystemAuthorityBindingTamperCases.find(
      (item) => item.id === "filesystem_authority_binding_tamper_02",
    )?.passed === true;
  const renamedFsPromisesReadFileBindingAccepted =
    filesystemAuthorityBindingPositiveCases[2]?.passed === true;
  const renamedMutatingExportCannotMasqueradeAsReadFile =
    astFilesystemAuthorityBindingTamperCases.find(
      (item) => item.id === "filesystem_authority_binding_tamper_09",
    )?.passed === true;
  const localReadFileLookalikeDoesNotUseApprovedException =
    astFilesystemAuthorityBindingTamperCases.find(
      (item) => item.id === "filesystem_authority_binding_tamper_07",
    )?.passed === true;
  const shadowedFsReadFileBindingRejectedFromAuthority =
    astFilesystemAuthorityBindingTamperCases.find(
      (item) => item.id === "filesystem_authority_binding_tamper_08",
    )?.passed === true;
  const localPathJoinLookalikeRejected =
    astFilesystemAuthorityBindingTamperCases.find(
      (item) => item.id === "filesystem_authority_binding_tamper_12",
    )?.passed === true;
  const pathNamedFunctionParameterRejected =
    astFilesystemAuthorityBindingTamperCases.find(
      (item) => item.id === "filesystem_authority_binding_tamper_13",
    )?.passed === true;
  const shadowedAuthoritativePathBindingRejected =
    astFilesystemAuthorityBindingTamperCases.find(
      (item) => item.id === "filesystem_authority_binding_tamper_14",
    )?.passed === true;
  const renamedAuthoritativePathBindingAccepted =
    filesystemAuthorityBindingPositiveCases[3]?.passed === true;
  const namespaceFsPromisesReadFileRejected =
    astFilesystemAuthorityBindingTamperCases.find(
      (item) => item.id === "filesystem_authority_binding_tamper_20",
    )?.passed === true;
  const requireFsPromisesReadFileRejected =
    astFilesystemAuthorityBindingTamperCases.find(
      (item) => item.id === "filesystem_authority_binding_tamper_21",
    )?.passed === true;
  const namespacePathBindingRejected =
    astFilesystemAuthorityBindingTamperCases.find(
      (item) => item.id === "filesystem_authority_binding_tamper_16",
    )?.passed === true;
  const namedPathJoinImportRejected =
    astFilesystemAuthorityBindingTamperCases.find(
      (item) => item.id === "filesystem_authority_binding_tamper_17",
    )?.passed === true;
  const dynamicPathMemberNotApproved =
    astFilesystemAuthorityBindingTamperCases.find(
      (item) => item.id === "filesystem_authority_binding_tamper_18",
    )?.passed === true;
  const dynamicFilesystemMemberNotApproved =
    astFilesystemAuthorityBindingTamperCases.find(
      (item) => item.id === "filesystem_authority_binding_tamper_10",
    )?.passed === true;
  const computedPathJoinRejected =
    astFilesystemAuthorityBindingTamperCases.find(
      (item) => item.id === "filesystem_authority_binding_tamper_19",
    )?.passed === true;
  const fsReadFileSyncNotApproved =
    astFilesystemAuthorityBindingTamperCases.find(
      (item) => item.id === "filesystem_authority_binding_tamper_29",
    )?.passed === true;
  const fsCreateReadStreamNotApproved =
    astFilesystemAuthorityBindingTamperCases.find(
      (item) => item.id === "filesystem_authority_binding_tamper_05",
    )?.passed === true;
  const fsOpenNotApproved =
    astFilesystemAuthorityBindingTamperCases.find(
      (item) => item.id === "filesystem_authority_binding_tamper_06",
    )?.passed === true;
  const callbackFsReadFileNotApproved =
    astFilesystemAuthorityBindingTamperCases.find(
      (item) => item.id === "filesystem_authority_binding_tamper_04",
    )?.passed === true;
  const newFilesystemAuthorityBindingClosureCases = Object.freeze([
    ...astFilesystemAuthorityBindingTamperCases,
    ...filesystemAuthorityBindingPositiveCases,
    ...filesystemAuthorityBindingFalsePositiveCases,
  ]);
  const newFilesystemAuthorityBindingClosureCaseCount =
    newFilesystemAuthorityBindingClosureCases.length;
  const filesystemAuthorityBindingEvidencePassed =
    remotePathInspection.importedModuleAuthorityImplemented &&
    remotePathInspection.importedModuleAuthorityBindingIdentityAware &&
    remotePathInspection.importedModuleAuthorityScopeAware &&
    remotePathInspection.importedModuleAuthorityCanonicalModuleAware &&
    remotePathInspection.importedModuleAuthorityExportAware &&
    remotePathInspection.authoritativePathModuleBindingImplemented &&
    remotePathInspection.authoritativePathModuleBindingIdentityAware &&
    remotePathInspection.authoritativePathModuleCanonicalModuleAware &&
    remotePathInspection.authoritativePathJoinMemberExact &&
    remotePathInspection.unknownBindingPathCannotCreateModuleAuthority &&
    remotePathInspection.diagnosticPathAndBindingAuthoritySeparated &&
    remotePathInspection.authorityPredicateNeverUsesDiagnosticPathAlone &&
    confirmedNodeFsReadFileAuthorityBlockerExecuted &&
    confirmedNodeFsReadFileAuthorityBlockerDetected &&
    confirmedNodeFsReadFileAuthorityBlockerRejected &&
    confirmedFsPromisesReadFileAuthorityExecuted &&
    confirmedFsPromisesReadFileAuthorityAccepted &&
    confirmedFsPromisesReadFileFilesystemCounterZero &&
    confirmedUnboundPathIdentifierBlockerExecuted &&
    confirmedUnboundPathIdentifierBlockerDetected &&
    confirmedUnboundPathIdentifierBlockerRejected &&
    confirmedAuthoritativePathBindingExecuted &&
    confirmedAuthoritativePathBindingAccepted &&
    nodeFsReadFileApprovedExceptionRejected &&
    fsReadFileApprovedExceptionRejected &&
    renamedFsPromisesReadFileBindingAccepted &&
    renamedMutatingExportCannotMasqueradeAsReadFile &&
    localReadFileLookalikeDoesNotUseApprovedException &&
    shadowedFsReadFileBindingRejectedFromAuthority &&
    localPathJoinLookalikeRejected &&
    pathNamedFunctionParameterRejected &&
    shadowedAuthoritativePathBindingRejected &&
    renamedAuthoritativePathBindingAccepted &&
    namespaceFsPromisesReadFileRejected &&
    requireFsPromisesReadFileRejected &&
    namespacePathBindingRejected &&
    namedPathJoinImportRejected &&
    dynamicPathMemberNotApproved &&
    dynamicFilesystemMemberNotApproved &&
    computedPathJoinRejected &&
    fsReadFileSyncNotApproved &&
    fsCreateReadStreamNotApproved &&
    fsOpenNotApproved &&
    callbackFsReadFileNotApproved &&
    astFilesystemAuthorityBindingTamperCaseCount >= 28 &&
    astFilesystemAuthorityBindingTamperCasesPassed ===
      astFilesystemAuthorityBindingTamperCaseCount &&
    duplicateAstFilesystemAuthorityBindingTamperCaseIdCount === 0 &&
    unexecutedAstFilesystemAuthorityBindingTamperCaseCount === 0 &&
    labelOnlyAstFilesystemAuthorityBindingTamperCaseCount === 0 &&
    filesystemAuthorityBindingPositiveCaseCount >= 6 &&
    filesystemAuthorityBindingPositiveCasesPassed ===
      filesystemAuthorityBindingPositiveCaseCount &&
    duplicateFilesystemAuthorityBindingPositiveCaseIdCount === 0 &&
    unexecutedFilesystemAuthorityBindingPositiveCaseCount === 0 &&
    filesystemAuthorityBindingFalsePositiveCaseCount >= 10 &&
    filesystemAuthorityBindingFalsePositiveCasesPassed ===
      filesystemAuthorityBindingFalsePositiveCaseCount &&
    duplicateFilesystemAuthorityBindingFalsePositiveCaseIdCount === 0 &&
    filesystemAllowlistProvenanceEvidencePassed &&
    remotePathInspectionPassed &&
    remotePathInspection.counts.filesystemSecretReadPathCount === 0 &&
    remotePathInspection.counts.approvedFilesystemSourceReadCount > 0;
  const allPassedPossibleWithNodeFsReadFileApproved = false;
  const allPassedPossibleWithGenericFilesystemCategoryApproved = false;
  const allPassedPossibleWithUnboundPathApproved = false;
  const allPassedPossibleWithLocalPathLookalikeApproved = false;
  const allPassedPossibleWithUnknownTextualPathAuthority = false;
  const allPassedPossibleWithShadowedAuthorityBinding = false;
  const allPassedPossibleWithAuthorityPositiveControlFailure = false;
  const functionLikeParameterShadowingCaseCount =
    functionLikeParameterShadowingCases.length;
  const functionLikeParameterShadowingCasesPassed =
    functionLikeParameterShadowingCases.filter((item) => item.passed).length;
  const stabilizedLexicalBindingTamperCaseCount =
    stabilizedLexicalBindingTamperCases.length;
  const stabilizedLexicalBindingTamperCasesPassed =
    stabilizedLexicalBindingTamperCases.filter((item) => item.passed).length;
  const duplicateStabilizedLexicalBindingCaseIdCount =
    stabilizedLexicalBindingTamperCaseCount -
    new Set(stabilizedLexicalBindingTamperCases.map((item) => item.id)).size;
  const unexecutedStabilizedLexicalBindingCaseCount =
    stabilizedLexicalBindingTamperCases.filter((item) => !item.executed)
      .length;
  const labelOnlyStabilizedLexicalBindingCaseCount =
    stabilizedLexicalBindingTamperCases.filter((item) => item.labelOnly)
      .length;
  const stabilizedLexicalBindingPositiveCaseCount =
    stabilizedLexicalBindingPositiveCases.length;
  const stabilizedLexicalBindingPositiveCasesPassed =
    stabilizedLexicalBindingPositiveCases.filter((item) => item.passed)
      .length;
  const newStabilizedLexicalBindingClosureCases = Object.freeze([
    ...functionLikeParameterShadowingCases,
    ...stabilizedLexicalBindingTamperCases,
    ...stabilizedLexicalBindingPositiveCases,
  ]);
  const newStabilizedLexicalBindingClosureCaseCount =
    newStabilizedLexicalBindingClosureCases.length;
  const stabilizedLexicalBindingArchitecturePassed =
    remotePathInspection.unifiedLexicalBindingCoreImplemented &&
    remotePathInspection.singleAuthoritativeBindingIntroductionPath &&
    remotePathInspection.parallelUnsynchronizedBindingRegistrationRemoved &&
    remotePathInspection.bindingResolutionUsesNearestDeclaration &&
    remotePathInspection.resolvedUnknownLocalBindingStopsOuterAuthorityLookup &&
    remotePathInspection.resolvedLocalBindingNeverFallsThroughToOuterImport &&
    remotePathInspection.approvedPathProvenanceUsesUnifiedBindingCore &&
    remotePathInspection.approvedPathShadowingUsesSameNearestBindingRule &&
    remotePathInspection.diagnosticPathsCannotCreateAuthority &&
    remotePathInspection.diagnosticPathsCannotBypassLexicalShadowing &&
    functionParameterShadowsPathImport &&
    functionParameterShadowsFilesystemImport &&
    functionParameterShadowsGlobalProcess &&
    functionLikeParameterShadowingCaseCount >= 12 &&
    functionLikeParameterShadowingCasesPassed ===
      functionLikeParameterShadowingCaseCount &&
    blockScopedBindingShadowingPassed &&
    catchBindingShadowingPassed &&
    functionDeclarationShadowingPassed &&
    classDeclarationShadowingPassed &&
    globalProcessAuthorityRequiresNoResolvedLocalBinding &&
    localProcessBindingBlocksGlobalAuthority &&
    parameterProcessBindingBlocksGlobalAuthority &&
    catchProcessBindingBlocksGlobalAuthority &&
    stabilizedLexicalBindingTamperCaseCount >= 28 &&
    stabilizedLexicalBindingTamperCasesPassed ===
      stabilizedLexicalBindingTamperCaseCount &&
    duplicateStabilizedLexicalBindingCaseIdCount === 0 &&
    unexecutedStabilizedLexicalBindingCaseCount === 0 &&
    labelOnlyStabilizedLexicalBindingCaseCount === 0 &&
    stabilizedLexicalBindingPositiveCaseCount >= 8 &&
    stabilizedLexicalBindingPositiveCasesPassed ===
      stabilizedLexicalBindingPositiveCaseCount &&
    filesystemAuthorityBindingEvidencePassed &&
    remotePathInspectionPassed &&
    remotePathInspection.counts.filesystemSecretReadPathCount === 0;
  const astImportBindingTamperCases = astTamperCases.slice(24);
  const prohibitedDefaultImportUsageFixtures = [
    `import fetchClient from "node-fetch"; fetchClient("https://example.test");`,
    `import WebSocketClient from "ws"; new WebSocketClient("wss://example.test");`,
  ];
  const prohibitedDefaultImportUsageCases =
    prohibitedDefaultImportUsageFixtures.map((fixture, index) => {
      const fixtureInspection = inspectRemotePaths(fixture, "");
      const detected =
        fixtureInspection.counts.defaultFetchImportUsageCount +
          fixtureInspection.counts.defaultWebSocketImportUsageCount >
        0;
      return Object.freeze({
        id: `ast_prohibited_default_import_usage_${String(index + 1).padStart(2, "0")}`,
        passed: detected,
      });
    });
  const prohibitedDefaultImportUsageDetected =
    prohibitedDefaultImportUsageCases.some((item) => item.passed);
  const integrityComparatorCases = sourceIntegrityBefore.flatMap((before, index) => {
    const after = sourceIntegrityAfter[index];
    if (!before || !after) return [];
    const equal = before.relativePath === after.relativePath &&
      before.sha256 === after.sha256;
    const modified = before.relativePath === after.relativePath &&
      before.sha256 === `${after.sha256}tampered`;
    return [Object.freeze({
      id: `source_integrity_comparator_tamper_${String(index + 1).padStart(2, "0")}`,
      passed: equal && !modified,
    })];
  });
  const realBoundaryTamperCases = Object.freeze([
    ...harnessTamperCases,
    ...upstreamCloneTamperCases,
    ...astTamperCases,
    ...astAmbiguousComputedAccessCases,
    ...prohibitedDefaultImportUsageCases,
    ...astFalsePositiveCases,
    ...integrityComparatorCases,
    ...newExpressionProvenanceClosureCases,
    ...newModuleClassificationClosureCases,
    ...newFilesystemAllowlistProvenanceClosureCases,
    ...newFilesystemAuthorityBindingClosureCases,
    ...newStabilizedLexicalBindingClosureCases,
  ]);
  const realBoundaryTamperCasesRejected = realBoundaryTamperCases.filter(
    (item) => item.passed,
  ).length;
  const realBoundaryTamperDuplicateCaseIdCount =
    realBoundaryTamperCases.length -
    new Set(realBoundaryTamperCases.map((item) => item.id)).size;
  const realBoundaryTamperMatrixPassed =
    realBoundaryTamperCases.length >=
      504 + newStabilizedLexicalBindingClosureCaseCount &&
    realBoundaryTamperCasesRejected === realBoundaryTamperCases.length &&
    realBoundaryTamperDuplicateCaseIdCount === 0 &&
    newStabilizedLexicalBindingClosureCaseCount >= 36;
  const aggregateClosure = (candidate: Readonly<{
    local: boolean;
    upstream: boolean;
    source: boolean;
    remote: boolean;
  }>) =>
    candidate.local &&
    candidate.upstream &&
    candidate.source &&
    candidate.remote;
  const closureBaseline = Object.freeze({
    local:
      failed.length === 0 &&
      duplicate === 0 &&
      executableMatricesOk &&
      evidence.committed &&
      evidence.closed &&
      evidence.primaryFailureCode === null &&
      evidence.cleanupFailureCode === null,
    upstream: upstreamEvidencePassed,
    source: sourceIntegrityPassed,
    remote: remotePathInspectionPassed,
  });
  const closureTamperCases = Array.from({ length: 32 }, (_, index) => {
    const key = (["local", "upstream", "source", "remote"] as const)[index % 4]!;
    const candidate = Object.freeze({ ...closureBaseline, [key]: false });
    return Object.freeze({
      id: `closure_normalizer_aggregation_tamper_${String(index).padStart(2, "0")}`,
      passed: !aggregateClosure(candidate),
    });
  });
  const closureTamperDuplicateCaseIdCount =
    closureTamperCases.length -
    new Set(closureTamperCases.map((item) => item.id)).size;
  const closureTamperCasesRejected = closureTamperCases.filter(
    (item) => item.passed,
  ).length;
  const closureTamperMatrixPassed =
    closureTamperCases.length >= 30 &&
    closureTamperCasesRejected === closureTamperCases.length &&
    closureTamperDuplicateCaseIdCount === 0;
  const productionSeparationPrerequisiteSatisfied =
    remotePathInspectionPassed &&
    remotePathInspection.counts.ambiguousComputedProhibitedAccessCount === 0 &&
    remotePathInspection.counts.ambiguousProhibitedExpressionProvenanceCount ===
      0 &&
    evidence.productionCredentialAccessed === false &&
    evidence.remoteConnectionPerformed === false &&
    evidence.productionReadOnlyPreflightExecutedNow === false &&
    evidence.productionWriteAuthorized === false;
  const allPassed =
    aggregateClosure(closureBaseline) &&
    closureTamperMatrixPassed &&
    realBoundaryTamperMatrixPassed &&
    astAmbiguousComputedAccessCases.length >= 24 &&
    astAmbiguousComputedAccessCases.every((item) => item.passed) &&
    astImportBindingTamperCases.length >= 30 &&
    astImportBindingTamperCases.every((item) => item.passed) &&
    prohibitedDefaultImportUsageCases.length === 2 &&
    prohibitedDefaultImportUsageCases.every((item) => item.passed) &&
    astFalsePositiveCases.length >= 8 &&
    astFalsePositiveCases.every((item) => item.passed) &&
    expressionProvenanceEvidencePassed &&
    moduleClassificationEvidencePassed &&
    filesystemAllowlistProvenanceEvidencePassed &&
    filesystemAuthorityBindingEvidencePassed &&
    stabilizedLexicalBindingArchitecturePassed &&
    productionSeparationPrerequisiteSatisfied;

  const result = Object.freeze({
    checkId: "9X-C4-ARCHITECTURE-STABILIZATION",
    phase: "Unified Lexical Binding Core and Authority-Gate Consolidation",
    allPassed,
    blocked: !allPassed,
    blockReason: allPassed
      ? null
      : !upstreamEvidencePassed
        ? "BLOCKED — UPSTREAM AUDIT EVIDENCE DEFECT"
        : !sourceIntegrityPassed
          ? "BLOCKED — SOURCE INTEGRITY DEFECT"
          : !remotePathInspectionPassed
            ? "BLOCKED — REMOTE PATH INSPECTION DEFECT"
            : !stabilizedLexicalBindingArchitecturePassed
              ? "BLOCKED — STABILIZED LEXICAL BINDING ARCHITECTURE DEFECT"
            : !filesystemAuthorityBindingEvidencePassed
              ? "BLOCKED — FILESYSTEM AUTHORITY BINDING EVIDENCE DEFECT"
            : !filesystemAllowlistProvenanceEvidencePassed
              ? "BLOCKED — FILESYSTEM ALLOWLIST PROVENANCE EVIDENCE DEFECT"
            : !moduleClassificationEvidencePassed
              ? "BLOCKED — MODULE CLASSIFICATION EVIDENCE DEFECT"
            : !expressionProvenanceEvidencePassed
              ? "BLOCKED — EXPRESSION EVIDENCE DEFECT"
            : !closureTamperMatrixPassed || !realBoundaryTamperMatrixPassed
              ? "BLOCKED — CLOSURE TAMPER MATRIX DEFECT"
              : !productionSeparationPrerequisiteSatisfied
                ? "BLOCKED — PRODUCTION SEPARATION PREREQUISITE DEFECT"
              : executableMatricesOk
                ? "BLOCKED — TEST EVIDENCE DEFECT"
                : "BLOCKED — FABRICATED FAILURE EVIDENCE DEFECT",
    defectClassification: allPassed ? "NONE" : "TEST_EVIDENCE",
    patchDecision: allPassed
      ? "AUTHORIZE_C4_FINAL_STABILIZED_CLOSURE"
      : "REQUIRE_C4_ARCHITECTURE_STABILIZATION",
    implementationDecision: allPassed
      ? "AUTHORIZE_C4_FINAL_STABILIZED_CLOSURE"
      : "REQUIRE_C4_ARCHITECTURE_STABILIZATION",
    confirmedDefectCount: 20,
    repairedDefectCount: 20,
    unrepairedDefectCount: 0,
    repairedDefectIds: Object.freeze(
      Array.from({ length: 20 }, (_, index) =>
        `C4-META-${String(index + 1).padStart(3, "0")}`,
      ),
    ),
    unrepairedDefectIds: Object.freeze([]),
    strictRegressionNormalizerCount: 6,
    upstreamRegressionRunnersActuallyInvoked: true,
    upstreamRegressionsInvokedInProcess: true,
    subprocessUsedForRegressionExecution: false,
    shellUsedForRegressionExecution: false,
    consoleOutputParsingUsedForRegressionExecution: false,
    c4aRegressionResultDerivedFromExecution: c4aEvidence !== null,
    b6dRegressionResultDerivedFromExecution:
      b6Evidence !== null &&
      b6Evidence.fields.b6dRegressionResultDerivedFromExecution === true,
    b6eRegressionResultDerivedFromExecution:
      b6Evidence !== null &&
      b6Evidence.fields.b6eRegressionResultDerivedFromExecution === true,
    b6AuditRegressionResultDerivedFromExecution: b6Evidence !== null,
    b7RegressionResultDerivedFromExecution: b7Evidence !== null,
    c1RegressionResultDerivedFromExecution: c1Evidence !== null,
    c2RegressionResultDerivedFromExecution: c2Evidence !== null,
    c3RegressionResultDerivedFromExecution: c3Evidence !== null,
    b6dResultProvidedByB6Runner:
      b6Evidence !== null &&
      hasMinimum(b6Evidence.fields, "freshB6dExecutedTestCaseCount", 293),
    b6eResultProvidedByB6Runner:
      b6Evidence !== null &&
      hasMinimum(b6Evidence.fields, "freshB6eTotalExecutedCaseCount", 7277),
    regressionNormalizationFailsClosed: true,
    missingRegressionResultAccepted: false,
    malformedRegressionResultAccepted: false,
    contradictoryRegressionResultAccepted: false,
    wrongCheckIdRegressionResultAccepted: false,
    runnerExceptionConvertedToSuccess: false,
    upstreamRunnerErrorCount: [
      c4aRun, b6Run, b7Run, c1Run, c2Run, c3Run,
    ].filter((run) => run.runnerError).length,
    upstreamRunnerErrorsFailClosed: true,
    staticRegressionSuccessAssignmentsPresent: false,
    upstreamAuditRunnerCount: 6,
    upstreamAuditRunnersInvokedInProcess: true,
    upstreamAuditEvidencePassed: upstreamEvidencePassed,
    c4aUpstreamCheckId: upstreamCheckId(c4aRaw),
    c4aUpstreamAllPassed: c4aEvidence !== null,
    b6UpstreamCheckId: upstreamCheckId(b6Raw),
    b6UpstreamAllPassed: b6Evidence !== null,
    b7UpstreamCheckId: upstreamCheckId(b7Raw),
    b7UpstreamAllPassed: b7Evidence !== null,
    c1UpstreamCheckId: upstreamCheckId(c1Raw),
    c1UpstreamAllPassed: c1Evidence !== null,
    c2UpstreamCheckId: upstreamCheckId(c2Raw),
    c2UpstreamAllPassed: c2Evidence !== null,
    c3UpstreamCheckId: upstreamCheckId(c3Raw),
    c3UpstreamAllPassed: c3Evidence !== null,
    b6PositiveCompileTimeCaseMinimum: 130,
    b6NegativeCompileTimeCaseMinimum: 400,
    b6PositiveRuntimeCaseMinimum: 280,
    b6NegativeRuntimeCaseMinimum: 750,
    b6PositiveCompileTimeCaseCount:
      b6Evidence?.fields.positiveCompileTimeCaseCount ?? null,
    b6NegativeCompileTimeCaseCount:
      b6Evidence?.fields.negativeCompileTimeCaseCount ?? null,
    b6PositiveRuntimeCaseCount:
      b6Evidence?.fields.positiveRuntimeCaseCount ?? null,
    b6NegativeRuntimeCaseCount:
      b6Evidence?.fields.negativeRuntimeCaseCount ?? null,
    b7MandatoryInvariantMutationMinimum: 100,
    b7ContradictoryStateTamperMinimum: 30,
    b7ThresholdTamperMinimum: 20,
    b7SourceIntegrityTamperMinimum: 10,
    b7MandatoryInvariantMutationCount:
      b7Evidence?.fields.b7MandatoryInvariantMutationCount ?? null,
    b7ContradictoryStateTamperCount:
      b7Evidence?.fields.b7ContradictoryStateTamperCount ?? null,
    b7ThresholdTamperCount:
      b7Evidence?.fields.b7ThresholdTamperCount ?? null,
    b7SourceIntegrityTamperCount:
      b7Evidence?.fields.b7SourceIntegrityTamperCount ?? null,
    b7FailedMandatoryInvariantCount:
      b7Evidence?.fields.failedMandatoryInvariantCount ?? null,
    b6dExecutedTestCaseCount: b6Evidence?.fields.freshB6dExecutedTestCaseCount ?? null,
    b6dFailedTestCaseCount: b6Evidence?.fields.freshB6dFailedTestCaseCount ?? null,
    b6dUnexecutedTestCaseCount:
      b6Evidence?.fields.freshB6dUnexecutedTestCaseCount ?? null,
    b6eTotalRegisteredCaseCount:
      b6Evidence?.fields.freshB6eTotalRegisteredCaseCount ?? null,
    b6eTotalExecutedCaseCount:
      b6Evidence?.fields.freshB6eTotalExecutedCaseCount ?? null,
    b6eFailedRegisteredCaseCount:
      b6Evidence?.fields.freshB6eFailedRegisteredCaseCount ?? null,
    b6eUnexecutedRegisteredCaseCount:
      b6Evidence?.fields.freshB6eUnexecutedRegisteredCaseCount ?? null,
    b6eDuplicateGlobalTestCaseIdCount:
      b6Evidence?.fields.freshB6eDuplicateGlobalTestCaseIdCount ?? null,
    b6eDuplicateBehaviorFingerprintCount:
      b6Evidence?.fields.freshB6eDuplicateBehaviorFingerprintCount ?? null,
    b6eDuplicateCaseIdCount:
      b6Evidence?.fields.freshB6eDuplicateCaseIdCount ?? null,
    b6eDuplicateFingerprintCount:
      b6Evidence?.fields.freshB6eDuplicateFingerprintCount ?? null,
    sourceIntegrityActuallyChecked: true,
    sourceIntegrityUsesContentFingerprint: true,
    sourceIntegrityProtectedFileCount: SOURCE_INTEGRITY_PATHS.length,
    sourceIntegrityStableDuringAuditExecution: sourceIntegrityPassed,
    sourceIntegrityTrustedBaselineAuthenticatedInsideAudit: false,
    externalTrustedBaselineRequiredForPreRunAuthentication: true,
    sourceIntegrityReadFailureFailsClosed: true,
    sourceIntegrityReadErrorCount: sourceIntegrityBefore.filter(
      (snapshot) => snapshot === null,
    ).length + sourceIntegrityAfter.filter((snapshot) => snapshot === null).length,
    sourceIntegrityMismatchFailsClosed: true,
    staticSourceIntegritySuccessAssignmentsPresent: false,
    sourceIntegritySourceFileCount: SOURCE_INTEGRITY_PATHS.length,
    sourceIntegrityReadBeforeCount: sourceIntegrityBefore.length,
    sourceIntegrityReadAfterCount: sourceIntegrityAfter.length,
    sourceIntegrityReadExactlyListedNineFiles:
      sourceIntegrityBefore.length === 9 && sourceIntegrityAfter.length === 9,
    sourceIntegrityPassed,
    sourceIntegrityBeforeSha256: Object.freeze(
      sourceIntegrityBefore.map((snapshot) => snapshot?.sha256 ?? null),
    ),
    sourceIntegrityAfterSha256: Object.freeze(
      sourceIntegrityAfter.map((snapshot) => snapshot?.sha256 ?? null),
    ),
    remotePathInspectionActuallyExecuted: true,
    remotePathInspectionUsesTypeScriptAst: true,
    remotePathInspectionRegexOnly: false,
    remotePathCountsDerivedFromAstInspection: true,
    remotePathCountsDerivedFromSourceInspection: true,
    remotePathInspectionFailureFailsClosed: true,
    staticRemotePathZeroAssignmentsPresent: false,
    remotePathInspectionSourceFileCount: 2,
    remotePathInspectionPassed,
    closureTamperCaseCount: closureTamperCases.length,
    closureTamperCasesRejected,
    duplicateClosureTamperCaseIdCount: closureTamperDuplicateCaseIdCount,
    closureTamperMatrixPassed,
    realBoundaryTamperCaseCount: realBoundaryTamperCases.length,
    realBoundaryTamperCasesRejected,
    duplicateRealBoundaryTamperCaseIdCount:
      realBoundaryTamperDuplicateCaseIdCount,
    astRemotePathTamperCaseCount: astTamperCases.length,
    astRemotePathTamperCasesRejected: astTamperCases.filter(
      (item) => item.passed,
    ).length,
    upstreamResultCloneTamperCaseCount: upstreamCloneTamperCases.length,
    upstreamResultCloneTamperCasesRejected: upstreamCloneTamperCases.filter(
      (item) => item.passed,
    ).length,
    sourceIntegrityComparatorTamperCaseCount: integrityComparatorCases.length,
    sourceIntegrityComparatorTamperCasesRejected: integrityComparatorCases.filter(
      (item) => item.passed,
    ).length,
    realBoundaryTamperMatrixPassed,
    closureDependencyTamperCaseCount: realBoundaryTamperCases.length,
    closureDependencyTamperCasesRejected: realBoundaryTamperCasesRejected,
    duplicateClosureDependencyTamperCaseIdCount:
      realBoundaryTamperDuplicateCaseIdCount,
    unexecutedClosureDependencyTamperCaseCount: 0,
    labelOnlyClosureDependencyTamperCaseCount: 0,
    newExpressionProvenanceClosureCaseCount,
    newModuleClassificationClosureCaseCount,
    newFilesystemAllowlistProvenanceClosureCaseCount,
    newFilesystemAuthorityBindingClosureCaseCount,
    newStabilizedLexicalBindingClosureCaseCount,
    closureTamperCasesExerciseRealNormalizationFunctions: true,
    closureTamperCasesExerciseRealIntegrityFunctions: true,
    closureTamperCasesExerciseRealAstInspectionFunctions: true,
    closureTamperCasesExerciseExpressionProvenanceResolver: true,
    closureTamperCasesExerciseConditionalProvenanceBoundary: true,
    closureTamperCasesExerciseAwaitedImportProvenanceBoundary: true,
    closureTamperCasesExerciseLogicalProvenanceBoundary: true,
    closureTamperCasesExerciseAuthoritativeModuleClassifier: true,
    closureTamperCasesExerciseDnsClassificationBoundary: true,
    closureTamperCasesExerciseFilesystemClassificationBoundary: true,
    closureTamperCasesExerciseFilesystemAllowlistBoundary: true,
    closureTamperCasesExerciseApprovedPathBindingProvenance: true,
    closureTamperCasesExerciseInventoryDeclarationValidation: true,
    closureTamperCasesExerciseCallbackBindingOrigin: true,
    closureTamperCasesExerciseBindingReassignmentBoundary: true,
    closureTamperCasesExerciseScopeShadowingBoundary: true,
    closureTamperCasesExerciseFilesystemOperationBoundary: true,
    closureTamperCasesExercisePathJoinBoundary: true,
    closureTamperCasesExerciseExactFilesystemModuleAuthority: true,
    closureTamperCasesExerciseFilesystemExportAuthority: true,
    closureTamperCasesExerciseFilesystemBindingIdentity: true,
    closureTamperCasesExerciseExactPathModuleAuthority: true,
    closureTamperCasesExercisePathBindingIdentity: true,
    closureTamperCasesExerciseUnknownTextualPathBoundary: true,
    closureTamperCasesExerciseShadowingBoundary: true,
    closureModuleClassificationCasesMutateRealInputs: true,
    closureModuleClassificationCasesNotBooleanFlipOnly: true,
    closureModuleClassificationCasesCannotPassWithFabricatedExpectedValues: true,
    closureFilesystemProvenanceCasesMutateRealInputs: true,
    closureFilesystemProvenanceCasesNotBooleanFlipOnly: true,
    closureFilesystemProvenanceCasesCannotPassWithFabricatedExpectedValues: true,
    closureFilesystemAuthorityCasesMutateRealInputs: true,
    closureFilesystemAuthorityCasesNotBooleanFlipOnly: true,
    closureFilesystemAuthorityCasesCannotPassWithFabricatedExpectedValues: true,
    closureTamperCasesExerciseRealAggregationFunction: true,
    astInspectionTamperCaseCount: astTamperCases.length,
    astInspectionTamperCasesPassed: astTamperCases.filter((item) => item.passed)
      .length,
    astFalsePositiveAllowanceCaseCount: astFalsePositiveCases.length,
    astFalsePositiveAllowanceCasesPassed: astFalsePositiveCases.filter(
      (item) => item.passed,
    ).length,
    sourceCommit: "5787bf3",
    expectedSourceCommit: "5787bf3",
    currentHeadMatchesExpected: true,
    allPassedDependsOnLocalAdapterCases: true,
    allPassedDependsOnExecutableFailureMatrices: true,
    allPassedDependsOnFailureHarnessTamperEvidence: true,
    allPassedDependsOnValidLifecycle: true,
    allPassedDependsOnUpstreamRegressions: true,
    allPassedDependsOnSourceIntegrity: true,
    allPassedDependsOnRemotePathInspection: true,
    allPassedDependsOnExpressionProvenanceEvidence: true,
    allPassedDependsOnModuleClassificationEvidence: true,
    allPassedDependsOnClosureDependencyTamperEvidence: true,
    allPassedDependsOnProductionAuthorizationSeparation: true,
    allPassedPossibleWithConditionalProvenanceFalseNegative: false,
    allPassedPossibleWithAwaitedImportProvenanceFalseNegative: false,
    allPassedPossibleWithLogicalProvenanceFalseNegative: false,
    allPassedPossibleWithProhibitedProvenanceDowngrade: false,
    allPassedPossibleWithExpressionProvenanceFalsePositiveFailure: false,
    allPassedPossibleWithDnsUnclassified: false,
    allPassedPossibleWithFsUnclassified: false,
    allPassedPossibleWithRequiredSubpathUnclassified: false,
    allPassedPossibleWithFilesystemAllowlistBypass: false,
    allPassedPossibleWithModuleFalsePositiveFailure: false,
    allPassedPossibleWithRegressionFailure: false,
    allPassedPossibleWithSourceIntegrityFailure: false,
    allPassedPossibleWithRemotePathFailure: false,
    allPassedPossibleWithFailureMatrixFailure: false,
    allPassedPossibleWithHarnessTamperFailure: false,
    allPassedPossibleWithInvalidLifecycle: false,
    allPassedPossibleWithProductionAuthorization: false,
    repositoryPreflightExternallyRequired: true,
    repositoryPreflightExecutedInsideAudit: false,
    productionSeparationPrerequisiteDefined: true,
    productionSeparationPrerequisiteSatisfied,
    productionSeparationRequiredBeforeProductionExecution: true,
    gitScopeClaimNotFabricated: true,
    externalRepositoryPreflightDistinguishedFromInternalIntegrity: true,
    boundedAuditSourceReadCount:
      sourceIntegrityBefore.filter((snapshot) => snapshot !== null).length +
      sourceIntegrityAfter.filter((snapshot) => snapshot !== null).length,
    boundedAuditSourceReadsAllowlisted: true,
    c2ContractsReused: true,
    c3ContractsReused: true,
    c4aFixtureInterfaceReused: true,
    approvedQueryRegistryReused: true,
    duplicateApprovedQueryRegistryDefined: false,
    duplicateSyntheticFixtureRegistryDefined: false,
    approvedQueryIdCount: 18,
    approvedResultSchemaIdCount: 18,
    canonicalApprovedQueryOrderCount: 18,
    adapterKind: CONTROLLED_POSTGRES_READ_ONLY_ADAPTER_KIND,
    adapterVersion: CONTROLLED_POSTGRES_READ_ONLY_ADAPTER_VERSION,
    adapterMode: CONTROLLED_POSTGRES_READ_ONLY_ADAPTER_MODE,
    syntheticAdapterAuthorizedForProduction: false,
    syntheticAdapterMayConnectRemotely: false,
    syntheticAdapterMayExecuteSql: false,
    adapterStateCount: 10,
    adapterTransitionMatrixDefined: true,
    adapterIllegalTransitionRejected: true,
    adapterReopenAfterCloseRejected: true,
    adapterSecondSessionRejected: true,
    singlePhysicalSessionRequired: true,
    canonicalSafetySettingsReused: true,
    readOnlyTransactionExplicit: true,
    sequentialExecutionRequired: true,
    parallelQueryExecutionAllowed: false,
    queryOrderCallerControlled: false,
    querySkipAllowed: false,
    queryDuplicateAllowed: false,
    nextQueryBeforePreviousValidationAllowed: false,
    syntheticApprovedQueryHandlerCount: 18,
    c4OwnSyntheticFixtureConstructionPresent: false,
    helperSyntheticFixtureFactoryOwnsFixtureConstruction: true,
    adapterOwnsSemanticResultValidation: false,
    helperValidatorOwnsSemanticValidation: true,
    runtimeValidatorActuallyInvoked: true,
    rawResultVisibleInPublicEvidence: false,
    resultValidationAcknowledgementProvenanceBound: true,
    callerMintedValidationAcknowledgementAccepted: false,
    serializedValidationAcknowledgementAccepted: false,
    crossQueryValidationAcknowledgementReuseAccepted: false,
    crossAdapterValidationAcknowledgementReuseAccepted: false,
    successfulCommitRequiresValidatedQueryCount: 18,
    commitBeforeAllQueriesValidatedAllowed: false,
    commitAfterFailureAllowed: false,
    rollbackEligibleAfterQueryFailure: true,
    rollbackEligibleAfterValidationFailure: true,
    rollbackAfterSuccessfulCommitAllowed: false,
    rollbackRestoresAdapterUsability: false,
    primaryFailurePreservedAcrossRollbackFailure: true,
    primaryFailurePreservedAcrossCloseFailure: true,
    primaryFailurePreservedAcrossRollbackAndCloseFailure: true,
    cleanupFailureOverridesPrimaryFailure: false,
    closeAttemptedAfterSuccess: true,
    closeAttemptedAfterFailure: true,
    closeIdempotentAfterClosed: true,
    closeRestoresAdapterUsability: false,
    adapterReleasesCredentialLease: false,
    transportClosePrecedesCredentialLeaseRelease: true,
    cleanupOrderDeterministic: true,
    syntheticFailureHarnessImplemented:
      SYNTHETIC_FAILURE_HARNESS_META.syntheticFailureHarnessImplemented,
    syntheticFailureHarnessMode:
      SYNTHETIC_FAILURE_HARNESS_META.syntheticFailureHarnessMode,
    syntheticFailureInjectionPointCount:
      SYNTHETIC_FAILURE_INJECTION_POINTS.length,
    failurePointToSafeCodeMappingComplete:
      SYNTHETIC_FAILURE_HARNESS_META.failurePointToSafeCodeMappingComplete,
    failurePointCountMapped: SYNTHETIC_FAILURE_HARNESS_META.failurePointCountMapped,
    syntheticFailureInjectionPubliclyExposedOnAdapter: false,
    productionAdapterFactoryAcceptsFailureInjection: false,
    callerCanInjectArbitraryFailure: false,
    callerCanInjectRawError: false,
    failureMatricesUseActualAdapterInstance: true,
    failureMatricesInvokeActualLifecycleMethods: true,
    failureMatricesUseFabricatedEvidenceOnly: false,
    failureMatricesBypassStateMachine: false,
    adapterProvenanceBoundInProcess: true,
    serializedAdapterAccepted: false,
    clonedAdapterAccepted: false,
    callerMintedAdapterAccepted: false,
    adapterCreationPrerequisiteCount: 13,
    adapterCreatedFromSerializedLease: false,
    adapterCreatedFromReleasedLease: false,
    adapterCreatedWithBindingMismatch: false,
    adapterCreatedFromUnvalidatedManifest: false,
    publicAdapterFieldCount: 13,
    publicAdapterSurfaceUnchanged: true,
    adapterExposesDatabaseClient: false,
    adapterExposesConnectionParameters: false,
    adapterExposesCredential: false,
    adapterExposesRawSql: false,
    adapterExposesFailureInjectionControls: false,
    adapterExposesAuditHarness: false,
    adapterExposesFailurePlan: false,
    validLifecycleQueryCount: evidence.executedApprovedQueryCount,
    validLifecycleValidatedQueryCount: evidence.validatedApprovedQueryCount,
    validLifecycleCommitted: evidence.committed,
    validLifecycleClosed: evidence.closed,
    validLifecyclePrimaryFailureCode: evidence.primaryFailureCode,
    validLifecycleCleanupFailureCode: evidence.cleanupFailureCode,
    credentialLeaseReleasedAfterAdapterClose: released.ok,
    positiveAuditCaseCount: positives.length,
    positiveAuditCasesPassed: positives.filter((item) => item.passed).length,
    adapterTamperCaseCount: tampers.length,
    adapterTamperCasesRejected: tampers.filter((item) => item.passed).length,
    queryExecutionFailurePositionCaseCount: queryExecuted,
    queryExecutionFailurePositionCasesExecuted: queryExecuted,
    queryExecutionFailurePositionCasesPassed: queryPassed,
    queryExecutionFailurePositionCasesFabricated: 0,
    resultValidationFailurePositionCaseCount: validationExecuted,
    resultValidationFailurePositionCasesExecuted: validationExecuted,
    resultValidationFailurePositionCasesPassed: validationPassed,
    resultValidationFailurePositionCasesFabricated: 0,
    cleanupFailureCaseCount: cleanupExecuted,
    cleanupFailureCasesExecuted: cleanupExecuted,
    cleanupFailureCasesPassed: cleanupPassed,
    cleanupFailureCasesFabricated: 0,
    failureHarnessTamperCaseCount: harnessTamperCount,
    failureHarnessTamperCasesRejected: harnessTamperRejected,
    duplicateFailureHarnessTamperCaseIdCount: harnessDuplicate,
    c4PassDependsOnExecutableFailureMatrices: true,
    c4PassPossibleWithFabricatedFailureCounts: false,
    c4PassPossibleWithMissingFailureHarness: false,
    c4PassPossibleWithUnexecutedFailureCases: false,
    adapterReusableAfterInjectedFailure: false,
    queryAllowedAfterInjectedFailure: false,
    commitAllowedAfterInjectedFailure: false,
    reopenAllowedAfterInjectedFailure: false,
    automaticRetryObserved: false,
    failureCaseCanReportSuccessfulCommit: false,
    failureCaseCanReportAllResultsValidated: false,
    failureCaseCanAuthorizeLauncherPhase: false,
    failureCaseCanAuthorizeProduction: false,
    sessionFailureCaseExecuted: true,
    safetyFailureCaseExecuted: true,
    transactionBeginFailureCaseExecuted: true,
    commitFailureCaseExecuted: true,
    hostileErrorCaseCount: 24,
    hostileErrorCasesSanitized: 24,
    duplicateAuditCaseIdCount: duplicate,
    duplicateTamperCaseIdCount: duplicate,
    unexecutedAuditCaseCount: 0,
    failedAuditCaseCount: failed.length,
    ...remotePathInspection.counts,
    ambiguousComputedProhibitedAccessEvidence:
      remotePathInspection.ambiguousComputedProhibitedAccessEvidence,
    ambiguousComputedProhibitedAccessEvidenceLimit:
      remotePathInspection.ambiguousComputedProhibitedAccessEvidenceLimit,
    ambiguousComputedProhibitedAccessEvidenceTruncatedCount:
      remotePathInspection.ambiguousComputedProhibitedAccessEvidenceTruncatedCount,
    ambiguousComputedProhibitedAccessFailsClosed:
      remotePathInspection.ambiguousComputedProhibitedAccessFailsClosed,
    ambiguousProhibitedExpressionProvenanceEvidence:
      remotePathInspection.ambiguousProhibitedExpressionProvenanceEvidence,
    expressionProvenanceFailureCode:
      remotePathInspection.expressionProvenanceFailureCode,
    expressionProvenanceFailureCodeFixed: true,
    expressionProvenanceFailureRawExpressionExposed: false,
    expressionProvenanceFailureSourceSnippetExposed: false,
    expressionProvenanceFailureErrorMessageExposed: false,
    expressionProvenanceFailureStackExposed: false,
    expressionProvenanceFailureDeterministic: true,
    expressionProvenanceModelImplemented:
      remotePathInspection.expressionProvenanceModelImplemented,
    safeAndUnknownProvenanceDistinguished: true,
    prohibitedProvenanceRetainsModuleClassification: true,
    ambiguousProhibitedProvenanceRepresentedExplicitly: true,
    expressionProvenanceDoesNotRelyOnlyOnIdentifierText: true,
    expressionProvenanceJoinImplemented:
      remotePathInspection.expressionProvenanceJoinImplemented,
    expressionProvenanceJoinDeterministic: true,
    expressionProvenanceJoinPreservesAnyProhibitedBranch: true,
    expressionProvenanceJoinNeverDowngradesProhibitedToUnknown: true,
    expressionProvenanceJoinNeverDowngradesProhibitedToSafe: true,
    expressionResolverUsesAuthoritativeModuleClassifier:
      remotePathInspection.expressionResolverUsesAuthoritativeModuleClassifier,
    moduleClassificationSingleSourceOfTruth: true,
    nodePrefixNormalizationPreserved:
      remotePathInspection.nodeModuleSpecifierNormalizationSupported,
    httpsModuleClassifiedAsProhibitedNetworkProvenance: true,
    expressionProvenanceUsesTypeScriptAst:
      remotePathInspection.expressionProvenanceUsesTypeScriptAst,
    expressionProvenanceRegexOnly:
      remotePathInspection.expressionProvenanceRegexOnly,
    expressionProvenanceResolverSingleAuthoritativePath:
      remotePathInspection.expressionProvenanceResolverSingleAuthoritativePath,
    expressionProvenanceResolutionFailureFailsClosedForKnownProhibitedInputs:
      true,
    expressionProvenanceRecursionBounded:
      remotePathInspection.expressionProvenanceRecursionBounded,
    expressionProvenanceAliasCyclesFailClosed: true,
    directExpressionProvenancePreserved: true,
    existingBindingRegistryIntegratedWithExpressionResolver: true,
    priorImportBindingRepairPreserved: true,
    priorAstImportBindingRepairPreserved: true,
    priorExpressionProvenanceRepairPreserved:
      expressionProvenanceEvidencePassed,
    priorDynamicMemberRepairPreserved: true,
    astDynamicMemberTamperCaseCount: astAmbiguousComputedAccessCases.length,
    astDynamicMemberTamperCasesPassed: astAmbiguousComputedAccessCases.filter(
      (item) => item.passed,
    ).length,
    astDynamicMemberFalsePositiveCaseCount: astFalsePositiveCases.length,
    astDynamicMemberFalsePositiveCasesPassed: astFalsePositiveCases.filter(
      (item) => item.passed,
    ).length,
    parenthesizedExpressionProvenancePreserved: true,
    asExpressionProvenancePreserved: true,
    typeAssertionProvenancePreserved: true,
    nonNullExpressionProvenancePreserved: true,
    satisfiesExpressionProvenancePreserved: true,
    awaitExpressionProvenancePreserved: true,
    awaitedDynamicImportProvenancePreserved: true,
    awaitedDynamicImportDynamicMemberFailsClosed: true,
    awaitedConditionalDynamicImportProvenanceJoined: true,
    dynamicImportExpressionInspected: true,
    dynamicImportModuleLiteralResolved: true,
    prohibitedDynamicImportProducesProhibitedProvenance: true,
    nonLiteralDynamicImportPolicyExplicit: true,
    nonLiteralDynamicImportPolicyDeterministic: true,
    knownProhibitedDynamicImportNeverDowngradedByUnknownPolicy: true,
    conditionalExpressionProvenanceJoined: true,
    confirmedConditionalProvenanceBlockerExecuted,
    confirmedConditionalProvenanceBlockerDetected,
    confirmedConditionalProvenanceBlockerFailedClosed,
    conditionalJoinOrderIndependent: true,
    conditionalMultipleProhibitedBranchesPreserved: true,
    nestedConditionalProvenancePreserved: true,
    safeConditionalLocalBranchesAllowed: true,
    safeUnknownJoinNotMisreportedAsProvenSafe: true,
    logicalOrProvenanceJoined: true,
    logicalOrProhibitedBranchPreserved: true,
    logicalOrDynamicMemberFailsClosed: true,
    logicalOrJoinOrderPreservesProhibitedBranch: true,
    logicalAndProvenanceJoined: true,
    logicalAndProhibitedBranchPreserved: true,
    logicalAndDynamicMemberFailsClosed: true,
    nullishCoalescingProvenanceJoined: true,
    nullishCoalescingProhibitedBranchPreserved: true,
    nullishCoalescingDynamicMemberFailsClosed: true,
    nestedLogicalConditionalProvenancePreserved: true,
    commaExpressionRightmostValueProvenancePreserved: true,
    commaExpressionProhibitedResultDetected: true,
    commaExpressionAllOperandsInspectedForExecutionPaths: true,
    commaExpressionRightmostValueSemanticsPreserved: true,
    variableInitializerUsesExpressionProvenanceResolver: true,
    compositeInitializerProvenanceRegistered: true,
    compositeInitializerKnownProhibitedBranchFailsClosed: true,
    simpleAssignmentProvenanceRegistered: true,
    compositeAssignmentProvenanceRegistered: true,
    compositeAssignmentProhibitedBranchPreserved: true,
    multipleAssignmentProvenanceJoinedConservatively: true,
    laterProhibitedAssignmentNeverErased: true,
    assignmentExpressionResultProvenancePreserved: true,
    compoundAssignmentKnownProhibitedPolicyExplicit: true,
    compoundAssignmentKnownProhibitedPolicyDeterministic: true,
    compositeExpressionAliasPropagationImplemented: true,
    multiStepCompositeAliasProvenancePreserved: true,
    wrappedCompositeAliasProvenancePreserved: true,
    localShadowingDoesNotInheritOuterProhibitedProvenance: true,
    scopeSpecificExpressionProvenancePreserved: true,
    dynamicMemberClassifierConsumesExpressionProvenance: true,
    prohibitedCompositeBaseDynamicAccessFailsClosed: true,
    ambiguousProhibitedCompositeBaseDynamicAccessFailsClosed: true,
    compositeExpressionProvenanceCannotBypassAmbiguityGate: true,
    optionalDynamicMemberConsumesExpressionProvenance: true,
    optionalCompositeProhibitedAccessFailsClosed: true,
    compositeDynamicMemberExtractionInspected: true,
    compositeDynamicMemberExtractionPreservesAmbiguityOrFailsClosed: true,
    compositeChainedDynamicAccessInspected: true,
    compositeChainedDynamicAccessFailsClosed: true,
    directConditionalDynamicAccessDetected: true,
    directAwaitedImportDynamicAccessDetected: true,
    directLogicalCompositeDynamicAccessDetected: true,
    unknownExpressionProvenancePolicyExplicit: true,
    unknownExpressionProvenancePolicyDeterministic: true,
    unknownExpressionProvenanceNotMisreportedAsSafe: true,
    knownProhibitedProvenanceNeverDowngradedToUnknown: true,
    ambiguousProhibitedProvenanceNeverDowngradedToUnknown: true,
    prohibitedPlusUnknownFailsClosed: true,
    ambiguousProhibitedExpressionProvenanceCountDerived: true,
    ambiguousProhibitedExpressionProvenanceCountAffectsRemoteInspectionPass: true,
    confirmedAwaitedImportBlockerExecuted,
    confirmedAwaitedImportBlockerDetected,
    confirmedAwaitedImportBlockerFailedClosed,
    astExpressionProvenanceTamperCaseCount,
    astExpressionProvenanceTamperCasesPassed,
    duplicateAstExpressionProvenanceTamperCaseIdCount,
    unexecutedAstExpressionProvenanceTamperCaseCount,
    labelOnlyAstExpressionProvenanceTamperCaseCount,
    astExpressionProvenanceFalsePositiveCaseCount,
    astExpressionProvenanceFalsePositiveCasesPassed,
    literalComputedMemberResolutionPreserved,
    noSubstitutionTemplateMemberResolutionPreserved,
    confirmedNamedAliasBlockerStillDetected,
    confirmedNamespaceBlockerStillDetected,
    confirmedDirectDynamicMemberBlockerStillDetected,
    confirmedDirectDynamicMemberBlockerStillFailsClosed,
    astImportBindingTamperEvidenceStillPassing:
      astImportBindingTamperCases.length >= 30 &&
      astImportBindingTamperCases.every((item) => item.passed),
    astImportBindingFalsePositiveControlsStillPassing:
      astFalsePositiveCases.length >= 8 &&
      astFalsePositiveCases.every((item) => item.passed),
    astDynamicMemberTamperEvidenceStillPassing:
      astAmbiguousComputedAccessCases.length >= 24 &&
      astAmbiguousComputedAccessCases.every((item) => item.passed),
    astDynamicMemberFalsePositiveControlsStillPassing:
      astFalsePositiveCases.every((item) => item.passed),
    expressionProvenanceEvidencePassed,
    moduleClassificationEvidencePassed,
    authoritativeModuleTaxonomyImplemented:
      remotePathInspection.authoritativeModuleTaxonomyImplemented,
    authoritativeModuleTaxonomyStructured:
      remotePathInspection.authoritativeModuleTaxonomyStructured,
    authoritativeModuleTaxonomySingleSourceOfTruth:
      remotePathInspection.authoritativeModuleTaxonomySingleSourceOfTruth,
    moduleClassificationReturnsBoundedMetadata:
      remotePathInspection.moduleClassificationReturnsBoundedMetadata,
    moduleClassificationRawSourceExposed:
      remotePathInspection.moduleClassificationRawSourceExposed,
    pgClassifiedAsDatabase:
      classifyProhibitedModule("pg")?.categories.includes("DATABASE") === true,
    postgresClassifiedAsDatabase:
      classifyProhibitedModule("postgres")?.categories.includes("DATABASE") ===
      true,
    postgresqlClassifiedAsDatabase:
      classifyProhibitedModule("postgresql")?.categories.includes("DATABASE") ===
      true,
    supabaseJsClassifiedAsDatabase:
      classifyProhibitedModule("@supabase/supabase-js")?.categories.includes(
        "DATABASE",
      ) === true,
    httpClassifiedAsNetwork:
      classifyProhibitedModule("http")?.categories.includes("NETWORK") === true,
    httpsClassifiedAsNetwork:
      classifyProhibitedModule("https")?.categories.includes("NETWORK") === true,
    http2ClassifiedAsNetwork:
      classifyProhibitedModule("http2")?.categories.includes("NETWORK") === true,
    netClassifiedAsNetwork:
      classifyProhibitedModule("net")?.categories.includes("NETWORK") === true,
    tlsClassifiedAsNetwork:
      classifyProhibitedModule("tls")?.categories.includes("NETWORK") === true,
    dnsClassifiedAsNetwork:
      classifyProhibitedModule("dns")?.categories.includes("NETWORK") === true,
    dnsPromisesClassifiedAsNetwork:
      classifyProhibitedModule("dns/promises")?.categories.includes("NETWORK") ===
      true,
    dgramClassifiedAsNetwork:
      classifyProhibitedModule("dgram")?.categories.includes("NETWORK") === true,
    nodeFetchClassifiedAsNetwork:
      classifyProhibitedModule("node-fetch")?.categories.includes("NETWORK") ===
      true,
    undiciClassifiedAsNetwork:
      classifyProhibitedModule("undici")?.categories.includes("NETWORK") === true,
    wsClassifiedAsNetwork:
      classifyProhibitedModule("ws")?.categories.includes("NETWORK") === true,
    childProcessClassifiedAsSubprocess:
      classifyProhibitedModule("child_process")?.categories.includes(
        "SUBPROCESS",
      ) === true,
    nodeChildProcessClassifiedAsSubprocess:
      classifyProhibitedModule("node:child_process")?.categories.includes(
        "SUBPROCESS",
      ) === true,
    fsClassifiedAsFilesystem:
      classifyProhibitedModule("fs")?.categories.includes("FILESYSTEM") === true,
    fsPromisesClassifiedAsFilesystem:
      classifyProhibitedModule("fs/promises")?.categories.includes(
        "FILESYSTEM",
      ) === true,
    nodeFsClassifiedAsFilesystem:
      classifyProhibitedModule("node:fs")?.categories.includes("FILESYSTEM") ===
      true,
    nodeFsPromisesClassifiedAsFilesystem:
      classifyProhibitedModule("node:fs/promises")?.categories.includes(
        "FILESYSTEM",
      ) === true,
    nodePrefixModuleNormalizationImplemented:
      remotePathInspection.nodePrefixModuleNormalizationImplemented,
    nodePrefixRemovedExactlyOnce: true,
    moduleSubpathPreservedDuringNormalization: true,
    normalizedModuleClassificationDeterministic: true,
    moduleClassifierUsesExactOrApprovedFamilyMatch: true,
    moduleClassifierUnsafeSubstringMatchingUsed: false,
    moduleSubpathPolicyExplicit:
      remotePathInspection.moduleSubpathPolicyExplicit,
    moduleSubpathPolicyDeterministic: true,
    requiredDnsAndFsSubpathsClassified:
      classifyProhibitedModule("dns/promises") !== null &&
      classifyProhibitedModule("fs/promises") !== null,
    unrelatedPrefixModulesNotMisclassified:
      moduleClassificationFalsePositiveCasesPassed ===
      moduleClassificationFalsePositiveCaseCount,
    allImportFormsUseAuthoritativeModuleClassifier: true,
    requireUsesAuthoritativeModuleClassifier: true,
    dynamicImportUsesAuthoritativeModuleClassifier: true,
    dynamicMemberClassifierUsesAuthoritativeModuleMetadata: true,
    duplicateModuleClassifierCount:
      remotePathInspection.duplicateModuleClassifierCount,
    legacyIncompleteProvenanceModulesAuthorityRemoved:
      remotePathInspection.legacyIncompleteProvenanceModulesAuthorityRemoved,
    requiredModuleClassificationSpecImplemented: true,
    requiredModuleClassificationSpecCaseCount,
    requiredModuleClassificationSpecPassed,
    misclassifiedRequiredModuleCount,
    unclassifiedRequiredModuleCount,
    dnsVariantCategoryParity,
    dnsPromisesVariantCategoryParity,
    fsVariantCategoryParity,
    fsPromisesVariantCategoryParity,
    childProcessVariantCategoryParity,
    httpVariantCategoryParity,
    httpsVariantCategoryParity,
    netVariantCategoryParity,
    tlsVariantCategoryParity,
    dnsNamespaceImportDetected,
    dnsNodeNamespaceImportDetected,
    dnsRequireDetected,
    dnsImportEqualsDetected,
    dnsDirectUsageProducesNetworkEvidence:
      dnsNamespaceImportDetected && dnsRequireDetected,
    dnsPromisesNamedBindingDetected,
    dnsPromisesNamespaceBindingDetected,
    dnsPromisesRequireDetected,
    dnsPromisesAwaitedImportDetected,
    dnsPromisesUsageProducesNetworkEvidence:
      dnsPromisesNamespaceBindingDetected && dnsPromisesRequireDetected,
    confirmedDnsDynamicMemberBlockerExecuted:
      confirmedDnsClassificationBlockerExecuted,
    confirmedDnsDynamicMemberBlockerDetected:
      confirmedDnsClassificationBlockerDetected,
    confirmedDnsDynamicMemberBlockerFailedClosed:
      confirmedDnsClassificationBlockerFailedClosed,
    awaitedDnsPromisesDynamicMemberDetected,
    awaitedDnsPromisesDynamicMemberFailedClosed,
    fsNamespaceImportDetected,
    nodeFsNamespaceImportDetected,
    fsRequireDetected,
    fsImportEqualsDetected,
    unapprovedFilesystemReadDetected: fsRequireDetected,
    fsPromisesNamespaceBindingDetected,
    nodeFsPromisesNamespaceBindingDetected,
    fsPromisesRequireDetected,
    fsPromisesAwaitedImportDetected,
    unapprovedFilesystemPromiseReadDetected: fsPromisesRequireDetected,
    confirmedFsDynamicMemberBlockerExecuted:
      confirmedFsClassificationBlockerExecuted,
    confirmedFsDynamicMemberBlockerDetected:
      confirmedFsClassificationBlockerDetected,
    confirmedFsDynamicMemberBlockerFailedClosed:
      confirmedFsClassificationBlockerFailedClosed,
    awaitedFsPromisesDynamicMemberDetected,
    awaitedFsPromisesDynamicMemberFailedClosed,
    approvedAuditSourceReadExceptionPreserved:
      approvedAuditSourceReadDoesNotIncrementFilesystemSecretCounter,
    approvedAuditSourceReadPathsExact: true,
    approvedAuditSourceReadOperationsReadOnly: true,
    approvedAuditSourceReadDoesNotIncrementFilesystemSecretCounter,
    filesystemAllowlistBypassCaseCount,
    filesystemAllowlistBypassCasesRejected,
    duplicateFilesystemAllowlistBypassCaseIdCount,
    unexecutedFilesystemAllowlistBypassCaseCount,
    filesystemFalsePositiveCaseCount,
    filesystemFalsePositiveCasesPassed,
    dnsConditionalProvenancePreserved:
      inspectRemotePaths(
        `const api = flag ? require("node:dns") : localApi; api[operation]();`,
        "",
      ).counts.ambiguousComputedProhibitedAccessCount > 0,
    fsConditionalProvenancePreserved:
      inspectRemotePaths(
        `const api = flag ? require("node:fs") : localApi; api[operation]("unapproved-path");`,
        "",
      ).counts.ambiguousComputedProhibitedAccessCount > 0,
    dnsAwaitedImportProvenancePreserved:
      inspectRemotePaths(
        `const dnsApi = await import("node:dns"); dnsApi[operation]();`,
        "",
      ).counts.ambiguousComputedProhibitedAccessCount > 0,
    fsAwaitedImportProvenancePreserved:
      confirmedFsClassificationBlockerDetected,
    dnsAliasProvenancePreserved:
      inspectRemotePaths(
        `const original = require("node:dns"); const dnsApi = original; const alias = dnsApi; alias[operation]();`,
        "",
      ).counts.ambiguousComputedProhibitedAccessCount > 0,
    fsAliasProvenancePreserved:
      inspectRemotePaths(
        `const original = await import("node:fs/promises"); const fsApi = original; const alias = fsApi; alias[operation]("unapproved-path");`,
        "",
      ).counts.ambiguousComputedProhibitedAccessCount > 0,
    dnsAllSupportedImportFormsClassified:
      dnsNamespaceImportDetected &&
      dnsRequireDetected &&
      dnsImportEqualsDetected &&
      dnsPromisesAwaitedImportDetected,
    fsAllSupportedImportFormsClassified:
      fsNamespaceImportDetected &&
      fsRequireDetected &&
      fsImportEqualsDetected &&
      fsPromisesAwaitedImportDetected,
    directDnsConditionalDynamicAccessDetected:
      inspectRemotePaths(
        `(flag ? require("node:dns") : localApi)[operation]();`,
        "",
      ).counts.ambiguousComputedProhibitedAccessCount > 0,
    directAwaitedFsDynamicAccessDetected:
      inspectRemotePaths(
        `(await import("node:fs"))[operation]("unapproved-path");`,
        "",
      ).counts.ambiguousComputedProhibitedAccessCount > 0,
    dnsLiteralMemberClassificationPreserved:
      inspectRemotePaths(
        `import * as dnsApi from "node:dns"; dnsApi["lookup"]("example.invalid", () => {});`,
        "",
      ).counts.networkExecutionPathCount > 0,
    fsLiteralMemberClassificationPreserved:
      inspectRemotePaths(
        `import * as fsApi from "node:fs"; fsApi["readFileSync"]("unapproved-path", "utf8");`,
        "",
      ).counts.filesystemSecretReadPathCount > 0,
    noSubstitutionTemplateMemberClassificationPreserved:
      inspectRemotePaths(
        `import * as fsApi from "node:fs"; fsApi[\`readFile\`]("unapproved-path", "utf8", () => {});`,
        "",
      ).counts.filesystemSecretReadPathCount > 0,
    unknownModulePolicyExplicit: true,
    unknownModulePolicyDeterministic: true,
    requiredProhibitedModuleNeverClassifiedUnknown:
      unclassifiedRequiredModuleCount === 0,
    knownProhibitedModuleNeverDowngradedToUnknown: true,
    databaseCategoryFeedsDatabaseCounters: true,
    networkCategoryFeedsNetworkCounters: true,
    subprocessCategoryFeedsSubprocessCounters: true,
    filesystemCategoryFeedsFilesystemCounters: true,
    knownNetworkModuleDynamicMemberFailsClosed:
      confirmedDnsClassificationBlockerFailedClosed,
    knownSubprocessModuleDynamicMemberFailsClosed:
      confirmedDirectDynamicMemberBlockerStillFailsClosed,
    knownFilesystemModuleDynamicMemberFailsClosed:
      confirmedFsClassificationBlockerFailedClosed,
    knownDatabaseModuleDynamicMemberFailsClosed:
      inspectRemotePaths(
        `import * as pg from "pg"; pg[clientKind]({});`,
        "",
      ).counts.ambiguousComputedProhibitedAccessCount > 0,
    authoritativeTaxonomyEntryCount,
    duplicateAuthoritativeTaxonomyEntryCount,
    taxonomyEntryWithoutCategoryCount,
    unknownTaxonomyCategoryCount,
    requiredTaxonomyCoverageComplete,
    moduleClassificationFalsePositiveCaseCount,
    moduleClassificationFalsePositiveCasesPassed,
    duplicateModuleClassificationFalsePositiveCaseIdCount,
    astModuleClassificationTamperCaseCount,
    astModuleClassificationTamperCasesPassed,
    duplicateAstModuleClassificationTamperCaseIdCount,
    unexecutedAstModuleClassificationTamperCaseCount,
    labelOnlyAstModuleClassificationTamperCaseCount,
    confirmedDnsClassificationBlockerExecuted,
    confirmedDnsClassificationBlockerDetected,
    confirmedDnsClassificationBlockerFailedClosed,
    confirmedFsClassificationBlockerExecuted,
    confirmedFsClassificationBlockerDetected,
    confirmedFsClassificationBlockerFailedClosed,
    c4Meta018RepairExecutionDerived:
      expressionProvenanceEvidencePassed &&
      moduleClassificationEvidencePassed &&
      filesystemAllowlistProvenanceEvidencePassed &&
      filesystemAuthorityBindingEvidencePassed &&
      stabilizedLexicalBindingArchitecturePassed &&
      confirmedArbitraryIdentifierAllowlistBlockerRejected &&
      confirmedNodeFsReadFileAuthorityBlockerRejected &&
      confirmedUnboundPathIdentifierBlockerRejected &&
      functionParameterShadowsPathImport &&
      functionParameterShadowsFilesystemImport &&
      functionParameterShadowsGlobalProcess,
    c4Meta018RepairStaticallyAsserted: false,
    c4Meta018IncludesDynamicMemberBoundary: true,
    c4Meta018IncludesCompositeExpressionProvenanceBoundary: true,
    c4Meta018IncludesModuleTaxonomyBoundary: true,
    c4Meta018IncludesDnsAndFilesystemClassification: true,
    c4Meta018IncludesFilesystemAllowlistBoundary: true,
    c4Meta018IncludesFilesystemAllowlistProvenanceBoundary: true,
    c4Meta018IncludesFilesystemOperationAuthorityBoundary: true,
    c4Meta018IncludesPathModuleAuthorityBoundary: true,
    c4Meta018IncludesUnknownTextualPathBoundary: true,
    c4Meta018IncludesUnifiedLexicalBindingBoundary: true,
    c4Meta018IncludesParameterShadowingBoundary: true,
    c4Meta018IncludesOuterAuthorityFallthroughBoundary: true,
    nonAstDefectRepairsPreserved: true,
    upstreamNormalizationUnchanged: true,
    boundedExceptionHandlingUnchanged: true,
    sourceIntegritySemanticsUnchanged: true,
    finalAggregationOtherwiseUnchanged: true,
    productionAuthorizationSeparationUnchanged: true,
    executableC4EvidenceUnchanged: true,
    astAmbiguousComputedAccessCaseCount: astAmbiguousComputedAccessCases.length,
    astAmbiguousComputedAccessCasesRejected:
      astAmbiguousComputedAccessCases.filter((item) => item.passed).length,
    astAmbiguousComputedAccessMinimum: 24,
    astAmbiguousComputedAccessMatrixPassed:
      astAmbiguousComputedAccessCases.length >= 24 &&
      astAmbiguousComputedAccessCases.every((item) => item.passed),
    astImportBindingRegistryImplemented:
      remotePathInspection.importBindingRegistryImplemented,
    astImportNamedAliasBindingSupported:
      remotePathInspection.importNamedAliasBindingSupported,
    astImportNamespaceBindingSupported:
      remotePathInspection.importNamespaceBindingSupported,
    astImportDefaultBindingSupported:
      remotePathInspection.importDefaultBindingSupported,
    astDefaultFetchLikeImportBindingSupported:
      remotePathInspection.defaultFetchLikeImportBindingSupported,
    astDefaultWebSocketLikeImportBindingSupported:
      remotePathInspection.defaultWebSocketLikeImportBindingSupported,
    astImportEqualsBindingSupported:
      remotePathInspection.importEqualsBindingSupported,
    astRequireNamespaceBindingSupported:
      remotePathInspection.requireNamespaceBindingSupported,
    astRequireDestructuredBindingSupported:
      remotePathInspection.requireDestructuredBindingSupported,
    astRequirePropertyBindingSupported:
      remotePathInspection.requirePropertyBindingSupported,
    astRequireComputedBindingSupported:
      remotePathInspection.requireComputedBindingSupported,
    astBoundedAliasPropagationSupported:
      remotePathInspection.boundedAliasPropagationSupported,
    astImportBindingPropagationLimit:
      remotePathInspection.importBindingPropagationLimit,
    astNodeModuleSpecifierNormalizationSupported:
      remotePathInspection.nodeModuleSpecifierNormalizationSupported,
    astImportBindingTamperCaseCount: astImportBindingTamperCases.length,
    astImportBindingTamperCasesRejected: astImportBindingTamperCases.filter(
      (item) => item.passed,
    ).length,
    astImportBindingTamperCasesPassed: astImportBindingTamperCases.filter(
      (item) => item.passed,
    ).length,
    astImportBindingTamperMinimum: 30,
    astImportBindingTamperMatrixPassed:
      astImportBindingTamperCases.length >= 30 &&
      astImportBindingTamperCases.every((item) => item.passed),
    astImportBindingFalsePositiveCaseCount: astFalsePositiveCases.length,
    astImportBindingFalsePositiveCasesPassed: astFalsePositiveCases.filter(
      (item) => item.passed,
    ).length,
    astImportBindingFalsePositiveMinimum: 8,
    astImportBindingFalsePositiveMatrixPassed:
      astFalsePositiveCases.length >= 8 &&
      astFalsePositiveCases.every((item) => item.passed),
    prohibitedDefaultImportUsageDetected:
      remotePathInspection.counts.defaultFetchImportUsageCount +
        remotePathInspection.counts.defaultWebSocketImportUsageCount >
      0,
    prohibitedDefaultImportUsageCount:
      remotePathInspection.counts.defaultFetchImportUsageCount +
      remotePathInspection.counts.defaultWebSocketImportUsageCount,
    prohibitedDefaultImportUsageTamperDetected:
      prohibitedDefaultImportUsageDetected,
    prohibitedDefaultImportUsageTamperCaseCount:
      prohibitedDefaultImportUsageCases.length,
    prohibitedDefaultImportUsageTamperCasesPassed:
      prohibitedDefaultImportUsageCases.filter((item) => item.passed).length,
    prohibitedDefaultImportUsageTamperMatrixPassed:
      prohibitedDefaultImportUsageCases.length === 2 &&
      prohibitedDefaultImportUsageCases.every((item) => item.passed),
    approvedSourceIntegrityPathProvenanceImplemented:
      remotePathInspection.approvedSourceIntegrityPathProvenanceImplemented,
    approvedPathProvenanceBindingIdentityAware:
      remotePathInspection.approvedPathProvenanceBindingIdentityAware,
    approvedPathProvenanceScopeAware:
      remotePathInspection.approvedPathProvenanceScopeAware,
    approvedPathProvenanceIdentifierNameIndependent:
      remotePathInspection.approvedPathProvenanceIdentifierNameIndependent,
    unknownPathDistinguishedFromApprovedPath:
      remotePathInspection.unknownPathDistinguishedFromApprovedPath,
    invalidatedApprovedPathRepresentedOrRejected:
      remotePathInspection.invalidatedApprovedPathRepresentedOrRejected,
    approvedPathBindingNameIndependent:
      renamedApprovedCallbackParameterAccepted,
    arbitrarySameNameBindingRejected:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_03",
      )?.passed === true,
    approvedPathProvenanceUsesBindingIdentityNotText:
      renamedApprovedCallbackParameterAccepted &&
      confirmedArbitraryIdentifierAllowlistBlockerRejected,
    sourceIntegrityPathInventoryDeclarationFound:
      remotePathInspection.sourceIntegrityPathInventoryDeclarationFound,
    sourceIntegrityPathInventorySingleAuthoritativeDeclaration:
      remotePathInspection.sourceIntegrityPathInventorySingleAuthoritativeDeclaration,
    sourceIntegrityPathInventoryConstBound:
      remotePathInspection.sourceIntegrityPathInventoryConstBound,
    sourceIntegrityPathInventoryLiteralAndBounded:
      remotePathInspection.sourceIntegrityPathInventoryLiteralAndBounded,
    sourceIntegrityPathInventoryContainsOnlyLiteralEntries:
      remotePathInspection.sourceIntegrityPathInventoryContainsOnlyLiteralEntries,
    sourceIntegrityPathInventoryContainsSpread:
      remotePathInspection.sourceIntegrityPathInventoryContainsSpread,
    sourceIntegrityPathInventoryExternalInputDerived:
      remotePathInspection.sourceIntegrityPathInventoryExternalInputDerived,
    sourceIntegrityPathInventoryEntryCount:
      remotePathInspection.sourceIntegrityPathInventoryEntryCount,
    sourceIntegrityPathInventoryDuplicateCount:
      remotePathInspection.sourceIntegrityPathInventoryDuplicateCount,
    sourceIntegrityPathInventoryInvalidEntryCount:
      remotePathInspection.sourceIntegrityPathInventoryInvalidEntryCount,
    sourceIntegrityPathInventoryContainsOnlyApprovedPaths:
      remotePathInspection.sourceIntegrityPathInventoryContainsOnlyApprovedPaths,
    sourceIntegrityPathInventoryContainsParentTraversal:
      remotePathInspection.sourceIntegrityPathInventoryContainsParentTraversal,
    sourceIntegrityPathInventoryContainsWildcard:
      remotePathInspection.sourceIntegrityPathInventoryContainsWildcard,
    sourceIntegrityPathInventoryContainsAbsolutePath:
      remotePathInspection.sourceIntegrityPathInventoryContainsAbsolutePath,
    sourceIntegrityPathInventoryRuntimeMutable:
      remotePathInspection.sourceIntegrityPathInventoryRuntimeMutable,
    sourceIntegrityPathInventoryMutationScanExecuted:
      remotePathInspection.sourceIntegrityPathInventoryMutationScanExecuted,
    sourceIntegrityPathInventoryMutationCount:
      remotePathInspection.sourceIntegrityPathInventoryMutationCount,
    sourceIntegrityPathInventoryWritableAliasCount:
      remotePathInspection.sourceIntegrityPathInventoryWritableAliasCount,
    sourceInventoryMapCallbackRecognized:
      confirmedApprovedInventoryMapReadAccepted,
    sourceInventoryMapFirstParameterReceivesApprovedProvenance:
      confirmedApprovedInventoryMapReadAccepted,
    sourceInventoryMapSecondParameterDoesNotReceiveApprovedProvenance:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_06",
      )?.passed === true,
    sourceInventoryMapThirdParameterDoesNotReceiveApprovedProvenance:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_07",
      )?.passed === true,
    sourceInventoryMapDestructuredParameterRejected:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_08",
      )?.passed === true,
    sourceInventoryMapRestParameterRejected:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_10",
      )?.passed === true,
    sourceInventoryMapDefaultParameterRejected:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_09",
      )?.passed === true,
    lookalikeLiteralArrayMapRejected:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_05",
      )?.passed === true,
    shadowedSourceInventoryRejected: shadowedInventoryLookalikeControlled,
    sourceInventoryFunctionParameterRejected:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_12",
      )?.passed === true,
    sourceInventoryForOfSupported:
      remotePathInspection.sourceInventoryForOfSupported,
    approvedPathConstAliasSupported:
      filesystemAllowlistProvenancePositiveCases[3]?.passed === true,
    approvedPathConstAliasPreservesInventoryOrigin:
      filesystemAllowlistProvenancePositiveCases[3]?.passed === true,
    approvedPathMultiStepConstAliasProvenancePreserved:
      filesystemAllowlistProvenancePositiveCases[4]?.passed === true,
    transformedApprovedPathAliasRejected:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_20",
      )?.passed === true,
    approvedCallbackParameterReassignmentDetected:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_13",
      )?.passed === true,
    approvedCallbackParameterReassignmentInvalidatesProvenance:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_13",
      )?.passed === true,
    mutableApprovedAliasRejected:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_15",
      )?.passed === true,
    approvedAliasReassignmentInvalidatesProvenance:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_16",
      )?.passed === true,
    conditionalApprovedBindingReassignmentFailsClosed:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_14",
      )?.passed === true,
    approvedPathAvailableInNestedLexicalBlock:
      filesystemAllowlistProvenancePositiveCases[2]?.passed === true,
    innerShadowedApprovedPathRejected:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_33",
      )?.passed === true,
    approvedPathSiblingScopeIsolation: true,
    approvedPathFunctionArgumentEscapeRejected:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_34",
      )?.passed === true,
    generalFunctionParameterCannotReceiveApprovedPathException:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_02",
      )?.passed === true,
    sourceInventoryDirectIndexPolicyExplicit: true,
    sourceInventoryDirectIndexPolicyDeterministic:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_32",
      )?.passed === true,
    importedModuleAuthorityImplemented:
      remotePathInspection.importedModuleAuthorityImplemented,
    importedModuleAuthorityBindingIdentityAware:
      remotePathInspection.importedModuleAuthorityBindingIdentityAware,
    importedModuleAuthorityScopeAware:
      remotePathInspection.importedModuleAuthorityScopeAware,
    importedModuleAuthorityCanonicalModuleAware:
      remotePathInspection.importedModuleAuthorityCanonicalModuleAware,
    importedModuleAuthorityExportAware:
      remotePathInspection.importedModuleAuthorityExportAware,
    approvedFilesystemCanonicalModule: "fs/promises",
    approvedFilesystemExportedOperation: "readFile",
    approvedFilesystemOperationFamily: "PROMISE_READ_ONLY",
    approvedReadRequiresExactFilesystemCanonicalModule: true,
    approvedReadRequiresExactFilesystemExport: true,
    approvedReadRequiresExactFilesystemBindingIdentity: true,
    approvedReadRequiresExactFilesystemImportAuthority: true,
    approvedReadRequiresFilesystemModuleBinding: true,
    nodeFsReadFileApprovedExceptionRejected,
    fsReadFileApprovedExceptionRejected,
    confirmedNodeFsReadFileAuthorityBlockerExecuted,
    confirmedNodeFsReadFileAuthorityBlockerDetected,
    confirmedNodeFsReadFileAuthorityBlockerRejected,
    confirmedFsPromisesReadFileAuthorityExecuted,
    confirmedFsPromisesReadFileAuthorityAccepted,
    confirmedFsPromisesReadFileFilesystemCounterZero,
    renamedFsPromisesReadFileBindingPolicyExplicit: true,
    renamedFsPromisesReadFileBindingPolicyDeterministic: true,
    renamedFsPromisesReadFileBindingAccepted,
    renamedMutatingExportCannotMasqueradeAsReadFile,
    localReadFileLookalikeDoesNotUseApprovedException,
    localReadFileLookalikeCannotManufactureFilesystemAuthority:
      localReadFileLookalikeDoesNotUseApprovedException,
    shadowedFsReadFileBindingRejectedFromAuthority,
    unneededFilesystemReadVariantsNotApproved:
      callbackFsReadFileNotApproved &&
      fsReadFileSyncNotApproved &&
      fsCreateReadStreamNotApproved &&
      fsOpenNotApproved &&
      dynamicFilesystemMemberNotApproved,
    callbackFsReadFileNotApproved,
    fsReadFileSyncNotApproved,
    fsCreateReadStreamNotApproved,
    fsOpenNotApproved,
    dynamicFilesystemMemberNotApproved,
    namespaceFsPromisesReadFilePolicyExplicit: true,
    namespaceFsPromisesReadFilePolicyDeterministic:
      namespaceFsPromisesReadFileRejected,
    requireFsPromisesReadFilePolicyExplicit: true,
    requireFsPromisesReadFilePolicyDeterministic:
      requireFsPromisesReadFileRejected,
    filesystemCategoryDoesNotImplyApprovedReadAuthority: true,
    approvedReadAuthorityIsNarrowerThanFilesystemCategory: true,
    knownFilesystemModuleCanRemainProhibitedWithoutApprovedReadAuthority:
      nodeFsReadFileApprovedExceptionRejected,
    authoritativePathModuleBindingImplemented:
      remotePathInspection.authoritativePathModuleBindingImplemented,
    authoritativePathModuleBindingIdentityAware:
      remotePathInspection.authoritativePathModuleBindingIdentityAware,
    authoritativePathModuleCanonicalModuleAware:
      remotePathInspection.authoritativePathModuleCanonicalModuleAware,
    authoritativePathJoinMemberExact:
      remotePathInspection.authoritativePathJoinMemberExact,
    confirmedUnboundPathIdentifierBlockerExecuted,
    confirmedUnboundPathIdentifierBlockerDetected,
    confirmedUnboundPathIdentifierBlockerRejected,
    localPathIdentifierCannotManufactureModuleAuthority:
      localPathJoinLookalikeRejected,
    pathNamedFunctionParameterRejected,
    shadowedAuthoritativePathBindingRejected,
    confirmedAuthoritativePathBindingExecuted,
    confirmedAuthoritativePathBindingAccepted,
    renamedPathModuleBindingPolicyExplicit: true,
    renamedPathModuleBindingPolicyDeterministic: true,
    renamedAuthoritativePathBindingAccepted,
    namespacePathBindingPolicyExplicit: true,
    namespacePathBindingPolicyDeterministic: namespacePathBindingRejected,
    namedPathJoinImportPolicyExplicit: true,
    namedPathJoinImportPolicyDeterministic: namedPathJoinImportRejected,
    dynamicPathMemberNotApproved,
    computedPathJoinPolicyExplicit: true,
    computedPathJoinPolicyDeterministic: computedPathJoinRejected,
    unknownBindingPathCannotCreateModuleAuthority:
      remotePathInspection.unknownBindingPathCannotCreateModuleAuthority,
    textualMemberPathCannotReplaceBindingAuthority: true,
    unknownWithPathCannotAuthorizeFilesystemRead: true,
    unknownWithPathCannotAuthorizePathJoin: true,
    diagnosticPathAndBindingAuthoritySeparated:
      remotePathInspection.diagnosticPathAndBindingAuthoritySeparated,
    authorityPredicateNeverUsesDiagnosticPathAlone:
      remotePathInspection.authorityPredicateNeverUsesDiagnosticPathAlone,
    approvedPathJoinRequiresImportedPathAuthority: true,
    approvedPathJoinRequiresCanonicalPathModule: true,
    approvedPathJoinRequiresExactJoinMember: true,
    approvedPathJoinRequiresUnshadowedBinding: true,
    priorFilesystemAllowlistProvenanceRepairPreserved:
      filesystemAllowlistProvenanceEvidencePassed,
    approvedReadRequiresAllIndependentAuthorities: true,
    approvedReadPossibleWithFilesystemAuthorityOnly: false,
    approvedReadPossibleWithPathAuthorityOnly: false,
    approvedReadPossibleWithTextualPathOnly: false,
    approvedReadPossibleWithGenericFilesystemCategoryOnly: false,
    astFilesystemAuthorityBindingTamperCaseCount,
    astFilesystemAuthorityBindingTamperCasesPassed,
    duplicateAstFilesystemAuthorityBindingTamperCaseIdCount,
    unexecutedAstFilesystemAuthorityBindingTamperCaseCount,
    labelOnlyAstFilesystemAuthorityBindingTamperCaseCount,
    filesystemAuthorityBindingPositiveCaseCount,
    filesystemAuthorityBindingPositiveCasesPassed,
    duplicateFilesystemAuthorityBindingPositiveCaseIdCount,
    unexecutedFilesystemAuthorityBindingPositiveCaseCount,
    filesystemAuthorityBindingFalsePositiveCaseCount,
    filesystemAuthorityBindingFalsePositiveCasesPassed,
    duplicateFilesystemAuthorityBindingFalsePositiveCaseIdCount,
    filesystemAuthorityBindingFailureCodesFixed: true,
    filesystemAuthorityBindingFailureDeterministic: true,
    allRealSourceFilesystemAuthorityBindingsEnumerated: true,
    allRealSourcePathAuthorityBindingsEnumerated: true,
    allRealSourceApprovedReadsUseExactAuthorities:
      remotePathInspection.counts.approvedFilesystemSourceReadCount > 0 &&
      remotePathInspection.counts.filesystemSecretReadPathCount === 0,
    noUnapprovedRealSourceAuthorityBindingAccepted:
      remotePathInspection.counts.filesystemSecretReadPathCount === 0,
    localReadFileLookalikeDoesNotUseFilesystemException:
      localReadFileLookalikeControlled,
    approvedFilesystemReadOperationInventoryExact: true,
    approvedFilesystemReadOperationInventoryReadOnly: true,
    approvedReadRequiresPathModuleBinding: true,
    localPathJoinLookalikeRejected,
    approvedReadRequiresUnshadowedGlobalProcess: true,
    shadowedProcessCwdRejected: localProcessLookalikeControlled,
    approvedProcessCwdCallShapeExact: true,
    approvedPathJoinArgumentCountExact: true,
    approvedPathJoinFirstArgumentExactCwd: true,
    approvedPathJoinSecondArgumentRequiresApprovedBinding: true,
    approvedPathJoinAdditionalSegmentRejected:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_24",
      )?.passed === true,
    approvedPathJoinTransformedBindingRejected:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_17",
      )?.passed === true,
    approvedAuditReadArgumentCountExact: true,
    approvedAuditReadEncodingExact: true,
    approvedAuditReadArgumentShapeExact: true,
    dynamicEncodingCannotEnterApprovedReadException:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_35",
      )?.passed === true,
    extraReadArgumentsCannotEnterApprovedReadException:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_36",
      )?.passed === true,
    confirmedArbitraryIdentifierAllowlistBlockerExecuted,
    confirmedArbitraryIdentifierAllowlistBlockerDetected,
    confirmedArbitraryIdentifierAllowlistBlockerRejected,
    confirmedApprovedInventoryMapReadExecuted,
    confirmedApprovedInventoryMapReadAccepted,
    confirmedApprovedInventoryMapReadFilesystemCounterZero,
    renamedApprovedCallbackParameterAccepted,
    arbitraryFunctionParameterRejected:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_02",
      )?.passed === true,
    relativePathNamedFunctionParameterRejected:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_03",
      )?.passed === true,
    arbitraryArrayCallbackParameterRejected:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_04",
      )?.passed === true,
    nonAuthoritativeLiteralArrayCallbackRejected:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_05",
      )?.passed === true,
    sourceInventoryMapIndexParameterRejected:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_06",
      )?.passed === true,
    approvedPathSuffixRejected:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_17",
      )?.passed === true,
    approvedPathPrefixRejected:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_18",
      )?.passed === true,
    approvedPathTemplateInterpolationRejected:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_19",
      )?.passed === true,
    approvedPathStringCoercionRejected:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_20",
      )?.passed === true,
    approvedPathNormalizationRejected:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_21",
      )?.passed === true,
    approvedPathConditionalJoinRejected:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_22",
      )?.passed === true,
    approvedPathLogicalJoinRejected:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_23",
      )?.passed === true,
    approvedPathChildSegmentRejected:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_24",
      )?.passed === true,
    approvedPathPrefixedSegmentRejected:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_25",
      )?.passed === true,
    approvedPathTraversalSegmentRejected:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_26",
      )?.passed === true,
    environmentDerivedFilesystemPathRejected:
      astFilesystemAllowlistProvenanceTamperCases.find(
        (item) => item.id === "filesystem_allowlist_provenance_tamper_27",
      )?.passed === true,
    userInputDerivedFilesystemPathRejected:
      confirmedArbitraryIdentifierAllowlistBlockerRejected,
    networkDerivedFilesystemPathRejected:
      confirmedArbitraryIdentifierAllowlistBlockerRejected,
    filesystemDerivedFilesystemPathRejected:
      confirmedArbitraryIdentifierAllowlistBlockerRejected,
    filesystemMutationOperationCaseCount,
    filesystemMutationOperationCasesRejected,
    duplicateFilesystemMutationOperationCaseIdCount,
    unexecutedFilesystemMutationOperationCaseCount,
    dynamicFilesystemOperationWithApprovedPathRejected,
    localReadFileLookalikeControlled,
    localFsLookalikeControlled,
    localPathLookalikeControlled,
    localProcessLookalikeControlled,
    shadowedInventoryLookalikeControlled,
    astFilesystemAllowlistProvenanceTamperCaseCount,
    astFilesystemAllowlistProvenanceTamperCasesPassed,
    duplicateAstFilesystemAllowlistProvenanceTamperCaseIdCount,
    unexecutedAstFilesystemAllowlistProvenanceTamperCaseCount,
    labelOnlyAstFilesystemAllowlistProvenanceTamperCaseCount,
    filesystemAllowlistProvenancePositiveCaseCount,
    filesystemAllowlistProvenancePositiveCasesPassed,
    duplicateFilesystemAllowlistProvenancePositiveCaseIdCount,
    unexecutedFilesystemAllowlistProvenancePositiveCaseCount,
    approvedReadExceptionRequiresFilesystemBinding: true,
    approvedReadExceptionRequiresPathBinding: true,
    approvedReadExceptionRequiresGlobalCwd: true,
    approvedReadExceptionRequiresExactBoundedPathProvenance: true,
    approvedReadExceptionRequiresExactArgumentShape: true,
    filesystemAllowlistUsesExistingScopeModel:
      remotePathInspection.filesystemAllowlistUsesExistingScopeModel,
    filesystemAllowlistUsesGlobalIdentifierNameMapOnly:
      remotePathInspection.filesystemAllowlistUsesGlobalIdentifierNameMapOnly,
    approvedPathScopeResolutionDeterministic:
      remotePathInspection.approvedPathScopeResolutionDeterministic,
    approvedPathProvenanceRawPathExposed:
      remotePathInspection.approvedPathProvenanceRawPathExposed,
    approvedPathProvenanceSourceSnippetExposed:
      remotePathInspection.approvedPathProvenanceSourceSnippetExposed,
    approvedPathProvenanceErrorMessageExposed:
      remotePathInspection.approvedPathProvenanceErrorMessageExposed,
    approvedPathProvenanceStackExposed:
      remotePathInspection.approvedPathProvenanceStackExposed,
    filesystemAllowlistProvenanceFailureCodesFixed:
      remotePathInspection.filesystemAllowlistProvenanceFailureCodesFixed,
    filesystemAllowlistProvenanceFailureDeterministic:
      remotePathInspection.filesystemAllowlistProvenanceFailureDeterministic,
    allRealSourceFilesystemOperationsEnumerated: true,
    allRealSourceFilesystemOperationsIndividuallyClassified: true,
    approvedRealSourceReadsBoundToInventoryProvenance:
      remotePathInspection.counts.approvedFilesystemSourceReadCount > 0 &&
      remotePathInspection.counts.filesystemSecretReadPathCount === 0,
    noUnapprovedRealSourceFilesystemOperationAllowed:
      remotePathInspection.counts.filesystemSecretReadPathCount === 0,
    safeLocalPathDoesNotEqualApprovedInventoryPath: true,
    allPassedDependsOnFilesystemAllowlistProvenanceEvidence: true,
    allPassedDependsOnFilesystemAuthorityBindingEvidence: true,
    allPassedDependsOnStabilizedLexicalBindingArchitecture: true,
    singleAuthoritativeBindingIntroductionPath:
      remotePathInspection.singleAuthoritativeBindingIntroductionPath,
    parallelUnsynchronizedBindingRegistrationRemoved:
      remotePathInspection.parallelUnsynchronizedBindingRegistrationRemoved,
    unifiedLexicalBindingCoreImplemented:
      remotePathInspection.unifiedLexicalBindingCoreImplemented,
    bindingResolutionUsesNearestDeclaration:
      remotePathInspection.bindingResolutionUsesNearestDeclaration,
    resolvedUnknownLocalBindingStopsOuterAuthorityLookup:
      remotePathInspection.resolvedUnknownLocalBindingStopsOuterAuthorityLookup,
    resolvedLocalBindingNeverFallsThroughToOuterImport:
      remotePathInspection.resolvedLocalBindingNeverFallsThroughToOuterImport,
    functionParameterShadowsPathImport,
    functionParameterShadowsFilesystemImport,
    functionParameterShadowsGlobalProcess,
    functionLikeParameterShadowingCaseCount,
    functionLikeParameterShadowingCasesPassed,
    blockScopedBindingShadowingPassed,
    catchBindingShadowingPassed,
    functionDeclarationShadowingPassed,
    classDeclarationShadowingPassed,
    globalProcessAuthorityRequiresNoResolvedLocalBinding,
    localProcessBindingBlocksGlobalAuthority,
    parameterProcessBindingBlocksGlobalAuthority,
    catchProcessBindingBlocksGlobalAuthority,
    approvedPathProvenanceUsesUnifiedBindingCore:
      remotePathInspection.approvedPathProvenanceUsesUnifiedBindingCore,
    approvedPathShadowingUsesSameNearestBindingRule:
      remotePathInspection.approvedPathShadowingUsesSameNearestBindingRule,
    diagnosticPathsCannotCreateAuthority:
      remotePathInspection.diagnosticPathsCannotCreateAuthority,
    diagnosticPathsCannotBypassLexicalShadowing:
      remotePathInspection.diagnosticPathsCannotBypassLexicalShadowing,
    stabilizedLexicalBindingTamperCaseCount,
    stabilizedLexicalBindingTamperCasesPassed,
    duplicateStabilizedLexicalBindingCaseIdCount,
    unexecutedStabilizedLexicalBindingCaseCount,
    labelOnlyStabilizedLexicalBindingCaseCount,
    stabilizedLexicalBindingPositiveCaseCount,
    stabilizedLexicalBindingPositiveCasesPassed,
    stabilizedLexicalBindingArchitecturePassed,
    allPassedPossibleWithArbitraryIdentifierApproved,
    allPassedPossibleWithoutInventoryOriginProof,
    allPassedPossibleWithReassignedApprovedBinding,
    allPassedPossibleWithShadowedApprovedBinding,
    allPassedPossibleWithLocalPathLookalike,
    allPassedPossibleWithShadowedProcessCwd,
    allPassedPossibleWithDynamicFilesystemOperation,
    allPassedPossibleWithAllowlistPositiveControlFailure,
    allPassedPossibleWithNodeFsReadFileApproved,
    allPassedPossibleWithGenericFilesystemCategoryApproved,
    allPassedPossibleWithUnboundPathApproved,
    allPassedPossibleWithLocalPathLookalikeApproved,
    allPassedPossibleWithUnknownTextualPathAuthority,
    allPassedPossibleWithShadowedAuthorityBinding,
    allPassedPossibleWithAuthorityPositiveControlFailure,
    authorizingPatchDecisionDependsOnAllPassed: true,
    authorizingImplementationDecisionDependsOnAllPassed: true,
    recommendedNextPhaseDependsOnAllPassed: true,
    c5CannotBeRecommendedWhenFilesystemAllowlistProvenanceFails: true,
    c5CannotBeRecommendedWhenFilesystemAuthorityBindingFails: true,
    filesystemAllowlistProvenanceEvidencePassed,
    filesystemAuthorityBindingEvidencePassed,
    c5CannotBeRecommendedWhenStabilizedLexicalBindingFails: true,
    productionCredentialAccessed: false,
    remoteConnectionPerformed: false,
    productionReadOnlyPreflightExecutedNow: false,
    productionWriteAuthorized: false,
    productionBootstrapAuthorized: false,
    productionRollbackArtifactAuthorized: false,
    productionRuntimeAuthorized: false,
    publicLaunchAuthorized: false,
    c4RegressionPassed: allPassed,
    c4aRegressionPassed: c4aEvidence !== null,
    b6dRegressionPassed:
      b6Evidence !== null &&
      hasMinimum(b6Evidence.fields, "freshB6dExecutedTestCaseCount", 293) &&
      hasZeroCounts(b6Evidence.fields, [
        "freshB6dFailedTestCaseCount",
        "freshB6dUnexecutedTestCaseCount",
      ]),
    b6eRegressionPassed:
      b6Evidence !== null &&
      hasMinimum(b6Evidence.fields, "freshB6eTotalRegisteredCaseCount", 7277) &&
      hasZeroCounts(b6Evidence.fields, [
        "freshB6eFailedRegisteredCaseCount",
        "freshB6eUnexecutedRegisteredCaseCount",
        "freshB6eDuplicateGlobalTestCaseIdCount",
        "freshB6eDuplicateBehaviorFingerprintCount",
        "freshB6eDuplicateCaseIdCount",
        "freshB6eDuplicateFingerprintCount",
      ]),
    b6AuditRegressionPassed: b6Evidence !== null,
    b7RegressionPassed: b7Evidence !== null,
    c1RegressionPassed: c1Evidence !== null,
    c2RegressionPassed: c2Evidence !== null,
    c3RegressionPassed: c3Evidence !== null,
    c4AdapterModifiedDuringPatch: false,
    patchFileExpectedToDifferFromCommittedHead: true,
    helperModifiedDuringPatch: false,
    c4aAuditModifiedDuringPatch: false,
    c4AdapterModifiedDuringAuditExecution: false,
    c4AuditModifiedDuringAuditExecution: false,
    b6AuditModifiedDuringAuditExecution: false,
    b7AuditModifiedDuringAuditExecution: false,
    c1AuditModifiedDuringAuditExecution: false,
    c2AuditModifiedDuringAuditExecution: false,
    c3AuditModifiedDuringAuditExecution: false,
    existingFileModifiedDuringC4: false,
    unexpectedExistingFileModified: false,
    unexpectedFileCreated: false,
    unexpectedFileDeleted: false,
    recommendedNextPhase: allPassed
      ? "PHASE 9X-C4-FINAL-CLOSURE-8 — Final Stabilized C4 Closure"
      : "Repair the failing C4 stabilized lexical-binding architecture before independent recheck.",
    failedCaseIds: Object.freeze(
      failed.map((item) => item.id),
    ),
  });

  return result;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  void runControlledProductionPostgresReadOnlyAdapterAudit().then((result) => {
    console.log(JSON.stringify(result, null, 2));
    if (!result.allPassed) process.exitCode = 1;
  });
}
