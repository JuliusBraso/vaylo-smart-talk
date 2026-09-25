import "server-only";
import { types } from "node:util";

/**
 * Offline trusted-address canonicalizer.
 *
 * This module does not read the environment, hash an address, open a pool,
 * or prove that a deployment may activate vercel_v1. The activation literal
 * is supplied by future server assembly, never by request data.
 */

const CONFIGURATION_ERROR = "invalid_public_free_qa_trusted_address_configuration";
const HEADER_NAME = "x-vercel-forwarded-for";
const RAW_CHARACTERS = /^[0-9A-Fa-f:.]+$/;

export type TrustedAddressResolution =
  | {
      readonly ok: true;
      readonly provider: "vercel_v1";
      readonly canonicalAddress: string;
    }
  | {
      readonly ok: false;
      readonly error: "trusted_address_unavailable";
    };

export type TrustedAddressHeaders = {
  get(name: string): string | null;
};

const unavailable: TrustedAddressResolution = Object.freeze({
  ok: false,
  error: "trusted_address_unavailable",
});

function invalidConfiguration(): never {
  throw new Error(CONFIGURATION_ERROR);
}

function canonicalizeIpv4(raw: string): string | null {
  const parts = raw.split(".");
  if (parts.length !== 4) return null;
  const octets: string[] = [];
  for (const part of parts) {
    if (!/^[0-9]{1,3}$/.test(part)) return null;
    if (part.length > 1 && part.startsWith("0")) return null;
    const value = Number(part);
    if (value > 255) return null;
    octets.push(String(value));
  }
  return octets.join(".");
}

function parseHexGroups(body: string, expected: number): number[] | null {
  if (body.includes(":::")) return null;
  const pieces = body.split("::");
  if (pieces.length > 2) return null;
  let groups: string[];
  if (pieces.length === 2) {
    const left = pieces[0] === "" ? [] : pieces[0].split(":");
    const right = pieces[1] === "" ? [] : pieces[1].split(":");
    if (left.some((group) => group === "") || right.some((group) => group === "")) return null;
    if (left.length + right.length >= expected) return null;
    groups = [
      ...left,
      ...Array<string>(expected - left.length - right.length).fill("0"),
      ...right,
    ];
  } else {
    groups = body.split(":");
    if (groups.length !== expected || groups.some((group) => group === "")) return null;
  }
  const values: number[] = [];
  for (const group of groups) {
    if (!/^[0-9A-Fa-f]{1,4}$/.test(group)) return null;
    values.push(Number.parseInt(group, 16));
  }
  return values;
}

function parseIpv6(raw: string): { groups: number[]; dotted: boolean } | null {
  if (raw.includes(":::")) return null;
  const dottedAt = raw.lastIndexOf(".");
  if (dottedAt !== -1) {
    const colon = raw.lastIndexOf(":");
    if (colon < 0 || colon > dottedAt) return null;
    const tail = raw.slice(colon + 1);
    const ipv4 = canonicalizeIpv4(tail);
    if (ipv4 === null) return null;
    const head = raw.slice(0, colon);
    const prefixBody = head === ":" ? "::" : head;
    const prefix = parseHexGroups(prefixBody, 6);
    if (prefix === null) return null;
    const [first, second, third, fourth] = ipv4.split(".").map((part) => Number(part));
    return {
      groups: [...prefix, (first << 8) | second, (third << 8) | fourth],
      dotted: true,
    };
  }
  const groups = parseHexGroups(raw, 8);
  if (groups === null) return null;
  return { groups, dotted: false };
}

function isMapped(groups: readonly number[]): boolean {
  return groups[0] === 0
    && groups[1] === 0
    && groups[2] === 0
    && groups[3] === 0
    && groups[4] === 0
    && groups[5] === 0xffff;
}

function mappedIpv4(groups: readonly number[]): string {
  const high = groups[6];
  const low = groups[7];
  return [
    high >> 8,
    high & 0xff,
    low >> 8,
    low & 0xff,
  ].join(".");
}

function serializePrefix(groups: readonly number[]): string {
  const bucket = [groups[0], groups[1], groups[2], groups[3], 0, 0, 0, 0];
  let bestStart = -1;
  let bestLength = 0;
  let index = 0;
  while (index < bucket.length) {
    if (bucket[index] !== 0) {
      index += 1;
      continue;
    }
    let end = index;
    while (end < bucket.length && bucket[end] === 0) end += 1;
    const length = end - index;
    if (length >= 2 && length > bestLength) {
      bestStart = index;
      bestLength = length;
    }
    index = end;
  }
  const text = bucket.map((group) => group.toString(16));
  if (bestStart < 0) return text.join(":");
  const left = text.slice(0, bestStart).join(":");
  const right = text.slice(bestStart + bestLength).join(":");
  if (left === "" && right === "") return "::";
  if (left === "") return `::${right}`;
  if (right === "") return `${left}::`;
  return `${left}::${right}`;
}

export function canonicalizePublicFreeQaAddress(rawAddress: unknown): string | null {
  if (typeof rawAddress !== "string") return null;
  if (rawAddress.length < 1 || rawAddress.length > 64) return null;
  if (!RAW_CHARACTERS.test(rawAddress)) return null;
  if (!rawAddress.includes(":")) {
    const ipv4 = canonicalizeIpv4(rawAddress);
    if (ipv4 === null || ipv4.length > 64) return null;
    return ipv4;
  }
  const parsed = parseIpv6(rawAddress);
  if (parsed === null) return null;
  if (parsed.dotted && !isMapped(parsed.groups)) return null;
  const canonical = isMapped(parsed.groups)
    ? mappedIpv4(parsed.groups)
    : serializePrefix(parsed.groups);
  if (!RAW_CHARACTERS.test(canonical) || canonical.length < 1 || canonical.length > 64) return null;
  return canonical;
}

export function createPublicFreeQaTrustedAddressResolver(input: {
  readonly provider: "vercel_v1";
  readonly activation: "deployment_evidence_approved";
}): (headers: TrustedAddressHeaders) => TrustedAddressResolution {
  try {
    if (input === null || typeof input !== "object" || Array.isArray(input)) invalidConfiguration();
    if (types.isProxy(input)) invalidConfiguration();
    if (Object.getPrototypeOf(input) !== Object.prototype) invalidConfiguration();
    const keys = Reflect.ownKeys(input);
    if (
      keys.length !== 2
      || keys.some((key) => typeof key !== "string")
      || !keys.includes("provider")
      || !keys.includes("activation")
    ) {
      invalidConfiguration();
    }
    const providerDescriptor = Object.getOwnPropertyDescriptor(input, "provider");
    const activationDescriptor = Object.getOwnPropertyDescriptor(input, "activation");
    if (
      providerDescriptor === undefined
      || activationDescriptor === undefined
      || !Object.hasOwn(providerDescriptor, "value")
      || !Object.hasOwn(activationDescriptor, "value")
      || Object.hasOwn(providerDescriptor, "get")
      || Object.hasOwn(providerDescriptor, "set")
      || Object.hasOwn(activationDescriptor, "get")
      || Object.hasOwn(activationDescriptor, "set")
      || providerDescriptor.value !== "vercel_v1"
      || activationDescriptor.value !== "deployment_evidence_approved"
    ) {
      invalidConfiguration();
    }
  } catch (error) {
    if (error instanceof Error && error.message === CONFIGURATION_ERROR) throw error;
    invalidConfiguration();
  }

  return (headers) => {
    try {
      if (headers === null || typeof headers !== "object" || types.isProxy(headers)) return unavailable;
      const getHeader = Reflect.get(headers, "get", headers);
      if (typeof getHeader !== "function") return unavailable;
      const raw = Reflect.apply(getHeader, headers, [HEADER_NAME]);
      if (typeof raw !== "string") return unavailable;
      const canonicalAddress = canonicalizePublicFreeQaAddress(raw);
      if (canonicalAddress === null) return unavailable;
      return Object.freeze({
        ok: true,
        provider: "vercel_v1",
        canonicalAddress,
      });
    } catch {
      return unavailable;
    }
  };
}
