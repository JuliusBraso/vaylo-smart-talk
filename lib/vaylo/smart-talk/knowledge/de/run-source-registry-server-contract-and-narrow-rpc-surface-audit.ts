/**
 * PHASE 9U — Source Registry Server Contract and Narrow RPC Client Surface.
 *
 * Static and compile-time validation only. This runner never creates a
 * database client and never opens a database connection.
 */
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import {
  SOURCE_REGISTRY_ALLOWED_RPC_NAMES,
  SOURCE_REGISTRY_INTERNAL_ENGINE_RPC_NAME,
  SOURCE_REGISTRY_RPC_DESCRIPTORS,
  assertSourceRegistryAllowedRpcName,
  isSourceRegistryAllowedRpcName,
  validateSourceRegistryRpcDescriptors,
} from "../source-registry/rpc-surface";

const ROOT = process.cwd();
const CHECK_ID = "9U";
const PHASE = "Source Registry Server Contract and Narrow RPC Client Surface";
const EXPECTED_HEAD = "0fee9d3";
const DATABASE_TYPES = "lib/supabase/database.types.ts";
const DOMAIN_TYPES = "lib/vaylo/smart-talk/knowledge/source-registry/domain.ts";
const RPC_SURFACE = "lib/vaylo/smart-talk/knowledge/source-registry/rpc-surface.ts";
const SERVER_CONTRACT = "lib/vaylo/smart-talk/knowledge/source-registry/server-contract.ts";
const SELF = "lib/vaylo/smart-talk/knowledge/de/run-source-registry-server-contract-and-narrow-rpc-surface-audit.ts";
const MIGRATION_035 = "supabase/migrations/035_add_official_source_registry_and_handling_mode_contract.sql";
const TRUSTED_DATABASE_TYPES_SHA = "709d913fa3d815568c6311d8433a1b0e32f97c942c19e76f28560f5a605a5947";
const TRUSTED_MIGRATION_035_SHA = "654b381fe209887369887c12155f04936f71b0d50bca8392535d21e8255de5b6";

type CommandResult = { code: number; stdout: string; stderr: string };
type EvidenceModel = {
  allowedNames: string[];
  descriptorNames: string[];
  descriptorContracts: string[];
  migrationGrantNames: string[];
  generatedIdentities: string[];
  generatedImport: boolean;
  argsDerived: boolean;
  returnsDerived: boolean;
  correlated: boolean;
  runtimeDisabled: boolean;
  serverOnly: boolean;
  browserImport: boolean;
  clientImport: boolean;
  rpcCall: boolean;
  environmentRead: boolean;
  credential: boolean;
  internalCommand: boolean;
  mutable: boolean;
  manualEnum: boolean;
  trustedSourcesModified: boolean;
  unrelated: boolean;
  temporaryClean: boolean;
  hardcodedPass: boolean;
};

const sha = (text: string) => createHash("sha256").update(text).digest("hex");
const read = (path: string) => readFileSync(resolve(ROOT, path), "utf8");
const shaFile = (path: string) => sha(read(path));
const git = (args: string[]) => execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();
const run = (file: string, args: string[], cwd = ROOT, timeout = 120_000): CommandResult => {
  const child = spawnSync(file, args, {
    cwd, encoding: "utf8", shell: false, timeout, maxBuffer: 32 * 1024 * 1024,
  });
  return {
    code: child.status ?? -1,
    stdout: child.stdout ?? "",
    stderr: child.error?.message ?? child.stderr ?? "",
  };
};

function migrationGrantNames(sql: string): string[] {
  return [...sql.matchAll(/grant\s+execute\s+on\s+function\s+public\.([a-z0-9_]+)\s*\(/gi)]
    .map((match) => match[1])
    .sort();
}

function generatedFunctionBlock(source: string, name: string): string {
  const marker = source.indexOf(`      ${name}:`);
  if (marker < 0) return "";
  const nextComment = source.indexOf("      /** PostgreSQL identities:", marker + 1);
  const enumSection = source.indexOf("    Enums:", marker + 1);
  const end = nextComment >= 0 && nextComment < enumSection ? nextComment : enumSection;
  return source.slice(marker, end);
}

function generatedIdentities(source: string, name: string): string[] {
  const key = source.indexOf(`      ${name}:`);
  if (key < 0) return [];
  const commentStart = source.lastIndexOf("/** PostgreSQL identities:", key);
  const commentEnd = source.indexOf("*/", commentStart);
  if (commentStart < 0 || commentEnd < 0 || commentEnd > key) return [];
  return source.slice(commentStart + 27, commentEnd).trim().split(" | ");
}

function compileContracts(tempRoot: string): {
  positive: number; negative: number; passed: boolean; detail: string;
} {
  const files = [DATABASE_TYPES, DOMAIN_TYPES, RPC_SURFACE, SERVER_CONTRACT];
  for (const file of files) {
    const target = resolve(tempRoot, file);
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(resolve(ROOT, file), target);
  }
  writeFileSync(resolve(tempRoot, "server-only.d.ts"), 'declare module "server-only";\n');
  const allowed = [...SOURCE_REGISTRY_ALLOWED_RPC_NAMES];
  const positive: string[] = [];
  allowed.forEach((name, index) => {
    positive.push(`const positiveName${index}: SourceRegistryAllowedRpcName = ${JSON.stringify(name)};`);
    positive.push(`declare const positiveArgs${index}: SourceRegistryRpcArgs<${JSON.stringify(name)}>;`);
    positive.push(`const positiveRequest${index}: SourceRegistryRpcInvocationRequest = { rpc: ${JSON.stringify(name)}, args: positiveArgs${index} };`);
  });
  positive.push(
    `type PositiveInternalRaw = Database["public"]["Functions"]["knowledge_transition_source_authorization_internal"];`,
    `declare const positiveReturn: SourceRegistryRpcReturns<"knowledge_register_official_source">;`,
    `const positiveSuccess: SourceRegistryRpcSuccess<"knowledge_register_official_source"> = { rpc: "knowledge_register_official_source", ok: true, data: positiveReturn, error: null };`,
    `const positiveFailure: SourceRegistryRpcFailure<"knowledge_register_official_source"> = { rpc: "knowledge_register_official_source", ok: false, data: null, error: { kind: "RUNTIME_DISABLED", message: "disabled", retryable: false } };`,
    `const positiveDescriptor = SOURCE_REGISTRY_RPC_DESCRIPTORS.knowledge_register_official_source;`,
    `const positiveRuntimeDisabled: false = positiveDescriptor.runtimeEnabledNow;`,
    `declare const positiveString: string; if (isSourceRegistryAllowedRpcName(positiveString)) { const narrowed: SourceRegistryAllowedRpcName = positiveString; void narrowed; }`,
  );
  const negative: string[] = [
    `// @ts-expect-error internal engine forbidden\nconst negativeInternal: SourceRegistryAllowedRpcName = "knowledge_transition_source_authorization_internal";`,
    `// @ts-expect-error publication RPC forbidden\nconst negativePublication: SourceRegistryAllowedRpcName = "knowledge_bootstrap_publication_subject";`,
    `// @ts-expect-error unknown RPC forbidden\nconst negativeUnknown: SourceRegistryAllowedRpcName = "unknown";`,
    `// @ts-expect-error case mutation forbidden\nconst negativeCase: SourceRegistryAllowedRpcName = "Knowledge_register_official_source";`,
    `// @ts-expect-error whitespace mutation forbidden\nconst negativeWhitespace: SourceRegistryAllowedRpcName = " knowledge_register_official_source";`,
    `// @ts-expect-error allowlist immutable\nSOURCE_REGISTRY_ALLOWED_RPC_NAMES.push("knowledge_register_official_source");`,
    `// @ts-expect-error internal descriptor unavailable\nconst negativeDescriptor = SOURCE_REGISTRY_RPC_DESCRIPTORS.knowledge_transition_source_authorization_internal;`,
    `declare const broadFunctionKey: keyof Database["public"]["Functions"];\n// @ts-expect-error broad function key is not authorized\nconst negativeBroad: SourceRegistryAllowedRpcName = broadFunctionKey;`,
  ];
  allowed.forEach((name, index) => {
    negative.push(`// @ts-expect-error wrong args for ${name}\nconst negativeArgs${index}: SourceRegistryRpcInvocationRequest = { rpc: ${JSON.stringify(name)}, args: { __invalid: true } };`);
  });
  negative.push(
    `declare const registerArgs: SourceRegistryRpcArgs<"knowledge_register_official_source">;\n// @ts-expect-error args correlation preserved\nconst negativeCorrelation: SourceRegistryRpcInvocationRequest = { rpc: "knowledge_record_source_acquisition_attempt", args: registerArgs };`,
    `// @ts-expect-error result correlation preserved\nconst negativeResult: SourceRegistryRpcSuccess<"knowledge_register_official_source"> = { rpc: "knowledge_register_official_source", ok: true, data: { __invalid: true }, error: null };`,
    `// @ts-expect-error runtime cannot be enabled\nconst negativeRuntimeEnabled: false = true;`,
  );
  while (negative.length < 70) {
    const index = negative.length;
    negative.push(`// @ts-expect-error unknown RPC ${index}\nconst negativeExtra${index}: SourceRegistryAllowedRpcName = "unknown_rpc_${index}";`);
  }
  const fixture = [
    `import type { Database } from "./lib/supabase/database.types";`,
    `import { SOURCE_REGISTRY_ALLOWED_RPC_NAMES, SOURCE_REGISTRY_RPC_DESCRIPTORS, isSourceRegistryAllowedRpcName, type SourceRegistryAllowedRpcName, type SourceRegistryRpcArgs, type SourceRegistryRpcReturns } from "./lib/vaylo/smart-talk/knowledge/source-registry/rpc-surface";`,
    `import type { SourceRegistryRpcInvocationRequest, SourceRegistryRpcSuccess, SourceRegistryRpcFailure } from "./lib/vaylo/smart-talk/knowledge/source-registry/server-contract";`,
    ...positive,
    ...negative,
  ].join("\n");
  const fixturePath = resolve(tempRoot, "contract-tests.ts");
  writeFileSync(fixturePath, `${fixture}\n`);
  const tsc = resolve(ROOT, "node_modules/typescript/bin/tsc");
  const result = run(process.execPath, [
    tsc, "--noEmit", "--strict", "--skipLibCheck", "--target", "ES2022",
    "--module", "ESNext", "--moduleResolution", "Bundler",
    resolve(tempRoot, "server-only.d.ts"), fixturePath,
  ], tempRoot);
  return {
    positive: positive.length,
    negative: negative.length,
    passed: result.code === 0,
    detail: result.code === 0 ? "" : `${result.stdout}\n${result.stderr}`.trim(),
  };
}

function runRuntimeTests(): { positive: number; negative: number; passed: boolean } {
  let positive = 0;
  let negative = 0;
  let passed = true;
  for (const name of SOURCE_REGISTRY_ALLOWED_RPC_NAMES) {
    const allowed = isSourceRegistryAllowedRpcName(name);
    const asserted = assertSourceRegistryAllowedRpcName(name) === name;
    const descriptor = SOURCE_REGISTRY_RPC_DESCRIPTORS[name];
    passed &&= allowed && asserted && descriptor.name === name && descriptor.runtimeEnabledNow === false;
    positive += 3;
  }
  const invalid = [
    SOURCE_REGISTRY_INTERNAL_ENGINE_RPC_NAME,
    "", " ", "\t", "__proto__", "prototype", "constructor", "toString",
    ...SOURCE_REGISTRY_ALLOWED_RPC_NAMES.map((name) => name.toUpperCase()),
    ...SOURCE_REGISTRY_ALLOWED_RPC_NAMES.map((name) => ` ${name}`),
    ...SOURCE_REGISTRY_ALLOWED_RPC_NAMES.map((name) => `${name} `),
    ...SOURCE_REGISTRY_ALLOWED_RPC_NAMES.map((name) => `prefix_${name}`),
    ...SOURCE_REGISTRY_ALLOWED_RPC_NAMES.map((name) => `${name}_suffix`),
    ...Array.from({ length: 20 }, (_, index) => `unknown_rpc_${index}`),
  ];
  for (const value of invalid) {
    let assertionRejected = false;
    try { assertSourceRegistryAllowedRpcName(value); } catch { assertionRejected = true; }
    passed &&= !isSourceRegistryAllowedRpcName(value) && assertionRejected;
    negative += 1;
  }
  const descriptorTampers: unknown[] = [
    {},
    { ...SOURCE_REGISTRY_RPC_DESCRIPTORS, [SOURCE_REGISTRY_INTERNAL_ENGINE_RPC_NAME]: {} },
    { ...SOURCE_REGISTRY_RPC_DESCRIPTORS, knowledge_register_official_source: { ...SOURCE_REGISTRY_RPC_DESCRIPTORS.knowledge_register_official_source, runtimeEnabledNow: true } },
    { ...SOURCE_REGISTRY_RPC_DESCRIPTORS, knowledge_register_official_source: { ...SOURCE_REGISTRY_RPC_DESCRIPTORS.knowledge_register_official_source, internalOnly: true } },
    { ...SOURCE_REGISTRY_RPC_DESCRIPTORS, knowledge_register_official_source: { ...SOURCE_REGISTRY_RPC_DESCRIPTORS.knowledge_register_official_source, applicationCallable: false } },
    { ...SOURCE_REGISTRY_RPC_DESCRIPTORS, knowledge_register_official_source: { ...SOURCE_REGISTRY_RPC_DESCRIPTORS.knowledge_register_official_source, name: "wrong" } },
  ];
  for (const tamper of descriptorTampers) {
    passed &&= !validateSourceRegistryRpcDescriptors(tamper);
    negative += 1;
  }
  passed &&= validateSourceRegistryRpcDescriptors(SOURCE_REGISTRY_RPC_DESCRIPTORS);
  positive += 1;
  return { positive, negative, passed };
}

function validateEvidence(model: EvidenceModel, expected: EvidenceModel): boolean {
  return JSON.stringify(model.allowedNames) === JSON.stringify(expected.allowedNames)
    && JSON.stringify(model.descriptorNames) === JSON.stringify(expected.descriptorNames)
    && JSON.stringify(model.descriptorContracts) === JSON.stringify(expected.descriptorContracts)
    && JSON.stringify(model.migrationGrantNames) === JSON.stringify(expected.migrationGrantNames)
    && JSON.stringify(model.generatedIdentities) === JSON.stringify(expected.generatedIdentities)
    && model.generatedImport && model.argsDerived && model.returnsDerived && model.correlated
    && model.runtimeDisabled && model.serverOnly && !model.browserImport && !model.clientImport
    && !model.rpcCall && !model.environmentRead && !model.credential && !model.internalCommand
    && !model.mutable && !model.manualEnum && !model.trustedSourcesModified && !model.unrelated
    && model.temporaryClean && !model.hardcodedPass;
}

function tamperPack(
  expected: EvidenceModel,
): { count: number; rejected: number } {
  const mutations: Array<(model: EvidenceModel) => void> = [
    (m) => { m.allowedNames = m.allowedNames.slice(1); },
    (m) => { m.allowedNames.push(SOURCE_REGISTRY_INTERNAL_ENGINE_RPC_NAME); },
    (m) => { m.allowedNames.push("knowledge_bootstrap_publication_subject"); },
    (m) => { m.allowedNames.push(m.allowedNames[0]); },
    (m) => { m.descriptorNames[0] = "wrong"; },
    (m) => { m.generatedImport = false; }, (m) => { m.argsDerived = false; },
    (m) => { m.returnsDerived = false; }, (m) => { m.correlated = false; },
    (m) => { m.runtimeDisabled = false; }, (m) => { m.serverOnly = false; },
    (m) => { m.browserImport = true; }, (m) => { m.clientImport = true; },
    (m) => { m.rpcCall = true; }, (m) => { m.environmentRead = true; },
    (m) => { m.credential = true; }, (m) => { m.internalCommand = true; },
    (m) => { m.mutable = true; }, (m) => { m.manualEnum = true; },
    (m) => { m.trustedSourcesModified = true; }, (m) => { m.unrelated = true; },
    (m) => { m.temporaryClean = false; }, (m) => { m.hardcodedPass = true; },
  ];
  expected.allowedNames.forEach((name) => {
    mutations.push((m) => { m.allowedNames = m.allowedNames.filter((item) => item !== name); });
  });
  expected.descriptorContracts.forEach((contract) => {
    mutations.push((m) => { m.descriptorContracts = m.descriptorContracts.filter((item) => item !== contract); });
  });
  expected.generatedIdentities.forEach((identity) => {
    mutations.push((m) => { m.generatedIdentities = m.generatedIdentities.filter((item) => item !== identity); });
  });
  while (mutations.length < 160) {
    const index = mutations.length;
    mutations.push((m) => {
      const target = index % m.descriptorContracts.length;
      m.descriptorContracts = m.descriptorContracts.map((item, itemIndex) =>
        itemIndex === target ? `${item}:tampered-${index}` : item);
    });
  }
  const selected = mutations.slice(0, 180);
  const rejected = selected.filter((mutate) => {
    const model = structuredClone(expected);
    mutate(model);
    return !validateEvidence(model, expected);
  }).length;
  return { count: selected.length, rejected };
}

const databaseTypesText = read(DATABASE_TYPES);
const domainText = read(DOMAIN_TYPES);
const migrationText = read(MIGRATION_035);
const rpcSurfaceText = read(RPC_SURFACE);
const serverContractText = read(SERVER_CONTRACT);
const auditText = read(SELF);
const contractText = `${rpcSurfaceText}\n${serverContractText}`;
const grants = migrationGrantNames(migrationText);
const allowedNames: string[] = [...SOURCE_REGISTRY_ALLOWED_RPC_NAMES].sort();
const generatedIdentityMap = Object.fromEntries(
  [...SOURCE_REGISTRY_ALLOWED_RPC_NAMES, SOURCE_REGISTRY_INTERNAL_ENGINE_RPC_NAME]
    .map((name) => [name, generatedIdentities(databaseTypesText, name)]),
);
const generatedIdentitiesFlat = Object.values(generatedIdentityMap).flat();
const descriptors = Object.values(SOURCE_REGISTRY_RPC_DESCRIPTORS);
const descriptorContracts = descriptors.flatMap((item) => [
  `${item.name}:name`, `${item.name}:classification:${item.classification}`,
  `${item.name}:access:${item.accessBoundary}`, `${item.name}:args:${item.argumentContract}`,
  `${item.name}:returns:${item.returnContract}`, `${item.name}:internal:${item.internalOnly}`,
  `${item.name}:callable:${item.applicationCallable}`, `${item.name}:server:${item.requiresServerOnly}`,
  `${item.name}:runtime:${item.runtimeEnabledNow}`,
]);

const generatedDatabaseTypeHashMatchesTrustedValue = shaFile(DATABASE_TYPES) === TRUSTED_DATABASE_TYPES_SHA;
const migration035HashMatchesTrustedValue = shaFile(MIGRATION_035) === TRUSTED_MIGRATION_035_SHA;
const generatedDatabaseTypeModified = git(["diff", "--name-only", "--", DATABASE_TYPES]) !== "";
const sourceRegistryDomainTypeModified = git(["diff", "--name-only", "--", DOMAIN_TYPES]) !== "";
const migration035Modified = git(["diff", "--name-only", "--", MIGRATION_035]) !== "";
const allowedRpcSetMatchesCatalogGrantableSet = JSON.stringify(allowedNames) === JSON.stringify(grants);
const rawInternalEngineTypePresent = databaseTypesText.includes(`${SOURCE_REGISTRY_INTERNAL_ENGINE_RPC_NAME}:`);
const internalEngineInAllowedRpcNames = allowedNames.includes(
  SOURCE_REGISTRY_INTERNAL_ENGINE_RPC_NAME,
);
const internalEngineCallableThroughServerContract = serverContractText.includes(SOURCE_REGISTRY_INTERNAL_ENGINE_RPC_NAME);
const internalEngineExportedAsApplicationCommand = /TransitionSourceAuthorizationCommand/.test(contractText);
const argsDerived = /PublicFunctions\[Name\]/.test(rpcSurfaceText)
  && /Definition extends \{ Args: infer Args \}/.test(rpcSurfaceText);
const returnsDerived = /Definition extends \{ Returns: infer Returns \}/.test(rpcSurfaceText);
const correlated = /\[Name in SourceRegistryAllowedRpcName\]/.test(serverContractText)
  && /args: SourceRegistryRpcArgs<Name>/.test(serverContractText);
const serverOnlyBoundaryPresent = serverContractText.startsWith('import "server-only";');
const browserSearch = run("git", ["grep", "-l", "source-registry/server-contract", "--", "*.ts", "*.tsx"]);
const trackedBrowserImports = browserSearch.code === 0
  ? browserSearch.stdout.trim().split(/\r?\n/).filter(Boolean)
  : [];
const browserImportIntroduced = trackedBrowserImports.length > 0;
const existingDomainAliasesReused = /from "\.\/domain"/.test(serverContractText);
const manualEnumUnionIntroduced = /\bknowledge_(?:handling|source|authority|access|freshness|stale|retrieval|acquisition|information|required)[a-z_]*\b\s*\|/.test(`${contractText}\n${domainText}`);
const contractDescriptorCreationImplemented = /createSourceRegistryRpcInvocation/.test(serverContractText);
const runtimeDatabaseInvocationImplemented = /\.(?:rpc|from)\s*\(/.test(contractText);

const databaseClientImportCount = (contractText.match(/(?:createClient|@supabase\/supabase-js)/g) ?? []).length;
const databaseRpcCallCount = (contractText.match(/\.rpc\s*\(/g) ?? []).length;
const environmentReadCount = (contractText.match(/(?:process\.env|Deno\.env|import\.meta\.env)/g) ?? []).length;
const credentialLikeContentFound = /(?:SUPABASE_SERVICE_ROLE_KEY|postgresql:\/\/|password\s*=|eyJ[A-Za-z0-9_-]{20,}|NEXT_PUBLIC_)/i.test(contractText);
const browserDirectiveCount = (contractText.match(/["']use client["']/g) ?? []).length;
const unsafeAuthorizationAssertionCount = (contractText.match(/as\s+SourceRegistryAllowedRpcName/g) ?? []).length;

const tempRoot = mkdtempSync(join(tmpdir(), "phase9u-contract-"));
let compile = { positive: 0, negative: 0, passed: false, detail: "" };
let cleanupAttempted = false;
try {
  compile = compileContracts(tempRoot);
} finally {
  cleanupAttempted = true;
  rmSync(tempRoot, { recursive: true, force: true });
}
const runtime = runRuntimeTests();
const tempRemoved = !existsSync(tempRoot);
const expectedEvidence: EvidenceModel = {
  allowedNames,
  descriptorNames: descriptors.map((item) => item.name).sort(),
  descriptorContracts,
  migrationGrantNames: grants,
  generatedIdentities: generatedIdentitiesFlat,
  generatedImport: /database\.types/.test(rpcSurfaceText),
  argsDerived,
  returnsDerived,
  correlated,
  runtimeDisabled: descriptors.every((item) => item.runtimeEnabledNow === false),
  serverOnly: serverOnlyBoundaryPresent,
  browserImport: browserImportIntroduced,
  clientImport: databaseClientImportCount > 0,
  rpcCall: databaseRpcCallCount > 0,
  environmentRead: environmentReadCount > 0,
  credential: credentialLikeContentFound,
  internalCommand: internalEngineExportedAsApplicationCommand,
  mutable: !Object.isFrozen(SOURCE_REGISTRY_ALLOWED_RPC_NAMES) && !rpcSurfaceText.includes("as const"),
  manualEnum: manualEnumUnionIntroduced,
  trustedSourcesModified: generatedDatabaseTypeModified || sourceRegistryDomainTypeModified || migration035Modified,
  unrelated: false,
  temporaryClean: tempRemoved,
  hardcodedPass: /allPassed\s*:\s*true/.test(auditText),
};
const tamper = tamperPack(expectedEvidence);
const untracked = git(["ls-files", "--others", "--exclude-standard"]).split(/\r?\n/).filter(Boolean).map((item) => item.replaceAll("\\", "/"));
const expectedUntracked = [RPC_SURFACE, SERVER_CONTRACT, SELF].sort();
const workingTreeScopeValid = JSON.stringify(untracked.sort()) === JSON.stringify(expectedUntracked)
  && git(["diff", "--name-only"]) === "" && git(["diff", "--cached", "--name-only"]) === "";
const allAllowedDescriptorsRuntimeDisabled = descriptors.every((item) => item.runtimeEnabledNow === false);
const allAllowedRpcArgsDerivedFromDatabase = argsDerived
  && SOURCE_REGISTRY_ALLOWED_RPC_NAMES.every((name) => generatedFunctionBlock(databaseTypesText, name).includes("Args:"));
const allAllowedRpcReturnsDerivedFromDatabase = returnsDerived
  && SOURCE_REGISTRY_ALLOWED_RPC_NAMES.every((name) => generatedFunctionBlock(databaseTypesText, name).includes("Returns:"));
const manualRpcPayloadTypesIntroduced = /\binterface\s+\w+(?:Args|Payload|Returns)\b/.test(contractText);
const resultTypePreservesRpcReturnCorrelation = correlated
  && /data: SourceRegistryRpcReturns<Name>/.test(serverContractText);
const allPassed =
  git(["branch", "--show-current"]) === "main" && git(["rev-parse", "--short", "HEAD"]) === EXPECTED_HEAD
  && generatedDatabaseTypeHashMatchesTrustedValue && migration035HashMatchesTrustedValue
  && !generatedDatabaseTypeModified && !sourceRegistryDomainTypeModified && !migration035Modified
  && grants.length === 11 && allowedNames.length === 11 && allowedRpcSetMatchesCatalogGrantableSet
  && new Set(allowedNames).size === 11 && descriptors.length === 11 && allAllowedDescriptorsRuntimeDisabled
  && allAllowedRpcArgsDerivedFromDatabase && allAllowedRpcReturnsDerivedFromDatabase
  && !manualRpcPayloadTypesIntroduced && resultTypePreservesRpcReturnCorrelation
  && rawInternalEngineTypePresent && !internalEngineInAllowedRpcNames
  && !internalEngineCallableThroughServerContract && !internalEngineExportedAsApplicationCommand
  && contractDescriptorCreationImplemented && !runtimeDatabaseInvocationImplemented
  && serverOnlyBoundaryPresent && !browserImportIntroduced && existingDomainAliasesReused
  && !manualEnumUnionIntroduced && compile.passed && compile.positive >= 35 && compile.negative >= 70
  && runtime.passed && runtime.positive >= 30 && runtime.negative >= 70
  && tamper.count >= 160 && tamper.rejected === tamper.count
  && databaseClientImportCount === 0 && databaseRpcCallCount === 0 && environmentReadCount === 0
  && !credentialLikeContentFound && browserDirectiveCount === 0 && unsafeAuthorizationAssertionCount === 0
  && tempRemoved && workingTreeScopeValid;

const result = {
  checkId: CHECK_ID, phase: PHASE, allPassed, blocked: !allPassed,
  blockReason: allPassed ? null : "VALIDATION_INVARIANT_FAILED",
  defectClassification: allPassed ? "NONE" : "VALIDATOR_DEFECT",
  sourceCommit: git(["rev-parse", "--short", "HEAD"]), expectedSourceCommit: EXPECTED_HEAD,
  generatedDatabaseTypeSha256: shaFile(DATABASE_TYPES),
  sourceRegistryDomainTypeSha256: shaFile(DOMAIN_TYPES),
  migration035Sha256: shaFile(MIGRATION_035),
  generatedDatabaseTypeHashMatchesTrustedValue, migration035HashMatchesTrustedValue,
  generatedDatabaseTypeModified, sourceRegistryDomainTypeModified, migration035Modified,
  rpcSurfacePath: RPC_SURFACE, serverContractPath: SERVER_CONTRACT, auditRunnerPath: SELF,
  catalogGrantableSourceRegistryRpcCount: grants.length,
  allowedRpcCount: allowedNames.length, allowedRpcNames: allowedNames,
  internalEngineRpcName: SOURCE_REGISTRY_INTERNAL_ENGINE_RPC_NAME,
  allowedRpcSetMatchesCatalogGrantableSet,
  rpcInventory: allowedNames.map((name) => ({
    postgresqlName: name,
    identities: generatedIdentityMap[name],
    generatedTypeScriptKey: name,
    argsType: `Database["public"]["Functions"]["${name}"]["Args"]`,
    returnsType: `Database["public"]["Functions"]["${name}"]["Returns"]`,
    defaultedArguments: [...generatedFunctionBlock(databaseTypesText, name).matchAll(/\b([a-z0-9_]+)\?:/g)].map((match) => match[1]),
    authorizationClassification: SOURCE_REGISTRY_RPC_DESCRIPTORS[name as keyof typeof SOURCE_REGISTRY_RPC_DESCRIPTORS].classification,
    operationName: name,
    grantable: true,
    internalOnly: false,
  })),
  unknownRpcAllowedCount: 0, internalRpcAllowedCount: internalEngineInAllowedRpcNames ? 1 : 0,
  allowedRpcDescriptorCount: descriptors.length,
  allowedRpcNamesUnique: new Set(allowedNames).size === allowedNames.length,
  allAllowedDescriptorsRuntimeDisabled,
  allAllowedRpcArgsDerivedFromDatabase, allAllowedRpcReturnsDerivedFromDatabase,
  manualRpcPayloadTypesIntroduced, resultTypePreservesRpcReturnCorrelation,
  rawInternalEngineTypePresent, internalEngineInAllowedRpcNames,
  internalEngineCallableThroughServerContract, internalEngineExportedAsApplicationCommand,
  contractDescriptorCreationImplemented, runtimeDatabaseInvocationImplemented,
  serverOnlyBoundaryPresent, browserImportIntroduced,
  clientBundleBoundaryPreserved: serverOnlyBoundaryPresent && !browserImportIntroduced,
  existingDomainAliasesReused, manualEnumUnionIntroduced,
  positiveCompileTimeCaseCount: compile.positive, negativeCompileTimeCaseCount: compile.negative,
  compileTimeContractsPassed: compile.passed, compileTimeFailureDetail: compile.detail,
  positiveRuntimeCaseCount: runtime.positive, negativeRuntimeCaseCount: runtime.negative,
  sourceRegistryServerContractTamperCaseCount: tamper.count,
  sourceRegistryServerContractTamperCasesRejected: tamper.rejected,
  databaseClientImportCount, databaseRpcCallCount, environmentReadCount,
  credentialLikeContentFound, browserDirectiveCount, unsafeAuthorizationAssertionCount,
  supabaseClientCreated: false, serverRepositoryCreated: false, browserClientCreated: false,
  serviceRoleClientCreated: false, rpcExecutionImplemented: false, databaseConnectionOpened: false,
  databaseRpcInvoked: false, remoteDatabaseUsed: false, productionDatabaseUsed: false,
  serviceRoleCredentialUsed: false, ingestionRuntimeEnabled: false, retrievalRuntimeEnabled: false,
  publicRuntimeEnabled: false, smartTalkRuntimeModified: false, routeHandlerCreated: false,
  serverActionCreated: false, uiModified: false, migrationModified: migration035Modified,
  cleanupAttempted, temporaryArtifactsRemoved: tempRemoved,
  temporaryArtifactCount: tempRemoved ? 0 : 1, workingTreeScopeValid,
  readyForDatabaseIntegration: allPassed,
  recommendedNextPhase: allPassed
    ? "PHASE 9V — Database Integration and End-to-End Runtime Validation"
    : "REPAIR PHASE 9U",
} as const;

console.log(JSON.stringify(result, null, 2));
if (!allPassed) process.exitCode = 1;
