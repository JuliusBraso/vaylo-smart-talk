import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import * as nodeModule from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

/**
 * Offline canonicalizer tests. They do not prove Vercel header authenticity,
 * direct-origin protection, proxy topology, preview isolation, anonymity,
 * database atomicity, or production readiness.
 */

type ResolveContext = { parentURL?: string };
type NextResolve = (specifier: string, context: ResolveContext) => { url: string };
const registerHooks = (nodeModule as unknown as {
  registerHooks: (hooks: {
    resolve: (
      specifier: string,
      context: ResolveContext,
      nextResolve: NextResolve,
    ) => { url: string; shortCircuit?: boolean };
  }) => void;
}).registerHooks;

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "server-only") {
      return { url: "data:text/javascript,export%20{};", shortCircuit: true };
    }
    let unresolvedPath: string | null = null;
    if (
      (specifier.startsWith("./") || specifier.startsWith("../"))
      && context.parentURL?.startsWith("file:")
    ) {
      unresolvedPath = path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier);
    }
    if (unresolvedPath && path.extname(unresolvedPath) === "") {
      const candidate = `${unresolvedPath}.ts`;
      if (existsSync(candidate)) return nextResolve(pathToFileURL(candidate).href, context);
    }
    return nextResolve(specifier, context);
  },
});

type TrustedAddressHeaders = { get(name: string): string | null };
type Resolution =
  | { ok: true; provider: "vercel_v1"; canonicalAddress: string }
  | { ok: false; error: "trusted_address_unavailable" };

const moduleApi = await import("./public-free-qa-trusted-address") as {
  canonicalizePublicFreeQaAddress(rawAddress: unknown): string | null;
  createPublicFreeQaTrustedAddressResolver(input: {
    provider: "vercel_v1";
    activation: "deployment_evidence_approved";
  }): (headers: TrustedAddressHeaders) => Resolution;
};
const { canonicalizePublicFreeQaAddress, createPublicFreeQaTrustedAddressResolver } = moduleApi;

const CONFIGURATION_ERROR = "invalid_public_free_qa_trusted_address_configuration";
const approved = {
  provider: "vercel_v1" as const,
  activation: "deployment_evidence_approved" as const,
};

function resolveWith(value: string | null | undefined, extra?: Record<string, string>) {
  const seen: string[] = [];
  const headers: TrustedAddressHeaders = {
    get(name) {
      seen.push(name);
      if (name === "x-vercel-forwarded-for") return value ?? null;
      return extra?.[name] ?? null;
    },
  };
  return { seen, result: createPublicFreeQaTrustedAddressResolver(approved)(headers) };
}

function assertUnavailable(result: { ok: boolean; error?: string }) {
  assert.deepEqual(result, { ok: false, error: "trusted_address_unavailable" });
  assert.equal(Object.isFrozen(result), true);
}

test("valid vercel_v1 factory resolves one canonical address", () => {
  const { result } = resolveWith("192.0.2.1");
  assert.deepEqual(result, {
    ok: true,
    provider: "vercel_v1",
    canonicalAddress: "192.0.2.1",
  });
});

test("missing or wrong provider is rejected", () => {
  assert.throws(
    () => createPublicFreeQaTrustedAddressResolver({ provider: "other" as "vercel_v1", activation: approved.activation }),
    (error: unknown) => error instanceof Error && error.message === CONFIGURATION_ERROR,
  );
});

test("missing or wrong activation is rejected", () => {
  assert.throws(
    () => createPublicFreeQaTrustedAddressResolver({
      provider: "vercel_v1",
      activation: "preview" as "deployment_evidence_approved",
    }),
    (error: unknown) => error instanceof Error && error.message === CONFIGURATION_ERROR,
  );
});

test("additional malformed configuration is rejected", () => {
  for (const input of [null, [], "vercel_v1", { provider: "vercel_v1" }, { ...approved, extra: true }]) {
    assert.throws(
      () => createPublicFreeQaTrustedAddressResolver(input as never),
      (error: unknown) => error instanceof Error && error.message === CONFIGURATION_ERROR && !error.message.includes("extra"),
    );
  }
});

test("fixed header name is read exactly once", () => {
  const { seen, result } = resolveWith("192.0.2.10");
  assert.deepEqual(seen, ["x-vercel-forwarded-for"]);
  assert.equal(result.ok, true);
});

test("x-forwarded-for is ignored", () => {
  const { seen, result } = resolveWith(null, { "x-forwarded-for": "192.0.2.10" });
  assert.deepEqual(seen, ["x-vercel-forwarded-for"]);
  assertUnavailable(result);
});

test("x-real-ip is ignored", () => {
  const { seen, result } = resolveWith(null, { "x-real-ip": "192.0.2.10" });
  assert.deepEqual(seen, ["x-vercel-forwarded-for"]);
  assertUnavailable(result);
});

test("no fallback header is consulted", () => {
  const seen: string[] = [];
  const headers: TrustedAddressHeaders = {
    get(name) {
      seen.push(name);
      if (name !== "x-vercel-forwarded-for") return "192.0.2.10";
      return null;
    },
  };
  assertUnavailable(createPublicFreeQaTrustedAddressResolver(approved)(headers));
  assert.deepEqual(seen, ["x-vercel-forwarded-for"]);
});

test("throwing get fails closed", () => {
  const headers: TrustedAddressHeaders = {
    get() {
      throw new Error("header blew up 203.0.113.9");
    },
  };
  assertUnavailable(createPublicFreeQaTrustedAddressResolver(approved)(headers));
});

test("non-string get result fails closed", () => {
  const headers = { get: () => 192 as unknown as string };
  assertUnavailable(createPublicFreeQaTrustedAddressResolver(approved)(headers));
});

test("fixed errors do not include received values", () => {
  const secret = "203.0.113.55";
  assert.throws(
    () => createPublicFreeQaTrustedAddressResolver({ provider: secret as "vercel_v1", activation: approved.activation }),
    (error: unknown) => error instanceof Error && error.message === CONFIGURATION_ERROR && !error.message.includes(secret),
  );
  const headers: TrustedAddressHeaders = {
    get() {
      throw new Error(secret);
    },
  };
  const result = createPublicFreeQaTrustedAddressResolver(approved)(headers);
  assert.equal(JSON.stringify(result).includes(secret), false);
});

test("success and failure results are frozen", () => {
  const success = resolveWith("192.0.2.1").result;
  const failure = resolveWith(null).result;
  assert.equal(Object.isFrozen(success), true);
  assert.equal(Object.isFrozen(failure), true);
  assert.throws(() => {
    (success as { canonicalAddress: string }).canonicalAddress = "10.0.0.1";
  });
});

test("missing header is unavailable", () => {
  assertUnavailable(resolveWith(null).result);
});

test("empty string is rejected", () => {
  assert.equal(canonicalizePublicFreeQaAddress(""), null);
});

test("leading whitespace is rejected", () => {
  assert.equal(canonicalizePublicFreeQaAddress(" 192.0.2.1"), null);
});

test("trailing whitespace is rejected", () => {
  assert.equal(canonicalizePublicFreeQaAddress("192.0.2.1 "), null);
});

test("internal whitespace is rejected", () => {
  assert.equal(canonicalizePublicFreeQaAddress("192.0.2.1 192.0.2.2"), null);
});

test("comma-separated chain is rejected", () => {
  assert.equal(canonicalizePublicFreeQaAddress("192.0.2.1,192.0.2.2"), null);
});

test("control characters are rejected", () => {
  assert.equal(canonicalizePublicFreeQaAddress("192.0.2.1\n"), null);
  assert.equal(canonicalizePublicFreeQaAddress("192.0.2.\u00001"), null);
});

test("brackets are rejected", () => {
  assert.equal(canonicalizePublicFreeQaAddress("[2001:db8::1]"), null);
});

test("zone identifiers are rejected", () => {
  assert.equal(canonicalizePublicFreeQaAddress("fe80::1%eth0"), null);
});

test("more than 64 characters is rejected", () => {
  assert.equal(canonicalizePublicFreeQaAddress(`2001:${"0:".repeat(30)}1`), null);
});

test("arbitrary prose is rejected", () => {
  assert.equal(canonicalizePublicFreeQaAddress("not an address"), null);
});

test("minimum IPv4 is canonical", () => {
  assert.equal(canonicalizePublicFreeQaAddress("0.0.0.0"), "0.0.0.0");
});

test("maximum IPv4 is canonical", () => {
  assert.equal(canonicalizePublicFreeQaAddress("255.255.255.255"), "255.255.255.255");
});

test("representative IPv4 is canonical", () => {
  assert.equal(canonicalizePublicFreeQaAddress("192.0.2.1"), "192.0.2.1");
});

test("IPv4 leading zeros are rejected", () => {
  assert.equal(canonicalizePublicFreeQaAddress("192.168.001.1"), null);
});

test("IPv4 octet above 255 is rejected", () => {
  assert.equal(canonicalizePublicFreeQaAddress("256.0.0.1"), null);
});

test("IPv4 with too few groups is rejected", () => {
  assert.equal(canonicalizePublicFreeQaAddress("1.2.3"), null);
  assert.equal(canonicalizePublicFreeQaAddress("127.1"), null);
});

test("IPv4 with too many groups is rejected", () => {
  assert.equal(canonicalizePublicFreeQaAddress("1.2.3.4.5"), null);
});

test("signed IPv4 is rejected", () => {
  assert.equal(canonicalizePublicFreeQaAddress("+1.2.3.4"), null);
});

test("hexadecimal, octal, and short IPv4 forms are rejected", () => {
  assert.equal(canonicalizePublicFreeQaAddress("0x7f.0.0.1"), null);
  assert.equal(canonicalizePublicFreeQaAddress("0300.0.0.1"), null);
});

test("IPv4 canonicalization is idempotent", () => {
  const once = canonicalizePublicFreeQaAddress("192.0.2.1");
  assert.equal(canonicalizePublicFreeQaAddress(once), once);
});

test("full eight-group IPv6 uses the /64 bucket", () => {
  assert.equal(
    canonicalizePublicFreeQaAddress("2001:0db8:0001:0002:0003:0004:0005:0006"),
    "2001:db8:1:2::",
  );
});

test("compressed IPv6 uses the /64 bucket", () => {
  assert.equal(canonicalizePublicFreeQaAddress("2001:db8:1:2::ffff"), "2001:db8:1:2::");
});

test("uppercase IPv6 becomes lowercase", () => {
  assert.equal(canonicalizePublicFreeQaAddress("2001:DB8:1:2::ABCD"), "2001:db8:1:2::");
});

test("IPv6 with too few groups is rejected", () => {
  assert.equal(canonicalizePublicFreeQaAddress("2001:db8:1:2:3:4:5"), null);
});

test("IPv6 with too many groups is rejected", () => {
  assert.equal(canonicalizePublicFreeQaAddress("2001:db8:1:2:3:4:5:6:7"), null);
});

test("multiple IPv6 compression markers are rejected", () => {
  assert.equal(canonicalizePublicFreeQaAddress("2001::db8::1"), null);
});

test("an oversized IPv6 group is rejected", () => {
  assert.equal(canonicalizePublicFreeQaAddress("2001:db8:12345::1"), null);
});

test("illegal IPv6 characters are rejected", () => {
  assert.equal(canonicalizePublicFreeQaAddress("2001:db8::gggg"), null);
});

test("leading and trailing IPv6 compression are accepted", () => {
  assert.equal(canonicalizePublicFreeQaAddress("::1"), "::");
  assert.equal(canonicalizePublicFreeQaAddress("2001:db8::"), "2001:db8::");
});

test("the all-zero IPv6 address is ::", () => {
  assert.equal(canonicalizePublicFreeQaAddress("::"), "::");
  assert.equal(canonicalizePublicFreeQaAddress("0:0:0:0:0:0:0:0"), "::");
});

test("the longest zero run is compressed", () => {
  assert.equal(canonicalizePublicFreeQaAddress("2001:0:0:1:0:0:0:1"), "2001:0:0:1::");
});

test("leftmost equal runs do not override the longer /64 zero run", () => {
  assert.equal(canonicalizePublicFreeQaAddress("0:0:1:1:0:0:1:1"), "0:0:1:1::");
});

test("a single zero group is not compressed", () => {
  assert.equal(canonicalizePublicFreeQaAddress("2001:db8:0:1:2:3:4:5"), "2001:db8:0:1::");
});

test("hosts in one /64 share one bucket", () => {
  const first = canonicalizePublicFreeQaAddress("2001:db8:1:2:aaaa:bbbb:cccc:dddd");
  const second = canonicalizePublicFreeQaAddress("2001:db8:1:2::1");
  assert.equal(first, "2001:db8:1:2::");
  assert.equal(second, first);
});

test("different /64 values stay different", () => {
  assert.notEqual(
    canonicalizePublicFreeQaAddress("2001:db8:1::1"),
    canonicalizePublicFreeQaAddress("2001:db8:2::1"),
  );
});

test("IPv6 canonicalization is idempotent", () => {
  const once = canonicalizePublicFreeQaAddress("2001:DB8:1:2::99");
  assert.equal(canonicalizePublicFreeQaAddress(once), once);
});

test("dotted mapped IPv6 becomes IPv4", () => {
  assert.equal(canonicalizePublicFreeQaAddress("::ffff:192.0.2.128"), "192.0.2.128");
});

test("expanded dotted mapped IPv6 becomes IPv4", () => {
  assert.equal(canonicalizePublicFreeQaAddress("0:0:0:0:0:ffff:192.0.2.128"), "192.0.2.128");
});

test("hexadecimal mapped IPv6 becomes IPv4", () => {
  assert.equal(canonicalizePublicFreeQaAddress("::ffff:c000:0280"), "192.0.2.128");
});

test("mapped IPv6 equals the dotted IPv4 bucket", () => {
  assert.equal(
    canonicalizePublicFreeQaAddress("::ffff:192.0.2.128"),
    canonicalizePublicFreeQaAddress("192.0.2.128"),
  );
});

test("an invalid mapped dotted octet is rejected", () => {
  assert.equal(canonicalizePublicFreeQaAddress("::ffff:192.0.2.256"), null);
});

test("a non-mapped dotted tail is rejected", () => {
  assert.equal(canonicalizePublicFreeQaAddress("::192.0.2.1"), null);
  assert.equal(canonicalizePublicFreeQaAddress("2001:db8::192.0.2.1"), null);
});

test("mapped input with a zone or brackets is rejected", () => {
  assert.equal(canonicalizePublicFreeQaAddress("[::ffff:192.0.2.128]"), null);
  assert.equal(canonicalizePublicFreeQaAddress("::ffff:192.0.2.128%eth0"), null);
});

test("repeated calls retain no mutable address state", () => {
  const resolver = createPublicFreeQaTrustedAddressResolver(approved);
  const first = resolver({ get: () => "192.0.2.1" });
  const second = resolver({ get: () => "198.51.100.20" });
  assert.equal(first.ok && first.canonicalAddress, "192.0.2.1");
  assert.equal(second.ok && second.canonicalAddress, "198.51.100.20");
});

test("one failing call does not influence the next", () => {
  const resolver = createPublicFreeQaTrustedAddressResolver(approved);
  assertUnavailable(resolver({ get: () => "192.168.001.1" }));
  const next = resolver({ get: () => "192.0.2.8" });
  assert.equal(next.ok && next.canonicalAddress, "192.0.2.8");
});

test("the raw address is absent from returned errors", () => {
  const raw = "192.0.2.1,10.0.0.1";
  const result = createPublicFreeQaTrustedAddressResolver(approved)({ get: () => raw });
  assert.equal(JSON.stringify(result).includes(raw), false);
  assert.equal(JSON.stringify(result).includes("192.0.2.1"), false);
});

test("no request-controlled field selects another provider or header", () => {
  const seen: string[] = [];
  const headers: TrustedAddressHeaders = {
    get(name) {
      seen.push(name);
      return name === "x-vercel-forwarded-for" ? "198.51.100.7" : "203.0.113.9";
    },
  };
  const result = createPublicFreeQaTrustedAddressResolver(approved)(headers);
  assert.deepEqual(seen, ["x-vercel-forwarded-for"]);
  assert.equal(result.ok && result.provider, "vercel_v1");
  assert.equal(result.ok && result.canonicalAddress, "198.51.100.7");
});

test("malicious accessors do not escape", () => {
  const hostile = new Proxy({}, {
    get() {
      throw new Error("proxy secret 2001:db8::1");
    },
  });
  assert.throws(
    () => createPublicFreeQaTrustedAddressResolver(hostile as never),
    (error: unknown) => error instanceof Error
      && error.message === CONFIGURATION_ERROR
      && !error.message.includes("proxy secret"),
  );
  const headers = new Proxy({} as TrustedAddressHeaders, {
    get() {
      throw new Error("accessor secret");
    },
  });
  const result = createPublicFreeQaTrustedAddressResolver(approved)(headers);
  assertUnavailable(result);
  assert.equal(JSON.stringify(result).includes("accessor secret"), false);
});

test("transparent configuration proxy is rejected", () => {
  assert.throws(
    () => createPublicFreeQaTrustedAddressResolver(new Proxy({ ...approved }, {}) as never),
    (error: unknown) => error instanceof Error && error.message === CONFIGURATION_ERROR,
  );
});

test("revoked configuration proxy is rejected", () => {
  const { proxy, revoke } = Proxy.revocable({ ...approved }, {});
  revoke();
  assert.throws(
    () => createPublicFreeQaTrustedAddressResolver(proxy as never),
    (error: unknown) => error instanceof Error && error.message === CONFIGURATION_ERROR,
  );
});

test("configuration proxy trap message does not escape", () => {
  const proxy = new Proxy({ ...approved }, {
    get() {
      throw new Error("config trap secret");
    },
  });
  assert.throws(
    () => createPublicFreeQaTrustedAddressResolver(proxy as never),
    (error: unknown) => error instanceof Error
      && error.message === CONFIGURATION_ERROR
      && !error.message.includes("config trap secret"),
  );
});

test("configuration with an extra symbol key is rejected", () => {
  const input = { ...approved, [Symbol("extra")]: "hidden-symbol" };
  assert.throws(
    () => createPublicFreeQaTrustedAddressResolver(input as never),
    (error: unknown) => error instanceof Error
      && error.message === CONFIGURATION_ERROR
      && !error.message.includes("hidden-symbol"),
  );
});

test("configuration with an extra non-enumerable key is rejected", () => {
  const input = { ...approved };
  Object.defineProperty(input, "hidden", { value: "hidden-field", enumerable: false });
  assert.throws(
    () => createPublicFreeQaTrustedAddressResolver(input as never),
    (error: unknown) => error instanceof Error
      && error.message === CONFIGURATION_ERROR
      && !error.message.includes("hidden-field"),
  );
});

test("class instance with expected fields is rejected", () => {
  class Config {
    provider = "vercel_v1";
    activation = "deployment_evidence_approved";
  }
  assert.throws(
    () => createPublicFreeQaTrustedAddressResolver(new Config() as never),
    (error: unknown) => error instanceof Error && error.message === CONFIGURATION_ERROR,
  );
});

test("exotic prototype with added fields is rejected", () => {
  const input = new Date(0) as unknown as Record<string, string>;
  input.provider = "vercel_v1";
  input.activation = "deployment_evidence_approved";
  assert.throws(
    () => createPublicFreeQaTrustedAddressResolver(input as never),
    (error: unknown) => error instanceof Error && error.message === CONFIGURATION_ERROR,
  );
});

test("null-prototype configuration is rejected", () => {
  assert.throws(
    () => createPublicFreeQaTrustedAddressResolver(Object.assign(Object.create(null), approved) as never),
    (error: unknown) => error instanceof Error && error.message === CONFIGURATION_ERROR,
  );
});

test("getter-backed provider is rejected without invoking the getter", () => {
  let reads = 0;
  const input = {};
  Object.defineProperty(input, "provider", {
    enumerable: true,
    configurable: true,
    get() {
      reads += 1;
      return "vercel_v1";
    },
  });
  Object.defineProperty(input, "activation", {
    enumerable: true,
    configurable: true,
    value: "deployment_evidence_approved",
  });
  assert.throws(
    () => createPublicFreeQaTrustedAddressResolver(input as never),
    (error: unknown) => error instanceof Error && error.message === CONFIGURATION_ERROR,
  );
  assert.equal(reads, 0);
});

test("getter-backed activation is rejected without invoking the getter", () => {
  let reads = 0;
  const input = {};
  Object.defineProperty(input, "provider", {
    enumerable: true,
    configurable: true,
    value: "vercel_v1",
  });
  Object.defineProperty(input, "activation", {
    enumerable: true,
    configurable: true,
    get() {
      reads += 1;
      return "deployment_evidence_approved";
    },
  });
  assert.throws(
    () => createPublicFreeQaTrustedAddressResolver(input as never),
    (error: unknown) => error instanceof Error && error.message === CONFIGURATION_ERROR,
  );
  assert.equal(reads, 0);
});

test("setter-backed expected field is rejected", () => {
  let writes = 0;
  const input = {};
  Object.defineProperty(input, "provider", {
    enumerable: true,
    configurable: true,
    set() {
      writes += 1;
    },
  });
  Object.defineProperty(input, "activation", {
    enumerable: true,
    configurable: true,
    value: "deployment_evidence_approved",
  });
  assert.throws(
    () => createPublicFreeQaTrustedAddressResolver(input as never),
    (error: unknown) => error instanceof Error && error.message === CONFIGURATION_ERROR,
  );
  assert.equal(writes, 0);
});

test("frozen exact literal is accepted", () => {
  const resolver = createPublicFreeQaTrustedAddressResolver(Object.freeze({ ...approved }));
  const result = resolver({ get: () => "192.0.2.1" });
  assert.equal(result.ok && result.canonicalAddress, "192.0.2.1");
});

test("exact ordinary mutable literal is accepted", () => {
  const resolver = createPublicFreeQaTrustedAddressResolver({ ...approved });
  const result = resolver({ get: () => "198.51.100.8" });
  assert.equal(result.ok && result.canonicalAddress, "198.51.100.8");
});

test("configuration failure always uses the fixed error", () => {
  for (const input of [undefined, 1, approved.provider, () => approved]) {
    assert.throws(
      () => createPublicFreeQaTrustedAddressResolver(input as never),
      (error: unknown) => error instanceof Error && error.message === CONFIGURATION_ERROR,
    );
  }
});

test("hidden hostile values are absent from the configuration error", () => {
  const secret = "203.0.113.77";
  assert.throws(
    () => createPublicFreeQaTrustedAddressResolver({ ...approved, leak: secret } as never),
    (error: unknown) => error instanceof Error
      && error.message === CONFIGURATION_ERROR
      && !error.message.includes(secret),
  );
});

test("transparent headers proxy returns unavailable", () => {
  const resolver = createPublicFreeQaTrustedAddressResolver(approved);
  const headers = new Proxy({ get: () => "192.0.2.1" }, {});
  assertUnavailable(resolver(headers as TrustedAddressHeaders));
});

test("revoked headers proxy returns unavailable", () => {
  const resolver = createPublicFreeQaTrustedAddressResolver(approved);
  const { proxy, revoke } = Proxy.revocable({ get: () => "192.0.2.1" }, {});
  revoke();
  assertUnavailable(resolver(proxy as TrustedAddressHeaders));
});

test("header proxy traps do not escape", () => {
  const resolver = createPublicFreeQaTrustedAddressResolver(approved);
  const headers = new Proxy({}, {
    get() {
      throw new Error("header trap secret");
    },
  });
  const result = resolver(headers as TrustedAddressHeaders);
  assertUnavailable(result);
  assert.equal(JSON.stringify(result).includes("header trap secret"), false);
});

test("headers.get property is read exactly once", () => {
  let reads = 0;
  const headers = Object.defineProperty({}, "get", {
    enumerable: true,
    configurable: true,
    get() {
      reads += 1;
      return (name: string) => (name === "x-vercel-forwarded-for" ? "192.0.2.1" : null);
    },
  }) as unknown as TrustedAddressHeaders;
  const result = createPublicFreeQaTrustedAddressResolver(approved)(headers);
  assert.equal(reads, 1);
  assert.equal(result.ok && result.canonicalAddress, "192.0.2.1");
});

test("stored get method is called exactly once", () => {
  let calls = 0;
  const headers: TrustedAddressHeaders = {
    get(name) {
      calls += 1;
      return name === "x-vercel-forwarded-for" ? "192.0.2.1" : null;
    },
  };
  createPublicFreeQaTrustedAddressResolver(approved)(headers);
  assert.equal(calls, 1);
});

test("stored get method receives the original headers object as this", () => {
  const headers = {
    marker: "original",
    get(this: { marker: string }, name: string) {
      assert.equal(this.marker, "original");
      return name === "x-vercel-forwarded-for" ? "192.0.2.1" : null;
    },
  };
  const result = createPublicFreeQaTrustedAddressResolver(approved)(headers);
  assert.equal(result.ok && result.canonicalAddress, "192.0.2.1");
});

test("throwing get property accessor returns unavailable", () => {
  const headers = Object.defineProperty({}, "get", {
    enumerable: true,
    configurable: true,
    get() {
      throw new Error("property accessor secret");
    },
  }) as unknown as TrustedAddressHeaders;
  const result = createPublicFreeQaTrustedAddressResolver(approved)(headers);
  assertUnavailable(result);
  assert.equal(JSON.stringify(result).includes("property accessor secret"), false);
});

test("throwing stored get function returns unavailable", () => {
  const result = createPublicFreeQaTrustedAddressResolver(approved)({
    get() {
      throw new Error("stored function secret");
    },
  });
  assertUnavailable(result);
  assert.equal(JSON.stringify(result).includes("stored function secret"), false);
});

test("non-function get value returns unavailable", () => {
  assertUnavailable(createPublicFreeQaTrustedAddressResolver(approved)({
    get: "not-a-function" as unknown as TrustedAddressHeaders["get"],
  }));
});

test("real Headers with the trusted header succeeds", () => {
  const result = createPublicFreeQaTrustedAddressResolver(approved)(
    new Headers({ "x-vercel-forwarded-for": "192.0.2.1" }),
  );
  assert.equal(result.ok && result.canonicalAddress, "192.0.2.1");
});

test("real Headers containing only x-forwarded-for fails closed", () => {
  assertUnavailable(createPublicFreeQaTrustedAddressResolver(approved)(
    new Headers({ "x-forwarded-for": "192.0.2.1" }),
  ));
});

test("no fallback header is read from a multi-header object", () => {
  const seen: string[] = [];
  const headers: TrustedAddressHeaders = {
    get(name) {
      seen.push(name);
      if (name === "x-forwarded-for" || name === "x-real-ip") return "203.0.113.8";
      return null;
    },
  };
  assertUnavailable(createPublicFreeQaTrustedAddressResolver(approved)(headers));
  assert.deepEqual(seen, ["x-vercel-forwarded-for"]);
});

test("FIX1 success and failure results remain frozen", () => {
  const success = createPublicFreeQaTrustedAddressResolver(approved)({ get: () => "192.0.2.1" });
  const failure = createPublicFreeQaTrustedAddressResolver(approved)({ get: () => null });
  assert.equal(Object.isFrozen(success), true);
  assert.equal(Object.isFrozen(failure), true);
});

test("existing IPv4 and IPv6 canonicalization remains unchanged", () => {
  assert.equal(canonicalizePublicFreeQaAddress("255.255.255.255"), "255.255.255.255");
  assert.equal(canonicalizePublicFreeQaAddress("192.168.001.1"), null);
  assert.equal(canonicalizePublicFreeQaAddress("2001:DB8:1:2::ABCD"), "2001:db8:1:2::");
  assert.equal(canonicalizePublicFreeQaAddress("2001:db8:0:1:2:3:4:5"), "2001:db8:0:1::");
  assert.equal(canonicalizePublicFreeQaAddress("::ffff:c000:0280"), "192.0.2.128");
  assert.equal(canonicalizePublicFreeQaAddress("2001:db8::192.0.2.1"), null);
});

test("FIX1 resolution performs no timers or asynchronous work", () => {
  let timers = 0;
  const original = globalThis.setTimeout;
  globalThis.setTimeout = (() => {
    timers += 1;
    return 0;
  }) as unknown as typeof setTimeout;
  try {
    const result = createPublicFreeQaTrustedAddressResolver(approved)({ get: () => "2001:db8::1" });
    assert.equal(result instanceof Promise, false);
    assert.equal(result.ok && result.canonicalAddress, "2001:db8::");
    assert.equal(timers, 0);
  } finally {
    globalThis.setTimeout = original;
  }
});

test("resolution performs no asynchronous work or timers", () => {
  let timers = 0;
  const original = globalThis.setTimeout;
  globalThis.setTimeout = (() => {
    timers += 1;
    return 0;
  }) as unknown as typeof setTimeout;
  try {
    const result = resolveWith("2001:db8::1").result;
    assert.equal(result.ok, true);
    assert.equal(result instanceof Promise, false);
    assert.equal(timers, 0);
  } finally {
    globalThis.setTimeout = original;
  }
});
