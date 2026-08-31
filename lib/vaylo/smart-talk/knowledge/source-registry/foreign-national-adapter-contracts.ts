/**
 * CB-0D — minimal foreign-national adapter authoring contract.
 * Allowlist is SK only. CZ/PL/HU and unknown countries remain blocked.
 */
import { createHash } from "node:crypto";

import { KNOWLEDGE_FACTORY_SCHEMA_VERSION, stableKnowledgeFactoryId } from "./knowledge-factory-contracts";
import {
  FOREIGN_NATIONAL_ADAPTER_COUNTRIES,
  FOREIGN_NATIONAL_ADAPTER_TRUST_DOMAIN,
  type ForeignNationalAdapterCountry,
} from "./cross-border-connector-contracts";

export const FOREIGN_NATIONAL_ADAPTER_SCHEMA_VERSION = KNOWLEDGE_FACTORY_SCHEMA_VERSION;
export const SK_ADAPTER_PACK_ID = "sk_applicable_legislation_adapter" as const;
export const SK_ADAPTER_PROCESS_GROUP = "sk_applicable_legislation_adapter" as const;
export const SK_HEALTH_ADAPTER_PACK_ID = "sk_health_insurance_coordination_adapter" as const;
export const SK_HEALTH_ADAPTER_PROCESS_GROUP = "sk_health_insurance_coordination_adapter" as const;
export const DE_ROUTING_PACK_ID = "de_applicable_legislation_routing" as const;
export const DE_ROUTING_PROCESS_GROUP = "de_applicable_legislation_routing" as const;
export const DE_HEALTH_ROUTING_PACK_ID = "de_health_insurance_coordination_routing" as const;
export const DE_HEALTH_ROUTING_PROCESS_GROUP = "de_health_insurance_coordination_routing" as const;
export const DE_SK_CONNECTOR_PROCESS_GROUP = "de_sk_applicable_legislation_connector" as const;
export const DE_SK_HEALTH_CONNECTOR_PROCESS_GROUP = "de_sk_health_insurance_coordination_connector" as const;
export const AUTHORIZED_SK_ADAPTER_PACK_IDS = Object.freeze([
  SK_ADAPTER_PACK_ID,
  SK_HEALTH_ADAPTER_PACK_ID,
] as const);
export const AUTHORIZED_DE_ROUTING_PACK_IDS = Object.freeze([
  DE_ROUTING_PACK_ID,
  DE_HEALTH_ROUTING_PACK_ID,
] as const);
export const SK_EMPLOYER_EFILING_EFFECTIVE = "2026-09-01" as const;

type Entity = Readonly<Record<string, unknown> & { key: string; id: string }>;

export type CuratedForeignNationalAdapterPack = Readonly<{
  schemaVersion: 1;
  packId: typeof SK_ADAPTER_PACK_ID | typeof SK_HEALTH_ADAPTER_PACK_ID;
  countryCode: ForeignNationalAdapterCountry;
  canonicalLanguage: "de";
  trustDomain: Readonly<{ key: string; id: string; code: typeof FOREIGN_NATIONAL_ADAPTER_TRUST_DOMAIN; name: string }>;
  jurisdictions: readonly Entity[];
  territorialScopes: readonly Entity[];
  publishers: readonly Entity[];
  authorities: readonly Entity[];
  sources: readonly Entity[];
  sourceVersions: readonly Entity[];
  passages: readonly Entity[];
  claims: readonly Entity[];
  evidenceLinks: readonly Entity[];
  citations: readonly Entity[];
  processes: readonly Entity[];
  processClaimLinks: readonly Entity[];
  handlingPolicies: readonly Entity[];
  freshnessRecords: readonly Entity[];
}>;

export function classifySkEmployerEfiling(asOf: Date = new Date()): "FUTURE_ENACTED" | "CURRENT" {
  const gate = Date.parse(`${SK_EMPLOYER_EFILING_EFFECTIVE}T00:00:00+02:00`);
  return asOf.getTime() < gate ? "FUTURE_ENACTED" : "CURRENT";
}

export function validateForeignNationalAdapterPack(
  pack: CuratedForeignNationalAdapterPack,
): Readonly<{ valid: boolean; issues: readonly string[]; productionEligible: false }> {
  const issues: string[] = [];
  if (pack.schemaVersion !== 1
      || !(AUTHORIZED_SK_ADAPTER_PACK_IDS as readonly string[]).includes(pack.packId)) {
    issues.push("SK_ADAPTER_IDENTITY_INVALID");
  }
  if (pack.canonicalLanguage !== "de") issues.push("INVALID_CANONICAL_LANGUAGE");
  if (pack.trustDomain.code !== "sk") issues.push("SK_TRUST_DOMAIN_REQUIRED");
  const country = pack.countryCode as string;
  if (!(FOREIGN_NATIONAL_ADAPTER_COUNTRIES as readonly string[]).includes(country)) {
    issues.push("FOREIGN_NATIONAL_COUNTRY_NOT_AUTHORIZED");
  }
  if (country === "CZ" || country === "PL" || country === "HU") {
    issues.push("FOREIGN_NATIONAL_COUNTRY_NOT_AUTHORIZED");
  }
  for (const jurisdiction of pack.jurisdictions) {
    if (jurisdiction.level !== "foreign_national" || jurisdiction.countryCode !== "SK") {
      issues.push("SK_FOREIGN_NATIONAL_JURISDICTION_REQUIRED");
    }
    if (jurisdiction.code === "de_sk") issues.push("DE_SK_JURISDICTION_FORBIDDEN");
  }
  const urls = pack.sources.map((source) => String(source.canonicalUrl));
  if (new Set(urls).size !== urls.length) issues.push("DUPLICATE_CANONICAL_URL");
  if (urls.some((url) => url.includes("#"))) issues.push("HASH_IN_CANONICAL_URL");
  const forbidden = /wikipedia|reddit|linkedin|kpmg|payroll|relocation|anwalt|kanzlei|forum|financnykompas/iu;
  if (urls.some((url) => forbidden.test(url))) issues.push("NON_AUTHORITATIVE_CANONICAL_URL");
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    productionEligible: false,
  });
}

export function adapterFactoryId(entityClass: string, key: string): string {
  return stableKnowledgeFactoryId("unused", entityClass, key);
}

export function fingerprintForeignNationalAdapterPack(
  pack: CuratedForeignNationalAdapterPack,
): string {
  return createHash("sha256").update(JSON.stringify(pack)).digest("hex");
}
