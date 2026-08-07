import "server-only";

import { createHash } from "node:crypto";

export const CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY_ID =
  "VAYLO_CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY" as const;

export const CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY_VERSION = 1 as const;

export const CONTROLLED_PRODUCTION_PERMISSION_IDS = Object.freeze([
  "AUTHORIZE_PRODUCTION_WRITE",
  "AUTHORIZE_PRODUCTION_BOOTSTRAP",
  "AUTHORIZE_PRODUCTION_ROLLBACK",
  "AUTHORIZE_PRODUCTION_RUNTIME",
  "AUTHORIZE_PUBLIC_LAUNCH",
  "AUTHORIZE_REMOTE_EXECUTION",
] as const);

export type ControlledProductionPermissionId =
  (typeof CONTROLLED_PRODUCTION_PERMISSION_IDS)[number];

export type ControlledProductionPermissionState = Readonly<{
  AUTHORIZE_PRODUCTION_WRITE: boolean;
  AUTHORIZE_PRODUCTION_BOOTSTRAP: boolean;
  AUTHORIZE_PRODUCTION_ROLLBACK: boolean;
  AUTHORIZE_PRODUCTION_RUNTIME: boolean;
  AUTHORIZE_PUBLIC_LAUNCH: boolean;
  AUTHORIZE_REMOTE_EXECUTION: boolean;
}>;

export type ControlledProductionPermissionStateResult =
  | Readonly<{ ok: true; value: ControlledProductionPermissionState }>
  | Readonly<{
      ok: false;
      failureCode:
        | "INVALID_PERMISSION_STATE"
        | "UNKNOWN_PERMISSION_FIELD"
        | "MISSING_PERMISSION_FIELD"
        | "NON_BOOLEAN_PERMISSION_VALUE"
        | "PERMISSION_NOT_FALSE";
    }>;

const exactOwnKeys = (
  candidate: Record<string, unknown>,
  keys: readonly string[],
): boolean => {
  const actualKeys = Object.keys(candidate);
  return (
    actualKeys.length === keys.length &&
    actualKeys.every((key) => keys.includes(key))
  );
};

const failure = (
  failureCode: Extract<
    ControlledProductionPermissionStateResult,
    { ok: false }
  >["failureCode"],
): ControlledProductionPermissionStateResult =>
  Object.freeze({ ok: false as const, failureCode });

export const createFailClosedControlledProductionPermissionState =
  (): ControlledProductionPermissionState =>
    Object.freeze({
      AUTHORIZE_PRODUCTION_WRITE: false,
      AUTHORIZE_PRODUCTION_BOOTSTRAP: false,
      AUTHORIZE_PRODUCTION_ROLLBACK: false,
      AUTHORIZE_PRODUCTION_RUNTIME: false,
      AUTHORIZE_PUBLIC_LAUNCH: false,
      AUTHORIZE_REMOTE_EXECUTION: false,
    });

export const parseControlledProductionPermissionState = (
  candidate: unknown,
): ControlledProductionPermissionStateResult => {
  if (
    candidate === null ||
    typeof candidate !== "object" ||
    Array.isArray(candidate) ||
    Object.getPrototypeOf(candidate) !== Object.prototype
  ) {
    return failure("INVALID_PERMISSION_STATE");
  }
  const source = candidate as Record<string, unknown>;
  const sourceKeys = Object.keys(source);
  if (sourceKeys.some((key) => !CONTROLLED_PRODUCTION_PERMISSION_IDS.includes(
    key as ControlledProductionPermissionId,
  ))) {
    return failure("UNKNOWN_PERMISSION_FIELD");
  }
  if (!exactOwnKeys(source, CONTROLLED_PRODUCTION_PERMISSION_IDS)) {
    return failure("MISSING_PERMISSION_FIELD");
  }
  if (
    CONTROLLED_PRODUCTION_PERMISSION_IDS.some(
      (permissionId) => typeof source[permissionId] !== "boolean",
    )
  ) {
    return failure("NON_BOOLEAN_PERMISSION_VALUE");
  }
  return Object.freeze({
    ok: true as const,
    value: Object.freeze({
      AUTHORIZE_PRODUCTION_WRITE:
        source.AUTHORIZE_PRODUCTION_WRITE as boolean,
      AUTHORIZE_PRODUCTION_BOOTSTRAP:
        source.AUTHORIZE_PRODUCTION_BOOTSTRAP as boolean,
      AUTHORIZE_PRODUCTION_ROLLBACK:
        source.AUTHORIZE_PRODUCTION_ROLLBACK as boolean,
      AUTHORIZE_PRODUCTION_RUNTIME:
        source.AUTHORIZE_PRODUCTION_RUNTIME as boolean,
      AUTHORIZE_PUBLIC_LAUNCH:
        source.AUTHORIZE_PUBLIC_LAUNCH as boolean,
      AUTHORIZE_REMOTE_EXECUTION:
        source.AUTHORIZE_REMOTE_EXECUTION as boolean,
    }),
  });
};

export const verifyAllControlledProductionPermissionsFalse = (
  candidate: unknown,
): ControlledProductionPermissionStateResult => {
  const parsed = parseControlledProductionPermissionState(candidate);
  if (!parsed.ok) return parsed;
  return CONTROLLED_PRODUCTION_PERMISSION_IDS.every(
    (permissionId) => parsed.value[permissionId] === false,
  )
    ? parsed
    : failure("PERMISSION_NOT_FALSE");
};

export const getControlledProductionPermissionAuthorityFingerprint =
  (): string =>
    createHash("sha256")
      .update(
        JSON.stringify({
          authorityId: CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY_ID,
          authorityVersion:
            CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY_VERSION,
          permissionIds: CONTROLLED_PRODUCTION_PERMISSION_IDS,
        }),
        "utf8",
      )
      .digest("hex");
