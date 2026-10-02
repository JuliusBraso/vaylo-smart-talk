import { timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const FAILURE_BODY = "{\"ok\":false}";
const RESPONSE_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store, private",
  pragma: "no-cache",
  "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer",
} as const;

const SHAPES = new Set(["absent", "single_ipv4", "single_ipv6", "multi_value", "invalid"]);
const FORWARDED_SENTINEL = "192.0.2.10";
const VERCEL_SENTINEL = "198.51.100.20";
const REAL_SENTINEL = "203.0.113.30";
const VERCEL_IPV6_SENTINEL = "2001:db8::40";

type Shape = "absent" | "single_ipv4" | "single_ipv6" | "multi_value" | "invalid";
type Gate = "environment" | "configuration" | "authorization" | "request";
type RequestReason = "method" | "url" | "content_length" | "transfer_encoding" | "body" | "forwarding_headers";
type Ready =
  | { ok: true; token: Buffer; expiry: number }
  | { ok: false; gate: "environment" | "configuration" };

type HeaderSource = {
  get(name: string): string | null;
};

function failure(includeBody: boolean, gate: Exclude<Gate, "request">): Response;
function failure(includeBody: boolean, gate: "request", reason: RequestReason): Response;
function failure(includeBody: boolean, gate: Gate, reason?: RequestReason): Response {
  const headers: Record<string, string> = {
    ...RESPONSE_HEADERS,
    "x-birello-diagnostic-gate": gate,
  };
  if (gate === "request" && reason) headers["x-birello-diagnostic-request-reason"] = reason;
  return new Response(includeBody ? FAILURE_BODY : null, {
    status: 404,
    headers,
  });
}

function success(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: RESPONSE_HEADERS,
  });
}

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  return typeof value === "string" ? value : undefined;
}

function validInstant(value: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6]);
  if (month < 1 || month > 12 || hour > 23 || minute > 59 || second > 59) return null;
  const instant = Date.UTC(year, month - 1, day, hour, minute, second);
  const check = new Date(instant);
  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day ||
    check.getUTCHours() !== hour ||
    check.getUTCMinutes() !== minute ||
    check.getUTCSeconds() !== second
  ) {
    return null;
  }
  return instant;
}

function canonicalToken(value: string): Buffer | null {
  if (!/^[A-Za-z0-9+/]{43}=$/.test(value)) return null;
  const decoded = Buffer.from(value, "base64");
  if (decoded.length !== 32 || decoded.toString("base64") !== value) {
    decoded.fill(0);
    return null;
  }
  return decoded;
}

function environmentDenied(): "environment" | null {
  try {
    if (readEnv("VERCEL") !== "1") return "environment";
  } catch {
    return "environment";
  }
  try {
    if (readEnv("VERCEL_ENV") !== "preview") return "environment";
  } catch {
    return "environment";
  }
  try {
    if (readEnv("VERCEL_TARGET_ENV") !== "preview") return "environment";
  } catch {
    return "environment";
  }
  return null;
}

function configurationReady(now: number): Ready {
  if (environmentDenied() === "environment") return { ok: false, gate: "environment" };
  let token: Buffer | null = null;
  try {
    if (readEnv("PUBLIC_FREE_QA_HEADER_OBSERVATION_ENABLED") !== "true") return { ok: false, gate: "configuration" };
    const expiryText = readEnv("PUBLIC_FREE_QA_HEADER_OBSERVATION_EXPIRES_AT");
    const tokenText = readEnv("BIRELLO_HEADER_OBSERVATION_TOKEN");
    if (!expiryText || !tokenText) return { ok: false, gate: "configuration" };
    const expiry = validInstant(expiryText);
    token = canonicalToken(tokenText);
    if (expiry === null || token === null || now >= expiry) {
      token?.fill(0);
      return { ok: false, gate: "configuration" };
    }
    return { ok: true, token, expiry };
  } catch {
    token?.fill(0);
    return { ok: false, gate: "configuration" };
  }
}

function authorize(presented: string | null, expected: Buffer): boolean {
  let candidate: Buffer | null = null;
  try {
    if (typeof presented === "string" && presented.startsWith("Bearer ") && presented.indexOf(" ") === presented.lastIndexOf(" ")) {
      const encoded = presented.slice("Bearer ".length);
      candidate = canonicalToken(encoded);
    }
    if (!candidate) {
      timingSafeEqual(expected, expected);
      return false;
    }
    return timingSafeEqual(expected, candidate);
  } finally {
    candidate?.fill(0);
    expected.fill(0);
  }
}

function readString(headers: HeaderSource, name: string): string | null {
  const value = headers.get(name);
  if (value === null) return null;
  if (typeof value !== "string") throw new Error("unsupported_header");
  return value;
}

function isStrictIpv4(value: string): boolean {
  const parts = value.split(".");
  if (parts.length !== 4) return false;
  for (const part of parts) {
    if (!/^(0|[1-9]\d{0,2})$/.test(part)) return false;
    if (Number(part) > 255) return false;
  }
  return true;
}

function parseGroups(side: string): number[] | null {
  if (side === "") return [];
  const groups = side.split(":");
  const values: number[] = [];
  for (const group of groups) {
    if (!/^[0-9A-Fa-f]{1,4}$/.test(group)) return null;
    values.push(Number.parseInt(group, 16));
  }
  return values;
}

function expandIpv6(value: string): number[] | null {
  if (value.includes(".") || value.includes(":::")) return null;
  const halves = value.split("::");
  if (halves.length > 2) return null;
  if (halves.length === 1) {
    const groups = parseGroups(halves[0]);
    return groups && groups.length === 8 ? groups : null;
  }
  const left = parseGroups(halves[0]);
  const right = parseGroups(halves[1]);
  if (!left || !right || left.length + right.length >= 8) return null;
  return [...left, ...Array<number>(8 - left.length - right.length).fill(0), ...right];
}

function isMapped(groups: readonly number[]): boolean {
  return groups[0] === 0 && groups[1] === 0 && groups[2] === 0 && groups[3] === 0 && groups[4] === 0 && groups[5] === 0xffff;
}

function isMappedDotted(value: string): boolean {
  const match = /^(.*:)ffff:(\d+\.\d+\.\d+\.\d+)$/i.exec(value);
  if (!match || !isStrictIpv4(match[2])) return false;
  const prefix = expandToWidth(match[1].slice(0, -1) === "" ? "::ffff" : match[1] + "ffff", 6);
  return prefix !== null && isMapped(padMapped(prefix));
}

function expandToWidth(value: string, width: number): number[] | null {
  if (value.includes(".")) return null;
  const halves = value.split("::");
  if (halves.length > 2) return null;
  if (halves.length === 1) {
    const groups = parseGroups(halves[0]);
    return groups && groups.length === width ? groups : null;
  }
  const left = parseGroups(halves[0]);
  const right = parseGroups(halves[1]);
  if (!left || !right || left.length + right.length >= width) return null;
  return [...left, ...Array<number>(width - left.length - right.length).fill(0), ...right];
}

function padMapped(prefix: readonly number[]): number[] {
  return [...prefix, 0, 0];
}

function classify(value: string | null): Shape {
  if (value === null) return "absent";
  if (value.length > 256) return "invalid";
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code < 0x20 || code === 0x7f) return "invalid";
  }
  if (value.includes(",")) return "multi_value";
  if (value.length === 0 || [...value].every((character) => /\s/u.test(character))) return "invalid";
  if (/[%/[\]]/u.test(value) || /\s/u.test(value)) return "invalid";
  const colon = value.indexOf(":");
  if (colon !== -1 && value.indexOf(":", colon + 1) === -1 && isStrictIpv4(value.slice(0, colon))) return "invalid";
  if (isMappedDotted(value)) return "invalid";
  const expanded = expandIpv6(value);
  if (expanded && isMapped(expanded)) return "invalid";
  if (isStrictIpv4(value)) return "single_ipv4";
  if (expanded) return "single_ipv6";
  return "invalid";
}

function equalsSentinel(name: "x-forwarded-for" | "x-vercel-forwarded-for" | "x-real-ip", value: string | null): boolean {
  if (value === null) return false;
  if (name === "x-forwarded-for") return value === FORWARDED_SENTINEL;
  if (name === "x-real-ip") return value === REAL_SENTINEL;
  return value === VERCEL_SENTINEL || value === VERCEL_IPV6_SENTINEL;
}

function related(left: string | null, right: string | null): boolean {
  return left !== null && right !== null && left === right;
}

function observe(headers: HeaderSource): Response {
  const forwarded = readString(headers, "x-forwarded-for");
  const vercel = readString(headers, "x-vercel-forwarded-for");
  const real = readString(headers, "x-real-ip");
  const forwardedShape = classify(forwarded);
  const vercelShape = classify(vercel);
  const realShape = classify(real);
  if (!SHAPES.has(forwardedShape) || !SHAPES.has(vercelShape) || !SHAPES.has(realShape)) return failure(true, "request", "forwarding_headers");
  return success({
    ok: true,
    schemaVersion: 1,
    environment: "preview",
    headers: {
      xForwardedFor: { shape: forwardedShape, equalsItsSentinel: equalsSentinel("x-forwarded-for", forwarded) },
      xVercelForwardedFor: { shape: vercelShape, equalsItsSentinel: equalsSentinel("x-vercel-forwarded-for", vercel) },
      xRealIp: { shape: realShape, equalsItsSentinel: equalsSentinel("x-real-ip", real) },
    },
    relations: {
      vercelEqualsForwarded: related(vercel, forwarded),
      realEqualsForwarded: related(real, forwarded),
      vercelEqualsReal: related(vercel, real),
    },
  });
}

function requestBoundary(request: Request): RequestReason | null {
  try {
    if (request.url.includes("?") || request.url.includes("#")) return "url";
  } catch {
    return "url";
  }
  try {
    const length = request.headers.get("content-length");
    if (length !== null && length !== "0") return "content_length";
  } catch {
    return "content_length";
  }
  try {
    if (request.headers.get("transfer-encoding") !== null) return "transfer_encoding";
  } catch {
    return "transfer_encoding";
  }
  try {
    if (request.body !== null) return "body";
  } catch {
    return "body";
  }
  return null;
}

async function diagnose(request: Request): Promise<Response> {
  const ready = configurationReady(Date.now());
  if (!ready.ok) return failure(true, ready.gate);
  try {
    const reason = requestBoundary(request);
    if (reason) return failure(true, "request", reason);
    try {
      let authorization: string | null;
      try {
        authorization = readString(request.headers, "authorization");
      } catch {
        try {
          timingSafeEqual(ready.token, ready.token);
        } catch {
          return failure(true, "authorization");
        }
        return failure(true, "authorization");
      }
      if (!authorize(authorization, ready.token)) return failure(true, "authorization");
    } catch {
      return failure(true, "authorization");
    }
    try {
      return observe(request.headers);
    } catch {
      return failure(true, "request", "forwarding_headers");
    }
  } finally {
    ready.token.fill(0);
  }
}

function methodRejection(includeBody: boolean, request?: Request): Response {
  void request;
  return failure(includeBody, "request", "method");
}

export function GET(request: Request): Promise<Response> {
  return diagnose(request);
}

export function POST(request?: Request): Response {
  return methodRejection(true, request);
}

export function PUT(request?: Request): Response {
  return methodRejection(true, request);
}

export function PATCH(request?: Request): Response {
  return methodRejection(true, request);
}

export function DELETE(request?: Request): Response {
  return methodRejection(true, request);
}

export function HEAD(request?: Request): Response {
  return methodRejection(false, request);
}

export function OPTIONS(request?: Request): Response {
  return methodRejection(true, request);
}
