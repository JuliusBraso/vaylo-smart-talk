import "server-only";

import { types as nodeUtilTypes } from "node:util";
import { CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT } from "./controlled-production-preflight-execution-contracts";

export const PRODUCTION_BACKUP_EVIDENCE_STATE =
  "REQUIRED_NOT_YET_VERIFIED" as const;
export const PRODUCTION_PRESENCE_EVIDENCE_STATE = "UNVERIFIED" as const;

export type ProductionBackupEvidence = Readonly<{
  kind: "PRODUCTION_BACKUP_RECOVERY_EVIDENCE";
  state:
    | "REQUIRED_NOT_YET_VERIFIED"
    | "VERIFIED"
    | "INVALID"
    | "STALE"
    | "MISSING";
  targetFingerprint: string | null;
  verificationSource: "EXTERNAL_BACKUP_RECOVERY_VERIFICATION" | null;
  observedAtIso: string | null;
  expiresAtIso: string | null;
  referenceFingerprint: string | null;
  sourceCommit: typeof CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT;
  auditOnly: boolean;
}>;

export type ProductionPresenceEvidence = Readonly<{
  kind: "PRODUCTION_AUDIT_INTERFACE_PRESENCE_EVIDENCE";
  state:
    | "UNVERIFIED"
    | "REMOTE_VERIFIED_PRESENT"
    | "REMOTE_VERIFIED_MISMATCH";
  targetFingerprint: string | null;
  observedAtIso: string | null;
  observationFingerprint: string | null;
  expectedViewCount: 10;
  expectedFunctionCount: 9;
  expectedObjectCount: 19;
  expectedMappingCount: 21;
  securityDefinerIdentity: "vaylo_audit.migration_ledger()";
  extensionSchema: "extensions";
  extensionName: "pgcrypto";
  auditOnly: boolean;
}>;

const backupProvenance = new WeakSet<object>();
const presenceProvenance = new WeakSet<object>();

const BACKUP_KEYS = Object.freeze([
  "kind",
  "state",
  "targetFingerprint",
  "verificationSource",
  "observedAtIso",
  "expiresAtIso",
  "referenceFingerprint",
  "sourceCommit",
  "auditOnly",
] as const);
const PRESENCE_KEYS = Object.freeze([
  "kind",
  "state",
  "targetFingerprint",
  "observedAtIso",
  "observationFingerprint",
  "expectedViewCount",
  "expectedFunctionCount",
  "expectedObjectCount",
  "expectedMappingCount",
  "securityDefinerIdentity",
  "extensionSchema",
  "extensionName",
  "auditOnly",
] as const);

function descriptorSafe(
  value: unknown,
  expectedKeys: readonly string[],
): value is object {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    nodeUtilTypes.isProxy(value)
  ) return false;
  try {
    if (Object.getPrototypeOf(value) !== Object.prototype) return false;
    const keys = Reflect.ownKeys(value);
    if (
      keys.length !== expectedKeys.length ||
      keys.some(
        (key) => typeof key !== "string" || !expectedKeys.includes(key),
      )
    ) return false;
    const descriptors = Object.getOwnPropertyDescriptors(value);
    return expectedKeys.every((key) => {
      const descriptor = descriptors[key];
      return (
        descriptor !== undefined &&
        "value" in descriptor &&
        descriptor.get === undefined &&
        descriptor.set === undefined
      );
    });
  } catch {
    return false;
  }
}

function backup(
  state: ProductionBackupEvidence["state"],
  auditOnly: boolean,
  targetFingerprint: string | null,
) {
  const evidence = Object.freeze({
    kind: "PRODUCTION_BACKUP_RECOVERY_EVIDENCE" as const,
    state,
    targetFingerprint,
    verificationSource: auditOnly
      ? "EXTERNAL_BACKUP_RECOVERY_VERIFICATION" as const
      : null,
    observedAtIso: auditOnly ? "2026-08-08T09:55:00Z" : null,
    expiresAtIso: auditOnly ? "2026-08-08T10:05:00Z" : null,
    referenceFingerprint: auditOnly ? `sha256:${"b".repeat(64)}` : null,
    sourceCommit: CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
    auditOnly,
  });
  backupProvenance.add(evidence);
  return evidence;
}

function presence(
  state: ProductionPresenceEvidence["state"],
  auditOnly: boolean,
  targetFingerprint: string | null,
) {
  const evidence = Object.freeze({
    kind: "PRODUCTION_AUDIT_INTERFACE_PRESENCE_EVIDENCE" as const,
    state,
    targetFingerprint,
    observedAtIso: auditOnly ? "2026-08-08T10:00:00Z" : null,
    observationFingerprint: auditOnly ? `sha256:${"c".repeat(64)}` : null,
    expectedViewCount: 10 as const,
    expectedFunctionCount: 9 as const,
    expectedObjectCount: 19 as const,
    expectedMappingCount: 21 as const,
    securityDefinerIdentity: "vaylo_audit.migration_ledger()" as const,
    extensionSchema: "extensions" as const,
    extensionName: "pgcrypto" as const,
    auditOnly,
  });
  presenceProvenance.add(evidence);
  return evidence;
}

export const CURRENT_PRODUCTION_BACKUP_EVIDENCE = backup(
  PRODUCTION_BACKUP_EVIDENCE_STATE,
  false,
  null,
);
export const CURRENT_PRODUCTION_PRESENCE_EVIDENCE = presence(
  PRODUCTION_PRESENCE_EVIDENCE_STATE,
  false,
  null,
);

/** AUDIT_ONLY: cannot be supplied through the production execution boundary. */
export function createAuditOnlyVerifiedBackupEvidence(
  targetFingerprint: string,
): ProductionBackupEvidence {
  return backup("VERIFIED", true, targetFingerprint);
}

/** AUDIT_ONLY: proves local contracts, never production presence. */
export function createAuditOnlyVerifiedPresenceEvidence(
  targetFingerprint: string,
): ProductionPresenceEvidence {
  return presence("REMOTE_VERIFIED_PRESENT", true, targetFingerprint);
}

export function isCanonicalBackupEvidence(value: unknown): value is ProductionBackupEvidence {
  return descriptorSafe(value, BACKUP_KEYS) && backupProvenance.has(value);
}

export function isProductionUsableBackupEvidence(
  value: unknown,
): value is ProductionBackupEvidence {
  return (
    isCanonicalBackupEvidence(value) &&
    value.state === "VERIFIED" &&
    value.auditOnly === false
  );
}

export function isCanonicalPresenceEvidence(
  value: unknown,
): value is ProductionPresenceEvidence {
  return descriptorSafe(value, PRESENCE_KEYS) && presenceProvenance.has(value);
}
