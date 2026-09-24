import "server-only";
import type { PublicFreeQaLimiterTransport } from "./public-free-qa-limiter-core";

/**
 * Exclusive-pool transport for one public Free-QA limiter.
 *
 * The injected pool must not be shared with another factory or subsystem.
 * This module does not construct pg.Pool, read a database URL, or open a
 * connection. A future real pool must use the same max and a finite checkout
 * timeout. poolMax here is only the admission contract.
 *
 * The core owns the 750 ms terminal result. This adapter bounds its own wait
 * and never chooses an HTTP status. A confirmed database COMMIT, delivery of
 * the envelope, and the core's selection are separate events.
 */

const CONFIGURATION_ERROR = "invalid_public_free_qa_limiter_transport_configuration";
const TRANSPORT_ERROR = "public_free_qa_limiter_transport_failed";

const ATTEMPT_MS = 750;
const CHECKOUT_MS = 100;
const ROLLBACK_MIN_MS = 50;

const BEGIN_SQL = "BEGIN ISOLATION LEVEL READ COMMITTED";
const LOCK_SQL = "SET LOCAL lock_timeout = '150ms'";
const STATEMENT_SQL = "SET LOCAL statement_timeout = '400ms'";
const AUTHORITY_SQL = "SELECT decision FROM abuse_control.decide_public_free_qa_attempt($1::bytea)";
const COMMIT_SQL = "COMMIT";
const ROLLBACK_SQL = "ROLLBACK";

export interface PublicFreeQaLimiterPoolClient {
  query(queryText: string, values?: readonly unknown[]): Promise<unknown>;
  release(err?: Error | boolean): void;
  on(event: "error", listener: (error: Error) => void): void;
  removeListener(event: "error", listener: (error: Error) => void): void;
}

export interface PublicFreeQaLimiterPool {
  connect(): Promise<PublicFreeQaLimiterPoolClient>;
}

export interface PublicFreeQaLimiterClock {
  now(): number;
}

export interface PublicFreeQaLimiterTimer {
  setTimeout(callback: () => void, delayMs: number): unknown;
  clearTimeout(handle: unknown): void;
}

const defaultClock: PublicFreeQaLimiterClock = {
  now() {
    return performance.now();
  },
};

const defaultTimer: PublicFreeQaLimiterTimer = {
  setTimeout(callback, delayMs) {
    return setTimeout(callback, delayMs);
  },
  clearTimeout(handle) {
    clearTimeout(handle as ReturnType<typeof setTimeout>);
  },
};

function invalidConfiguration(): never {
  throw new Error(CONFIGURATION_ERROR);
}

function isSafeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value);
}

function transportError(): Error {
  return new Error(TRANSPORT_ERROR);
}

function commandTag(result: unknown): string | undefined {
  if (result === null || typeof result !== "object" || Array.isArray(result)) return undefined;
  const descriptor = Object.getOwnPropertyDescriptor(result, "command");
  if (descriptor === undefined || !("value" in descriptor) || "get" in descriptor || "set" in descriptor) {
    return undefined;
  }
  return typeof descriptor.value === "string" ? descriptor.value : undefined;
}

function authorityDecision(result: unknown): "accepted" | "rejected" | undefined {
  if (result === null || typeof result !== "object" || Array.isArray(result)) return undefined;
  const rowsDescriptor = Object.getOwnPropertyDescriptor(result, "rows");
  if (
    rowsDescriptor === undefined
    || !("value" in rowsDescriptor)
    || "get" in rowsDescriptor
    || "set" in rowsDescriptor
    || !Array.isArray(rowsDescriptor.value)
    || Object.getPrototypeOf(rowsDescriptor.value) !== Array.prototype
  ) {
    return undefined;
  }
  const rows = rowsDescriptor.value;
  const rowKeys = Reflect.ownKeys(rows);
  if (rowKeys.length !== 2 || !rowKeys.includes("0") || !rowKeys.includes("length")) return undefined;
  const lengthDescriptor = Object.getOwnPropertyDescriptor(rows, "length");
  if (!lengthDescriptor || !("value" in lengthDescriptor) || lengthDescriptor.value !== 1) return undefined;
  const elementDescriptor = Object.getOwnPropertyDescriptor(rows, "0");
  if (
    !elementDescriptor
    || !("value" in elementDescriptor)
    || "get" in elementDescriptor
    || "set" in elementDescriptor
  ) {
    return undefined;
  }
  const row = elementDescriptor.value;
  if (row === null || typeof row !== "object" || Array.isArray(row)) return undefined;
  if (Object.getPrototypeOf(row) !== Object.prototype) return undefined;
  const names = Reflect.ownKeys(row);
  if (names.length !== 1 || names[0] !== "decision") return undefined;
  const decisionDescriptor = Object.getOwnPropertyDescriptor(row, "decision");
  if (
    !decisionDescriptor
    || !("value" in decisionDescriptor)
    || "get" in decisionDescriptor
    || "set" in decisionDescriptor
  ) {
    return undefined;
  }
  const decision = decisionDescriptor.value;
  if (decision === "accepted" || decision === "rejected") return decision;
  return undefined;
}

export function createPublicFreeQaLimiterTransport(options: {
  pool: PublicFreeQaLimiterPool;
  poolMax: number;
  queueBound: number;
  clock?: PublicFreeQaLimiterClock;
  timer?: PublicFreeQaLimiterTimer;
}): PublicFreeQaLimiterTransport {
  if (options === null || typeof options !== "object") invalidConfiguration();
  if (typeof options.pool?.connect !== "function") invalidConfiguration();
  if (!isSafeInteger(options.poolMax) || options.poolMax < 1) invalidConfiguration();
  if (!isSafeInteger(options.queueBound) || options.queueBound < 0) invalidConfiguration();
  if (options.poolMax > Number.MAX_SAFE_INTEGER - options.queueBound) invalidConfiguration();
  if (options.clock !== undefined) {
    if (options.clock === null || typeof options.clock.now !== "function") invalidConfiguration();
  }
  if (options.timer !== undefined) {
    if (
      options.timer === null
      || typeof options.timer.setTimeout !== "function"
      || typeof options.timer.clearTimeout !== "function"
    ) {
      invalidConfiguration();
    }
  }

  const pool = options.pool;
  const admissionLimit = options.poolMax + options.queueBound;
  const clock = options.clock ?? defaultClock;
  const timer = options.timer ?? defaultTimer;
  let unresolvedCheckouts = 0;
  let checkedOut = 0;

  return function transport(input) {
    if (!(input.keyDigest instanceof Uint8Array) || input.keyDigest.byteLength !== 32) {
      return Promise.reject(transportError());
    }
    if (!(input.signal instanceof AbortSignal)) return Promise.reject(transportError());
    if (input.signal.aborted) return Promise.reject(transportError());
    if (unresolvedCheckouts + checkedOut >= admissionLimit) return Promise.reject(transportError());

    const digest = new Uint8Array(input.keyDigest);
    unresolvedCheckouts += 1;

    return new Promise((resolve, reject) => {
      const startedAt = clock.now();
      let settled = false;
      let abandoned = false;
      let cancelWon = false;
      let client: PublicFreeQaLimiterPoolClient | undefined;
      let holdingClient = false;
      let slotClosed = false;
      let disposed = false;
      let sqlSubmitted = false;
      let commandInFlight = false;
      let openTransaction = false;
      let commitSent = false;
      let completionConfirmed = false;
      let clientBroken = false;
      let connectSubmitted = false;
      const attemptSlot = { handle: undefined as unknown, armed: false };
      const checkoutSlot = { handle: undefined as unknown, armed: false };
      const callerSignal = input.signal;
      const attemptDeadline = startedAt + ATTEMPT_MS;
      const checkoutDeadline = startedAt + CHECKOUT_MS;

      const remaining = () => ATTEMPT_MS - (clock.now() - startedAt);
      const attemptExpired = () => clock.now() >= attemptDeadline;
      const checkoutExpired = () => clock.now() >= checkoutDeadline;

      const clearSlot = (slot: { handle: unknown; armed: boolean }) => {
        if (!slot.armed) return;
        timer.clearTimeout(slot.handle);
        slot.armed = false;
        slot.handle = undefined;
      };

      const closeSlot = () => {
        if (slotClosed) return;
        slotClosed = true;
        if (holdingClient) checkedOut -= 1;
        else unresolvedCheckouts -= 1;
      };

      const takeClient = (next: PublicFreeQaLimiterPoolClient) => {
        if (holdingClient || slotClosed) return;
        unresolvedCheckouts -= 1;
        checkedOut += 1;
        holdingClient = true;
        client = next;
      };

      const detachCaller = () => {
        callerSignal.removeEventListener("abort", onTerminal);
      };

      const clearTimers = () => {
        clearSlot(attemptSlot);
        clearSlot(checkoutSlot);
      };

      const settleReject = () => {
        if (settled) return;
        settled = true;
        clearTimers();
        detachCaller();
        reject(transportError());
      };

      const settleResolve = (decision: "accepted" | "rejected") => {
        if (settled) return;
        settled = true;
        clearTimers();
        detachCaller();
        resolve({ rows: [{ decision }] });
      };

      const onClientError = () => {
        clientBroken = true;
        if (!cancelWon) {
          cancelWon = true;
          settleReject();
        }
        dispose("remove");
      };

      const dispose = (mode: "release" | "remove") => {
        if (disposed || client === undefined) return;
        disposed = true;
        const owned = client;
        client = undefined;
        owned.removeListener("error", onClientError);
        try {
          if (mode === "remove") owned.release(transportError());
          else owned.release();
          closeSlot();
        } catch {
          // Disposal is uncertain. Do not release again and do not free the slot.
        }
      };

      const onTerminal = () => {
        if (cancelWon || settled) return;
        cancelWon = true;
        settleReject();
        if (client === undefined) {
          abandoned = true;
          if (!connectSubmitted) closeSlot();
          return;
        }
        if (!sqlSubmitted) dispose("release");
        else if (!completionConfirmed) dispose("remove");
        else dispose("release");
      };

      const arm = (
        slot: { handle: unknown; armed: boolean },
        delayMs: number,
        callback: () => void,
      ): boolean => {
        slot.handle = timer.setTimeout(callback, delayMs);
        slot.armed = true;
        if (cancelWon || settled) {
          clearSlot(slot);
          return false;
        }
        return true;
      };

      callerSignal.addEventListener("abort", onTerminal);
      if (!arm(attemptSlot, ATTEMPT_MS, () => {
        onTerminal();
      })) {
        if (!connectSubmitted) closeSlot();
        return;
      }
      if (!arm(checkoutSlot, CHECKOUT_MS, () => {
        if (client === undefined && !slotClosed) onTerminal();
      })) {
        if (!connectSubmitted) closeSlot();
        return;
      }

      if (callerSignal.aborted || attemptExpired() || checkoutExpired()) {
        onTerminal();
        if (!connectSubmitted) closeSlot();
        return;
      }

      connectSubmitted = true;
      let started: unknown;
      try {
        started = pool.connect();
      } catch {
        closeSlot();
        settleReject();
        return;
      }
      if (!(started instanceof Promise)) {
        closeSlot();
        settleReject();
        return;
      }

      void started.then(
        (next) => {
          if (abandoned || cancelWon || settled) {
            if (next && typeof next.release === "function") {
              client = next;
              holdingClient = false;
              unresolvedCheckouts -= 1;
              checkedOut += 1;
              holdingClient = true;
              slotClosed = false;
              dispose("release");
            } else if (!slotClosed) {
              closeSlot();
            }
            return;
          }
          if (
            next === null
            || typeof next !== "object"
            || typeof next.query !== "function"
            || typeof next.release !== "function"
            || typeof next.on !== "function"
            || typeof next.removeListener !== "function"
          ) {
            closeSlot();
            settleReject();
            return;
          }
          takeClient(next);
          next.on("error", onClientError);
          clearSlot(checkoutSlot);
          if (cancelWon || settled) {
            if (!disposed) dispose("release");
            return;
          }
          if (checkoutExpired() || attemptExpired()) {
            onTerminal();
            return;
          }
          void runAttempt(next);
        },
        () => {
          if (!slotClosed && !holdingClient) closeSlot();
          if (!settled) settleReject();
        },
      );

      async function runQuery(
        owned: PublicFreeQaLimiterPoolClient,
        sql: string,
        tag: string,
        values?: readonly unknown[],
      ): Promise<unknown> {
        if (cancelWon || disposed || commandInFlight) throw transportError();
        if (attemptExpired()) {
          onTerminal();
          throw transportError();
        }
        commandInFlight = true;
        sqlSubmitted = true;
        if (sql === COMMIT_SQL) commitSent = true;
        let result: unknown;
        try {
          result = await owned.query(sql, values);
        } catch {
          commandInFlight = false;
          throw transportError();
        }
        commandInFlight = false;
        const tagMatches = commandTag(result) === tag;
        if (tagMatches && (tag === "COMMIT" || tag === "ROLLBACK")) {
          completionConfirmed = true;
          openTransaction = false;
        }
        if (cancelWon || disposed) throw transportError();
        if (!tagMatches) throw transportError();
        if (attemptExpired()) {
          onTerminal();
          throw transportError();
        }
        return result;
      }

      async function rollbackIfAllowed(owned: PublicFreeQaLimiterPoolClient): Promise<void> {
        if (
          cancelWon
          || disposed
          || commandInFlight
          || clientBroken
          || commitSent
          || !openTransaction
          || attemptExpired()
          || remaining() < ROLLBACK_MIN_MS
        ) {
          dispose("remove");
          return;
        }
        try {
          await runQuery(owned, ROLLBACK_SQL, "ROLLBACK");
        } catch {
          dispose("remove");
          return;
        }
        if (cancelWon || disposed) return;
        completionConfirmed = true;
        openTransaction = false;
        dispose("release");
      }

      async function runAttempt(owned: PublicFreeQaLimiterPoolClient): Promise<void> {
        try {
          await runQuery(owned, BEGIN_SQL, "BEGIN");
          openTransaction = true;
          await runQuery(owned, LOCK_SQL, "SET");
          await runQuery(owned, STATEMENT_SQL, "SET");
          const selected = await runQuery(owned, AUTHORITY_SQL, "SELECT", [digest]);
          const decision = authorityDecision(selected);
          if (decision === undefined) {
            await rollbackIfAllowed(owned);
            settleReject();
            return;
          }
          await runQuery(owned, COMMIT_SQL, "COMMIT");
          if (cancelWon || settled || attemptExpired()) {
            if (attemptExpired() && !cancelWon && !settled) onTerminal();
            else if (!disposed && completionConfirmed) dispose("release");
            return;
          }
          settleResolve(decision);
          dispose("release");
        } catch {
          if (!disposed) {
            if (completionConfirmed) dispose("release");
            else if (commitSent || cancelWon || commandInFlight || attemptExpired()) dispose("remove");
            else await rollbackIfAllowed(owned);
          }
          settleReject();
        }
      }
    });
  };
}
