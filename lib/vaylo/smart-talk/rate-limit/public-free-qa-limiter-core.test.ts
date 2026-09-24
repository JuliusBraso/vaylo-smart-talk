import assert from "node:assert/strict";
import { getEventListeners } from "node:events";
import { existsSync } from "node:fs";
import * as nodeModule from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

/**
 * These tests exercise the injected-transport core only.
 * They do not prove database atomicity, connection teardown, IP authenticity,
 * retention, or global capacity.
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
    if (specifier.startsWith("@/")) {
      unresolvedPath = path.join(process.cwd(), specifier.slice(2));
    } else if (
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

type PublicFreeQaLimitResult =
  | { kind: "accepted" }
  | { kind: "rejected" }
  | { kind: "unavailable"; reason: string };

type TransportInput = { keyDigest: Uint8Array; signal: AbortSignal };
type Transport = (input: TransportInput) => Promise<unknown>;
type LimiterCore = {
  check(input: {
    canonicalTrustedAddress: string;
    signal?: AbortSignal;
  }): Promise<PublicFreeQaLimitResult>;
};
type Timer = {
  setTimeout(callback: () => void, delayMs: number): unknown;
  clearTimeout(handle: unknown): void;
};

const SECRET = Uint8Array.from({ length: 32 }, () => 0x11);
const ADDRESS = "203.0.113.8";
const OTHER_ADDRESS = "203.0.113.9";
const EXPECTED_DIGEST = Uint8Array.from([
  0xbe, 0x28, 0x30, 0x75, 0x8f, 0x97, 0x0b, 0xee,
  0x84, 0xeb, 0x4b, 0x96, 0xd0, 0x0a, 0xa3, 0xd8,
  0xe9, 0x9d, 0x32, 0x16, 0xa9, 0x49, 0x58, 0x79,
  0xd3, 0x0f, 0xfd, 0xec, 0x26, 0x4e, 0x95, 0xa9,
]);

const acceptedEnvelope = { rows: [{ decision: "accepted" }] };
const rejectedEnvelope = { rows: [{ decision: "rejected" }] };

function deferred<T>(): {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason: unknown) => void;
} {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
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

function manualTimer(): Timer & {
  fire: () => void;
  delay: () => number | undefined;
  cleared: () => boolean;
  clearCount: () => number;
} {
  let nextId = 0;
  let delayMs: number | undefined;
  const pending = new Map<number, () => void>();
  const clearedIds: number[] = [];
  return {
    setTimeout(next, delay) {
      nextId += 1;
      delayMs = delay;
      pending.set(nextId, next);
      return nextId;
    },
    clearTimeout(value) {
      assert.equal(typeof value, "number");
      const id = value as number;
      assert.equal(pending.has(id), true);
      pending.delete(id);
      clearedIds.push(id);
    },
    fire() {
      const next = pending.entries().next();
      assert.equal(next.done, false);
      next.value[1]();
    },
    delay: () => delayMs,
    cleared: () => pending.size === 0 && clearedIds.length > 0,
    clearCount: () => clearedIds.length,
  };
}

async function loadCore(): Promise<{
  createPublicFreeQaLimiterCore: (options: {
    hmacSecret: Uint8Array;
    transport: Transport;
    timer?: Timer;
  }) => LimiterCore;
}> {
  return import("./public-free-qa-limiter-core") as Promise<{
    createPublicFreeQaLimiterCore: (options: {
      hmacSecret: Uint8Array;
      transport: Transport;
      timer?: Timer;
    }) => LimiterCore;
  }>;
}

function assertClosedResult(result: PublicFreeQaLimitResult, forbidden: string[]): void {
  const encoded = JSON.stringify(result);
  for (const fragment of forbidden) assert.equal(encoded.includes(fragment), false);
  assert.equal(Object.hasOwn(result, "keyDigest"), false);
  assert.equal(Object.hasOwn(result, "error"), false);
}

test("fixed secret and address produce the independent digest", async () => {
  const seen: Uint8Array[] = [];
  const { createPublicFreeQaLimiterCore } = await loadCore();
  const timer = manualTimer();
  const core = createPublicFreeQaLimiterCore({
    hmacSecret: SECRET,
    timer,
    transport(input) {
      seen.push(input.keyDigest);
      assert.deepEqual(Object.keys(input).sort(), ["keyDigest", "signal"]);
      assert.equal(input.signal.aborted, false);
      return Promise.resolve(acceptedEnvelope);
    },
  });
  const result = await core.check({ canonicalTrustedAddress: ADDRESS });
  assert.deepEqual(result, { kind: "accepted" });
  assert.equal(seen.length, 1);
  assert.equal(seen[0].byteLength, 32);
  assert.deepEqual(seen[0], EXPECTED_DIGEST);
  assert.notEqual(seen[0], EXPECTED_DIGEST);
  assert.equal(timer.delay(), 750);
  assert.equal(timer.cleared(), true);
});

test("a different address produces a different 32-byte digest", async () => {
  const seen: Uint8Array[] = [];
  const { createPublicFreeQaLimiterCore } = await loadCore();
  const core = createPublicFreeQaLimiterCore({
    hmacSecret: SECRET,
    timer: manualTimer(),
    transport(input) {
      seen.push(input.keyDigest);
      return Promise.resolve(rejectedEnvelope);
    },
  });
  assert.deepEqual(
    await core.check({ canonicalTrustedAddress: OTHER_ADDRESS }),
    { kind: "rejected" },
  );
  assert.equal(seen[0].byteLength, 32);
  assert.equal(Buffer.from(seen[0]).equals(Buffer.from(EXPECTED_DIGEST)), false);
});

test("factory copies the secret before later mutation", async () => {
  const supplied = Uint8Array.from(SECRET);
  const seen: Uint8Array[] = [];
  const { createPublicFreeQaLimiterCore } = await loadCore();
  const core = createPublicFreeQaLimiterCore({
    hmacSecret: supplied,
    timer: manualTimer(),
    transport(input) {
      seen.push(input.keyDigest);
      return Promise.resolve(acceptedEnvelope);
    },
  });
  supplied.fill(0);
  await core.check({ canonicalTrustedAddress: ADDRESS });
  assert.deepEqual(seen[0], EXPECTED_DIGEST);
});

test("invalid configuration throws the fixed error and starts no transport", async () => {
  const { createPublicFreeQaLimiterCore } = await loadCore();
  let starts = 0;
  const transport: Transport = () => {
    starts += 1;
    return Promise.resolve(acceptedEnvelope);
  };
  const marker = "SUPER_SECRET_MARKER_VALUE_32";
  const cases: unknown[] = [
    { hmacSecret: Uint8Array.from({ length: 31 }, () => 1), transport },
    { hmacSecret: marker, transport },
    { hmacSecret: SECRET, transport: undefined },
    { hmacSecret: SECRET, transport: "call" },
    { hmacSecret: SECRET, transport, timer: {} },
    { hmacSecret: SECRET, transport, timer: { setTimeout: () => undefined } },
  ];
  for (const options of cases) {
    assert.throws(
      () => createPublicFreeQaLimiterCore(options as {
        hmacSecret: Uint8Array;
        transport: Transport;
      }),
      (error: unknown) => {
        assert.ok(error instanceof Error);
        assert.equal(error.message, "invalid_public_free_qa_limiter_configuration");
        assert.equal(error.message.includes(marker), false);
        assert.equal("cause" in error, false);
        return true;
      },
    );
  }
  assert.equal(starts, 0);
});

test("invalid address representation starts no transport", async () => {
  const { createPublicFreeQaLimiterCore } = await loadCore();
  let starts = 0;
  const core = createPublicFreeQaLimiterCore({
    hmacSecret: SECRET,
    timer: manualTimer(),
    transport() {
      starts += 1;
      return Promise.resolve(acceptedEnvelope);
    },
  });
  const samples: unknown[] = [
    "",
    " ",
    "203.0.113.8 ",
    "a".repeat(65),
    "fe80::1%eth0",
    "gggg",
    new String(ADDRESS),
    203,
    null,
  ];
  for (const canonicalTrustedAddress of samples) {
    const result = await core.check({
      canonicalTrustedAddress: canonicalTrustedAddress as string,
    });
    assert.deepEqual(result, { kind: "unavailable", reason: "invalid_input" });
  }
  assert.equal(starts, 0);
});

test("exact accepted and rejected envelopes are the only quota outcomes", async () => {
  const { createPublicFreeQaLimiterCore } = await loadCore();
  const accepted = createPublicFreeQaLimiterCore({
    hmacSecret: SECRET,
    timer: manualTimer(),
    transport() {
      return Promise.resolve(acceptedEnvelope);
    },
  });
  const rejected = createPublicFreeQaLimiterCore({
    hmacSecret: SECRET,
    timer: manualTimer(),
    transport() {
      return Promise.resolve(rejectedEnvelope);
    },
  });
  assert.deepEqual(await accepted.check({ canonicalTrustedAddress: ADDRESS }), { kind: "accepted" });
  assert.deepEqual(await rejected.check({ canonicalTrustedAddress: ADDRESS }), { kind: "rejected" });
});

test("malformed transport responses are invalid_response", async () => {
  const { createPublicFreeQaLimiterCore } = await loadCore();
  const hidden = { rows: [{ decision: "accepted" }] };
  Object.defineProperty(hidden, "hidden", { value: ADDRESS, enumerable: false });
  const responses: unknown[] = [
    { rows: [] },
    { rows: [{ decision: "accepted" }, { decision: "rejected" }] },
    { rows: [{}] },
    { rows: [{ decision: "maybe" }] },
    null,
    1,
    "accepted",
    [{ decision: "accepted" }],
    { rows: [{ decision: "accepted" }], extra: true },
    { rows: [{ decision: "accepted", extra: true }] },
    hidden,
    { rows: null },
    { rows: [{ decision: 1 }] },
    Object.create({ rows: [{ decision: "accepted" }] }),
  ];
  for (const response of responses) {
    const core = createPublicFreeQaLimiterCore({
      hmacSecret: SECRET,
      timer: manualTimer(),
      transport() {
        return Promise.resolve(response);
      },
    });
    const result = await core.check({ canonicalTrustedAddress: ADDRESS });
    assert.deepEqual(result, { kind: "unavailable", reason: "invalid_response" });
    assertClosedResult(result, [ADDRESS, "be283075", "maybe"]);
  }
});

test("accessor fields are rejected without executing getters", async () => {
  const { createPublicFreeQaLimiterCore } = await loadCore();
  let reads = 0;
  const envelope: Record<string, unknown> = {};
  Object.defineProperty(envelope, "rows", {
    enumerable: true,
    configurable: true,
    get() {
      reads += 1;
      throw new Error(`getter leaked ${ADDRESS}`);
    },
  });
  const row = {};
  Object.defineProperty(row, "decision", {
    enumerable: true,
    configurable: true,
    get() {
      reads += 1;
      return "accepted";
    },
  });
  const elementGetter: unknown[] = [];
  Object.defineProperty(elementGetter, "0", {
    enumerable: true,
    configurable: true,
    get() {
      reads += 1;
      return { decision: "accepted" };
    },
  });
  const responses = [envelope, { rows: [row] }, { rows: elementGetter }];
  for (const response of responses) {
    const core = createPublicFreeQaLimiterCore({
      hmacSecret: SECRET,
      timer: manualTimer(),
      transport() {
        return Promise.resolve(response);
      },
    });
    assert.deepEqual(
      await core.check({ canonicalTrustedAddress: ADDRESS }),
      { kind: "unavailable", reason: "invalid_response" },
    );
  }
  assert.equal(reads, 0);
});

test("results omit input, digest, secret and transport error text", async () => {
  const { createPublicFreeQaLimiterCore } = await loadCore();
  const core = createPublicFreeQaLimiterCore({
    hmacSecret: SECRET,
    timer: manualTimer(),
    transport() {
      return Promise.reject(new Error(`db failure ${ADDRESS} be283075`));
    },
  });
  const result = await core.check({ canonicalTrustedAddress: ADDRESS });
  assert.deepEqual(result, { kind: "unavailable", reason: "transport_error" });
  assertClosedResult(result, [ADDRESS, "be283075", "db failure", "SUPER"]);
});

test("an already aborted caller starts no transport", async () => {
  const { createPublicFreeQaLimiterCore } = await loadCore();
  const caller = new AbortController();
  caller.abort();
  let starts = 0;
  const timer = manualTimer();
  const core = createPublicFreeQaLimiterCore({
    hmacSecret: SECRET,
    timer,
    transport() {
      starts += 1;
      return Promise.resolve(acceptedEnvelope);
    },
  });
  assert.deepEqual(
    await core.check({ canonicalTrustedAddress: ADDRESS, signal: caller.signal }),
    { kind: "unavailable", reason: "cancelled" },
  );
  assert.equal(starts, 0);
  assert.equal(timer.delay(), undefined);
});

test("caller abort while pending cancels and clears listeners", async () => {
  const { createPublicFreeQaLimiterCore } = await loadCore();
  const pending = deferred<unknown>();
  const caller = new AbortController();
  const timer = manualTimer();
  let seen: AbortSignal | undefined;
  const core = createPublicFreeQaLimiterCore({
    hmacSecret: SECRET,
    timer,
    transport(input) {
      seen = input.signal;
      return pending.promise;
    },
  });
  const checking = core.check({ canonicalTrustedAddress: ADDRESS, signal: caller.signal });
  assert.equal(getEventListeners(caller.signal, "abort").length, 1);
  assert.equal(seen?.aborted, false);
  caller.abort();
  assert.deepEqual(await checking, { kind: "unavailable", reason: "cancelled" });
  assert.equal(seen?.aborted, true);
  assert.equal(getEventListeners(caller.signal, "abort").length, 0);
  assert.equal(timer.cleared(), true);
  pending.resolve(acceptedEnvelope);
  await turn();
  assert.equal(seen?.aborted, true);
});

test("the 750 ms deadline wins while transport stays pending", async () => {
  const { createPublicFreeQaLimiterCore } = await loadCore();
  const caller = new AbortController();
  const timer = manualTimer();
  let seen: AbortSignal | undefined;
  const core = createPublicFreeQaLimiterCore({
    hmacSecret: SECRET,
    timer,
    transport(input) {
      seen = input.signal;
      return new Promise(() => {});
    },
  });
  const checking = core.check({ canonicalTrustedAddress: ADDRESS, signal: caller.signal });
  assert.equal(timer.delay(), 750);
  assert.equal(getEventListeners(caller.signal, "abort").length, 1);
  timer.fire();
  assert.deepEqual(await checking, { kind: "unavailable", reason: "timeout" });
  assert.equal(seen?.aborted, true);
  assert.equal(caller.signal.aborted, false);
  assert.equal(getEventListeners(caller.signal, "abort").length, 0);
  assert.equal(timer.cleared(), true);
});

test("a transport that ignores abort still lets the core settle on the deadline", async () => {
  const { createPublicFreeQaLimiterCore } = await loadCore();
  const timer = manualTimer();
  const core = createPublicFreeQaLimiterCore({
    hmacSecret: SECRET,
    timer,
    transport() {
      return new Promise(() => {});
    },
  });
  const checking = core.check({ canonicalTrustedAddress: ADDRESS });
  timer.fire();
  assert.deepEqual(await checking, { kind: "unavailable", reason: "timeout" });
});

test("late success after cancellation or timeout cannot become accepted", async () => {
  const { createPublicFreeQaLimiterCore } = await loadCore();
  const cases = ["cancelled", "timeout"] as const;
  for (const reason of cases) {
    const pending = deferred<unknown>();
    const caller = new AbortController();
    const timer = manualTimer();
    const core = createPublicFreeQaLimiterCore({
      hmacSecret: SECRET,
      timer,
      transport() {
        return pending.promise;
      },
    });
    const checking = core.check({ canonicalTrustedAddress: ADDRESS, signal: caller.signal });
    if (reason === "cancelled") caller.abort();
    else timer.fire();
    assert.deepEqual(await checking, { kind: "unavailable", reason });
    pending.resolve(acceptedEnvelope);
    await turn();
  }
});

test("late rejection after cancellation or timeout is observed", async () => {
  const unhandled: unknown[] = [];
  const onUnhandled = (reason: unknown) => {
    unhandled.push(reason);
  };
  process.on("unhandledRejection", onUnhandled);
  try {
    const { createPublicFreeQaLimiterCore } = await loadCore();
    for (const reason of ["cancelled", "timeout"] as const) {
      const pending = deferred<unknown>();
      const caller = new AbortController();
      const timer = manualTimer();
      const core = createPublicFreeQaLimiterCore({
        hmacSecret: SECRET,
        timer,
        transport() {
          return pending.promise;
        },
      });
      const checking = core.check({ canonicalTrustedAddress: ADDRESS, signal: caller.signal });
      if (reason === "cancelled") caller.abort();
      else timer.fire();
      assert.deepEqual(await checking, { kind: "unavailable", reason });
      pending.reject(new Error(`late ${ADDRESS}`));
      await turn();
    }
    assert.deepEqual(unhandled, []);
  } finally {
    process.off("unhandledRejection", onUnhandled);
  }
});

test("synchronous caller abort followed by rejection stays cancelled", async () => {
  const unhandled: unknown[] = [];
  const onUnhandled = (reason: unknown) => {
    unhandled.push(reason);
  };
  process.on("unhandledRejection", onUnhandled);
  try {
    const { createPublicFreeQaLimiterCore } = await loadCore();
    const caller = new AbortController();
    let starts = 0;
    const timer = manualTimer();
    const core = createPublicFreeQaLimiterCore({
      hmacSecret: SECRET,
      timer,
      transport(input) {
        starts += 1;
        caller.abort();
        assert.equal(input.signal.aborted, true);
        return Promise.reject(new Error(`synthetic transport failure ${ADDRESS}`));
      },
    });
    const result = await core.check({ canonicalTrustedAddress: ADDRESS, signal: caller.signal });
    await turn();
    assert.deepEqual(result, { kind: "unavailable", reason: "cancelled" });
    assert.equal(starts, 1);
    assert.equal(timer.cleared(), true);
    assert.equal(getEventListeners(caller.signal, "abort").length, 0);
    assert.deepEqual(unhandled, []);
    assertClosedResult(result, [ADDRESS, "synthetic"]);
  } finally {
    process.off("unhandledRejection", onUnhandled);
  }
});

test("synchronous caller abort followed by acceptance stays cancelled", async () => {
  const { createPublicFreeQaLimiterCore } = await loadCore();
  const caller = new AbortController();
  let starts = 0;
  const core = createPublicFreeQaLimiterCore({
    hmacSecret: SECRET,
    timer: manualTimer(),
    transport() {
      starts += 1;
      caller.abort();
      return Promise.resolve(acceptedEnvelope);
    },
  });
  assert.deepEqual(
    await core.check({ canonicalTrustedAddress: ADDRESS, signal: caller.signal }),
    { kind: "unavailable", reason: "cancelled" },
  );
  assert.equal(starts, 1);
  await turn();
});

test("a synchronous transport throw is transport_error", async () => {
  const { createPublicFreeQaLimiterCore } = await loadCore();
  const timer = manualTimer();
  const caller = new AbortController();
  const core = createPublicFreeQaLimiterCore({
    hmacSecret: SECRET,
    timer,
    transport() {
      throw new Error(`boom ${ADDRESS}`);
    },
  });
  const result = await core.check({ canonicalTrustedAddress: ADDRESS, signal: caller.signal });
  assert.deepEqual(result, { kind: "unavailable", reason: "transport_error" });
  assert.equal(timer.cleared(), true);
  assert.equal(getEventListeners(caller.signal, "abort").length, 0);
  assertClosedResult(result, [ADDRESS, "boom"]);
});

test("an ordinary asynchronous rejection is transport_error and clears listeners", async () => {
  const unhandled: unknown[] = [];
  const onUnhandled = (reason: unknown) => {
    unhandled.push(reason);
  };
  process.on("unhandledRejection", onUnhandled);
  try {
    const { createPublicFreeQaLimiterCore } = await loadCore();
    const caller = new AbortController();
    const timer = manualTimer();
    const core = createPublicFreeQaLimiterCore({
      hmacSecret: SECRET,
      timer,
      transport() {
        return Promise.reject(new Error("ordinary failure"));
      },
    });
    const result = await core.check({ canonicalTrustedAddress: ADDRESS, signal: caller.signal });
    await turn();
    assert.deepEqual(result, { kind: "unavailable", reason: "transport_error" });
    assert.equal(timer.cleared(), true);
    assert.equal(getEventListeners(caller.signal, "abort").length, 0);
    assert.deepEqual(unhandled, []);
  } finally {
    process.off("unhandledRejection", onUnhandled);
  }
});

test("successful completion clears the timer and caller listener", async () => {
  const { createPublicFreeQaLimiterCore } = await loadCore();
  const caller = new AbortController();
  const timer = manualTimer();
  const core = createPublicFreeQaLimiterCore({
    hmacSecret: SECRET,
    timer,
    transport() {
      return Promise.resolve(acceptedEnvelope);
    },
  });
  assert.deepEqual(
    await core.check({ canonicalTrustedAddress: ADDRESS, signal: caller.signal }),
    { kind: "accepted" },
  );
  assert.equal(timer.cleared(), true);
  assert.equal(getEventListeners(caller.signal, "abort").length, 0);
});

test("caller abort after a completed result does not change it", async () => {
  const { createPublicFreeQaLimiterCore } = await loadCore();
  const caller = new AbortController();
  let starts = 0;
  const core = createPublicFreeQaLimiterCore({
    hmacSecret: SECRET,
    timer: manualTimer(),
    transport() {
      starts += 1;
      return Promise.resolve(acceptedEnvelope);
    },
  });
  const result = await core.check({ canonicalTrustedAddress: ADDRESS, signal: caller.signal });
  caller.abort();
  await turn();
  assert.deepEqual(result, { kind: "accepted" });
  assert.equal(starts, 1);
});

test("concurrent checks do not share cancellation state", async () => {
  const { createPublicFreeQaLimiterCore } = await loadCore();
  const firstCaller = new AbortController();
  const secondCaller = new AbortController();
  const waiting: Array<{ signal: AbortSignal; pending: ReturnType<typeof deferred<unknown>> }> = [];
  const core = createPublicFreeQaLimiterCore({
    hmacSecret: SECRET,
    timer: manualTimer(),
    transport(input) {
      const pending = deferred<unknown>();
      waiting.push({ signal: input.signal, pending });
      return pending.promise;
    },
  });
  const first = core.check({ canonicalTrustedAddress: ADDRESS, signal: firstCaller.signal });
  const second = core.check({ canonicalTrustedAddress: ADDRESS, signal: secondCaller.signal });
  assert.equal(waiting.length, 2);
  assert.notEqual(waiting[0].signal, waiting[1].signal);
  firstCaller.abort();
  assert.deepEqual(await first, { kind: "unavailable", reason: "cancelled" });
  assert.equal(waiting[0].signal.aborted, true);
  assert.equal(waiting[1].signal.aborted, false);
  waiting[1].pending.resolve(acceptedEnvelope);
  assert.deepEqual(await second, { kind: "accepted" });
});

test("each valid attempt invokes transport once and uses its own digest", async () => {
  const { createPublicFreeQaLimiterCore } = await loadCore();
  const digests: Uint8Array[] = [];
  const signals: AbortSignal[] = [];
  let starts = 0;
  const core = createPublicFreeQaLimiterCore({
    hmacSecret: SECRET,
    timer: manualTimer(),
    transport(input) {
      starts += 1;
      digests.push(input.keyDigest);
      signals.push(input.signal);
      return Promise.resolve(acceptedEnvelope);
    },
  });
  await core.check({ canonicalTrustedAddress: ADDRESS });
  await core.check({ canonicalTrustedAddress: ADDRESS });
  assert.equal(starts, 2);
  assert.equal(digests.length, 2);
  assert.notEqual(digests[0], digests[1]);
  assert.deepEqual(digests[0], digests[1]);
  assert.notEqual(signals[0], signals[1]);
});

test("timeout remains the result when its abort synchronously cancels the caller", async () => {
  const { createPublicFreeQaLimiterCore } = await loadCore();
  const caller = new AbortController();
  const timer = manualTimer();
  const pending = deferred<unknown>();
  let starts = 0;
  let owned: AbortSignal | undefined;
  const core = createPublicFreeQaLimiterCore({
    hmacSecret: SECRET,
    timer,
    transport(input) {
      starts += 1;
      owned = input.signal;
      input.signal.addEventListener("abort", () => {
        caller.abort();
      });
      return pending.promise;
    },
  });
  const checking = core.check({ canonicalTrustedAddress: ADDRESS, signal: caller.signal });
  timer.fire();
  assert.deepEqual(await checking, { kind: "unavailable", reason: "timeout" });
  assert.equal(owned?.aborted, true);
  assert.equal(starts, 1);
  assert.equal(timer.cleared(), true);
  assert.equal(getEventListeners(caller.signal, "abort").length, 0);
});

test("caller cancellation remains the result when abort synchronously runs the deadline", async () => {
  const { createPublicFreeQaLimiterCore } = await loadCore();
  const caller = new AbortController();
  const timer = manualTimer();
  const pending = deferred<unknown>();
  let deadline: (() => void) | undefined;
  let deadlineRuns = 0;
  let starts = 0;
  const core = createPublicFreeQaLimiterCore({
    hmacSecret: SECRET,
    timer: {
      setTimeout(callback, delayMs) {
        deadline = callback;
        return timer.setTimeout(callback, delayMs);
      },
      clearTimeout(handle) {
        timer.clearTimeout(handle);
      },
    },
    transport(input) {
      starts += 1;
      input.signal.addEventListener("abort", () => {
        deadlineRuns += 1;
        const captured = deadline;
        assert.ok(captured);
        captured();
      });
      return pending.promise;
    },
  });
  const checking = core.check({ canonicalTrustedAddress: ADDRESS, signal: caller.signal });
  caller.abort();
  assert.deepEqual(await checking, { kind: "unavailable", reason: "cancelled" });
  assert.equal(deadlineRuns, 1);
  assert.equal(starts, 1);
  assert.equal(timer.clearCount(), 1);
  assert.equal(getEventListeners(caller.signal, "abort").length, 0);
  const captured = deadline;
  assert.ok(captured);
  captured();
  assert.equal(timer.clearCount(), 1);
});

test("late transport rejection after reentrant cancellation is observed", async () => {
  const unhandled: unknown[] = [];
  const onUnhandled = (reason: unknown) => {
    unhandled.push(reason);
  };
  process.on("unhandledRejection", onUnhandled);
  try {
    const { createPublicFreeQaLimiterCore } = await loadCore();
    for (const reason of ["timeout", "cancelled"] as const) {
      const caller = new AbortController();
      const timer = manualTimer();
      const pending = deferred<unknown>();
      let starts = 0;
      let deadline: (() => void) | undefined;
      const core = createPublicFreeQaLimiterCore({
        hmacSecret: SECRET,
        timer: {
          setTimeout(callback, delayMs) {
            deadline = callback;
            return timer.setTimeout(callback, delayMs);
          },
          clearTimeout(handle) {
            timer.clearTimeout(handle);
          },
        },
        transport(input) {
          starts += 1;
          input.signal.addEventListener("abort", () => {
            if (reason === "timeout") caller.abort();
            else deadline?.();
          });
          return pending.promise;
        },
      });
      const checking = core.check({ canonicalTrustedAddress: ADDRESS, signal: caller.signal });
      if (reason === "timeout") timer.fire();
      else caller.abort();
      const result = await checking;
      assert.deepEqual(result, { kind: "unavailable", reason });
      pending.reject(new Error(`late ${reason}`));
      await turn();
      assert.deepEqual(result, { kind: "unavailable", reason });
      assert.equal(starts, 1);
    }
    assert.deepEqual(unhandled, []);
  } finally {
    process.off("unhandledRejection", onUnhandled);
  }
});

test("late transport acceptance after reentrant cancellation stays unavailable", async () => {
  const { createPublicFreeQaLimiterCore } = await loadCore();
  for (const reason of ["timeout", "cancelled"] as const) {
    const caller = new AbortController();
    const timer = manualTimer();
    const pending = deferred<unknown>();
    let starts = 0;
    let deadline: (() => void) | undefined;
    const core = createPublicFreeQaLimiterCore({
      hmacSecret: SECRET,
      timer: {
        setTimeout(callback, delayMs) {
          deadline = callback;
          return timer.setTimeout(callback, delayMs);
        },
        clearTimeout(handle) {
          timer.clearTimeout(handle);
        },
      },
      transport(input) {
        starts += 1;
        input.signal.addEventListener("abort", () => {
          if (reason === "timeout") caller.abort();
          else deadline?.();
        });
        return pending.promise;
      },
    });
    const checking = core.check({ canonicalTrustedAddress: ADDRESS, signal: caller.signal });
    if (reason === "timeout") timer.fire();
    else caller.abort();
    const result = await checking;
    pending.resolve(acceptedEnvelope);
    await turn();
    assert.deepEqual(result, { kind: "unavailable", reason });
    assert.equal(starts, 1);
  }
});

test("a completed acceptance ignores later caller abort and a stale deadline", async () => {
  const { createPublicFreeQaLimiterCore } = await loadCore();
  const caller = new AbortController();
  const timer = manualTimer();
  let owned: AbortSignal | undefined;
  let deadline: (() => void) | undefined;
  const core = createPublicFreeQaLimiterCore({
    hmacSecret: SECRET,
    timer: {
      setTimeout(callback, delayMs) {
        deadline = callback;
        return timer.setTimeout(callback, delayMs);
      },
      clearTimeout(handle) {
        timer.clearTimeout(handle);
      },
    },
    transport(input) {
      owned = input.signal;
      return Promise.resolve(acceptedEnvelope);
    },
  });
  const result = await core.check({ canonicalTrustedAddress: ADDRESS, signal: caller.signal });
  assert.deepEqual(result, { kind: "accepted" });
  assert.equal(owned?.aborted, false);
  assert.equal(timer.clearCount(), 1);
  caller.abort();
  const captured = deadline;
  assert.ok(captured);
  captured();
  await turn();
  assert.deepEqual(result, { kind: "accepted" });
  assert.equal(owned?.aborted, false);
  assert.equal(timer.clearCount(), 1);
  assert.equal(getEventListeners(caller.signal, "abort").length, 0);
});

test("a deadline observed before transport starts does not call transport", async () => {
  const { createPublicFreeQaLimiterCore } = await loadCore();
  let starts = 0;
  let returnedHandle: unknown;
  let clearedHandle: unknown;
  const core = createPublicFreeQaLimiterCore({
    hmacSecret: SECRET,
    timer: {
      setTimeout(callback) {
        callback();
        returnedHandle = 1;
        return returnedHandle;
      },
      clearTimeout(handle) {
        clearedHandle = handle;
      },
    },
    transport() {
      starts += 1;
      return Promise.resolve(acceptedEnvelope);
    },
  });
  assert.deepEqual(
    await core.check({ canonicalTrustedAddress: ADDRESS }),
    { kind: "unavailable", reason: "timeout" },
  );
  assert.equal(starts, 0);
  assert.equal(clearedHandle, returnedHandle);
});

test("the default timer is cleared when transport completes early", async () => {
  const { createPublicFreeQaLimiterCore } = await loadCore();
  const before = process.getActiveResourcesInfo().filter((name) => name === "Timeout").length;
  const core = createPublicFreeQaLimiterCore({
    hmacSecret: SECRET,
    transport() {
      return Promise.resolve(acceptedEnvelope);
    },
  });
  assert.deepEqual(
    await core.check({ canonicalTrustedAddress: ADDRESS }),
    { kind: "accepted" },
  );
  await turn();
  const after = process.getActiveResourcesInfo().filter((name) => name === "Timeout").length;
  assert.equal(after, before);
});
