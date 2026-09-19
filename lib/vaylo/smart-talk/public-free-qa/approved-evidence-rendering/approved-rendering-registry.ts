/**
 * Pure, unwired Approved Evidence Rendering Registry (STEP3).
 *
 * PROVENANCE: `createApprovedRenderingResolver` proves schema and integrity consistency only.
 * It does not prove the snapshot originated from the production database. Only a future
 * trusted compiler/loader plus authoritative revision RPC may authorize production snapshots.
 *
 * INTEGRITY: `integrityRoot` detects corruption and deterministic drift; it is not a signature.
 */

import { createHash } from "node:crypto";
import { types } from "node:util";

import {
  FINGERPRINT_ALGORITHM,
  MAX_ALLOWED_DESTINATIONS,
  MAX_REGISTRY_ENTRIES,
  MAX_RENDERING_TEXT_UTF16,
  MAX_REQUIRED_CONTEXT_KEYS,
  MAX_SOURCE_EVIDENCE_BINDINGS,
  REGISTRY_SCHEMA_VERSION,
  RETRIEVAL_BINDING_TTL_MS,
  type ApprovedEvidenceRenderingEntry,
  type ApprovedRenderingLookupResult,
  type ApprovedRenderingResolver,
  type AuthorizedEvidenceSegment,
  type CandidateRef,
  type CreateApprovedRenderingResolverResult,
  type EvidenceClaimClass,
  type HandlingMode,
  type IntegrityRootComputationResult,
  type JurisdictionCode,
  type PublicAnswerLocale,
  type PublicJurisdictionContext,
  type RenderingAuthorizationProof,
  type RenderingIntegrityProof,
  type RetrievalCandidate,
  type RetrievalCandidateBinding,
  type RetrievalBindingFailureReason,
  type SmartTalkTextDestination,
  type SourceEvidenceBinding,
} from "./approved-rendering-registry-types";

const BINDING_BRAND = Symbol("RetrievalCandidateBindingBrand");

const ISSUED_RETRIEVAL_BINDINGS = new WeakSet<object>();

type BrandedBinding = RetrievalCandidateBinding & {
  readonly [BINDING_BRAND]: true;
};

function isExaminedProxy(value: unknown): boolean {
  return types.isProxy(value);
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const FINGERPRINT_RE = /^[0-9a-f]{64}$/;
const CANDIDATE_REF_RE = /^cand_[0-9a-f]{64}$/;
const ISO_UTC_RE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;

const PUBLIC_LOCALES: readonly PublicAnswerLocale[] = ["de", "en", "sk"];
const LOCALE_RANK: Readonly<Record<PublicAnswerLocale, number>> = {
  de: 0,
  en: 1,
  sk: 2,
};

const JURISDICTION_CODES = new Set<JurisdictionCode>([
  "DE",
  "AT",
  "SK",
  "DE-SK",
  "AT-SK",
  "DE-AT-SK",
]);

const HANDLING_MODES = new Set<HandlingMode>([
  "STORE_CANONICALLY",
  "FETCH_LIVE",
  "CACHE_AND_REVALIDATE",
  "MANUAL_REVIEW_REQUIRED",
  "DO_NOT_ANSWER_WITHOUT_CONTEXT",
]);

const CLAIM_CLASSES = new Set<EvidenceClaimClass>([
  "definition",
  "procedural_orientation",
  "procedural_step",
  "required_document",
  "authority_identity",
  "eligibility_entitlement",
  "deadline",
  "fee_amount",
  "legal_consequence",
  "contact_detail",
  "official_url",
  "cross_border_coordination",
]);

const DESTINATIONS = new Set<SmartTalkTextDestination>([
  "summary",
  "meaning",
  "documentTypeLabel",
  "nextSteps",
  "warnings",
  "stabilizers",
  "deadlines",
  "rights",
  "obligations",
  "consequences",
]);

const AUTHORIZATION_PROOF_KEYS = [
  "claimEmergencyDisabled",
  "claimPublicationState",
  "claimPublicationStateVersion",
  "effectiveFrom",
  "effectiveUntil",
  "handlingMode",
  "jurisdictionCode",
  "requiredContextKeys",
  "sourceActiveStatus",
  "sourceAuthorizationState",
  "sourceEvidenceEligibility",
  "sourceRevision",
  "sourceTrustStatus",
  "sourceVersionCurrentUseAllowed",
  "sourceVersionFreshnessStatus",
  "sourceVersionReviewStatus",
  "sourceVersionSuperseded",
  "territorialScopeCode",
  "translationPublicationState",
  "translationPublicationStateVersion",
  "translationStatus",
] as const;

const ENTRY_KEYS = [
  "allowedDestinations",
  "authorization",
  "canonicalUnitId",
  "claimClass",
  "claimId",
  "locale",
  "propositionFingerprint",
  "renderingId",
  "renderingText",
  "renderingTextFingerprint",
  "renderingVersion",
  "sourceEvidenceBindings",
  "translationReviewRecordId",
  "translationRowId",
] as const;

const SOURCE_BINDING_KEYS = [
  "isPrimaryEvidence",
  "passageId",
  "sourceId",
  "sourceVersionId",
] as const;

const ROOT_INPUT_KEYS = [
  "entries",
  "fingerprintAlgorithm",
  "registrySchemaVersion",
  "sourceRevision",
] as const;

const SNAPSHOT_KEYS = [
  "compiledAt",
  "entries",
  "fingerprintAlgorithm",
  "integrityRoot",
  "registrySchemaVersion",
  "snapshotId",
  "sourceRevision",
] as const;

const LOOKUP_INPUT_KEYS = [
  "authoritativeRevision",
  "binding",
  "candidateRef",
  "context",
  "destination",
  "jurisdiction",
  "locale",
  "nowIso",
] as const;

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object") {
    for (const child of Object.values(value as Record<string, unknown>)) {
      if (child && typeof child === "object") deepFreeze(child);
    }
    if (!Object.isFrozen(value)) Object.freeze(value);
  }
  return value;
}

function isPositiveSafeInteger(value: unknown): value is number {
  return typeof value === "number"
    && Number.isSafeInteger(value)
    && value > 0;
}

function isCanonicalRevisionString(value: unknown): value is string {
  if (typeof value !== "string" || value.length === 0 || value.length > 32) return false;
  if (!/^\d+$/.test(value)) return false;
  if (value.length > 1 && value.startsWith("0")) return false;
  try {
    const asBig = BigInt(value);
    return asBig > BigInt(0);
  } catch {
    return false;
  }
}

function isCanonicalUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}

function isCanonicalFingerprint(value: unknown): value is string {
  return typeof value === "string" && FINGERPRINT_RE.test(value);
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function daysInMonth(year: number, month: number): number {
  const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 2 && isLeapYear(year)) return 29;
  return monthLengths[month - 1];
}

function utcInstantToMilliseconds(value: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?Z$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6]);
  const millisecond = match[7] ? Number(match[7].padEnd(3, "0")) : 0;
  if (
    month < 1
    || month > 12
    || day < 1
    || day > daysInMonth(year, month)
    || hour > 23
    || minute > 59
    || second > 59
    || millisecond > 999
  ) {
    return null;
  }
  const millisecondText = match[7] ? match[7].padEnd(3, "0") : "000";
  const isoUtc = `${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6]}.${millisecondText}Z`;
  const date = new Date(isoUtc);
  const milliseconds = date.getTime();
  if (!Number.isFinite(milliseconds)) return null;
  if (date.getUTCFullYear() !== year) return null;
  if (date.getUTCMonth() !== month - 1) return null;
  if (date.getUTCDate() !== day) return null;
  if (date.getUTCHours() !== hour) return null;
  if (date.getUTCMinutes() !== minute) return null;
  if (date.getUTCSeconds() !== second) return null;
  if (date.getUTCMilliseconds() !== millisecond) return null;
  return milliseconds;
}

function isCanonicalUtcInstant(value: unknown): value is string {
  if (typeof value !== "string" || !ISO_UTC_RE.test(value)) return false;
  return utcInstantToMilliseconds(value) !== null;
}

function isAllowedPlainPrototype(value: object): boolean {
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}

function readDataProperty(
  value: Record<string, unknown>,
  key: string,
): unknown {
  try {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor || descriptor.get || descriptor.set) return undefined;
    if (!Object.prototype.hasOwnProperty.call(descriptor, "value")) return undefined;
    const reflected = Reflect.get(value, key);
    if (!Object.is(reflected, descriptor.value)) return undefined;
    return reflected;
  } catch {
    return undefined;
  }
}

function isPlainDataObjectWithExactKeys(
  value: unknown,
  requiredKeys: readonly string[],
): value is Record<string, unknown> {
  if (isExaminedProxy(value)) return false;
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  if (!isAllowedPlainPrototype(value)) return false;
  if (Object.getOwnPropertySymbols(value).length > 0) return false;
  const ownNames = Object.getOwnPropertyNames(value);
  if (ownNames.length !== requiredKeys.length) return false;
  for (const key of requiredKeys) {
    if (!Object.prototype.hasOwnProperty.call(value, key)) return false;
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor || descriptor.get || descriptor.set) return false;
    if (!Object.prototype.hasOwnProperty.call(descriptor, "value")) return false;
    if (descriptor.enumerable === false) return false;
  }
  for (const key of ownNames) {
    if (!requiredKeys.includes(key)) return false;
  }
  return true;
}

function isDenseDataArray(
  value: unknown,
  minLength: number,
  maxLength: number,
): value is unknown[] {
  if (isExaminedProxy(value)) return false;
  if (!Array.isArray(value)) return false;
  if (value.length < minLength || value.length > maxLength) return false;
  if (Object.getOwnPropertySymbols(value).length > 0) return false;
  const allowed = new Set<string>(["length"]);
  for (let index = 0; index < value.length; index += 1) {
    allowed.add(String(index));
  }
  for (const name of Object.getOwnPropertyNames(value)) {
    if (!allowed.has(name)) return false;
  }
  for (let index = 0; index < value.length; index += 1) {
    if (!Object.prototype.hasOwnProperty.call(value, index)) return false;
    const descriptor = Object.getOwnPropertyDescriptor(value, index);
    if (!descriptor || descriptor.get || descriptor.set) return false;
    if (!Object.prototype.hasOwnProperty.call(descriptor, "value")) return false;
    if (isExaminedProxy(descriptor.value)) return false;
  }
  return true;
}

function validateServerEstablishedContext(
  value: unknown,
): Readonly<Record<string, boolean>> | null {
  if (isExaminedProxy(value)) return null;
  if (!isPlainDataObjectWithExactKeys(value, ["contextKeys"])) return null;
  const record = value as Record<string, unknown>;
  const contextKeys = readDataProperty(record, "contextKeys");
  if (isExaminedProxy(contextKeys)) return null;
  if (contextKeys === null || typeof contextKeys !== "object" || Array.isArray(contextKeys)) {
    return null;
  }
  if (!isAllowedPlainPrototype(contextKeys)) return null;
  if (Object.getOwnPropertySymbols(contextKeys).length > 0) return null;
  const ownNames = Object.getOwnPropertyNames(contextKeys);
  if (ownNames.length > MAX_REQUIRED_CONTEXT_KEYS) return null;
  const normalized: Record<string, boolean> = {};
  for (const key of ownNames) {
    if (key.length === 0 || key.length > 64 || !isCanonicalRegistryString(key)) return null;
    const descriptor = Object.getOwnPropertyDescriptor(contextKeys, key);
    if (!descriptor || descriptor.get || descriptor.set) return null;
    if (!Object.prototype.hasOwnProperty.call(descriptor, "value")) return null;
    if (descriptor.enumerable === false) return null;
    const propValue = descriptor.value;
    if (typeof propValue !== "boolean") return null;
    normalized[key] = propValue;
  }
  return normalized;
}

export function normalizeReleaseText(text: string): string {
  const lf = text.replace(/\r\n/g, "\n");
  const nfc = lf.normalize("NFC");
  return nfc.replace(/^\s+|\s+$/g, "");
}

class RegistryUtf16InvariantError extends Error {
  readonly name = "RegistryUtf16InvariantError";
}

function isWellFormedUtf16(value: string): boolean {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code >= 0xd800 && code <= 0xdbff) {
      if (index + 1 >= value.length) return false;
      const next = value.charCodeAt(index + 1);
      if (next < 0xdc00 || next > 0xdfff) return false;
      index += 1;
      continue;
    }
    if (code >= 0xdc00 && code <= 0xdfff) return false;
  }
  return true;
}

function isCanonicalRegistryString(value: string): boolean {
  return isWellFormedUtf16(value) && value.normalize("NFC") === value;
}

function fingerprintUtf8Sha256(text: string): string {
  if (!isWellFormedUtf16(text)) {
    throw new RegistryUtf16InvariantError();
  }
  return createHash("sha256").update(text, "utf8").digest("hex");
}

function escapeJsonString(value: string): string {
  if (!isCanonicalRegistryString(value)) {
    throw new RegistryUtf16InvariantError();
  }
  let out = '"';
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    const ch = value[index];
    if (ch === '"') out += '\\"';
    else if (ch === "\\") out += "\\\\";
    else if (ch === "\n") out += "\\n";
    else if (ch === "\r") out += "\\r";
    else if (ch === "\t") out += "\\t";
    else if (code < 0x20) out += `\\u${code.toString(16).padStart(4, "0")}`;
    else out += ch;
  }
  out += '"';
  return out;
}

function canonicalSerializePrimitive(value: unknown): string | null {
  if (value === null) return "null";
  if (value === true) return "true";
  if (value === false) return "false";
  if (typeof value === "number") {
    if (!Number.isSafeInteger(value) || Object.is(value, -0)) return null;
    return String(value);
  }
  if (typeof value === "string") {
    if (!isCanonicalRegistryString(value)) return null;
    return escapeJsonString(value);
  }
  return null;
}

function canonicalSerializeValue(value: unknown): string | null {
  const primitive = canonicalSerializePrimitive(value);
  if (primitive !== null) return primitive;
  if (Array.isArray(value)) {
    if (!isDenseDataArray(value, 0, MAX_REGISTRY_ENTRIES)) return null;
    const parts: string[] = [];
    for (const item of value) {
      const serialized = canonicalSerializeValue(item);
      if (serialized === null) return null;
      parts.push(serialized);
    }
    return `[${parts.join(",")}]`;
  }
  if (typeof value === "object" && value !== null) return null;
  return null;
}

function canonicalSerializeObject(
  value: Record<string, unknown>,
  orderedKeys: readonly string[],
): string | null {
  if (!isPlainDataObjectWithExactKeys(value, orderedKeys)) return null;
  const parts: string[] = [];
  for (const key of orderedKeys) {
    const child = readDataProperty(value, key);
    const serialized = canonicalSerializeValue(child);
    if (serialized === null) return null;
    parts.push(`${escapeJsonString(key)}:${serialized}`);
  }
  return `{${parts.join(",")}}`;
}

function canonicalSerializeAuthorizationProof(
  proof: RenderingAuthorizationProof,
): string | null {
  return canonicalSerializeObject(
    proof as unknown as Record<string, unknown>,
    AUTHORIZATION_PROOF_KEYS,
  );
}

function canonicalSerializeSourceBinding(binding: SourceEvidenceBinding): string | null {
  return canonicalSerializeObject(
    binding as unknown as Record<string, unknown>,
    SOURCE_BINDING_KEYS,
  );
}

function canonicalSerializeEntry(entry: ApprovedEvidenceRenderingEntry): string | null {
  const auth = canonicalSerializeAuthorizationProof(entry.authorization);
  if (!auth) return null;
  const bindings: string[] = [];
  for (const binding of entry.sourceEvidenceBindings) {
    const serialized = canonicalSerializeSourceBinding(binding);
    if (!serialized) return null;
    bindings.push(serialized);
  }
  const destinations = canonicalSerializeValue([...entry.allowedDestinations]);
  if (!destinations) return null;
  const parts = [
    `${escapeJsonString("allowedDestinations")}:${destinations}`,
    `${escapeJsonString("authorization")}:${auth}`,
    `${escapeJsonString("canonicalUnitId")}:${escapeJsonString(entry.canonicalUnitId)}`,
    `${escapeJsonString("claimClass")}:${escapeJsonString(entry.claimClass)}`,
    `${escapeJsonString("claimId")}:${escapeJsonString(entry.claimId)}`,
    `${escapeJsonString("locale")}:${escapeJsonString(entry.locale)}`,
    `${escapeJsonString("propositionFingerprint")}:${escapeJsonString(entry.propositionFingerprint)}`,
    `${escapeJsonString("renderingId")}:${escapeJsonString(entry.renderingId)}`,
    `${escapeJsonString("renderingText")}:${escapeJsonString(entry.renderingText)}`,
    `${escapeJsonString("renderingTextFingerprint")}:${escapeJsonString(entry.renderingTextFingerprint)}`,
    `${escapeJsonString("renderingVersion")}:${String(entry.renderingVersion)}`,
    `${escapeJsonString("sourceEvidenceBindings")}:[${bindings.join(",")}]`,
    `${escapeJsonString("translationReviewRecordId")}:${
      entry.translationReviewRecordId === null
        ? "null"
        : escapeJsonString(entry.translationReviewRecordId)
    }`,
    `${escapeJsonString("translationRowId")}:${
      entry.translationRowId === null ? "null" : escapeJsonString(entry.translationRowId)
    }`,
  ];
  return `{${parts.join(",")}}`;
}

function compareEntries(
  a: ApprovedEvidenceRenderingEntry,
  b: ApprovedEvidenceRenderingEntry,
): number {
  if (a.claimId !== b.claimId) return a.claimId < b.claimId ? -1 : 1;
  const rankA = LOCALE_RANK[a.locale];
  const rankB = LOCALE_RANK[b.locale];
  if (rankA !== rankB) return rankA - rankB;
  if (a.renderingId !== b.renderingId) return a.renderingId < b.renderingId ? -1 : 1;
  return 0;
}

function validateSortedUniqueStrings(
  values: unknown,
  allowed: ReadonlySet<string>,
  max: number,
  minLength = 1,
): string[] | null {
  if (!isDenseDataArray(values, minLength, max)) return null;
  const result: string[] = [];
  for (const item of values) {
    if (typeof item !== "string" || !allowed.has(item)) return null;
    result.push(item);
  }
  for (let index = 1; index < result.length; index += 1) {
    if (result[index] <= result[index - 1]) return null;
  }
  return [...new Set(result)].length === result.length ? result : null;
}

function validateSortedUniqueContextKeys(values: unknown): string[] | null {
  if (!isDenseDataArray(values, 0, MAX_REQUIRED_CONTEXT_KEYS)) return null;
  const result: string[] = [];
  for (const item of values) {
    if (typeof item !== "string" || item.length === 0 || item.length > 64) return null;
    if (!isCanonicalRegistryString(item)) return null;
    result.push(item);
  }
  for (let index = 1; index < result.length; index += 1) {
    if (result[index] <= result[index - 1]) return null;
  }
  return [...new Set(result)].length === result.length ? result : null;
}

function validateSourceEvidenceBindings(
  value: unknown,
): SourceEvidenceBinding[] | null {
  if (!isDenseDataArray(value, 1, MAX_SOURCE_EVIDENCE_BINDINGS)) return null;
  const bindings: SourceEvidenceBinding[] = [];
  let hasPrimary = false;
  const seen = new Set<string>();
  for (const row of value) {
    if (!isPlainDataObjectWithExactKeys(row, SOURCE_BINDING_KEYS)) return null;
    const record = row as Record<string, unknown>;
    const sourceId = readDataProperty(record, "sourceId");
    const sourceVersionId = readDataProperty(record, "sourceVersionId");
    const passageId = readDataProperty(record, "passageId");
    const isPrimaryEvidence = readDataProperty(record, "isPrimaryEvidence");
    if (
      !isCanonicalUuid(sourceId)
      || !isCanonicalUuid(sourceVersionId)
      || !isCanonicalUuid(passageId)
      || typeof isPrimaryEvidence !== "boolean"
    ) {
      return null;
    }
    const pairKey = `${sourceVersionId}|${passageId}`;
    if (seen.has(pairKey)) return null;
    seen.add(pairKey);
    if (isPrimaryEvidence) hasPrimary = true;
    if (bindings.length > 0) {
      const prev = bindings[bindings.length - 1];
      if (
        sourceVersionId < prev.sourceVersionId
        || (sourceVersionId === prev.sourceVersionId && passageId <= prev.passageId)
      ) {
        return null;
      }
    }
    bindings.push({
      sourceId,
      sourceVersionId,
      passageId,
      isPrimaryEvidence,
    });
  }
  if (!hasPrimary) return null;
  return bindings;
}

function validateAuthorizationProof(
  value: unknown,
  expectedSourceRevision: string,
): RenderingAuthorizationProof | null {
  if (!isPlainDataObjectWithExactKeys(value, AUTHORIZATION_PROOF_KEYS)) return null;
  const record = value as Record<string, unknown>;
  const claimPublicationState = readDataProperty(record, "claimPublicationState");
  const claimEmergencyDisabled = readDataProperty(record, "claimEmergencyDisabled");
  const claimPublicationStateVersion = readDataProperty(record, "claimPublicationStateVersion");
  const translationStatus = readDataProperty(record, "translationStatus");
  const translationPublicationState = readDataProperty(record, "translationPublicationState");
  const translationPublicationStateVersion = readDataProperty(
    record,
    "translationPublicationStateVersion",
  );
  const sourceRevision = readDataProperty(record, "sourceRevision");
  const handlingMode = readDataProperty(record, "handlingMode");
  const jurisdictionCode = readDataProperty(record, "jurisdictionCode");
  const requiredContextKeys = readDataProperty(record, "requiredContextKeys");
  const effectiveFrom = readDataProperty(record, "effectiveFrom");
  const effectiveUntil = readDataProperty(record, "effectiveUntil");
  const territorialScopeCode = readDataProperty(record, "territorialScopeCode");

  if (claimPublicationState !== "published" || claimEmergencyDisabled !== false) return null;
  if (!isPositiveSafeInteger(claimPublicationStateVersion)) return null;
  if (sourceRevision !== expectedSourceRevision) return null;
  if (typeof handlingMode !== "string" || !HANDLING_MODES.has(handlingMode as HandlingMode)) {
    return null;
  }
  if (
    typeof jurisdictionCode !== "string"
    || !JURISDICTION_CODES.has(jurisdictionCode as JurisdictionCode)
  ) {
    return null;
  }
  const contextKeys = validateSortedUniqueContextKeys(requiredContextKeys);
  if (contextKeys === null) return null;
  if (effectiveFrom !== null && !isCanonicalUtcInstant(effectiveFrom)) return null;
  if (effectiveUntil !== null && !isCanonicalUtcInstant(effectiveUntil)) return null;
  if (effectiveFrom !== null && effectiveUntil !== null) {
    const fromMs = utcInstantToMilliseconds(effectiveFrom);
    const untilMs = utcInstantToMilliseconds(effectiveUntil);
    if (fromMs === null || untilMs === null || fromMs > untilMs) return null;
  }
  if (
    territorialScopeCode !== null
    && (typeof territorialScopeCode !== "string"
      || territorialScopeCode.length === 0
      || territorialScopeCode.length > 128
      || !isCanonicalRegistryString(territorialScopeCode))
  ) {
    return null;
  }

  const literals = {
    sourceActiveStatus: readDataProperty(record, "sourceActiveStatus"),
    sourceTrustStatus: readDataProperty(record, "sourceTrustStatus"),
    sourceEvidenceEligibility: readDataProperty(record, "sourceEvidenceEligibility"),
    sourceAuthorizationState: readDataProperty(record, "sourceAuthorizationState"),
    sourceVersionReviewStatus: readDataProperty(record, "sourceVersionReviewStatus"),
    sourceVersionFreshnessStatus: readDataProperty(record, "sourceVersionFreshnessStatus"),
    sourceVersionCurrentUseAllowed: readDataProperty(record, "sourceVersionCurrentUseAllowed"),
    sourceVersionSuperseded: readDataProperty(record, "sourceVersionSuperseded"),
  };
  if (
    literals.sourceActiveStatus !== "ACTIVE"
    || literals.sourceTrustStatus !== "VERIFIED"
    || literals.sourceEvidenceEligibility !== "PUBLICATION_EVIDENCE_ELIGIBLE"
    || literals.sourceAuthorizationState !== "AUTHORIZED"
    || literals.sourceVersionReviewStatus !== "expert_reviewed"
    || literals.sourceVersionFreshnessStatus !== "fresh"
    || literals.sourceVersionCurrentUseAllowed !== true
    || literals.sourceVersionSuperseded !== false
  ) {
    return null;
  }

  if (
    translationStatus !== "approved"
    && translationStatus !== "not_applicable_de"
  ) {
    return null;
  }
  if (
    translationPublicationState !== "published"
    && translationPublicationState !== "not_applicable_de"
  ) {
    return null;
  }
  if (
    translationPublicationStateVersion !== null
    && !isPositiveSafeInteger(translationPublicationStateVersion)
  ) {
    return null;
  }

  return {
    claimPublicationState: "published",
    claimEmergencyDisabled: false,
    claimPublicationStateVersion,
    translationStatus: translationStatus as "approved" | "not_applicable_de",
    translationPublicationState: translationPublicationState as
      | "published"
      | "not_applicable_de",
    translationPublicationStateVersion: translationPublicationStateVersion as number | null,
    sourceActiveStatus: "ACTIVE",
    sourceTrustStatus: "VERIFIED",
    sourceEvidenceEligibility: "PUBLICATION_EVIDENCE_ELIGIBLE",
    sourceAuthorizationState: "AUTHORIZED",
    sourceVersionReviewStatus: "expert_reviewed",
    sourceVersionFreshnessStatus: "fresh",
    sourceVersionCurrentUseAllowed: true,
    sourceVersionSuperseded: false,
    handlingMode: handlingMode as HandlingMode,
    requiredContextKeys: contextKeys,
    jurisdictionCode: jurisdictionCode as JurisdictionCode,
    territorialScopeCode: territorialScopeCode as string | null,
    effectiveFrom: effectiveFrom as string | null,
    effectiveUntil: effectiveUntil as string | null,
    sourceRevision: expectedSourceRevision,
  };
}

function validateRenderingText(text: unknown): string | null {
  if (typeof text !== "string") return null;
  if (text.length < 1 || text.length > MAX_RENDERING_TEXT_UTF16) return null;
  if (!isWellFormedUtf16(text)) return null;
  if (text.normalize("NFC") !== text) return null;
  if (text !== normalizeReleaseText(text)) return null;
  return text;
}

function validateRegistryIdentifier(
  value: unknown,
  minLength: number,
  maxLength: number,
): string | null {
  if (typeof value !== "string") return null;
  if (value.length < minLength || value.length > maxLength) return null;
  if (!isCanonicalRegistryString(value)) return null;
  return value;
}

function validateEntry(
  value: unknown,
  expectedSourceRevision: string,
): ApprovedEvidenceRenderingEntry | null {
  if (!isPlainDataObjectWithExactKeys(value, ENTRY_KEYS)) return null;
  const record = value as Record<string, unknown>;
  const renderingId = validateRegistryIdentifier(readDataProperty(record, "renderingId"), 1, 256);
  const claimId = readDataProperty(record, "claimId");
  const canonicalUnitId = validateRegistryIdentifier(
    readDataProperty(record, "canonicalUnitId"),
    1,
    128,
  );
  const locale = readDataProperty(record, "locale");
  const renderingText = validateRenderingText(readDataProperty(record, "renderingText"));
  const renderingTextFingerprint = readDataProperty(record, "renderingTextFingerprint");
  const renderingVersion = readDataProperty(record, "renderingVersion");
  const propositionFingerprint = readDataProperty(record, "propositionFingerprint");
  const claimClass = readDataProperty(record, "claimClass");
  const allowedDestinations = readDataProperty(record, "allowedDestinations");
  const sourceEvidenceBindings = validateSourceEvidenceBindings(
    readDataProperty(record, "sourceEvidenceBindings"),
  );
  const translationRowId = readDataProperty(record, "translationRowId");
  const translationReviewRecordId = readDataProperty(record, "translationReviewRecordId");
  const authorization = validateAuthorizationProof(
    readDataProperty(record, "authorization"),
    expectedSourceRevision,
  );

  if (
    !renderingId
    || !isCanonicalUuid(claimId)
    || !canonicalUnitId
    || typeof locale !== "string"
    || !PUBLIC_LOCALES.includes(locale as PublicAnswerLocale)
    || !renderingText
    || !isCanonicalFingerprint(renderingTextFingerprint)
    || !isCanonicalFingerprint(propositionFingerprint)
    || !isPositiveSafeInteger(renderingVersion)
    || typeof claimClass !== "string"
    || !CLAIM_CLASSES.has(claimClass as EvidenceClaimClass)
    || !authorization
    || !sourceEvidenceBindings
  ) {
    return null;
  }

  const destinations = validateSortedUniqueStrings(
    allowedDestinations,
    DESTINATIONS,
    MAX_ALLOWED_DESTINATIONS,
  );
  if (!destinations) return null;

  if (fingerprintUtf8Sha256(renderingText) !== renderingTextFingerprint) return null;

  const loc = locale as PublicAnswerLocale;
  if (loc === "de") {
    if (
      authorization.translationStatus !== "not_applicable_de"
      || authorization.translationPublicationState !== "not_applicable_de"
      || authorization.translationPublicationStateVersion !== null
      || translationRowId !== null
      || translationReviewRecordId !== null
      || renderingTextFingerprint !== propositionFingerprint
    ) {
      return null;
    }
  } else {
    if (
      authorization.translationStatus !== "approved"
      || authorization.translationPublicationState !== "published"
      || !isPositiveSafeInteger(authorization.translationPublicationStateVersion)
      || !isCanonicalUuid(translationRowId)
      || !validateRegistryIdentifier(translationReviewRecordId, 1, 128)
    ) {
      return null;
    }
  }

  return {
    renderingId,
    claimId,
    canonicalUnitId,
    locale: loc,
    renderingText,
    renderingTextFingerprint,
    renderingVersion,
    propositionFingerprint,
    claimClass: claimClass as EvidenceClaimClass,
    allowedDestinations: destinations as SmartTalkTextDestination[],
    sourceEvidenceBindings,
    translationRowId: translationRowId as string | null,
    translationReviewRecordId: translationReviewRecordId as string | null,
    authorization,
  };
}

function buildRootPayloadCanonical(
  entries: readonly ApprovedEvidenceRenderingEntry[],
  sourceRevision: string,
): string | null {
  const sorted = [...entries].sort(compareEntries);
  const entryStrings: string[] = [];
  for (const entry of sorted) {
    const serialized = canonicalSerializeEntry(entry);
    if (!serialized) return null;
    entryStrings.push(serialized);
  }
  const parts = [
    `${escapeJsonString("entries")}:[${entryStrings.join(",")}]`,
    `${escapeJsonString("fingerprintAlgorithm")}:${escapeJsonString(FINGERPRINT_ALGORITHM)}`,
    `${escapeJsonString("registrySchemaVersion")}:${String(REGISTRY_SCHEMA_VERSION)}`,
    `${escapeJsonString("sourceRevision")}:${escapeJsonString(sourceRevision)}`,
  ];
  return `{${parts.join(",")}}`;
}

function computeIntegrityRootFromEntries(
  entries: readonly ApprovedEvidenceRenderingEntry[],
  sourceRevision: string,
): string | null {
  const canonical = buildRootPayloadCanonical(entries, sourceRevision);
  if (!canonical) return null;
  return fingerprintUtf8Sha256(canonical);
}

function cloneEntry(entry: ApprovedEvidenceRenderingEntry): ApprovedEvidenceRenderingEntry {
  return {
    renderingId: entry.renderingId,
    claimId: entry.claimId,
    canonicalUnitId: entry.canonicalUnitId,
    locale: entry.locale,
    renderingText: entry.renderingText,
    renderingTextFingerprint: entry.renderingTextFingerprint,
    renderingVersion: entry.renderingVersion,
    propositionFingerprint: entry.propositionFingerprint,
    claimClass: entry.claimClass,
    allowedDestinations: [...entry.allowedDestinations],
    sourceEvidenceBindings: entry.sourceEvidenceBindings.map((binding) => ({
      sourceId: binding.sourceId,
      sourceVersionId: binding.sourceVersionId,
      passageId: binding.passageId,
      isPrimaryEvidence: binding.isPrimaryEvidence,
    })),
    translationRowId: entry.translationRowId,
    translationReviewRecordId: entry.translationReviewRecordId,
    authorization: { ...entry.authorization, requiredContextKeys: [...entry.authorization.requiredContextKeys] },
  };
}

export function computeApprovedRenderingRegistryIntegrityRoot(
  input: unknown,
): IntegrityRootComputationResult {
  try {
    if (isExaminedProxy(input)) {
      return { ok: false, reason: "malformed_snapshot" };
    }
    if (!isPlainDataObjectWithExactKeys(input, ROOT_INPUT_KEYS)) {
      return { ok: false, reason: "malformed_snapshot" };
    }
    const record = input as Record<string, unknown>;
    const registrySchemaVersion = readDataProperty(record, "registrySchemaVersion");
    const fingerprintAlgorithm = readDataProperty(record, "fingerprintAlgorithm");
    const sourceRevision = readDataProperty(record, "sourceRevision");
    const entriesRaw = readDataProperty(record, "entries");

    if (registrySchemaVersion !== REGISTRY_SCHEMA_VERSION) {
      return { ok: false, reason: "unsupported_schema_version" };
    }
    if (fingerprintAlgorithm !== FINGERPRINT_ALGORITHM) {
      return { ok: false, reason: "malformed_snapshot" };
    }
    if (!isCanonicalRevisionString(sourceRevision)) {
      return { ok: false, reason: "invalid_revision" };
    }
    if (!isDenseDataArray(entriesRaw, 0, MAX_REGISTRY_ENTRIES)) {
      return { ok: false, reason: "malformed_snapshot" };
    }

    const entries: ApprovedEvidenceRenderingEntry[] = [];
    const claimLocale = new Set<string>();
    const renderingIds = new Set<string>();

    for (const row of entriesRaw) {
      const entry = validateEntry(row, sourceRevision);
      if (!entry) return { ok: false, reason: "invalid_lifecycle_proof" };
      const key = `${entry.claimId}|${entry.locale}`;
      if (claimLocale.has(key)) return { ok: false, reason: "duplicate_claim_locale" };
      if (renderingIds.has(entry.renderingId)) {
        return { ok: false, reason: "duplicate_rendering_id" };
      }
      claimLocale.add(key);
      renderingIds.add(entry.renderingId);
      entries.push(entry);
    }

    const root = computeIntegrityRootFromEntries(entries, sourceRevision);
    if (!root) return { ok: false, reason: "canonicalization_failure" };
    return { ok: true, integrityRoot: root };
  } catch {
    return { ok: false, reason: "canonicalization_failure" };
  }
}

export function createApprovedRenderingResolver(
  snapshot: unknown,
): CreateApprovedRenderingResolverResult {
  try {
    if (isExaminedProxy(snapshot)) {
      return { ok: false, reason: "malformed_snapshot" };
    }
    if (!isPlainDataObjectWithExactKeys(snapshot, SNAPSHOT_KEYS)) {
      return { ok: false, reason: "malformed_snapshot" };
    }
    const record = snapshot as Record<string, unknown>;
    const compiledAt = readDataProperty(record, "compiledAt");
    const integrityRoot = readDataProperty(record, "integrityRoot");
    const snapshotId = readDataProperty(record, "snapshotId");

    if (!isCanonicalUtcInstant(compiledAt)) {
      return { ok: false, reason: "malformed_snapshot" };
    }
    if (!isCanonicalFingerprint(integrityRoot) || !isCanonicalFingerprint(snapshotId)) {
      return { ok: false, reason: "malformed_snapshot" };
    }
    if (integrityRoot !== snapshotId) {
      return { ok: false, reason: "integrity_root_mismatch" };
    }

    const rootResult = computeApprovedRenderingRegistryIntegrityRoot({
      entries: readDataProperty(record, "entries"),
      fingerprintAlgorithm: readDataProperty(record, "fingerprintAlgorithm"),
      registrySchemaVersion: readDataProperty(record, "registrySchemaVersion"),
      sourceRevision: readDataProperty(record, "sourceRevision"),
    });
    if (!rootResult.ok) return { ok: false, reason: rootResult.reason };
    if (rootResult.integrityRoot !== integrityRoot) {
      return { ok: false, reason: "integrity_root_mismatch" };
    }

    const sourceRevision = readDataProperty(record, "sourceRevision") as string;
    const entriesRaw = readDataProperty(record, "entries");
    if (!isDenseDataArray(entriesRaw, 0, MAX_REGISTRY_ENTRIES)) {
      return { ok: false, reason: "malformed_snapshot" };
    }

    const entries: ApprovedEvidenceRenderingEntry[] = [];
    const byClaimLocale = new Map<string, ApprovedEvidenceRenderingEntry>();
    const renderingIds = new Set<string>();

    for (const row of entriesRaw) {
      const entry = validateEntry(row, sourceRevision);
      if (!entry) return { ok: false, reason: "invalid_lifecycle_proof" };
      const key = `${entry.claimId}|${entry.locale}`;
      if (byClaimLocale.has(key)) return { ok: false, reason: "duplicate_claim_locale" };
      if (renderingIds.has(entry.renderingId)) {
        return { ok: false, reason: "duplicate_rendering_id" };
      }
      byClaimLocale.set(key, entry);
      renderingIds.add(entry.renderingId);
      entries.push(cloneEntry(entry));
    }

    const frozenSnapshotId = integrityRoot;
    const frozenSourceRevision = sourceRevision;

    const resolver: ApprovedRenderingResolver = {
      lookup(input: unknown): ApprovedRenderingLookupResult {
        try {
          return lookupInternal(
            input,
            frozenSnapshotId,
            frozenSourceRevision,
            byClaimLocale,
          );
        } catch {
          return { ok: false, reason: "invalid_input" };
        }
      },
    };

    return { ok: true, resolver: deepFreeze(resolver) };
  } catch {
    return { ok: false, reason: "malformed_snapshot" };
  }
}

function isBrandedBinding(value: unknown): value is BrandedBinding {
  if (!value || typeof value !== "object") return false;
  if (isExaminedProxy(value)) return false;
  if (!ISSUED_RETRIEVAL_BINDINGS.has(value)) return false;
  return (value as BrandedBinding)[BINDING_BRAND] === true;
}

export function createRetrievalCandidateBinding(
  input: unknown,
):
  | Readonly<{ ok: true; binding: RetrievalCandidateBinding }>
  | Readonly<{ ok: false; reason: RetrievalBindingFailureReason }> {
  try {
    const BINDING_INPUT_KEYS = [
      "candidates",
      "expiresAt",
      "issuedAt",
      "requestId",
      "retrievalRevision",
    ] as const;
    if (!isPlainDataObjectWithExactKeys(input, BINDING_INPUT_KEYS)) {
      return { ok: false, reason: "invalid_input" };
    }
    const record = input as Record<string, unknown>;
    const requestIdRaw = readDataProperty(record, "requestId");
    const issuedAt = readDataProperty(record, "issuedAt");
    const expiresAt = readDataProperty(record, "expiresAt");
    const retrievalRevision = readDataProperty(record, "retrievalRevision");
    const candidatesRaw = readDataProperty(record, "candidates");

    const requestId = validateRegistryIdentifier(requestIdRaw, 1, 128);
    if (!requestId) {
      return { ok: false, reason: "invalid_input" };
    }
    if (!isCanonicalUtcInstant(issuedAt) || !isCanonicalUtcInstant(expiresAt)) {
      return { ok: false, reason: "invalid_input" };
    }
    const issuedMs = utcInstantToMilliseconds(issuedAt);
    const expiresMs = utcInstantToMilliseconds(expiresAt);
    if (issuedMs === null || expiresMs === null || expiresMs - issuedMs !== RETRIEVAL_BINDING_TTL_MS) {
      return { ok: false, reason: "invalid_time_window" };
    }
    if (!isCanonicalRevisionString(retrievalRevision)) {
      return { ok: false, reason: "invalid_revision" };
    }
    if (!isDenseDataArray(candidatesRaw, 1, MAX_REGISTRY_ENTRIES)) {
      return { ok: false, reason: "invalid_candidate" };
    }

    const candidates: RetrievalCandidate[] = [];
    const claimIds = new Set<string>();
    for (const row of candidatesRaw) {
      if (!isPlainDataObjectWithExactKeys(row, ["claimId", "propositionFingerprint"])) {
        return { ok: false, reason: "invalid_candidate" };
      }
      const candidateRecord = row as Record<string, unknown>;
      const claimId = readDataProperty(candidateRecord, "claimId");
      const propositionFingerprint = readDataProperty(
        candidateRecord,
        "propositionFingerprint",
      );
      if (!isCanonicalUuid(claimId) || !isCanonicalFingerprint(propositionFingerprint)) {
        return { ok: false, reason: "invalid_candidate" };
      }
      if (claimIds.has(claimId)) return { ok: false, reason: "duplicate_candidate" };
      claimIds.add(claimId);
      candidates.push({ claimId, propositionFingerprint });
    }

    candidates.sort((left, right) => {
      if (left.claimId !== right.claimId) return left.claimId < right.claimId ? -1 : 1;
      return left.propositionFingerprint < right.propositionFingerprint ? -1 : 1;
    });

    const candidateSetBody = candidates
      .map((candidate) => `${candidate.claimId}:${candidate.propositionFingerprint}`)
      .join(",");
    const candidateSetFingerprint = fingerprintUtf8Sha256(`v1|${candidateSetBody}`);

    const candidateByRef: Record<CandidateRef, RetrievalCandidate> = {};
    const refs = new Set<string>();
    for (const candidate of candidates) {
      const refHash = fingerprintUtf8Sha256(
        `${requestId}|${candidate.claimId}|${candidate.propositionFingerprint}|${retrievalRevision}`,
      );
      const candidateRef = `cand_${refHash}` as CandidateRef;
      if (refs.has(candidateRef)) return { ok: false, reason: "candidate_ref_collision" };
      refs.add(candidateRef);
      candidateByRef[candidateRef] = candidate;
    }

    const bindingId = fingerprintUtf8Sha256(
      `v1|${requestId}|${retrievalRevision}|${candidateSetFingerprint}|${issuedAt}|${expiresAt}`,
    );

    const binding: BrandedBinding = {
      [BINDING_BRAND]: true,
      bindingId,
      requestId,
      issuedAt,
      expiresAt,
      retrievalRevision,
      candidateClaimIds: candidates.map((candidate) => candidate.claimId),
      candidateSetFingerprint,
      candidateByRef,
    };

    ISSUED_RETRIEVAL_BINDINGS.add(binding);
    return { ok: true, binding: deepFreeze(binding) };
  } catch {
    return { ok: false, reason: "invalid_input" };
  }
}

function lookupInternal(
  input: unknown,
  snapshotId: string,
  sourceRevision: string,
  byClaimLocale: Map<string, ApprovedEvidenceRenderingEntry>,
): ApprovedRenderingLookupResult {
  if (!isPlainDataObjectWithExactKeys(input, LOOKUP_INPUT_KEYS)) {
    return { ok: false, reason: "invalid_input" };
  }
  const record = input as Record<string, unknown>;
  const binding = readDataProperty(record, "binding");
  const candidateRef = readDataProperty(record, "candidateRef");
  const locale = readDataProperty(record, "locale");
  const destination = readDataProperty(record, "destination");
  const jurisdiction = readDataProperty(record, "jurisdiction");
  const context = readDataProperty(record, "context");
  const authoritativeRevision = readDataProperty(record, "authoritativeRevision");
  const nowIso = readDataProperty(record, "nowIso");

  if (!isBrandedBinding(binding)) return { ok: false, reason: "invalid_input" };
  const normalizedContext = validateServerEstablishedContext(context);
  if (normalizedContext === null) {
    return { ok: false, reason: "invalid_input" };
  }
  if (typeof candidateRef !== "string" || !CANDIDATE_REF_RE.test(candidateRef)) {
    return { ok: false, reason: "provider_correlation_invalid" };
  }
  if (typeof locale !== "string" || !PUBLIC_LOCALES.includes(locale as PublicAnswerLocale)) {
    return { ok: false, reason: "invalid_input" };
  }
  if (
    typeof destination !== "string"
    || !DESTINATIONS.has(destination as SmartTalkTextDestination)
  ) {
    return { ok: false, reason: "invalid_input" };
  }
  if (!isCanonicalRevisionString(authoritativeRevision)) {
    return { ok: false, reason: "invalid_input" };
  }
  if (!isCanonicalUtcInstant(nowIso)) return { ok: false, reason: "invalid_input" };

  if (authoritativeRevision !== sourceRevision) {
    return { ok: false, reason: "registry_revision_mismatch" };
  }
  if (binding.retrievalRevision !== authoritativeRevision) {
    return { ok: false, reason: "registry_revision_mismatch" };
  }

  const nowMs = utcInstantToMilliseconds(nowIso);
  const issuedMs = utcInstantToMilliseconds(binding.issuedAt);
  const expiresMs = utcInstantToMilliseconds(binding.expiresAt);
  if (
    nowMs === null
    || issuedMs === null
    || expiresMs === null
    || nowMs < issuedMs
    || nowMs > expiresMs
  ) {
    return { ok: false, reason: "invalid_input" };
  }

  const candidate = binding.candidateByRef[candidateRef as CandidateRef];
  if (!candidate) return { ok: false, reason: "provider_correlation_invalid" };

  const entry = byClaimLocale.get(`${candidate.claimId}|${locale}`);
  if (!entry) return { ok: false, reason: "entry_not_found" };

  if (candidate.propositionFingerprint !== entry.propositionFingerprint) {
    return { ok: false, reason: "proposition_fingerprint_mismatch" };
  }

  if (!entry.allowedDestinations.includes(destination as SmartTalkTextDestination)) {
    return { ok: false, reason: "destination_not_allowed" };
  }

  if (!isPlainDataObjectWithExactKeys(jurisdiction, [
    "ambiguityRequiresClarification",
    "corridor",
    "primaryCountry",
  ])) {
    return { ok: false, reason: "invalid_input" };
  }
  const jurisdictionRecord = jurisdiction as Record<string, unknown>;
  const ambiguity = readDataProperty(jurisdictionRecord, "ambiguityRequiresClarification");
  const primaryCountry = readDataProperty(jurisdictionRecord, "primaryCountry");
  const corridor = readDataProperty(jurisdictionRecord, "corridor");
  if (ambiguity !== true && ambiguity !== false) {
    return { ok: false, reason: "invalid_input" };
  }
  if (
    primaryCountry !== null
    && primaryCountry !== "DE"
    && primaryCountry !== "AT"
    && primaryCountry !== "SK"
  ) {
    return { ok: false, reason: "invalid_input" };
  }
  if (
    corridor !== null
    && corridor !== "de_sk"
    && corridor !== "at_sk"
    && corridor !== "de_at_sk"
  ) {
    return { ok: false, reason: "invalid_input" };
  }
  if (ambiguity === true) return { ok: false, reason: "jurisdiction_mismatch" };

  const jurisdictionCode = entry.authorization.jurisdictionCode;
  if (!jurisdictionMatches(jurisdictionCode, { primaryCountry, corridor })) {
    return { ok: false, reason: "jurisdiction_mismatch" };
  }

  const { effectiveFrom, effectiveUntil } = entry.authorization;
  if (!isInstantWithin(nowIso, effectiveFrom, effectiveUntil)) {
    return { ok: false, reason: "outside_effective_period" };
  }

  const handlingMode = entry.authorization.handlingMode;
  if (handlingMode === "FETCH_LIVE") {
    return { ok: false, reason: "live_verification_required" };
  }
  if (handlingMode === "MANUAL_REVIEW_REQUIRED") {
    return { ok: false, reason: "handling_mode_blocked" };
  }
  if (handlingMode === "DO_NOT_ANSWER_WITHOUT_CONTEXT") {
    for (const key of entry.authorization.requiredContextKeys) {
      if (normalizedContext[key] !== true) {
        return { ok: false, reason: "required_context_missing" };
      }
    }
  }

  const segmentBindingId = fingerprintUtf8Sha256(
    `${entry.renderingId}|${destination}|${locale}|${sourceRevision}|${snapshotId}`,
  );

  const authorizedSegment: AuthorizedEvidenceSegment = {
    kind: "approved_evidence_rendering",
    segmentBindingId,
    renderingId: entry.renderingId,
    claimId: entry.claimId,
    propositionFingerprint: entry.propositionFingerprint,
    locale: locale as PublicAnswerLocale,
    destinationField: destination as SmartTalkTextDestination,
    claimClass: entry.claimClass,
    releasedText: entry.renderingText,
  };

  const integrityProof: RenderingIntegrityProof = {
    snapshotId,
    registrySchemaVersion: REGISTRY_SCHEMA_VERSION,
    sourceRevision,
    integrityRoot: snapshotId,
    renderingId: entry.renderingId,
    propositionFingerprint: entry.propositionFingerprint,
    renderingTextFingerprint: entry.renderingTextFingerprint,
    destinationField: destination as SmartTalkTextDestination,
    locale: locale as PublicAnswerLocale,
  };

  return deepFreeze({
    ok: true,
    authorizedSegment: deepFreeze(authorizedSegment),
    integrityProof: deepFreeze(integrityProof),
  });
}

function jurisdictionMatches(
  code: JurisdictionCode,
  ctx: Pick<PublicJurisdictionContext, "primaryCountry" | "corridor">,
): boolean {
  const { primaryCountry, corridor } = ctx;
  switch (code) {
    case "DE":
      return primaryCountry === "DE" || corridor === "de_sk" || corridor === "de_at_sk";
    case "AT":
      return primaryCountry === "AT" || corridor === "at_sk" || corridor === "de_at_sk";
    case "SK":
      return primaryCountry === "SK";
    case "DE-SK":
      return corridor === "de_sk" || corridor === "de_at_sk";
    case "AT-SK":
      return corridor === "at_sk" || corridor === "de_at_sk";
    case "DE-AT-SK":
      return corridor === "de_at_sk";
    default:
      return false;
  }
}

function isInstantWithin(
  nowIso: string,
  effectiveFrom: string | null,
  effectiveUntil: string | null,
): boolean {
  const now = utcInstantToMilliseconds(nowIso);
  if (now === null) return false;
  if (effectiveFrom !== null) {
    const from = utcInstantToMilliseconds(effectiveFrom);
    if (from === null || now < from) return false;
  }
  if (effectiveUntil !== null) {
    const until = utcInstantToMilliseconds(effectiveUntil);
    if (until === null || now > until) return false;
  }
  return true;
}
