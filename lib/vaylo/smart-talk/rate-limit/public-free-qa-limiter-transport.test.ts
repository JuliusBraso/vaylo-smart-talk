import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import * as nodeModule from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

/**
 * Mocked lifecycle tests for the injected-pool transport.
 * They do not prove database atomicity, socket teardown, retention,
 * deployment capacity, or trusted identity.
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
      for (const candidate of [`${unresolvedPath}.ts`, path.join(unresolvedPath, "index.ts")]) {
        if (existsSync(candidate)) return nextResolve(pathToFileURL(candidate).href, context);
      }
    }
    return nextResolve(specifier, context);
  },
});

const DIGEST = Uint8Array.from({ length: 32 }, (_, index) => index + 1);
const TRANSPORT_ERROR = "public_free_qa_limiter_transport_failed";
const CONFIG_ERROR = "invalid_public_free_qa_limiter_transport_configuration";
const SQL = [
  "BEGIN ISOLATION LEVEL READ COMMITTED",
  "SET LOCAL lock_timeout = '150ms'",
  "SET LOCAL statement_timeout = '400ms'",
  "SELECT decision FROM abuse_control.decide_public_free_qa_attempt($1::bytea)",
  "COMMIT",
] as const;

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
};

function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function turn(): Promise<void> {
  return new Promise((resolve) => {
    setImmediate(resolve);
  });
}

type QueryCall = { sql: string; values?: readonly unknown[] };
type FakeClient = {
  query: (sql: string, values?: readonly unknown[]) => Promise<unknown>;
  release: (err?: Error | boolean) => void;
  on: (event: "error", listener: (error: Error) => void) => void;
  removeListener: (event: "error", listener: (error: Error) => void) => void;
  calls: QueryCall[];
  releases: Array<Error | boolean | undefined>;
  failRelease: boolean;
  emitError: () => void;
  hold: (sql: string) => Deferred<unknown> | undefined;
  complete(sql: string, command: string, extra?: Record<string, unknown>): void;
  reject(sql: string, error?: unknown): void;
};

function fakeClient(): FakeClient {
  const calls: QueryCall[] = [];
  const releases: Array<Error | boolean | undefined> = [];
  const pending = new Map<string, Deferred<unknown>[]>();
  const listeners = new Set<(error: Error) => void>();
  const client: FakeClient = {
    calls,
    releases,
    failRelease: false,
    query(sql, values) {
      calls.push({ sql, values });
      const waiting = deferred<unknown>();
      const queue = pending.get(sql) ?? [];
      queue.push(waiting);
      pending.set(sql, queue);
      return waiting.promise;
    },
    release(err) {
      if (client.failRelease) {
        client.failRelease = false;
        throw new Error("release failed");
      }
      releases.push(err);
    },
    on(_event, listener) {
      listeners.add(listener);
    },
    removeListener(_event, listener) {
      listeners.delete(listener);
    },
    emitError() {
      for (const listener of [...listeners]) listener(new Error("client error"));
    },
    hold(sql) {
      return pending.get(sql)?.[0];
    },
    complete(sql, command, extra = {}) {
      const queue = pending.get(sql);
      const waiting = queue?.shift();
      assert.ok(waiting, sql);
      waiting.resolve({ command, rows: [], ...extra });
    },
    reject(sql, error = new Error("sql failed")) {
      const queue = pending.get(sql);
      const waiting = queue?.shift();
      assert.ok(waiting, sql);
      waiting.reject(error);
    },
  };
  return client;
}

function clocked() {
  let now = 0;
  const timers: Array<{ at: number; callback: () => void; handle: object }> = [];
  return {
    clock: { now: () => now },
    timer: {
      setTimeout(callback: () => void, delayMs: number) {
        const handle = {};
        timers.push({ at: now + delayMs, callback, handle });
        return handle;
      },
      clearTimeout(handle: unknown) {
        const index = timers.findIndex((item) => item.handle === handle);
        if (index >= 0) timers.splice(index, 1);
      },
    },
    advance(ms: number) {
      now += ms;
      const due = timers.filter((item) => item.at <= now);
      for (const item of due) {
        const index = timers.indexOf(item);
        if (index >= 0) timers.splice(index, 1);
        item.callback();
      }
    },
  };
}

type Transport = (input: { keyDigest: Uint8Array; signal: AbortSignal }) => Promise<unknown>;
type Factory = (options: {
  pool: { connect: () => Promise<FakeClient> };
  poolMax: number;
  queueBound: number;
  clock?: { now: () => number };
  timer?: {
    setTimeout: (callback: () => void, delayMs: number) => unknown;
    clearTimeout: (handle: unknown) => void;
  };
}) => Transport;

async function load(): Promise<{ createPublicFreeQaLimiterTransport: Factory }> {
  return import("./public-free-qa-limiter-transport") as Promise<{
    createPublicFreeQaLimiterTransport: Factory;
  }>;
}

function poolFrom(clients: FakeClient[], connects = { count: 0, pending: [] as Deferred<FakeClient>[] }) {
  return {
    connects,
    connect() {
      connects.count += 1;
      const next = clients.shift();
      if (!next) {
        const waiting = deferred<FakeClient>();
        connects.pending.push(waiting);
        return waiting.promise;
      }
      return Promise.resolve(next);
    },
  };
}

async function expectReject(promise: Promise<unknown>): Promise<void> {
  await assert.rejects(promise, (error: unknown) => {
    assert.ok(error instanceof Error);
    assert.equal(error.message, TRANSPORT_ERROR);
    assert.equal("cause" in error, false);
    return true;
  });
}

function signal(): { controller: AbortController; signal: AbortSignal } {
  const controller = new AbortController();
  return { controller, signal: controller.signal };
}

test("TR-11 accepted and rejected use the exact SQL order after COMMIT", async () => {
  const { createPublicFreeQaLimiterTransport } = await load();
  for (const decision of ["accepted", "rejected"] as const) {
    const client = fakeClient();
    const time = clocked();
    const transport = createPublicFreeQaLimiterTransport({
      pool: poolFrom([client]),
      poolMax: 1,
      queueBound: 0,
      clock: time.clock,
      timer: time.timer,
    });
    const { signal: caller } = signal();
    const pending = transport({ keyDigest: DIGEST, signal: caller });
    await turn();
    assert.deepEqual(client.calls.map((call) => call.sql), [SQL[0]]);
    client.complete(SQL[0], "BEGIN");
    await turn();
    client.complete(SQL[1], "SET");
    await turn();
    client.complete(SQL[2], "SET");
    await turn();
    assert.equal(client.calls[3].sql, SQL[3]);
    assert.notEqual(client.calls[3].values?.[0], DIGEST);
    assert.deepEqual(client.calls[3].values?.[0], DIGEST);
    let settled = false;
    void pending.then(() => {
      settled = true;
    });
    client.complete(SQL[3], "SELECT", { rows: [{ decision }] });
    await turn();
    assert.equal(settled, false);
    assert.equal(client.calls[4].sql, SQL[4]);
    client.complete(SQL[4], "COMMIT");
    assert.deepEqual(await pending, { rows: [{ decision }] });
    assert.equal(client.releases.length, 1);
    assert.equal(client.releases[0], undefined);
  }
});

test("invalid digest, configuration, and an already aborted signal do not connect", async () => {
  const { createPublicFreeQaLimiterTransport } = await load();
  const connects = { count: 0, pending: [] as Deferred<FakeClient>[] };
  const transport = createPublicFreeQaLimiterTransport({
    pool: poolFrom([], connects),
    poolMax: 1,
    queueBound: 0,
  });
  await expectReject(transport({ keyDigest: Uint8Array.from([1]), signal: signal().signal }));
  const aborted = signal();
  aborted.controller.abort();
  await expectReject(transport({ keyDigest: DIGEST, signal: aborted.signal }));
  assert.equal(connects.count, 0);
  assert.throws(
    () => createPublicFreeQaLimiterTransport({
      pool: poolFrom([]),
      poolMax: 0,
      queueBound: 1,
    }),
    (error: unknown) => error instanceof Error && error.message === CONFIG_ERROR,
  );
  assert.throws(
    () => createPublicFreeQaLimiterTransport({
      pool: poolFrom([]),
      poolMax: Number.MAX_SAFE_INTEGER,
      queueBound: 1,
    }),
    (error: unknown) => error instanceof Error && error.message === CONFIG_ERROR && !error.message.includes("MAX"),
  );
});

test("TR-01 checkout timeout rejects and a late rejection frees the slot", async () => {
  const { createPublicFreeQaLimiterTransport } = await load();
  const connects = { count: 0, pending: [] as Deferred<FakeClient>[] };
  const time = clocked();
  const transport = createPublicFreeQaLimiterTransport({
    pool: poolFrom([], connects),
    poolMax: 1,
    queueBound: 0,
    clock: time.clock,
    timer: time.timer,
  });
  const first = transport({ keyDigest: DIGEST, signal: signal().signal });
  time.advance(100);
  await expectReject(first);
  assert.equal(connects.count, 1);
  await expectReject(transport({ keyDigest: DIGEST, signal: signal().signal }));
  assert.equal(connects.count, 1);
  connects.pending[0].reject(new Error("late connect"));
  await turn();
  const client = fakeClient();
  const third = transport({ keyDigest: DIGEST, signal: signal().signal });
  await turn();
  assert.equal(connects.count, 2);
  connects.pending[1].resolve(client);
  await turn();
  assert.equal(client.calls[0]?.sql, SQL[0]);
  client.emitError();
  await expectReject(third);
});

test("TR-02 late client after abort is released once with no SQL", async () => {
  const { createPublicFreeQaLimiterTransport } = await load();
  const waiting = deferred<FakeClient>();
  let connects = 0;
  const transport = createPublicFreeQaLimiterTransport({
    pool: {
      connect() {
        connects += 1;
        return waiting.promise;
      },
    },
    poolMax: 1,
    queueBound: 0,
  });
  const caller = signal();
  const pending = transport({ keyDigest: DIGEST, signal: caller.signal });
  caller.controller.abort();
  await expectReject(pending);
  const client = fakeClient();
  waiting.resolve(client);
  await turn();
  assert.equal(client.calls.length, 0);
  assert.equal(client.releases.length, 1);
  assert.equal(client.releases[0], undefined);
  assert.equal(connects, 1);
});

test("TR-03 abandoned never-settling checkouts stop at the admission limit", async () => {
  const { createPublicFreeQaLimiterTransport } = await load();
  const pending: Deferred<FakeClient>[] = [];
  let connects = 0;
  const time = clocked();
  const transport = createPublicFreeQaLimiterTransport({
    pool: {
      connect() {
        connects += 1;
        const waiting = deferred<FakeClient>();
        pending.push(waiting);
        return waiting.promise;
      },
    },
    poolMax: 1,
    queueBound: 1,
    clock: time.clock,
    timer: time.timer,
  });
  const attempts = [signal(), signal()];
  const first = transport({ keyDigest: DIGEST, signal: attempts[0].signal });
  const second = transport({ keyDigest: DIGEST, signal: attempts[1].signal });
  attempts[0].controller.abort();
  attempts[1].controller.abort();
  await expectReject(first);
  await expectReject(second);
  await expectReject(transport({ keyDigest: DIGEST, signal: signal().signal }));
  assert.equal(connects, 2);
  pending[0].reject(new Error("late"));
  await turn();
  const recoveredCaller = signal();
  const recovered = transport({ keyDigest: DIGEST, signal: recoveredCaller.signal });
  const observed = recovered.then(() => undefined, () => undefined);
  await turn();
  assert.equal(connects, 3);
  recoveredCaller.controller.abort();
  await observed;
});

test("connect throw and rejection are observed", async () => {
  const unhandled: unknown[] = [];
  const onUnhandled = (reason: unknown) => {
    unhandled.push(reason);
  };
  process.on("unhandledRejection", onUnhandled);
  try {
    const { createPublicFreeQaLimiterTransport } = await load();
    const throwing = createPublicFreeQaLimiterTransport({
      pool: {
        connect() {
          throw new Error("sync connect");
        },
      },
      poolMax: 1,
      queueBound: 0,
    });
    await expectReject(throwing({ keyDigest: DIGEST, signal: signal().signal }));
    const rejecting = createPublicFreeQaLimiterTransport({
      pool: {
        connect() {
          return Promise.reject(new Error("async connect"));
        },
      },
      poolMax: 1,
      queueBound: 0,
    });
    await expectReject(rejecting({ keyDigest: DIGEST, signal: signal().signal }));
    const caller = signal();
    const reentered = createPublicFreeQaLimiterTransport({
      pool: {
        connect() {
          caller.controller.abort();
          return Promise.reject(new Error("abort during connect"));
        },
      },
      poolMax: 1,
      queueBound: 0,
    });
    await expectReject(reentered({ keyDigest: DIGEST, signal: caller.signal }));
    await turn();
    assert.deepEqual(unhandled, []);
  } finally {
    process.off("unhandledRejection", onUnhandled);
  }
});

test("TR-04 TR-05 TR-07 TR-08 cancellation removes the client and sends no further SQL", async () => {
  const { createPublicFreeQaLimiterTransport } = await load();
  const labels = [SQL[0], SQL[1], SQL[2], SQL[3], SQL[4]];
  for (const sql of labels) {
    const client = fakeClient();
    const transport = createPublicFreeQaLimiterTransport({
      pool: poolFrom([client]),
      poolMax: 1,
      queueBound: 0,
    });
    const caller = signal();
    const pending = transport({ keyDigest: DIGEST, signal: caller.signal });
    await turn();
    while (client.calls.at(-1)?.sql !== sql) {
      const current = client.calls.at(-1);
      assert.ok(current);
      const command = current.sql.startsWith("BEGIN")
        ? "BEGIN"
        : current.sql.startsWith("SET")
          ? "SET"
          : current.sql.startsWith("SELECT")
            ? "SELECT"
            : "COMMIT";
      const extra = command === "SELECT" ? { rows: [{ decision: "accepted" }] } : {};
      client.complete(current.sql, command, extra);
      await turn();
    }
    const count = client.calls.length;
    caller.controller.abort();
    await expectReject(pending);
    assert.equal(client.calls.length, count);
    assert.equal(client.releases.length, 1);
    assert.ok(client.releases[0] instanceof Error);
    client.complete(sql, "BEGIN");
    await turn();
    assert.equal(client.calls.length, count);
    assert.equal(client.releases.length, 1);
  }
});

test("TR-06 abort between confirmed commands submits no new SQL", async () => {
  const { createPublicFreeQaLimiterTransport } = await load();
  const client = fakeClient();
  const transport = createPublicFreeQaLimiterTransport({
    pool: poolFrom([client]),
    poolMax: 1,
    queueBound: 0,
  });
  const caller = signal();
  const pending = transport({ keyDigest: DIGEST, signal: caller.signal });
  await turn();
  client.complete(SQL[0], "BEGIN");
  await turn();
  assert.equal(client.calls.length, 2);
  caller.controller.abort();
  await expectReject(pending);
  assert.deepEqual(client.calls.map((call) => call.sql), [SQL[0], SQL[1]]);
  assert.ok(client.releases[0] instanceof Error);
});

test("TR-09 cancellation during ROLLBACK releases once", async () => {
  const { createPublicFreeQaLimiterTransport } = await load();
  const client = fakeClient();
  const time = clocked();
  const transport = createPublicFreeQaLimiterTransport({
    pool: poolFrom([client]),
    poolMax: 1,
    queueBound: 0,
    clock: time.clock,
    timer: time.timer,
  });
  const caller = signal();
  const pending = transport({ keyDigest: DIGEST, signal: caller.signal });
  await turn();
  client.complete(SQL[0], "BEGIN");
  await turn();
  client.reject(SQL[1], Object.assign(new Error("failed"), { code: "25P02" }));
  await turn();
  assert.equal(client.calls.at(-1)?.sql, "ROLLBACK");
  caller.controller.abort();
  await expectReject(pending);
  assert.equal(client.releases.length, 1);
  client.complete("ROLLBACK", "ROLLBACK");
  await turn();
  assert.equal(client.releases.length, 1);
});

test("TR-13 TR-18 ordinary error rolls back and releases cleanly", async () => {
  const { createPublicFreeQaLimiterTransport } = await load();
  const client = fakeClient();
  const transport = createPublicFreeQaLimiterTransport({
    pool: poolFrom([client]),
    poolMax: 1,
    queueBound: 0,
  });
  const pending = transport({ keyDigest: DIGEST, signal: signal().signal });
  await turn();
  client.complete(SQL[0], "BEGIN");
  await turn();
  client.complete(SQL[1], "SET");
  await turn();
  client.complete(SQL[2], "SET");
  await turn();
  client.complete(SQL[3], "SELECT", { rows: [] });
  await turn();
  assert.equal(client.calls.at(-1)?.sql, "ROLLBACK");
  assert.equal(client.calls.filter((call) => call.sql === SQL[3]).length, 1);
  client.complete("ROLLBACK", "ROLLBACK");
  await expectReject(pending);
  assert.equal(client.releases.length, 1);
  assert.equal(client.releases[0], undefined);
});

test("TR-19 25P02 without confirmed rollback does not return a clean client", async () => {
  const { createPublicFreeQaLimiterTransport } = await load();
  const client = fakeClient();
  const time = clocked();
  const transport = createPublicFreeQaLimiterTransport({
    pool: poolFrom([client]),
    poolMax: 1,
    queueBound: 0,
    clock: time.clock,
    timer: time.timer,
  });
  const pending = transport({ keyDigest: DIGEST, signal: signal().signal });
  await turn();
  client.complete(SQL[0], "BEGIN");
  await turn();
  time.advance(701);
  client.reject(SQL[1], Object.assign(new Error("failed"), { code: "25P02" }));
  await expectReject(pending);
  assert.equal(client.calls.some((call) => call.sql === "ROLLBACK"), false);
  assert.ok(client.releases[0] instanceof Error);
});

test("TR-10 rollback failure removes the client", async () => {
  const { createPublicFreeQaLimiterTransport } = await load();
  const client = fakeClient();
  const transport = createPublicFreeQaLimiterTransport({
    pool: poolFrom([client]),
    poolMax: 1,
    queueBound: 0,
  });
  const pending = transport({ keyDigest: DIGEST, signal: signal().signal });
  await turn();
  client.complete(SQL[0], "BEGIN");
  await turn();
  client.reject(SQL[1]);
  await turn();
  client.reject("ROLLBACK");
  await expectReject(pending);
  assert.equal(client.calls.filter((call) => call.sql === SQL[3]).length, 0);
  assert.ok(client.releases[0] instanceof Error);
});

test("TR-12 TR-21 ambiguous COMMIT and a wrong command tag reject without retry", async () => {
  const { createPublicFreeQaLimiterTransport } = await load();
  const ambiguous = fakeClient();
  const wrong = fakeClient();
  const first = createPublicFreeQaLimiterTransport({
    pool: poolFrom([ambiguous]),
    poolMax: 1,
    queueBound: 0,
  });
  const pending = first({ keyDigest: DIGEST, signal: signal().signal });
  await turn();
  ambiguous.complete(SQL[0], "BEGIN");
  await turn();
  ambiguous.complete(SQL[1], "SET");
  await turn();
  ambiguous.complete(SQL[2], "SET");
  await turn();
  ambiguous.complete(SQL[3], "SELECT", { rows: [{ decision: "accepted" }] });
  await turn();
  ambiguous.reject(SQL[4]);
  await expectReject(pending);
  assert.equal(ambiguous.calls.filter((call) => call.sql === "ROLLBACK").length, 0);
  assert.equal(ambiguous.calls.filter((call) => call.sql === SQL[4]).length, 1);
  const second = createPublicFreeQaLimiterTransport({
    pool: poolFrom([wrong]),
    poolMax: 1,
    queueBound: 0,
  });
  const other = second({ keyDigest: DIGEST, signal: signal().signal });
  await turn();
  wrong.complete(SQL[0], "INSERT");
  await expectReject(other);
});

test("accessor-backed decision and extra rows do not commit", async () => {
  const { createPublicFreeQaLimiterTransport } = await load();
  const client = fakeClient();
  const transport = createPublicFreeQaLimiterTransport({
    pool: poolFrom([client]),
    poolMax: 1,
    queueBound: 0,
  });
  const pending = transport({ keyDigest: DIGEST, signal: signal().signal });
  await turn();
  client.complete(SQL[0], "BEGIN");
  await turn();
  client.complete(SQL[1], "SET");
  await turn();
  client.complete(SQL[2], "SET");
  await turn();
  const row = {};
  let reads = 0;
  Object.defineProperty(row, "decision", {
    get() {
      reads += 1;
      return "accepted";
    },
  });
  client.complete(SQL[3], "SELECT", { rows: [row] });
  await turn();
  assert.equal(reads, 0);
  assert.equal(client.calls.at(-1)?.sql, "ROLLBACK");
  client.complete("ROLLBACK", "ROLLBACK");
  await expectReject(pending);
});

test("release throw does not release twice or reject unhandled", async () => {
  const unhandled: unknown[] = [];
  const onUnhandled = (reason: unknown) => {
    unhandled.push(reason);
  };
  process.on("unhandledRejection", onUnhandled);
  try {
    const { createPublicFreeQaLimiterTransport } = await load();
    const client = fakeClient();
    client.failRelease = true;
    const transport = createPublicFreeQaLimiterTransport({
      pool: poolFrom([client]),
      poolMax: 1,
      queueBound: 0,
    });
    const caller = signal();
    const pending = transport({ keyDigest: DIGEST, signal: caller.signal });
    await turn();
    caller.controller.abort();
    await expectReject(pending);
    await turn();
    assert.equal(client.releases.length, 0);
    assert.deepEqual(unhandled, []);
    await expectReject(transport({ keyDigest: DIGEST, signal: signal().signal }));
  } finally {
    process.off("unhandledRejection", onUnhandled);
  }
});

test("client error stops further SQL", async () => {
  const { createPublicFreeQaLimiterTransport } = await load();
  const client = fakeClient();
  const transport = createPublicFreeQaLimiterTransport({
    pool: poolFrom([client]),
    poolMax: 1,
    queueBound: 0,
  });
  const pending = transport({ keyDigest: DIGEST, signal: signal().signal });
  await turn();
  client.emitError();
  await expectReject(pending);
  assert.equal(client.calls.length, 1);
  assert.ok(client.releases[0] instanceof Error);
});

test("TR-16 TR-22 TR-24 core timeout and a later abort keep the selected result", async () => {
  const coreModule = await import("./public-free-qa-limiter-core") as {
    createPublicFreeQaLimiterCore: (options: {
      hmacSecret: Uint8Array;
      transport: Transport;
      timer?: {
        setTimeout: (callback: () => void, delayMs: number) => unknown;
        clearTimeout: (handle: unknown) => void;
      };
    }) => {
      check: (input: { canonicalTrustedAddress: string; signal?: AbortSignal }) => Promise<{ kind: string; reason?: string }>;
    };
  };
  const { createPublicFreeQaLimiterTransport } = await load();
  const client = fakeClient();
  const coreTime = clocked();
  const transport = createPublicFreeQaLimiterTransport({
    pool: poolFrom([client]),
    poolMax: 1,
    queueBound: 0,
  });
  const core = coreModule.createPublicFreeQaLimiterCore({
    hmacSecret: DIGEST,
    transport,
    timer: coreTime.timer,
  });
  const caller = signal();
  const checking = core.check({ canonicalTrustedAddress: "203.0.113.8", signal: caller.signal });
  await turn();
  client.complete(SQL[0], "BEGIN");
  await turn();
  client.complete(SQL[1], "SET");
  await turn();
  client.complete(SQL[2], "SET");
  await turn();
  client.complete(SQL[3], "SELECT", { rows: [{ decision: "accepted" }] });
  await turn();
  coreTime.advance(750);
  assert.deepEqual(await checking, { kind: "unavailable", reason: "timeout" });
  client.complete(SQL[4], "COMMIT");
  await turn();
  assert.equal(client.calls.filter((call) => call.sql === SQL[4]).length, 1);

  const done = fakeClient();
  const successTransport = createPublicFreeQaLimiterTransport({
    pool: poolFrom([done]),
    poolMax: 1,
    queueBound: 0,
  });
  const successCore = coreModule.createPublicFreeQaLimiterCore({
    hmacSecret: DIGEST,
    transport: successTransport,
  });
  const successCaller = signal();
  const success = successCore.check({ canonicalTrustedAddress: "203.0.113.8", signal: successCaller.signal });
  await turn();
  for (const [sql, command] of [
    [SQL[0], "BEGIN"],
    [SQL[1], "SET"],
    [SQL[2], "SET"],
  ] as const) {
    done.complete(sql, command);
    await turn();
  }
  done.complete(SQL[3], "SELECT", { rows: [{ decision: "accepted" }] });
  await turn();
  done.complete(SQL[4], "COMMIT");
  assert.deepEqual(await success, { kind: "accepted" });
  successCaller.controller.abort();
  await turn();
  assert.deepEqual(await success, { kind: "accepted" });
});

test("concurrent attempts share admission and keep independent cancellation", async () => {
  const { createPublicFreeQaLimiterTransport } = await load();
  const first = fakeClient();
  const second = fakeClient();
  const transport = createPublicFreeQaLimiterTransport({
    pool: poolFrom([first, second]),
    poolMax: 2,
    queueBound: 0,
  });
  const left = signal();
  const right = signal();
  const a = transport({ keyDigest: DIGEST, signal: left.signal });
  const b = transport({ keyDigest: DIGEST, signal: right.signal });
  await turn();
  await expectReject(transport({ keyDigest: DIGEST, signal: signal().signal }));
  left.controller.abort();
  await expectReject(a);
  second.complete(SQL[0], "BEGIN");
  await turn();
  assert.equal(second.calls[0].sql, SQL[0]);
  right.controller.abort();
  await expectReject(b);
});

test("digest bytes are copied before the authority parameter is sent", async () => {
  const { createPublicFreeQaLimiterTransport } = await load();
  const client = fakeClient();
  const transport = createPublicFreeQaLimiterTransport({
    pool: poolFrom([client]),
    poolMax: 1,
    queueBound: 0,
  });
  const digest = Uint8Array.from(DIGEST);
  const pending = transport({ keyDigest: digest, signal: signal().signal });
  digest[0] = 255;
  await turn();
  client.complete(SQL[0], "BEGIN");
  await turn();
  client.complete(SQL[1], "SET");
  await turn();
  client.complete(SQL[2], "SET");
  await turn();
  assert.equal((client.calls[3].values?.[0] as Uint8Array)[0], 1);
  client.complete(SQL[3], "SELECT", { rows: [{ decision: "rejected" }] });
  await turn();
  client.complete(SQL[4], "COMMIT");
  assert.deepEqual(await pending, { rows: [{ decision: "rejected" }] });
});

test("command tag mismatches and invalid authority rows never commit", async () => {
  const { createPublicFreeQaLimiterTransport } = await load();
  const cases: Array<{ sql: string; command: string; extra?: Record<string, unknown> }> = [
    { sql: SQL[1], command: "BEGIN" },
    { sql: SQL[2], command: "SHOW" },
    { sql: SQL[3], command: "UPDATE", extra: { rows: [{ decision: "accepted" }] } },
    { sql: SQL[4], command: "ROLLBACK" },
    { sql: SQL[3], command: "SELECT", extra: { rows: [{ decision: "maybe" }] } },
    { sql: SQL[3], command: "SELECT", extra: { rows: [{ decision: "accepted" }, { decision: "rejected" }] } },
  ];
  for (const item of cases) {
    const client = fakeClient();
    const transport = createPublicFreeQaLimiterTransport({
      pool: poolFrom([client]),
      poolMax: 1,
      queueBound: 0,
    });
    const pending = transport({ keyDigest: DIGEST, signal: signal().signal });
    const settled = pending.then(() => undefined, (error: unknown) => error);
    await turn();
    while (client.calls.at(-1)?.sql !== item.sql) {
      const current = client.calls.at(-1);
      assert.ok(current);
      const command = current.sql.startsWith("BEGIN") ? "BEGIN" : current.sql.startsWith("SET") ? "SET" : "SELECT";
      client.complete(current.sql, command, command === "SELECT" ? { rows: [{ decision: "accepted" }] } : {});
      await turn();
    }
    client.complete(item.sql, item.command, item.extra ?? {});
    await turn();
    if (client.calls.at(-1)?.sql === "ROLLBACK") client.complete("ROLLBACK", "ROLLBACK");
    const outcome = await settled;
    assert.ok(outcome instanceof Error);
    assert.equal(outcome.message, TRANSPORT_ERROR);
    assert.equal(client.calls.filter((call) => call.sql === SQL[3]).length <= 1, true);
    assert.equal(client.releases.length, 1);
  }
});

test("TR-15 TR-23 late failures stay observed and commit-before-core-read stays unavailable", async () => {
  const unhandled: unknown[] = [];
  const onUnhandled = (reason: unknown) => {
    unhandled.push(reason);
  };
  process.on("unhandledRejection", onUnhandled);
  try {
    const coreModule = await import("./public-free-qa-limiter-core") as {
      createPublicFreeQaLimiterCore: (options: {
        hmacSecret: Uint8Array;
        transport: Transport;
      }) => {
        check: (input: { canonicalTrustedAddress: string; signal?: AbortSignal }) => Promise<{ kind: string; reason?: string }>;
      };
    };
    const { createPublicFreeQaLimiterTransport } = await load();
    const client = fakeClient();
    const transport = createPublicFreeQaLimiterTransport({
      pool: poolFrom([client]),
      poolMax: 1,
      queueBound: 0,
    });
    const caller = signal();
    const core = coreModule.createPublicFreeQaLimiterCore({ hmacSecret: DIGEST, transport });
    const checking = core.check({ canonicalTrustedAddress: "203.0.113.8", signal: caller.signal });
    await turn();
    client.complete(SQL[0], "BEGIN");
    await turn();
    client.complete(SQL[1], "SET");
    await turn();
    client.complete(SQL[2], "SET");
    await turn();
    client.complete(SQL[3], "SELECT", { rows: [{ decision: "accepted" }] });
    await turn();
    client.complete(SQL[4], "COMMIT");
    queueMicrotask(() => {
      caller.controller.abort();
    });
    assert.deepEqual(await checking, { kind: "unavailable", reason: "cancelled" });
    assert.equal(client.calls.filter((call) => call.sql === "ROLLBACK").length, 0);
    await turn();
    assert.deepEqual(unhandled, []);
  } finally {
    process.off("unhandledRejection", onUnhandled);
  }
});

test("reentrant abort from query stops further SQL and releases once", async () => {
  const { createPublicFreeQaLimiterTransport } = await load();
  const caller = signal();
  const client = fakeClient();
  const original = client.query.bind(client);
  client.query = (sql, values) => {
    if (sql === SQL[1]) caller.controller.abort();
    return original(sql, values);
  };
  const transport = createPublicFreeQaLimiterTransport({
    pool: poolFrom([client]),
    poolMax: 1,
    queueBound: 0,
  });
  const pending = transport({ keyDigest: DIGEST, signal: caller.signal });
  await turn();
  client.complete(SQL[0], "BEGIN");
  await expectReject(pending);
  assert.deepEqual(client.calls.map((call) => call.sql), [SQL[0], SQL[1]]);
  assert.equal(client.releases.length, 1);
  assert.ok(client.releases[0] instanceof Error);
});

test("success detaches the client error listener", async () => {
  const { createPublicFreeQaLimiterTransport } = await load();
  const client = fakeClient();
  const transport = createPublicFreeQaLimiterTransport({
    pool: poolFrom([client]),
    poolMax: 1,
    queueBound: 0,
  });
  const pending = transport({ keyDigest: DIGEST, signal: signal().signal });
  await turn();
  client.complete(SQL[0], "BEGIN");
  await turn();
  client.complete(SQL[1], "SET");
  await turn();
  client.complete(SQL[2], "SET");
  await turn();
  client.complete(SQL[3], "SELECT", { rows: [{ decision: "accepted" }] });
  await turn();
  client.complete(SQL[4], "COMMIT");
  await pending;
  const releases = client.releases.length;
  client.emitError();
  await turn();
  assert.equal(client.releases.length, releases);
});

function manualTime() {
  let now = 0;
  const timers: Array<{ at: number; callback: () => void; handle: object; cleared: boolean }> = [];
  return {
    clock: { now: () => now },
    timer: {
      setTimeout(callback: () => void, delayMs: number) {
        const handle = {};
        timers.push({ at: now + delayMs, callback, handle, cleared: false });
        return handle;
      },
      clearTimeout(handle: unknown) {
        const item = timers.find((entry) => entry.handle === handle);
        if (item) item.cleared = true;
      },
    },
    advance(ms: number) {
      now += ms;
    },
    dispatch() {
      const due = timers.filter((item) => !item.cleared && item.at <= now);
      for (const item of due) {
        item.cleared = true;
        item.callback();
      }
    },
    active() {
      return timers.filter((item) => !item.cleared);
    },
  };
}

function trackedSignal() {
  const controller = new AbortController();
  const abortSignal = controller.signal;
  let listeners = 0;
  const add = abortSignal.addEventListener.bind(abortSignal);
  const remove = abortSignal.removeEventListener.bind(abortSignal);
  abortSignal.addEventListener = ((type: string, listener: EventListener, options?: boolean | AddEventListenerOptions) => {
    if (type === "abort") listeners += 1;
    add(type, listener, options);
  }) as typeof abortSignal.addEventListener;
  abortSignal.removeEventListener = ((type: string, listener: EventListener, options?: boolean | EventListenerOptions) => {
    if (type === "abort") listeners -= 1;
    remove(type, listener, options);
  }) as typeof abortSignal.removeEventListener;
  return { controller, signal: abortSignal, listeners: () => listeners };
}

function syncTimer(kind: "attempt" | "checkout") {
  const handles: Array<{ cleared: boolean }> = [];
  const delay = kind === "attempt" ? 750 : 100;
  return {
    handles,
    active() {
      return handles.filter((handle) => !handle.cleared);
    },
    timer: {
      setTimeout(callback: () => void, delayMs: number) {
        if (delayMs === delay) callback();
        const handle = { cleared: false };
        handles.push(handle);
        return handle;
      },
      clearTimeout(handle: unknown) {
        if (handle && typeof handle === "object" && "cleared" in handle) {
          (handle as { cleared: boolean }).cleared = true;
        }
      },
    },
  };
}

async function driveAccepted(client: FakeClient): Promise<void> {
  for (let step = 0; step < 8; step += 1) {
    const current = client.calls.at(-1);
    if (!current || client.hold(current.sql) === undefined) return;
    const command = current.sql.startsWith("BEGIN")
      ? "BEGIN"
      : current.sql.startsWith("SET")
        ? "SET"
        : current.sql.startsWith("SELECT")
          ? "SELECT"
          : current.sql === "COMMIT"
            ? "COMMIT"
            : "ROLLBACK";
    client.complete(current.sql, command, command === "SELECT" ? { rows: [{ decision: "accepted" }] } : {});
    await turn();
    if (command === "COMMIT" || command === "ROLLBACK") return;
  }
}

test("FIX1 A checkout after the deadline without timer dispatch submits no SQL", async () => {
  const { createPublicFreeQaLimiterTransport } = await load();
  for (const elapsed of [100, 101, 751]) {
    const time = manualTime();
    const client = fakeClient();
    const queued: Deferred<FakeClient>[] = [];
    let connects = 0;
    const transport = createPublicFreeQaLimiterTransport({
      pool: {
        connect() {
          connects += 1;
          const waiting = deferred<FakeClient>();
          queued.push(waiting);
          return waiting.promise;
        },
      },
      poolMax: 1,
      queueBound: 0,
      clock: time.clock,
      timer: time.timer,
    });
    const pending = transport({ keyDigest: DIGEST, signal: signal().signal });
    const settled = pending.then((value) => value, (error: unknown) => error);
    time.advance(elapsed);
    assert.equal(time.active().length, 2);
    queued[0].resolve(client);
    await turn();
    await driveAccepted(client);
    const outcome = await settled;
    assert.equal(client.calls.length, 0, `elapsed ${elapsed}`);
    assert.ok(outcome instanceof Error, `elapsed ${elapsed}`);
    assert.equal(outcome.message, TRANSPORT_ERROR);
    assert.equal(client.releases.length, 1, `elapsed ${elapsed}`);
    assert.equal(client.releases[0], undefined, `elapsed ${elapsed}`);
    const followCaller = signal();
    const follow = transport({ keyDigest: DIGEST, signal: followCaller.signal });
    const followSettled = follow.then(() => undefined, () => undefined);
    await turn();
    assert.equal(connects, 2, `elapsed ${elapsed}`);
    followCaller.controller.abort();
    await followSettled;
  }
});

test("FIX1 A checkout just before 100 ms may begin", async () => {
  const { createPublicFreeQaLimiterTransport } = await load();
  const time = manualTime();
  const client = fakeClient();
  const waiting = deferred<FakeClient>();
  const transport = createPublicFreeQaLimiterTransport({
    pool: { connect: () => waiting.promise },
    poolMax: 1,
    queueBound: 0,
    clock: time.clock,
    timer: time.timer,
  });
  const pending = transport({ keyDigest: DIGEST, signal: signal().signal });
  time.advance(99);
  waiting.resolve(client);
  await turn();
  assert.equal(client.calls[0]?.sql, SQL[0]);
  time.advance(751);
  time.dispatch();
  await expectReject(pending);
});

test("FIX1 B synchronous timers reject before connect and clear handles", async () => {
  const { createPublicFreeQaLimiterTransport } = await load();
  for (const kind of ["attempt", "checkout"] as const) {
    const sync = syncTimer(kind);
    const tracked = trackedSignal();
    let connects = 0;
    const transport = createPublicFreeQaLimiterTransport({
      pool: {
        connect() {
          connects += 1;
          return deferred<FakeClient>().promise;
        },
      },
      poolMax: 1,
      queueBound: 0,
      timer: sync.timer,
    });
    const armed = { count: 0 };
    const counting = sync.timer.setTimeout;
    sync.timer.setTimeout = (callback, delayMs) => {
      armed.count += 1;
      return counting(callback, delayMs);
    };
    await expectReject(transport({ keyDigest: DIGEST, signal: tracked.signal }));
    assert.equal(connects, 0, kind);
    assert.equal(sync.active().length, 0, kind);
    assert.equal(tracked.listeners(), 0, kind);
    const armedAfterFirst = armed.count;
    const follow = trackedSignal();
    const pending = transport({ keyDigest: DIGEST, signal: follow.signal });
    const observed = pending.then(() => undefined, () => undefined);
    await observed;
    assert.ok(armed.count > armedAfterFirst, kind);
  }
});

async function beginAt(elapsed = 0): Promise<{
  client: FakeClient;
  time: ReturnType<typeof manualTime>;
  settled: Promise<unknown>;
}> {
  const { createPublicFreeQaLimiterTransport } = await load();
  const time = manualTime();
  const client = fakeClient();
  const transport = createPublicFreeQaLimiterTransport({
    pool: poolFrom([client]),
    poolMax: 1,
    queueBound: 0,
    clock: time.clock,
    timer: time.timer,
  });
  const pending = transport({ keyDigest: DIGEST, signal: signal().signal });
  const settled = pending.then((value) => value, (error: unknown) => error);
  if (elapsed > 0) time.advance(elapsed);
  await turn();
  return { client, time, settled };
}

test("FIX1 overall deadline blocks the next command without timer dispatch", async () => {
  const beforeSet = await beginAt();
  beforeSet.time.advance(750);
  beforeSet.client.complete(SQL[0], "BEGIN");
  await turn();
  assert.deepEqual(beforeSet.client.calls.map((call) => call.sql), [SQL[0]]);
  const setOutcome = await beforeSet.settled;
  assert.ok(setOutcome instanceof Error);

  const beforeSelect = await beginAt();
  beforeSelect.client.complete(SQL[0], "BEGIN");
  await turn();
  beforeSelect.client.complete(SQL[1], "SET");
  await turn();
  beforeSelect.time.advance(750);
  beforeSelect.client.complete(SQL[2], "SET");
  await turn();
  assert.equal(beforeSelect.client.calls.some((call) => call.sql === SQL[3]), false);
  assert.ok(await beforeSelect.settled instanceof Error);

  const beforeCommit = await beginAt();
  beforeCommit.client.complete(SQL[0], "BEGIN");
  await turn();
  beforeCommit.client.complete(SQL[1], "SET");
  await turn();
  beforeCommit.client.complete(SQL[2], "SET");
  await turn();
  beforeCommit.time.advance(750);
  beforeCommit.client.complete(SQL[3], "SELECT", { rows: [{ decision: "accepted" }] });
  await turn();
  assert.equal(beforeCommit.client.calls.some((call) => call.sql === SQL[4]), false);
  assert.ok(await beforeCommit.settled instanceof Error);
});

test("FIX1 confirmed COMMIT after expiry rejects without rollback or a second release", async () => {
  const late = await beginAt();
  late.client.complete(SQL[0], "BEGIN");
  await turn();
  late.client.complete(SQL[1], "SET");
  await turn();
  late.client.complete(SQL[2], "SET");
  await turn();
  late.client.complete(SQL[3], "SELECT", { rows: [{ decision: "accepted" }] });
  await turn();
  late.time.advance(750);
  late.client.complete(SQL[4], "COMMIT");
  const outcome = await late.settled;
  assert.ok(outcome instanceof Error);
  assert.equal((outcome as Error).message, TRANSPORT_ERROR);
  assert.equal(late.client.calls.filter((call) => call.sql === "ROLLBACK").length, 0);
  assert.equal(late.client.calls.filter((call) => call.sql === SQL[4]).length, 1);
  assert.equal(late.client.releases.length, 1);
  assert.equal(late.client.releases[0], undefined);

  const removed = await beginAt();
  removed.client.complete(SQL[0], "BEGIN");
  await turn();
  removed.client.complete(SQL[1], "SET");
  await turn();
  removed.client.complete(SQL[2], "SET");
  await turn();
  removed.client.complete(SQL[3], "SELECT", { rows: [{ decision: "accepted" }] });
  await turn();
  removed.time.advance(750);
  removed.time.dispatch();
  const releases = removed.client.releases.length;
  removed.client.complete(SQL[4], "COMMIT");
  await turn();
  assert.equal(removed.client.releases.length, releases);
  assert.ok(await removed.settled instanceof Error);
  assert.equal(removed.client.calls.filter((call) => call.sql === "ROLLBACK").length, 0);
});

test("FIX1 stale timers and concurrent attempts stay independent", async () => {
  const done = await beginAt();
  for (const [sql, command] of [
    [SQL[0], "BEGIN"],
    [SQL[1], "SET"],
    [SQL[2], "SET"],
  ] as const) {
    done.client.complete(sql, command);
    await turn();
  }
  done.client.complete(SQL[3], "SELECT", { rows: [{ decision: "rejected" }] });
  await turn();
  done.client.complete(SQL[4], "COMMIT");
  assert.deepEqual(await done.settled, { rows: [{ decision: "rejected" }] });
  const releases = done.client.releases.length;
  done.time.advance(800);
  done.time.dispatch();
  await turn();
  assert.equal(done.client.releases.length, releases);
  assert.equal(done.time.active().length, 0);

  const { createPublicFreeQaLimiterTransport } = await load();
  const time = manualTime();
  const first = fakeClient();
  const second = fakeClient();
  const transport = createPublicFreeQaLimiterTransport({
    pool: poolFrom([first, second]),
    poolMax: 2,
    queueBound: 0,
    clock: time.clock,
    timer: time.timer,
  });
  const left = signal();
  const right = signal();
  const leftPending = transport({ keyDigest: DIGEST, signal: left.signal });
  const rightPending = transport({ keyDigest: DIGEST, signal: right.signal });
  const leftSettled = leftPending.then(() => undefined, () => undefined);
  const rightSettled = rightPending.then(() => undefined, () => undefined);
  await turn();
  const before = time.active().length;
  left.controller.abort();
  await leftSettled;
  assert.equal(time.active().length, before - 1);
  assert.ok(time.active().length > 0);
  time.advance(750);
  time.dispatch();
  await rightSettled;
  assert.equal(second.calls.length >= 1, true);
  assert.equal(second.releases.length, 1);
});

test("FIX1 rollback budget, reentry, and a throwing release keep admission closed", async () => {
  const allowed = await beginAt();
  allowed.time.advance(700);
  allowed.client.complete(SQL[0], "BEGIN");
  await turn();
  allowed.client.reject(SQL[1]);
  await turn();
  assert.equal(allowed.client.calls.at(-1)?.sql, "ROLLBACK");
  allowed.client.complete("ROLLBACK", "ROLLBACK");
  assert.ok(await allowed.settled instanceof Error);
  assert.equal(allowed.client.releases[0], undefined);

  const denied = await beginAt();
  denied.time.advance(701);
  denied.client.complete(SQL[0], "BEGIN");
  await turn();
  denied.client.reject(SQL[1]);
  await expectReject(denied.settled.then((value) => {
    if (value instanceof Error) return Promise.reject(value);
    return value;
  }));
  assert.equal(denied.client.calls.some((call) => call.sql === "ROLLBACK"), false);
  assert.ok(denied.client.releases[0] instanceof Error);

  const { createPublicFreeQaLimiterTransport } = await load();
  const caller = signal();
  const client = fakeClient();
  const originalRelease = client.release.bind(client);
  client.release = (err) => {
    caller.controller.abort();
    originalRelease(err);
  };
  const transport = createPublicFreeQaLimiterTransport({
    pool: poolFrom([client]),
    poolMax: 1,
    queueBound: 0,
  });
  const pending = transport({ keyDigest: DIGEST, signal: caller.signal });
  await turn();
  caller.controller.abort();
  await expectReject(pending);
  assert.equal(client.releases.length, 1);

  const unhandled: unknown[] = [];
  const onUnhandled = (reason: unknown) => {
    unhandled.push(reason);
  };
  process.on("unhandledRejection", onUnhandled);
  try {
    const held = fakeClient();
    held.failRelease = true;
    const time = manualTime();
    const waiting = deferred<FakeClient>();
    let connects = 0;
    const limited = createPublicFreeQaLimiterTransport({
      pool: {
        connect() {
          connects += 1;
          return waiting.promise;
        },
      },
      poolMax: 1,
      queueBound: 0,
      clock: time.clock,
      timer: time.timer,
    });
    const first = limited({ keyDigest: DIGEST, signal: signal().signal });
    const firstSettled = first.then(() => undefined, () => undefined);
    time.advance(101);
    waiting.resolve(held);
    await firstSettled;
    await turn();
    assert.equal(held.releases.length, 0);
    await expectReject(limited({ keyDigest: DIGEST, signal: signal().signal }));
    assert.equal(connects, 1);
    assert.deepEqual(unhandled, []);
  } finally {
    process.off("unhandledRejection", onUnhandled);
  }
});
