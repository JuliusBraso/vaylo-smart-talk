import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { mock, describe, test } from "node:test";
import { fileURLToPath } from "node:url";

type Comparison = {
  equal: boolean;
  leftLength: number;
  rightLength: number;
  sameBuffer: boolean;
};

const comparisons: Comparison[] = [];
let recordComparisons = false;
const realTimingSafeEqual = process.getBuiltinModule("node:crypto").timingSafeEqual;

mock.module("node:crypto", {
  namedExports: {
    timingSafeEqual(left: NodeJS.ArrayBufferView, right: NodeJS.ArrayBufferView): boolean {
      const a = Buffer.from(left as Uint8Array);
      const b = Buffer.from(right as Uint8Array);
      if (recordComparisons) {
        comparisons.push({
          equal: a.length === b.length && a.equals(b),
          leftLength: a.length,
          rightLength: b.length,
          sameBuffer: left === right,
        });
      }
      return realTimingSafeEqual(left, right);
    },
  },
});

// Node's type-stripping loader requires this .ts specifier. The repository tsconfig does not enable allowImportingTsExtensions.
// @ts-expect-error TS5097
const { DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT } = await import("./route.ts");

const ROUTE_PATH = fileURLToPath(new URL("./route.ts", import.meta.url));
const NOW = Date.UTC(2030, 0, 1, 0, 0, 0);
const EXPIRY = "2099-01-01T00:00:00Z";
const EXPIRY_INSTANT = Date.UTC(2099, 0, 1, 0, 0, 0);
const TOKEN = Buffer.alloc(32, 0x2a).toString("base64");
const OTHER = Buffer.alloc(32, 0x2b).toString("base64");
const TOKEN_KEY = "BIRELLO_HEADER_OBSERVATION_TOKEN";
const rejectedTokenKey = "PUBLIC_FREE_QA_" + "HEADER_OBSERVATION_TOKEN";
const TARGET = "https://preview.example/api/internal/deployment-evidence/header-shape-v1";
const ENV_KEYS = [
  "VERCEL",
  "VERCEL_ENV",
  "VERCEL_TARGET_ENV",
  "PUBLIC_FREE_QA_HEADER_OBSERVATION_ENABLED",
  "PUBLIC_FREE_QA_HEADER_OBSERVATION_EXPIRES_AT",
  TOKEN_KEY,
  rejectedTokenKey,
] as const;

const openEnv = {
  VERCEL: "1",
  VERCEL_ENV: "preview",
  VERCEL_TARGET_ENV: "preview",
  PUBLIC_FREE_QA_HEADER_OBSERVATION_ENABLED: "true",
  PUBLIC_FREE_QA_HEADER_OBSERVATION_EXPIRES_AT: EXPIRY,
  [TOKEN_KEY]: TOKEN,
};

function restoreEnv(previous: Map<string, string | undefined>): void {
  for (const key of ENV_KEYS) {
    const value = previous.get(key);
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

async function withEnv<T>(values: Record<string, string | undefined>, run: () => Promise<T>): Promise<T> {
  const previous = new Map<string, string | undefined>();
  for (const key of ENV_KEYS) previous.set(key, process.env[key]);
  for (const key of ENV_KEYS) {
    const value = values[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  const clock = mock.method(Date, "now", () => NOW);
  try {
    return await run();
  } finally {
    clock.mock.restore();
    restoreEnv(previous);
  }
}

function countingRequest(input: {
  url?: string;
  headers?: Record<string, unknown>;
  body?: "none" | "stream";
  throwOn?: string;
}): { request: Request; counts: Record<string, number>; reads: Record<string, number>; access: { body: number } } {
  const counts: Record<string, number> = {};
  const reads = { text: 0, json: 0, arrayBuffer: 0, formData: 0 };
  const access = { body: 0 };
  const headers = {
    get(name: string): string | null {
      const key = name.toLowerCase();
      counts[key] = (counts[key] ?? 0) + 1;
      if (input.throwOn === key) throw new Error("marker-should-not-leak");
      const value = input.headers?.[key];
      if (value === undefined) return null;
      return value as string | null;
    },
  };
  const stream = {
    text() {
      reads.text += 1;
      return Promise.resolve("marker-should-not-leak");
    },
    json() {
      reads.json += 1;
      return Promise.resolve({ marker: "marker-should-not-leak" });
    },
    arrayBuffer() {
      reads.arrayBuffer += 1;
      return Promise.resolve(new ArrayBuffer(0));
    },
    formData() {
      reads.formData += 1;
      return Promise.resolve(new FormData());
    },
  };
  return {
    request: {
      get url() {
        if (input.throwOn === "url") throw new Error("marker-should-not-leak");
        return input.url ?? TARGET;
      },
      get headers() {
        if (input.throwOn === "headers") throw new Error("marker-should-not-leak");
        return headers;
      },
      get body() {
        access.body += 1;
        if (input.throwOn === "body") throw new Error("marker-should-not-leak");
        return input.body === "stream" ? stream : null;
      },
    } as unknown as Request,
    counts,
    reads,
    access,
  };
}

async function post(request: Request, env: Record<string, string | undefined> = openEnv): Promise<Response> {
  return withEnv(env, () => POST(request));
}

function successRequest(headers: Record<string, string> = {}): ReturnType<typeof countingRequest> {
  return countingRequest({
    headers: { authorization: `Bearer ${TOKEN}`, ...headers },
  });
}

async function bodyOf(response: Response): Promise<string> {
  return response.text();
}

const DIAGNOSTIC_GATES = new Set(["environment", "configuration", "authorization", "request"]);
const REQUEST_REASONS = new Set(["method", "url", "content_length", "transfer_encoding", "body", "forwarding_headers"]);

function noncanonicalAlias(canonical: string): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const body = canonical.slice(0, -1);
  const index = alphabet.indexOf(body[body.length - 1] ?? "");
  return `${body.slice(0, -1)}${alphabet[index + 1]}=`;
}

async function assertRequestFailure(response: Response, reason: string): Promise<void> {
  assert.equal(response.headers.get("X-Birello-Diagnostic-Request-Reason"), reason);
  assert.equal(response.headers.get("x-birello-diagnostic-request-reason"), reason);
  assert.equal(REQUEST_REASONS.has(reason), true);
  assert.equal(containsSensitiveMaterial(response, "{\"ok\":false}"), false);
  await assertDiagnosticFailure(response, "request");
}

async function assertDiagnosticFailure(response: Response, gate: string): Promise<void> {
  assert.equal(response.status, 404);
  assert.equal(response.headers.get("X-Birello-Diagnostic-Gate"), gate);
  assert.equal(response.headers.get("x-birello-diagnostic-gate"), gate);
  assert.equal(DIAGNOSTIC_GATES.has(gate), true);
  assert.equal(response.headers.get("cache-control"), "no-store, private");
  assert.equal(response.headers.get("pragma"), "no-cache");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("referrer-policy"), "no-referrer");
  assert.equal(response.headers.get("content-type"), "application/json; charset=utf-8");
  assert.equal(response.headers.get("set-cookie"), null);
  if (response.body === null) return;
  const text = await response.text();
  assert.equal(text, "{\"ok\":false}");
  assert.equal(text.includes(gate), false);
}

function containsSensitiveMaterial(response: Response, body: string): boolean {
  const visible = `${body}\n${[...response.headers.entries()].map(([, value]) => value).join("\n")}`;
  const material = [TOKEN, OTHER, "192.0.2.10", "198.51.100.20", "203.0.113.30", "2001:db8::40", "marker-should-not-leak"];
  return material.some((item) => visible.includes(item));
}

describe("header-shape-v1", { concurrency: 1 }, () => {
  test("R01 missing VERCEL", async () => {
    const response = await post(successRequest().request, { ...openEnv, VERCEL: undefined });
    assert.equal(response.status, 404);
  });

  test("R02 production environment", async () => {
    const response = await post(successRequest().request, { ...openEnv, VERCEL_ENV: "production" });
    assert.equal(response.status, 404);
  });

  test("R03 development environment", async () => {
    const response = await post(successRequest().request, { ...openEnv, VERCEL_ENV: "development" });
    assert.equal(response.status, 404);
  });

  test("R04 missing VERCEL_ENV", async () => {
    const response = await post(successRequest().request, { ...openEnv, VERCEL_ENV: undefined });
    assert.equal(response.status, 404);
  });

  test("R05 custom target environment", async () => {
    const response = await post(successRequest().request, { ...openEnv, VERCEL_TARGET_ENV: "staging" });
    assert.equal(response.status, 404);
  });

  test("R06 missing enable flag", async () => {
    const response = await post(successRequest().request, { ...openEnv, PUBLIC_FREE_QA_HEADER_OBSERVATION_ENABLED: undefined });
    assert.equal(response.status, 404);
  });

  test("R07 flag is not the exact string true", async () => {
    const response = await post(successRequest().request, { ...openEnv, PUBLIC_FREE_QA_HEADER_OBSERVATION_ENABLED: "TRUE" });
    assert.equal(response.status, 404);
  });

  test("R08 missing expiry", async () => {
    const response = await post(successRequest().request, { ...openEnv, PUBLIC_FREE_QA_HEADER_OBSERVATION_EXPIRES_AT: undefined });
    assert.equal(response.status, 404);
  });

  test("R09 malformed format and impossible future expiry", async () => {
    const impossible = "2099-02-31T00:00:00Z";
    const normalized = Date.UTC(2099, 1, 31, 0, 0, 0);
    assert.equal(normalized > NOW, true);
    const malformed = await post(successRequest().request, { ...openEnv, PUBLIC_FREE_QA_HEADER_OBSERVATION_EXPIRES_AT: "tomorrow" });
    assert.equal(malformed.status, 404);
    assert.equal(await bodyOf(malformed), "{\"ok\":false}");
    const deniedRequest = countingRequest({ headers: { authorization: `Bearer ${TOKEN}`, "x-forwarded-for": "192.0.2.10" } });
    const denied = await post(deniedRequest.request, { ...openEnv, PUBLIC_FREE_QA_HEADER_OBSERVATION_EXPIRES_AT: impossible });
    assert.equal(denied.status, 404);
    assert.equal(await bodyOf(denied), "{\"ok\":false}");
    assert.equal(deniedRequest.counts["x-forwarded-for"] ?? 0, 0);
    const allowed = await post(successRequest().request);
    assert.equal(allowed.status, 200);
  });

  test("R10 current time equal to expiry", async () => {
    const previous = new Map(ENV_KEYS.map((key) => [key, process.env[key]]));
    for (const [key, value] of Object.entries(openEnv)) process.env[key] = value;
    const clock = mock.method(Date, "now", () => EXPIRY_INSTANT);
    try {
      const response = await POST(successRequest().request);
      assert.equal(response.status, 404);
    } finally {
      clock.mock.restore();
      restoreEnv(previous);
    }
  });

  test("R11 current time after expiry", async () => {
    const previous = new Map(ENV_KEYS.map((key) => [key, process.env[key]]));
    for (const [key, value] of Object.entries(openEnv)) process.env[key] = value;
    const clock = mock.method(Date, "now", () => EXPIRY_INSTANT + 1000);
    try {
      const response = await POST(successRequest().request);
      assert.equal(response.status, 404);
    } finally {
      clock.mock.restore();
      restoreEnv(previous);
    }
  });

  test("R12 open gates reach observation", async () => {
    const response = await post(successRequest().request);
    assert.equal(response.status, 200);
    const body = await response.json() as { environment: string };
    assert.equal(body.environment, "preview");
  });

  test("R13 missing configured token", async () => {
    const response = await post(successRequest().request, { ...openEnv, [TOKEN_KEY]: undefined });
    assert.equal(response.status, 404);
  });

  test("R14 canonical encoding is required for the configured and presented token", async () => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    const body = TOKEN.slice(0, -1);
    const index = alphabet.indexOf(body[body.length - 1] ?? "");
    const alias = `${body.slice(0, -1)}${alphabet[index + 1]}=`;
    const decodedAlias = Buffer.from(alias, "base64");
    const decodedCanonical = Buffer.from(TOKEN, "base64");
    assert.equal(alias.length, 44);
    assert.equal(/^[A-Za-z0-9+/]{43}=$/.test(alias), true);
    assert.equal(decodedAlias.length, 32);
    assert.equal(decodedAlias.equals(decodedCanonical), true);
    assert.equal(decodedAlias.toString("base64") === alias, false);

    const accepted = await post(successRequest().request);
    assert.equal(accepted.status, 200);

    const configuredAlias = countingRequest({ headers: { authorization: `Bearer ${alias}` } });
    const configuredResponse = await post(configuredAlias.request, { ...openEnv, [TOKEN_KEY]: alias });
    assert.equal(configuredResponse.status, 404);
    assert.equal(await bodyOf(configuredResponse), "{\"ok\":false}");
    assert.equal(configuredAlias.counts["x-forwarded-for"] ?? 0, 0);

    comparisons.length = 0;
    recordComparisons = true;
    try {
      const presentedAlias = countingRequest({ headers: { authorization: `Bearer ${alias}`, "x-forwarded-for": "192.0.2.10" } });
      const presentedResponse = await post(presentedAlias.request);
      assert.equal(presentedResponse.status, 404);
      assert.equal(await bodyOf(presentedResponse), "{\"ok\":false}");
      assert.equal(presentedAlias.counts["x-forwarded-for"] ?? 0, 0);
      assert.equal(comparisons.length, 1);
      assert.equal(comparisons[0]?.equal, true);
      assert.equal(comparisons[0]?.leftLength, 32);
      assert.equal(comparisons[0]?.rightLength, 32);
      assert.equal(comparisons[0]?.sameBuffer, true);
    } finally {
      recordComparisons = false;
      comparisons.length = 0;
    }
  });

  test("R15 missing Authorization uses a dummy comparison", async () => {
    comparisons.length = 0;
    recordComparisons = true;
    try {
      const made = countingRequest({ headers: {} });
      const response = await post(made.request);
      assert.equal(response.status, 404);
      assert.equal(comparisons.length, 1);
      assert.equal(comparisons[0]?.equal, true);
      assert.equal(comparisons[0]?.leftLength, 32);
      assert.equal(comparisons[0]?.rightLength, 32);
      assert.equal(comparisons[0]?.sameBuffer, true);
      assert.equal(made.counts["x-forwarded-for"] ?? 0, 0);
    } finally {
      recordComparisons = false;
      comparisons.length = 0;
    }
  });

  test("R16 wrong scheme", async () => {
    comparisons.length = 0;
    recordComparisons = true;
    try {
      const made = countingRequest({ headers: { authorization: `Token ${TOKEN}` } });
      const response = await post(made.request);
      assert.equal(response.status, 404);
      assert.equal(await bodyOf(response), "{\"ok\":false}");
      assert.equal(comparisons.length, 1);
      assert.equal(comparisons[0]?.equal, true);
      assert.equal(comparisons[0]?.leftLength, 32);
      assert.equal(comparisons[0]?.rightLength, 32);
      assert.equal(comparisons[0]?.sameBuffer, true);
    } finally {
      recordComparisons = false;
      comparisons.length = 0;
    }
  });

  test("R17 surrounding whitespace", async () => {
    const made = countingRequest({ headers: { authorization: ` Bearer ${TOKEN}` } });
    const response = await post(made.request);
    assert.equal(response.status, 404);
  });

  test("R18 wrong canonical token is compared at fixed length", async () => {
    comparisons.length = 0;
    recordComparisons = true;
    try {
      const made = countingRequest({ headers: { authorization: `Bearer ${OTHER}` } });
      const response = await post(made.request);
      assert.equal(response.status, 404);
      assert.equal(comparisons.length, 1);
      assert.equal(comparisons[0]?.equal, false);
      assert.equal(comparisons[0]?.leftLength, 32);
      assert.equal(comparisons[0]?.rightLength, 32);
      assert.equal(comparisons[0]?.sameBuffer, false);
    } finally {
      recordComparisons = false;
      comparisons.length = 0;
    }
  });

  test("R19 an authenticated query is rejected before forwarding reads", async () => {
    const headers = { authorization: `Bearer ${TOKEN}` };
    const clean = new Request(TARGET, { method: "POST", headers });
    assert.equal(clean.body, null);
    assert.equal(clean.url.includes("?"), false);
    const accepted = await post(clean);
    assert.equal(accepted.status, 200);

    const queried = new Request(`${TARGET}?access=1`, { method: "POST", headers });
    const denied = await post(queried);
    assert.equal(denied.status, 404);
    assert.equal(await bodyOf(denied), "{\"ok\":false}");

    const bare = new Request(`${TARGET}?`, { method: "POST", headers });
    assert.equal(bare.url.endsWith("?"), true);
    assert.equal(new URL(bare.url).search, "");
    const bareDenied = await post(bare);
    assert.equal(bareDenied.status, 404);
    assert.equal(await bodyOf(bareDenied), "{\"ok\":false}");

    const counted = countingRequest({
      url: `${TARGET}?access=1`,
      headers: { authorization: `Bearer ${TOKEN}`, "x-forwarded-for": "192.0.2.10" },
    });
    const countedResponse = await post(counted.request);
    assert.equal(countedResponse.status, 404);
    assert.equal(await bodyOf(countedResponse), "{\"ok\":false}");
    assert.equal(counted.counts["x-forwarded-for"] ?? 0, 0);
  });

  test("R20 throwing authorization accessor fails closed", async () => {
    const made = countingRequest({ throwOn: "authorization", headers: { "x-forwarded-for": "192.0.2.10" } });
    const response = await post(made.request);
    assert.equal(response.status, 404);
    assert.equal(await bodyOf(response), "{\"ok\":false}");
    assert.equal(made.counts["x-forwarded-for"] ?? 0, 0);
  });

  test("R21 absent forwarding header", async () => {
    const made = successRequest();
    const response = await post(made.request);
    const body = await response.json() as { headers: { xForwardedFor: { shape: string; equalsItsSentinel: boolean } } };
    assert.equal(body.headers.xForwardedFor.shape, "absent");
    assert.equal(body.headers.xForwardedFor.equalsItsSentinel, false);
  });

  test("R22 empty forwarding value", async () => {
    const made = successRequest({ "x-forwarded-for": "" });
    const body = await (await post(made.request)).json() as { headers: { xForwardedFor: { shape: string } } };
    assert.equal(body.headers.xForwardedFor.shape, "invalid");
  });

  test("R23 whitespace-only forwarding value", async () => {
    const made = successRequest({ "x-forwarded-for": "   " });
    const body = await (await post(made.request)).json() as { headers: { xForwardedFor: { shape: string } } };
    assert.equal(body.headers.xForwardedFor.shape, "invalid");
  });

  test("R24 strict IPv4", async () => {
    const made = successRequest({ "x-forwarded-for": "192.0.2.10" });
    const body = await (await post(made.request)).json() as { headers: { xForwardedFor: { shape: string; equalsItsSentinel: boolean } } };
    assert.equal(body.headers.xForwardedFor.shape, "single_ipv4");
    assert.equal(body.headers.xForwardedFor.equalsItsSentinel, true);
  });

  test("R25 strict IPv6", async () => {
    const made = successRequest({ "x-vercel-forwarded-for": "2001:db8::40" });
    const body = await (await post(made.request)).json() as { headers: { xVercelForwardedFor: { shape: string; equalsItsSentinel: boolean } } };
    assert.equal(body.headers.xVercelForwardedFor.shape, "single_ipv6");
    assert.equal(body.headers.xVercelForwardedFor.equalsItsSentinel, true);
  });

  test("R26 mapped IPv6 is invalid", async () => {
    const dotted = successRequest({ "x-forwarded-for": "::ffff:192.0.2.1" });
    const expanded = successRequest({ "x-forwarded-for": "0:0:0:0:0:ffff:c000:0201" });
    const dottedBody = await (await post(dotted.request)).json() as { headers: { xForwardedFor: { shape: string } } };
    const expandedBody = await (await post(expanded.request)).json() as { headers: { xForwardedFor: { shape: string } } };
    assert.equal(dottedBody.headers.xForwardedFor.shape, "invalid");
    assert.equal(expandedBody.headers.xForwardedFor.shape, "invalid");
  });

  test("R27 zone identifier", async () => {
    const made = successRequest({ "x-forwarded-for": "fe80::1%eth0" });
    const body = await (await post(made.request)).json() as { headers: { xForwardedFor: { shape: string } } };
    assert.equal(body.headers.xForwardedFor.shape, "invalid");
  });

  test("R28 comma-separated value", async () => {
    const made = successRequest({ "x-forwarded-for": "192.0.2.10,192.0.2.11" });
    const body = await (await post(made.request)).json() as { headers: { xForwardedFor: { shape: string; equalsItsSentinel: boolean } } };
    assert.equal(body.headers.xForwardedFor.shape, "multi_value");
    assert.equal(body.headers.xForwardedFor.equalsItsSentinel, false);
  });

  test("R29 port notation", async () => {
    const made = successRequest({ "x-forwarded-for": "192.0.2.10:80" });
    const body = await (await post(made.request)).json() as { headers: { xForwardedFor: { shape: string } } };
    assert.equal(body.headers.xForwardedFor.shape, "invalid");
  });

  test("R30 CIDR notation", async () => {
    const made = successRequest({ "x-forwarded-for": "192.0.2.0/24" });
    const body = await (await post(made.request)).json() as { headers: { xForwardedFor: { shape: string } } };
    assert.equal(body.headers.xForwardedFor.shape, "invalid");
  });

  test("R31 DNS name", async () => {
    const made = successRequest({ "x-forwarded-for": "example.test" });
    const body = await (await post(made.request)).json() as { headers: { xForwardedFor: { shape: string } } };
    assert.equal(body.headers.xForwardedFor.shape, "invalid");
  });

  test("R32 overlong value", async () => {
    const made = successRequest({ "x-forwarded-for": "a".repeat(257) });
    const body = await (await post(made.request)).json() as { headers: { xForwardedFor: { shape: string } } };
    assert.equal(body.headers.xForwardedFor.shape, "invalid");
  });

  test("R33 control character", async () => {
    const made = successRequest({ "x-forwarded-for": "192.0.2.10\n" });
    const body = await (await post(made.request)).json() as { headers: { xForwardedFor: { shape: string } } };
    assert.equal(body.headers.xForwardedFor.shape, "invalid");
  });

  test("R34 each IPv4 sentinel matches only its header", async () => {
    const made = successRequest({
      "x-forwarded-for": "192.0.2.10",
      "x-vercel-forwarded-for": "198.51.100.20",
      "x-real-ip": "203.0.113.30",
    });
    const body = await (await post(made.request)).json() as {
      headers: Record<string, { equalsItsSentinel: boolean }>;
    };
    assert.equal(body.headers.xForwardedFor.equalsItsSentinel, true);
    assert.equal(body.headers.xVercelForwardedFor.equalsItsSentinel, true);
    assert.equal(body.headers.xRealIp.equalsItsSentinel, true);
  });

  test("R35 IPv6 sentinel matches only the Vercel header", async () => {
    const made = successRequest({
      "x-forwarded-for": "2001:db8::40",
      "x-vercel-forwarded-for": "2001:db8::40",
    });
    const body = await (await post(made.request)).json() as {
      headers: { xForwardedFor: { equalsItsSentinel: boolean }; xVercelForwardedFor: { equalsItsSentinel: boolean } };
    };
    assert.equal(body.headers.xVercelForwardedFor.equalsItsSentinel, true);
    assert.equal(body.headers.xForwardedFor.equalsItsSentinel, false);
  });

  test("R36 equal non-absent values set all relations", async () => {
    const made = successRequest({
      "x-forwarded-for": "not-an-address",
      "x-vercel-forwarded-for": "not-an-address",
      "x-real-ip": "not-an-address",
    });
    const body = await (await post(made.request)).json() as { relations: Record<string, boolean> };
    assert.equal(body.relations.vercelEqualsForwarded, true);
    assert.equal(body.relations.realEqualsForwarded, true);
    assert.equal(body.relations.vercelEqualsReal, true);
  });

  test("R37 a missing side makes relations false", async () => {
    const made = successRequest({ "x-forwarded-for": "192.0.2.10" });
    const body = await (await post(made.request)).json() as { relations: Record<string, boolean> };
    assert.equal(body.relations.vercelEqualsForwarded, false);
    assert.equal(body.relations.realEqualsForwarded, false);
    assert.equal(body.relations.vercelEqualsReal, false);
  });

  test("R38 a comma form is not a sentinel match", async () => {
    const made = successRequest({ "x-vercel-forwarded-for": "198.51.100.20,198.51.100.21" });
    const body = await (await post(made.request)).json() as { headers: { xVercelForwardedFor: { shape: string; equalsItsSentinel: boolean } } };
    assert.equal(body.headers.xVercelForwardedFor.shape, "multi_value");
    assert.equal(body.headers.xVercelForwardedFor.equalsItsSentinel, false);
  });

  test("R39 success JSON does not contain a sentinel or marker", async () => {
    const made = successRequest({ "x-forwarded-for": "192.0.2.10" });
    const text = await bodyOf(await post(made.request));
    assert.equal(text.includes("192.0.2.10"), false);
    assert.equal(text.includes("marker-should-not-leak"), false);
  });

  test("R40 failures omit injected marker text", async () => {
    const made = countingRequest({ throwOn: "x-forwarded-for", headers: { authorization: `Bearer ${TOKEN}` } });
    const text = await bodyOf(await post(made.request));
    assert.equal(text, "{\"ok\":false}");
  });

  test("R41 handlers do not call console", async () => {
    const calls: string[] = [];
    const log = mock.method(console, "log", () => calls.push("log"));
    const error = mock.method(console, "error", () => calls.push("error"));
    const warn = mock.method(console, "warn", () => calls.push("warn"));
    const info = mock.method(console, "info", () => calls.push("info"));
    try {
      await post(successRequest().request);
      await post(countingRequest({ headers: {} }).request);
      assert.deepEqual(calls, []);
    } finally {
      log.mock.restore();
      error.mock.restore();
      warn.mock.restore();
      info.mock.restore();
    }
  });

  test("R42 route source does not import forbidden modules", () => {
    const source = readFileSync(ROUTE_PATH, "utf8");
    assert.equal(source.includes("from \"node:crypto\""), true);
    for (const banned of ["smart-talk", "supabase", "node:pg", "from \"pg\"", "ocr", "knowledge"]) {
      assert.equal(source.includes(banned), false, banned);
    }
    assert.equal(source.includes("console."), false);
  });

  test("R43 responses set no cookie", async () => {
    const ok = await post(successRequest().request);
    const denied = await post(countingRequest({ headers: {} }).request);
    assert.equal(ok.headers.get("set-cookie"), null);
    assert.equal(denied.headers.get("set-cookie"), null);
  });

  test("R44 cache and safety headers are present", async () => {
    const response = await post(successRequest().request);
    assert.equal(response.headers.get("cache-control"), "no-store, private");
    assert.equal(response.headers.get("pragma"), "no-cache");
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.equal(response.headers.get("referrer-policy"), "no-referrer");
    assert.equal(response.headers.get("content-type"), "application/json; charset=utf-8");
  });

  test("R45 success keys are exact", async () => {
    const body = await (await post(successRequest().request)).json() as Record<string, unknown>;
    assert.deepEqual(Object.keys(body).sort(), ["environment", "headers", "ok", "relations", "schemaVersion"]);
    const headers = body.headers as Record<string, unknown>;
    assert.deepEqual(Object.keys(headers).sort(), ["xForwardedFor", "xRealIp", "xVercelForwardedFor"]);
    const relations = body.relations as Record<string, unknown>;
    assert.deepEqual(Object.keys(relations).sort(), ["realEqualsForwarded", "vercelEqualsForwarded", "vercelEqualsReal"]);
  });

  test("R46 each forwarding header is read once", async () => {
    const values: Record<string, string> = {
      authorization: `Bearer ${TOKEN}`,
      "x-forwarded-for": "192.0.2.10",
      "x-vercel-forwarded-for": "198.51.100.20",
      "x-real-ip": "203.0.113.30",
    };
    const counts: Record<string, number> = {};
    const request = {
      url: TARGET,
      body: null,
      headers: {
        get(name: string): string | null {
          const key = name.toLowerCase();
          counts[key] = (counts[key] ?? 0) + 1;
          const value = values[key] ?? null;
          if (key === "x-forwarded-for") values[key] = "203.0.113.30";
          return value;
        },
      },
    } as unknown as Request;
    const body = await (await post(request)).json() as {
      headers: { xForwardedFor: { equalsItsSentinel: boolean } };
    };
    assert.equal(counts["x-forwarded-for"], 1);
    assert.equal(counts["x-vercel-forwarded-for"], 1);
    assert.equal(counts["x-real-ip"], 1);
    assert.equal(body.headers.xForwardedFor.equalsItsSentinel, true);
    assert.equal(values["x-forwarded-for"], "203.0.113.30");
  });

  test("R47 a non-null body is rejected without being read", async () => {
    const made = countingRequest({ body: "stream", headers: { authorization: `Bearer ${TOKEN}`, "content-length": "0" } });
    const response = await post(made.request);
    assert.equal(response.status, 404);
    assert.equal(made.reads.text, 0);
    assert.equal(made.reads.json, 0);
    assert.equal(made.reads.arrayBuffer, 0);
    assert.equal(made.reads.formData, 0);
    assert.equal(made.counts["x-forwarded-for"] ?? 0, 0);
  });

  test("R48 production stays rejected when the flag is true", async () => {
    const made = successRequest({ "x-forwarded-for": "192.0.2.10" });
    const response = await post(made.request, { ...openEnv, VERCEL_ENV: "production" });
    assert.equal(response.status, 404);
    assert.equal(made.counts["x-forwarded-for"] ?? 0, 0);
  });

  test("non-POST handlers return 404 and HEAD has no body", async () => {
    const get = GET();
    const put = PUT();
    const patch = PATCH();
    const deleted = DELETE();
    const options = OPTIONS();
    const head = HEAD();
    for (const response of [get, put, patch, deleted, options]) {
      assert.equal(response.status, 404);
      assert.equal(await response.text(), "{\"ok\":false}");
    }
    assert.equal(head.status, 404);
    assert.equal(head.body, null);
    assert.equal(head.headers.get("cache-control"), "no-store, private");
  });

  test("native Request preserves a bare question mark and an authenticated route rejects it", async () => {
    const native = new Request(`${TARGET}?`, { method: "POST", headers: { authorization: `Bearer ${TOKEN}` } });
    assert.equal(native.body, null);
    assert.equal(native.url.endsWith("?"), true);
    assert.equal(new URL(native.url).search, "");
    const response = await post(native);
    assert.equal(response.status, 404);
    assert.equal(await bodyOf(response), "{\"ok\":false}");
  });

  test("content-length and transfer-encoding are rejected before forwarding reads", async () => {
    const length = countingRequest({ headers: { authorization: `Bearer ${TOKEN}`, "content-length": "1", "x-forwarded-for": "192.0.2.10" } });
    const encoded = countingRequest({ headers: { authorization: `Bearer ${TOKEN}`, "transfer-encoding": "chunked", "x-forwarded-for": "192.0.2.10" } });
    assert.equal((await post(length.request)).status, 404);
    assert.equal((await post(encoded.request)).status, 404);
    assert.equal(length.counts["x-forwarded-for"] ?? 0, 0);
    assert.equal(encoded.counts["x-forwarded-for"] ?? 0, 0);
  });

  test("malformed compression is invalid and a final IPv6 group is not a port", async () => {
    const compressed = successRequest({ "x-forwarded-for": "1:2:3:4:5:6:7::8" });
    const bracket = successRequest({ "x-forwarded-for": "[2001:db8::40]:443" });
    const compressedBody = await (await post(compressed.request)).json() as { headers: { xForwardedFor: { shape: string } } };
    const bracketBody = await (await post(bracket.request)).json() as { headers: { xForwardedFor: { shape: string } } };
    assert.equal(compressedBody.headers.xForwardedFor.shape, "invalid");
    assert.equal(bracketBody.headers.xForwardedFor.shape, "invalid");
  });

  test("failure responses use the same safety headers", async () => {
    const response = await post(countingRequest({ headers: {} }).request);
    assert.equal(response.headers.get("content-type"), "application/json; charset=utf-8");
    assert.equal(response.headers.get("pragma"), "no-cache");
    assert.equal(response.headers.get("referrer-policy"), "no-referrer");
  });

  test("FIX2 the secret-compatible key permits authenticated observation", async () => {
    const made = successRequest({ "x-forwarded-for": "192.0.2.10" });
    const response = await post(made.request, { ...openEnv, [rejectedTokenKey]: undefined });
    assert.equal(response.status, 200);
    const body = await response.json() as { ok: boolean; schemaVersion: number };
    assert.equal(body.ok, true);
    assert.equal(body.schemaVersion, 1);
    assert.equal(made.counts["x-forwarded-for"], 1);
  });

  test("FIX2 a public-prefixed token key does not authorize", async () => {
    const made = countingRequest({
      headers: {
        authorization: `Bearer ${TOKEN}`,
        "x-forwarded-for": "192.0.2.10",
        "x-vercel-forwarded-for": "198.51.100.20",
        "x-real-ip": "203.0.113.30",
      },
    });
    const response = await post(made.request, {
      ...openEnv,
      [TOKEN_KEY]: undefined,
      [rejectedTokenKey]: TOKEN,
    });
    assert.equal(response.status, 404);
    assert.equal(await bodyOf(response), "{\"ok\":false}");
    assert.equal(made.counts["x-forwarded-for"] ?? 0, 0);
    assert.equal(made.counts["x-vercel-forwarded-for"] ?? 0, 0);
    assert.equal(made.counts["x-real-ip"] ?? 0, 0);
  });

  test("FIX2 malformed missing alias and mismatched new-key values stay closed", async () => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    const body = TOKEN.slice(0, -1);
    const index = alphabet.indexOf(body[body.length - 1] ?? "");
    const alias = `${body.slice(0, -1)}${alphabet[index + 1]}=`;
    const cases = [
      { [TOKEN_KEY]: "not-a-token", authorization: `Bearer ${TOKEN}` },
      { [TOKEN_KEY]: undefined, authorization: `Bearer ${TOKEN}` },
      { [TOKEN_KEY]: alias, authorization: `Bearer ${alias}` },
      { [TOKEN_KEY]: OTHER, authorization: `Bearer ${TOKEN}` },
    ];
    for (const item of cases) {
      const made = countingRequest({
        headers: {
          authorization: item.authorization,
          "x-forwarded-for": "192.0.2.10",
        },
      });
      const response = await post(made.request, {
        ...openEnv,
        [TOKEN_KEY]: item[TOKEN_KEY],
        [rejectedTokenKey]: TOKEN,
      });
      assert.equal(response.status, 404);
      assert.equal(await bodyOf(response), "{\"ok\":false}");
      assert.equal(made.counts["x-forwarded-for"] ?? 0, 0);
    }
  });

  test("FIX2 token material stays out of source responses and logs", async () => {
    const source = readFileSync(ROUTE_PATH, "utf8");
    const testSource = readFileSync(fileURLToPath(import.meta.url), "utf8");
    assert.equal(source.includes(TOKEN_KEY), true);
    assert.equal(source.includes(rejectedTokenKey), false);
    assert.equal(source.includes(TOKEN), false);
    assert.equal(testSource.includes(TOKEN), false);
    const calls: string[] = [];
    const log = mock.method(console, "log", () => calls.push("log"));
    const error = mock.method(console, "error", () => calls.push("error"));
    const warn = mock.method(console, "warn", () => calls.push("warn"));
    const info = mock.method(console, "info", () => calls.push("info"));
    try {
      const accepted = await bodyOf(await post(successRequest().request));
      const denied = await bodyOf(await post(countingRequest({
        headers: { authorization: `Bearer ${TOKEN}`, "x-forwarded-for": "192.0.2.10" },
      }).request, { ...openEnv, [TOKEN_KEY]: undefined, [rejectedTokenKey]: TOKEN }));
      assert.equal(accepted.includes(TOKEN), false);
      assert.equal(denied, "{\"ok\":false}");
      assert.equal(denied.includes(TOKEN), false);
      assert.deepEqual(calls, []);
    } finally {
      log.mock.restore();
      error.mock.restore();
      warn.mock.restore();
      info.mock.restore();
    }
  });

  test("FIX3 each failed platform variable produces environment", async () => {
    const cases = [
      { ...openEnv, VERCEL: undefined },
      { ...openEnv, VERCEL: "0" },
      { ...openEnv, VERCEL_ENV: undefined },
      { ...openEnv, VERCEL_ENV: "production" },
      { ...openEnv, VERCEL_TARGET_ENV: undefined },
      { ...openEnv, VERCEL_TARGET_ENV: "staging" },
    ];
    for (const env of cases) {
      const made = countingRequest({
        headers: { authorization: `Bearer ${TOKEN}`, "x-forwarded-for": "192.0.2.10" },
      });
      const response = await post(made.request, env);
      await assertDiagnosticFailure(response, "environment");
      assert.equal(made.counts["x-forwarded-for"] ?? 0, 0);
      assert.equal(containsSensitiveMaterial(response, "{\"ok\":false}"), false);
    }
  });

  test("FIX3 an invalid enable flag produces configuration", async () => {
    for (const value of [undefined, "TRUE"] as const) {
      const made = countingRequest({
        headers: { authorization: `Bearer ${TOKEN}`, "x-forwarded-for": "192.0.2.10" },
      });
      const response = await post(made.request, { ...openEnv, PUBLIC_FREE_QA_HEADER_OBSERVATION_ENABLED: value });
      await assertDiagnosticFailure(response, "configuration");
      assert.equal(made.counts["x-forwarded-for"] ?? 0, 0);
    }
  });

  test("FIX3 invalid expiry produces configuration", async () => {
    const cases = ["tomorrow", "2099-02-31T00:00:00Z", "2020-01-01T00:00:00Z", "2030-01-01T00:00:00Z"];
    for (const expiry of cases) {
      const made = countingRequest({
        headers: { authorization: `Bearer ${TOKEN}`, "x-forwarded-for": "192.0.2.10" },
      });
      const response = await post(made.request, { ...openEnv, PUBLIC_FREE_QA_HEADER_OBSERVATION_EXPIRES_AT: expiry });
      await assertDiagnosticFailure(response, "configuration");
      assert.equal(made.counts["x-forwarded-for"] ?? 0, 0);
      assert.equal(containsSensitiveMaterial(response, "{\"ok\":false}"), false);
    }
  });

  test("FIX3 missing and noncanonical configured tokens produce configuration", async () => {
    const cases = [undefined, noncanonicalAlias(TOKEN), "abc"];
    for (const value of cases) {
      const made = countingRequest({
        headers: { authorization: `Bearer ${TOKEN}`, "x-forwarded-for": "192.0.2.10" },
      });
      const response = await post(made.request, { ...openEnv, [TOKEN_KEY]: value });
      await assertDiagnosticFailure(response, "configuration");
      assert.equal(made.counts["x-forwarded-for"] ?? 0, 0);
    }
  });

  test("FIX3 missing Authorization produces authorization", async () => {
    const made = countingRequest({ headers: { "x-forwarded-for": "192.0.2.10" } });
    const response = await post(made.request);
    await assertDiagnosticFailure(response, "authorization");
    assert.equal(made.counts["x-forwarded-for"] ?? 0, 0);
  });

  test("FIX3 a malformed scheme produces authorization", async () => {
    const made = countingRequest({
      headers: { authorization: `Token ${TOKEN}`, "x-forwarded-for": "192.0.2.10" },
    });
    const response = await post(made.request);
    await assertDiagnosticFailure(response, "authorization");
    assert.equal(made.counts["x-forwarded-for"] ?? 0, 0);
    assert.equal(containsSensitiveMaterial(response, "{\"ok\":false}"), false);
  });

  test("FIX3 a mismatched token produces authorization", async () => {
    const made = countingRequest({
      headers: { authorization: `Bearer ${OTHER}`, "x-forwarded-for": "192.0.2.10" },
    });
    const response = await post(made.request);
    await assertDiagnosticFailure(response, "authorization");
    assert.equal(made.counts["x-forwarded-for"] ?? 0, 0);
    assert.equal(containsSensitiveMaterial(response, "{\"ok\":false}"), false);
  });

  test("FIX3 a noncanonical presented alias produces authorization", async () => {
    const alias = noncanonicalAlias(TOKEN);
    const made = countingRequest({
      headers: { authorization: `Bearer ${alias}`, "x-forwarded-for": "192.0.2.10" },
    });
    const response = await post(made.request);
    await assertDiagnosticFailure(response, "authorization");
    assert.equal(made.counts["x-forwarded-for"] ?? 0, 0);
  });

  test("FIX3 query and a bare question mark produce request", async () => {
    comparisons.length = 0;
    recordComparisons = true;
    try {
      const query = countingRequest({
        url: `${TARGET}?x=1`,
        headers: { authorization: `Bearer ${TOKEN}`, "x-forwarded-for": "192.0.2.10" },
      });
      const queryResponse = await post(query.request);
      await assertDiagnosticFailure(queryResponse, "request");
      assert.equal(query.counts["x-forwarded-for"] ?? 0, 0);
      const native = new Request(`${TARGET}?`, { method: "POST", headers: { authorization: `Bearer ${TOKEN}` } });
      const bare = await post(native);
      await assertDiagnosticFailure(bare, "request");
      assert.equal(comparisons.length, 0);
    } finally {
      recordComparisons = false;
      comparisons.length = 0;
    }
  });

  test("FIX3 body length and transfer encoding produce request", async () => {
    comparisons.length = 0;
    recordComparisons = true;
    try {
      const body = countingRequest({
        body: "stream",
        headers: { authorization: `Bearer ${TOKEN}`, "content-length": "0", "x-forwarded-for": "192.0.2.10" },
      });
      const length = countingRequest({
        headers: { authorization: `Bearer ${TOKEN}`, "content-length": "1", "x-forwarded-for": "192.0.2.10" },
      });
      const encoded = countingRequest({
        headers: { authorization: `Bearer ${TOKEN}`, "transfer-encoding": "chunked", "x-forwarded-for": "192.0.2.10" },
      });
      await assertDiagnosticFailure(await post(body.request), "request");
      await assertDiagnosticFailure(await post(length.request), "request");
      await assertDiagnosticFailure(await post(encoded.request), "request");
      assert.equal(body.counts["x-forwarded-for"] ?? 0, 0);
      assert.equal(length.counts["x-forwarded-for"] ?? 0, 0);
      assert.equal(encoded.counts["x-forwarded-for"] ?? 0, 0);
      assert.equal(body.reads.text, 0);
      assert.equal(comparisons.length, 0);
    } finally {
      recordComparisons = false;
      comparisons.length = 0;
    }
  });

  test("FIX3 unsupported methods produce request", async () => {
    for (const response of [GET(), PUT(), PATCH(), DELETE(), OPTIONS()]) {
      await assertDiagnosticFailure(response, "request");
    }
    const head = HEAD();
    assert.equal(head.status, 404);
    assert.equal(head.body, null);
    assert.equal(head.headers.get("X-Birello-Diagnostic-Gate"), "request");
    assert.equal(head.headers.get("x-birello-diagnostic-gate"), "request");
    assert.equal(await head.text(), "");
  });

  test("FIX3 a forwarding accessor failure produces request", async () => {
    const made = countingRequest({
      throwOn: "x-forwarded-for",
      headers: { authorization: `Bearer ${TOKEN}`, "x-forwarded-for": "192.0.2.10" },
    });
    const response = await post(made.request);
    await assertDiagnosticFailure(response, "request");
    assert.equal(containsSensitiveMaterial(response, "{\"ok\":false}"), false);
  });

  test("FIX3 a successful observation has no attribution header", async () => {
    const made = successRequest({ "x-vercel-forwarded-for": "198.51.100.20" });
    const response = await post(made.request);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("X-Birello-Diagnostic-Gate"), null);
    assert.equal(response.headers.get("x-birello-diagnostic-gate"), null);
    const text = await response.text();
    assert.equal(text.includes("X-Birello-Diagnostic-Gate"), false);
    assert.equal(containsSensitiveMaterial(response, text), false);
  });

  test("FIX3 a throwing authorization accessor produces authorization", async () => {
    comparisons.length = 0;
    recordComparisons = true;
    try {
      const made = countingRequest({
        throwOn: "authorization",
        headers: {
          authorization: `Bearer ${TOKEN}`,
          "x-forwarded-for": "192.0.2.10",
          "x-vercel-forwarded-for": "198.51.100.20",
          "x-real-ip": "203.0.113.30",
        },
      });
      const response = await post(made.request);
      await assertDiagnosticFailure(response, "authorization");
      assert.equal(comparisons.length, 1);
      assert.equal(comparisons[0]?.equal, true);
      assert.equal(comparisons[0]?.leftLength, 32);
      assert.equal(comparisons[0]?.rightLength, 32);
      assert.equal(comparisons[0]?.sameBuffer, true);
      assert.equal(made.counts["x-forwarded-for"] ?? 0, 0);
      assert.equal(made.counts["x-vercel-forwarded-for"] ?? 0, 0);
      assert.equal(made.counts["x-real-ip"] ?? 0, 0);
      assert.equal(containsSensitiveMaterial(response, "{\"ok\":false}"), false);
    } finally {
      recordComparisons = false;
      comparisons.length = 0;
    }
  });

  test("FIX4 non-POST handlers report method", async () => {
    for (const response of [GET(), PUT(), PATCH(), DELETE(), OPTIONS()]) {
      await assertRequestFailure(response, "method");
    }
    const head = HEAD();
    await assertRequestFailure(head, "method");
    assert.equal(head.body, null);
    assert.equal(await head.text(), "");
  });

  test("FIX4 query fragment and a bare question mark report url", async () => {
    comparisons.length = 0;
    recordComparisons = true;
    try {
      const query = countingRequest({
        url: `${TARGET}?x=1`,
        headers: { authorization: `Bearer ${TOKEN}`, "content-length": "1", "x-forwarded-for": "192.0.2.10" },
      });
      await assertRequestFailure(await post(query.request), "url");
      assert.equal(query.counts["content-length"] ?? 0, 0);
      assert.equal(query.counts["authorization"] ?? 0, 0);
      assert.equal(query.counts["x-forwarded-for"] ?? 0, 0);
      assert.equal(query.access.body, 0);

      const fragment = countingRequest({
        url: `${TARGET}#part`,
        headers: { authorization: `Bearer ${TOKEN}`, "content-length": "0" },
      });
      await assertRequestFailure(await post(fragment.request), "url");
      assert.equal(fragment.counts["content-length"] ?? 0, 0);

      const bare = new Request(`${TARGET}?`, { method: "POST", headers: { authorization: `Bearer ${TOKEN}` } });
      assert.equal(bare.url.endsWith("?"), true);
      assert.equal(bare.body, null);
      await assertRequestFailure(await post(bare), "url");
      assert.equal(comparisons.length, 0);
    } finally {
      recordComparisons = false;
      comparisons.length = 0;
    }
  });

  test("FIX4 content-length and transfer-encoding report separate reasons", async () => {
    const length = countingRequest({
      headers: { authorization: `Bearer ${TOKEN}`, "content-length": "1", "transfer-encoding": "chunked" },
    });
    await assertRequestFailure(await post(length.request), "content_length");
    assert.equal(length.counts["content-length"], 1);
    assert.equal(length.counts["transfer-encoding"] ?? 0, 0);
    assert.equal(length.access.body, 0);

    const encoded = countingRequest({
      headers: { authorization: `Bearer ${TOKEN}`, "content-length": "0", "transfer-encoding": "chunked" },
    });
    await assertRequestFailure(await post(encoded.request), "transfer_encoding");
    assert.equal(encoded.counts["content-length"], 1);
    assert.equal(encoded.counts["transfer-encoding"], 1);
    assert.equal(encoded.access.body, 0);
    assert.equal(encoded.counts["authorization"] ?? 0, 0);
  });

  test("FIX4 a null body can be observed and a non-null empty stream reports body", async () => {
    const absent = new Request(TARGET, { method: "POST", headers: { authorization: `Bearer ${TOKEN}` } });
    assert.equal(absent.body, null);
    assert.equal(absent.headers.get("content-length"), null);
    const accepted = await post(absent);
    assert.equal(accepted.status, 200);
    assert.equal(accepted.headers.get("X-Birello-Diagnostic-Request-Reason"), null);
    assert.equal(accepted.headers.get("X-Birello-Diagnostic-Gate"), null);
    const acceptedBody = await accepted.json() as { ok: boolean; schemaVersion: number; headers: { xForwardedFor: { shape: string } } };
    assert.equal(acceptedBody.ok, true);
    assert.equal(acceptedBody.schemaVersion, 1);
    assert.equal(acceptedBody.headers.xForwardedFor.shape, "absent");

    const empty = new Request(TARGET, { method: "POST", body: "", headers: { authorization: `Bearer ${TOKEN}` } });
    assert.notEqual(empty.body, null);
    assert.equal(empty.headers.get("content-length"), null);
    assert.equal(empty.headers.get("transfer-encoding"), null);
    await assertRequestFailure(await post(empty), "body");
  });

  test("FIX4 an exception at a request boundary reports that boundary", async () => {
    comparisons.length = 0;
    recordComparisons = true;
    try {
      const url = countingRequest({ throwOn: "url", headers: { authorization: `Bearer ${TOKEN}`, "content-length": "1" } });
      const urlResponse = await post(url.request);
      await assertRequestFailure(urlResponse, "url");
      assert.equal(url.counts["content-length"] ?? 0, 0);
      assert.equal(url.access.body, 0);

      const headers = countingRequest({ throwOn: "headers", headers: { authorization: `Bearer ${TOKEN}`, "transfer-encoding": "chunked" } });
      await assertRequestFailure(await post(headers.request), "content_length");
      assert.equal(headers.counts["content-length"] ?? 0, 0);
      assert.equal(headers.counts["transfer-encoding"] ?? 0, 0);
      assert.equal(headers.access.body, 0);

      const length = countingRequest({
        throwOn: "content-length",
        headers: { authorization: `Bearer ${TOKEN}`, "transfer-encoding": "chunked" },
      });
      await assertRequestFailure(await post(length.request), "content_length");
      assert.equal(length.counts["content-length"], 1);
      assert.equal(length.counts["transfer-encoding"] ?? 0, 0);
      assert.equal(length.access.body, 0);

      const encoded = countingRequest({
        throwOn: "transfer-encoding",
        headers: { authorization: `Bearer ${TOKEN}`, "content-length": "0" },
      });
      await assertRequestFailure(await post(encoded.request), "transfer_encoding");
      assert.equal(encoded.counts["content-length"], 1);
      assert.equal(encoded.access.body, 0);

      const body = countingRequest({
        throwOn: "body",
        body: "stream",
        headers: { authorization: `Bearer ${TOKEN}`, "content-length": "0" },
      });
      await assertRequestFailure(await post(body.request), "body");
      assert.equal(body.access.body, 1);
      assert.equal(body.reads.text, 0);
      assert.equal(body.counts["authorization"] ?? 0, 0);
      assert.equal(comparisons.length, 0);
    } finally {
      recordComparisons = false;
      comparisons.length = 0;
    }
  });

  test("FIX4 a forwarding accessor failure reports forwarding_headers", async () => {
    const made = countingRequest({
      throwOn: "x-forwarded-for",
      headers: { authorization: `Bearer ${TOKEN}`, "x-forwarded-for": "192.0.2.10" },
    });
    const response = await post(made.request);
    await assertRequestFailure(response, "forwarding_headers");
    assert.equal(made.counts["x-forwarded-for"], 1);
    assert.equal(made.counts["x-vercel-forwarded-for"] ?? 0, 0);
    assert.equal(made.counts["x-real-ip"] ?? 0, 0);
  });

  test("FIX4 invalid forwarding text stays a successful observation", async () => {
    const made = successRequest({ "x-forwarded-for": "example.test" });
    const response = await post(made.request);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("X-Birello-Diagnostic-Gate"), null);
    assert.equal(response.headers.get("x-birello-diagnostic-gate"), null);
    assert.equal(response.headers.get("X-Birello-Diagnostic-Request-Reason"), null);
    assert.equal(response.headers.get("x-birello-diagnostic-request-reason"), null);
    const body = await response.json() as {
      ok: boolean;
      schemaVersion: number;
      environment: string;
      headers: { xForwardedFor: { shape: string } };
    };
    assert.equal(body.ok, true);
    assert.equal(body.schemaVersion, 1);
    assert.equal(body.environment, "preview");
    assert.equal(body.headers.xForwardedFor.shape, "invalid");
    assert.equal(JSON.stringify(body).includes("X-Birello-Diagnostic-Request-Reason"), false);
  });

  test("FIX4 the first failing boundary supplies the reason", async () => {
    comparisons.length = 0;
    recordComparisons = true;
    try {
      const query = countingRequest({
        url: `${TARGET}?x=1`,
        body: "stream",
        headers: { authorization: `Bearer ${TOKEN}`, "content-length": "1", "transfer-encoding": "chunked" },
      });
      await assertRequestFailure(await post(query.request), "url");
      assert.equal(query.counts["content-length"] ?? 0, 0);
      assert.equal(query.counts["transfer-encoding"] ?? 0, 0);
      assert.equal(query.access.body, 0);
      assert.equal(query.counts["authorization"] ?? 0, 0);

      const length = countingRequest({
        body: "stream",
        headers: { authorization: `Bearer ${TOKEN}`, "content-length": "1", "transfer-encoding": "chunked" },
      });
      await assertRequestFailure(await post(length.request), "content_length");
      assert.equal(length.counts["transfer-encoding"] ?? 0, 0);
      assert.equal(length.access.body, 0);

      const encoded = countingRequest({
        body: "stream",
        headers: { authorization: `Bearer ${TOKEN}`, "content-length": "0", "transfer-encoding": "chunked" },
      });
      await assertRequestFailure(await post(encoded.request), "transfer_encoding");
      assert.equal(encoded.access.body, 0);
      assert.equal(encoded.counts["authorization"] ?? 0, 0);
      assert.equal(comparisons.length, 0);
    } finally {
      recordComparisons = false;
      comparisons.length = 0;
    }
  });

  test("FIX4 environment configuration authorization and success omit the request reason", async () => {
    const environment = await post(successRequest().request, { ...openEnv, VERCEL: undefined });
    await assertDiagnosticFailure(environment, "environment");
    assert.equal(environment.headers.get("X-Birello-Diagnostic-Request-Reason"), null);
    assert.equal(environment.headers.get("x-birello-diagnostic-request-reason"), null);

    const configuration = await post(successRequest().request, { ...openEnv, PUBLIC_FREE_QA_HEADER_OBSERVATION_ENABLED: undefined });
    await assertDiagnosticFailure(configuration, "configuration");
    assert.equal(configuration.headers.get("X-Birello-Diagnostic-Request-Reason"), null);

    const authorization = await post(countingRequest({ headers: {} }).request);
    await assertDiagnosticFailure(authorization, "authorization");
    assert.equal(authorization.headers.get("X-Birello-Diagnostic-Request-Reason"), null);

    const success = await post(successRequest().request);
    assert.equal(success.status, 200);
    assert.equal(success.headers.get("X-Birello-Diagnostic-Request-Reason"), null);
    assert.equal(success.headers.get("X-Birello-Diagnostic-Gate"), null);
    const text = await success.text();
    assert.equal(text.includes("X-Birello-Diagnostic-Request-Reason"), false);
  });
});
