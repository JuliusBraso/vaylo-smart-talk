import "server-only";
import { createHmac } from "node:crypto";

/**
 * Offline public Free-QA limiter core.
 *
 * The caller supplies an already canonical trusted address. This module does
 * not establish that trust, parse IP addresses, or apply a bucket policy.
 * Before route integration, the trusted-identity producer must enforce real
 * address validity and the approved canonicalization policy. The filter below
 * is only a representation bound: a primitive string of length 1–64 using
 * hexadecimal digits, colon, and dot. It does not trim, lowercase, normalize,
 * infer a subnet, or rewrite mapped IPv6.
 *
 * A synchronously blocking transport cannot be preempted. JavaScript timers
 * run only after that call returns to the event loop.
 */

const CONFIGURATION_ERROR = "invalid_public_free_qa_limiter_configuration";
const DEADLINE_MS = 750;
const HMAC_LABEL = "public_free_qa_v1|";
const ADDRESS_REPRESENTATION = /^[0-9a-fA-F:.]+$/;

export type PublicFreeQaLimitResult =
  | { kind: "accepted" }
  | { kind: "rejected" }
  | {
      kind: "unavailable";
      reason:
        | "invalid_input"
        | "cancelled"
        | "timeout"
        | "transport_error"
        | "invalid_response";
    };

export type PublicFreeQaLimiterTransportInput = {
  keyDigest: Uint8Array;
  signal: AbortSignal;
};

export type PublicFreeQaLimiterTransport = (
  input: PublicFreeQaLimiterTransportInput,
) => Promise<unknown>;

export type PublicFreeQaLimiterTimer = {
  setTimeout(callback: () => void, delayMs: number): unknown;
  clearTimeout(handle: unknown): void;
};

export type PublicFreeQaLimiterCore = {
  check(input: {
    canonicalTrustedAddress: string;
    signal?: AbortSignal;
  }): Promise<PublicFreeQaLimitResult>;
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

function unavailable(
  reason: Extract<PublicFreeQaLimitResult, { kind: "unavailable" }>["reason"],
): PublicFreeQaLimitResult {
  return { kind: "unavailable", reason };
}

function isRepresentableAddress(value: unknown): value is string {
  return typeof value === "string"
    && value.length >= 1
    && value.length <= 64
    && ADDRESS_REPRESENTATION.test(value);
}

function digestFor(secret: Uint8Array, address: string): Uint8Array {
  return new Uint8Array(
    createHmac("sha256", secret).update(`${HMAC_LABEL}${address}`, "utf8").digest(),
  );
}

function dataValue(descriptor: PropertyDescriptor | undefined): unknown {
  if (descriptor === undefined || !("value" in descriptor)) return undefined;
  if ("get" in descriptor || "set" in descriptor) return undefined;
  return descriptor.value;
}

function decisionFromRow(value: unknown): "accepted" | "rejected" | undefined {
  if (value === null || typeof value !== "object") return undefined;
  if (Object.getPrototypeOf(value) !== Object.prototype) return undefined;
  const names = Reflect.ownKeys(value);
  if (names.length !== 1 || names[0] !== "decision") return undefined;
  const decision = dataValue(Object.getOwnPropertyDescriptor(value, "decision"));
  if (decision === "accepted" || decision === "rejected") return decision;
  return undefined;
}

function interpretTransportValue(value: unknown): PublicFreeQaLimitResult {
  if (value === null || typeof value !== "object") return unavailable("invalid_response");
  if (Object.getPrototypeOf(value) !== Object.prototype) return unavailable("invalid_response");
  const names = Reflect.ownKeys(value);
  if (names.length !== 1 || names[0] !== "rows") return unavailable("invalid_response");
  const rows = dataValue(Object.getOwnPropertyDescriptor(value, "rows"));
  if (!Array.isArray(rows) || Object.getPrototypeOf(rows) !== Array.prototype) {
    return unavailable("invalid_response");
  }
  const rowKeys = Reflect.ownKeys(rows);
  if (rowKeys.length !== 2 || !rowKeys.includes("length") || !rowKeys.includes("0")) {
    return unavailable("invalid_response");
  }
  if (dataValue(Object.getOwnPropertyDescriptor(rows, "length")) !== 1) {
    return unavailable("invalid_response");
  }
  const decision = decisionFromRow(dataValue(Object.getOwnPropertyDescriptor(rows, "0")));
  if (decision === undefined) return unavailable("invalid_response");
  return { kind: decision };
}

export function createPublicFreeQaLimiterCore(options: {
  hmacSecret: Uint8Array;
  transport: PublicFreeQaLimiterTransport;
  timer?: PublicFreeQaLimiterTimer;
}): PublicFreeQaLimiterCore {
  if (options === null || typeof options !== "object") invalidConfiguration();
  if (!(options.hmacSecret instanceof Uint8Array) || options.hmacSecret.byteLength < 32) {
    invalidConfiguration();
  }
  if (typeof options.transport !== "function") invalidConfiguration();
  if (options.timer !== undefined) {
    if (
      options.timer === null
      || typeof options.timer !== "object"
      || typeof options.timer.setTimeout !== "function"
      || typeof options.timer.clearTimeout !== "function"
    ) {
      invalidConfiguration();
    }
  }

  const secret = new Uint8Array(options.hmacSecret);
  const transport = options.transport;
  const timer = options.timer ?? defaultTimer;

  return {
    check(input) {
      return checkWith(secret, transport, timer, input);
    },
  };
}

function checkWith(
  secret: Uint8Array,
  transport: PublicFreeQaLimiterTransport,
  timer: PublicFreeQaLimiterTimer,
  input: { canonicalTrustedAddress: string; signal?: AbortSignal },
): Promise<PublicFreeQaLimitResult> {
  if (!isRepresentableAddress(input?.canonicalTrustedAddress)) {
    return Promise.resolve(unavailable("invalid_input"));
  }
  const callerSignal = input.signal;
  if (callerSignal !== undefined && !(callerSignal instanceof AbortSignal)) {
    return Promise.resolve(unavailable("invalid_input"));
  }
  if (callerSignal?.aborted) return Promise.resolve(unavailable("cancelled"));

  const controller = new AbortController();
  const keyDigest = digestFor(secret, input.canonicalTrustedAddress);

  return new Promise((resolve) => {
    let selected = false;
    let timerHandle: unknown;
    let detachCaller = (): void => {};

    const clearOwnedTimer = () => {
      if (timerHandle === undefined) return;
      const handle = timerHandle;
      timerHandle = undefined;
      timer.clearTimeout(handle);
    };

    const abortOwned = () => {
      if (controller.signal.aborted) return;
      controller.abort();
    };

    const select = (result: PublicFreeQaLimitResult) => {
      if (selected) return;
      selected = true;
      if (
        result.kind === "unavailable"
        && (result.reason === "cancelled" || result.reason === "timeout")
      ) {
        abortOwned();
      }
      clearOwnedTimer();
      detachCaller();
      resolve(result);
    };

    const onCallerAbort = () => {
      select(unavailable("cancelled"));
    };

    if (callerSignal) {
      callerSignal.addEventListener("abort", onCallerAbort);
      detachCaller = () => {
        callerSignal.removeEventListener("abort", onCallerAbort);
        detachCaller = () => {};
      };
    }

    timerHandle = timer.setTimeout(() => {
      select(unavailable("timeout"));
    }, DEADLINE_MS);
    if (selected) {
      clearOwnedTimer();
      return;
    }
    if (callerSignal?.aborted) {
      onCallerAbort();
      return;
    }

    let started: unknown;
    try {
      started = transport({ keyDigest, signal: controller.signal });
    } catch {
      if (!selected) select(unavailable("transport_error"));
      return;
    }

    if (!(started instanceof Promise)) {
      if (!selected) select(unavailable("transport_error"));
      return;
    }

    void started.then(
      (value) => {
        if (selected) return;
        try {
          select(interpretTransportValue(value));
        } catch {
          select(unavailable("invalid_response"));
        }
      },
      () => {
        if (!selected) select(unavailable("transport_error"));
      },
    );

    if (callerSignal?.aborted) onCallerAbort();
  });
}
