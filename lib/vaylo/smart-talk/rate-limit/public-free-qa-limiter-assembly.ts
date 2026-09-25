import "server-only";
import { types } from "node:util";
import { Pool } from "pg";
import {
  createPublicFreeQaLimiterCore,
  type PublicFreeQaLimitResult,
} from "./public-free-qa-limiter-core";
import {
  createPublicFreeQaLimiterTransport,
  type PublicFreeQaLimiterPool,
} from "./public-free-qa-limiter-transport";
import {
  createPublicFreeQaTrustedAddressResolver,
  type TrustedAddressHeaders,
} from "./public-free-qa-trusted-address";

/**
 * Server-only assembly of the public Free-QA limiter.
 *
 * This module is not wired into the Smart Talk route. Constructing it does
 * not check out a connection. The activation literal is an internal boundary
 * and does not prove deployment evidence. vercel_v1 production activation
 * remains blocked.
 *
 * The production accessor is getPublicFreeQaLimiterAssembly(). Tests use
 * createPublicFreeQaLimiterAssembly() and
 * createPublicFreeQaLimiterAssemblySingleton() so they can inject an
 * environment reader and a pool factory without reading process.env.
 * createLimiterCore is optional and exists so a test can observe key
 * zeroization; the production accessor does not pass it.
 */

const CONFIGURATION_ERROR = "invalid_public_free_qa_limiter_configuration";

const HMAC_KEY_NAME = "PUBLIC_FREE_QA_LIMITER_HMAC_KEY";
const DATABASE_URL_NAME = "PUBLIC_FREE_QA_LIMITER_DATABASE_URL";
const POOL_MAX_NAME = "PUBLIC_FREE_QA_LIMITER_POOL_MAX";
const QUEUE_BOUND_NAME = "PUBLIC_FREE_QA_LIMITER_QUEUE_BOUND";
const CONNECTION_TIMEOUT_NAME = "PUBLIC_FREE_QA_LIMITER_CONNECTION_TIMEOUT_MS";
const IDLE_TIMEOUT_NAME = "PUBLIC_FREE_QA_LIMITER_IDLE_TIMEOUT_MS";
const APPLICATION_NAME_NAME = "PUBLIC_FREE_QA_LIMITER_APPLICATION_NAME";

const CANONICAL_BASE64_32 = /^[A-Za-z0-9+/]{43}=$/;
const APPLICATION_NAME_TOKEN = /^[A-Za-z0-9._-]{1,64}$/;

/**
 * Query keys that installed pg 8.22.0 / pg-connection-string 2.14.0 copy onto
 * the client config and that can replace an explicit ssl object. See
 * connection-parameters.js Object.assign({}, config, parse(connectionString)).
 * application_name is included because that same assign replaces the explicit
 * application_name. These names are rejected. They are not stripped.
 */
const BLOCKED_URL_QUERY_KEYS = new Set([
  "ssl",
  "sslmode",
  "sslcert",
  "sslkey",
  "sslrootcert",
  "sslnegotiation",
  "uselibpqcompat",
  "application_name",
]);

const REQUIRED_DEPENDENCY_KEYS = ["readEnvironment", "createPool"] as const;
const OPTIONAL_DEPENDENCY_KEYS = ["onPoolError", "createLimiterCore", "createTransport"] as const;
const ALLOWED_DEPENDENCY_KEYS = new Set<string>([
  ...REQUIRED_DEPENDENCY_KEYS,
  ...OPTIONAL_DEPENDENCY_KEYS,
]);

export type PublicFreeQaLimiterPoolOptions = {
  connectionString: string;
  max: number;
  connectionTimeoutMillis: number;
  idleTimeoutMillis: number;
  ssl: { rejectUnauthorized: true };
  application_name?: string;
};

export type PublicFreeQaLimiterAssemblyPool = PublicFreeQaLimiterPool & {
  on(event: "error", listener: () => void): void;
  end(): void | Promise<void>;
};

export type PublicFreeQaLimiterAssemblyDependencies = {
  readEnvironment(name: string): unknown;
  createPool(options: PublicFreeQaLimiterPoolOptions): PublicFreeQaLimiterAssemblyPool;
  onPoolError?: () => void;
  createLimiterCore?: typeof createPublicFreeQaLimiterCore;
  createTransport?: typeof createPublicFreeQaLimiterTransport;
};

export type PublicFreeQaLimiterAssembly = {
  check(input: {
    headers: TrustedAddressHeaders;
    signal?: AbortSignal;
  }): Promise<PublicFreeQaLimitResult>;
};

type ResolvedDependencies = {
  readEnvironment(name: string): unknown;
  createPool(options: PublicFreeQaLimiterPoolOptions): PublicFreeQaLimiterAssemblyPool;
  onPoolError?: () => void;
  createLimiterCore: typeof createPublicFreeQaLimiterCore;
  createTransport: typeof createPublicFreeQaLimiterTransport;
};

function invalidConfiguration(): never {
  throw new Error(CONFIGURATION_ERROR);
}

function parseCanonicalInteger(value: unknown): number | undefined {
  if (typeof value !== "string") return undefined;
  if (value !== "0" && !/^[1-9][0-9]*$/.test(value)) return undefined;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed)) return undefined;
  return parsed;
}

function decodeHmacKey(value: unknown): Uint8Array {
  if (typeof value !== "string" || !CANONICAL_BASE64_32.test(value)) invalidConfiguration();
  const decoded = Buffer.from(value, "base64");
  if (decoded.byteLength !== 32 || decoded.toString("base64") !== value) {
    decoded.fill(0);
    invalidConfiguration();
  }
  const copy = Uint8Array.from(decoded);
  decoded.fill(0);
  return copy;
}

function assertDatabaseUrl(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) invalidConfiguration();
  if (/^\s|\s$/.test(value) || /[\u0000-\u001F\u007F]/.test(value) || /\s/.test(value)) {
    invalidConfiguration();
  }
  if (value.includes("#")) invalidConfiguration();
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    invalidConfiguration();
  }
  if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") invalidConfiguration();
  if (url.hash !== "") invalidConfiguration();
  if (url.hostname.length === 0) invalidConfiguration();
  for (const key of url.searchParams.keys()) {
    if (BLOCKED_URL_QUERY_KEYS.has(key)) invalidConfiguration();
  }
  return value;
}

function readApplicationName(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "string" || !APPLICATION_NAME_TOKEN.test(value)) invalidConfiguration();
  return value;
}

function dataFunction(input: object, key: string): unknown {
  const descriptor = Object.getOwnPropertyDescriptor(input, key);
  if (
    descriptor === undefined
    || !Object.hasOwn(descriptor, "value")
    || Object.hasOwn(descriptor, "get")
    || Object.hasOwn(descriptor, "set")
  ) {
    invalidConfiguration();
  }
  return descriptor.value;
}

function resolveDependencies(input: unknown): ResolvedDependencies {
  try {
    if (input === null || typeof input !== "object" || Array.isArray(input)) invalidConfiguration();
    if (types.isProxy(input)) invalidConfiguration();
    if (Object.getPrototypeOf(input) !== Object.prototype) invalidConfiguration();
    const keys = Reflect.ownKeys(input);
    if (keys.some((key) => typeof key !== "string" || !ALLOWED_DEPENDENCY_KEYS.has(key))) {
      invalidConfiguration();
    }
    const present = new Set(keys);
    if (!REQUIRED_DEPENDENCY_KEYS.every((key) => present.has(key))) invalidConfiguration();
    const readEnvironment = dataFunction(input, "readEnvironment");
    const createPool = dataFunction(input, "createPool");
    if (typeof readEnvironment !== "function" || typeof createPool !== "function") {
      invalidConfiguration();
    }
    let onPoolError: (() => void) | undefined;
    if (present.has("onPoolError")) {
      const value = dataFunction(input, "onPoolError");
      if (typeof value !== "function") invalidConfiguration();
      onPoolError = value as () => void;
    }
    let createLimiterCore = createPublicFreeQaLimiterCore;
    if (present.has("createLimiterCore")) {
      const value = dataFunction(input, "createLimiterCore");
      if (typeof value !== "function") invalidConfiguration();
      createLimiterCore = value as typeof createPublicFreeQaLimiterCore;
    }
    let createTransport = createPublicFreeQaLimiterTransport;
    if (present.has("createTransport")) {
      const value = dataFunction(input, "createTransport");
      if (typeof value !== "function") invalidConfiguration();
      createTransport = value as typeof createPublicFreeQaLimiterTransport;
    }
    return {
      readEnvironment: readEnvironment as (name: string) => unknown,
      createPool: createPool as ResolvedDependencies["createPool"],
      onPoolError,
      createLimiterCore,
      createTransport,
    };
  } catch {
    invalidConfiguration();
  }
}

type PoolMethod = (...args: unknown[]) => unknown;

const UNAVAILABLE_REASONS = new Set([
  "invalid_input",
  "cancelled",
  "timeout",
  "transport_error",
  "invalid_response",
]);

/**
 * Captured once at load. Later mutation of AbortSignal.prototype.aborted
 * cannot change validation. Cleanup may invoke at most
 * CLEANUP_OBSERVATION_BOUND generic thenable then() functions. Genuine Promise
 * observation uses the captured Promise.prototype.then, does not consume a
 * generic step, and does not follow the child Promise that native then
 * returns. Cycles are ignored. This owns Promises observed on that path; it
 * does not suppress arbitrary hostile side effects.
 */
const CLEANUP_OBSERVATION_BOUND = 8;
const capturedPromiseThen = Promise.prototype.then;
const capturedAbortedGetter = Object.getOwnPropertyDescriptor(
  AbortSignal.prototype,
  "aborted",
)?.get;

/**
 * A node whose own prototype is null is a terminal root in every realm,
 * including the local Object.prototype. It is never a method source.
 * A null-prototype object supplied directly therefore fails closed.
 */
function snapshotMethod(target: object, name: string): PoolMethod | undefined {
  const seen = new Set<object>();
  let current: object | null = target;
  while (current !== null) {
    if (seen.has(current)) return undefined;
    seen.add(current);
    let parent: object | null;
    try {
      if (types.isProxy(current)) return undefined;
      parent = Object.getPrototypeOf(current);
    } catch {
      return undefined;
    }
    if (parent === null) return undefined;
    let descriptor: PropertyDescriptor | undefined;
    try {
      descriptor = Object.getOwnPropertyDescriptor(current, name);
    } catch {
      return undefined;
    }
    if (descriptor !== undefined) {
      if (
        Object.hasOwn(descriptor, "get")
        || Object.hasOwn(descriptor, "set")
        || !Object.hasOwn(descriptor, "value")
        || typeof descriptor.value !== "function"
      ) {
        return undefined;
      }
      return descriptor.value as PoolMethod;
    }
    current = parent;
  }
  return undefined;
}

function usableObject(value: unknown): value is object {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  try {
    return types.isProxy(value) !== true;
  } catch {
    return false;
  }
}

function adoptCleanupResult(result: unknown): void {
  const seen = new Set<object>();
  const observe = (value: unknown, genericSteps: number): void => {
    if (value === null || (typeof value !== "object" && typeof value !== "function")) return;
    if (seen.has(value)) return;
    seen.add(value);
    try {
      Reflect.apply(capturedPromiseThen, value, [() => undefined, () => undefined]);
      return;
    } catch {
      if (genericSteps >= CLEANUP_OBSERVATION_BOUND) return;
    }
    let then: unknown;
    try {
      then = (value as { then?: unknown }).then;
    } catch {
      return;
    }
    if (typeof then !== "function") return;
    let returned: unknown;
    try {
      returned = Reflect.apply(then, value, [() => undefined, () => undefined]);
    } catch {
      return;
    }
    observe(returned, genericSteps + 1);
  };
  try {
    observe(result, 0);
  } catch {
    return;
  }
}

function initiateEnd(pool: object, end: PoolMethod): void {
  let result: unknown;
  try {
    result = Reflect.apply(end, pool, []);
  } catch {
    return;
  }
  adoptCleanupResult(result);
}

function isGenuineAbortSignal(value: unknown): value is AbortSignal {
  if (!usableObject(value)) return false;
  if (typeof capturedAbortedGetter !== "function") return false;
  try {
    return typeof Reflect.apply(capturedAbortedGetter, value, []) === "boolean";
  } catch {
    return false;
  }
}

function readEnvelope(value: unknown): PublicFreeQaLimitResult | undefined {
  try {
    if (!usableObject(value) || Object.getPrototypeOf(value) !== Object.prototype) return undefined;
    const keys = Reflect.ownKeys(value);
    if (keys.some((key) => typeof key !== "string")) return undefined;
    const names = new Set(keys);
    const kindDescriptor = Object.getOwnPropertyDescriptor(value, "kind");
    if (
      kindDescriptor === undefined
      || !Object.hasOwn(kindDescriptor, "value")
      || Object.hasOwn(kindDescriptor, "get")
      || Object.hasOwn(kindDescriptor, "set")
    ) {
      return undefined;
    }
    const kind = kindDescriptor.value;
    if (kind === "accepted" || kind === "rejected") {
      if (names.size !== 1 || !names.has("kind")) return undefined;
      return { kind };
    }
    if (kind !== "unavailable" || names.size !== 2 || !names.has("reason")) return undefined;
    const reasonDescriptor = Object.getOwnPropertyDescriptor(value, "reason");
    if (
      reasonDescriptor === undefined
      || !Object.hasOwn(reasonDescriptor, "value")
      || Object.hasOwn(reasonDescriptor, "get")
      || Object.hasOwn(reasonDescriptor, "set")
      || typeof reasonDescriptor.value !== "string"
      || !UNAVAILABLE_REASONS.has(reasonDescriptor.value)
    ) {
      return undefined;
    }
    return {
      kind: "unavailable",
      reason: reasonDescriptor.value as "invalid_input" | "cancelled" | "timeout" | "transport_error" | "invalid_response",
    };
  } catch {
    return undefined;
  }
}

function readRequired(dependencies: ResolvedDependencies, name: string): unknown {
  try {
    return dependencies.readEnvironment(name);
  } catch {
    invalidConfiguration();
  }
}

function parseRequest(input: unknown): {
  headers: TrustedAddressHeaders;
  signal?: AbortSignal;
} | undefined {
  try {
    if (!usableObject(input) || Object.getPrototypeOf(input) !== Object.prototype) return undefined;
    const keys = Reflect.ownKeys(input);
    if (keys.some((key) => typeof key !== "string")) return undefined;
    const names = new Set(keys);
    if (!names.has("headers") || [...names].some((name) => name !== "headers" && name !== "signal")) {
      return undefined;
    }
    const headersDescriptor = Object.getOwnPropertyDescriptor(input, "headers");
    if (
      headersDescriptor === undefined
      || !Object.hasOwn(headersDescriptor, "value")
      || Object.hasOwn(headersDescriptor, "get")
      || Object.hasOwn(headersDescriptor, "set")
    ) {
      return undefined;
    }
    let signal: AbortSignal | undefined;
    if (names.has("signal")) {
      const signalDescriptor = Object.getOwnPropertyDescriptor(input, "signal");
      if (
        signalDescriptor === undefined
        || !Object.hasOwn(signalDescriptor, "value")
        || Object.hasOwn(signalDescriptor, "get")
        || Object.hasOwn(signalDescriptor, "set")
      ) {
        return undefined;
      }
      if (signalDescriptor.value !== undefined) {
        if (!isGenuineAbortSignal(signalDescriptor.value)) return undefined;
        signal = signalDescriptor.value;
      }
    }
    return { headers: headersDescriptor.value as TrustedAddressHeaders, signal };
  } catch {
    return undefined;
  }
}

function assemble(dependencies: ResolvedDependencies): PublicFreeQaLimiterAssembly {
  const hmacKey = readRequired(dependencies, HMAC_KEY_NAME);
  const databaseUrl = assertDatabaseUrl(readRequired(dependencies, DATABASE_URL_NAME));
  const poolMax = parseCanonicalInteger(readRequired(dependencies, POOL_MAX_NAME));
  const queueBound = parseCanonicalInteger(readRequired(dependencies, QUEUE_BOUND_NAME));
  const connectionTimeoutMs = parseCanonicalInteger(readRequired(dependencies, CONNECTION_TIMEOUT_NAME));
  const idleTimeoutMs = parseCanonicalInteger(readRequired(dependencies, IDLE_TIMEOUT_NAME));
  const applicationName = readApplicationName(readRequired(dependencies, APPLICATION_NAME_NAME));

  if (poolMax === undefined || poolMax < 1) invalidConfiguration();
  if (queueBound === undefined || queueBound < 0) invalidConfiguration();
  if (poolMax > Number.MAX_SAFE_INTEGER - queueBound) invalidConfiguration();
  if (
    connectionTimeoutMs === undefined
    || connectionTimeoutMs < 1
    || connectionTimeoutMs > 100
  ) {
    invalidConfiguration();
  }
  if (idleTimeoutMs === undefined || idleTimeoutMs < 1) invalidConfiguration();

  const keyBytes = decodeHmacKey(hmacKey);
  let cleanup: (() => void) | undefined;
  try {
    const options: PublicFreeQaLimiterPoolOptions = {
      connectionString: databaseUrl,
      max: poolMax,
      connectionTimeoutMillis: connectionTimeoutMs,
      idleTimeoutMillis: idleTimeoutMs,
      ssl: { rejectUnauthorized: true },
    };
    if (applicationName !== undefined) options.application_name = applicationName;
    let pool: unknown;
    try {
      pool = dependencies.createPool(options);
    } catch {
      invalidConfiguration();
    }
    if (!usableObject(pool)) invalidConfiguration();
    const end = snapshotMethod(pool, "end");
    if (end === undefined) invalidConfiguration();
    let ended = false;
    cleanup = () => {
      if (ended) return;
      ended = true;
      initiateEnd(pool, end);
    };
    const connect = snapshotMethod(pool, "connect");
    if (connect === undefined) invalidConfiguration();
    const on = snapshotMethod(pool, "on");
    if (on === undefined) invalidConfiguration();
    const onPoolError = dependencies.onPoolError;
    try {
      Reflect.apply(on, pool, ["error", () => {
        if (onPoolError === undefined) return;
        try {
          onPoolError();
        } catch {
          return;
        }
      }]);
    } catch {
      invalidConfiguration();
    }
    let transport: ReturnType<typeof createPublicFreeQaLimiterTransport>;
    try {
      transport = dependencies.createTransport({
        pool: {
          connect() {
            return Reflect.apply(connect, pool, []) as Promise<never>;
          },
        },
        poolMax,
        queueBound,
      });
    } catch {
      invalidConfiguration();
    }
    if (typeof transport !== "function") invalidConfiguration();
    let rawCore: unknown;
    try {
      rawCore = dependencies.createLimiterCore({ hmacSecret: keyBytes, transport });
    } catch {
      invalidConfiguration();
    }
    if (!usableObject(rawCore)) invalidConfiguration();
    const coreCheck = snapshotMethod(rawCore, "check");
    if (coreCheck === undefined) invalidConfiguration();
    const resolver = createPublicFreeQaTrustedAddressResolver({
      provider: "vercel_v1",
      activation: "deployment_evidence_approved",
    });
    const unavailableInput: PublicFreeQaLimitResult = { kind: "unavailable", reason: "invalid_input" };
    const transportFailure: PublicFreeQaLimitResult = { kind: "unavailable", reason: "transport_error" };
    const assembly = Object.freeze({
      check(input: { headers: TrustedAddressHeaders; signal?: AbortSignal }) {
        try {
          const request = parseRequest(input);
          if (request === undefined) return Promise.resolve(unavailableInput);
          let resolution: ReturnType<typeof resolver>;
          try {
            resolution = resolver(request.headers);
          } catch {
            return Promise.resolve(transportFailure);
          }
          if (!resolution.ok) return Promise.resolve(unavailableInput);
          let started: unknown;
          try {
            const payload: { canonicalTrustedAddress: string; signal?: AbortSignal } = {
              canonicalTrustedAddress: resolution.canonicalAddress,
            };
            if (request.signal !== undefined) payload.signal = request.signal;
            started = Reflect.apply(coreCheck, rawCore, [payload]);
          } catch {
            return Promise.resolve(transportFailure);
          }
          return new Promise<PublicFreeQaLimitResult>((resolve) => {
            try {
              Promise.resolve(started).then(
                (value) => {
                  resolve(readEnvelope(value) ?? { kind: "unavailable", reason: "invalid_response" });
                },
                () => {
                  resolve(transportFailure);
                },
              );
            } catch {
              resolve(transportFailure);
            }
          });
        } catch {
          return Promise.resolve(transportFailure);
        }
      },
    });
    cleanup = undefined;
    return assembly;
  } catch {
    if (cleanup !== undefined) cleanup();
    invalidConfiguration();
  } finally {
    keyBytes.fill(0);
  }
}

export function createPublicFreeQaLimiterAssembly(
  dependencies: PublicFreeQaLimiterAssemblyDependencies,
): PublicFreeQaLimiterAssembly {
  return assemble(resolveDependencies(dependencies));
}

export function createPublicFreeQaLimiterAssemblySingleton(
  dependencies: PublicFreeQaLimiterAssemblyDependencies,
): { get(): PublicFreeQaLimiterAssembly } {
  let cached: PublicFreeQaLimiterAssembly | undefined;
  return {
    get() {
      if (cached) return cached;
      const created = createPublicFreeQaLimiterAssembly(dependencies);
      cached = created;
      return created;
    },
  };
}

let productionAssembly: PublicFreeQaLimiterAssembly | undefined;

export function getPublicFreeQaLimiterAssembly(): PublicFreeQaLimiterAssembly {
  if (productionAssembly) return productionAssembly;
  const created = createPublicFreeQaLimiterAssembly({
    readEnvironment(name) {
      return process.env[name];
    },
    createPool(options) {
      return new Pool(options);
    },
  });
  productionAssembly = created;
  return created;
}
