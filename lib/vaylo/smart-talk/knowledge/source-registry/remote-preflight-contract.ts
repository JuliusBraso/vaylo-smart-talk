import "server-only";

export const REMOTE_PREFLIGHT_DECISION_STATES = [
  "TARGET_NOT_CONFIGURED",
  "SAFE_AUTHENTICATION_UNAVAILABLE",
  "TARGET_IDENTITY_UNVERIFIED",
  "READ_ONLY_PREFLIGHT_READY",
  "TARGET_EMPTY_CONTROLLED",
  "TARGET_VERIFIED_PRE032",
  "TARGET_UNKNOWN",
  "TARGET_DRIFTED_OR_UNSAFE",
  "READY_FOR_DEPLOYMENT_AUTHORIZATION_REVIEW",
  "DENY_DEPLOYMENT",
] as const;

export type RemotePreflightDecisionState =
  (typeof REMOTE_PREFLIGHT_DECISION_STATES)[number];

export const REMOTE_EVIDENCE_SOURCES = [
  "REMOTE_TARGET_IDENTITY",
  "REMOTE_SERVER_METADATA",
  "REMOTE_MIGRATION_LEDGER",
  "REMOTE_CATALOG",
  "REMOTE_RLS_AND_POLICY_CATALOG",
  "REMOTE_GRANT_CATALOG",
  "REMOTE_FUNCTION_DEFINITION",
  "REMOTE_BACKUP_ATTESTATION_REQUIRED",
  "OPERATOR_AUTHORIZATION_REQUIRED",
] as const;

export type RemoteEvidenceSource = (typeof REMOTE_EVIDENCE_SOURCES)[number];

export type RemotePreflightQueryClass =
  | "POSTGRES_CATALOG_SELECT"
  | "INFORMATION_SCHEMA_SELECT"
  | "MIGRATION_LEDGER_SELECT"
  | "NON_SENSITIVE_AGGREGATE_SELECT"
  | "SERVER_SETTING_SHOW"
  | "PRIVILEGE_INSPECTION"
  | "FUNCTION_DEFINITION_INSPECTION";

export type RemotePreflightClaim = Readonly<{
  criterionId: string;
  evidenceSource: RemoteEvidenceSource;
  queryClass: RemotePreflightQueryClass;
  observedAt: string | null;
  status: "VERIFIED" | "NOT_VERIFIED" | "BLOCKED" | "REQUIRES_FUTURE_ACTION";
  sanitizedFingerprint: string | null;
  stalenessWindow: "CURRENT_SESSION" | "OPERATOR_ATTESTATION";
  writeRisk: "NONE";
  sensitiveOutputRemoved: true;
}>;

export type RemoteTargetClassification =
  | "EMPTY_CONTROLLED_PROJECT"
  | "EXISTING_PROJECT_WITH_VERIFIED_PRE032_SCHEMA"
  | "EXISTING_PROJECT_WITH_UNKNOWN_SCHEMA"
  | "DRIFTED_OR_UNSAFE_PROJECT"
  | "ALREADY_DEPLOYED_AND_EQUIVALENT";

export type RemoteMigrationLedgerClassification =
  | "EMPTY_LEDGER"
  | "VERIFIED_PRE032_LEDGER"
  | "PARTIAL_032_TO_035_LEDGER"
  | "COMPLETE_032_TO_035_LEDGER"
  | "CONFLICTING_LEDGER"
  | "UNKNOWN_LEDGER";

export type RemotePreflightFinalDecision =
  | "BLOCKED_TARGET_NOT_CONFIGURED"
  | "BLOCKED_SAFE_AUTH_UNAVAILABLE"
  | "BLOCKED_IDENTITY_UNVERIFIED"
  | "BLOCKED_BACKUP_EVIDENCE_MISSING"
  | "BLOCKED_UNKNOWN_SCHEMA"
  | "BLOCKED_SCHEMA_DRIFT"
  | "BLOCKED_LEDGER_CONFLICT"
  | "BLOCKED_PLATFORM_DEPENDENCY"
  | "BLOCKED_PRIVILEGE_DRIFT"
  | "READY_FOR_BOOTSTRAP_AUTHORIZATION_REVIEW"
  | "READY_FOR_032_TO_035_AUTHORIZATION_REVIEW"
  | "READY_FOR_POST_DEPLOYMENT_VERIFICATION_REVIEW";

export type SanitizedTargetIdentityAssertion = Readonly<{
  environmentClassification: "CONTROLLED_PRODUCTION" | "CONTROLLED_STAGING";
  projectReferenceFingerprint: string;
  organizationFingerprint: string | null;
  region: string | null;
  expectedPostgresMajor: number;
  expectedApplicationIdentity: string;
}>;

export type ReadOnlyRemotePreflightResult = Readonly<{
  state: RemotePreflightDecisionState;
  targetClassification: RemoteTargetClassification | null;
  finalDecision: RemotePreflightFinalDecision;
  remoteMigrationLedgerClassification: RemoteMigrationLedgerClassification | null;
  claims: readonly RemotePreflightClaim[];
  remoteWriteAuthorized: false;
  deploymentExecuted: false;
  productionRuntimeEnabled: false;
  publicRuntimeAuthorized: false;
  validationFixtureDeploymentEligible: false;
  baselineAutoDeploymentAllowed: false;
}>;

const FORBIDDEN_SQL = /\b(?:insert|update|delete|merge|create|alter|drop|truncate|copy|grant|revoke|security\s+label|set\s+(?:role|session_authorization)|listen|notify|pg_advisory|call)\b/i;
const FORBIDDEN_FUNCTIONS = /\b(?:knowledge_transition_source_authorization_internal|knowledge_(?:register|update|record|authorize|suspend|reject|retire|assign)_)/i;
const APPLICATION_DATA_ACCESS = /\b(?:profiles|user_documents|auth\.users|storage\.objects|knowledge_sources|knowledge_translations)\b/i;

export function isApprovedReadOnlyPreflightQuery(
  query: string,
  queryClass: RemotePreflightQueryClass,
): boolean {
  const normalized = query.trim();
  if (!normalized || normalized.includes(";") || FORBIDDEN_SQL.test(normalized)) {
    return false;
  }
  if (FORBIDDEN_FUNCTIONS.test(normalized) || APPLICATION_DATA_ACCESS.test(normalized)) {
    return false;
  }
  if (!/^(?:select|show)\b/i.test(normalized)) return false;
  const permittedRelations = /(?:pg_catalog|information_schema|supabase_migrations|pg_|information_schema\.)/i;
  return (
    permittedRelations.test(normalized) &&
    queryClass !== "NON_SENSITIVE_AGGREGATE_SELECT"
      ? true
      : queryClass === "NON_SENSITIVE_AGGREGATE_SELECT" &&
          !/\bfrom\s+public\./i.test(normalized)
  );
}

export function classifyRemotePreflight(
  input: Readonly<{
    explicitTargetConfigured: boolean;
    safeAuthenticationAvailable: boolean;
    targetIdentityOperatorConfirmed: boolean;
    targetClassification: RemoteTargetClassification | null;
    ledger: RemoteMigrationLedgerClassification | null;
    platformSatisfied: boolean;
    privilegeContractSatisfied: boolean;
    backupEvidenceAvailable: boolean;
  }>,
): RemotePreflightFinalDecision {
  if (!input.explicitTargetConfigured) return "BLOCKED_TARGET_NOT_CONFIGURED";
  if (!input.safeAuthenticationAvailable) return "BLOCKED_SAFE_AUTH_UNAVAILABLE";
  if (!input.targetIdentityOperatorConfirmed) return "BLOCKED_IDENTITY_UNVERIFIED";
  if (!input.platformSatisfied) return "BLOCKED_PLATFORM_DEPENDENCY";
  if (!input.privilegeContractSatisfied) return "BLOCKED_PRIVILEGE_DRIFT";
  if (!input.backupEvidenceAvailable) return "BLOCKED_BACKUP_EVIDENCE_MISSING";
  if (
    input.ledger === "CONFLICTING_LEDGER" ||
    input.ledger === "PARTIAL_032_TO_035_LEDGER"
  ) return "BLOCKED_LEDGER_CONFLICT";
  if (input.targetClassification === "EXISTING_PROJECT_WITH_UNKNOWN_SCHEMA") {
    return "BLOCKED_UNKNOWN_SCHEMA";
  }
  if (input.targetClassification === "DRIFTED_OR_UNSAFE_PROJECT") {
    return "BLOCKED_SCHEMA_DRIFT";
  }
  if (input.targetClassification === "EMPTY_CONTROLLED_PROJECT") {
    return "READY_FOR_BOOTSTRAP_AUTHORIZATION_REVIEW";
  }
  if (input.targetClassification === "EXISTING_PROJECT_WITH_VERIFIED_PRE032_SCHEMA") {
    return "READY_FOR_032_TO_035_AUTHORIZATION_REVIEW";
  }
  return "READY_FOR_POST_DEPLOYMENT_VERIFICATION_REVIEW";
}
