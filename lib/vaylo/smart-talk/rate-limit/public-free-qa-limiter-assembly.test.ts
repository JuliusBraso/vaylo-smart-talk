import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHmac } from "node:crypto";
import { EventEmitter } from "node:events";
import dns from "node:dns";
import { existsSync } from "node:fs";
import http from "node:http";
import https from "node:https";
import * as nodeModule from "node:module";
import net from "node:net";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

/**
 * Offline assembly tests. Hosts ending in .invalid are synthetic and are never
 * resolved. These tests do not prove header authenticity, direct-origin
 * protection, proxy topology, preview isolation, or vercel_v1 activation.
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

type Headers = { get(name: string): string | null };
type LimitResult =
  | { kind: "accepted" }
  | { kind: "rejected" }
  | { kind: "unavailable"; reason: string };

type PoolOptions = {
  connectionString: string;
  max: number;
  connectionTimeoutMillis: number;
  idleTimeoutMillis: number;
  ssl: { rejectUnauthorized: boolean };
  application_name?: string;
};

type QueryCall = { sql: string; values: readonly unknown[] | undefined };
type FakePool = {
  on(event: "error", listener: () => void): void;
  connect(): Promise<FakeClient>;
  emitError(error: Error): void;
  end(): void;
  options: PoolOptions;
  connects: number;
  ends: number;
  listeners: Array<() => void>;
  queries: QueryCall[];
  decision: "accepted" | "rejected";
  failSql: string | null;
  hang: boolean;
};

const assembly = await import("./public-free-qa-limiter-assembly") as {
  createPublicFreeQaLimiterAssembly(dependencies: Record<string, unknown>): {
    check(input: unknown): Promise<LimitResult>;
  };
  createPublicFreeQaLimiterAssemblySingleton(dependencies: Record<string, unknown>): {
    get(): { check(input: unknown): Promise<LimitResult> };
  };
  getPublicFreeQaLimiterAssembly(): unknown;
};

const {
  createPublicFreeQaLimiterAssembly,
  createPublicFreeQaLimiterAssemblySingleton,
} = assembly;


const CONFIGURATION_ERROR = "invalid_public_free_qa_limiter_configuration";
const SYNTHETIC_URL = "postgresql://limiter:synthetic@db.invalid:5432/freeqa";
const REQUIRED_NAMES = [
  "PUBLIC_FREE_QA_LIMITER_HMAC_KEY",
  "PUBLIC_FREE_QA_LIMITER_DATABASE_URL",
  "PUBLIC_FREE_QA_LIMITER_POOL_MAX",
  "PUBLIC_FREE_QA_LIMITER_QUEUE_BOUND",
  "PUBLIC_FREE_QA_LIMITER_CONNECTION_TIMEOUT_MS",
  "PUBLIC_FREE_QA_LIMITER_IDLE_TIMEOUT_MS",
  "PUBLIC_FREE_QA_LIMITER_APPLICATION_NAME",
] as const;

const importCheckoutCount = { value: 0 };
const checkoutsDuringImport = importCheckoutCount.value;

function syntheticKey(byte: number, length = 32): string {
  return Buffer.alloc(length, byte).toString("base64");
}

const KEY = syntheticKey(0x11);

function validEnv(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    PUBLIC_FREE_QA_LIMITER_HMAC_KEY: KEY,
    PUBLIC_FREE_QA_LIMITER_DATABASE_URL: SYNTHETIC_URL,
    PUBLIC_FREE_QA_LIMITER_POOL_MAX: "2",
    PUBLIC_FREE_QA_LIMITER_QUEUE_BOUND: "0",
    PUBLIC_FREE_QA_LIMITER_CONNECTION_TIMEOUT_MS: "100",
    PUBLIC_FREE_QA_LIMITER_IDLE_TIMEOUT_MS: "1000",
    ...overrides,
  };
}

function fakePool(options: PoolOptions): FakePool {
  const pool: FakePool = {
    options,
    connects: 0,
    ends: 0,
    listeners: [],
    queries: [],
    decision: "accepted",
    failSql: null,
    hang: false,
    on(event, listener) {
      if (event === "error") pool.listeners.push(listener);
    },
    connect() {
      pool.connects += 1;
      importCheckoutCount.value += 1;
      const client: FakeClient = {
        on() {},
        removeListener() {},
        release() {},
        query(sql, values) {
          pool.queries.push({ sql, values });
          if (pool.hang && sql.startsWith("SELECT")) return new Promise(() => {});
          if (pool.failSql !== null && sql === pool.failSql) {
            return Promise.reject(new Error("synthetic-transport-failure"));
          }
          if (sql.startsWith("SELECT")) {
            return Promise.resolve({
              command: "SELECT",
              rows: [{ decision: pool.decision }],
            });
          }
          const command = sql.startsWith("BEGIN")
            ? "BEGIN"
            : sql.startsWith("SET")
              ? "SET"
              : sql.startsWith("COMMIT")
                ? "COMMIT"
                : sql.startsWith("ROLLBACK")
                  ? "ROLLBACK"
                  : "UNKNOWN";
          return Promise.resolve({ command, rows: [] });
        },
      };
      return Promise.resolve(client);
    },
    emitError(error) {
      for (const listener of pool.listeners) listener();
      void error;
    },
    end() {
      pool.ends += 1;
    },
  };
  return pool;
}

type FakeClient = {
  on(event: "error", listener: (error: Error) => void): void;
  removeListener(event: "error", listener: (error: Error) => void): void;
  release(err?: Error | boolean): void;
  query(sql: string, values?: readonly unknown[]): Promise<unknown>;
};

function harness(env: Record<string, unknown> = validEnv(), extra: Record<string, unknown> = {}) {
  const reads: string[] = [];
  const pools: FakePool[] = [];
  const dependencies = {
    readEnvironment(name: string) {
      reads.push(name);
      if (!REQUIRED_NAMES.includes(name as (typeof REQUIRED_NAMES)[number])) {
        throw new Error(`unexpected ${name}`);
      }
      return env[name];
    },
    createPool(options: PoolOptions) {
      const pool = fakePool(options);
      pools.push(pool);
      return pool;
    },
    ...extra,
  };
  return { reads, pools, dependencies };
}

function headers(value: string | null, name = "x-vercel-forwarded-for"): Headers {
  return {
    get(requested) {
      return requested === name ? value : null;
    },
  };
}

function assertConfigError(error: unknown, hostile?: string) {
  assert.ok(error instanceof Error);
  assert.equal(error.message, CONFIGURATION_ERROR);
  assert.equal("cause" in error && error.cause !== undefined, false);
  const serialized = JSON.stringify(error);
  if (hostile !== undefined) assert.equal(serialized.includes(hostile), false);
  assert.equal(error.message.includes("postgres"), false);
  assert.equal(error.message.includes(SYNTHETIC_URL), false);
}

test("fully valid configuration constructs one pool", () => {
  const built = harness();
  const limiter = createPublicFreeQaLimiterAssembly(built.dependencies);
  assert.equal(built.pools.length, 1);
  assert.equal(typeof limiter.check, "function");
});

test("every required variable missing individually fails", () => {
  for (const name of REQUIRED_NAMES) {
    if (name === "PUBLIC_FREE_QA_LIMITER_APPLICATION_NAME") continue;
    const env = validEnv();
    delete env[name];
    const result = harness(env);
    assert.throws(() => createPublicFreeQaLimiterAssembly(result.dependencies), (error) => {
      assertConfigError(error);
      return true;
    });
    assert.equal(result.pools.length, 0);
  }
});

test("environment reader throwing fails with the fixed error", () => {
  const result = harness();
  result.dependencies.readEnvironment = () => {
    throw new Error("reader blew up with postgresql://secret@db.invalid");
  };
  assert.throws(() => createPublicFreeQaLimiterAssembly(result.dependencies), (error) => {
    assertConfigError(error, "secret");
    return true;
  });
  assert.equal(result.pools.length, 0);
});

test("every variable is read at most once per initialization", () => {
  const built = harness();
  createPublicFreeQaLimiterAssembly(built.dependencies);
  for (const name of REQUIRED_NAMES) {
    assert.equal(built.reads.filter((item) => item === name).length, 1);
  }
});

test("unknown environment variables are not read", () => {
  const built = harness();
  createPublicFreeQaLimiterAssembly(built.dependencies);
  assert.deepEqual(built.reads, [...REQUIRED_NAMES]);
});

test("invalid configuration constructs zero pools", () => {
  const built = harness(validEnv({ PUBLIC_FREE_QA_LIMITER_POOL_MAX: "0" }));
  assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies));
  assert.equal(built.pools.length, 0);
});

test("pool constructor throwing maps to the fixed error", () => {
  const built = harness();
  built.dependencies.createPool = () => {
    throw new Error("pool failed password=synthetic");
  };
  assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies), (error) => {
    assertConfigError(error, "password=synthetic");
    return true;
  });
});

test("pool constructor error text is not leaked", () => {
  const built = harness();
  const secret = "pool-error-text-must-stay-inside";
  built.dependencies.createPool = () => {
    throw new Error(secret);
  };
  try {
    createPublicFreeQaLimiterAssembly(built.dependencies);
    assert.fail("expected throw");
  } catch (error) {
    assertConfigError(error, secret);
  }
});

test("successful assembly is frozen", () => {
  const built = harness();
  const limiter = createPublicFreeQaLimiterAssembly(built.dependencies);
  assert.equal(Object.isFrozen(limiter), true);
});

test("successful singleton calls return the same object", () => {
  const singleton = createPublicFreeQaLimiterAssemblySingleton(harness().dependencies);
  const first = singleton.get();
  const second = singleton.get();
  assert.equal(first, second);
});

test("successful singleton construction occurs once", () => {
  const built = harness();
  const singleton = createPublicFreeQaLimiterAssemblySingleton(built.dependencies);
  singleton.get();
  singleton.get();
  assert.equal(built.pools.length, 1);
});

test("failed initialization is not returned or cached as usable", () => {
  const env = validEnv();
  delete env.PUBLIC_FREE_QA_LIMITER_HMAC_KEY;
  let allow = false;
  const built = harness(env);
  const original = built.dependencies.readEnvironment;
  built.dependencies.readEnvironment = (name: string) => {
    if (name === "PUBLIC_FREE_QA_LIMITER_HMAC_KEY" && allow) return KEY;
    return original(name);
  };
  const singleton = createPublicFreeQaLimiterAssemblySingleton(built.dependencies);
  assert.throws(() => singleton.get(), (error) => {
    assertConfigError(error);
    return true;
  });
  allow = true;
  const created = singleton.get();
  assert.equal(typeof created.check, "function");
  assert.equal(built.pools.length, 1);
});

test("canonical 32-byte standard Base64 accepted", () => {
  const built = harness(validEnv({ PUBLIC_FREE_QA_LIMITER_HMAC_KEY: syntheticKey(0x22) }));
  createPublicFreeQaLimiterAssembly(built.dependencies);
  assert.equal(built.pools.length, 1);
});

test("31-byte key rejected", () => {
  const built = harness(validEnv({ PUBLIC_FREE_QA_LIMITER_HMAC_KEY: syntheticKey(1, 31) }));
  assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies));
  assert.equal(built.pools.length, 0);
});

test("33-byte key rejected", () => {
  const built = harness(validEnv({ PUBLIC_FREE_QA_LIMITER_HMAC_KEY: syntheticKey(1, 33) }));
  assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies));
  assert.equal(built.pools.length, 0);
});

test("empty key rejected", () => {
  const built = harness(validEnv({ PUBLIC_FREE_QA_LIMITER_HMAC_KEY: "" }));
  assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies));
  assert.equal(built.pools.length, 0);
});

test("missing padding rejected", () => {
  const built = harness(validEnv({ PUBLIC_FREE_QA_LIMITER_HMAC_KEY: KEY.slice(0, 43) }));
  assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies));
  assert.equal(built.pools.length, 0);
});

test("extra padding rejected", () => {
  const built = harness(validEnv({ PUBLIC_FREE_QA_LIMITER_HMAC_KEY: `${KEY}=` }));
  assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies));
  assert.equal(built.pools.length, 0);
});

test("whitespace rejected", () => {
  const built = harness(validEnv({ PUBLIC_FREE_QA_LIMITER_HMAC_KEY: `${KEY.slice(0, 43)} ` }));
  assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies));
  assert.equal(built.pools.length, 0);
});

test("control characters rejected", () => {
  const built = harness(validEnv({ PUBLIC_FREE_QA_LIMITER_HMAC_KEY: `${KEY.slice(0, 43)}\n` }));
  assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies));
  assert.equal(built.pools.length, 0);
});

test("Base64URL characters rejected", () => {
  const mixed = Buffer.from(Array.from({ length: 32 }, (_, index) => index + 200)).toString("base64");
  assert.equal(mixed.includes("+") || mixed.includes("/"), true);
  const built = harness(validEnv({
    PUBLIC_FREE_QA_LIMITER_HMAC_KEY: mixed.replaceAll("+", "-").replaceAll("/", "_"),
  }));
  assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies));
  assert.equal(built.pools.length, 0);
});

test("invalid Base64 characters rejected", () => {
  const built = harness(validEnv({ PUBLIC_FREE_QA_LIMITER_HMAC_KEY: `${KEY.slice(0, 42)}*=` }));
  assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies));
  assert.equal(built.pools.length, 0);
});

test("noncanonical equivalent encoding rejected", () => {
  const bytes = Buffer.alloc(32, 7);
  const canonical = bytes.toString("base64");
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const last = canonical.charAt(42);
  const swapped = alphabet[(alphabet.indexOf(last) + 1) % alphabet.length];
  const noncanonical = `${canonical.slice(0, 42)}${swapped}=`;
  assert.notEqual(noncanonical, canonical);
  const built = harness(validEnv({ PUBLIC_FREE_QA_LIMITER_HMAC_KEY: noncanonical }));
  assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies));
  assert.equal(built.pools.length, 0);
});

test("correct known address produces the independent expected digest", async () => {
  const built = harness();
  const limiter = createPublicFreeQaLimiterAssembly(built.dependencies);
  const expected = createHmac("sha256", Buffer.alloc(32, 0x11))
    .update("public_free_qa_v1|203.0.113.8", "utf8")
    .digest();
  const result = await limiter.check({ headers: headers("203.0.113.8") });
  assert.deepEqual(result, { kind: "accepted" });
  const select = built.pools[0].queries.find((query) => query.sql.startsWith("SELECT"));
  assert.ok(select);
  assert.ok(select.values?.[0] instanceof Uint8Array);
  assert.deepEqual(Buffer.from(select.values[0] as Uint8Array), expected);
});

test("raw key and Base64 text are absent from results and errors", async () => {
  const built = harness();
  const limiter = createPublicFreeQaLimiterAssembly(built.dependencies);
  const result = await limiter.check({ headers: headers("203.0.113.8") });
  const serialized = JSON.stringify(result);
  assert.equal(serialized.includes(KEY), false);
  assert.equal(serialized.includes(SYNTHETIC_URL), false);
  const failing = harness(validEnv({ PUBLIC_FREE_QA_LIMITER_HMAC_KEY: "" }));
  try {
    createPublicFreeQaLimiterAssembly(failing.dependencies);
    assert.fail("expected throw");
  } catch (error) {
    assertConfigError(error, KEY);
  }
});

test("temporary decoded key storage is erased after core construction", () => {
  const seen: Uint8Array[] = [];
  const built = harness(validEnv(), {
    createLimiterCore(options: { hmacSecret: Uint8Array; transport: unknown }) {
      seen.push(options.hmacSecret);
      return {
        check() {
          return Promise.resolve({ kind: "accepted" });
        },
      };
    },
  });
  createPublicFreeQaLimiterAssembly(built.dependencies);
  assert.equal(seen.length, 1);
  assert.ok(seen[0].every((byte) => byte === 0));
});

test("valid numeric boundaries accepted", () => {
  const cases = [
    { PUBLIC_FREE_QA_LIMITER_POOL_MAX: "1", PUBLIC_FREE_QA_LIMITER_QUEUE_BOUND: "0" },
    {
      PUBLIC_FREE_QA_LIMITER_POOL_MAX: "1",
      PUBLIC_FREE_QA_LIMITER_QUEUE_BOUND: "0",
      PUBLIC_FREE_QA_LIMITER_CONNECTION_TIMEOUT_MS: "1",
      PUBLIC_FREE_QA_LIMITER_IDLE_TIMEOUT_MS: "1",
    },
  ];
  for (const item of cases) {
    const built = harness(validEnv(item));
    createPublicFreeQaLimiterAssembly(built.dependencies);
    assert.equal(built.pools.length, 1);
  }
});

test("pool max zero rejected", () => {
  const built = harness(validEnv({ PUBLIC_FREE_QA_LIMITER_POOL_MAX: "0" }));
  assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies));
  assert.equal(built.pools.length, 0);
});

test("negative values rejected", () => {
  const built = harness(validEnv({ PUBLIC_FREE_QA_LIMITER_QUEUE_BOUND: "-1" }));
  assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies));
  assert.equal(built.pools.length, 0);
});

test("leading zeros rejected", () => {
  const built = harness(validEnv({ PUBLIC_FREE_QA_LIMITER_POOL_MAX: "01" }));
  assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies));
  assert.equal(built.pools.length, 0);
});

test("plus signs rejected", () => {
  const built = harness(validEnv({ PUBLIC_FREE_QA_LIMITER_POOL_MAX: "+1" }));
  assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies));
  assert.equal(built.pools.length, 0);
});

test("decimal and exponent forms rejected", () => {
  for (const value of ["1.5", "1e2", "2E1"]) {
    const built = harness(validEnv({ PUBLIC_FREE_QA_LIMITER_IDLE_TIMEOUT_MS: value }));
    assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies));
    assert.equal(built.pools.length, 0);
  }
});

test("unsafe integers rejected", () => {
  const built = harness(validEnv({
    PUBLIC_FREE_QA_LIMITER_POOL_MAX: "9007199254740993",
  }));
  assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies));
  assert.equal(built.pools.length, 0);
});

test("pool max plus queue overflow rejected", () => {
  const built = harness(validEnv({
    PUBLIC_FREE_QA_LIMITER_POOL_MAX: String(Number.MAX_SAFE_INTEGER),
    PUBLIC_FREE_QA_LIMITER_QUEUE_BOUND: "1",
  }));
  assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies));
  assert.equal(built.pools.length, 0);
});

test("connection timeout 100 accepted", () => {
  const built = harness(validEnv({ PUBLIC_FREE_QA_LIMITER_CONNECTION_TIMEOUT_MS: "100" }));
  createPublicFreeQaLimiterAssembly(built.dependencies);
  assert.equal(built.pools[0].options.connectionTimeoutMillis, 100);
});

test("connection timeout 101 rejected", () => {
  const built = harness(validEnv({ PUBLIC_FREE_QA_LIMITER_CONNECTION_TIMEOUT_MS: "101" }));
  assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies));
  assert.equal(built.pools.length, 0);
});

test("idle timeout zero rejected", () => {
  const built = harness(validEnv({ PUBLIC_FREE_QA_LIMITER_IDLE_TIMEOUT_MS: "0" }));
  assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies));
  assert.equal(built.pools.length, 0);
});

test("missing or empty URL rejected", () => {
  for (const value of [undefined, ""]) {
    const env = validEnv();
    if (value === undefined) delete env.PUBLIC_FREE_QA_LIMITER_DATABASE_URL;
    else env.PUBLIC_FREE_QA_LIMITER_DATABASE_URL = value;
    const built = harness(env);
    assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies));
    assert.equal(built.pools.length, 0);
  }
});

test("surrounding whitespace rejected", () => {
  const built = harness(validEnv({
    PUBLIC_FREE_QA_LIMITER_DATABASE_URL: ` ${SYNTHETIC_URL}`,
  }));
  assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies));
  assert.equal(built.pools.length, 0);
});

test("control characters rejected in the database URL", () => {
  const built = harness(validEnv({
    PUBLIC_FREE_QA_LIMITER_DATABASE_URL: `${SYNTHETIC_URL}\n`,
  }));
  assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies));
  assert.equal(built.pools.length, 0);
});

test("non-PostgreSQL scheme rejected", () => {
  const built = harness(validEnv({
    PUBLIC_FREE_QA_LIMITER_DATABASE_URL: "mysql://limiter:synthetic@db.invalid:3306/freeqa",
  }));
  assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies));
  assert.equal(built.pools.length, 0);
});

test("fragment rejected", () => {
  const built = harness(validEnv({
    PUBLIC_FREE_QA_LIMITER_DATABASE_URL: `${SYNTHETIC_URL}#fragment`,
  }));
  assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies));
  assert.equal(built.pools.length, 0);
});

test("locally evidenced TLS-weakening options rejected", () => {
  const options = [
    "ssl=0",
    "ssl=1",
    "ssl=true",
    "ssl=no-verify",
    "sslmode=disable",
    "sslmode=prefer",
    "sslmode=require",
    "sslmode=verify-ca",
    "sslmode=verify-full",
    "sslmode=no-verify",
    "sslcert=/tmp/cert.pem",
    "sslkey=/tmp/key.pem",
    "sslrootcert=/tmp/ca.pem",
    "sslnegotiation=direct",
    "uselibpqcompat=true",
    "application_name=override",
  ];
  for (const option of options) {
    const built = harness(validEnv({
      PUBLIC_FREE_QA_LIMITER_DATABASE_URL: `${SYNTHETIC_URL}?${option}`,
    }));
    assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies), option);
    assert.equal(built.pools.length, 0, option);
  }
});

test("pool receives exact max and timeout values", () => {
  const built = harness(validEnv({
    PUBLIC_FREE_QA_LIMITER_POOL_MAX: "3",
    PUBLIC_FREE_QA_LIMITER_QUEUE_BOUND: "4",
    PUBLIC_FREE_QA_LIMITER_CONNECTION_TIMEOUT_MS: "25",
    PUBLIC_FREE_QA_LIMITER_IDLE_TIMEOUT_MS: "9",
  }));
  createPublicFreeQaLimiterAssembly(built.dependencies);
  assert.equal(built.pools[0].options.max, 3);
  assert.equal(built.pools[0].options.connectionTimeoutMillis, 25);
  assert.equal(built.pools[0].options.idleTimeoutMillis, 9);
});

test("pool receives verified TLS settings", () => {
  const built = harness();
  createPublicFreeQaLimiterAssembly(built.dependencies);
  assert.deepEqual(built.pools[0].options.ssl, { rejectUnauthorized: true });
});

test("pool never receives rejectUnauthorized false", () => {
  const built = harness();
  createPublicFreeQaLimiterAssembly(built.dependencies);
  const serialized = JSON.stringify(built.pools[0].options);
  assert.equal(serialized.includes("false"), false);
  assert.equal(built.pools[0].options.ssl.rejectUnauthorized, true);
});

test("optional valid application name is passed", () => {
  const built = harness(validEnv({
    PUBLIC_FREE_QA_LIMITER_APPLICATION_NAME: "public-free-qa.v1",
  }));
  createPublicFreeQaLimiterAssembly(built.dependencies);
  assert.equal(built.pools[0].options.application_name, "public-free-qa.v1");
});

test("invalid or empty application name rejected", () => {
  for (const value of ["", "has space", "a/b", "x".repeat(65), "name\n"]) {
    const built = harness(validEnv({ PUBLIC_FREE_QA_LIMITER_APPLICATION_NAME: value }));
    assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies));
    assert.equal(built.pools.length, 0);
  }
});

test("pool receives no unknown user-controlled option", () => {
  const built = harness(validEnv({
    PUBLIC_FREE_QA_LIMITER_APPLICATION_NAME: "limiter",
  }));
  createPublicFreeQaLimiterAssembly(built.dependencies);
  assert.deepEqual(Object.keys(built.pools[0].options).sort(), [
    "application_name",
    "connectionString",
    "connectionTimeoutMillis",
    "idleTimeoutMillis",
    "max",
    "ssl",
  ]);
  assert.deepEqual(Object.keys(built.pools[0].options.ssl), ["rejectUnauthorized"]);
});

test("pool error listener registered exactly once", () => {
  const built = harness();
  createPublicFreeQaLimiterAssembly(built.dependencies);
  assert.equal(built.pools[0].listeners.length, 1);
});

test("pool error details do not reach logs, errors, or results", async () => {
  const calls: unknown[][] = [];
  const built = harness(validEnv(), {
    onPoolError(...args: unknown[]) {
      calls.push(args);
    },
  });
  const limiter = createPublicFreeQaLimiterAssembly(built.dependencies);
  const secret = new Error("postgres password leaked from pool");
  built.pools[0].emitError(secret);
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0], []);
  const result = await limiter.check({ headers: headers("203.0.113.8") });
  assert.equal(JSON.stringify(result).includes("password"), false);
});

test("pool is not ended per request", async () => {
  const built = harness();
  const limiter = createPublicFreeQaLimiterAssembly(built.dependencies);
  await limiter.check({ headers: headers("203.0.113.8") });
  assert.equal(built.pools[0].ends, 0);
});

test("pool does not connect during initialization", () => {
  const built = harness();
  createPublicFreeQaLimiterAssembly(built.dependencies);
  assert.equal(built.pools[0].connects, 0);
});

test("valid trusted IPv4 reaches the core and fake transport", async () => {
  const built = harness();
  const limiter = createPublicFreeQaLimiterAssembly(built.dependencies);
  const result = await limiter.check({ headers: headers("203.0.113.8") });
  assert.deepEqual(result, { kind: "accepted" });
  assert.equal(built.pools[0].connects, 1);
  assert.equal(built.pools[0].queries.some((query) => query.sql.includes("203.0.113.8")), false);
});

test("valid IPv6 /64 reaches the same canonical bucket behavior", async () => {
  const built = harness();
  const limiter = createPublicFreeQaLimiterAssembly(built.dependencies);
  const first = await limiter.check({ headers: headers("2001:db8:1:2:3:4:5:6") });
  const second = await limiter.check({ headers: headers("2001:db8:1:2:9:9:9:9") });
  assert.deepEqual(first, { kind: "accepted" });
  assert.deepEqual(second, { kind: "accepted" });
  const digests = built.pools[0].queries
    .filter((query) => query.sql.startsWith("SELECT"))
    .map((query) => Buffer.from(query.values?.[0] as Uint8Array).toString("hex"));
  assert.equal(digests.length, 2);
  assert.equal(digests[0], digests[1]);
});

test("IPv4-mapped IPv6 produces the same digest as dotted IPv4", async () => {
  async function digestFor(raw: string) {
    const built = harness();
    const limiter = createPublicFreeQaLimiterAssembly(built.dependencies);
    await limiter.check({ headers: headers(raw) });
    const select = built.pools[0].queries.find((query) => query.sql.startsWith("SELECT"));
    return Buffer.from(select?.values?.[0] as Uint8Array).toString("hex");
  }
  assert.equal(await digestFor("::ffff:203.0.113.8"), await digestFor("203.0.113.8"));
});

test("missing trusted header returns unavailable with zero checkout", async () => {
  const built = harness();
  const limiter = createPublicFreeQaLimiterAssembly(built.dependencies);
  const result = await limiter.check({ headers: headers(null) });
  assert.deepEqual(result, { kind: "unavailable", reason: "invalid_input" });
  assert.equal(built.pools[0].connects, 0);
});

test("x-forwarded-for alone returns unavailable with zero checkout", async () => {
  const built = harness();
  const limiter = createPublicFreeQaLimiterAssembly(built.dependencies);
  const result = await limiter.check({ headers: headers("203.0.113.8", "x-forwarded-for") });
  assert.deepEqual(result, { kind: "unavailable", reason: "invalid_input" });
  assert.equal(built.pools[0].connects, 0);
});

test("x-real-ip alone returns unavailable with zero checkout", async () => {
  const built = harness();
  const limiter = createPublicFreeQaLimiterAssembly(built.dependencies);
  const result = await limiter.check({ headers: headers("203.0.113.8", "x-real-ip") });
  assert.deepEqual(result, { kind: "unavailable", reason: "invalid_input" });
  assert.equal(built.pools[0].connects, 0);
});

test("malformed or chained trusted header returns unavailable with zero checkout", async () => {
  const built = harness();
  const limiter = createPublicFreeQaLimiterAssembly(built.dependencies);
  for (const value of ["not-an-ip", "203.0.113.8, 198.51.100.1", "203.0.113.8 "]) {
    const result = await limiter.check({ headers: headers(value) });
    assert.deepEqual(result, { kind: "unavailable", reason: "invalid_input" });
  }
  assert.equal(built.pools[0].connects, 0);
});

test("caller already aborted causes zero checkout", async () => {
  const built = harness();
  const limiter = createPublicFreeQaLimiterAssembly(built.dependencies);
  const result = await limiter.check({
    headers: headers("203.0.113.8"),
    signal: AbortSignal.abort(),
  });
  assert.deepEqual(result, { kind: "unavailable", reason: "cancelled" });
  assert.equal(built.pools[0].connects, 0);
});

test("accepted fake database decision propagates as accepted", async () => {
  const built = harness();
  const limiter = createPublicFreeQaLimiterAssembly(built.dependencies);
  built.pools[0].decision = "accepted";
  assert.deepEqual(await limiter.check({ headers: headers("203.0.113.8") }), { kind: "accepted" });
});

test("rejected fake database decision propagates as rejected", async () => {
  const built = harness();
  const limiter = createPublicFreeQaLimiterAssembly(built.dependencies);
  built.pools[0].decision = "rejected";
  assert.deepEqual(await limiter.check({ headers: headers("203.0.113.8") }), { kind: "rejected" });
});

test("transport failure propagates as unavailable", async () => {
  const built = harness();
  const limiter = createPublicFreeQaLimiterAssembly(built.dependencies);
  built.pools[0].failSql = "SELECT decision FROM abuse_control.decide_public_free_qa_attempt($1::bytea)";
  const result = await limiter.check({ headers: headers("203.0.113.8") });
  assert.deepEqual(result, { kind: "unavailable", reason: "transport_error" });
});

test("capacity failure propagates as unavailable", async () => {
  const built = harness(validEnv({
    PUBLIC_FREE_QA_LIMITER_POOL_MAX: "1",
    PUBLIC_FREE_QA_LIMITER_QUEUE_BOUND: "0",
  }));
  const limiter = createPublicFreeQaLimiterAssembly(built.dependencies);
  built.pools[0].hang = true;
  const first = limiter.check({ headers: headers("203.0.113.8") });
  const second = await limiter.check({ headers: headers("203.0.113.9") });
  assert.deepEqual(second, { kind: "unavailable", reason: "transport_error" });
  assert.equal(built.pools[0].connects, 1);
  void first;
});

test("raw address never appears in SQL arguments", async () => {
  const built = harness();
  const limiter = createPublicFreeQaLimiterAssembly(built.dependencies);
  await limiter.check({ headers: headers("203.0.113.8") });
  const blob = JSON.stringify(built.pools[0].queries);
  assert.equal(blob.includes("203.0.113.8"), false);
});

test("SQL receives only one copied 32-byte digest", async () => {
  const built = harness();
  const limiter = createPublicFreeQaLimiterAssembly(built.dependencies);
  await limiter.check({ headers: headers("203.0.113.8") });
  const selects = built.pools[0].queries.filter((query) => query.sql.startsWith("SELECT"));
  assert.equal(selects.length, 1);
  assert.equal(selects[0].values?.length, 1);
  const digest = selects[0].values?.[0];
  assert.ok(digest instanceof Uint8Array);
  assert.equal(digest.byteLength, 32);
});

test("no question text enters the pool or transport", async () => {
  const built = harness();
  const limiter = createPublicFreeQaLimiterAssembly(built.dependencies);
  await limiter.check({ headers: headers("203.0.113.8") });
  const blob = JSON.stringify(built.pools[0].queries);
  assert.equal(blob.toLowerCase().includes("question"), false);
});

test("multiple checks reuse one pool", async () => {
  const built = harness();
  const limiter = createPublicFreeQaLimiterAssembly(built.dependencies);
  await limiter.check({ headers: headers("203.0.113.8") });
  await limiter.check({ headers: headers("198.51.100.4") });
  assert.equal(built.pools.length, 1);
  assert.equal(built.pools[0].connects, 2);
});

test("concurrent checks do not construct another pool", async () => {
  const built = harness();
  const limiter = createPublicFreeQaLimiterAssembly(built.dependencies);
  await Promise.all([
    limiter.check({ headers: headers("203.0.113.8") }),
    limiter.check({ headers: headers("198.51.100.4") }),
  ]);
  assert.equal(built.pools.length, 1);
});

test("no retry occurs after a failed or ambiguous attempt", async () => {
  const built = harness();
  const limiter = createPublicFreeQaLimiterAssembly(built.dependencies);
  built.pools[0].failSql = "COMMIT";
  const result = await limiter.check({ headers: headers("203.0.113.8") });
  assert.equal(result.kind, "unavailable");
  const selects = built.pools[0].queries.filter((query) => query.sql.startsWith("SELECT"));
  assert.equal(selects.length, 1);
});

test("proxy dependency object rejected", () => {
  const built = harness();
  const proxy = new Proxy(built.dependencies, {});
  assert.throws(() => createPublicFreeQaLimiterAssembly(proxy), (error) => {
    assertConfigError(error);
    return true;
  });
});

test("revoked Proxy rejected", () => {
  const built = harness();
  const revocable = Proxy.revocable(built.dependencies, {});
  revocable.revoke();
  assert.throws(() => createPublicFreeQaLimiterAssembly(revocable.proxy), (error) => {
    assertConfigError(error);
    return true;
  });
});

test("symbol extra key rejected", () => {
  const built = harness();
  const extra = { ...built.dependencies, [Symbol("hidden")]: true };
  assert.throws(() => createPublicFreeQaLimiterAssembly(extra));
  assert.equal(built.pools.length, 0);
});

test("non-enumerable extra key rejected", () => {
  const built = harness();
  const extra = { ...built.dependencies };
  Object.defineProperty(extra, "hidden", { value: true, enumerable: false });
  assert.throws(() => createPublicFreeQaLimiterAssembly(extra));
  assert.equal(built.pools.length, 0);
});

test("getter-backed dependency rejected without invoking the getter", () => {
  let reads = 0;
  const target = harness().dependencies;
  Object.defineProperty(target, "readEnvironment", {
    get() {
      reads += 1;
      return () => KEY;
    },
    enumerable: true,
    configurable: true,
  });
  assert.throws(() => createPublicFreeQaLimiterAssembly(target));
  assert.equal(reads, 0);
});

test("exotic-prototype dependency rejected", () => {
  const built = harness();
  const exotic = Object.create(null);
  exotic.readEnvironment = built.dependencies.readEnvironment;
  exotic.createPool = built.dependencies.createPool;
  assert.throws(() => createPublicFreeQaLimiterAssembly(exotic));
  assert.equal(built.pools.length, 0);
});

test("fixed configuration error leaks no hostile value", () => {
  const hostile = "postgresql://user:super-secret@db.invalid/db?sslmode=disable";
  const built = harness(validEnv({ PUBLIC_FREE_QA_LIMITER_DATABASE_URL: hostile }));
  try {
    createPublicFreeQaLimiterAssembly(built.dependencies);
    assert.fail("expected throw");
  } catch (error) {
    assertConfigError(error, "super-secret");
    assert.equal(String(error).includes("prod.example"), false);
  }
});

test("no live DNS, socket, HTTP, or PostgreSQL connection occurs", async () => {
  let hits = 0;
  const originalLookup = dns.lookup;
  const originalConnect = net.Socket.prototype.connect;
  const originalHttp = http.request;
  const originalHttps = https.request;
  dns.lookup = ((...args: Parameters<typeof dns.lookup>) => {
    hits += 1;
    return originalLookup(...args);
  }) as typeof dns.lookup;
  net.Socket.prototype.connect = function patched(this: net.Socket, ...args: unknown[]) {
    hits += 1;
    return (originalConnect as (...inner: unknown[]) => net.Socket).apply(this, args);
  } as typeof net.Socket.prototype.connect;
  http.request = ((...args: Parameters<typeof http.request>) => {
    hits += 1;
    return originalHttp(...args);
  }) as typeof http.request;
  https.request = ((...args: Parameters<typeof https.request>) => {
    hits += 1;
    return originalHttps(...args);
  }) as typeof https.request;
  try {
    const built = harness();
    const limiter = createPublicFreeQaLimiterAssembly(built.dependencies);
    await limiter.check({ headers: headers("203.0.113.8") });
    assert.equal(hits, 0);
    assert.equal(built.pools[0].options.connectionString.endsWith(".invalid:5432/freeqa"), true);
  } finally {
    dns.lookup = originalLookup;
    net.Socket.prototype.connect = originalConnect;
    http.request = originalHttp;
    https.request = originalHttps;
  }
});

test("no module import performs a checkout", () => {
  assert.equal(typeof assembly.getPublicFreeQaLimiterAssembly, "function");
  assert.equal(checkoutsDuringImport, 0);
});

type Owned = {
  ends: number;
  connects: number;
  ons: number;
  connectThis: unknown;
  onThis: unknown;
  endThis: unknown;
  connect: () => Promise<FakeClient>;
  on: (event: string, listener: () => void) => void;
  end: () => unknown;
};

function bareClient(): FakeClient {
  return {
    on() {},
    removeListener() {},
    release() {},
    query() {
      return Promise.resolve({ command: "BEGIN", rows: [] });
    },
  };
}

function ownedPool(): Owned {
  const pool: Owned = {
    ends: 0,
    connects: 0,
    ons: 0,
    connectThis: undefined,
    onThis: undefined,
    endThis: undefined,
    connect() {
      pool.connects += 1;
      pool.connectThis = this;
      return Promise.resolve(bareClient());
    },
    on(event, listener) {
      pool.ons += 1;
      pool.onThis = this;
      void event;
      void listener;
    },
    end() {
      pool.ends += 1;
      pool.endThis = this;
      return undefined;
    },
  };
  return pool;
}

function withOwned(createPool: (options: PoolOptions) => unknown, extra: Record<string, unknown> = {}) {
  const built = harness(validEnv(), extra);
  built.dependencies.createPool = createPool as typeof built.dependencies.createPool;
  return built;
}

test("createPool synthetic secret becomes the fixed error", () => {
  const secret = new Error("POOL_CREATE_SECRET");
  const built = withOwned(() => {
    throw secret;
  });
  try {
    createPublicFreeQaLimiterAssembly(built.dependencies);
    assert.fail("expected throw");
  } catch (error) {
    assertConfigError(error, "POOL_CREATE_SECRET");
    assert.notEqual(error, secret);
  }
});

test("an error that reuses the fixed text does not escape", () => {
  const secret = new Error(CONFIGURATION_ERROR);
  Object.assign(secret, { marker: "ORIGINAL_ERROR_OBJECT" });
  const built = withOwned(() => {
    throw secret;
  });
  try {
    createPublicFreeQaLimiterAssembly(built.dependencies);
    assert.fail("expected throw");
  } catch (error) {
    assertConfigError(error, "ORIGINAL_ERROR_OBJECT");
    assert.notEqual(error, secret);
  }
});

test("pool on throw is normalized and ends once", () => {
  const pool = ownedPool();
  pool.on = () => {
    throw new Error("POOL_ON_SECRET");
  };
  const built = withOwned(() => pool);
  assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies), (error) => {
    assertConfigError(error, "POOL_ON_SECRET");
    return true;
  });
  assert.equal(pool.ends, 1);
});

test("pool on getter is not invoked and end runs once", () => {
  let reads = 0;
  const pool = ownedPool();
  Object.defineProperty(pool, "on", {
    get() {
      reads += 1;
      throw new Error("POOL_GETTER_SECRET");
    },
    configurable: true,
  });
  const built = withOwned(() => pool);
  assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies), (error) => {
    assertConfigError(error, "POOL_GETTER_SECRET");
    return true;
  });
  assert.equal(reads, 0);
  assert.equal(pool.ends, 1);
});

test("missing or non-function connect fails closed and ends once", () => {
  for (const connect of [undefined, 1]) {
    const pool = ownedPool();
    if (connect === undefined) delete (pool as { connect?: unknown }).connect;
    else pool.connect = connect as unknown as Owned["connect"];
    const built = withOwned(() => pool);
    assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies), (error) => {
      assertConfigError(error, "invalid_public_free_qa_limiter_transport_configuration");
      return true;
    });
    assert.equal(pool.ends, 1);
  }
});

test("accessor connect is not invoked and end runs once", () => {
  let reads = 0;
  const pool = ownedPool();
  Object.defineProperty(pool, "connect", {
    get() {
      reads += 1;
      throw new Error("CONNECT_GETTER_SECRET");
    },
    configurable: true,
  });
  const built = withOwned(() => pool);
  assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies));
  assert.equal(reads, 0);
  assert.equal(pool.ends, 1);
});

test("missing or non-function on fails closed and ends once", () => {
  for (const on of [undefined, "nope"]) {
    const pool = ownedPool();
    if (on === undefined) delete (pool as { on?: unknown }).on;
    else pool.on = on as unknown as Owned["on"];
    const built = withOwned(() => pool);
    assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies));
    assert.equal(pool.ends, 1);
  }
});

test("missing non-function or accessor end does not invoke an unsafe cleanup", () => {
  let reads = 0;
  const pool = ownedPool();
  delete (pool as { end?: unknown }).end;
  assert.throws(() => createPublicFreeQaLimiterAssembly(withOwned(() => pool).dependencies));
  const numeric = ownedPool();
  numeric.end = 4 as unknown as Owned["end"];
  assert.throws(() => createPublicFreeQaLimiterAssembly(withOwned(() => numeric).dependencies));
  assert.equal(numeric.ends, 0);
  const accessor = ownedPool();
  Object.defineProperty(accessor, "end", {
    get() {
      reads += 1;
      throw new Error("END_GETTER_SECRET");
    },
    configurable: true,
  });
  assert.throws(() => createPublicFreeQaLimiterAssembly(withOwned(() => accessor).dependencies), (error) => {
    assertConfigError(error, "END_GETTER_SECRET");
    return true;
  });
  assert.equal(reads, 0);
});

test("live and revoked pool proxies fail without cleanup traps", () => {
  let traps = 0;
  const live = new Proxy({}, {
    get() {
      traps += 1;
      throw new Error("PROXY_POOL_SECRET");
    },
  });
  assert.throws(() => createPublicFreeQaLimiterAssembly(withOwned(() => live).dependencies), (error) => {
    assertConfigError(error, "PROXY_POOL_SECRET");
    return true;
  });
  const revocable = Proxy.revocable({
    connect() { return Promise.resolve(bareClient()); },
    on() {},
    end() { traps += 1; },
  }, {});
  revocable.revoke();
  assert.throws(() => createPublicFreeQaLimiterAssembly(withOwned(() => revocable.proxy).dependencies), (error) => {
    assertConfigError(error);
    return true;
  });
  assert.equal(traps, 0);
});

test("missing connect is not described as transport construction and ends once", () => {
  const pool = ownedPool();
  const original = pool.connect;
  pool.connect = function connect(this: Owned) {
    return original.call(this);
  };
  Object.defineProperty(pool.connect, "prototype", { value: null });
  const built = withOwned(() => ({
    connect: pool.connect,
    on: pool.on,
    end() {
      pool.ends += 1;
      throw new Error("should-not-run-for-success");
    },
  }));
  const limiter = createPublicFreeQaLimiterAssembly(built.dependencies);
  assert.equal(typeof limiter.check, "function");
  const failing = ownedPool();
  delete (failing as { connect?: unknown }).connect;
  assert.throws(() => createPublicFreeQaLimiterAssembly(withOwned(() => failing).dependencies), (error) => {
    assertConfigError(error, "invalid_public_free_qa_limiter_transport_configuration");
    return true;
  });
  assert.equal(failing.ends, 1);
});

test("core factory throw ends the pool once and hides the marker", () => {
  const pool = ownedPool();
  const built = withOwned(() => pool, {
    createLimiterCore() {
      throw new Error("CORE_FACTORY_SECRET");
    },
  });
  assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies), (error) => {
    assertConfigError(error, "CORE_FACTORY_SECRET");
    return true;
  });
  assert.equal(pool.ends, 1);
});

test("invalid core results end the pool once", () => {
  const values = [null, 1, new Proxy({}, {}), []];
  for (const value of values) {
    const pool = ownedPool();
    const built = withOwned(() => pool, {
      createLimiterCore() {
        return value;
      },
    });
    assert.throws(() => createPublicFreeQaLimiterAssembly(built.dependencies));
    assert.equal(pool.ends, 1);
  }
  const revocable = Proxy.revocable({ check() { return { kind: "accepted" }; } }, {});
  revocable.revoke();
  const revokedPool = ownedPool();
  assert.throws(() => createPublicFreeQaLimiterAssembly(withOwned(() => revokedPool, {
    createLimiterCore() {
      return revocable.proxy;
    },
  }).dependencies));
  assert.equal(revokedPool.ends, 1);
});

test("accessor-backed core check is not invoked and ends once", () => {
  let reads = 0;
  const core = {};
  Object.defineProperty(core, "check", {
    get() {
      reads += 1;
      throw new Error("CORE_GETTER_SECRET");
    },
    configurable: true,
  });
  const pool = ownedPool();
  assert.throws(() => createPublicFreeQaLimiterAssembly(withOwned(() => pool, {
    createLimiterCore() {
      return core;
    },
  }).dependencies), (error) => {
    assertConfigError(error, "CORE_GETTER_SECRET");
    return true;
  });
  assert.equal(reads, 0);
  assert.equal(pool.ends, 1);
});

test("synchronous end throw is swallowed", () => {
  const pool = ownedPool();
  pool.on = () => {
    throw new Error("LISTENER_SECRET");
  };
  pool.end = () => {
    pool.ends += 1;
    throw new Error("END_SYNC_SECRET");
  };
  assert.throws(() => createPublicFreeQaLimiterAssembly(withOwned(() => pool).dependencies), (error) => {
    assertConfigError(error, "END_SYNC_SECRET");
    return true;
  });
  assert.equal(pool.ends, 1);
});

test("rejected end promise produces no unhandledRejection", async () => {
  const rejections: unknown[] = [];
  const onRejection = (reason: unknown) => {
    rejections.push(reason);
  };
  process.on("unhandledRejection", onRejection);
  try {
    const pool = ownedPool();
    pool.on = () => {
      throw new Error("LISTENER_SECRET");
    };
    pool.end = () => {
      pool.ends += 1;
      return Promise.reject(new Error("END_ASYNC_SECRET"));
    };
    assert.throws(() => createPublicFreeQaLimiterAssembly(withOwned(() => pool).dependencies), (error) => {
      assertConfigError(error, "END_ASYNC_SECRET");
      return true;
    });
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(pool.ends, 1);
    assert.equal(rejections.length, 0);
  } finally {
    process.removeListener("unhandledRejection", onRejection);
  }
});

test("successful initialization and checks do not call end", async () => {
  const built = harness();
  const limiter = createPublicFreeQaLimiterAssembly(built.dependencies);
  assert.equal(built.pools[0].ends, 0);
  await limiter.check({ headers: headers("203.0.113.8") });
  await limiter.check({ headers: headers("198.51.100.4") });
  assert.equal(built.pools[0].ends, 0);
});

test("failed singleton initialization is retried with a fresh pool", () => {
  let attempt = 0;
  const ended: number[] = [];
  const built = harness();
  built.dependencies.createPool = (() => {
    attempt += 1;
    const current = attempt;
    if (current === 1) {
      return {
        connect() { return Promise.resolve(bareClient()); },
        on() { throw new Error("FIRST_LISTENER_SECRET"); },
        end() { ended.push(current); },
      };
    }
    const pool = fakePool({
      connectionString: SYNTHETIC_URL,
      max: 2,
      connectionTimeoutMillis: 100,
      idleTimeoutMillis: 1000,
      ssl: { rejectUnauthorized: true },
    });
    built.pools.push(pool);
    return pool;
  }) as typeof built.dependencies.createPool;
  const singleton = createPublicFreeQaLimiterAssemblySingleton(built.dependencies);
  assert.throws(() => singleton.get(), (error) => {
    assertConfigError(error, "FIRST_LISTENER_SECRET");
    return true;
  });
  const first = singleton.get();
  const second = singleton.get();
  assert.equal(first, second);
  assert.deepEqual(ended, [1]);
  assert.equal(attempt, 2);
});

test("mutating pool methods after initialization keeps the snapshot", async () => {
  const pool = ownedPool();
  let replacement = 0;
  const built = withOwned(() => pool);
  const limiter = createPublicFreeQaLimiterAssembly(built.dependencies);
  pool.connect = () => {
    replacement += 1;
    return Promise.resolve(bareClient());
  };
  pool.on = () => {
    replacement += 1;
  };
  pool.end = () => {
    replacement += 1;
  };
  await limiter.check({ headers: headers("203.0.113.8") });
  assert.equal(replacement, 0);
  assert.equal(pool.connects, 1);
  assert.equal(pool.ends, 0);
});

test("mutating core check after initialization keeps the snapshot", async () => {
  let calls = 0;
  const core = {
    check() {
      calls += 1;
      return { kind: "accepted" as const };
    },
  };
  const built = withOwned(() => ownedPool(), {
    createLimiterCore() {
      return core;
    },
  });
  const limiter = createPublicFreeQaLimiterAssembly(built.dependencies);
  core.check = () => {
    throw new Error("MUTATED_CORE_SECRET");
  };
  assert.deepEqual(await limiter.check({ headers: headers("203.0.113.8") }), { kind: "accepted" });
  assert.equal(calls, 1);
});

test("snapshotted pool methods keep the original this", async () => {
  class PoolLike {
    connects = 0;
    ons = 0;
    ends = 0;
    connectThis: unknown;
    onThis: unknown;
    endThis: unknown;
    connect() {
      this.connects += 1;
      this.connectThis = this;
      return Promise.resolve(bareClient());
    }
    on() {
      this.ons += 1;
      this.onThis = this;
    }
    end() {
      this.ends += 1;
      this.endThis = this;
    }
  }
  const pool = new PoolLike();
  const limiter = createPublicFreeQaLimiterAssembly(withOwned(() => pool).dependencies);
  await limiter.check({ headers: headers("203.0.113.8") });
  assert.equal(pool.connectThis, pool);
  assert.equal(pool.onThis, pool);
  pool.on = () => {
    throw new Error("LATER");
  };
  const failing = new PoolLike();
  failing.on = function on(this: PoolLike) {
    this.onThis = this;
    throw new Error("ON_SECRET");
  };
  assert.throws(() => createPublicFreeQaLimiterAssembly(withOwned(() => failing).dependencies));
  assert.equal(failing.endThis, failing);
});

test("invalid outer requests return unavailable without checkout", async () => {
  let checks = 0;
  let gets = 0;
  const pool = ownedPool();
  const limiter = createPublicFreeQaLimiterAssembly(withOwned(() => pool, {
    createLimiterCore() {
      return {
        check() {
          checks += 1;
          return { kind: "accepted" };
        },
      };
    },
  }).dependencies);
  const cases: unknown[] = [
    null,
    "request",
    [],
    new Date(),
    Object.create(null),
    new (class Request {
      headers = headers("203.0.113.8");
    })(),
    new Proxy({ headers: headers("203.0.113.8") }, {}),
  ];
  const revocable = Proxy.revocable({ headers: headers("203.0.113.8") }, {
    get() {
      gets += 1;
      throw new Error("REQUEST_SECRET");
    },
  });
  revocable.revoke();
  cases.push(revocable.proxy);
  const getter = {};
  Object.defineProperty(getter, "headers", {
    get() {
      gets += 1;
      throw new Error("REQUEST_SECRET");
    },
    enumerable: true,
  });
  cases.push(getter);
  const extra = { headers: headers("203.0.113.8"), question: "secret question" };
  cases.push(extra);
  const hidden = { headers: headers("203.0.113.8") };
  Object.defineProperty(hidden, "hidden", { value: "REQUEST_SECRET", enumerable: false });
  cases.push(hidden);
  const symbolKeyed = { headers: headers("203.0.113.8"), [Symbol("extra")]: true };
  cases.push(symbolKeyed);
  const badSignal = { headers: headers("203.0.113.8"), signal: { aborted: true } };
  cases.push(badSignal);
  for (const input of cases) {
    let result: LimitResult | undefined;
    assert.doesNotThrow(() => {
      result = limiter.check(input) as unknown as LimitResult;
    });
    assert.ok(result instanceof Promise);
    assert.deepEqual(await result, { kind: "unavailable", reason: "invalid_input" });
  }
  assert.equal(checks, 0);
  assert.equal(pool.connects, 0);
  assert.equal(gets, 0);
});

test("core execution failures stay unavailable and do not leak markers", async () => {
  async function run(coreCheck: () => unknown) {
    const limiter = createPublicFreeQaLimiterAssembly(withOwned(() => ownedPool(), {
      createLimiterCore() {
        return { check: coreCheck };
      },
    }).dependencies);
    let result: LimitResult | undefined;
    assert.doesNotThrow(() => {
      result = limiter.check({ headers: headers("203.0.113.8") }) as unknown as LimitResult;
    });
    return result;
  }
  const thrown = await run(() => {
    throw new Error("CORE_SYNC_SECRET");
  });
  assert.deepEqual(thrown, { kind: "unavailable", reason: "transport_error" });
  assert.equal(JSON.stringify(thrown).includes("CORE_SYNC_SECRET"), false);
  const rejected = await run(() => Promise.reject(new Error("CORE_REJECT_SECRET")));
  assert.deepEqual(rejected, { kind: "unavailable", reason: "transport_error" });
  const thenable = await run(() => ({
    then() {
      throw new Error("THENABLE_SECRET");
    },
  }));
  assert.deepEqual(thenable, { kind: "unavailable", reason: "transport_error" });
  const malformed = await run(() => ({ kind: "accepted", question: "leak" }));
  assert.deepEqual(malformed, { kind: "unavailable", reason: "invalid_response" });
  assert.equal(JSON.stringify(malformed).includes("leak"), false);
});

test("recognized core envelopes pass through and late failure cannot replace them", async () => {
  const envelopes: LimitResult[] = [
    { kind: "accepted" },
    { kind: "rejected" },
    { kind: "unavailable", reason: "cancelled" },
    { kind: "unavailable", reason: "timeout" },
    { kind: "unavailable", reason: "transport_error" },
    { kind: "unavailable", reason: "invalid_response" },
  ];
  for (const envelope of envelopes) {
    const limiter = createPublicFreeQaLimiterAssembly(withOwned(() => ownedPool(), {
      createLimiterCore() {
        return { check: () => envelope };
      },
    }).dependencies);
    const result = await limiter.check({ headers: headers("203.0.113.8") });
    assert.deepEqual(result, envelope);
    (envelope as { kind: string }).kind = "mutated";
    assert.deepEqual(result, envelopes.includes(envelope) ? result : envelope);
    assert.notEqual((result as { kind: string }).kind, "mutated");
  }
  let settle: ((value: LimitResult) => void) | undefined;
  let fail: ((reason: unknown) => void) | undefined;
  const limiter = createPublicFreeQaLimiterAssembly(withOwned(() => ownedPool(), {
    createLimiterCore() {
      return {
        check() {
          return new Promise((resolve, reject) => {
            settle = resolve;
            fail = reject;
          });
        },
      };
    },
  }).dependencies);
  const pending = limiter.check({ headers: headers("203.0.113.8") });
  settle?.({ kind: "accepted" });
  await Promise.resolve();
  fail?.(new Error("LATE_SECRET"));
  assert.deepEqual(await pending, { kind: "accepted" });
});

test("a frozen exact request remains valid", async () => {
  const built = harness();
  const limiter = createPublicFreeQaLimiterAssembly(built.dependencies);
  const request = Object.freeze({ headers: headers("203.0.113.8") });
  assert.deepEqual(await limiter.check(request), { kind: "accepted" });
});

function runFix2Child(mode: string) {
  return spawnSync(process.execPath, [
    "--experimental-strip-types",
    fileURLToPath(import.meta.url),
  ], {
    env: { ...process.env, ASSEMBLY_FIX2_CHILD: mode },
    encoding: "utf8",
  });
}

if (process.env.ASSEMBLY_FIX2_CHILD === "pollution") {
  const names = ["connect", "on", "end", "check"] as const;
  const saved = new Map<string, PropertyDescriptor | undefined>();
  for (const name of names) saved.set(name, Object.getOwnPropertyDescriptor(Object.prototype, name));
  let failures = 0;
  const mark = (label: string, accepted: boolean) => {
    console.log(`${label}=${accepted}`);
    if (accepted) failures += 1;
  };
  try {
    Object.defineProperty(Object.prototype, "connect", { value: function connect() { return Promise.resolve({}); }, configurable: true });
    try {
      createPublicFreeQaLimiterAssembly(withOwned(() => ({ on() {}, end() {} })).dependencies);
      mark("POLLUTED_CONNECT_ACCEPTED", true);
    } catch {
      mark("POLLUTED_CONNECT_ACCEPTED", false);
    }
    delete (Object.prototype as { connect?: unknown }).connect;
    Object.defineProperty(Object.prototype, "on", { value: function on() {}, configurable: true });
    try {
      createPublicFreeQaLimiterAssembly(withOwned(() => ({
        connect() { return Promise.resolve({}); },
        end() {},
      })).dependencies);
      mark("POLLUTED_ON_ACCEPTED", true);
    } catch {
      mark("POLLUTED_ON_ACCEPTED", false);
    }
    delete (Object.prototype as { on?: unknown }).on;
    let pollutedEnds = 0;
    Object.defineProperty(Object.prototype, "end", { value: function end() { pollutedEnds += 1; }, configurable: true });
    try {
      createPublicFreeQaLimiterAssembly(withOwned(() => ({
        connect() { return Promise.resolve({}); },
        on() {},
      })).dependencies);
      mark("POLLUTED_END_ACCEPTED", true);
    } catch {
      mark("POLLUTED_END_ACCEPTED", false);
    }
    console.log(`POLLUTED_END_CALLS=${pollutedEnds}`);
    if (pollutedEnds !== 0) failures += 1;
    delete (Object.prototype as { end?: unknown }).end;
    Object.defineProperty(Object.prototype, "check", { value: function check() { return { kind: "accepted" }; }, configurable: true });
    try {
      createPublicFreeQaLimiterAssembly(withOwned(() => ownedPool(), {
        createLimiterCore() { return {}; },
      }).dependencies);
      mark("POLLUTED_CHECK_ACCEPTED", true);
    } catch {
      mark("POLLUTED_CHECK_ACCEPTED", false);
    }
  } finally {
    for (const name of names) {
      const descriptor = saved.get(name);
      if (descriptor) Object.defineProperty(Object.prototype, name, descriptor);
      else delete (Object.prototype as Record<string, unknown>)[name];
    }
  }
  process.exit(failures === 0 ? 0 : 1);
}

if (process.env.ASSEMBLY_FIX2_CHILD === "realm") {
  const vm = await import("node:vm");
  const rejections: string[] = [];
  process.on("unhandledRejection", (reason) => {
    rejections.push(reason instanceof Error ? reason.message : String(reason));
  });
  const foreign = vm.runInContext(
    "Promise.reject(new Error('FOREIGN_REJECTION'))",
    vm.createContext({}),
  ) as Promise<unknown>;
  console.log(`FOREIGN_INSTANCEOF=${foreign instanceof Promise}`);
  class RejectingPromise extends Promise<unknown> {}
  const cases: Array<{ label: string; end: () => unknown }> = [
    { label: "foreign", end: () => foreign },
    { label: "native", end: () => Promise.reject(new Error("NATIVE_REJECTION")) },
    { label: "subclass", end: () => RejectingPromise.reject(new Error("SUBCLASS_REJECTION")) },
    { label: "thenable", end: () => ({ then(_resolve: unknown, reject: (reason: unknown) => void) { reject(new Error("THENABLE_REJECTION")); } }) },
    { label: "throwing-then", end: () => { const box = {}; Object.defineProperty(box, "then", { get() { throw new Error("THEN_GETTER"); } }); return box; } },
    { label: "reject-then-throw", end: () => ({ then(_resolve: unknown, reject: (reason: unknown) => void) { reject(new Error("LATE_REJECT")); throw new Error("THEN_THROW"); } }) },
    { label: "sync-throw", end: () => { throw new Error("END_SYNC"); } },
    { label: "non-promise", end: () => undefined },
  ];
  for (const item of cases) {
    const before = rejections.length;
    const pool = ownedPool();
    pool.on = () => { throw new Error("LISTENER_FAIL"); };
    pool.end = () => {
      pool.ends += 1;
      pool.endThis = pool;
      return item.end();
    };
    try {
      createPublicFreeQaLimiterAssembly(withOwned(() => pool).dependencies);
      console.log(`${item.label}=NO_THROW`);
      process.exit(1);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message !== CONFIGURATION_ERROR || message.includes("FOREIGN") || message.includes("THENABLE") || message.includes("THEN_")) {
        console.log(`${item.label}=LEAK ${message}`);
        process.exit(1);
      }
    }
    await new Promise((resolve) => setImmediate(resolve));
    console.log(`${item.label}=ENDS ${pool.ends} THIS ${pool.endThis === pool} NEW_REJECTIONS ${rejections.length - before}`);
    if (pool.ends !== 1 || pool.endThis !== pool || rejections.length !== before) process.exit(1);
  }
  process.exit(0);
}

test("Object.prototype pollution cannot supply pool or core methods", () => {
  const result = runFix2Child("pollution");
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /POLLUTED_CONNECT_ACCEPTED=false/);
  assert.match(result.stdout, /POLLUTED_ON_ACCEPTED=false/);
  assert.match(result.stdout, /POLLUTED_END_ACCEPTED=false/);
  assert.match(result.stdout, /POLLUTED_END_CALLS=0/);
  assert.match(result.stdout, /POLLUTED_CHECK_ACCEPTED=false/);
});

test("cross-realm and thenable cleanup rejections stay handled", () => {
  const result = runFix2Child("realm");
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /FOREIGN_INSTANCEOF=false/);
  for (const label of ["foreign", "native", "subclass", "thenable", "throwing-then", "reject-then-throw", "sync-throw", "non-promise"]) {
    assert.match(result.stdout, new RegExp(`${label}=ENDS 1 THIS true NEW_REJECTIONS 0`));
  }
});

test("genuine and forged signals follow the AbortSignal brand", async () => {
  let checks = 0;
  let connects = 0;
  const seen: unknown[] = [];
  const limiter = createPublicFreeQaLimiterAssembly(withOwned(() => {
    const pool = ownedPool();
    const original = pool.connect;
    pool.connect = function connect(this: Owned) {
      connects += 1;
      return original.call(this);
    };
    return pool;
  }, {
    createLimiterCore() {
      return {
        check(input: { signal?: AbortSignal }) {
          checks += 1;
          seen.push(input.signal);
          return { kind: "accepted" };
        },
      };
    },
  }).dependencies);
  const active = new AbortController().signal;
  assert.deepEqual(await limiter.check({ headers: headers("203.0.113.8"), signal: active }), { kind: "accepted" });
  assert.equal(seen[0], active);
  const aborted = AbortSignal.abort();
  assert.deepEqual(await limiter.check({ headers: headers("203.0.113.8"), signal: aborted }), { kind: "accepted" });
  assert.equal(seen[1], aborted);
  const checksBefore = checks;
  const connectsBefore = connects;
  let getterReads = 0;
  let proxyReads = 0;
  const fake = {};
  Object.defineProperty(fake, "aborted", { get() { getterReads += 1; return false; } });
  const cases: unknown[] = [
    Object.create(AbortSignal.prototype),
    new Proxy(new AbortController().signal, { get() { proxyReads += 1; return false; } }),
    (() => { const box = Proxy.revocable(new AbortController().signal, { get() { proxyReads += 1; throw new Error("SIGNAL_SECRET"); } }); box.revoke(); return box.proxy; })(),
    { aborted: false, addEventListener() {}, removeEventListener() {} },
    fake,
  ];
  for (const signal of cases) {
    let result: Promise<LimitResult> | undefined;
    assert.doesNotThrow(() => {
      result = limiter.check({ headers: headers("203.0.113.8"), signal }) as Promise<LimitResult>;
    });
    assert.deepEqual(await result, { kind: "unavailable", reason: "invalid_input" });
    assert.equal(JSON.stringify(result).includes("SIGNAL_SECRET"), false);
  }
  assert.equal(checks, checksBefore);
  assert.equal(connects, connectsBefore);
  assert.equal(getterReads, 0);
  assert.equal(proxyReads, 0);
});

test("inherited EventEmitter on and later mutation keep the snapshot", async () => {
  const pool = Object.assign(Object.create(EventEmitter.prototype), {
    connects: 0,
    ends: 0,
    connect(this: { connects: number }) {
      this.connects += 1;
      return Promise.resolve(bareClient());
    },
    end(this: { ends: number }) {
      this.ends += 1;
    },
  });
  const limiter = createPublicFreeQaLimiterAssembly(withOwned(() => pool).dependencies);
  await limiter.check({ headers: headers("203.0.113.8") });
  assert.equal(pool.connects, 1);
  pool.on = () => { throw new Error("MUTATED_ON"); };
  await limiter.check({ headers: headers("198.51.100.4") });
  assert.equal(pool.connects, 2);
  assert.equal(pool.ends, 0);
});

test("injected transport factory failures end the pool once", () => {
  for (const factory of [
    () => { throw new Error("TRANSPORT_FACTORY_SECRET"); },
    () => null,
    () => "not-a-function",
  ]) {
    const pool = ownedPool();
    assert.throws(() => createPublicFreeQaLimiterAssembly(withOwned(() => pool, {
      createTransport: factory,
    }).dependencies), (error) => {
      assertConfigError(error, "TRANSPORT_FACTORY_SECRET");
      assertConfigError(error, "not-a-function");
      return true;
    });
    assert.equal(pool.ends, 1);
  }
});

test("an injected transport factory can return the real transport", async () => {
  const transportModule = await import("./public-free-qa-limiter-transport") as {
    createPublicFreeQaLimiterTransport(options: unknown): unknown;
  };
  const built = harness();
  const dependencies = built.dependencies as Record<string, unknown>;
  dependencies.createTransport = (options: unknown) => {
    return transportModule.createPublicFreeQaLimiterTransport(options);
  };
  const limiter = createPublicFreeQaLimiterAssembly(built.dependencies);
  assert.deepEqual(await limiter.check({ headers: headers("203.0.113.8") }), { kind: "accepted" });
  assert.equal(built.pools.length, 1);
  assert.equal(built.pools[0].queries.some((query) => query.sql.includes("decide_public_free_qa_attempt")), true);
});

test("omitted createTransport uses the committed transport and the production accessor stays uninjected", async () => {
  const built = harness();
  const limiter = createPublicFreeQaLimiterAssembly(built.dependencies);
  await limiter.check({ headers: headers("203.0.113.8") });
  assert.equal(built.pools[0].queries.some((query) => query.sql.includes("decide_public_free_qa_attempt")), true);
  assert.equal(typeof assembly.getPublicFreeQaLimiterAssembly, "function");
  assert.equal(assembly.getPublicFreeQaLimiterAssembly.length, 0);
});

function runFix3Child(mode: string) {
  return spawnSync(process.execPath, [
    "--experimental-strip-types",
    fileURLToPath(import.meta.url),
  ], {
    env: { ...process.env, ASSEMBLY_FIX3_CHILD: mode },
    encoding: "utf8",
  });
}

if (process.env.ASSEMBLY_FIX3_CHILD === "cleanup") {
  const vm = await import("node:vm");
  const rejections: string[] = [];
  process.on("unhandledRejection", (reason) => {
    rejections.push(reason instanceof Error ? reason.message : String(reason));
  });
  const foreignRealm = vm.createContext({});
  class SubPromise extends Promise<unknown> {}
  const chain = (count: number): unknown => {
    if (count === 0) return Promise.reject(new Error("CHAIN_REJECT"));
    return { then() { return chain(count - 1); } };
  };
  const self: { then?: () => unknown } = {};
  self.then = () => self;
  const left: { then?: () => unknown } = {};
  const right: { then?: () => unknown } = {};
  left.then = () => right;
  right.then = () => left;
  const cases: Array<{ label: string; end: () => unknown }> = [
    { label: "returned-native", end: () => ({ then() { return Promise.reject(new Error("RETURNED_PROMISE_REJECTION")); } }) },
    { label: "returned-foreign", end: () => ({ then() { return vm.runInContext("Promise.reject(new Error('FOREIGN_RETURN'))", foreignRealm); } }) },
    { label: "self", end: () => self },
    { label: "mutual", end: () => left },
    { label: "chain", end: () => chain(4) },
    { label: "throwing-then", end: () => { const box = {}; Object.defineProperty(box, "then", { get() { throw new Error("THEN_GETTER"); } }); return box; } },
    { label: "reject-then-throw", end: () => ({ then(_a: unknown, reject: (reason: unknown) => void) { reject(new Error("LATE")); throw new Error("THEN_THROW"); } }) },
    { label: "native", end: () => Promise.reject(new Error("NATIVE_REJECTION")) },
    { label: "foreign", end: () => vm.runInContext("Promise.reject(new Error('FOREIGN_REJECTION'))", vm.createContext({})) },
    { label: "subclass", end: () => SubPromise.reject(new Error("SUBCLASS_REJECTION")) },
    { label: "non-promise", end: () => undefined },
  ];
  for (const item of cases) {
    const before = rejections.length;
    const pool = ownedPool();
    pool.on = () => { throw new Error("LISTENER_FAIL"); };
    pool.end = () => {
      pool.ends += 1;
      pool.endThis = pool;
      return item.end();
    };
    try {
      createPublicFreeQaLimiterAssembly(withOwned(() => pool).dependencies);
      console.log(`${item.label}=NO_THROW`);
      process.exit(1);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message !== CONFIGURATION_ERROR) {
        console.log(`${item.label}=LEAK`);
        process.exit(1);
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 20));
    console.log(`${item.label}=ENDS ${pool.ends} THIS ${pool.endThis === pool} NEW ${rejections.length - before}`);
    if (pool.ends !== 1 || pool.endThis !== pool || rejections.length !== before) process.exit(1);
  }
  process.exit(0);
}

if (process.env.ASSEMBLY_FIX3_CHILD === "foreign") {
  const vm = await import("node:vm");
  const context = vm.createContext({});
  const foreignRoot = vm.runInContext("Object.prototype", context);
  console.log(`ROOT_DIFFERS=${foreignRoot !== Object.prototype}`);
  vm.runInContext(`
    Object.prototype.check = function check() { return { kind: "accepted" }; };
    Object.prototype.connect = function connect() { return Promise.resolve({}); };
    Object.prototype.on = function on() {};
    Object.prototype.end = function end() {};
  `, context);
  const attempts: Array<{ label: string; run: () => void }> = [
    { label: "check", run: () => createPublicFreeQaLimiterAssembly(withOwned(() => ownedPool(), { createLimiterCore() { return vm.runInContext("({})", context); } }).dependencies) },
    { label: "connect", run: () => createPublicFreeQaLimiterAssembly(withOwned(() => vm.runInContext("({ on() {}, end() {} })", context)).dependencies) },
    { label: "on", run: () => createPublicFreeQaLimiterAssembly(withOwned(() => vm.runInContext("({ connect() { return Promise.resolve({}); }, end() {} })", context)).dependencies) },
    { label: "end", run: () => createPublicFreeQaLimiterAssembly(withOwned(() => vm.runInContext("({ connect() { return Promise.resolve({}); }, on() {} })", context)).dependencies) },
  ];
  for (const attempt of attempts) {
    let accepted = false;
    try { attempt.run(); accepted = true; } catch { accepted = false; }
    console.log(`FOREIGN_${attempt.label}=${accepted}`);
    if (accepted) process.exit(1);
  }
  try {
    createPublicFreeQaLimiterAssembly(withOwned(() => vm.runInContext(
      "({ connect() { return Promise.resolve({}); }, on() {}, end() {} })",
      context,
    )).dependencies);
    console.log("FOREIGN_OWN=accepted");
  } catch {
    console.log("FOREIGN_OWN=rejected");
    process.exit(1);
  }
  process.exit(0);
}

if (process.env.ASSEMBLY_FIX3_CHILD === "intrinsic") {
  const original = Object.getOwnPropertyDescriptor(AbortSignal.prototype, "aborted");
  let checks = 0;
  const limiter = createPublicFreeQaLimiterAssembly(withOwned(() => ownedPool(), {
    createLimiterCore() {
      return { check() { checks += 1; return { kind: "accepted" }; } };
    },
  }).dependencies);
  const requestHeaders = headers("203.0.113.8");
  try {
    Object.defineProperty(AbortSignal.prototype, "aborted", {
      configurable: true,
      get() { return false; },
    });
    const genuine = await limiter.check({ headers: requestHeaders, signal: new AbortController().signal });
    const forged = await limiter.check({ headers: requestHeaders, signal: Object.create(AbortSignal.prototype) });
    console.log(`GENUINE=${JSON.stringify(genuine)}`);
    console.log(`FORGED=${JSON.stringify(forged)} CHECKS_AFTER_FORGED=${checks}`);
    Reflect.deleteProperty(AbortSignal.prototype, "aborted");
    const genuineAfterDelete = await limiter.check({ headers: requestHeaders, signal: AbortSignal.abort() });
    const forgedAfterDelete = await limiter.check({ headers: requestHeaders, signal: Object.create(AbortSignal.prototype) });
    console.log(`GENUINE_DELETED=${JSON.stringify(genuineAfterDelete)}`);
    console.log(`FORGED_DELETED=${JSON.stringify(forgedAfterDelete)}`);
    const unavailable = "{\"kind\":\"unavailable\",\"reason\":\"invalid_input\"}";
    if (genuine.kind !== "accepted" || genuineAfterDelete.kind !== "accepted") process.exitCode = 1;
    else if (JSON.stringify(forged) !== unavailable || JSON.stringify(forgedAfterDelete) !== unavailable) process.exitCode = 1;
    else if (checks !== 2) process.exitCode = 1;
    else process.exitCode = 0;
  } finally {
    if (original) Object.defineProperty(AbortSignal.prototype, "aborted", original);
  }
  process.exit(process.exitCode ?? 1);
}

test("a null-prototype pool or core fails closed", () => {
  const nullPool = Object.assign(Object.create(null), {
    connect() { return Promise.resolve({}); },
    on() {},
    end() {},
  }) as { end: () => void };
  assert.throws(() => createPublicFreeQaLimiterAssembly(withOwned(() => nullPool).dependencies), (error) => {
    assertConfigError(error, "NULL_POOL");
    return true;
  });
  const pool = ownedPool();
  assert.throws(() => createPublicFreeQaLimiterAssembly(withOwned(() => pool, {
    createLimiterCore() {
      return Object.assign(Object.create(null), {
        check() { return { kind: "accepted" }; },
      });
    },
  }).dependencies), (error) => {
    assertConfigError(error, "NULL_CORE");
    return true;
  });
  assert.equal(pool.ends, 1);
});

test("cleanup owns a Promise returned by hostile then", () => {
  const result = runFix3Child("cleanup");
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  for (const label of ["returned-native", "returned-foreign", "self", "mutual", "chain", "throwing-then", "reject-then-throw", "native", "foreign", "subclass", "non-promise"]) {
    assert.match(result.stdout, new RegExp(`${label}=ENDS 1 THIS true NEW 0`));
  }
});

test("foreign prototype roots cannot supply limiter methods", () => {
  const result = runFix3Child("foreign");
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /ROOT_DIFFERS=true/);
  for (const name of ["check", "connect", "on", "end"]) {
    assert.match(result.stdout, new RegExp(`FOREIGN_${name}=false`));
  }
  assert.match(result.stdout, /FOREIGN_OWN=accepted/);
});

function runFix4Child(mode: string) {
  return spawnSync(process.execPath, [
    "--experimental-strip-types",
    fileURLToPath(import.meta.url),
  ], {
    env: { ...process.env, ASSEMBLY_FIX4_CHILD: mode },
    encoding: "utf8",
  });
}

if (process.env.ASSEMBLY_FIX4_CHILD === "boundary") {
  const vm = await import("node:vm");
  const rejections: string[] = [];
  process.on("unhandledRejection", (reason) => {
    rejections.push(reason instanceof Error ? reason.message : String(reason));
  });
  const foreignRealm = vm.createContext({});
  const fail = (pool: Owned, value: unknown) => {
    const before = rejections.length;
    const poolEnd = pool;
    poolEnd.on = () => { throw new Error("LISTENER_FAIL"); };
    poolEnd.end = () => {
      poolEnd.ends += 1;
      poolEnd.endThis = poolEnd;
      return value;
    };
    try {
      createPublicFreeQaLimiterAssembly(withOwned(() => poolEnd).dependencies);
      console.log("NO_THROW");
      process.exit(1);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message !== CONFIGURATION_ERROR) {
        console.log("LEAK");
        process.exit(1);
      }
    }
    return before;
  };
  const genericChain = (count: number, tail: () => unknown, calls: { n: number }) => {
    const step = (left: number): unknown => {
      if (left === 0) return tail();
      return {
        then() {
          calls.n += 1;
          return step(left - 1);
        },
      };
    };
    return step(count);
  };
  const nativeCalls = { n: 0 };
  const nativePool = ownedPool();
  const nativeBefore = fail(nativePool, genericChain(8, () => Promise.reject(new Error("BOUNDARY_REJECTION")), nativeCalls));
  await new Promise((resolve) => setTimeout(resolve, 30));
  console.log(`NATIVE CALLS ${nativeCalls.n} ENDS ${nativePool.ends} THIS ${nativePool.endThis === nativePool} NEW ${rejections.length - nativeBefore}`);
  const foreignCalls = { n: 0 };
  const foreignPool = ownedPool();
  const foreignBefore = fail(foreignPool, genericChain(8, () => vm.runInContext("Promise.reject(new Error('FOREIGN_BOUNDARY'))", foreignRealm), foreignCalls));
  await new Promise((resolve) => setTimeout(resolve, 30));
  console.log(`FOREIGN CALLS ${foreignCalls.n} ENDS ${foreignPool.ends} THIS ${foreignPool.endThis === foreignPool} NEW ${rejections.length - foreignBefore}`);
  let ninthReads = 0;
  let ninthCalls = 0;
  const ninth = {};
  Object.defineProperty(ninth, "then", {
    get() {
      ninthReads += 1;
      return () => {
        ninthCalls += 1;
        return Promise.reject(new Error("NINTH_REJECTION"));
      };
    },
  });
  const beyondCalls = { n: 0 };
  const beyondPool = ownedPool();
  const beyondBefore = fail(beyondPool, genericChain(8, () => ninth, beyondCalls));
  await new Promise((resolve) => setTimeout(resolve, 30));
  console.log(`BEYOND CALLS ${beyondCalls.n} READS ${ninthReads} NINTH ${ninthCalls} NEW ${rejections.length - beyondBefore}`);
  const selfCalls = { n: 0 };
  const self: { then?: () => unknown } = {};
  self.then = () => {
    selfCalls.n += 1;
    return self;
  };
  const selfPool = ownedPool();
  const selfBefore = fail(selfPool, self);
  const leftCalls = { n: 0 };
  const rightCalls = { n: 0 };
  const left: { then?: () => unknown } = {};
  const right: { then?: () => unknown } = {};
  left.then = () => {
    leftCalls.n += 1;
    return right;
  };
  right.then = () => {
    rightCalls.n += 1;
    return left;
  };
  const cyclePool = ownedPool();
  const cycleBefore = fail(cyclePool, left);
  await new Promise((resolve) => setTimeout(resolve, 30));
  console.log(`SELF CALLS ${selfCalls.n} NEW ${rejections.length - selfBefore}`);
  console.log(`CYCLE CALLS ${leftCalls.n + rightCalls.n} NEW ${rejections.length - cycleBefore}`);
  if (nativeCalls.n !== 8 || foreignCalls.n !== 8 || beyondCalls.n !== 8) process.exit(1);
  if (ninthReads !== 0 || ninthCalls !== 0) process.exit(1);
  if (selfCalls.n > 8 || leftCalls.n + rightCalls.n > 8) process.exit(1);
  if (rejections.length !== 0) process.exit(1);
  if (nativePool.ends !== 1 || nativePool.endThis !== nativePool) process.exit(1);
  if (foreignPool.ends !== 1 || foreignPool.endThis !== foreignPool) process.exit(1);
  process.exit(0);
}

test("eight generic thenables still deliver their returned Promise to an owner", () => {
  const result = runFix4Child("boundary");
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /NATIVE CALLS 8 ENDS 1 THIS true NEW 0/);
  assert.match(result.stdout, /FOREIGN CALLS 8 ENDS 1 THIS true NEW 0/);
  assert.match(result.stdout, /BEYOND CALLS 8 READS 0 NINTH 0 NEW 0/);
  assert.match(result.stdout, /SELF CALLS 1 NEW 0/);
  assert.match(result.stdout, /CYCLE CALLS 2 NEW 0/);
});

test("AbortSignal brand uses the getter captured at load", () => {
  const result = runFix3Child("intrinsic");
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /GENUINE=\{"kind":"accepted"\}/);
  assert.match(result.stdout, /FORGED=\{"kind":"unavailable","reason":"invalid_input"\}/);
  assert.match(result.stdout, /CHECKS_AFTER_FORGED=1/);
  assert.match(result.stdout, /GENUINE_DELETED=\{"kind":"accepted"\}/);
  assert.match(result.stdout, /FORGED_DELETED=\{"kind":"unavailable","reason":"invalid_input"\}/);
});
