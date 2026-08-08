import "server-only";

import { Client } from "pg";

import {
  isAuditOnlyControlledProductionRemoteActionAuthorizationDecision,
  type ControlledProductionRemoteActionAuthorizationDecision,
} from "./controlled-production-remote-action-authorization-contract";
import {
  acquireAuditOnlyProductionExecutionCredentialLease,
  acquireProductionExecutionCredentialLease,
  consumeProductionExecutionCredentialLease,
  releaseProductionExecutionCredentialLease,
  resolveOpaqueProductionCredentialMaterial,
  type ProductionCredentialMaterial,
  type ProductionExecutionCredentialProvider,
} from "./controlled-production-preflight-credential-and-transport-boundary";
import {
  isCanonicalBackupEvidence,
  isProductionUsableBackupEvidence,
  type ProductionBackupEvidence,
} from "./production-preflight-prerequisite-evidence";
import {
  isValidatedProductionPreflightHExecutionRequest,
  validateProductionPreflightHResultEnvelope,
  type ProductionPreflightHExecutionRequest,
  type ProductionPreflightHValidatedResultEnvelope,
} from "./production-preflight-remote-executor-contract";
import { PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY } from "./production-read-only-preflight-helper";

export const CONTROLLED_PRODUCTION_BOUNDED_REMOTE_EXECUTION_BOUNDARY_ID =
  "VAYLO_CONTROLLED_PRODUCTION_BOUNDED_REMOTE_EXECUTION_BOUNDARY" as const;
export const CONTROLLED_PRODUCTION_BOUNDED_REMOTE_EXECUTION_BOUNDARY_VERSION =
  1 as const;
export const CONTROLLED_PRODUCTION_BOUNDED_REMOTE_EXECUTION_ACTION =
  "EXECUTE_ONE_AUTHORIZED_H_PREFLIGHT_QUERY" as const;

type PgClientPort = Readonly<{
  connect(): Promise<unknown>;
  query(sql: string): Promise<Readonly<{ rows: readonly unknown[] }>>;
  end(): Promise<void>;
}>;

export type ConcretePgExecutionCounters = {
  clientConstructed: number;
  connectCalls: number;
  registryQueryCalls: number;
  endCalls: number;
};

async function executeWithClient(
  input: unknown,
  client: PgClientPort,
  counters: ConcretePgExecutionCounters,
): Promise<ProductionPreflightHValidatedResultEnvelope> {
  if (!isValidatedProductionPreflightHExecutionRequest(input)) {
    throw new Error("PKG04_TRANSPORT_REQUEST_REJECTED");
  }
  const request = input;
  const entry = PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY[request.queryId];
  counters.connectCalls += 1;
  await client.connect();
  try {
    await client.query("BEGIN READ ONLY");
    counters.registryQueryCalls += 1;
    const result = await client.query(entry.sql);
    const row = result.rows.length === 1 ? result.rows[0] : null;
    const envelope = validateProductionPreflightHResultEnvelope(
      Object.freeze({
        contractId: request.contractId,
        contractVersion: request.contractVersion,
        contractFingerprint: request.contractFingerprint,
        queryId: request.queryId,
        targetFingerprint: request.targetFingerprint,
        resultContractId: request.resultContractId,
        ok: true,
        validatedResult: row,
        readOnlyVerified: true,
        sanitized: true,
      }),
      request,
    );
    if (!envelope.ok) throw new Error("PKG04_RESULT_REJECTED");
    await client.query("COMMIT");
    return envelope.value;
  } catch {
    try {
      await client.query("ROLLBACK");
    } catch {
      // Primary failure remains authoritative.
    }
    throw new Error("PKG04_EXECUTION_FAILED");
  } finally {
    counters.endCalls += 1;
    await client.end();
  }
}

function createProductionPgHTransport(
  material: ProductionCredentialMaterial,
  counters: ConcretePgExecutionCounters,
) {
  return Object.freeze({
    async executeValidatedHRequest(request: ProductionPreflightHExecutionRequest) {
      const connectionString =
        resolveOpaqueProductionCredentialMaterial(material);
      if (!connectionString) throw new Error("PKG04_CREDENTIAL_UNAVAILABLE");
      counters.clientConstructed += 1;
      const client = new Client({ connectionString });
      return executeWithClient(request, client, counters);
    },
  });
}

/** AUDIT_ONLY: injected client never enters the production boundary. */
export function executeAuditOnlyWithInjectedPgClient(
  request: unknown,
  client: PgClientPort,
  counters: ConcretePgExecutionCounters,
): Promise<ProductionPreflightHValidatedResultEnvelope> {
  return executeWithClient(request, client, counters);
}

export type BoundedRemoteExecutionResult =
  | Readonly<{ ok: true; result: ProductionPreflightHValidatedResultEnvelope }>
  | Readonly<{
      ok: false;
      blocker:
        | "PKG04_AUTHORIZATION_REJECTED"
        | "PKG04_BACKUP_NOT_VERIFIED"
        | "PKG04_CREDENTIAL_UNAVAILABLE"
        | "PKG04_EXECUTION_FAILED";
    }>;

function bindingsMatch(
  decision: Extract<ControlledProductionRemoteActionAuthorizationDecision, { status: "AUTHORIZED" }>,
  request: ProductionPreflightHExecutionRequest,
): boolean {
  return (
    isValidatedProductionPreflightHExecutionRequest(request) &&
    decision.queryId === request.queryId &&
    decision.targetFingerprint === request.targetFingerprint &&
    decision.expectedExecutorIdentity === request.executorIdentity &&
    decision.resultContractId === request.resultContractId
  );
}

export async function executeBoundedProductionHRequest(input: Readonly<{
  decision: ControlledProductionRemoteActionAuthorizationDecision;
  request: ProductionPreflightHExecutionRequest;
  backupEvidence: ProductionBackupEvidence;
  credentialProvider: ProductionExecutionCredentialProvider | null;
  counters: ConcretePgExecutionCounters;
}>): Promise<BoundedRemoteExecutionResult> {
  const decision = input.decision;
  if (
    decision.status !== "AUTHORIZED" ||
    isAuditOnlyControlledProductionRemoteActionAuthorizationDecision(decision)
  ) {
    return Object.freeze({ ok: false, blocker: "PKG04_AUTHORIZATION_REJECTED" });
  }
  if (
    !bindingsMatch(decision, input.request) ||
    !isProductionUsableBackupEvidence(input.backupEvidence)
  ) {
    return Object.freeze({ ok: false, blocker: "PKG04_BACKUP_NOT_VERIFIED" });
  }
  return executeAuthorized(
    Object.freeze({
      decision,
      request: input.request,
      backupEvidence: input.backupEvidence,
      credentialProvider: input.credentialProvider,
      counters: input.counters,
    }),
    false,
  );
}

async function executeAuthorized(
  input: Readonly<{
    decision: Extract<ControlledProductionRemoteActionAuthorizationDecision, { status: "AUTHORIZED" }>;
    request: ProductionPreflightHExecutionRequest;
    backupEvidence: ProductionBackupEvidence;
    credentialProvider: ProductionExecutionCredentialProvider | null;
    counters: ConcretePgExecutionCounters;
  }>,
  auditOnly: boolean,
  injectedClient?: Readonly<{
    connect(): Promise<unknown>;
    query(sql: string): Promise<Readonly<{ rows: readonly unknown[] }>>;
    end(): Promise<void>;
  }>,
): Promise<BoundedRemoteExecutionResult> {
  const acquired = auditOnly
    ? await acquireAuditOnlyProductionExecutionCredentialLease(
        input.decision,
        input.backupEvidence,
        input.credentialProvider,
      )
    : await acquireProductionExecutionCredentialLease(
        input.decision,
        input.backupEvidence,
        input.credentialProvider,
      );
  if (!acquired.ok || !input.credentialProvider) {
    return Object.freeze({ ok: false, blocker: "PKG04_CREDENTIAL_UNAVAILABLE" });
  }
  const material = consumeProductionExecutionCredentialLease(acquired.value);
  if (!material) {
    return Object.freeze({ ok: false, blocker: "PKG04_CREDENTIAL_UNAVAILABLE" });
  }
  try {
    const result =
      auditOnly && injectedClient
        ? await executeAuditOnlyWithInjectedPgClient(
            input.request,
            injectedClient,
            input.counters,
          )
        : await createProductionPgHTransport(
            material,
            input.counters,
          ).executeValidatedHRequest(input.request);
    return Object.freeze({ ok: true, result });
  } catch {
    return Object.freeze({ ok: false, blocker: "PKG04_EXECUTION_FAILED" });
  } finally {
    await releaseProductionExecutionCredentialLease(
      acquired.value,
      input.credentialProvider,
    );
  }
}

/** AUDIT_ONLY: production callers cannot inject a client through the public boundary. */
export async function executeAuditOnlyBoundedHRequest(input: Readonly<{
  decision: Extract<ControlledProductionRemoteActionAuthorizationDecision, { status: "AUTHORIZED" }>;
  request: ProductionPreflightHExecutionRequest;
  backupEvidence: ProductionBackupEvidence;
  credentialProvider: ProductionExecutionCredentialProvider;
  counters: ConcretePgExecutionCounters;
  client: Readonly<{
    connect(): Promise<unknown>;
    query(sql: string): Promise<Readonly<{ rows: readonly unknown[] }>>;
    end(): Promise<void>;
  }>;
}>): Promise<BoundedRemoteExecutionResult> {
  if (
    !isAuditOnlyControlledProductionRemoteActionAuthorizationDecision(
      input.decision,
    ) ||
    !bindingsMatch(input.decision, input.request) ||
    !isCanonicalBackupEvidence(input.backupEvidence) ||
    input.backupEvidence.state !== "VERIFIED" ||
    input.backupEvidence.auditOnly !== true
  ) {
    return Object.freeze({ ok: false, blocker: "PKG04_BACKUP_NOT_VERIFIED" });
  }
  return executeAuthorized(input, true, input.client);
}
