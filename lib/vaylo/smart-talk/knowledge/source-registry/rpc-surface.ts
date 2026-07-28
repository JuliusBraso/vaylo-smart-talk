import type { Database } from "../../../../supabase/database.types";

export const SOURCE_REGISTRY_ALLOWED_RPC_NAMES = [
  "knowledge_register_official_source",
  "knowledge_update_official_source_metadata",
  "knowledge_record_source_terms_review",
  "knowledge_record_source_robots_review",
  "knowledge_record_source_authority_verification",
  "knowledge_authorize_official_source",
  "knowledge_suspend_official_source",
  "knowledge_reject_official_source",
  "knowledge_retire_official_source",
  "knowledge_assign_source_handling_policy",
  "knowledge_record_source_acquisition_attempt",
] as const;

export type SourceRegistryAllowedRpcName =
  (typeof SOURCE_REGISTRY_ALLOWED_RPC_NAMES)[number];

export const SOURCE_REGISTRY_INTERNAL_ENGINE_RPC_NAME =
  "knowledge_transition_source_authorization_internal" as const;

type PublicFunctions = Database["public"]["Functions"];
type RpcDefinition<Name extends SourceRegistryAllowedRpcName> =
  PublicFunctions[Name];
type DefinitionArgs<Definition> =
  Definition extends { Args: infer Args } ? Args : never;
type DefinitionReturns<Definition> =
  Definition extends { Returns: infer Returns } ? Returns : never;

export type SourceRegistryRpcArgs<Name extends SourceRegistryAllowedRpcName> =
  DefinitionArgs<RpcDefinition<Name>>;
export type SourceRegistryRpcReturns<Name extends SourceRegistryAllowedRpcName> =
  DefinitionReturns<RpcDefinition<Name>>;

export type SourceRegistryRpcClassification =
  | "SOURCE_REGISTRY"
  | "AUTHORIZATION_TRANSITION"
  | "HANDLING_POLICY"
  | "ACQUISITION_ATTEMPT";

export type SourceRegistryRpcDescriptor<
  Name extends SourceRegistryAllowedRpcName = SourceRegistryAllowedRpcName,
> = Readonly<{
  name: Name;
  classification: SourceRegistryRpcClassification;
  accessBoundary: "FUTURE_SERVER_ONLY";
  argumentContract: "DERIVED_FROM_DATABASE";
  returnContract: "DERIVED_FROM_DATABASE";
  internalOnly: false;
  applicationCallable: true;
  requiresServerOnly: true;
  runtimeEnabledNow: false;
}>;

const descriptor = <Name extends SourceRegistryAllowedRpcName>(
  name: Name,
  classification: SourceRegistryRpcClassification,
): SourceRegistryRpcDescriptor<Name> =>
  Object.freeze({
    name,
    classification,
    accessBoundary: "FUTURE_SERVER_ONLY",
    argumentContract: "DERIVED_FROM_DATABASE",
    returnContract: "DERIVED_FROM_DATABASE",
    internalOnly: false,
    applicationCallable: true,
    requiresServerOnly: true,
    runtimeEnabledNow: false,
  });

export const SOURCE_REGISTRY_RPC_DESCRIPTORS = Object.freeze({
  knowledge_register_official_source: descriptor(
    "knowledge_register_official_source",
    "SOURCE_REGISTRY",
  ),
  knowledge_update_official_source_metadata: descriptor(
    "knowledge_update_official_source_metadata",
    "SOURCE_REGISTRY",
  ),
  knowledge_record_source_terms_review: descriptor(
    "knowledge_record_source_terms_review",
    "AUTHORIZATION_TRANSITION",
  ),
  knowledge_record_source_robots_review: descriptor(
    "knowledge_record_source_robots_review",
    "AUTHORIZATION_TRANSITION",
  ),
  knowledge_record_source_authority_verification: descriptor(
    "knowledge_record_source_authority_verification",
    "AUTHORIZATION_TRANSITION",
  ),
  knowledge_authorize_official_source: descriptor(
    "knowledge_authorize_official_source",
    "AUTHORIZATION_TRANSITION",
  ),
  knowledge_suspend_official_source: descriptor(
    "knowledge_suspend_official_source",
    "AUTHORIZATION_TRANSITION",
  ),
  knowledge_reject_official_source: descriptor(
    "knowledge_reject_official_source",
    "AUTHORIZATION_TRANSITION",
  ),
  knowledge_retire_official_source: descriptor(
    "knowledge_retire_official_source",
    "AUTHORIZATION_TRANSITION",
  ),
  knowledge_assign_source_handling_policy: descriptor(
    "knowledge_assign_source_handling_policy",
    "HANDLING_POLICY",
  ),
  knowledge_record_source_acquisition_attempt: descriptor(
    "knowledge_record_source_acquisition_attempt",
    "ACQUISITION_ATTEMPT",
  ),
} satisfies {
  readonly [Name in SourceRegistryAllowedRpcName]:
    SourceRegistryRpcDescriptor<Name>;
});

export function isSourceRegistryAllowedRpcName(
  value: string,
): value is SourceRegistryAllowedRpcName {
  return SOURCE_REGISTRY_ALLOWED_RPC_NAMES.some((name) => name === value);
}

export function assertSourceRegistryAllowedRpcName(
  value: string,
): SourceRegistryAllowedRpcName {
  if (!isSourceRegistryAllowedRpcName(value)) {
    throw new TypeError(`Source-registry RPC is not allowed: ${JSON.stringify(value)}`);
  }
  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function validateSourceRegistryRpcDescriptors(value: unknown): boolean {
  if (!isRecord(value)) return false;
  const keys = Object.keys(value);
  if (
    keys.length !== SOURCE_REGISTRY_ALLOWED_RPC_NAMES.length ||
    !SOURCE_REGISTRY_ALLOWED_RPC_NAMES.every((name) => keys.includes(name))
  ) {
    return false;
  }
  return SOURCE_REGISTRY_ALLOWED_RPC_NAMES.every((name) => {
    const candidate = value[name];
    return (
      isRecord(candidate) &&
      candidate.name === name &&
      candidate.accessBoundary === "FUTURE_SERVER_ONLY" &&
      candidate.argumentContract === "DERIVED_FROM_DATABASE" &&
      candidate.returnContract === "DERIVED_FROM_DATABASE" &&
      candidate.internalOnly === false &&
      candidate.applicationCallable === true &&
      candidate.requiresServerOnly === true &&
      candidate.runtimeEnabledNow === false
    );
  });
}
