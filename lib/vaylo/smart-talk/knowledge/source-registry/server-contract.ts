import "server-only";

import type {
  KnowledgeHandlingMode,
  KnowledgeSourceAuthorizationState,
  KnowledgeSourceClass,
} from "./domain";
import {
  SOURCE_REGISTRY_RPC_DESCRIPTORS,
  type SourceRegistryAllowedRpcName,
  type SourceRegistryRpcArgs,
  type SourceRegistryRpcReturns,
} from "./rpc-surface";

export type SourceRegistryServerDomainContext = Readonly<{
  authorizationState?: KnowledgeSourceAuthorizationState;
  handlingMode?: KnowledgeHandlingMode;
  sourceClass?: KnowledgeSourceClass;
}>;

export type SourceRegistryRpcInvocationRequest = {
  [Name in SourceRegistryAllowedRpcName]: Readonly<{
    rpc: Name;
    args: SourceRegistryRpcArgs<Name>;
  }>;
}[SourceRegistryAllowedRpcName];

export type SourceRegistryServerContractErrorKind =
  | "INVALID_RPC_NAME"
  | "RPC_NOT_ALLOWED"
  | "RUNTIME_DISABLED"
  | "INVALID_ARGUMENT_CONTRACT"
  | "DATABASE_CLIENT_UNAVAILABLE"
  | "DATABASE_ERROR"
  | "CONCURRENCY_CONFLICT"
  | "AUTHORIZATION_DENIED"
  | "UNEXPECTED_RESULT_CONTRACT";

export type SourceRegistryServerContractError = Readonly<{
  kind: SourceRegistryServerContractErrorKind;
  message: string;
  retryable: boolean;
}>;

export type SourceRegistryRpcSuccess<
  Name extends SourceRegistryAllowedRpcName,
> = Readonly<{
  rpc: Name;
  ok: true;
  data: SourceRegistryRpcReturns<Name>;
  error: null;
}>;

export type SourceRegistryRpcFailure<
  Name extends SourceRegistryAllowedRpcName,
> = Readonly<{
  rpc: Name;
  ok: false;
  data: null;
  error: SourceRegistryServerContractError;
}>;

export type SourceRegistryRpcResult<
  Name extends SourceRegistryAllowedRpcName = SourceRegistryAllowedRpcName,
> = {
  [RpcName in Name]:
    | SourceRegistryRpcSuccess<RpcName>
    | SourceRegistryRpcFailure<RpcName>;
}[Name];

export type SourceRegistryRpcInvocationDescriptor<
  Name extends SourceRegistryAllowedRpcName,
> = Readonly<{
  rpc: Name;
  args: SourceRegistryRpcArgs<Name>;
  contract: (typeof SOURCE_REGISTRY_RPC_DESCRIPTORS)[Name];
  runtimeEnabledNow: false;
}>;

export function createSourceRegistryRpcInvocation<
  Name extends SourceRegistryAllowedRpcName,
>(
  rpc: Name,
  args: SourceRegistryRpcArgs<Name>,
): SourceRegistryRpcInvocationDescriptor<Name> {
  return Object.freeze({
    rpc,
    args,
    contract: SOURCE_REGISTRY_RPC_DESCRIPTORS[rpc],
    runtimeEnabledNow: false,
  });
}
