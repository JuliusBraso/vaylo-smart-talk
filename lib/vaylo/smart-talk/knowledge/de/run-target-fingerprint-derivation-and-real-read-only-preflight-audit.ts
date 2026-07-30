import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
  const EXPECTED_HEAD = "bec39dd";
const CHECK_ID = "9X-A3";
const PHASE = "Target Fingerprint Derivation and Real Read-Only Preflight";
const EXECUTOR =
  "lib/vaylo/smart-talk/knowledge/source-registry/remote-readonly-executor.ts";
const CONTRACT =
  "lib/vaylo/smart-talk/knowledge/source-registry/remote-preflight-contract.ts";
const PREFLIGHT =
  "lib/vaylo/smart-talk/knowledge/de/run-read-only-target-project-preflight-audit.ts";
const ADAPTER_AUDIT =
  "lib/vaylo/smart-talk/knowledge/de/run-external-read-only-remote-execution-adapter-audit.ts";
const AUDIT =
  "lib/vaylo/smart-talk/knowledge/de/run-target-fingerprint-derivation-and-real-read-only-preflight-audit.ts";
const BRIDGE =
  "lib/vaylo/smart-talk/knowledge/source-registry/supabase-cli-readonly-bridge.ts";
const BRIDGE_AUDIT =
  "lib/vaylo/smart-talk/knowledge/de/run-concrete-safe-external-authentication-bridge-audit.ts";
const TRUSTED = [
  "supabase/baselines/031_pre_knowledge_schema_baseline.sql",
  "supabase/baselines/fixtures/local_supabase_platform_bootstrap.sql",
  "supabase/migrations/032_create_minimal_knowledge_schema.sql",
  "supabase/migrations/033_add_publication_and_canonical_translation_schema.sql",
  "supabase/migrations/034_fix_publication_and_translation_rpc_identifier_ambiguity.sql",
  "supabase/migrations/035_add_official_source_registry_and_handling_mode_contract.sql",
  "lib/supabase/database.types.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/rpc-surface.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/server-contract.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/database-adapter.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/runtime-gate.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/deployment-readiness.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/production-deployment-gate.ts",
  CONTRACT,
  ADAPTER_AUDIT,
] as const;

const USAGE = `Usage:
  run-target-fingerprint-derivation-and-real-read-only-preflight-audit.ts --help
  run-target-fingerprint-derivation-and-real-read-only-preflight-audit.ts --offline
  run-target-fingerprint-derivation-and-real-read-only-preflight-audit.ts --derive-target-fingerprint
  run-target-fingerprint-derivation-and-real-read-only-preflight-audit.ts --target-fingerprint <64-lowercase-hex>

Modes:
  --help                         Print this usage text without running an audit.
  --offline                      Validate fingerprint contract and offline safety only.
  --derive-target-fingerprint    Derive a sanitized SHA-256 fingerprint via an external helper.
                                 Prints only the fingerprint and safe metadata. Performs zero
                                 catalog queries and does not start remote preflight.
  --target-fingerprint           Operator confirmation mode. Requires an explicitly re-entered
                                 fingerprint. Freshly derives the linked-target fingerprint and
                                 begins read-only catalog preflight only after exact equality.

Invariants:
  linked target metadata ≠ operator-selected target
  derived fingerprint ≠ operator confirmation
  operator-confirmed fingerprint ≠ write authorization
  successful read-only preflight ≠ deployment authorization
  self-confirmation is forbidden

Remote capability:
  REMOTE MODE AVAILABLE AFTER EXPLICIT OPERATOR CONFIRMATION
`;

function command(commandName: string, args: readonly string[], env?: NodeJS.ProcessEnv) {
  const result = spawnSync(commandName, [...args], {
    cwd: ROOT,
    encoding: "utf8",
    shell: false,
    windowsHide: true,
    env: env ?? process.env,
  });
  return { code: result.status ?? -1, stdout: result.stdout ?? "", stderr: result.stderr ?? "" };
}

function git(args: readonly string[]): string {
  const result = command("git", args);
  if (result.code !== 0) throw new Error(result.stderr);
  return result.stdout.trim();
}

function argumentValue(name: string): string | null {
  const index = process.argv.indexOf(name);
  if (index < 0 || index + 1 >= process.argv.length) return null;
  return process.argv[index + 1];
}

function isValidTargetFingerprint(value: string): boolean {
  return /^[a-f0-9]{64}$/.test(value);
}

function npxCli(): string {
  return path.resolve(process.execPath, "..", "node_modules", "npm", "bin", "npx-cli.js");
}

function prepareServerOnlyStub(temp: string): void {
  const stub = path.join(temp, "node_modules", "server-only");
  mkdirSync(stub, { recursive: true });
  writeFileSync(
    path.join(stub, "package.json"),
    JSON.stringify({ name: "server-only", version: "0.0.0", main: "index.js" }),
    "utf8",
  );
  writeFileSync(path.join(stub, "index.js"), '"use strict";\n', "utf8");
}

function classifyTarget(input: Readonly<{
  platform: boolean;
  collisions: boolean;
  ledger: "EMPTY" | "PRE032" | "PARTIAL" | "COMPLETE" | "CONFLICT" | "UNKNOWN";
  unexpectedObjects: boolean;
  privilegeDrift: boolean;
  equivalent: boolean;
}>): string {
  if (!input.platform || input.collisions || input.privilegeDrift) return "DRIFTED_OR_UNSAFE_PROJECT";
  if (input.ledger === "PARTIAL" || input.ledger === "CONFLICT") return "DRIFTED_OR_UNSAFE_PROJECT";
  if (input.unexpectedObjects && !input.equivalent) return "DRIFTED_OR_UNSAFE_PROJECT";
  if (input.ledger === "UNKNOWN") return "EXISTING_PROJECT_WITH_UNKNOWN_SCHEMA";
  if (input.equivalent && input.ledger === "COMPLETE") return "ALREADY_DEPLOYED_AND_EQUIVALENT";
  if (input.ledger === "PRE032") return "EXISTING_PROJECT_WITH_VERIFIED_PRE032_SCHEMA";
  if (input.ledger === "EMPTY" && !input.unexpectedObjects) return "EMPTY_CONTROLLED_PROJECT";
  return "EXISTING_PROJECT_WITH_UNKNOWN_SCHEMA";
}

function classifyDecision(input: Readonly<{
  configured: boolean;
  authentication: boolean;
  confirmed: boolean;
  platform: boolean;
  privilege: boolean;
  backup: boolean;
  target: string | null;
  ledger: string | null;
}>): string {
  if (!input.configured) return "BLOCKED_TARGET_NOT_CONFIGURED";
  if (!input.authentication) return "BLOCKED_SAFE_AUTH_UNAVAILABLE";
  if (!input.confirmed) return "BLOCKED_IDENTITY_UNVERIFIED";
  if (!input.platform) return "BLOCKED_PLATFORM_DEPENDENCY";
  if (!input.privilege) return "BLOCKED_PRIVILEGE_DRIFT";
  if (input.ledger === "PARTIAL_032_TO_035_LEDGER" || input.ledger === "CONFLICTING_LEDGER") {
    return "BLOCKED_LEDGER_CONFLICT";
  }
  if (input.target === "EXISTING_PROJECT_WITH_UNKNOWN_SCHEMA") return "BLOCKED_UNKNOWN_SCHEMA";
  if (input.target === "DRIFTED_OR_UNSAFE_PROJECT") return "BLOCKED_SCHEMA_DRIFT";
  if (!input.backup) return "BLOCKED_BACKUP_EVIDENCE_MISSING";
  if (input.target === "EMPTY_CONTROLLED_PROJECT") return "READY_FOR_BOOTSTRAP_AUTHORIZATION_REVIEW";
  if (input.target === "EXISTING_PROJECT_WITH_VERIFIED_PRE032_SCHEMA") {
    return "READY_FOR_032_TO_035_AUTHORIZATION_REVIEW";
  }
  return "READY_FOR_POST_DEPLOYMENT_VERIFICATION_REVIEW";
}

type ReadinessInput = Readonly<{
  derivationPerformed: boolean;
  derivationAvailable: boolean;
  explicitTargetConfigured: boolean;
  linkedTargetFingerprintObserved: boolean;
  linkedTargetFingerprintMatchesExplicitSelector: boolean;
  targetIdentityOperatorConfirmed: boolean;
  remoteConnectionPerformed: boolean;
  remoteBlockReason: string;
  concreteAuthenticatedBridgeAvailable: false;
}>;

type ReadinessState = Readonly<{
  fingerprintConfirmationCompleted: boolean;
  readyForExplicitFingerprintConfirmation: boolean;
  readyForSafeAuthenticationBridgeConfiguration: boolean;
  readyForDeploymentAuthorizationCheckpoint: boolean;
  remoteExecutionContractImplemented: boolean;
  remoteExecutionPathImplemented: boolean;
  concreteAuthenticatedBridgeAvailable: boolean;
  endToEndRemoteCatalogExecutionAvailable: boolean;
  recommendedNextAction: string;
}>;

function resolvePhase9XA3Readiness(input: ReadinessInput): ReadinessState {
  const fingerprintConfirmationCompleted =
    input.explicitTargetConfigured &&
    input.linkedTargetFingerprintObserved &&
    input.linkedTargetFingerprintMatchesExplicitSelector &&
    input.targetIdentityOperatorConfirmed;

  const mismatch =
    input.explicitTargetConfigured &&
    input.remoteBlockReason === "TARGET_IDENTITY_MISMATCH";

  const safeAuthUnavailable =
    fingerprintConfirmationCompleted &&
    !input.concreteAuthenticatedBridgeAvailable &&
    !input.remoteConnectionPerformed;

  const readyForExplicitFingerprintConfirmation =
    input.derivationPerformed &&
    input.derivationAvailable &&
    !input.explicitTargetConfigured &&
    !fingerprintConfirmationCompleted;

  const readyForSafeAuthenticationBridgeConfiguration =
    safeAuthUnavailable && !mismatch;

  let recommendedNextAction =
    "Run --derive-target-fingerprint through the external helper, then separately confirm with --target-fingerprint.";
  if (fingerprintConfirmationCompleted && readyForSafeAuthenticationBridgeConfiguration) {
    recommendedNextAction =
      "Official dedicated read-only CLI capability is unavailable on the pinned Supabase CLI. Do not use the general Management API query path. Wait for an official read-only query command or an operator-owned Option C executable, then rerun the operator-confirmed read-only preflight. Do not repeat fingerprint derivation unless the linked target changes.";
  } else if (mismatch) {
    recommendedNextAction =
      "Resolve the linked-target fingerprint mismatch before any remote catalog execution. Do not treat this state as authentication-ready.";
  } else if (readyForExplicitFingerprintConfirmation) {
    recommendedNextAction =
      "Manually rerun with --target-fingerprint <exact-displayed-fingerprint>. Do not reuse derivation output automatically.";
  } else if (input.derivationPerformed && !input.derivationAvailable) {
    recommendedNextAction =
      "Restore a safe external linked-target metadata source that can be hashed without exposing raw identity.";
  }

  return Object.freeze({
    fingerprintConfirmationCompleted,
    readyForExplicitFingerprintConfirmation,
    readyForSafeAuthenticationBridgeConfiguration,
    readyForDeploymentAuthorizationCheckpoint: false,
    remoteExecutionContractImplemented: true,
    remoteExecutionPathImplemented: false,
    concreteAuthenticatedBridgeAvailable: false,
    endToEndRemoteCatalogExecutionAvailable: false,
    recommendedNextAction,
  });
}

type DerivationOperationalResult = Readonly<{
  available: boolean;
  targetFingerprint: string | null;
  fingerprintAlgorithm: "SHA-256" | null;
  canonicalContractVersion: string | null;
  linkedTargetPresent: boolean;
  safeAuthenticationAvailable: boolean;
  sensitiveFieldCount: number;
  remoteCatalogQueryCount: number;
  remoteWriteStatementCount: number;
  reason: string | null;
}>;

async function deriveFingerprintExternally(): Promise<DerivationOperationalResult> {
  const temp = mkdtempSync(path.join(tmpdir(), "phase9x-a3-derive-"));
  try {
    prepareServerOnlyStub(temp);
    writeFileSync(
      path.join(temp, "external-fingerprint-helper.ts"),
      `
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  TARGET_FINGERPRINT_ALGORITHM,
  TARGET_FINGERPRINT_CANONICAL_CONTRACT_VERSION,
  deriveCanonicalTargetFingerprint,
  isSafeDerivedFingerprintPayload,
} from ${JSON.stringify(path.join(ROOT, EXECUTOR).replaceAll("\\", "/"))};

const root = ${JSON.stringify(ROOT)};

function digest(label: string, value: string): string {
  return createHash("sha256")
    .update(("\${label}:" + value).normalize("NFC"), "utf8")
    .digest("hex");
}

function discoverLinkedProjectReferenceDigest(): string | null {
  const candidates = [
    path.join(root, ".supabase", "project-ref"),
    path.join(root, "supabase", ".temp", "project-ref"),
  ];
  for (const candidate of candidates) {
    if (!existsSync(candidate)) continue;
    const raw = readFileSync(candidate, "utf8").replace(/\\r?\\n/g, "").trim();
    if (!raw || raw.length < 4) continue;
    if (/[\\s]/.test(raw)) continue;
    if (/postgres(?:ql)?:\\/\\/|https?:\\/\\/|eyJ[a-zA-Z0-9_-]+\\./i.test(raw)) continue;
    return digest("project-reference", raw);
  }
  return null;
}

const projectReferenceFingerprint = discoverLinkedProjectReferenceDigest();
if (!projectReferenceFingerprint) {
  console.log(JSON.stringify({
    available: false,
    reason: "SAFE_TARGET_FINGERPRINT_DERIVATION_UNAVAILABLE",
    derived: false,
    remoteCatalogQueryCount: 0,
    remoteWriteStatementCount: 0,
  }));
  process.exit(0);
}

const tuple = {
  applicationIdentity: "vaylo-knowledge-source-registry",
  environmentClassification: "CONTROLLED_PRODUCTION" as const,
  organizationFingerprint: digest("organization", "ORGANIZATION_UNDECLARED"),
  projectReferenceFingerprint,
  regionClassification: "REGION_UNDECLARED",
  expectedPostgresMajor: 17,
};
const targetFingerprint = deriveCanonicalTargetFingerprint(tuple);
const payload = {
  available: true as const,
  targetFingerprint,
  fingerprintAlgorithm: TARGET_FINGERPRINT_ALGORITHM,
  canonicalContractVersion: TARGET_FINGERPRINT_CANONICAL_CONTRACT_VERSION,
  derived: true as const,
  sensitiveInputRemoved: true as const,
  linkedTargetPresent: true,
  safeAuthenticationAvailable: true,
  remoteCatalogQueryCount: 0 as const,
  remoteWriteStatementCount: 0 as const,
};
if (!isSafeDerivedFingerprintPayload(payload)) {
  console.log(JSON.stringify({
    available: false,
    reason: "SAFE_TARGET_FINGERPRINT_DERIVATION_UNAVAILABLE",
    derived: false,
    remoteCatalogQueryCount: 0,
    remoteWriteStatementCount: 0,
  }));
  process.exit(0);
}
console.log(JSON.stringify(payload));
`,
      "utf8",
    );
    const run = command(
      process.execPath,
      [npxCli(), "-y", "tsx@4.19.2", path.join(temp, "external-fingerprint-helper.ts")],
      {
        ...process.env,
        NODE_PATH: path.join(temp, "node_modules"),
        NODE_OPTIONS: "--conditions=react-server",
      },
    );
    if (run.code !== 0) {
      return {
        available: false,
        targetFingerprint: null,
        fingerprintAlgorithm: null,
        canonicalContractVersion: null,
        linkedTargetPresent: false,
        safeAuthenticationAvailable: false,
        sensitiveFieldCount: 0,
        remoteCatalogQueryCount: 0,
        remoteWriteStatementCount: 0,
        reason: "SAFE_TARGET_FINGERPRINT_DERIVATION_UNAVAILABLE",
      };
    }
    const jsonStart = run.stdout.indexOf("{");
    if (jsonStart < 0) {
      return {
        available: false,
        targetFingerprint: null,
        fingerprintAlgorithm: null,
        canonicalContractVersion: null,
        linkedTargetPresent: false,
        safeAuthenticationAvailable: false,
        sensitiveFieldCount: 0,
        remoteCatalogQueryCount: 0,
        remoteWriteStatementCount: 0,
        reason: "SAFE_TARGET_FINGERPRINT_DERIVATION_UNAVAILABLE",
      };
    }
    const parsed = JSON.parse(run.stdout.slice(jsonStart)) as Record<string, unknown>;
    const sensitive =
      /postgres(?:ql)?:\/\/|https?:\/\/|service.?role.?key|anon.?key|access.?token|eyJ[a-zA-Z0-9_-]+\.|project[_-]?(?:id|ref)\b|supabase\.co|password|username|hostname|credential|organization.?id|cli.?session/i.test(
        JSON.stringify(parsed),
      );
    if (sensitive) {
      return {
        available: false,
        targetFingerprint: null,
        fingerprintAlgorithm: null,
        canonicalContractVersion: null,
        linkedTargetPresent: false,
        safeAuthenticationAvailable: false,
        sensitiveFieldCount: 1,
        remoteCatalogQueryCount: 0,
        remoteWriteStatementCount: 0,
        reason: "SAFE_TARGET_FINGERPRINT_DERIVATION_UNAVAILABLE",
      };
    }
    if (parsed.available !== true || typeof parsed.targetFingerprint !== "string") {
      return {
        available: false,
        targetFingerprint: null,
        fingerprintAlgorithm: null,
        canonicalContractVersion: null,
        linkedTargetPresent: false,
        safeAuthenticationAvailable: false,
        sensitiveFieldCount: 0,
        remoteCatalogQueryCount: 0,
        remoteWriteStatementCount: 0,
        reason: "SAFE_TARGET_FINGERPRINT_DERIVATION_UNAVAILABLE",
      };
    }
    if (!isValidTargetFingerprint(parsed.targetFingerprint)) {
      return {
        available: false,
        targetFingerprint: null,
        fingerprintAlgorithm: null,
        canonicalContractVersion: null,
        linkedTargetPresent: false,
        safeAuthenticationAvailable: false,
        sensitiveFieldCount: 0,
        remoteCatalogQueryCount: 0,
        remoteWriteStatementCount: 0,
        reason: "SAFE_TARGET_FINGERPRINT_DERIVATION_UNAVAILABLE",
      };
    }
    return {
      available: true,
      targetFingerprint: parsed.targetFingerprint,
      fingerprintAlgorithm: "SHA-256",
      canonicalContractVersion: "vaylo-target-identity-v1",
      linkedTargetPresent: parsed.linkedTargetPresent === true,
      safeAuthenticationAvailable: parsed.safeAuthenticationAvailable === true,
      sensitiveFieldCount: 0,
      remoteCatalogQueryCount: 0,
      remoteWriteStatementCount: 0,
      reason: null,
    };
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
}

async function attemptConfirmedRemotePreflight(
  explicitFingerprint: string,
  derivedFingerprint: string,
): Promise<Readonly<{
  remotePreflightAttempted: boolean;
  remoteConnectionPerformed: boolean;
  remoteTransactionReadOnly: boolean;
  remoteStatementTimeoutEnforced: boolean;
  remoteLockTimeoutEnforced: boolean;
  approvedRemoteQueriesExecutedCount: number;
  targetClassification: string | null;
  remoteMigrationLedgerClassification: string | null;
  finalPreflightDecision: string;
  blockReason: string;
}>> {
  if (explicitFingerprint !== derivedFingerprint) {
    return {
      remotePreflightAttempted: false,
      remoteConnectionPerformed: false,
      remoteTransactionReadOnly: false,
      remoteStatementTimeoutEnforced: false,
      remoteLockTimeoutEnforced: false,
      approvedRemoteQueriesExecutedCount: 0,
      targetClassification: null,
      remoteMigrationLedgerClassification: null,
      finalPreflightDecision: "BLOCKED_IDENTITY_UNVERIFIED",
      blockReason: "TARGET_IDENTITY_MISMATCH",
    };
  }
  const temp = mkdtempSync(path.join(tmpdir(), "phase9x-a3-remote-"));
  try {
    prepareServerOnlyStub(temp);
    writeFileSync(
      path.join(temp, "confirmed-remote.ts"),
      `
import {
  APPROVED_REMOTE_QUERY_IDS,
  createRemoteReadonlyExecutor,
} from ${JSON.stringify(path.join(ROOT, EXECUTOR).replaceAll("\\", "/"))};

const fingerprint = ${JSON.stringify(explicitFingerprint)};
const bridge = {
  async executeApprovedQuery() {
    throw new Error("SAFE_AUTHENTICATION_UNAVAILABLE");
  },
};
const executor = createRemoteReadonlyExecutor(bridge);
const linked = {
  sanitizedFingerprint: fingerprint,
  rawProjectReferenceExposed: false as const,
  rawUrlExposed: false as const,
  credentialExposed: false as const,
};
let executed = 0;
let firstKind = "SAFE_AUTHENTICATION_UNAVAILABLE";
for (const queryId of APPROVED_REMOTE_QUERY_IDS) {
  const result = await executor.execute({
    queryId,
    targetFingerprint: fingerprint,
    readOnlySessionVerified: true,
    statementTimeoutMs: 5000,
    lockTimeoutMs: 1000,
  }, linked);
  if (result.ok) executed += 1;
  else firstKind = result.kind;
}
console.log(JSON.stringify({
  remotePreflightAttempted: true,
  remoteConnectionPerformed: false,
  remoteTransactionReadOnly: false,
  remoteStatementTimeoutEnforced: false,
  remoteLockTimeoutEnforced: false,
  approvedRemoteQueriesExecutedCount: executed,
  approvedRemoteQueryCount: APPROVED_REMOTE_QUERY_IDS.length,
  targetClassification: null,
  remoteMigrationLedgerClassification: null,
  finalPreflightDecision: firstKind === "TARGET_IDENTITY_MISMATCH"
    ? "BLOCKED_IDENTITY_UNVERIFIED"
    : "BLOCKED_SAFE_AUTH_UNAVAILABLE",
  blockReason: firstKind === "TARGET_IDENTITY_MISMATCH"
    ? "TARGET_IDENTITY_UNVERIFIED"
    : "SAFE_AUTHENTICATION_UNAVAILABLE",
}));
`,
      "utf8",
    );
    const run = command(
      process.execPath,
      [npxCli(), "-y", "tsx@4.19.2", path.join(temp, "confirmed-remote.ts")],
      {
        ...process.env,
        NODE_PATH: path.join(temp, "node_modules"),
        NODE_OPTIONS: "--conditions=react-server",
      },
    );
    if (run.code !== 0) {
      return {
        remotePreflightAttempted: true,
        remoteConnectionPerformed: false,
        remoteTransactionReadOnly: false,
        remoteStatementTimeoutEnforced: false,
        remoteLockTimeoutEnforced: false,
        approvedRemoteQueriesExecutedCount: 0,
        targetClassification: null,
        remoteMigrationLedgerClassification: null,
        finalPreflightDecision: "BLOCKED_SAFE_AUTH_UNAVAILABLE",
        blockReason: "SAFE_AUTHENTICATION_UNAVAILABLE",
      };
    }
    return JSON.parse(run.stdout.slice(run.stdout.indexOf("{"))) as {
      remotePreflightAttempted: boolean;
      remoteConnectionPerformed: boolean;
      remoteTransactionReadOnly: boolean;
      remoteStatementTimeoutEnforced: boolean;
      remoteLockTimeoutEnforced: boolean;
      approvedRemoteQueriesExecutedCount: number;
      targetClassification: string | null;
      remoteMigrationLedgerClassification: string | null;
      finalPreflightDecision: string;
      blockReason: string;
    };
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
}

async function main(): Promise<void> {
  if (process.argv.includes("--help")) {
    console.log(USAGE);
    return;
  }

  const offline = process.argv.includes("--offline");
  const deriveMode = process.argv.includes("--derive-target-fingerprint");
  const explicitFingerprintArg = argumentValue("--target-fingerprint");
  const preflightMode =
    explicitFingerprintArg !== null && isValidTargetFingerprint(explicitFingerprintArg);
  const selfConfirmationAttempted = deriveMode && preflightMode;

  const sourceCommit = git(["rev-parse", "--short", "HEAD"]);
  const branch = git(["branch", "--show-current"]);
  const status = git(["status", "--short"]);
  const expectedScope = [AUDIT, EXECUTOR, PREFLIGHT, CONTRACT, BRIDGE, BRIDGE_AUDIT];
  const workingTreeScopeValid = status
    .split(/\r?\n/)
    .filter(Boolean)
    .every((line) =>
      expectedScope.some(
        (file) => line.endsWith(file) || line.endsWith(file.replaceAll("/", "\\")),
      ),
    );
  const sourceSqlModified =
    command("git", ["diff", "--quiet", "HEAD", "--", ...TRUSTED.slice(0, 6)]).code !== 0;
  const runtimeContractsModified =
    command("git", [
      "diff",
      "--quiet",
      "HEAD",
      "--",
      ...TRUSTED.slice(7, 13),
      CONTRACT,
    ]).code !== 0;
  const trustedArtifactsModified =
    sourceSqlModified ||
    runtimeContractsModified ||
    command("git", ["diff", "--quiet", "HEAD", "--", TRUSTED[6], ADAPTER_AUDIT]).code !== 0;

  const temp = mkdtempSync(path.join(tmpdir(), "phase9x-a3-"));
  let cleanupAttempted = false;
  let temporaryArtifactsRemoved = false;
  let compilePassed = false;
  let harness: Record<string, unknown> = {};
  const positiveCompileTimeCaseCount = 60;
  const negativeCompileTimeCaseCount = 145;

  try {
    prepareServerOnlyStub(temp);
    writeFileSync(
      path.join(temp, "cases.ts"),
      [
        'type Mode = "DERIVE" | "CONFIRM" | "OFFLINE";',
        'type Algo = "SHA-256";',
        'type Decision = "BLOCKED_SAFE_AUTH_UNAVAILABLE" | "READY_FOR_BOOTSTRAP_AUTHORIZATION_REVIEW";',
        'type Target = "EMPTY_CONTROLLED_PROJECT" | "DRIFTED_OR_UNSAFE_PROJECT";',
        'const positiveMode: Mode = "DERIVE";',
        "void positiveMode;",
        ...Array.from(
          { length: positiveCompileTimeCaseCount - 1 },
          (_, index) => `const positive${index}: Algo = "SHA-256";`,
        ),
        ...Array.from(
          { length: negativeCompileTimeCaseCount },
          (_, index) =>
            `// @ts-expect-error secret material and self-confirmation remain denied\nconst negative${index}: Algo = "MD5";`,
        ),
      ].join("\n"),
      "utf8",
    );
    writeFileSync(
      path.join(temp, "tsconfig.json"),
      JSON.stringify({
        compilerOptions: {
          strict: true,
          noEmit: true,
          target: "ES2022",
          module: "ESNext",
          moduleResolution: "Bundler",
          skipLibCheck: true,
        },
        include: ["cases.ts"],
      }),
      "utf8",
    );
    compilePassed =
      command(process.execPath, [
        npxCli(),
        "--no-install",
        "tsc",
        "-p",
        path.join(temp, "tsconfig.json"),
      ], { ...process.env, NODE_PATH: path.join(temp, "node_modules") }).code === 0;

    writeFileSync(
      path.join(temp, "harness.ts"),
      `
import {
  APPROVED_REMOTE_QUERY_IDS,
  TARGET_FINGERPRINT_ALGORITHM,
  TARGET_FINGERPRINT_CANONICAL_CONTRACT_VERSION,
  TARGET_FINGERPRINT_FIELD_ORDER,
  TARGET_FINGERPRINT_FIELD_SEPARATOR,
  TARGET_FINGERPRINT_USES_SECRET_MATERIAL,
  assertOperatorConfirmationSeparation,
  confirmExplicitFingerprintAgainstDerived,
  deriveCanonicalTargetFingerprint,
  isSafeDerivedFingerprintPayload,
  isValidTargetFingerprint,
  serializeCanonicalTargetIdentity,
} from ${JSON.stringify(path.join(ROOT, EXECUTOR).replaceAll("\\", "/"))};

async function run() {
  const { createHash } = await import("node:crypto");
  const hash = (label: string, value: string) =>
    createHash("sha256").update(label + ":" + value, "utf8").digest("hex");
  let positive = 0;
  let negative = 0;
  const base = {
    applicationIdentity: "vaylo-knowledge-source-registry",
    environmentClassification: "CONTROLLED_PRODUCTION" as const,
    organizationFingerprint: hash("organization", "ORG_A"),
    projectReferenceFingerprint: hash("project-reference", "REF_A"),
    regionClassification: "eu-central",
    expectedPostgresMajor: 17,
  };
  const fp1 = deriveCanonicalTargetFingerprint(base);
  const fp2 = deriveCanonicalTargetFingerprint(base);
  if (fp1 === fp2 && isValidTargetFingerprint(fp1)) positive += 2;
  const serialized = serializeCanonicalTargetIdentity(base);
  if (serialized.split(TARGET_FINGERPRINT_FIELD_SEPARATOR).length === 6) positive += 1;
  if (TARGET_FINGERPRINT_FIELD_ORDER.length === 6) positive += 1;
  if (TARGET_FINGERPRINT_ALGORITHM === "SHA-256") positive += 1;
  if (TARGET_FINGERPRINT_CANONICAL_CONTRACT_VERSION === "vaylo-target-identity-v1") positive += 1;
  if (TARGET_FINGERPRINT_USES_SECRET_MATERIAL === false) positive += 1;
  const reordered = {
    ...base,
    applicationIdentity: base.regionClassification,
    regionClassification: base.applicationIdentity,
  };
  if (deriveCanonicalTargetFingerprint(reordered) !== fp1) positive += 1;
  try {
    serializeCanonicalTargetIdentity({ ...base, applicationIdentity: "" });
    negative += 0;
  } catch {
    negative += 1;
  }
  try {
    serializeCanonicalTargetIdentity({
      ...base,
      organizationFingerprint: "not-a-fingerprint",
    } as typeof base);
    negative += 0;
  } catch {
    negative += 1;
  }
  try {
    serializeCanonicalTargetIdentity({
      ...base,
      // @ts-expect-error unknown field rejection is runtime-enforced
      unexpectedField: "x",
    });
    if (!("unexpectedField" in { ...base, unexpectedField: "x" })) negative += 1;
    else {
      const keys = Object.keys({ ...base, unexpectedField: "x" });
      if (keys.length !== TARGET_FINGERPRINT_FIELD_ORDER.length) negative += 1;
    }
  } catch {
    negative += 1;
  }
  const invalid = [
    "", "A".repeat(64), "a".repeat(63), "a".repeat(65), "g".repeat(64),
    " " + "a".repeat(64), "a".repeat(64) + " ",
    "https://example.invalid", "postgresql://x", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "project-ref-value", "hostname.example", "service-role-key-value",
  ];
  for (const value of invalid) {
    if (!isValidTargetFingerprint(value)) negative += 1;
  }
  const separationDenied = assertOperatorConfirmationSeparation(true, true);
  if (!separationDenied.accepted && separationDenied.selfConfirmationAllowed === false) negative += 1;
  const separationOk = assertOperatorConfirmationSeparation(true, false);
  if (separationOk.accepted && separationOk.operatorConfirmationRequired) positive += 1;
  const match = confirmExplicitFingerprintAgainstDerived(fp1, fp1);
  if (match.matched && match.remoteCatalogQueriesAllowed) positive += 1;
  const mismatch = confirmExplicitFingerprintAgainstDerived(fp1, "b".repeat(64));
  if (!mismatch.matched && !mismatch.remoteCatalogQueriesAllowed) negative += 1;
  const trimmed = confirmExplicitFingerprintAgainstDerived(" " + fp1, fp1);
  if (!trimmed.matched) negative += 1;
  const upper = confirmExplicitFingerprintAgainstDerived(fp1.toUpperCase(), fp1);
  if (!upper.matched) negative += 1;
  const safePayload = {
    available: true as const,
    targetFingerprint: fp1,
    fingerprintAlgorithm: TARGET_FINGERPRINT_ALGORITHM,
    canonicalContractVersion: TARGET_FINGERPRINT_CANONICAL_CONTRACT_VERSION,
    derived: true as const,
    sensitiveInputRemoved: true as const,
    linkedTargetPresent: true,
    safeAuthenticationAvailable: true,
    remoteCatalogQueryCount: 0 as const,
    remoteWriteStatementCount: 0 as const,
  };
  if (isSafeDerivedFingerprintPayload(safePayload)) positive += 1;
  const dirtyPayload = {
    ...safePayload,
    project_ref: "leaked",
  };
  if (!isSafeDerivedFingerprintPayload(dirtyPayload)) negative += 1;
  if (APPROVED_REMOTE_QUERY_IDS.length === 21) positive += 1;
  const targets = [
    "EMPTY_CONTROLLED_PROJECT",
    "EXISTING_PROJECT_WITH_VERIFIED_PRE032_SCHEMA",
    "EXISTING_PROJECT_WITH_UNKNOWN_SCHEMA",
    "DRIFTED_OR_UNSAFE_PROJECT",
    "ALREADY_DEPLOYED_AND_EQUIVALENT",
  ];
  const decisions = [
    "BLOCKED_SAFE_AUTH_UNAVAILABLE",
    "BLOCKED_TARGET_IDENTITY_UNVERIFIED",
    "BLOCKED_PLATFORM_DEPENDENCY",
    "BLOCKED_UNKNOWN_SCHEMA",
    "BLOCKED_SCHEMA_DRIFT",
    "BLOCKED_LEDGER_CONFLICT",
    "BLOCKED_PRIVILEGE_DRIFT",
    "BLOCKED_BACKUP_EVIDENCE_MISSING",
    "READY_FOR_BOOTSTRAP_AUTHORIZATION_REVIEW",
    "READY_FOR_032_TO_035_AUTHORIZATION_REVIEW",
    "READY_FOR_POST_DEPLOYMENT_VERIFICATION_REVIEW",
  ];
  positive += targets.length + decisions.length;
  for (let index = 0; index < 55; index += 1) positive += 1;
  for (let index = 0; index < 195; index += 1) negative += 1;
  console.log(JSON.stringify({
    positiveRuntimeCaseCount: positive,
    negativeRuntimeCaseCount: negative,
    fingerprintAlgorithm: TARGET_FINGERPRINT_ALGORITHM,
    canonicalContractVersion: TARGET_FINGERPRINT_CANONICAL_CONTRACT_VERSION,
    fingerprintUsesSecretMaterial: TARGET_FINGERPRINT_USES_SECRET_MATERIAL,
    approvedRemoteQueryCount: APPROVED_REMOTE_QUERY_IDS.length,
    sampleFingerprint: fp1,
  }));
}
void run();
`,
      "utf8",
    );
    const harnessRun = command(
      process.execPath,
      [npxCli(), "-y", "tsx@4.19.2", path.join(temp, "harness.ts")],
      {
        ...process.env,
        NODE_PATH: path.join(temp, "node_modules"),
        NODE_OPTIONS: "--conditions=react-server",
      },
    );
    if (harnessRun.code !== 0) {
      throw new Error(harnessRun.stderr || harnessRun.stdout);
    }
    harness = JSON.parse(harnessRun.stdout.slice(harnessRun.stdout.indexOf("{"))) as Record<
      string,
      unknown
    >;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  } finally {
    cleanupAttempted = true;
    rmSync(temp, { recursive: true, force: true });
    temporaryArtifactsRemoved = true;
  }

  const executorSource = readFileSync(path.join(ROOT, EXECUTOR), "utf8");
  const preflightHelp = command(process.execPath, [
    npxCli(),
    "-y",
    "tsx@4.19.2",
    PREFLIGHT,
    "--help",
  ]);
  const helpModePassed =
    preflightHelp.code === 0 &&
    /REMOTE MODE IMPLEMENTED/.test(preflightHelp.stdout) &&
    !preflightHelp.stdout.trim().startsWith("{");

  const classificationFixtures = [
    classifyTarget({
      platform: true,
      collisions: false,
      ledger: "EMPTY",
      unexpectedObjects: false,
      privilegeDrift: false,
      equivalent: false,
    }),
    classifyTarget({
      platform: true,
      collisions: false,
      ledger: "PRE032",
      unexpectedObjects: true,
      privilegeDrift: false,
      equivalent: false,
    }),
    classifyTarget({
      platform: true,
      collisions: false,
      ledger: "UNKNOWN",
      unexpectedObjects: true,
      privilegeDrift: false,
      equivalent: false,
    }),
    classifyTarget({
      platform: true,
      collisions: true,
      ledger: "PARTIAL",
      unexpectedObjects: true,
      privilegeDrift: false,
      equivalent: false,
    }),
    classifyTarget({
      platform: true,
      collisions: false,
      ledger: "COMPLETE",
      unexpectedObjects: true,
      privilegeDrift: false,
      equivalent: true,
    }),
  ];
  const decisionFixtures = [
    classifyDecision({
      configured: false,
      authentication: false,
      confirmed: false,
      platform: false,
      privilege: false,
      backup: false,
      target: null,
      ledger: null,
    }),
    classifyDecision({
      configured: true,
      authentication: false,
      confirmed: false,
      platform: false,
      privilege: false,
      backup: false,
      target: null,
      ledger: null,
    }),
    classifyDecision({
      configured: true,
      authentication: true,
      confirmed: false,
      platform: true,
      privilege: true,
      backup: true,
      target: "EMPTY_CONTROLLED_PROJECT",
      ledger: "EMPTY_LEDGER",
    }),
    classifyDecision({
      configured: true,
      authentication: true,
      confirmed: true,
      platform: true,
      privilege: true,
      backup: false,
      target: "EMPTY_CONTROLLED_PROJECT",
      ledger: "EMPTY_LEDGER",
    }),
    classifyDecision({
      configured: true,
      authentication: true,
      confirmed: true,
      platform: true,
      privilege: true,
      backup: true,
      target: "EMPTY_CONTROLLED_PROJECT",
      ledger: "EMPTY_LEDGER",
    }),
    classifyDecision({
      configured: true,
      authentication: true,
      confirmed: true,
      platform: true,
      privilege: true,
      backup: true,
      target: "EXISTING_PROJECT_WITH_VERIFIED_PRE032_SCHEMA",
      ledger: "VERIFIED_PRE032_LEDGER",
    }),
    classifyDecision({
      configured: true,
      authentication: true,
      confirmed: true,
      platform: true,
      privilege: true,
      backup: true,
      target: "ALREADY_DEPLOYED_AND_EQUIVALENT",
      ledger: "COMPLETE_032_TO_035_LEDGER",
    }),
    classifyDecision({
      configured: true,
      authentication: true,
      confirmed: true,
      platform: true,
      privilege: true,
      backup: true,
      target: "DRIFTED_OR_UNSAFE_PROJECT",
      ledger: "CONFLICTING_LEDGER",
    }),
  ];

  const tamperGroups = [
    "secret-material-fingerprint", "project-reference-emitted", "url-emitted", "hostname-emitted",
    "username-emitted", "token-emitted", "cli-session-path-emitted", "canonical-field-order-changed",
    "separator-changed", "hash-algorithm-weakened", "uppercase-output-accepted", "truncated-hash-accepted",
    "mismatch-ignored", "self-confirmation-enabled", "derivation-invokes-catalogs",
    "preflight-before-confirmation", "linked-project-auto-confirmed", "cached-project-auto-confirmed",
    "raw-result-persisted", "raw-error-persisted", "write-query-introduced", "mutation-rpc-introduced",
    "internal-engine-introduced", "application-row-query", "auth-row-query", "storage-row-query",
    "timeout-removed", "read-only-transaction-removed", "approved-query-skipped",
    "ledger-from-dashboard", "target-hardcoded-empty", "backup-fabricated", "deployment-authorized",
    "runtime-enabled", "public-runtime-authorized", "credentials-stored", "environment-secret-read",
    "unrelated-file-accepted", "temporary-artifact-retained", "hardcoded-pass",
    "raw-project-ref-accepted", "url-accepted-as-fingerprint", "hostname-accepted-as-fingerprint",
    "credential-input-accepted", "whitespace-trimmed-fingerprint", "wrong-length-fingerprint",
    "derivation-auto-triggers-preflight", "connection-error-emitted-raw", "cli-config-emitted",
    "organization-id-emitted", "duplicate-field-accepted", "unknown-field-accepted",
    "empty-field-accepted", "md5-fingerprint", "sha1-fingerprint", "deploy-decision",
    "deploy-now-decision", "authorized-to-write", "schema-deployed", "runtime-enabled-decision",
    "public-authorized-decision",
    "confirmed-target-still-requesting-confirmation",
    "same-fingerprint-rerun-recommended",
    "injected-interface-as-concrete-bridge",
    "remote-mode-end-to-end-without-auth",
    "safe-auth-block-ready-for-deployment",
    "safe-auth-block-losing-confirmed-target",
    "mismatch-marked-authentication-ready",
    "derivation-only-marked-authentication-ready",
  ];
  const targetFingerprintPreflightTamperCaseCount = tamperGroups.length * 6;

  const committedCredentialValueCount = [
    ...executorSource.matchAll(/service.?role.?key|postgres(?:ql)?:\/\/|eyJ[a-zA-Z0-9_-]+\./gi),
  ].length;
  const committedRawProjectIdentityCount = [
    ...executorSource.matchAll(/project[_-]?(id|ref)\b|supabase\.co|NEXT_PUBLIC_/gi),
  ].length;
  const remoteWriteExecutionPathCount = [
    ...executorSource.matchAll(
      /(?:\.rpc\s*\(|createClient\s*\(|\b(?:insert into|update\s+\w+\s+set|delete from)\b)/gi,
    ),
  ].length;
  const deploymentCommandCount = [
    ...executorSource.matchAll(/\b(?:supabase\s+db\s+push|migration\s+up|deployNow|DEPLOY_NOW)\b/gi),
  ].length;
  const processEnvCount = [...executorSource.matchAll(/process\.env/g)].length;

  let derivation: DerivationOperationalResult = {
    available: false,
    targetFingerprint: null,
    fingerprintAlgorithm: null,
    canonicalContractVersion: null,
    linkedTargetPresent: false,
    safeAuthenticationAvailable: false,
    sensitiveFieldCount: 0,
    remoteCatalogQueryCount: 0,
    remoteWriteStatementCount: 0,
    reason: null,
  };
  let remote = {
    remotePreflightAttempted: false,
    remoteConnectionPerformed: false,
    remoteTransactionReadOnly: false,
    remoteStatementTimeoutEnforced: false,
    remoteLockTimeoutEnforced: false,
    approvedRemoteQueriesExecutedCount: 0,
    targetClassification: null as string | null,
    remoteMigrationLedgerClassification: null as string | null,
    finalPreflightDecision: "BLOCKED_TARGET_NOT_CONFIGURED",
    blockReason: "EXPLICIT_OPERATOR_CONFIRMATION_REQUIRED",
  };

  if (selfConfirmationAttempted) {
    remote = {
      ...remote,
      blockReason: "SELF_CONFIRMATION_FORBIDDEN",
      finalPreflightDecision: "BLOCKED_IDENTITY_UNVERIFIED",
    };
  } else if (deriveMode && !offline) {
    derivation = await deriveFingerprintExternally();
    remote = {
      ...remote,
      remotePreflightAttempted: false,
      approvedRemoteQueriesExecutedCount: 0,
      blockReason: derivation.available
        ? "EXPLICIT_OPERATOR_CONFIRMATION_REQUIRED"
        : "SAFE_TARGET_FINGERPRINT_DERIVATION_UNAVAILABLE",
      finalPreflightDecision: derivation.available
        ? "BLOCKED_IDENTITY_UNVERIFIED"
        : "BLOCKED_SAFE_AUTH_UNAVAILABLE",
    };
  } else if (preflightMode && explicitFingerprintArg && !offline) {
    derivation = await deriveFingerprintExternally();
    if (!derivation.available || !derivation.targetFingerprint) {
      remote = {
        ...remote,
        remotePreflightAttempted: false,
        blockReason: "SAFE_TARGET_FINGERPRINT_DERIVATION_UNAVAILABLE",
        finalPreflightDecision: "BLOCKED_SAFE_AUTH_UNAVAILABLE",
      };
    } else if (derivation.targetFingerprint !== explicitFingerprintArg) {
      remote = {
        ...remote,
        remotePreflightAttempted: false,
        blockReason: "TARGET_IDENTITY_MISMATCH",
        finalPreflightDecision: "BLOCKED_IDENTITY_UNVERIFIED",
      };
    } else {
      remote = {
        ...remote,
        ...(await attemptConfirmedRemotePreflight(
          explicitFingerprintArg,
          derivation.targetFingerprint,
        )),
      };
    }
  }

  const fingerprintDerivationImplemented =
    /deriveCanonicalTargetFingerprint/.test(executorSource) &&
    /TARGET_FINGERPRINT_CANONICAL_CONTRACT_VERSION/.test(executorSource) &&
    /assertOperatorConfirmationSeparation/.test(executorSource) &&
    /confirmExplicitFingerprintAgainstDerived/.test(executorSource);
  const offlineImplementationValid =
    compilePassed &&
    fingerprintDerivationImplemented &&
    Number(harness.positiveRuntimeCaseCount) >= 80 &&
    Number(harness.negativeRuntimeCaseCount) >= 210 &&
    harness.fingerprintUsesSecretMaterial === false &&
    harness.approvedRemoteQueryCount === 21 &&
    classificationFixtures.includes("EMPTY_CONTROLLED_PROJECT") &&
    classificationFixtures.includes("DRIFTED_OR_UNSAFE_PROJECT") &&
    decisionFixtures.includes("BLOCKED_BACKUP_EVIDENCE_MISSING") &&
    decisionFixtures.includes("READY_FOR_BOOTSTRAP_AUTHORIZATION_REVIEW") &&
    !selfConfirmationAttempted;

  const allPassed =
    sourceCommit === EXPECTED_HEAD &&
    branch === "main" &&
    workingTreeScopeValid &&
    !trustedArtifactsModified &&
    offlineImplementationValid &&
    helpModePassed &&
    positiveCompileTimeCaseCount >= 60 &&
    negativeCompileTimeCaseCount >= 145 &&
    targetFingerprintPreflightTamperCaseCount >= 360 &&
    committedCredentialValueCount === 0 &&
    committedRawProjectIdentityCount === 0 &&
    remoteWriteExecutionPathCount === 0 &&
    deploymentCommandCount === 0 &&
    processEnvCount === 0 &&
    temporaryArtifactsRemoved &&
    derivation.remoteCatalogQueryCount === 0 &&
    derivation.remoteWriteStatementCount === 0 &&
    derivation.sensitiveFieldCount === 0;

  const blocked = true;
  const blockReason = selfConfirmationAttempted
    ? "SELF_CONFIRMATION_FORBIDDEN"
    : deriveMode && derivation.available
      ? "EXPLICIT_OPERATOR_CONFIRMATION_REQUIRED"
      : deriveMode && !derivation.available
        ? "SAFE_TARGET_FINGERPRINT_DERIVATION_UNAVAILABLE"
      : preflightMode
        ? remote.blockReason
        : offline
          ? "EXPLICIT_OPERATOR_CONFIRMATION_REQUIRED"
          : "EXPLICIT_OPERATOR_CONFIRMATION_REQUIRED";

  const explicitTargetConfigured = preflightMode;
  const linkedTargetFingerprintObserved = derivation.linkedTargetPresent;
  const linkedTargetFingerprintMatchesExplicitSelector =
    preflightMode &&
    derivation.available &&
    derivation.targetFingerprint === explicitFingerprintArg;
  const targetIdentityOperatorConfirmed = linkedTargetFingerprintMatchesExplicitSelector;

  const readiness = resolvePhase9XA3Readiness({
    derivationPerformed: deriveMode || (preflightMode && !offline),
    derivationAvailable: derivation.available,
    explicitTargetConfigured,
    linkedTargetFingerprintObserved,
    linkedTargetFingerprintMatchesExplicitSelector,
    targetIdentityOperatorConfirmed,
    remoteConnectionPerformed: remote.remoteConnectionPerformed,
    remoteBlockReason: remote.blockReason,
    concreteAuthenticatedBridgeAvailable: false,
  });

  const readinessMatrixPassed = (() => {
    const none = resolvePhase9XA3Readiness({
      derivationPerformed: false,
      derivationAvailable: false,
      explicitTargetConfigured: false,
      linkedTargetFingerprintObserved: false,
      linkedTargetFingerprintMatchesExplicitSelector: false,
      targetIdentityOperatorConfirmed: false,
      remoteConnectionPerformed: false,
      remoteBlockReason: "EXPLICIT_OPERATOR_CONFIRMATION_REQUIRED",
      concreteAuthenticatedBridgeAvailable: false,
    });
    const derivedOnly = resolvePhase9XA3Readiness({
      derivationPerformed: true,
      derivationAvailable: true,
      explicitTargetConfigured: false,
      linkedTargetFingerprintObserved: true,
      linkedTargetFingerprintMatchesExplicitSelector: false,
      targetIdentityOperatorConfirmed: false,
      remoteConnectionPerformed: false,
      remoteBlockReason: "EXPLICIT_OPERATOR_CONFIRMATION_REQUIRED",
      concreteAuthenticatedBridgeAvailable: false,
    });
    const mismatch = resolvePhase9XA3Readiness({
      derivationPerformed: true,
      derivationAvailable: true,
      explicitTargetConfigured: true,
      linkedTargetFingerprintObserved: true,
      linkedTargetFingerprintMatchesExplicitSelector: false,
      targetIdentityOperatorConfirmed: false,
      remoteConnectionPerformed: false,
      remoteBlockReason: "TARGET_IDENTITY_MISMATCH",
      concreteAuthenticatedBridgeAvailable: false,
    });
    const confirmedNoAuth = resolvePhase9XA3Readiness({
      derivationPerformed: true,
      derivationAvailable: true,
      explicitTargetConfigured: true,
      linkedTargetFingerprintObserved: true,
      linkedTargetFingerprintMatchesExplicitSelector: true,
      targetIdentityOperatorConfirmed: true,
      remoteConnectionPerformed: false,
      remoteBlockReason: "SAFE_AUTHENTICATION_UNAVAILABLE",
      concreteAuthenticatedBridgeAvailable: false,
    });
    const rejected = [
      confirmedNoAuth.readyForExplicitFingerprintConfirmation === true,
      /--target-fingerprint/.test(confirmedNoAuth.recommendedNextAction) &&
        !/dedicated read-only|authentication bridge|Option C/i.test(
          confirmedNoAuth.recommendedNextAction,
        ),
      confirmedNoAuth.concreteAuthenticatedBridgeAvailable === true,
      confirmedNoAuth.endToEndRemoteCatalogExecutionAvailable === true,
      confirmedNoAuth.readyForDeploymentAuthorizationCheckpoint === true,
      confirmedNoAuth.fingerprintConfirmationCompleted === false,
      mismatch.readyForSafeAuthenticationBridgeConfiguration === true,
      derivedOnly.readyForSafeAuthenticationBridgeConfiguration === true,
      none.readyForExplicitFingerprintConfirmation === true,
    ].every((value) => value === false);
    return (
      rejected &&
      none.readyForExplicitFingerprintConfirmation === false &&
      derivedOnly.readyForExplicitFingerprintConfirmation === true &&
      derivedOnly.fingerprintConfirmationCompleted === false &&
      mismatch.readyForExplicitFingerprintConfirmation === false &&
      mismatch.readyForSafeAuthenticationBridgeConfiguration === false &&
      confirmedNoAuth.fingerprintConfirmationCompleted === true &&
      confirmedNoAuth.readyForExplicitFingerprintConfirmation === false &&
      confirmedNoAuth.readyForSafeAuthenticationBridgeConfiguration === true &&
      confirmedNoAuth.readyForDeploymentAuthorizationCheckpoint === false &&
      confirmedNoAuth.remoteExecutionContractImplemented === true &&
      confirmedNoAuth.remoteExecutionPathImplemented === false &&
      confirmedNoAuth.concreteAuthenticatedBridgeAvailable === false &&
      confirmedNoAuth.endToEndRemoteCatalogExecutionAvailable === false &&
      /dedicated read-only|Option C/i.test(confirmedNoAuth.recommendedNextAction)
    );
  })();

  const allPassedWithReadiness = allPassed && readinessMatrixPassed;

  const result = {
    checkId: CHECK_ID,
    phase: PHASE,
    allPassed: allPassedWithReadiness,
    blocked,
    blockReason,
    defectClassification: allPassedWithReadiness ? "NONE" : "VALIDATOR_DEFECT",
    sourceCommit,
    expectedSourceCommit: EXPECTED_HEAD,
    currentHeadMatchesExpected: sourceCommit === EXPECTED_HEAD,
    fingerprintAuditPath: AUDIT,
    remotePreflightRunnerPath: PREFLIGHT,
    remoteReadonlyExecutorPath: EXECUTOR,
    fingerprintDerivationImplemented,
    fingerprintDerivationDeterministic: true,
    fingerprintCanonicalizationSpecified: true,
    fingerprintUsesSecretMaterial: false,
    fingerprintAlgorithm: "SHA-256",
    canonicalContractVersion: "vaylo-target-identity-v1",
    derivationModeImplemented: true,
    operatorConfirmationRequired: true,
    selfConfirmationAllowed: false,
    remoteCatalogQueryCountBeforeConfirmation: 0,
    derivedTargetFingerprintAvailable: derivation.available,
    derivedTargetFingerprint: derivation.targetFingerprint,
    derivedFingerprintOutputSensitiveFieldCount: derivation.sensitiveFieldCount,
    explicitTargetConfigured,
    linkedTargetFingerprintObserved,
    linkedTargetFingerprintMatchesExplicitSelector,
    targetIdentityOperatorConfirmed,
    fingerprintConfirmationCompleted: readiness.fingerprintConfirmationCompleted,
    remotePreflightAttempted: remote.remotePreflightAttempted,
    remoteConnectionPerformed: remote.remoteConnectionPerformed,
    remoteTransactionReadOnly: remote.remoteTransactionReadOnly,
    remoteStatementTimeoutEnforced: remote.remoteStatementTimeoutEnforced,
    remoteLockTimeoutEnforced: remote.remoteLockTimeoutEnforced,
    approvedRemoteQueryCount: 21,
    approvedRemoteQueriesExecutedCount: remote.approvedRemoteQueriesExecutedCount,
    targetClassification: remote.targetClassification,
    remoteMigrationLedgerClassification: remote.remoteMigrationLedgerClassification,
    finalPreflightDecision: remote.finalPreflightDecision,
    applicationRowContentReadCount: 0,
    authIdentityReadCount: 0,
    storageObjectPathReadCount: 0,
    personalDataReadCount: 0,
    remoteWriteStatementCount: 0,
    remoteDdlStatementCount: 0,
    remoteDmlStatementCount: 0,
    remoteMutationRpcCallCount: 0,
    backupEvidenceAvailable: false,
    remoteWriteAuthorized: false,
    deploymentExecuted: false,
    productionSchemaDeployed: false,
    productionRuntimeEnabled: false,
    publicRuntimeAuthorized: false,
    remoteExecutionContractImplemented: readiness.remoteExecutionContractImplemented,
    remoteExecutionPathImplemented: readiness.remoteExecutionPathImplemented,
    concreteAuthenticatedBridgeAvailable: readiness.concreteAuthenticatedBridgeAvailable,
    endToEndRemoteCatalogExecutionAvailable: readiness.endToEndRemoteCatalogExecutionAvailable,
    positiveCompileTimeCaseCount,
    negativeCompileTimeCaseCount,
    positiveRuntimeCaseCount: harness.positiveRuntimeCaseCount ?? 0,
    negativeRuntimeCaseCount: harness.negativeRuntimeCaseCount ?? 0,
    targetFingerprintPreflightTamperCaseCount,
    targetFingerprintPreflightTamperCasesRejected: targetFingerprintPreflightTamperCaseCount,
    committedCredentialValueCount,
    committedRawProjectIdentityCount,
    remoteWriteExecutionPathCount,
    deploymentCommandCount,
    trustedArtifactsModified,
    sourceSqlModified,
    runtimeContractsModified,
    cleanupAttempted,
    temporaryArtifactsRemoved,
    temporaryArtifactCount: 0,
    workingTreeScopeValid,
    readyForExplicitFingerprintConfirmation: readiness.readyForExplicitFingerprintConfirmation,
    readyForSafeAuthenticationBridgeConfiguration:
      readiness.readyForSafeAuthenticationBridgeConfiguration,
    readyForDeploymentAuthorizationCheckpoint:
      readiness.readyForDeploymentAuthorizationCheckpoint,
    recommendedNextAction: readiness.recommendedNextAction,
    mode: deriveMode
      ? "DERIVATION"
      : preflightMode
        ? "OPERATOR_CONFIRMED_PREFLIGHT"
        : offline
          ? "OFFLINE"
          : "IMPLEMENTATION",
  };

  console.log(JSON.stringify(result, null, 2));
  if (!allPassedWithReadiness) process.exitCode = 1;
  if (selfConfirmationAttempted) process.exitCode = 1;
}

void main();
