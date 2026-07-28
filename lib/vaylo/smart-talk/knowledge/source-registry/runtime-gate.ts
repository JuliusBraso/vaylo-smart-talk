export const SOURCE_REGISTRY_DEFAULT_RUNTIME_MODE = "DISABLED" as const;

export type SourceRegistryRuntimeMode =
  | "DISABLED"
  | "LOCAL_DISPOSABLE_VALIDATION";

export type SourceRegistryRuntimeCapability = Readonly<{
  mode: "LOCAL_DISPOSABLE_VALIDATION";
  scope: "SOURCE_REGISTRY_RPC";
  disposable: true;
  remote: false;
  production: false;
  publicRuntime: false;
}>;

export function createLocalDisposableSourceRegistryValidationCapability():
  SourceRegistryRuntimeCapability {
  return Object.freeze({
    mode: "LOCAL_DISPOSABLE_VALIDATION",
    scope: "SOURCE_REGISTRY_RPC",
    disposable: true,
    remote: false,
    production: false,
    publicRuntime: false,
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isLocalDisposableSourceRegistryValidationCapability(
  value: unknown,
): value is SourceRegistryRuntimeCapability {
  if (!isRecord(value)) return false;
  const keys = Object.keys(value).sort();
  return (
    keys.length === 6 &&
    keys.join("|") ===
      "disposable|mode|production|publicRuntime|remote|scope" &&
    value.mode === "LOCAL_DISPOSABLE_VALIDATION" &&
    value.scope === "SOURCE_REGISTRY_RPC" &&
    value.disposable === true &&
    value.remote === false &&
    value.production === false &&
    value.publicRuntime === false &&
    Object.isFrozen(value)
  );
}

export function assertLocalDisposableSourceRegistryValidationCapability(
  value: unknown,
): SourceRegistryRuntimeCapability {
  if (!isLocalDisposableSourceRegistryValidationCapability(value)) {
    throw new TypeError(
      "A frozen local-disposable source-registry validation capability is required",
    );
  }
  return value;
}
