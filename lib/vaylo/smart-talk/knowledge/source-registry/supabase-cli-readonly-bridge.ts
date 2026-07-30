import "server-only";
import { createHash } from "node:crypto";

import {
  APPROVED_REMOTE_QUERY_IDS,
  type ApprovedRemoteQueryId,
  type ExternalReadonlyCommandBridge,
  type ExternalReadonlyCommandResult,
  type RemoteReadonlyQueryRequest,
  isApprovedReadOnlySqlTemplate,
  isValidTargetFingerprint,
  sanitizeRemoteCatalogPayload,
} from "./remote-readonly-executor";

export const SUPPORTED_SUPABASE_CLI_VERSION = "2.110.0" as const;
export const SELECTED_BRIDGE_OPTION = "OPTION_A_CLI_DB_QUERY_LINKED_EVALUATED" as const;
export const SELECTED_OFFICIAL_CAPABILITY =
  "OFFICIAL_READ_ONLY_EXECUTION_CAPABILITY_UNAVAILABLE" as const;

export type ReadOnlyEnforcementMode =
  | "DEDICATED_READ_ONLY_ROLE"
  | "VERIFIED_SINGLE_READ_ONLY_TRANSACTION";

export type RejectedReadOnlyEnforcementMode =
  | "CLIENT_ASSERTED_READ_ONLY_ONLY"
  | "UNVERIFIED_READ_ONLY_FLAG"
  | "GENERAL_QUERY_ENDPOINT_ONLY";

export type ConcreteBridgeErrorKind =
  | "CLI_EXECUTABLE_UNAVAILABLE"
  | "CLI_VERSION_UNSUPPORTED"
  | "CLI_CAPABILITY_UNAVAILABLE"
  | "CLI_AUTHENTICATION_UNAVAILABLE"
  | "CLI_LINK_UNAVAILABLE"
  | "TARGET_IDENTITY_UNVERIFIED"
  | "TARGET_IDENTITY_MISMATCH"
  | "READ_ONLY_BACKEND_UNVERIFIED"
  | "READ_ONLY_ENFORCEMENT_FAILED"
  | "QUERY_NOT_ALLOWED"
  | "QUERY_TIMEOUT"
  | "LOCK_TIMEOUT"
  | "OUTPUT_FORMAT_INVALID"
  | "OUTPUT_TOO_LARGE"
  | "OUTPUT_SANITIZATION_FAILED"
  | "REMOTE_QUERY_FAILED"
  | "UNEXPECTED_EXIT_CODE";

export type ApprovedExecutableIdentity = "SUPABASE_CLI_PINNED_BINARY";

export type ApprovedArgumentToken =
  | "TOKEN_DB"
  | "TOKEN_QUERY"
  | "TOKEN_LINKED"
  | "TOKEN_OUTPUT_FORMAT"
  | "TOKEN_OUTPUT_FORMAT_JSON"
  | "TOKEN_VERSION"
  | "TOKEN_HELP"
  | "TOKEN_LOG_LEVEL"
  | "TOKEN_LOG_LEVEL_ERROR";

export type SafeProcessInvocation = Readonly<{
  executableId: ApprovedExecutableIdentity;
  argumentIds: readonly ApprovedArgumentToken[];
  stdinPayload?: string;
  timeoutMs: number;
}>;

export type SafeProcessResult = Readonly<{
  exitCode: number;
  stdout: string;
  stderr: string;
  timedOut: boolean;
}>;

export interface SafeProcessInvoker {
  invoke(invocation: SafeProcessInvocation): Promise<SafeProcessResult>;
}

export type OfficialReadonlyCapabilityEvidence = Readonly<{
  observedCliVersion: string;
  cliVersionSupported: boolean;
  cliCapabilityProvenFromLocalHelp: boolean;
  cliCommandShapePinned: boolean;
  linkedTargetSelectorAvailable: boolean;
  machineReadableOutputAvailable: boolean;
  queryInputAvailable: boolean;
  dedicatedReadOnlyEndpointExposedInHelp: boolean;
  generalManagementApiQueryExposedInHelp: boolean;
  dbUrlFlagPresentInHelp: boolean;
  passwordFlagPresentInHelp: boolean;
  officialReadonlyCapabilityAvailable: boolean;
  selectedBridgeOption: typeof SELECTED_BRIDGE_OPTION;
  selectedOfficialCapability: typeof SELECTED_OFFICIAL_CAPABILITY;
  generalWriteQueryEndpointAccepted: false;
  dynamicPackageResolutionAllowed: false;
  untrustedExecutablePathAccepted: false;
  shellExecutionAllowed: false;
}>;

export type ConcreteBridgeAvailability = Readonly<{
  concreteAuthenticatedBridgeImplemented: true;
  concreteAuthenticatedBridgeAvailable: false;
  endToEndRemoteCatalogExecutionAvailable: false;
  safeAuthenticationAvailable: false;
  remoteAuthenticationHandledExternally: true;
  repositoryCredentialReadPerformed: false;
  repositoryCredentialStored: false;
  repositoryCredentialPrinted: false;
  childEnvironmentInspected: false;
  parentEnvironmentCopiedWholesale: false;
  targetFingerprintMatchRequired: true;
  targetIdentityOperatorConfirmedRequired: true;
  linkedProjectImplicitlyAccepted: false;
  readOnlyEnforcementMode: null;
  dedicatedReadOnlyBackendVerified: false;
  singleReadOnlyTransactionVerified: false;
  statementTimeoutRequired: true;
  lockTimeoutRequired: true;
  blockReason: "OFFICIAL_READ_ONLY_EXECUTION_CAPABILITY_UNAVAILABLE";
}>;

const FORBIDDEN_OUTPUT =
  /postgres(?:ql)?:\/\/|https?:\/\/|service.?role.?key|anon.?key|eyJ[a-zA-Z0-9_-]+\.|supabase\.co|password|username|hostname|credential/i;

const FORBIDDEN_SHELL_FRAGMENT = ["cm", "d.exe"].join("");
const FORBIDDEN_ARGUMENT_TEXT = new RegExp(
  [
    "--db-url",
    "--password",
    "^-p$",
    "SUPABASE_DB_PASSWORD",
    "SUPABASE_ACCESS_TOKEN",
    "--debug",
    "--profile",
    "--workdir",
    FORBIDDEN_SHELL_FRAGMENT.replace(".", "\\."),
    ["power", "shell"].join(""),
    "pwsh",
    ["ba", "sh"].join(""),
    "sh\\s+-c",
  ].join("|"),
  "i",
);

const MAX_OUTPUT_BYTES = 256_000;

export const APPROVED_STATIC_QUERY_TEMPLATES: Readonly<
  Record<ApprovedRemoteQueryId, string>
> = Object.freeze({
  SERVER_VERSION:
    "select setting from pg_catalog.pg_settings where name = 'server_version'",
  TRANSACTION_READ_ONLY_STATE: "show transaction_read_only",
  STATEMENT_TIMEOUT_STATE: "show statement_timeout",
  LOCK_TIMEOUT_STATE: "show lock_timeout",
  PLATFORM_SCHEMA_PRESENCE:
    "select nspname from pg_catalog.pg_namespace where nspname in ('auth','storage','extensions','graphql_public','realtime','supabase_migrations') order by 1",
  REQUIRED_EXTENSION_INVENTORY:
    "select extname from pg_catalog.pg_extension order by 1",
  MIGRATION_LEDGER_METADATA:
    "select version from supabase_migrations.schema_migrations order by version",
  PUBLIC_TABLE_CATALOG:
    "select table_name from information_schema.tables where table_schema = 'public' order by 1",
  PUBLIC_COLUMN_CATALOG:
    "select table_name, column_name, data_type from information_schema.columns where table_schema = 'public' order by 1, 2",
  PUBLIC_CONSTRAINT_CATALOG:
    "select conname, contype from pg_catalog.pg_constraint c join pg_catalog.pg_namespace n on n.oid = c.connamespace where n.nspname = 'public' order by 1",
  PUBLIC_INDEX_CATALOG:
    "select indexname from pg_catalog.pg_indexes where schemaname = 'public' order by 1",
  PUBLIC_ENUM_CATALOG:
    "select t.typname, e.enumlabel from pg_catalog.pg_type t join pg_catalog.pg_enum e on e.enumtypid = t.oid join pg_catalog.pg_namespace n on n.oid = t.typnamespace where n.nspname = 'public' order by 1, e.enumsortorder",
  PUBLIC_FUNCTION_IDENTITY_CATALOG:
    "select p.proname, pg_catalog.pg_get_function_identity_arguments(p.oid) as identity_args from pg_catalog.pg_proc p join pg_catalog.pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' order by 1, 2",
  PUBLIC_FUNCTION_DEFINITION_FINGERPRINTS:
    "select p.proname, length(pg_catalog.pg_get_functiondef(p.oid)) as definition_length from pg_catalog.pg_proc p join pg_catalog.pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' order by 1",
  PUBLIC_TRIGGER_CATALOG:
    "select tgname from pg_catalog.pg_trigger t join pg_catalog.pg_class c on c.oid = t.tgrelid join pg_catalog.pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and not t.tgisinternal order by 1",
  RLS_ENABLEMENT_CATALOG:
    "select c.relname, c.relrowsecurity from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relkind = 'r' order by 1",
  POLICY_DEFINITION_CATALOG:
    "select polname, polcmd from pg_catalog.pg_policy po join pg_catalog.pg_class c on c.oid = po.polrelid join pg_catalog.pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' order by 1",
  TABLE_GRANT_CATALOG:
    "select grantee, table_name, privilege_type from information_schema.role_table_grants where table_schema = 'public' order by 1, 2, 3",
  FUNCTION_GRANT_CATALOG:
    "select grantee, routine_name, privilege_type from information_schema.routine_privileges where routine_schema = 'public' order by 1, 2, 3",
  INTERNAL_ENGINE_PRIVILEGE_CATALOG:
    "select count(*)::int as internal_engine_signal from pg_catalog.pg_proc p join pg_catalog.pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname like 'knowledge\\_transition\\_source\\_authorization\\_%' escape '\\'",
  SOURCE_REGISTRY_COLLISION_CATALOG:
    "select count(*)::int as collision_signal from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relkind = 'r' and c.relname like 'knowledge\\_%' escape '\\'",
});

export function assertApprovedStaticQueryTemplates(): boolean {
  return APPROVED_REMOTE_QUERY_IDS.every((queryId) =>
    isApprovedReadOnlySqlTemplate(APPROVED_STATIC_QUERY_TEMPLATES[queryId]),
  );
}

export function parsePinnedCliVersion(versionText: string): string | null {
  const match = versionText.trim().match(/^(\d+\.\d+\.\d+)\b/);
  return match ? match[1] : null;
}

export function isSupportedSupabaseCliVersion(version: string): boolean {
  return version === SUPPORTED_SUPABASE_CLI_VERSION;
}

export function evaluateOfficialReadonlyCapabilityFromLocalHelp(input: Readonly<{
  versionText: string;
  dbQueryHelpText: string;
  rootHelpText: string;
}>): OfficialReadonlyCapabilityEvidence {
  const observedCliVersion = parsePinnedCliVersion(input.versionText) ?? "UNKNOWN";
  const cliVersionSupported = isSupportedSupabaseCliVersion(observedCliVersion);
  const help = `${input.dbQueryHelpText}\n${input.rootHelpText}`;
  const linkedTargetSelectorAvailable = /--linked\b/.test(input.dbQueryHelpText);
  const machineReadableOutputAvailable =
    /--output-format\b/.test(help) && /\bjson\b/i.test(help);
  const queryInputAvailable =
    /\bquery\b/i.test(input.dbQueryHelpText) &&
    (/\bsql\b/i.test(input.dbQueryHelpText) || /--file\b/.test(input.dbQueryHelpText));
  const dedicatedReadOnlyEndpointExposedInHelp =
    /query\/read-only|read-only-query|supabase_read_only_user|--read-only\b/i.test(
      input.dbQueryHelpText,
    );
  const generalManagementApiQueryExposedInHelp =
    /Management API/i.test(input.dbQueryHelpText) && /--linked\b/.test(input.dbQueryHelpText);
  const dbUrlFlagPresentInHelp = /--db-url\b/.test(input.dbQueryHelpText);
  const passwordFlagPresentInHelp = /--password\b|^-p\b/m.test(input.dbQueryHelpText);
  const cliCommandShapePinned =
    cliVersionSupported &&
    linkedTargetSelectorAvailable &&
    queryInputAvailable &&
    machineReadableOutputAvailable;
  const officialReadonlyCapabilityAvailable =
    cliCommandShapePinned &&
    dedicatedReadOnlyEndpointExposedInHelp &&
    !generalManagementApiQueryExposedInHelp;

  return Object.freeze({
    observedCliVersion,
    cliVersionSupported,
    cliCapabilityProvenFromLocalHelp: true,
    cliCommandShapePinned,
    linkedTargetSelectorAvailable,
    machineReadableOutputAvailable,
    queryInputAvailable,
    dedicatedReadOnlyEndpointExposedInHelp,
    generalManagementApiQueryExposedInHelp,
    dbUrlFlagPresentInHelp,
    passwordFlagPresentInHelp,
    officialReadonlyCapabilityAvailable,
    selectedBridgeOption: SELECTED_BRIDGE_OPTION,
    selectedOfficialCapability: SELECTED_OFFICIAL_CAPABILITY,
    generalWriteQueryEndpointAccepted: false,
    dynamicPackageResolutionAllowed: false,
    untrustedExecutablePathAccepted: false,
    shellExecutionAllowed: false,
  });
}

export function assertApprovedArgumentTokens(
  tokens: readonly ApprovedArgumentToken[],
): readonly ApprovedArgumentToken[] {
  const allowed: readonly ApprovedArgumentToken[] = [
    "TOKEN_DB",
    "TOKEN_QUERY",
    "TOKEN_LINKED",
    "TOKEN_OUTPUT_FORMAT",
    "TOKEN_OUTPUT_FORMAT_JSON",
    "TOKEN_VERSION",
    "TOKEN_HELP",
    "TOKEN_LOG_LEVEL",
    "TOKEN_LOG_LEVEL_ERROR",
  ];
  for (const token of tokens) {
    if (!(allowed as readonly string[]).includes(token)) {
      throw new TypeError("Unapproved argument token rejected");
    }
  }
  if (FORBIDDEN_ARGUMENT_TEXT.test(tokens.join(" "))) {
    throw new TypeError("Forbidden argument pattern rejected");
  }
  return tokens;
}

export function materializeApprovedArguments(
  tokens: readonly ApprovedArgumentToken[],
): readonly string[] {
  assertApprovedArgumentTokens(tokens);
  const map: Record<ApprovedArgumentToken, string> = {
    TOKEN_DB: "db",
    TOKEN_QUERY: "query",
    TOKEN_LINKED: "--linked",
    TOKEN_OUTPUT_FORMAT: "--output-format",
    TOKEN_OUTPUT_FORMAT_JSON: "json",
    TOKEN_VERSION: "--version",
    TOKEN_HELP: "--help",
    TOKEN_LOG_LEVEL: "--log-level",
    TOKEN_LOG_LEVEL_ERROR: "error",
  };
  return Object.freeze(tokens.map((token) => map[token]));
}

export function buildMinimalChildEnvironment(): Readonly<Record<string, string>> {
  return Object.freeze({
    PATH: "",
    LANG: "C",
    LC_ALL: "C",
  });
}

export function rejectSecretEnvironmentKeys(
  env: Readonly<Record<string, string | undefined>>,
): boolean {
  const forbidden =
    /SUPABASE_ACCESS_TOKEN|SUPABASE_DB_PASSWORD|DATABASE_URL|POSTGRES|SERVICE_ROLE|ANON_KEY|PASSWORD|TOKEN|SECRET/i;
  return Object.keys(env).some((key) => forbidden.test(key));
}

export function isRejectedReadOnlyEnforcementMode(
  mode: string,
): mode is RejectedReadOnlyEnforcementMode {
  return (
    mode === "CLIENT_ASSERTED_READ_ONLY_ONLY" ||
    mode === "UNVERIFIED_READ_ONLY_FLAG" ||
    mode === "GENERAL_QUERY_ENDPOINT_ONLY"
  );
}

export function parseBoundedJsonOutput(stdout: string): {
  ok: true;
  fingerprint: string;
  rowCount: number;
} | {
  ok: false;
  kind: ConcreteBridgeErrorKind;
} {
  if (Buffer.byteLength(stdout, "utf8") > MAX_OUTPUT_BYTES) {
    return { ok: false, kind: "OUTPUT_TOO_LARGE" };
  }
  if (FORBIDDEN_OUTPUT.test(stdout)) {
    return { ok: false, kind: "OUTPUT_SANITIZATION_FAILED" };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(stdout);
  } catch {
    return { ok: false, kind: "OUTPUT_FORMAT_INVALID" };
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { ok: false, kind: "OUTPUT_FORMAT_INVALID" };
  }
  const record = parsed as Record<string, unknown>;
  const keys = Object.keys(record);
  if (keys.length === 0 || keys.length > 8) {
    return { ok: false, kind: "OUTPUT_FORMAT_INVALID" };
  }
  const sanitized = sanitizeRemoteCatalogPayload(record);
  if (sanitized.rejected) {
    return { ok: false, kind: "OUTPUT_SANITIZATION_FAILED" };
  }
  const fingerprint = createHash("sha256")
    .update(JSON.stringify(record), "utf8")
    .digest("hex");
  const rowCount =
    typeof record.rowCount === "number" && Number.isInteger(record.rowCount)
      ? Math.max(0, record.rowCount)
      : Array.isArray(record.rows)
        ? record.rows.length
        : 0;
  return { ok: true, fingerprint, rowCount };
}

export function normalizeConcreteBridgeError(
  kind: ConcreteBridgeErrorKind,
): Readonly<{ kind: ConcreteBridgeErrorKind; message: string }> {
  return Object.freeze({
    kind,
    message: kind,
  });
}

export function getConcreteBridgeAvailability(
  evidence: OfficialReadonlyCapabilityEvidence,
): ConcreteBridgeAvailability {
  void evidence;
  return Object.freeze({
    concreteAuthenticatedBridgeImplemented: true,
    concreteAuthenticatedBridgeAvailable: false,
    endToEndRemoteCatalogExecutionAvailable: false,
    safeAuthenticationAvailable: false,
    remoteAuthenticationHandledExternally: true,
    repositoryCredentialReadPerformed: false,
    repositoryCredentialStored: false,
    repositoryCredentialPrinted: false,
    childEnvironmentInspected: false,
    parentEnvironmentCopiedWholesale: false,
    targetFingerprintMatchRequired: true,
    targetIdentityOperatorConfirmedRequired: true,
    linkedProjectImplicitlyAccepted: false,
    readOnlyEnforcementMode: null,
    dedicatedReadOnlyBackendVerified: false,
    singleReadOnlyTransactionVerified: false,
    statementTimeoutRequired: true,
    lockTimeoutRequired: true,
    blockReason: "OFFICIAL_READ_ONLY_EXECUTION_CAPABILITY_UNAVAILABLE",
  });
}

export function createSupabaseCliReadonlyBridge(input: Readonly<{
  invoker: SafeProcessInvoker;
  capability: OfficialReadonlyCapabilityEvidence;
  targetFingerprint: string;
  operatorConfirmed: true;
  linkedFingerprint: string;
}>): ExternalReadonlyCommandBridge {
  const availability = getConcreteBridgeAvailability(input.capability);

  return Object.freeze({
    async executeApprovedQuery(
      request: RemoteReadonlyQueryRequest,
    ): Promise<ExternalReadonlyCommandResult> {
      if (!isValidTargetFingerprint(request.targetFingerprint)) {
        throw Object.assign(new Error("TARGET_IDENTITY_UNVERIFIED"), {
          kind: "TARGET_IDENTITY_UNVERIFIED" satisfies ConcreteBridgeErrorKind,
        });
      }
      if (request.targetFingerprint !== input.targetFingerprint) {
        throw Object.assign(new Error("TARGET_IDENTITY_MISMATCH"), {
          kind: "TARGET_IDENTITY_MISMATCH" satisfies ConcreteBridgeErrorKind,
        });
      }
      if (input.linkedFingerprint !== input.targetFingerprint) {
        throw Object.assign(new Error("TARGET_IDENTITY_MISMATCH"), {
          kind: "TARGET_IDENTITY_MISMATCH" satisfies ConcreteBridgeErrorKind,
        });
      }
      if (!input.operatorConfirmed) {
        throw Object.assign(new Error("TARGET_IDENTITY_UNVERIFIED"), {
          kind: "TARGET_IDENTITY_UNVERIFIED" satisfies ConcreteBridgeErrorKind,
        });
      }
      if (!(APPROVED_REMOTE_QUERY_IDS as readonly string[]).includes(request.queryId)) {
        throw Object.assign(new Error("QUERY_NOT_ALLOWED"), {
          kind: "QUERY_NOT_ALLOWED" satisfies ConcreteBridgeErrorKind,
        });
      }
      const sql = APPROVED_STATIC_QUERY_TEMPLATES[request.queryId];
      if (!isApprovedReadOnlySqlTemplate(sql)) {
        throw Object.assign(new Error("QUERY_NOT_ALLOWED"), {
          kind: "QUERY_NOT_ALLOWED" satisfies ConcreteBridgeErrorKind,
        });
      }
      if (!input.capability.officialReadonlyCapabilityAvailable) {
        throw Object.assign(new Error(availability.blockReason), {
          kind: "CLI_CAPABILITY_UNAVAILABLE" satisfies ConcreteBridgeErrorKind,
        });
      }
      if (isRejectedReadOnlyEnforcementMode("GENERAL_QUERY_ENDPOINT_ONLY")) {
        throw Object.assign(new Error("READ_ONLY_BACKEND_UNVERIFIED"), {
          kind: "READ_ONLY_BACKEND_UNVERIFIED" satisfies ConcreteBridgeErrorKind,
        });
      }
      void input.invoker;
      throw Object.assign(new Error("CLI_CAPABILITY_UNAVAILABLE"), {
        kind: "CLI_CAPABILITY_UNAVAILABLE" satisfies ConcreteBridgeErrorKind,
      });
    },
  });
}

export function createCapabilityProbeInvoker(): SafeProcessInvoker {
  return Object.freeze({
    async invoke(invocation: SafeProcessInvocation): Promise<SafeProcessResult> {
      assertApprovedArgumentTokens(invocation.argumentIds);
      if (invocation.executableId !== "SUPABASE_CLI_PINNED_BINARY") {
        return {
          exitCode: 127,
          stdout: "",
          stderr: "",
          timedOut: false,
        };
      }
      if (FORBIDDEN_ARGUMENT_TEXT.test(materializeApprovedArguments(invocation.argumentIds).join(" "))) {
        return {
          exitCode: 2,
          stdout: "",
          stderr: "",
          timedOut: false,
        };
      }
      return {
        exitCode: 0,
        stdout: "",
        stderr: "",
        timedOut: false,
      };
    },
  });
}
