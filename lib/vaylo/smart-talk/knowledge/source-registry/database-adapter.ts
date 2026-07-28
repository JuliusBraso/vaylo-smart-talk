import "server-only";

import type {
  SourceRegistryRpcFailure,
  SourceRegistryRpcInvocationRequest,
  SourceRegistryRpcResult,
  SourceRegistryRpcSuccess,
  SourceRegistryServerContractError,
} from "./server-contract";
import {
  SOURCE_REGISTRY_RPC_DESCRIPTORS,
  isSourceRegistryAllowedRpcName,
  type SourceRegistryAllowedRpcName,
  type SourceRegistryRpcArgs,
  type SourceRegistryRpcReturns,
} from "./rpc-surface";
import {
  assertLocalDisposableSourceRegistryValidationCapability,
  type SourceRegistryRuntimeCapability,
} from "./runtime-gate";

export type SourceRegistryRpcTransportError = Readonly<{
  code: string | null;
  message: string;
  details: string | null;
  hint: string | null;
}>;

export type SourceRegistryRpcTransportSuccess<
  Name extends SourceRegistryAllowedRpcName,
> = Readonly<{
  ok: true;
  rpc: Name;
  data: SourceRegistryRpcReturns<Name>;
}>;

export type SourceRegistryRpcTransportFailure<
  Name extends SourceRegistryAllowedRpcName,
> = Readonly<{
  ok: false;
  rpc: Name;
  error: SourceRegistryRpcTransportError;
}>;

export type SourceRegistryRpcTransportResult<
  Name extends SourceRegistryAllowedRpcName,
> =
  | SourceRegistryRpcTransportSuccess<Name>
  | SourceRegistryRpcTransportFailure<Name>;

export interface SourceRegistryRpcExecutor {
  execute<Name extends SourceRegistryAllowedRpcName>(
    name: Name,
    args: SourceRegistryRpcArgs<Name>,
  ): Promise<SourceRegistryRpcTransportResult<Name>>;
}

export interface SourceRegistryDatabaseAdapter {
  execute<Name extends SourceRegistryAllowedRpcName>(
    request: Extract<SourceRegistryRpcInvocationRequest, { rpc: Name }>,
  ): Promise<SourceRegistryRpcResult<Name>>;
}

function boundedError(
  kind: SourceRegistryServerContractError["kind"],
  message: string,
  retryable = false,
): SourceRegistryServerContractError {
  return Object.freeze({ kind, message, retryable });
}

function failure<Name extends SourceRegistryAllowedRpcName>(
  rpc: Name,
  error: SourceRegistryServerContractError,
): SourceRegistryRpcFailure<Name> {
  return Object.freeze({ rpc, ok: false, data: null, error });
}

function normalizeTransportFailure<Name extends SourceRegistryAllowedRpcName>(
  rpc: Name,
  error: SourceRegistryRpcTransportError,
): SourceRegistryRpcFailure<Name> {
  const kind =
    error.code === "40001"
      ? "CONCURRENCY_CONFLICT"
      : error.code === "42501"
        ? "AUTHORIZATION_DENIED"
        : "DATABASE_ERROR";
  return failure(
    rpc,
    boundedError(kind, error.message || "Database operation failed", kind === "CONCURRENCY_CONFLICT"),
  );
}

export function createSourceRegistryDatabaseAdapter(
  executor: SourceRegistryRpcExecutor,
  capability: SourceRegistryRuntimeCapability,
): SourceRegistryDatabaseAdapter {
  assertLocalDisposableSourceRegistryValidationCapability(capability);

  return Object.freeze({
    async execute<Name extends SourceRegistryAllowedRpcName>(
      request: Extract<SourceRegistryRpcInvocationRequest, { rpc: Name }>,
    ): Promise<SourceRegistryRpcResult<Name>> {
      const correlatedRequest = request as unknown as Readonly<{
        rpc: Name;
        args: SourceRegistryRpcArgs<Name>;
      }>;
      const runtimeName: string = request.rpc;
      if (!isSourceRegistryAllowedRpcName(runtimeName)) {
        return failure(
          request.rpc,
          boundedError("RPC_NOT_ALLOWED", "RPC is outside the approved source-registry surface"),
        );
      }
      const descriptor = SOURCE_REGISTRY_RPC_DESCRIPTORS[runtimeName];
      if (
        descriptor.internalOnly ||
        !descriptor.applicationCallable ||
        !descriptor.requiresServerOnly ||
        descriptor.runtimeEnabledNow
      ) {
        return failure(
          request.rpc,
          boundedError("RUNTIME_DISABLED", "Source-registry runtime contract is not eligible"),
        );
      }
      try {
        const transport = await executor.execute(
          correlatedRequest.rpc,
          correlatedRequest.args,
        );
        if (transport.rpc !== runtimeName) {
          return failure(
            request.rpc,
            boundedError("UNEXPECTED_RESULT_CONTRACT", "Executor returned a mismatched RPC identity"),
          );
        }
        if (!transport.ok) return normalizeTransportFailure(request.rpc, transport.error);
        const success: SourceRegistryRpcSuccess<Name> = Object.freeze({
          rpc: request.rpc,
          ok: true,
          data: transport.data,
          error: null,
        });
        return success;
      } catch {
        return failure(
          request.rpc,
          boundedError("DATABASE_ERROR", "Executor failed without a bounded transport result"),
        );
      }
    },
  });
}
